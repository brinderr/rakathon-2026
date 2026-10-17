// Side panel with the full text of a report (or of a phone note), quotes highlighted.
import { useEffect, useRef } from 'react';
import { Icon, Pill } from '../ui';
import { czDate } from '../../ai/text.ts';
import { quoteRanges } from './engine';
import type { LiveDoc } from './liveData';

export function DocViewer({ doc, text, quotes, edited, onClose }: {
  doc: LiveDoc; text: string; quotes: string[]; edited: boolean; onClose: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    bodyRef.current?.querySelector('mark')?.scrollIntoView({ block: 'center' });
  }, [doc.id, quotes]);

  const ranges = quoteRanges(text, quotes);
  const parts: { s: string; hit: boolean }[] = [];
  let pos = 0;
  for (const [a, b] of ranges) {
    if (a > pos) parts.push({ s: text.slice(pos, a), hit: false });
    parts.push({ s: text.slice(a, b), hit: true });
    pos = b;
  }
  if (pos < text.length) parts.push({ s: text.slice(pos), hit: false });

  return (
    <div className="lv-viewer" role="dialog" aria-modal="true" aria-label={`Zpráva ${doc.id}`}>
      <button type="button" className="lv-viewer__backdrop" aria-label="Zavřít" onClick={onClose} />
      <aside className="lv-viewer__panel">
        <header className="lv-viewer__head">
          <div>
            <div className="kicker">{doc.byCoordinator ? 'Zápis koordinátorky' : `Zpráva ${doc.id}`}</div>
            <h3>{doc.title}</h3>
            <div className="lv-viewer__meta">
              {doc.place} · {doc.channel} · {doc.byCoordinator ? 'zapsáno' : 'přijato'} {czDate(doc.receivedAt)}
              {doc.date !== doc.receivedAt && !doc.byCoordinator ? ` · zpráva z ${czDate(doc.date)}` : ''}
            </div>
            {edited && <Pill tone="amber" size="sm">text upraven v ukázce</Pill>}
          </div>
          <button type="button" className="lv-icon-btn" onClick={onClose} aria-label="Zavřít"><Icon name="x" size={18} /></button>
        </header>
        {quotes.length > 0 && ranges.length === 0 && (
          <p className="lv-viewer__warn">Citát se v aktuálním textu zprávy nenašel.</p>
        )}
        <div className="lv-viewer__body" ref={bodyRef}>
          {parts.map((p, i) => (p.hit ? <mark key={i}>{p.s}</mark> : <span key={i}>{p.s}</span>))}
        </div>
      </aside>
    </div>
  );
}
