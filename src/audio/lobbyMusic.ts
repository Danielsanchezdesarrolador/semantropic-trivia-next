const expectedName = '18_lobby_pop_familiar.mp3';
const expectedHash = 'e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707';
// SFX-02: 18_lobby_pop_familiar is historical; no longer assigned to playback.
const devSource: string | undefined = undefined;

/** HF3: verified original automatically assigned ONLY in Vite dev.
 * Singleton survives menus; production assignment stays blocked by rights review. */
export class LobbyMusic {
  private audio?: HTMLAudioElement;
  private objectUrl?: string;
  private revision = 0;
  private epoch = 0;
  private listeners = new Set<() => void>();
  private inLobby = true;
  private ducked = false;
  enabled = true;
  volume: number;
  message = 'Música: pendiente de autorización de publicación. Carga local disponible en QA.';
  filename = '';
  constructor(private storageKey = 'semantropic.lobby-music.v1', initialVolume = .25) {
    this.volume = initialVolume;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (typeof saved?.volume === 'number' && Number.isFinite(saved.volume)) this.volume = Math.min(1, Math.max(0, saved.volume));
      if (saved?.enabled === false) this.enabled = false;
    } catch { /* Optional preferences, never stored files or automatic consent. */ }
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  snapshot = () => this.revision;
  private notify() { this.revision++; this.listeners.forEach(fn => fn()); }
  get available() { return Boolean(this.audio); }
  get playing() { return this.enabled && Boolean(this.audio && !this.audio.paused); }
  private save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify({ volume: this.volume, enabled: this.enabled })); }
    catch { /* Optional preferences. */ }
  }
  prepareDev() {
    if (!devSource || this.audio) return;
    this.audio = new Audio(devSource);
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
    this.filename = expectedName;
    this.message = 'Música oficial disponible en desarrollo';
    this.notify();
    void this.sync();
  }
  interaction() {
    if (this.enabled && this.audio?.paused && this.inLobby && !document.hidden) void this.sync();
  }
  assignVerified(blob: Blob, filename: string) {
    if (!import.meta.env.DEV) return;
    this.clear();
    this.objectUrl = URL.createObjectURL(blob);
    this.audio = new Audio(this.objectUrl);
    this.audio.loop = true;
    this.audio.volume = this.volume * (this.ducked ? .35 : 1);
    this.audio.preload = 'auto';
    this.filename = filename;
    this.message = 'Pista oficial verificada · preview local';
    this.notify();
    void this.sync();
  }
  setDucked(value: boolean) {
    this.ducked = value;
    if (this.audio) this.audio.volume = this.volume * (value ? .35 : 1);
  }
  async load(file: File) {
    if (!import.meta.env.DEV) return;
    if (file.name !== expectedName) { this.message = `Se requiere exactamente ${expectedName}`; this.notify(); return; }
    const request = ++this.epoch;
    try {
      if (!crypto.subtle) throw Error('Carga verificable requiere localhost o HTTPS');
      const bytes = await file.arrayBuffer();
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
        .map(value => value.toString(16).padStart(2, '0')).join('');
      if (hash !== expectedHash) throw Error('SHA-256 no coincide con la pista aprobada');
      if (request !== this.epoch) return;
      this.clear();
      this.objectUrl = URL.createObjectURL(file);
      this.audio = new Audio(this.objectUrl);
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = 'metadata';
      this.filename = file.name;
      this.message = 'Pista exacta verificada. Solo QA local; activa música para escuchar.';
      this.notify();
    } catch (error) { this.message = error instanceof Error ? error.message : 'No se pudo cargar la pista'; this.notify(); }
  }
  async enable() {
    if (!this.audio) return;
    this.enabled = true;
    this.save();
    await this.sync();
  }
  disable() { this.enabled = false; this.save(); void this.sync(); }
  setLobby(value: boolean) {
    if (value === this.inLobby) return; // Menus preserve player, time and play() promise.
    this.inLobby = value;
    void this.sync();
  }
  visibility() { void this.sync(); }
  private async sync() {
    const request = ++this.epoch;
    const audio = this.audio;
    if (!audio) return;
    if (!this.enabled || !this.inLobby || document.hidden) { audio.pause(); this.notify(); return; }
    try {
      await audio.play();
      if (request !== this.epoch) {
        if (!this.enabled || !this.inLobby || document.hidden) audio.pause();
        return;
      }
      this.message = 'Música del lobby activa · QA local';
    } catch {
      if (request !== this.epoch) return;
      this.message = 'El navegador requiere una interacción para iniciar la música. Puedes activar música.';
    }
    this.notify();
  }
  setVolume(value: number) {
    if (!Number.isFinite(value)) return;
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audio) this.audio.volume = this.volume * (this.ducked ? .35 : 1);
    this.save();
    this.notify();
  }
  clear() {
    this.epoch++;
    if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.audio = undefined; this.objectUrl = undefined; this.filename = '';
    this.message = 'Música: pendiente de autorización de publicación. Carga local disponible en QA.';
    this.notify();
  }
}
export const lobbyMusic = new LobbyMusic();
export const arenaMusic = new LobbyMusic('semantropic.arena-music.v1', .12);
