// Strana praktika: „Odoslať pacienta do KOC“. Žiadny účet – ide e-mailom / eZprávou.
// Kontrola žiadanky prebehne ešte pred odoslaním; po odoslaní odíde automatické potvrdenie prijatia.
// Rám „Pohľad praktika“ (pieskový pruh, bez lišty koordinátora) kreslí Shell; táto stránka je len formulár a potvrdenie.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { CASES } from '../data/cases';
import { useNav } from '../nav';
import { DocHeader } from '../components/docs/DocHeader';
import { EmailPreview } from '../components/docs/EmailPreview';
import { useSource } from '../components/docs/useSource';
import { caseNumber, fmtDate, fullCase } from '../components/docs/docUtils';
import {
  IconAlert, IconArrowRight, IconBuilding, IconCheck, IconFile, IconInfo, IconSend, IconUpload, IconUser, IconX,
} from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './Intake.css';

interface Attached { id: string; name: string; meta: string; sample?: boolean; excerpt?: string }
type Phase = 'edit' | 'checking' | 'checked' | 'sent';

const KOC_FALLBACK = ['KOC 1 · Nemocnica Severní', 'KOC 2 · Nemocnica Lipová'];
const SAMPLE_DOC_ID = '07';
const OWN_FILE_NOTE = 'vlastný súbor · prototyp ho nečíta (kontrola beží len na ukážke, správa 07)';

function hospitalOf(koc: string): string {
  const parts = koc.split('·').map(s => s.trim());
  return parts[parts.length - 1] || koc;
}
/** Referral stage: the diagnosis is a suspicion until the MDT confirms it. */
function suspected(d: string): string {
  return /podozren|suspekt/i.test(d) ? d : `podozrenie na ${d}`;
}

export default function Intake() {
  const nav = useNav();
  const src = useSource();
  const c = fullCase();
  const kocs = useMemo(() => Array.from(new Set([...CASES.map(x => x.koc), ...KOC_FALLBACK])).sort(), []);
  const [koc, setKoc] = useState<string>(c?.koc ?? kocs[0]);
  const [files, setFiles] = useState<Attached[]>([]);
  const [over, setOver] = useState(false);
  const [phase, setPhase] = useState<Phase>('edit');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSample = files.some(f => f.sample);
  const ownOnly = files.length > 0 && !hasSample;
  const findings = useMemo(() => {
    if (!c) return [];
    if (c.precheck?.findings?.length) return c.precheck.findings;
    return c.fields.filter(f => f.status === 'missing').map(f => ({ text: `Chýba: ${f.label}`, severity: 'missing' as const }));
  }, [c]);
  const missingCount = findings.filter(f => f.severity === 'missing').length;
  const infoCount = findings.length - missingCount;
  const checked = phase === 'checked' && hasSample;
  const canSend = files.length > 0 && phase !== 'checking';

  // The check runs once the sample referral (správa 07) is attached.
  useEffect(() => {
    if (phase !== 'checking') return;
    const t = setTimeout(() => setPhase('checked'), 900);
    return () => clearTimeout(t);
  }, [phase]);

  function insertSample() {
    if (hasSample) return;
    const doc = src?.documents.find(d => d.id === SAMPLE_DOC_ID);
    const cdoc = c?.docs.find(d => d.id === SAMPLE_DOC_ID);
    const lines = (doc?.text ?? '').split('\n');
    const qi = lines.findIndex(l => /^ŽÁDOST/i.test(l.trim()));
    const excerpt = qi >= 0 ? (lines.slice(qi + 1).find(l => /^Žádám/i.test(l)) ?? lines[qi + 1]) : undefined;
    setFiles(fs => [...fs, {
      id: `sample-${SAMPLE_DOC_ID}`,
      name: doc?.file ?? `${SAMPLE_DOC_ID}_PL_zadost_KOC2.docx`,
      meta: `správa ${SAMPLE_DOC_ID} · ${cdoc?.title ?? 'Epikríza a žiadosť o prevzatie do starostlivosti KOC'} · ${fmtDate(cdoc?.examDate ?? doc?.date)}`,
      sample: true,
      excerpt,
    }]);
    setPhase('checking');
  }

  function addOwn(list: FileList | null) {
    if (!list) return;
    const added: Attached[] = Array.from(list).map((f, i) => ({ id: `own-${Date.now()}-${i}`, name: f.name, meta: OWN_FILE_NOTE }));
    if (added.length) setFiles(fs => [...fs, ...added]);
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setOver(false); addOwn(e.dataTransfer.files);
  }
  function remove(id: string) {
    setFiles(fs => fs.filter(f => f.id !== id));
    if (id.startsWith('sample')) setPhase('edit');
  }
  function send() {
    setPhase('sent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function reset() { setFiles([]); setPhase('edit'); }

  if (!c) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Strana praktika" title="Odoslať pacienta do KOC" />
        <div className="doc-card doc-muted">Demo prípad ešte nie je načítaný (src/data/cases.ts).</div>
      </div>
    );
  }

  const gp = c.referringGp;
  const requestDoc = c.docs.find(d => d.kind === 'request');
  const channel = requestDoc?.channel ?? 'e-mail';
  const caseNo = caseNumber(c);
  const hospital = hospitalOf(koc);
  // Fiktívny kontakt (rezervovaná doména example.cz, nie skutočná nemocnica).
  const coordinator = { name: 'Bc. Lucie Dvořáková', role: 'koordinátorka KOC', email: 'koordinator.koc2@example.cz', phone: '+420 261 000 150' };
  const patientName = `${c.patient.firstName} ${c.patient.lastName}`;
  const patientWord = c.patient.sex === 'žena' ? 'pacientka' : 'pacient';
  // Without an e-mail address in the referral, the confirmation goes back the way the referral came (reply).
  const recipient = gp.email ? `${gp.name} <${gp.email}>` : `${gp.name} · ${gp.practice} · odpoveď na žiadosť (${channel})`;

  if (phase === 'sent') {
    return (
      <div className="doc-page doc-reveal">
        <div className="doc-hero">
          <div className="doc-hero__ico"><IconCheck size={34} /></div>
          <h2>Prijaté</h2>
          <p>Prípad <strong>{caseNo}</strong> · {koc} · potvrdenie prijatia odišlo praktikovi automaticky</p>
        </div>

        <div className="doc-grid intake-sent">
          <EmailPreview
            from={`${coordinator.name} · ${hospital} <${coordinator.email}>`}
            to={recipient}
            subject={`Potvrdenie prijatia žiadosti · ${patientName} · prípad ${caseNo}`}
            channel={channel}
            sentAt={fmtDate(c.receivedAt)}
            footer="automatické potvrdenie · simulované"
          >
            <p>Dobrý deň, {/á$/.test(gp.name) ? 'pani doktorka' : 'pán doktor'},</p>
            <p>
              potvrdzujeme prijatie Vašej žiadosti o prevzatie do starostlivosti {koc} – {patientWord} <strong>{patientName}</strong> ({c.patient.age} r., ZP {c.patient.insurerCode}).
              Prípad sme založili pod číslom <strong>{caseNo}</strong> a koordinátorka ho prevzala.
            </p>
            <h4>Čo sme dostali</h4>
            <ul>{files.map(f => <li key={f.id}>{f.sample ? f.meta : f.name}</li>)}</ul>
            {hasSample && missingCount > 0 && (
              <>
                <h4>Čo chýba</h4>
                <ul>{findings.filter(f => f.severity === 'missing').map((f, i) => <li key={i}>{f.text}</li>)}</ul>
                <p>Chýbajúce správy si vyžiadame priamo z pracovísk uvedených v žiadosti. Ak ich máte poruke, stačí odpovedať na túto správu a priložiť ich.</p>
              </>
            )}
            {!hasSample && (
              <p className="doc-muted">Žiadosť prejde kontrolou úplnosti po prevzatí koordinátorkou. (V prototype sa vlastné súbory nečítajú – kontrola beží len na ukážke, správa 07.)</p>
            )}
            <h4>Kontakt koordinátora</h4>
            <p>{coordinator.name} · {coordinator.role}<br />{coordinator.email} · {coordinator.phone} <span className="doc-faint">(fiktívne)</span></p>
            <p className="doc-small doc-faint">Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka</p>
          </EmailPreview>

          <aside className="doc-rail">
            <div className="doc-card">
              <div className="doc-card__title">Čo sa stalo</div>
              <ul className="doc-list">
                <li><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span><span>Prípad {caseNo} založený vo fronte koordinátora, hodiny cesty bežia od {fmtDate(c.receivedAt)}.</span></li>
                <li><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span><span>Praktik dostal potvrdenie {hasSample ? 'a zoznam chýbajúceho ' : ''}tým istým kanálom ({channel}). Žiadny nový účet.</span></li>
                <li><span className="doc-list__ico doc-list__ico--accent"><IconArrowRight size={15} /></span><span>Na ťahu: koordinátorka · vyžiadať chýbajúce správy z pracovísk.</span></li>
              </ul>
              <hr className="doc-hr" />
              <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => nav.go({ page: 'case', caseId: c.id })}>
                Otvoriť prípad v appke koordinátora <IconArrowRight size={16} />
              </button>
              <button type="button" className="doc-btn doc-btn--text doc-btn--block" style={{ marginTop: 8 }} onClick={reset}>
                Odoslať ďalšieho pacienta
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-page">
      <DocHeader
        eyebrow="Strana praktika · bez účtu"
        title="Odoslať pacienta do KOC"
        subtitle={<>
          <span>Žiadosť odíde e-mailom alebo eZprávou, tak ako dnes.</span>
          <span className="doc-pill doc-pill--outline"><IconUser size={13} /> {gp.name} · {gp.practice}</span>
        </>}
      />

      <div className="doc-grid">
        <div>
          {/* 1 · KOC */}
          <section className="doc-card">
            <div className="doc-card__title"><span className="doc-stepno">1</span> Kam pacienta posielate</div>
            <div className="intake-koc" role="radiogroup" aria-label="Výber KOC">
              {kocs.map(k => (
                <button type="button" key={k} role="radio" aria-checked={koc === k}
                  className={`intake-koc__opt ${koc === k ? 'intake-koc__opt--on' : ''}`} onClick={() => setKoc(k)}>
                  <span className="intake-koc__ico"><IconBuilding size={18} /></span>
                  <span className="intake-koc__name">{k}</span>
                  <span className="intake-koc__check"><IconCheck size={14} /></span>
                </button>
              ))}
            </div>
          </section>

          {/* 2 · Dokumenty */}
          <section className="doc-card">
            <div className="doc-card__title"><span className="doc-stepno">2</span> Čo posielate</div>
            <div
              className={`drop ${over ? 'drop--over' : ''}`}
              onDragOver={e => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="drop__ico"><IconUpload size={22} /></div>
              <div className="drop__t">Pretiahnite sem epikrízu a správy</div>
              <div className="drop__s">PDF, DOCX alebo fotka papierovej správy · alebo kliknite a vyberte súbory</div>
              <div className="drop__actions" onClick={e => e.stopPropagation()}>
                <button type="button" className="doc-btn doc-btn--sm" onClick={insertSample} disabled={hasSample}>
                  <IconFile size={15} /> Vložiť ukážku (správa 07)
                </button>
              </div>
              <input ref={inputRef} type="file" multiple hidden onChange={e => { addOwn(e.target.files); e.target.value = ''; }} />
            </div>

            {files.length > 0 && (
              <div className="intake-files doc-reveal">
                {files.map(f => (
                  <div key={f.id} className="filechip">
                    <span className="filechip__ico"><IconFile size={18} /></span>
                    <div>
                      <div className="filechip__name">{f.name}</div>
                      <div className="filechip__meta">{f.meta}</div>
                      {f.excerpt && <div className="intake-excerpt">„{f.excerpt}“</div>}
                    </div>
                    <button type="button" className="filechip__rm" aria-label="Odstrániť" onClick={() => remove(f.id)}><IconX size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3 · Kontrola */}
          <section className="doc-card">
            <div className="doc-card__title">
              <span className="doc-stepno">3</span> Kontrola žiadanky
              {checked && (
                <span className="intake-counts">
                  {missingCount > 0 && <span className="doc-pill doc-pill--coral">{missingCount} chýba</span>}
                  {infoCount > 0 && <span className="doc-pill doc-pill--sky">{infoCount} na vedomie</span>}
                </span>
              )}
            </div>

            {files.length === 0 && (
              <p className="doc-muted" style={{ margin: 0 }}>Po vložení žiadosti hneď uvidíte, čo v nej chýba. Doplníte to teraz, nie o týždeň po telefonáte.</p>
            )}
            {ownOnly && (
              <p className="doc-muted" style={{ margin: 0 }}>
                <IconInfo size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                Vlastné súbory prototyp nečíta – kontrola úplnosti beží len na ukážke (správa 07). Odoslať môžete aj tak; žiadosť skontroluje koordinátorka po prevzatí.
              </p>
            )}
            {phase === 'checking' && (
              <p className="doc-muted intake-checking" style={{ margin: 0 }}><span className="doc-spin" /> Čítam žiadosť a porovnávam so zoznamom podkladov pre konzílium…</p>
            )}
            {checked && (
              <div className="doc-reveal">
                <div className="intake-found">
                  <span className="doc-faint doc-small">Zo žiadosti sme prečítali</span>
                  <span className="doc-pill">{patientName}, {c.patient.age} r.</span>
                  <span className="doc-pill">ZP {c.patient.insurerCode}</span>
                  <span className="doc-pill">{suspected(c.diagnosisShort)}</span>
                </div>
                <ul className="doc-list">
                  {findings.map((f, i) => (
                    <li key={i}>
                      <span className={`doc-list__ico ${f.severity === 'missing' ? 'doc-list__ico--coral' : 'doc-list__ico--sky'}`}>
                        {f.severity === 'missing' ? <IconAlert size={15} /> : <IconInfo size={15} />}
                      </span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="doc-small doc-muted" style={{ margin: '14px 0 0' }}>
                  Odoslať môžete aj tak. Čo máte poruke, pridajte teraz; zvyšok si vyžiada koordinátorka. Diagnózu potvrdí až konzílium.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Rail */}
        <aside className="doc-rail">
          <div className="doc-card">
            <div className="doc-card__title">Zhrnutie</div>
            <dl className="doc-kv">
              <dt>Kam</dt><dd>{koc}</dd>
              <dt>Kanál</dt><dd>{channel}</dd>
              <dt>Súbory</dt><dd>{files.length === 0 ? <span className="doc-faint">zatiaľ žiadne</span> : files.length}</dd>
              <dt>Kontrola</dt>
              <dd>
                {checked
                  ? (missingCount ? <span className="doc-missing">{missingCount}× chýba</span> : <span style={{ color: 'var(--mint)' }}>v poriadku</span>)
                  : ownOnly
                    ? <span className="doc-faint">len pri ukážke</span>
                    : <span className="doc-faint">čaká na žiadosť</span>}
              </dd>
            </dl>
            <hr className="doc-hr" />
            <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={send} disabled={!canSend}>
              <IconSend size={16} /> Odoslať
            </button>
            <p className="doc-small doc-faint" style={{ margin: '10px 0 0', textAlign: 'center' }}>
              {files.length === 0 ? 'Najprv vložte žiadosť (ukážku alebo vlastný súbor).' : 'Praktik hneď dostane potvrdenie prijatia s číslom prípadu.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
