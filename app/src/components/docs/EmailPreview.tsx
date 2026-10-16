import type { ReactNode } from 'react';
import { IconMail } from './DocIcons';
import './docs.css';

interface Props {
  from: string;
  to: string;
  subject: string;
  channel: string;     // "e-mail", "eZpráva" …
  sentAt?: string;     // "19. 10. 2026 9:12"
  children: ReactNode;
  footer?: ReactNode;
}

/** Looks like a message in a mail client: header rows, body, footer with channel. Simulated, says so. */
export function EmailPreview({ from, to, subject, channel, sentAt, children, footer }: Props) {
  return (
    <section className="mail" aria-label="Náhľad správy">
      <dl className="mail__head">
        <dt>Od</dt><dd>{from}</dd>
        <dt>Komu</dt><dd>{to}</dd>
        <dt>Predmet</dt><dd className="mail__subject">{subject}</dd>
      </dl>
      <div className="mail__body">{children}</div>
      <div className="mail__foot">
        <span className="mail__chan"><IconMail size={14} /> {channel}{sentAt ? ` · ${sentAt}` : ''}</span>
        <span>{footer ?? 'simulované odoslanie'}</span>
      </div>
    </section>
  );
}
