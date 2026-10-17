// Prípad / profil pacienta – agent PROFIL. Reads CASES + loadSources(), navigates via useNav().
// Demo actions (requests, answers, verified conflicts, confirmed proposals, session log) live in
// components/case/caseSession.ts so they survive leaving the screen and other screens can read them.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Case, PathStep, SourceDoc } from '../types';
import { DEMO_TODAY } from '../types';
import { useNav } from '../nav';
import type { Route } from '../nav';
import { ALERTS, CASES, EXTRA_DOCS, fieldsAsOf } from '../data/cases';
import type { CaseAlert } from '../data/cases';
import { useSessions } from '../components/session';
import { loadSources } from '../data/source';
import {
  SK_STEP, addDays, countFields, daysWord, docDate, effectiveField, fieldOrigin, fmtDate, fmtShort, normalizeDocs, normalizeSources,
  patientWords, plural, stepLateDays, stepStateAt,
} from '../components/case/caseUtils';
import type { EffField, FieldOverride } from '../components/case/caseUtils';
import { updateCaseSession, useCaseSession } from '../components/case/caseSession';
import type { CaseSession } from '../components/case/caseSession';
import { lastTimeOn, nextDemoTime } from '../components/case/demoClock';
import { RequestedDocs } from '../components/case/RequestedDocs';
import { EvalCard, useEvalInfo } from '../components/case/EvalCard';
import { CaseHeader } from '../components/case/CaseHeader';
import { Metrics } from '../components/case/Metrics';
import { AsOfSlider } from '../components/case/AsOfSlider';
import { Semaphore } from '../components/case/Semaphore';
import { FieldList } from '../components/case/FieldList';
import { OriginalPanel } from '../components/case/OriginalPanel';
import type { PanelState } from '../components/case/OriginalPanel';
import { RequestModal } from '../components/case/RequestModal';
import type { RequestDraft } from '../components/case/RequestModal';
import { Journey, StepsStrip } from '../components/case/Journey';
import { DocsList, ExamsCard, LabsCard, LogCard, MedsCard } from '../components/case/DataCards';
import type { WaitingItem } from '../components/case/DataCards';
import { Btn, Card, Pill, SourceChip } from '../components/case/ui';
import { IcAlert, IcArrow, IcCheck, IcPerson, IcSend } from '../components/case/icons';
import '../components/case/case.css';
import '../components/case/case-additions.css';
import './CaseView.css';

type Tab = NonNullable<Extract<Route, { page: 'case' }>['tab']>;
const TABS: { id: Tab; label: string }[] = [
  { id: 'prehlad', label: 'Prehľad' },
  { id: 'podklad', label: 'Podklad' },
  { id: 'kroky', label: 'Cesta' },
  { id: 'dokumenty', label: 'Dokumenty' },
  { id: 'zaznam', label: 'Záznam' },
];
/** 'urge' = chasing a late step of the journey (modal key = step id); the others are field requests (key = field key). */
type Reason = 'missing' | 'conflict' | 'addendum' | 'urge' | 'forward';
interface NextStep { text: string; owner: string; mine: boolean; due?: string; derived?: string }
/** The only coordinator named in the sources (VZP template „MDT zaver“). */
const SIGNATURE = 'Bc. Lucie Dvořáková, koordinátorka KOC';
/** Optional `ai` block on Case (data side); read tolerantly. */
interface AiMeta { mode?: string; evalFile?: string; generatedAt?: string }

let lastCaseId: string | null = null; // "stav k dátumu" is reset when a different patient is opened

export default function CaseView() {
  const nav = useNav();
  const route = nav.route;
  const caseId = route.page === 'case' ? route.caseId : CASES[0]?.id;
  const tab: Tab = (route.page === 'case' && route.tab) || 'prehlad';
  const c: Case | undefined = useMemo(() => CASES.find((x) => x.id === caseId) ?? CASES[0], [caseId]);
  const ai = (c as (Case & { ai?: AiMeta }) | undefined)?.ai;
  const machine = !!ai?.mode && ai.mode !== 'manual';

  /* ---- raw report texts (public/data/source.json) + extra demo documents ---- */
  const [sources, setSources] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    Promise.resolve((loadSources as unknown as () => unknown)())
      .then((raw) => { if (alive) setSources(normalizeSources(raw)); })
      .catch(() => { /* texts stay empty; the UI still renders */ });
    return () => { alive = false; };
  }, []);
  const extraDocs = useMemo(() => normalizeDocs(EXTRA_DOCS as unknown), []);

  /* ---- demo state (per case, survives navigation) + screen-local state ---- */
  const session = useCaseSession(c?.id ?? '');
  const { overrides, arrived, log: sessionLog } = session;
  // App-level session (queue, documents): handover confirmed by the doctor, referral taken over.
  const { get: getShared, update: updateShared } = useSessions();
  const shared = getShared(c?.id ?? '');
  const accepted = !!(session.acceptedAt ?? shared.acceptedAt);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [modal, setModal] = useState<{ key: string; req: RequestDraft; reason: Reason } | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const [flashMetric, setFlashMetric] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showEval, setShowEval] = useState(false);
  const setAsOf = nav.setAsOf;
  useEffect(() => {
    if (!c) return;
    if (lastCaseId && lastCaseId !== c.id) setAsOf(DEMO_TODAY);
    lastCaseId = c.id;
    setPanel(null); setModal(null); setShowEval(false);
  }, [c, setAsOf]);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 2800); return () => window.clearTimeout(t); }, [toast]);

  const asOf = nav.asOf && /^\d{4}-\d{2}-\d{2}$/.test(nav.asOf) ? nav.asOf : DEMO_TODAY;
  const actDate = asOf < DEMO_TODAY ? asOf : DEMO_TODAY; // demo actions happen "now"
  const evalInfo = useEvalInfo(c?.id ?? '', ai?.evalFile);

  /* ---- documents with text (answers that have not arrived yet are hidden) ---- */
  const docs: SourceDoc[] = useMemo(() => {
    if (!c) return [];
    const arrivedById = Object.fromEntries(arrived.map((a) => [a.id, a]));
    const notYet = new Set(c.fields.map((f) => f.resolvedBy?.docId).filter((x): x is string => !!x));
    const base = c.docs.filter((d) => !notYet.has(d.id) || arrivedById[d.id]).map((d) => {
      const a = arrivedById[d.id];
      const text = sources[d.id] ?? d.text ?? extraDocs.find((e) => e.id === d.id)?.text ?? a?.text;
      return a ? { ...d, text, receivedAt: a.receivedAt, examDate: a.examDate < d.examDate ? a.examDate : d.examDate } : { ...d, text };
    });
    const more = arrived.filter((a) => !base.some((b) => b.id === a.id)).map((a) => ({ ...a, text: a.text ?? sources[a.id] }));
    return [...base, ...more];
  }, [c, sources, extraDocs, arrived]);
  const docsById = useMemo(() => {
    const m: Record<string, SourceDoc> = {};
    for (const d of extraDocs) m[d.id] = { ...d, text: d.text ?? sources[d.id] };
    for (const d of docs) m[d.id] = d;
    return m;
  }, [docs, extraDocs, sources]);
  const referral = useMemo(() => c?.docs.find((d) => d.kind === 'request') ?? [...(c?.docs ?? [])].sort((a, b) => (docDate(a) < docDate(b) ? -1 : 1))[0], [c]);

  /* ---- effective fields for the chosen date ---- */
  // fieldsAsOf (data module) applies later values + hides citations from reports not yet received;
  // effectiveField applies the demo overrides (request sent / answer arrived / conflict verified / proposal confirmed).
  const fields: EffField[] = useMemo(() => {
    if (!c) return [];
    const base = fieldsAsOf(c, asOf);
    return base.map((f, i) => {
      const e = effectiveField(f, i + 1, overrides[f.key], asOf, docsById);
      const orig = c.fields[i];
      if (e.status === 'missing' && orig && orig.status !== 'missing' && !overrides[f.key]) {
        // not "missing in the documentation" – simply not yet known on the chosen date
        return { ...e, status: 'future', value: '', citations: [], note: undefined, asOfNote: f.note, sourceDate: orig.sourceDate };
      }
      return e;
    });
  }, [c, overrides, asOf, docsById]);
  const counts = useMemo(() => countFields(fields), [fields]);
  const stepsVisible = useMemo(() => (c ? c.steps.filter((s) => stepStateAt(s, asOf) !== null) : []), [c, asOf]);
  const stepsDone = useMemo(() => (c ? c.steps.filter((s) => stepStateAt(s, asOf) === 'delivered').length : 0), [c, asOf]);
  const log = useMemo(() => [...(c?.log ?? []), ...sessionLog], [c, sessionLog]);
  /** Safety facts and doctors' warnings known by the chosen date (each with its verbatim sources). */
  const alerts: CaseAlert[] = useMemo(() => {
    if (!c) return [];
    const known = (docId: string) => (c.docs.find((d) => d.id === docId)?.receivedAt ?? '9999-12-31') <= asOf;
    return (ALERTS[c.id] ?? []).filter((a) => a.from <= asOf)
      .map((a) => ({ ...a, citations: a.citations.filter((ci) => known(ci.docId)) }))
      .filter((a) => a.citations.length > 0);
  }, [c, asOf]);
  /** A report that arrived after the case was closed opens it again (QA R5 #1). */
  const reopened = useMemo(() => {
    const closed = session.closedAt;
    if (!c || !closed) return undefined;
    return c.docs.filter((d) => d.receivedAt > closed && d.receivedAt <= asOf).sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))[0];
  }, [c, session.closedAt, asOf]);
  const sliderMax = useMemo(() => {
    const all = [DEMO_TODAY, c?.mdtDate ?? '', ...docs.map(docDate), ...log.map((e) => e.date)].filter(Boolean);
    return all.sort()[all.length - 1] ?? DEMO_TODAY;
  }, [c, docs, log]);

  /** Steps that were chased: "Urgencia: histológia…" in the log → step whose title starts with that word
   *  (or whose whole title is in the entry). The latest chase known by the chosen date wins. */
  const urgedAt = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of c?.steps ?? []) {
      const title = s.title.toLowerCase();
      const kw = title.split(/[\s(]/)[0];
      const dates = log
        .filter((x) => /urgen/i.test(x.action) && x.date <= asOf)
        .filter((x) => { const t = `${x.action} ${x.detail}`.toLowerCase(); return t.includes(title) || (kw.length >= 3 && t.includes(kw)); })
        .map((x) => x.date).sort();
      if (dates.length) m[s.id] = dates[dates.length - 1];
    }
    return m;
  }, [c, log, asOf]);

  /** "Ďalší krok" follows the demo: once the missing field is answered, the next open item is shown. */
  const nextStep: NextStep = useMemo(() => {
    if (!c) return { text: '', owner: '', mine: false };
    if (reopened) {
      return { text: `Nová správa po uzavretí – skontrolovať (správa ${reopened.id}, ${fmtShort(reopened.receivedAt)})`, owner: 'ja (koordinátor)', mine: true, due: reopened.receivedAt, derived: 'prípad sa znovu otvoril' };
    }
    if (c.status === 'new' && accepted) {
      const rest = c.nextStep.text.replace(/^Prevziať žiadosť praktika( a )?/i, '').trim();
      return { text: rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : 'Zaradiť prípad na konzílium', owner: 'ja (koordinátor)', mine: true, due: c.nextStep.due, derived: 'žiadosť prevzatá' };
    }
    if (shared.mdtConfirmedAt && c.mdtDate && asOf <= c.mdtDate) {
      const left = [
        counts.conflict ? `${counts.conflict} ${plural(counts.conflict, 'rozpor nechaný', 'rozpory nechané', 'rozporov nechaných')} konzíliu` : '',
        counts.missing ? `${counts.missing} ${plural(counts.missing, 'údaj chýba', 'údaje chýbajú', 'údajov chýba')}` : '',
      ].filter(Boolean).join(' · ');
      return { text: `Podklad potvrdil ${shared.mdtConfirmedBy ?? 'lekár KOC'} ${fmtShort(shared.mdtConfirmedAt)}${left ? ` · ${left}` : ''}`, owner: `MDT · ${c.koc}`, mine: false, due: c.mdtDate, derived: 'podklad potvrdený (simulácia)' };
    }
    const base: NextStep = { text: c.nextStep.text, owner: c.nextStep.mine ? 'ja (koordinátor)' : c.nextStep.owner, mine: c.nextStep.mine, due: c.nextStep.due };
    const text = c.nextStep.text.toLowerCase();
    const ref = c.fields.find((f) => f.status === 'missing' && text.includes(f.label.toLowerCase()));
    const eff = ref ? fields.find((f) => f.field.key === ref.key) : undefined;
    if (!ref || !eff || eff.status === 'missing') return base;
    if (eff.status === 'pending') {
      const ov = eff.override?.kind === 'pending' ? eff.override : undefined;
      return { text: `Čakáme na odpoveď: ${ref.label}`, owner: ov?.to ?? ref.request?.to ?? 'adresát žiadosti', mine: false, due: c.nextStep.due, derived: `žiadosť odoslaná ${ov ? fmtShort(ov.sentAt) : ''}` };
    }
    const parts: string[] = [];
    if (counts.proposed) parts.push(`${counts.proposed} ${plural(counts.proposed, 'návrh', 'návrhy', 'návrhov')}`);
    if (counts.conflict) parts.push(`${counts.conflict} ${plural(counts.conflict, 'rozpor', 'rozpory', 'rozporov')}`);
    if (counts.missing) parts.push(`${counts.missing} ${plural(counts.missing, 'chýbajúce pole', 'chýbajúce polia', 'chýbajúcich polí')}`);
    if (counts.pending) parts.push(`${counts.pending} ${plural(counts.pending, 'čakajúcu odpoveď', 'čakajúce odpovede', 'čakajúcich odpovedí')}`);
    const derived = `${ref.label}: doplnené`;
    if (parts.length) {
      const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} a ${parts[parts.length - 1]}` : parts[0];
      return { text: `Skontrolovať ${list}${c.mdtDate ? ' pred konzíliom' : ''}`, owner: 'ja (koordinátor)', mine: true, due: c.mdtDate ? addDays(c.mdtDate, -1) : c.nextStep.due, derived };
    }
    if (c.mdtDate && asOf < c.mdtDate) return { text: `Podklad je kompletný · konzílium ${fmtDate(c.mdtDate)}`, owner: `MDT · ${c.koc}`, mine: false, due: c.mdtDate, derived };
    return { text: 'Odoslať záver praktikovi po konzíliu', owner: 'ja (koordinátor)', mine: true, derived };
  }, [c, fields, counts, asOf, reopened, accepted, shared.mdtConfirmedAt, shared.mdtConfirmedBy]);

  /** Dokumenty → „Čakáme na“: only what was requested or ordered, never titles of future reports. */
  const waiting: WaitingItem[] = useMemo(() => {
    if (!c) return [];
    const out: WaitingItem[] = [];
    for (const f of fields) {
      if (f.status === 'missing') out.push({ label: f.field.label, detail: f.field.request ? `chýba · vyžiadať od: ${f.field.request.to}` : 'chýba v dostupných správach', todo: true });
      else if (f.status === 'pending' && f.override?.kind === 'pending') out.push({ label: f.field.label, detail: `vyžiadané od: ${f.override.to} · ${fmtShort(f.override.sentAt)} · ${f.override.channel}` });
      else if (f.status === 'conflict' && f.override?.kind === 'pending') out.push({ label: `Upresnenie: ${f.field.label}`, detail: `vyžiadané od: ${f.override.to} · ${fmtShort(f.override.sentAt)}` });
    }
    for (const s of c.steps) {
      const st = stepStateAt(s, asOf);
      if (st === null || st === 'delivered') continue;
      out.push({ label: s.title, detail: `${st === 'done' ? 'vykonané, čakáme na výsledok' : SK_STEP[st]} · ${s.owner} · do ${fmtShort(s.due)}` });
    }
    return out;
  }, [c, fields, asOf]);

  /* ---- navigation ---- */
  const goTab = (t: Tab) => { if (c) nav.go({ page: 'case', caseId: c.id, tab: t }); };
  const closePanel = useCallback(() => setPanel(null), []);
  const openField = (key: string) => setPanel({ kind: 'field', key });
  const openDoc = (docId: string, quote?: string, soft?: boolean) => setPanel({ kind: 'doc', docId, quote, soft });
  const pickTile = (key: string) => {
    openField(key);
    if (tab !== 'podklad') goTab('podklad');
    window.setTimeout(() => document.getElementById(`field-${key}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
  };

  if (!c) return <div className="cv-page"><Card><p>Prípad sa nenašiel.</p></Card></div>;

  /* ---- session helpers ---- */
  const patch = (fn: (s: CaseSession) => CaseSession) => updateCaseSession(c.id, fn);
  const setOverride = (key: string, ov: FieldOverride) => patch((s) => ({ ...s, overrides: { ...s.overrides, [key]: ov } }));
  // Deterministic demo time: after the day's fixed entries (e.g. 12:40 „Doručená histológia“ on 19. 10.), then +2–4 min each.
  const addLog = (action: string, detail: string, date: string = actDate) =>
    patch((s) => ({ ...s, log: [...s.log, { date, time: nextDemoTime(date, lastTimeOn(c.log, date)), action, detail, billable: true }] }));
  const flash = (key: string) => {
    setFlashKey(key); setFlashMetric(true);
    window.setTimeout(() => { setFlashKey(null); setFlashMetric(false); }, 1900);
  };
  const pw = patientWords(c.patient.sex);
  const who = `${c.patient.firstName} ${c.patient.lastName}`;
  const mdtTxt = c.mdtDate ? ` ${fmtDate(c.mdtDate)}` : '';

  /* ---- requests, verifications, confirmations, simulated answers ---- */
  const buildRequest = (key: string, reason: Reason): RequestDraft => {
    const f = c.fields.find((x) => x.key === key)!;
    if (reason !== 'conflict' && f.request) {
      return { to: f.request.to, channel: f.request.channel, draft: f.request.draft, subject: `Prosba o doplnenie: ${f.label}` };
    }
    if (reason === 'conflict' && f.conflict) {
      const a = f.conflict.a.citation.docId, b = f.conflict.b.citation.docId;
      const place = docsById[a]?.place || docsById[b]?.place || c.referringGp.name;
      const where = a === b ? `sú v správe ${a} dva rôzne údaje` : `rozchádzajú dva zdroje (správa ${a} a správa ${b})`;
      return {
        to: place, channel: 'e-mail', subject: `Prosba o upresnenie: ${f.label}`,
        draft: `Dobrý deň,\n\npri príprave podkladu na konzílium${mdtTxt} (${pw.nom}: ${who}) sa v položke „${f.label}“ ${where}:\nA) ${f.conflict.a.value}\nB) ${f.conflict.b.value}\n\nProsím o potvrdenie, ktorý údaj platí, prípadne o opravu správy.\n\nĎakujem za spoluprácu.\n${SIGNATURE}, ${c.koc}`,
      };
    }
    const what = reason === 'addendum' ? 'chýba dodatok (doplňujúci výsledok k správe)' : 'chýba položka';
    return {
      to: c.referringGp.name, channel: 'e-mail', subject: `Prosba o doplnenie: ${f.label}`,
      draft: `Dobrý deň,\n\npre podklad na konzílium${mdtTxt} (${pw.nom}: ${who}) nám v dokumentácii ${what} „${f.label}“.\n\nProsím o doplnenie odpoveďou na túto správu.\n\nĎakujem za spoluprácu.\n${SIGNATURE}, ${c.koc}`,
    };
  };
  const requestField = (key: string) => {
    const f = fields.find((x) => x.field.key === key);
    const reason: Reason = f?.status === 'conflict' ? 'conflict' : f?.status === 'missing' || f?.status === 'pending' ? 'missing' : 'addendum';
    setModal({ key, req: buildRequest(key, reason), reason });
  };
  /** „Urgovať“ on a late step: the same concept window as „Vyžiadať“, sending is simulated, the record gets a day with an intervention. */
  const urgeStep = (step: PathStep) => {
    const late = stepLateDays(step, stepStateAt(step, actDate), actDate);
    const lateTxt = late > 0 ? ` – mešká ${late} ${daysWord(late)}` : '';
    setModal({
      key: step.id, reason: 'urge',
      req: {
        to: step.place, channel: 'e-mail', subject: `Urgencia: ${step.title}`,
        draft: `Dobrý deň,\n\nkrok „${step.title}“ (${pw.nom}: ${who}${mdtTxt ? `, konzílium${mdtTxt}` : ''}) mal termín ${fmtDate(step.due)}. K ${fmtDate(actDate)} stále nie je hotový${lateTxt}.\n\nProsím o informáciu, kedy ho môžeme očakávať, a ak je to možné, o jeho urýchlenie.\n\nĎakujem za spoluprácu.\n${SIGNATURE}, ${c.koc}`,
      },
    });
  };
  /** „Prevziať žiadosť“ on a new referral (QA R5 #12): record entry, the case becomes active. */
  const accept = () => {
    patch((s) => ({ ...s, acceptedAt: actDate }));
    updateShared(c.id, { acceptedAt: actDate });
    addLog('Prevzatá žiadosť praktika', `${c.referringGp.name} · prípad je aktívny, bežia hodiny cesty`);
    setToast('Žiadosť prevzatá · prípad je aktívny');
  };
  /** A doctors' warning goes on to whoever needs it (concept, simulated). Only quotes from the reports, no advice. */
  const forwardAlert = (a: CaseAlert) => {
    if (!a.forward) return;
    const lines = a.citations.map((ci) => {
      const d = docsById[ci.docId];
      return `– ${d ? `${d.title}, ${fmtDate(d.examDate)}` : 'Správa'} (správa ${ci.docId}): „${ci.quote}“`;
    });
    setModal({
      key: a.id, reason: 'forward',
      req: {
        to: a.forward.to, channel: a.forward.channel, subject: `Upozornenie z dokumentácie: ${a.label}`,
        draft: `Dobrý deň,\n\nposielam upozornenie, ktoré je v správach lekárov (${pw.nom}: ${who}):\n\n${lines.join('\n')}\n\nPosúdenie je na ošetrujúcom lekárovi – posielam len to, čo píšu správy.\n\nĎakujem.\n${SIGNATURE}, ${c.koc}`,
      },
    });
  };
  const sendRequest = (r: RequestDraft) => {
    if (!modal) return;
    if (modal.reason === 'forward') {
      const a = alerts.find((x) => x.id === modal.key);
      if (a) {
        addLog('Upozornenie poslané ďalej', `${a.label} · ${r.to} · ${r.channel} (simulované)`, asOf > actDate ? asOf : actDate);
        setToast(`Upozornenie poslané · ${r.to.split(' · ')[0]}`);
      }
      setModal(null);
      return;
    }
    if (modal.reason === 'urge') {
      const step = c.steps.find((s) => s.id === modal.key);
      if (step) {
        const late = stepLateDays(step, stepStateAt(step, actDate), actDate);
        addLog(`Urgencia: ${step.title}`, `${r.to} · ${r.channel} · termín bol ${fmtShort(step.due)}${late > 0 ? `, mešká ${late} ${daysWord(late)}` : ''} (simulované)`);
        setToast(`Urgencia odoslaná · ${r.to}`);
      }
      setModal(null);
      return;
    }
    const f = c.fields.find((x) => x.key === modal.key)!;
    if (modal.reason === 'addendum') {
      addLog('Vyžiadaný dodatok', `${f.label} · ${r.to} · ${r.channel}`);
    } else {
      setOverride(modal.key, { kind: 'pending', to: r.to, channel: r.channel, sentAt: actDate, reason: modal.reason });
      addLog(modal.reason === 'conflict' ? 'Vyžiadané upresnenie' : 'Vyžiadaný údaj', `${f.label} · ${r.to} · ${r.channel}`);
    }
    setModal(null);
    setPanel({ kind: 'field', key: modal.key });
    setToast(`Žiadosť odoslaná · ${r.to}`);
  };
  const simulateAnswer = (key: string) => {
    const f = c.fields.find((x) => x.key === key)!;
    const r = f.resolvedBy;
    if (!r) return;
    const when = actDate; // the answer arrives "now" in the demo
    const known = c.docs.find((d) => d.id === r.docId) ?? docsById[r.docId];
    const doc: SourceDoc = known
      ? { ...known, text: known.text ?? sources[r.docId] ?? docsById[r.docId]?.text }
      : { id: r.docId, title: `Odpoveď: ${f.label}`, place: f.request?.to ?? c.referringGp.practice, kind: 'report', examDate: when, channel: f.request?.channel ?? 'e-mail', text: r.citation.quote, receivedAt: when };
    const arrivedDoc: SourceDoc = { ...doc, receivedAt: when, examDate: doc.examDate > when ? when : doc.examDate };
    patch((s) => (s.arrived.some((d) => d.id === arrivedDoc.id) ? s : { ...s, arrived: [...s.arrived, arrivedDoc] }));
    setOverride(key, { kind: 'resolved', value: r.value, citation: r.citation, docId: r.docId, date: when, note: `doplnené z odpovede · správa ${r.docId} · ukážka (fiktívna správa pre demo)` });
    addLog('Prijatá odpoveď', `${f.label}: ${r.value} (správa ${r.docId}, ukážka) · zapracované do podkladu`);
    flash(key);
    setToast(`Prišla odpoveď · správa ${r.docId} (ukážka) · pole „${f.label}“ doplnené`);
  };
  const decide = (key: string, which: 'a' | 'b', by: string) => {
    const f = c.fields.find((x) => x.key === key)!;
    if (!f.conflict) return;
    const v = f.conflict[which];
    const what = `platí ${which.toUpperCase()} – ${v.value} (správa ${v.citation.docId})`;
    setOverride(key, { kind: 'decided', which, by, date: actDate, note: `Overené ${fmtDate(actDate)}: ${what} · potvrdil: ${by}` });
    addLog('Overený rozpor', `${f.label}: ${what} · potvrdil: ${by} · hodnota poľa sa nemení`);
    flash(key);
    setPanel({ kind: 'field', key });
    setToast(`Rozpor overený · platí ${which.toUpperCase()} · potvrdil: ${by}`);
  };
  const confirmField = (key: string) => {
    const f = c.fields.find((x) => x.key === key)!;
    const origin = fieldOrigin(f);
    setOverride(key, { kind: 'confirmed', date: actDate, note: `Skontrolované so zdrojom ${fmtDate(actDate)} · potvrdila koordinátorka` });
    addLog('Potvrdený návrh', `${f.label}${origin === 'ai' ? ' (návrh AI)' : ''} · skontrolované so zdrojom, potvrdila koordinátorka`);
    flash(key);
    setToast(`Návrh potvrdený · ${f.label}`);
  };

  const activeKey = panel?.kind === 'field' ? panel.key : undefined;
  const panelField = panel?.kind === 'field' ? fields.find((f) => f.field.key === panel.key) : undefined;
  const todo = (f: EffField) => f.status === 'missing' || f.status === 'conflict' || f.status === 'pending' || f.status === 'proposed';
  const todoCount = fields.filter(todo).length;
  const started = fields.length > 0;
  const forwardedOn = (a: CaseAlert) => log.filter((e) => e.action === 'Upozornenie poslané ďalej' && e.detail.startsWith(a.label) && e.date <= asOf).map((e) => e.date).sort()[0];
  const forwardCards = alerts.filter((a) => a.kind === 'forward');
  const slider = <AsOfSlider asOf={asOf} min={c.receivedAt} max={sliderMax} docs={docs} mdtDate={c.mdtDate} onChange={nav.setAsOf} />;

  return (
    <div className={`cv-page ${panel ? 'has-panel' : ''}`}>
      <CaseHeader c={c} referral={referral} asOf={asOf} closedAt={session.closedAt} reopened={reopened} accepted={accepted} alerts={alerts}
        onMdt={() => nav.go({ page: 'mdt', caseId: c.id })} onGp={() => nav.go({ page: 'gp', caseId: c.id })} onAccept={accept} onOpenDoc={(id, q) => openDoc(id, q)} />

      <nav className="cv-tabs" aria-label="Časti prípadu">
        {TABS.map((t) => (
          <button type="button" key={t.id} className={`cv-tab ${tab === t.id ? 'is-on' : ''}`} onClick={() => goTab(t.id)}>
            {t.label}
            {t.id === 'podklad' && todoCount > 0 && <span className="cv-tab-badge">{todoCount}</span>}
          </button>
        ))}
      </nav>

      {slider}

      {tab === 'prehlad' && (
        <div className="cv-stack">
          {forwardCards.map((a) => {
            const sent = forwardedOn(a);
            const canSend = !!a.forward && (!a.forward.needsDocId || (docsById[a.forward.needsDocId] && docDate(docsById[a.forward.needsDocId]) <= asOf));
            return (
              <Card key={a.id} className="cv-alert" title={<><IcAlert size={17} /> Upozornenie, ktoré musí ísť ďalej</>} aside={<span className="cs-hint">z lekárskych správ · appka nič neodporúča</span>}>
                <div className="cv-alert-label">{a.label}</div>
                <ul className="cv-alert-quotes">
                  {a.citations.map((ci, i) => {
                    const d = docsById[ci.docId];
                    return (
                      <li key={i}>
                        <q>{ci.quote}</q>
                        <span className="cv-alert-src">{d ? `${d.title} · ${fmtShort(d.examDate)}` : ''} <SourceChip docId={ci.docId} onClick={() => openDoc(ci.docId, ci.quote)} /></span>
                      </li>
                    );
                  })}
                </ul>
                <div className="cv-alert-foot">
                  {sent ? <Pill tone="mint"><IcCheck size={13} /> poslané ďalej {fmtShort(sent)} · simulované</Pill>
                    : canSend ? <Btn variant="primary" icon={<IcSend size={15} />} onClick={() => forwardAlert(a)}>{a.forward!.button}</Btn>
                      : a.forward?.beforeNote ? <span className="cs-hint">{a.forward.beforeNote}</span> : null}
                </div>
              </Card>
            );
          })}
          <Metrics c={c} counts={counts} asOf={asOf} stepsDone={stepsDone} stepsTotal={c.steps.length} flash={flashMetric}
            evalInfo={evalInfo} evalOpen={showEval} onEval={() => setShowEval((v) => !v)} />
          {showEval && evalInfo && <EvalCard info={evalInfo} manual={!machine} />}
          <Card title="Ďalší krok" className="cv-next" aside={nextStep.derived ? <span className="cs-hint">{nextStep.derived}</span> : undefined}>
            <div className="cv-next-in">
              <div>
                <div className="cv-next-text">{nextStep.text}</div>
                <div className="cv-next-meta">
                  <Pill tone={nextStep.mine ? 'accent' : 'neutral'}><IcPerson size={13} /> {nextStep.owner}</Pill>
                  {nextStep.due && <span className={`cv-next-due ${nextStep.due < asOf ? 'is-late' : ''}`}>do {fmtDate(nextStep.due)}</span>}
                </div>
              </div>
              <div className="cv-next-steps">
                <StepsStrip steps={c.steps} asOf={asOf} onMore={() => goTab('kroky')} />
                <Btn variant="ghost" size="sm" icon={<IcArrow size={14} />} onClick={() => goTab('kroky')}>Celá cesta</Btn>
              </div>
            </div>
          </Card>
          <Card title="Úplnosť podkladu" aside={<span className="cs-hint">20 polí šablóny VZP · klik otvorí originál</span>}>
            <Semaphore fields={fields} counts={counts} activeKey={activeKey} flashKey={flashKey} onPick={pickTile} />
          </Card>
          {todoCount > 0 ? (
            <Card title="Čo treba vyriešiť" aside={<span className="cs-hint">{todoCount} {todoCount === 1 ? 'položka' : todoCount <= 4 ? 'položky' : 'položiek'}</span>}>
              <FieldList fields={fields} activeKey={activeKey} flashKey={flashKey} onOpen={openField} onRequest={requestField} onConfirm={confirmField} onOpenDoc={openDoc} only={todo} byAction />
            </Card>
          ) : started ? (
            <Card className="cv-done"><div className="cv-done-in"><IcCheck size={20} /> Podklad je kompletný. Všetky polia majú zdroj a skontroloval ich človek.</div></Card>
          ) : null}
        </div>
      )}

      {tab === 'podklad' && (
        <div className="cv-stack">
          <Card title="Polia podkladu" aside={<span className="cs-hint">{counts.confirmed}/{counts.total} potvrdených · {counts.noSource} bez zdroja · stav k {fmtShort(asOf)}</span>} pad={false} className="cv-fields-card">
            {started
              ? <FieldList fields={fields} activeKey={activeKey} flashKey={flashKey} onOpen={openField} onRequest={requestField} onConfirm={confirmField} onOpenDoc={openDoc} />
              : <div className="cs-empty cv-empty-pad">Podklad sa ešte nezačal – čakáme na správy.</div>}
          </Card>
          <div className="cv-two">
            <LabsCard labs={c.labs} asOf={asOf} onOpenDoc={(id, q) => openDoc(id, q, true)} />
            <div className="cv-stack">
              <MedsCard meds={c.meds} asOf={asOf} docsById={docsById} onOpenDoc={openDoc} />
              <ExamsCard exams={c.exams} asOf={asOf} onOpenDoc={(id) => openDoc(id)} />
            </div>
          </div>
        </div>
      )}

      {tab === 'kroky' && (
        <div className="cv-stack">
          <Card title={`Cesta ${pw.gen}`} aside={
            <span className="cv-journey-legend">
              <span><i className="is-done" /> výsledok doručený</span>
              <span><i className="is-latedone" /> doručené po termíne</span>
              <span><i className="is-late" /> mešká</span>
              <span><i className="is-future" /> k dátumu ešte nevzniklo</span>
              <span className="cs-hint">{stepsVisible.length} {plural(stepsVisible.length, 'krok', 'kroky', 'krokov')} · {stepsDone} s výsledkom k {fmtShort(asOf)}</span>
            </span>
          }>
            <Journey steps={c.steps} asOf={asOf} mdtDate={c.mdtDate} urgedAt={urgedAt} onOpenDoc={openDoc} onUrge={urgeStep} />
          </Card>
        </div>
      )}

      {tab === 'dokumenty' && (
        <div className="cv-stack">
          <DocsList docs={docs} asOf={asOf} waiting={waiting} onOpenDoc={(id) => openDoc(id)}
            after={<RequestedDocs c={c} log={log} asOf={asOf} onOpenDoc={(id) => openDoc(id)} />} />
        </div>
      )}

      {tab === 'zaznam' && (
        <div className="cv-stack">
          <LogCard log={log} asOf={asOf} onShowAll={() => nav.setAsOf(sliderMax)} />
        </div>
      )}

      {/* Overlays are rendered on <body>: the page wrapper is animated (transform) and would otherwise trap position:fixed. */}
      {panel && createPortal(
        <OriginalPanel panel={panel} field={panelField} docsById={docsById} onClose={closePanel} onDecide={decide}
          onRequest={requestField} onSimulate={simulateAnswer} onConfirm={confirmField} onCite={(i) => setPanel((p) => (p && p.kind === 'field' ? { ...p, cite: i } : p))} />,
        document.body,
      )}
      {modal && createPortal(
        <RequestModal
          title={modal.reason === 'urge' ? (c.steps.find((s) => s.id === modal.key)?.title ?? '')
            : modal.reason === 'forward' ? (alerts.find((a) => a.id === modal.key)?.label ?? '') : (c.fields.find((f) => f.key === modal.key)?.label ?? '')}
          kind={modal.reason === 'urge' ? 'urge' : modal.reason === 'forward' ? 'forward' : 'request'} req={modal.req} onSend={sendRequest} onClose={() => setModal(null)} />,
        document.body,
      )}
      {toast && createPortal(<div className="cv-toast" role="status">{toast}</div>, document.body)}
    </div>
  );
}
