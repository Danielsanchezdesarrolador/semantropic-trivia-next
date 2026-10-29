import { useEffect, useSyncExternalStore } from 'react';
import { lobbyMusic } from './lobbyMusic';

export function useLobbyMusic(inLobby: boolean, official: boolean) {
  useEffect(() => {
    if (!official) return;
    const visibility = () => lobbyMusic.visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); lobbyMusic.clear(); };
  }, [official]);
  useEffect(() => { if (official) lobbyMusic.setLobby(inLobby); }, [inLobby, official]);
}

export default function LobbyMusicControl() {
  useSyncExternalStore(lobbyMusic.subscribe, lobbyMusic.snapshot);
  return <span className="st-cartoon-audio">
    <button type="button" disabled={!lobbyMusic.available} aria-pressed={lobbyMusic.enabled}
      title={lobbyMusic.message} onClick={() => {
        if (lobbyMusic.enabled) lobbyMusic.disable(); else void lobbyMusic.enable();
      }}>{lobbyMusic.enabled ? 'Desactivar música' : 'Activar música'}</button>
    {lobbyMusic.available ? <label>Volumen de música<input type="range" min="0" max="100"
      value={Math.round(lobbyMusic.volume * 100)} onChange={event => lobbyMusic.setVolume(Number(event.target.value) / 100)} /></label> : null}
    {import.meta.env.DEV ? <details><summary>Música · QA local</summary>
      <label>Cargar 18_lobby_pop_familiar.mp3<input type="file" accept="audio/mpeg,audio/mp3"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) void lobbyMusic.load(file);
          event.target.value = '';
        }} /></label>
      <span role="status">{lobbyMusic.message}</span>
    </details> : null}
  </span>;
}
