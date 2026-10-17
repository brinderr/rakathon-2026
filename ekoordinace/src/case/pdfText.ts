// Text of a PDF report in the browser (pdf.js, loaded only when a PDF comes). Lines are rebuilt from the positions of
// the text pieces, so "Pacient:" or "Datum vydání:" start a line as in a report read from Word. A page without text
// (a scan) is drawn and read by OCR.
import { asset, recognize } from './ocr';
import type { Progress } from './ocr';

interface Piece { x: number; y: number; w: number; h: number; s: string }

/** Pieces of text → lines, top to bottom; pieces on one line left to right, a space where there is a gap. */
function linesOf(items: unknown[]): string[] {
  const pieces: Piece[] = [];
  for (const it of items as { str?: string; transform?: number[]; width?: number; height?: number }[]) {
    if (typeof it.str !== 'string' || !it.transform) continue;
    pieces.push({ x: it.transform[4], y: it.transform[5], w: it.width ?? 0, h: Math.abs(it.transform[3]) || it.height || 10, s: it.str });
  }
  const rows: { y: number; h: number; parts: Piece[] }[] = [];
  for (const p of pieces) {
    if (!p.s.trim() && !p.w) continue;
    const row = rows.find((r) => Math.abs(r.y - p.y) < Math.max(2, Math.min(r.h, p.h) * 0.45));
    if (row) row.parts.push(p);
    else rows.push({ y: p.y, h: p.h, parts: [p] });
  }
  rows.sort((a, b) => b.y - a.y);
  return rows.map((r) => {
    r.parts.sort((a, b) => a.x - b.x);
    let line = '';
    let end = -Infinity;
    for (const p of r.parts) {
      if (line && p.x - end > p.h * 0.15 && !/\s$/.test(line) && !/^\s/.test(p.s)) line += ' ';
      line += p.s;
      end = p.x + p.w;
    }
    return line.replace(/\s+/g, ' ').trim();
  }).filter(Boolean);
}

/** Text of a PDF; `ocr` = at least one page was a scan read by OCR. */
export async function pdfText(file: Blob, report?: Progress): Promise<{ text: string; ocr: boolean }> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = asset('ocr/pdf.worker.min.js');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  let ocr = false;
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const lines = linesOf((await page.getTextContent()).items);
      if (lines.join('').replace(/\s/g, '').length >= 40) { pages.push(lines.join('\n')); continue; }
      // no text layer: a scanned page
      ocr = true;
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Stránku PDF se nepodařilo vykreslit.');
      await page.render({ canvasContext: ctx, viewport }).promise;
      const label = doc.numPages > 1 ? `Rozpoznávám text ze skenu (strana ${n}/${doc.numPages})` : 'Rozpoznávám text ze skenu';
      pages.push(await recognize(canvas, label, report));
    }
  } finally {
    void doc.destroy();
  }
  return { text: pages.join('\n'), ocr };
}
