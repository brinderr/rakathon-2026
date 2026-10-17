// Text recognition (OCR) of photos, screenshots and scanned PDFs – in the browser with tesseract.js and the Czech
// language model, both served from our own site (dist/ocr/, copied from node_modules by vite.config.ts). The library is
// loaded only when the first picture comes; no AI and nothing leaves the browser.
import type { Worker } from 'tesseract.js';

/** Progress of a slow step: "Rozpoznávám text z fotky", 40 (%). */
export type Progress = (label: string, pct?: number) => void;

/** URL of a file we serve next to the app (works with any base path). */
export const asset = (path: string) => new URL(path, document.baseURI).href;

let worker: Promise<Worker> | null = null;
let current: { label: string; report?: Progress } = { label: '' };

function getWorker(): Promise<Worker> {
  worker ??= import('tesseract.js')
    .then(({ createWorker }) => createWorker('ces', 1, {
      workerPath: asset('ocr/worker.min.js'),
      corePath: asset('ocr/core'),
      langPath: asset('ocr/lang'),
      logger: (m: { status: string; progress: number }) => {
        if (m.status === 'recognizing text') current.report?.(current.label, Math.round(m.progress * 100));
        else current.report?.('Připravuji rozpoznávání textu');
      },
    }))
    .catch((e: unknown) => { worker = null; throw e; });
  return worker;
}

/** A picture as a canvas of a size the OCR reads well: small screenshots enlarged, huge photos reduced. */
export async function toCanvas(image: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(image);
  const w = bmp.width;
  const scale = w < 1600 ? Math.min(3, 2000 / w) : w > 3200 ? 3200 / w : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Obrázek se nepodařilo připravit k rozpoznání.');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas;
}

/** The text in a picture (canvas, or an image file the browser cannot draw, e.g. TIFF). One picture at a time. */
export async function recognize(image: HTMLCanvasElement | Blob, label: string, report?: Progress): Promise<string> {
  current = { label, report };
  report?.('Připravuji rozpoznávání textu');
  const w = await getWorker();
  report?.(label, 0);
  const { data } = await w.recognize(image);
  return data.text;
}
