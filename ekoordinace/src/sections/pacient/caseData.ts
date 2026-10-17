// The case of Alena Procházková as computed by the shared engine (src/data/alena.json, npm run data), with types.
// Tabs and other sections import it from here.
import data from '../../data/alena.json';
import type { DocText } from '../../ui/DocViewer';
import type { DocRef, Step } from './types';

export const caseData = data;
export type CaseData = typeof data;
export const CASE_ID = 'alena';
export const steps = data.steps as Step[];
export const documents = data.documents as Record<string, DocText>;
export const afterMdt = data.afterMdt as DocRef[];
