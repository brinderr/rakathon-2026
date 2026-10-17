// RTF (e.g. a report saved from an older hospital system) → plain text: paragraphs become lines, Czech letters from the
// code page (\'xx, cp1250 by default) or from \uN; font tables, styles, pictures and other hidden groups are skipped.
const SKIP = new Set(['fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object', 'header', 'footer', 'headerl', 'headerr', 'footerl', 'footerr', 'listtable', 'listoverridetable', 'rsidtbl', 'generator', 'xmlnstbl', 'themedata', 'datastore', 'latentstyles']);

export function rtfToText(rtf: string): string {
  const cp = rtf.match(/\\ansicpg(\d+)/)?.[1] ?? '1250';
  let decoder: TextDecoder;
  try { decoder = new TextDecoder(`windows-${cp}`); } catch { decoder = new TextDecoder('windows-1250'); }
  const stack: { skip: boolean; uc: number }[] = [];
  let state = { skip: false, uc: 1 };
  let out = '';
  let bytes: number[] = [];
  const flush = () => { if (bytes.length) { out += decoder.decode(new Uint8Array(bytes)); bytes = []; } };
  const emit = (s: string) => { if (!state.skip) { flush(); out += s; } };
  let pendingSkip = 0; // characters to drop after \uN (its fallback)
  for (let i = 0; i < rtf.length; i++) {
    const c = rtf[i];
    if (c === '{') { stack.push(state); state = { ...state }; continue; }
    if (c === '}') { flush(); state = stack.pop() ?? { skip: false, uc: 1 }; continue; }
    if (c === '\r' || c === '\n') continue;
    if (c !== '\\') {
      if (pendingSkip > 0) { pendingSkip--; continue; }
      emit(c);
      continue;
    }
    const next = rtf[i + 1];
    if (next === '\\' || next === '{' || next === '}') { if (pendingSkip > 0) pendingSkip--; else emit(next); i++; continue; }
    if (next === "'") {
      const byte = parseInt(rtf.slice(i + 2, i + 4), 16);
      i += 3;
      if (pendingSkip > 0) { pendingSkip--; continue; }
      if (!state.skip && !Number.isNaN(byte)) bytes.push(byte);
      continue;
    }
    if (next === '*') { state.skip = true; i++; continue; }
    if (next === '~') { emit(' '); i++; continue; }
    if (next === '-' || next === '_') { i++; continue; }
    const m = rtf.slice(i + 1).match(/^([a-zA-Z]+)(-?\d+)? ?/);
    if (!m) { i++; continue; }
    i += m[0].length;
    const [, word, param] = m;
    if (SKIP.has(word)) state.skip = true;
    else if (word === 'par' || word === 'line' || word === 'row') emit('\n');
    else if (word === 'tab' || word === 'cell') emit(' ');
    else if (word === 'uc') state.uc = Number(param ?? 1);
    else if (word === 'u' && param) {
      const code = Number(param);
      emit(String.fromCharCode(code < 0 ? code + 65536 : code));
      pendingSkip = state.uc;
    } else if (word === 'bin' && param) i += Number(param);
  }
  flush();
  return out.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
