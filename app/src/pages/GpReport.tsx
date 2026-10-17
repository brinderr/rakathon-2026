// „Záver pre praktika“: pôvodná otázka praktika → odpoveď konzília → „Čo to znamená pre vás, pán doktor“,
// podpis/pečať nemocnice (§55a), odoslanie s doručenkou (simulované), smerovanie reviznému lekárovi ZP 211,
// uzavretie prípadu so záznamom o koordinovaní (dni so zásahom = podklad pre výkon 51887).
// Stránka ukazuje stav PO konzíliu – pri „dnes“ 19. 10. je to ukážka a hovorí to nahlas.
import { useEffect, useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DEMO_TODAY } from '../types';
import type { LogEntry } from '../types';
import { DocHeader } from '../components/docs/DocHeader';
import { DeliveryTimeline } from '../components/docs/DeliveryTimeline';
import { useCaseSessionSafe } from '../components/docs/useCaseSessionSafe';
import type { DeliveryStep } from '../components/docs/DeliveryTimeline';
import { addBusinessDays, addDays, billableDays, docById, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { stepStateAt } from '../components/case/caseUtils';
import { IconArrowDown, IconArrowRight, IconCheck, IconClock, IconFlag, IconList, IconQuote, IconSend, IconShield, IconStamp } from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './GpReport.css';

type Stage = 'draft' | 'sending' | 'sent' | 'delivered' | 'confirmed' | 'closed';
const CHANNEL = 'eZpráva';
const FEE_PER_DAY = 250; // Kč, výkon 51887 – za intervenciu uznanú poisťovňou, najviac 1× denne; vykazuje nemocnica
const NL_BUSINESS_DAYS = 2; // holandský vzor (norma SONCOS): záver praktikovi do 2 pracovných dní; ČR lehotu neurčuje

/** "16:40" + 1 minute → "16:41" (hours zero-padded like every other time in the record) */
function plusMinute(t: string): string {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return t;
  const total = (Number(m[1]) * 60 + Number(m[2]) + 1) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
const findLog = (log: LogEntry[], re: RegExp) => log.find(l => re.test(l.action));

export default function GpReport() {
  const nav = useNav();
  const caseId = nav.route.page === 'gp' ? nav.route.caseId : undefined;
  const c = findCase(caseId);
  // Shared demo session: a closed case stays closed in the queue and in the case header (R3 B6).
  const [session, act] = useCaseSessionSafe(c?.id);
  const [stage, setStage] = useState<Stage>(() => (session.closedAt ? 'closed' : 'draft'));

  // Simulated delivery receipt: odoslané → doručené → potvrdené
  useEffect(() => {
    const next: Partial<Record<Stage, [Stage, number]>> = { sending: ['sent', 700], sent: ['delivered', 1100], delivered: ['confirmed', 1500] };
    const n = next[stage];
    if (!n) return;
    const t = window.setTimeout(() => setStage(n[0]), n[1]);
    return () => window.clearTimeout(t);
  }, [stage]);

  const mdt = c?.mdtDate ?? c?.receivedAt ?? '2026-10-21';
  const rep = c?.gpReport;
  const afterMdt = !!rep && mdt > DEMO_TODAY;

  // The page shows the state after the MDT: move "stav k dátumu" to the MDT day so the case screens agree.
  const { asOf, setAsOf } = nav;
  useEffect(() => {
    if (afterMdt && asOf < mdt) setAsOf(mdt);
  }, [afterMdt, mdt, asOf, setAsOf]);

  // Times come from the coordination record (one source of truth); fallbacks only when the record has no such entry.
  const log = c?.log ?? [];
  const sentEntry = findLog(log, /z[áa]ver odoslan/i);
  const confirmEntry = findLog(log, /praktik potvrdil/i);
  const reviewerEntry = findLog(log, /revízn|revizn/i);
  const sentDate = sentEntry?.date ?? mdt;
  const sentTime = sentEntry?.time ?? '16:40';
  const lastLogDate = log.length ? [...log].map(l => l.date).sort()[log.length - 1] : mdt;
  const steps: DeliveryStep[] = useMemo(() => [
    { label: 'Odoslané', detail: `${CHANNEL} · zapečatené nemocnicou`, time: `${fmtDate(sentDate)} ${sentTime}` },
    { label: 'Doručené', detail: 'schránka ordinácie praktika', time: `${fmtDate(sentDate)} ${plusMinute(sentTime)}` },
    { label: 'Potvrdené', detail: 'praktik otvoril a potvrdil', time: confirmEntry ? `${fmtDate(confirmEntry.date)} ${confirmEntry.time ?? ''}`.trim() : `${fmtDate(addDays(sentDate, 1))} 08:15` },
  ], [sentDate, sentTime, confirmEntry]);
  const reached = stage === 'sent' ? 0 : stage === 'delivered' ? 1 : stage === 'confirmed' || stage === 'closed' ? 2 : -1;

  if (!c) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Záver pre praktika" title="Prípad sa nenašiel" back={{ label: 'Späť na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
      </div>
    );
  }

  const gp = c.referringGp;
  const patient = `${c.patient.firstName} ${c.patient.lastName}`;
  const female = c.patient.sex === 'žena';
  const gpFemale = /á$/.test(gp.name.trim().split(/\s+/).pop() ?? ''); // „Šťastná“ → pani doktorka
  const reviewer = c.reviewer ?? { insurerCode: c.patient.insurerCode, insurerName: c.patient.insurerName, note: '' };
  const isVzp = reviewer.insurerCode === '111';
  const insurerShort = reviewer.insurerName.replace(/^Zdravotní pojišťovna ministerstva vnitra ČR$/i, 'ZP MV ČR').replace(/^Všeobecná zdravotní pojišťovna ČR$/i, 'VZP ČR');
  const questionCite = rep?.citations.find(ci => docById(c, ci.docId)?.kind === 'request') ?? rep?.citations[0];
  const questionDoc = docById(c, questionCite?.docId);
  const answerDocs = Array.from(new Set((rep?.citations ?? []).map(ci => ci.docId)))
    .filter(id => id !== questionCite?.docId).map(id => docById(c, id)).filter((d): d is NonNullable<typeof d> => !!d);
  const deadline = addBusinessDays(mdt, NL_BUSINESS_DAYS);
  const days = billableDays(c);
  const sent = stage !== 'draft';
  const sealed = stage !== 'draft' && stage !== 'sending';
  const done = stage === 'confirmed' || stage === 'closed';

  // The record is complete only when the whole timeline is visible: move the slider to its last entry.
  const openRecord = () => { setAsOf(lastLogDate); nav.go({ page: 'case', caseId: c.id, tab: 'zaznam' }); };
  // The loop closes when the GP confirmed the delivery (from the record); the slider shows the whole record.
  const closeDate = confirmEntry?.date ?? addDays(sentDate, 1);
  // Steps after the MDT that are still running when the loop closes (QA R5 #1): their reports reopen the case.
  const stillRunning = c.steps.filter(s => s.due > mdt && stepStateAt(s, closeDate) !== null && stepStateAt(s, closeDate) !== 'delivered');
  const runningText = stillRunning.map(s => `${s.title.replace(/\s*\(.*\)$/, '')} ${fmtDate(s.due).replace(/ \d{4}$/, '')}`).join(', ');
  // ECOG came in the demo before the MDT, but the (fictional VZP) MDT record still asks for it (QA R5 #13).
  const ecog = session.overrides.performance?.kind === 'resolved' ? session.overrides.performance : undefined;
  const closeCase = () => {
    setAsOf(lastLogDate);
    setStage('closed');
    if (!session.closedAt) {
      act.addLog({ date: closeDate, time: confirmEntry?.time ? plusMinute(confirmEntry.time) : undefined, action: 'Prípad uzavretý', detail: `Záver doručený praktikovi, súhrn reviznému lekárovi ZP ${reviewer.insurerCode}. Záznam o koordinovaní: ${days.length} dní so zásahom (simulácia).`, billable: false });
    }
    act.close(closeDate);
  };

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

      {afterMdt && (
        <div className="doc-notice">
          <IconClock size={15} />
          <span>Ukážka stavu <strong>po konzíliu {fmtDate(mdt)}</strong> (dnes je {fmtDate(DEMO_TODAY)}). Zápis konzília je fiktívny podklad VZP „MDT zaver“.</span>
        </div>
      )}

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
                <div className="gpr-foryou__title">Čo to znamená pre vás, {gpFemale ? 'pani doktorka' : 'pán doktor'}</div>
                <ul className="doc-list">
                  {rep.forYou.map((t, i) => (
                    <li key={i}><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span>
                      <span>{t}
                        {i === 0 && ecog && /ECOG/.test(t) && (
                          <span className="gpr-aside">{ecog.value} bol v podklade od {fmtDate(ecog.date)} (správa {ecog.docId} – ukážka pre demo). Zápis konzília je fiktívny podklad VZP a ECOG ešte neuvádza.</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="doc-small doc-muted" style={{ margin: '12px 0 0' }}>Len to, čo je v zázname konzília a v správach. Nič domyslené, žiadne vlastné odporúčanie liečby.</p>
              </section>
            </>
          )}

          <section className={`gpr-sign ${sealed ? 'gpr-sign--sealed' : ''}`}>
            <span className="gpr-sign__ico"><IconStamp size={22} /></span>
            <div>
              <div className="gpr-sign__t">Podpis / pečať nemocnice</div>
              <div className="doc-small doc-muted">
                {sealed
                  ? <>Zapečatené v nemocničnom systéme · {fmtDate(sentDate)} · <strong>simulované</strong></>
                  : <>(§55a ods. 4 zák. 372/2011 Sb.: časové razítko a pečať nemocnice alebo uznávaný podpis zdravotníka – nie náš e-mail)</>}
              </div>
            </div>
            {sealed && <span className="doc-pill doc-pill--mint gpr-sign__pill"><IconCheck size={13} /> podpísané</span>}
          </section>

          <div className="paper__foot"><span>{PROTO_NOTE}</span><span>Zdroj: zápis konzília {fmtDate(mdt)} · adresát {gp.name}</span></div>
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
                  <li><span className="doc-list__ico doc-list__ico--sky"><IconClock size={14} /></span><span>Cieľ podľa <strong>holandského vzoru</strong> (norma SONCOS): záver praktikovi do {NL_BUSINESS_DAYS} pracovných dní, teda do <strong>{fmtDate(deadline)}</strong>. V ČR takú lehotu predpis neurčuje.</span></li>
                  <li><span className="doc-list__ico doc-list__ico--accent"><IconSend size={14} /></span><span>Kanál {CHANNEL}, do schránky ordinácie. Praktik nepotrebuje žiadny účet.</span></li>
                </ul>
                <hr className="doc-hr" />
                <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => setStage('sending')} disabled={!rep}>
                  <IconSend size={16} /> Odoslať
                </button>
                {!rep && <p className="doc-small doc-faint" style={{ margin: '10px 0 0', textAlign: 'center' }}>Odoslať bude možné po zápise z konzília.</p>}
              </>
            ) : (
              <>
                <DeliveryTimeline steps={steps} reached={reached} inFlight={!done} />
                <p className="doc-small doc-muted" style={{ margin: '14px 0 0' }}>
                  {done
                    ? <>Odoslané {fmtDate(sentDate)}, v cieli {NL_BUSINESS_DAYS} pracovných dní podľa holandského vzoru (do {fmtDate(deadline)}). Doručenie doložené (simulované).</>
                    : 'Čakám na doručenie…'}
                </p>
              </>
            )}
          </div>

          <div className="doc-card gpr-reviewer">
            <div className="doc-card__title"><IconShield size={16} /> Revízny lekár</div>
            <p className="gpr-reviewer__text">
              ZP <strong>{reviewer.insurerCode}</strong> ({insurerShort}){isVzp ? '' : ', nie VZP'} → súhrn ide revíznemu lekárovi ZP {reviewer.insurerCode}.
            </p>
            <div className="gpr-reviewer__items">
              <span className="doc-pill">diagnóza s kódom MKN-10</span>
              <span className="doc-pill">záver konzília</span>
              <span className="doc-pill">plánovaná liečba</span>
            </div>
            <div className="gpr-reviewer__status">
              {sealed
                ? <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> súhrn odoslaný · {fmtDate(reviewerEntry?.date ?? sentDate)} · simulované</span>
                : <span className="doc-pill doc-pill--outline"><IconClock size={13} /> odošle sa spolu so záverom · simulované, kanál v ČR nie je overený</span>}
            </div>
          </div>

          {done && (
            <div className={`doc-card doc-reveal ${stage === 'closed' ? 'doc-card--pastel' : ''}`}>
              {stage === 'confirmed' ? (
                <>
                  <div className="doc-card__title"><IconFlag size={16} /> Záver doručený</div>
                  <p className="doc-small doc-muted" style={{ margin: '0 0 14px' }}>
                    Praktik potvrdil doručenie, revízny lekár má súhrn. {female ? 'Pacientka' : 'Pacient'} má termín na ďalší krok. Prípad môžete uzavrieť; vznikne záznam o koordinovaní.
                  </p>
                  {stillRunning.length > 0 && (
                    <p className="doc-small gpr-running">
                      Po konzíliu ešte {stillRunning.length === 1 ? 'beží 1 krok' : `bežia ${stillRunning.length} kroky`}: {runningText}. Keď príde ich správa, prípad sa sám znova otvorí a ukáže ju.
                    </p>
                  )}
                  <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={closeCase}>
                    <IconCheck size={16} /> Uzavrieť prípad
                  </button>
                </>
              ) : (
                <>
                  <div className="doc-card__title"><IconList size={16} /> Záznam o koordinovaní vytvorený</div>
                  <div className="doc-stats gpr-stats">
                    <div className="doc-stat doc-stat--1"><div className="doc-stat__v">{days.length}</div><div className="doc-stat__l">dní so zásahom koordinátora</div></div>
                    <div className="doc-stat"><div className="doc-stat__v">{c.log.length}</div><div className="doc-stat__l">úkonov v zázname</div></div>
                    <div className="doc-stat doc-stat--3"><div className="doc-stat__v">{(days.length * FEE_PER_DAY).toLocaleString('sk-SK')} Kč</div><div className="doc-stat__l">podklad pre výkon 51887 (ak ho poisťovňa uzná)</div></div>
                  </div>
                  {stillRunning.length > 0 && (
                    <p className="doc-small gpr-running">Sledujeme ďalej: {runningText}. Nová správa prípad znova otvorí.</p>
                  )}
                  <p className="doc-small" style={{ margin: '14px 0 0', color: 'var(--ink-2)' }}>
                    Výkon 51887 = {FEE_PER_DAY} Kč za jednu intervenciu koordinátora, ktorú uzná poisťovňa, najviac 1× denne na pacienta; vykazuje nemocnica.
                    {days.length > 0 && <> Záznam od {fmtDate(days[0])} do {fmtDate(days[days.length - 1])}.</>}
                  </p>
                  <button type="button" className="doc-btn doc-btn--block" style={{ marginTop: 14 }} onClick={openRecord}>
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
