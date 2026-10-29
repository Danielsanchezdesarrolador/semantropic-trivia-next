import catalog from '../../../docs/audio/SFX02_CATALOGO.json';
import { sha256Hex } from '../ds01/sha256';
import { ds01Audio } from '../ds01/audioEngine';
import { lobbyMusic, arenaMusic } from '../lobbyMusic';
import type { ApprovedCode } from './policy';

export const decodedInfo: Record<string, { seconds: number; channels: number; clockOffset?: number } | undefined> = import.meta.hot?.data.info ?? {};
let pending: Promise<void> | undefined = import.meta.hot?.data.pending;
export function loadOfficialDev() {
  if (pending) return pending;
  pending = (async () => {
    ds01Audio.beginOfficial();
    const errors: string[] = [];
    let count = 0;
    try {
      const prefix = '/__qa_approved__/';
      const response = await fetch(prefix + 'manifest.json', { cache: 'no-store' });
      if (!response.ok) throw Error(`Manifiesto SFX-02: HTTP ${response.status}`);
      const manifest = await response.json();
      for (const item of catalog.items) {
        try {
          if (!item.downloaded_filename || !item.sha256 || !manifest.archivos?.some((entry: { archivo: string; sha256: string }) => entry.archivo === item.downloaded_filename && entry.sha256 === item.sha256)) throw Error('Original/manifiesto pendiente');
          const result = await fetch(prefix + item.downloaded_filename, { cache: 'no-store' });
          if (!result.ok) throw Error(`HTTP ${result.status}`);
          const bytes = await result.arrayBuffer();
          if (bytes.byteLength !== item.bytes || sha256Hex(new Uint8Array(bytes)) !== item.sha256) throw Error('SHA-256 distinto');
          const info = await ds01Audio.importApproved(item.code as ApprovedCode, bytes.slice(0));
          if (!info) throw Error('No decodificado');
          decodedInfo[item.code] = info;
          if (item.code === 'L7') lobbyMusic.assignVerified(new Blob([bytes], { type: 'audio/mpeg' }), item.downloaded_filename);
          if (item.code === 'C') arenaMusic.assignVerified(new Blob([bytes], { type: 'audio/mpeg' }), item.downloaded_filename);
          count++;
        } catch (error) { errors.push(`${item.code}: ${error instanceof Error ? error.message : 'no disponible'}`); }
      }
    } catch (error) { errors.push(error instanceof Error ? error.message : 'No se pudo cargar SFX-02'); }
    ds01Audio.officialStatus(`SFX-02: ${count}/9 originales verificados y decodificados. ${errors.join('; ')}`);
  })();
  if (import.meta.hot) { import.meta.hot.data.pending = pending; import.meta.hot.data.info = decodedInfo; }
  return pending;
}
