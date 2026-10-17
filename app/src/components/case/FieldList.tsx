import { useState } from 'react';
import type { EffField, EffStatus } from './caseUtils';
import { fieldOrigin, fmtShort, groupLabel, isCallOverride } from './caseUtils';
import { Btn, SourceChip, StatusPill } from './ui';
import { IcAlert, IcCheck, IcChevron, IcClock, IcPhone, IcSend } from './icons';

/** A conflict about the identity of the report (birth number): its values must not be used until checked (QA R5 #2). */
export const isIdentityConflict = (f: EffField) =>
  f.status === 'conflict' && !!f.field.conflict && /rodn[ée]\s*č|\bRČ\b/i.test(`${f.field.conflict.a.value} ${f.field.conflict.b.value}`);

export function FieldRow({ f, active, flash, onOpen, onRequest, onCall, onConfirm, onOpenDoc }:
  { f: EffField; active?: boolean; flash?: boolean; onOpen: () => void; onRequest: () => void; onCall?: () => void; onConfirm?: () => void;
    onOpenDoc: (docId: string, quote?: string) => void }) {
  const isFuture = f.status === 'future';
  const origin = fieldOrigin(f.field);
  const pendClar = f.status === 'conflict' && f.override?.kind === 'pending';
  const identity = isIdentityConflict(f);
  const fromCall = isCallOverride(f.override);
  return (
    <div className={`cs-row cs-row-${f.status} ${active ? 'is-active' : ''} ${flash ? 'is-flash' : ''}`} id={`field-${f.field.key}`}
      role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
      <div className="cs-row-idx">{f.index}</div>
      <div className="cs-row-main">
        <div className="cs-row-label">
          {f.field.label}
          {origin === 'ai' && !fromCall && <span className="cs-origin" title="Text navrhl jazykový model, citáty ověřil program">AI</span>}
        </div>
        {f.status === 'conflict' && f.field.conflict ? (
          <>
          {f.value && <div className={`cs-row-value ${identity ? 'is-void' : ''}`}>{f.value}</div>}
          {identity && <div className="cs-row-void"><IcAlert size={13} /> Nepoužívat, dokud se neověří, že zpráva patří tomuto pacientovi.</div>}
          <div className="cs-row-ab">
            <span className="cs-ab"><em>A</em> {f.field.conflict.a.value} <SourceChip docId={f.field.conflict.a.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.a.citation.docId, f.field.conflict!.a.citation.quote)} /></span>
            <span className="cs-ab"><em>B</em> {f.field.conflict.b.value} <SourceChip docId={f.field.conflict.b.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.b.citation.docId, f.field.conflict!.b.citation.quote)} /></span>
            {pendClar && <span className="cs-row-pend"><IcClock size={13} /> upřesnění vyžádáno · čeká na odpověď</span>}
          </div>
          </>
        ) : f.status === 'missing' ? (
          <div className="cs-row-value is-muted">Chybí v dostupných zprávách{f.field.request ? ` · vyžádat od: ${f.field.request.to}` : ''}</div>
        ) : f.status === 'pending' ? (
          <div className="cs-row-value is-muted"><IcClock size={14} /> Žádost odeslána{f.override?.kind === 'pending' ? ` · ${f.override.to} · ${f.override.channel}` : ''}</div>
        ) : isFuture ? (
          <div className="cs-row-value is-muted">K zvolenému datu ještě nebylo známo{f.sourceDate ? ` (zdroj z ${fmtShort(f.sourceDate)})` : ''}</div>
        ) : (
          <div className={`cs-row-value ${f.value.length > 300 ? 'is-long' : ''}`} title={f.value.length > 300 ? 'Celý text v panelu (klik na řádek)' : undefined}>{f.value || <span className="is-muted">bez hodnoty</span>}</div>
        )}
        {f.status === 'conflict' && f.field.conflict ? (
          // the row says WHAT the conflict is (the explanation used to be only in the side panel)
          <div className="cs-row-why"><IcAlert size={13} /><span>{f.field.conflict.explain}</span></div>
        ) : fromCall ? (
          <div className="cs-row-note cs-row-call"><IcPhone size={12} /> ze záznamu koordinátorky (telefonát), ne z lékařské zprávy · {f.note}</div>
        ) : (f.note || f.asOfNote) && f.status !== 'future' && (
          <div className="cs-row-note">{f.asOfNote ?? (origin === 'ai' ? `Vysvětlivka AI (píše jazykem zprávy): ${f.note}` : f.note)}</div>
        )}
      </div>
      <div className="cs-row-side">
        <StatusPill status={f.status} />
        {f.status === 'missing' && (
          <>
            <Btn size="sm" variant="secondary" icon={<IcSend size={14} />} onClick={(e) => { e.stopPropagation(); onRequest(); }}>Vyžádat</Btn>
            {onCall && <Btn size="sm" variant="secondary" icon={<IcPhone size={14} />} title="Koordinátorka zapíše, co se dozvěděla telefonicky – do podkladu jde jako její záznam" onClick={(e) => { e.stopPropagation(); onCall(); }}>Zapsat telefonát</Btn>}
          </>
        )}
        {f.status === 'pending' && onCall && (
          <Btn size="sm" variant="secondary" icon={<IcPhone size={14} />} title="Odpověď přišla telefonicky? Zapište ji – do podkladu jde jako záznam koordinátorky" onClick={(e) => { e.stopPropagation(); onCall(); }}>Zapsat telefonát</Btn>
        )}
        {f.status === 'proposed' && onConfirm && (
          <Btn size="sm" variant="secondary" icon={<IcCheck size={14} />} title="Zkontrolováno se zdrojem – potvrzuje člověk" onClick={(e) => { e.stopPropagation(); onConfirm(); }}>Potvrdit</Btn>
        )}
        {f.status !== 'conflict' && f.citations.length > 0 && (
          <span className="cs-row-srcs">
            {f.citations.filter((c, i, all) => all.findIndex((x) => x.docId === c.docId) === i)
              .map((c) => <SourceChip key={c.docId} docId={c.docId} onClick={() => onOpenDoc(c.docId, c.quote)} />)}
          </span>
        )}
        <span className="cs-row-chev"><IcChevron size={16} /></span>
      </div>
    </div>
  );
}

/* "Co je třeba vyřešit": one verb per group, ordered by the action the coordinator takes. */
const ACTION_ORDER: EffStatus[] = ['missing', 'conflict', 'pending', 'proposed'];
const ACTION_NAME: Partial<Record<EffStatus, string>> = {
  missing: 'Chybí · vyžádat nebo zapsat telefonát', conflict: 'Rozpor · ověřit', pending: 'Čeká na odpověď', proposed: 'Návrh · potvrdit',
};
const COMPACT_GROUPS = new Set(['Pacient', 'Kontakty']);
const isMinor = (f: EffField) => f.status === 'proposed' && COMPACT_GROUPS.has(f.field.group);

export function FieldList({ fields, activeKey, flashKey, onOpen, onRequest, onCall, onConfirm, onOpenDoc, only, byAction }:
  { fields: EffField[]; activeKey?: string; flashKey?: string | null; onOpen: (key: string) => void; onRequest: (key: string) => void;
    onCall?: (key: string) => void; onConfirm?: (key: string) => void; onOpenDoc: (docId: string, quote?: string) => void; only?: (f: EffField) => boolean; byAction?: boolean }) {
  const [showMinor, setShowMinor] = useState(false);
  const list = only ? fields.filter(only) : fields;
  const groups: { name: string; items: EffField[]; compact?: boolean; minor?: EffField[] }[] = [];
  if (byAction) {
    for (const st of ACTION_ORDER) {
      const items = list.filter((f) => f.status === st);
      if (!items.length) continue;
      const minor = st === 'proposed' ? items.filter(isMinor) : [];
      const major = minor.length ? items.filter((f) => !isMinor(f)) : items;
      groups.push({ name: ACTION_NAME[st] ?? st, items: major, minor });
    }
  } else {
    for (const f of list) {
      const name = groupLabel(f.field.group);
      const g = groups.find((x) => x.name === name);
      if (g) g.items.push(f); else groups.push({ name, items: [f], compact: COMPACT_GROUPS.has(f.field.group) });
    }
  }
  if (!list.length) return null;
  const row = (f: EffField) => (
    <FieldRow key={f.field.key} f={f} active={activeKey === f.field.key} flash={flashKey === f.field.key}
      onOpen={() => onOpen(f.field.key)} onRequest={() => onRequest(f.field.key)} onCall={onCall ? () => onCall(f.field.key) : undefined}
      onConfirm={onConfirm ? () => onConfirm(f.field.key) : undefined} onOpenDoc={onOpenDoc} />
  );
  return (
    <div className="cs-fields">
      {groups.map((g) => (
        <div key={g.name} className={`cs-group ${g.compact ? 'cs-group-compact' : ''}`}>
          <div className="cs-group-name">{g.name}</div>
          <div className="cs-group-rows">{g.items.map(row)}</div>
          {g.minor && g.minor.length > 0 && (
            showMinor ? <div className="cs-group-rows">{g.minor.map(row)}</div> : (
              <button type="button" className="cs-more" onClick={() => setShowMinor(true)}>
                + {g.minor.length} {g.minor.length === 1 ? 'drobný návrh' : g.minor.length <= 4 ? 'drobné návrhy' : 'drobných návrhů'} ke kontrole ({g.minor.map((f) => f.field.label).join(', ')})
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
}
