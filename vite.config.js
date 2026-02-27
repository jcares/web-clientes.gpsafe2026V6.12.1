import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

// Variables de entorno
const APP_TITLE = process.env.VITE_APP_TITLE || 'GPSafe';
const APP_DESC = process.env.VITE_APP_DESC || 'Plataforma de Monitoreo';
const APP_COLOR = process.env.VITE_APP_COLOR || '#007bff';

export default defineConfig(() => ({
  server: {
    port: 3000,
    proxy: {
      '/api/socket': 'ws://localhost:8082',
      '/api': 'http://localhost:8082',
    },
  },
  build: {
    outDir: 'web',
    chunkSizeWarningLimit: 1000, // aumenta límite a 1 MB para reducir warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Librerías pesadas en chunks separados
          'mui': ['@mui/material', '@mui/icons-material', '@mui/lab'],
          'maplibre': ['maplibre-gl', '@maplibre/maplibre-gl-geocoder', '@mapbox/mapbox-gl-rtl-text'],
          'recharts': ['recharts'],
          'exceljs': ['exceljs', 'file-saver'],
          'dayjs': ['dayjs'],
          'qr': ['react-qr-code', '@yudiel/react-qr-scanner'],
        },
      },
    },
  },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,woff,woff2,mp3}'],
      },
      manifest: {
        short_name: APP_TITLE,
        name: APP_DESC,
        theme_color: APP_COLOR,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        { src: 'node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js', dest: '' },
      ],
    }),
  ],
}));