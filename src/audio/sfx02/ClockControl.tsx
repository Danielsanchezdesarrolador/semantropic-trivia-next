import { useSyncExternalStore } from 'react';
import { ds01Audio } from '../ds01/audioEngine';

export default function ClockControls() {
  useSyncExternalStore(ds01Audio.subscribe, ds01Audio.snapshot);
  return <div className="ds01-controls">
    <button type="button" aria-pressed={ds01Audio.clockEnabled}
      onClick={() => { ds01Audio.setClock(ds01Audio.clockVolume, !ds01Audio.clockEnabled); void ds01Audio.interaction(); }}>
      {ds01Audio.clockEnabled ? 'Silenciar reloj' : 'Activar reloj'}</button>
    <input type="range" aria-label="Volumen del reloj" min="0" max="100"
      value={Math.round(ds01Audio.clockVolume * 100)} onChange={event => ds01Audio.setClock(Number(event.target.value) / 100)} />
  </div>;
}
