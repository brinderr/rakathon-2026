// Right column: traps and conflicts the extractor found in the reports received so far, each with its quotes.
// A new item goes first and is marked; after an edit ("Zkuste to rozbít") the panel scrolls to it.
// An item that disappeared after the last recalculation stays visible, crossed out.
import { useEffect, useRef } from 'react';
import { czDate } from '../../ai/text.ts';
import { Icon, Pill } from '../ui';
import { cz } from './cesky';
import { findingTitle, SEVERITY_CZ, SEVERITY_TONE, sortFindings, type Finding } from './engine';
import type { LiveDoc } from './liveData';

export function FindingsPanel({ findings, added, removed, female, focusNew = false, docsById, onView, onPhone, canPhone }: {
  findings: Finding[];
  added: Set<string>;
  removed: Finding[];
  female: boolean;
  focusNew?: boolean;       // scroll to the first new finding (after an edit, not during playback)
  docsById: Map<string, LiveDoc>;
  onView: (docId: string, quotes: string[]) => void;
  onPhone: () => void;
  canPhone: boolean;
}) {
  // the ones that just appeared go first, then by severity
  const rank = { conflict: 0, missing: 1, info: 2 } as const;
  const list = sortFindings(findings).sort((a, b) => Number(added.has(b.id)) - Number(added.has(a.id)) || rank[a.severity] - rank[b.severity]);
  const counts = { conflict: 0, missing: 0, info: 0 };
  for (const f of list) counts[f.severity]++;

  const firstNew = useRef<HTMLLIElement | null>(null);
  const newKey = [...added].sort().join(',');
  useEffect(() => {
    if (!focusNew || !newKey || !firstNew.current) return;
    const el = firstNew.current;
    if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusNew, newKey]);

  return (
    <section className="lv-card lv-traps" aria-label="Pasti a rozpory">
      <div className="lv-card__head">
        <h2>Pasti a rozpory</h2>
        <span className="lv-muted">{counts.conflict} rozpor · {counts.missing} chybí · {counts.info} upozornění</span>
      </div>
      {list.length === 0 && <p className="lv-muted">Zatím nic.</p>}
      <ul className="lv-traplist">
        {list.map((f, i) => (
          <li key={f.id} ref={i === 0 && added.has(f.id) ? firstNew : undefined}
            className={`lv-trap lv-trap--${f.severity} ${added.has(f.id) ? 'is-new' : ''}`}>
            <div className="lv-trap__head">
              <Pill tone={SEVERITY_TONE[f.severity]} size="sm">{SEVERITY_CZ[f.severity]}</Pill>
              <strong>{findingTitle(f, female)}</strong>
              {added.has(f.id) && <span className="lv-new">nové</span>}
            </div>
            <p className="lv-trap__text">{cz(f.text)}</p>
            {f.citations.length > 0 && (
              <ul className="lv-quotes lv-quotes--compact">
                {f.citations.map((c, i) => {
                  const d = docsById.get(c.docId);
                  return (
                    <li key={i} className="lv-quote">
                      <blockquote>„{c.quote}“</blockquote>
                      <div className="lv-quote__src">
                        <span>{d?.byCoordinator ? 'telefonát · zapsala koordinátorka' : `zpráva ${c.docId}${d ? ` · ${czDate(d.date)}` : ''}`}</span>
                        <button type="button" className="lv-link" onClick={() => onView(c.docId, [c.quote])}><Icon name="file" size={14} />Zobrazit</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {f.id === 'ecog-missing' && canPhone && (
              <button type="button" className="btn btn--ghost btn--sm lv-trap__action" onClick={onPhone}>
                <Icon name="phone" size={16} />Zapsat telefonát
              </button>
            )}
          </li>
        ))}
      </ul>
      {removed.length > 0 && (
        <div className="lv-gone">
          <div className="kicker">Po posledním přepočtu zmizelo</div>
          <ul>
            {removed.map((f) => (
              <li key={f.id}><s>{findingTitle(f, female)}</s></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
