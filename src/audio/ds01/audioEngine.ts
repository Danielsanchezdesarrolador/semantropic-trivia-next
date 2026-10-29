import { families, filenames, soundEvents, soundFilename, type SoundEvent, type Variant } from './catalog';
import type { ApprovedCode } from '../sfx02/policy';

export interface SampleInfo { name: string; sha256: string; seconds: number; origin: string; license: string }
const key = 'semantropic.ds01.preferences.v1';

/** Buffers remain in memory; the separate dev-only loader verifies local endpoints. */
export class DS01AudioEngine {
  private context?: AudioContext;
  private bus?: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private voices = new Set<AudioBufferSourceNode>();
  private listeners = new Set<() => void>();
  private enabled = false;
  private wanted = true;
  private enabling?: Promise<void>;
  private revision = 0;
  private lastButton = -Infinity;
  private importGeneration = 0;
  officialMode = false;
  laboratoryMode = false;
  private approved = new Map<ApprovedCode, AudioBuffer>();
  private clockBus?: GainNode;
  private clockVoice?: AudioBufferSourceNode;
  private clockOffset = 0;
  private priorityVoices = new Set<AudioBufferSourceNode>();
  priorityChanged?: (active: boolean) => void;
  clockVolume = .3;
  clockEnabled = true;
  officialMessage = 'Audio SFX-02 no cargado';
  volume = 0.5;
  message = 'Audio no cargado';
  samples: SampleInfo[] = [];
  variants: Record<SoundEvent, Variant> = { button: 'A', selection: 'A', correct: 'A', incorrect: 'A', timeout: 'A' };

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (typeof saved?.volume === 'number' && Number.isFinite(saved.volume)) this.volume = Math.max(0, Math.min(1, saved.volume));
      if (saved?.enabled === false) this.wanted = false;
      const clock = JSON.parse(localStorage.getItem('semantropic.clock.v1') ?? 'null');
      if (typeof clock?.volume === 'number' && Number.isFinite(clock.volume)) this.clockVolume = Math.min(1, Math.max(0, clock.volume));
      if (clock?.enabled === false) this.clockEnabled = false;
    } catch { /* localStorage is optional. Consent is never restored automatically. */ }
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  snapshot = () => this.revision;
  private notify() { this.revision++; this.listeners.forEach(fn => fn()); }
  get active() { return this.enabled && this.context?.state === 'running'; }
  private init() {
    if (!this.context) {
      this.context = new AudioContext();
      this.bus = this.context.createGain();
      this.bus.gain.value = this.volume * 0.65;
      this.bus.connect(this.context.destination);
      this.clockBus = this.context.createGain();
      this.clockBus.gain.value = this.clockVolume * .5;
      this.clockBus.connect(this.context.destination);
    }
    return this.context;
  }
  private save() {
    try { localStorage.setItem(key, JSON.stringify({ volume: this.volume, enabled: this.wanted })); } catch { /* Optional. */ }
  }
  enable() {
    if (this.enabling) return this.enabling;
    this.wanted = true; this.save();
    try {
      const resumed = this.init().resume(); // Called synchronously inside a real gesture.
      this.enabling = resumed.then(() => {
        this.enabled = this.wanted && this.context?.state === 'running';
      }).catch(() => { this.enabled = false; this.message = 'No se pudo activar el audio; puedes reintentarlo'; })
        .finally(() => { this.enabling = undefined; this.notify(); });
    } catch { this.enabled = false; this.message = 'No se pudo activar el audio; puedes reintentarlo'; this.notify(); }
    return this.enabling ?? Promise.resolve();
  }
  interaction() {
    if (this.wanted && !this.active) return this.enable();
    if (!this.wanted && this.clockEnabled) {
      try { return this.init().resume().catch(() => {}); } catch { /* Unsupported context. */ }
    }
    return Promise.resolve();
  }
  mute() { this.wanted = false; this.enabled = false; this.stop(); this.save(); this.notify(); }
  async resumeIfEnabled() {
    if (this.enabling) await this.enabling;
    if (!this.enabled || !this.context || document.hidden) return;
    try { if (this.context.state === 'suspended') await this.context.resume(); }
    catch { this.message = 'El navegador requiere reactivar DS-01'; this.enabled = false; this.notify(); }
  }
  stop() {
    this.voices.forEach(voice => { try { voice.stop(); } catch { /* Already stopped. */ } voice.disconnect(); });
    this.voices.clear();
    this.priorityVoices.clear(); this.priorityChanged?.(false);
  }
  stopClock() {
    if (this.clockVoice) { try { this.clockVoice.stop(); } catch { /* Ended. */ } this.clockVoice.disconnect(); this.clockVoice = undefined; }
  }
  setClock(volume: number, enabled = this.clockEnabled) {
    if (!Number.isFinite(volume)) return;
    this.clockVolume = Math.min(1, Math.max(0, volume)); this.clockEnabled = enabled;
    if (this.clockBus && this.context) this.clockBus.gain.setTargetAtTime(this.clockVolume * .5, this.context.currentTime, .015);
    if (!enabled || !volume) this.stopClock();
    try { localStorage.setItem('semantropic.clock.v1', JSON.stringify({ volume: this.clockVolume, enabled })); } catch { /* Optional. */ }
    this.notify();
  }
  setLaboratory(value: boolean) { this.stop(); this.laboratoryMode = value; this.notify(); }
  beginOfficial() { this.stop(); this.officialMode = true; this.laboratoryMode = false; this.notify(); }
  officialStatus(message: string) { this.officialMessage = message; this.notify(); }
  async importApproved(code: ApprovedCode, bytes: ArrayBuffer) {
    if (!import.meta.env.DEV) return;
    const buffer = await this.init().decodeAudioData(bytes);
    if (code !== 'L7' && code !== 'C') this.approved.set(code, buffer);
    if (code === 'CLK') {
      // Find the first audible tick in the unchanged 2 s recording. Play a short
      // slice at original rate rather than overlapping complete tick-tock clips.
      const data = buffer.getChannelData(0);
      const start = data.findIndex(value => Math.abs(value) > .015);
      this.clockOffset = Math.max(0, start / buffer.sampleRate - .003);
    }
    this.notify();
    return { seconds: buffer.duration, channels: buffer.numberOfChannels, clockOffset: code === 'CLK' ? this.clockOffset : undefined };
  }
  hasApproved(code: ApprovedCode) { return this.approved.has(code); }
  navigation(code: 'M1' | 'V1') {
    if (this.officialMode && !this.laboratoryMode) this.playApproved(code);
    else this.play(['button']);
  }
  playApproved(code: ApprovedCode, preview = false) {
    if (!import.meta.env.DEV || document.hidden || !this.context || this.context.state !== 'running') return;
    const clock = code === 'CLK';
    if (clock && this.laboratoryMode) return;
    if (clock ? !this.clockEnabled || !this.clockVolume : !this.active || !this.volume) return;
    const buffer = this.approved.get(code);
    if (!buffer) return;
    const priority = ['A1', 'X3', 'W1', 'D2'].includes(code);
    if (preview || priority) this.stop();
    else if (!clock && this.priorityVoices.size) return;
    else if (code === 'M1' || code === 'V1') this.stop();
    if (clock) this.stopClock();
    const voice = this.context.createBufferSource(); voice.buffer = buffer;
    voice.connect(clock ? this.clockBus! : this.bus!);
    if (clock) this.clockVoice = voice; else this.voices.add(voice);
    if (priority) { this.priorityVoices.add(voice); this.priorityChanged?.(true); }
    voice.onended = () => {
      voice.disconnect(); this.voices.delete(voice); this.priorityVoices.delete(voice);
      if (this.clockVoice === voice) this.clockVoice = undefined;
      if (!this.priorityVoices.size) this.priorityChanged?.(false);
    };
    if (clock) voice.start(this.context.currentTime, this.clockOffset, Math.min(.14, buffer.duration - this.clockOffset));
    else voice.start();
  }
  setVolume(volume: number) {
    if (!Number.isFinite(volume)) return;
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bus && this.context) this.bus.gain.setTargetAtTime(this.volume * 0.65, this.context.currentTime, 0.015);
    if (!this.volume) this.stop();
    this.save();
    this.notify();
  }
  setVariant(id: SoundEvent, variant: Variant) {
    soundFilename(id, variant); // Validate B is the last selection/timeout variant.
    this.variants = { ...this.variants, [id]: variant }; this.notify();
  }
  async importFiles(files: readonly File[], verifiedHashes?: ReadonlyMap<string, string>) {
    if (!import.meta.env.DEV) return; // File decoder is a private QA tool, never production.
    const generation = ++this.importGeneration;
    const ctx = this.init(); // Decode only; no resume or playback on import.
    const notes: string[] = [];
    for (const file of files) {
      if (!filenames.includes(file.name) || file.size > 5_000_000) { notes.push(`Ignorado: ${file.name}`); continue; }
      try {
        const bytes = await file.arrayBuffer();
        const hash = verifiedHashes?.get(file.name) ?? (crypto.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
          .map(value => value.toString(16).padStart(2, '0')).join('') : 'no disponible en HTTP sin WebCrypto');
        const buffer = await ctx.decodeAudioData(bytes);
        if (generation !== this.importGeneration) return;
        if (buffer.duration > 3 || buffer.duration <= 0) throw Error('Duración inesperada');
        this.buffers.set(file.name, buffer);
        this.samples = [...this.samples.filter(sample => sample.name !== file.name), {
          name: file.name, sha256: hash, seconds: buffer.duration,
          origin: 'TimGM6mb.sf2 / MIDI / FluidSynth; no Foley humano',
          license: 'GPL-2 de la fuente; derivados pendientes de revisión; SOLO QA LOCAL',
        }];
      } catch { notes.push(`No se pudo decodificar: ${file.name}`); }
    }
    this.message = `${this.samples.length}/13 muestras cargadas. ${notes.join('; ')}`;
    this.notify();
  }
  clear() {
    this.importGeneration++; this.stop(); this.buffers.clear(); this.samples = [];
    this.message = 'Audio no cargado'; this.notify();
  }
  loadStatus(message: string) { this.message = message; this.notify(); }
  play(events: readonly SoundEvent[]) {
    if (!this.active || !this.volume || document.hidden || !this.context || !this.bus) return;
    let offset = 0;
    for (const event of events) {
      if (this.officialMode && !this.laboratoryMode) {
        if (event === 'correct') { this.playApproved('A1'); continue; }
        if (event === 'incorrect') { this.playApproved('X3'); continue; }
        if (event === 'button' || event === 'selection') continue;
      }
      if (event === 'button') {
        if (performance.now() - this.lastButton < 90) continue;
        this.lastButton = performance.now();
        // Never interrupt resolution feedback for a navigation tap.
        if (this.voices.size >= 3) continue;
      }
      const buffer = this.buffers.get(soundFilename(event, this.variants[event]));
      if (!buffer) continue;
      if (this.voices.size >= 4) this.stop(); // Essential resolution wins over previous tails.
      const voice = this.context.createBufferSource();
      voice.buffer = buffer; voice.connect(this.bus);
      this.voices.add(voice);
      voice.onended = () => { voice.disconnect(); this.voices.delete(voice); };
      voice.start(this.context.currentTime + offset);
      if (event === 'selection') offset += 0.12; // Intentional separation, no delay of visual feedback.
    }
  }
  missing() { return filenames.filter(name => !this.buffers.has(name)); }
  available(id: SoundEvent) { return this.buffers.has(soundFilename(id, this.variants[id])); }
}
const previous = import.meta.hot?.data.engine;
const compatible = previous && typeof previous.importApproved === 'function';
if (previous && !compatible && import.meta.hot) {
  previous.stop?.();
  void previous.context?.close().catch(() => {});
  import.meta.hot.invalidate('Actualización del motor SFX-02: recargar sin duplicar contextos');
}
export const ds01Audio: DS01AudioEngine = compatible ? previous : new DS01AudioEngine();
if (import.meta.hot) {
  Object.setPrototypeOf(ds01Audio, DS01AudioEngine.prototype);
  import.meta.hot.data.engine = ds01Audio;
}
export { soundEvents, families };
