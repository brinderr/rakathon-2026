// "Zeptat se AI" (owner: matej): the AI button in the top bar opens a small chat. The coordinator asks anything about
// what the app holds – patients, reports and when they came, open points, MDTs, what was done – and Claude answers
// only from that data, with the source of each fact (api/ask.ts). The data go pseudonymized (./context.ts).
import { useEffect, useRef, useState } from 'react';
import { SIM_TODAY, useStoredPatients } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { useLiveCases } from '../pacient/live';
import { snapshot } from './context';
import './ask.css';

interface Msg { role: 'user' | 'assistant'; content: string; error?: boolean }

const SUGGEST = ['Co mám dnes udělat jako první?', 'Kdy přišla histologie a co v ní je?', 'Komu mám zavolat kvůli chybějícímu ECOG?', 'Které zprávy jsem nahrála a kdy?'];

export function AskAi() {
  const cases = useLiveCases();
  const stored = useStoredPatients();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }); }, [msgs, busy]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || busy) return;
    setQ('');
    const history = msgs.filter((m) => !m.error);
    setMsgs((m) => [...m, { role: 'user', content: text }]);
    setBusy(true);
    const snap = snapshot(cases, stored, SIM_TODAY);
    try {
      const r = await fetch('/api/ask', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: snap.apply(text), context: snap.text, history: history.map((m) => ({ role: m.role, content: snap.apply(m.content) })) }),
      });
      const body = await r.json().catch(() => null) as { answer?: string; error?: string } | null;
      if (!r.ok || !body?.answer) {
        const why = r.status === 404 ? 'AI běží jen na webu ekoordinace.vercel.app.' : body?.error ?? `AI neodpověděla (${r.status}).`;
        setMsgs((m) => [...m, { role: 'assistant', content: why, error: true }]);
      } else {
        setMsgs((m) => [...m, { role: 'assistant', content: snap.restore(body.answer!) }]);
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Spojení s AI se nepodařilo.', error: true }]);
    }
    setBusy(false);
  };

  return (
    <div className="ai-box">
      <button type="button" className={`icon-btn ai-btn${open ? ' on' : ''}`} aria-expanded={open} aria-label="Zeptat se AI" title="Zeptat se AI" onClick={() => setOpen(!open)}>
        <Icon name="sparkle" /><span>AI</span>
      </button>
      {open && (
        <section className="ai-panel" role="dialog" aria-label="Zeptat se AI">
          <header className="ai-head">
            <div><b>Zeptat se AI</b><small>Claude · odpovídá jen z dat v aplikaci a uvádí zdroj</small></div>
            <button type="button" className="ai-close" aria-label="Zavřít" onClick={() => setOpen(false)}><Icon name="close" size={18} /></button>
          </header>
          <div className="ai-msgs" ref={list}>
            {msgs.length === 0 && (
              <div className="ai-suggest">
                {SUGGEST.map((s) => <button key={s} type="button" className="chip-btn" onClick={() => void ask(s)}>{s}</button>)}
              </div>
            )}
            {msgs.map((m, i) => <p key={i} className={`ai-msg ${m.role}${m.error ? ' error' : ''}`}>{m.content}</p>)}
            {busy && <p className="ai-msg assistant busy">Hledám v datech…</p>}
          </div>
          <form className="ai-form" onSubmit={(e) => { e.preventDefault(); void ask(q); }}>
            <textarea ref={input} rows={2} value={q} placeholder="Zeptejte se na pacienta, zprávu, termín…" aria-label="Otázka"
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask(q); } }} />
            <button type="submit" className="btn-primary" disabled={!q.trim() || busy}>Zeptat se</button>
          </form>
        </section>
      )}
    </div>
  );
}
