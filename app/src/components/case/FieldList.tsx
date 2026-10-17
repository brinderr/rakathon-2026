import { useState } from 'react';
import type { EffField, EffStatus } from './caseUtils';
import { fieldOrigin, fmtShort } from './caseUtils';
import { Btn, SourceChip, StatusPill } from './ui';
import { IcAlert, IcCheck, IcChevron, IcClock, IcSend } from './icons';

/** A conflict about the identity of the report (birth number): its values must not be used until checked (QA R5 #2). */
export const isIdentityConflict = (f: EffField) =>
  f.status === 'conflict' && !!f.field.conflict && /rodn[ée]\s*č|\bRČ\b/i.test(`${f.field.conflict.a.value} ${f.field.conflict.b.value}`);

export function FieldRow({ f, active, flash, onOpen, onRequest, onConfirm, onOpenDoc }:
  { f: EffField; active?: boolean; flash?: boolean; onOpen: () => void; onRequest: () => void; onConfirm?: () => void;
    onOpenDoc: (docId: string, quote?: string) => void }) {
  const isFuture = f.status === 'future';
  const origin = fieldOrigin(f.field);
  const pendClar = f.status === 'conflict' && f.override?.kind === 'pending';
  const identity = isIdentityConflict(f);
  return (
    <div className={`cs-row cs-row-${f.status} ${active ? 'is-active' : ''} ${flash ? 'is-flash' : ''}`} id={`field-${f.field.key}`}
      role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
      <div className="cs-row-idx">{f.index}</div>
      <div className="cs-row-main">
        <div className="cs-row-label">
          {f.field.label}
          {origin === 'ai' && <span className="cs-origin" title="Text navrhol jazykový model, citáty overil program">AI</span>}
        </div>
        {f.status === 'conflict' && f.field.conflict ? (
          <>
          {f.value && <div className={`cs-row-value ${identity ? 'is-void' : ''}`}>{f.value}</div>}
          {identity && <div className="cs-row-void"><IcAlert size={13} /> Nepoužívať, kým sa neoverí, či správa patrí tomuto pacientovi.</div>}
          <div className="cs-row-ab">
            <span className="cs-ab"><em>A</em> {f.field.conflict.a.value} <SourceChip docId={f.field.conflict.a.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.a.citation.docId, f.field.conflict!.a.citation.quote)} /></span>
            <span className="cs-ab"><em>B</em> {f.field.conflict.b.value} <SourceChip docId={f.field.conflict.b.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.b.citation.docId, f.field.conflict!.b.citation.quote)} /></span>
            {pendClar && <span className="cs-row-pend"><IcClock size={13} /> upresnenie vyžiadané · čaká na odpoveď</span>}
          </div>
          </>
        ) : f.status === 'missing' ? (
          <div className="cs-row-value is-muted">Chýba v dostupných správach{f.field.request ? ` · vyžiadať od: ${f.field.request.to}` : ''}</div>
        ) : f.status === 'pending' ? (
          <div className="cs-row-value is-muted"><IcClock size={14} /> Žiadosť odoslaná{f.override?.kind === 'pending' ? ` · ${f.override.to} · ${f.override.channel}` : ''}</div>
        ) : isFuture ? (
          <div className="cs-row-value is-muted">K zvolenému dátumu ešte nebolo známe{f.sourceDate ? ` (zdroj z ${fmtShort(f.sourceDate)})` : ''}</div>
        ) : (
          <div className={`cs-row-value ${f.value.length > 300 ? 'is-long' : ''}`} title={f.value.length > 300 ? 'Celý text v paneli (klik na riadok)' : undefined}>{f.value || <span className="is-muted">bez hodnoty</span>}</div>
        )}
        {f.status === 'conflict' && f.field.conflict ? (
          // the row says WHAT the conflict is (the explanation used to be only in the side panel)
          <div className="cs-row-why"><IcAlert size={13} /><span>{f.field.conflict.explain}</span></div>
        ) : (f.note || f.asOfNote) && f.status !== 'future' && (
          <div className="cs-row-note">{f.asOfNote ?? (origin === 'ai' ? `Vysvetlivka AI (píše jazykom správy): ${f.note}` : f.note)}</div>
        )}
      </div>
      <div className="cs-row-side">
        <StatusPill status={f.status} />
        {f.status === 'missing' && (
          <Btn size="sm" variant="secondary" icon={<IcSend size={14} />} onClick={(e) => { e.stopPropagation(); onRequest(); }}>Vyžiadať</Btn>
        )}
        {f.status === 'proposed' && onConfirm && (
          <Btn size="sm" variant="secondary" icon={<IcCheck size={14} />} title="Skontrolované so zdrojom – potvrdzuje človek" onClick={(e) => { e.stopPropagation(); onConfirm(); }}>Potvrdiť</Btn>
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

/* "Čo treba vyriešiť": one verb per group, ordered by the action the coordinator takes. */
const ACTION_ORDER: EffStatus[] = ['missing', 'conflict', 'pending', 'proposed'];
const ACTION_NAME: Partial<Record<EffStatus, string>> = {
  missing: 'Chýba · vyžiadať', conflict: 'Rozpor · overiť', pending: 'Čaká na odpoveď', proposed: 'Návrh · potvrdiť',
};
const COMPACT_GROUPS = new Set(['Pacient', 'Kontakty']);
const isMinor = (f: EffField) => f.status === 'proposed' && COMPACT_GROUPS.has(f.field.group);

export function FieldList({ fields, activeKey, flashKey, onOpen, onRequest, onConfirm, onOpenDoc, only, byAction }:
  { fields: EffField[]; activeKey?: string; flashKey?: string | null; onOpen: (key: string) => void; onRequest: (key: string) => void;
    onConfirm?: (key: string) => void; onOpenDoc: (docId: string, quote?: string) => void; only?: (f: EffField) => boolean; byAction?: boolean }) {
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
      const g = groups.find((x) => x.name === f.field.group);
      if (g) g.items.push(f); else groups.push({ name: f.field.group, items: [f], compact: COMPACT_GROUPS.has(f.field.group) });
    }
  }
  if (!list.length) return null;
  const row = (f: EffField) => (
    <FieldRow key={f.field.key} f={f} active={activeKey === f.field.key} flash={flashKey === f.field.key}
      onOpen={() => onOpen(f.field.key)} onRequest={() => onRequest(f.field.key)} onConfirm={onConfirm ? () => onConfirm(f.field.key) : undefined} onOpenDoc={onOpenDoc} />
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
                + {g.minor.length} {g.minor.length === 1 ? 'drobný návrh' : g.minor.length <= 4 ? 'drobné návrhy' : 'drobných návrhov'} na kontrolu ({g.minor.map((f) => f.field.label).join(', ')})
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
}
