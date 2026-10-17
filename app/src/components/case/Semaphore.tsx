import type { EffField } from './caseUtils';
import type { Counts } from './caseUtils';
import { isCallOverride } from './caseUtils';
import { Empty } from './ui';

const LEGEND: { key: keyof Counts; cls: string; label: string }[] = [
  { key: 'confirmed', cls: 'confirmed', label: 'potvrzeno · citát ověřil program, zkontroloval člověk' },
  { key: 'proposed', cls: 'proposed', label: 'návrh · citát ověřen, čeká na kontrolu člověkem' },
  { key: 'missing', cls: 'missing', label: 'chybí · vyžádáme nebo zapíšeme telefonát' },
  { key: 'conflict', cls: 'conflict', label: 'rozpor zdrojů · ověří člověk' },
];

export function Semaphore({ fields, counts, activeKey, flashKey, onPick, compact }:
  { fields: EffField[]; counts: Counts; activeKey?: string; flashKey?: string | null; onPick: (key: string) => void; compact?: boolean }) {
  if (!fields.length) return <Empty>Podklad ještě nezačal – čekáme na zprávy.</Empty>;
  const calls = fields.filter((f) => f.status === 'confirmed' && isCallOverride(f.override)).length;
  return (
    <div className={`cs-sem ${compact ? 'is-compact' : ''}`}>
      <div className="cs-sem-grid" role="list" aria-label="Semafor 20 polí podkladu">
        {fields.map((f) => (
          <button type="button" role="listitem" key={f.field.key}
            className={`cs-tile cs-tile-${f.status} ${activeKey === f.field.key ? 'is-active' : ''} ${flashKey === f.field.key ? 'is-flash' : ''} ${isCallOverride(f.override) ? 'is-call' : ''}`}
            title={`${f.index}. ${f.field.label}${isCallOverride(f.override) ? ' · ze záznamu koordinátorky (telefonát)' : ''}`} onClick={() => onPick(f.field.key)}>
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
        {counts.pending > 0 && <span className="cs-legend-item"><span className="cs-legend-dot cs-tile-pending" /><strong>{counts.pending}</strong> čeká na odpověď</span>}
        {counts.future > 0 && <span className="cs-legend-item"><span className="cs-legend-dot cs-tile-future" /><strong>{counts.future}</strong> k datu ještě neznámé</span>}
        {calls > 0 && <span className="cs-legend-item"><span className="cs-legend-dot cs-tile-confirmed is-call" /><strong>{calls}</strong> ze záznamu koordinátorky (telefonát), ne ze zprávy</span>}
      </div>
    </div>
  );
}
