// Reader for one report, like opening a document in a word processor: the whole page, the sentences the app relies
// on highlighted. Built on the native <dialog>, so focus stays inside and Esc closes it. Shared by all sections.
import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { DocIcon } from './DocIcon';
import { Icon } from './Icon';
import { czDate } from './format';
import './viewer.css';

export interface DocText { id: string; date: string; title: string; place: string; code: string; text: string }

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Where the quotes are in the text; spaces and line breaks may differ (the engine compares quotes the same way). */
function findRanges(text: string, quotes: string[]): [number, number][] {
  const out: [number, number][] = [];
  for (const q of quotes) {
    const words = q.trim().split(/\s+/).filter(Boolean).map(escapeRe);
    if (!words.length) continue;
    const m = new RegExp(words.join('\\s+')).exec(text);
    if (m) out.push([m.index, m.index + m[0].length]);
  }
  return out.sort((a, b) => a[0] - b[0]);
}

/** One line of the report with the highlighted parts (ranges are positions in the whole text). */
function Marked({ line, from, ranges }: { line: string; from: number; ranges: [number, number][] }) {
  const parts: ReactNode[] = [];
  let at = 0;
  for (const [a, b] of ranges) {
    const s = Math.max(a - from, 0);
    const e = Math.min(b - from, line.length);
    if (e <= 0 || s >= line.length || e <= s) continue;
    if (s > at) parts.push(line.slice(at, s));
    parts.push(<mark key={s}>{line.slice(s, e)}</mark>);
    at = e;
  }
  if (at < line.length) parts.push(line.slice(at));
  return <>{parts}</>;
}

const isHeading = (l: string) => l.length <= 40 && /\p{Lu}{3}/u.test(l) && !/\p{Ll}/u.test(l);

export function DocViewer({ doc, marks, onClose }: { doc: DocText | null; marks: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (doc && !dialog.open) {
      dialog.showModal();
      // start on the page itself, not on the close button
      dialog.querySelector<HTMLElement>('.page-sheet')?.focus({ preventScroll: true });
    }
    if (!doc && dialog.open) dialog.close();
    if (doc) dialog.querySelector('mark')?.scrollIntoView({ block: 'center' });
  }, [doc, marks]);

  const body = useMemo(() => {
    if (!doc) return null;
    const ranges = findRanges(doc.text, marks);
    const lines: { text: string; from: number }[] = [];
    let pos = 0;
    for (const text of doc.text.split('\n')) {
      lines.push({ text, from: pos });
      pos += text.length + 1;
    }
    const fictional = /^FIKTIVN/i.test(lines[0]?.text ?? '') ? lines.shift() : undefined;
    const titleAt = lines.findIndex((l) => l.text.includes(doc.title));
    const head = titleAt > 0 ? lines.slice(0, titleAt) : [];
    const rest = titleAt >= 0 ? lines.slice(titleAt) : lines;
    return (
      <>
        {fictional && <p className="sheet-note">{fictional.text}</p>}
        {head.length > 0 && <div className="sheet-head">{head.map((l) => <p key={l.from}><Marked line={l.text} from={l.from} ranges={ranges} /></p>)}</div>}
        {rest.map((l, i) => {
          if (!l.text.trim()) return <div className="sheet-gap" key={l.from} />;
          if (i === 0 && titleAt >= 0) return <h3 className="sheet-title" key={l.from}>{l.text}</h3>;
          if (isHeading(l.text)) return <h4 key={l.from}>{l.text}</h4>;
          return <p key={l.from}><Marked line={l.text} from={l.from} ranges={ranges} /></p>;
        })}
      </>
    );
  }, [doc, marks]);

  return (
    <dialog
      ref={ref} className="viewer" aria-labelledby="viewer-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
    >
      {doc && (
        <>
          <header className="viewer-bar">
            <DocIcon code={doc.code} />
            <div className="viewer-name">
              <h2 id="viewer-title">{doc.title}</h2>
              <p className="viewer-meta">{doc.place.split(' – ').join(' » ')} · {czDate(doc.date)}</p>
            </div>
            <button type="button" className="viewer-close" onClick={() => ref.current?.close()} aria-label="Zavřít zprávu">
              <Icon name="close" size={20} />
            </button>
          </header>
          <div className="viewer-scroll">
            {marks.length > 0 && <p className="viewer-hint"><mark>Zvýrazněno</mark> = věta, ze které aplikace vychází.</p>}
            <article className="page-sheet" tabIndex={-1}>{body}</article>
          </div>
        </>
      )}
    </dialog>
  );
}
