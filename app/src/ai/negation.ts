// Guard against a flipped meaning, after NegEx (Chapman et al. 2001), adapted to Czech.
// An AI proposal can cite the right sentence and still say the opposite: "souhlasí" → "nesouhlasí",
// "s perineurální invazí" → "bez perineurální invaze", "UZ prokázalo ložisko" → "UZ vyloučilo ložisko",
// "Teploty od září neměla" → "teploty přetrvávají". Numbers and verbatim quotes do not catch this.
// Each clause of the proposal is compared with the cited clause it is built from (most shared words, then the
// newest report and the later sentence): when a word is negated in one and not in the other, the proposal is rejected.
/** Negation of the words after it, to the end of the clause: "bez ložisek", "ne hmatná". */
const FORWARD = new Set(['bez', 'ne', 'nikoli', 'nikoliv', 'ani']);
/** Negation of the whole clause (Czech puts the negating word anywhere): "játra nezvětšena", "UZ vyloučilo ložisko",
 *  "CK20 negativní", "bolesti na hrudi neguje", "žádné metastázy". Words starting with "ne" are handled separately. */
const WHOLE = /^(žádn|vylouč|vyluč|negativ|neg$|neguj|popír|absenc)/;
/** Words starting with "ne" that are not negations: symptoms, specialties, institutions, conjunctions, superlatives. */
const NOT_NEGATION = /^ne(chut|voln|spav|moc|uro|fro|fre|oadj|opl|kr|utr|rv|bul|dávn|děl|odklad|zbyt|prodl|het|hty)|^ne(bo|boť|li|ž|ch)$|^nej(?!asn|ist|sou)/;
const STOP = new Set(['a', 'i', 'o', 'u', 'k', 'ke', 's', 'se', 'si', 'v', 've', 'z', 'ze', 'na', 'do', 'od', 'po', 'pro', 'při', 'za', 'před', 'pod',
  'nad', 'mezi', 'je', 'jsou', 'byl', 'byla', 'bylo', 'byly', 'být', 'jako', 'který', 'která', 'které', 'kterou', 'jež', 'to', 'ten', 'ta', 'tak',
  'též', 'také', 'již', 'už', 'dnes', 'nyní', 'cca', 'asi', 'jen', 'pouze', 'další', 'dále', 'stále', 'nadále', 'velmi', 'poté', 'pak', 'tedy',
  'dle', 'podle', 'vzhledem', 'aby', 'než', 'nebo', 'jeho', 'její', 'jejich']);
/** Time words are the frame of a statement, never what is negated ("Teploty od září neměla" = "od září bez teplot"). */
const TIME = /^(led[en]|únor|břez|dub[en]|květ|červ|srp[en]|září|říj|listop|prosin|týd|měsíc|rok|roce|den|dne|dny|dní|hodin|minut|ráno|večer|noc|včera|zítra|tehdy|později|dříve|naposledy|předem)/;
const CLAUSE_SPLIT = /[,;:()[\]]|\s[–—-]\s|\s(?:ale|avšak|však|kromě)\s/;
/** Sentence end: a full stop after a letter (not a date "17. 9. 2026") followed by a capital – also after "4R." or "kg.". */
const SENTENCE_END = /(?<=[^\d\s.]\.)\s+(?=\p{Lu})|\n+/u;

function isNeWord(lower: string): boolean {
  return lower.length >= 4 && lower.startsWith('ne') && !NOT_NEGATION.test(lower);
}

/** Polarity of a word in a clause; null when the clause has it both negated and not (then it decides nothing). */
interface Polarity { negated: boolean | null; word: string; at: number }
interface Clause { text: string; stems: Map<string, Polarity>; order: string; cues: number[] }

/** Words of a clause with their polarity. Stem = first 5 letters (Czech inflection), "ne-" removed from negated words. */
function clause(text: string, order: string): Clause {
  const raw = text.normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const low = raw.map((w) => w.toLocaleLowerCase('cs'));
  // an odd number of whole-clause negations negates the clause ("nelze vyloučit" = still possible)
  let negated = low.filter((w) => WHOLE.test(w) || isNeWord(w)).length % 2 === 1;
  const stems = new Map<string, Polarity>();
  const cues: number[] = [];
  low.forEach((w, i) => {
    if (FORWARD.has(w) || WHOLE.test(w) || isNeWord(w)) cues.push(i);
    if (FORWARD.has(w)) { negated = !negated; return; }
    if (/\p{N}/u.test(w) || STOP.has(w) || WHOLE.test(w)) return;
    const base = isNeWord(w) ? w.slice(2) : w;
    if (TIME.test(base)) return;
    const abbreviation = raw[i].length >= 2 && raw[i].length <= 5 && raw[i] === raw[i].toUpperCase();
    if (base.length < 4 && !abbreviation) return;
    const stem = base.slice(0, 5);
    const seen = stems.get(stem);
    if (!seen) stems.set(stem, { negated, word: raw[i], at: i });
    else if (seen.negated !== negated) seen.negated = null;
  });
  return { text: text.trim(), stems, order, cues };
}

function clauses(text: string, order: string): Clause[] {
  return text.split(SENTENCE_END).flatMap((s, i) => s.split(CLAUSE_SPLIT).map((c, j) => clause(c, `${order}|${String(i).padStart(3, '0')}|${String(j).padStart(2, '0')}`)))
    .filter((c) => c.stems.size > 0);
}

export interface CitedText { docId: string; date: string; quote: string; at: number }
export interface Flip { word: string; quoteWord: string; docId: string; clause: string; proposalNegated: boolean }

const distance = (at: number, cues: number[]) => Math.min(...cues.map((c) => Math.abs(c - at)), 99);

/** A word whose negation differs between the proposal and the cited clause it comes from; null when none.
 *  Of several such words in one clause, the one closest to the negation is reported. */
export function negationFlip(value: string, cited: CitedText[]): Flip | null {
  const quoteClauses = cited.flatMap((c) => clauses(c.quote, `${c.date}|${String(c.at).padStart(7, '0')}`).map((cl) => ({ ...cl, docId: c.docId })));
  for (const vc of clauses(value, '')) {
    let found: Flip | null = null;
    let foundDist = Infinity;
    for (const [stem, v] of vc.stems) {
      let best: (typeof quoteClauses)[number] | undefined;
      let bestScore = -1;
      for (const qc of quoteClauses) {
        if (!qc.stems.has(stem)) continue;
        let score = 0;
        for (const s of vc.stems.keys()) if (qc.stems.has(s)) score++;
        if (score > bestScore || (score === bestScore && best && qc.order > best.order)) { best = qc; bestScore = score; }
      }
      const q = best?.stems.get(stem);
      if (best && q && v.negated !== null && q.negated !== null && q.negated !== v.negated) {
        const dist = v.negated ? distance(v.at, vc.cues) : distance(q.at, best.cues);
        if (dist < foundDist) { found = { word: v.word, quoteWord: q.word, docId: best.docId, clause: best.text, proposalNegated: v.negated }; foundDist = dist; }
      }
    }
    if (found) return found;
  }
  return null;
}
