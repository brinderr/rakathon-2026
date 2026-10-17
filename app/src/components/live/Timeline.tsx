// Left column: reports in the order the coordinator received them. Each received report can be opened,
// edited ("Upravit" opens EditDrawer); the coordinator's phone notes sit in the same timeline.
import { Icon, Pill } from '../ui';
import { czDate } from '../../ai/text.ts';
import type { LiveDoc } from './liveData';

export interface TimelineItem {
  doc: LiveDoc;
  arrived: boolean;
  removed: boolean;
  edited: boolean;
  excluded: boolean;    // received after the MDT date and left out by "stav k datu konzilia"
  isNew: boolean;       // the report that arrived last
  text: string;         // current text (edited or original)
}

export function Timeline({ items, total, received, editing, onView, onEdit, onRemoveNote, onPhone, canPhone }: {
  items: TimelineItem[];
  total: number;
  received: number;
  editing: string | null;
  onView: (docId: string) => void;
  onEdit: (docId: string) => void;
  onRemoveNote: (docId: string) => void;
  onPhone: () => void;
  canPhone: boolean;
}) {
  return (
    <section className="lv-card lv-timeline" aria-label="Příchod zpráv">
      <div className="lv-card__head">
        <h2>Příchod zpráv</h2>
        <span className="lv-muted">přijato {received} z {total}</span>
      </div>
      <ol className="lv-tl">
        {items.map((it) => {
          const d = it.doc;
          if (!it.arrived) {
            return (
              <li key={d.id} className="lv-tl__item lv-tl__item--waiting">
                <span className="lv-tl__id">{d.id}</span>
                <div className="lv-tl__main">
                  <div className="lv-tl__title">{d.title}</div>
                  <div className="lv-tl__meta">zatím nepřišla</div>
                </div>
              </li>
            );
          }
          const cls = ['lv-tl__item', it.isNew ? 'is-new' : '', it.removed ? 'is-removed' : '', it.excluded ? 'is-excluded' : '', d.byCoordinator ? 'is-note' : ''].filter(Boolean).join(' ');
          return (
            <li key={d.id} className={cls}>
              <span className="lv-tl__id">{d.byCoordinator ? <Icon name="phone" size={14} /> : d.id}</span>
              <div className="lv-tl__main">
                <div className="lv-tl__title">{d.title}</div>
                <div className="lv-tl__meta">
                  <span className="lv-chan">{d.channel}</span>
                  <span>{d.place}</span>
                </div>
                <div className="lv-tl__meta">
                  {d.byCoordinator ? 'zapsáno' : 'přijato'} {czDate(d.receivedAt)}
                  {!d.byCoordinator && d.date !== d.receivedAt && <> · zpráva z {czDate(d.date)}</>}
                </div>
                <div className="lv-tl__tags">
                  {it.isNew && <Pill tone="accent" size="sm">právě přišla</Pill>}
                  {d.byCoordinator && <Pill tone="sky" size="sm">vstup koordinátorky, ne zpráva</Pill>}
                  {it.edited && <Pill tone="amber" size="sm">upraveno</Pill>}
                  {it.removed && <Pill tone="coral" size="sm">smazáno</Pill>}
                  {it.excluded && <Pill tone="neutral" size="sm">po konziliu – mimo podklad</Pill>}
                </div>
                <div className="lv-tl__actions">
                  {!it.removed && (
                    <button type="button" className="lv-link" onClick={() => onView(d.id)}><Icon name="eye" size={15} />Zobrazit</button>
                  )}
                  {d.byCoordinator ? (
                    <button type="button" className="lv-link" onClick={() => onRemoveNote(d.id)}><Icon name="x" size={15} />Smazat zápis</button>
                  ) : (
                    <button type="button" className="lv-link" aria-haspopup="dialog" aria-expanded={editing === d.id}
                      onClick={() => onEdit(d.id)}>
                      <Icon name="edit" size={15} />Upravit
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {canPhone && (
        <button type="button" className="btn btn--ghost btn--sm lv-timeline__phone" onClick={onPhone}>
          <Icon name="phone" size={16} />Zapsat telefonát
        </button>
      )}
    </section>
  );
}
