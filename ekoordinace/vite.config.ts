import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Reading PDFs and pictures runs in the browser from our own site: the pdf.js worker, the tesseract.js worker, its
// WebAssembly core and the Czech language data are copied from node_modules into dist/ocr/ (the dev server serves
// them from node_modules), so nothing is fetched from another server and no report leaves the browser.
const OCR: Record<string, string> = {
  'ocr/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.mjs',
  'ocr/worker.min.js': 'tesseract.js/dist/worker.min.js',
  'ocr/core/tesseract-core-simd-lstm.wasm.js': 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js',
  'ocr/core/tesseract-core-lstm.wasm.js': 'tesseract.js-core/tesseract-core-lstm.wasm.js',
  'ocr/lang/ces.traineddata.gz': '@tesseract.js-data/ces/4.0.0_best_int/ces.traineddata.gz',
};
const fromModules = (path: string) => readFileSync(fileURLToPath(new URL(`node_modules/${path}`, import.meta.url)));

function ocrAssets(): Plugin {
  return {
    name: 'ocr-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const src = OCR[(req.url ?? '').split('?')[0].replace(/^\//, '')];
        if (!src) return next();
        res.setHeader('Content-Type', src.endsWith('.gz') ? 'application/octet-stream' : 'text/javascript');
        res.end(fromModules(src));
      });
    },
    generateBundle() {
      for (const [fileName, src] of Object.entries(OCR)) this.emitFile({ type: 'asset', fileName, source: fromModules(src) });
    },
  };
}

// small assets (the 12 kB mono font) go inline into the CSS, so the app is one CSS + one JS file (+ the OCR files above,
// loaded only when a PDF or a picture is added)
// the shared engine lives in ../app/src/ai, so the dev server may serve files from the repo root too
export default defineConfig({
  plugins: [react(), ocrAssets()],
  build: { assetsInlineLimit: 32 * 1024, target: 'es2022' },
  server: { fs: { allow: ['..'] } },
});
