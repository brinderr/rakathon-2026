// Laboratórium, Lieky, Vyšetrenia, Dokumenty, Záznam o koordinovaní – all filtered by the as-of date.
import { useState, type ReactNode } from 'react';
import type { Exam, LabRow, LogEntry, Medication, SourceDoc } from '../../types';
import { SK_KIND, docDate, fmtDate, fmtShort, visibleLog } from './caseUtils';
import { Card, Empty, Pill, SourceChip } from './ui';
import { IcChevron, IcCheck, IcClock, IcDoc, IcSend } from './icons';

/* ---------- Laboratórium (one table, a column per sample; by default only out-of-range values and tumour markers) ---------- */
const isMarker = (test: string) => /CA ?19-9|CA ?125|CA ?15-3|CA ?72-4|\bCEA\b|\bAFP\b|\bPSA\b|\bNSE\b|HE4|marker/i.test(test);

export function LabsCard({ labs, asOf, onOpenDoc }: { labs: LabRow[]; asOf: string; onOpenDoc: (docId: string, quote?: string) => void }) {
  const [all, setAll] = useState(false);
  const rows = labs.filter((r) => r.date <= asOf);
  const dates = Array.from(new Set(rows.map((r) => r.date))).sort();
  const hiddenDates = Array.from(new Set(labs.filter((r) => r.date > asOf).map((r) => r.date))).length;
  // tests in the order of the newest sample, then the older ones
  const tests: { test: string; unit: string; ref?: string; cells: Record<string, LabRow> }[] = [];
  for (const d of [...dates].reverse()) {
    for (const r of rows.filter((x) => x.date === d)) {
      let t = tests.find((x) => x.test === r.test);
      if (!t) { t = { test: r.test, unit: r.unit, ref: r.ref, cells: {} }; tests.push(t); }
      t.cells[d] = r;
      if (!t.ref && r.ref) t.ref = r.ref;
    }
  }
  const key = tests.filter((t) => isMarker(t.test) || Object.values(t.cells).some((r) => r.flag));
  const shown = all || key.length === 0 ? tests : key;
  const byDate = (d: string) => rows.find((r) => r.date === d);
  return (
    <Card title="Laboratórium" aside={
      <span className="cs-lab-dates">
        {dates.map((d) => { const r = byDate(d); return r ? <span key={d} className="cs-lab-date">odber {fmtShort(d)} <SourceChip docId={r.docId} onClick={() => onOpenDoc(r.docId)} /></span> : null; })}
        {hiddenDates > 0 && <span className="cs-hint">{hiddenDates} {hiddenDates === 1 ? 'odber' : 'odbery'} k dátumu skryté</span>}
      </span>
    }>
      {!rows.length ? <Empty>K zvolenému dátumu nie sú laboratórne výsledky.</Empty> : (
        <div className="cs-labs">
          <table className="cs-table cs-table-labs">
            <thead>
              <tr>
                <th>Vyšetrenie</th>
                {dates.map((d) => <th key={d} className="r">{fmtShort(d)}</th>)}
                <th>Jednotky</th>
                <th>Ref. medze</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((t) => {
                const newest = [...dates].reverse().map((d) => t.cells[d]).find(Boolean)!;
                return (
                  <tr key={t.test} className={isMarker(t.test) ? 'is-marker' : ''} onClick={() => onOpenDoc(newest.docId, `${t.test}\n${newest.value}`)} title="Otvoriť v origináli">
                    <td>{t.test}</td>
                    {dates.map((d) => {
                      const r = t.cells[d];
                      return (
                        <td key={d} className={`r mono ${r?.flag ? `is-${r.flag}` : ''}`}>
                          {r ? <>{r.value}{r.flag && <span className={`cs-flag cs-flag-${r.flag}`}>{r.flag}</span>}</> : <span className="muted">–</span>}
                        </td>
                      );
                    })}
                    <td className="mono muted">{t.unit}</td>
                    <td className="mono muted">{t.ref ?? ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {key.length > 0 && key.length < tests.length && (
            <button type="button" className="cs-more" onClick={() => setAll((v) => !v)}>
              {all ? `Len mimo normy a onkomarkery (${key.length})` : `Zobraziť všetkých ${tests.length} vyšetrení`}
            </button>
          )}
          <p className="cs-hint">H = nad medzou, L = pod medzou (ako ich označilo laboratórium). Hodnoty sú prepísané presne, názvy vyšetrení sú preložené. Je to výber – celé znenie nájdete v origináli (klik).</p>
        </div>
      )}
    </Card>
  );
}

/* ---------- Lieky ---------- */
export function MedsCard({ meds, asOf, docsById, onOpenDoc }:
  { meds: Medication[]; asOf: string; docsById: Record<string, SourceDoc>; onOpenDoc: (docId: string, quote?: string) => void }) {
  const vis = meds.filter((m) => { const d = docsById[m.citation.docId]; return !d || docDate(d) <= asOf; });
  const hidden = meds.length - vis.length;
  return (
    <Card title="Lieky" aside={<span className="cs-hint">ako v správe, s citátom{hidden ? ` · ${hidden} k dátumu skrytých` : ''}</span>}>
      {!vis.length ? <Empty>K zvolenému dátumu nie je známa medikácia.</Empty> : (
        <ul className="cs-meds">
          {vis.map((m, i) => {
            const d = docsById[m.citation.docId];
            return (
              <li key={i} className="cs-med" onClick={() => onOpenDoc(m.citation.docId, m.citation.quote)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onOpenDoc(m.citation.docId, m.citation.quote); }}>
                <div className="cs-med-main">
                  <div className="cs-med-name">{m.name} <span className="cs-med-dose">{m.dose}</span></div>
                  {m.note && <div className="cs-med-note">{m.note}</div>}
                  <div className="cs-med-quote">„{m.citation.quote}“</div>
                </div>
                <div className="cs-med-side">
                  <SourceChip docId={m.citation.docId} onClick={() => onOpenDoc(m.citation.docId, m.citation.quote)} />
                  {d && <span className="cs-hint">{fmtShort(d.examDate)}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="cs-hint">Bez „dokedy“ – správy to neuvádzajú a nič nedomýšľame.</p>
    </Card>
  );
}

/* ---------- Vyšetrenia (časová os) ---------- */
export function ExamsCard({ exams, asOf, onOpenDoc }: { exams: Exam[]; asOf: string; onOpenDoc: (docId: string, quote?: string) => void }) {
  const vis = [...exams].sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!vis.length) return <Card title="Vyšetrenia"><Empty>Zatiaľ žiadne vyšetrenia.</Empty></Card>;
  return (
    <Card title="Vyšetrenia" aside={<span className="cs-hint">časová os · klik otvorí originál</span>}>
      <ol className="cs-timeline">
        {vis.map((e, i) => {
          const future = e.date > asOf;
          return (
            <li key={i} className={`cs-tl-item ${future ? 'is-future' : ''}`} onClick={() => !future && onOpenDoc(e.docId, e.summary)} role="button" tabIndex={future ? -1 : 0}
              onKeyDown={(ev) => { if (ev.key === 'Enter' && !future) onOpenDoc(e.docId, e.summary); }}>
              <span className="cs-tl-dot" />
              <div className="cs-tl-date">{fmtShort(e.date)}</div>
              <div className="cs-tl-main">
                <div className="cs-tl-type">{e.type}<span className="cs-tl-place"> · {e.place}</span></div>
                <div className="cs-tl-sum">{future ? 'k zvolenému dátumu ešte neprebehlo' : e.summary}</div>
              </div>
              <div className="cs-tl-side">{!future && <SourceChip docId={e.docId} onClick={() => onOpenDoc(e.docId, e.summary)} />}</div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ---------- Dokumenty ---------- */
/** todo = nobody has been asked yet (goes to „Treba vyžiadať“, not to „Čakáme na“ – QA R5 #15). */
export interface WaitingItem { label: string; detail: string; todo?: boolean }

/** `after` = a card rendered between „Prijaté dokumenty“ and „Čakáme na“ (e.g. „Vyžiadané správy“).
 *  Reports received after the chosen date stay in the list but greyed out (README: „tie, ktoré prídu neskôr“). */
export function DocsList({ docs, asOf, waiting, onOpenDoc, after }:
  { docs: SourceDoc[]; asOf: string; waiting: WaitingItem[]; onOpenDoc: (docId: string) => void; after?: ReactNode }) {
  const sorted = [...docs].sort((a, b) => (docDate(a) < docDate(b) ? -1 : docDate(a) > docDate(b) ? 1 : a.id.localeCompare(b.id)));
  const received = sorted.filter((d) => docDate(d) <= asOf);
  const later = sorted.filter((d) => docDate(d) > asOf);
  const toAsk = waiting.filter((w) => w.todo);
  const waitingFor = waiting.filter((w) => !w.todo);
  return (
    <div className="cs-docs">
      <Card title="Prijaté dokumenty" aside={<span className="cs-hint">{received.length} prijatých · {waitingFor.length} očakávame · k {fmtShort(asOf)}</span>}>
        {received.length ? received.map((d) => (
          <div key={d.id} className="cs-docrow" role="button" tabIndex={0} onClick={() => onOpenDoc(d.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenDoc(d.id); }}>
            <span className="cs-docrow-ic"><IcDoc size={18} /></span>
            <span className="cs-docrow-id">{d.id}</span>
            <div className="cs-docrow-main">
              <div className="cs-docrow-title">{d.title}</div>
              <div className="cs-docrow-meta">{d.place} · {SK_KIND[d.kind]} · vyšetrenie {fmtDate(d.examDate)}</div>
            </div>
            <div className="cs-docrow-side">
              <Pill tone="sky">{d.channel}</Pill>
              <span className="cs-docrow-recv">prijaté {fmtShort(d.receivedAt)}</span>
              <span className="cs-row-chev"><IcChevron size={16} /></span>
            </div>
          </div>
        )) : <Empty>K zvolenému dátumu ešte nič neprišlo.</Empty>}
        {later.length > 0 && (
          <>
            <div className="cs-docs-later-head">Neskoršie správy · k {fmtShort(asOf)} ešte neprišli</div>
            {later.map((d) => (
              <div key={d.id} className="cs-docrow is-future" aria-disabled="true">
                <span className="cs-docrow-ic"><IcDoc size={18} /></span>
                <span className="cs-docrow-id">{d.id}</span>
                <div className="cs-docrow-main">
                  <div className="cs-docrow-title">{d.title}</div>
                  <div className="cs-docrow-meta">{d.place} · {SK_KIND[d.kind]} · vyšetrenie {fmtDate(d.examDate)}</div>
                </div>
                <div className="cs-docrow-side"><Pill tone="neutral">ešte neprišlo</Pill></div>
              </div>
            ))}
          </>
        )}
        <p className="cs-hint">Kanály a dátumy prijatia sú v deme simulované – zadanie ich neuvádza.</p>
      </Card>
      {after}
      {toAsk.length > 0 && (
        <Card title="Treba vyžiadať" aside={<span className="cs-hint">chýba v správach, zatiaľ nikto nebol požiadaný</span>}>
          <ul className="cs-wait">
            {toAsk.map((w, i) => (
              <li key={i} className="is-todo">
                <span className="cs-wait-ic"><IcSend size={15} /></span>
                <div><div className="cs-wait-label">{w.label}</div><div className="cs-wait-detail">{w.detail}</div></div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {waitingFor.length > 0 && (
        <Card title="Čakáme na" aside={<span className="cs-hint">vyžiadané alebo objednané, ešte neprišlo</span>}>
          <ul className="cs-wait">
            {waitingFor.map((w, i) => (
              <li key={i}>
                <span className="cs-wait-ic"><IcClock size={15} /></span>
                <div><div className="cs-wait-label">{w.label}</div><div className="cs-wait-detail">{w.detail}</div></div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ---------- Záznam o koordinovaní ---------- */
const CZK_PER_DAY = 250; // výkon 51887, najviac 1× denne na pacienta
const czk = (n: number) => `${n.toLocaleString('sk-SK')} Kč`;

export function LogCard({ log, asOf, onShowAll }: { log: LogEntry[]; asOf: string; onShowAll?: () => void }) {
  const vis = visibleLog(log, asOf);
  const days = Array.from(new Set(vis.map((e) => e.date))).sort();
  const billableDays = days.filter((d) => vis.some((e) => e.date === d && e.billable));
  const hidden = log.length - vis.length;
  const n = billableDays.length;
  return (
    <Card title="Záznam o koordinovaní" aside={
      <span className="cs-log-sum">
        <Pill tone="accent"><IcCheck size={13} /> {n} {n === 1 ? 'deň' : n <= 4 ? 'dni' : 'dní'} so zásahom = {czk(n * CZK_PER_DAY)}</Pill>
        <span className="cs-hint">podklad pre vykázanie výkonu 51887 · vykazuje nemocnica, uznáva poisťovňa</span>
      </span>
    }>
      {hidden > 0 && (
        <div className="cs-log-hidden">
          {hidden} {hidden === 1 ? 'neskorší záznam' : hidden <= 4 ? 'neskoršie záznamy' : 'neskorších záznamov'} (po {fmtShort(asOf)}) {hidden === 1 ? 'je skrytý' : hidden <= 4 ? 'sú skryté' : 'je skrytých'} – posuňte „Stav k dátumu“.
          {onShowAll && <button type="button" className="cs-link" onClick={onShowAll}>zobraziť všetko</button>}
        </div>
      )}
      {!vis.length ? <Empty>Zatiaľ bez úkonov.</Empty> : (
        <div className="cs-log">
          {days.map((d) => {
            const items = vis.filter((e) => e.date === d);
            const billable = items.some((e) => e.billable);
            return (
              <div key={d} className={`cs-log-day ${billable ? 'is-billable' : ''}`}>
                <div className="cs-log-dayhead">
                  <strong>{fmtDate(d)}</strong>
                  {billable ? <span className="cs-log-bill"><IcCheck size={12} /> deň so zásahom · {czk(CZK_PER_DAY)}</span> : <span className="cs-hint">bez zásahu koordinátora</span>}
                </div>
                {items.map((e, i) => (
                  <div key={i} className="cs-log-item">
                    <span className="cs-log-time"><IcClock size={12} /> {e.time ?? '—'}</span>
                    <span className="cs-log-action">{e.action}</span>
                    <span className="cs-log-detail">{e.detail}</span>
                  </div>
                ))}
              </div>
            );
          })}
          <p className="cs-hint">Každý úkon sa zapíše sám. Deň so zásahom = podklad pre výkon 51887 ({czk(CZK_PER_DAY)} za intervenciu, ktorú uzná poisťovňa, najviac 1× denne). Časy a kanály úkonov sú v deme simulované.</p>
        </div>
      )}
    </Card>
  );
}
