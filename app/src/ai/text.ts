// Text utilities for the extractor: quote verification, Czech date parsing, section reading.
// Pure functions without Node or DOM dependencies, so they run in the browser and in Node scripts.
import type { ISODate } from '../types.ts';

/** Typographic variants that an LLM often rewrites. Matching tolerates them; the stored quote stays verbatim. */
const CHAR_FOLD: Record<string, string> = {
  '‐': '-', '‑': '-', '‒': '-', '–': '-', '—': '-', '−': '-',
  '„': '"', '“': '"', '”': '"', '«': '"', '»': '"',
  '‘': "'", '’': "'", '‚': "'",
  '×': 'x',
};

interface Folded { text: string; map: number[] }

/** Fold whitespace runs to one space and typographic variants to ASCII, keeping a map to original indices. */
export function foldWithMap(input: string): Folded {
  const src = input.normalize('NFC');
  let text = '';
  const map: number[] = [];
  let lastWasSpace = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      if (!lastWasSpace && text.length > 0) { text += ' '; map.push(i); }
      lastWasSpace = true;
      continue;
    }
    lastWasSpace = false;
    text += CHAR_FOLD[ch] ?? ch;
    map.push(i);
  }
  if (text.endsWith(' ')) { text = text.slice(0, -1); map.pop(); }
  return { text, map };
}

export function fold(input: string): string {
  return foldWithMap(input).text;
}

/**
 * Find a quote in a document. Returns the exact original substring (character-for-character from the document)
 * or null when the quote does not occur. Tolerates whitespace and typographic differences only.
 */
export function locateQuote(docText: string, quote: string): string | null {
  const q = fold(quote);
  if (q.length < 3) return null;
  const doc = foldWithMap(docText);
  const at = doc.text.indexOf(q);
  if (at < 0) return null;
  const start = doc.map[at];
  const end = doc.map[at + q.length - 1] + 1;
  return docText.normalize('NFC').slice(start, end);
}

/** True when the quote occurs verbatim (character-for-character) in the document text. */
export function isVerbatim(docText: string, quote: string): boolean {
  return quote.length > 0 && docText.normalize('NFC').includes(quote);
}

// ---------- dates ----------

const DATE_RE = /\b(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})\b/g;

export interface DateHit { iso: ISODate; raw: string; index: number }

export function toIso(d: number, m: number, y: number): ISODate {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** All Czech-style dates ("1. 9. 2026", "21.10.2026") in a text, with their positions. */
export function findDates(text: string): DateHit[] {
  const hits: DateHit[] = [];
  for (const m of text.matchAll(DATE_RE)) {
    const d = Number(m[1]); const mo = Number(m[2]); const y = Number(m[3]);
    if (d < 1 || d > 31 || mo < 1 || mo > 12) continue;
    hits.push({ iso: toIso(d, mo, y), raw: m[0], index: m.index ?? 0 });
  }
  return hits;
}

/** "2026-10-21" → "21. 10. 2026" */
export function czDate(iso: ISODate): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

/** Whole days between two ISO dates (b − a). */
export function daysBetween(a: ISODate, b: ISODate): number {
  const ms = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10));
  return Math.round(ms / 86_400_000);
}

// ---------- lines and sections ----------

export function lines(text: string): string[] {
  return text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
}

/** A section heading in these reports is a line written in capitals, e.g. "ZÁVĚR", "DOPORUČENÍ", "NÁDOROVÉ MARKERY". */
export function isHeading(line: string): boolean {
  const letters = line.replace(/[^A-Za-zÀ-ž]/g, '');
  return letters.length >= 4 && line === line.toLocaleUpperCase('cs') && !/\d{2}/.test(line);
}

/** Text of the section that starts with a heading matching `heading` (until the next heading). */
export function section(text: string, heading: RegExp): string | null {
  const ls = text.split(/\r?\n/);
  const start = ls.findIndex((l) => heading.test(l.trim()) && isHeading(l.trim()));
  if (start < 0) return null;
  const out: string[] = [];
  for (let i = start + 1; i < ls.length; i++) {
    const l = ls[i].trim();
    if (!l) continue;
    if (isHeading(l)) break;
    out.push(l);
  }
  return out.length ? out.join('\n') : null;
}

/** "Anamnéza onemocnění:", "OA:", "Přání pacienta:" – a short label (max 4 words) at the start of a line, followed by a colon. */
const LABEL_START = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][\p{L}.]*(?:\s+[\p{L}.()+/-]+){0,3}\s*:(?:\s|$)/u;

/**
 * Text after a label such as "Anamnéza onemocnění:" or "Závěr:" – the rest of that line plus the following lines,
 * until an empty line, another label line or a heading. For reports that use labels instead of capital headings.
 */
export function labeledBlock(text: string, label: RegExp): string | null {
  const ls = text.split(/\r?\n/);
  const start = ls.findIndex((l) => { const m = l.trim().match(label); return !!m && m.index === 0; });
  if (start < 0) return null;
  const first = ls[start].trim();
  const out: string[] = [];
  const rest = first.slice((first.match(label) ?? [''])[0].length).trim();
  if (rest) out.push(rest);
  for (let i = start + 1; i < ls.length; i++) {
    const l = ls[i].trim();
    if (!l) { if (out.length) break; continue; }
    if (isHeading(l) || LABEL_START.test(l)) break;
    out.push(l);
  }
  return out.length ? out.join('\n') : null;
}

const ABBREV = new Set(['MUDr', 'Dr', 'Mgr', 'Bc', 'Ing', 'doc', 'prof', 'tbl', 'max', 'st', 'p', 'č', 't', 'r', 'tj', 'např', 'cca', 'resp', 'mj', 'event', 'eventuálně', 'tzv', 'příp', 'vs', 'aj', 'atd', 'srov', 'viz', 'nar', 'odd', 'ul', 'tel']);

/** Split a report block into sentences without breaking dates ("1. 9. 2026") or abbreviations ("t. č.", "MUDr.", "event."). */
export function sentences(block: string): string[] {
  const out: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    let start = 0;
    for (const m of line.matchAll(/[.!?]\s+/g)) {
      const at = m.index ?? 0;
      const prev = line[at - 1] ?? '';
      const next = line[at + m[0].length] ?? '';
      const word = line.slice(0, at).split(/[\s(]+/).pop() ?? '';
      // a sentence may end with a year ("… 24. 8. 2026. RTG …"), but not with a day or month ("1. 9. 2026")
      const endsSentence = (/[a-záčďéěíňóřšťúůýž)%°]/.test(prev) || /^\d{4}$/.test(word)) && /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(next) && !ABBREV.has(word);
      if (!endsSentence) continue;
      out.push(line.slice(start, at + 1).trim());
      start = at + m[0].length;
    }
    const rest = line.slice(start).trim();
    if (rest) out.push(rest);
  }
  return out.filter(Boolean);
}

/** First line that starts with a label such as "FA:" or "Telefon:"; returns the full line and the value part. */
export function labeledLine(text: string, label: RegExp): { line: string; value: string } | null {
  for (const l of text.split(/\r?\n/)) {
    const t = l.trim();
    const m = t.match(label);
    if (m && m.index === 0) return { line: t, value: t.slice(m[0].length).trim() };
  }
  return null;
}

/** Shorten a value for display without cutting words. */
export function clip(s: string, max = 320): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 40)).trimEnd() + ' …';
}

/** Numbers that appear in a value (used by the eval to spot invented numbers). */
export function numbersIn(s: string): string[] {
  return (s.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => n.replace('.', ','));
}
