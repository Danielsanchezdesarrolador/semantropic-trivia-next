import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ds01DevPlugin } from './scripts/audio/ds01-dev-middleware.mjs';
import { releaseMarker } from './scripts/audio/release-marker.mjs';

export default defineConfig({
  plugins: [react(), ds01DevPlugin(), releaseMarker()],
  // Capturas y respaldos locales no son fuentes; Windows puede bloquear sus ZIP.
  server: {
    watch: { ignored: ['**/artifacts/**', '**/.local-ds01-audio/**', '**/.local-sfx02-audio/**', '**/.local-approved-audio/**'] },
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local-ds01-audio/**', '**/.local-sfx02-audio/**', '**/.local-approved-audio/**',
      '**/POP01_BOTON_*.mp3', '**/POP02_SELECCION_*.mp3', '**/TIKI01_ACIERTO_*.mp3',
      '**/TOOT01_ERROR_*.mp3', '**/POP03_TIEMPO_*.mp3', '**/MANIFIESTO_SHA256.json'] },
  },
  // La vista artística está aislada en otra entrada HTML.
  // La página B01 principal permanece intacta.
  build: {
    rollupOptions: {
      input: ['index.html', 'b02-preview.html', 'b03-preview.html'],
    },
  },
});
