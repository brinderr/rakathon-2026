// „Závěr pro praktika“: původní otázka praktika → zápis konzilia (vzor VZP „MDT zaver“ doslovně) →
// „Co to znamená pro vás, pane doktore“, podpis/razítko nemocnice (§ 55a), odeslání s doručenkou,
// směrování reviznímu lékaři ZP 211, uzavření případu se záznamem o koordinování (dny se zásahem = podklad pro výkon 51887).
// Stránka ukazuje stav PO konziliu – při „dnes“ 19. 10. je to ukázka a říká to nahlas.
import { useEffect, useMemo, useState } from 'react';
import { useNav } from '../nav';
import { DEMO_TODAY } from '../types';
import type { LogEntry } from '../types';
import { DocHeader } from '../components/docs/DocHeader';
import { DeliveryTimeline } from '../components/docs/DeliveryTimeline';
import { useCaseSessionSafe } from '../components/docs/useCaseSessionSafe';
import { useSource } from '../components/docs/useSource';
import type { DeliveryStep } from '../components/docs/DeliveryTimeline';
import { addDays, billableDays, docById, findCase, fmtDate, PROTO_NOTE } from '../components/docs/docUtils';
import { stepStateAt } from '../components/case/caseUtils';
import { IconArrowDown, IconArrowRight, IconCheck, IconClock, IconFlag, IconList, IconQuote, IconSend, IconShield, IconStamp } from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './GpReport.css';

type Stage = 'draft' | 'sending' | 'sent' | 'delivered' | 'confirmed' | 'closed';
const CHANNEL = 'eZpráva';

/**
 * „Co to znamená pro vás, pane doktore“ – česky, jednoduše, jen to, co stojí v zápisu konzilia (vzor VZP „MDT zaver“)
 * a ve zprávách. Žádné vlastní doporučení léčby. Pro jiný případ se použije text z dat případu.
 */
const FOR_YOU_CS: Record<string, string[]> = {
  alena: [
    'Konzilium doporučuje nejprve chemoterapii (neoadjuvantní). Další krok: termín na onkologickém konziliu 4. 11. 2026 v 10:30 (MUDr. Kalous). Před zahájením léčby konzilium žádá stanovit ECOG, doplnit krevní obraz, jaterní a renální parametry, ionty a CA 19-9 a posoudit žlučové cesty. Termíny zařídí koordinátorka KOC, Bc. Lucie Dvořáková.',
    'Apixaban: pacientka jej nemá vysazovat sama. Postup před každým invazivním výkonem určí lékař, který výkon provádí, podle krvácivého rizika a renálních funkcí.',
    'Na co dát pozor: horečka, zimnice, přibývající žloutenka nebo zhoršení celkového stavu – v takovém případě neodkladně lékařské vyšetření. Biliární drenáž zatím ve zprávách doložena není.',
    'Bolest, výživa, psychika: konzilium doporučuje nutriční intervenci, zhodnocení bolesti s úpravou analgetické léčby a psychoonkologickou podporu. Vaši prosbu o psychologickou podporu jsme vyřídili – termín 27. 10. 2026.',
  ],
};

/** The sample „MDT zaver“ split into its blocks: preamble, upper-case headings with their lines, signature. */
interface ZaverBlock { heading?: string; lines: string[] }
function parseZaver(text: string): { title?: string; blocks: ZaverBlock[] } {
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
  const isHeading = (l: string) => /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ ]{5,}$/.test(l);
  const blocks: ZaverBlock[] = [];
  let cur: ZaverBlock = { lines: [] };
  let title: string | undefined;
  for (const l of lines) {
    if (!blocks.length && !cur.heading && /^Zápis z jednání/i.test(l)) { title = l; continue; }
    if (isHeading(l)) { if (cur.lines.length || cur.heading) blocks.push(cur); cur = { heading: l, lines: [] }; continue; }
    cur.lines.push(l);
  }
  if (cur.lines.length || cur.heading) blocks.push(cur);
  // signature lines after the last section („V Praze dne …“) go to their own block
  const last = blocks[blocks.length - 1];
  if (last?.heading) {
    const i = last.lines.findIndex(l => /^V \S.* dne /.test(l));
    if (i > 0) { blocks.push({ lines: last.lines.slice(i) }); last.lines = last.lines.slice(0, i); }
  }
  return { title, blocks };
}

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
  const src = useSource();
  // Shared demo session: a closed case stays closed in the queue and in the case header (R3 B6).
  const [session, act] = useCaseSessionSafe(c?.id);
  const [stage, setStage] = useState<Stage>(() => (session.closedAt ? 'closed' : 'draft'));

  // Delivery receipt: odesláno → doručeno → potvrzeno (timing of the prototype)
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
  // The verbatim sample record belongs to THIS case only (Alena has docId 'MDT'); other cases use their own data.
  const hasOwnMdt = !!c?.docs.some(d => d.id === 'MDT');
  const zaver = useMemo(() => (hasOwnMdt && src?.templates?.['MDT zaver'] ? parseZaver(src.templates['MDT zaver']) : null), [hasOwnMdt, src]);

  // The page shows the state after the MDT: move "stav k datu" to the MDT day so the case screens agree.
  const { asOf, setAsOf } = nav;
  useEffect(() => {
    if (afterMdt && asOf < mdt) setAsOf(mdt);
  }, [afterMdt, mdt, asOf, setAsOf]);

  // Times come from the coordination record (one source of truth); fallbacks only when the record has no such entry.
  const log = c?.log ?? [];
  const sentEntry = findLog(log, /z[áa]v[eě]r (odoslan|odeslán)/i);
  const confirmEntry = findLog(log, /praktik potvrdil/i);
  const reviewerEntry = findLog(log, /rev[íi]zn/i);
  const sentDate = sentEntry?.date ?? mdt;
  const sentTime = sentEntry?.time ?? '16:40';
  const lastLogDate = log.length ? [...log].map(l => l.date).sort()[log.length - 1] : mdt;
  const steps: DeliveryStep[] = useMemo(() => [
    { label: 'Odesláno', detail: `${CHANNEL} · zapečetěno nemocnicí`, time: `${fmtDate(sentDate)} ${sentTime}` },
    { label: 'Doručeno', detail: 'schránka ordinace praktika', time: `${fmtDate(sentDate)} ${plusMinute(sentTime)}` },
    { label: 'Potvrzeno', detail: 'praktik otevřel a potvrdil', time: confirmEntry ? `${fmtDate(confirmEntry.date)} ${confirmEntry.time ?? ''}`.trim() : `${fmtDate(addDays(sentDate, 1))} 08:15` },
  ], [sentDate, sentTime, confirmEntry]);
  const reached = stage === 'sent' ? 0 : stage === 'delivered' ? 1 : stage === 'confirmed' || stage === 'closed' ? 2 : -1;

  if (!c) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Závěr pro praktika" title="Případ se nenašel" back={{ label: 'Zpět na frontu', onClick: () => nav.go({ page: 'queue' }) }} />
      </div>
    );
  }

  const gp = c.referringGp;
  const patient = `${c.patient.firstName} ${c.patient.lastName}`;
  const female = c.patient.sex === 'žena';
  const gpFemale = /á$/.test(gp.name.trim().split(/\s+/).pop() ?? ''); // „Šťastná“ → paní doktorko
  const reviewer = c.reviewer ?? { insurerCode: c.patient.insurerCode, insurerName: c.patient.insurerName, note: '' };
  const isVzp = reviewer.insurerCode === '111';
  const insurerShort = reviewer.insurerName.replace(/^Zdravotní pojišťovna ministerstva vnitra ČR$/i, 'ZP MV ČR').replace(/^Všeobecná zdravotní pojišťovna ČR$/i, 'VZP ČR');
  const questionCite = rep?.citations.find(ci => docById(c, ci.docId)?.kind === 'request') ?? rep?.citations[0];
  const questionDoc = docById(c, questionCite?.docId);
  const answerDocs = Array.from(new Set((rep?.citations ?? []).map(ci => ci.docId)))
    .filter(id => id !== questionCite?.docId).map(id => docById(c, id)).filter((d): d is NonNullable<typeof d> => !!d);
  const forYou = FOR_YOU_CS[c.id] ?? rep?.forYou ?? [];
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
  // dates end with a period („26. 10.“), so the sentence period is added only when the text does not end with one
  const runningList = stillRunning.map(s => `${s.title.replace(/\s*\(.*\)$/, '')} ${fmtDate(s.due).replace(/ \d{4}$/, '')}`).join(', ');
  const runningText = runningList.replace(/\.$/, '');
  // ECOG came into the handover before the MDT, but the (fictional VZP) MDT record still asks for it (QA R5 #13).
  const ecog = session.overrides.performance?.kind === 'resolved' ? session.overrides.performance : undefined;
  const closeCase = () => {
    setAsOf(lastLogDate);
    setStage('closed');
    if (!session.closedAt) {
      act.addLog({ date: closeDate, time: confirmEntry?.time ? plusMinute(confirmEntry.time) : undefined, action: 'Případ uzavřen', detail: `Závěr doručen praktikovi, souhrn reviznímu lékaři ZP ${reviewer.insurerCode}. Záznam o koordinování: ${days.length} dní se zásahem.`, billable: false });
    }
    act.close(closeDate);
  };

  return (
    <div className="doc-page gpr">
      <DocHeader
        eyebrow="Závěr pro praktika"
        title={patient}
        subtitle={<>
          <span>Adresát: {gp.name} · {gp.practice}</span>
          <span className="doc-pill doc-pill--outline"><IconSend size={13} /> kanál {CHANNEL}</span>
          <span className="doc-pill doc-pill--outline">konzilium {fmtDate(mdt)}</span>
          {stage === 'closed' && <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> případ uzavřen</span>}
        </>}
        back={{ label: 'Zpět na případ', onClick: () => nav.go({ page: 'case', caseId: c.id }) }}
      />

      {afterMdt && (
        <div className="doc-notice">
          <IconClock size={15} />
          <span>Ukázka stavu <strong>po konziliu {fmtDate(mdt)}</strong> (dnes je {fmtDate(DEMO_TODAY)}). Zápis konzilia je fiktivní vzor VZP „MDT zaver“.</span>
        </div>
      )}

      <div className="doc-grid">
        {/* ---------- The document ---------- */}
        <article className="paper gpr-paper">
          <div className="paper__head">
            <div>
              <div className="paper__org">{c.koc} · Komplexní onkologické centrum · multidisciplinární tým</div>
              <h2 className="paper__title">Závěr konzilia pro praktického lékaře</h2>
              <div className="doc-small doc-muted" style={{ marginTop: 4 }}>Podle vzoru VZP „MDT zaver“ · konzilium {fmtDate(mdt)}</div>
            </div>
            <div className="paper__meta">
              <strong>{patient}</strong>
              {c.patient.age} let · ZP {c.patient.insurerCode}<br />
              {gp.name}
            </div>
          </div>

          {!rep ? (
            <div className="paper-placeholder">Závěr konzilia ještě není v případu zapsán. Doplní se po jednání {fmtDate(mdt)}.</div>
          ) : (
            <>
              <section className="gpr-q">
                <div className="gpr-q__label"><IconQuote size={16} /> Vaše původní otázka</div>
                <blockquote className="gpr-q__quote">„{rep.question}“</blockquote>
                {questionDoc && (
                  <div className="gpr-q__src">Ze žádosti o převzetí · {/^\d+$/.test(questionDoc.id) ? `zpráva ${questionDoc.id} · ` : ''}{questionDoc.title} · {fmtDate(questionDoc.examDate)}</div>
                )}
              </section>

              <div className="gpr-arrow"><span className="gpr-arrow__dot"><IconArrowDown size={16} /></span><span>Odpověď konzilia {fmtDate(mdt)}</span></div>

              <section className="gpr-a">
                <div className="gpr-a__label">Zápis z jednání konzilia (doslovně)</div>
                {zaver ? (
                  <div className="gpr-zaver">
                    {zaver.title && <div className="gpr-zaver__title">{zaver.title}</div>}
                    {zaver.blocks.map((b, i) => (
                      <div key={i} className={`gpr-zaver__block ${!b.heading ? 'gpr-zaver__block--plain' : ''}`}>
                        {b.heading && <div className="gpr-zaver__h">{b.heading}</div>}
                        {b.lines.map((l, j) => <p key={j} className="gpr-zaver__line">{l}</p>)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="gpr-a__text">{rep.answer}</p>
                )}
                {answerDocs.length > 0 && (
                  <div className="gpr-a__src">
                    <span className="doc-faint doc-small">Opírá se o</span>
                    {answerDocs.map(d => (
                      <span key={d.id} className="doc-pill doc-pill--outline">
                        {/^\d+$/.test(d.id) ? `zpráva ${d.id} · ` : ''}{d.title} · {fmtDate(d.examDate)}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="gpr-foryou">
                <div className="gpr-foryou__title">Co to znamená pro vás, {gpFemale ? 'paní doktorko' : 'pane doktore'}</div>
                <ul className="doc-list">
                  {forYou.map((t, i) => (
                    <li key={i}><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span>
                      <span>{t}
                        {i === 0 && ecog && /ECOG/.test(t) && (
                          <span className="gpr-aside">{ecog.value} byl v podkladu od {fmtDate(ecog.date)} ({ecog.note || `zpráva ${ecog.docId}`}). Zápis konzilia je fiktivní vzor VZP a ECOG ještě neuvádí.</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="doc-small doc-muted" style={{ margin: '12px 0 0' }}>Jen to, co je v zápisu konzilia a ve zprávách. Nic domyšleného, žádné vlastní doporučení léčby.</p>
              </section>
            </>
          )}

          <section className={`gpr-sign ${sealed ? 'gpr-sign--sealed' : ''}`}>
            <span className="gpr-sign__ico"><IconStamp size={22} /></span>
            <div>
              <div className="gpr-sign__t">Podpis / razítko nemocnice</div>
              <div className="doc-small doc-muted">
                {sealed
                  ? <>Zapečetěno v nemocničním systému · {fmtDate(sentDate)}</>
                  : <>(§ 55a odst. 4 zák. č. 372/2011 Sb.: časové razítko a pečeť nemocnice nebo uznávaný podpis zdravotníka – ne náš e-mail)</>}
              </div>
            </div>
            {sealed && <span className="doc-pill doc-pill--mint gpr-sign__pill"><IconCheck size={13} /> podepsáno</span>}
          </section>

          <div className="paper__foot"><span>{PROTO_NOTE}</span><span>Zdroj: zápis konzilia {fmtDate(mdt)} · adresát {gp.name}</span></div>
        </article>

        {/* ---------- Rail ---------- */}
        <aside className="doc-rail gpr-rail">
          <div className="doc-card">
            <div className="doc-card__title"><IconSend size={16} /> Odeslání praktikovi</div>
            {!sent ? (
              <>
                <ul className="doc-list doc-small">
                  <li><span className="doc-list__ico doc-list__ico--accent"><IconSend size={14} /></span><span>Kanál {CHANNEL}, do schránky ordinace. Praktik nepotřebuje žádný účet.</span></li>
                  <li><span className="doc-list__ico doc-list__ico--sky"><IconClock size={14} /></span><span>Doručení se doloží doručenkou: odesláno → doručeno → praktik potvrdil.</span></li>
                </ul>
                <hr className="doc-hr" />
                <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => setStage('sending')} disabled={!rep}>
                  <IconSend size={16} /> Odeslat
                </button>
                {!rep && <p className="doc-small doc-faint" style={{ margin: '10px 0 0', textAlign: 'center' }}>Odeslat bude možné po zápisu z konzilia.</p>}
              </>
            ) : (
              <>
                <DeliveryTimeline steps={steps} reached={reached} inFlight={!done} />
                <p className="doc-small doc-muted" style={{ margin: '14px 0 0' }}>
                  {done
                    ? <>Odesláno {fmtDate(sentDate)}. Doručení doloženo.</>
                    : 'Čekám na doručení…'}
                </p>
              </>
            )}
          </div>

          <div className="doc-card gpr-reviewer">
            <div className="doc-card__title"><IconShield size={16} /> Revizní lékař</div>
            <p className="gpr-reviewer__text">
              ZP <strong>{reviewer.insurerCode}</strong> ({insurerShort}){isVzp ? '' : ', ne VZP'} → souhrn jde reviznímu lékaři ZP {reviewer.insurerCode}.
            </p>
            <div className="gpr-reviewer__items">
              <span className="doc-pill">diagnóza s kódem MKN-10</span>
              <span className="doc-pill">závěr konzilia</span>
              <span className="doc-pill">plánovaná léčba</span>
            </div>
            <div className="gpr-reviewer__status">
              {sealed
                ? <span className="doc-pill doc-pill--mint"><IconCheck size={13} /> souhrn odeslán · {fmtDate(reviewerEntry?.date ?? sentDate)}</span>
                : <span className="doc-pill doc-pill--outline"><IconClock size={13} /> odešle se spolu se závěrem · kanál v ČR není ověřen</span>}
            </div>
          </div>

          {done && (
            <div className={`doc-card doc-reveal ${stage === 'closed' ? 'doc-card--pastel' : ''}`}>
              {stage === 'confirmed' ? (
                <>
                  <div className="doc-card__title"><IconFlag size={16} /> Závěr doručen</div>
                  <p className="doc-small doc-muted" style={{ margin: '0 0 14px' }}>
                    Praktik potvrdil doručení, revizní lékař má souhrn. {female ? 'Pacientka' : 'Pacient'} má termín na další krok. Případ můžete uzavřít; vznikne záznam o koordinování.
                  </p>
                  {stillRunning.length > 0 && (
                    <p className="doc-small gpr-running">
                      Po konziliu ještě {stillRunning.length === 1 ? 'běží 1 krok' : `běží ${stillRunning.length} kroky`}: {runningText}. Až přijde jejich zpráva, případ se sám znovu otevře a ukáže ji.
                    </p>
                  )}
                  <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={closeCase}>
                    <IconCheck size={16} /> Uzavřít případ
                  </button>
                </>
              ) : (
                <>
                  <div className="doc-card__title"><IconList size={16} /> Záznam o koordinování vytvořen</div>
                  <div className="doc-stats gpr-stats">
                    <div className="doc-stat doc-stat--1"><div className="doc-stat__v">{days.length}</div><div className="doc-stat__l">dní se zásahem koordinátorky</div></div>
                    <div className="doc-stat"><div className="doc-stat__v">{c.log.length}</div><div className="doc-stat__l">úkonů v záznamu</div></div>
                  </div>
                  {stillRunning.length > 0 && (
                    <p className="doc-small gpr-running">Sledujeme dál: {runningText}. Nová zpráva případ znovu otevře.</p>
                  )}
                  <p className="doc-small" style={{ margin: '14px 0 0', color: 'var(--ink-2)' }}>
                    Dny se zásahem jsou podklad pro vykázání výkonu 51887 (vykazuje nemocnice, uznává pojišťovna).
                    {days.length > 0 && <> Záznam od {fmtDate(days[0])} do {fmtDate(days[days.length - 1])}.</>}
                  </p>
                  <button type="button" className="doc-btn doc-btn--block" style={{ marginTop: 14 }} onClick={openRecord}>
                    Otevřít záznam o koordinování <IconArrowRight size={15} />
                  </button>
                  <button type="button" className="doc-btn doc-btn--text doc-btn--block" style={{ marginTop: 6 }} onClick={() => nav.go({ page: 'queue' })}>
                    Zpět na frontu
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
