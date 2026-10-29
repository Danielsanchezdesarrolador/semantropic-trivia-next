import { useSyncExternalStore } from 'react';
import { ds01Audio } from '../ds01/audioEngine';
import '../ds01/ds01.css';

export default function EffectsControl() {
  useSyncExternalStore(ds01Audio.subscribe, ds01Audio.snapshot);
  return <div className="ds01-controls">
    <button type="button" aria-pressed={ds01Audio.active} title={ds01Audio.officialMessage}
      onClick={() => { if (ds01Audio.active) ds01Audio.mute(); else void ds01Audio.enable(); }}>
      {ds01Audio.active ? 'Silenciar efectos' : 'Activar efectos'}
    </button>
    <input aria-label="Volumen de efectos" type="range" min="0" max="100"
      value={Math.round(ds01Audio.volume * 100)} onChange={event => ds01Audio.setVolume(Number(event.target.value) / 100)} />
  </div>;
}
