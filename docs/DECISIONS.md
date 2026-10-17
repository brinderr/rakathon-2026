# Rozhodnutia

Formát: `## YYYY-MM-DD – názov` · **Rozhodnutie** · **Prečo** · **Kto**

## 2026-10-16 – Spôsob spolupráce
**Rozhodnutie:** Jedno repo, práca na `main`, malé časté commity, osobné priečinky `team/<meno>/`,
synchronizácia cez hooky v `.claude/`.
**Prečo:** Hackathon = rýchlosť, dvaja ľudia, každý vo vlastnom Claude Code.
**Kto:** bruno

## 2026-10-17 – CORDIN: aplikácia od základu, po krokoch
**Rozhodnutie:** Produkt sa volá **CORDIN**. Staviame novú appku v `cordin/` od nuly, krok za krokom (každý krok = jedna obrazovka, schvaľuje Matej). Značka: logo A1 „kruh“, farby a písmo podľa VZP (bez ich loga a trojuholníka), rohy 10/8/6/4 px, rozloženie podľa predlohy (bočný panel, hlavička pacienta so záložkami, kľúčové údaje, cesta pacientky + „Teď na řadě“). Dáta počíta spoločný motor (`app/src/ai`). Stará appka v `app/` ostáva ako záloha a demo na odovzdanie, kým nová nebude hotová. Nasadenie na Vercel (Root Directory `cordin`) – čaká na prepojenie repa.
**Prečo:** Stará appka bola na prvý pohľad neprehľadná (veľa vecí naraz) a jej hlavný tok bral ručne napísané dáta namiesto motora. Zadanie chce funkčný tok koordinátora; budujeme ho od najnutnejšieho.
**Kto:** matej (so svojím Claude), 08:15

## 2026-10-17 – Názov eKoordinace a appka po sekciách
**Rozhodnutie:** Produkt sa volá **eKoordinace** (namiesto CORDIN), priečinok `cordin/` → `ekoordinace/`. Appka je rozdelená na rám (`src/App.tsx`), zoznam sekcií (`src/sections.tsx`), zdieľaný vzhľad (`src/styles.css`, `src/ui/`) a sekcie v `src/sections/<sekcia>/` s vlastníkom: Pacienti = matej, Konzilia = bruno. Zdieľané súbory len po dohode, pred pushom `npm run check`. Cesta pacientky má 5 krokov – „vytěžit“ vypadol, to robí appka, nie krok pacientky. Vercel: Root Directory `ekoordinace`.
**Prečo:** Matej vybral názov v štýle štátnych e-služieb (eRecept, eNeschopenka). Delenie na sekcie, aby Bruno a Matej mohli robiť naraz bez konfliktov.
**Kto:** matej (so svojím Claude), 09:05
