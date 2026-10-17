import { useEffect, useState } from 'react';
import type { SourceDoc } from '../../types';
import { Btn } from './ui';
import { IcClose, IcSend } from './icons';

export interface RequestDraft { to: string; channel: SourceDoc['channel']; draft: string; subject: string }

export function RequestModal({ title, req, onSend, onClose }:
  { title: string; req: RequestDraft; onSend: (r: RequestDraft) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(req.draft);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const send = () => {
    setSending(true);
    window.setTimeout(() => onSend({ ...req, draft }), 450);
  };
  return (
    <div className="cs-modal-back" onClick={onClose}>
      <div className="cs-modal" role="dialog" aria-modal="true" aria-label="Žiadosť o doplnenie" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cs-panel-close" onClick={onClose} aria-label="Zavrieť"><IcClose size={18} /></button>
        <div className="cs-panel-kicker">Žiadosť o doplnenie</div>
        <h3 className="cs-modal-title">{title}</h3>
        <div className="cs-modal-kv">
          <div className="cs-kv"><span>Adresát</span><strong>{req.to}</strong></div>
          <div className="cs-kv"><span>Kanál</span><strong>{req.channel}</strong></div>
          <div className="cs-kv"><span>Predmet</span><strong>{req.subject}</strong></div>
        </div>
        <label className="cs-modal-label" htmlFor="cs-draft">Koncept (môžete upraviť)</label>
        <textarea id="cs-draft" className="cs-textarea" value={draft} onChange={(e) => setDraft(e.target.value)} rows={9} />
        <div className="cs-modal-actions">
          <span className="cs-hint">Odoslanie je simulované. Odpoveď sa priradí k prípadu.</span>
          <div className="cs-modal-btns">
            <Btn variant="ghost" onClick={onClose}>Zrušiť</Btn>
            <Btn variant="primary" icon={<IcSend size={14} />} onClick={send} disabled={sending}>{sending ? 'Odosielam…' : 'Odoslať'}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
