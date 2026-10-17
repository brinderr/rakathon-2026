#!/usr/bin/env node
// Overenie citátov: každý Citation.quote musí byť DOSLOVNE (znak po znaku) v texte svojej správy.
// 1) načíta src/data/cases.ts aj jeho importy (pacient2.gen.ts, eval.gen.ts) – transpilácia cez devDependency
//    `typescript` do dočasného priečinka, bez nových balíkov a bez závislosti od verzie Node,
// 2) zapíše public/data/cases.json (export dát pre ďalšie nástroje, napr. meranie presnosti AI),
// 3) overí citáty voči public/data/source.json (+ šablóna „MDT zaver“ ako 'MDT', EXTRA_DOCS, SourceDoc.text),
// 4) overí, že ID správ sa medzi pacientmi neopakujú (inak by sa zobrazil text cudzej správy),
// 5) overí, že generované dáta (Josef Novák, EVAL_SUMMARY) sedia s Maťovými súbormi extracted-*/eval-*.json,
// 6) vypíše počty a zlyhania; pri chybe skončí s kódom 1.
// Spustenie: npm run verify   (po prepočte Maťových súborov najprv: node scripts/build-pacient2.mjs)

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const casesPath = resolve(root, 'src/data/cases.ts');
const sourcePath = resolve(root, 'public/data/source.json');
const outPath = resolve(root, 'public/data/cases.json');

/** Transpiluje cases.ts a jeho relatívne importy (.ts) do dočasného priečinka a načíta ich. */
async function loadCasesModule() {
  let ts;
  try {
    ts = (await import('typescript')).default;
  } catch (e) {
    // Záloha: Node ≥ 22.18 vie spustiť .ts priamo (odstráni typy).
    try { return await import(pathToFileURL(casesPath).href); } catch { throw e; }
  }
  const out = mkdtempSync(join(tmpdir(), 'koordinator-verify-'));
  const emitted = new Map();
  const emit = (file) => {
    if (emitted.has(file)) return emitted.get(file);
    const target = join(out, relative(root, file).replace(/\.ts$/, '.mjs'));
    emitted.set(file, target);
    let js = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: true },
      fileName: file,
    }).outputText;
    js = js.replace(/(\bfrom\s*)(['"])(\.{1,2}\/[^'"]+)\2/g, (m, pre, q, spec) => {
      const base = resolve(dirname(file), spec.replace(/\.ts$/, ''));
      const dep = [base + '.ts', join(base, 'index.ts')].find((p) => existsSync(p));
      if (!dep) return m;
      let rel = relative(dirname(target), emit(dep));
      if (!rel.startsWith('.')) rel = './' + rel;
      return pre + q + rel + q;
    });
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, js);
    return target;
  };
  try {
    return await import(pathToFileURL(emit(casesPath)).href);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const mod = await loadCasesModule();
const { CASES, EXTRA_DOCS = {}, LATER_VALUES = {}, EVAL_SUMMARY, CASE_AI = {} } = mod;
if (!Array.isArray(CASES)) {
  console.error('✗ src/data/cases.ts neexportuje CASES');
  process.exit(1);
}

writeFileSync(outPath, JSON.stringify({ cases: CASES, extraDocs: EXTRA_DOCS, laterValues: LATER_VALUES }, null, 1) + '\n');

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const baseTexts = {};
for (const d of source.documents) baseTexts[d.id] = d.text;
if (source.templates?.['MDT zaver']) baseTexts.MDT = source.templates['MDT zaver'];
Object.assign(baseTexts, EXTRA_DOCS);

const errors = [];
const warnings = [];
let quotesTotal = 0;
let quotesOk = 0;
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const short = (s) => JSON.stringify(s.length > 70 ? s.slice(0, 67) + '…' : s);

// ---- Naprieč prípadmi: ID prípadov a správ sa nesmú opakovať (texty sa v appke hľadajú podľa ID správy).
{
  const caseIds = new Set();
  const owner = new Map();
  for (const c of CASES) {
    if (caseIds.has(c.id)) errors.push(`duplicitné ID prípadu ${c.id}`);
    caseIds.add(c.id);
    for (const d of c.docs) {
      if (owner.has(d.id)) errors.push(`správa ${d.id} je v prípade ${owner.get(d.id)} aj ${c.id} – zobrazil by sa text cudzej správy`);
      else owner.set(d.id, c.id);
    }
  }
  const full = CASES.filter((c) => c.demo === 'full');
  if (CASES[0]?.id !== 'alena') errors.push('Alena musí byť v CASES prvá (fullCase()/findCase() berú prvý plný prípad)');
  if (!full.length) errors.push('chýba plný prípad');
}

// ---- Skutočné pracoviská nesmú byť v textoch (QA R2 #3).
for (const c of CASES) for (const d of c.docs) {
  const t = d.text ?? baseTexts[d.id] ?? '';
  for (const bad of ['Máchova 400', 'Nemocnice Benešov', 'Laboratoř Benešov']) {
    if (t.includes(bad)) errors.push(`[${c.id}] docs ${d.id}: obsahuje „${bad}“ (adresa skutočného pracoviska)`);
  }
}

// ---- Generované dáta musia sedieť so súbormi, z ktorých vznikli (čísla nikdy napevno).
const REGEN = 'spusti: node scripts/build-pacient2.mjs';
const readJson = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const stampOf = (j) => j.meta?.generatedAt ?? j.generatedAt;
if (!EVAL_SUMMARY) errors.push(`src/data neexportuje EVAL_SUMMARY – ${REGEN}`);
else {
  for (const [file, stamp] of Object.entries(EVAL_SUMMARY.sources ?? {})) {
    if (!existsSync(resolve(root, file))) { errors.push(`EVAL_SUMMARY: chýba súbor ${file}`); continue; }
    const now = stampOf(readJson(file));
    if (now !== stamp) errors.push(`generované dáta nesedia s ${file} (${stamp} ≠ ${now}) – ${REGEN}`);
  }
  for (const r of EVAL_SUMMARY.cases ?? []) {
    const ev = readJson(`public/${r.file}`);
    for (const k of ['fieldsCorrect', 'fieldsTotal', 'trapsCaught', 'trapsTotal', 'inventedValues', 'fieldsWithoutVerifiedCitation', 'citationsVerified', 'citationsTotal']) {
      if (ev.summary[k] !== r[k]) errors.push(`EVAL_SUMMARY ${r.caseId}.${k} = ${r[k]}, v ${r.file} je ${ev.summary[k]} – ${REGEN}`);
    }
    if (!CASES.some((c) => c.id === r.caseId)) errors.push(`EVAL_SUMMARY: prípad ${r.caseId} nie je v CASES`);
    if (!r.goldIntegrity) warnings.push(`EVAL_SUMMARY ${r.caseId}: zlatá sada nie je celistvá – UI nemá čísla ukazovať`);
    if (!r.inSync) warnings.push(`EVAL_SUMMARY ${r.caseId}: meranie patrí k inej verzii vyťaženia – spusti npm run eval`);
  }
}
for (const [id, ai] of Object.entries(CASE_AI)) {
  if (ai.mode === 'manual' || !ai.generatedAt) continue;
  const ev = ai.evalFile ? readJson(`public/${ai.evalFile}`) : null;
  const file = ev?.extraction?.file;
  if (file && existsSync(resolve(root, file)) && readJson(file).meta?.generatedAt !== ai.generatedAt) {
    errors.push(`[${id}] prípad je z inej verzie ${file} – ${REGEN}`);
  }
}

for (const c of CASES) {
  const docIds = new Set(c.docs.map((d) => d.id));
  const texts = { ...baseTexts };
  for (const d of c.docs) if (d.text) texts[d.id] = d.text;
  const err = (msg) => errors.push(`[${c.id}] ${msg}`);
  const warn = (msg) => warnings.push(`[${c.id}] ${msg}`);

  const checkCitation = (cit, where) => {
    quotesTotal++;
    if (!cit || typeof cit.quote !== 'string' || !cit.docId) return err(`${where}: neplatný citát`);
    if (!docIds.has(cit.docId)) return err(`${where}: správa ${cit.docId} nie je v docs prípadu`);
    const text = texts[cit.docId];
    if (!text) return err(`${where}: k správe ${cit.docId} nie je text`);
    if (!text.includes(cit.quote)) return err(`${where}: citát nie je doslovne v správe ${cit.docId}: ${short(cit.quote)}`);
    quotesOk++;
    const n = words(cit.quote);
    if (n < 3 || n > 25) warn(`${where}: citát má ${n} slov (odporúčané 3–25): ${short(cit.quote)}`);
  };

  // Dokumenty
  for (const d of c.docs) {
    if (d.receivedAt < d.examDate) err(`docs ${d.id}: prijaté (${d.receivedAt}) pred vznikom (${d.examDate})`);
    if (!texts[d.id]) err(`docs ${d.id}: chýba text správy`);
  }

  // Polia podkladu
  const keys = new Set();
  c.fields.forEach((f, i) => {
    const w = `fields[${i}] ${f.key}`;
    if (keys.has(f.key)) err(`${w}: duplicitný key`);
    keys.add(f.key);
    if (f.status === 'missing') {
      if (f.citations.length) err(`${w}: chýbajúce pole nemá mať citáty`);
      if (f.value) err(`${w}: chýbajúce pole nemá mať hodnotu`);
    } else if (!f.citations.length) err(`${w}: pole bez citátu (stav ${f.status})`);
    if (f.status === 'conflict' && !f.conflict) err(`${w}: rozpor bez dvoch verzií`);
    f.citations.forEach((x, j) => checkCitation(x, `${w}.citations[${j}]`));
    if (f.conflict) {
      checkCitation(f.conflict.a.citation, `${w}.conflict.a`);
      checkCitation(f.conflict.b.citation, `${w}.conflict.b`);
    }
    if (f.resolvedBy) {
      checkCitation(f.resolvedBy.citation, `${w}.resolvedBy`);
      if (!f.resolvedBy.citation.quote.includes(f.resolvedBy.value)) warn(`${w}.resolvedBy: hodnota nie je v citáte`);
    }
  });
  if (c.demo === 'full' && c.fields.length !== 20) err(`plný prípad má mať 20 polí Handover_obsah, má ${c.fields.length}`);

  // Neskoršie hodnoty
  (LATER_VALUES[c.id] ?? []).forEach((lv, i) => {
    if (!keys.has(lv.key)) err(`LATER_VALUES[${i}]: neznáme pole ${lv.key}`);
    lv.citations.forEach((x, j) => checkCitation(x, `LATER_VALUES[${i}] ${lv.key}.citations[${j}]`));
  });

  // Lieky
  c.meds.forEach((m, i) => checkCitation(m.citation, `meds[${i}] ${m.name}`));

  // Záver pre praktika
  if (c.gpReport) {
    c.gpReport.citations.forEach((x, j) => checkCitation(x, `gpReport.citations[${j}]`));
    if (!c.gpReport.citations.some((x) => x.quote.includes(c.gpReport.question) || c.gpReport.question.includes(x.quote)))
      warn('gpReport.question nemá zodpovedajúci citát');
  }

  // Laboratórium: hodnota (+ príznak) musí byť v správe
  c.labs.forEach((r, i) => {
    if (!docIds.has(r.docId)) return err(`labs[${i}] ${r.test}: správa ${r.docId} nie je v docs`);
    const text = texts[r.docId] ?? '';
    const v = r.flag ? `${r.value} ${r.flag}` : r.value;
    const ok = r.unit ? text.includes(`${v}\n${r.unit}`) || text.includes(`${v} ${r.unit}`) : text.includes(v);
    if (!ok) err(`labs[${i}] ${r.test}: hodnota ${short(v + (r.unit ? ' ' + r.unit : ''))} nie je v správe ${r.docId}`);
  });

  // Odkazy na správy
  c.exams.forEach((e, i) => !docIds.has(e.docId) && err(`exams[${i}]: správa ${e.docId} nie je v docs`));
  c.steps.forEach((s, i) => s.resultDocId && !docIds.has(s.resultDocId) && err(`steps[${i}] ${s.id}: správa ${s.resultDocId} nie je v docs`));
}

// Výpis
const pct = quotesTotal ? ((100 * quotesOk) / quotesTotal).toFixed(1) : '100.0';
console.log(`Prípady: ${CASES.length} · polia: ${CASES.reduce((n, c) => n + c.fields.length, 0)} · lieky: ${CASES.reduce((n, c) => n + c.meds.length, 0)} · laboratórium: ${CASES.reduce((n, c) => n + c.labs.length, 0)} riadkov`);
for (const c of CASES.filter((x) => x.fields.length)) {
  const by = (s) => c.fields.filter((f) => f.status === s).length;
  console.log(`  ${c.id}: ${by('confirmed')} potvrdených · ${by('proposed')} na kontrolu · ${by('missing')} chýba · ${by('conflict')} rozpory · ${c.fields.filter((f) => f.status !== 'missing' && !f.citations.length).length} polí bez citátu`);
}
console.log(`Citáty: ${quotesOk}/${quotesTotal} overené doslovne (${pct} %)`);
if (EVAL_SUMMARY?.cases?.length) {
  console.log(`Meranie (EVAL_SUMMARY): ${EVAL_SUMMARY.cases.map((r) => `${r.caseId} ${r.fieldsCorrect}/${r.fieldsTotal} polí · ${r.trapsCaught}/${r.trapsTotal} pascí · ${r.inventedValues} vymyslených`).join(' | ')}`);
}
console.log(`Export: ${outPath.replace(root + '/', '')}`);
if (warnings.length) {
  console.log(`\nUpozornenia (${warnings.length}):`);
  for (const w of warnings) console.log('  ! ' + w);
}
if (errors.length) {
  console.error(`\n✗ Zlyhania (${errors.length}):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log('\n✓ Všetko overené.');
