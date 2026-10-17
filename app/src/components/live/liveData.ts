// Data for the "Zpracování naživo" screen: the reports of a case in the order the coordinator received them,
// Czech labels for the 20 fields of the VZP template Handover_obsah, and the prepared "try to break it" edits.
// Texts of Alena's reports come from public/data/source.json (reports 01–13 of the assignment, nothing else –
// no invented report 14). Josef Novák's reports come from CASES (src/data/pacient2.gen.ts).
import { getCase } from '../../data/cases';
import type { ISODate, SourceDoc } from '../../types';
import { docTitle, facility } from '../../ai/rules.ts';

export interface LiveDoc {
  id: string;
  date: ISODate;            // date of the report itself – the extractor uses it for "stav k datu konzilia"
  receivedAt: ISODate;      // when the coordinator received it – order of the timeline
  title: string;            // Czech
  place: string;            // Czech
  channel: string;          // Czech label of the channel
  text: string;
  isRequest: boolean;       // the referral that opens the case
  byCoordinator?: boolean;  // a note written by the coordinator (phone call), not a report of a workplace
}

export interface LiveCase {
  id: 'alena' | 'novak';
  patientName: string;
  female: boolean;
  receivedAt: ISODate;      // referral received = day 0
  mdtDate: ISODate;
  docs: LiveDoc[];          // sorted by receivedAt, the referral first
}

export const LIVE_CASE_IDS = ['alena', 'novak'] as const;
export type LiveCaseId = (typeof LIVE_CASE_IDS)[number];

const CHANNEL_CZ: Record<string, string> = {
  'e-mail': 'e-mail', eZpráva: 'eZpráva', ePACS: 'ePACS', 'telefón': 'telefon', NIS: 'NIS', papier: 'papír', 'formulár': 'formulář',
};
export function channelCz(ch: string | undefined): string {
  return ch ? CHANNEL_CZ[ch] ?? ch : '–';
}

/** Alena: workplace and document as listed in the VZP assignment (Zadani_ulohy, overview table). */
const ALENA_META: Record<string, { title: string; place: string; receivedAt: ISODate; channel: string }> = {
  '01': { title: 'Kontrola u kardiologa', place: 'Kardiologická ambulance Jesenice', receivedAt: '2026-10-06', channel: 'e-mail' },
  '02': { title: 'Laboratoř – odběry praktického lékaře', place: 'Laboratoř LabJih', receivedAt: '2026-10-03', channel: 'eZpráva' },
  '03': { title: 'RTG plic', place: 'Radiologické centrum Modřany', receivedAt: '2026-10-06', channel: 'papier' },
  '04': { title: 'Epikríza praktického lékaře, odeslání ke gastroenterologovi', place: 'Praktický lékař, Dolní Břežany', receivedAt: '2026-10-05', channel: 'e-mail' },
  '05': { title: 'Vstupní vyšetření gastroenterologem', place: 'Poliklinika Jižní – gastroenterologie', receivedAt: '2026-10-05', channel: 'eZpráva' },
  '06': { title: 'UZ břicha', place: 'Poliklinika Jižní – RDG', receivedAt: '2026-10-05', channel: 'eZpráva' },
  '07': { title: 'Žádost praktického lékaře o převzetí do péče KOC 2', place: 'Praktický lékař, Dolní Břežany', receivedAt: '2026-10-02', channel: 'eZpráva' },
  '08': { title: 'Výsledek CT břicha a hrudníku', place: 'KOC 1 – Nemocnice Severní', receivedAt: '2026-10-08', channel: 'ePACS' },
  '09': { title: 'Protokol o provedení biopsie (EUS-FNB)', place: 'KOC 2 – Nemocnice Lipová, endoskopie', receivedAt: '2026-10-12', channel: 'NIS' },
  '10': { title: 'Kontrolní odběry a nádorové markery', place: 'KOC 2 – Nemocnice Lipová, laboratoř', receivedAt: '2026-10-15', channel: 'NIS' },
  '11': { title: 'Výsledek biopsie (histologie)', place: 'KOC 2 – Nemocnice Lipová, patologie', receivedAt: '2026-10-19', channel: 'NIS' },
  '12': { title: 'Algeziologické vyšetření', place: 'KOC 1 – Nemocnice Severní, léčba bolesti', receivedAt: '2026-10-26', channel: 'eZpráva' },
  '13': { title: 'Zpráva klinického psychologa', place: 'KOC 2 – Nemocnice Lipová, psychoonkologie', receivedAt: '2026-10-27', channel: 'NIS' },
};

/** Josef Novák (second fictional patient): Czech titles and places of his 10 reports. */
const NOVAK_META: Record<string, { title: string; place: string }> = {
  'N-01': { title: 'Praktická lékařka – žádost o vyšetření u pneumologa', place: 'Ordinace praktického lékaře, Benešov' },
  'N-02': { title: 'RTG hrudníku', place: 'Nemocnice Podhájí – radiologie' },
  'N-03': { title: 'Pneumolog – vstupní vyšetření', place: 'Nemocnice Podhájí – plicní ambulance' },
  'N-04': { title: 'Laboratoř a nádorové markery', place: 'Laboratoř LabPodhájí' },
  'N-05': { title: 'CT hrudníku a horního břicha', place: 'Nemocnice Podhájí – radiologie' },
  'N-06': { title: 'Bronchoskopie s EBUS-TBNA – protokol', place: 'KOC 2 – Nemocnice Lipová, bronchologie' },
  'N-07': { title: 'Histologie – bioptický nález', place: 'KOC 2 – Nemocnice Lipová, patologie' },
  'N-08': { title: 'PET/CT celotělové', place: 'KOC 1 – Nemocnice Severní, nukleární medicína' },
  'N-09': { title: 'Žádost pneumologa o převzetí do KOC (epikríza)', place: 'Nemocnice Podhájí – plicní ambulance' },
  'N-10': { title: 'Nutriční ambulance – screening', place: 'KOC 2 – Nemocnice Lipová, nutriční ambulance' },
};

function byArrival(a: LiveDoc, b: LiveDoc): number {
  return a.receivedAt.localeCompare(b.receivedAt) || Number(b.isRequest) - Number(a.isRequest) || a.id.localeCompare(b.id);
}

interface SourceJson { documents: { id: string; file: string; date: string; text: string }[] }
let sourceCache: Promise<SourceJson> | null = null;
function loadSourceJson(): Promise<SourceJson> {
  if (!sourceCache) {
    sourceCache = fetch(`${import.meta.env.BASE_URL}data/source.json`)
      .then((r) => { if (!r.ok) throw new Error(`source.json: HTTP ${r.status}`); return r.json() as Promise<SourceJson>; })
      .catch((e: unknown) => { sourceCache = null; throw e; });
  }
  return sourceCache;
}

function caseDocs(caseId: string): SourceDoc[] {
  return getCase(caseId)?.docs ?? [];
}

async function loadAlena(): Promise<LiveCase> {
  const src = await loadSourceJson();
  const known = new Map(caseDocs('alena').map((d) => [d.id, d]));
  const c = getCase('alena');
  const docs: LiveDoc[] = src.documents
    .filter((d) => /^\d{2}$/.test(d.id) && ALENA_META[d.id])
    .map((d) => {
      const meta = ALENA_META[d.id];
      const k = known.get(d.id);
      return {
        id: d.id,
        date: d.date,
        receivedAt: k?.receivedAt ?? meta.receivedAt,
        title: meta.title,
        place: meta.place,
        channel: channelCz(k?.channel ?? meta.channel),
        text: d.text,
        isRequest: d.id === '07',
      };
    });
  return {
    id: 'alena', patientName: 'Alena Procházková', female: true,
    receivedAt: c?.receivedAt ?? '2026-10-02', mdtDate: c?.mdtDate ?? '2026-10-21',
    docs: docs.sort(byArrival),
  };
}

function loadNovak(): LiveCase | null {
  const c = getCase('novak');
  if (!c) return null;
  const docs: LiveDoc[] = c.docs
    .filter((d) => typeof d.text === 'string' && d.text.length > 0 && d.id !== 'MDT')
    .map((d) => {
      const meta = NOVAK_META[d.id];
      const engineDoc = { id: d.id, date: d.examDate, text: d.text ?? '' };
      return {
        id: d.id,
        date: d.examDate,
        receivedAt: d.receivedAt ?? d.examDate,
        title: meta?.title ?? docTitle(engineDoc),
        place: meta?.place ?? facility(engineDoc),
        channel: channelCz(d.channel),
        text: d.text ?? '',
        isRequest: d.kind === 'request',
      };
    });
  if (!docs.length) return null;
  return {
    id: 'novak', patientName: `${c.patient.firstName} ${c.patient.lastName}`, female: c.patient.sex === 'žena',
    receivedAt: c.receivedAt, mdtDate: c.mdtDate ?? '2026-10-22',
    docs: docs.sort(byArrival),
  };
}

/** Loads a case for the live screen; Novák falls back to Alena when his reports are not available. */
export async function loadLiveCase(id: string): Promise<LiveCase> {
  if (id === 'novak') {
    const n = loadNovak();
    if (n) return n;
  }
  return loadAlena();
}

export function novakAvailable(): boolean {
  return caseDocs('novak').some((d) => typeof d.text === 'string' && d.text.length > 0);
}

// ---------------------------------------------------------------- the 20 fields of Handover_obsah (Czech)

export const FIELD_CZ: Record<string, { label: string; labelMale?: string; group: string }> = {
  firstName: { label: 'Jméno', group: 'Pacient' },
  lastName: { label: 'Příjmení', group: 'Pacient' },
  age: { label: 'Věk', group: 'Pacient' },
  sex: { label: 'Pohlaví', group: 'Pacient' },
  insurer: { label: 'Zdravotní pojišťovna', group: 'Pacient' },
  patientContact: { label: 'Kontakt na pacientku', labelMale: 'Kontakt na pacienta', group: 'Kontakty' },
  contactPerson: { label: 'Kontaktní osoba', group: 'Kontakty' },
  diagnosis: { label: 'Diagnóza', group: 'Diagnóza' },
  epicrisis: { label: 'Průběh nemoci ve zkratce (epikríza)', group: 'Diagnóza' },
  mdtQuestion: { label: 'Otázka pro konzilium', group: 'Diagnóza' },
  comorbidities: { label: 'Přidružená onemocnění', group: 'Anamnéza' },
  medication: { label: 'Léky, které užívá', group: 'Anamnéza' },
  allergies: { label: 'Alergie', group: 'Anamnéza' },
  performance: { label: 'Stav výkonnosti (ECOG)', group: 'Stav' },
  weightHeight: { label: 'Váha a výška', group: 'Stav' },
  symptoms: { label: 'Příznaky a jejich začátek', group: 'Stav' },
  exams: { label: 'Provedená vyšetření', group: 'Vyšetření' },
  labs: { label: 'Laboratoř a nádorové markery', group: 'Vyšetření' },
  histology: { label: 'Histologie (výsledek biopsie)', group: 'Vyšetření' },
  other: { label: 'Jiná důležitá sdělení a přání pacientky', labelMale: 'Jiná důležitá sdělení a přání pacienta', group: 'Jiné' },
};

export function fieldLabel(key: string, female: boolean, fallback: string): string {
  const f = FIELD_CZ[key];
  if (!f) return fallback;
  return !female && f.labelMale ? f.labelMale : f.label;
}

export const GROUP_ORDER = ['Pacient', 'Kontakty', 'Diagnóza', 'Anamnéza', 'Stav', 'Vyšetření', 'Jiné'];

// ---------------------------------------------------------------- "Zkuste to rozbít": prepared edits (Alena)
// The same edits are tested against the extractor by `npm run eval:mutations` (public/data/mutace.json).

export interface Preset {
  id: string;
  title: string;
  detail: string;
  docId: string;
  /** New text of the report, or null = the report is deleted. */
  apply: (original: string) => string | null;
}

export const ALENA_PRESETS: Preset[] = [
  {
    id: 'rc', docId: '10',
    title: 'Jiné rodné číslo ve zprávě 10',
    detail: 'V hlavičce laboratoře KOC se RČ 635722/1013 změní na 635722/1031.',
    apply: (t) => t.replace('RČ 635722/1013', 'RČ 635722/1031'),
  },
  {
    id: 'apixaban', docId: '09',
    title: 'Opravit datum poslední dávky apixabanu (zpráva 09)',
    detail: '„poslední dávka 18. 10. 2026 večer“ se změní na „poslední dávka 10. 10. 2026 večer“.',
    apply: (t) => t.replace('poslední dávka 18. 10. 2026 večer', 'poslední dávka 10. 10. 2026 večer'),
  },
  {
    id: 'ecog', docId: '07',
    title: 'Doplnit „ECOG 1“ do žádanky (zpráva 07)',
    detail: 'Před slovo „Soběstačná,“ se vloží věta „Stav výkonnosti: ECOG 1.“',
    apply: (t) => t.replace('Soběstačná, v práci', 'Stav výkonnosti: ECOG 1. Soběstačná, v práci'),
  },
  {
    id: 'kauda', docId: '08',
    title: 'Jiné umístění nádoru ve zprávě 08 (CT)',
    detail: '„Tumor hlavy pankreatu 35 mm“ se změní na „Tumor kaudy pankreatu 35 mm“.',
    apply: (t) => t.replace('Tumor hlavy pankreatu 35 mm', 'Tumor kaudy pankreatu 35 mm'),
  },
  {
    id: 'no11', docId: '11',
    title: 'Smazat zprávu 11 (histologie)',
    detail: 'Zpráva z patologie se vyřadí, jako by nepřišla.',
    apply: () => null,
  },
];

/** Suggested text of the phone note in the demo (the coordinator writes it; it is not a report of a workplace). */
export const PHONE_NOTE_SUGGESTION: Record<LiveCaseId, string> = {
  alena: 'Telefonát 20. 10. 2026 s MUDr. Lenkou Markovou (onkologická ambulance KOC):\nECOG 1.',
  novak: '',
};
