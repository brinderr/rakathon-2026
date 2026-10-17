// Rule-based fallbacks for the free-text fields (diagnosis, epicrisis, MDT question, symptoms, other notes).
// Used when no LLM is available or when the LLM proposal fails verification. Values are verbatim sentences.
// Reports use either capital headings ("EPIKRÍZA", "ŽÁDOST") or labels ("Anamnéza onemocnění:", "Otázka pro MDT:").
import type { Citation } from '../types.ts';
import { czDate, labeledBlock, labeledLine, locateQuote, section, sentences } from './text.ts';
import { docKind, isAddendum, type Doc, type RuleField } from './rules.ts';

export { sentences };

function citeAll(doc: Doc, quotes: string[]): Citation[] {
  return quotes.map((q) => locateQuote(doc.text, q)).filter((q): q is string => q !== null).map((quote) => ({ docId: doc.id, quote }));
}

function latestReferral(docs: Doc[]): Doc | undefined {
  return docs.filter((d) => docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
}

const HISTORY_LABEL = /^(Anamnéza onemocnění|Nynější onemocnění|NO|Epikríza|Průběh onemocnění)\s*:/;
const QUESTION_LABEL = /^(Otázka pro MDT|Otázka na MDT|Dotaz pro MDT|Požadavek na MDT|Požadavek\/otázka na MDT|Otázka pro konzilium)\s*:/;
const WISH_LABEL = /^(Přání pacienta|Přání pacientky|Přání|Jiná sdělení|Jiná důležitá sdělení)\s*:/;

/** History of the illness: "EPIKRÍZA" section or a labelled block ("Anamnéza onemocnění:", "NO:"). */
function historyBlock(doc: Doc): string | null {
  return section(doc.text, /^EPIKRÍZA/) ?? labeledBlock(doc.text, HISTORY_LABEL);
}

export function diagnosisFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const histos = docs.filter((d) => docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date));
  const histo = histos.find((d) => !isAddendum(d)) ?? histos[0];
  const parts: string[] = [];
  const citations: Citation[] = [];
  const susp = ref ? labeledLine(ref.text, /^(Suspektní diagnóza|Pracovní diagnóza|Diagnóza|Dg\.)\s*:/) : null;
  if (ref && susp) {
    const suspected = /^(Suspektní|Pracovní)/.test(susp.line) || /\bsusp/i.test(susp.value);
    parts.push(`${susp.value} (${suspected ? 'podezření v žádance' : 'v žádance'}, ${czDate(ref.date)})`);
    citations.push(...citeAll(ref, [susp.line]));
  }
  const z = histo ? section(histo.text, /^ZÁVĚR/)?.split('\n')[0] : undefined;
  if (histo && z) { parts.push(`histologicky: ${z} (${czDate(histo.date)})`); citations.push(...citeAll(histo, [z])); }
  if (!parts.length) return { value: '', citations: [], status: 'missing', note: 'Diagnóza není v dokumentaci uvedena.' };
  return { value: parts.join('; '), citations, sourceDate: histo?.date ?? ref?.date };
}

const KEY_FINDING = /(ložisk|tumor|nádor|karcinom|malign|histolog|metast|cholest|\bCT\b|\bMR\b|\bMRI\b|\bPET\b|\b[cpy]?T[0-4]|\bmrT\d)/i;
const ONSET = /^(Od |Asi |Přibližně |Před )|(od poloviny|trvající|anamnéz|měsíční|týdenní)/i;

/** Onset of complaints + sentences with key findings, in document order (max 4); first 3 sentences otherwise. */
export function epicrisisFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const block = ref ? historyBlock(ref) : null;
  if (!ref || !block) return { value: '', citations: [], status: 'missing', note: 'Epikríza není k dispozici.' };
  const all = sentences(block);
  const onset = all.findIndex((s) => ONSET.test(s));
  const picked = all.filter((s, i) => i === onset || KEY_FINDING.test(s)).slice(0, 4);
  const s = picked.length >= 2 ? picked : all.slice(0, 3);
  return { value: s.join(' '), citations: citeAll(ref, s), sourceDate: ref.date };
}

export function mdtQuestionFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  if (!ref) return { value: '', citations: [], status: 'missing', note: 'Otázka pro konzilium není v žádance uvedena.' };
  const zadost = section(ref.text, /^ŽÁDOST/);
  let ask = zadost ? sentences(zadost).find((s) => /^(Žádám|Prosím|Žádost)/.test(s)) : undefined;
  if (!ask) {
    const q = labeledBlock(ref.text, QUESTION_LABEL);
    ask = q ? sentences(q).slice(0, 2).join(' ') : undefined;
  }
  if (!ask) return { value: '', citations: [], status: 'missing', note: 'Otázka pro konzilium není v žádance uvedena.' };
  const general = /(stanovení dalšího postupu|další postup|dalšího postupu)/i.test(ask);
  return {
    value: ask,
    citations: citeAll(ref, sentences(ask)),
    sourceDate: ref.date,
    note: general ? 'Otázka je obecná (dokončit diagnostiku a určit postup) – lékař KOC ji před konziliem může upřesnit.' : undefined,
  };
}

const SYMPTOM = /(bolest|teplot|horečk|tmavší moč|nechutenství|úbyt|ikter|únav|unav|zvracen|nauze|hubn|kašel|kašl|hemopt|dušnost|chrapot|pocení|krv|hematoch|meléna|stolic|vyprázd|vyprazd|defekač|zácp|průjm|anémi)/i;

export function symptomsFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  const block = ref ? [historyBlock(ref), labeledBlock(ref.text, /^Současný stav\s*:/)].filter(Boolean).join('\n') : '';
  if (!ref || !block) return { value: '', citations: [], status: 'missing', note: 'Příznaky nejsou popsány.' };
  const hits = sentences(block).filter((s) => SYMPTOM.test(s)).slice(0, 4);
  if (!hits.length) return { value: '', citations: [], status: 'missing', note: 'Příznaky nejsou popsány.' };
  return { value: hits.join(' '), citations: citeAll(ref, hits), sourceDate: ref.date };
}

const OTHER = /(Upozorňuji|úzkost|psycholog|informován|souhlasí|přeje|přání|stomi|pečuje)/i;

export function otherNotesFallback(docs: Doc[]): RuleField {
  const ref = latestReferral(docs);
  if (!ref) return { value: '', citations: [], status: 'missing', note: 'Žádné další informace.' };
  const block = [section(ref.text, /^ŽÁDOST/), labeledBlock(ref.text, WISH_LABEL)].filter(Boolean).join('\n');
  const hits = [...new Set(sentences(block).filter((s) => OTHER.test(s)))];
  if (!hits.length) return { value: '', citations: [], status: 'missing', note: 'Žádné další informace ani přání pacienta.' };
  return { value: hits.join(' '), citations: citeAll(ref, hits), sourceDate: ref.date };
}
