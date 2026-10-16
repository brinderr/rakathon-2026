// „Podklad pre konzílium“ – printable document strictly along the VZP template MDT_zapis (7 sections).
// Only data known by the MDT date; every value has a footnote (report, date, verbatim quote);
// missing values are shown in red as „nie je v dokumentácii“. Copy per section, print/PDF, confirm (simulated).
import { useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DEMO_TODAY } from '../types';
import { DocHeader } from '../components/docs/DocHeader';
import { useSource } from '../components/docs/useSource';
import { copyText, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { buildMdtModel, documentText, parseMembers, parsePresenter, parseTemplate, sectionText } from '../components/docs/mdtModel';
import type { Section, Val } from '../components/docs/mdtModel';
import { IconCheck, IconClock, IconCopy, IconPrint } from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './MdtDoc.css';

// Used only if public/data/source.json cannot be read (identical to templates.MDT_zapis).
const MDT_ZAPIS_FALLBACK = `Zápis k jednání multidisciplinárního týmu (MDT)
1 Základní údaje
Datum MDT
Pacient:
Jméno a příjmení
Pojišťovna
Telefon, email
Adresa
Váha, výška
Referující lékař:
Jméno a příjmení
Telefon, email
2 Členové MDT
Jméno a příjmení
3 Diagnóza
Název diagnózy
Kód diagnózy (MKN-10)
4 Komorbidity
5 Výsledky stávajících vyšetření
Datum
Vyšetření
Výsledek
6 Závěr MDT
7 Doporučení MDT`;

function ValueView({ v, sep }: { v: Val; sep?: boolean }) {
  return (
    <>
      {sep && <span className="paper-line__sep">·</span>}
      {v.prefix && <span className="doc-muted">{v.prefix} </span>}
      <span className={v.missing ? 'doc-missing' : undefined}>{v.text}</span>
      {v.n && <sup className="doc-sup">{v.n}</sup>}
      {v.note && <span className="doc-faint doc-small"> ({v.note})</span>}
      {v.conflict && (
        <div className="paper-conflict">
          Rozpor v dokumentácii: {v.conflict.a.value} (správa {v.conflict.a.citation.docId}) vs. {v.conflict.b.value} (správa {v.conflict.b.citation.docId}) · {v.conflict.explain}
        </div>
      )}
    </>
  );
}

function SectionView({ s, copied, onCopy }: { s: Section; copied: boolean; onCopy: (s: Section) => void }) {
  return (
    <section className="paper-sec">
      <div className="paper-sec__head">
        <h3 className="paper-sec__title"><span className="paper-sec__no">{s.no}</span>{s.title}</h3>
        <button type="button" className="doc-btn doc-btn--sm no-print" onClick={() => onCopy(s)}>
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />} {copied ? 'Skopírované' : 'Kopírovať'}
        </button>
      </div>
      {s.table && (
        <table className="paper-table">
          <thead><tr>{s.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {s.table.rows.length === 0 && <tr><td colSpan={3} className="doc-missing">nie je v dokumentácii</td></tr>}
            {s.table.rows.map((r, ri) => (
              <tr key={ri}>{r.map((v, ci) => <td key={ci}><ValueView v={v} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
      {s.groups.map((g, gi) => (
        <div key={gi} className={s.table ? 'paper-sec__after-table' : undefined}>
          {g.heading && <div className="paper-sec__group">{g.heading}</div>}
          {g.lines.map(line => (
            <div className="paper-line" key={line.label}>
              <span className="paper-line__label">{line.label}</span>
              <span className="paper-line__val">{line.values.map((v, i) => <ValueView key={i} v={v} sep={i > 0} />)}</span>
            </div>
          ))}
        </div>
      ))}
      {s.list && s.list.length > 0 && (
        <ul className="paper-list">{s.list.map((v, i) => <li key={i}><ValueView v={v} /></li>)}</ul>
      )}
      {s.placeholder && <div className="paper-placeholder">{s.placeholder}</div>}
    </section>
  );
}

export default function MdtDoc() {
  const nav = useNav();
  const caseId = nav.route.page === 'mdt' ? nav.route.caseId : undefined;
  const c = findCase(caseId);
  const src = useSource();
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const tplText = src?.templates?.MDT_zapis ?? MDT_ZAPIS_FALLBACK;
  const zaver = src?.templates?.['MDT zaver'] ?? '';
  const members = useMemo(() => parseMembers(zaver), [zaver]);
  const presenter = useMemo(() => parsePresenter(zaver) ?? 'lekár KOC', [zaver]);
  const texts = useMemo(() => Object.fromEntries((src?.documents ?? []).map(d => [d.id, d.text])), [src]);
  const model = useMemo(() => (c ? buildMdtModel(c, parseTemplate(tplText), members, texts) : null), [c, tplText, members, texts]);

  function flash(key: string) { setCopied(key); window.setTimeout(() => setCopied(k => (k === key ? null : k)), 1600); }
  function copySection(s: Section) { copyText(sectionText(s)).then(() => flash(s.no)).catch(() => flash(s.no)); }
  function copyAll() { if (model) copyText(documentText(model)).then(() => flash('all')).catch(() => flash('all')); }

  if (!c || !model) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Podklad pre konzílium" title="Podklad pre konzílium" back={{ label: 'Späť na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
        <div className="doc-card doc-muted">{c ? 'Načítavam šablónu VZP…' : 'Prípad sa nenašiel.'}</div>
      </div>
    );
  }

  const patient = `${c.patient.firstName} ${c.patient.lastName}`;

  return (
    <div className="doc-page mdt">
      <div className="no-print">
        <DocHeader
          eyebrow="Podklad pre konzílium"
          title={patient}
          subtitle={<>
            <span>{c.koc} · konzílium {fmtDate(model.asOf)}</span>
            <span className="doc-pill doc-pill--sky">údaje známe k {fmtDate(model.asOf)}</span>
            {model.omittedDocs.length > 0 && (
              <span className="doc-pill doc-pill--outline">vynechané správy po tomto dátume: {model.omittedDocs.map(d => d.id).join(', ')}</span>
            )}
          </>}
          back={{ label: 'Späť na prípad', onClick: () => nav.go({ page: 'case', caseId: c.id, tab: 'podklad' }) }}
          actions={<>
            <button type="button" className="doc-btn" onClick={copyAll}>
              {copied === 'all' ? <IconCheck size={15} /> : <IconCopy size={15} />} {copied === 'all' ? 'Skopírované' : 'Kopírovať celé'}
            </button>
            <button type="button" className="doc-btn" onClick={() => window.print()}><IconPrint size={15} /> Tlačiť / PDF</button>
          </>}
        />

        <div className="mdt-bar">
          <div className="mdt-bar__stats">
            <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> {model.stats.cited} údajov s citátom</span>
            <span className={`doc-pill ${model.stats.missing ? 'doc-pill--coral' : 'doc-pill--mint'}`}>{model.stats.missing} nie je v dokumentácii</span>
            <span className="doc-pill">{model.sections.length} častí podľa šablóny VZP „MDT_zapis“</span>
          </div>
          <div className="mdt-bar__confirm">
            {confirmed ? (
              <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> Potvrdil lekár KOC: {presenter} · {fmtDate(DEMO_TODAY)} · simulácia</span>
            ) : (
              <>
                <span className="doc-pill doc-pill--amber"><IconClock size={13} /> Potvrdil lekár KOC: čaká</span>
                <button type="button" className="doc-btn doc-btn--primary" onClick={() => setConfirmed(true)}>Potvrdiť (simulácia)</button>
              </>
            )}
          </div>
        </div>
      </div>

      <article className="paper mdt-print">
        <div className="paper__head">
          <div>
            <div className="paper__org">{c.koc} · Komplexné onkologické centrum</div>
            <h2 className="paper__title">{model.title}</h2>
            <div className="doc-small doc-muted" style={{ marginTop: 4 }}>Podklad pre konzílium · údaje známe k {fmtDate(model.asOf)} · šablóna VZP „MDT_zapis“</div>
          </div>
          <div className="paper__meta">
            <strong>{patient}</strong>
            {c.patient.age} r. · {c.patient.sex} · ZP {c.patient.insurerCode}<br />
            MDT {fmtDate(model.asOf)}
          </div>
        </div>

        {model.sections.map(s => <SectionView key={s.no} s={s} copied={copied === s.no} onCopy={copySection} />)}

        <div className="paper-notes">
          <div className="paper-notes__title">Zdroje (poznámky pod čiarou)</div>
          {model.notes.length === 0 ? (
            <div className="doc-faint doc-small">Žiadny údaj nemá zdroj.</div>
          ) : (
            <ol>
              {model.notes.map(n => (
                <li key={n.n}>
                  {n.title}{n.place ? ` · ${n.place}` : ''}{n.date ? ` · ${n.date}` : ''}
                  {n.quote && <> · <q>{n.quote}</q></>}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="paper__foot">
          <span>{PROTO_NOTE}</span>
          <span>Vytvorené {fmtDate(DEMO_TODAY)} · {confirmed ? `potvrdil ${presenter} (simulácia)` : 'čaká na potvrdenie lekárom KOC'}</span>
        </div>
      </article>
    </div>
  );
}
