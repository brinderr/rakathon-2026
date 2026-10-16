---
description: Zapíš, čo som spravil, aktualizuj STATUS, commitni a pushni
argument-hint: "[voliteľná poznámka]"
---
Kto som, je v `.me`. Poznámka od používateľa: $ARGUMENTS

1. Pozri `git status` a `git diff`, aby si vedel, čo sa zmenilo.
2. Pridaj do `team/<ja>/LOG.md` záznam: `## YYYY-MM-DD HH:MM` + 2–5 odrážok
   (čo hotové, kde to je, čo ďalej, prípadné blokery).
3. Aktualizuj môj riadok/úlohy v `STATUS.md`.
4. Ak padlo rozhodnutie, ktoré ovplyvní aj kolegu, zapíš ho do `docs/DECISIONS.md`.
5. Skontroluj, že necommituješ tajomstvá, `.env`, veľké dáta ani osobné údaje.
6. `git add` relevantných súborov → `git commit -m "[<ja>] popis"` →
   `git pull --rebase --autostash` → `git push`.
7. Povedz mi jednou vetou, čo si pushol.
