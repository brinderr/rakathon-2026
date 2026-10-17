import { useEffect, useRef, useState } from 'react';
import type { Citation, SourceDoc } from '../../types';
import type { EffField } from './caseUtils';
import { SK_KIND, docLabel, fieldOrigin, fmtDate, groupLabel, isCallDoc, isCallOverride, splitHighlight } from './caseUtils';
import { Btn, StatusPill } from './ui';
import { IcAlert, IcCheck, IcClock, IcClose, IcPhone, IcSend } from './icons';

export type PanelState =
  | { kind: 'doc'; docId: string; quote?: string; soft?: boolean } // soft: highlight if found, no "not found" banner
  | { kind: 'field'; key: string; cite?: number };

/* ---- the report text with the cited sentence highlighted ---- */
export function DocText({ doc, quote, compact }: { doc?: SourceDoc; quote?: string; compact?: boolean }) {
  const markRef = useRef<HTMLElement>(null);
  const text = doc?.text ?? '';
  const parts = quote ? splitHighlight(text, quote) : null;
  useEffect(() => {
    // scroll only the panel's own scroll container, never the page behind it
    const t = window.setTimeout(() => {
      const el = markRef.current;
      const sc = el?.closest<HTMLElement>('.cs-doctext.is-compact, .cs-panel-body');
      if (!el || !sc) return;
      const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top - sc.clientHeight / 2 + el.offsetHeight / 2;
      sc.scrollBy({ top: delta, behavior: 'smooth' });
    }, 60);
    return () => window.clearTimeout(t);
  }, [doc?.id, quote]);
  if (!doc) return <div className="cs-empty">Zpráva se nenašla.</div>;
  if (!text) return <div className="cs-empty">Text zprávy se načítá…</div>;
  return (
    <div className={`cs-doctext ${compact ? 'is-compact' : ''}`}>
      {parts ? (<>{parts.before}<mark ref={markRef} className="cs-mark">{parts.match}</mark>{parts.after}</>) : text}
    </div>
  );
}

function DocHead({ doc, docId }: { doc?: SourceDoc; docId: string }) {
  if (isCallDoc(docId)) {
    return (
      <div className="cs-panel-doc">
        <div className="cs-panel-kicker"><IcPhone size={13} /> Záznam koordinátorky · telefonát · není to lékařská zpráva</div>
        <div className="cs-panel-title">{doc?.title ?? 'Záznam telefonátu'}</div>
        {doc && (
          <div className="cs-panel-meta">
            <span>zapsala koordinátorka</span>
            <span className="cs-dot" />
            <span>telefonát {fmtDate(doc.examDate)}</span>
            {doc.place && <><span className="cs-dot" /><span>{doc.place}</span></>}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="cs-panel-doc">
      <div className="cs-panel-kicker">Originál · {docLabel(docId)}{doc ? ` · ${SK_KIND[doc.kind]}` : ''}</div>
      <div className="cs-panel-title">{doc?.title ?? `Zpráva ${docId}`}</div>
      {doc && (
        <div className="cs-panel-meta">
          <span>{doc.place}</span>
          <span className="cs-dot" />
          <span>vyšetření {fmtDate(doc.examDate)}</span>
          <span className="cs-dot" />
          <span>přijato {fmtDate(doc.receivedAt)} · {doc.channel}</span>
        </div>
      )}
    </div>
  );
}

function Verified({ doc, quote, soft }: { doc?: SourceDoc; quote?: string; soft?: boolean }) {
  if (!quote) return null;
  if (doc && isCallDoc(doc.id)) {
    return (
      <div className="cs-verified is-note">
        <IcPhone size={14} />
        <span>Zdrojem není lékařská zpráva, ale poznámka koordinátorky z telefonátu. V podkladu je údaj označen jako její záznam, ne jako údaj ze zprávy.</span>
      </div>
    );
  }
  const ok = !!doc?.text && !!splitHighlight(doc.text, quote);
  if (soft && !ok) return null;
  return (
    <div className={`cs-verified ${ok ? 'is-ok' : 'is-bad'}`}>
      {ok ? <IcCheck size={14} /> : <IcAlert size={14} />}
      {ok ? 'Citát ověřen: věta se doslova nachází v textu zprávy.' : 'Citát se v textu zprávy nenašel. Údaj neukazujeme jako fakt.'}
    </div>
  );
}

function CiteCard({ tag, value, c, doc }: { tag: string; value: string; c: Citation; doc?: SourceDoc }) {
  return (
    <div className="cs-cite-card">
      <div className="cs-cite-head">
        <span className="cs-cite-tag">{tag}</span>
        <div>
          <div className="cs-cite-value">{value}</div>
          <div className="cs-cite-src">{docLabel(c.docId)}{doc ? ` · ${doc.title} · ${fmtDate(doc.examDate)}` : ''}</div>
        </div>
      </div>
      <DocText doc={doc} quote={c.quote} compact />
      <Verified doc={doc} quote={c.quote} />
    </div>
  );
}

/** The coordinator records who confirmed which version (phone, in person). The field's value never changes. */
function VerifyForm({ onSave }: { onSave: (which: 'a' | 'b', by: string) => void }) {
  const [which, setWhich] = useState<'a' | 'b' | null>(null);
  const [by, setBy] = useState('');
  const ok = !!which && by.trim().length > 1;
  return (
    <div className="cs-verify">
      <div className="cs-verify-title">Ověřeno mimo systém (telefonicky, osobně)</div>
      <div className="cs-verify-row">
        <span className="cs-verify-l">Platí</span>
        <button type="button" className={`cs-chip ${which === 'a' ? 'is-on' : ''}`} onClick={() => setWhich('a')}>A</button>
        <button type="button" className={`cs-chip ${which === 'b' ? 'is-on' : ''}`} onClick={() => setWhich('b')}>B</button>
        <input className="cs-input" value={by} onChange={(e) => setBy(e.target.value)} placeholder="Kdo to potvrdil (pracoviště, lékař)" aria-label="Kdo to potvrdil" />
        <Btn size="sm" variant="secondary" icon={<IcCheck size={14} />} disabled={!ok} onClick={() => ok && onSave(which!, by.trim())}>Zapsat ověření</Btn>
      </div>
      <div className="cs-hint">Rozhoduje lékař nebo pracoviště, které zprávu vydalo. Hodnota pole se nemění, zapíše se jen kdo a co potvrdil.</div>
    </div>
  );
}

const ORIGIN_LABEL = { manual: 'tým ručně', rules: 'pravidla (program)', ai: 'jazykový model (AI)' } as const;

export function OriginalPanel({ panel, field, docsById, onClose, onDecide, onRequest, onCall, onConfirm, onCite }:
  { panel: PanelState; field?: EffField; docsById: Record<string, SourceDoc>; onClose: () => void;
    onDecide: (key: string, which: 'a' | 'b', by: string) => void; onRequest: (key: string) => void; onCall: (key: string) => void;
    onConfirm: (key: string) => void; onCite: (i: number) => void }) {
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
    const origin = fieldOrigin(f.field);
    const fromCall = isCallOverride(f.override);
    const note = f.asOfNote ?? f.note;
    const fieldHead = (
      <div className="cs-panel-field">
        <div className="cs-panel-kicker">Pole {f.index} z 20 · {groupLabel(f.field.group)}</div>
        <div className="cs-panel-title">{f.field.label}</div>
        <div className="cs-panel-status"><StatusPill status={f.status} />{f.value && f.status !== 'conflict' && <span className="cs-panel-value">{f.value}</span>}</div>
        {fromCall
          ? <div className="cs-panel-note cs-row-call"><IcPhone size={13} /> {note} · ze záznamu koordinátorky, ne z lékařské zprávy</div>
          : note && <div className="cs-panel-note">{origin === 'ai' && !f.asOfNote ? `Vysvětlivka AI: ${note}` : note}</div>}
        {origin && f.override?.kind !== 'resolved' && <div className="cs-origin-line">Text pole připravil: {ORIGIN_LABEL[origin]} · citáty ověřil program</div>}
      </div>
    );
    if (f.status === 'conflict' && f.field.conflict) {
      const { a, b, explain } = f.field.conflict;
      const pend = f.override?.kind === 'pending' ? f.override : undefined;
      const place = docsById[a.citation.docId]?.place || docsById[b.citation.docId]?.place;
      heading = fieldHead;
      body = (
        <>
          <div className="cs-conflict-explain"><IcAlert size={16} /> {explain}</div>
          {pend && (
            <div className="cs-pending-box">
              <IcClock size={18} />
              <div>
                <strong>Žádost o upřesnění odeslána · {pend.channel}</strong>
                <div className="cs-hint">{pend.to} · {fmtDate(pend.sentAt)} · čeká na odpověď</div>
              </div>
            </div>
          )}
          <div className="cs-conflict-grid">
            <CiteCard tag="A" value={a.value} c={a.citation} doc={docsById[a.citation.docId]} />
            <CiteCard tag="B" value={b.value} c={b.citation} doc={docsById[b.citation.docId]} />
          </div>
          <div className="cs-panel-actions">
            {!pend && <Btn variant="primary" icon={<IcSend size={14} />} onClick={() => onRequest(f.field.key)}>Vyžádat upřesnění</Btn>}
            <span className="cs-hint">{place ? `od: ${place} · ` : ''}Aplikace nic nedomýšlí – rozhoduje člověk.</span>
          </div>
          <VerifyForm onSave={(which, by) => onDecide(f.field.key, which, by)} />
        </>
      );
    } else if (f.status === 'missing') {
      heading = fieldHead;
      body = (
        <div className="cs-missing">
          {!note && <p>V dostupných zprávách údaj není. Nic nedomýšlíme – vyžádáme ho, nebo koordinátorka zapíše, co se dozvěděla telefonicky.</p>}
          {f.field.request ? (
            <div className="cs-request-preview">
              <div className="cs-kv"><span>Adresát</span><strong>{f.field.request.to}</strong></div>
              <div className="cs-kv"><span>Kanál</span><strong>{f.field.request.channel}</strong></div>
              <div className="cs-kv"><span>Koncept</span><em>{f.field.request.draft.length > 160 ? f.field.request.draft.slice(0, 160) + '…' : f.field.request.draft}</em></div>
            </div>
          ) : <p className="cs-hint">Žádost připravíme podle adresáta, kterého vyberete.</p>}
          <div className="cs-panel-actions">
            <Btn variant="primary" icon={<IcSend size={14} />} onClick={() => onRequest(f.field.key)}>Vyžádat</Btn>
            <Btn variant="secondary" icon={<IcPhone size={14} />} onClick={() => onCall(f.field.key)}>Zapsat telefonát</Btn>
            <span className="cs-hint">Telefonát jde do podkladu jako záznam koordinátorky, ne jako zpráva.</span>
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
              <strong>Žádost odeslána{ov ? ` · ${ov.channel}` : ''}</strong>
              <div className="cs-hint">{ov ? `${ov.to} · ${fmtDate(ov.sentAt)}` : ''} · čeká na odpověď</div>
            </div>
          </div>
          <p className="cs-hint">Odpověď přijde tím samým kanálem a přiřadí se k případu. Pokud se údaj dozvíte telefonicky, zapište ho – do podkladu půjde jako záznam koordinátorky.</p>
          <div className="cs-panel-actions">
            <Btn variant="primary" icon={<IcPhone size={14} />} onClick={() => onCall(f.field.key)}>Zapsat telefonát</Btn>
          </div>
        </div>
      );
    } else {
      const i = Math.min(panel.cite ?? 0, Math.max(0, f.citations.length - 1));
      const c = f.citations[i];
      const doc = c ? docsById[c.docId] : undefined;
      const canConfirm = f.status === 'proposed';
      // "Vyžádat dodatek" only for fields that have a value and a prepared request (e.g. a pending histology addendum),
      // never for a field that was itself just answered by a request or a phone call
      const canAddendum = !!f.field.request && f.field.status !== 'missing' && f.override?.kind !== 'resolved' && (f.status === 'proposed' || f.status === 'confirmed');
      heading = (
        <>
          {fieldHead}
          {f.citations.length > 1 && (
            <div className="cs-cite-tabs">
              {f.citations.map((cc, j) => <button type="button" key={j} className={`cs-chip ${j === i ? 'is-on' : ''}`} onClick={() => onCite(j)}>{docLabel(cc.docId)}</button>)}
            </div>
          )}
          {c && <DocHead doc={doc} docId={c.docId} />}
        </>
      );
      body = (
        <>
          {c ? (<><DocText doc={doc} quote={c.quote} /><Verified doc={doc} quote={c.quote} /></>)
            : <div className="cs-empty">{f.status === 'future' ? 'K zvolenému datu ještě nebyl k dispozici žádný zdroj.' : 'Pole nemá zdroj.'}</div>}
          {(canConfirm || canAddendum) && (
            <div className="cs-panel-actions">
              {canConfirm && <Btn variant="primary" icon={<IcCheck size={14} />} onClick={() => onConfirm(f.field.key)}>Zkontrolováno se zdrojem – potvrdit</Btn>}
              {canAddendum && <Btn variant="secondary" icon={<IcSend size={14} />} onClick={() => onRequest(f.field.key)}>Vyžádat dodatek</Btn>}
              {canConfirm && <span className="cs-hint">Potvrzuje člověk, ne AI.</span>}
            </div>
          )}
        </>
      );
    }
  }

  return (
    <>
      {wide && <div className="cs-panel-scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`cs-panel ${wide ? 'is-wide' : ''}`} role="dialog" aria-label="Originál zprávy">
        <button type="button" className="cs-panel-close" onClick={onClose} aria-label="Zavřít"><IcClose size={18} /></button>
        <div className="cs-panel-head">{heading}</div>
        <div className="cs-panel-body">{body}</div>
      </aside>
    </>
  );
}
