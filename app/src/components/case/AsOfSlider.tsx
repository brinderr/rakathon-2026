import type { SourceDoc } from '../../types';
import { DEMO_TODAY } from '../../types';
import { addDays, daysBetween, docDate, fmtDate, fmtShort } from './caseUtils';
import { IcClock } from './icons';

export function AsOfSlider({ asOf, min, max, docs, mdtDate, onChange }:
  { asOf: string; min: string; max: string; docs: SourceDoc[]; mdtDate?: string; onChange: (d: string) => void }) {
  const span = Math.max(1, daysBetween(min, max));
  const cur = Math.min(span, Math.max(0, daysBetween(min, asOf)));
  const pct = (d: string) => `${(Math.min(span, Math.max(0, daysBetween(min, d))) / span) * 100}%`;
  const isToday = asOf === DEMO_TODAY;
  const isMdt = !!mdtDate && asOf === mdtDate;
  const arrivals = docs.filter((d) => docDate(d) >= min && docDate(d) <= max);

  return (
    <section className="cs-asof">
      <div className="cs-asof-head">
        <div>
          <div className="cs-asof-label"><IcClock size={14} /> Stav k dátumu</div>
          <div className="cs-asof-date">{fmtDate(asOf)}
            {isToday && <span className="cs-asof-now">dnes</span>}
            {isMdt && <span className="cs-asof-now cs-asof-mdt">deň konzília</span>}
          </div>
        </div>
        <div className="cs-asof-chips">
          <button type="button" className={`cs-chip ${isToday ? 'is-on' : ''}`} onClick={() => onChange(DEMO_TODAY)}>dnes · {fmtShort(DEMO_TODAY)}</button>
          {mdtDate && <button type="button" className={`cs-chip ${isMdt ? 'is-on' : ''}`} onClick={() => onChange(mdtDate)}>konzílium · {fmtShort(mdtDate)}</button>}
          <button type="button" className={`cs-chip ${asOf === max ? 'is-on' : ''}`} onClick={() => onChange(max)}>všetko · {fmtShort(max)}</button>
        </div>
      </div>
      <div className="cs-asof-track">
        <div className="cs-asof-ticks" aria-hidden="true">
          {arrivals.map((d) => (
            <span key={d.id} className={`cs-asof-tick ${docDate(d) > asOf ? 'is-future' : ''}`} style={{ left: pct(docDate(d)) }} title={`správa ${d.id} · ${d.title} · prijaté ${fmtDate(docDate(d))}`} />
          ))}
          {mdtDate && <span className="cs-asof-tick cs-asof-tick-mdt" style={{ left: pct(mdtDate) }} title={`konzílium ${fmtDate(mdtDate)}`} />}
          <span className="cs-asof-fill" style={{ width: pct(asOf) }} />
        </div>
        <input type="range" min={0} max={span} step={1} value={cur} aria-label="Stav k dátumu"
          onChange={(e) => onChange(addDays(min, Number(e.target.value)))} />
      </div>
      <div className="cs-asof-ends"><span>{fmtShort(min)} prijatie žiadosti</span><span>{fmtShort(max)}</span></div>
      <p className="cs-asof-note">Konzílium vidí len to, čo bolo v daný deň známe. Neskoršie správy sú sivé.</p>
    </section>
  );
}
