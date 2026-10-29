import { useSyncExternalStore } from 'react';
import { ds01Audio, soundEvents, families } from './audioEngine';
import type { Variant } from './catalog';
import './ds01.css';

export default function DS01Panel() {
  useSyncExternalStore(ds01Audio.subscribe, ds01Audio.snapshot);
  return <details className="ds01-panel">
    <summary>DS-01 · PREVIEW / QA local</summary>
    <p>TimGM6mb.sf2 / MIDI / FluidSynth · GPL-2 de la fuente. Publicación de derivados pendiente. No es Foley humano.</p>
    <p>A es preselección técnica temporal; ninguna variante definitiva ha sido elegida.</p>
    <p role="status">{ds01Audio.message}</p>
    <button type="button" aria-pressed={ds01Audio.active} onClick={() => {
      if (ds01Audio.active) ds01Audio.mute(); else void ds01Audio.enable();
    }}>{ds01Audio.active ? 'Desactivar DS-01' : 'Activar DS-01'}</button>
    <label>Volumen DS-01 <input type="range" min="0" max="100" value={Math.round(ds01Audio.volume * 100)}
      onChange={event => ds01Audio.setVolume(Number(event.target.value) / 100)} /></label>
    {soundEvents.map(id => <div key={id}>
      <label>{families[id].label} <select aria-label={families[id].label} value={ds01Audio.variants[id]}
        onChange={event => ds01Audio.setVariant(id, event.target.value as Variant)}>
        {families[id].variants.map(variant => <option key={variant}>{variant}</option>)}
      </select></label>
      <button type="button" disabled={!ds01Audio.active || !ds01Audio.available(id)}
        onClick={() => ds01Audio.play([id])}>Probar {families[id].label}</button>
    </div>)}
    <p>Muestras faltantes: {ds01Audio.missing().join(', ') || 'ninguna'}</p>
    <details><summary>Procedencia y SHA-256 locales</summary><pre>{JSON.stringify(ds01Audio.samples, null, 2)}</pre></details>
  </details>;
}

export function DS01Controls() {
  useSyncExternalStore(ds01Audio.subscribe, ds01Audio.snapshot);
  return <div className="ds01-controls">
    <button type="button" aria-pressed={ds01Audio.active} title={ds01Audio.message}
      onClick={() => { if (ds01Audio.active) ds01Audio.mute(); else void ds01Audio.enable(); }}>
      {ds01Audio.active ? 'Silenciar efectos DS-01' : 'Activar efectos DS-01'}
    </button>
    <input aria-label="Volumen de efectos DS-01" type="range" min="0" max="100"
      value={Math.round(ds01Audio.volume * 100)} onChange={event => ds01Audio.setVolume(Number(event.target.value) / 100)} />
  </div>;
}
