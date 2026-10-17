import { useEffect, useState } from 'react';
import type { SourceDoc } from '../../types';
import { Btn } from './ui';
import { IcClose, IcSend } from './icons';

export interface RequestDraft { to: string; channel: SourceDoc['channel']; draft: string; subject: string }

/** kind 'urge' = chasing a late step; 'forward' = passing a doctors' warning on (same concept window, other wording). */
export function RequestModal({ title, req, kind = 'request', onSend, onClose }:
  { title: string; req: RequestDraft; kind?: 'request' | 'urge' | 'forward'; onSend: (r: RequestDraft) => void; onClose: () => void }) {
  const urge = kind === 'urge';
  const kicker = urge ? 'Urgencia' : kind === 'forward' ? 'Upozornenie ďalej' : 'Žiadosť o doplnenie';
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
      <div className="cs-modal" role="dialog" aria-modal="true" aria-label={kicker} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cs-panel-close" onClick={onClose} aria-label="Zavrieť"><IcClose size={18} /></button>
        <div className="cs-panel-kicker">{kicker}</div>
        <h3 className="cs-modal-title">{title}</h3>
        <div className="cs-modal-kv">
          <div className="cs-kv"><span>Adresát</span><strong>{req.to}</strong></div>
          <div className="cs-kv"><span>Kanál</span><strong>{req.channel}</strong></div>
          <div className="cs-kv"><span>Predmet</span><strong>{req.subject}</strong></div>
        </div>
        <label className="cs-modal-label" htmlFor="cs-draft">Koncept (môžete upraviť)</label>
        <textarea id="cs-draft" className="cs-textarea" value={draft} onChange={(e) => setDraft(e.target.value)} rows={9} />
        <div className="cs-modal-actions">
          <span className="cs-hint">{urge ? 'Odoslanie je simulované. Urgencia sa zapíše do záznamu o koordinovaní ako deň so zásahom.'
            : kind === 'forward' ? 'Odoslanie je simulované. Posielame len to, čo píšu správy lekárov – bez vlastného odporúčania. Zapíše sa do záznamu o koordinovaní.'
              : 'Odoslanie je simulované. Odpoveď sa priradí k prípadu.'}</span>
          <div className="cs-modal-btns">
            <Btn variant="ghost" onClick={onClose}>Zrušiť</Btn>
            <Btn variant="primary" icon={<IcSend size={14} />} onClick={send} disabled={sending}>{sending ? 'Odosielam…' : 'Odoslať'}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
