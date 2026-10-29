import { filenames } from './catalog';
import { sha256Hex } from './sha256';
import { ds01Audio } from './audioEngine';
import approved from '../../../docs/audio/DS01_MANIFIESTO_QA.json';

let pending: Promise<void> | undefined = import.meta.hot?.data.pending;
export function prepareDS01Dev(): Promise<void> {
  if (pending) return pending;
  pending = (async () => {
    const prefix = '/__qa_ds01__/';
    ds01Audio.loadStatus('Cargando automáticamente las 13 muestras locales…');
    try {
      const response = await fetch(prefix + 'manifest.json', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw Error(`Falta o no es válido .local-ds01-audio/MANIFIESTO_SHA256.json (HTTP ${response.status})`);
      const manifest = await response.json();
      const entries = manifest.archivos;
      if (!Array.isArray(entries) || entries.length !== 13) throw Error('Manifiesto DS-01 incompleto');
      const errors: string[] = [];
      for (const name of filenames) {
        const expected = approved.samples.find(item => item.filename === name)!;
        const local = entries.filter(item => item.archivo === name);
        if (local.length !== 1 || local[0].sha256 !== expected.sha256 || local[0].tamano !== expected.bytes) throw Error(`Manifiesto no coincide: ${name}`);
        try {
          const audioResponse = await fetch(prefix + name, { cache: 'no-store', credentials: 'same-origin' });
          if (!audioResponse.ok) throw Error(`HTTP ${audioResponse.status}`);
          const bytes = await audioResponse.arrayBuffer();
          if (bytes.byteLength !== expected.bytes || sha256Hex(new Uint8Array(bytes)) !== expected.sha256) throw Error('SHA-256 distinto');
          // Reuse the decoder, never invoke playback while importing.
          await ds01Audio.importFiles([new File([bytes], name, { type: 'audio/mpeg' })], new Map([[name, expected.sha256]]));
          if (!ds01Audio.samples.some(item => item.name === name)) throw Error('Decodificación fallida');
        } catch (error) { errors.push(`${name}: ${error instanceof Error ? error.message : 'no disponible'}`); }
      }
      ds01Audio.loadStatus(`${ds01Audio.samples.length}/13 muestras cargadas automáticamente. ${errors.join('; ')}`);
    } catch (error) {
      ds01Audio.loadStatus(error instanceof Error ? error.message : 'No se pudo cargar DS-01 local');
    }
  })();
  if (import.meta.hot) import.meta.hot.data.pending = pending;
  return pending;
}
if (import.meta.hot) import.meta.hot.dispose(data => { data.pending = pending; });
