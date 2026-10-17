# LOG – bruno

Najnovšie záznamy dole. Formát: `## YYYY-MM-DD HH:MM` + odrážky.
## 2026-10-16
- Založené repo: CLAUDE.md, hooky (.claude/), príkazy /sync /handoff /msg, STATUS, DECISIONS.
- Ďalej: research o Rakathone do docs/research/.

## 2026-10-16 ~14:00
- Research hotový: docs/research/00-SUHRN.md (začni tam), 01 web+víťazi 2025, 02 prednášky, 03 tech prostredie, 04 Slack výzvy a pravidlá.
- 26 materiálov zo Slacku v docs/materials/slack/ (INDEX.md).
- Ďalej: vybrať výzvu do 19:00. Môj tip: VZP mamograf, záloha MEDDI ONCO / MDT Copilot.

## 2026-10-17 04:05
- Kolo kvality 1 (R1 UX, R2 fakty, R3 test, R4 Maťova AI → opravy → verify) a kolo 2 (mobil, demo časy, Vyžiadané správy, Urgovať, nálezy poroty R5). Build OK, verify 159/159, eval Alena 20/20 · 17/17 · 0, Novák 20/20 · 13/13 · 0. Detaily: app/qa/VYSLEDOK.md.
- Fact-check pitchu: docs/kontext/raw-pitch-factcheck.md (37 opráv, poslané Maťovi do INBOX).
- Titulný obrázok 16:9: docs/odovzdanie/cover.png (zdroj cover.html, názov produktu = parameter ?name=).
- Online demo (artifact, súkromné – Bruno musí zdieľať): https://claude.ai/artifact/5JEhKBgT3g6mhAQ44PrHH4. Build: `VITE_EMBED=1 npx vite build --base ./` + `node scripts/pack-artifact.mjs <dist> <out>`.
