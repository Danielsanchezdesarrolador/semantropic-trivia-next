import { useEffect, useRef, useSyncExternalStore } from 'react';
import { lobbyMusic, arenaMusic, type LobbyMusic } from './lobbyMusic';
import { ds01Audio } from './ds01/audioEngine';
import './lobby-music.css';

export function useLobbyMusic(inLobby: boolean, official: boolean) {
  const lifecycle = useRef(0);
  useEffect(() => {
    if (!official) return;
    const lease = ++lifecycle.current;
    lobbyMusic.setLobby(inLobby);
    arenaMusic.setLobby(!inLobby);
    ds01Audio.priorityChanged = value => { lobbyMusic.setDucked(value); arenaMusic.setDucked(value); };
    const visibility = () => {
      lobbyMusic.visibility(); arenaMusic.visibility();
      if (document.hidden) { ds01Audio.stop(); ds01Audio.stopClock(); }
      ds01Audio.clockVisibility?.();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      // StrictMode immediately reacquires the same player; real unmount releases it.
      queueMicrotask(() => { if (lifecycle.current === lease) { lobbyMusic.clear(); arenaMusic.clear(); } });
    };
  }, [official]);
  useEffect(() => {
    if (official) {
      // Pause the old region before resuming the new one.
      if (inLobby) { arenaMusic.setLobby(false); lobbyMusic.setLobby(true); }
      else { lobbyMusic.setLobby(false); arenaMusic.setLobby(true); }
    }
  }, [inLobby, official]);
}

export default function LobbyMusicControl({ channel = lobbyMusic, scope = 'lobby' }: { channel?: LobbyMusic; scope?: string }) {
  useSyncExternalStore(channel.subscribe, channel.snapshot);
  return <div className="st-lobby-music">
    <button type="button" disabled={!channel.available} aria-pressed={channel.playing}
      title={channel.message} onClick={() => {
        if (channel.playing) channel.disable(); else void channel.enable();
      }}>{channel.playing ? 'Silenciar música ' : 'Activar música '}{scope}</button>
    {channel.available ? <input aria-label={'Volumen de música ' + scope} title={'Volumen de música ' + scope}
      type="range" min="0" max="100" value={Math.round(channel.volume * 100)}
      onChange={event => channel.setVolume(Number(event.target.value) / 100)} /> : null}
  </div>;
}
