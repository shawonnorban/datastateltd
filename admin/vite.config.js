import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The built panel is served by Laravel at /admin (index.html from backend/public/admin-app).
export default defineConfig(({ command }) => ({
  // Built assets live in /admin-app (avoids clashing with the /admin SPA routes); dev serves at /admin/.
  base: command === 'build' ? '/admin-app/' : '/admin/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: { outDir: '../backend/public/admin-app', emptyOutDir: true },
  server: {
    port: 5174,
    proxy: { '/api': 'http://localhost:8000', '/storage': 'http://localhost:8000' },
  },
}));
