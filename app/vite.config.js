import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the same build works on any host path and inside the Capacitor Android app.
export default defineConfig({ plugins: [react()], base: './', build: { outDir: 'dist', sourcemap: false } });
