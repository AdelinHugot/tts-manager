import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    // En dev pur (`npm run dev`), l'endpoint de l'assistant est proxifié vers
    // `netlify dev` (port 8888) pour que la clé reste côté serveur, même en local.
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
});
