// Minimal inline SVG icons (2px stroke, 20px grid). No emoji anywhere in the UI.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
function Base({ size = 18, children, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IcCheck = (p: P) => <Base {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>;
export const IcClose = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const IcChevron = (p: P) => <Base {...p}><path d="M9 6l6 6-6 6" /></Base>;
export const IcChevronDown = (p: P) => <Base {...p}><path d="M6 9l6 6 6-6" /></Base>;
export const IcArrow = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const IcClock = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Base>;
export const IcAlert = (p: P) => <Base {...p}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z" /></Base>;
export const IcSend = (p: P) => <Base {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Base>;
export const IcPerson = (p: P) => <Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></Base>;
export const IcDoc = (p: P) => <Base {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Base>;
export const IcMail = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Base>;
export const IcPhone = (p: P) => <Base {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7a2 2 0 011.8 2.1z" /></Base>;
export const IcCalendar = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Base>;
export const IcPin = (p: P) => <Base {...p}><path d="M12 22s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Base>;
export const IcPrint = (p: P) => <Base {...p}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="9" rx="2" /><path d="M6 14h12v7H6z" /></Base>;
export const IcReply = (p: P) => <Base {...p}><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 015 5v6" /></Base>;
export const IcSearch = (p: P) => <Base {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Base>;
export const IcFlag = (p: P) => <Base {...p}><path d="M5 21V4" /><path d="M5 4h12l-2 4 2 4H5" /></Base>;
export const IcLink = (p: P) => <Base {...p}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" /><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" /></Base>;
export const IcDownload = (p: P) => <Base {...p}><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 21h16" /></Base>;
export const IcHeart = (p: P) => <Base {...p}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /></Base>;
export const IcPlay = (p: P) => <Base {...p}><path d="M7 4l12 8-12 8V4z" /></Base>;
