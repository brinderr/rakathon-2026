// Tab "Závěr" (owner: Matej) – závěr MDT podle MDT zaver, odeslání praktikovi s kontextem, doručenka, revizní lékař, uzavření případu.
import type { OpenDoc } from '../Journey';
import { Soon } from './Soon';

export function Zaver(_props: { openDoc: OpenDoc }) {
  return <Soon title="Závěr" />;
}
