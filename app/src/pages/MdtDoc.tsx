// „Podklad pro konzilium“ – printable document strictly along the VZP template MDT_zapis (7 sections).
// Only data known by the chosen date (never later than the MDT date); every value is the verbatim sentence
// of the report with a footnote (report, date), grouped by report; missing values are red „není v dokumentaci“.
// Copy per section, print/PDF, send to the KOC physician for confirmation.
import { useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DEMO_TODAY } from '../types';
import { DocHeader } from '../components/docs/DocHeader';
import { useSource } from '../components/docs/useSource';
import { useCaseSessionSafe } from '../components/docs/useCaseSessionSafe';
import { copyText, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { lastTimeOn, nextDemoTime } from '../components/case/demoClock';
import { fmtShort } from '../components/case/caseUtils';
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

/** `verifyBy` = the day before the MDT: a conflict in the records (typo, date) is checked by the coordinator
 *  BEFORE the meeting – the MDT decides treatment, it does not collect information (kritici 05). */
function ValueView({ v, sep, verifyBy }: { v: Val; sep?: boolean; verifyBy?: string }) {
  return (
    <>
      {sep && <span className="paper-line__sep">·</span>}
      {v.prefix && <span className="doc-muted">{v.prefix} </span>}
      <span className={v.missing ? 'doc-missing' : v.proposed ? 'doc-proposed' : undefined}>{v.verbatim ? `„${v.text}“` : v.text}</span>
      {v.n && <sup className="doc-sup">{v.n}</sup>}
      {v.proposed && <span className="paper-proposed" title="Hodnotu ještě nezkontroloval člověk se zdrojem">návrh – nepotvrzeno{v.ai ? ' · AI' : ''}</span>}
      {v.note && <span className="doc-faint doc-small"> ({v.note})</span>}
      {v.conflict && (
        <div className="paper-conflict">
          Rozpor v dokumentaci – ověřit před konziliem – koordinátorka{verifyBy ? ` do ${verifyBy}` : ''}: „{v.conflict.a.citation.quote}“ (zpráva {v.conflict.a.citation.docId}) vs. „{v.conflict.b.citation.quote}“ (zpráva {v.conflict.b.citation.docId}) · {v.conflict.explain}
        </div>
      )}
    </>
  );
}

/** ISO date of the day before (UTC, no time zone drift). */
function dayBefore(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function SectionView({ s, copied, onCopy, verifyBy }: { s: Section; copied: boolean; onCopy: (s: Section) => void; verifyBy?: string }) {
  return (
    <section className="paper-sec">
      <div className="paper-sec__head">
        <h3 className="paper-sec__title"><span className="paper-sec__no">{s.no}</span>{s.title}</h3>
        <button type="button" className="doc-btn doc-btn--sm no-print" onClick={() => onCopy(s)}>
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />} {copied ? 'Zkopírováno' : 'Kopírovat'}
        </button>
      </div>
      {s.table && (
        <table className="paper-table">
          <thead><tr>{s.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {s.table.rows.length === 0 && <tr><td colSpan={3} className="doc-missing">není v dokumentaci</td></tr>}
            {s.table.rows.map((r, ri) => (
              <tr key={ri}>{r.map((v, ci) => <td key={ci}><ValueView v={v} verifyBy={verifyBy} /></td>)}</tr>
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
              <span className="paper-line__val">{line.values.map((v, i) => <ValueView key={i} v={v} sep={i > 0} verifyBy={verifyBy} />)}</span>
            </div>
          ))}
          {g.placeholder && <div className="paper-placeholder">{g.placeholder}</div>}
        </div>
      ))}
      {s.list && s.list.length > 0 && (
        <ul className="paper-list">{s.list.map((v, i) => <li key={i}><ValueView v={v} verifyBy={verifyBy} /></li>)}</ul>
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
    const who = presenter ?? 'lékař KOC';
    // The confirmation is dated with the state it confirms („údaje známé k …“, never later than the MDT day).
    // Demo time: on the MDT day in the morning, before the meeting; otherwise after the day's existing entries.
    const when = model.asOf;
    const time = nextDemoTime(when, when === c.mdtDate ? undefined : lastTimeOn(c.log, when));
    if (model.stats.proposed > 0) return; // a human checks every proposal first (QA R5 #3)
    act.confirmMdt(when, who);
    act.addLog({
      date: when, time, action: 'Podklad pro konzilium potvrzen lékařem KOC',
      detail: `${who} · ${cnt(model.stats.missing, 'údaj chybí', 'údaje chybějí', 'údajů chybí')} · ${cnt(model.stats.conflicts, 'rozpor k ověření', 'rozpory k ověření', 'rozporů k ověření')} koordinátorkou před konziliem`, billable: true,
    });
  }

  if (!c || !model) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Podklad pro konzilium" title="Podklad pro konzilium" back={{ label: 'Zpět na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
        <div className="doc-card doc-muted">{c ? 'Načítám šablonu VZP…' : 'Případ se nenašel.'}</div>
      </div>
    );
  }

  const patient = `${c.patient.firstName} ${c.patient.lastName}`;
  const mdtLabel = model.mdtDate ? fmtDate(model.mdtDate) : 'termín ještě není určen';
  // typos and date conflicts are for the coordinator to check the day before the meeting, not for the MDT (kritici 05)
  const verifyBy = model.mdtDate ? fmtShort(dayBefore(model.mdtDate)) : undefined;
  const presenterLabel = presenter ? `${presenter} (prezentuje případ)` : 'lékař KOC';
  const { conflicts, missingLabels, proposed } = model.stats;
  const preConfirm = [
    proposed > 0 ? cnt(proposed, 'návrh není potvrzen', 'návrhy nejsou potvrzeny', 'návrhů není potvrzeno') : '',
    conflicts > 0 ? `${conflicts} ${conflicts === 1 ? 'rozpor označen' : conflicts < 5 ? 'rozpory označeny' : 'rozporů označeno'} k ověření koordinátorkou před konziliem` : '',
    missingLabels.length ? `chybí: ${missingLabels.join(' · ')}` : '',
  ].filter(Boolean).join(' · ');
  const noteGroups = groupNotes(model.notes);

  return (
    <div className="doc-page mdt">
      <div className="no-print">
        <DocHeader
          eyebrow="Podklad pro konzilium"
          title={patient}
          subtitle={<>
            <span>{c.koc} · konzilium {mdtLabel}</span>
            <span className="doc-pill doc-pill--sky">údaje známé k {fmtDate(model.asOf)}</span>
            {model.omittedDocs.length > 0 && (
              <span className="doc-pill doc-pill--outline">zprávy po konziliu se nepoužily: {model.omittedDocs.map(d => d.id).join(', ')}</span>
            )}
          </>}
          back={{ label: 'Zpět na případ', onClick: () => nav.go({ page: 'case', caseId: c.id, tab: 'podklad' }) }}
          actions={<>
            <button type="button" className="doc-btn" onClick={copyAll}>
              {copied === 'all' ? <IconCheck size={15} /> : <IconCopy size={15} />} {copied === 'all' ? 'Zkopírováno' : 'Kopírovat celé'}
            </button>
            {/* In the shared online demo (VITE_EMBED=1) the host frame blocks the print dialog, so the button is hidden there. */}
            {import.meta.env.VITE_EMBED !== '1' && <button type="button" className="doc-btn" onClick={() => window.print()}><IconPrint size={15} /> Tisk / PDF</button>}
            <button type="button" className="doc-btn" onClick={() => nav.go({ page: 'gp', caseId: c.id })} title="Závěr konzilia pro praktika s doručenkou (další krok po konziliu)">
              Závěr pro praktika <IconArrowRight size={15} />
            </button>
          </>}
        />

        <div className="mdt-bar">
          <div className="mdt-bar__stats">
            <span className="doc-pill doc-pill--mint" title="Poznámky pod čarou: doslovná věta ze zprávy, nebo odkaz na celou zprávu (např. shrnutí vyšetření)">
              <IconCheck size={13} /> {cnt(model.stats.quoted, 'doslovný citát', 'doslovné citáty', 'doslovných citátů')} · {cnt(model.stats.refs, 'odkaz', 'odkazy', 'odkazů')} na celou zprávu
            </span>
            <span className={`doc-pill ${model.stats.missing ? 'doc-pill--coral' : 'doc-pill--mint'}`}>chybí v dokumentaci: {model.stats.missing}</span>
            {conflicts > 0 && <span className="doc-pill doc-pill--amber">{conflicts} {conflicts === 1 ? 'rozpor' : conflicts < 5 ? 'rozpory' : 'rozporů'}</span>}
            {proposed > 0 && <span className="doc-pill doc-pill--amber">{cnt(proposed, 'návrh čeká', 'návrhy čekají', 'návrhů čeká')} na kontrolu</span>}
            <span className="doc-pill">{model.sections.length} částí podle šablony VZP „MDT_zapis“</span>
          </div>
          <div className="mdt-bar__confirm">
            {confirmed ? (
              <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> Potvrdil {presenterLabel} · {fmtDate(session.mdtConfirmedAt)}</span>
            ) : proposed > 0 ? (
              // the doctor confirms only what a human has checked (QA R5 #3) – the way to the proposals is one click
              <>
                <span className="doc-pill doc-pill--amber"><IconClock size={13} /> Poslat lékaři: až po kontrole návrhů</span>
                <button type="button" className="doc-btn doc-btn--primary" onClick={() => nav.go({ page: 'case', caseId: c.id })}>
                  Nejprve zkontrolovat návrhy ({proposed}) <IconArrowRight size={15} />
                </button>
              </>
            ) : (
              <>
                <span className="doc-pill doc-pill--amber"><IconClock size={13} /> Potvrzení lékařem KOC: čeká</span>
                <button type="button" className="doc-btn doc-btn--primary" onClick={confirm}>
                  <IconSend size={15} /> Poslat lékaři KOC k potvrzení
                </button>
              </>
            )}
          </div>
        </div>
        {!confirmed && preConfirm && (
          <p className="mdt-pre">Před potvrzením: {preConfirm}. {proposed > 0 ? 'Návrhy jsou v podkladu označeny „návrh – nepotvrzeno“. ' : ''}Rozpory a chybějící údaje zůstávají v podkladu označené – nic nedomýšlíme.</p>
        )}
        {confirmed && conflicts > 0 && (
          <p className="mdt-pre">Rozpory v dokumentaci ověří koordinátorka před konziliem{verifyBy ? ` (do ${verifyBy})` : ''}. Podklad je uzamčen v tomto znění.</p>
        )}
        <p className="mdt-pre mdt-lang">Hodnoty jsou doslovné věty ze zpráv lékařů (v uvozovkách), číslo u hodnoty odkazuje na zprávu v poznámkách pod čarou. Nic není přeformulováno.</p>
      </div>

      <article className="paper mdt-print">
        <div className="paper__head">
          <div>
            <div className="paper__org">{c.koc} · Komplexní onkologické centrum</div>
            <h2 className="paper__title">{model.title}</h2>
            <div className="doc-small doc-muted" style={{ marginTop: 4 }}>Podklad pro konzilium {mdtLabel} · údaje známé k {fmtDate(model.asOf)} · šablona VZP „MDT_zapis“</div>
          </div>
          <div className="paper__meta">
            <strong>{patient}</strong>
            {c.patient.age} let · {c.patient.sex} · ZP {c.patient.insurerCode}<br />
            MDT {mdtLabel}
          </div>
        </div>

        {model.sections.map(s => <SectionView key={s.no} s={s} copied={copied === s.no} onCopy={copySection} verifyBy={verifyBy} />)}

        <div className="paper-notes">
          <div className="paper-notes__title">Zdroje (poznámky pod čarou, seskupené podle zpráv)</div>
          {model.notes.length === 0 ? (
            <div className="doc-faint doc-small">Žádný údaj nemá zdroj.</div>
          ) : (
            noteGroups.map(g => (
              <div className="paper-notes__group" key={g.key}>
                <div className="paper-notes__src">
                  <strong>{g.title}</strong>{g.place ? ` · ${g.place}` : ''}{g.date ? ` · ${g.date}` : ''}
                </div>
                <ol>
                  {g.notes.map(n => (
                    <li key={n.n} value={n.n}>
                      {n.quote
                        ? (n.verbatim ? <span className="doc-faint">doslovná věta ze zprávy (uvedena v podkladu v uvozovkách)</span> : <q>{n.quote}</q>)
                        : <span className="doc-faint">{n.docId ? 'shrnutí zprávy (bez doslovného citátu; plné znění v případu po kliknutí)' : 'převzato ze vzoru, ne ze zpráv pacienta'}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            ))
          )}
        </div>

        <div className="paper__foot">
          <span>{PROTO_NOTE}</span>
          <span>Stav údajů k {fmtDate(model.asOf)} · {confirmed ? `potvrdil ${presenterLabel}` : 'čeká na potvrzení lékařem KOC'}</span>
        </div>
      </article>
    </div>
  );
}
