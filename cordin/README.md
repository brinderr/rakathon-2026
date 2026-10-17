# CORDIN – aplikácia od základu

Nová, čistá aplikácia pre koordinátora KOC (výzva VZP „Cesta pacienta bez ztráty informací“). Staviame ju po krokoch,
každý krok je jedna obrazovka a schváli ho Matej. Stará aplikácia v `app/` ostáva nedotknutá ako záloha.

- **Značka:** logo A1 „kruh“ (slučka praktik → centrum → konzílium → praktik, šípka = kto je na ťahu), farby VZP
  (červená #D22D0F len pre „teraz“ a hlavnú akciu), písmo Source Sans 3 + Source Code Pro, rohy 10/8/6/4 px.
- **Rozloženie:** podľa predlohy (bočný panel, horná lišta, hlavička pacienta so záložkami, riadok kľúčových údajov,
  vľavo cesta pacientky, vpravo „Teď na řadě“). Sivé položky sa zapĺňajú v ďalších krokoch.
- **Dáta:** `npm run data` spustí spoločný motor (`app/src/ai`, len pravidlá) nad fiktívnymi správami a zapíše
  `src/data/alena.json`. Nič nie je vpísané ručne.

```bash
cd cordin
npm install
npm run dev           # http://localhost:5173
npm run data          # prepočíta src/data/alena.json z motora
npm run build         # produkčný build do dist/
npm run preview:pack -- /cesta/preview.html   # jeden súbor na dočasný náhľad
```

**Nasadenie:** Vercel, projekt s Root Directory `cordin` (build `npm run build`, výstup `dist`). Čaká na prepojenie
repa s Vercelom.

| Krok | Čo | Stav |
|---|---|---|
| 0 | Základ: nová appka, značka, rozloženie | hotovo |
| 1 | Prehľad: cesta pacientky v 6 krokoch zo zadania + čo je teraz na rade | hotovo |
