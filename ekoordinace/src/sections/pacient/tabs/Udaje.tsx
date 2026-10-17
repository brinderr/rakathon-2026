// Tab "Údaje pro konzilium" (owner: Matej) – the handover: the 20 items of the VZP template Handover_obsah, grouped like
// the template. Every value shows where it comes from (a click opens the report with the sentence highlighted), its
// state (nalezeno / neúplné / chybí / rozpor) and can be copied – "výstup v kopírovatelných částech" (slide 8).
import { useState } from 'react';
import { copyText } from '../../../ui/clipboard';
import { Icon } from '../../../ui/Icon';
import { nb } from '../../../ui/format';
import { caseData } from '../caseData';
import type { OpenDoc } from '../Journey';
import type { Quote } from '../types';
import '../udaje.css';

interface Field { key: string; label: string; group: string; value: string; status: string; issue: string; quotes: Quote[] }

const fields = caseData.fields as Field[];
const groups = [...new Set(fields.map((f) => f.group))];
const STATUS: Record<string, { label: string; cls: string }> = {
  nalezeno: { label: 'Nalezeno', cls: 'ok' },
  'neúplné': { label: 'Neúplné', cls: 'miss' },
  'chybí': { label: 'Chybí', cls: 'miss' },
  rozpor: { label: 'Rozpor', cls: 'conf' },
};

function CopyButton({ text, label, caption = 'Kopírovat' }: { text: string; label: string; caption?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button" className={`copy-btn${done ? ' done' : ''}`} aria-label={`Kopírovat: ${label}`}
      onClick={async () => { if (await copyText(text)) { setDone(true); window.setTimeout(() => setDone(false), 1500); } }}
    >
      <Icon name={done ? 'check' : 'copy'} size={15} />{done ? 'Zkopírováno' : caption}
    </button>
  );
}

function Row({ f, openDoc }: { f: Field; openDoc: OpenDoc }) {
  const [full, setFull] = useState(false);
  const long = f.value.length > 220 || f.value.split('\n').length > 3;
  const st = STATUS[f.status] ?? STATUS.nalezeno;
  const sources = [...new Map(f.quotes.map((q) => [q.docId, q.ref ?? q.docId])).entries()];
  return (
    <li className={`field ${st.cls}`}>
      <div className="field-label">
        <b>{f.label}</b>
        <span className={`chip ${st.cls}`}>{st.label}</span>
      </div>
      <div className="field-body">
        {f.value
          ? <p className={`field-value${long && !full ? ' clamp' : ''}`}>{nb(f.value)}</p>
          : <p className="field-value empty">V dokumentaci není.</p>}
        {long && <button type="button" className="link" onClick={() => setFull(!full)}>{full ? 'Zobrazit méně' : 'Zobrazit celé'}<Icon name={full ? 'up' : 'down'} size={14} /></button>}
        {f.issue && <p className={`field-issue ${st.cls}`}>{nb(f.issue)}</p>}
        {sources.length > 0 && (
          <p className="field-src">
            Zdroj:{' '}
            {sources.map(([docId, ref], i) => (
              <span key={docId}>
                {i > 0 && ' · '}
                <button type="button" className="src-link" onClick={() => openDoc(docId, f.quotes.filter((q) => q.docId === docId).map((q) => q.quote))}>{nb(ref)}</button>
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="field-actions">{f.value && <CopyButton text={f.value} label={f.label} />}</div>
    </li>
  );
}

// what the coordinator wants to see first: what is done, what is missing, what does not add up
const KINDS = [
  { id: 'vse', label: 'Vše', match: () => true },
  { id: 'ok', label: 'Hotovo', match: (f: Field) => f.status === 'nalezeno' },
  { id: 'miss', label: 'Chybí', match: (f: Field) => f.status === 'chybí' || f.status === 'neúplné' },
  { id: 'conf', label: 'Rozpor', match: (f: Field) => f.status === 'rozpor' },
] as const;

export function Udaje({ openDoc }: { openDoc: OpenDoc }) {
  const [show, setShow] = useState<(typeof KINDS)[number]['id']>('vse');
  const n = Object.fromEntries(KINDS.map((k) => [k.id, fields.filter(k.match).length])) as Record<string, number>;
  const kind = KINDS.find((k) => k.id === show) ?? KINDS[0];
  const visible = fields.filter(kind.match);
  const all = fields.map((f) => `${f.label}: ${f.value || '– chybí –'}`).join('\n');
  const pct = (x: number) => `${(x / fields.length) * 100}%`;
  return (
    <div className="udaje">
      <section className="card udaje-head">
        <div className="udaje-title">
          <div>
            <h2>Údaje pro konzilium {nb(caseData.mdtDate.split('-').reverse().map(Number).slice(0, 2).join('. '))}.</h2>
            <p className="muted">Co lékaři na konziliu potřebují o pacientce vědět: 20 údajů podle šablony VZP, každý s větou ze zprávy, odkud je.</p>
          </div>
          <CopyButton text={all} label="všechny údaje" caption="Kopírovat vše" />
        </div>
        <div className="udaje-progress" aria-label={`${n.ok} z ${fields.length} údajů hotovo`}>
          <div className="bar">
            <span className="seg ok" style={{ width: pct(n.ok) }} />
            <span className="seg miss" style={{ width: pct(n.miss) }} />
            <span className="seg conf" style={{ width: pct(n.conf) }} />
          </div>
          <p><b>{n.ok} z {fields.length}</b> hotovo{n.miss + n.conf > 0 && <> · před konziliem zbývá vyřešit <b>{n.miss + n.conf}</b></>}</p>
        </div>
        <div className="udaje-filter" role="group" aria-label="Zobrazit">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className={`filter ${k.id}${show === k.id ? ' on' : ''}`} aria-pressed={show === k.id} onClick={() => setShow(k.id)}>
              {k.label} <b>{n[k.id]}</b>
            </button>
          ))}
        </div>
      </section>
      {groups.filter((g) => visible.some((f) => f.group === g)).map((g) => (
        <section className="card field-group" key={g} aria-label={g}>
          <h3>{g}</h3>
          <ol className="fields">{visible.filter((f) => f.group === g).map((f) => <Row f={f} openDoc={openDoc} key={f.key} />)}</ol>
        </section>
      ))}
    </div>
  );
}
