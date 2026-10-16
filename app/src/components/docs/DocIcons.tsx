// Simple inline SVG icons (2px stroke) for the document screens. No emoji anywhere.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IconCheck = (p: P) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const IconAlert = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></Svg>;
export const IconInfo = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>;
export const IconMail = (p: P) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.5 7.5L12 13l8.5-5.5" /></Svg>;
export const IconPrint = (p: P) => <Svg {...p}><path d="M7 8V4h10v4" /><rect x="4" y="8" width="16" height="9" rx="2" /><path d="M7 13h10v7H7z" /></Svg>;
export const IconCopy = (p: P) => <Svg {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></Svg>;
export const IconSend = (p: P) => <Svg {...p}><path d="M21 3L10.5 13.5" /><path d="M21 3l-6.5 18-4-7.5L3 9.5z" /></Svg>;
export const IconFile = (p: P) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></Svg>;
export const IconClock = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const IconUpload = (p: P) => <Svg {...p}><path d="M12 16V5" /><path d="M7.5 9.5L12 5l4.5 4.5" /><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" /></Svg>;
export const IconArrowRight = (p: P) => <Svg {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Svg>;
export const IconArrowLeft = (p: P) => <Svg {...p}><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></Svg>;
export const IconArrowDown = (p: P) => <Svg {...p}><path d="M12 5v14" /><path d="M6 13l6 6 6-6" /></Svg>;
export const IconStamp = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 9.5v5M9.5 12h5" /></Svg>;
export const IconBuilding = (p: P) => <Svg {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-5h6v5" /><path d="M12 7v4M10 9h4" /></Svg>;
export const IconUser = (p: P) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>;
export const IconShield = (p: P) => <Svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></Svg>;
export const IconLock = (p: P) => <Svg {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconX = (p: P) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const IconQuote = (p: P) => <Svg {...p}><path d="M7 10h3v4H6v-3a4 4 0 0 1 4-4" /><path d="M15 10h3v4h-4v-3a4 4 0 0 1 4-4" /></Svg>;
export const IconFlag = (p: P) => <Svg {...p}><path d="M5 21V4" /><path d="M5 4h12l-2 4 2 4H5" /></Svg>;
export const IconCalendar = (p: P) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>;
export const IconList = (p: P) => <Svg {...p}><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></Svg>;
