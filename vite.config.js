import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: '.',
  server: {
    port: 3001,
    open: false,
    proxy: {
      '/api': 'http://127.0.0.1:3002',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://127.0.0.1:3002',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
