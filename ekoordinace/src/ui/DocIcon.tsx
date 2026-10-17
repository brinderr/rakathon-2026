// Icon of one report in a list, like a file icon in a file manager: a page with a short type label ("CT", "LAB").
// Shared by all sections.
import './viewer.css';

export function DocIcon({ code }: { code: string }) {
  return (
    <span className="doc-icon" aria-hidden="true">
      <svg width="28" height="34" viewBox="0 0 28 34">
        <path d="M4 1h14.5L27 9.5V31a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" fill="#fff" stroke="currentColor" strokeWidth="1.25" />
        <path d="M18.5 1v6.5a2 2 0 0 0 2 2H27" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M7.5 15h12M7.5 19h12M7.5 23h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".4" />
      </svg>
      <span className="doc-code">{code}</span>
    </span>
  );
}
