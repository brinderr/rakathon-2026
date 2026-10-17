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
  if (/žádost o převzetí|Žádám o převzetí/i.test(t)) return 'referral';
  if (/Epikríza|Žádost o vyšetření/i.test(t) && /praktick/i.test(t)) return 'referral';
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
  const header = ref.text.split(/^Pacient(?:ka)?:/m)[0];
  const tel = header.match(/Tel\.?:\s*(\+?[\d ]{9,}\d)/) ?? ref.text.match(/Tel\.?:\s*(\+?[\d ]{9,}\d)/);
  const email = header.match(/[\w.+-]+@[\w-]+\.[\w.]*\w/);
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

const WEIGHT_RE = /(?:[Hh]motnost|[Vv]áha)\s+(\d{2,3})\s?kg/g;

export function weightHeight(included: Doc[], excluded: Doc[], asOf: ISODate): RuleField {
  const weights: { kg: string; doc: Doc; quote: string }[] = [];
  const heights: { cm: string; doc: Doc; quote: string }[] = [];
  for (const doc of included) {
    for (const m of doc.text.matchAll(WEIGHT_RE)) weights.push({ kg: m[1], doc, quote: m[0] });
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
  const later = excluded.flatMap((d) => [...d.text.matchAll(WEIGHT_RE)].map((m) => ({ kg: m[1], d })));
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
    finding: { id: 'ecog-missing', severity: 'missing', fieldKey: 'performance', text: note, citations: [] },
  };
}

const NEGATIVE_AA = /^(neguje|nejsou|bez alergi|0\b)/i;

/**
 * Allergies from all reports, not only the referral: an allergy found later (e.g. a reaction to contrast during CT)
 * must not be lost when a newer report copies "AA: neguje". Newer "neguje" after a documented allergy = conflict.
 */
export function allergies(included: Doc[]): { field: RuleField; finding?: Finding } {
  const negatives: { doc: Doc; line: string }[] = [];
  const positives: { doc: Doc; quote: string; allergen: string }[] = [];
  for (const doc of included) {
    const aa = labeledLine(doc.text, /^(AA|Alergie):/);
    if (aa && NEGATIVE_AA.test(aa.value)) negatives.push({ doc, line: aa.line });
    else if (aa) positives.push({ doc, quote: aa.line, allergen: aa.value.replace(/\.$/, '') });
    for (const m of doc.text.matchAll(/[^.\n]*alergi[ei]\s+na\s+([^.;\n()]+)[^.\n]*/gi)) {
      if (/neguje|bez alergi/i.test(m[0])) continue;
      positives.push({ doc, quote: m[0].trim(), allergen: `alergie na ${m[1].replace(/\s+v anamnéze\s*$/i, '').trim()}` });
    }
  }
  negatives.sort((a, b) => b.doc.date.localeCompare(a.doc.date));
  positives.sort((a, b) => a.doc.date.localeCompare(b.doc.date));
  if (!positives.length) {
    const n = negatives[0];
    if (!n) return { field: { value: '', citations: [], status: 'missing', note: 'Alergická anamnéza nie je uvedená.' } };
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
    return { field: { value, citations, sourceDate: positives[positives.length - 1].doc.date, note: older ? `Staršia správa ${older.doc.id} uvádza „${older.line}“ – alergia bola zistená neskôr (${czDate(first.doc.date)}).` : undefined } };
  }
  const a = cite(stale.doc, stale.line);
  const b = cite(first.doc, first.quote);
  const explain = `Správa ${stale.doc.id} (${czDate(stale.doc.date)}) uvádza „${stale.line}“, ale správa ${first.doc.id} z ${czDate(first.doc.date)} zaznamenala: ${first.allergen}. Overiť pred ďalším vyšetrením alebo liečbou – novšia správa alergiu pravdepodobne neprevzala.`;
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
  if (!/\bECOG\b|Karnofsk|\bPS\s?[0-4]\b/.test(t)) f.push({ id: 'ecog-missing', severity: 'missing', fieldKey: 'performance', text: 'Chýba výkonnostný stav (ECOG/Karnofsky).', citations: [] });
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

// ---------- consistency across reports (trap detectors) ----------

const SIDE_RE = /\b(prav|lev)(?:ý|é|ého|ém|á|ou|ým|ých)\s+(?:[a-záčďéěíňóřšťúůýž]+\s+){0,2}?(?:lalok\w*|plic\w*|plíc\w*|hil\w*|ledvin\w*|prs\w*|nadledvin\w*|vaječník\w*|varl\w*)/i;
const SIDE_LINES = /^(Indikace|Výkon|Materiál|Diagnóza|Suspektní diagnóza|Pracovní diagnóza):/;

export interface SideHit { doc: Doc; side: 'pravá' | 'ľavá'; phrase: string; quote: string }

/** Side of the main finding in each report (conclusion, indication, diagnosis line), e.g. "pravého horního laloku". */
export function sideMentions(included: Doc[]): SideHit[] {
  const out: SideHit[] = [];
  for (const doc of included) {
    const z = section(doc.text, /^ZÁVĚR/);
    const candidates = [...(z ? z.split('\n').slice(0, 2) : []), ...lines(doc.text).filter((l) => SIDE_LINES.test(l))];
    for (const l of candidates) {
      const m = l.match(SIDE_RE);
      if (!m) continue;
      const exact = locateQuote(doc.text, l);
      if (exact) out.push({ doc, side: m[1].toLowerCase() === 'prav' ? 'pravá' : 'ľavá', phrase: m[0], quote: exact });
      break;
    }
  }
  return out;
}

/** Reports that disagree on the side of the tumour (decisive for surgery and radiotherapy). */
export function sideConflict(included: Doc[]): { a: SideHit; b: SideHit; explain: string } | null {
  const hits = sideMentions(included);
  const right = hits.filter((h) => h.side === 'pravá');
  const left = hits.filter((h) => h.side === 'ľavá');
  if (!right.length || !left.length) return null;
  const [major, minor] = right.length >= left.length ? [right, left] : [left, right];
  const ids = (xs: SideHit[]) => xs.map((h) => h.doc.id).join(', ');
  const explain = `Strana nálezu nesedí: ${major.length > 1 ? 'správy' : 'správa'} ${ids(major)} ${major.length > 1 ? 'uvádzajú' : 'uvádza'} ${major[0].side === 'pravá' ? 'pravú' : 'ľavú'} stranu, ${minor.length > 1 ? 'správy' : 'správa'} ${ids(minor)} ${minor[0].side === 'pravá' ? 'pravú' : 'ľavú'}. Overiť s pracoviskom – strana rozhoduje o operácii aj ožarovaní.`;
  const newest = (xs: SideHit[]) => [...xs].sort((x, y) => y.doc.date.localeCompare(x.doc.date))[0];
  return { a: newest(major), b: newest(minor), explain };
}

const RC_RE = /(?:Rodné číslo:\s*|\bRČ\s+)(\d{6}\/\d{3,4})/;

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
