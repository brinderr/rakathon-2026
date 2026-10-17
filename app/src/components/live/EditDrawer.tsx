// "Upravit": side panel with the editable text of one report. "Přepočítat" hands the new text to the extractor.
import { useEffect, useState } from 'react';
import { Icon, Pill } from '../ui';
import { czDate } from '../../ai/text.ts';
import type { LiveDoc } from './liveData';

export function EditDrawer({ doc, text, edited, removed, onApply, onToggleRemove, onRevert, onClose }: {
  doc: LiveDoc;
  text: string;            // current text (edited or original)
  edited: boolean;
  removed: boolean;
  onApply: (text: string) => void;
  onToggleRemove: () => void;
  onRevert: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(text);
  const changed = draft !== text;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="lv-viewer" role="dialog" aria-modal="true" aria-labelledby="lv-edit-title">
      <button type="button" className="lv-viewer__backdrop" aria-label="Zavřít" onClick={onClose} />
      <aside className="lv-viewer__panel">
        <header className="lv-viewer__head">
          <div>
            <div className="kicker">Upravit zprávu {doc.id}</div>
            <h3 id="lv-edit-title">{doc.title}</h3>
            <div className="lv-viewer__meta">{doc.place} · {doc.channel} · přijato {czDate(doc.receivedAt)}</div>
            {edited && <Pill tone="amber" size="sm">upraveno</Pill>}
            {removed && <Pill tone="coral" size="sm">smazáno</Pill>}
          </div>
          <button type="button" className="lv-icon-btn" onClick={onClose} aria-label="Zavřít"><Icon name="x" size={18} /></button>
        </header>
        <div className="lv-editor">
          <label className="lv-edit__label" htmlFor="lv-edit-area">Přepište v textu cokoli – motor zprávu přečte znovu a ukáže, co se změnilo.</label>
          <textarea id="lv-edit-area" className="lv-edit__area lv-editor__area" value={draft} spellCheck={false}
            onChange={(e) => setDraft(e.target.value)} />
          <div className="lv-edit__actions">
            <button type="button" className="btn btn--sm lv-btn-accent" onClick={() => onApply(draft)} disabled={!changed && !removed}>
              <Icon name="activity" size={16} />Přepočítat
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={onToggleRemove}>
              {removed ? 'Vrátit zprávu' : 'Smazat zprávu'}
            </button>
            {edited && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={onRevert}>Původní text</button>
            )}
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>Zavřít</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
