import type { SourceDoc } from '../../types';
import { DEMO_TODAY } from '../../types';
import { addDays, daysBetween, docDate, fmtDate, fmtShort } from './caseUtils';
import { IcClock } from './icons';

/** One thin strip under the tabs – the same on every tab. Tinted when the chosen day is not "today". */
export function AsOfSlider({ asOf, min, max, docs, mdtDate, onChange }:
  { asOf: string; min: string; max: string; docs: SourceDoc[]; mdtDate?: string; onChange: (d: string) => void }) {
  const span = Math.max(1, daysBetween(min, max));
  const cur = Math.min(span, Math.max(0, daysBetween(min, asOf)));
  const pct = (d: string) => `${(Math.min(span, Math.max(0, daysBetween(min, d))) / span) * 100}%`;
  const isToday = asOf === DEMO_TODAY;
  const isMdt = !!mdtDate && asOf === mdtDate;
  const arrivals = docs.filter((d) => docDate(d) >= min && docDate(d) <= max);
  const afterMdt = !!mdtDate && max > mdtDate;

  return (
    <section className={`cs-asof ${isToday ? '' : 'is-off'}`} aria-label="Stav k dátumu">
      <div className="cs-asof-row">
        <div className="cs-asof-lead">
          <span className="cs-asof-label"><IcClock size={14} /> Stav k dátumu</span>
          <span className="cs-asof-date">{fmtDate(asOf)}</span>
          {isToday && <span className="cs-asof-now">dnes</span>}
          {isMdt && <span className="cs-asof-now cs-asof-mdt">deň konzília</span>}
        </div>
        <div className="cs-asof-track">
          <span className="cs-asof-end">{fmtShort(min)}</span>
          <div className="cs-asof-rail">
            <div className="cs-asof-ticks" aria-hidden="true">
              {arrivals.map((d) => (
                <span key={d.id} className={`cs-asof-tick ${docDate(d) > asOf ? 'is-future' : ''}`} style={{ left: pct(docDate(d)) }} title={`správa ${d.id} · prijaté ${fmtDate(docDate(d))}`} />
              ))}
              {mdtDate && <span className="cs-asof-tick cs-asof-tick-mdt" style={{ left: pct(mdtDate) }} title={`konzílium ${fmtDate(mdtDate)}`} />}
              <span className="cs-asof-fill" style={{ width: pct(asOf) }} />
            </div>
            <input type="range" min={0} max={span} step={1} value={cur} aria-label="Stav k dátumu"
              onChange={(e) => onChange(addDays(min, Number(e.target.value)))} />
          </div>
          <span className="cs-asof-end">{fmtShort(max)}</span>
        </div>
        <div className="cs-asof-chips">
          <button type="button" className={`cs-chip ${isToday ? 'is-on' : ''}`} onClick={() => onChange(DEMO_TODAY)}>dnes · {fmtShort(DEMO_TODAY)}</button>
          {mdtDate && <button type="button" className={`cs-chip ${isMdt ? 'is-on' : ''}`} onClick={() => onChange(mdtDate)}>deň konzília · {fmtShort(mdtDate)}</button>}
          {max !== DEMO_TODAY && max !== mdtDate && (
            <button type="button" className={`cs-chip ${asOf === max ? 'is-on' : ''}`} onClick={() => onChange(max)}>{afterMdt ? 'po konzíliu' : 'všetko'} · {fmtShort(max)}</button>
          )}
        </div>
      </div>
      {!isToday && (
        <div className="cs-asof-off">
          <span>Prezeráte stav k {fmtDate(asOf)} · vidíte len to, čo bolo v ten deň známe; neskoršie správy sú sivé.</span>
          <button type="button" className="cs-asof-back" onClick={() => onChange(DEMO_TODAY)}>← späť na dnes</button>
        </div>
      )}
    </section>
  );
}
