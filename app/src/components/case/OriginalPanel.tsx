import { useEffect, useRef } from 'react';
import type { Citation, SourceDoc } from '../../types';
import type { EffField } from './caseUtils';
import { SK_KIND, fmtDate, splitHighlight } from './caseUtils';
import { Btn, StatusPill } from './ui';
import { IcAlert, IcCheck, IcClock, IcClose, IcPlay, IcSend } from './icons';

export type PanelState =
  | { kind: 'doc'; docId: string; quote?: string; soft?: boolean } // soft: highlight if found, no "not found" banner
  | { kind: 'field'; key: string; cite?: number };

/* ---- the report text with the cited sentence highlighted ---- */
export function DocText({ doc, quote, compact }: { doc?: SourceDoc; quote?: string; compact?: boolean }) {
  const markRef = useRef<HTMLElement>(null);
  const text = doc?.text ?? '';
  const parts = quote ? splitHighlight(text, quote) : null;
  useEffect(() => {
    const t = window.setTimeout(() => markRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
    return () => window.clearTimeout(t);
  }, [doc?.id, quote]);
  if (!doc) return <div className="cs-empty">Správa sa nenašla.</div>;
  if (!text) return <div className="cs-empty">Text správy sa načítava…</div>;
  return (
    <div className={`cs-doctext ${compact ? 'is-compact' : ''}`}>
      {parts ? (<>{parts.before}<mark ref={markRef} className="cs-mark">{parts.match}</mark>{parts.after}</>) : text}
    </div>
  );
}

function DocHead({ doc, docId }: { doc?: SourceDoc; docId: string }) {
  return (
    <div className="cs-panel-doc">
      <div className="cs-panel-kicker">Originál · správa {docId}{doc ? ` · ${SK_KIND[doc.kind]}` : ''}</div>
      <div className="cs-panel-title">{doc?.title ?? `Správa ${docId}`}</div>
      {doc && (
        <div className="cs-panel-meta">
          <span>{doc.place}</span>
          <span className="cs-dot" />
          <span>vyšetrenie {fmtDate(doc.examDate)}</span>
          <span className="cs-dot" />
          <span>prijaté {fmtDate(doc.receivedAt)} · {doc.channel}</span>
        </div>
      )}
    </div>
  );
}

function Verified({ doc, quote, soft }: { doc?: SourceDoc; quote?: string; soft?: boolean }) {
  if (!quote) return null;
  const ok = !!doc?.text && !!splitHighlight(doc.text, quote);
  if (soft && !ok) return null;
  return (
    <div className={`cs-verified ${ok ? 'is-ok' : 'is-bad'}`}>
      {ok ? <IcCheck size={14} /> : <IcAlert size={14} />}
      {ok ? 'Citát overený: veta sa doslova nachádza v texte správy.' : 'Citát sa v texte správy nenašiel. Údaj neukazujeme ako fakt.'}
    </div>
  );
}

function CiteCard({ tag, value, c, doc, onPick, pickLabel }:
  { tag: string; value: string; c: Citation; doc?: SourceDoc; onPick: () => void; pickLabel: string }) {
  return (
    <div className="cs-cite-card">
      <div className="cs-cite-head">
        <span className="cs-cite-tag">{tag}</span>
        <div>
          <div className="cs-cite-value">{value}</div>
          <div className="cs-cite-src">správa {c.docId}{doc ? ` · ${doc.title} · ${fmtDate(doc.examDate)}` : ''}</div>
        </div>
      </div>
      <DocText doc={doc} quote={c.quote} compact />
      <Verified doc={doc} quote={c.quote} />
      <Btn variant="secondary" icon={<IcCheck size={14} />} onClick={onPick}>{pickLabel}</Btn>
    </div>
  );
}

export function OriginalPanel({ panel, field, docsById, onClose, onDecide, onRequest, onSimulate, onCite }:
  { panel: PanelState; field?: EffField; docsById: Record<string, SourceDoc>; onClose: () => void;
    onDecide: (key: string, which: 'a' | 'b') => void; onRequest: (key: string) => void; onSimulate: (key: string) => void;
    onCite: (i: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const wide = panel.kind === 'field' && field?.status === 'conflict' && !!field.field.conflict;

  let body: React.ReactNode = null;
  let heading: React.ReactNode = null;

  if (panel.kind === 'doc') {
    const doc = docsById[panel.docId];
    heading = <DocHead doc={doc} docId={panel.docId} />;
    body = (<><DocText doc={doc} quote={panel.quote} /><Verified doc={doc} quote={panel.quote} soft={panel.soft} /></>);
  } else if (field) {
    const f = field;
    const fieldHead = (
      <div className="cs-panel-field">
        <div className="cs-panel-kicker">Pole {f.index} z 20 · {f.field.group}</div>
        <div className="cs-panel-title">{f.field.label}</div>
        <div className="cs-panel-status"><StatusPill status={f.status} />{f.value && f.status !== 'conflict' && <span className="cs-panel-value">{f.value}</span>}</div>
        {(f.asOfNote || f.note) && <div className="cs-panel-note">{f.asOfNote ?? f.note}</div>}
      </div>
    );
    if (f.status === 'conflict' && f.field.conflict) {
      const { a, b, explain } = f.field.conflict;
      heading = fieldHead;
      body = (
        <>
          <div className="cs-conflict-explain"><IcAlert size={16} /> {explain}</div>
          <div className="cs-conflict-grid">
            <CiteCard tag="A" value={a.value} c={a.citation} doc={docsById[a.citation.docId]} onPick={() => onDecide(f.field.key, 'a')} pickLabel="Platí A" />
            <CiteCard tag="B" value={b.value} c={b.citation} doc={docsById[b.citation.docId]} onPick={() => onDecide(f.field.key, 'b')} pickLabel="Platí B" />
          </div>
          <div className="cs-panel-actions">
            <Btn variant="secondary" icon={<IcSend size={14} />} onClick={() => onRequest(f.field.key)}>Vyžiadať upresnenie</Btn>
            <span className="cs-hint">Rozhoduje človek. Aplikácia nič nedomýšľa.</span>
          </div>
        </>
      );
    } else if (f.status === 'missing') {
      heading = fieldHead;
      body = (
        <div className="cs-missing">
          <p>V dostupných správach údaj nie je. Nič nedomýšľame – vyžiadame ho.</p>
          {f.field.request ? (
            <div className="cs-request-preview">
              <div className="cs-kv"><span>Adresát</span><strong>{f.field.request.to}</strong></div>
              <div className="cs-kv"><span>Kanál</span><strong>{f.field.request.channel}</strong></div>
              <div className="cs-kv"><span>Koncept</span><em>{f.field.request.draft.length > 160 ? f.field.request.draft.slice(0, 160) + '…' : f.field.request.draft}</em></div>
            </div>
          ) : <p className="cs-hint">Žiadosť pripravíme podľa adresáta, ktorého vyberiete.</p>}
          <div className="cs-panel-actions">
            <Btn variant="primary" icon={<IcSend size={14} />} onClick={() => onRequest(f.field.key)}>Vyžiadať</Btn>
          </div>
        </div>
      );
    } else if (f.status === 'pending') {
      const ov = f.override?.kind === 'pending' ? f.override : undefined;
      heading = fieldHead;
      body = (
        <div className="cs-missing">
          <div className="cs-pending-box">
            <IcClock size={18} />
            <div>
              <strong>Žiadosť odoslaná{ov ? ` · ${ov.channel}` : ''}</strong>
              <div className="cs-hint">{ov ? `${ov.to} · ${fmtDate(ov.sentAt)}` : ''} · čaká na odpoveď</div>
            </div>
          </div>
          {f.field.resolvedBy ? (
            <div className="cs-panel-actions">
              <Btn variant="primary" icon={<IcPlay size={14} />} onClick={() => onSimulate(f.field.key)}>Simulovať odpoveď</Btn>
              <span className="cs-hint">demo: príde správa {f.field.resolvedBy.docId} a pole sa doplní</span>
            </div>
          ) : <p className="cs-hint">Odpoveď príde tým istým kanálom a priradí sa k prípadu.</p>}
        </div>
      );
    } else {
      const i = Math.min(panel.cite ?? 0, Math.max(0, f.citations.length - 1));
      const c = f.citations[i];
      const doc = c ? docsById[c.docId] : undefined;
      heading = (
        <>
          {fieldHead}
          {f.citations.length > 1 && (
            <div className="cs-cite-tabs">
              {f.citations.map((cc, j) => <button type="button" key={j} className={`cs-chip ${j === i ? 'is-on' : ''}`} onClick={() => onCite(j)}>správa {cc.docId}</button>)}
            </div>
          )}
          {c && <DocHead doc={doc} docId={c.docId} />}
        </>
      );
      body = c ? (<><DocText doc={doc} quote={c.quote} /><Verified doc={doc} quote={c.quote} /></>)
        : <div className="cs-empty">{f.status === 'future' ? 'K zvolenému dátumu ešte nebol k dispozícii žiadny zdroj.' : 'Pole nemá zdroj.'}</div>;
    }
  }

  return (
    <>
      {wide && <div className="cs-panel-scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`cs-panel ${wide ? 'is-wide' : ''}`} role="dialog" aria-label="Originál správy">
        <button type="button" className="cs-panel-close" onClick={onClose} aria-label="Zavrieť"><IcClose size={18} /></button>
        <div className="cs-panel-head">{heading}</div>
        <div className="cs-panel-body">{body}</div>
      </aside>
    </>
  );
}
