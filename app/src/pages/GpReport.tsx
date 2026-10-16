// „Záver pre praktika“: pôvodná otázka praktika → odpoveď konzília → „Čo to znamená pre vás, pán doktor“,
// podpis/pečať nemocnice (§55a), odoslanie s doručenkou (simulované), smerovanie reviznému lekárovi ZP 211,
// uzavretie prípadu so záznamom o koordinovaní (dni so zásahom = podklad pre výkon 51887).
import { useEffect, useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DocHeader } from '../components/docs/DocHeader';
import { DeliveryTimeline } from '../components/docs/DeliveryTimeline';
import type { DeliveryStep } from '../components/docs/DeliveryTimeline';
import { addBusinessDays, addDays, billableDays, docById, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { IconArrowDown, IconArrowRight, IconCheck, IconClock, IconFlag, IconList, IconQuote, IconSend, IconShield, IconStamp } from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './GpReport.css';

type Stage = 'draft' | 'sending' | 'sent' | 'delivered' | 'confirmed' | 'closed';
const CHANNEL = 'eZpráva';
const FEE_PER_DAY = 250; // Kč, výkon 51887, vykazuje nemocnica

export default function GpReport() {
  const nav = useNav();
  const caseId = nav.route.page === 'gp' ? nav.route.caseId : undefined;
  const c = findCase(caseId);
  const [stage, setStage] = useState<Stage>('draft');

  // Simulated delivery receipt: odoslané → doručené → potvrdené
  useEffect(() => {
    const next: Partial<Record<Stage, [Stage, number]>> = { sending: ['sent', 700], sent: ['delivered', 1100], delivered: ['confirmed', 1500] };
    const n = next[stage];
    if (!n) return;
    const t = window.setTimeout(() => setStage(n[0]), n[1]);
    return () => window.clearTimeout(t);
  }, [stage]);

  const mdt = c?.mdtDate ?? c?.receivedAt ?? '2026-10-21';
  const steps: DeliveryStep[] = useMemo(() => [
    { label: 'Odoslané', detail: `${CHANNEL} · zapečatené nemocnicou`, time: `${fmtDate(mdt)} 16:40` },
    { label: 'Doručené', detail: 'schránka ordinácie praktika', time: `${fmtDate(mdt)} 16:41` },
    { label: 'Potvrdené', detail: 'praktik otvoril a potvrdil', time: `${fmtDate(addDays(mdt, 1))} 8:15` },
  ], [mdt]);
  const reached = stage === 'sent' ? 0 : stage === 'delivered' ? 1 : stage === 'confirmed' || stage === 'closed' ? 2 : -1;

  if (!c) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Záver pre praktika" title="Prípad sa nenašiel" back={{ label: 'Späť na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
      </div>
    );
  }

  const gp = c.referringGp;
  const rep = c.gpReport;
  const patient = `${c.patient.firstName} ${c.patient.lastName}`;
  const reviewer = c.reviewer ?? { insurerCode: c.patient.insurerCode, insurerName: c.patient.insurerName, note: '' };
  const isVzp = reviewer.insurerCode === '111';
  const questionCite = rep?.citations.find(ci => docById(c, ci.docId)?.kind === 'request') ?? rep?.citations[0];
  const questionDoc = docById(c, questionCite?.docId);
  const answerDocs = Array.from(new Set((rep?.citations ?? []).map(ci => ci.docId)))
    .filter(id => id !== questionCite?.docId).map(id => docById(c, id)).filter((d): d is NonNullable<typeof d> => !!d);
  const deadline = addBusinessDays(mdt, 2);
  const days = billableDays(c);
  const sent = stage !== 'draft';
  const sealed = stage !== 'draft' && stage !== 'sending';

  return (
    <div className="doc-page gpr">
      <DocHeader
        eyebrow="Záver pre praktika"
        title={patient}
        subtitle={<>
          <span>Adresát: {gp.name} · {gp.practice}</span>
          <span className="doc-pill doc-pill--outline"><IconSend size={13} /> kanál {CHANNEL}</span>
          <span className="doc-pill doc-pill--outline">konzílium {fmtDate(mdt)}</span>
          {stage === 'closed' && <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> prípad uzavretý</span>}
        </>}
        back={{ label: 'Späť na prípad', onClick: () => nav.go({ page: 'case', caseId: c.id }) }}
      />

      <div className="doc-grid">
        {/* ---------- The document ---------- */}
        <article className="paper gpr-paper">
          <div className="paper__head">
            <div>
              <div className="paper__org">{c.koc} · Komplexné onkologické centrum · multidisciplinárny tím</div>
              <h2 className="paper__title">Záver konzília pre praktického lekára</h2>
              <div className="doc-small doc-muted" style={{ marginTop: 4 }}>Podľa vzoru VZP „MDT zaver“ · konzílium {fmtDate(mdt)}</div>
            </div>
            <div className="paper__meta">
              <strong>{patient}</strong>
              {c.patient.age} r. · ZP {c.patient.insurerCode}<br />
              {gp.name}
            </div>
          </div>

          {!rep ? (
            <div className="paper-placeholder">Záver konzília ešte nie je v prípade zapísaný. Doplní sa po jednaní {fmtDate(mdt)}.</div>
          ) : (
            <>
              <section className="gpr-q">
                <div className="gpr-q__label"><IconQuote size={16} /> Vaša pôvodná otázka</div>
                <blockquote className="gpr-q__quote">„{rep.question}“</blockquote>
                {questionDoc && (
                  <div className="gpr-q__src">Zo žiadosti o prevzatie · {/^\d+$/.test(questionDoc.id) ? `správa ${questionDoc.id} · ` : ''}{questionDoc.title} · {fmtDate(questionDoc.examDate)}</div>
                )}
              </section>

              <div className="gpr-arrow"><span className="gpr-arrow__dot"><IconArrowDown size={16} /></span><span>Odpoveď konzília {fmtDate(mdt)}</span></div>

              <section className="gpr-a">
                <div className="gpr-a__label">Záver konzília</div>
                <p className="gpr-a__text">{rep.answer}</p>
                {answerDocs.length > 0 && (
                  <div className="gpr-a__src">
                    <span className="doc-faint doc-small">Opiera sa o</span>
                    {answerDocs.map(d => (
                      <span key={d.id} className="doc-pill doc-pill--outline">
                        {/^\d+$/.test(d.id) ? `správa ${d.id} · ` : ''}{d.title} · {fmtDate(d.examDate)}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="gpr-foryou">
                <div className="gpr-foryou__title">Čo to znamená pre vás, pán doktor</div>
                <ul className="doc-list">
                  {rep.forYou.map((t, i) => (
                    <li key={i}><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span><span>{t}</span></li>
                  ))}
                </ul>
                <p className="doc-small doc-muted" style={{ margin: '12px 0 0' }}>Len to, čo je v zázname konzília a v správach. Nič domyslené.</p>
              </section>
            </>
          )}

          <section className={`gpr-sign ${sealed ? 'gpr-sign--sealed' : ''}`}>
            <span className="gpr-sign__ico"><IconStamp size={22} /></span>
            <div>
              <div className="gpr-sign__t">Podpis / pečať nemocnice</div>
              <div className="doc-small doc-muted">
                {sealed
                  ? <>Zapečatené v nemocničnom systéme · {fmtDate(mdt)} · <strong>simulované</strong></>
                  : <>(§55a ods. 4 zák. 372/2011 Sb. – podpíše alebo zapečatí nemocnica, nie náš e-mail)</>}
              </div>
            </div>
            {sealed && <span className="doc-pill doc-pill--mint gpr-sign__pill"><IconCheck size={13} /> podpísané</span>}
          </section>

          <div className="paper__foot"><span>{PROTO_NOTE}</span><span>Kópia: {gp.name}</span></div>
        </article>

        {/* ---------- Rail ---------- */}
        <aside className="doc-rail gpr-rail">
          <div className="doc-card">
            <div className="doc-card__title">
              <IconSend size={16} /> Odoslanie praktikovi
              {sent && <span className="doc-pill doc-pill--outline" style={{ marginLeft: 'auto' }}>simulované</span>}
            </div>
            {!sent ? (
              <>
                <ul className="doc-list doc-small">
                  <li><span className="doc-list__ico doc-list__ico--sky"><IconClock size={14} /></span><span>Lehota 2 pracovné dni od konzília: odoslať do <strong>{fmtDate(deadline)}</strong>.</span></li>
                  <li><span className="doc-list__ico doc-list__ico--accent"><IconSend size={14} /></span><span>Kanál {CHANNEL}, do schránky ordinácie. Praktik nepotrebuje žiadny účet.</span></li>
                </ul>
                <hr className="doc-hr" />
                <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => setStage('sending')} disabled={!rep}>
                  <IconSend size={16} /> Odoslať
                </button>
              </>
            ) : (
              <>
                <DeliveryTimeline steps={steps} reached={reached} inFlight={stage !== 'confirmed' && stage !== 'closed'} />
                <p className="doc-small doc-muted" style={{ margin: '14px 0 0' }}>
                  {stage === 'confirmed' || stage === 'closed'
                    ? <>Odoslané v deň konzília, v lehote 2 pracovných dní (do {fmtDate(deadline)}). Doručenie doložené.</>
                    : 'Čakám na doručenie…'}
                </p>
              </>
            )}
          </div>

          <div className="doc-card gpr-reviewer">
            <div className="doc-card__title"><IconShield size={16} /> Revízny lekár</div>
            <p className="gpr-reviewer__text">
              Pacientka je poistená v <strong>{reviewer.insurerCode} – {reviewer.insurerName}</strong>{!isVzp && ' (nie VZP)'}
              {' '}→ súhrn ide <strong>jej</strong> reviznému lekárovi <span className="doc-muted">(simulované)</span>.
            </p>
            {reviewer.note && <p className="doc-small doc-muted" style={{ margin: '0 0 10px' }}>{reviewer.note}</p>}
            <div className="gpr-reviewer__items">
              <span className="doc-pill">diagnóza s kódom MKN-10</span>
              <span className="doc-pill">záver konzília</span>
              <span className="doc-pill">plánovaná liečba</span>
            </div>
            <div className="gpr-reviewer__status">
              {sealed
                ? <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> súhrn odoslaný · {fmtDate(mdt)} · simulované</span>
                : <span className="doc-pill doc-pill--outline"><IconClock size={13} /> odošle sa spolu so záverom</span>}
            </div>
          </div>

          {(stage === 'confirmed' || stage === 'closed') && (
            <div className={`doc-card doc-reveal ${stage === 'closed' ? 'doc-card--pastel' : ''}`}>
              {stage === 'confirmed' ? (
                <>
                  <div className="doc-card__title"><IconFlag size={16} /> Slučka uzavretá</div>
                  <p className="doc-small doc-muted" style={{ margin: '0 0 14px' }}>Praktik potvrdil doručenie, revízny lekár má súhrn. Prípad môžete uzavrieť; vznikne záznam o koordinovaní.</p>
                  <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => setStage('closed')}>
                    <IconCheck size={16} /> Uzavrieť prípad
                  </button>
                </>
              ) : (
                <>
                  <div className="doc-card__title"><IconList size={16} /> Záznam o koordinovaní vytvorený</div>
                  <div className="doc-stats gpr-stats">
                    <div className="doc-stat doc-stat--1"><div className="doc-stat__v">{days.length}</div><div className="doc-stat__l">dní so zásahom koordinátora</div></div>
                    <div className="doc-stat"><div className="doc-stat__v">{c.log.length}</div><div className="doc-stat__l">úkonov v zázname</div></div>
                    <div className="doc-stat doc-stat--3"><div className="doc-stat__v">{(days.length * FEE_PER_DAY).toLocaleString('sk-SK')} Kč</div><div className="doc-stat__l">podklad pre výkon 51887</div></div>
                  </div>
                  <p className="doc-small" style={{ margin: '14px 0 0', color: 'var(--ink-2)' }}>
                    Výkon 51887 = {FEE_PER_DAY} Kč za deň so zásahom, najviac 1× denne; vykazuje nemocnica v NIS.
                    {days.length > 0 && <> Záznam od {fmtDate(days[0])} do {fmtDate(days[days.length - 1])}.</>}
                  </p>
                  <button type="button" className="doc-btn doc-btn--block" style={{ marginTop: 14 }} onClick={() => nav.go({ page: 'case', caseId: c.id, tab: 'zaznam' })}>
                    Otvoriť záznam o koordinovaní <IconArrowRight size={15} />
                  </button>
                  <button type="button" className="doc-btn doc-btn--text doc-btn--block" style={{ marginTop: 6 }} onClick={() => nav.go({ page: 'queue' })}>
                    Späť na frontu
                  </button>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
