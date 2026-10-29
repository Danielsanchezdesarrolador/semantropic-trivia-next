import catalog from '../../../docs/audio/SFX02_CATALOGO.json';
import { sha256Hex } from '../ds01/sha256';
import { ds01Audio } from '../ds01/audioEngine';
import { lobbyMusic, arenaMusic } from '../lobbyMusic';
import type { ApprovedCode } from './policy';

// Game assets only: no public catalogue, download panel or QA fanfares.
const assets = import.meta.glob('./assets/*.mp3', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
let pending: Promise<void> | undefined;
export function loadProductionAudio() {
  return pending ??= (async () => {
    ds01Audio.beginOfficial();
    let loaded = 0;
    await Promise.all(catalog.items.filter(item => !['W1', 'D2'].includes(item.code)).map(async item => {
      try {
        const url = assets['./assets/' + item.downloaded_filename];
        if (!url) throw Error('Asset no disponible');
        const response = await fetch(url);
        if (!response.ok) throw Error('Audio no disponible');
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength !== item.bytes || sha256Hex(new Uint8Array(bytes)) !== item.sha256) throw Error('Audio no verificado');
        if (item.code === 'L7' || item.code === 'C') {
          (item.code === 'L7' ? lobbyMusic : arenaMusic).assignVerified(new Blob([bytes], { type: 'audio/mpeg' }), item.downloaded_filename);
        } else await ds01Audio.importApproved(item.code as ApprovedCode, bytes);
        loaded++;
      } catch { ds01Audio.officialStatus('Algún audio no está disponible; puedes seguir jugando.'); }
    }));
    ds01Audio.officialStatus(loaded === 7 ? 'SFX-02: 7/7 recursos del juego verificados.' : `Audio: ${loaded}/7 recursos disponibles; puedes seguir jugando.`);
  })();
}
