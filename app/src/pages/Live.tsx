// „Zpracování naživo“: the extractor (src/ai/extract.ts) runs in the browser after every report that arrives,
// after every edit and when the "stav k datu konzilia" switch changes. Nothing is precomputed on this screen:
// the 20 fields, the quotes and the traps are what extractHandover returns right now, with the measured time.
// Reads caseId from the route when it has one ('alena' | 'novak'), otherwise Alena.
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavContext } from '../nav';
import { Button, Pill, Ring } from '../components/ui';
import { czDate, daysBetween } from '../ai/text.ts';
import {
  diffRuns, filledCount, findingTitle, firstDate, runEngine, SEVERITY_TONE, shownStatus, STATUS_CZ,
  type EngineDoc, type EngineRun, type ExtractionResult,
} from '../components/live/engine';
import {
  ALENA_PRESETS, loadLiveCase, novakAvailable, PHONE_NOTE_SUGGESTION,
  type LiveCase, type LiveCaseId, type LiveDoc, type Preset,
} from '../components/live/liveData';
import { Timeline, type TimelineItem } from '../components/live/Timeline';
import { FieldPanel } from '../components/live/FieldPanel';
import { FindingsPanel } from '../components/live/FindingsPanel';
import { BreakIt } from '../components/live/BreakIt';
import { DocViewer } from '../components/live/DocViewer';
import { EditDrawer } from '../components/live/EditDrawer';
import { PhoneNoteModal } from '../components/live/PhoneNoteModal';
import './Live.css';

const STEP_MS = 1200;
/** "Today" of the demo: playback stops here; reports received later come only after "Ukázat, co přijde po konziliu". */
const TODAY = '2026-10-19';
const dayMonth = (iso: string) => `${Number(iso.slice(8, 10))}. ${Number(iso.slice(5, 7))}.`;

type Cause = { kind: 'start' } | { kind: 'arrival' } | { kind: 'text'; text: string };

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg className="icon" width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {playing ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></> : <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />}
    </svg>
  );
}

function maxDate(dates: string[]): string {
  return dates.reduce((a, b) => (b > a ? b : a), '');
}

export function LiveScreen({ caseId: initialCase }: { caseId: string }) {
  const nav = useContext(NavContext);
  const [caseId, setCaseId] = useState<LiveCaseId>(initialCase === 'novak' && novakAvailable() ? 'novak' : 'alena');
  const [lc, setLc] = useState<LiveCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [arrived, setArrived] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [atMdt, setAtMdt] = useState(false);
  const [showFuture, setShowFuture] = useState(false); // reports received after TODAY are let in
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const [notes, setNotes] = useState<LiveDoc[]>([]);
  const [confirmed, setConfirmed] = useState<Record<string, string>>({});
  const [openField, setOpenField] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ docId: string; quotes: string[] } | null>(null);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [cause, setCause] = useState<Cause>({ kind: 'start' });
  const [run, setRun] = useState<{ cur: EngineRun; prev: ExtractionResult | null } | null>(null);
  const [nonce, setNonce] = useState(0); // forces a fresh run after "Začít znovu"
  const runNo = useRef(0);
  const noteNo = useRef(0);

  // ---- load the reports of the case
  useEffect(() => {
    let alive = true;
    loadLiveCase(caseId)
      .then((c) => { if (alive) { setLc(c); setError(null); } })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); });
    return () => { alive = false; };
  }, [caseId]);

  const resetAll = useCallback(() => {
    setArrived(1); setPlaying(false); setAtMdt(false); setShowFuture(false); setEdits({}); setRemoved([]); setNotes([]);
    setConfirmed({}); setOpenField(null); setEditing(null); setViewer(null); setCause({ kind: 'start' });
  }, []);

  const switchCase = (id: LiveCaseId) => {
    if (id === caseId) return;
    // inside the app the patient is part of the address (#live/novak); the screen opens fresh for the other patient
    if (nav) { nav.go({ page: 'live', caseId: id }); return; }
    resetAll();
    setRun(null);
    setLc(null);
    setCaseId(id);
  };

  // ---- what the extractor reads now
  const total = lc?.docs.length ?? 0;
  // how many reports had arrived by TODAY (all of them when none is dated later)
  const todayCount = useMemo(() => (lc ? lc.docs.filter((d) => d.receivedAt <= TODAY).length || lc.docs.length : 0), [lc]);
  const limit = showFuture ? total : todayCount;
  const arrivedDocs = useMemo(() => (lc ? lc.docs.slice(0, arrived) : []), [lc, arrived]);
  const engineDocs = useMemo<EngineDoc[] | null>(() => {
    if (!lc) return null;
    const docs: EngineDoc[] = arrivedDocs
      .filter((d) => !removed.includes(d.id))
      .map((d) => ({ id: d.id, date: d.date, title: d.title, text: edits[d.id] ?? d.text }));
    for (const n of notes) docs.push({ id: n.id, date: n.date, title: n.title, text: n.text });
    return docs;
  }, [lc, arrivedDocs, removed, edits, notes]);
  const replayDay = useMemo(
    () => maxDate([...arrivedDocs.map((d) => d.receivedAt), ...notes.map((n) => n.receivedAt)]) || lc?.receivedAt || '',
    [arrivedDocs, notes, lc],
  );
  const asOf = atMdt && lc ? lc.mdtDate : replayDay;

  // ---- run the extractor live
  useEffect(() => {
    if (!lc || !engineDocs || !asOf) return;
    let alive = true;
    runEngine(lc.id, engineDocs, asOf)
      .then(({ result, ms }) => {
        if (!alive) return;
        runNo.current += 1;
        const n = runNo.current;
        setRun((prev) => ({
          cur: { result, ms, n, docCount: engineDocs.length },
          prev: prev && prev.cur.result.meta.caseId === lc.id ? prev.cur.result : null,
        }));
      })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); });
    return () => { alive = false; };
  }, [lc, engineDocs, asOf, nonce]);

  // ---- playback of arrivals
  useEffect(() => {
    if (!playing || !lc) return;
    const t = window.setInterval(() => setArrived((n) => Math.min(n + 1, limit)), STEP_MS);
    return () => window.clearInterval(t);
  }, [playing, lc, limit]);
  useEffect(() => {
    if (playing && lc && arrived >= limit) setPlaying(false);
  }, [playing, lc, arrived, limit]);

  const allArrived = arrived >= limit;
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (allArrived) return;
    setCause({ kind: 'arrival' });
    setArrived((n) => Math.min(n + 1, limit));
    setPlaying(true);
  };
  const next = () => {
    setPlaying(false);
    if (allArrived) return;
    setCause({ kind: 'arrival' });
    setArrived((n) => Math.min(n + 1, limit));
  };
  // "Ukázat, co přijde po konziliu": lets the reports received after TODAY arrive, one by one
  const showAfterMdt = () => {
    setShowFuture(true);
    setCause({ kind: 'arrival' });
    setArrived((n) => Math.min(n + 1, total));
    setPlaying(true);
  };

  // ---- edits ("Zkuste to rozbít")
  const original = useCallback((docId: string) => lc?.docs.find((d) => d.id === docId)?.text ?? '', [lc]);

  const applyEdit = (docId: string, text: string) => {
    setEdits((e) => {
      const n = { ...e };
      if (text === original(docId)) delete n[docId]; else n[docId] = text;
      return n;
    });
    setRemoved((r) => r.filter((x) => x !== docId));
    setCause({ kind: 'text', text: `Upravena zpráva ${docId} – motor ji přečetl znovu.` });
  };
  const toggleRemove = (docId: string) => {
    const was = removed.includes(docId);
    setRemoved((r) => (was ? r.filter((x) => x !== docId) : [...r, docId]));
    setCause({ kind: 'text', text: was ? `Zpráva ${docId} je zpět.` : `Smazána zpráva ${docId} – motor počítá bez ní.` });
  };
  const revertDoc = (docId: string) => {
    setEdits((e) => { const n = { ...e }; delete n[docId]; return n; });
    setCause({ kind: 'text', text: `Zpráva ${docId} vrácena do původního znění.` });
  };
  const applyPreset = (p: Preset) => {
    if (!lc) return;
    const idx = lc.docs.findIndex((d) => d.id === p.docId);
    if (idx < 0) return;
    setPlaying(false);
    setEditing(null);
    const advanced = idx + 1 > arrived;
    setArrived((n) => Math.max(n, idx + 1));
    const out = p.apply(lc.docs[idx].text);
    if (out === null) {
      setRemoved((r) => (r.includes(p.docId) ? r : [...r, p.docId]));
      setEdits((e) => { const n = { ...e }; delete n[p.docId]; return n; });
    } else {
      setEdits((e) => ({ ...e, [p.docId]: out }));
      setRemoved((r) => r.filter((x) => x !== p.docId));
    }
    setCause({ kind: 'text', text: `Připravená změna: ${p.title}.${advanced ? ` Zprávy až po ${p.docId} jsou teď přijaté.` : ''}` });
  };
  const presetOn = (p: Preset): boolean => {
    const o = original(p.docId);
    const out = p.apply(o);
    return out === null ? removed.includes(p.docId) : edits[p.docId] === out && out !== o;
  };
  const resetDocs = () => {
    setEdits({}); setRemoved([]); setNotes([]); setEditing(null);
    setCause({ kind: 'text', text: 'Vráceny původní zprávy.' });
  };
  const restart = () => { resetAll(); setRun(null); setNonce((n) => n + 1); };

  // ---- phone note
  const savePhone = (text: string) => {
    noteNo.current += 1;
    const date = firstDate(text) ?? replayDay;
    const note: LiveDoc = {
      id: `TEL-${noteNo.current}`, date, receivedAt: date, title: 'Telefonát – zápis koordinátorky',
      place: 'zapsala koordinátorka', channel: 'telefon', text, isRequest: false, byCoordinator: true,
    };
    setNotes((ns) => [...ns, note]);
    setPhoneOpen(false);
    setCause({ kind: 'text', text: 'Zapsán telefonát – motor ho přečetl jako další zdroj.' });
  };
  const removeNote = (id: string) => {
    setNotes((ns) => ns.filter((n) => n.id !== id));
    setCause({ kind: 'text', text: 'Zápis telefonátu smazán.' });
  };

  const toggleMdt = () => {
    const on = !atMdt;
    setAtMdt(on);
    if (lc) setCause({ kind: 'text', text: on ? `Stav k datu konzilia ${czDate(lc.mdtDate)}: zprávy z pozdějších dnů se do podkladu nepočítají.` : 'Stav ke dni poslední přijaté zprávy.' });
  };

  // ---- derived view data
  const result = run?.cur.result ?? null;
  const female = lc?.female ?? true;
  const diff = useMemo(() => (run ? diffRuns(run.prev, run.cur.result, female, confirmed) : null), [run, female, confirmed]);
  const changed = useMemo(() => new Set(diff?.fields.map((f) => f.key) ?? []), [diff]);
  const addedFindings = useMemo(() => new Set(diff?.added.map((f) => f.id) ?? []), [diff]);
  const excluded = useMemo(() => new Set(result?.meta.docsExcluded.map((d) => d.id) ?? []), [result]);

  const docsById = useMemo(() => {
    const m = new Map<string, LiveDoc>();
    for (const d of lc?.docs ?? []) m.set(d.id, { ...d, text: edits[d.id] ?? d.text });
    for (const n of notes) m.set(n.id, n);
    return m;
  }, [lc, edits, notes]);

  const lastArrivedId = cause.kind === 'arrival' && arrived > 0 ? lc?.docs[arrived - 1]?.id : undefined;
  const items: TimelineItem[] = useMemo(() => {
    if (!lc) return [];
    const list: TimelineItem[] = lc.docs.map((d, i) => ({
      doc: d, arrived: i < arrived, removed: removed.includes(d.id), edited: d.id in edits,
      excluded: excluded.has(d.id), isNew: d.id === lastArrivedId, text: edits[d.id] ?? d.text,
    }));
    for (const n of notes) {
      const at = list.findIndex((x) => !x.arrived || x.doc.receivedAt > n.receivedAt);
      const item: TimelineItem = { doc: n, arrived: true, removed: false, edited: false, excluded: excluded.has(n.id), isNew: false, text: n.text };
      if (at < 0) list.push(item); else list.splice(at, 0, item);
    }
    return list;
  }, [lc, arrived, removed, edits, excluded, lastArrivedId, notes]);

  if (error) {
    return (
      <div className="lv">
        <h1>Zpracování naživo</h1>
        <p className="lv-muted">Zprávy se nepodařilo načíst ({error}).</p>
      </div>
    );
  }

  const filled = result ? filledCount(result) : 0;
  const statuses = result ? result.fields.map((f) => shownStatus(f, confirmed)) : [];
  const nConflict = statuses.filter((s) => s === 'conflict').length;
  const nMissing = statuses.filter((s) => s === 'missing').length;
  const nConfirmed = statuses.filter((s) => s === 'confirmed').length;
  const stats = result?.meta.stats;
  const day = lc && replayDay ? daysBetween(lc.receivedAt, replayDay) : 0;
  const request = lc?.docs.find((d) => d.isRequest) ?? lc?.docs[0];
  const lastDoc = lastArrivedId ? docsById.get(lastArrivedId) : undefined;

  let causeText = '';
  if (cause.kind === 'start' && request) causeText = `Na začátku přišla jen žádost o převzetí (zpráva ${request.id}, ${request.channel}). Motor z ní vyplnil ${filled} z 20 údajů.`;
  else if (cause.kind === 'arrival' && lastDoc) causeText = `Přišla zpráva ${lastDoc.id} – ${lastDoc.title} (${lastDoc.channel}, ${lastDoc.place}).`;
  else if (cause.kind === 'text') causeText = cause.text;

  const viewerDoc = viewer ? docsById.get(viewer.docId) : undefined;
  const editingDoc = editing ? lc?.docs.find((d) => d.id === editing) : undefined;
  const canPhone = !!lc;
  const presets = lc?.id === 'alena' ? ALENA_PRESETS : [];
  const appliedPreset = presets.find(presetOn)?.id ?? null;
  const dirty = Object.keys(edits).length > 0 || removed.length > 0 || notes.length > 0;
  const nFields = result?.fields.length ?? 20;
  const atToday = !!lc && !showFuture && todayCount < total && arrived >= todayCount;

  return (
    <div className="lv">
      <header className="lv-head">
        <div className="lv-head__text">
          <h1>Zpracování naživo</h1>
          <p className="lv-lead">Motor čte zprávy jednu po druhé a ke každému údaji připojí doslovnou větu ze zprávy. Co chybí, označí. Nic si nedomýšlí.</p>
        </div>
        <div className="lv-head__side">
          {novakAvailable() && (
            <div className="tabs lv-patients" role="tablist" aria-label="Pacient">
              {([['alena', 'Alena Procházková'], ['novak', 'Josef Novák']] as const).map(([id, name]) => (
                <button key={id} type="button" role="tab" aria-selected={caseId === id}
                  className={`tab ${caseId === id ? 'tab--active' : ''}`} onClick={() => switchCase(id)}>{name}</button>
              ))}
            </div>
          )}
          {nav && (
            <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => nav.go({ page: 'case', caseId })}
              title="Případ v aplikaci koordinátorky: podklad, cesta, dokumenty, záznam">Otevřít případ</Button>
          )}
        </div>
      </header>

      <section className="lv-card lv-bar" aria-label="Ovládání">
        <div className="lv-bar__controls">
          <Button onClick={togglePlay} disabled={!lc || (allArrived && !playing)} aria-pressed={playing}>
            <PlayIcon playing={playing} />{playing ? 'Pozastavit' : 'Přehrát příchod zpráv'}
          </Button>
          <Button variant="ghost" icon="arrow-right" onClick={next} disabled={!lc || allArrived}>Další zpráva</Button>
          <Button variant="ghost" size="sm" icon="history" onClick={restart} disabled={!lc}>Začít znovu</Button>
          <label className="lv-toggle">
            <input type="checkbox" role="switch" checked={atMdt} onChange={toggleMdt} disabled={!lc} />
            <span className="lv-toggle__track" aria-hidden="true"><span className="lv-toggle__thumb" /></span>
            <span>Stav k datu konzilia {lc ? czDate(lc.mdtDate) : ''}</span>
          </label>
        </div>
        <div className="lv-bar__status">
          <Ring value={filled} max={20} size={64} stroke={7} tone={filled === 20 ? 'mint' : 'accent'}>
            <span className="lv-ring">{filled}<small>/20</small></span>
          </Ring>
          <div className="lv-bar__numbers">
            <div className="lv-bar__main"><strong>vyplněno {filled}/20</strong> · rozpor {nConflict} · chybí {nMissing} · potvrzeno {nConfirmed}</div>
            <div className="lv-muted">
              {lc ? <>{lc.patientName} · den {day} od přijetí žádosti · přijato {Math.min(arrived, total)} z {total} zpráv{notes.length ? ` + ${notes.length} telefonát` : ''} · stav k {czDate(asOf)}</> : 'Načítám zprávy…'}
            </div>
            {run && stats && (
              <div className="lv-engine">
                {stats.citationsVerified}/{stats.citations} citací nalezeno doslova · správnost potvrzuje člověk ({nConfirmed}/{nFields})
                {' '}· zpracováno za {run.cur.ms < 10 ? run.cur.ms.toFixed(1) : Math.round(run.cur.ms)} ms · v prohlížeči · bez internetu
              </div>
            )}
          </div>
        </div>
      </section>

      {atToday && lc && (
        <section className="lv-today" role="status" aria-label="Dnes">
          <div className="lv-today__text">
            <strong>Dnes {dayMonth(TODAY)} · konzilium {dayMonth(lc.mdtDate)}</strong>
            <span className="lv-muted">Přehrávání se zastavilo u dneška. Zprávy z pozdějších dnů ještě nepřišly.</span>
          </div>
          <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={showAfterMdt}>Ukázat, co přijde po konziliu</Button>
        </section>
      )}

      <section className="lv-changes" aria-live="polite" key={run?.cur.n ?? 0}>
        <div className="lv-changes__cause">{causeText || 'Načítám…'}</div>
        {diff && (
          <ul className="lv-changes__list">
            {diff.filledFrom !== diff.filledTo && <li><Pill tone={diff.filledTo > diff.filledFrom ? 'mint' : 'coral'} size="sm">vyplněno {diff.filledFrom} → {diff.filledTo}</Pill></li>}
            {diff.fields.map((f) => (
              <li key={`f-${f.key}`}><button type="button" className="lv-chip" onClick={() => setOpenField(f.key)}>
                {f.label}: {f.from === f.to ? 'nová hodnota' : `${STATUS_CZ[f.from]} → ${STATUS_CZ[f.to]}`}
              </button></li>
            ))}
            {diff.added.map((f) => <li key={`a-${f.id}`}><Pill tone={SEVERITY_TONE[f.severity]} size="sm">+ {findingTitle(f, female)}</Pill></li>)}
            {diff.removed.map((f) => <li key={`r-${f.id}`}><Pill tone="neutral" size="sm">− {findingTitle(f, female)}</Pill></li>)}
            {!diff.fields.length && !diff.added.length && !diff.removed.length && <li className="lv-muted">Žádný údaj se nezměnil.</li>}
          </ul>
        )}
      </section>

      <div className="lv-grid">
        <Timeline
          items={items} total={total} received={Math.min(arrived, total)} editing={editing}
          onView={(id) => setViewer({ docId: id, quotes: [] })}
          onEdit={(id) => { setPlaying(false); setEditing(id); }}
          onRemoveNote={removeNote}
          onPhone={() => setPhoneOpen(true)} canPhone={canPhone}
        />
        {result ? (
          <FieldPanel
            fields={result.fields} female={female} confirmed={confirmed} changed={changed} gen={run?.cur.n ?? 0}
            openKey={openField} onToggle={(k) => setOpenField((o) => (o === k ? null : k))} docsById={docsById}
            onView={(docId, quotes) => setViewer({ docId, quotes })}
            onConfirm={(k, v) => setConfirmed((c) => ({ ...c, [k]: v }))}
            onUnconfirm={(k) => setConfirmed((c) => { const n = { ...c }; delete n[k]; return n; })}
            onPhone={() => setPhoneOpen(true)} canPhone={canPhone}
          />
        ) : (
          <section className="lv-card lv-fields"><p className="lv-muted">Motor se spouští…</p></section>
        )}
        <div className="lv-side">
          {result && (
            <FindingsPanel findings={result.findings} added={addedFindings} removed={diff?.removed ?? []} female={female}
              focusNew={cause.kind === 'text'}
              docsById={docsById} onView={(docId, quotes) => setViewer({ docId, quotes })}
              onPhone={() => setPhoneOpen(true)} canPhone={canPhone} />
          )}
          <BreakIt presets={presets} applied={appliedPreset} dirty={dirty} onApply={applyPreset} onReset={resetDocs} />
        </div>
      </div>

      {viewer && viewerDoc && (
        <DocViewer doc={viewerDoc} text={viewerDoc.text} quotes={viewer.quotes} edited={viewer.docId in edits}
          onClose={() => setViewer(null)} />
      )}
      {editing && editingDoc && (
        <EditDrawer key={editing} doc={editingDoc} text={edits[editing] ?? editingDoc.text}
          edited={editing in edits} removed={removed.includes(editing)}
          onApply={(t) => { applyEdit(editing, t); setEditing(null); }}
          onToggleRemove={() => { toggleRemove(editing); setEditing(null); }}
          onRevert={() => { revertDoc(editing); setEditing(null); }}
          onClose={() => setEditing(null)} />
      )}
      {phoneOpen && lc && (
        <PhoneNoteModal suggestion={PHONE_NOTE_SUGGESTION[lc.id]} onSave={savePhone} onClose={() => setPhoneOpen(false)} />
      )}
    </div>
  );
}

/** Screen without props: reads caseId from useNav().route when the route has one, otherwise Alena. */
export default function Live() {
  const nav = useContext(NavContext);
  const route = nav?.route as unknown as { caseId?: unknown } | undefined;
  const id = route && typeof route.caseId === 'string' ? route.caseId : 'alena';
  return <LiveScreen key={id} caseId={id} />;
}
