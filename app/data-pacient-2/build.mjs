#!/usr/bin/env node
// node data-pacient-2/build.mjs – builds source-pacient-2.json (same shape as public/data/source.json) from the .txt reports.
// File name = <id>_<name>_<YYYY-MM-DD>.txt. All data is fictional.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const MDT_DATE = '2026-10-22';

const documents = readdirSync(DIR)
  .filter((f) => /^\d{2}_.+_\d{4}-\d{2}-\d{2}\.txt$/.test(f))
  .sort()
  .map((file) => ({
    id: file.slice(0, 2),
    file,
    date: file.match(/(\d{4}-\d{2}-\d{2})\.txt$/)[1],
    text: readFileSync(join(DIR, file), 'utf8').trim(),
  }));

// Generic VZP templates are shared with Alena's case; "MDT zaver" is Alena's own MDT record, so it is left out.
const alena = JSON.parse(readFileSync(join(DIR, '..', 'public', 'data', 'source.json'), 'utf8'));
const templates = Object.fromEntries(Object.entries(alena.templates).filter(([k]) => k !== 'MDT zaver'));

const out = { caseId: 'pacient-2', note: 'FIKTIVNÍ PACIENT – testovací data', mdtDate: MDT_DATE, documents, templates };
writeFileSync(join(DIR, 'source-pacient-2.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`source-pacient-2.json: ${documents.length} správ, MDT ${MDT_DATE}`);
