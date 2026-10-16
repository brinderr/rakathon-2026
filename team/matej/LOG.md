# LOG – matej

Najnovšie záznamy dole. Formát: `## YYYY-MM-DD HH:MM` + odrážky.

## 2026-10-16 16:45
- Setup hotový (cloud session, .me=matej, práca na main). Prečítaný research 00–04 + Brunov brainstorm.
- Spustený trhový research výziev: dopyt, koncentrácia trhu, existujúce riešenia, expanzia do zahraničia, synergia s ÚRO. Výstup pôjde do docs/research/matej-trh-expanzia-uro.md.

## 2026-10-16 17:06
- Trhový research hotový: docs/research/matej-trh-expanzia-uro.md (+ surové dáta matej-trh-raw.json). 8 klastrov výziev, ÚRO synergia, živá tabuľa prihlášok, 3 nezávislí hodnotitelia.
- Z pohľadu trhu/expanzie: MDT Copilot (Asseco) + modul „Zobrazovanie a dávka“ (ÚRO); záloha MEDDI ONCO; pre ÚRO najviac PACS Comparator. Mamograf v Prahe 3 tímy, trh outreach nízko ocenený.
- Ďalej: overiť dáta v #mdt-copilot, rozhodnúť s Brunom do 19:05.
- 2026-10-16 18:54: Vysvetľujúca stránka „Cesta pacienta krok za krokom“ (z Brunovho researchu + ilustrácie Higgsfield): docs/cesta-krok-za-krokom/index.html, online https://claude.ai/artifact/BTtb1oMoKbUmyytR3EMGDp
- 2026-10-17 00:45: docs/matej-idealny-system.md – všetkých 27 požiadaviek VZP namapovaných na funkcie (DEMO vs IDEÁL) + vzory DK/SE/NO/NL/UK/EE; navrhnuté „hodiny cesty“ a národný panel merania.
- 2026-10-17 00:47: docs/matej-overdeliver.md – ku každému bodu slide 12 splniť/prekonať/wow/riziko, plán stavby 01–13 h, 5-min demo.
- 2026-10-17 01:32: AI vyťaženie (úloha 1 z PROMPT-PRE-MATEJA): app/src/ai/{text,rules,narrative,pseudo,llm,prompt,extract}.ts + app/scripts/extract.mjs, `npm run extract`. Pravidlá + voliteľné LLM (Azure OpenAI EU cez app/.env), každý citát overený doslova kódom, pseudonymizácia RČ/telefónov/mien pred LLM, retry s backoff na 429, offline cache odpovedí. Bez LLM na Alene: 19/20 polí, ECOG chýba, 2 rozpory (apixaban 18. 10., histológia 20. vs 19. 10.), 62/62 citátov doslova, správy 12 a 13 vylúčené (po MDT).
- Pozor: `npm run build` padá na main ešte pred mojimi zmenami – šablóna App.tsx importuje chýbajúce src/assets/react.svg a App.css (súbor agenta SHELL). Napísané Brunovi do INBOX. Ďalej: zlatá sada + eval.
