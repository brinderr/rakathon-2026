import type { EffField } from './caseUtils';
import type { Counts } from './caseUtils';
import { Empty } from './ui';

const LEGEND: { key: keyof Counts; cls: string; label: string }[] = [
  { key: 'confirmed', cls: 'confirmed', label: 'potvrdené · citát overený programom, skontroloval človek' },
  { key: 'proposed', cls: 'proposed', label: 'návrh · citát overený, čaká na kontrolu človekom' },
  { key: 'missing', cls: 'missing', label: 'chýba · vyžiadame' },
  { key: 'conflict', cls: 'conflict', label: 'rozpor zdrojov · overí človek' },
];

export function Semaphore({ fields, counts, activeKey, flashKey, onPick, compact }:
  { fields: EffField[]; counts: Counts; activeKey?: string; flashKey?: string | null; onPick: (key: string) => void; compact?: boolean }) {
  if (!fields.length) return <Empty>Podklad sa ešte nezačal – čakáme na správy.</Empty>;
  return (
    <div className={`cs-sem ${compact ? 'is-compact' : ''}`}>
      <div className="cs-sem-grid" role="list" aria-label="Semafor 20 polí podkladu">
        {fields.map((f) => (
          <button type="button" role="listitem" key={f.field.key}
            className={`cs-tile cs-tile-${f.status} ${activeKey === f.field.key ? 'is-active' : ''} ${flashKey === f.field.key ? 'is-flash' : ''}`}
            title={`${f.index}. ${f.field.label}`} onClick={() => onPick(f.field.key)}>
            <span className="cs-tile-n">{f.index}</span>
            <span className="cs-tile-l">{f.field.label}</span>
          </button>
        ))}
      </div>
      <div className="cs-sem-legend">
        {LEGEND.map((l) => (
          <span key={l.key} className="cs-legend-item">
            <span className={`cs-legend-dot cs-tile-${l.cls}`} />
            <strong>{counts[l.key]}</strong> {l.label}
          </span>
        ))}
        {counts.pending > 0 && <span className="cs-legend-item"><span className="cs-legend-dot cs-tile-pending" /><strong>{counts.pending}</strong> čaká na odpoveď</span>}
        {counts.future > 0 && <span className="cs-legend-item"><span className="cs-legend-dot cs-tile-future" /><strong>{counts.future}</strong> k dátumu ešte neznáme</span>}
      </div>
    </div>
  );
}
