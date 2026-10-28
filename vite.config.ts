import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // La vista artística está aislada en otra entrada HTML.
  // La página B01 principal permanece intacta.
  build: {
    rollupOptions: {
      input: ['index.html', 'b02-preview.html'],
    },
  },
});
