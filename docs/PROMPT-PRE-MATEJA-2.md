# Prompt pre Maťovho Clauda – kolo 2 (sobota 17. 10. 2026, 05:00 – 06:30)

Skopíruj celé do Claude Code v priečinku `rakathon-2026`.

---

Som Maťo, tím Rakathon 2026 (výzva VZP „Cesta pacienta bez ztráty informací“). Odovzdanie je dnes o 13:00. Najprv `git pull --rebase --autostash` a `/sync`. Potom si prečítaj:
- `docs/kontext/raw-kriticke-hodnotenie.md` – kritické hodnotenie appky (5 kritikov + plán). Hlavný záver: appka nesmie byť „nahraný film“, motor vyťaženia musí bežať naživo.
- `brainstorms/2026-10-17-kriticke-hodnotenie-appky.md` – rozhodnutia kapitána: **všetko česky**, motor naživo, upratanie, ECOG cez zápis telefonátu (nie vymyslená správa 14).
- `docs/kontext/raw-pitch-factcheck.md` – kontrola faktov tvojich textov v `docs/pitch/` (37 opráv).

**Brunov Claude práve mení UI appky** (obrazovka „Zpracování naživo“, ktorá volá tvoj `extractHandover`, preklad celej appky do češtiny, upratanie). Preto:
- Píš LEN svoje súbory: `app/src/ai/*`, `app/scripts/extract*`, `app/scripts/eval*`, `app/eval/*`, `app/data-pacient-2/*`, nový `app/data-pacient-3/*`, `docs/pitch/*`.
- **Nemeň signatúru `extractHandover` ani tvar `ExtractionResult`** (volá ho nová obrazovka v prehliadači). Ak treba niečo pridať, pridaj voliteľné pole.
- Commituj často (`[matej] …`), vždy `git pull --rebase --autostash` pred pushom.

## Úlohy (v tomto poradí)

### 1. Pitch a odovzdanie podľa kontroly faktov (najdôležitejšie)
Oprav `docs/pitch/*` podľa tabuliek A a A2 v `raw-pitch-factcheck.md`. Najmä:
- Žiadny „ostrý režim Azure“. V prototype odpovedal náhradný model, Azure je cieľ.
- Skóre 20/20 · 17/17 · 13/13 vychádza aj bez AI → písať „pravidla + AI“, nie „AI složí“.
- 250 Kč (výkon 51887) platia centru všetky poisťovne, nie „VZP hradí“.
- „Standardní software nemají“ → MZ ČR 2. 9. 2026: koordinačné aplikácie sa v niektorých KOC pilotne testujú.
- 13 správ je z 99 dní; 50 dní je od praktika po konzílium.
- Demo kroky prepíš podľa novej appky: fronta → praktik pošle žiadanku → **Zpracování naživo** (správy prichádzajú, polia sa plnia s citátmi) → pasce a rozpory → **„Zkuste to rozbít“** (zmena RČ → nový rozpor) → chýba ECOG → **Zapsat telefonát** → stav k 21. 10. → Podklad pro konzilium (MDT_zapis) → Závěr pro praktika + doručenka.
- Z appky zmizlo: bilancia v korunách, karta 20/20 na fronte, dánske „deň X z 33“ (teraz „den X od přijetí žádosti“), holandská lehota 2 dni, správa 14.
- Texty pre porotu **česky** (SUBMISSION CZ + EN môže ostať). Titulný obrázok: `docs/odovzdanie/cover.png`.

### 2. Slepý test (poctivé číslo namiesto 100 %)
- Spusti subagenta, ktorý **nevidí** `src/ai/rules.ts`, `eval/gold-*.json` ani správy Aleny a Nováka. Nech napíše tretieho fiktívneho pacienta (napr. rakovina hrubého čreva alebo prsníka, 8–10 krátkych správ v rovnakom formáte, hlavička „FIKTIVNÍ PACIENT – testovací data“, 3–4 vlastné pasce) a vlastnú zlatú sadu → `app/data-pacient-3/`.
- Spusti extract + eval **bez úpravy pravidiel** a ulož výsledok `app/public/data/eval-pacient-3.json` s poctivým `headline` (napr. „Slepý test: 16/20 polí, 3/4 pasti, 0 vymyšlených“).
- Až potom môžeš pravidlá zlepšiť, ale výsledok „pred“ aj „po“ zapíš poctivo do `eval/README.md`.

### 3. Robustnosť motora pre „Zkuste to rozbít“
Porotca bude meniť text správ priamo v appke. Otestuj a zlepši pravidlá tak, aby:
- fungovali 4 ukážky: (a) iné rodné číslo v správe 10 → rozpor, (b) oprava dátumu poslednej dávky apixabanu v správe 09 na 10. 10. → rozpor zmizne, (c) pridané „ECOG 1“ → 20/20, (d) zmazaná správa 11 → histológia chýba;
- zvládli varianty nadpisov („Pacientka:“, „Pacient:“, „Jméno a příjmení:“) a ak sa dá, rozpor strany nádoru aj u Aleny;
- nikdy si nič nevymysleli (radšej „chybí“).
Pridaj na to testy (`npm run eval` alebo nový `scripts/eval-mutations.mjs`). Alena aj Novák musia ostať 20/20 a 0 vymyslených.

### 4. Scenár videa (česky, MAX 1:30) – zmena 05:00
Sobota 14:00 = zadávatelia VZP chodia k stolom. Video pustíme pri stole ako úvod, potom ~2 min klikáme naživo. Prepíš `docs/pitch/VIDEO.md`:
- **0:00–1:00** dnešná zlá cesta Aleny: 13 správ zo 7 pracovísk, e-mail, telefón, eZpráva; čo sa stratí (ECOG chýba, nemožný dátum apixabanu, histológia „vydaná“ pred odberom), kto na čo čaká.
- **1:00–1:30** riešenie veľmi v skratke: jedna obrazovka, správy sa spracujú naživo, každý údaj s citátom, čo chýba je vidieť, vždy vieš, kto je na ťahu. Posledná veta + „prototyp, fiktivní data“.
Ku každému záberu: čo je na obrazovke a text hlasu po česky (ElevenLabs). Dlhšie video pre nedeľné finále urobíme neskôr.

### 5. (Len ak Bruno zoženie Azure kľúč) Ostrá AI
Malý lokálny server `app/scripts/ai-server.mjs`: kľúč z `app/.env` (nikdy do gitu ani do prehliadača), volá Azure len s pseudonymizovaným textom, voliteľný endpoint `/api/extract`. Nízka priorita.

## Na konci
Zapíš 3–5 riadkov do `team/matej/LOG.md`, odpoveď alebo požiadavky pre Bruna do `team/bruno/INBOX.md`, commit + push. `npm run build` v `app/` musí prejsť (ak padá na cudzích súboroch, len to napíš do INBOX).
