// Prípad / profil pacienta – agent PROFIL. Reads CASES + loadSources(), navigates via useNav().
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Case, LogEntry, SourceDoc } from '../types';
import { DEMO_TODAY } from '../types';
import { useNav } from '../nav';
import type { Route } from '../nav';
import { CASES, EXTRA_DOCS, fieldsAsOf } from '../data/cases';
import { loadSources } from '../data/source';
import {
  countFields, docDate, effectiveField, fmtDate, fmtShort, normalizeDocs, normalizeSources, nowTime, stepStateAt,
} from '../components/case/caseUtils';
import type { EffField, FieldOverride } from '../components/case/caseUtils';
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
import { Btn, Card, Pill } from '../components/case/ui';
import { IcArrow, IcCheck, IcPerson } from '../components/case/icons';
import '../components/case/case.css';
import './CaseView.css';

type Tab = NonNullable<Extract<Route, { page: 'case' }>['tab']>;
const TABS: { id: Tab; label: string }[] = [
  { id: 'prehlad', label: 'Prehľad' },
  { id: 'podklad', label: 'Podklad' },
  { id: 'kroky', label: 'Cesta' },
  { id: 'dokumenty', label: 'Dokumenty' },
  { id: 'zaznam', label: 'Záznam' },
];

export default function CaseView() {
  const nav = useNav();
  const route = nav.route;
  const caseId = route.page === 'case' ? route.caseId : CASES[0]?.id;
  const tab: Tab = (route.page === 'case' && route.tab) || 'prehlad';
  const c: Case | undefined = useMemo(() => CASES.find((x) => x.id === caseId) ?? CASES[0], [caseId]);

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

  /* ---- local demo state (per case) ---- */
  const [overrides, setOverrides] = useState<Record<string, FieldOverride>>({});
  const [arrived, setArrived] = useState<SourceDoc[]>([]);
  const [sessionLog, setSessionLog] = useState<LogEntry[]>([]);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [modal, setModal] = useState<{ key: string; req: RequestDraft; reason: 'missing' | 'conflict' } | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const [flashMetric, setFlashMetric] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { setOverrides({}); setArrived([]); setSessionLog([]); setPanel(null); setModal(null); }, [c?.id]);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 2800); return () => window.clearTimeout(t); }, [toast]);

  const asOf = nav.asOf && /^\d{4}-\d{2}-\d{2}$/.test(nav.asOf) ? nav.asOf : DEMO_TODAY;

  /* ---- documents with text ---- */
  const docs: SourceDoc[] = useMemo(() => {
    if (!c) return [];
    const arrivedById = Object.fromEntries(arrived.map((a) => [a.id, a]));
    const base = c.docs.map((d) => {
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
  // effectiveField applies the demo overrides (request sent / answer arrived / conflict decided).
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
  const sliderMax = useMemo(() => {
    const all = [DEMO_TODAY, c?.mdtDate ?? '', ...docs.map(docDate)].filter(Boolean);
    return all.sort()[all.length - 1] ?? DEMO_TODAY;
  }, [c, docs]);

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

  /* ---- requests, decisions, simulated answers ---- */
  const addLog = (action: string, detail: string) =>
    setSessionLog((l) => [...l, { date: DEMO_TODAY, time: nowTime(), action, detail, billable: true }]);

  const buildRequest = (key: string, reason: 'missing' | 'conflict'): RequestDraft => {
    const f = c!.fields.find((x) => x.key === key)!;
    const who = `${c!.patient.firstName} ${c!.patient.lastName}`;
    if (reason === 'missing' && f.request) {
      return { to: f.request.to, channel: f.request.channel, draft: f.request.draft, subject: `Prosba o doplnenie: ${f.label}` };
    }
    if (reason === 'conflict' && f.conflict) {
      const a = f.conflict.a.citation.docId, b = f.conflict.b.citation.docId;
      const place = docsById[a]?.place || docsById[b]?.place || c!.referringGp.name;
      return {
        to: place, channel: 'e-mail', subject: `Prosba o upresnenie: ${f.label}`,
        draft: `Dobrý deň,\n\npri príprave podkladu na konzílium ${c!.mdtDate ? fmtDate(c!.mdtDate) : ''} pre pacientku ${who} sa v položke „${f.label}“ rozchádzajú dva zdroje (správa ${a} a správa ${b}).\n\nProsím o potvrdenie, ktorý údaj platí, prípadne o opravu správy.\n\nĎakujem za spoluprácu.\nKoordinátorka KOC, ${c!.koc}`,
      };
    }
    return {
      to: c!.referringGp.name, channel: 'e-mail', subject: `Prosba o doplnenie: ${f.label}`,
      draft: `Dobrý deň,\n\npre podklad na konzílium ${c!.mdtDate ? fmtDate(c!.mdtDate) : ''} pre pacientku ${who} nám v dokumentácii chýba položka „${f.label}“.\n\nProsím o doplnenie odpoveďou na túto správu.\n\nĎakujem za spoluprácu.\nKoordinátorka KOC, ${c!.koc}`,
    };
  };
  const requestField = (key: string) => {
    const f = fields.find((x) => x.field.key === key);
    const reason: 'missing' | 'conflict' = f?.status === 'conflict' ? 'conflict' : 'missing';
    setModal({ key, req: buildRequest(key, reason), reason });
  };
  const sendRequest = (r: RequestDraft) => {
    if (!modal) return;
    const f = c!.fields.find((x) => x.key === modal.key)!;
    setOverrides((o) => ({ ...o, [modal.key]: { kind: 'pending', to: r.to, channel: r.channel, sentAt: DEMO_TODAY, reason: modal.reason } }));
    addLog(modal.reason === 'conflict' ? 'Vyžiadané upresnenie' : 'Vyžiadaný údaj', `${f.label} · ${r.to} · ${r.channel}`);
    setModal(null);
    setPanel({ kind: 'field', key: modal.key });
    setToast(`Žiadosť odoslaná · ${r.to}`);
  };
  const simulateAnswer = (key: string) => {
    const f = c!.fields.find((x) => x.key === key)!;
    const r = f.resolvedBy;
    if (!r) return;
    const when = asOf < DEMO_TODAY ? asOf : DEMO_TODAY; // the answer arrives "now" in the demo
    const known = docsById[r.docId];
    const doc: SourceDoc = known ?? { id: r.docId, title: `Odpoveď: ${f.label}`, place: f.request?.to ?? c!.referringGp.practice, kind: 'report', examDate: when, channel: f.request?.channel ?? 'e-mail', text: r.citation.quote, receivedAt: when };
    setArrived((a) => (a.some((d) => d.id === doc.id) ? a : [...a, { ...doc, receivedAt: when, examDate: doc.examDate > when ? when : doc.examDate }]));
    setOverrides((o) => ({ ...o, [key]: { kind: 'resolved', value: r.value, citation: r.citation, docId: r.docId, date: when, note: `doplnené z odpovede · správa ${r.docId}` } }));
    addLog('Prijatá odpoveď', `${f.label}: ${r.value} (správa ${r.docId}) · zapracované do podkladu`);
    setFlashKey(key); setFlashMetric(true);
    window.setTimeout(() => { setFlashKey(null); setFlashMetric(false); }, 1900);
    setToast(`Prišla odpoveď · správa ${r.docId} · pole „${f.label}“ doplnené`);
  };
  const decide = (key: string, which: 'a' | 'b') => {
    const f = c!.fields.find((x) => x.key === key)!;
    if (!f.conflict) return;
    const v = f.conflict[which];
    setOverrides((o) => ({ ...o, [key]: { kind: 'decided', value: v.value, citation: v.citation, date: asOf < DEMO_TODAY ? asOf : DEMO_TODAY, note: `rozhodnuté koordinátorom: platí verzia ${which.toUpperCase()} (správa ${v.citation.docId})` } }));
    addLog('Rozhodnutý rozpor', `${f.label}: platí verzia ${which.toUpperCase()} · ${v.value} (správa ${v.citation.docId})`);
    setFlashKey(key); setFlashMetric(true);
    window.setTimeout(() => { setFlashKey(null); setFlashMetric(false); }, 1900);
    setPanel({ kind: 'doc', docId: v.citation.docId, quote: v.citation.quote });
    setToast(`Rozpor rozhodnutý · platí ${which.toUpperCase()}`);
  };

  if (!c) return <div className="cv-page"><Card><p>Prípad sa nenašiel.</p></Card></div>;

  const activeKey = panel?.kind === 'field' ? panel.key : undefined;
  const panelField = panel?.kind === 'field' ? fields.find((f) => f.field.key === panel.key) : undefined;
  const todo = (f: EffField) => f.status === 'missing' || f.status === 'conflict' || f.status === 'pending' || f.status === 'proposed';
  const todoCount = fields.filter(todo).length;

  return (
    <div className={`cv-page ${panel ? 'has-panel' : ''}`}>
      <CaseHeader c={c} referral={referral} onMdt={() => nav.go({ page: 'mdt', caseId: c.id })} onGp={() => nav.go({ page: 'gp', caseId: c.id })} />

      <nav className="cv-tabs" aria-label="Časti prípadu">
        {TABS.map((t) => (
          <button type="button" key={t.id} className={`cv-tab ${tab === t.id ? 'is-on' : ''}`} onClick={() => goTab(t.id)}>
            {t.label}
            {t.id === 'podklad' && todoCount > 0 && <span className="cv-tab-badge">{todoCount}</span>}
          </button>
        ))}
      </nav>

      {tab === 'prehlad' && (
        <div className="cv-stack">
          <Metrics c={c} counts={counts} asOf={asOf} stepsDone={stepsDone} stepsTotal={c.steps.length} flash={flashMetric} />
          <div className="cv-two">
            <AsOfSlider asOf={asOf} min={c.receivedAt} max={sliderMax} docs={docs} mdtDate={c.mdtDate} onChange={nav.setAsOf} />
            <Card title="Ďalší krok" className="cv-next">
              <div className="cv-next-text">{c.nextStep.text}</div>
              <div className="cv-next-meta">
                <Pill tone={c.nextStep.mine ? 'accent' : 'neutral'}><IcPerson size={13} /> {c.nextStep.mine ? 'ja (koordinátor)' : c.nextStep.owner}</Pill>
                <span className={`cv-next-due ${c.nextStep.due < asOf ? 'is-late' : ''}`}>do {fmtDate(c.nextStep.due)}</span>
              </div>
              <StepsStrip steps={c.steps} asOf={asOf} onMore={() => goTab('kroky')} />
              <Btn variant="ghost" size="sm" icon={<IcArrow size={14} />} onClick={() => goTab('kroky')}>Celá cesta</Btn>
            </Card>
          </div>
          <Card title="Úplnosť podkladu" aside={<span className="cs-hint">20 polí šablóny VZP „Handover“ · klik otvorí originál</span>}>
            <Semaphore fields={fields} counts={counts} activeKey={activeKey} flashKey={flashKey} onPick={pickTile} />
          </Card>
          {todoCount > 0 ? (
            <Card title="Čo treba vyriešiť" aside={<span className="cs-hint">{todoCount} {todoCount === 1 ? 'položka' : todoCount <= 4 ? 'položky' : 'položiek'}</span>}>
              <FieldList fields={fields} activeKey={activeKey} flashKey={flashKey} onOpen={openField} onRequest={requestField} onOpenDoc={openDoc} only={todo} />
            </Card>
          ) : (
            <Card className="cv-done"><div className="cv-done-in"><IcCheck size={20} /> Podklad je kompletný: všetky polia sú potvrdené so zdrojom.</div></Card>
          )}
        </div>
      )}

      {tab === 'podklad' && (
        <div className="cv-stack">
          <div className="cv-two cv-two-wide">
            <Card title="Semafor podkladu" aside={<span className="cs-hint">stav k {fmtShort(asOf)}</span>}>
              <Semaphore fields={fields} counts={counts} activeKey={activeKey} flashKey={flashKey} onPick={pickTile} compact />
            </Card>
            <AsOfSlider asOf={asOf} min={c.receivedAt} max={sliderMax} docs={docs} mdtDate={c.mdtDate} onChange={nav.setAsOf} />
          </div>
          <Card title="Polia podkladu" aside={<span className="cs-hint">{counts.confirmed}/{counts.total} potvrdených · {counts.noSource} bez zdroja</span>} pad={false} className="cv-fields-card">
            <FieldList fields={fields} activeKey={activeKey} flashKey={flashKey} onOpen={openField} onRequest={requestField} onOpenDoc={openDoc} />
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
          <Card title="Cesta pacientky" aside={
            <span className="cv-journey-legend">
              <span><i className="is-done" /> výsledok doručený</span>
              <span><i className="is-late" /> mešká</span>
              <span><i className="is-future" /> k dátumu ešte nevzniklo</span>
              <span className="cs-hint">{stepsVisible.length} z {c.steps.length} krokov k {fmtShort(asOf)}</span>
            </span>
          }>
            <Journey steps={c.steps} asOf={asOf} mdtDate={c.mdtDate} onOpenDoc={openDoc} />
          </Card>
          <AsOfSlider asOf={asOf} min={c.receivedAt} max={sliderMax} docs={docs} mdtDate={c.mdtDate} onChange={nav.setAsOf} />
        </div>
      )}

      {tab === 'dokumenty' && (
        <div className="cv-stack">
          <DocsList docs={docs} asOf={asOf} onOpenDoc={(id) => openDoc(id)} />
          <AsOfSlider asOf={asOf} min={c.receivedAt} max={sliderMax} docs={docs} mdtDate={c.mdtDate} onChange={nav.setAsOf} />
        </div>
      )}

      {tab === 'zaznam' && (
        <div className="cv-stack">
          <LogCard log={log} asOf={asOf} />
        </div>
      )}

      {panel && (
        <OriginalPanel panel={panel} field={panelField} docsById={docsById} onClose={closePanel} onDecide={decide}
          onRequest={requestField} onSimulate={simulateAnswer} onCite={(i) => setPanel((p) => (p && p.kind === 'field' ? { ...p, cite: i } : p))} />
      )}
      {modal && (
        <RequestModal title={c.fields.find((f) => f.key === modal.key)?.label ?? ''} req={modal.req} onSend={sendRequest} onClose={() => setModal(null)} />
      )}
      {toast && <div className="cv-toast" role="status">{toast}</div>}
    </div>
  );
}
