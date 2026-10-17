// The sections of the app, one per item in the side menu. A section is a folder in src/sections/<name>/ with its own
// components and CSS; register it here with one line. A section without `render` shows greyed out in the menu.
// Owners (see README): pacienti – Matej; prehled, zadanka, konzilia – Bruno. The address picks the section: #/pacienti, …
import type { ReactNode } from 'react';
import { PatientPage } from './sections/pacient/PatientPage';
import { Zadanka } from './sections/zadanka/Zadanka';

export interface Section {
  id: string;
  label: string;
  icon: string;
  /** Renders the section; `path` is the rest of the address, e.g. ["ukoly"] for #/pacienti/ukoly. */
  render?: (path: string[]) => ReactNode;
  /** Reachable by its address but not listed in the side menu (e.g. the GP's referral page). */
  hidden?: boolean;
}

export const DEFAULT_SECTION = 'pacienti';

export const SECTIONS: Section[] = [
  { id: 'prehled', label: 'Přehled', icon: 'grid' }, // Bruno: render: () => <Fronta /> (src/sections/prehled)
  { id: 'pacienti', label: 'Pacienti', icon: 'user', render: (path) => <PatientPage path={path} /> },
  { id: 'konzilia', label: 'Konzilia', icon: 'calendar' }, // Bruno, optional: render: () => <Konzilia />
  { id: 'zadanka', label: 'Žádanka od praktika', icon: 'note', hidden: true, render: () => <Zadanka /> }, // Bruno
];
