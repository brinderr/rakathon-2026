#!/usr/bin/env node
// npm run extract -- [--case alena|pacient-2] [--provider azure|openai|cache|none|fixture] [--asof 2026-10-21] [--out <file>]
//
// Runs the handover extractor (src/ai/extract.ts) on the fictional reports and writes
// public/data/extracted-<case>.json. LLM credentials are read ONLY from app/.env (git-ignored):
//   AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT[, AZURE_OPENAI_API_VERSION]
//   or OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL
// Provider "cache" replays answers stored in eval/llm-cache/<hash>.json (offline demo, no internet).
// On a cache miss the exact request is written to eval/llm-cache/<hash>.request.json.
// Provider "fixture" (--fixture <file>) plays back a fixed answer, e.g. a deliberately hallucinating one, to test the guards.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHandover } from '../src/ai/extract.ts';
import { azureComplete, openAiCompatibleComplete, requestHash } from '../src/ai/llm.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(APP, 'eval', 'llm-cache');

const CASES = {
  alena: { source: 'public/data/source.json', asOf: '2026-10-21', out: 'public/data/extracted-alena.json' },
  'pacient-2': { source: 'data-pacient-2/source-pacient-2.json', asOf: null, out: 'public/data/extracted-pacient-2.json' },
};

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function loadEnv() {
  const file = join(APP, '.env');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

function cacheComplete() {
  return async (req) => {
    const h = await requestHash(req);
    const file = join(CACHE, `${h}.json`);
    if (existsSync(file)) {
      const c = JSON.parse(readFileSync(file, 'utf8'));
      return { text: c.text, model: c.model ?? 'cache' };
    }
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(join(CACHE, `${h}.request.json`), JSON.stringify(req, null, 2));
    throw new Error(`cache miss ${h} – požiadavka uložená do eval/llm-cache/${h}.request.json`);
  };
}

/** A fixed answer regardless of the request (test of the verification guards). */
function fixtureComplete(file) {
  return async () => {
    const c = JSON.parse(readFileSync(resolve(APP, file), 'utf8'));
    return { text: typeof c.text === 'string' ? c.text : JSON.stringify(c.answer ?? c), model: c.model ?? `fixture:${file}` };
  };
}

/** Wraps a live provider so each answer is also stored for offline replay. */
function recording(complete) {
  return async (req) => {
    const res = await complete(req);
    const h = await requestHash(req);
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(join(CACHE, `${h}.json`), JSON.stringify({ model: res.model, recordedAt: new Date().toISOString(), text: res.text }, null, 2));
    return res;
  };
}

function pickProvider(name, log) {
  const e = process.env;
  const want = name ?? (e.AZURE_OPENAI_API_KEY ? 'azure' : e.OPENAI_API_KEY ? 'openai' : 'cache');
  if (want === 'none') return { name: 'none', complete: undefined };
  if (want === 'cache') return { name: 'cache', complete: cacheComplete() };
  if (want === 'fixture') {
    const file = arg('fixture');
    if (!file) throw new Error('Chýba --fixture <súbor s odpoveďou>');
    return { name: 'fixture', complete: fixtureComplete(file) };
  }
  if (want === 'azure') {
    if (!e.AZURE_OPENAI_ENDPOINT || !e.AZURE_OPENAI_API_KEY || !e.AZURE_OPENAI_DEPLOYMENT) throw new Error('Chýba AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_API_KEY / AZURE_OPENAI_DEPLOYMENT v app/.env');
    return { name: 'azure', complete: recording(azureComplete({ endpoint: e.AZURE_OPENAI_ENDPOINT, apiKey: e.AZURE_OPENAI_API_KEY, deployment: e.AZURE_OPENAI_DEPLOYMENT, apiVersion: e.AZURE_OPENAI_API_VERSION || undefined }, { log })) };
  }
  if (want === 'openai') {
    if (!e.OPENAI_API_KEY || !e.OPENAI_MODEL) throw new Error('Chýba OPENAI_API_KEY / OPENAI_MODEL v app/.env');
    return { name: 'openai', complete: recording(openAiCompatibleComplete({ baseUrl: e.OPENAI_BASE_URL || 'https://api.openai.com/v1', apiKey: e.OPENAI_API_KEY, model: e.OPENAI_MODEL }, { log })) };
  }
  throw new Error(`Neznámy provider ${want}`);
}

loadEnv();
const caseId = arg('case', 'alena');
const cfg = CASES[caseId];
if (!cfg) { console.error(`Neznámy prípad ${caseId}`); process.exit(1); }
const source = JSON.parse(readFileSync(join(APP, cfg.source), 'utf8'));
const asOf = arg('asof', cfg.asOf ?? source.mdtDate);
const docs = source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text }));
const log = (m) => console.log(`  · ${m}`);
const provider = pickProvider(arg('provider'), log);

console.log(`Vyťaženie: ${caseId}, ${docs.length} správ, stav k ${asOf}, AI: ${provider.name}`);
const result = await extractHandover({ caseId, docs, asOf, complete: provider.complete, log });
const out = resolve(APP, arg('out', cfg.out));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2) + '\n');

const s = result.meta.stats;
console.log(`Režim: ${result.meta.mode}${result.meta.model ? ` (${result.meta.model})` : ''}${result.meta.llmError ? ` – AI chyba: ${result.meta.llmError}` : ''}`);
console.log(`Polia: ${s.withValue}/${s.fields} vyplnené, ${s.missing} chýba, ${s.conflicts} rozpor`);
console.log(`Citáty: ${s.citationsVerified}/${s.citations} overené doslova · polia bez overeného citátu: ${s.fieldsWithoutVerifiedCitation}`);
console.log(`AI polia: ${s.llmFieldsAccepted} prijaté, ${s.llmFieldsRejected} zamietnuté (použité pravidlá)`);
console.log(`Nálezy: ${result.findings.length} · vylúčené správy: ${result.meta.docsExcluded.map((d) => d.id).join(', ') || '–'}`);
console.log(`Uložené: ${out.replace(APP + '/', 'app/')}`);
