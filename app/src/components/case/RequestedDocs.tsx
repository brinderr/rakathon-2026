// „Vyžádané zprávy“ (Dokumenty tab): the referral names the examinations but holds no results – it only says
// where they are. This card shows which report was requested from whom, when it arrived, through which channel
// and how many days it took. Everything comes from the case data: the request date from the record entry
// „Vyžádány zprávy 01–06“, the dates of receipt and channels from Case.docs, chasing from „Urgence: …“ entries.
// Nothing is guessed: when the record has no such request, the card is not shown.
import type { Case, ISODate, LogEntry, SourceDoc } from '../../types';
import { daysBetween, daysWord, fmtDate, fmtShort } from './caseUtils';
import { Card, Pill } from './ui';
import { IcArrow, IcCheck, IcClock, IcDoc, IcChevron } from './icons';

export interface RequestedReport { doc: SourceDoc; urgedAt?: ISODate }
export interface RequestedReports { requestedAt: ISODate; entry: LogEntry; referral?: SourceDoc; items: RequestedReport[] }

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Proper nouns of a workplace („Kardiologická ambulance Jesenice“ → „jesenice“), used to match a chasing entry. */
function placeNames(place: string): string[] {
  return place.split(/[\s,·–-]+/).slice(1).filter((w) => w.length >= 4 && /^[A-ZÁ-Ž]/.test(w)).map(fold);
}

/** Reports requested in one go („Vyžádány zprávy 01–06“ / „Vyžiadané správy 01–06“ in the record) with the matching documents. */
export function requestedReports(c: Case, log: LogEntry[]): RequestedReports | null {
  // „Vyžádány zprávy 01–06“ (CZ) or „Vyžiadané správy 01–06“ (older SK data)
  const entry = log.find((e) => /vy[žz]i?[áa]d[áa]n[éeýyoa]?\s+(zpr|spr)[áa]vy\s+\S+\s*[–-]\s*\S+/i.test(e.action));
  if (!entry) return null;
  const m = entry.action.match(/(?:zpr|spr)[áa]vy\s+(\S+)\s*[–-]\s*(\S+)/i);
  if (!m) return null;
  const [from, to] = [m[1], m[2]];
  const numeric = /^\d+$/.test(from) && /^\d+$/.test(to);
  const inRange = (id: string) => (numeric ? /^\d+$/.test(id) && Number(id) >= Number(from) && Number(id) <= Number(to) : id >= from && id <= to);
  const docs = c.docs.filter((d) => inRange(d.id) && d.kind !== 'request');
  if (!docs.length) return null;
  const chases = log.filter((e) => /urgen/i.test(e.action));
  const items: RequestedReport[] = docs.map((doc) => {
    const names = placeNames(doc.place);
    const urged = chases
      .filter((e) => e.date >= entry.date && e.date <= doc.receivedAt && names.some((n) => fold(`${e.action} ${e.detail}`).includes(n)))
      .map((e) => e.date).sort();
    return { doc, urgedAt: urged[urged.length - 1] };
  });
  items.sort((a, b) => (a.doc.receivedAt < b.doc.receivedAt ? -1 : a.doc.receivedAt > b.doc.receivedAt ? 1 : a.doc.id.localeCompare(b.doc.id)));
  const referral = c.docs.find((d) => d.kind === 'request');
  return { requestedAt: entry.date, entry, referral, items };
}

export function RequestedDocs({ c, log, asOf, onOpenDoc }: { c: Case; log: LogEntry[]; asOf: ISODate; onOpenDoc: (docId: string) => void }) {
  const rq = requestedReports(c, log);
  if (!rq || asOf < rq.requestedAt) return null;
  const { requestedAt, entry, referral, items } = rq;
  const arrived = items.filter((it) => it.doc.receivedAt <= asOf);
  const n = items.length;
  return (
    <Card title="Vyžádané zprávy" aside={
      <span className="cs-hint">{n} {n === 1 ? 'zpráva vyžádána' : n <= 4 ? 'zprávy vyžádány' : 'zpráv vyžádáno'} {fmtShort(requestedAt)} · {arrived.length} z {n} přišlo · k {fmtShort(asOf)}</span>
    }>
      <div className="cs-rq-intro">
        <IcDoc size={18} />
        <div>
          {referral
            ? <>Žádost praktického lékaře (zpráva {referral.id}) přišla {fmtDate(referral.receivedAt)} přes {referral.channel}. Výsledky vyšetření v ní nejsou – uvádí jen, že jsou k dispozici na jednotlivých pracovištích. </>
            : <>Žádost výsledky vyšetření neobsahuje – uvádí jen, kde jsou. </>}
          Koordinátorka je vyžádala {fmtDate(requestedAt)}{entry.time ? ` v ${entry.time}` : ''} (ze záznamu o koordinaci).
        </div>
      </div>
      <div className="cs-rq-list">
        {items.map(({ doc, urgedAt }) => {
          const here = doc.receivedAt <= asOf;
          const days = daysBetween(requestedAt, here ? doc.receivedAt : asOf);
          return (
            <div key={doc.id} className={`cs-rq-row ${here ? '' : 'is-waiting'}`} role={here ? 'button' : undefined} tabIndex={here ? 0 : -1}
              onClick={() => here && onOpenDoc(doc.id)} onKeyDown={(e) => { if (e.key === 'Enter' && here) onOpenDoc(doc.id); }}
              title={here ? `Otevřít originál zprávy ${doc.id}` : undefined}>
              <span className="cs-rq-id">{doc.id}</span>
              <div className="cs-rq-main">
                <div className="cs-rq-title">{doc.title}</div>
                <div className="cs-rq-from">od: {doc.place}</div>
                <div className="cs-rq-path">
                  <span>vyžádáno <b>{fmtShort(requestedAt)}</b></span>
                  {urgedAt && urgedAt <= asOf && <><span className="cs-rq-arrow"><IcArrow size={12} /></span><span className="cs-rq-urged">urgováno {fmtShort(urgedAt)}</span></>}
                  <span className="cs-rq-arrow"><IcArrow size={12} /></span>
                  {here
                    ? <span>přišlo <b>{fmtShort(doc.receivedAt)}</b> · {doc.channel}</span>
                    : <span>k {fmtShort(asOf)} ještě nepřišlo</span>}
                </div>
              </div>
              <div className="cs-rq-days">
                <strong>{days}</strong>
                <span>{here ? daysWord(days) : `${daysWord(days)} čeká`}</span>
              </div>
              <div className="cs-rq-side">
                {here
                  ? <Pill tone="mint"><IcCheck size={13} /> přišlo</Pill>
                  : <Pill tone="amber"><IcClock size={13} /> čekáme</Pill>}
                <span className={`cs-row-chev ${here ? '' : 'is-hidden'}`}><IcChevron size={16} /></span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="cs-hint">Data přijetí a kanály jsou z dat případu. Dny = od vyžádání do přijetí.</p>
    </Card>
  );
}
