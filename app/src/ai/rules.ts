// Deterministic part of the extractor ("pravidlá bez AI").
// Reads regular parts of Czech medical reports (header, contacts, weight, lab tables, conclusions) and checks
// dates for impossible combinations. Every value carries a verbatim quote located in the source text.
import type { Citation, Exam, ISODate, LabRow, Medication } from '../types.ts';
import { czDate, findDates, isHeading, labeledLine, lines, locateQuote, section } from './text.ts';

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
  if (/Bioptický nález|Ústav patologie|Histologick[ýé] nález/i.test(t)) return 'histology';
  if (/Výsledky laboratorního vyšetření/i.test(t)) return 'lab';
  if (/Protokol o výkonu/i.test(t)) return 'procedure';
  if (/Výsledek vyšetření\s*[–-]/i.test(t)) return 'imaging';
  if (/Epikríza|žádost o převzetí|Žádost o převzetí|Žádost o vyšetření/i.test(t) && /praktick/i.test(t)) return 'referral';
  if (/Ambulantní zpráva|Zpráva klinického|Konziliární zpráva/i.test(t)) return 'clinic';
  return 'other';
}

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
  for (const l of lines(doc.text)) {
    const m = l.match(/^(?:Výsledek vyšetření|Protokol o výkonu|Ambulantní zpráva)\s*[–-]\s*(.+)$/);
    if (m) return m[1];
    if (/^(Bioptický nález|Výsledky laboratorního vyšetření|Zpráva klinického psychologa|Epikríza.*)$/.test(l)) return l;
  }
  return doc.title ?? 'Správa';
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

const NAME_RE = /^(Pacient(?:ka)?):\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+)\s+([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+)/m;

export function identity(docs: Doc[]): Record<'firstName' | 'lastName' | 'sex' | 'age' | 'insurer', RuleField> | null {
  for (const doc of byPreference(docs)) {
    const m = doc.text.match(NAME_RE);
    if (!m) continue;
    const nameQuote = m[0];
    const c = cite(doc, nameQuote);
    const sex = m[1] === 'Pacientka' ? 'žena' : 'muž';
    const out = {
      firstName: { value: m[2], citations: cites(c) },
      lastName: { value: m[3], citations: cites(c) },
      sex: { value: sex, citations: cites(c), note: `Podľa označenia „${m[1]}“ v správe.` },
      age: { value: '', citations: [] as Citation[], status: 'missing' as const, note: 'Vek nie je v správach výslovne uvedený.' },
      insurer: { value: '', citations: [] as Citation[], status: 'missing' as const, note: 'Kód poisťovne nie je uvedený.' },
    } as Record<'firstName' | 'lastName' | 'sex' | 'age' | 'insurer', RuleField>;

    for (const d of byPreference(docs)) {
      const born = labeledLine(d.text, /^Datum narození:/);
      const yrs = born?.line.match(/\((\d{1,3}) let\)/);
      if (born && yrs) {
        out.age = { value: `${yrs[1]} rokov (nar. ${born.value.replace(/\s*\(.*\)$/, '')})`, citations: cites(cite(d, born.line)) };
        break;
      }
      const inline = d.text.match(/(\d{1,3})let[áý]/);
      if (inline) { out.age = { value: `${inline[1]} rokov`, citations: cites(cite(d, inline[0])) }; break; }
    }
    for (const d of byPreference(docs)) {
      const zp = d.text.match(/Zdravotní pojišťovna:\s*(\d{3})/) ?? d.text.match(/\bZP (\d{3})\b/);
      if (!zp) continue;
      const name = INSURERS[zp[1]];
      out.insurer = {
        value: zp[1],
        citations: cites(cite(d, zp[0])),
        note: name
          ? `${zp[1]} = ${name}${zp[1] !== '111' ? ' – nie VZP, súhrn pre revízneho lekára ide tejto poisťovni' : ''}.`
          : 'Kód poisťovne nie je v číselníku – overiť.',
      };
      break;
    }
    return out;
  }
  return null;
}

export function contacts(docs: Doc[]): { patientContact: RuleField; contactPerson: RuleField; findings: Finding[] } {
  const findings: Finding[] = [];
  let patientContact: RuleField = { value: '', citations: [], status: 'missing', note: 'Telefón ani e-mail pacienta nie sú uvedené.' };
  let contactPerson: RuleField = { value: '', citations: [], status: 'missing', note: 'Kontaktná osoba nie je uvedená.' };
  for (const doc of byPreference(docs)) {
    const tel = labeledLine(doc.text, /^Telefon:/);
    if (!tel || patientContact.value) continue;
    const email = doc.text.match(/^E-?mail:\s*(\S+@\S+)/im);
    const parts = [`tel. ${tel.value}`, email ? `e-mail ${email[1]}` : 'e-mail neuvedený'];
    patientContact = {
      value: parts.join(' · '),
      citations: cites(cite(doc, tel.line), email ? cite(doc, email[0]) : null),
      note: email ? undefined : 'E-mail pacienta v dokumentácii chýba (zápis pre konzílium ho vyžaduje).',
    };
    if (!email) findings.push({ id: 'patient-email-missing', severity: 'missing', fieldKey: 'patientContact', text: 'Chýba e-mail pacienta – zápis pre konzílium (MDT_zapis) vyžaduje telefón aj e-mail.', citations: [] });
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
  const tel = ref.text.match(/Tel\.?:\s*(\+?[\d ]{9,})/);
  const email = ref.text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  const findings: Finding[] = [];
  if (!email) findings.push({ id: 'gp-email-missing', severity: 'info', text: 'Chýba e-mail odosielajúceho lekára (zápis pre konzílium ho vyžaduje) – telefón je uvedený.', citations: cites(tel ? cite(ref, tel[0]) : null) });
  return {
    name: nameLine ?? '',
    phone: tel?.[1].trim(),
    email: email?.[0],
    citations: cites(nameLine ? cite(ref, nameLine) : null, tel ? cite(ref, tel[0]) : null),
    findings,
  };
}

// ---------- body measures, status, allergies, medications ----------

export function weightHeight(included: Doc[], excluded: Doc[], asOf: ISODate): RuleField {
  const weights: { kg: string; doc: Doc; quote: string }[] = [];
  const heights: { cm: string; doc: Doc; quote: string }[] = [];
  for (const doc of included) {
    for (const m of doc.text.matchAll(/[Hh]motnost\s+(\d{2,3})\s?kg/g)) weights.push({ kg: m[1], doc, quote: m[0] });
    for (const m of doc.text.matchAll(/[Vv]ýška\s+(\d{3})\s?cm/g)) heights.push({ cm: m[1], doc, quote: m[0] });
  }
  if (!weights.length && !heights.length) {
    return { value: '', citations: [], status: 'missing', note: 'Váha ani výška nie sú v správach uvedené.' };
  }
  weights.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  heights.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  const w = weights[0];
  const h = heights[0];
  const parts: string[] = [];
  if (w) parts.push(`${w.kg} kg (${czDate(w.doc.date)})`);
  else parts.push('váha neuvedená');
  if (h) parts.push(`výška ${h.cm} cm (${czDate(h.doc.date)})`);
  else parts.push('výška neuvedená');
  const notes: string[] = [];
  const older = weights.slice(1).filter((x) => x.kg !== w?.kg);
  if (older.length) notes.push(`Skôr: ${older.map((x) => `${x.kg} kg (${czDate(x.doc.date)})`).join(', ')}.`);
  const later = excluded.flatMap((d) => [...d.text.matchAll(/[Hh]motnost\s+(\d{2,3})\s?kg/g)].map((m) => ({ kg: m[1], d })));
  if (later.length) notes.push(`Novšia hodnota ${later.map((x) => `${x.kg} kg (správa ${x.d.id}, ${czDate(x.d.date)})`).join(', ')} vznikla až po ${czDate(asOf)}, preto do podkladu nepatrí.`);
  if (!h) notes.push('Výška chýba.');
  return {
    value: parts.join(' · '),
    citations: cites(w ? cite(w.doc, w.quote) : null, h ? cite(h.doc, h.quote) : null, ...older.map((x) => cite(x.doc, x.quote))),
    note: notes.join(' ') || undefined,
    sourceDate: w?.doc.date,
  };
}

export function performanceStatus(included: Doc[], patientLabel: string, mdtDate: ISODate): { field: RuleField; finding?: Finding } {
  const scoreRe = /\bECOG\b[^\n]{0,20}\d|Karnofsk[^\n]{0,30}\d{2}|\bPS\s?[0-4]\b|\bWHO\s?(?:PS\s?)?[0-4]\b/;
  for (const doc of included) {
    const m = doc.text.match(scoreRe);
    if (m) {
      const line = doc.text.split(/\r?\n/).find((l) => l.includes(m[0])) ?? m[0];
      return { field: { value: line.trim(), citations: cites(cite(doc, line.trim())), sourceDate: doc.date } };
    }
  }
  const verbal = included.map((d) => ({ d, m: d.text.match(/[Ss]oběstačn[áéý]/) })).find((x) => x.m);
  const note = verbal?.m
    ? `Skóre ECOG ani Karnofsky nie je v žiadnej správe. Správa ${verbal.d.id} uvádza len slovný popis „${verbal.m[0]}“ – to nie je skóre.`
    : 'Skóre ECOG ani Karnofsky nie je v žiadnej správe.';
  return {
    field: {
      value: '',
      citations: [],
      status: 'missing',
      note,
      request: {
        to: 'onkologická ambulancia KOC / odosielajúci lekár',
        channel: 'e-mail',
        draft: `Dobrý deň, pred konzíliom ${czDate(mdtDate)} prosíme o doplnenie výkonnostného stavu (ECOG alebo Karnofsky) – ${patientLabel}. V doterajšej dokumentácii nie je uvedený. Ďakujeme, koordinátor KOC.`,
      },
    },
    finding: { id: 'ecog-missing', severity: 'missing', fieldKey: 'performanceStatus', text: note, citations: [] },
  };
}

export function allergies(included: Doc[]): RuleField {
  for (const doc of byPreference(included)) {
    const aa = labeledLine(doc.text, /^AA:/);
    if (aa) return { value: aa.value, citations: cites(cite(doc, aa.line)), sourceDate: doc.date, note: /neguje/i.test(aa.value) ? 'Alergie pacient neguje.' : undefined };
  }
  return { value: '', citations: [], status: 'missing', note: 'Alergická anamnéza nie je uvedená.' };
}

export function comorbidities(included: Doc[]): RuleField {
  for (const doc of byPreference(included)) {
    const oa = labeledLine(doc.text, /^OA:/);
    if (oa) return { value: oa.value, citations: cites(cite(doc, oa.line)), sourceDate: doc.date };
  }
  return { value: '', citations: [], status: 'missing', note: 'Osobná anamnéza nie je uvedená.' };
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
  return { field: { value: '', citations: [], status: 'missing', note: 'Lieková anamnéza nie je uvedená.' }, meds: [] };
}

// ---------- labs ----------

const VALUE_RE = /^(?:[<>]\s?)?\d+(?:[.,]\d+)?(?:\s[HL])?$|^\+{1,3}(?:\s[HL])?$|^(?:neg\.|norm\.|ojediněle|pozit\.)$/;
const UNIT_RE = /\/|^%$|^1$|^fl$|^kU|^U$|^IU/;
const REF_RE = /^(?:[<>]\s?\d|\d+(?:[.,]\d+)?\s?[–-]\s?\d|neg\.|norm\.)/;
const MARKER_RE = /^(?:CA\s?\d|CEA|AFP|PSA|NSE|CYFRA|SCC|HE4|hCG|S100)/i;

export function isTumorMarker(test: string): boolean { return MARKER_RE.test(test); }

export function parseLabs(doc: Doc): LabRow[] {
  const ls = lines(doc.text);
  const odber = labeledLine(doc.text, /^Odběr:/);
  const date = (odber && findDates(odber.line)[0]?.iso) || doc.date;
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

export function labsField(included: Doc[]): { field: RuleField; labs: LabRow[] } {
  const labDocs = included.filter((d) => docKind(d) === 'lab').sort((a, b) => b.date.localeCompare(a.date));
  const labs = labDocs.flatMap(parseLabs);
  if (!labs.length) return { field: { value: '', citations: [], status: 'missing', note: 'Laboratórne výsledky nie sú k dispozícii.' }, labs };
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
    if (abnormal.length) seg.push(`mimo normy: ${abnormal.map(fmt).join(', ')}`);
    if (!seg.length) seg.push('bez odchýlok');
    parts.push(`${head}: ${seg.join('; ')}`);
    for (const r of [...markers, ...abnormal]) {
      const c = cite(d, `${r.test.replace(/^Moč – /, '')}\n${r.value}${r.flag ? ' ' + r.flag : ''}`);
      if (c) citations.push(c);
    }
  }
  const allMarkers = labs.filter((r) => isTumorMarker(r.test));
  return {
    field: {
      value: parts.join('\n'),
      citations,
      sourceDate: labDocs[0].date,
      note: allMarkers.length ? `Uvedené všetky nádorové markery (${[...new Set(allMarkers.map((r) => r.test))].join(', ')}), nielen zvýšené.` : 'Nádorové markery v dokumentácii nie sú.',
    },
    labs,
  };
}

// ---------- exams and histology ----------

function conclusion(doc: Doc): string | null {
  const z = section(doc.text, /^ZÁVĚR/);
  if (z) return z.split('\n')[0];
  const v = labeledLine(doc.text, /^Výkon:/);
  return v ? v.line : null;
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
    const z = conclusion(d);
    const extra = docKind(d) === 'procedure' ? procedureFinding(d) : null;
    for (const q of [z, extra]) {
      const c = q ? cite(d, q) : null;
      if (c) citations.push(c);
    }
    const type = docTitle(d);
    const summary = [z, extra].filter(Boolean).join(' ');
    exams.push({ date: d.date, place: facility(d), type, summary, docId: d.id });
    out.push(`${czDate(d.date)} · ${type} · ${facility(d)}${summary ? ` – ${summary}` : ''}`);
  }
  if (!exams.length) return { field: { value: '', citations: [], status: 'missing', note: 'Žiadne vyšetrenia v dokumentácii.' }, exams };
  return { field: { value: out.join('\n'), citations, sourceDate: docs[docs.length - 1].date, note: 'Plné znenie výsledku je v pôvodnej správe (klik na citát).' }, exams };
}

export function histologyField(included: Doc[]): RuleField {
  const docs = included.filter((d) => docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date));
  const d = docs[0];
  if (!d) return { value: '', citations: [], status: 'missing', note: 'Histológia zatiaľ nie je k dispozícii.' };
  const z = conclusion(d);
  const issued = issueDate(d);
  const value = `${z ?? 'bioptický nález'}${issued ? ` · vydané ${czDate(issued.iso)}` : ''}`;
  return { value, citations: cites(z ? cite(d, z) : null, issued ? cite(d, issued.quote) : null), sourceDate: d.date };
}

// ---------- date sanity (trap detector) ----------

const PAST_EVENT = /(poslední dávk[ay]|odběr|odebrán[aoy]?|vysazen[aoy]?|provedeno|provedena|proběhl[aoy]?|podán[aoy]?)\s*\(?\s*$/i;
const FUTURE_WORDS = /(objednán|termín|kontrol|znovu|plánován|naplánován|od\s*$|za\s*$|do\s*$)/i;

export interface DateConflict { doc: Doc; event: { iso: ISODate; quote: string }; issued: { iso: ISODate; quote: string } }

/** Past events dated after the report itself was issued (impossible dates), e.g. "poslední dávka 18. 10." in a report from 12. 10. */
export function impossibleDates(docs: Doc[]): DateConflict[] {
  const out: DateConflict[] = [];
  for (const doc of docs) {
    const issued = issueDate(doc);
    if (!issued) continue;
    for (const hit of findDates(doc.text)) {
      if (hit.iso <= issued.iso) continue;
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

// ---------- referral pre-check ----------

export function referralPrecheck(referral: Doc): Finding[] {
  const f: Finding[] = [];
  const t = referral.text;
  const listed = section(t, /^PROVEDENÁ VYŠETŘENÍ/);
  if (/k dispozici na jednotlivých pracovištích/i.test(t)) {
    const items = (listed ?? '').split('\n').filter((l) => /^\d+\./.test(l));
    f.push({
      id: 'results-not-attached', severity: 'missing',
      text: `Žiadanka neobsahuje výsledky vyšetrení – uvádza len, kde sú (${items.length || 'viac'} pracovísk). Treba ich vyžiadať.`,
      citations: cites(cite(referral, 'VÝSLEDKY K DISPOZICI NA JEDNOTLIVÝCH PRACOVIŠTÍCH')),
    });
    for (const it of items) f.push({ id: `request-${it.slice(0, 2)}`, severity: 'info', text: `Vyžiadať: ${it.replace(/^\d+\.\s*/, '')}`, citations: cites(cite(referral, it)) });
  }
  if (!/\bECOG\b|Karnofsk|\bPS\s?[0-4]\b/.test(t)) f.push({ id: 'ecog-missing', severity: 'missing', fieldKey: 'performanceStatus', text: 'Chýba výkonnostný stav (ECOG/Karnofsky).', citations: [] });
  if (!/\S+@\S+\.\S+/.test(t)) f.push({ id: 'emails-missing', severity: 'info', text: 'Chýba e-mail pacienta aj odosielajúceho lekára.', citations: [] });
  const request = section(t, /^ŽÁDOST/) ?? t;
  const anti = request.split(/(?<=\.)\s+/).find((s) => /(apixaban|warfarin|rivaroxaban|dabigatran|edoxaban|antikoagula)/i.test(s));
  if (anti) f.push({ id: 'anticoagulation', severity: 'info', text: 'Pacient užíva liek na riedenie krvi – pred invazívnym výkonom treba postup podľa lekára.', citations: cites(cite(referral, anti.trim())) });
  const consent = t.match(/[^.\n]*[Ss]ouhlasí se sdílením[^.\n]*\./);
  if (consent) f.push({ id: 'consent-sharing', severity: 'info', text: 'Súhlas so zdieľaním informácií s blízkou osobou je v žiadanke.', citations: cites(cite(referral, consent[0].trim())) });
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
          f.push({ id: `planned-${d.iso}`, severity: 'info', text: `Správa ${doc.id} plánuje kontrolu ${czDate(d.iso)}, ale správa z nej v dokumentácii nie je – možno chýba.`, citations: cites(cite(doc, l)) });
        }
      }
    }
  }
  return f;
}
