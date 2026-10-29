import { useEffect, useRef, useSyncExternalStore } from 'react';
import { lobbyMusic } from './lobbyMusic';
import './lobby-music.css';

export function useLobbyMusic(inLobby: boolean, official: boolean) {
  const lifecycle = useRef(0);
  useEffect(() => {
    if (!official) return;
    const lease = ++lifecycle.current;
    lobbyMusic.setLobby(inLobby);
    lobbyMusic.prepareDev();
    const visibility = () => lobbyMusic.visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      // StrictMode immediately reacquires the same player; real unmount releases it.
      queueMicrotask(() => { if (lifecycle.current === lease) lobbyMusic.clear(); });
    };
  }, [official]);
  useEffect(() => { if (official) lobbyMusic.setLobby(inLobby); }, [inLobby, official]);
}

export default function LobbyMusicControl() {
  useSyncExternalStore(lobbyMusic.subscribe, lobbyMusic.snapshot);
  return <div className="st-lobby-music">
    <button type="button" disabled={!lobbyMusic.available} aria-pressed={lobbyMusic.playing}
      title={lobbyMusic.message} onClick={() => {
        if (lobbyMusic.playing) lobbyMusic.disable(); else void lobbyMusic.enable();
      }}>{lobbyMusic.playing ? 'Silenciar música' : 'Activar música'}</button>
    {lobbyMusic.available ? <input aria-label="Volumen de música" title="Volumen de música"
      type="range" min="0" max="100" value={Math.round(lobbyMusic.volume * 100)}
      onChange={event => lobbyMusic.setVolume(Number(event.target.value) / 100)} /> : null}
  </div>;
}
