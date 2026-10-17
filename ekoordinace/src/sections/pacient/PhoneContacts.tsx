// The phone button in the patient header: a small popup with the numbers of the patient, the contact person and the
// GP. Each number can be copied (or dialled from a phone). Closes on Escape or a click outside.
import { useEffect, useId, useRef, useState } from 'react';
import { copyText } from '../../ui/clipboard';
import { Icon } from '../../ui/Icon';
import { telHref } from '../../ui/format';
import type { Person } from './types';

export function PhoneContacts({ people }: { people: Person[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const copy = async (phone: string, number: HTMLElement | null) => {
    if (!(await copyText(phone))) {
      // copying is blocked here: at least select the number so Ctrl/⌘+C works
      if (number) window.getSelection()?.selectAllChildren(number);
      return;
    }
    setCopied(phone);
    window.setTimeout(() => setCopied((c) => (c === phone ? null : c)), 1600);
  };

  return (
    <div className="phone-contacts" ref={wrapRef}>
      <button
        ref={buttonRef} type="button" className="round-btn" title="Telefonní kontakty" aria-label="Telefonní kontakty"
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}
      >
        <Icon name="phone" size={18} />
      </button>
      {open && (
        <div className="popover" id={id} role="dialog" aria-label="Telefonní kontakty">
          <p className="eyebrow">Telefon</p>
          <ul className="contact-list">
            {people.filter((p) => p.phone).map((p) => {
              const done = copied === p.phone;
              return (
                <li key={p.phone}>
                  <span className="contact-who"><small>{p.role}</small><b>{p.name}</b></span>
                  <span className="contact-line">
                    <a className="contact-phone" href={telHref(p.phone!)}>{p.phone}</a>
                    <button
                      type="button" className={`copy-btn${done ? ' done' : ''}`} aria-label={`Kopírovat číslo ${p.phone}`}
                      onClick={(e) => copy(p.phone!, e.currentTarget.previousElementSibling as HTMLElement | null)}
                    >
                      <Icon name={done ? 'check' : 'copy'} size={15} />{done ? 'Zkopírováno' : 'Kopírovat'}
                    </button>
                  </span>
                  {p.note && <em>{p.note}</em>}
                </li>
              );
            })}
          </ul>
          <p className="sr" aria-live="polite">{copied ? `Číslo ${copied} zkopírováno` : ''}</p>
        </div>
      )}
    </div>
  );
}
