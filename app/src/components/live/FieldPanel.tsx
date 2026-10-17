// Middle column: the 20 fields of Handover_obsah as the extractor filled them right now.
// Status, value and – on click – the verbatim quote(s) with their source. A value never appears without a quote.
import type { Citation, HandoverField } from '../../types';
import { czDate } from '../../ai/text.ts';
import { Icon, Pill } from '../ui';
import { cz } from './cesky';
import { hasShownValue, shownStatus, STATUS_CZ, STATUS_TONE } from './engine';
import { FIELD_CZ, fieldLabel, GROUP_ORDER, type LiveDoc } from './liveData';

function sourceLine(doc: LiveDoc | undefined, docId: string): string {
  if (!doc) return `zpráva ${docId}`;
  if (doc.byCoordinator) return `telefonát · zapsala koordinátorka · ${czDate(doc.date)}`;
  return `zpráva ${doc.id} · ${doc.title} · ${czDate(doc.date)}`;
}

/** Heading above the quotes: a phone note written by the coordinator is not a report of a workplace. */
function quoteKicker(cits: Citation[], docsById: Map<string, LiveDoc>): string {
  const byCoord = cits.filter((c) => docsById.get(c.docId)?.byCoordinator).length;
  if (byCoord === cits.length) return 'Doslovně ze zápisu koordinátorky';
  if (byCoord > 0) return 'Doslovně ze zpráv a ze zápisu koordinátorky';
  return `Doslovně ze ${cits.length > 1 ? 'zpráv' : 'zprávy'}`;
}

function Quote({ c, doc, onView }: { c: Citation; doc: LiveDoc | undefined; onView: (docId: string, quotes: string[]) => void }) {
  return (
    <li className="lv-quote">
      <blockquote>„{c.quote}“</blockquote>
      <div className="lv-quote__src">
        <span>{sourceLine(doc, c.docId)}</span>
        <button type="button" className="lv-link" onClick={() => onView(c.docId, [c.quote])}>
          <Icon name="file" size={14} />{doc?.byCoordinator ? 'Zobrazit zápis' : 'Zobrazit ve zprávě'}
        </button>
      </div>
    </li>
  );
}

function FieldDetail({ f, confirmedValue, docsById, onView, onConfirm, onUnconfirm, onPhone, canPhone }: {
  f: HandoverField; confirmedValue: string | undefined;
  docsById: Map<string, LiveDoc>;
  onView: (docId: string, quotes: string[]) => void;
  onConfirm: () => void; onUnconfirm: () => void; onPhone: () => void; canPhone: boolean;
}) {
  const shown = hasShownValue(f);
  const note = cz(f.note);
  return (
    <div className="lv-detail">
      {shown && <div className="lv-detail__value">{cz(f.value)}</div>}
      {!shown && f.status !== 'missing' && f.value && (
        <p className="lv-detail__note">Motor našel text, ale bez ověřeného citátu – hodnota se proto nezobrazuje.</p>
      )}
      {note && !/^Bez ověřeného citátu/.test(note) && <p className="lv-detail__note">{note}</p>}
      {shown && (
        <>
          <div className="kicker">{quoteKicker(f.citations, docsById)}</div>
          <ul className="lv-quotes">{f.citations.map((c, i) => <Quote key={i} c={c} doc={docsById.get(c.docId)} onView={onView} />)}</ul>
        </>
      )}
      {f.conflict && (
        <div className="lv-conflict">
          <div className="kicker">Rozpor – rozhoduje člověk</div>
          <p>{cz(f.conflict.explain)}</p>
          <div className="lv-conflict__pair">
            {[f.conflict.a, f.conflict.b].map((side, i) => (
              <div key={i} className="lv-conflict__side">
                <blockquote>„{side.citation.quote}“</blockquote>
                <div className="lv-quote__src">
                  <span>{sourceLine(docsById.get(side.citation.docId), side.citation.docId)}</span>
                  <button type="button" className="lv-link" onClick={() => onView(side.citation.docId, [side.citation.quote])}>
                    <Icon name="file" size={14} />{docsById.get(side.citation.docId)?.byCoordinator ? 'Zobrazit zápis' : 'Zobrazit ve zprávě'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="lv-detail__actions">
        {shown && f.status !== 'conflict' && (confirmedValue === f.value ? (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onUnconfirm}>Zrušit potvrzení</button>
        ) : (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onConfirm}><Icon name="check" size={16} />Potvrdit (zkontroloval člověk)</button>
        ))}
        {f.key === 'performance' && !shown && canPhone && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onPhone}><Icon name="phone" size={16} />Zapsat telefonát</button>
        )}
      </div>
    </div>
  );
}

export function FieldPanel({ fields, female, confirmed, changed, gen, openKey, onToggle, docsById, onView, onConfirm, onUnconfirm, onPhone, canPhone }: {
  fields: HandoverField[];
  female: boolean;
  confirmed: Record<string, string>;
  changed: Set<string>;
  gen: number;
  openKey: string | null;
  onToggle: (key: string) => void;
  docsById: Map<string, LiveDoc>;
  onView: (docId: string, quotes: string[]) => void;
  onConfirm: (key: string, value: string) => void;
  onUnconfirm: (key: string) => void;
  onPhone: () => void;
  canPhone: boolean;
}) {
  const groups = GROUP_ORDER.map((g) => ({ g, items: fields.filter((f) => (FIELD_CZ[f.key]?.group ?? 'Jiné') === g) })).filter((x) => x.items.length);
  return (
    <section className="lv-card lv-fields" aria-label="Podklad pro konzilium – 20 údajů">
      <div className="lv-card__head">
        <h2>Podklad pro konzilium – 20 údajů</h2>
        <span className="lv-legend">
          {(['confirmed', 'proposed', 'conflict', 'missing'] as const).map((s) => (
            <span key={s} className="lv-legend__item"><span className={`dot dot--${STATUS_TONE[s]}`} />{STATUS_CZ[s]}</span>
          ))}
        </span>
      </div>
      {groups.map(({ g, items }) => (
        <div key={g} className="lv-group">
          <div className="kicker lv-group__title">{g}</div>
          <ul className="lv-fieldlist">
            {items.map((f) => {
              const st = shownStatus(f, confirmed);
              const shown = hasShownValue(f);
              const open = openKey === f.key;
              const isChanged = changed.has(f.key);
              const first = shown ? f.citations[0] : undefined;
              const src = first ? docsById.get(first.docId) : undefined;
              return (
                <li key={isChanged ? `${f.key}-${gen}` : f.key} className={`lv-field lv-field--${st} ${isChanged ? 'is-changed' : ''} ${open ? 'is-open' : ''}`}>
                  <button type="button" className="lv-field__row" aria-expanded={open} onClick={() => onToggle(f.key)}>
                    <span className={`dot dot--${STATUS_TONE[st]}`} aria-hidden="true" />
                    <span className="lv-field__label">{fieldLabel(f.key, female, f.label)}</span>
                    <span className="lv-field__value">
                      <span className="lv-field__text">{shown ? cz(f.value) : <span className="lv-muted">—</span>}</span>
                      {first && (
                        <span className="lv-field__src">{src?.byCoordinator ? 'telefonát · zapsala koordinátorka' : `zpráva ${first.docId}${src ? ` · ${czDate(src.date)}` : ''}`}{f.citations.length > 1 ? ` · +${f.citations.length - 1}` : ''}</span>
                      )}
                    </span>
                    <Pill tone={STATUS_TONE[st]} size="sm">{STATUS_CZ[st]}</Pill>
                    <Icon name="chevron-down" size={16} className="lv-field__chev" />
                  </button>
                  {open && (
                    <FieldDetail f={f} confirmedValue={confirmed[f.key]} docsById={docsById} onView={onView}
                      onConfirm={() => onConfirm(f.key, f.value)} onUnconfirm={() => onUnconfirm(f.key)} onPhone={onPhone} canPhone={canPhone} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
