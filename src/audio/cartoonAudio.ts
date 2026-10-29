import { safeEffectsVolume } from './cartoonPolicy';

// HF1 retira Colección como disparador. Conservar el original privado y el motor,
// sin incluir MP3 ni activar otro evento hasta una asignación autorizada.
const source = '';
const expectedHash = '54a2f8b4f7b984a4ae76ef37ae8a4110bb76a36232edd6a8f1511bbe528023ed';
const preferenceKey = 'semantropic.cartoon-effects.v1';

class CartoonAudio {
  readonly available = Boolean(source);
  enabled = false;
  volume = 0.4;
  private consentThisSession = false;
  private context?: AudioContext;
  private gain?: GainNode;
  private buffer?: AudioBuffer;
  private loading?: Promise<AudioBuffer>;
  private voice?: AudioBufferSourceNode;
  private generation = 0;
  private lastOpening = -Infinity;

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) ?? 'null');
      this.enabled = saved?.enabled === true;
      this.volume = safeEffectsVolume(saved?.volume);
    } catch { /* Preferencias opcionales, incluso con almacenamiento bloqueado. */ }
  }

  private save() {
    try { localStorage.setItem(preferenceKey, JSON.stringify({ enabled: this.enabled, volume: this.volume })); }
    catch { /* El juego sigue funcionando sin persistencia. */ }
  }

  private unlock() {
    this.context ??= new AudioContext();
    if (!this.gain) {
      this.gain = this.context.createGain();
      this.gain.connect(this.context.destination);
    }
    this.gain.gain.value = this.volume * 0.5;
    return this.context.resume();
  }

  async enable() {
    if (!this.available) return false;
    try {
      await this.unlock(); // Se invoca desde click explícito, antes de cualquier carga.
      this.consentThisSession = this.context?.state === 'running';
      this.enabled = this.consentThisSession;
      this.save();
      return this.enabled;
    } catch {
      this.consentThisSession = false;
      this.enabled = false;
      this.save();
      return false;
    }
  }

  disable() {
    this.enabled = false;
    this.consentThisSession = false;
    this.stop();
    this.save();
  }

  setVolume(value: number) {
    this.volume = safeEffectsVolume(value);
    if (this.gain && this.context) this.gain.gain.setValueAtTime(this.volume * 0.5, this.context.currentTime);
    if (this.volume === 0) this.stop();
    this.save();
  }

  stop() {
    this.generation++;
    if (this.voice) {
      try { this.voice.stop(); } catch { /* Ya finalizada. */ }
      this.voice.disconnect();
      this.voice = undefined;
    }
  }

  hide() {
    this.stop();
    this.consentThisSession = false;
    void this.context?.suspend().catch(() => {});
  }

  private async load() {
    if (this.buffer) return this.buffer;
    this.loading ??= (async () => {
      const response = await fetch(source);
      if (!response.ok) throw Error('Audio no disponible');
      const bytes = await response.arrayBuffer();
      // La importación verifica siempre SHA-256. WebCrypto añade una segunda
      // verificación cuando existe (localhost/HTTPS); HTTP por Wi-Fi puede carecer de subtle.
      if (crypto.subtle) {
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
          .map(value => value.toString(16).padStart(2, '0')).join('');
        if (hash !== expectedHash) throw Error('Original de audio no verificado');
      }
      this.buffer = await this.context!.decodeAudioData(bytes);
      return this.buffer;
    })();
    return this.loading;
  }

  async openCollection() {
    if (!this.available || !this.enabled || !this.consentThisSession || this.volume === 0
      || document.hidden || this.context?.state !== 'running') return;
    const now = performance.now();
    // Un efecto de 2,56 s no debe repetirse en cascada al explorar menús.
    if (now - this.lastOpening < 4000) return;
    this.lastOpening = now;
    this.stop();
    const generation = this.generation;
    const requestedAt = performance.now();
    try {
      const buffer = await this.load();
      if (generation !== this.generation || document.hidden || !this.enabled
        || performance.now() - requestedAt > 800 || this.context?.state !== 'running') return;
      const voice = this.context.createBufferSource();
      voice.buffer = buffer;
      voice.connect(this.gain!);
      voice.onended = () => { voice.disconnect(); if (this.voice === voice) this.voice = undefined; };
      this.voice = voice;
      voice.start();
    } catch {
      // Fallo de red/hash/decode: silencio, sin reintentos automáticos ni error de juego.
    }
  }

  get active() { return this.enabled && this.consentThisSession; }
}

export const cartoonAudio = new CartoonAudio();
