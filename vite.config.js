import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // L'application se met à jour d'elle-même : on ne va pas demander à une
      // créatrice de vider son cache quand un correctif part en production.
      registerType: 'autoUpdate',
      // Pas d'injection de script : la CSP interdit l'inline, l'enregistrement
      // se fait depuis src/main.jsx.
      injectRegister: null,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Rekolt — Creator Revenue Studio',
        short_name: 'Rekolt',
        description: "Pilote tes revenus d'affiliation TikTok Shop.",
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F6F4FD',
        theme_color: '#6B4FE8',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          // Android recadre les icônes : celle-ci porte la marge de sécurité.
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Le gros fragment de l'application dépasse la limite par défaut (2 Mio).
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Jamais de réponse mise en cache pour l'assistant ni pour Firebase :
        // des chiffres périmés servis hors ligne seraient pires qu'une erreur.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-fichiers',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
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
