// Reads a report the coordinator adds, in the browser, without uploading it anywhere: Word (.docx), text, RTF, PDF
// (its text, or OCR of a scanned page), photos and screenshots (OCR). A .docx is a zip; we take word/document.xml and
// keep one line per paragraph, the way the engine reads reports. PDF and OCR text get their wrapped lines rejoined.
import { findDates } from '../../../app/src/ai/text.ts';
import * as R from '../../../app/src/ai/rules.ts';
import type { Progress } from './ocr';
import { rtfToText } from './rtf';

export type { Progress } from './ocr';

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

async function unzipEntry(buf: ArrayBuffer, name: string): Promise<string> {
  const v = new DataView(buf);
  const u8 = new Uint8Array(buf);
  let end = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65_557); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error('Soubor není platný dokument Word (.docx).');
  const dec = new TextDecoder();
  let p = v.getUint32(end + 16, true);
  for (let k = v.getUint16(end + 10, true); k > 0; k--) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    if (dec.decode(u8.subarray(p + 46, p + 46 + nameLen)) === name) {
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const data = u8.slice(start, start + size);
      if (method === 0) return dec.decode(data);
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new Response(stream).text();
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('V souboru chybí text dokumentu.');
}

function docxText(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const out: string[] = [];
  for (const p of Array.from(doc.getElementsByTagNameNS(W, 'p'))) {
    let line = '';
    for (const n of Array.from(p.getElementsByTagNameNS(W, '*'))) {
      if (n.localName === 't') line += n.textContent ?? '';
      else if (n.localName === 'tab') line += ' ';
      else if (n.localName === 'br') line += '\n';
    }
    out.push(line.trim());
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** How the text was obtained; 'ocr' = recognized from a picture, the coordinator should check it. */
export type ReadSource = 'docx' | 'text' | 'rtf' | 'pdf' | 'ocr';

const LABEL = /^[\p{Lu}][\p{L}\d .()/-]{0,40}:/u; // "Datum vydání:", "Pacient:", "FA:"
const ITEM = /^(?:\d{1,2}[.)]\s|[-•–]\s)/; // "1. Gastroskopie …", "- …"

/** Lines of a PDF or OCR text: a paragraph broken at the page edge becomes one line again (as in Word), labels,
 *  headings and list items stay on their own line, an empty line ends a paragraph. A long dash becomes the Czech one
 *  ("Výsledek vyšetření – CT"), as the reports and the engine write it. */
export function tidyLines(text: string): string {
  const lines = text.replace(/\u00ad/g, '').replace(/[ﬁﬂ]/g, (c) => (c === 'ﬁ' ? 'fi' : 'fl')).replace(/\u2014/g, '–').split(/\r?\n/)
    .map((l) => l.replace(/[ \t]+/g, ' ').trim());
  const full = Math.max(40, ...lines.map((l) => l.length));
  const out: string[] = [];
  let paragraphEnd = true;
  for (const line of lines) {
    if (!line) { paragraphEnd = true; continue; }
    const prev = out[out.length - 1];
    const heading = line.length > 2 && line === line.toLocaleUpperCase('cs') && /\p{Lu}{3}/u.test(line);
    // "… st. p." + "appendektomii" is one sentence: an abbreviation at the end does not end the line
    const open = !/[:.;!?]$/.test(prev ?? '') || (/(?:^|\s)\p{Ll}{1,3}\.$/u.test(prev ?? '') && /^\p{Ll}/u.test(line));
    if (!paragraphEnd && prev && prev.length >= full * 0.6 && open && !LABEL.test(line) && !ITEM.test(line) && !heading) {
      out[out.length - 1] = prev.endsWith('-') && /^\p{Ll}/u.test(line) ? prev.slice(0, -1) + line : `${prev} ${line}`;
    } else out.push(line);
    paragraphEnd = false;
  }
  return out.join('\n');
}

const kind = (file: File) => {
  const name = file.name.toLowerCase();
  if (/\.docx$/.test(name)) return 'docx';
  if (/\.rtf$/.test(name) || /rtf/.test(file.type)) return 'rtf';
  if (/\.(txt|md|csv)$/.test(name) || file.type.startsWith('text/')) return 'text';
  if (/\.pdf$/.test(name) || file.type === 'application/pdf') return 'pdf';
  if (/\.(heic|heif)$/.test(name) || /heic|heif/.test(file.type)) return 'heic';
  if (/\.(doc|odt|pages)$/.test(name)) return 'old';
  if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|tiff?|avif)$/.test(name)) return 'image';
  return 'unknown';
};

/** Text of an added file and how it was read. `report` shows the progress of slow steps (OCR). */
export async function readReport(file: File, report?: Progress): Promise<{ text: string; source: ReadSource }> {
  switch (kind(file)) {
    case 'docx': return { text: docxText(await unzipEntry(await file.arrayBuffer(), 'word/document.xml')), source: 'docx' };
    case 'text': return { text: (await file.text()).trim(), source: 'text' };
    case 'rtf': return { text: rtfToText(await file.text()), source: 'rtf' };
    case 'pdf': {
      report?.('Čtu PDF');
      const { pdfText } = await import('./pdfText');
      const { text, ocr } = await pdfText(file, report);
      if (!text.trim()) throw new Error(`${file.name}: v PDF jsme nenašli žádný text.`);
      return { text: tidyLines(text), source: ocr ? 'ocr' : 'pdf' };
    }
    case 'image': {
      const { recognize, toCanvas } = await import('./ocr');
      // TIFF (often from a scanner) cannot be drawn by the browser; the OCR reads it itself
      let picture: HTMLCanvasElement | Blob;
      try { picture = await toCanvas(file); } catch {
        if (!/\.tiff?$/i.test(file.name) && file.type !== 'image/tiff') throw new Error(`${file.name}: obrázek se nepodařilo otevřít.`);
        picture = file;
      }
      const text = tidyLines(await recognize(picture, 'Rozpoznávám text z obrázku', report));
      if (text.replace(/\s/g, '').length < 20) throw new Error(`${file.name}: na obrázku jsme nenašli čitelný text.`);
      return { text, source: 'ocr' };
    }
    case 'heic': throw new Error(`${file.name}: fotku z iPhonu (HEIC) uložte jako JPG.`);
    case 'old': throw new Error(`${file.name}: tento formát neumíme – uložte zprávu jako .docx nebo PDF.`);
    default: throw new Error(`${file.name}: umíme Word (.docx), PDF, RTF, text a obrázky (fotka, snímek obrazovky).`);
  }
}

/** Text of an added file. */
export async function readFile(file: File): Promise<string> {
  return (await readReport(file)).text;
}

/** Date of a report: the blood draw of a lab report, its labelled date ("Datum vydání:", "Datum výkonu:" …), else the
 *  date after "dne" ("V Praze dne
 *  2. 10. 2026"), else the newest date in the text that is not a date of birth, else the given day. */
export function reportDate(text: string, fallback: string): string {
  // a lab report counts from the day of the blood draw, not from the day the last culture came back
  const drawn = text.match(/^(?:Datum odběru|Odběr)\s*:\s*(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/m);
  const drawnDay = drawn && findDates(drawn[1])[0]?.iso;
  if (drawnDay) return drawnDay;
  const labelled = R.issueDate({ id: 'x', date: fallback, text })?.iso;
  if (labelled) return labelled;
  const signed = text.match(/\bdne\s+(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/);
  const day = signed && findDates(signed[1])[0]?.iso;
  if (day) return day;
  const dates = findDates(text).filter((d) => !/nar(?:\.|ozen\w*|\s)\s*$/i.test(text.slice(Math.max(0, d.index - 12), d.index)));
  return dates.map((d) => d.iso).sort().pop() ?? fallback;
}
