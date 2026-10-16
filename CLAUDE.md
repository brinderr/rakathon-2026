# Rakathon 2026 – tímový projekt (Bruno + Matej)

Hackathon proti rakovine v Prahe. Sme **dvaja ľudia, každý má vlastný Claude Code**,
a pracujeme v jednom repe. Tento súbor číta Claude Code automaticky na začiatku každej session.

## Kto som?
Meno aktuálneho používateľa je v súbore `.me` v koreni repa (je v `.gitignore`, každý má svoj).
Ak `.me` chýba, povedz používateľovi, nech spustí `./scripts/setup.sh bruno` (alebo `matej`).
Kolega = ten druhý z dvojice.

## Povinný rituál (rob ho sám, netreba to pripomínať)

**Na začiatku session** (hook ti už vypísal stav, ale over si ho):
1. `git pull --rebase --autostash`
2. Prečítaj `STATUS.md` (kto čo robí) a posledné záznamy v `team/<kolega>/LOG.md`.
3. Prečítaj `team/<ja>/INBOX.md`. Ak sú tam nové správy od kolegu, povedz mi ich.

**Pri každom prompte** ti hook pripojí info, či kolega pushol niečo nové.
Ak áno, pred zásahom do súborov, ktorých sa to týka, sprav `git pull --rebase --autostash`.

**Po dokončení každého logického kroku** (funkcia funguje, research je spísaný, oprava je hotová):
1. Pridaj 1–3 riadky do `team/<ja>/LOG.md` (čo, prečo, kde, čo ďalej).
2. Ak sa zmenil stav úlohy, uprav `STATUS.md`.
3. Commitni a pushni (pravidlá nižšie). Nečakaj na koniec dňa. Malé a časté commity = menej konfliktov.

## Štruktúra repa
| Cesta | Na čo | Kto zapisuje |
|---|---|---|
| `STATUS.md` | Tabuľa úloh: kto robí čo, čo je hotové, blokery | obaja |
| `docs/DECISIONS.md` | Dôležité rozhodnutia (stack, nápad, dataset) + prečo | obaja |
| `docs/research/` | Spracovaný research (súhrny, porovnania) | obaja |
| `docs/materials/` | Podklady od organizátorov (prezentácie, PDF, zadania) | obaja |
| `app/` | Samotný produkt / kód | obaja, podľa vlastníctva v STATUS.md |
| `team/bruno/`, `team/matej/` | Osobný LOG, INBOX a pracovný priestor | **iba vlastník** (výnimka: INBOX kolegu) |

## Komunikácia medzi Claudmi
- Chceš niečo od kolegu alebo jeho Clauda? Pripíš správu **do jeho** `team/<kolega>/INBOX.md`
  (formát: `- [ ] 2026-10-16 14:05 od bruno: text`), commitni a pushni.
- Keď správu vybavíš, zmeň `[ ]` na `[x]` v tvojom INBOX.md.
- Rozhodnutia, ktoré ovplyvnia oboch, zapíš do `docs/DECISIONS.md`, nie iba do logu.

## Pravidlá commitov
- Formát správy: `[bruno] krátky popis` / `[matej] krátky popis`.
- Pred pushom: `git pull --rebase --autostash`, potom `git push`. Pri konflikte ho vyrieš a
  ak ide o súbor kolegu, radšej sa ho spýtaj cez INBOX, než aby si jeho prácu prepísal.
- Pracujeme na `main` (hackathon = rýchlosť). Väčší experiment → vlastná vetva `bruno/xyz`.
- **Necommitovať:** `.env` a kľúče, veľké dáta (`data/raw/`), `node_modules`, `.venv`, buildy,
  osobné dáta pacientov (nikdy!). Veľké súbory → odkaz do `docs/materials/LINKS.md`.
- Commituj: kód, research a súhrny, rozhodnutia, LOG/STATUS/INBOX, malé vzorové dáta.

## Kontext hackathonu
Pozri `docs/research/` (doplníme: zameranie, výzvy, minuloroční víťazi, kritériá hodnotenia).
