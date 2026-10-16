import type { ReactNode } from 'react';
import { IconArrowLeft } from './DocIcons';
import { PROTO_NOTE } from './docUtils';
import './docs.css';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { label: string; onClick: () => void };
}

/** Page header for the document screens: eyebrow, title, subtitle, optional actions on the right. */
export function DocHeader({ eyebrow, title, subtitle, actions, back }: Props) {
  return (
    <header className="doc-head">
      <div className="doc-head__left">
        {back && (
          <button type="button" className="doc-back" onClick={back.onClick}>
            <IconArrowLeft size={14} /> {back.label}
          </button>
        )}
        {eyebrow && <div className="doc-eyebrow">{eyebrow}</div>}
        <h1 className="doc-title">{title}</h1>
        {subtitle && <div className="doc-sub">{subtitle}</div>}
      </div>
      {actions && <div className="doc-head__actions">{actions}</div>}
    </header>
  );
}

/** Unobtrusive note required on every screen. */
export function ProtoNote() {
  return <p className="doc-proto">{PROTO_NOTE}</p>;
}
