// Laboratórium, Lieky, Vyšetrenia, Dokumenty, Záznam o koordinovaní – all filtered by the as-of date.
import type { Exam, LabRow, LogEntry, Medication, SourceDoc } from '../../types';
import { SK_KIND, docDate, fmtDate, fmtShort, visibleLog } from './caseUtils';
import { Card, Empty, Pill, SourceChip } from './ui';
import { IcChevron, IcCheck, IcClock, IcDoc } from './icons';

/* ---------- Laboratórium ---------- */
export function LabsCard({ labs, asOf, onOpenDoc }: { labs: LabRow[]; asOf: string; onOpenDoc: (docId: string, quote?: string) => void }) {
  const rows = labs.filter((r) => r.date <= asOf);
  const hidden = labs.length - rows.length;
  const dates = Array.from(new Set(rows.map((r) => r.date))).sort();
  return (
    <Card title="Laboratórium" aside={<span className="cs-hint">{dates.length ? `${dates.length} ${dates.length === 1 ? 'odber' : dates.length <= 4 ? 'odbery' : 'odberov'}` : ''}{hidden ? ` · ${hidden} k dátumu skrytých` : ''}</span>}>
      {!rows.length ? <Empty>K zvolenému dátumu nie sú laboratórne výsledky.</Empty> : (
        <div className="cs-labs">
          {dates.map((d) => {
            const list = rows.filter((r) => r.date === d);
            const lab = list[0]?.lab; const docId = list[0]?.docId;
            return (
              <div key={d} className="cs-lab-block">
                <div className="cs-lab-head">
                  <strong>odber {fmtDate(d)}</strong>
                  <span className="cs-hint">{lab}</span>
                  {docId && <SourceChip docId={docId} onClick={() => onOpenDoc(docId)} />}
                </div>
                <table className="cs-table">
                  <thead><tr><th>Vyšetrenie</th><th className="r">Výsledok</th><th>Jednotky</th><th>Ref. medze</th><th /></tr></thead>
                  <tbody>
                    {list.map((r, i) => (
                      <tr key={i} className={r.flag ? `is-${r.flag}` : ''} onClick={() => onOpenDoc(r.docId, `${r.test}\n${r.value}`)} title="Otvoriť v origináli">
                        <td>{r.test}</td>
                        <td className="r mono">{r.value}</td>
                        <td className="mono muted">{r.unit}</td>
                        <td className="mono muted">{r.ref ?? ''}</td>
                        <td className="flag">{r.flag && <span className={`cs-flag cs-flag-${r.flag}`}>{r.flag}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          <p className="cs-hint">H = nad medzou, L = pod medzou. Hodnoty presne tak, ako ich vydalo laboratórium.</p>
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
export function DocsList({ docs, asOf, onOpenDoc }: { docs: SourceDoc[]; asOf: string; onOpenDoc: (docId: string) => void }) {
  const sorted = [...docs].sort((a, b) => (docDate(a) < docDate(b) ? -1 : docDate(a) > docDate(b) ? 1 : a.id.localeCompare(b.id)));
  const received = sorted.filter((d) => docDate(d) <= asOf);
  const later = sorted.filter((d) => docDate(d) > asOf);
  const Row = ({ d, future }: { d: SourceDoc; future: boolean }) => (
    <div className={`cs-docrow ${future ? 'is-future' : ''}`} role="button" tabIndex={future ? -1 : 0} onClick={() => !future && onOpenDoc(d.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' && !future) onOpenDoc(d.id); }}>
      <span className="cs-docrow-ic"><IcDoc size={18} /></span>
      <span className="cs-docrow-id">{d.id}</span>
      <div className="cs-docrow-main">
        <div className="cs-docrow-title">{d.title}</div>
        <div className="cs-docrow-meta">{d.place} · {SK_KIND[d.kind]} · vyšetrenie {fmtDate(d.examDate)}</div>
      </div>
      <div className="cs-docrow-side">
        <Pill tone={future ? 'neutral' : 'sky'}>{d.channel}</Pill>
        <span className="cs-docrow-recv">{future ? `príde ${fmtShort(d.receivedAt)}` : `prijaté ${fmtShort(d.receivedAt)}`}</span>
        <span className="cs-row-chev"><IcChevron size={16} /></span>
      </div>
    </div>
  );
  return (
    <div className="cs-docs">
      <Card title="Prijaté dokumenty" aside={<span className="cs-hint">{received.length} z {docs.length} k {fmtShort(asOf)}</span>}>
        {received.length ? received.map((d) => <Row key={d.id} d={d} future={false} />) : <Empty>K zvolenému dátumu ešte nič neprišlo.</Empty>}
      </Card>
      {later.length > 0 && (
        <Card title="Prídu neskôr" aside={<span className="cs-hint">k zvolenému dátumu ešte neexistujú</span>}>
          {later.map((d) => <Row key={d.id} d={d} future />)}
        </Card>
      )}
    </div>
  );
}

/* ---------- Záznam o koordinovaní ---------- */
export function LogCard({ log, asOf }: { log: LogEntry[]; asOf: string }) {
  const vis = visibleLog(log, asOf);
  const days = Array.from(new Set(vis.map((e) => e.date))).sort();
  const billableDays = days.filter((d) => vis.some((e) => e.date === d && e.billable));
  const hidden = log.length - vis.length;
  return (
    <Card title="Záznam o koordinovaní" aside={
      <span className="cs-log-sum">
        <Pill tone="accent"><IcCheck size={13} /> {billableDays.length} {billableDays.length === 1 ? 'deň' : billableDays.length <= 4 ? 'dni' : 'dní'} so zásahom · výkon 51887</Pill>
        {hidden > 0 && <span className="cs-hint">{hidden} k dátumu skrytých</span>}
      </span>
    }>
      {!vis.length ? <Empty>Zatiaľ bez úkonov.</Empty> : (
        <div className="cs-log">
          {days.map((d) => {
            const items = vis.filter((e) => e.date === d);
            const billable = items.some((e) => e.billable);
            return (
              <div key={d} className={`cs-log-day ${billable ? 'is-billable' : ''}`}>
                <div className="cs-log-dayhead">
                  <strong>{fmtDate(d)}</strong>
                  {billable ? <span className="cs-log-bill"><IcCheck size={12} /> deň so zásahom · výkon 51887</span> : <span className="cs-hint">bez zásahu koordinátora</span>}
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
          <p className="cs-hint">Každý úkon sa zapíše sám. Deň so zásahom = podklad pre výkon 51887 (250 Kč, najviac raz denne), vykazuje nemocnica.</p>
        </div>
      )}
    </Card>
  );
}
