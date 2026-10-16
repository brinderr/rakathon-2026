// Rule-based fallbacks for the free-text fields (diagnosis, epicrisis, MDT question, symptoms, other notes).
// Used when no LLM is available or when the LLM proposal fails verification. Values are verbatim sentences.
import type { Citation } from '../types.ts';
import { czDate, labeledLine, locateQuote, section } from './text.ts';
import { docKind, type Doc, type RuleField } from './rules.ts';

const ABBREV = new Set(['MUDr', 'Dr', 'Mgr', 'Bc', 'Ing', 'doc', 'prof', 'tbl', 'max', 'st', 'p', 'č', 't', 'r', 'tj', 'např', 'cca', 'resp', 'mj']);

/** Split a report block into sentences without breaking dates ("1. 9. 2026") or abbreviations ("t. č.", "MUDr."). */
export function sentences(block: string): string[] {
  const out: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    let start = 0;
    for (const m of line.matchAll(/[.!?]\s+/g)) {
      const at = m.index ?? 0;
      const prev = line[at - 1] ?? '';
      const next = line[at + m[0].length] ?? '';
      const word = line.slice(0, at).split(/[\s(]+/).pop() ?? '';
      const endsSentence = /[a-záčďéěíňóřšťúůýž)%°]/.test(prev) && /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(next) && !ABBREV.has(word);
      if (!endsSentence) continue;
      out.push(line.slice(start, at + 1).trim());
      start = at + m[0].length;
    }
    const rest = line.slice(start).trim();
    if (rest) out.push(rest);
  }
  return out.filter(Boolean);
}

function citeAll(doc: Doc, quotes: string[]): Citation[] {
  return quotes.map((q) => locateQuote(doc.text, q)).filter((q): q is string => q !== null).map((quote) => ({ docId: doc.id, quote }));
}

function latestReferral(docs: Doc[]): Doc | undefined {
  return docs.filter((d) => docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function diagnosisFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const histo = docs.filter((d) => docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date))[0];
  const parts: string[] = [];
  const citations: Citation[] = [];
  const susp = ref ? labeledLine(ref.text, /^(Suspektní diagnóza|Pracovní diagnóza|Diagnóza):/) : null;
  if (ref && susp) { parts.push(`${susp.value} (podozrenie v žiadanke, ${czDate(ref.date)})`); citations.push(...citeAll(ref, [susp.line])); }
  const z = histo ? section(histo.text, /^ZÁVĚR/)?.split('\n')[0] : undefined;
  if (histo && z) { parts.push(`histologicky: ${z} (${czDate(histo.date)})`); citations.push(...citeAll(histo, [z])); }
  if (!parts.length) return { value: '', citations: [], status: 'missing', note: 'Diagnóza nie je v dokumentácii uvedená.' };
  return { value: parts.join('; '), citations, sourceDate: histo?.date ?? ref?.date };
}

export function epicrisisFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const block = ref ? section(ref.text, /^EPIKRÍZA/) : null;
  if (!ref || !block) return { value: '', citations: [], status: 'missing', note: 'Epikríza nie je k dispozícii.' };
  const s = sentences(block).slice(0, 3);
  return { value: s.join(' '), citations: citeAll(ref, s), sourceDate: ref.date };
}

export function mdtQuestionFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const block = ref ? section(ref.text, /^ŽÁDOST/) : null;
  const ask = block ? sentences(block).find((s) => /^(Žádám|Prosím|Žádost)/.test(s)) : undefined;
  if (!ref || !ask) return { value: '', citations: [], status: 'missing', note: 'Otázka pre konzílium nie je v žiadanke uvedená.' };
  const general = /(stanovení dalšího postupu|další postup|dalšího postupu)/i.test(ask);
  return {
    value: ask,
    citations: citeAll(ref, [ask]),
    sourceDate: ref.date,
    note: general ? 'Otázka je všeobecná (dokončiť diagnostiku a určiť postup) – lekár KOC ju pred konzíliom môže spresniť.' : undefined,
  };
}

export function symptomsFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const block = ref ? section(ref.text, /^EPIKRÍZA/) : null;
  if (!ref || !block) return { value: '', citations: [], status: 'missing', note: 'Príznaky nie sú opísané.' };
  const hits = sentences(block).filter((s) => /(bolest|teplot|tmavší moč|nechutenství|úbyt|ikter|únav|zvracen|nauze|hubn)/i.test(s)).slice(0, 4);
  if (!hits.length) return { value: '', citations: [], status: 'missing', note: 'Príznaky nie sú opísané.' };
  return { value: hits.join(' '), citations: citeAll(ref, hits), sourceDate: ref.date };
}

export function otherNotesFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  if (!ref) return { value: '', citations: [], status: 'missing', note: 'Žiadne ďalšie informácie.' };
  const block = section(ref.text, /^ŽÁDOST/) ?? '';
  const hits = sentences(block).filter((s) => /(Upozorňuji|úzkost|psycholog|informován|Souhlasí|přeje|přání)/i.test(s));
  if (!hits.length) return { value: '', citations: [], status: 'missing', note: 'Žiadne ďalšie informácie ani želania pacienta.' };
  return { value: hits.join(' '), citations: citeAll(ref, hits), sourceDate: ref.date };
}
