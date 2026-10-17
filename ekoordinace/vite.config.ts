import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// small assets (the 12 kB mono font) go inline into the CSS, so the app is one CSS + one JS file
export default defineConfig({ plugins: [react()], build: { assetsInlineLimit: 32 * 1024 } });
