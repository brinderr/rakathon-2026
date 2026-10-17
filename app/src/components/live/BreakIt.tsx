// "Zkuste to rozbít": free edit of any report (button "Upravit" in the timeline) plus prepared edits one click away.
import { Icon } from '../ui';
import type { Preset } from './liveData';

export function BreakIt({ presets, applied, dirty, onApply, onReset }: {
  presets: Preset[];
  applied: string | null;
  dirty: boolean;
  onApply: (p: Preset) => void;
  onReset: () => void;
}) {
  return (
    <section className="lv-card lv-break" aria-label="Zkuste to rozbít">
      <div className="lv-card__head">
        <h2>Zkuste to rozbít</h2>
      </div>
      <p className="lv-muted">
        U kterékoli zprávy vlevo klikněte na „Upravit“, přepište text a dejte „Přepočítat“. Motor zprávy přečte znovu
        a ukáže, co se změnilo. {presets.length > 0 && 'Nebo zkuste jednu z připravených změn:'}
      </p>
      {presets.length > 0 && (
        <ul className="lv-presets">
          {presets.map((p) => (
            <li key={p.id}>
              <button type="button" className={`lv-preset ${applied === p.id ? 'is-on' : ''}`} onClick={() => onApply(p)}>
                <span className="lv-preset__title"><Icon name="edit" size={15} />{p.title}</span>
                <span className="lv-preset__detail">{p.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="btn btn--ghost btn--sm" onClick={onReset} disabled={!dirty}>
        <Icon name="history" size={16} />Vrátit původní zprávy
      </button>
    </section>
  );
}
