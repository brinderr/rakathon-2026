// eKoordinace logo: a "K" drawn as a red double line with a white inline (in the spirit of the VZP mark); its leg loops
// back into an arrow – the case returns to the GP who sent it. Redrawn as vectors from the approved design.
import { useId } from 'react';

export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  const clip = `k${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg width={size} height={size} viewBox="169 180 685 685" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs><clipPath id={clip}><rect x="0" y="180" width="1024" height="844" /></clipPath></defs>
      <g clipPath={`url(#${clip})`} fill="none" strokeLinejoin="round">
        <g stroke="currentColor" strokeWidth="165">
          <path d="M282.5 262V845" />
          <path d="M283 606L760 129" />
          <path d="M534 470L721 657A64.7 64.7 0 0 1 675.3 767.5H530" />
        </g>
        <circle cx="282.5" cy="262" r="82.5" fill="currentColor" />
        <g stroke="#fff" strokeWidth="44">
          <path d="M283.5 260V787" />
          <path d="M283.5 606L760 129" />
          <path d="M534 470L721 657A64.7 64.7 0 0 1 675.3 767.5H530" />
        </g>
        <circle cx="283.5" cy="260" r="22" fill="#fff" />
        <path d="M530 648V865L400 756.5Z" fill="currentColor" />
      </g>
    </svg>
  );
}
