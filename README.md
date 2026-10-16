# Rakathon 2026 – Praha 🎗️

Tím: **Bruno** + **Matej**. Každý pracuje vo vlastnom Claude Code, spolu v tomto repe.

## Štart (každý raz, na svojom počítači)
```bash
git clone https://github.com/<owner>/rakathon.git
cd rakathon
./scripts/setup.sh matej        # alebo bruno
claude                          # alebo otvor priečinok v Claude desktop appke
```
`setup.sh` vytvorí lokálny súbor `.me` (necommituje sa), podľa ktorého Claude vie, kto si.

## Ako to funguje
- **`CLAUDE.md`** – spoločné pravidlá. Claude Code ho číta automaticky v každej session.
- **Hook pri štarte session** – automaticky pullne, ukáže posledné commity, `STATUS.md`,
  posledný LOG kolegu a nevybavené správy v tvojom INBOX-e.
- **Hook pri každom prompte** – Claude sa dozvie, či kolega medzitým pushol niečo nové
  (a ktoré súbory). Fetch beží na pozadí, takže nič nespomaľuje.
- **`STATUS.md`** – kto čo robí. **`docs/DECISIONS.md`** – čo sme rozhodli a prečo.
- **`team/<meno>/LOG.md`** – denník práce. **`team/<meno>/INBOX.md`** – správy od kolegu.

## Príkazy v Claude Code
| Príkaz | Čo spraví |
|---|---|
| `/sync` | pullne a zhrnie, čo spravil kolega a či odo mňa niečo potrebuje |
| `/handoff [poznámka]` | zapíše LOG + STATUS, commitne a pushne |
| `/msg text` | pošle správu kolegovi do INBOX-u (jeho Claude ju uvidí) |

## Zlaté pravidlá
1. Commituj malé kroky často (`[meno] popis`), vždy `pull --rebase` pred pushom.
2. Do cudzieho `team/<kolega>/` nezapisuj, okrem jeho `INBOX.md`.
3. Žiadne kľúče, `.env`, veľké dáta ani osobné údaje pacientov v gite.
4. Kto čo vlastní, je v `STATUS.md`. Pred väčším zásahom do cudzej časti pošli `/msg`.
