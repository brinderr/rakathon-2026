// Deterministic part of the extractor ("pravidlá bez AI").
// Reads regular parts of Czech medical reports (header, contacts, weight, lab tables, conclusions) and checks
// dates for impossible combinations. Every value carries a verbatim quote located in the source text.
import type { Citation, Exam, ISODate, LabRow, Medication } from '../types.ts';
import { czDate, findDates, isHeading, labeledBlock, labeledLine, lines, locateQuote, section, sentences } from './text.ts';

export interface Doc { id: string; date: ISODate; title?: string; text: string }

export type DocKind = 'referral' | 'lab' | 'histology' | 'imaging' | 'procedure' | 'clinic' | 'other';

export interface Finding {
  id: string;
  severity: 'missing' | 'conflict' | 'info';
  fieldKey?: string;
  text: string;                 // plain Slovak sentence for the coordinator
  citations: Citation[];
}

/** Partial field produced by rules; merged into HandoverField later. */
export interface RuleField {
  value: string;
  citations: Citation[];
  note?: string;
  status?: 'proposed' | 'missing' | 'conflict';
  sourceDate?: ISODate;
  conflict?: { a: { value: string; citation: Citation }; b: { value: string; citation: Citation }; explain: string };
  request?: { to: string; channel: 'e-mail' | 'telefón' | 'eZpráva'; draft: string };
}

// ---------- helpers ----------

function cite(doc: Doc, quote: string): Citation | null {
  const exact = locateQuote(doc.text, quote);
  return exact ? { docId: doc.id, quote: exact } : null;
}

function cites(...c: (Citation | null)[]): Citation[] {
  return c.filter((x): x is Citation => x !== null);
}

export function docKind(doc: Doc): DocKind {
  const t = doc.text;
  const head = lines(t).slice(0, 14).join('\n');
  if (/Bioptick|Ústav patologie|Histologick[ýé] nález/i.test(t)) return 'histology';
  if (/Výsledky laboratorní(?:ho|ch) vyšetření|Laboratorní výsledky/i.test(head)) return 'lab';
  if (/Protokol o výkonu|Protokol endoskopick/i.test(t)) return 'procedure';
  if (/Výsledek vyšetření\s*[–-]/i.test(t) || /^(?:Vyšetření|Typ vyšetření)\s*:\s*(?:CT|MR|MRI|RTG|UZ|USG|PET|SONO|mamograf|scint)/im.test(t)) return 'imaging';
  if (/žád(?:ost|ám|áme) o (?:převzetí|projednání)|Otázka (?:pro|na) MDT/i.test(t)) return 'referral';
  if (/Epikríza|Žádost o vyšetření|Doporučení k vyšetření|Doporučuji na/i.test(t) && /praktick/i.test(t)) return 'referral';
  if (/Ambulantní zpráva|Zpráva klinického|Konziliární zpráva/i.test(t)) return 'clinic';
  return 'other';
}

/** Histology addendum ("Dodatek k bioptickému nálezu") – complements the original report, does not replace it. */
export function isAddendum(doc: Doc): boolean {
  return /^\s*Dodatek k bioptick/im.test(doc.text);
}

const KIND_LABEL: Record<DocKind, string> = {
  referral: 'žádanka', lab: 'laboratoř', histology: 'histologie', imaging: 'zobrazovací vyšetření', procedure: 'výkon', clinic: 'ambulantní zpráva', other: 'zpráva',
};

/** Facility of the report = first header line after the fictional-data banner (+ department when the 2nd line names one). */
export function facility(doc: Doc): string {
  const ls = lines(doc.text).filter((l) => !/^FIKTIVNÍ/i.test(l));
  const first = (ls[0] ?? '').replace(/\s*\(fiktivní\)\s*/i, '').trim();
  const second = (ls[1] ?? '').replace(/\s*[–-]\s*MUDr\..*$/, '').trim();
  const isDept = /(ambulance|oddělení|klinika|pracoviště|ústav|centrum)/i.test(second) && !/\d{3}/.test(second) && !/^MUDr/.test(second);
  return isDept ? `${first} – ${second}` : first;
}

/** Title of the report, e.g. "UZ břicha", "CT břicha a hrudníku s k. l., pankreatický protokol". */
export function docTitle(doc: Doc): string {
  const ls = lines(doc.text);
  for (const l of ls) {
    const m = l.match(/^(?:Výsledek vyšetření|Protokol o výkonu|Ambulantní zpráva)\s*[–-]\s*(.+)$/);
    if (m) return m[1];
  }
  const kind = docKind(doc);
  const vys = labeledLine(doc.text, /^(?:Vyšetření|Typ vyšetření)\s*:/);
  if (vys && kind === 'imaging') return vys.value.split(/\s{2,}/)[0];
  const vykon = labeledLine(doc.text, /^Výkon\s*:/);
  if (vykon && kind === 'procedure') return vykon.value.split(/[,;]|\s{2,}/)[0];
  for (const l of ls) {
    if (/^(Bioptický nález|Výsledky laboratorního vyšetření|Zpráva klinického psychologa|Epikríza.*)$/.test(l)) return l;
    const h = l.match(/^(BIOPTICKÝ NÁLEZ|DODATEK K BIOPTICKÉMU NÁLEZU|VÝSLEDKY LABORATORNÍCH VYŠETŘENÍ|AMBULANTNÍ ZPRÁVA|PROTOKOL ENDOSKOPICKÉHO VÝKONU)/);
    if (h) return h[1].charAt(0) + h[1].slice(1).toLocaleLowerCase('cs');
  }
  return KIND_LABEL[kind];
}

/** The report's own issue/exam date with the line it comes from. */
export function issueDate(doc: Doc): { iso: ISODate; quote: string } | null {
  const labels = [/^Datum vydání:/, /^Vydáno:/, /^Datum výkonu:/, /^Datum vyšetření:/, /^Datum:/];
  for (const re of labels) {
    const hit = labeledLine(doc.text, re);
    if (!hit) continue;
    const d = findDates(hit.line)[0];
    if (d) return { iso: d.iso, quote: hit.line.slice(0, d.index + d.raw.length) };
  }
  for (const re of [/(?:^|\s)(Datum vydání|Vydáno|Datum výkonu|Datum vyšetření)\s*:\s*/m]) {
    const m = doc.text.match(re);
    if (!m || m.index === undefined) continue;
    const from = m.index + m[0].indexOf(m[1]);
    const d = findDates(doc.text.slice(from, from + 40))[0];
    if (d) return { iso: d.iso, quote: doc.text.slice(from, from + d.index + d.raw.length) };
  }
  return null;
}

const INSURERS: Record<string, string> = {
  '111': 'Všeobecná zdravotní pojišťovna ČR (VZP)',
  '201': 'Vojenská zdravotní pojišťovna ČR',
  '205': 'Česká průmyslová zdravotní pojišťovna',
  '207': 'Oborová zdravotní pojišťovna zaměstnanců bank, pojišťoven a stavebnictví',
  '209': 'Zaměstnanecká pojišťovna Škoda',
  '211': 'Zdravotní pojišťovna ministerstva vnitra ČR',
  '213': 'Revírní bratrská pokladna, zdravotní pojišťovna',
};
export function insurerName(code: string): string | undefined { return INSURERS[code]; }

/** Prefer the referral (newest), then other reports, newest first. */
function byPreference(docs: Doc[]): Doc[] {
  const ref = docs.filter((d) => docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date));
  const rest = docs.filter((d) => docKind(d) !== 'referral').sort((a, b) => b.date.localeCompare(a.date));
  return [...ref, ...rest];
}

// ---------- identity and contacts ----------

const NAME_LABEL = /^(Pacientka|Pacient|Jméno a příjmení|Příjmení a jméno|Jméno pacienta|Jméno pacientky|Jméno)\s*:\s*(.+)$/m;
const NAME_WORD = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžäöü'-]+$/;
const TITLE = /^(?:MUDr|MDDr|Ing|Mgr|Bc|PhDr|JUDr|RNDr|doc|prof|Dr|DiS|Ph\.D|CSc)\.?,?$/i;

type IdKey = 'firstName' | 'lastName' | 'sex' | 'age' | 'insurer';

/** Name from a labelled line in one report: "Pacientka: Alena Procházková, RČ …", "Jméno a příjmení: NOVÁK Josef", "Jméno: … / Příjmení: …". */
function nameIn(doc: Doc): { first: string; last: string; quote: string } | null {
  const m = doc.text.match(NAME_LABEL);
  if (!m) return null;
  const line = m[0];
  const head = m[2].split(/[,;(]|\s+RČ\b|\s+r\. ?č\./)[0].trim();
  const words = head.split(/\s+/).filter((w) => !TITLE.test(w)).filter((w) => NAME_WORD.test(w));
  const upper = (w: string) => w === w.toLocaleUpperCase('cs') && /\p{Lu}{2}/u.test(w);
  let first = words[0];
  let last = words[1];
  if (words.length === 1 && /^Jméno/.test(m[1])) {
    const sur = labeledLine(doc.text, /^Příjmení\s*:/);
    if (sur && NAME_WORD.test(sur.value.split(/\s+/)[0])) {
      const q = locateQuote(doc.text, line);
      return q ? { first: words[0], last: sur.value.split(/\s+/)[0], quote: q } : null;
    }
  }
  if (!first || !last) return null;
  if ((upper(first) && !upper(last)) || m[1] === 'Příjmení a jméno') [first, last] = [last, first];
  const end = line.indexOf(words[1]) + words[1].length;
  const quote = locateQuote(doc.text, line.slice(0, end));
  return quote ? { first, last, quote } : null;
}

interface Cue { doc: Doc; quote: string; label: string }

/** Sex only from explicit wording: "Pacientka", "63letá", "Pohlaví: žena" (strong) or the generic label "Pacient:" (weak). Never from the name. */
function sexCues(docs: Doc[]): { female: Cue[]; male: Cue[]; weakMale: Cue[] } {
  const female: Cue[] = [];
  const male: Cue[] = [];
  const weakMale: Cue[] = [];
  for (const doc of docs) {
    const f = doc.text.match(/(?<!\p{N})\d{1,3}\s?-?\s?let[áa](?!\p{L})(?:\s+\p{L}+)?|[Pp]acientk(?:a|y|u|ou)(?!\p{L})|Pohlaví\s*:\s*(?:žena|ženské|F)(?!\p{L})/u);
    if (f) { const q = locateQuote(doc.text, f[0].trim()); if (q) female.push({ doc, quote: q, label: f[0].trim() }); }
    const mm = doc.text.match(/(?<!\p{N})\d{1,3}\s?-?\s?let[ýy](?!\p{L})(?:\s+\p{L}+)?|Pohlaví\s*:\s*(?:muž|mužské|M)(?!\p{L})/u);
    if (mm) { const q = locateQuote(doc.text, mm[0].trim()); if (q) male.push({ doc, quote: q, label: mm[0].trim() }); }
    const w = doc.text.match(/^Pacient\s*:/m);
    if (w) { const q = locateQuote(doc.text, w[0]); if (q) weakMale.push({ doc, quote: q, label: 'Pacient:' }); }
  }
  return { female, male, weakMale };
}

/** Identity fields, each found independently (a missing name must not hide age or insurer). Nothing is derived from the birth number. */
export function identity(docs: Doc[]): Record<IdKey, RuleField> {
  const missing = (note: string): RuleField => ({ value: '', citations: [], status: 'missing', note });
  const out: Record<IdKey, RuleField> = {
    firstName: missing('Jméno není uvedeno.'),
    lastName: missing('Příjmení není uvedeno.'),
    sex: missing('Pohlaví není ve zprávách výslovně uvedeno.'),
    age: missing('Věk není ve zprávách výslovně uveden.'),
    insurer: missing('Kód pojišťovny není uveden.'),
  };
  for (const doc of byPreference(docs)) {
    const n = nameIn(doc);
    if (!n) continue;
    const c = cites({ docId: doc.id, quote: n.quote });
    out.firstName = { value: n.first, citations: c };
    out.lastName = { value: n.last, citations: c };
    break;
  }

  const cues = sexCues(byPreference(docs));
  if (cues.female.length && cues.male.length) {
    const a = cues.female[0];
    const b = cues.male[0];
    out.sex = {
      value: 'žena', status: 'conflict', citations: cites({ docId: a.doc.id, quote: a.quote }),
      conflict: {
        a: { value: 'žena', citation: { docId: a.doc.id, quote: a.quote } },
        b: { value: 'muž', citation: { docId: b.doc.id, quote: b.quote } },
        explain: `Zpráva ${a.doc.id} uvádí „${a.label}“, zpráva ${b.doc.id} „${b.label}“ – ověřte, zda jde o stejného pacienta.`,
      },
    };
  } else if (cues.female.length) {
    const a = cues.female[0];
    out.sex = { value: 'žena', citations: cites({ docId: a.doc.id, quote: a.quote }), note: `Podle označení „${a.label}“ ve zprávě.` };
  } else if (cues.male.length) {
    const a = cues.male[0];
    out.sex = { value: 'muž', citations: cites({ docId: a.doc.id, quote: a.quote }), note: `Podle označení „${a.label}“ ve zprávě.` };
  } else if (cues.weakMale.length) {
    const a = cues.weakMale[0];
    out.sex = { value: 'muž', citations: cites({ docId: a.doc.id, quote: a.quote }), note: 'Jen podle obecného označení „Pacient:“ – ověřit.' };
  }

  for (const d of byPreference(docs)) {
    const born = labeledLine(d.text, /^Datum narození\s*:/);
    const yrs = born?.line.match(/\((\d{1,3})\s*let\)/);
    if (born && yrs) { out.age = { value: `${yrs[1]} let (nar. ${born.value.replace(/\s*\(.*\)$/, '')})`, citations: cites(cite(d, born.line)) }; break; }
    const vek = labeledLine(d.text, /^Věk\s*:/);
    const vn = vek?.value.match(/^(\d{1,3})\b/);
    if (vek && vn) { out.age = { value: `${vn[1]} let`, citations: cites(cite(d, vek.line)) }; break; }
    const inline = d.text.match(/(?<!\p{N})(\d{1,3})\s?-?\s?let[áýay](?!\p{L})/u);
    if (inline) { out.age = { value: `${inline[1]} let`, citations: cites(cite(d, inline[0])) }; break; }
  }
  if (out.age.status === 'missing') {
    for (const d of byPreference(docs)) {
      const born = labeledLine(d.text, /^Datum narození\s*:/);
      if (born) { out.age = { value: `nar. ${born.value}`, citations: cites(cite(d, born.line)), note: 'Věk není uveden, jen datum narození – nepočítáme ho.' }; break; }
    }
  }

  for (const d of byPreference(docs)) {
    const zp = d.text.match(/(?:Zdravotní pojišťovna|Pojišťovna|Kód ZP|ZP)\s*:?\s*(\d{3})\b/);
    if (!zp) continue;
    const name = INSURERS[zp[1]];
    out.insurer = {
      value: zp[1],
      citations: cites(cite(d, zp[0])),
      note: name
        ? `${zp[1]} = ${name}${zp[1] !== '111' ? ' – není VZP, souhrn pro revizního lékaře jde této pojišťovně' : ''}.`
        : 'Kód pojišťovny není v číselníku – ověřit.',
    };
    break;
  }
  return out;
}

export function contacts(docs: Doc[]): { patientContact: RuleField; contactPerson: RuleField; findings: Finding[] } {
  const findings: Finding[] = [];
  let patientContact: RuleField = { value: '', citations: [], status: 'missing', note: 'Telefon ani e-mail pacienta nejsou uvedeny.' };
  let contactPerson: RuleField = { value: '', citations: [], status: 'missing', note: 'Kontaktní osoba není uvedena.' };
  for (const doc of byPreference(docs)) {
    const tel = labeledLine(doc.text, /^(Telefon|Mobil|Kontakt na pacienta|Kontakt na pacientku|Tel\. pacienta)\s*:/);
    if (!tel || patientContact.value) continue;
    const phone = tel.value.match(/\+?\d{3}[\s-]?\d{3}[\s-]?\d{3}(?:[\s-]?\d{3})?/)?.[0];
    if (!phone) continue;
    // e-mail on the same line, or an "E-mail:" line in the patient block (below the phone, not the facility header)
    const inLine = tel.value.match(/[\w.+-]+@[\w-]+\.[\w.-]*\w/)?.[0];
    const below = doc.text.slice(doc.text.indexOf(tel.line)).match(/^E-?mail:\s*(\S+@\S+)/im);
    const email = inLine ?? below?.[1];
    const parts = [`tel. ${phone}`, email ? `e-mail ${email}` : 'e-mail neuveden'];
    patientContact = {
      value: parts.join(' · '),
      citations: cites(cite(doc, tel.line), !inLine && below ? cite(doc, below[0]) : null),
      note: email ? undefined : 'E-mail pacienta v dokumentaci chybí (zápis pro konzilium ho vyžaduje).',
    };
    if (!email) findings.push({ id: 'patient-email-missing', severity: 'missing', fieldKey: 'patientContact', text: 'Chybí e-mail pacienta – zápis pro konzilium (MDT_zapis) vyžaduje telefon i e-mail.', citations: [] });
  }
  for (const doc of byPreference(docs)) {
    const cp = labeledLine(doc.text, /^Kontaktní osoba:/);
    if (!cp) continue;
    contactPerson = { value: cp.value, citations: cites(cite(doc, cp.line)) };
    break;
  }
  return { patientContact, contactPerson, findings };
}

/** Referring GP contact (needed by MDT_zapis: telefon, email). */
export function referringDoctor(docs: Doc[]): { name: string; phone?: string; email?: string; citations: Citation[]; findings: Finding[] } | null {
  const ref = docs.filter((d) => docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!ref) return null;
  const ls = lines(ref.text);
  const nameLine = ls.find((l) => /^MUDr\.\s/.test(l));
  const header = ref.text.split(/^Pacient(?:ka)?:/m)[0];
  const tel = header.match(/Tel\.?:\s*(\+?[\d ]{9,}\d)/) ?? ref.text.match(/Tel\.?:\s*(\+?[\d ]{9,}\d)/);
  const email = header.match(/[\w.+-]+@[\w-]+\.[\w.]*\w/);
  const findings: Finding[] = [];
  if (!email) findings.push({ id: 'gp-email-missing', severity: 'info', text: 'Chybí e-mail odesílajícího lékaře (zápis pro konzilium ho vyžaduje) – telefon je uveden.', citations: cites(tel ? cite(ref, tel[0]) : null) });
  return {
    name: nameLine ?? '',
    phone: tel?.[1].trim(),
    email: email?.[0],
    citations: cites(nameLine ? cite(ref, nameLine) : null, tel ? cite(ref, tel[0]) : null),
    findings,
  };
}

// ---------- body measures, status, allergies, medications ----------

const WEIGHT_RE = /(?:[Hh]motnost|[Vv]áha)\s+(\d{2,3})\s?kg/g;

export function weightHeight(included: Doc[], excluded: Doc[], asOf: ISODate): RuleField {
  const weights: { kg: string; doc: Doc; quote: string }[] = [];
  const heights: { cm: string; doc: Doc; quote: string }[] = [];
  for (const doc of included) {
    for (const m of doc.text.matchAll(WEIGHT_RE)) weights.push({ kg: m[1], doc, quote: m[0] });
    for (const m of doc.text.matchAll(/[Vv]ýška\s+(\d{3})\s?cm/g)) heights.push({ cm: m[1], doc, quote: m[0] });
  }
  if (!weights.length && !heights.length) {
    return { value: '', citations: [], status: 'missing', note: 'Váha ani výška nejsou ve zprávách uvedeny.' };
  }
  weights.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  heights.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  const w = weights[0];
  const h = heights[0];
  const parts: string[] = [];
  if (w) parts.push(`${w.kg} kg (${czDate(w.doc.date)})`);
  else parts.push('váha neuvedena');
  if (h) parts.push(`výška ${h.cm} cm (${czDate(h.doc.date)})`);
  else parts.push('výška neuvedena');
  const notes: string[] = [];
  const older = weights.slice(1).filter((x) => x.kg !== w?.kg);
  if (older.length) notes.push(`Dříve: ${older.map((x) => `${x.kg} kg (${czDate(x.doc.date)})`).join(', ')}.`);
  const later = excluded.flatMap((d) => [...d.text.matchAll(WEIGHT_RE)].map((m) => ({ kg: m[1], d })));
  if (later.length) notes.push(`Novější hodnota ${later.map((x) => `${x.kg} kg (zpráva ${x.d.id}, ${czDate(x.d.date)})`).join(', ')} vznikla až po ${czDate(asOf)}, proto do podkladu nepatří.`);
  if (!h) notes.push('Výška chybí.');
  return {
    value: parts.join(' · '),
    citations: cites(w ? cite(w.doc, w.quote) : null, h ? cite(h.doc, h.quote) : null, ...older.map((x) => cite(x.doc, x.quote))),
    note: notes.join(' ') || undefined,
    sourceDate: w?.doc.date,
  };
}

export function performanceStatus(included: Doc[], patientLabel: string, mdtDate: ISODate): { field: RuleField; finding?: Finding } {
  const scoreRe = /\bECOG\b[^\n]{0,20}\d|Karnofsk[^\n]{0,30}\d{2}|\bPS\s?[0-4]\b|\bWHO\s?(?:PS\s?)?[0-4]\b/;
  for (const doc of [...included].sort((a, b) => b.date.localeCompare(a.date))) {
    const m = doc.text.match(scoreRe);
    if (m) {
      const line = doc.text.split(/\r?\n/).find((l) => l.includes(m[0])) ?? m[0];
      const sentence = line.split(/(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/).find((x) => x.includes(m[0]))?.trim() ?? line.trim();
      return { field: { value: sentence, citations: cites(cite(doc, sentence)), sourceDate: doc.date } };
    }
  }
  const verbal = included.map((d) => ({ d, m: d.text.match(/[Ss]oběstačn[áéý]/) })).find((x) => x.m);
  const note = verbal?.m
    ? `Skóre ECOG ani Karnofsky není v žádné zprávě. Zpráva ${verbal.d.id} uvádí jen slovní popis „${verbal.m[0]}“ – to není skóre.`
    : 'Skóre ECOG ani Karnofsky není v žádné zprávě.';
  return {
    field: {
      value: '',
      citations: [],
      status: 'missing',
      note,
      request: {
        to: 'onkologická ambulance KOC / odesílající lékař',
        channel: 'e-mail',
        draft: `Dobrý den, před konziliem ${czDate(mdtDate)} prosíme o doplnění výkonnostního stavu (ECOG nebo Karnofsky) – ${patientLabel}. V dosavadní dokumentaci není uveden. Děkujeme, koordinátor KOC.`,
      },
    },
    finding: { id: 'ecog-missing', severity: 'missing', fieldKey: 'performance', text: note, citations: [] },
  };
}

const NEGATIVE_AA = /^(neguje|neudává|nejsou|není|nezn[aá]m|bez\b|0\b)/i;
const REACTION_RE = /(kopřivk\p{L}*|exantém\p{L}*|anafyla\p{L}*|alergick\p{L}* reakc\p{L}*)\s+(?:po|na)\s+([^.;,\n()]+)/iu;

/**
 * Allergies from all reports, not only the referral: an allergy found later (e.g. a reaction to contrast during CT)
 * must not be lost when a newer report copies "AA: neguje". Newer "neguje" after a documented allergy = conflict.
 */
export function allergies(included: Doc[]): { field: RuleField; finding?: Finding } {
  const negatives: { doc: Doc; line: string }[] = [];
  const positives: { doc: Doc; quote: string; allergen: string }[] = [];
  for (const doc of included) {
    const aa = labeledLine(doc.text, /^(AA|Alergie|Alergická anamnéza)\s*:/);
    if (aa && NEGATIVE_AA.test(aa.value)) negatives.push({ doc, line: aa.line });
    else if (aa) {
      const r = aa.value.match(REACTION_RE);
      positives.push({ doc, quote: aa.line, allergen: r ? r[0].replace(/\s+(?:při|v r|v roce)\b.*$/u, '').trim() : aa.value.replace(/\.$/, '') });
    }
    for (const m of doc.text.matchAll(/[^.\n]*alergi[ei]\s+na\s+([^.;\n()]+)[^.\n]*/gi)) {
      if (/neguje|bez alergi/i.test(m[0])) continue;
      positives.push({ doc, quote: m[0].trim(), allergen: `alergie na ${m[1].replace(/\s+v anamnéze\s*$/i, '').trim()}` });
    }
  }
  negatives.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  positives.sort((a, b) => a.doc.date.localeCompare(b.doc.date));
  if (!positives.length) {
    const n = negatives[0];
    if (!n) return { field: { value: '', citations: [], status: 'missing', note: 'Alergická anamnéza není uvedena.' } };
    return { field: { value: n.line.replace(/^(AA|Alergie):\s*/, ''), citations: cites(cite(n.doc, n.line)), sourceDate: n.doc.date, note: 'Alergie pacient neguje.' } };
  }
  const seen = new Set<string>();
  const unique = positives.filter((p) => { const k = p.allergen.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  const value = unique.map((p) => `${p.allergen} (${czDate(p.doc.date)})`).join('; ');
  const citations = cites(...positives.map((p) => cite(p.doc, p.quote)));
  const first = positives[0];
  const stale = negatives.find((n) => n.doc.date >= first.doc.date);
  if (!stale) {
    const older = negatives[0];
    return { field: { value, citations, sourceDate: positives[positives.length - 1].doc.date, note: older ? `Starší zpráva ${older.doc.id} uvádí „${older.line}“ – alergie byla zjištěna později (${czDate(first.doc.date)}).` : undefined } };
  }
  const a = cite(stale.doc, stale.line);
  const b = cite(first.doc, first.quote);
  const explain = `Zpráva ${stale.doc.id} (${czDate(stale.doc.date)}) uvádí „${stale.line}“, ale zpráva ${first.doc.id} z ${czDate(first.doc.date)} zaznamenala: ${first.allergen}. Ověřit před dalším vyšetřením nebo léčbou – novější zpráva alergii nepřevzala.`;
  return {
    field: {
      value, citations, status: a && b ? 'conflict' : undefined, sourceDate: first.doc.date,
      conflict: a && b ? { a: { value: stale.line, citation: a }, b: { value: first.allergen, citation: b }, explain } : undefined,
    },
    finding: { id: 'allergy-conflict', severity: 'conflict', fieldKey: 'allergies', text: explain, citations: cites(a, b) },
  };
}

export function comorbidities(included: Doc[]): RuleField {
  for (const doc of byPreference(included)) {
    const oa = labeledLine(doc.text, /^OA:/);
    if (oa) return { value: oa.value, citations: cites(cite(doc, oa.line)), sourceDate: doc.date };
  }
  return { value: '', citations: [], status: 'missing', note: 'Osobní anamnéza není uvedena.' };
}

export function medications(included: Doc[]): { field: RuleField; meds: Medication[] } {
  for (const doc of byPreference(included)) {
    const fa = labeledLine(doc.text, /^FA:/) ?? (() => {
      const s = section(doc.text, /^MEDIKACE/);
      return s ? { line: s.split('\n')[0], value: s.split('\n')[0] } : null;
    })();
    if (!fa) continue;
    const c = cite(doc, fa.line);
    const meds: Medication[] = fa.value.split(/,\s*(?=[a-záčďéěíňóřšťúůýž]+\s+\d)/i).map((part) => {
      const p = part.trim();
      const m = p.match(/^([^\d]+?)\s+(\d.*)$/);
      const mc = cite(doc, p);
      return { name: (m?.[1] ?? p).trim(), dose: (m?.[2] ?? '').trim(), citation: mc ?? c ?? { docId: doc.id, quote: fa.line } };
    });
    return { field: { value: fa.value, citations: cites(c), sourceDate: doc.date }, meds };
  }
  return { field: { value: '', citations: [], status: 'missing', note: 'Léková anamnéza není uvedena.' }, meds: [] };
}

// ---------- labs ----------

const VALUE_RE = /^(?:[<>]\s?)?\d+(?:[.,]\d+)?(?:\s[HL])?$|^\+{1,3}(?:\s[HL])?$|^(?:neg\.|norm\.|ojediněle|pozit\.)$/;
const UNIT_RE = /\/|^%$|^1$|^fl$|^kU|^U$|^IU/;
const REF_RE = /^(?:[<>]\s?\d|\d+(?:[.,]\d+)?\s?[–-]\s?\d|neg\.|norm\.)/;
const MARKER_RE = /^(?:CA\s?\d|CEA|AFP|PSA|NSE|CYFRA|SCC|HE4|hCG|S100)/i;

export function isTumorMarker(test: string): boolean { return MARKER_RE.test(test); }

/** Verbatim line behind a lab row parsed from a "one row per line" table (used as its citation). */
const rowQuote = new WeakMap<LabRow, string>();

function labDate(doc: Doc): ISODate {
  const odber = labeledLine(doc.text, /^Odběr:/);
  const inline = doc.text.match(/Odběr\s*:\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/);
  return (odber && findDates(odber.line)[0]?.iso) || (inline && findDates(inline[1])[0]?.iso) || doc.date;
}

/** Table with one cell per line (test / value / unit / range) – the layout of most exported lab reports. */
function parseLabCells(doc: Doc): LabRow[] {
  const ls = lines(doc.text);
  const date = labDate(doc);
  const lab = facility(doc);
  const rows: LabRow[] = [];
  let inTable = false;
  let urine = false;
  for (let k = 0; k < ls.length; k++) {
    const l = ls[k];
    if (l === 'Vyšetření') {
      inTable = true;
      while (k + 1 < ls.length && /^(Výsledek|Jednotky|Ref\.( meze)?)$/.test(ls[k + 1])) k++;
      continue;
    }
    if (isHeading(l)) { urine = /MOČ/.test(l); inTable = false; continue; }
    if (!inTable) continue;
    if (l.includes(':')) { inTable = false; continue; }
    const val = ls[k + 1];
    if (!val || !VALUE_RE.test(val)) { inTable = false; continue; }
    let n = 2; let unit = ''; let ref: string | undefined;
    if (ls[k + 2] && UNIT_RE.test(ls[k + 2]) && !REF_RE.test(ls[k + 2])) { unit = ls[k + 2]; n = 3; if (ls[k + 3] && REF_RE.test(ls[k + 3])) { ref = ls[k + 3]; n = 4; } }
    else if (ls[k + 2] && REF_RE.test(ls[k + 2])) { ref = ls[k + 2]; n = 3; }
    const fm = val.match(/^(.*?)\s([HL])$/);
    rows.push({ test: urine ? `Moč – ${l}` : l, value: fm ? fm[1] : val, unit, ref, flag: fm ? (fm[2] as 'H' | 'L') : undefined, date, lab, docId: doc.id });
    k += n - 1;
  }
  return rows;
}

/** Table with one row per line, columns separated by 2+ spaces ("CEA      7,8      ug/l      < 5,0      H"). */
function parseLabRows(doc: Doc): LabRow[] {
  const date = labDate(doc);
  const lab = facility(doc);
  const rows: LabRow[] = [];
  let urine = false;
  for (const raw of doc.text.split(/\r?\n/)) {
    const l = raw.trim();
    if (!l || /^[-=_*]{5,}$/.test(l)) continue;
    const cells = l.split(/\s{2,}/);
    if (cells.length < 2) { if (isHeading(l)) urine = /MOČ/.test(l); continue; }
    const [test, val, ...rest] = cells;
    if (!/^(?:[<>]\s?)?\d+(?:[.,]\d+)?$|^(?:neg\.|pozit\.|norm\.)$/.test(val) || test.includes(':') || /^\d/.test(test)) continue;
    let unit = '';
    let ref: string | undefined;
    let flag: 'H' | 'L' | undefined;
    for (const c of rest) {
      if (/^[HL]$/.test(c)) flag = c as 'H' | 'L';
      else if (!ref && REF_RE.test(c)) ref = c;
      else if (!unit) unit = c;
    }
    const row: LabRow = { test: urine ? `Moč – ${test}` : test, value: val, unit, ref, flag, date, lab, docId: doc.id };
    rowQuote.set(row, l);
    rows.push(row);
  }
  return rows;
}

export function parseLabs(doc: Doc): LabRow[] {
  const cells = parseLabCells(doc);
  return cells.length ? cells : parseLabRows(doc);
}

export function labsField(included: Doc[]): { field: RuleField; labs: LabRow[] } {
  const labDocs = included.filter((d) => docKind(d) === 'lab').sort((a, b) => b.date.localeCompare(a.date));
  const labs = labDocs.flatMap(parseLabs);
  if (!labs.length) return { field: { value: '', citations: [], status: 'missing', note: 'Laboratorní výsledky nejsou k dispozici.' }, labs };
  const parts: string[] = [];
  const citations: Citation[] = [];
  const fmt = (r: LabRow) => `${r.test} ${r.value}${r.unit ? ' ' + r.unit : ''}${r.flag === 'H' ? ' ↑' : r.flag === 'L' ? ' ↓' : ''}`;
  for (const d of labDocs) {
    const rows = labs.filter((r) => r.docId === d.id);
    const markers = rows.filter((r) => isTumorMarker(r.test));
    const abnormal = rows.filter((r) => r.flag && !isTumorMarker(r.test) && !r.test.startsWith('Moč'));
    const head = `${czDate(rows[0]?.date ?? d.date)} (${rows[0]?.lab ?? facility(d)})`;
    const seg: string[] = [];
    if (markers.length) seg.push(`nádorové markery: ${markers.map(fmt).join(', ')}`);
    if (abnormal.length) seg.push(`mimo normu: ${abnormal.map(fmt).join(', ')}`);
    if (!seg.length) seg.push('bez odchylek');
    parts.push(`${head}: ${seg.join('; ')}`);
    for (const r of [...markers, ...abnormal]) {
      const c = cite(d, rowQuote.get(r) ?? `${r.test.replace(/^Moč – /, '')}\n${r.value}${r.flag ? ' ' + r.flag : ''}`);
      if (c) citations.push(c);
    }
  }
  const allMarkers = labs.filter((r) => isTumorMarker(r.test));
  return {
    field: {
      value: parts.join('\n'),
      citations,
      sourceDate: labDocs[0].date,
      note: allMarkers.length ? `Uvedeny všechny nádorové markery (${[...new Set(allMarkers.map((r) => r.test))].join(', ')}), nejen zvýšené.` : 'Nádorové markery v dokumentaci nejsou.',
    },
    labs,
  };
}

// ---------- exams and histology ----------

/** Lines after the conclusion that are no longer the conclusion (date, place, signature, copy, next block). */
const STOP_LINE = /^(Datum\b|V\s.+\sdne\b|MUDr\.|MDDr\.|Mgr\.|Bc\.|Ing\.|RNDr\.|doc\.|prof\.|Vydal|Výsledky validoval|Kopie|Na vědomí|Dg\.\s*:|S pozdravem|Doporučení|DOPORUČENÍ)/i;

/** Conclusion of a report: "ZÁVĚR" section or "Závěr:" block (first lines), else the "Výkon:" line. */
function conclusionLines(doc: Doc, max = 3): string[] {
  const z = section(doc.text, /^ZÁVĚR/) ?? labeledBlock(doc.text, /^Závěr\s*:/);
  if (z) {
    const out: string[] = [];
    for (const l of z.split('\n')) { if (STOP_LINE.test(l)) break; out.push(l); if (out.length >= max) break; }
    if (out.length) return out;
  }
  const v = labeledLine(doc.text, /^Výkon\s*:/);
  return v ? [v.line] : [];
}

/** For procedures without a ZÁVĚR: the sentence that states the finding with its size ("… ložisko … 33 × 29 mm."). */
function procedureFinding(doc: Doc): string | null {
  const m = doc.text.match(/[^.\n]*\d+\s?[×x]\s?\d+\s?mm[^.\n]*\./);
  return m ? m[0].trim() : null;
}

export function examsField(included: Doc[]): { field: RuleField; exams: Exam[] } {
  const kinds: DocKind[] = ['imaging', 'procedure', 'clinic'];
  const docs = included.filter((d) => kinds.includes(docKind(d))).sort((a, b) => a.date.localeCompare(b.date));
  const exams: Exam[] = [];
  const citations: Citation[] = [];
  const out: string[] = [];
  for (const d of docs) {
    const z = conclusionLines(d);
    const extra = docKind(d) === 'procedure' ? procedureFinding(d) : null;
    for (const q of [...z, extra]) {
      const c = q ? cite(d, q) : null;
      if (c) citations.push(c);
    }
    const type = docTitle(d);
    const summary = [...z, extra].filter(Boolean).join(' ');
    exams.push({ date: d.date, place: facility(d), type, summary, docId: d.id });
    out.push(`${czDate(d.date)} · ${type} · ${facility(d)}${summary ? ` – ${summary}` : ''}`);
  }
  if (!exams.length) return { field: { value: '', citations: [], status: 'missing', note: 'Žádná vyšetření v dokumentaci.' }, exams };
  return { field: { value: out.join('\n'), citations, sourceDate: docs[docs.length - 1].date, note: 'Plné znění výsledku je v původní zprávě (klik na citaci).' }, exams };
}

/** Original histology report + any later addendum (e.g. MMR or predictive markers). */
export function histologyField(included: Doc[]): RuleField {
  const docs = included.filter((d) => docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date));
  const d = docs.find((x) => !isAddendum(x)) ?? docs[0];
  if (!d) return { value: '', citations: [], status: 'missing', note: 'Histologie zatím není k dispozici.' };
  const z = conclusionLines(d, 1)[0];
  const issued = issueDate(d);
  const parts = [`${z ?? 'bioptický nález'}${issued ? ` · vydáno ${czDate(issued.iso)}` : ''}`];
  const citations = cites(z ? cite(d, z) : null, issued ? cite(d, issued.quote) : null);
  for (const a of docs.filter((x) => x !== d && isAddendum(x) && x.date >= d.date).reverse()) {
    const az = conclusionLines(a, 1)[0];
    if (!az) continue;
    parts.push(`dodatek ${czDate(a.date)}: ${az}`);
    citations.push(...cites(cite(a, az)));
  }
  return { value: parts.join(' · '), citations, sourceDate: docs[0].date };
}

// ---------- date sanity (trap detector) ----------

const PAST_EVENT = /(poslední dávk[ay]|odběr|odebrán[aoy]?|vysazen[aoy]?|provedeno|provedena|proběhl[aoy]?|podán[aoy]?)\s*\(?\s*$/i;
const FUTURE_WORDS = /(objednán|termín|kontrol|znovu|plánován|naplánován|od\s*$|za\s*$|do\s*$)/i;

/** Character ranges of DOPORUČENÍ / PLÁN sections – dates there are planned, not past events. */
function planRanges(text: string): [number, number][] {
  const out: [number, number][] = [];
  let pos = 0;
  let start = -1;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (l && isHeading(l)) {
      if (start >= 0) { out.push([start, pos]); start = -1; }
      if (/^(DOPORUČENÍ|PLÁN)/.test(l)) start = pos;
    }
    pos += raw.length + 1;
  }
  if (start >= 0) out.push([start, text.length]);
  return out;
}

export interface DateConflict { doc: Doc; event: { iso: ISODate; quote: string }; issued: { iso: ISODate; quote: string } }

/** Past events dated after the report itself was issued (impossible dates), e.g. "poslední dávka 18. 10." in a report from 12. 10. */
export function impossibleDates(docs: Doc[]): DateConflict[] {
  const out: DateConflict[] = [];
  for (const doc of docs) {
    const issued = issueDate(doc);
    if (!issued) continue;
    const plans = planRanges(doc.text);
    for (const hit of findDates(doc.text)) {
      if (hit.iso <= issued.iso) continue;
      if (plans.some(([s, e]) => hit.index >= s && hit.index < e)) continue;
      const before = doc.text.slice(Math.max(0, hit.index - 40), hit.index);
      const lineBefore = before.split(/\r?\n/).pop() ?? '';
      if (!PAST_EVENT.test(lineBefore) || FUTURE_WORDS.test(lineBefore)) continue;
      const kw = lineBefore.match(PAST_EVENT);
      const quote = (kw ? lineBefore.slice(kw.index) : lineBefore).trimStart() + hit.raw;
      const exact = locateQuote(doc.text, quote.replace(/^\(\s*/, ''));
      if (exact) out.push({ doc, event: { iso: hit.iso, quote: exact }, issued });
    }
  }
  return out;
}

// ---------- doctors' warnings (quoted, never our own) ----------

/** A warning written by a doctor ("Upozorňuji na …", "Upozornění: …"). The rule looks for the doctor's words, not for
 *  drug names: an own drug-interaction alert is an example of a medical device in MDCG 2019-11 rev.1, annex I. */
const WARNING_START = /^(Upozorňuj(?:i|eme|e)\b|Upozornění\b|UPOZORNĚNÍ\b|Pozor\s*:|POZOR\b)/u;
const WARNING_LABEL = /^(Upozornění|UPOZORNĚNÍ|Pozor|POZOR)\s*:?/;

export interface DoctorWarning { doc: Doc; quote: string }

export function doctorWarnings(included: Doc[]): DoctorWarning[] {
  const out: DoctorWarning[] = [];
  for (const doc of included) {
    for (const s of sentences(doc.text)) {
      if (!WARNING_START.test(s)) continue;
      // "UPOZORNĚNÍ:" alone on its line → the warning is the line below it
      const text = /^\S+\s*:?$/.test(s) ? (section(doc.text, /^UPOZORNĚNÍ/) ?? labeledBlock(doc.text, WARNING_LABEL))?.split('\n')[0] : s;
      const quote = text ? locateQuote(doc.text, text) : null;
      if (quote && !out.some((w) => w.doc.id === doc.id && w.quote === quote)) out.push({ doc, quote });
    }
  }
  return out;
}

// ---------- referral pre-check ----------

export function referralPrecheck(referral: Doc): Finding[] {
  const f: Finding[] = [];
  const t = referral.text;
  const listed = section(t, /^PROVEDENÁ VYŠETŘENÍ/);
  if (/k dispozici na jednotlivých pracovištích/i.test(t)) {
    const items = (listed ?? '').split('\n').filter((l) => /^\d+\./.test(l));
    f.push({
      id: 'results-not-attached', severity: 'missing',
      text: `Žádanka neobsahuje výsledky vyšetření – uvádí jen, kde jsou (${items.length || 'více'} pracovišť). Je třeba je vyžádat.`,
      citations: cites(cite(referral, 'VÝSLEDKY K DISPOZICI NA JEDNOTLIVÝCH PRACOVIŠTÍCH')),
    });
    for (const it of items) f.push({ id: `request-${it.slice(0, 2)}`, severity: 'info', text: `Vyžádat: ${it.replace(/^\d+\.\s*/, '')}`, citations: cites(cite(referral, it)) });
  }
  if (!/\bECOG\b|Karnofsk|\bPS\s?[0-4]\b/.test(t)) f.push({ id: 'ecog-missing', severity: 'missing', fieldKey: 'performance', text: 'Chybí výkonnostní stav (ECOG/Karnofsky).', citations: [] });
  if (!/\S+@\S+\.\S+/.test(t)) f.push({ id: 'emails-missing', severity: 'info', text: 'Chybí e-mail pacienta i odesílajícího lékaře.', citations: [] });
  for (const w of doctorWarnings([referral])) {
    f.push({ id: 'doctor-warning', severity: 'info', text: `Upozornění lékaře (zpráva ${referral.id}): „${w.quote}“`, citations: [{ docId: referral.id, quote: w.quote }] });
  }
  const consent = t.match(/[^.\n]*[Ss]ouhlasí se sdílením[^.\n]*\./);
  if (consent) f.push({ id: 'consent-sharing', severity: 'info', text: 'Souhlas se sdílením informací s blízkou osobou je v žádance.', citations: cites(cite(referral, consent[0].trim())) });
  return f;
}

/** Planned events (control visits) dated before the as-of date without any report from that day. */
export function plannedButMissing(included: Doc[], asOf: ISODate): Finding[] {
  const dates = new Set(included.map((d) => d.date));
  const f: Finding[] = [];
  for (const doc of included) {
    for (const l of lines(doc.text)) {
      if (!/^\d+\.\s/.test(l) || !/(Kontrola|kontrol)/.test(l)) continue;
      for (const d of findDates(l)) {
        if (d.iso > doc.date && d.iso <= asOf && !dates.has(d.iso)) {
          f.push({ id: `planned-${d.iso}`, severity: 'info', text: `Zpráva ${doc.id} plánuje kontrolu ${czDate(d.iso)}, ale zpráva z ní v dokumentaci není – možná chybí.`, citations: cites(cite(doc, l)) });
        }
      }
    }
  }
  return f;
}

// ---------- consistency across reports (trap detectors) ----------

const SIDE_RE = /\b(prav|lev)(?:ý|é|ého|ém|á|ou|ým|ých)\s+(?:[a-záčďéěíňóřšťúůýž]+\s+){0,2}?(?:lalok\w*|plic\w*|plíc\w*|hil\w*|ledvin\w*|prs\w*|nadledvin\w*|vaječník\w*|varl\w*)/i;
const PANCREAS_RE = /\b(hlav|těl|kaud|ocas)\w*\s+(?:pankreat\w*|slinivk\w*)/i;
const LOC_LINES = /^(Indikace|Výkon|Materiál|Diagnóza|Suspektní diagnóza|Pracovní diagnóza|Závěr)\s*:/;
const TUMOUR_WORD = /(ložisk|tumor|nádor|léze|expanz|infiltrát|opacit|útvar)/i;
/** "Levá plíce bez ložiskových změn" describes the healthy side – never a location of the finding. */
const NEGATED = /(^|\s)bez\s+(?:\p{L}+\s+){0,2}?(?:ložisk|patolog|změn|nález|tumor|expanz|metast)/iu;

export type LocDim = 'strana' | 'část slinivky';
export interface LocHit { doc: Doc; dim: LocDim; value: string; phrase: string; quote: string }

const LOC_DIMS: { dim: LocDim; re: RegExp; value: (m: RegExpMatchArray) => string }[] = [
  { dim: 'strana', re: SIDE_RE, value: (m) => (m[1].toLowerCase() === 'prav' ? 'pravá' : 'levá') },
  { dim: 'část slinivky', re: PANCREAS_RE, value: (m) => ({ hlav: 'hlava', těl: 'tělo', kaud: 'kauda', ocas: 'kauda' } as Record<string, string>)[m[1].toLowerCase()] },
];

/** Where the main finding is, per report: conclusion, labelled lines (indication, material, diagnosis) and the first tumour sentence of the description. */
export function locationMentions(included: Doc[]): LocHit[] {
  const out: LocHit[] = [];
  for (const doc of included) {
    const z = section(doc.text, /^ZÁVĚR/);
    const popis = section(doc.text, /^POPIS/);
    const firstTumour = popis?.split(/(?<=\.)\s+/).find((x) => TUMOUR_WORD.test(x) && !NEGATED.test(x));
    const candidates = [...(z ? z.split('\n').slice(0, 2) : []), ...lines(doc.text).filter((l) => LOC_LINES.test(l)), ...(firstTumour ? [firstTumour] : [])]
      .flatMap((l) => l.split(/(?<=\.)\s+(?=\p{Lu})/u))
      .filter((l) => !NEGATED.test(l));
    for (const { dim, re, value } of LOC_DIMS) {
      for (const l of candidates) {
        const m = l.match(re);
        if (!m) continue;
        const exact = locateQuote(doc.text, l.trim());
        if (exact) out.push({ doc, dim, value: value(m), phrase: m[0], quote: exact });
      }
    }
  }
  return out;
}

const LOC_WORD: Record<string, string> = { pravá: 'pravou stranu', levá: 'levou stranu', hlava: 'hlavu', tělo: 'tělo', kauda: 'kaudu (ocas)' };

/** Reports that disagree on where the tumour is (side, part of the pancreas) – decisive for surgery and radiotherapy. */
export function locationConflicts(included: Doc[]): { dim: LocDim; a: LocHit; b: LocHit; explain: string }[] {
  const hits = locationMentions(included);
  const out: { dim: LocDim; a: LocHit; b: LocHit; explain: string }[] = [];
  for (const dim of ['strana', 'část slinivky'] as LocDim[]) {
    const byValue = new Map<string, LocHit[]>();
    for (const h of hits.filter((x) => x.dim === dim)) byValue.set(h.value, [...(byValue.get(h.value) ?? []), h]);
    if (byValue.size < 2) continue;
    const groups = [...byValue.values()].sort((x, y) => y.length - x.length);
    const major = groups[0];
    const minor = groups.slice(1).flat();
    const ids = (xs: LocHit[]) => [...new Set(xs.map((h) => h.doc.id))];
    const say = (xs: LocHit[]) => { const d = ids(xs); return `${d.length > 1 ? 'zprávy' : 'zpráva'} ${d.join(', ')} ${d.length > 1 ? 'uvádějí' : 'uvádí'} ${LOC_WORD[xs[0].value] ?? xs[0].value}`; };
    const newest = (xs: LocHit[]) => [...xs].sort((x, y) => y.doc.date.localeCompare(x.doc.date))[0];
    const what = dim === 'strana' ? 'Strana nálezu' : 'Lokalizace ve slinivce';
    out.push({ dim, a: newest(major), b: newest(minor), explain: `${what} nesedí: ${say(major)}, ${say(minor)}. Ověřte s pracovištěm – lokalizace rozhoduje o operaci i ozařování.` });
  }
  return out;
}

const RC_RE = /(?:Rodné číslo|\bRČ|\br\. ?č\.)\s*:?\s*(\d{6}\/\d{3,4})/;

/** Reports whose birth number differs from the rest – maybe another patient's result. */
export function identityMismatch(included: Doc[]): { doc: Doc; rc: string; quote: string; ref: { doc: Doc; rc: string; quote: string } }[] {
  const hits = included.map((doc) => {
    const m = doc.text.match(RC_RE);
    return m ? { doc, rc: m[1], quote: locateQuote(doc.text, m[0]) ?? m[0] } : null;
  }).filter((x): x is { doc: Doc; rc: string; quote: string } => x !== null);
  const counts = new Map<string, number>();
  for (const h of hits) counts.set(h.rc, (counts.get(h.rc) ?? 0) + 1);
  if (counts.size < 2) return [];
  const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const ref = byPreference(hits.filter((h) => h.rc === main).map((h) => h.doc)).map((d) => hits.find((h) => h.doc === d)!)[0];
  return hits.filter((h) => h.rc !== main).map((h) => ({ ...h, ref }));
}

const PENDING_RE = /[^.\n]*(?:bude doplněn\w*|bude zaslán\w*|bude dodán\w*|budou doplněn\w*|doplníme|dodatkem|výsledek bude|výsledky budou)[^.\n]*\.?/gi;

/** Results announced as "will follow" (e.g. predictive markers) that no later report delivers before the as-of date. */
export function pendingResults(included: Doc[], asOf: ISODate): { doc: Doc; quote: string; items: string[]; ref?: string }[] {
  const out: { doc: Doc; quote: string; items: string[]; ref?: string }[] = [];
  for (const doc of included) {
    for (const m of doc.text.matchAll(PENDING_RE)) {
      const quote = m[0].trim();
      const items = [...new Set(quote.match(/\b[A-Z][A-Z0-9]+(?:-[A-Z0-9]+)?\b/g) ?? [])];
      const later = included.filter((d) => d.date > doc.date && d.date <= asOf);
      const delivered = items.length
        ? later.some((d) => items.some((it) => d.text.includes(it)))
        : later.some((d) => docKind(d) === docKind(doc));
      if (delivered) continue;
      const exact = locateQuote(doc.text, quote);
      if (exact) out.push({ doc, quote: exact, items, ref: labeledLine(doc.text, /^Číslo vyšetření:/)?.value });
    }
  }
  return out;
}

// ---------- medication changed in one report, old list copied into a newer one ----------

export interface MedChange { doc: Doc; from: string; to?: string; quote: string }

/** "převádím z warfarinu na apixaban", "warfarin trvale vysazen" – a drug stopped for good (and what replaced it). */
export function medicationChanges(included: Doc[]): MedChange[] {
  const out: MedChange[] = [];
  for (const doc of included) {
    for (const s of sentences(doc.text)) {
      const conv = s.match(/převád[íi]m\s+z\s+(\p{L}+)\s+na\s+(\p{L}+)/iu);
      const stop = s.match(/(\p{L}+)\s+(?:trvale|definitivně)\s+vysazen/iu);
      if (!conv && !stop) continue;
      const at = Math.min(...[conv?.index, stop?.index].filter((x): x is number => x !== undefined));
      const quote = locateQuote(doc.text, s.slice(at).trim());
      if (quote) out.push({ doc, from: conv?.[1] ?? stop![1], to: conv?.[2], quote });
    }
  }
  return out;
}

// ---------- an exam recommended before the MDT that never happened ----------

const RECOMMEND_RE = /[Dd]oporučen[oaé]?\s+(?:doplnit\s+|provést\s+)?(CT|MR|MRI|PET(?:\/CT)?|UZ|USG|EUS|scintigrafi\p{L}*)\s+(\p{L}+)/gu;

export function recommendedMissing(included: Doc[]): { doc: Doc; exam: string; quote: string }[] {
  const out: { doc: Doc; exam: string; quote: string }[] = [];
  const done = (after: Doc, modality: string, organ: string) => included.some((d) => {
    if (d.date <= after.date || !['imaging', 'procedure'].includes(docKind(d))) return false;
    const t = docTitle(d).toLocaleLowerCase('cs');
    return t.includes(modality.toLocaleLowerCase('cs')) && t.includes(organ.toLocaleLowerCase('cs').slice(0, 4));
  });
  for (const doc of included.filter((d) => ['imaging', 'procedure', 'clinic'].includes(docKind(d)))) {
    for (const s of sentences(doc.text)) {
      for (const m of s.matchAll(RECOMMEND_RE)) {
        if (done(doc, m[1], m[2])) continue;
        const quote = locateQuote(doc.text, s.trim());
        if (quote) out.push({ doc, exam: `${m[1]} ${m[2]}`, quote });
      }
    }
  }
  return out;
}

// ---------- staging written as complete ("cM0") while imaging left it open ----------

export function stagingConflict(included: Doc[]): { open: { doc: Doc; quote: string }; closed: { doc: Doc; quote: string } } | null {
  const OPEN = /(?:metastáz\p{L}*\s+nelze\s+vyloučit|nelze\s+vyloučit\s+metastáz\p{L}*)/iu;
  const CLOSED = /(?:\bcM0\b|bez\s+(?:známek\s+)?vzdálených\s+metastáz)/iu;
  const sorted = [...included].sort((a, b) => a.date.localeCompare(b.date));
  for (const o of sorted.filter((d) => docKind(d) === 'imaging')) {
    const os = sentences(o.text).find((s) => OPEN.test(s));
    if (!os) continue;
    for (const c of sorted.filter((d) => d.id !== o.id && d.date >= o.date)) {
      const cs = sentences(c.text).find((s) => CLOSED.test(s));
      if (!cs) continue;
      const oq = locateQuote(o.text, os.trim());
      const cq = locateQuote(c.text, cs.trim());
      if (oq && cq) return { open: { doc: o, quote: oq }, closed: { doc: c, quote: cq } };
    }
  }
  return null;
}
