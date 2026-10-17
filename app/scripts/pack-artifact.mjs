// Packs a Vite build (built with --base ./) into an Artifact page:
// one HTML body fragment with inlined CSS + JS, data JSON files next to it.
// Usage: node pack-artifact.mjs <distDir> <outDir>
import fs from 'node:fs';
import path from 'node:path';

const [dist, out] = process.argv.slice(2);
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const cssHref = html.match(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"/)[1];
const jsSrc = html.match(/<script type="module"[^>]*src="\.\/([^"]+)"/)[1];
const css = fs.readFileSync(path.join(dist, cssHref), 'utf8');
let js = fs.readFileSync(path.join(dist, jsSrc), 'utf8');
// An inline script ends at the first "</script"; escape any occurrence inside the bundle.
js = js.replace(/<\/script/gi, '<\\/script');
const page = `<title>Koordinátor KOC</title>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'data'), { recursive: true });
fs.writeFileSync(path.join(out, 'koordinator-koc.html'), page);
for (const f of fs.readdirSync(path.join(dist, 'data'))) {
  fs.copyFileSync(path.join(dist, 'data', f), path.join(out, 'data', f));
}
console.log('page', (page.length / 1024).toFixed(0) + ' KB', '| data:', fs.readdirSync(path.join(out, 'data')).join(', '));
