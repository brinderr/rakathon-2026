// „Vyžiadané správy“ (Dokumenty tab): the referral names the examinations but holds no results – it only says
// where they are. This card shows which report was requested from whom, when it arrived, through which channel
// and how many days it took. Everything comes from the case data: the request date from the record entry
// „Vyžiadané správy 01–06“, the dates of receipt and channels from Case.docs, chasing from „Urgencia: …“ entries.
// Nothing is guessed: when the record has no such request, the card is not shown.
import type { Case, ISODate, LogEntry, SourceDoc } from '../../types';
import { daysBetween, daysWord, fmtDate, fmtShort } from './caseUtils';
import { Card, Pill } from './ui';
import { IcArrow, IcCheck, IcClock, IcDoc, IcChevron } from './icons';

export interface RequestedReport { doc: SourceDoc; urgedAt?: ISODate }
export interface RequestedReports { requestedAt: ISODate; entry: LogEntry; referral?: SourceDoc; items: RequestedReport[] }

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Proper nouns of a workplace („Kardiologická ambulancia Jesenice“ → „jesenice“), used to match a chasing entry. */
function placeNames(place: string): string[] {
  return place.split(/[\s,·–-]+/).slice(1).filter((w) => w.length >= 4 && /^[A-ZÁ-Ž]/.test(w)).map(fold);
}

/** Reports requested in one go („Vyžiadané správy 01–06“ in the record) with the matching documents of the case. */
export function requestedReports(c: Case, log: LogEntry[]): RequestedReports | null {
  const entry = log.find((e) => /vy[žz]iadan[éeý]\s+spr[áa]vy\s+\S+\s*[–-]\s*\S+/i.test(e.action));
  if (!entry) return null;
  const m = entry.action.match(/spr[áa]vy\s+(\S+)\s*[–-]\s*(\S+)/i);
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
    <Card title="Vyžiadané správy" aside={
      <span className="cs-hint">{n} {n === 1 ? 'správa vyžiadaná' : n <= 4 ? 'správy vyžiadané' : 'správ vyžiadaných'} {fmtShort(requestedAt)} · {arrived.length} z {n} prišlo · k {fmtShort(asOf)}</span>
    }>
      <div className="cs-rq-intro">
        <IcDoc size={18} />
        <div>
          {referral
            ? <>Žiadanka praktika (správa {referral.id}) prišla {fmtDate(referral.receivedAt)} cez {referral.channel}. Výsledky vyšetrení v nej nie sú – uvádza len, že sú k dispozícii na jednotlivých pracoviskách. </>
            : <>Žiadanka výsledky vyšetrení neobsahuje – uvádza len, kde sú. </>}
          Koordinátorka ich vyžiadala {fmtDate(requestedAt)}{entry.time ? ` o ${entry.time}` : ''} (zo záznamu o koordinovaní).
        </div>
      </div>
      <div className="cs-rq-list">
        {items.map(({ doc, urgedAt }) => {
          const here = doc.receivedAt <= asOf;
          const days = daysBetween(requestedAt, here ? doc.receivedAt : asOf);
          return (
            <div key={doc.id} className={`cs-rq-row ${here ? '' : 'is-waiting'}`} role={here ? 'button' : undefined} tabIndex={here ? 0 : -1}
              onClick={() => here && onOpenDoc(doc.id)} onKeyDown={(e) => { if (e.key === 'Enter' && here) onOpenDoc(doc.id); }}
              title={here ? `Otvoriť originál správy ${doc.id}` : undefined}>
              <span className="cs-rq-id">{doc.id}</span>
              <div className="cs-rq-main">
                <div className="cs-rq-title">{doc.title}</div>
                <div className="cs-rq-from">od: {doc.place}</div>
                <div className="cs-rq-path">
                  <span>vyžiadané <b>{fmtShort(requestedAt)}</b></span>
                  {urgedAt && urgedAt <= asOf && <><span className="cs-rq-arrow"><IcArrow size={12} /></span><span className="cs-rq-urged">urgované {fmtShort(urgedAt)}</span></>}
                  <span className="cs-rq-arrow"><IcArrow size={12} /></span>
                  {here
                    ? <span>prišlo <b>{fmtShort(doc.receivedAt)}</b> · {doc.channel}</span>
                    : <span>k {fmtShort(asOf)} ešte neprišlo</span>}
                </div>
              </div>
              <div className="cs-rq-days">
                <strong>{days}</strong>
                <span>{here ? daysWord(days) : `${daysWord(days)} čaká`}</span>
              </div>
              <div className="cs-rq-side">
                {here
                  ? <Pill tone="mint"><IcCheck size={13} /> prišlo</Pill>
                  : <Pill tone="amber"><IcClock size={13} /> čakáme</Pill>}
                <span className={`cs-row-chev ${here ? '' : 'is-hidden'}`}><IcChevron size={16} /></span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="cs-hint">Dátumy prijatia a kanály sú z dát prípadu (v deme simulované – zadanie ich neuvádza). Dni = od vyžiadania po prijatie.</p>
    </Card>
  );
}
