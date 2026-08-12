import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  server: { port: 5173, open: true },
  preview: { port: 4173 },
  build: {
    outDir: fileURLToPath(new URL('../site-dist', import.meta.url)),
    emptyOutDir: true,
    // Split React and the page builder into their own chunks so the initial
    // payload stays lean.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
