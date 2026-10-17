// Section "Žádanka od praktika" = the GP's side (owner: Bruno). Route #/zadanka (hidden from the coordinator's menu).
// Slide 7 of the VZP challenge, without another form: (1) the GP picks the KOC from the list of comprehensive centres
// (the two of the VZP case, names and addresses from the reports), (2) drops the letter he already wrote in his own
// software – the shared engine (app/src/ai, rules only, in this browser) fills in his details and the patient's from it,
// each value with the sentence it came from, and he can correct or add a value in place, (3) attaches more reports from
// his ambulance (Word or text). Before sending he sees what the coordinator will miss and what does not add up between
// his reports; "Odeslat do <KOC>" hands the case over in one step (sending is simulated): a new patient lands in the
// coordinator's list with all his reports, the demo letter of Alena only writes the event into her coordination record.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { extractHandover } from '../../../../app/src/ai/extract.ts';
import type { ExtractionResult } from '../../../../app/src/ai/extract.ts';
import * as R from '../../../../app/src/ai/rules.ts';
import { findDates } from '../../../../app/src/ai/text.ts';
import { readReport, reportDate } from '../../case/readReport';
import type { ReadSource } from '../../case/readReport';
import { caseData } from '../pacient/caseData';
import { DEMO_ID, SIM_TODAY, addPatient, updatePatient } from '../../state/patients';
import { addEvent, stamp } from '../../state/caseStore';
import type { MessageEvent } from '../../state/messages';
import { DocIcon } from '../../ui/DocIcon';
import { DocViewer } from '../../ui/DocViewer';
import type { DocText } from '../../ui/DocViewer';
import { Icon } from '../../ui/Icon';
import { czDate, nb } from '../../ui/format';
import './zadanka.css';

/** The demo letter: the GP's epikríza and request of 2. 10. 2026 (zpráva 07 of the VZP case). */
const SAMPLE = caseData.documents['07'];
/** The fictional test patient of the team (ekoordinace/public/test): the GP's request and the 5 reports she has. */
const SIPOS = [
  '01_Laborator_PL_2026-08-21', '02_Prakticky_lekar_epikriza_2026-08-24', '03_Gastroskopie_2026-09-09',
  '04_Histologie_2026-09-14', '05_CT_hrudniku_a_bricha_2026-09-21', '06_Prakticky_lekar_zadost_KOC_2026-09-28',
];

// ---------- the comprehensive centres: the two KOCs of the VZP case, addresses from the headers of their reports ----------
interface Koc { id: string; num: string; name: string; label: string; address: string }
function addressOf(name: string): string {
  for (const d of Object.values(caseData.documents)) {
    const head = d.text.split('\n').slice(0, 6);
    if (!head.some((l) => l.includes(`KOC ${name}`))) continue;
    const line = head.find((l) => /\d{3}\s?\d{2}\s+\p{Lu}/u.test(l));
    if (line) return line.trim();
  }
  return '';
}
const KOCS: Koc[] = [
  { id: 'koc2', num: 'KOC 2', name: 'Nemocnice Lipová' },
  { id: 'koc1', num: 'KOC 1', name: 'Nemocnice Severní' },
].map((k) => ({ ...k, label: `${k.num} – ${k.name}`, address: addressOf(k.name) }));

// ---------- the letter and the reports ----------
interface Doc { id: string; date: string; title: string; text: string; letter: boolean; source?: ReadSource }
/** The same files as "Přidat zprávy" of the coordinator: Word, PDF, RTF, text, photos and screenshots. */
const ACCEPT = '.docx,.pdf,.rtf,.txt,text/plain,application/pdf,image/*,.tif,.tiff';

/** The letter is the newest request to the KOC (a referral that asks for "převzetí"), else the newest referral, else the
 *  newest report. Reports are numbered by date like in the coordinator's list ("01", "02", …). */
function arrange(docs: Doc[]): Doc[] {
  const sorted = [...docs].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  let letterAt = sorted.findIndex((d) => d.letter);
  if (sorted.length && letterAt < 0) {
    const score = (d: Doc) => (R.docKind(d) === 'referral' ? 2 : 0) + (/převzetí|\bKOC\b/i.test(R.docTitle(d)) ? 1 : 0);
    // sorted by date, so ">=" keeps the newest of the best
    letterAt = sorted.reduce((best, d, i) => (score(d) >= score(sorted[best]) ? i : best), 0);
  }
  return sorted.map((d, i) => ({ ...d, letter: i === letterAt, id: String(i + 1).padStart(2, '0') }));
}

const CODE: Record<string, string> = { referral: 'ŽÁD', lab: 'LAB', histology: 'HIS', clinic: 'AMB' };
function codeOf(d: Doc): string {
  const kind = R.docKind(d);
  if (kind === 'imaging' || kind === 'procedure') return R.docTitle(d).split(/[\s-]/)[0].toUpperCase().slice(0, 3);
  return CODE[kind] ?? 'DOC';
}
/** The title of a report as written in it; a file name ("03_Gastroskopie_2026-09-09") when the report has none. */
function titleOf(d: Doc): string {
  const t = R.docTitle(d);
  return t.length >= 8 ? t : d.title.replace(/^\d+[_\s-]+/, '').replace(/[_\s-]*\d{4}-\d{2}-\d{2}$/, '').replace(/_+/g, ' ') || t;
}
const viewOf = (d: Doc): DocText => ({ id: d.id, date: d.date, title: R.docTitle(d) || d.title, place: R.facility(d), code: codeOf(d), text: d.text });
/** "e-mail pacientky", "telefon odesílajícího lékaře", "výkonnostní stav (ECOG)" */
const nameOf = (row: Row, female: boolean) =>
  `${lowerFirst(row.label)}${row.group === 'lekar' ? ' odesílajícího lékaře' : row.group === 'pacient' ? (female ? ' pacientky' : ' pacienta') : ''}`;
const reports = (n: number) => `${n} ${n === 1 ? 'zpráva' : n < 5 ? 'zprávy' : 'zpráv'}`;
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// ---------- what the letter says: the GP, the patient, the request ----------
type Group = 'lekar' | 'pacient' | 'zadost';
interface Row {
  id: string; group: Group; label: string;
  /** what the engine (or a labelled line of the letter) found, '' when the letter does not say it */
  value: string;
  /** the sentence it came from and its report */
  quote?: string; docId?: string;
  /** when empty: does the coordinator miss it (MDT_zapis / Handover_obsah) */
  need?: 'miss' | 'info';
  long?: boolean; type?: string; placeholder?: string;
  /** how the GP's own addition is written into his letter, so the coordinator's engine reads it with a citation */
  line: (v: string) => string;
}

const GROUPS: { id: Group; label: (female: boolean) => string }[] = [
  { id: 'lekar', label: () => 'Odesílající lékař' },
  { id: 'pacient', label: (f) => (f ? 'Pacientka' : 'Pacient') },
  { id: 'zadost', label: () => 'Žádost' },
];

function weightLine(v: string): string {
  const kg = v.match(/(\d{2,3})\s*kg/)?.[1];
  const cm = v.match(/(\d{3})\s*cm/)?.[1];
  return kg || cm ? [kg && `Váha ${kg} kg`, cm && `výška ${cm} cm`].filter(Boolean).join(', ') + '.' : `Váha a výška: ${v}`;
}

function rowsOf(r: ExtractionResult, letter: Doc): Row[] {
  const t = letter.text;
  const header = t.split(/^Pacient(?:ka)?:/m)[0];
  const field = (k: string) => r.fields.find((f) => f.key === k);
  const at = (k: string, part?: string) => {
    const cs = field(k)?.citations ?? [];
    const c = (part && cs.find((x) => x.quote.includes(part))) || cs[0];
    return c ? { quote: c.quote, docId: c.docId } : {};
  };
  const line = (re: RegExp, text = t) => {
    const m = text.match(re);
    return m ? { value: m[1].trim(), quote: m[0].trim(), docId: letter.id } : { value: '' };
  };
  const gp = r.referringGp;
  const gpQuote = (part?: string) => {
    const c = part ? gp?.citations.find((x) => x.quote.includes(part)) : gp?.citations[0];
    return c ? { quote: c.quote, docId: c.docId } : {};
  };
  const gpAddress = header.split('\n').map((l) => l.trim()).find((l) => /\d{3}\s?\d{2}\s+\p{Lu}/u.test(l) && !/IČP|Tel|@|Adresát/i.test(l));
  const female = field('sex')?.value === 'žena';
  const contact = field('patientContact')?.value ?? '';
  const phone = contact.match(/tel\.\s*(\+?\d[\d\s]{7,}\d)/)?.[1] ?? '';
  const email = contact.match(/e-mail\s+(\S+@\S+)/)?.[1] ?? '';
  const name = [field('firstName')?.value, field('lastName')?.value].filter(Boolean).join(' ');
  const born = field('age')?.value.match(/nar\.\s*(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/)?.[1] ?? '';
  const diag = field('diagnosis');
  const diagQuote = diag?.citations.find((c) => c.docId === letter.id);
  const other = (k: string) => ({ value: field(k)?.value ?? '', ...at(k) });
  const rcLine = line(/^Rodné číslo:\s*(\d{6}\/?\d{3,4})/m);
  const rc = rcLine.value ? rcLine : line(/\bRČ:?\s*(\d{6}\/\d{3,4})/);
  const rows: Row[] = [
    { id: 'gpName', group: 'lekar', label: 'Jméno', value: gp?.name ?? '', ...gpQuote(), need: 'miss', line: (v) => v },
    { id: 'gpIcp', group: 'lekar', label: 'IČP', ...line(/IČP:?\s*(\d{8})/, header), line: (v) => `IČP: ${v}` },
    { id: 'gpPhone', group: 'lekar', label: 'Telefon', value: gp?.phone ?? '', ...gpQuote(gp?.phone), need: 'miss', type: 'tel', line: (v) => `Tel.: ${v}` },
    { id: 'gpEmail', group: 'lekar', label: 'E-mail', value: gp?.email ?? '', ...(gp?.email ? { quote: gp.email, docId: letter.id } : {}), need: 'info', type: 'email', line: (v) => `E-mail: ${v}` },
    { id: 'gpAddress', group: 'lekar', label: 'Adresa ordinace', value: gpAddress ?? '', ...(gpAddress ? { quote: gpAddress, docId: letter.id } : {}), line: (v) => v },
    { id: 'name', group: 'pacient', label: 'Jméno a příjmení', value: name, ...at('firstName'), need: 'miss', line: (v) => `${female ? 'Pacientka' : 'Pacient'}: ${v}` },
    { id: 'born', group: 'pacient', label: 'Datum narození', value: born, ...at('age'), need: 'miss', placeholder: 'např. 22. 7. 1963', line: (v) => `Datum narození: ${v}` },
    { id: 'rc', group: 'pacient', label: 'Rodné číslo', ...rc, line: (v) => `Rodné číslo: ${v}` },
    { id: 'insurer', group: 'pacient', label: 'Zdravotní pojišťovna', ...other('insurer'), need: 'miss', placeholder: 'kód, např. 111', line: (v) => `Zdravotní pojišťovna: ${v}` },
    { id: 'phone', group: 'pacient', label: 'Telefon', value: phone, ...at('patientContact', phone || undefined), need: 'miss', type: 'tel', line: (v) => `Telefon: ${v}` },
    { id: 'email', group: 'pacient', label: 'E-mail', value: email, ...(email ? at('patientContact', email) : {}), need: 'miss', type: 'email', line: (v) => `E-mail: ${v}` },
    { id: 'address', group: 'pacient', label: 'Bydliště', ...line(/^Bydliště:\s*(.+)$/m), need: 'miss', line: (v) => `Bydliště: ${v}` },
    { id: 'contactPerson', group: 'pacient', label: 'Kontaktní osoba', ...other('contactPerson'), line: (v) => `Kontaktní osoba: ${v}` },
    {
      id: 'diagnosis', group: 'zadost', label: 'Suspektní diagnóza',
      ...(diagQuote ? { value: diagQuote.quote.replace(/^[^:]{0,40}:\s*/, ''), quote: diagQuote.quote, docId: diagQuote.docId } : other('diagnosis')),
      need: 'miss', long: true, line: (v) => `Suspektní diagnóza: ${v}`,
    },
    { id: 'mdtQuestion', group: 'zadost', label: 'Otázka pro KOC', ...other('mdtQuestion'), need: 'miss', long: true, placeholder: 'co od KOC žádáte', line: (v) => `Žádost: ${v}` },
    { id: 'performance', group: 'zadost', label: 'Výkonnostní stav (ECOG)', ...other('performance'), need: 'miss', line: (v) => `Výkonnostní stav: ${v}` },
    { id: 'weightHeight', group: 'zadost', label: 'Váha a výška', ...other('weightHeight'), need: 'miss', placeholder: 'např. 65 kg, 168 cm', line: weightLine },
  ];
  return rows.map((x) => ({ ...x, placeholder: x.placeholder ?? 'doplňte, pokud víte' }));
}

/** The letter as it goes to the KOC: a value the GP corrected is changed where it stands; what he added is written
 *  as his own lines – into the header for himself, at the end for the patient – so the engine reads it with a citation. */
function finalLetter(letter: Doc, rows: Row[], edits: Record<string, string>, female: boolean): { text: string; changed: string[]; added: string[] } {
  let text = letter.text;
  const head: string[] = [];
  const tail: string[] = [];
  const changed: string[] = [];
  const added: string[] = [];
  for (const r of rows) {
    const v = edits[r.id]?.trim();
    if (!v || v === r.value) continue;
    if (r.value && r.docId === letter.id && r.quote?.includes(r.value) && text.includes(r.quote)) {
      text = text.replace(r.quote, r.quote.replace(r.value, v));
      changed.push(`${nameOf(r, female)}: ${v}`);
    } else {
      (r.group === 'lekar' ? head : tail).push(r.line(v));
      added.push(`${nameOf(r, female)}: ${v}`);
    }
  }
  if (head.length) {
    const lines = text.split('\n');
    const gpLine = rows.find((r) => r.id === 'gpPhone')?.quote ?? rows.find((r) => r.id === 'gpName')?.quote;
    const at = gpLine ? lines.findIndex((l) => l.includes(gpLine)) : -1;
    lines.splice(at >= 0 ? at + 1 : Math.min(1, lines.length), 0, ...head);
    text = lines.join('\n');
  }
  if (tail.length) text += `\n\nDOPLNĚNÍ PRAKTICKÉHO LÉKAŘE PŘI ODESLÁNÍ\n${tail.join('\n')}`;
  return { text, changed, added };
}

// ---------- before sending: what the coordinator will miss, what does not add up ----------
interface Check { key: string; kind: 'miss' | 'conf' | 'ok'; text: string; items?: string[]; row?: string; cites?: { docId: string; marks: string[] }[] }

function checksOf(r: ExtractionResult, rows: Row[], value: (row: Row) => string, docs: Doc[], female: boolean): Check[] {
  const out: Check[] = [];
  // the results the letter only names ("k dispozici na jednotlivých pracovištích") – attached when a report of that day is here
  const listed = r.precheck.findings.filter((f) => /^Vyžádat:/.test(f.text)).map((f) => f.text.replace(/^Vyžádat:\s*/, ''));
  if (listed.length) {
    const attached = (item: string) => findDates(item).some((h) => docs.some((d) => !d.letter && d.date === h.iso));
    const open = listed.filter((x) => !attached(x));
    if (open.length) {
      out.push({
        key: 'results', kind: 'miss', items: open,
        text: `Výsledky vyšetření nejsou přiložené${open.length < listed.length ? ` (přiloženo ${listed.length - open.length} z ${listed.length})` : ''} – dopis uvádí jen, kde jsou. Přiložte je, nebo si je koordinátorka vyžádá:`,
      });
    } else out.push({ key: 'results', kind: 'ok', text: `Výsledky ze všech ${listed.length} vyšetření jsou přiložené.` });
  }
  for (const row of rows) {
    if (row.need && !value(row)) out.push({ key: row.id, kind: 'miss', row: row.id, text: `Chybí ${nameOf(row, female)}.` });
  }
  // what the engine found across the letter and the reports (handled above: ECOG, e-mails, results not attached)
  const handled = new Set(['ecog-missing', 'patient-email-missing', 'gp-email-missing', 'results-not-attached']);
  for (const f of r.findings) {
    if (handled.has(f.id) || f.severity === 'info') continue;
    const ids = [...new Set(f.citations.map((c) => c.docId))].sort();
    out.push({
      key: f.id, kind: f.severity === 'conflict' ? 'conf' : 'miss', text: f.text,
      cites: ids.map((docId) => ({ docId, marks: f.citations.filter((x) => x.docId === docId).map((x) => x.quote) })),
    });
  }
  const rank = { conf: 0, miss: 1, ok: 2 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind]);
}

interface Sent { caseId: string; at: string; gp: string; koc: Koc; reports: number; requests: number; stillMissing: string[] }

export function Zadanka() {
  const [koc, setKoc] = useState(KOCS[0].id);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [ms, setMs] = useState(0);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const [paste, setPaste] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);
  const [reading, setReading] = useState<{ id: string; marks: string[] } | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const done = useRef<HTMLElement | null>(null);
  useEffect(() => { if (sent) done.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [sent]);

  // the engine reads the letter and every report again whenever one is added or removed
  useEffect(() => {
    if (!docs.length) { setResult(null); return; }
    let alive = true;
    setBusy(true);
    const t0 = performance.now();
    const asOf = docs.reduce((m, d) => (d.date > m ? d.date : m), '');
    extractHandover({ caseId: 'zadanka', docs: docs.map(({ id, date, title, text }) => ({ id, date, title, text })), asOf, generatedAt: `${asOf}T08:00:00Z` })
      .then((r) => { if (alive) { setResult(r); setMs(performance.now() - t0); } })
      .catch((e: unknown) => { if (alive) setErrors([e instanceof Error ? e.message : String(e)]); })
      .finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [docs]);

  const add = (items: { title: string; text: string; source?: ReadSource }[]) => setDocs((prev) => {
    const fresh = items.filter((it) => !prev.some((d) => d.text === it.text))
      .map((it) => ({ id: '', date: reportDate(it.text, SIM_TODAY), title: it.title, text: it.text, letter: false, ...(it.source ? { source: it.source } : {}) }));
    return fresh.length ? arrange([...prev, ...fresh]) : prev;
  });

  const onFiles = async (files: File[]) => {
    if (!files.length) return;
    setBusy(true);
    const items: { title: string; text: string; source?: ReadSource }[] = [];
    const errs: string[] = [];
    for (const f of files) {
      try {
        const { text, source } = await readReport(f);
        if (text.trim()) items.push({ title: f.name.replace(/\.[^.]+$/, ''), text, source });
        else errs.push(`${f.name}: soubor je prázdný.`);
      } catch (e) {
        errs.push(e instanceof Error ? e.message : String(e));
      }
    }
    setErrors(errs);
    setBusy(false);
    if (items.length) add(items);
  };

  const reset = () => { setDocs([]); setResult(null); setEdits({}); setPaste(null); setErrors([]); setSent(null); };

  const loadSipos = async () => {
    reset();
    setBusy(true);
    try {
      const files = await Promise.all(SIPOS.map(async (n) => {
        const res = await fetch(`test/david-sipos/${n}.docx`);
        if (!res.ok) throw new Error(`Ukázkové zprávy se nepodařilo načíst (${res.status}).`);
        return new File([await res.blob()], `${n}.docx`);
      }));
      await onFiles(files);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : String(e)]);
      setBusy(false);
    }
  };

  const letter = docs.find((d) => d.letter) ?? null;
  const rows = useMemo(() => (result && letter ? rowsOf(result, letter) : []), [result, letter]);
  // an emptied field keeps what the letter says (it goes back on blur)
  const value = (row: Row) => edits[row.id]?.trim() || row.value;
  const female = result?.fields.find((f) => f.key === 'sex')?.value === 'žena';
  const checks = result ? checksOf(result, rows, value, docs, female) : [];
  const open = checks.filter((c) => c.kind !== 'ok');
  const target = KOCS.find((k) => k.id === koc) ?? KOCS[0];
  const readingDoc = reading ? docs.find((d) => d.id === reading.id) : undefined;

  const focusRow = (id: string) => {
    const el = document.getElementById(`zd-in-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus({ preventScroll: true });
  };

  const send = () => {
    if (!letter || !result) return;
    const v = (id: string) => { const row = rows.find((x) => x.id === id); return row ? value(row) : ''; };
    const gp = v('gpName') || 'praktický lékař';
    const others = docs.filter((d) => !d.letter);
    const final = finalLetter(letter, rows, edits, female);
    // the demo letter belongs to Alena, who is already in the coordinator's list; any other letter starts a new patient
    const isDemo = letter.text.startsWith(SAMPLE.text.slice(0, 200));
    let caseId = DEMO_ID;
    if (!isDemo) {
      caseId = addPatient(v('name') || 'Nový pacient', '');
      updatePatient(caseId, (p) => ({
        ...p,
        docs: docs.map((d) => ({ id: d.id, date: d.date, title: d.letter ? `Žádanka od praktika – ${d.title}` : d.title, text: d.letter ? final.text : d.text, ...(d.source ? { source: d.source } : {}) })),
      }));
    }
    const body = [
      `Žádost o převzetí do péče ${target.label} – dopis praktika bez dalšího formuláře.`,
      `Předáno: dopis${others.length ? ` a ${reports(others.length)}` : ''}.`,
      final.added.length ? `Praktik při odeslání doplnil: ${final.added.join('; ')}.` : '',
      final.changed.length ? `Praktik při odeslání opravil: ${final.changed.join('; ')}.` : '',
      'Praktikovi odešlo potvrzení o přijetí.',
    ].filter(Boolean).join('\n');
    // shaped like a sent message (state/messages): the record shows one short line, the details under "Zobrazit text"
    const event: Omit<MessageEvent, 'at'> = {
      who: gp, kind: 'odeslano', docId: isDemo ? '07' : letter.id, text: `Žádanka do ${target.label} přijata`,
      to: target.label, channel: 'zabezpečená zpráva', subject: 'Žádanka o převzetí do péče', body,
    };
    addEvent(caseId, letter.date, event);
    const requests = checks.find((c) => c.key === 'results' && c.kind === 'miss')?.items?.length ?? 0;
    const stillMissing = checks.filter((c) => c.row).map((c) => {
      const row = rows.find((x) => x.id === c.row)!;
      return row.group === 'lekar' ? `váš ${lowerFirst(row.label)}` : nameOf(row, female);
    });
    setSent({ caseId, at: stamp(letter.date), gp, koc: target, reports: others.length, requests, stillMissing });
  };

  return (
    <div className="zd">
      <div className="list-head">
        <div>
          <h1>Žádanka do KOC</h1>
          <p className="muted">Pohled praktického lékaře · předání pacienta k dokončení diagnostiky, bez dalšího formuláře</p>
        </div>
        {letter && <div className="form-actions"><button type="button" className="btn-ghost" onClick={reset}>Nová žádanka</button></div>}
      </div>

      <section className="card zd-koc" aria-label="Komplexní onkologické centrum">
        <h2><span className="zd-num">1</span>Komu posíláte</h2>
        <div className="zd-koc-list" role="radiogroup" aria-label="Komplexní onkologické centrum">
          {KOCS.map((k) => (
            <label key={k.id} className={`zd-koc-opt${k.id === koc ? ' on' : ''}`}>
              <input type="radio" name="koc" value={k.id} checked={k.id === koc} disabled={!!sent} onChange={() => setKoc(k.id)} />
              <span><b>{k.label}</b>{k.address && <small>{k.address}</small>}</span>
            </label>
          ))}
        </div>
      </section>

      {!letter && (
        <section className="card zd-start" aria-label="Dopis a zprávy z ambulance">
          <div className="add-head">
            <div>
              <h2><span className="zd-num">2</span>Dopis a zprávy z vaší ambulance</h2>
              <p className="muted">Pošlete epikrízu se žádostí, kterou už máte napsanou, a k ní zprávy z vlastního ambulantního softwaru. Nic nepřepisujete – údaje o vás i o pacientovi aplikace vyplní z dopisu sama. Text zůstává v tomto prohlížeči.</p>
            </div>
          </div>
          <div className={`drop${over ? ' over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); void onFiles(Array.from(e.dataTransfer.files)); }}>
            <Icon name="file" size={24} />
            <p><b>Přetáhněte sem dopis a zprávy</b> – Word, PDF, RTF, text nebo fotka, klidně víc najednou.</p>
            <div className="form-actions">
              <button type="button" className="btn-primary" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'Čtu…' : 'Vybrat soubory'}</button>
              <button type="button" className="btn-ghost" disabled={busy} onClick={() => setPaste(paste === null ? '' : null)}>Vložit text</button>
            </div>
          </div>
          {paste !== null && (
            <div className="paste">
              <textarea rows={8} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="Vložte celý text dopisu (např. z e-mailu)…" aria-label="Text dopisu" />
              <div className="form-actions">
                <button type="button" className="btn-primary" disabled={!paste.trim() || busy} onClick={() => { add([{ title: 'Vložený text', text: paste.trim() }]); setPaste(null); }}>Přečíst dopis</button>
                <button type="button" className="btn-ghost" onClick={() => setPaste(null)}>Zrušit</button>
              </div>
            </div>
          )}
          <p className="zd-samples">
            <span className="muted">Ukázka:</span>
            <button type="button" className="link" disabled={busy} onClick={() => add([{ title: SAMPLE.title, text: SAMPLE.text }])}>žádanka Aleny Procházkové z {czDate(SAMPLE.date)}</button>
            <button type="button" className="link" disabled={busy} onClick={() => void loadSipos()}>David Sipos – žádanka a 5 zpráv (Word)</button>
          </p>
          {errors.length > 0 && <ul className="add-errors">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
        </section>
      )}
      <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { void onFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }} />

      {letter && !result && <section className="card notice"><p className="muted">Čtu dopis…</p></section>}

      {letter && result && (
        <div className="zd-grid">
          <section className="card zd-data" aria-label="Údaje z dopisu">
            <div className="card-head">
              <h2><span className="zd-num">2</span>Údaje z dopisu</h2>
              <span className="mono">{result.meta.stats.citationsVerified} vět ověřeno doslova · {ms.toFixed(0)} ms · v prohlížeči</span>
            </div>
            <p className="muted zd-lead">Vyplněno z vašeho dopisu{docs.length > 1 ? ' a zpráv' : ''}. Co nesedí, opravte přímo v poli, co chybí, doplňte – stačí jen to, co víte.</p>
            {GROUPS.map((g) => (
              <div className="zd-group" key={g.id}>
                <h3>{g.label(female)}</h3>
                <dl>
                  {rows.filter((r) => r.group === g.id).map((r) => (
                    <FieldRow
                      key={r.id} row={r} letterId={letter.id} value={r.id in edits ? edits[r.id] : r.value} edited={!!edits[r.id]?.trim() && edits[r.id].trim() !== r.value}
                      locked={!!sent} onChange={(v) => setEdits((e) => ({ ...e, [r.id]: v }))}
                      onRevert={() => setEdits((e) => { const n = { ...e }; delete n[r.id]; return n; })}
                      onSource={() => r.docId && r.quote && setReading({ id: r.docId, marks: [r.quote] })}
                    />
                  ))}
                </dl>
              </div>
            ))}
            {result.meta.plainText && <p className="zd-note">{result.meta.plainText.notice}</p>}
          </section>

          <aside className="zd-side">
            <section className="card zd-docs" aria-label="Dokumenty k odeslání">
              <div className="card-head">
                <h2><span className="zd-num">3</span>Zprávy z ambulance</h2>
                <span className="muted">{reports(docs.length)}</span>
              </div>
              <ul className="docs zd-doclist">
                {docs.map((d) => (
                  <li key={d.id}>
                    <button type="button" className="doc-row" onClick={() => setReading({ id: d.id, marks: [] })}>
                      <DocIcon code={codeOf(d)} />
                      <span className="doc-main">
                        <b>{titleOf(d)}</b>
                        <span className="doc-path">{d.id} · {d.letter ? 'váš dopis se žádostí' : R.facility(d) || d.title}</span>
                        {d.source === 'ocr' && <span className="chip conf">z obrázku – zkontrolujte text</span>}
                      </span>
                      <span className="doc-when"><span className="doc-date">{czDate(d.date)}</span></span>
                    </button>
                    {!d.letter && !sent && (
                      <button type="button" className="pt-remove" title="Odebrat zprávu" aria-label={`Odebrat zprávu ${d.title}`}
                        onClick={() => setDocs((prev) => arrange(prev.filter((x) => x !== d)))}>
                        <Icon name="close" size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {!sent && (
                <div className={`drop zd-drop-more${over ? ' over' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setOver(true); }}
                  onDragLeave={() => setOver(false)}
                  onDrop={(e) => { e.preventDefault(); setOver(false); void onFiles(Array.from(e.dataTransfer.files)); }}>
                  <p>Přetáhněte sem další zprávy, nebo</p>
                  <button type="button" className="btn-ghost" disabled={busy} onClick={() => input.current?.click()}><Icon name="plus" size={16} />{busy ? 'Čtu…' : 'Přiložit zprávy'}</button>
                </div>
              )}
              {errors.length > 0 && <ul className="add-errors zd-errors">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
            </section>

            {!sent ? (
              <>
                <section className="card zd-send" aria-label="Odeslání">
                  <p className="zd-send-to"><small>Odeslat do</small><b>{target.label}</b><span className="muted">{reports(docs.length)} · {open.length ? `${open.length} k doplnění – viz níže` : 'koordinátor KOC dostane vše v jednom kroku'}</span></p>
                  <button type="button" className="btn-primary zd-go" disabled={busy} onClick={send}><Icon name="right" size={18} />Odeslat do {target.label}</button>
                  <p className="zd-sim">Odesílání je v prototypu simulované.</p>
                </section>

                <section className="card zd-check" aria-label="Před odesláním">
                  <div className="card-head">
                    <h2>Před odesláním</h2>
                    {open.length ? <span className="chip miss">{open.length} k doplnění</span> : <span className="chip ok">kompletní</span>}
                  </div>
                  <p className="muted zd-lead">{open.length ? 'Co bude koordinátorce chybět nebo nesedí. Doplňte, co víte – zbytek zajistí KOC.' : 'Koordinátorka dostane všechny potřebné údaje v jednom kroku.'}</p>
                  {checks.length > 0 && (
                    <ul className="zd-checks">
                      {checks.map((c) => (
                        <li key={c.key}>
                          <span className={`todo-icon ${c.kind}`}><Icon name={c.kind === 'ok' ? 'check' : 'alert'} size={16} /></span>
                          <div className="zd-check-main">
                            <p>{nb(c.text)}</p>
                            {c.items && <ul className="zd-items">{c.items.map((x) => <li key={x}>{nb(x)}</li>)}</ul>}
                            {c.row && <button type="button" className="src-link" onClick={() => focusRow(c.row!)}>Doplnit</button>}
                            {c.cites && c.cites.length > 0 && (
                              <p className="zd-check-links">
                                {c.cites.map((x) => <button key={x.docId} type="button" className="src-link" onClick={() => setReading({ id: x.docId, marks: x.marks })}>Ukázat ve zprávě {x.docId}</button>)}
                              </p>
                            )}
                            {c.key === 'results' && c.kind === 'miss' && <button type="button" className="src-link" onClick={() => input.current?.click()}>Přiložit zprávy</button>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            ) : (
              <section className="card zd-done" aria-live="polite" ref={done}>
                <div className="card-head"><h2><Icon name="check" size={18} />Odesláno do {sent.koc.label}</h2></div>
                <p className="zd-done-when">Přijato v KOC · {czDate(sent.at.slice(0, 10))} {sent.at.slice(11)}</p>
                <div className="zd-confirm">
                  <span className="eyebrow">Potvrzení pro praktika · {sent.gp}</span>
                  <ul>
                    <li>Žádost o převzetí do péče je přijata, nic dalšího nevyplňujete.</li>
                    <li>Předáno: dopis{sent.reports > 0 && ` a ${reports(sent.reports)}`}.</li>
                    {sent.requests > 0 && <li>Výsledky {sent.requests} vyšetření, která nejsou přiložená, si koordinátorka vyžádá sama.</li>}
                    {sent.stillMissing.length > 0 && <li>Pokud víte, pošlete prosím: {sent.stillMissing.join(', ')}.</li>}
                    <li>Závěr konzilia vám přijde zpět, jakmile proběhne.</li>
                  </ul>
                </div>
                <p className="zd-sim">
                  Odesílání je v prototypu simulované.
                  {sent.koc.id !== KOCS[0].id && ' Prototyp má jen pracoviště koordinátorky KOC 2 – případ uvidíte v jejím seznamu pacientů.'}
                </p>
                <div className="form-actions zd-done-actions">
                  <a className="btn-primary" href={`#/pacienti/${sent.caseId}`}>Jak to vidí koordinátorka<Icon name="right" size={16} /></a>
                  <button type="button" className="btn-ghost" onClick={reset}>Nová žádanka</button>
                </div>
              </section>
            )}
          </aside>
        </div>
      )}

      <DocViewer doc={readingDoc ? viewOf(readingDoc) : null} marks={reading?.marks ?? []} onClose={() => setReading(null)} />
    </div>
  );
}

/** One value from the letter: reads like text, edits in place; where it came from, or that the letter does not say it. */
function FieldRow({ row, letterId, value, edited, locked, onChange, onRevert, onSource }: {
  row: Row; letterId: string; value: string; edited: boolean; locked: boolean;
  onChange: (v: string) => void; onRevert: () => void; onSource: () => void;
}) {
  const id = `zd-in-${row.id}`;
  const empty = !value.trim();
  const cls = `zd-input${empty ? ' empty' : ''}`;
  const ecog = row.id === 'performance' && !row.value;
  const area = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return (
    <div className={`zd-row${!row.value && !edited ? ' miss' : ''}`}>
      <dt><label htmlFor={id}>{row.label}</label></dt>
      <dd>
        {ecog ? (
          <select id={id} className={cls} value={value} disabled={locked} onChange={(e) => (e.target.value ? onChange(e.target.value) : onRevert())}>
            <option value="">vyberte, pokud víte</option>
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={`ECOG ${n}`}>ECOG {n}</option>)}
          </select>
        ) : row.long ? (
          <textarea ref={area} id={id} className={cls} value={value} rows={1} readOnly={locked} placeholder={row.placeholder} onChange={(e) => onChange(e.target.value)} onBlur={() => { if (!value.trim()) onRevert(); }} />
        ) : (
          <input id={id} className={cls} type={row.type ?? 'text'} value={value} readOnly={locked} placeholder={row.placeholder} onChange={(e) => onChange(e.target.value)} onBlur={() => { if (!value.trim()) onRevert(); }} />
        )}
        {row.id === 'insurer' && R.insurerName(value.trim()) && <small className="zd-hint">{R.insurerName(value.trim())}</small>}
      </dd>
      <dd className="zd-src">
        {edited ? (
          <>
            <span className={`chip ${row.value ? 'conf' : 'ok'}`}>{row.value ? 'opraveno' : 'doplněno'}</span>
            {!locked && <button type="button" className="src-link" onClick={onRevert}>Vrátit</button>}
          </>
        ) : row.value ? (
          <button type="button" className="src-link" title={row.quote ? `„${row.quote}“` : undefined} onClick={onSource} disabled={!row.quote}>
            {row.docId === letterId ? 'z dopisu' : `zpráva ${row.docId}`}
          </button>
        ) : <span className={`chip ${row.need ? 'miss' : 'new'}`}>{row.need ? 'chybí' : 'není'}</span>}
      </dd>
    </div>
  );
}
