#!/usr/bin/env node
// Overenie citátov: každý Citation.quote musí byť DOSLOVNE (znak po znaku) v texte svojej správy.
// 1) načíta src/data/cases.ts (transpilácia cez devDependency `typescript`, bez nových balíkov),
// 2) zapíše public/data/cases.json (export dát pre ďalšie nástroje, napr. meranie presnosti AI),
// 3) overí citáty voči public/data/source.json (+ šablóna „MDT zaver“ ako 'MDT', EXTRA_DOCS, SourceDoc.text),
// 4) vypíše počty a zlyhania; pri chybe skončí s kódom 1.
// Spustenie: npm run verify

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const casesPath = resolve(root, 'src/data/cases.ts');
const sourcePath = resolve(root, 'public/data/source.json');
const outPath = resolve(root, 'public/data/cases.json');

async function loadCasesModule() {
  try {
    const ts = (await import('typescript')).default;
    const src = readFileSync(casesPath, 'utf8');
    const js = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: true },
      fileName: 'cases.ts',
    }).outputText;
    return await import('data:text/javascript;base64,' + Buffer.from(js, 'utf8').toString('base64'));
  } catch (e) {
    // Záloha: Node ≥ 22.18 vie spustiť .ts priamo (odstráni typy).
    try {
      return await import(pathToFileURL(casesPath).href);
    } catch {
      throw e;
    }
  }
}

const mod = await loadCasesModule();
const { CASES, EXTRA_DOCS = {}, LATER_VALUES = {} } = mod;
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
