// Text without headings: a referral typed as running sentences, e.g. "posílám pana Karla Dvořáka, nar. 3. 4. 1958,
// pojišťovna VZP (111), tel. 731 222 333 … Užívá metformin 1000 mg 1-0-1. Alergie: penicilin." The structured rules
// read labels at the start of a line and capital headings; these patterns read the same facts inside sentences.
// They only fill fields the structured rules left empty, and every value is a verbatim piece of the text.
import type { Citation, Exam, LabRow } from '../types.ts';
import { czDate, findDates, isHeading, lines, locateQuote } from './text.ts';
import { insurerName, type Doc, type RuleField } from './rules.ts';

const LABEL_LINE = /^\p{Lu}[\p{L}.]*(?:\s+[\p{L}.()+/-]+){0,3}\s*:(?:\s|$)/u;

/** A report with no capital headings and at most one "Label:" line at the start of a line (banner excluded). */
export function isPlainText(doc: Doc): boolean {
  const ls = lines(doc.text).filter((l) => !/^FIKTIVN/i.test(l));
  return !ls.some(isHeading) && ls.filter((l) => LABEL_LINE.test(l)).length <= 1;
}

function field(doc: Doc, value: string, quote: string, note?: string): RuleField | null {
  const q = locateQuote(doc.text, quote.trim());
  const v = value.trim().replace(/[.,;]$/, '');
  return q && v ? { value: v, citations: [{ docId: doc.id, quote: q }], sourceDate: doc.date, note } : null;
}

const ABBREV = /(?<!\p{L})(?:MUDr|MDDr|Dr|Mgr|Bc|Ing|doc|prof|tel|nar|č|tj|např|cca|resp|tzv|tbl|max|min|susp|dg|st|p|poj|pojišť|mob|odd|ul|vs|event|příp|pozit|negat|intermit|subj|obj|histol|cytol|lab|chron|bilat|art|hm|v|k|l)\.$/u;

/** Sentences of free text: a full stop followed by a capital ends a sentence ("… na MDT. Kontakt …", "ECOG 1. Žádám …"),
 *  but not a date ("3. 4. 1958" – a digit follows) nor an abbreviation ("MUDr. Eva", "nar. 3. 4."). */
function sentences(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    let start = 0;
    for (const m of line.matchAll(/\.\s+(?=\p{Lu})/gu)) {
      const at = m.index ?? 0;
      if (ABBREV.test(line.slice(Math.max(0, at - 6), at + 1))) continue;
      out.push(line.slice(start, at + 1).trim());
      start = at + m[0].length;
    }
    if (line.slice(start).trim()) out.push(line.slice(start).trim());
  }
  return out.filter(Boolean);
}

const GREETING = /^(Dobrý den|Vážen\p{L}* (?:kolegové|kolegyně|kolego|paní doktorko|pane doktore)|Milá kolegyně|Milý kolego|Ahoj)[,!]?\s*/iu;

/** Sentences of the letter without greeting, signature and doctor's header. */
function body(doc: Doc): string[] {
  return sentences(doc.text).map((s) => s.replace(GREETING, ''))
    .filter((s) => s && !/^(FIKTIVN|S pozdravem|Děkuji|MUDr\.|MDDr\.|Ordinace|Ambulance)/i.test(s));
}

const NAME = '\\p{Lu}[\\p{Ll}\'-]+';
const TITLES = '(?:(?:Ing|Mgr|Bc|MUDr|JUDr|PhDr|RNDr|doc|prof)\\.\\s+)*';
const NAME_NOM = new RegExp(`(?<!\\p{L})(pacientka|pacient|paní|pan|Pí|pí)\\s+${TITLES}(${NAME})\\s+(${NAME})`, 'u');
const NAME_OTHER_CASE = new RegExp(`(?<!\\p{L})(pana|panu|panem|pacienta|pacientku|pacientky|pacientce|pacientem|paní|Pí|pí)\\s+${TITLES}(${NAME})\\s+(${NAME})`, 'u');
const SOFT = '[šřžčjťďňcl]';

/** 1st-case candidates of a declined Czech name, only the regular patterns ("Bohumila" → "Bohumil",
 *  "Šindeláře" → "Šindelář", "Křížovou" → "Křížová", "Alenu" → "Alena"); irregular forms give nothing. */
function nominatives(word: string, female: boolean, surname: boolean): string[] {
  const w = word;
  if (female) {
    if (surname) return /ovou$|ové$/.test(w) ? [w.replace(/(ovou|ové)$/, 'ová')] : /ou$|é$/.test(w) ? [w.replace(/(ou|é)$/, 'á')] : [];
    if (/ii$/.test(w)) return [w.replace(/ii$/, 'ie')];
    if (/u$/.test(w)) return [w.replace(/u$/, 'a')];
    return /[^aeiouyáéíóúůý]$/i.test(w) ? [w] : [];   // "Dagmar" stays
  }
  if (/ého$/.test(w)) return [w.replace(/ého$/, 'ý')];
  if (/ího$/.test(w)) return [w.replace(/ího$/, 'í')];
  if (surname && /[^aeiouyáéíóúůý]u$/i.test(w)) return [w.replace(/u$/, 'a')];          // Svobodu → Svoboda
  if (new RegExp(`[aeiouyáéíóúůý]${SOFT}e$`, 'iu').test(w)) return [w.replace(/e$/, '')]; // Šindeláře → Šindelář
  if (/[aeiouyáéíóúůý][^aeiouyáéíóúůý]a$/i.test(w)) return [w.replace(/a$/, '')];       // Bohumila → Bohumil
  return [];
}

/** A whole word somewhere in the text (the 1st case used later in the letter: "pan Kratochvíl o podezření ví"). */
function wordIn(text: string, word: string): string | null {
  const m = text.match(new RegExp(`(?:(?:pan|paní|Pan|Paní|pacient|pacientka)\\s+)?(?<!\\p{L})${word}(?!\\p{L})`, 'u'));
  return m ? m[0] : null;
}

function name(doc: Doc): { first: RuleField | null; last: RuleField | null; note?: string } | null {
  const m = doc.text.match(NAME_NOM);
  // "paní" does not decline, the name after it may: "paní Marii Svobodovou" is not the 1st case
  const female = (cue: string) => /^(paní|pí|pacientk)/i.test(cue);
  const ok = m && (!/^(paní|pí)$/i.test(m[1]) || (/á$/.test(m[3]) && !/(u|ii|ě|y)$/.test(m[2]))) && !/(ovi|em|ou)$/.test(m[3]);
  if (m && ok) {
    const first = field(doc, m[2], m[0]);
    const last = field(doc, m[3], m[0]);
    if (first && last) return { first, last };
  }
  const o = doc.text.match(NAME_OTHER_CASE);
  if (!o) return null;
  const f = female(o[1]);
  const pick = (word: string, surname: boolean): RuleField | null => {
    for (const cand of nominatives(word, f, surname)) {
      const seen = cand !== word ? wordIn(doc.text, cand) : null;
      if (seen) return field(doc, cand, seen);
      if (cand === word) return field(doc, cand, o[0]);
    }
    const cand = nominatives(word, f, surname)[0];
    return cand ? field(doc, cand, o[0], `Převedeno do 1. pádu z „${o[0]}“ – ověřte.`) : null;
  };
  const first = pick(o[2], false);
  const last = pick(o[3], true);
  return { first, last, note: first && last ? undefined : `Jméno je v textu jen v jiném pádě („${o[0]}“) – nepravidelný tvar nepřevádíme, doplní člověk.` };
}

function sex(doc: Doc): RuleField | null {
  const m = doc.text.match(/(?<!\p{L})(pan|pana|panu|panem|paní|Pí|pí)\s+\p{Lu}/u) ?? doc.text.match(/(?<!\p{L})(pána)(?!\p{L})/u);
  if (!m) return null;
  const female = /^(paní|pí)$/i.test(m[1]);
  return field(doc, female ? 'žena' : 'muž', m[0].replace(/\s+\p{Lu}$/u, ''), `Podle oslovení „${m[1]}“ v textu.`);
}

function age(doc: Doc): RuleField | null {
  const y = doc.text.match(/\((\d{1,3})\s?let(?!\p{L})|(?<!\p{L})(?:je mu|je jí|ve věku)\s+(\d{1,3})(?:\s?let)?(?!\p{L})/u);
  if (y) return field(doc, `${y[1] ?? y[2]} let`, y[0].replace(/^\(/, ''));
  const m = doc.text.match(/(?<!\p{L})nar(?:\.|ozen[áaý]?)\s*:?\s*(\d{1,2}\.\s?\d{1,2}\.\s?(?:19|20)\d{2})/u);
  if (m) return field(doc, `nar. ${m[1]}`, m[0], 'Věk není uveden, jen datum narození – nepočítáme ho.');
  const r = doc.text.match(/(?<!\p{L})ročník\s+((?:19|20)\d{2})/u);
  return r ? field(doc, `ročník ${r[1]}`, r[0], 'Věk není uveden, jen ročník – nepočítáme ho.') : null;
}

const INSURER_RE = /(?<!\p{L})(?:[Pp]ojišťovn\p{L}*|[Pp]ojištěn\p{L}*|[Pp]ojišť\.|[Pp]oj\.|ZP|VZP|VoZP|ČPZP|OZP|ZPŠ|RBP)(?!\p{L})[^.\n\d]{0,25}?\(?\s*(\d{3})(?!\d)/gu;

function insurer(doc: Doc): RuleField | null {
  for (const m of doc.text.matchAll(INSURER_RE)) {
    const n = insurerName(m[1]);
    if (n) return field(doc, m[1], m[0], `${m[1]} = ${n}${m[1] !== '111' ? ' – není VZP' : ''}.`);
  }
  const named = doc.text.match(/(?<!\p{L})(VZP|VoZP|ČPZP|OZP|ZPŠ|RBP|ZP MV ČR)(?!\p{L})/u);
  return named ? field(doc, named[1], named[0], 'Kód pojišťovny není uveden – ověřit.') : null;
}

/** A phone number, with or without "tel." in front ("na čísle +420 776 902 341", "telefon na ni je 721 640 593"). */
const PHONE_RE = /(?:(?<!\p{L})(?:tel\.?|telefon\p{L}*|mobil\p{L}*|mob\.)\s*:?\s*)?(?<!\d)((?:\+420\s?)?\d{3}[\s-]?\d{3}[\s-]?\d{3})(?!\d)/giu;
const RELATIVE = /(manžel|dcer|syn(?!\p{L}*dr)|sestr|bratr|partner|druh|družk|vnuk|vnučk|kontakt na|kontaktní osob|příbuzn|matk|otec|otc|snach|zeť)/iu;
const DOCTOR = /(MUDr\.|MDDr\.|ordinac|ambulanc|praktick\p{L}* lékař|IČP|IČO)/iu;

function phones(doc: Doc): { patient: RuleField | null; contact: RuleField | null } {
  let patient: RuleField | null = null;
  let contact: RuleField | null = null;
  for (const s of body(doc)) {
    if (DOCTOR.test(s)) continue;
    let from = 0;
    for (const m of s.matchAll(PHONE_RE)) {
      const at = m.index ?? 0;
      const segment = s.slice(from, at + m[0].length).replace(/^[\s,;]+/, '');
      from = at + m[0].length;
      const rel = segment.match(RELATIVE);
      if (rel) { const from = segment.slice(rel.index); contact ??= field(doc, from, from); continue; }
      if (!patient) {
        const email = s.match(/[\w.+-]+@[\w-]+\.[\w.-]*\w/)?.[0];
        patient = field(doc, `tel. ${m[1]} · ${email ? `e-mail ${email}` : 'e-mail neuveden'}`, m[0], email ? undefined : 'E-mail pacienta v textu není.');
      }
    }
  }
  return { patient, contact };
}

const NEGATIVE = /^(neguje|neudává|nejsou|není|nezn[aá]m|bez\b|0\b)/iu;

function allergies(doc: Doc): RuleField | null {
  const none = doc.text.match(/(?<!\p{L})bez (?:známých )?alergi\p{L}*/iu);
  if (none) return field(doc, none[0], none[0], 'Alergie neuvedeny.');
  const m = doc.text.match(/(?<!\p{L})(?:Alergie|alergie|AA|Alergická anamnéza|alergick\p{L}*)\s*:?\s*(?:na\s+)?([^.;\n]+)/u);
  if (!m) return null;
  return NEGATIVE.test(m[1]) ? field(doc, m[0], m[0], 'Alergie pacient neguje.') : field(doc, m[1], m[0]);
}

const DOSE = /\d+(?:[,.]\d+)?\s?(?:mg|µg|mcg|g|ml|IU|j\.|tbl)(?!\p{L})/u;

function medication(doc: Doc): RuleField | null {
  for (const s of body(doc)) {
    const m = s.match(/(?<!\p{L})(?:užívá|Užívá|užívající|bere|Bere|FA|Medikace|medikace|Léky|léky|Z léků|z léků|[Nn]a lécích má|Chronická medikace|Trvalá medikace)(?!\p{L})\s*:?\s*(.+)$/u);
    if (!m || !DOSE.test(m[1])) continue;
    const list = m[1].replace(/[,;]\s*(?:alergi|AA\b|bez alergi).*$/iu, '');
    return field(doc, list, list);
  }
  return null;
}

const MODALITY = /(?<!\p{L})(CT|MR|MRI|RTG|UZ|USG|SONO|PET\/CT|PET|EUS|ERCP|gastroskopi\p{L}*|koloskopi\p{L}*|kolonoskopi\p{L}*|bronchoskopi\p{L}*|mamografi\p{L}*|scintigrafi\p{L}*|endoskopi\p{L}*)(?!\p{L})(?:\s+(břicha|hrudníku|hrudníku a břicha|plic|pánve|malé pánve|jater|mozku|krku|ledvin|prsu|prsů|skeletu|páteře))?/u;
const PLANNED = /(objednán|objednan|plánován|naplánován|proběhne|bude provedeno|budeme|termín)/iu;
const MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
const WORD_DATE = new RegExp(`(?<!\\d)(\\d{1,2})\\.\\s?(${MONTHS.join('|')})(?:\\s+(\\d{4}))?`, 'u');

/** First date of a text as written, also "18. 9." (year of the letter) and "2. září"; iso is for sorting only. */
function dateIn(text: string, docDate: string): { iso: string; raw: string; yearAdded: boolean } | null {
  const full = findDates(text)[0];
  if (full) return { iso: full.iso, raw: full.raw, yearAdded: false };
  const n = text.match(/(?<!\d)(\d{1,2})\.\s?(\d{1,2})\.(?!\s?\d)/);
  const w = text.match(WORD_DATE);
  const hit = n && (!w || (n.index ?? 0) <= (w.index ?? 0)) ? { d: +n[1], m: +n[2], y: undefined as number | undefined, raw: n[0] }
    : w ? { d: +w[1], m: MONTHS.indexOf(w[2]) + 1, y: w[3] ? +w[3] : undefined, raw: w[0] } : null;
  if (!hit || hit.d < 1 || hit.d > 31 || hit.m < 1 || hit.m > 12) return null;
  const docYear = +docDate.slice(0, 4);
  const y = hit.y ?? (hit.m > +docDate.slice(5, 7) ? docYear - 1 : docYear);
  return { iso: `${y}-${String(hit.m).padStart(2, '0')}-${String(hit.d).padStart(2, '0')}`, raw: hit.raw, yearAdded: !hit.y };
}

function exams(doc: Doc): { field: RuleField; exams: Exam[] } | null {
  const out: Exam[] = [];
  const shown: string[] = [];
  const citations: Citation[] = [];
  let yearAdded = false;
  for (const s of body(doc)) {
    if (PLANNED.test(s)) continue;
    // one sentence may name several exams: "RTG plic 20. 9. 2026: infiltrát …, CT hrudníku 29. 9. 2026 tumor 35 mm."
    const hits = [...s.matchAll(new RegExp(MODALITY.source, 'gu'))];
    hits.forEach((m, i) => {
      const segment = s.slice(m.index ?? 0, hits[i + 1]?.index ?? s.length).replace(/[\s,;]+$/, '');
      const date = dateIn(segment, doc.date);
      const q = date ? locateQuote(doc.text, segment) : null;
      if (!date || !q) return;
      yearAdded ||= date.yearAdded;
      out.push({ date: date.iso, place: '', type: m[0], summary: q, docId: doc.id });
      shown.push(`${date.raw} · ${m[0]} – ${q}`);
      citations.push({ docId: doc.id, quote: q });
    });
  }
  if (!out.length) return null;
  const order = out.map((_, i) => i).sort((a, b) => out[a].date.localeCompare(out[b].date));
  return {
    field: {
      value: order.map((i) => shown[i]).join('\n'), citations, sourceDate: doc.date,
      note: `Vyšetření jsou zmíněna jen v textu žádanky – původní zprávy je třeba vyžádat.${yearAdded ? ' U data bez roku je pro řazení použit rok žádanky.' : ''}`,
    },
    exams: order.map((i) => out[i]),
  };
}

const MARKER = /(?<!\p{L})(CA[\s-]?19-9|CA[\s-]?125|CA[\s-]?15-3|CA[\s-]?72-4|CEA|AFP|PSA|NSE|HE4|CYFRA(?:\s?21-1)?|bilirubin\p{L}*|hemoglobin|Hb|CRP|ALP|GGT|ALT|AST|kreatinin)\s*:?\s*(?:je\s+|byl[ao]?\s+|vyšel\s+|vyšla\s+|vyšlo\s+)?([<>]?\s?\d+(?:[,.]\d+)?)\s*(kU\/l|U\/ml|µg\/l|ng\/ml|IU\/ml|µmol\/l|mmol\/l|g\/l|mg\/l|µkat\/l)?/gu;

function labs(doc: Doc): { field: RuleField; labs: LabRow[] } | null {
  const rows: LabRow[] = [];
  const citations: Citation[] = [];
  for (const m of doc.text.matchAll(MARKER)) {
    const q = locateQuote(doc.text, m[0].trim());
    if (!q) continue;
    rows.push({ test: m[1], value: m[2].replace(/\s/g, ''), unit: m[3] ?? '', date: doc.date, lab: '', docId: doc.id });
    citations.push({ docId: doc.id, quote: q });
  }
  if (!rows.length) return null;
  return { field: { value: citations.map((c) => c.quote).join('; '), citations, sourceDate: doc.date, note: 'Hodnoty jen z textu žádanky, bez laboratorní zprávy.' }, labs: rows };
}

/** The first sentence of the letter that matches; value = the sentence itself. */
function sentenceField(doc: Doc, re: RegExp, note?: string, skip?: RegExp): RuleField | null {
  const s = body(doc).find((x) => re.test(x) && !(skip && skip.test(x)));
  return s ? field(doc, s, s, note) : null;
}

function sentencesField(doc: Doc, re: RegExp, max: number, skip?: RegExp, first?: RegExp): RuleField | null {
  const all = body(doc).filter((x) => !(skip && skip.test(x)));
  // the sentence where the story starts ("odeslána PL pro …", "od poloviny srpna …") goes in first, then the findings
  const start = first ? all.findIndex((x) => first.test(x)) : -1;
  const hits = all.filter((x, i) => i === start || re.test(x)).slice(0, max);
  const cites = hits.map((h) => locateQuote(doc.text, h)).filter((q): q is string => q !== null);
  return cites.length ? { value: cites.join(' '), citations: cites.map((quote) => ({ docId: doc.id, quote })), sourceDate: doc.date } : null;
}

const DIAGNOSIS = /(?<!\p{L})(dg\.|Dg\.|diagnóz\p{L}*|susp\.|suspektní\p{L}*|podezření\p{L}* na|suspekce)/u;
const MALIGNANCY = /(karcinom|adenokarcinom|nádor|tumor|malign|lymfom|sarkom|melanom|leukémi|myelom)/iu;
const REQUEST = /(?<!\p{L})(Prosím|prosím|Prosíme|prosíme|prosí|poprosit|poprosil[a]?|Žádám|žádám|Žádáme|žádáme|žádá)(?!\p{L})[^.]*?(převzetí|projednání|MDT|konzili|posouzení|stanovisk|indikac|KOC|zda|jestli)/u;
const ONSET = /(odeslán\p{L}*|přišl[ao]|přišel|(?<!\p{L})od (?:poloviny |začátku |konce )?(?:ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince|\d{1,2}\/\d{4})|před \p{L}+ (?:dny|týdny|měsíci)|subj\.)/iu;
const KEY_FINDING = /(ložisk|tumor|nádor|karcinom|malign|histolog|metast|cholest|stent|biops|zjištěn|potvrdil|(?<!\p{L})(?:CT|MR|PET|UZ|RTG|ERCP|EUS)(?!\p{L}))/iu;
const SYMPTOM = /(bolest|teplot|horečk|tmavší moč|nechutenství|úbyt|ikter|žlut|svědí|svědění|únav|zvracen|nauze|hubn|zhubl|kašel|kašl|kašle|vykašl|hemopt|dušnost|zadýchává|chrapot|pocení|krvácen|krev ve|meléna|enteroragi|tenesm|stolic|vyprázd|zácp|průjm|anémi|polykán|plnost|tlaku v|nadým|roste břicho|otok)/iu;
const OTHER = /(Upozorňuji|úzkost|vystrašen|obav|psycholog|informován|informovan|o podezření ví|o diagnóze ví|souhlasí|přeje|přání|stomi|pečuje|stará o|žije sám|žije sama)/iu;
const COMORBID = /(diabet|hypertenz|vysokým tlakem|tlakem|štítn|fibrilac|ICHS|ischemick|astma|CHOPN|hypotyre|hypertyre|hypercholest|dyslipid|osteopor|revmat|epilep|deprese|infarkt|CMP|léčí se s|se léčí s)/iu;
const FAMILY = /(?<!\p{L})(matka|otec|otce|matky|sestra|bratr|RA|manželk\p{L}*|manžel)(?!\p{L})/u;
const HISTOLOGY = /(histolog|histol\.|biopsi|cytolog)\p{L}*[^.]*(karcinom|adenokarcinom|malign|benign|lymfom|sarkom|negativ|G[1-3])/iu;
const WEIGHT = /(?<!\p{L})(?:váží|vážil[ao]?|hmotnost|hm\.|váha)\s*:?\s*(\d{2,3})\s?kg/iu;
const HEIGHT = /(?<!\p{L})(?:výška|výšce|výšky|měří|v\.)\s*:?\s*(\d{3})\s?cm/iu;
const KG_CM = /(?<!\d)(\d{2,3})\s?kg\s*\/\s*(\d{3})\s?cm/u;

function weightHeight(doc: Doc): RuleField | null {
  const both = doc.text.match(KG_CM);
  if (both) return field(doc, `${both[1]} kg · výška ${both[2]} cm (${czDate(doc.date)})`, both[0]);
  const w = doc.text.match(WEIGHT);
  const h = doc.text.match(HEIGHT);
  if (!w && !h) return null;
  const citations = [w, h].map((x) => (x ? locateQuote(doc.text, x[0]) : null)).filter((q): q is string => q !== null).map((quote) => ({ docId: doc.id, quote }));
  const value = `${w ? `${w[1]} kg` : 'váha neuvedena'} · ${h ? `výška ${h[1]} cm` : 'výška neuvedena'} (${czDate(doc.date)})`;
  return citations.length ? { value, citations, sourceDate: doc.date } : null;
}

export interface PlainResult { fields: Record<string, RuleField>; exams: Exam[]; labs: LabRow[]; notes: Record<string, string> }

/** Facts read from sentences of plain-text reports (newest first, first hit per field). */
export function plainFields(docs: Doc[]): PlainResult {
  const out: PlainResult = { fields: {}, exams: [], labs: [], notes: {} };
  const set = (key: string, f: RuleField | null) => { if (f && !out.fields[key]) out.fields[key] = f; };
  for (const doc of [...docs].filter(isPlainText).sort((a, b) => b.date.localeCompare(a.date))) {
    const n = name(doc);
    if (n) { set('firstName', n.first); set('lastName', n.last); if (n.note) { out.notes.firstName ??= n.note; out.notes.lastName ??= n.note; } }
    set('sex', sex(doc));
    set('age', age(doc));
    set('insurer', insurer(doc));
    const p = phones(doc);
    set('patientContact', p.patient);
    set('contactPerson', p.contact);
    set('allergies', allergies(doc));
    set('medication', medication(doc));
    const e = exams(doc);
    if (e && !out.fields.exams) { out.fields.exams = e.field; out.exams = e.exams; }
    const l = labs(doc);
    if (l && !out.fields.labs) { out.fields.labs = l.field; out.labs = l.labs; }
    set('diagnosis', sentenceField(doc, DIAGNOSIS, 'Diagnóza převzata doslovně z věty v žádance.') ?? sentenceField(doc, MALIGNANCY, 'Diagnóza převzata doslovně z věty v žádance.', REQUEST));
    set('mdtQuestion', sentenceField(doc, REQUEST));
    set('epicrisis', sentencesField(doc, KEY_FINDING, 4, REQUEST, ONSET));
    set('symptoms', sentencesField(doc, SYMPTOM, 4, REQUEST));
    set('other', sentencesField(doc, OTHER, 3));
    set('comorbidities', sentenceField(doc, COMORBID, undefined, FAMILY));
    set('histology', sentenceField(doc, HISTOLOGY));
    set('weightHeight', weightHeight(doc));
  }
  return out;
}
