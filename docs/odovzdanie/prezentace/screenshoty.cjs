// Annotated screenshots of the live eKoordinace for learning the presentation (index.html in this folder).
// Each shot is 1920 × 1080: the app laid out 1520 px wide, the right 400 px hold the title, the requirement from the VZP
// slides and the numbered captions; red badges with arrows point at the real elements (positions from Playwright).
// The demo starts from a clean browser. Two states are written to localStorage the way the app writes them when the
// coordinator clicks: the SMS to the patient at 8:55 (shots 1–12) and her finished work confirmed by the doctor (13–17).
//   node docs/odovzdanie/prezentace/screenshoty.cjs [output folder] [repo root] [shots, e.g. 4,9]
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const path = require('path');
const OUT = process.argv[2] || __dirname;
const REPO = process.argv[3] || path.resolve(__dirname, '../../..');
const URL = 'https://ekoordinace.vercel.app/';
const only = process.argv[4] ? process.argv[4].split(',') : null;
const W = 1920;
const H = 1080;
const APP = 1520;

const LAYOUT_CSS = `
html { width: ${APP}px !important; }
.ai-panel { right: ${W - APP + 16}px !important; }
dialog[open] { right: ${W - APP}px !important; left: 0 !important; margin: auto !important; max-width: ${APP - 40}px !important; }
`;

function draw(spec) {
  document.getElementById('ann-root')?.remove();
  const VH = window.innerHeight;
  const AW = spec.app;
  const root = document.createElement('div');
  root.id = 'ann-root';
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  root.innerHTML = `<style>
    #ann-panel{position:fixed;top:0;left:${AW}px;width:${spec.w - AW}px;height:100vh;background:#fff;border-left:1px solid #e7e2df;box-shadow:-10px 0 34px rgba(28,25,23,.07);padding:30px 28px;font-family:'Source Sans 3',system-ui,-apple-system,sans-serif;z-index:2147483646;box-sizing:border-box;overflow:hidden;text-align:left}
    #ann-panel .ann-n{font:700 13px ui-monospace,SFMono-Regular,monospace;color:#d22d0f;letter-spacing:.1em;text-transform:uppercase;margin:0}
    #ann-panel .ann-h{font-size:27px;margin:6px 0 14px;line-height:1.16;color:#1c1917;font-weight:800;letter-spacing:-.01em}
    #ann-panel .ann-req{background:#fdf1ee;border-left:4px solid #d22d0f;padding:10px 13px;border-radius:7px;font-size:14px;color:#44403c;margin:0 0 22px;line-height:1.42}
    #ann-panel .ann-req b{color:#1c1917;font-weight:700}
    #ann-panel .ann-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
    #ann-panel .ann-item{display:flex;gap:11px;align-items:flex-start;font-size:15px;line-height:1.4;color:#292524;margin:0;padding:0}
    #ann-panel .ann-txt{flex:1;min-width:0;display:block}
    #ann-panel .ann-txt b{display:block;color:#1c1917;font-size:15.5px;font-weight:700;margin-bottom:1px}
    #ann-panel .ann-num{flex:0 0 28px;width:28px;height:28px;border-radius:50%;background:#d22d0f;color:#fff;font:700 14.5px system-ui,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(210,45,15,.35);position:static;margin:0}
    #ann-panel .ann-foot{position:absolute;bottom:18px;left:28px;right:28px;font-size:12px;color:#a8a29e;line-height:1.4;margin:0}
    #ann-svg{position:fixed;left:0;top:0;width:${AW}px;height:100vh;pointer-events:none;z-index:2147483645;overflow:visible}
  </style>`;
  const panel = document.createElement('aside');
  panel.id = 'ann-panel';
  panel.innerHTML = `<p class="ann-n">${esc(spec.n)} / ${esc(spec.total)}</p><h1 class="ann-h">${esc(spec.title)}</h1>
    <div class="ann-req">${spec.req}</div>
    <ol class="ann-list">${spec.items.map((it) => `<li class="ann-item"><span class="ann-num">${it.num}</span><span class="ann-txt"><b>${esc(it.label)}</b>${esc(it.text)}</span></li>`).join('')}</ol>
    <p class="ann-foot">eKoordinace · ekoordinace.vercel.app · Rakathon 2026 · výzva VZP „Cesta pacienta bez ztráty informací“ · fiktivní data</p>`;
  root.appendChild(panel);
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.id = 'ann-svg';
  svg.setAttribute('viewBox', `0 0 ${AW} ${VH}`);
  svg.innerHTML = `<defs><marker id="ann-head" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#d22d0f"/></marker>
    <filter id="ann-sh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000" flood-opacity=".25"/></filter></defs>`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  spec.items.filter((it) => it.box).forEach((it) => {
    const b = it.box;
    const pad = it.pad ?? 5;
    const r = { x: b.x - pad, y: b.y - pad, w: b.width + pad * 2, h: b.height + pad * 2 };
    if (!it.noBox) {
      const rect = document.createElementNS(NS, 'rect');
      Object.entries({ x: r.x, y: r.y, width: r.w, height: r.h, rx: 9, fill: 'rgba(210,45,15,.05)', stroke: '#d22d0f', 'stroke-width': 2.8 }).forEach(([k, v]) => rect.setAttribute(k, v));
      svg.appendChild(rect);
    }
    const side = it.side ?? (r.x > 300 ? 'left' : r.y > 90 ? 'top' : 'bottom');
    let bx; let by;
    if (side === 'left') { bx = r.x - 44; by = r.y + Math.min(r.h / 2, 26); }
    if (side === 'right') { bx = r.x + r.w + 44; by = r.y + Math.min(r.h / 2, 26); }
    if (side === 'top') { bx = r.x + Math.min(r.w / 2, 46); by = r.y - 44; }
    if (side === 'bottom') { bx = r.x + Math.min(r.w / 2, 46); by = r.y + r.h + 44; }
    if (side === 'in') { bx = r.x + 22; by = r.y + 22; }
    bx = clamp(bx + (it.dx ?? 0), 18, AW - 18);
    by = clamp(by + (it.dy ?? 0), 18, VH - 18);
    const ex = clamp(bx, r.x, r.x + r.w);
    const ey = clamp(by, r.y, r.y + r.h);
    const dist = Math.hypot(ex - bx, ey - by);
    if (dist > 22) {
      const ux = (ex - bx) / dist; const uy = (ey - by) / dist;
      const line = document.createElementNS(NS, 'line');
      Object.entries({ x1: bx + ux * 16, y1: by + uy * 16, x2: ex - ux * 2, y2: ey - uy * 2, stroke: '#d22d0f', 'stroke-width': 2.8, 'stroke-linecap': 'round', 'marker-end': 'url(#ann-head)' }).forEach(([k2, v]) => line.setAttribute(k2, v));
      svg.appendChild(line);
    }
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('filter', 'url(#ann-sh)');
    g.innerHTML = `<circle cx="${bx}" cy="${by}" r="16" fill="#d22d0f" stroke="#fff" stroke-width="2.5"/><text x="${bx}" y="${by + 5.5}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="16" fill="#fff">${it.num}</text>`;
    svg.appendChild(g);
  });
  root.appendChild(svg);
  (document.querySelector('dialog[open]') ?? document.body).appendChild(root);
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await ctx.addInitScript((css) => {
    const add = () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
    if (document.head) add(); else document.addEventListener('DOMContentLoaded', add);
  }, LAYOUT_CSS);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  const TOTAL = 17;
  const run = (n) => !only || only.includes(String(n));
  const shot = async (file, n, title, req, items) => {
    if (!run(n)) return;
    const ready = [];
    let num = 0;
    for (const it of items) {
      num++;
      const loc = p.locator(it.sel).nth(it.nth ?? 0);
      let box = await loc.boundingBox({ timeout: 4000 }).catch(() => null);
      if (box && it.clip) {
        const cb = await p.locator(it.clip).first().boundingBox().catch(() => null);
        if (cb) {
          const x1 = Math.max(box.x, cb.x); const y1 = Math.max(box.y, cb.y);
          const x2 = Math.min(box.x + box.width, cb.x + cb.width); const y2 = Math.min(box.y + box.height, cb.y + cb.height);
          box = { x: x1, y: y1, width: Math.max(0, x2 - x1), height: Math.max(0, y2 - y1) };
        }
      }
      if (!box) console.log('  MISSING', file, num, it.sel);
      else if (box.y + box.height < 0 || box.y > H || box.x > APP) console.log('  OFFSCREEN', file, num, it.sel, JSON.stringify(box));
      ready.push({ ...it, num, box: box ?? undefined });
    }
    await p.mouse.move(W - 6, H - 6);
    await p.evaluate(draw, { n, total: TOTAL, title, req, items: ready.filter((x) => x.box || x.keep), app: APP, w: W });
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, file) });
    await p.evaluate(() => document.getElementById('ann-root')?.remove());
    console.log('ok', file, ready.filter((x) => x.box).length + '/' + items.length);
  };
  const top = async () => p.evaluate(() => window.scrollTo(0, 0));
  const go = async (hash, wait = 1200) => { await p.goto(URL + hash); await p.waitForTimeout(wait); await top(); await p.waitForTimeout(150); };
  const scrollTo = async (sel, offset = 90) => p.evaluate(([s, o]) => { const e = document.querySelector(s); if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - o); }, [sel, offset]);
  const ME = 'Bc. Lucie Dvořáková';

  // ---- fresh demo; the coordinator already asked the patient for her e-mail by SMS at 8:55 (as via "Vyžádat")
  await p.goto(URL);
  await p.evaluate((me) => {
    localStorage.clear();
    localStorage.setItem('ekoordinace:case:alena', JSON.stringify({
      added: {}, resolved: {}, waived: {},
      events: [{ at: '2026-10-19T08:55', who: me, kind: 'vyzadano', text: 'Alena Procházková: Dobrý den,', to: 'Alena Procházková', channel: 'SMS', subject: '',
        body: 'Dobrý den,\npřed konziliem 21. 10. 2026 prosíme o Váš e-mail – stačí odpovědět na tuto zprávu.\nBc. Lucie Dvořáková, koordinátorka KOC Nemocnice Lipová', field: 'patientContact' }],
    }));
  }, ME);
  await p.reload();
  await p.waitForTimeout(3500);

  // 1 Přehled
  if (run(1)) {
    await go('#/prehled', 2500);
    await shot('01-prehled.png', 1, 'Přehled – ráno koordinátorky', '<b>Slide 9 · 03 Koordinovat:</b> fronta pacientů – u každého stav, termín a kdo je na tahu. <b>Slide 12 c), d)</b>', [
      { sel: '.overview .stats .stat', nth: 0, label: 'Na tahu jste vy', text: 'Kolik úkolů je teď na koordinátorce a u kolika pacientů. Stejné číslo svítí na zvonku.', side: 'top', dx: 160 },
      { sel: '.overview .stats .stat', nth: 1, label: 'Čeká na ostatní', text: 'Vyžádané zprávy bez odpovědi, potvrzení lékařem, nepřečtený závěr.', side: 'top', dx: 160 },
      { sel: '.overview .stats .stat', nth: 2, label: 'Nejbližší konzilium', text: 'Datum, za kolik dní a kolik podkladů je už potvrzeno.', side: 'top', dx: 160 },
      { sel: '#ov-mine li', nth: 0, label: 'Co, u koho a do kdy', text: 'Seřazeno podle termínu. Klik otevře přesně místo, kde se to řeší.', side: 'left' },
      { sel: '#ov-theirs li', nth: 0, label: 'Kdo je na tahu', text: 'SMS pacientce v 8:55 – teď se čeká na její odpověď. Vlastník každého kroku je vidět.', side: 'left' },
      { sel: '.overview section:last-child li', nth: 0, label: 'Dnes nové zprávy', text: 'Ráno přišla histologie – klik otevře pacientku.', side: 'left' },
      { sel: '.ai-btn', label: 'Zeptat se AI', text: 'Chat s Claude nad daty aplikace (snímek 17).', side: 'left' },
      { sel: 'a.icon-btn[href="#/prehled"]', label: 'Zvonek', text: 'Na každé obrazovce – kolik je na tahu koordinátorka.', side: 'bottom' },
    ]);
  }

  // 2 Žádanka od praktika (Bruno)
  if (run(2)) {
    await go('#/zadanka', 1500);
    await p.locator('button:has-text("David Sipos")').first().click().catch(() => console.log('  no sample button'));
    await p.waitForTimeout(6000);
    await top();
    await p.waitForTimeout(300);
    await shot('02-zadanka.png', 2, 'Žádanka od praktika – bez formuláře', '<b>Slide 7 · 01 Převzít:</b> jedno digitální místo pro vstup, žádný velký formulář – údaje se vyplní z nahraného dopisu. <b>Slide 12 a)</b>', [
      { sel: '.zd-steps', label: '3 kroky pro praktika', text: 'Dopis → kontrola → odeslat. Praktik nic nepřepisuje.', side: 'left' },
      { sel: '.zd-koc', label: 'Komu posíláte', text: 'Výběr komplexního onkologického centra.', side: 'left' },
      { sel: '.zd-data h2', label: 'Údaje z dopisu', text: 'Vyplněno z dopisu a zpráv; u každého pole „z dopisu“. Věty ověřené doslova, vše v prohlížeči.', side: 'left' },
      { sel: '.zd-data .chip.miss', nth: 0, label: 'Co chybí, je vidět', text: 'Praktik doplní jen to, co ví (tady e-mail).', side: 'right' },
      { sel: '.zd-docs', label: 'Zprávy z ambulance', text: 'Word, PDF, text – typ a datum se rozpoznají samy. Další zprávy jde přetáhnout.', side: 'left' },
      { sel: '.zd-send', label: 'Odeslat jedním klikem', text: 'Žádanka i zprávy odejdou do KOC – koordinátorka je uvidí v seznamu pacientů.', side: 'left' },
    ]);
  }

  // 3 Nový pacient a jeho zprávy (Word, PDF, RTF, fotka → OCR)
  if (run(3) || run(4)) {
    await go('#/pacienti', 1500);
    await p.locator('button:has-text("Nový pacient")').first().click();
    await p.fill('.new-pt input:not([type=date])', 'David Sipos');
    await p.fill('.new-pt input[type=date]', '2026-10-22');
    await p.click('.new-pt button[type=submit]');
    await p.waitForSelector('.add-reports input[type=file]', { state: 'attached' });
    const td = path.join(REPO, 'ekoordinace/public/test');
    await p.setInputFiles('.add-reports input[type=file]', [
      path.join(td, 'david-sipos/01_Laborator_PL_2026-08-21.docx'), path.join(td, 'david-sipos/02_Prakticky_lekar_epikriza_2026-08-24.docx'),
      path.join(td, 'david-sipos/03_Gastroskopie_2026-09-09.docx'), path.join(td, 'david-sipos-formaty/04_histologie_snimek.png'),
      path.join(td, 'david-sipos/05_CT_hrudniku_a_bricha_2026-09-21.docx'), path.join(td, 'david-sipos-formaty/06_zadost_KOC_text.pdf'),
      path.join(td, 'david-sipos/07_EUS_KOC_2026-10-06.docx'), path.join(td, 'david-sipos/08_Laborator_KOC_2026-10-12.docx'),
      path.join(td, 'david-sipos-formaty/09_kardiologie.rtf'), path.join(td, 'david-sipos/10_Nutricni_ambulance_KOC_2026-10-19.docx'),
    ]);
    await p.waitForFunction(() => document.querySelectorAll('.added li').length >= 10 && !/Rozpoznávám|Načítám|Čtu/.test(document.querySelector('.add-reports')?.textContent ?? ''), null, { timeout: 90000 }).catch(() => console.log('  upload wait timeout'));
    await p.waitForTimeout(2500);
    await scrollTo('.add-reports', 70);
    await shot('03-novy-pacient-zpravy.png', 3, 'Nový pacient – zprávy v jakékoli podobě', '<b>Zadání · Vyžádat a shromáždit:</b> vše na jednom místě. <b>Slide 7:</b> zprávy ze softwaru lékaře – Word, PDF, sken, fotka, screenshot.', [
      { sel: '.drop', label: 'Přetáhnout nebo Ctrl+V', text: 'Word, PDF s textem, sken, fotka, screenshot, RTF, text. Čte se v prohlížeči, nic neodchází.', side: 'left' },
      { sel: '.added li .mono', nth: 0, label: 'Datum zprávy samo', text: 'Z textu (odběr, vydání, „dne …“). Případ se po každé zprávě přepočítá.', side: 'left' },
      { sel: '.added li:has-text("snimek")', label: 'Fotka přečtená OCR', text: 'Značka „z obrázku – zkontrolujte text“; text jde jedním klikem opravit.', side: 'left' },
      { sel: '.added li:has-text("zadost_KOC")', label: 'PDF', text: 'Řádky se složí podle polohy na stránce; motor čte PDF stejně jako Word.', side: 'left' },
      { sel: '.added li:has-text("kardiologie")', label: 'RTF', text: 'I starší formát z ambulantního softwaru.', side: 'left' },
    ]);
  }

  // 4 Pacienti a hledání (David is processed now)
  if (run(4)) {
    await go('#/pacienti', 1500);
    await p.fill('.search input', 'histologie');
    await p.waitForTimeout(700);
    await shot('04-pacienti-hledani.png', 4, 'Pacienti a hledání', '<b>Slide 9 · 03 Koordinovat:</b> přehled případů (nový / aktivní) se stavem a termínem. <b>Slide 12 c)</b> · <b>Zadání:</b> vše dohledatelné na jednom místě.', [
      { sel: '.pt-row:has-text("David Sipos")', label: 'Jeden řádek = jeden pacient', text: 'David z 10 nahraných zpráv: diagnóza, co je na řadě a do kdy, konzilium, body k vyřešení.', side: 'left' },
      { sel: '.pt-row:has-text("Nový pacient") .pt-todo', label: 'Nový · k vyřešení · bez úkolů', text: 'Stejné číslo jako na kartě pacienta, v Přehledu i u konzilia.', side: 'left' },
      { sel: 'button:has-text("Nový pacient")', label: 'Nový pacient', text: 'Jméno a termín konzilia nepovinné – doplní se ze zpráv.', side: 'bottom' },
      { sel: '.search input', label: 'Hledat pacienta nebo zprávu', text: 'Nahoře na každé obrazovce: jméno, diagnóza, „CT“, „histologie“, „Říčany“.', side: 'left', dx: -40 },
      { sel: '.search-hits li', nth: 0, label: 'Zprávy napříč pacienty', text: 'Pacient tučně, pod ním zpráva a datum.', side: 'right', dx: 20 },
      { sel: '.search-hits li', nth: 2, label: 'Klik = rovnou ta zpráva', text: 'Otevře pacienta na záložce Zprávy s vybranou zprávou.', side: 'bottom' },
    ]);
    await p.fill('.search input', '');
  }

  // 5 Souhrn Aleny
  if (run(5)) {
    await go('#/pacienti/alena', 1800);
    await shot('05-souhrn.png', 5, 'Pacientka – Souhrn', '<b>Slide 9–10 · 03 Koordinovat:</b> kde případ je, kdo je na tahu a do kdy. <b>Slide 12 d)</b> vlastník každého dalšího kroku.', [
      { sel: '.patient-head .facts', label: 'Hlavička', text: 'Narozena, pojišťovna, diagnóza z histologie, konzilium „za 2 dny“ (mění se přes „změnit“).', side: 'top', dx: 380 },
      { sel: '.head-actions', label: 'Akce', text: 'Zavolat (čísla ze zpráv), Vyžádat zprávu, Napsat praktikovi.', side: 'left' },
      { sel: '.stepper', label: 'Cesta pacientky', text: 'Žádost → předchozí zprávy → vyšetření → podklad → závěr praktikovi. Hotové kroky se zatrhnou.', side: 'left' },
      { sel: '.panel-meta', label: 'Úkol pro vás · do 20. 10.', text: 'Kdo je na tahu a termín – den před konziliem.', side: 'left' },
      { sel: '.todo-item', nth: 0, label: 'Úkol s kontaktem', text: 'Co chybí, proč, komu zavolat (telefon ze zprávy), Doplnit údaj / Vyžádat.', side: 'left' },
      { sel: '.todo-sent', nth: 0, label: 'Vyžádáno · čeká na odpověď', text: 'SMS pacientce odešla v 8:55 – je vidět u úkolu.', side: 'left' },
    ]);
  }

  // 6 Údaje pro konzilium – only conflicts
  if (run(6) || run(7) || run(8)) {
    await go('#/pacienti/alena/udaje', 1800);
    await p.click('.udaje-filter .filter.conf');
    await p.waitForTimeout(500);
    await scrollTo('.udaje-head', 24);
    await shot('06-udaje.png', 6, 'Údaje pro konzilium (handover)', '<b>Slide 8 · 02 Vytěžit:</b> pevná struktura (20 položek Handover_obsah), označí, co chybí a co nesedí, výstup v kopírovatelných částech. <b>Slide 12 b)</b>', [
      { sel: '.udaje-filter', label: 'Vše 20 · Hotovo · Chybí · Rozpor', text: 'Kontrola úplnosti 20 položek šablony – filtr ukáže, co chybí a co nesedí.', side: 'left' },
      { sel: '.udaje-title .copy-btn', label: 'Kopírovat vše', text: 'Celý handover do nemocničního systému; každá položka i zvlášť.', side: 'left' },
      { sel: '#field-medication .chip', label: 'Stav položky', text: 'Nalezeno / Chybí / Rozpor / Doplněno / Ověřeno.', side: 'left' },
      { sel: '#field-medication .todo-why', label: 'Co nesedí', text: 'Poslední dávka apixabanu zapsaná až po výkonu – nemožné datum.', side: 'left' },
      { sel: '#field-medication .todo-quotes', label: 'Doslovné věty ze zprávy', text: 'Žádná parafráze; „Ukázat ve zprávě“ otevře originál.', side: 'left' },
      { sel: '#field-medication .todo-people', label: 'Komu zavolat', text: 'Autor zprávy a pracoviště – kontakty přímo ze zpráv.', side: 'left' },
      { sel: '#field-medication .todo-box .form-actions', label: 'Zapsat ověření · Napsat dotaz · Ponechat', text: 'Výsledek telefonátu se zapíše (kdo, kdy). Bez času: „Ponechat“ s důvodem.', side: 'left' },
    ]);
  }

  // 7 Citace – otevřená zpráva se zvýrazněnou větou
  if (run(7)) {
    await p.locator('#field-histology .field-src .src-link').first().click();
    await p.waitForTimeout(1000);
    await shot('07-citace.png', 7, 'Každý údaj má zdroj', '<b>Zadání:</b> údaje přebírat bez domýšlení. <b>Slide 8:</b> AI připraví návrh, člověk ho ověří – klik ukáže větu v původní zprávě.', [
      { sel: 'dialog[open] .viewer-bar', label: 'Původní zpráva', text: 'Celý dokument tak, jak přišel – pracoviště a datum.', side: 'left' },
      { sel: 'dialog[open] .viewer-scroll mark:has-text("Duktální")', label: 'Zvýrazněná věta', text: 'Přesně ta věta, ze které aplikace hodnotu převzala. Co oporu ve zprávě nemá, se jako fakt neukáže.', side: 'left' },
      { sel: 'dialog[open] .viewer-scroll mark:has-text("Datum vydání")', label: 'Datum ze zprávy', text: 'Vydáno 19. 10. – proto je v Údajích rozpor s odběrem 20. 10.', side: 'left' },
      { sel: 'dialog[open] .viewer-hint', label: 'Vysvětlivka', text: 'Zvýrazněno = věta, ze které aplikace vychází.', side: 'left' },
    ]);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);
  }

  // 8 Vyžádat doplnění (ECOG from the GP)
  if (run(8)) {
    await top();
    await p.click('.udaje-filter .filter.miss');
    await p.waitForTimeout(500);
    await scrollTo('#field-performance', 160);
    await p.locator('#field-performance .todo-box button:has-text("Vyžádat")').first().click().catch(() => console.log('  no Vyžádat'));
    await p.waitForTimeout(900);
    await shot('08-vyzadat.png', 8, 'Vyžádat doplnění od lékaře', '<b>Slide 8 · 02 Vytěžit:</b> koordinátor může přes software požádat lékaře o doplnění. <b>Zadání:</b> vyžádat chybějící zprávy.', [
      { sel: 'dialog[open] select', nth: 0, label: 'Týká se', text: 'Vybraný chybějící údaj – tady ECOG.', side: 'left' },
      { sel: 'dialog[open] select', nth: 1, label: 'Komu', text: 'Praktik, pracoviště z úkolů, pacient, kontaktní osoba.', side: 'left' },
      { sel: 'dialog[open] select', nth: 2, label: 'Jak', text: 'Zabezpečená zpráva, e-mail nebo SMS (odeslání je v prototypu simulované).', side: 'right' },
      { sel: 'dialog[open] textarea', label: 'Předvyplněný text', text: 'Co chybí, jméno, datum narození, termín konzilia, podpis – stačí odeslat.', side: 'left' },
      { sel: 'dialog[open] button:has-text("Odeslat")', label: 'Odeslat', text: 'U úkolu pak svítí „Vyžádáno … čeká na odpověď“ a zapíše se do záznamu koordinace.', side: 'left' },
    ]);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);
  }

  // 9 Zprávy (Bruno) – filtered to histology so the reports after the MDT fit on the screen
  if (run(9)) {
    await go('#/pacienti/alena/zpravy', 1800);
    await p.locator('.zp-pill:has-text("Histologie")').first().click().catch(() => console.log('  no pill'));
    await p.waitForTimeout(500);
    await scrollTo('.zp', 150);
    await shot('09-zpravy.png', 9, 'Zprávy – vše na jednom místě', '<b>Zadání · Vyžádat a shromáždit:</b> všechny zprávy na jednom místě. <b>Upozornění zadavatele:</b> co vzniklo po konziliu, do podkladu nepatří.', [
      { sel: '.zp-side .card-head .muted', label: '11 zpráv do konzilia', text: 'Všechny zprávy pacientky na jednom místě, nejnovější nahoře.', side: 'top' },
      { sel: '.zp-filter', label: 'Filtr podle typu', text: 'Histologie, laboratoř, endoskopie, CT, žádanky, ultrazvuk… (tady vybrána histologie).', side: 'left' },
      { sel: '.zp-side .doc-row', nth: 0, label: 'Zpráva v seznamu', text: 'Typ, název, pracoviště, datum; „dnes“ = nově přišlá.', side: 'left' },
      { sel: '.zp-detail', label: 'Souhrn vybrané zprávy', text: 'Hlavní body doslovně, co z ní aplikace převzala a jaké rozpory se jí týkají; „Otevřít originál“.', side: 'top', dx: 60 },
      { sel: '.zp-after', label: 'Po konziliu – nepatří do podkladu', text: 'Algeziologie 26. 10. a psycholog 27. 10. (zprávy 12 a 13 ze zadání) – vidět zvlášť, do podkladu se nezapočítají.', side: 'left' },
    ]);
  }

  // 10 Plán cesty (Bruno) – order and state
  if (run(10)) {
    await go('#/pacienti/alena/plan', 1800);
    await scrollTo('main .stats', 100);
    await shot('10-plan.png', 10, 'Plán cesty – pořadí a stav', '<b>Slide 10 · 03 Koordinovat:</b> digitální plán – pořadí kroků, termíny, kdo je na tahu. <b>Slide 9:</b> stav, termín, zpoždění. <b>Slide 12 d)</b>', [
      { sel: 'main .stats .stat', nth: 1, label: 'Na tahu: Vy · do 20. 10.', text: 'Kde případ je, kdo teď jedná a do kdy; další termín – konzilium 21. 10.', side: 'bottom', dx: 120 },
      { sel: 'main .stats .stat', nth: 3, label: 'Hlídání termínů', text: '„1 zpoždění“ – histologie o 2 pracovní dny; počítá se v pracovních dnech.', side: 'left' },
      { sel: 'button:has-text("Spustit sadu kroků")', label: 'Sada kroků podle diagnózy', text: 'Karcinom slinivky: doplní kroky, které případu chybí.', side: 'left' },
      { sel: '.plan-flow', label: 'Pořadí kroků', text: 'CT → biopsie → odběry → histologie → podklad → konzilium → závěr.', side: 'left' },
      { sel: '.plan-legend', label: 'Stav každého vyšetření', text: 'Vyžádáno → objednáno → provedeno → výsledek doručen.', side: 'left' },
      { sel: '#plan-ct', label: 'CT v KOC 1 – „jiné centrum“', text: 'Termín, místo, kdo vyžádal, stav; otevřít zprávu nebo citaci ze žádanky.', side: 'left' },
    ]);
  }

  // 11 Plán cesty – what follows: MDT, conclusion, supportive care, SMS / e-mail
  if (run(11)) {
    await go('#/pacienti/alena/plan', 1800);
    await scrollTo('#plan-podklad', 40);
    await shot('11-plan-navaznost.png', 11, 'Plán cesty – návaznost, SMS a e-mail', '<b>Slide 10 · 03 Koordinovat:</b> kdo je na tahu u každého kroku, návaznost, e-mail/SMS. <b>Zadání:</b> algeziolog a psycholog po konziliu.', [
      { sel: '#plan-podklad .plan-who', label: 'Teď na řadě – Vy', text: 'Podklad pro konzilium do 20. 10.; u každého kroku sloupec „Na tahu“.', side: 'left' },
      { sel: '#plan-konzilium', label: 'Konzilium navazuje', text: '„Pozor, nejdřív musí být hotovo“ – podklad do 20. 10.', side: 'left' },
      { sel: '#plan-zaver', label: 'Závěr praktikovi', text: 'Po konziliu, s doručenkou – „Otevřít závěr“.', side: 'left' },
      { sel: '#plan-algeziologie .plan-place', label: 'Algeziologie v KOC 1', text: 'Jiné centrum – Centrum léčby bolesti, 26. 10.', side: 'right' },
      { sel: '#plan-algeziologie .plan-phases', label: 'Vyžádáno ✓ Objednáno ✓', text: 'Další krok: provedeno → výsledek doručen.', side: 'left' },
      { sel: '#plan-algeziologie .plan-who', label: 'Na tahu: KOC Nemocnice Severní', text: 'U kroku jiného centra je vidět, kdo jedná.', side: 'left' },
      { sel: '#plan-algeziologie button:has-text("SMS pacientce")', label: 'SMS pacientce · E-mail pracovišti', text: 'Simulované; zapíše se do záznamu koordinace.', side: 'bottom' },
      { sel: '.history-head', label: 'Záznam koordinace', text: 'Každá SMS, e-mail, telefonát, ověření a potvrzení – kdo, kdy, komu.', side: 'left' },
    ]);
  }

  // 12 Podklad zamčený
  if (run(12)) {
    await go('#/pacienti/alena/podklad', 1800);
    await shot('12-podklad-zamceno.png', 12, 'Podklad pro konzilium – zamčeno', '<b>Slide 8:</b> AI připraví návrh, <b>lékař potvrdí</b>. Dokud nejsou body vyřešené, nejde potvrdit. <b>Odevzdávka č. 2:</b> zápis podle MDT_zapis.', [
      { sel: '.pk-gate h3', label: 'Nejdřív vyřešte 4 body', text: 'Co brání potvrzení – stejné body jako v Údajích.', side: 'left' },
      { sel: '.pk-gate-act', nth: 0, label: 'Vyřešit nebo Ponechat', text: '„Vyřešit“ otevře formulář; „Ponechat“ s důvodem – v podkladu bude označeno jako neověřené.', side: 'right' },
      { sel: '.pk-locked', label: 'Potvrdit a vygenerovat PDF', text: 'Zamčené tlačítko – je vidět, co bude, a proč zatím ne.', side: 'left' },
      { sel: '.pk-head', label: 'Zápis k jednání MDT · návrh', text: '7 částí šablony MDT_zapis; každý údaj se zdrojem a příznakem.', side: 'left' },
    ]);
  }

  // ---- after the coordinator's work: everything resolved, confirmed by the doctor (as via Údaje and Podklad)
  await p.evaluate((me) => {
    localStorage.setItem('ekoordinace:case:alena', JSON.stringify({
      added: {
        performance: { value: 'ECOG 1 – soběstačná, zvládá lehkou práci', source: 'telefonát – MUDr. Tomáš Řezníček (praktický lékař)', at: '2026-10-19T10:12', who: me },
        patientContact: { value: 'alena.prochazkova@example.cz', source: 'telefonát – Alena Procházková (pacientka)', at: '2026-10-19T09:20', who: me },
      },
      resolved: {
        medication: { note: 'apixaban vysazen 10. 10. večer, v protokolu je překlep', at: '2026-10-19T10:31', who: me, with: 'MUDr. Martin Svoboda (endoskopické pracoviště)' },
        histology: { note: 'odběr byl 12. 10., v nálezu je chybné datum', at: '2026-10-19T10:44', who: me, with: 'MUDr. Radek Pokorný, Ph.D. (ústav patologie)' },
      },
      waived: {},
      events: [
        { at: '2026-10-19T08:55', who: me, kind: 'vyzadano', text: 'Alena Procházková: Dobrý den,', to: 'Alena Procházková', channel: 'SMS', subject: '', body: 'Dobrý den,\npřed konziliem 21. 10. 2026 prosíme o Váš e-mail – stačí odpovědět na tuto zprávu.', field: 'patientContact' },
        { at: '2026-10-19T09:20', who: me, kind: 'telefonat', text: 'Alena Procházková (pacientka): alena.prochazkova@example.cz', field: 'patientContact' },
        { at: '2026-10-19T10:12', who: me, kind: 'telefonat', text: 'MUDr. Tomáš Řezníček (praktický lékař): ECOG 1 – soběstačná, zvládá lehkou práci', field: 'performance' },
        { at: '2026-10-19T10:31', who: me, kind: 'overeno', text: 'MUDr. Martin Svoboda (endoskopické pracoviště): apixaban vysazen 10. 10. večer, v protokolu je překlep', field: 'medication' },
        { at: '2026-10-19T10:44', who: me, kind: 'overeno', text: 'MUDr. Radek Pokorný, Ph.D. (ústav patologie): odběr byl 12. 10., v nálezu je chybné datum', field: 'histology' },
        { at: '2026-10-19T11:05', who: 'MUDr. Lenka Marková', kind: 'potvrzeno', text: 'podklad pro konzilium potvrzen' },
      ],
      confirmed: { by: 'MUDr. Lenka Marková', at: '2026-10-19T11:05' },
    }));
  }, ME);
  await p.reload();
  await p.waitForTimeout(3000);

  // 13 Podklad vygenerovaný
  if (run(13) || run(14)) {
    await go('#/pacienti/alena/podklad', 1800);
    await shot('13-podklad-pdf.png', 13, 'Podklad potvrzen → PDF', '<b>Slide 8 · Hotovo, když:</b> koordinátor vidí lékařem potvrzený handover. <b>Slide 12 e)</b> strukturovaný výstup. <b>Odevzdávka č. 2.</b>', [
      { sel: '.pk-out-main', label: 'Vygenerovaný podklad', text: '„Podklad MDT – Alena Procházková – 21. 10. 2026.pdf“ – kdo a kdy ho potvrdil.', side: 'bottom', dx: 120 },
      { sel: 'button:has-text("Stáhnout PDF")', label: 'Stáhnout PDF', text: 'Pro členy MDT předem a na promítání; tiskne se jen dokument (A4).', side: 'bottom' },
      { sel: 'button:has-text("Kopírovat do NIS")', label: 'Kopírovat do NIS', text: 'Text do nemocničního systému, kde vzniká oficiální zápis.', side: 'bottom', dx: 30 },
      { sel: '.pk-src', nth: 0, label: 'Zdroj u každého údaje', text: 'I v PDF je u hodnoty zpráva, ze které je.', side: 'left' },
      { sel: '.pk-flag.ok', nth: 1, label: 'Doplněno / ověřeno', text: 'ECOG doplněn telefonátem s praktikem v 10:12 – je vidět, od koho a kdy.', side: 'left' },
    ]);
  }

  // 14 Podklad – parts 5–7, at the MDT
  if (run(14)) {
    await scrollTo('textarea[aria-label="Závěr MDT"]', 560);
    await p.waitForTimeout(300);
    await shot('14-podklad-mdt.png', 14, 'Na konziliu: části 6 a 7', '<b>Odevzdávka č. 2:</b> zápis podle MDT_zapis. <b>Zadání:</b> do podkladu jen to, co bylo známo ke dni konzilia.', [
      { sel: '.pk-table tbody tr:last-child', label: '5 · Výsledky vyšetření', text: 'Chronologicky, doslova, s pracovištěm. Poslední je histologie 19. 10. – co přišlo po konziliu, tu není.', side: 'left' },
      { sel: 'textarea[aria-label="Závěr MDT"]', label: '6 · Závěr MDT', text: 'Píše se přímo na konziliu – lékař nebo zapisovatel nad promítnutým podkladem.', side: 'left' },
      { sel: 'textarea[aria-label="Doporučení MDT"]', label: '7 · Doporučení MDT', text: 'Samo se přenese do závěru pro praktika – nic se nepřepisuje.', side: 'left' },
    ]);
  }

  // 15 Závěr praktikovi s doručenkou
  if (run(15)) {
    await go('#/pacienti/alena/zaver', 1800);
    await p.locator('.zaver-bar .btn-primary').first().click().catch(() => console.log('  no send'));
    await p.waitForFunction(() => /Přečteno\s*\d/.test(document.querySelector('.zaver-bar')?.textContent ?? ''), null, { timeout: 25000 }).catch(() => console.log('  receipt not read yet'));
    await p.waitForTimeout(600);
    await top();
    await shot('15-zaver.png', 15, 'Závěr praktikovi s doručenkou', '<b>Slide 11 · 04 Zpětná vazba:</b> strukturovaný výsledek s původním kontextem, předání potvrzené. <b>Slide 12 e), f)</b> · <b>Odevzdávka č. 3.</b>', [
      { sel: '.zaver-bar .receipt', label: 'Doručenka', text: 'Odesláno → Doručeno → Přečteno s časem. Dokud praktik nečte, jde Urgovat.', side: 'bottom' },
      { sel: '.zaver-bar .form-actions', label: 'Kopírovat · Tisk / PDF', text: '„Odeslat praktikovi“ bylo zamčené, dokud lékař nepotvrdil podklad.', side: 'bottom' },
      { sel: '.zaver-meta', label: 'Původní kontext', text: 'Adresát, pacientka, diagnóza se zdrojem, datum konzilia.', side: 'left' },
      { sel: '.zaver-paper textarea', nth: 0, label: 'Závěr a doporučení MDT', text: 'Slovy lékařů z konzilia; u Aleny podle vzoru MDT_zaver ze zadání.', side: 'left' },
      { sel: '.zaver-sample', label: 'Ukázka', text: 'Konzilium je až 21. 10. – v demu je vidět, co pak praktik dostane.', side: 'left' },
    ]);
  }

  // 16 Konzilia
  if (run(16)) {
    await go('#/konzilia', 2500);
    await shot('16-konzilia.png', 16, 'Konzilia – program a připravenost', '<b>Slide 9 · 03 Koordinovat</b> a <b>slide 12 c), e)</b>: u každého konzilia je vidět, kdo na něm je a jak hotový je jeho podklad.', [
      { sel: '.kz-head', nth: 0, label: 'Konzilium podle data', text: 'Den, za kolik dní, počet pacientů a „1 z 1 podkladu potvrzeno“.', side: 'left' },
      { sel: '.kz-state:has-text("Potvrzeno")', label: 'Potvrzeno – PDF', text: 'Alena: podklad potvrdila MUDr. Marková – připraveno.', side: 'bottom', dx: 60 },
      { sel: '.kz-q', nth: 0, label: 'Otázka pro MDT', text: 'Co praktik od konzilia chce – doslova ze žádanky.', side: 'left' },
      { sel: '.kz-state:has-text("k vyřešení")', nth: 0, label: 'Body k vyřešení', text: 'Další konzilium: u koho ještě něco chybí.', side: 'left' },
      { sel: 'button:has-text("Program konzilia")', label: 'Program konzilia', text: 'PDF: pacienti, diagnózy, otázky a stav podkladů.', side: 'left' },
    ]);
  }

  // 17 AI asistent
  if (run(17)) {
    await go('#/prehled', 2500);
    await p.click('.ai-btn');
    await p.waitForTimeout(500);
    const ask = async () => {
      await p.locator('.ai-suggest .chip-btn, .ai-suggest button').first().click();
      await p.waitForFunction(() => document.querySelector('.ai-answer') || document.querySelector('.ai-msg.error'), null, { timeout: 90000 }).catch(() => {});
    };
    await ask();
    if (await p.$('.ai-msg.error')) {
      console.log('  AI error, retry:', await p.textContent('.ai-msg.error'));
      await p.fill('.ai-form textarea', 'Co mám dnes udělat jako první?');
      await p.click('.ai-form button[type=submit]');
      await p.waitForFunction(() => document.querySelectorAll('.ai-answer').length || document.querySelectorAll('.ai-msg.error').length > 1, null, { timeout: 90000 }).catch(() => {});
    }
    await p.waitForTimeout(500);
    await p.evaluate(() => { const m = document.querySelector('.ai-msgs'); if (m) m.scrollTop = 0; });
    await p.waitForTimeout(200);
    await shot('17-ai.png', 17, 'Zeptat se AI (Claude)', '<b>AI nad vším v aplikaci:</b> pacienti, zprávy a kdy přišly, úkoly, konzilia, záznam koordinace. Odpovídá <b>jen z dat a se zdrojem</b>; data odcházejí pseudonymizovaná.', [
      { sel: '.ai-btn', label: 'Ikona AI', text: 'Vpravo nahoře na každé obrazovce.', side: 'bottom' },
      { sel: '.ai-msg.user', label: 'Otázka běžnou řečí', text: '„Co mám dnes udělat jako první?“, „Kdy přišla histologie?“', side: 'left' },
      { sel: '.ai-answer', clip: '.ai-msgs', label: 'Odpověď se zdrojem', text: 'Shrnutí a odrážky: jméno tučně, zdroj šedě. Co v datech není, AI nedomýšlí.', side: 'left' },
      { sel: '.ai-head small, .ai-head p', label: 'Jen z dat v aplikaci', text: 'Rodná čísla, telefony, e-maily, adresy a jména se před odesláním nahradí značkami; zpět se doplní až v prohlížeči.', side: 'left' },
    ]);
  }

  await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
