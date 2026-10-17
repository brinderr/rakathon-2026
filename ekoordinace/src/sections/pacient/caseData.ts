// The demo case (Alena Procházková), precomputed by the shared engine (src/data/alena.json, npm run data).
// Tabs should read the case they show with useCaseData() from ./caseContext – this file is for places outside a case.
import { demoCase } from '../../state/patients';

export const caseData = demoCase;
export const CASE_ID = 'alena';
