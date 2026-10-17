// „Podklad pre konzílium“ – printable document strictly along the VZP template MDT_zapis (7 sections).
// Only data known by the chosen date (never later than the MDT date); every value has a footnote
// (report, date, verbatim quote, grouped by report); missing values are shown in red as „nie je v dokumentácii“.
// Copy per section, print/PDF, send to the KOC physician for confirmation (simulated).
import { useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DEMO_TODAY } from '../types';
import { DocHeader } from '../components/docs/DocHeader';
import { useSource } from '../components/docs/useSource';
import { useCaseSessionSafe } from '../components/docs/useCaseSessionSafe';
import { copyText, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { lastTimeOn, nextDemoTime } from '../components/case/demoClock';
import { buildMdtModel, documentText, groupNotes, parseMembers, parsePresenter, parseTemplate, sectionText } from '../components/docs/mdtModel';
import type { Section, Val } from '../components/docs/mdtModel';
import { IconArrowRight, IconCheck, IconClock, IconCopy, IconPrint, IconSend } from '../components/docs/DocIcons';
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
      <span className={v.missing ? 'doc-missing' : v.proposed ? 'doc-proposed' : undefined}>{v.text}</span>
      {v.n && <sup className="doc-sup">{v.n}</sup>}
      {v.proposed && <span className="paper-proposed" title="Hodnotu ešte neskontroloval človek so zdrojom">návrh – nepotvrdený{v.ai ? ' · AI' : ''}</span>}
      {v.note && <span className="doc-faint doc-small"> ({v.note})</span>}
      {v.conflict && (
        <div className="paper-conflict">
          Rozpor v dokumentácii – rozhodne konzílium: {v.conflict.a.value} (správa {v.conflict.a.citation.docId}) vs. {v.conflict.b.value} (správa {v.conflict.b.citation.docId}) · {v.conflict.explain}
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

const cnt = (n: number, one: string, few: string, many: string) => `${n} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`;

export default function MdtDoc() {
  const nav = useNav();
  const caseId = nav.route.page === 'mdt' ? nav.route.caseId : undefined;
  const c = findCase(caseId);
  const src = useSource();
  // Demo session shared with the case screen (ECOG answer, decided conflicts) – the handover reflects it (R3 B4).
  const [session, act] = useCaseSessionSafe(c?.id);
  const confirmed = !!session.mdtConfirmedAt;
  const [copied, setCopied] = useState<string | null>(null);

  const tplText = src?.templates?.MDT_zapis ?? MDT_ZAPIS_FALLBACK;
  const zaver = src?.templates?.['MDT zaver'] ?? '';
  // Team and presenter come from the sample MDT record of THIS case only (Alena has docId 'MDT'); never reused for another patient.
  const hasOwnMdt = !!c?.docs.some(d => d.id === 'MDT');
  const members = useMemo(() => (hasOwnMdt ? parseMembers(zaver) : []), [zaver, hasOwnMdt]);
  const presenter = useMemo(() => (hasOwnMdt ? parsePresenter(zaver) : undefined), [zaver, hasOwnMdt]);
  const texts = useMemo(() => Object.fromEntries((src?.documents ?? []).map(d => [d.id, d.text])), [src]);
  const navAsOf = /^\d{4}-\d{2}-\d{2}$/.test(nav.asOf) ? nav.asOf : DEMO_TODAY;
  const overrides = session.overrides;
  const model = useMemo(
    () => (c ? buildMdtModel(c, parseTemplate(tplText), members, texts, { asOf: navAsOf, overrides }) : null),
    [c, tplText, members, texts, navAsOf, overrides],
  );

  function flash(key: string) { setCopied(key); window.setTimeout(() => setCopied(k => (k === key ? null : k)), 1600); }
  function copySection(s: Section) { copyText(sectionText(s)).then(() => flash(s.no)).catch(() => flash(s.no)); }
  function copyAll() { if (model) copyText(documentText(model)).then(() => flash('all')).catch(() => flash('all')); }
  function confirm() {
    if (!c || !model) return;
    const who = presenter ?? 'lekár KOC';
    // The confirmation is dated with the state it confirms („údaje známe k …“, never later than the MDT day).
    // Demo time: on the MDT day in the morning, before the meeting; otherwise after the day's existing entries.
    const when = model.asOf;
    const time = nextDemoTime(when, when === c.mdtDate ? undefined : lastTimeOn(c.log, when));
    if (model.stats.proposed > 0) return; // a human checks every proposal first (QA R5 #3)
    act.confirmMdt(when, who);
    act.addLog({
      date: when, time, action: 'Podklad pre konzílium potvrdený lekárom KOC',
      detail: `${who} · ${cnt(model.stats.missing, 'údaj chýba', 'údaje chýbajú', 'údajov chýba')} · ${cnt(model.stats.conflicts, 'rozpor ponechaný', 'rozpory ponechané', 'rozporov ponechaných')} konzíliu (simulácia)`, billable: true,
    });
  }

  if (!c || !model) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Podklad pre konzílium" title="Podklad pre konzílium" back={{ label: 'Späť na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
        <div className="doc-card doc-muted">{c ? 'Načítavam šablónu VZP…' : 'Prípad sa nenašiel.'}</div>
      </div>
    );
  }

  const patient = `${c.patient.firstName} ${c.patient.lastName}`;
  const mdtLabel = model.mdtDate ? fmtDate(model.mdtDate) : 'termín ešte nie je určený';
  const presenterLabel = presenter ? `${presenter} (prezentuje prípad)` : 'lekár KOC';
  const { conflicts, missingLabels, proposed } = model.stats;
  const preConfirm = [
    proposed > 0 ? cnt(proposed, 'návrh nie je potvrdený', 'návrhy nie sú potvrdené', 'návrhov nie je potvrdených') : '',
    conflicts > 0 ? `${conflicts} ${conflicts === 1 ? 'rozpor označený' : conflicts < 5 ? 'rozpory označené' : 'rozporov označených'} pre konzílium` : '',
    missingLabels.length ? `chýba: ${missingLabels.join(' · ')}` : '',
  ].filter(Boolean).join(' · ');
  const noteGroups = groupNotes(model.notes);

  return (
    <div className="doc-page mdt">
      <div className="no-print">
        <DocHeader
          eyebrow="Podklad pre konzílium"
          title={patient}
          subtitle={<>
            <span>{c.koc} · konzílium {mdtLabel}</span>
            <span className="doc-pill doc-pill--sky">údaje známe k {fmtDate(model.asOf)}</span>
            {model.omittedDocs.length > 0 && (
              <span className="doc-pill doc-pill--outline">správy po konzíliu sa nepoužili: {model.omittedDocs.map(d => d.id).join(', ')}</span>
            )}
          </>}
          back={{ label: 'Späť na prípad', onClick: () => nav.go({ page: 'case', caseId: c.id, tab: 'podklad' }) }}
          actions={<>
            <button type="button" className="doc-btn" onClick={copyAll}>
              {copied === 'all' ? <IconCheck size={15} /> : <IconCopy size={15} />} {copied === 'all' ? 'Skopírované' : 'Kopírovať celé'}
            </button>
            {/* In the shared online demo (VITE_EMBED=1) the host frame blocks the print dialog, so the button is hidden there. */}
            {import.meta.env.VITE_EMBED !== '1' && <button type="button" className="doc-btn" onClick={() => window.print()}><IconPrint size={15} /> Tlačiť / PDF</button>}
            <button type="button" className="doc-btn" onClick={() => nav.go({ page: 'gp', caseId: c.id })} title="Záver konzília pre praktika s doručenkou (ďalší krok po konzíliu)">
              Záver pre praktika <IconArrowRight size={15} />
            </button>
          </>}
        />

        <div className="mdt-bar">
          <div className="mdt-bar__stats">
            <span className="doc-pill doc-pill--mint" title="Poznámky pod čiarou: doslovná veta zo správy, alebo odkaz na celú správu (napr. zhrnutie vyšetrenia)">
              <IconCheck size={13} /> {cnt(model.stats.quoted, 'doslovný citát', 'doslovné citáty', 'doslovných citátov')} · {cnt(model.stats.refs, 'odkaz', 'odkazy', 'odkazov')} na celú správu
            </span>
            <span className={`doc-pill ${model.stats.missing ? 'doc-pill--coral' : 'doc-pill--mint'}`}>chýba v dokumentácii: {model.stats.missing}</span>
            {conflicts > 0 && <span className="doc-pill doc-pill--amber">{conflicts} {conflicts === 1 ? 'rozpor' : conflicts < 5 ? 'rozpory' : 'rozporov'}</span>}
            {proposed > 0 && <span className="doc-pill doc-pill--amber">{cnt(proposed, 'návrh čaká', 'návrhy čakajú', 'návrhov čaká')} na kontrolu</span>}
            <span className="doc-pill">{model.sections.length} častí podľa šablóny VZP „MDT_zapis“</span>
          </div>
          <div className="mdt-bar__confirm">
            {confirmed ? (
              <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> Potvrdil {presenterLabel} · {fmtDate(session.mdtConfirmedAt)} · simulácia</span>
            ) : proposed > 0 ? (
              // the doctor confirms only what a human has checked (QA R5 #3) – the way to the proposals is one click
              <>
                <span className="doc-pill doc-pill--amber"><IconClock size={13} /> Poslať lekárovi: až po kontrole návrhov</span>
                <button type="button" className="doc-btn doc-btn--primary" onClick={() => nav.go({ page: 'case', caseId: c.id })}>
                  Najprv skontrolovať návrhy ({proposed}) <IconArrowRight size={15} />
                </button>
              </>
            ) : (
              <>
                <span className="doc-pill doc-pill--amber"><IconClock size={13} /> Potvrdenie lekárom KOC: čaká</span>
                <button type="button" className="doc-btn doc-btn--primary" onClick={confirm}>
                  <IconSend size={15} /> Poslať lekárovi KOC na potvrdenie (simulácia)
                </button>
              </>
            )}
          </div>
        </div>
        {!confirmed && preConfirm && (
          <p className="mdt-pre">Pred potvrdením: {preConfirm}. {proposed > 0 ? 'Návrhy sú v podklade označené „návrh – nepotvrdený“. ' : ''}Rozpory a chýbajúce údaje zostávajú v podklade označené – nič nedomýšľame.</p>
        )}
        {confirmed && conflicts > 0 && (
          <p className="mdt-pre">Rozpory ponechané na rozhodnutie konzília. Podklad je uzamknutý v tomto znení (simulácia).</p>
        )}
        <p className="mdt-pre mdt-lang">Šablóna VZP je v češtine, hodnoty sú po slovensky, pôvodné vety zo správ sú v poznámkach pod čiarou.</p>
      </div>

      <article className="paper mdt-print">
        <div className="paper__head">
          <div>
            <div className="paper__org">{c.koc} · Komplexné onkologické centrum</div>
            <h2 className="paper__title">{model.title}</h2>
            <div className="doc-small doc-muted" style={{ marginTop: 4 }}>Podklad pre konzílium {mdtLabel} · údaje známe k {fmtDate(model.asOf)} · šablóna VZP „MDT_zapis“</div>
          </div>
          <div className="paper__meta">
            <strong>{patient}</strong>
            {c.patient.age} r. · {c.patient.sex} · ZP {c.patient.insurerCode}<br />
            MDT {mdtLabel}
          </div>
        </div>

        {model.sections.map(s => <SectionView key={s.no} s={s} copied={copied === s.no} onCopy={copySection} />)}

        <div className="paper-notes">
          <div className="paper-notes__title">Zdroje (poznámky pod čiarou, zoskupené po správach)</div>
          {model.notes.length === 0 ? (
            <div className="doc-faint doc-small">Žiadny údaj nemá zdroj.</div>
          ) : (
            noteGroups.map(g => (
              <div className="paper-notes__group" key={g.key}>
                <div className="paper-notes__src">
                  <strong>{g.title}</strong>{g.place ? ` · ${g.place}` : ''}{g.date ? ` · ${g.date}` : ''}
                </div>
                <ol>
                  {g.notes.map(n => (
                    <li key={n.n} value={n.n}>
                      {n.quote ? <q>{n.quote}</q> : <span className="doc-faint">{n.docId ? 'zhrnutie správy (bez doslovného citátu; plné znenie v prípade po kliknutí)' : 'prevzaté zo vzoru, nie zo správ pacienta'}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            ))
          )}
        </div>

        <div className="paper__foot">
          <span>{PROTO_NOTE}</span>
          <span>Stav údajov k {fmtDate(model.asOf)} · {confirmed ? `potvrdil ${presenterLabel} (simulácia)` : 'čaká na potvrdenie lekárom KOC'}</span>
        </div>
      </article>
    </div>
  );
}
