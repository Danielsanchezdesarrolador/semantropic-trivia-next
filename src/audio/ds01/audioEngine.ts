import { families, filenames, soundEvents, soundFilename, type SoundEvent, type Variant } from './catalog';

export interface SampleInfo { name: string; sha256: string; seconds: number; origin: string; license: string }
const key = 'semantropic.ds01.preferences.v1';

/** No URLs, network, asset imports, storage of files or generated fallback audio. */
export class DS01AudioEngine {
  private context?: AudioContext;
  private bus?: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private voices = new Set<AudioBufferSourceNode>();
  private listeners = new Set<() => void>();
  private enabled = false;
  private revision = 0;
  private lastButton = -Infinity;
  private importGeneration = 0;
  volume = 0.5;
  message = 'Audio no cargado';
  samples: SampleInfo[] = [];
  variants: Record<SoundEvent, Variant> = { button: 'A', selection: 'A', correct: 'A', incorrect: 'A', timeout: 'A' };

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (typeof saved?.volume === 'number' && Number.isFinite(saved.volume)) this.volume = Math.max(0, Math.min(1, saved.volume));
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
    }
    return this.context;
  }
  async enable() {
    try {
      await this.init().resume();
      this.enabled = this.context?.state === 'running';
      this.message = this.enabled ? 'Efectos activados para QA local' : 'El navegador bloqueó el audio; reintenta activar';
    } catch { this.enabled = false; this.message = 'No se pudo activar el audio; puedes reintentarlo'; }
    this.notify();
  }
  mute() { this.enabled = false; this.stop(); this.notify(); }
  async resumeIfEnabled() {
    if (!this.enabled || !this.context || document.hidden) return;
    try { if (this.context.state === 'suspended') await this.context.resume(); }
    catch { this.message = 'El navegador requiere reactivar DS-01'; this.enabled = false; this.notify(); }
  }
  stop() {
    this.voices.forEach(voice => { try { voice.stop(); } catch { /* Already stopped. */ } voice.disconnect(); });
    this.voices.clear();
  }
  setVolume(volume: number) {
    if (!Number.isFinite(volume)) return;
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bus && this.context) this.bus.gain.setTargetAtTime(this.volume * 0.65, this.context.currentTime, 0.015);
    if (!this.volume) this.stop();
    try { localStorage.setItem(key, JSON.stringify({ volume: this.volume })); } catch { /* Optional. */ }
    this.notify();
  }
  setVariant(id: SoundEvent, variant: Variant) {
    soundFilename(id, variant); // Validate B is the last selection/timeout variant.
    this.variants = { ...this.variants, [id]: variant }; this.notify();
  }
  async importFiles(files: readonly File[]) {
    const generation = ++this.importGeneration;
    const ctx = this.init(); // Decode only; no resume or playback on import.
    const notes: string[] = [];
    for (const file of files) {
      if (!filenames.includes(file.name) || file.size > 5_000_000) { notes.push(`Ignorado: ${file.name}`); continue; }
      try {
        const bytes = await file.arrayBuffer();
        const hash = crypto.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
          .map(value => value.toString(16).padStart(2, '0')).join('') : 'no disponible en HTTP sin WebCrypto';
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
  play(events: readonly SoundEvent[]) {
    if (!this.active || !this.volume || document.hidden || !this.context || !this.bus) return;
    let offset = 0;
    for (const event of events) {
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
export const ds01Audio = new DS01AudioEngine();
export { soundEvents, families };
