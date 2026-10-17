#!/usr/bin/env node
// npm run preview:pack -- <out.html>
// Until the Vercel project is connected: builds the app with relative paths and inlines CSS and JS into one file
// (no <html>/<head>/<body> – the artifact viewer adds them), so the current step can be shown as a private preview.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? join(ROOT, 'preview.html'));
const dist = mkdtempSync(join(tmpdir(), 'cordin-'));
execFileSync('npx', ['vite', 'build', '--base', './', '--outDir', dist, '--emptyOutDir', '--logLevel', 'error'], { cwd: ROOT, stdio: 'inherit' });

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const css = [...html.matchAll(/href="\.\/(assets\/[^"]+\.css)"/g)].map((m) => readFileSync(join(dist, m[1]), 'utf8')).join('');
const js = [...html.matchAll(/src="\.\/(assets\/[^"]+\.js)"/g)].map((m) => readFileSync(join(dist, m[1]), 'utf8')).join('');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '')
  .replace(/<script[^>]*src="\.\/assets\/[^"]+"[^>]*><\/script>\s*/g, '')
  .replace(/<link rel="stylesheet"[^>]*href="\.\/assets\/[^"]+"[^>]*>\s*/g, '');
writeFileSync(out, `${head.trim()}\n<style>${css}</style>\n<div id="root"></div>\n<script type="module">${js.replace(/<\/script/g, '<\\/script')}</script>\n`);
console.log(`Uloženo: ${out}`);
