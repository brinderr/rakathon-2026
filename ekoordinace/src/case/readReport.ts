// Reads a report the coordinator adds: .docx (Word) or .txt, in the browser, without uploading it anywhere.
// A .docx is a zip; we take word/document.xml and keep one line per paragraph, the way the engine reads reports.
import { findDates } from '../../../app/src/ai/text.ts';
import * as R from '../../../app/src/ai/rules.ts';

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

/** Text of an added file. */
export async function readFile(file: File): Promise<string> {
  if (/\.docx$/i.test(file.name)) return docxText(await unzipEntry(await file.arrayBuffer(), 'word/document.xml'));
  if (/\.(txt|md)$/i.test(file.name) || file.type.startsWith('text/')) return (await file.text()).trim();
  throw new Error(`${file.name}: umíme Word (.docx) a text (.txt). PDF zatím ne – text z něj vložte ručně.`);
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
