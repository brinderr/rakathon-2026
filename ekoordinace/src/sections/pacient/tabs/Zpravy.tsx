// Tab "Zprávy" (owner: Bruno) – all reports of the patient in one place, like a file list.
// To build (docs/PLAN-EKOORDINACE.md): list of the 11 reports known before the MDT (DocList from ../Journey, sorted by
// date, filter by type), a click opens the reader (props.openDoc); below a separate block "Po konziliu – nepatří do
// podkladu" from `afterMdt` (algeziologie 26. 10., psychoonkologie 27. 10.; only what/where/when, no text).
// Data: caseData.documents, afterMdt (../caseData). Coordination record: useCase/addEvent (src/state/caseStore).
import type { OpenDoc } from '../Journey';
import { Soon } from './Soon';

export function Zpravy(_props: { openDoc: OpenDoc }) {
  return <Soon title="Zprávy" />;
}
