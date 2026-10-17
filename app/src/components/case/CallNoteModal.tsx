// „Zapsat telefonát“: the coordinator writes down what she learned by phone. It is HER record, never a medical
// report – the value goes into the handover with the source „telefonát · zapsala koordinátorka · <date>“ and the
// note as its quote. Every field is editable; the prefilled text (src/data/cases.ts CALL_NOTES) is only a proposal.
import { useEffect, useState } from 'react';
import type { CallNoteDraft } from '../../data/cases';
import { fmtDate } from './caseUtils';
import { Btn } from './ui';
import { IcAlert, IcCheck, IcClose, IcPhone } from './icons';

export function CallNoteModal({ title, draft, onSave, onClose }:
  { title: string; draft: CallNoteDraft; onSave: (d: CallNoteDraft) => void; onClose: () => void }) {
  const [date, setDate] = useState(draft.date);
  const [withWhom, setWith] = useState(draft.with);
  const [note, setNote] = useState(draft.note);
  const [value, setValue] = useState(draft.value);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /** The date in the proposed text follows the date field as long as the text itself was not edited. */
  const changeDate = (d: string) => {
    if (note === draft.note.replace(fmtDate(draft.date), fmtDate(date)) && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      setNote(draft.note.replace(fmtDate(draft.date), fmtDate(d)));
    }
    setDate(d);
  };
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(date) && note.trim().length > 3 && value.trim().length > 0;
  const save = () => {
    if (!ok) return;
    setSaving(true);
    window.setTimeout(() => onSave({ date, with: withWhom.trim(), note: note.trim(), value: value.trim() }), 350);
  };
  return (
    <div className="cs-modal-back" onClick={onClose}>
      <div className="cs-modal" role="dialog" aria-modal="true" aria-label="Zapsat telefonát" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cs-panel-close" onClick={onClose} aria-label="Zavřít"><IcClose size={18} /></button>
        <div className="cs-panel-kicker"><IcPhone size={13} /> Zapsat telefonát · záznam koordinátorky</div>
        <h3 className="cs-modal-title">{title}</h3>
        <div className="cs-call-note">
          <IcAlert size={16} />
          <span>Toto není lékařská zpráva. Do podkladu jde jako <strong>záznam koordinátorky</strong> s datem a tím, s kým mluvila. Text je návrh – přepište ho podle skutečného hovoru.</span>
        </div>
        <div className="cs-call-grid">
          <label className="cs-call-field">
            <span className="cs-modal-label">Datum telefonátu</span>
            <input className="cs-input" type="date" value={date} onChange={(e) => changeDate(e.target.value)} />
          </label>
          <label className="cs-call-field">
            <span className="cs-modal-label">S kým</span>
            <input className="cs-input" value={withWhom} onChange={(e) => setWith(e.target.value)} placeholder="lékař, pracoviště" />
          </label>
        </div>
        <label className="cs-modal-label" htmlFor="cs-call-text">Poznámka z telefonátu (zapisuje koordinátorka)</label>
        <textarea id="cs-call-text" className="cs-textarea" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
        <label className="cs-call-field">
          <span className="cs-modal-label">Hodnota do pole „{title}“</span>
          <input className="cs-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="např. ECOG 1" />
        </label>
        <div className="cs-modal-actions">
          <span className="cs-hint">Uloží se do podkladu se zdrojem „telefonát · zapsala koordinátorka · {/^\d{4}-\d{2}-\d{2}$/.test(date) ? fmtDate(date) : 'datum'}“ a do záznamu o koordinaci jako den se zásahem.</span>
          <div className="cs-modal-btns">
            <Btn variant="ghost" onClick={onClose}>Zrušit</Btn>
            <Btn variant="primary" icon={<IcCheck size={14} />} onClick={save} disabled={!ok || saving}>{saving ? 'Ukládám…' : 'Uložit do podkladu'}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
