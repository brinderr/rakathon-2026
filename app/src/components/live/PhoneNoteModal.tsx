// "Zapsat telefonát": the coordinator writes down what she learned by phone. The note becomes a source of its own
// (marked as the coordinator's input, not a report of a workplace) and the extractor reads it like any other text.
import { useEffect, useState } from 'react';
import { Icon } from '../ui';

export function PhoneNoteModal({ suggestion, onSave, onClose }: {
  suggestion: string;
  onSave: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(suggestion);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="lv-modal" role="dialog" aria-modal="true" aria-labelledby="lv-phone-title">
      <button type="button" className="lv-viewer__backdrop" aria-label="Zavřít" onClick={onClose} />
      <div className="lv-modal__box">
        <div className="lv-modal__head">
          <h3 id="lv-phone-title"><Icon name="phone" size={18} />Zapsat telefonát</h3>
          <button type="button" className="lv-icon-btn" onClick={onClose} aria-label="Zavřít"><Icon name="x" size={18} /></button>
        </div>
        <p className="lv-muted">
          Zápis píše koordinátorka sama – není to zpráva z pracoviště. V podkladu se u údaje objeví zdroj
          „telefonát · zapsala koordinátorka“. {suggestion && 'V ukázce je text předvyplněný, můžete ho přepsat.'}
        </p>
        <label className="lv-edit__label" htmlFor="lv-phone-text">Co zaznělo v telefonátu (s kým, kdy, jaký údaj)</label>
        <textarea id="lv-phone-text" className="lv-edit__area" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="lv-edit__actions">
          <button type="button" className="btn btn--sm lv-btn-accent" disabled={!text.trim()} onClick={() => onSave(text.trim())}>
            <Icon name="check" size={16} />Uložit a přepočítat
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>Zrušit</button>
        </div>
      </div>
    </div>
  );
}
