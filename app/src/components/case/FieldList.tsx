import type { EffField } from './caseUtils';
import { fmtShort } from './caseUtils';
import { Btn, SourceChip, StatusPill } from './ui';
import { IcChevron, IcClock, IcSend } from './icons';

export function FieldRow({ f, active, flash, onOpen, onRequest, onOpenDoc }:
  { f: EffField; active?: boolean; flash?: boolean; onOpen: () => void; onRequest: () => void; onOpenDoc: (docId: string, quote?: string) => void }) {
  const isFuture = f.status === 'future';
  return (
    <div className={`cs-row cs-row-${f.status} ${active ? 'is-active' : ''} ${flash ? 'is-flash' : ''}`} id={`field-${f.field.key}`}
      role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
      <div className="cs-row-idx">{f.index}</div>
      <div className="cs-row-main">
        <div className="cs-row-label">{f.field.label}</div>
        {f.status === 'conflict' && f.field.conflict ? (
          <div className="cs-row-ab">
            <span className="cs-ab"><em>A</em> {f.field.conflict.a.value} <SourceChip docId={f.field.conflict.a.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.a.citation.docId, f.field.conflict!.a.citation.quote)} /></span>
            <span className="cs-ab"><em>B</em> {f.field.conflict.b.value} <SourceChip docId={f.field.conflict.b.citation.docId} onClick={() => onOpenDoc(f.field.conflict!.b.citation.docId, f.field.conflict!.b.citation.quote)} /></span>
          </div>
        ) : f.status === 'missing' ? (
          <div className="cs-row-value is-muted">Chýba v dostupných správach{f.field.request ? ` · vyžiadať od: ${f.field.request.to}` : ''}</div>
        ) : f.status === 'pending' ? (
          <div className="cs-row-value is-muted"><IcClock size={14} /> Žiadosť odoslaná{f.override?.kind === 'pending' ? ` · ${f.override.to} · ${f.override.channel}` : ''}</div>
        ) : isFuture ? (
          <div className="cs-row-value is-muted">K zvolenému dátumu ešte nebolo známe{f.sourceDate ? ` (zdroj z ${fmtShort(f.sourceDate)})` : ''}</div>
        ) : (
          <div className="cs-row-value">{f.value || <span className="is-muted">bez hodnoty</span>}</div>
        )}
        {(f.note || f.asOfNote) && f.status !== 'future' && (
          <div className="cs-row-note">{f.asOfNote ?? f.note}</div>
        )}
      </div>
      <div className="cs-row-side">
        <StatusPill status={f.status} />
        {f.status === 'missing' && (
          <Btn size="sm" variant="secondary" icon={<IcSend size={14} />} onClick={(e) => { e.stopPropagation(); onRequest(); }}>Vyžiadať</Btn>
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

export function FieldList({ fields, activeKey, flashKey, onOpen, onRequest, onOpenDoc, only }:
  { fields: EffField[]; activeKey?: string; flashKey?: string | null; onOpen: (key: string) => void; onRequest: (key: string) => void;
    onOpenDoc: (docId: string, quote?: string) => void; only?: (f: EffField) => boolean }) {
  const list = only ? fields.filter(only) : fields;
  const groups: { name: string; items: EffField[] }[] = [];
  for (const f of list) {
    const g = groups.find((x) => x.name === f.field.group);
    if (g) g.items.push(f); else groups.push({ name: f.field.group, items: [f] });
  }
  if (!list.length) return null;
  return (
    <div className="cs-fields">
      {groups.map((g) => (
        <div key={g.name} className="cs-group">
          <div className="cs-group-name">{g.name}</div>
          {g.items.map((f) => (
            <FieldRow key={f.field.key} f={f} active={activeKey === f.field.key} flash={flashKey === f.field.key}
              onOpen={() => onOpen(f.field.key)} onRequest={() => onRequest(f.field.key)} onOpenDoc={onOpenDoc} />
          ))}
        </div>
      ))}
    </div>
  );
}
