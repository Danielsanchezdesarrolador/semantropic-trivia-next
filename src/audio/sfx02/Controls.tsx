import { useSyncExternalStore } from 'react';
import { ds01Audio } from '../ds01/audioEngine';

export { default as ClockControls } from './ClockControl';
export default function ResultAudioQA() {
  useSyncExternalStore(ds01Audio.subscribe, ds01Audio.snapshot);
  return <details className="ds01-panel sfx02-result-qa"><summary>SFX-02 · Audición QA de resultados</summary>
    <p>Solo prueba sonora: no cambia el resultado ni la puntuación de práctica.</p>
    <button type="button" disabled={!ds01Audio.active || !ds01Audio.hasApproved('W1')} onClick={() => ds01Audio.playApproved('W1', true)}>Probar sonido de victoria (QA)</button>
    <button type="button" disabled={!ds01Audio.active || !ds01Audio.hasApproved('D2')} onClick={() => ds01Audio.playApproved('D2', true)}>Probar sonido de derrota (QA)</button>
  </details>;
}
