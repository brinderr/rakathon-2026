// Tab "Plán cesty" (owner: Bruno) – slide 10 of the VZP brief: the plan watches the order of the steps, the
// communication and the dates. Hotovo, když: it is clear where the case is, who is on turn and by when.
// Every step comes from the case: the exams the coordinator arranged are the reports in the step "koordinovat"
// (CT, biopsy, labs, histology), the MDT and the conclusion come from the journey, the exams after the MDT from
// `afterMdt`. Each step shows its state (vyžádáno → objednáno → provedeno → výsledek doručen), date, place, who is on
// turn, the sentences behind it (a click opens the report) and what must come before it. A result that came later
// than promised shows the delay in working days; a step past its date is red with "Urgovat". SMS to the patient and
// e-mail to the workplace are simulated and written to the coordination record (state/messages, state/caseStore).
// "Spustit sadu kroků" shows the set for pancreatic cancer and adds the steps the case does not have yet; "Přidat
// úkol" adds a one-off task with a date and an owner. Both are kept as lines of the coordination record.
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ME, stamp, updateCase, useCase } from '../../../state/caseStore';
import type { CaseEvent, CaseState } from '../../../state/caseStore';
import { isMessage, sendMessage } from '../../../state/messages';
import type { Channel } from '../../../state/messages';
import { Icon } from '../../../ui/Icon';
import { czDate, daysBetween, nb, telHref } from '../../../ui/format';
import { useCaseData } from '../caseContext';
import { History } from '../History';
import { SentLine } from '../Journey';
import type { OpenDoc } from '../Journey';
import type { CaseData, DocRef, Quote } from '../types';
import './plan.css';

/** The KOC of the coordinator (the case is coordinated from here). */
const OWN = 'KOC Nemocnice Lipová';
const SIGNATURE = `${ME}\nkoordinátorka ${OWN}`;
const PHASES = ['Vyžádáno', 'Objednáno', 'Provedeno', 'Výsledek doručen'];

type Group = 'diag' | 'mdt' | 'support' | 'task';
const GROUPS: { id: Group; label: string }[] = [
  { id: 'diag', label: 'Diagnostika' },
  { id: 'mdt', label: 'Konzilium a výsledek pro praktika' },
  { id: 'support', label: 'Podpůrná péče' },
  { id: 'task', label: 'Jednorázové úkoly' },
];

/** The set of steps for pancreatic cancer – the steps and their order as in the VZP case (Zadání úlohy). */
const SET = {
  name: 'karcinom slinivky',
  steps: [
    { id: 'ct', title: 'CT břicha a hrudníku', detail: 'pankreatický protokol', group: 'diag', after: [] },
    { id: 'biopsie', title: 'Biopsie EUS-FNB', detail: 'histologická verifikace ložiska', group: 'diag', after: ['ct'] },
    { id: 'histologie', title: 'Histologie', detail: 'výsledek biopsie', group: 'diag', after: ['biopsie'] },
    { id: 'odbery', title: 'Kontrolní odběry', detail: 'krevní obraz, biochemie, nádorové markery', group: 'diag', after: [] },
    { id: 'podklad', title: 'Podklad pro konzilium', detail: 'údaje podle Handover_obsah, potvrzení lékařem', group: 'mdt', after: ['ct', 'histologie', 'odbery'] },
    { id: 'konzilium', title: 'Konzilium (MDT)', detail: 'rozhodnutí o léčbě', group: 'mdt', after: ['podklad'] },
    { id: 'zaver', title: 'Závěr praktikovi', detail: 's doručenkou', group: 'mdt', after: ['konzilium'] },
    { id: 'algeziologie', title: 'Algeziologie', detail: 'léčba bolesti', group: 'support', after: [] },
    { id: 'psychoonkologie', title: 'Psychoonkologie', detail: 'psychologická podpora', group: 'support', after: [] },
  ] as { id: string; title: string; detail: string; group: Group; after: string[] }[],
};

// ---------- what the coordinator did in the plan (lines of the coordination record) ----------

interface PlanMark {
  step: string;
  /** state moved by hand (1 vyžádáno, 2 objednáno) and the date it is booked for */
  phase?: number; date?: string;
  /** a one-off task */
  task?: { title: string; due: string; owner: string; after?: string };
  done?: boolean;
  /** the set of steps was started */
  set?: string;
}
interface PlanEvent extends CaseEvent { plan: PlanMark }
const isPlan = (e: CaseEvent): e is PlanEvent => 'plan' in e;

function mark(caseId: string, day: string, text: string, plan: PlanMark) {
  const e: PlanEvent = { at: stamp(day), who: ME, kind: 'poznamka', text, field: `plan:${plan.step}`, plan };
  updateCase(caseId, (s) => ({ ...s, events: [...s.events, e] }));
}

// ---------- dates: working days (weekends and Czech public holidays with a fixed date) ----------

const FIXED_HOLIDAYS = ['01-01', '05-01', '05-08', '07-05', '07-06', '09-28', '10-28', '11-17', '12-24', '12-25', '12-26'];
const isoOf = (t: number) => new Date(t).toISOString().slice(0, 10);
const noon = (iso: string) => Date.parse(`${iso}T12:00:00Z`);
function isWorkday(iso: string): boolean {
  const w = new Date(noon(iso)).getUTCDay();
  return w !== 0 && w !== 6 && !FIXED_HOLIDAYS.includes(iso.slice(5));
}
function addWorkdays(iso: string, n: number): string {
  let t = noon(iso);
  for (let k = 0; k < n;) { t += 86_400_000; if (isWorkday(isoOf(t))) k++; }
  return isoOf(t);
}
/** Working days after `a` up to and including `b`. */
function workdaysBetween(a: string, b: string): number {
  let n = 0;
  for (let t = noon(a) + 86_400_000; t <= noon(b); t += 86_400_000) if (isWorkday(isoOf(t))) n++;
  return n;
}
const workdays = (n: number) => `${n} ${n === 1 ? 'pracovní den' : n < 5 ? 'pracovní dny' : 'pracovních dní'}`;
const days = (n: number) => `${n} ${n === 1 ? 'den' : n < 5 ? 'dny' : 'dní'}`;
/** "dnes", "zítra", "za 7 dní", "včera", "před 3 dny" */
function rel(today: string, iso: string): string {
  const n = daysBetween(today, iso);
  if (n === 0) return 'dnes';
  if (n === 1) return 'zítra';
  if (n === -1) return 'včera';
  return n > 0 ? `za ${days(n)}` : `před ${-n} dny`;
}
const dm = (iso: string) => `${Number(iso.slice(8, 10))}. ${Number(iso.slice(5, 7))}.`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- the plan of the case ----------

interface Who { name: string; sub?: string; me?: boolean; phone?: string }
interface PlanStep {
  id: string;
  group: Group;
  title: string;
  detail?: string;
  /** organisation and department ("KOC Nemocnice Severní", "Radiologická klinika") */
  org?: string; dept?: string;
  /** the date the exam / the MDT takes place, or the deadline of a task */
  date?: string;
  /** the deadline of what is awaited now (a result promised, a task) */
  due?: string; dueWhat?: string;
  /** exam track: how many of PHASES are done (0–4); undefined for a step without the track */
  phase?: number;
  /** state for a step without the track */
  state?: { label: string; cls: string };
  done: boolean;
  owner: Who | null;
  after: string[];
  docId?: string;
  requestedBy?: string;
  quotes: Quote[];
  /** a result that came later than promised */
  late?: { due: string; got: string; days: number };
  /** a condition before the step (e.g. anticoagulation before an invasive procedure) */
  before?: Quote;
  note?: string;
  link?: { href: string; label: string };
  fromSet?: boolean;
  manual?: boolean;
}

/** The sentence of a report that matches – shown as a quote and highlighted when the report opens. */
function pick(data: CaseData, docId: string | undefined, re: RegExp): Quote | null {
  const d = docId ? data.documents[docId] : undefined;
  if (!d) return null;
  const s = d.text.split(/\n|(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/).map((x) => x.trim()).find((x) => re.test(x));
  return s ? { docId: d.id, ref: d.ref, quote: s } : null;
}
const quotes = (...q: (Quote | null)[]) => q.filter((x): x is Quote => Boolean(x));

/** "Indikující lékař: …" / "Odesílající: …" – who asked for the exam, as the report says. */
function requester(data: CaseData, docId: string): string | undefined {
  return data.documents[docId]?.text.match(/^(?:Indikující lékař|Odesílající):\s*(.+)$/m)?.[1].trim();
}

function placeOf(d: DocRef): { org: string; dept?: string } {
  const [org, ...rest] = d.place.split(' – ');
  return rest.length ? { org, dept: rest.join(' – ') } : { org };
}

const nameOf = (d: DocRef) => cap(d.ref.replace(/\s+\d{1,2}\.\s*\d{1,2}\.$/, ''));
const SET_ID: Record<string, string> = { CT: 'ct', EUS: 'biopsie', LAB: 'odbery', HIS: 'histologie' };

function buildPlan(data: CaseData, st: CaseState): PlanStep[] {
  const today = data.today;
  const mdt = data.mdtDate;
  const marks = st.events.filter(isPlan);
  const referral = data.steps.find((s) => s.id === 'prevzit')?.docs?.[0]?.id;
  const exams = (data.steps.find((s) => s.id === 'koordinovat')?.docs ?? []).filter((d) => d.date <= today);
  const steps: PlanStep[] = [];
  const used = new Set<string>();

  // exams the coordinator arranged: one step per report
  for (const d of exams) {
    let id = SET_ID[d.code] ?? `doc-${d.id}`;
    if (used.has(id)) id = `doc-${d.id}`;
    used.add(id);
    const { org, dept } = placeOf(d);
    const step: PlanStep = {
      id, group: 'diag', title: nameOf(d), detail: d.title, org, dept, date: d.date, phase: 4, done: true, owner: null,
      after: [], docId: d.id, requestedBy: requester(data, d.id), quotes: [],
    };
    if (id === 'ct') {
      step.title = 'CT';
      step.quotes = quotes(pick(data, referral, /doplnit CT/), pick(data, referral, /Termín CT/));
    }
    if (id === 'biopsie') {
      step.title = /biops/i.test(d.title) ? d.title : `Biopsie ${d.title}`;
      step.detail = data.documents[d.id]?.text.match(/^Výkon:\s*(.+)$/m)?.[1] ?? d.title;
      step.quotes = quotes(pick(data, referral, /histologick\S* verifikac/));
      step.before = pick(data, referral, /před invazivními výkony/) ?? undefined;
    }
    if (id === 'odbery') {
      const taken = data.documents[d.id]?.text.match(/^Odběr:\s*(.+)$/m)?.[1];
      step.detail = taken ? `${d.title}, odběr ${taken}` : d.title;
    }
    steps.push(step);
  }

  // histology: asked for at the biopsy, with the date it was promised for
  const eus = steps.find((s) => s.id === 'biopsie');
  const his = steps.find((s) => s.id === 'histologie');
  if (eus) {
    const promise = pick(data, eus.docId, /pracovních dn/);
    const sent = pick(data, eus.docId, /histologickému vyšetření/);
    const n = Number(promise?.quote.match(/(\d+)\s+pracovních dn/)?.[1] ?? 0);
    const due = n && eus.date ? addWorkdays(eus.date, n) : undefined;
    if (his) {
      his.after = ['biopsie'];
      his.quotes = quotes(sent, promise);
      if (due && his.date && his.date > due) his.late = { due, got: his.date, days: workdaysBetween(due, his.date) };
    } else {
      steps.push({
        id: 'histologie', group: 'diag', title: 'Histologie', detail: 'výsledek biopsie', org: eus.org, phase: 3, done: false,
        owner: { name: 'Patologie', sub: 'výsledek biopsie' }, after: ['biopsie'], quotes: quotes(sent, promise),
        ...(due ? { due, dueWhat: 'výsledek slíben do' } : {}),
      });
    }
    eus.after = steps.some((s) => s.id === 'ct') ? ['ct'] : [];
  }

  // the podklad for the MDT (the coordinator's job), the MDT, the conclusion for the GP
  const pk = data.steps.find((s) => s.id === 'podklad');
  const open = pk?.todo?.length ?? 0;
  const pkDone = pk?.status === 'done';
  const diagIds = steps.filter((s) => s.group === 'diag').map((s) => s.id).filter((x) => ['ct', 'histologie', 'odbery'].includes(x));
  steps.push({
    id: 'podklad', group: 'mdt', title: 'Podklad pro konzilium', detail: pkDone ? pk?.title : 'údaje pro konzilium, potvrzení lékařem',
    org: OWN, done: pkDone, owner: pkDone ? null : { name: 'Vy', sub: 'koordinátorka', me: true },
    ...(pk?.due && !pkDone ? { date: pk.due, due: pk.due, dueWhat: 'připravit do' } : {}),
    state: pkDone ? { label: 'potvrzeno', cls: 'ok' } : open ? { label: `${open} ${open === 1 ? 'bod' : open < 5 ? 'body' : 'bodů'} k vyřešení`, cls: 'conf' } : { label: 'k potvrzení lékařem', cls: 'new' },
    after: diagIds, quotes: [], link: { href: `#/pacienti/__ID__/${open ? 'udaje' : 'podklad'}`, label: open ? 'Otevřít údaje' : 'Otevřít podklad' },
  });

  const conclusion = st.conclusion;
  const zaverStep = data.steps.find((s) => s.id === 'uzavrit');
  const delivered = zaverStep?.status === 'done';
  const mdtPast = Boolean(mdt && mdt <= today);
  steps.push({
    id: 'konzilium', group: 'mdt', title: 'Konzilium (MDT)', detail: 'rozhodnutí o dalším postupu', org: OWN,
    ...(mdt ? { date: mdt } : {}), phase: delivered ? 4 : mdtPast ? 3 : mdt ? 2 : 1, done: delivered || mdtPast,
    owner: mdtPast ? null : mdt ? { name: 'Konzilium (MDT)', sub: OWN } : { name: 'Vy', sub: 'domluvit termín konzilia', me: true },
    after: ['podklad'], quotes: quotes(pick(data, referral, /v rámci MDT/)),
  });
  steps.push({
    id: 'zaver', group: 'mdt', title: 'Závěr praktikovi', detail: `${data.patient.gp.name}, s doručenkou`, org: OWN,
    done: delivered,
    state: delivered ? { label: 'doručeno', cls: 'ok' } : conclusion?.sent ? { label: 'odesláno, čeká na doručení', cls: 'new' } : mdtPast ? { label: 'k odeslání', cls: 'new' } : { label: 'po konziliu', cls: '' },
    owner: delivered ? null : mdtPast || conclusion?.sent ? { name: 'Vy', sub: 'koordinátorka', me: true } : null,
    ...(mdt && !delivered ? { note: `Po konziliu ${czDate(mdt)} odejde závěr praktikovi.` } : {}),
    after: ['konzilium'], quotes: [], link: { href: '#/pacienti/__ID__/zaver', label: 'Otevřít závěr' },
  });

  // exams booked for after the MDT (algeziologie, psychoonkologie in the demo case)
  for (const d of data.afterMdt) {
    const id = /algezi/i.test(d.ref) ? 'algeziologie' : /psycho/i.test(d.ref) ? 'psychoonkologie' : `doc-${d.id}`;
    const { org, dept } = placeOf(d);
    const booked = d.date > today;
    steps.push({
      id, group: 'support', title: nameOf(d), detail: d.what ?? d.title, org, dept, date: d.date, phase: booked ? 2 : 4, done: !booked,
      owner: booked ? { name: org, ...(dept ? { sub: dept } : {}) } : null, after: [],
      quotes: quotes(id === 'algeziologie' ? pick(data, referral, /paracetamol/) : id === 'psychoonkologie' ? pick(data, referral, /psychologick/) : null),
      ...(mdt && d.date > mdt ? { note: 'Proběhne po konziliu – zpráva nepatří do podkladu.' } : {}),
    });
  }

  // steps of the set that the case does not have yet (after "Spustit sadu kroků")
  if (marks.some((m) => m.plan.set)) {
    for (const t of SET.steps) {
      if (steps.some((s) => s.id === t.id)) continue;
      steps.push({ id: t.id, group: t.group, title: t.title, detail: t.detail, phase: 0, done: false, owner: { name: 'Vy', sub: 'vyžádat a objednat', me: true }, after: t.after, quotes: [], fromSet: true });
    }
  }

  // state moved by hand (vyžádáno / objednáno na …)
  for (const s of steps) {
    const own = marks.filter((m) => m.plan.step === s.id && m.plan.phase !== undefined);
    const last = own.at(-1)?.plan;
    if (!last || s.phase === undefined || (last.phase ?? 0) <= s.phase) continue;
    s.phase = last.phase;
    s.manual = true;
    if (last.date) s.date = last.date;
    s.owner = last.phase === 1 ? { name: 'Pracoviště', sub: 'potvrdit termín' } : { name: s.org ?? 'Pracoviště', sub: s.dept ?? (s.date ? `termín ${dm(s.date)}` : undefined) };
  }

  // one-off tasks
  const closed = new Set(marks.filter((m) => m.plan.done).map((m) => m.plan.step));
  for (const m of marks) {
    const t = m.plan.task;
    if (!t) continue;
    const done = closed.has(m.plan.step);
    const me = t.owner === 'Vy';
    steps.push({
      id: m.plan.step, group: 'task', title: t.title, date: t.due, due: done ? undefined : t.due, dueWhat: 'do', done,
      state: done ? { label: 'hotovo', cls: 'ok' } : { label: 'úkol', cls: '' },
      owner: done ? null : me ? { name: 'Vy', sub: 'koordinátorka', me: true } : { name: t.owner },
      after: t.after ? [t.after] : [], quotes: [],
    });
  }

  // keep only predecessors that exist in the plan
  const ids = new Set(steps.map((s) => s.id));
  for (const s of steps) s.after = s.after.filter((a) => ids.has(a));
  // the order inside a group: by date (histology by when it came), steps without a date last
  const key = (s: PlanStep) => s.date ?? s.due ?? '9999';
  const order = (g: Group) => GROUPS.findIndex((x) => x.id === g);
  return steps.sort((a, b) => order(a.group) - order(b.group) || (a.group === 'diag' || a.group === 'support' || a.group === 'task' ? key(a).localeCompare(key(b)) : 0));
}

const isOverdue = (s: PlanStep, today: string) => !s.done && Boolean(s.due && s.due < today);

// ---------- communication: SMS to the patient, e-mail to the workplace, urgency ----------

type Kind = 'sms' | 'mail' | 'urge';

function draftOf(kind: Kind, s: PlanStep, data: CaseData): { to: string; channels: Channel[]; subject: string; body: string } {
  const p = data.patient;
  const female = p.sex === 'žena';
  const who = `${female ? 'Pacientka' : 'Pacient'}: ${p.name}${p.born ? `, nar. ${p.born}` : ''}`;
  const where = [s.org, s.dept].filter(Boolean).join(' – ');
  const mdt = data.mdtDate && data.mdtDate > data.today ? data.mdtDate : '';
  if (kind === 'sms') {
    const what = s.date ? `Máte objednáno vyšetření ${czDate(s.date)}${where ? `: ${where}` : ''}.` : `${s.title}${where ? ` – ${where}` : ''}.`;
    return {
      to: p.name, channels: ['SMS'], subject: '',
      body: `Dobrý den, tady koordinační centrum ${OWN}. ${what} Pokud Vám termín nevyhovuje, odpovězte prosím na tuto zprávu.\nDěkujeme, ${ME.replace(/^Bc\.\s*/, '')}`,
    };
  }
  const to = s.owner && !s.owner.me ? [s.owner.name, s.owner.sub].filter(Boolean).join(' – ') : where || 'pracoviště';
  if (kind === 'urge') {
    const promised = s.quotes.find((q) => /pracovních dn/.test(q.quote));
    const reason = s.group === 'task' ? `připomínáme úkol „${s.title}“ – termín byl ${czDate(s.due ?? data.today)}.`
      : `${s.title} – výsledek byl slíben do ${czDate(s.due ?? data.today)}${promised ? ` („${promised.quote}“, ${promised.ref})` : ''}. Zatím ho nemáme.`;
    return {
      to, channels: ['e-mail', 'zabezpečená zpráva'], subject: `Urgence: ${s.title} – ${p.name}`,
      body: `Dobrý den,\n\n${who}\n${reason}\nProsíme o vyřízení${mdt ? ` – potřebujeme to na konzilium ${czDate(mdt)}` : ''}.\n\nDěkujeme.\n\n${SIGNATURE}`,
    };
  }
  const ask = s.phase !== undefined && s.phase >= 3 ? 'Prosíme o zaslání výsledku.' : s.date ? `Prosíme o potvrzení termínu ${czDate(s.date)}.` : 'Prosíme o termín vyšetření.';
  return {
    to, channels: ['e-mail', 'zabezpečená zpráva'], subject: `${s.title} – ${p.name}`,
    body: `Dobrý den,\n\n${who}\n${s.title}${s.detail ? ` (${s.detail})` : ''}: ${ask}${mdt && s.group === 'diag' ? `\nVýsledek potřebujeme na konzilium ${czDate(mdt)}.` : ''}\n\nDěkujeme.\n\n${SIGNATURE}`,
  };
}

function Composer({ kind, step, onClose }: { kind: Kind; step: PlanStep; onClose: () => void }) {
  const { id, data } = useCaseData();
  const d = useMemo(() => draftOf(kind, step, data), [kind, step, data]);
  const [channel, setChannel] = useState<Channel>(d.channels[0]);
  const [subject, setSubject] = useState(d.subject);
  const [body, setBody] = useState(d.body);
  const phone = kind === 'sms' ? data.patient.phone : undefined;
  const send = () => {
    if (!body.trim()) return;
    sendMessage(id, data.today, { to: d.to, channel, subject: channel === 'SMS' ? '' : subject.trim(), body: body.trim(), field: `plan:${step.id}`, request: false });
    onClose();
  };
  return (
    <form className="plan-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <p className="plan-compose-to">
        <span><small>Komu</small><b>{d.to}</b>{phone && <span className="mono">{phone}</span>}</span>
        {d.channels.length > 1 ? (
          <label>Jak
            <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>{d.channels.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
        ) : <span className="chip new">{channel}</span>}
      </p>
      {channel !== 'SMS' && <label>Předmět<input value={subject} onChange={(e) => setSubject(e.target.value)} /></label>}
      <label>Text<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={channel === 'SMS' ? 4 : 9} /></label>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!body.trim()}><Icon name="mail" size={16} />Odeslat</button>
        <button type="button" className="btn-ghost" onClick={onClose}>Zrušit</button>
        <span className="muted plan-sim">Odeslání je v ukázce simulované a zapíše se do záznamu koordinace.</span>
      </div>
    </form>
  );
}

/** What was sent or noted about a step, newest last. */
function StepLog({ step }: { step: PlanStep }) {
  const { id } = useCaseData();
  const st = useCase(id);
  const [shown, setShown] = useState<number | null>(null);
  const lines = st.events.map((e, i) => ({ e, i })).filter(({ e }) => e.field === `plan:${step.id}` && (isMessage(e) || (isPlan(e) && e.plan.phase !== undefined)));
  if (!lines.length) return null;
  const label = (e: CaseEvent) => (isMessage(e) ? (e.channel === 'SMS' ? 'SMS' : /^Urgence/.test(e.subject) ? 'Urgence' : e.channel === 'e-mail' ? 'E-mail' : 'Zpráva') : 'Stav');
  return (
    <ul className="plan-log" aria-label="Komunikace ke kroku">
      {lines.map(({ e, i }) => (
        <li key={i}>
          <Icon name={isMessage(e) ? 'mail' : 'check'} size={13} />
          <span><b>{label(e)}</b> {Number(e.at.slice(8, 10))}. {Number(e.at.slice(5, 7))}. {e.at.slice(11)} · {isMessage(e) ? `${e.to} · odesláno` : e.text}</span>
          {isMessage(e) && (
            <button type="button" className="src-link" aria-expanded={shown === i} onClick={() => setShown(shown === i ? null : i)}>{shown === i ? 'Skrýt text' : 'Zobrazit text'}</button>
          )}
          {isMessage(e) && shown === i && <p className="plan-log-body">{e.body}</p>}
        </li>
      ))}
    </ul>
  );
}

function Phases({ phase }: { phase: number }) {
  return (
    <ol className="plan-phases" aria-label="Stav kroku">
      {PHASES.map((label, i) => (
        <li key={label} className={i < phase ? 'on' : i === phase ? 'next' : ''}>
          <Icon name={i < phase ? 'check' : 'clock'} size={13} />{label}
        </li>
      ))}
    </ol>
  );
}

/** The state moved by hand for a step without reports yet: vyžádáno, then objednáno na datum. */
function MoveState({ step }: { step: PlanStep }) {
  const { id, data } = useCaseData();
  const [date, setDate] = useState('');
  // the date of the MDT is set in the header of the patient
  if (step.phase === undefined || step.phase >= 2 || step.id === 'konzilium') return null;
  if (step.phase === 0) {
    return <button type="button" className="link" onClick={() => mark(id, data.today, `${step.title}: vyžádáno`, { step: step.id, phase: 1 })}><Icon name="check" size={14} />Označit: vyžádáno</button>;
  }
  return (
    <span className="plan-book">
      <input type="date" value={date} min={data.today} aria-label="Objednáno na den" onChange={(e) => setDate(e.target.value)} />
      <button type="button" className="link" disabled={!date} title={date ? undefined : 'Nejdřív vyberte den'} onClick={() => mark(id, data.today, `${step.title}: objednáno na ${czDate(date)}`, { step: step.id, phase: 2, date })}>
        <Icon name="calendar" size={14} />Objednáno na tento den
      </button>
      {!date && <small className="plan-hint">nejdřív vyberte den</small>}
    </span>
  );
}

function StepRow({ s, byId, today, isCurrent, openDoc }: { s: PlanStep; byId: Map<string, PlanStep>; today: string; isCurrent: boolean; openDoc: OpenDoc }) {
  const { id, data } = useCaseData();
  const [writing, setWriting] = useState<Kind | null>(null);
  const [cite, setCite] = useState(false);
  const overdue = isOverdue(s, today);
  const waitingFor = s.after.map((a) => byId.get(a)!).filter((p) => !p.done);
  // a step already booked or going on although what must come first is not done
  const started = s.done || (s.phase ?? 0) >= 2;
  const conflict = waitingFor.length > 0 && started;
  const openItems = s.docId ? data.fields.filter((f) => f.todo && ['chybí', 'neúplné', 'rozpor'].includes(f.status) && f.todo.quotes.some((q) => q.docId === s.docId)) : [];
  const state = overdue ? 'late' : s.done ? 'done' : isCurrent ? 'now' : s.owner?.me ? 'me' : 'wait';
  const node = state === 'done' ? <Icon name="check" size={16} /> : state === 'late' ? <Icon name="alert" size={16} /> : state === 'now' || state === 'me' ? <Icon name="user" size={16} /> : <Icon name="clock" size={16} />;
  const canSms = !s.done && s.group !== 'task' && s.id !== 'konzilium' && s.date && s.date > today && s.owner && !s.owner.me && Boolean(data.patient.phone);
  const canMail = !s.done && s.owner && !s.owner.me && !overdue && s.id !== 'konzilium';
  const docQuotes = (docId: string) => [...s.quotes, ...(s.before ? [s.before] : [])].filter((q) => q.docId === docId).map((q) => q.quote);
  const docs = [...new Map([...s.quotes, ...(s.before ? [s.before] : [])].map((q) => [q.docId, q.ref ?? q.docId])).entries()];
  const when: ReactNode = s.done && s.phase === 4 && s.date
    ? <><b>{czDate(s.date)}</b><small>{s.late ? `doručeno, slíbeno do ${dm(s.late.due)}` : s.group === 'mdt' ? 'proběhlo' : 'provedeno'}</small></>
    : s.date
      ? <><b>{s.dueWhat && s.due === s.date && !s.done ? `do ${dm(s.date)}` : czDate(s.date)}</b><small className={overdue ? 'late' : ''}>{overdue ? `po termínu ${days(-daysBetween(today, s.date))}` : s.done ? 'hotovo' : rel(today, s.date)}</small></>
      : s.due
        ? <><b>do {dm(s.due)}</b><small className={overdue ? 'late' : ''}>{overdue ? `po termínu ${workdays(workdaysBetween(s.due, today))}` : rel(today, s.due)}</small></>
        : <><b className="soft">–</b><small>{s.state?.label === 'po konziliu' ? 'po konziliu' : 'bez termínu'}</small></>;
  return (
    <li className={`plan-step ${state}`} id={`plan-${s.id}`}>
      <span className="plan-node" aria-hidden="true">{node}</span>
      <div className="plan-main">
        <p className="plan-title">
          <b>{s.title}</b>
          {overdue && <span className="chip miss">po termínu</span>}
          {s.late && <span className="chip conf">zpoždění {workdays(s.late.days)}</span>}
          {s.state && <span className={`chip ${s.state.cls}`}>{s.state.label}</span>}
          {isCurrent && !overdue && <span className="chip new">teď – aktuální krok</span>}
          {s.fromSet && <span className="chip">ze sady</span>}
        </p>
        {(s.detail || s.org) && (
          <p className="plan-sub">
            {s.detail && <span>{nb(s.detail)}</span>}
            {s.org && <span className="plan-place">{s.org}{s.dept && ` – ${s.dept}`}{s.org !== OWN && s.group !== 'task' && <em> · jiné centrum</em>}</span>}
          </p>
        )}
        {s.phase !== undefined && <Phases phase={s.phase} />}
        {s.requestedBy && <p className="plan-line"><small>Vyžádal(a)</small> {s.requestedBy}</p>}
        {s.late && (
          <p className="plan-line late">
            <Icon name="clock" size={14} />Výsledek slíben do {czDate(s.late.due)}, doručen {czDate(s.late.got)} – o {workdays(s.late.days)} později.
          </p>
        )}
        {s.after.length > 0 && (
          <p className={`plan-seq${conflict ? ' warn' : ''}`}>
            <small>{conflict ? 'Pozor, nejdřív musí být hotovo' : 'Navazuje na'}</small>
            {s.after.map((a) => {
              const p = byId.get(a)!;
              return (
                <a key={a} href={`#plan-${a}`} className={p.done ? 'ok' : 'open'} onClick={(e) => { e.preventDefault(); document.getElementById(`plan-${a}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>
                  <Icon name={p.done ? 'check' : 'clock'} size={13} />{p.title}{!p.done && (p.due ?? p.date) ? ` (do ${dm((p.due ?? p.date)!)})` : ''}
                </a>
              );
            })}
          </p>
        )}
        {s.before && (
          <p className="plan-line"><small>Před výkonem</small> {nb(s.before.quote)}</p>
        )}
        {s.note && <p className="plan-line soft">{nb(s.note)}</p>}
        {openItems.map((f) => (
          <div className="plan-open" key={f.key}>
            <a className="link" href={`#/pacienti/${id}/udaje/${f.key}`}><Icon name="alert" size={14} />{nb(f.todo!.title)}</a>
            <SentLine field={f.key} conflict={f.status === 'rozpor'} />
          </div>
        ))}
        {cite && s.quotes.length > 0 && (
          <div className="quotes">
            {s.quotes.map((q) => <blockquote className="quote" key={q.quote}>„{nb(q.quote)}“<cite>{nb(q.ref ?? '')}</cite></blockquote>)}
          </div>
        )}
        <div className="plan-links">
          {s.docId && <button type="button" className="link" onClick={() => openDoc(s.docId!, docQuotes(s.docId!))}><Icon name="file" size={14} />Otevřít zprávu</button>}
          {!s.docId && docs.map(([docId, ref]) => (
            <button type="button" className="link" key={docId} onClick={() => openDoc(docId, docQuotes(docId))}><Icon name="file" size={14} />{nb(ref)}</button>
          ))}
          {s.quotes.length > 0 && (
            <button type="button" className="link" aria-expanded={cite} onClick={() => setCite(!cite)}>{cite ? 'Skrýt citaci' : 'Ukázat citaci'}<Icon name={cite ? 'up' : 'down'} size={14} /></button>
          )}
          {s.link && <a className="link" href={s.link.href.replace('__ID__', id)}>{s.link.label}<Icon name="right" size={14} /></a>}
          {canSms && <button type="button" className="link" onClick={() => setWriting('sms')}><Icon name="message" size={14} />SMS {data.patient.sex === 'žena' ? 'pacientce' : 'pacientovi'}</button>}
          {canMail && <button type="button" className="link" onClick={() => setWriting('mail')}><Icon name="mail" size={14} />{s.group === 'task' ? 'Napsat e-mail' : 'E-mail pracovišti'}</button>}
          {s.group === 'task' && !s.done && (
            <button type="button" className="link" onClick={() => mark(id, data.today, `Úkol splněn: ${s.title}`, { step: s.id, done: true })}><Icon name="check" size={14} />Hotovo</button>
          )}
          <MoveState step={s} />
        </div>
        {overdue && !writing && s.owner && !s.owner.me && (
          <div className="form-actions"><button type="button" className="btn-primary" onClick={() => setWriting('urge')}><Icon name="bell" size={16} />Urgovat</button></div>
        )}
        {writing && <Composer kind={writing} step={s} onClose={() => setWriting(null)} />}
        <StepLog step={s} />
      </div>
      <div className={`plan-when${overdue ? ' late' : ''}`}><small>{s.group === 'task' || (s.dueWhat && s.due === s.date) ? 'Do' : 'Termín'}</small>{when}</div>
      <div className="plan-who">
        <small>Na tahu</small>
        {s.owner ? (
          <>
            <b className={s.owner.me ? 'me' : ''}>{s.owner.me ? `${s.owner.name} (${s.owner.sub ?? 'koordinátorka'})` : s.owner.name}</b>
            {!s.owner.me && s.owner.sub && <span className="muted">{s.owner.sub}</span>}
            {s.owner.phone && <a href={telHref(s.owner.phone)}><Icon name="phone" size={14} />{s.owner.phone}</a>}
          </>
        ) : <span className="muted">{s.done ? 'nikdo – hotovo' : 'až po předchozím kroku'}</span>}
      </div>
    </li>
  );
}

/** "Spustit sadu kroků": the set and its order; the steps the case already has are marked. */
function SetPanel({ plan, onClose }: { plan: PlanStep[]; onClose: () => void }) {
  const { id, data } = useCaseData();
  const have = new Set(plan.map((s) => s.id));
  const missing = SET.steps.filter((t) => !have.has(t.id));
  const title = (x: string) => SET.steps.find((t) => t.id === x)?.title ?? x;
  return (
    <div className="plan-set">
      <div className="plan-set-head">
        <div>
          <p className="eyebrow">Sada kroků</p>
          <h3>Karcinom slinivky – {SET.steps.length} kroků v pořadí</h3>
        </div>
        <button type="button" className="viewer-close" aria-label="Zavřít" onClick={onClose}><Icon name="close" size={18} /></button>
      </div>
      <ol className="plan-set-list">
        {SET.steps.map((t, i) => (
          <li key={t.id}>
            <span className="plan-set-n">{i + 1}</span>
            <span className="plan-set-main"><b>{t.title}</b><small>{t.detail}</small></span>
            <span className="plan-set-after">{t.after.length ? <>po: {t.after.map(title).join(', ')}</> : <span className="soft">bez předchozího kroku</span>}</span>
            {have.has(t.id) ? <span className="chip ok">založeno</span> : <span className="chip new">nový krok</span>}
          </li>
        ))}
      </ol>
      <div className="form-actions">
        {missing.length ? (
          <button type="button" className="btn-primary" onClick={() => { mark(id, data.today, `Spuštěna sada kroků: ${SET.name} (${missing.length} nových kroků)`, { step: 'sada', set: SET.name }); onClose(); }}>
            <Icon name="plus" size={16} />Spustit sadu ({missing.length} {missing.length === 1 ? 'nový krok' : missing.length < 5 ? 'nové kroky' : 'nových kroků'})
          </button>
        ) : <p className="plan-set-ok"><Icon name="check" size={15} />Všechny kroky sady už jsou v plánu – založené z dosavadních zpráv a termínů.</p>}
        <button type="button" className="btn-ghost" onClick={onClose}>Zavřít</button>
      </div>
    </div>
  );
}

/** "Přidat úkol": a one-off task with a date, who is on turn and (optionally) the step it follows. */
function AddTask({ plan, onClose }: { plan: PlanStep[]; onClose: () => void }) {
  const { id, data } = useCaseData();
  const p = data.patient;
  const owners = [...new Set([
    'Vy',
    `${p.gp.name} – praktický lékař`,
    `${p.name} – ${p.sex === 'žena' ? 'pacientka' : 'pacient'}`,
    ...(p.contactPerson ? [`${p.contactPerson.name} – ${p.contactPerson.role.toLowerCase()}`] : []),
    ...plan.filter((s) => s.org && s.group !== 'task').map((s) => [s.org, s.dept].filter(Boolean).join(' – ')),
  ])];
  const [title, setTitle] = useState('');
  const [due, setDue] = useState(data.today);
  const [owner, setOwner] = useState(owners[0]);
  const [after, setAfter] = useState('');
  const st = useCase(id);
  const n = st.events.filter((e) => isPlan(e) && e.plan.task).length + 1;
  const save = () => {
    if (!title.trim() || !due) return;
    const t = title.trim();
    mark(id, data.today, `Úkol: ${t} · do ${czDate(due)} · na tahu: ${owner === 'Vy' ? ME : owner}`, { step: `ukol-${n}`, task: { title: t, due, owner, ...(after ? { after } : {}) } });
    onClose();
  };
  return (
    <form className="plan-task" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <label className="wide">Úkol<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="např. Zavolat pacientce kvůli termínu" autoFocus /></label>
      <label>Do kdy<input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></label>
      <label>Na tahu
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>{owners.map((o) => <option key={o} value={o}>{o === 'Vy' ? 'Vy (koordinátorka)' : o}</option>)}</select>
      </label>
      <label>Až po kroku
        <select value={after} onChange={(e) => setAfter(e.target.value)}>
          <option value="">– nezávisí –</option>
          {plan.filter((s) => s.group !== 'task').map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </label>
      <div className="form-actions wide">
        <button type="submit" className="btn-primary" disabled={!title.trim() || !due}><Icon name="plus" size={16} />Přidat úkol</button>
        <button type="button" className="btn-ghost" onClick={onClose}>Zrušit</button>
      </div>
    </form>
  );
}

export function Plan({ openDoc }: { openDoc: OpenDoc }) {
  const { id, data } = useCaseData();
  const st = useCase(id);
  const today = data.today;
  const plan = useMemo(() => buildPlan(data, st), [data, st]);
  const byId = useMemo(() => new Map(plan.map((s) => [s.id, s])), [plan]);
  const [panel, setPanel] = useState<'set' | 'task' | null>(null);
  const female = data.patient.sex === 'žena';

  // where the case is: the first step of the main path that is not done and whose predecessors are done
  const main = plan.filter((s) => s.group === 'diag' || s.group === 'mdt');
  const current = main.find((s) => !s.done && s.after.every((a) => byId.get(a)?.done)) ?? main.find((s) => !s.done) ?? null;
  const doneMain = main.filter((s) => s.done).length;
  const overdue = plan.filter((s) => isOverdue(s, today));
  const late = plan.filter((s) => s.late);
  // the next appointment (an exam, the MDT) – not a deadline
  const next = plan.filter((s) => !s.done && s.date && s.date >= today && s.due !== s.date).sort((a, b) => a.date!.localeCompare(b.date!))[0];
  const others = plan.filter((s) => !s.done && s.owner && !s.owner.me);
  const owner = current?.owner;

  return (
    <div className="plan">
      <section className="card stats" aria-label="Kde případ je">
        <div className="stat">
          <span className="stat-icon"><Icon name="fields" /></span>
          <span>
            <small>Kde případ je</small>
            <b>{current ? (current.id === 'podklad' ? 'Podklad' : current.title) : 'Cesta dokončena'}</b>
            <em>{current?.id === 'podklad' ? 'pro konzilium · ' : ''}hotovo {doneMain} z {main.length} kroků</em>
          </span>
        </div>
        <button type="button" className="stat stat-link" disabled={!current} onClick={() => current && document.getElementById(`plan-${current.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
          <span className="stat-icon red"><Icon name="user" /></span>
          <span>
            <small>Na tahu</small>
            <b>{owner ? (owner.me ? 'Vy' : owner.name) : '–'}</b>
            <em>{current?.due ? `do ${czDate(current.due)} · ${rel(today, current.due)}` : current?.date ? `${czDate(current.date)} · ${rel(today, current.date)}` : owner?.sub ?? ''}</em>
          </span>
        </button>
        <div className="stat">
          <span className="stat-icon"><Icon name="calendar" /></span>
          <span><small>Další termín</small><b>{next ? dm(next.date!) : '–'}</b><em>{next ? `${next.title} · ${rel(today, next.date!)}` : 'žádný naplánovaný'}</em></span>
        </div>
        <div className="stat">
          <span className={`stat-icon${overdue.length ? ' red' : ''}`}><Icon name={overdue.length ? 'alert' : 'clock'} /></span>
          <span>
            <small>Hlídání termínů</small>
            {/* "po termínu" = an open step past its date; "zpoždění" = a result that came later than promised */}
            <b>{overdue.length ? `${overdue.length} po termínu` : late.length ? `${late.length} zpoždění` : 'Vše v termínu'}</b>
            <em>
              {overdue.length ? overdue.map((s) => s.title).join(', ')
                : late.length ? `${late.map((s) => `${s.title} o ${workdays(s.late!.days)}`).join(' · ')} · teď vše v termínu`
                  : 'žádné zpoždění'}
            </em>
          </span>
        </div>
      </section>

      <section className="card plan-card" aria-labelledby="plan-title">
        <div className="card-head">
          <div>
            <h2 id="plan-title">Plán cesty {female ? 'pacientky' : 'pacienta'}</h2>
            <p className="muted plan-lead">Kroky v pořadí, jak na sebe navazují: u každého stav, termín a vpravo vždy, kdo je na tahu.</p>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" aria-expanded={panel === 'set'} onClick={() => setPanel(panel === 'set' ? null : 'set')}><Icon name="fields" size={16} />Spustit sadu kroků: {SET.name}</button>
            <button type="button" className="btn-ghost" aria-expanded={panel === 'task'} onClick={() => setPanel(panel === 'task' ? null : 'task')}><Icon name="plus" size={16} />Přidat úkol</button>
          </div>
        </div>

        {/* the main path at a glance: what comes after what, done / now / later */}
        <ol className="plan-flow" aria-label="Pořadí kroků">
          {main.map((s) => (
            <li key={s.id} className={s.done ? 'done' : s === current ? 'now' : ''}>
              <button type="button" onClick={() => document.getElementById(`plan-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                {s.done ? <Icon name="check" size={13} /> : s === current ? <Icon name="user" size={13} /> : <Icon name="clock" size={13} />}{s.title}
              </button>
            </li>
          ))}
        </ol>

        <div className="plan-legend" aria-label="Legenda">
          <p className="plan-legend-track">
            <small>Stav vyšetření</small>
            {PHASES.map((label, i) => <span key={label}>{i > 0 && <span className="plan-legend-arrow" aria-hidden="true">→</span>}{label}</span>)}
          </p>
          <p className="plan-legend-nodes">
            <span><i className="plan-dot done"><Icon name="check" size={11} /></i>hotovo</span>
            <span><i className="plan-dot now"><Icon name="user" size={11} /></i>teď – aktuální krok</span>
            <span><i className="plan-dot wait"><Icon name="clock" size={11} /></i>čeká</span>
            <span><i className="plan-dot late"><Icon name="alert" size={11} /></i>po termínu – urgovat</span>
          </p>
        </div>

        {others.length > 0 && (
          <p className="plan-others">
            <small>Čeká se na</small>
            {others.map((s) => <span key={s.id}><b>{s.owner!.name}</b>{s.owner!.name !== s.title && ` · ${s.title}`}{s.date ? ` ${dm(s.date)}` : ''}</span>)}
          </p>
        )}

        {panel === 'set' && <SetPanel plan={plan} onClose={() => setPanel(null)} />}
        {panel === 'task' && <AddTask plan={plan} onClose={() => setPanel(null)} />}

        {GROUPS.filter((g) => plan.some((s) => s.group === g.id)).map((g) => (
          <div className="plan-group" key={g.id}>
            <h3>{g.label}</h3>
            <ol className="plan-steps">
              {plan.filter((s) => s.group === g.id).map((s) => (
                <StepRow key={s.id} s={s} byId={byId} today={today} isCurrent={s === current} openDoc={openDoc} />
              ))}
            </ol>
          </div>
        ))}
        {!plan.some((s) => s.group === 'diag') && (
          <div className="plan-empty">
            <p className="muted">Zatím žádná vyšetření. Sada kroků založí celou cestu v pořadí, jak na sebe navazuje.</p>
            {panel !== 'set' && <button type="button" className="btn-primary" onClick={() => setPanel('set')}><Icon name="fields" size={16} />Spustit sadu kroků</button>}
          </div>
        )}
      </section>

      <History />
    </div>
  );
}
