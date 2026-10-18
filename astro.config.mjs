import { defineConfig } from 'astro/config';

const requestedBase = process.env.SITE_BASE || '/';
const base = requestedBase === '/' ? '/' : `/${requestedBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  base,
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/three/')) return 'three';
          },
        },
      },
    },
  },
});
