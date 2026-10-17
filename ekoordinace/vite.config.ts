import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// small assets (the 12 kB mono font) go inline into the CSS, so the app is one CSS + one JS file
// the shared engine lives in ../app/src/ai, so the dev server may serve files from the repo root too
export default defineConfig({ plugins: [react()], build: { assetsInlineLimit: 32 * 1024 }, server: { fs: { allow: ['..'] } } });
