// Tab "Zprávy" (owner: Bruno) – all reports of the patient in one place, so the coordinator does not have to read every
// doctor's report in full (slide 9: "Kontext z referování: strukturovaná zpráva + originál"). Left: the reports known
// before the MDT, newest first, with a filter by type. Right: the selected report as a structured summary built only from
// the report itself and from what the engine found – the key sentences quoted verbatim (Závěr, Doporučení, Žádost …),
// the items of the handover taken from it, the conflicts and gaps that cite it – and a button to the original with those
// sentences highlighted. Below the list, the reports that came after the MDT – kept apart, they do not belong in the
// handover (VZP assignment: "Do zprávy pro MDT patří jen to, co bylo k 21. 10. 2026 známo").
import { useEffect, useRef, useState } from 'react';
import type { OpenDoc } from '../Journey';
import { DocList } from '../Journey';
import { useCaseData } from '../caseContext';
import { DocIcon } from '../../../ui/DocIcon';
import { Icon } from '../../../ui/Icon';
import { czDate, nb } from '../../../ui/format';
import type { DocRef, Field } from '../types';
import './zpravy.css';

const TYPE_LABEL: Record<string, string> = {
  ŽÁD: 'Žádanka', LAB: 'Laboratoř', HIS: 'Histologie', AMB: 'Ambulance', CT: 'CT', UZ: 'Ultrazvuk', RTG: 'RTG', EUS: 'Endoskopie',
};

// same labels and colours as in "Údaje pro konzilium"
const STATUS: Record<string, { label: string; cls: string }> = {
  nalezeno: { label: 'Nalezeno', cls: 'ok' },
  'doplněno': { label: 'Doplněno', cls: 'ok' },
  'ověřeno': { label: 'Ověřeno', cls: 'ok' },
  'neúplné': { label: 'Neúplné', cls: 'miss' },
  'chybí': { label: 'Chybí', cls: 'miss' },
  rozpor: { label: 'Rozpor', cls: 'conf' },
  'ponecháno': { label: 'Ponecháno', cls: 'conf' },
};
const OPEN = new Set(['chybí', 'neúplné', 'rozpor']);
const MAX_POINTS = 5;

// ---------- reading the report (only what is written in it) ----------

/** Who signed the report: the last line that starts with a title, as in src/case/buildCase.ts (+ RNDr. for the labs). */
const SIGNER = /^(?:MUDr|MDDr|RNDr|doc|prof|Ing|Mgr|Bc)\.\s/;
function signer(text: string): string {
  const lines = text.split('\n').map((l) => l.trim());
  const at = lines.findLastIndex((l) => SIGNER.test(l));
  if (at < 0) return '';
  // the line under the name says what the person is ("patolog", "praktický lékař, Na Návsi 3, …")
  const role = lines[at + 1] ?? '';
  const what = /^\p{Ll}/u.test(role) ? (role.length > 40 ? role.split(',')[0] : role) : '';
  return what ? `${lines[at]} · ${what}` : lines[at];
}

/** A heading in the report: capitals only ("ZÁVĚR", "ZÁVĚR A DOPORUČENÍ", "DIAGNÓZY"). */
const isHead = (l: string) => /\p{Lu}{3}/u.test(l) && !/\p{Ll}/u.test(l);
/** The parts of a report that say what it found and what should happen next. */
const KEY_HEAD = /ZÁVĚR|DOPORUČENÍ|DIAGNÓZ|ŽÁDOST|UPOZORNĚNÍ/;
/** The same written inline ("Závěr: febrilní stav, …"). */
const INLINE = /^(Závěr|Doporučení|Upozornění|Diagnóza)\s*:\s*(.+)$/;
/** Where a section ends: the place and date of signing, the signature, a copy line. */
const END = /^(?:V\s.+\sdne\s|Datum:|Vydáno:|Vydal:|Děkuji|Kopie:)/;
const sentenceCase = (h: string) => h.charAt(0) + h.slice(1).toLowerCase();

interface Point { label: string; quote: string }

/** The key sentences of the report, verbatim, in the order they are written. */
function keyPoints(text: string): Point[] {
  const out: Point[] = [];
  let section: string | null = null;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    if (isHead(l)) { section = KEY_HEAD.test(l) ? sentenceCase(l) : null; continue; }
    if (END.test(l) || SIGNER.test(l)) { section = null; continue; }
    if (section) { out.push({ label: section, quote: l }); continue; }
    const m = INLINE.exec(l);
    if (m) out.push({ label: m[1], quote: m[2] });
    else if (/^Upozorňuji\b/.test(l)) out.push({ label: 'Upozornění', quote: l });
  }
  return out.filter((p, i) => out.findIndex((x) => x.quote === p.quote) === i);
}

/** Sentences to highlight, each once; one that is part of another is left out (the reader cannot mark overlaps). */
function distinct(quotes: string[]): string[] {
  const flat = [...new Set(quotes.map(oneLine))].filter(Boolean);
  return flat.filter((q) => !flat.some((o) => o !== q && o.includes(q)));
}
const more = (n: number) => (n === 1 ? 'Další bod je v originálu.' : n < 5 ? `Další ${n} body jsou v originálu.` : `Dalších ${n} bodů je v originálu.`);
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** What the handover item says about this report: the whole value when it comes only from it, otherwise its part. */
function valueFrom(f: Field, doc: DocRef): string {
  const mine = f.quotes.filter((q) => q.docId === doc.id);
  if (f.quotes.every((q) => q.docId === doc.id)) return f.value;
  // items put together from several reports have one line per report, starting with its date
  const date = czDate(doc.date).replace(/ /g, ' ');
  const line = f.value.split('\n').find((l) => l.startsWith(date));
  if (line) {
    const at = line.indexOf(doc.place);
    if (at >= 0) return line.slice(at + doc.place.length).replace(/^\)?\s*[:–]\s*/, '');
  }
  return mine.map((q) => oneLine(q.quote)).join(' · ');
}

// ---------- the detail of one report ----------

function Detail({ doc, after, openDoc }: { doc: DocRef & { text?: string }; after: boolean; openDoc: OpenDoc }) {
  const { id, data } = useCaseData();
  const type = TYPE_LABEL[doc.code] ?? doc.code;
  const name = `${doc.what && doc.what !== doc.title ? `${doc.what} · ` : ''}${doc.title}`;

  if (after || !doc.text) {
    return (
      <>
        <header className="zp-d-head">
          <DocIcon code={doc.code} />
          <div className="zp-d-name">
            <p className="eyebrow">{type}</p>
            <h3 id="zp-detail-title">{name}</h3>
            <p className="muted">{doc.place.split(' – ').join(' » ')} · {czDate(doc.date)}</p>
          </div>
        </header>
        <p className="zp-note conf">
          <Icon name="lock" size={16} />
          <span>Zpráva vznikla až po konziliu{data.mdtDate ? ` ${czDate(data.mdtDate)}` : ''}. Do podkladu pro konzilium nepatří a aplikace z ní nic nepřebírá – lékaři na konziliu vidí jen to, co se v ten den vědělo.</span>
        </p>
      </>
    );
  }

  const all = keyPoints(doc.text);
  const points = all.slice(0, MAX_POINTS);
  const taken = data.fields.filter((f) => f.quotes.some((q) => q.docId === doc.id));
  // a gap or conflict concerns this report when the item was taken from it or the finding cites it
  const issues = data.fields.filter((f) => f.todo && f.status !== 'nalezeno'
    && [...f.quotes, ...f.todo.quotes].some((q) => q.docId === doc.id));
  const signed = signer(doc.text);
  const marks = distinct([...points.map((p) => p.quote), ...taken.flatMap((f) => f.quotes.filter((q) => q.docId === doc.id).map((q) => q.quote))]);

  return (
    <>
      <header className="zp-d-head">
        <DocIcon code={doc.code} />
        <div className="zp-d-name">
          <p className="eyebrow">{type}{doc.isNew && <span className="chip new">dnes</span>}</p>
          <h3 id="zp-detail-title">{name}</h3>
        </div>
        <button type="button" className="btn-primary zp-open" onClick={() => openDoc(doc.id, marks)}>
          <Icon name="file" size={16} />Otevřít originál
        </button>
      </header>
      <dl className="zp-meta">
        <div><dt>Pracoviště</dt><dd>{doc.place.split(' – ').join(' » ')}</dd></div>
        <div><dt>Datum</dt><dd>{czDate(doc.date)}</dd></div>
        <div><dt>Podpis</dt><dd>{signed ? nb(signed) : <span className="muted">ve zprávě neuveden</span>}</dd></div>
      </dl>

      <section className="zp-part" aria-labelledby="zp-points">
        <h4 id="zp-points">Hlavní body</h4>
        {points.length > 0 ? (
          <>
            <p className="muted zp-part-hint">Doslovně ze zprávy – oddíly závěr, doporučení, diagnózy, žádost a upozornění.</p>
            <ol className="zp-points">
              {points.map((p, i) => (
                <li key={p.quote}>
                  {(i === 0 || points[i - 1].label !== p.label) && <span className="zp-point-label">{p.label}</span>}
                  <blockquote className="quote">„{nb(p.quote)}“</blockquote>
                </li>
              ))}
            </ol>
            {all.length > points.length && (
              <p className="muted zp-part-hint">{more(all.length - points.length)}</p>
            )}
          </>
        ) : (
          <p className="muted zp-empty">Zpráva nemá oddíl závěr ani doporučení{doc.code === 'LAB' ? ' – je to tabulka výsledků. Hodnoty mimo normu, které aplikace převzala, jsou níže.' : '. Co z ní aplikace převzala, je níže.'}</p>
        )}
      </section>

      <section className="zp-part" aria-labelledby="zp-taken">
        <h4 id="zp-taken">Co aplikace z této zprávy převzala <span className="zp-count">{taken.length}</span></h4>
        {taken.length > 0 ? (
          <ul className="zp-taken">
            {taken.map((f) => {
              const st = STATUS[f.status] ?? STATUS.nalezeno;
              return (
                <li key={f.key}>
                  <a className="zp-taken-label" href={`#/pacienti/${id}/udaje/${f.key}`}>{f.label}</a>
                  <span className={`chip ${st.cls}`}>{st.label}</span>
                  <p className="zp-taken-value">{nb(valueFrom(f, doc))}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted zp-empty">Do údajů pro konzilium se z této zprávy nic nepřebírá.</p>
        )}
      </section>

      <section className="zp-part" aria-labelledby="zp-issues">
        <h4 id="zp-issues">Rozpory a chybějící údaje týkající se této zprávy <span className="zp-count">{issues.length}</span></h4>
        {issues.length > 0 ? (
          <ul className="zp-issues">
            {issues.map((f) => {
              const st = STATUS[f.status] ?? STATUS.nalezeno;
              const ev = f.todo?.quotes ?? [];
              const quotes = ev.filter((q) => q.docId === doc.id);
              // the finding rests on another report: offer that one, with its sentences highlighted
              const elsewhere = [...new Map(ev.filter((q) => q.docId !== doc.id).map((q) => [q.docId, q.ref ?? q.docId])).entries()];
              const open = OPEN.has(f.status);
              return (
                <li key={f.key} className={st.cls}>
                  <div className="zp-issue-head">
                    <span className={`chip ${st.cls}`}>{st.label}</span>
                    <b>{nb(f.todo?.title ?? f.label)}</b>
                  </div>
                  {f.issue && <p className="zp-issue-why">{nb(f.issue)}</p>}
                  {quotes.map((q) => <blockquote className="quote" key={q.quote}>„{nb(oneLine(q.quote))}“</blockquote>)}
                  {f.note && <p className="zp-issue-done"><Icon name="check" size={14} /><span>{nb(f.note)}</span></p>}
                  <div className="zp-issue-links">
                    <a className="link" href={`#/pacienti/${id}/udaje/${f.key}`}>{open ? (f.status === 'rozpor' ? 'Zapsat ověření' : 'Doplnit údaj') : 'Zobrazit v Údajích'}<Icon name="right" size={14} /></a>
                    {quotes.length > 0 && (
                      <button type="button" className="link" onClick={() => openDoc(doc.id, quotes.map((q) => q.quote))}>
                        <Icon name="file" size={14} />Ukázat v originálu
                      </button>
                    )}
                    {elsewhere.map(([other, ref]) => (
                      <button type="button" className="link" key={other} onClick={() => openDoc(other, ev.filter((q) => q.docId === other).map((q) => q.quote))}>
                        <Icon name="file" size={14} />Otevřít: {nb(ref)}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted zp-empty">K této zprávě aplikace nenašla žádný rozpor ani chybějící údaj.</p>
        )}
      </section>
    </>
  );
}

// ---------- the tab ----------

export function Zpravy({ openDoc }: { openDoc: OpenDoc }) {
  const { data } = useCaseData();
  const [type, setType] = useState('');
  const [sel, setSel] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const known = Object.values(data.documents).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const types = [...new Set(known.map((d) => d.code))];
  const shown = type ? known.filter((d) => d.code === type) : known;

  // the selected report; by default (and when the filter hides it) the newest one shown
  const later = data.afterMdt.find((d) => d.id === sel);
  const current = later ?? shown.find((d) => d.id === sel) ?? shown[0];
  const at = later ? -1 : shown.findIndex((d) => d.id === current?.id);

  // mark the selected row in the shared list (DocList has no "selected" state of its own)
  useEffect(() => {
    listRef.current?.querySelectorAll('.doc-row').forEach((b, i) => {
      if (i === at) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }, [at, shown.length, type]);

  const select = (docId: string) => {
    setSel(docId);
    // on a narrow screen the detail is below the list – bring it into view
    if (window.matchMedia('(max-width: 1100px)').matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        detailRef.current?.focus({ preventScroll: true });
      });
    }
  };

  return (
    <div className="zp">
      <div className="zp-side">
        <section className="card">
          <div className="card-head">
            <h2>Zprávy pacienta</h2>
            <span className="muted">{known.length} {known.length === 1 ? 'zpráva' : known.length < 5 ? 'zprávy' : 'zpráv'} do konzilia{data.mdtDate ? ` ${czDate(data.mdtDate)}` : ''}</span>
          </div>
          <p className="muted zp-intro">Nejnovější nahoře. Klikněte na zprávu – vpravo uvidíte její hlavní body, co z ní aplikace převzala a co v ní nesedí. Celou zprávu otevřete tlačítkem Otevřít originál.</p>
          {types.length > 1 && (
            <div className="zp-filter" role="group" aria-label="Filtr podle typu zprávy">
              <button type="button" className={`zp-pill${type === '' ? ' on' : ''}`} aria-pressed={type === ''} onClick={() => setType('')}>Vše ({known.length})</button>
              {types.map((t) => (
                <button key={t} type="button" className={`zp-pill${type === t ? ' on' : ''}`} aria-pressed={type === t} onClick={() => setType(t)}>
                  {TYPE_LABEL[t] ?? t} ({known.filter((d) => d.code === t).length})
                </button>
              ))}
            </div>
          )}
          <div className="zp-list" ref={listRef}>
            <DocList docs={shown} onOpen={select} />
          </div>
        </section>

        {data.afterMdt.length > 0 && (
          <section className="card zp-after">
            <div className="card-head">
              <h2>Po konziliu – nepatří do podkladu</h2>
              <span className="chip conf">{data.afterMdt.length} {data.afterMdt.length === 1 ? 'zpráva' : 'zprávy'}</span>
            </div>
            <p className="muted zp-intro">Tyto zprávy vznikly až po konziliu{data.mdtDate ? ` ${czDate(data.mdtDate)}` : ''}. Do podkladu pro konzilium se nezapočítávají, aby lékaři viděli jen to, co se v den konzilia vědělo.</p>
            <ul className="zp-later">
              {data.afterMdt.map((d) => (
                <li key={d.id}>
                  <button type="button" className="zp-later-row" aria-current={later?.id === d.id ? 'true' : undefined} onClick={() => select(d.id)}>
                    <span className="zp-code">{d.code}</span>
                    <span className="zp-what"><b>{d.what && d.what !== d.title ? `${d.what} · ` : ''}{d.title}</b><span className="muted">{d.place}</span></span>
                    <span className="mono">{czDate(d.date)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="card zp-detail" ref={detailRef} tabIndex={-1} aria-labelledby="zp-detail-title" aria-live="polite">
        {current
          ? <Detail key={current.id} doc={current} after={Boolean(later)} openDoc={openDoc} />
          : <p className="muted zp-empty">Zatím tu nejsou žádné zprávy.</p>}
      </section>
    </div>
  );
}
