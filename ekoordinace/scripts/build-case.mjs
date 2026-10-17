#!/usr/bin/env node
// npm run data  (node --experimental-strip-types scripts/build-case.mjs)
//
// Precomputes the demo case (Alena Procházková, the fictional reports of the VZP challenge) with src/case/buildCase.ts
// and writes src/data/alena.json. Patients added in the app are built the same way, in the browser.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCase } from '../src/case/buildCase.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(readFileSync(join(ROOT, '../app/public/data/source.json'), 'utf8'));
const docs = source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text }));
const data = await buildCase({ caseId: 'alena', docs, today: '2026-10-19', mdtDate: '2026-10-21' });
data.generatedFrom = 'app/src/ai (pravidla) · app/public/data/source.json · npm run data';
writeFileSync(join(ROOT, 'src/data/alena.json'), JSON.stringify(data, null, 2) + '\n');
const now = data.steps.find((x) => x.status === 'now');
console.log(`src/data/alena.json: ${data.steps.length} kroků, teď: ${now?.title} (${now?.todo?.length ?? 0} úkoly), dnes nové: ${data.news.map((n) => n.what).join(', ') || '–'}`);
