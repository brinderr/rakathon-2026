// Strana praktika: „Odeslat pacienta do KOC“. Žádný účet – jde e-mailem / eZprávou jako dnes.
// Kontrola žádanky proběhne ještě před odesláním a je SKUTEČNÁ a deterministická: jednoduchá pravidla níže
// projdou vložený text a ke každé položce šablony VZP „Handover_obsah“ řeknou, zda v textu je (s doslovným
// úryvkem), nebo chybí. Nic se nedomýšlí. Po odeslání odejde automatické potvrzení přijetí.
// Rám „Pohled praktika“ (pískový pruh, bez lišty koordinátorky) kreslí Shell; tato stránka je jen formulář a potvrzení.
import { useMemo, useState } from 'react';
import { CASES } from '../data/cases';
import { useNav } from '../nav';
import { DocHeader } from '../components/docs/DocHeader';
import { EmailPreview } from '../components/docs/EmailPreview';
import { useSource } from '../components/docs/useSource';
import { caseNumber, fmtDate, fullCase } from '../components/docs/docUtils';
import {
  IconAlert, IconArrowRight, IconBuilding, IconCheck, IconFile, IconInfo, IconSend, IconUser, IconX,
} from '../components/docs/DocIcons';
import '../components/docs/docs.css';
import './Intake.css';

type Phase = 'edit' | 'sent';

const KOC_FALLBACK = ['KOC 1 · Nemocnice Severní', 'KOC 2 · Nemocnice Lipová'];
const SAMPLE_DOC_ID = '07';

function hospitalOf(koc: string): string {
  const parts = koc.split('·').map(s => s.trim());
  return parts[parts.length - 1] || koc;
}

/* ------------------------------------------------------------------------------------------------
   Kontrola podle šablony VZP „Handover_obsah“ – pravidla nad textem žádanky (bez serveru, bez AI).
   Každá položka: v textu je (doslovný úryvek) / chybí. Položky „pokud již existuje“ jsou na vědomí. */
export interface CheckItem {
  group: string;
  label: string;          // položka šablony Handover_obsah (znění šablony)
  found: boolean;
  snippet?: string;       // doslovný úryvek z textu
  note?: string;          // vysvětlení pro laika
  optional?: boolean;     // položka, která v žádosti být nemusí („pokud již existuje“)
}

/** The sentence (or line) around a match, trimmed to ~160 characters. */
function sentenceAt(text: string, index: number, length: number): string {
  const start = Math.max(text.lastIndexOf('\n', index), text.lastIndexOf('. ', index) + 1, 0);
  let end = text.indexOf('\n', index + length);
  const dot = text.indexOf('. ', index + length);
  if (dot >= 0 && (end < 0 || dot + 1 < end)) end = dot + 1;
  if (end < 0) end = text.length;
  const s = text.slice(start, end).trim();
  return s.length > 160 ? `${s.slice(0, 157).trim()}…` : s;
}
const lineOf = (m: RegExpMatchArray | null) => (m ? m[0].trim() : undefined);

export function checkReferral(text: string): CheckItem[] {
  const t = text.replace(/\r/g, '');
  const find = (re: RegExp) => t.match(re);
  const around = (re: RegExp): string | undefined => {
    const m = re.exec(t);
    return m ? sentenceAt(t, m.index, m[0].length) : undefined;
  };
  const items: CheckItem[] = [];
  const push = (group: string, label: string, snippet: string | undefined, extra: Partial<CheckItem> = {}) =>
    items.push({ group, label, found: !!snippet, snippet, ...extra });

  /* Nacionále pacienta */
  const N = 'Nacionále pacienta';
  const name = find(/^Pacient(?:ka)?:\s*([^\n,]+)/m);
  push(N, 'jméno a příjmení', lineOf(name));
  push(N, 'věk', lineOf(find(/^Datum narození:\s*.+$/m)) ?? lineOf(find(/\(\d{1,3}\s*let\)/)) ?? lineOf(find(/\b\d{1,3}let[áý]\b/)));
  const female = /\bpacientk[aouy]\b/i.test(t);
  const male = !female && /\bpacient[aueo]?\b/i.test(t);
  push(N, 'pohlaví', female ? 'pacientka' : male ? 'pacient' : undefined,
    { note: female || male ? `odvozeno ze slova „${female ? 'pacientka' : 'pacient'}“ – v žádosti není jako samostatný údaj` : undefined });
  push(N, 'číslo zdravotní pojišťovny', lineOf(find(/^Zdravotní pojišťovna:\s*\d{3}/m)) ?? lineOf(find(/\bZP\s*\d{3}\b/)));

  /* Kontakty */
  const K = 'Kontakty';
  const phone = lineOf(find(/^Telefon:\s*.+$/m));
  const mail = lineOf(find(/^E-?mail:\s*\S+@\S+/mi));
  push(K, 'kontakt na pacienta', phone ?? mail, { note: phone && !mail ? 'telefon ano, e-mail pacienta v žádosti není' : undefined });
  push(K, 'kontaktní osoba + tel. číslo', lineOf(find(/^Kontaktní osoba:\s*.+$/m)));

  /* Diagnóza a anamnéza */
  const D = 'Diagnóza';
  push(D, 'Diagnóza', lineOf(find(/^(?:Suspektní |Pracovní )?[Dd]iagn[oó]za:\s*.+$/m)) ?? around(/\b[A-Z]\d{2}(?:\.\d)?\s*[–-]\s*\S/));
  const epi = /^EPIKR[IÍ]ZA\s*$/m.exec(t);
  push(D, 'Epikríza (stručný souhrn nemoci)', epi ? sentenceAt(t, epi.index + epi[0].length + 1, 0) : undefined);
  push(D, 'Požadavek/otázka na MDT', lineOf(find(/^(?:Žádám|Prosím|Žádost|Otázka)\b.+$/m)));
  push(D, 'Komorbidity (OA)', lineOf(find(/^OA:\s*.+$/m)));
  push(D, 'Léková anamnéza (FA)', lineOf(find(/^FA:\s*.+$/m)));
  push(D, 'Alergie (AA)', lineOf(find(/^AA:\s*.+$/m)));

  /* Stav */
  const S = 'Stav pacienta';
  push(S, 'Stav výkonnosti (PS/Karnofského skóre)', around(/\bECOG\s*[0-4]\b|Karnofsk\w*\s*\d{2,3}|\bPS\s*[0-4]\b/i),
    { note: 'ECOG ani Karnofského skóre v textu není; „soběstačná“ není skóre' });
  const w = around(/\b\d{2,3}(?:,\d)?\s*kg\b/i);
  const h = around(/\b1\d{2}\s*cm\b/i);
  push(S, 'Váha a výška pacienta', w && h ? (w === h ? w : `${w} · ${h}`) : undefined,
    { note: w && !h ? 'jen váha, výška chybí' : h && !w ? 'jen výška, váha chybí' : !w && !h ? 'číslo v kg ani v cm v textu není' : undefined });
  push(S, 'Symptomy (příznaky) nemoci a jejich počátek', around(/\b(?:bolest\w*|obtíž\w*|příznak\w*|teplot\w*|nechutenství|úbytek hmotnosti)\b/i));

  /* Provedená vyšetření */
  const V = 'Provedená vyšetření';
  const list = t.match(/^\d+\.\s.+$/gm) ?? [];
  const head = lineOf(find(/^PROVEDENÁ VYŠETŘENÍ.*$/m));
  push(V, 'datum, místo a typ vyšetření', list.length ? `${list.length}× (např. ${list[0]?.trim() ?? ''})` : head);
  const results = around(/^(?:POPIS|ZÁVĚR|NÁLEZ|Závěr:|Výsledek:|Nález:)/m);
  push(V, 'popis výsledků v plném znění', results,
    { note: !results && /K DISPOZICI NA JEDNOTLIVÝCH PRACOVIŠTÍCH/i.test(t) ? 'podle žádosti jsou výsledky na jednotlivých pracovištích – nejsou přiloženy' : undefined });
  push('Laboratoř', 'Laboratorní výsledky včetně onkomarkerů (TM)',
    around(/\d+(?:,\d+)?\s*(?:µmol\/l|mmol\/l|g\/l|kU\/l|µkat\/l|mg\/l|µg\/l|10⁹\/l)/) ?? around(/CA\s?19-9\s*\d/),
    { note: 'žádná laboratorní hodnota s jednotkou v textu není' });
  const histo = around(/\b(?:adenokarcinom\w*|karcinom\w*|histologick[ýáé]\s+(?:nález|výsledek)|MKN-O)\b/i);
  push('Histologie', 'Histologie (pokud již existuje)', histo,
    { optional: true, note: !histo && /histologick/i.test(t) ? 'v žádosti je jen požadavek na histologickou verifikaci, výsledek ještě neexistuje' : undefined });
  push('Jiná důležitá sdělení', 'Jiná důležitá sdělení včetně přání pacienta', around(/\b(?:souhlasí|nesouhlasí|přeje si|přání|informován[aá]?|upozorňuji)\b/i));
  return items;
}

/** Headline values read from the text for the chips „Ze žádosti jsme přečetli“ (only what the rules found). */
export function readHeadline(text: string): { name?: string; age?: string; insurer?: string; diagnosis?: string; sender?: string } {
  const name = text.match(/^Pacient(?:ka)?:\s*([^\n,]+)/m)?.[1]?.trim();
  const age = text.match(/\((\d{1,3})\s*let\)/)?.[1] ?? text.match(/\b(\d{1,3})let[áý]\b/)?.[1];
  const insurer = text.match(/^Zdravotní pojišťovna:\s*(\d{3})/m)?.[1] ?? text.match(/\bZP\s*(\d{3})\b/)?.[1];
  const diagnosis = text.match(/^(?:Suspektní |Pracovní )?[Dd]iagn[oó]za:\s*(.+)$/m)?.[1]?.trim();
  const sender = text.match(/^((?:MUDr|MDDr|doc|prof)\.\s[^\n,]+)$/m)?.[1]?.trim();
  return { name, age, insurer, diagnosis, sender };
}

export default function Intake() {
  const nav = useNav();
  const src = useSource();
  const c = fullCase();
  const kocs = useMemo(() => Array.from(new Set([...CASES.map(x => x.koc), ...KOC_FALLBACK])).sort(), []);
  const [koc, setKoc] = useState<string>(c?.koc ?? kocs[0]);
  const [text, setText] = useState('');
  const [isSample, setIsSample] = useState(false);
  const [phase, setPhase] = useState<Phase>('edit');

  const sampleDoc = src?.documents.find(d => d.id === SAMPLE_DOC_ID);
  const hasText = text.trim().length > 0;
  const items = useMemo(() => (hasText ? checkReferral(text) : []), [text, hasText]);
  const head = useMemo(() => (hasText ? readHeadline(text) : {}), [text, hasText]);
  const missing = items.filter(i => !i.found && !i.optional);
  const fyi = items.filter(i => !i.found && i.optional);
  const foundCount = items.filter(i => i.found).length;
  const groups = useMemo(() => {
    const out: { group: string; items: CheckItem[] }[] = [];
    for (const it of items) {
      const g = out.find(x => x.group === it.group);
      if (g) g.items.push(it); else out.push({ group: it.group, items: [it] });
    }
    return out;
  }, [items]);

  function insertSample() {
    if (!sampleDoc) return;
    setText(sampleDoc.text);
    setIsSample(true);
  }
  function clear() { setText(''); setIsSample(false); }
  function send() {
    setPhase('sent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function reset() { clear(); setPhase('edit'); }

  if (!c) {
    return (
      <div className="doc-page">
        <DocHeader eyebrow="Strana praktika" title="Odeslat pacienta do KOC" />
        <div className="doc-card doc-muted">Demo případ ještě není načten (src/data/cases.ts).</div>
      </div>
    );
  }

  const gp = c.referringGp;
  const requestDoc = c.docs.find(d => d.kind === 'request');
  const channel = requestDoc?.channel ?? 'e-mail';
  const caseNo = caseNumber(c);
  const hospital = hospitalOf(koc);
  // Fiktivní kontakt (rezervovaná doména example.cz, ne skutečná nemocnice).
  const coordinator = { name: 'Bc. Lucie Dvořáková', role: 'koordinátorka KOC', email: 'koordinator.koc2@example.cz', phone: '+420 261 000 150' };
  const senderName = head.sender ?? gp.name;
  const senderFemale = /á$/.test(senderName.trim().split(/\s+/).pop() ?? '');
  const patientName = head.name ?? `${c.patient.firstName} ${c.patient.lastName}`;
  const patientWord = /\bpacientk/i.test(text) || (!head.name && c.patient.sex === 'žena') ? 'pacientka' : 'pacient';
  // Without an e-mail address in the referral, the confirmation goes back the way the referral came (reply).
  const recipient = gp.email ? `${senderName} <${gp.email}>` : `${senderName} · odpověď na žádost (${channel})`;
  const sampleLabel = `zpráva ${SAMPLE_DOC_ID} · ${sampleDoc?.file ?? ''} · ${fmtDate(sampleDoc?.date)}`;

  if (phase === 'sent') {
    return (
      <div className="doc-page doc-reveal">
        <div className="doc-hero">
          <div className="doc-hero__ico"><IconCheck size={34} /></div>
          <h2>Přijato</h2>
          <p>Případ <strong>{caseNo}</strong> · {koc} · potvrzení přijetí odešlo praktikovi automaticky</p>
        </div>

        <div className="doc-grid intake-sent">
          <EmailPreview
            from={`${coordinator.name} · ${hospital} <${coordinator.email}>`}
            to={recipient}
            subject={`Potvrzení přijetí žádosti · ${patientName} · případ ${caseNo}`}
            channel={channel}
            sentAt={fmtDate(c.receivedAt)}
            footer="automatické potvrzení přijetí"
          >
            <p>Dobrý den, {senderFemale ? 'paní doktorko' : 'pane doktore'},</p>
            <p>
              potvrzujeme přijetí Vaší žádosti o převzetí do péče {koc} – {patientWord} <strong>{patientName}</strong>
              {head.age ? ` (${head.age} let${head.insurer ? `, ZP ${head.insurer}` : ''})` : head.insurer ? ` (ZP ${head.insurer})` : ''}.
              Případ jsme založili pod číslem <strong>{caseNo}</strong> a koordinátorka jej převzala.
            </p>
            <h4>Co jsme dostali</h4>
            <ul><li>{isSample ? sampleLabel : `text žádanky (${text.trim().length} znaků)`} · {foundCount} z {items.length} položek podkladu v textu je</li></ul>
            {missing.length > 0 && (
              <>
                <h4>Co chybí</h4>
                <ul>{missing.map(i => <li key={i.label}>{i.label}{i.note ? ` – ${i.note}` : ''}</li>)}</ul>
                <p>Chybějící zprávy si vyžádáme přímo z pracovišť uvedených v žádosti. Pokud je máte po ruce, stačí odpovědět na tuto zprávu a přiložit je.</p>
              </>
            )}
            <h4>Kontakt koordinátorky</h4>
            <p>{coordinator.name} · {coordinator.role}<br />{coordinator.email} · {coordinator.phone}</p>
          </EmailPreview>

          <aside className="doc-rail">
            <div className="doc-card">
              <div className="doc-card__title">Co se stalo</div>
              <ul className="doc-list">
                <li><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span><span>Případ {caseNo} založen ve frontě koordinátorky, dny od přijetí žádosti se počítají od {fmtDate(c.receivedAt)}.</span></li>
                <li><span className="doc-list__ico doc-list__ico--mint"><IconCheck size={15} /></span><span>Praktik dostal potvrzení{missing.length ? ' a seznam toho, co chybí,' : ''} stejným kanálem ({channel}). Žádný nový účet.</span></li>
                <li><span className="doc-list__ico doc-list__ico--accent"><IconArrowRight size={15} /></span><span>Na tahu: koordinátorka · vyžádat chybějící zprávy z pracovišť.</span></li>
              </ul>
              <hr className="doc-hr" />
              <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={() => nav.go({ page: 'case', caseId: c.id })}>
                Otevřít případ v aplikaci koordinátorky <IconArrowRight size={16} />
              </button>
              <button type="button" className="doc-btn doc-btn--text doc-btn--block" style={{ marginTop: 8 }} onClick={reset}>
                Odeslat dalšího pacienta
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
        title="Odeslat pacienta do KOC"
        subtitle={<>
          <span>Žádost odejde e-mailem nebo eZprávou, tak jako dnes.</span>
          <span className="doc-pill doc-pill--outline"><IconUser size={13} /> {gp.name} · {gp.practice}</span>
        </>}
      />

      <div className="doc-grid">
        <div>
          {/* 1 · KOC */}
          <section className="doc-card">
            <div className="doc-card__title"><span className="doc-stepno">1</span> Kam pacienta posíláte</div>
            <div className="intake-koc" role="radiogroup" aria-label="Výběr KOC">
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

          {/* 2 · Text žádanky */}
          <section className="doc-card">
            <div className="doc-card__title"><span className="doc-stepno">2</span> Co posíláte</div>
            <p className="doc-muted doc-small" style={{ margin: '0 0 10px' }}>
              Vložte text epikrízy a žádosti (zkopírovaný z vašeho programu). Kontrola níže běží přímo v prohlížeči, nic se nikam neposílá.
            </p>
            <textarea
              className="intake-text"
              value={text}
              onChange={e => { setText(e.target.value); setIsSample(false); }}
              placeholder="Sem vložte text žádanky…"
              rows={10}
              aria-label="Text žádanky"
              spellCheck={false}
            />
            <div className="intake-text__actions">
              <button type="button" className="doc-btn doc-btn--sm" onClick={insertSample} disabled={!sampleDoc || isSample}>
                <IconFile size={15} /> Vložit ukázku (zpráva {SAMPLE_DOC_ID})
              </button>
              {hasText && (
                <button type="button" className="doc-btn doc-btn--sm doc-btn--text" onClick={clear}>
                  <IconX size={15} /> Vymazat
                </button>
              )}
              {isSample && sampleDoc && <span className="doc-faint doc-small">{sampleLabel}</span>}
            </div>
          </section>

          {/* 3 · Kontrola */}
          <section className="doc-card">
            <div className="doc-card__title">
              <span className="doc-stepno">3</span> Kontrola žádanky
              {hasText && (
                <span className="intake-counts">
                  <span className="doc-pill doc-pill--mint">{foundCount} v textu je</span>
                  {missing.length > 0 && <span className="doc-pill doc-pill--coral">{missing.length} chybí</span>}
                  {fyi.length > 0 && <span className="doc-pill doc-pill--sky">{fyi.length} na vědomí</span>}
                </span>
              )}
            </div>

            {!hasText && (
              <p className="doc-muted" style={{ margin: 0 }}>Po vložení textu hned uvidíte, co v žádosti je a co chybí – podle seznamu podkladů pro konzilium (šablona VZP „Handover_obsah“). Doplníte to teď, ne za týden po telefonátu.</p>
            )}
            {hasText && (
              <div className="doc-reveal">
                {(head.name || head.age || head.insurer || head.diagnosis) && (
                  <div className="intake-found">
                    <span className="doc-faint doc-small">Z textu jsme přečetli</span>
                    {head.name && <span className="doc-pill">{head.name}{head.age ? `, ${head.age} let` : ''}</span>}
                    {head.insurer && <span className="doc-pill">ZP {head.insurer}</span>}
                    {head.diagnosis && <span className="doc-pill">{head.diagnosis}</span>}
                  </div>
                )}
                <div className="intake-check">
                  {groups.map(g => (
                    <div key={g.group} className="intake-check__group">
                      <div className="intake-check__head">{g.group}</div>
                      <ul className="doc-list">
                        {g.items.map(i => (
                          <li key={i.label}>
                            <span className={`doc-list__ico ${i.found ? 'doc-list__ico--mint' : i.optional ? 'doc-list__ico--sky' : 'doc-list__ico--coral'}`}>
                              {i.found ? <IconCheck size={15} /> : i.optional ? <IconInfo size={15} /> : <IconAlert size={15} />}
                            </span>
                            <span className="intake-check__body">
                              <span className="intake-check__label">{i.label}{!i.found && <span className={i.optional ? 'intake-check__fyi' : 'intake-check__miss'}> · {i.optional ? 'na vědomí' : 'chybí'}</span>}</span>
                              {i.found && i.snippet && <span className="intake-check__snip">„{i.snippet}“</span>}
                              {i.note && <span className="intake-check__note">{i.note}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="doc-small doc-muted" style={{ margin: '14px 0 0' }}>
                  Odeslat můžete i tak. Co máte po ruce, přidejte teď; zbytek si vyžádá koordinátorka. Diagnózu potvrdí až konzilium.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Rail */}
        <aside className="doc-rail">
          <div className="doc-card">
            <div className="doc-card__title">Shrnutí</div>
            <dl className="doc-kv">
              <dt>Kam</dt><dd>{koc}</dd>
              <dt>Kanál</dt><dd>{channel}</dd>
              <dt>Žádanka</dt><dd>{hasText ? (isSample ? `ukázka (zpráva ${SAMPLE_DOC_ID})` : `vlastní text, ${text.trim().length} znaků`) : <span className="doc-faint">zatím nic</span>}</dd>
              <dt>Kontrola</dt>
              <dd>
                {hasText
                  ? (missing.length ? <span className="doc-missing">{missing.length}× chybí</span> : <span style={{ color: 'var(--mint)' }}>v pořádku</span>)
                  : <span className="doc-faint">čeká na text</span>}
              </dd>
            </dl>
            <hr className="doc-hr" />
            <button type="button" className="doc-btn doc-btn--primary doc-btn--lg doc-btn--block" onClick={send} disabled={!hasText}>
              <IconSend size={16} /> Odeslat
            </button>
            <p className="doc-small doc-faint" style={{ margin: '10px 0 0', textAlign: 'center' }}>
              {hasText ? 'Praktik hned dostane potvrzení přijetí s číslem případu.' : 'Nejprve vložte text žádanky (ukázku nebo vlastní).'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
