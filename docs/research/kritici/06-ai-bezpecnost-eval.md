# Kritik 06 – bezpečnosť AI a meranie (17. 10. 2026)

## Verdikt (3 vety)
Návrh motora (pravidlá, AI len na voľný text, doslovné citáty, zamietanie čísel bez opory) je nad priemerom hackathonu a pred VZP sa dá obhájiť. Meranie však dokazuje menej, než tvrdí: „0 vymyslených“ znamená len „0 čísel a dátumov bez opory“, lebo 5 viet s opačným významom prešlo poistkou aj evalom a skóre ostalo 20/20 · 17/17 · 0. Silný argument pred porotou urobia tri veci: (1) test poistky „opačný význam“ s poctivým číslom, koľko chytíme, (2) meranie vynechávok s intervalom spoľahlivosti na slepom pacientovi, (3) porovnanie „len pravidlá“ a „pravidlá + skutočný model“.

## Top nálezy

**1. Poistka nevidí opačný význam.**
Problém: AI návrh prejde, keď sú citáty doslovné, čísla sú z citátov a aspoň 50 % slov s 5 a viac znakmi je v citátoch (`app/src/ai/extract.ts`, riadky 127–136). Krátke „bez“ sa nepočíta vôbec a zápor „ne-“ zmení len jedno slovo z mnohých. → Dôkaz: test s vlastným súborom podvrhnutých AI odpovedí (repo nezmenené). „Souhlasí se sdílením informací s dcerou“ → „nesouhlasí“ (opora 91 %), „UZ prokázalo ložisko“ → „vyloučilo“ (88 %), „s perineurální invazí“ → „bez“ (71 %), „Teploty od září neměla“ → „teploty přetrvávají“ (89 %). Prijatých 5 z 5, `npm run eval` hlási opäť 20/20 · 17/17 · 0 · 63/63. Vo svete: 50–90 % odpovedí LLM nemá plnú oporu v zdrojoch, ktoré samy citujú ([SourceCheckup, Nat Commun 2025](https://www.nature.com/articles/s41467-025-58551-6)). → Zmena: (a) kontrola záporu (ne-, bez, neguje, vyloučil/prokázal) proti citovanej vete, pri nezhode zamietnuť; (b) test uložiť ako `opacny-vyznam-alena.json` a zverejniť „chytili sme X z 5“; (c) neskôr AI vyberie len čísla viet a program z nich zloží doslovný text. → Dopad: **vysoký** · 3–4 h.

**2. Meranie nevidí vynechávky, hoci zadanie znie „bez ztráty informací“.**
Problém: zlatá sada kontroluje len kľúčové slová (epikríza = „bolest“ + „pankrea“, otázka na MDT = „postup“), `app/eval/gold-alena.json`. Neúplné pole aj dlhý prilepený odsek dostanú bod. → Zmena: pre slepého pacienta spísať 25–40 faktov, ktoré musia doputovať na MDT, a merať dve čísla: koľko faktov sa prenieslo a koľko ich chýba podľa závažnosti (veľká/malá). Tak to robí rámec CREOLA: 1,47 % halucinácií, 3,45 % vynechávok na 12 999 vetách ([Asgari, npj Digit Med 2025](https://www.nature.com/articles/s41746-025-01670-7)). Pridať limit dĺžky poľa. → **vysoký** · 2–3 h.

**3. Číslo nemeria AI.**
Problém: samotné pravidlá dajú tiež 20/20 · 17/17 (`docs/kontext/raw-kriticke-hodnotenie.md`). „AI odpovede“ v cache napísal vývojársky agent, ktorý mohol vidieť repo vrátane zlatej sady (pole `model` v `app/eval/llm-cache/*.json`). To je možný únik testu do odpovede. Žiadne opakované behy. → Zmena: tabuľka „len pravidlá / pravidlá + Azure model (5 behov, rozptyl) / halucinujúci test / opačný význam“, pri každom čísle uviesť, odkiaľ odpoveď je. Bez kľúča napísať „AI vrstva nebola zmeraná na produkčnom modeli“. → **vysoký** (kritérium 1) · 2 h + kľúč.

**4. Pseudonymizácia prepúšťa osobné údaje.**
Problém: meno sa nahrádza len ako presný reťazec „Meno Priezvisko“, telefón len s +420, rodné číslo len s lomkou, adresa len za „Bydliště:“ (`app/src/ai/pseudo.ts`). → Dôkaz: vlastný test. „Paní Procházkovou“, „pacientka Procházková“, „777 000 541“, „6357221013“, „nar. 22. 7. 1963“ a „Adresa: Za Školou 17“ odišli nezmenené. Presné dátumy, vek, pracoviská a mená lekárov ostávajú. Pseudonymizované údaje sú podľa EDPB stále osobné údaje ([Guidelines 01/2025](https://taylorwessing.com/-/media/taylor-wessing/files/germany/2025/01/tw25_edpb-guidelines-1-2025.pdf)). → Zmena: tvary priezviska podľa kmeňa, všeobecné vzory pre telefón, rodné číslo a dátum narodenia, české rozpoznávanie mien priamo v počítači ([NameTag 3, ÚFAL](https://ufal.mff.cuni.cz/nametag/3); modely sú len na nekomerčné použitie), dátumy prepočítané na „deň X“. Test „únik: 0 z 50 viet so skloňovaním“. V appke písať „pseudonymizované, stále osobné údaje“. → **vysoký** pre VZP · 2–3 h.

**5. Chýba neistota.**
20/20 na jednom pacientovi dáva 95 % interval spoľahlivosti 83–100 % (Clopper-Pearson). Pri 0 chybách v 63 citátoch je horná hranica 95 % intervalu pre chybovosť ~4,8 % ([pravidlo troch](https://jamanetwork.com/journals/jama/article-abstract/389714)). Polia jedného pacienta nie sú nezávislé, takže skutočné n = 2. → Zmena: písať „20/20 (95 % IS 83–100 %), 2 fiktívni pacienti, test, nie klinická validácia“. → stredný · 0,5 h.

**6. Robustnosť sa nemeria číslom.**
Pravidlá stoja na nadpisoch (pri zmene nadpisu „Pacientka:“ chýba 6 polí). „Zkuste to rozbít“ je ukážka, nie meranie. → Zmena: skript vyrobí z 13 správ ~200 variantov (iné nadpisy, „21.10.26“, preklepy, iné poradie, zmazaná správa) a meria, či polia ostali rovnaké a či vzniklo správne upozornenie ([CheckList, ACL 2020](https://aclanthology.org/2020.acl-main.442)). Aj zmena formátovania mení výstupy LLM v medicíne ([Gourabathina, FAccT 2025](https://dspace.mit.edu/handle/1721.1/164428)). → stredný · 2 h.

**7. Nepočíta sa, koľko upozornení je zbytočných.**
17 pascí overujú voľné vzory textu (napr. „e-?mail“ + „pacient“). Falošný poplach preveruje jediná kontrola (`tumor-size-not-a-conflict`). → Zmena: pri slepom pacientovi uviesť „X z Y upozornení oprávnených“. Koordinátorka zahltená poplachmi ich prestane čítať. → stredný · 1 h.

**8. Chýba jedna veta o účele.**
→ Zmena: do päty appky a do pitchu: „Účel: úplnosť a súlad dokumentácie pre MDT. Nenavrhuje diagnózu ani liečbu, každý údaj má zdroj na overenie človekom.“ Overenie zdroja človekom zodpovedá kritériu 4 FDA ([revízia 1/2026](https://www.cov.com/en/news-and-insights/insights/2026/01/5-key-takeaways-from-fdas-revised-clinical-decision-support-cds-software-guidance)). Pri MDR rozhoduje deklarovaný účel ([MDCG 2019-11 rev.1](https://www.emergobyul.com/news/european-revision-primary-software-guidance-mdcg-2019-11-revision-1-small-changes-meaningful)). Pozor na nápad s revíznym lekárom VZP: sumarizácia správ pre posudzovateľa nároku na zdravotné služby patrí pod prílohu III bod 5(a) AI Actu a vyňatá je len ako procedurálna úloha podľa čl. 6(3) ([AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/en/node/465)), čo treba písomne zdôvodniť. → **vysoký** pre VZP · 0,5–1 h.

## Nové nápady zo sveta
1. **Overovanie po tvrdeniach** ([VeriFact, Stanford](https://arxiv.org/abs/2501.16672); [FActScore](https://aclanthology.org/2023.emnlp-main.741)): pole sa rozdelí na jednotlivé tvrdenia a druhý model posúdi, či ich citát podporuje alebo im odporuje. V appke: tvrdenie zelené, alebo žlté „overte“ a citát vedľa neho.
2. **Kalibrované vlajky CARE** ([Stanford, 6/2026](https://arxiv.org/abs/2606.08969)): po ~100 označených dokumentoch vie systém zaručiť napríklad „≤ 15 % riziko neoznačenej halucinácie“ pri menšom počte viet na kontrolu. V pitchi ako škálovanie („po 100 prípadoch KOC garantujeme mieru rizika“), v appke dnes „X viet na kontrolu“.
3. **Mini štúdia s lekárom** ([Van Veen, Nat Med 2024](https://arxiv.org/abs/2309.07430v5): 10 lekárov hodnotilo úplnosť, správnosť a stručnosť). Mentor na hackathone za 15 minút ohodnotí podklad slepého pacienta, z toho bude veta do pitchu.
4. **Tvrdá sada ako pri Med-PaLM 2** (240 záludných otázok, [Nat Med 2025](https://www.nature.com/articles/s41591-024-03423-7)): pasce, opačný význam a varianty správ ako samostatná sada s vlastným číslom.
5. **Slepý test zaregistrovaný vopred** ([Nosek, PNAS 2018](https://www.pnas.org/doi/10.1073/pnas.1708274114)): pred behom commitnúť SHA-256 odtlačok zlatej sady s časom a dodržať pravidlo „po behu sa neladí, inak uvedieme obe čísla“. V „Ako sme merali“ ukázať odtlačok a kartu merania podľa [TRIPOD-LLM](https://pubmed.ncbi.nlm.nih.gov/39779929/).

## Čo nerobiť
1. Netvrdiť „nič si nevymyslí“. Pravda je „0 čísel a dátumov bez opory, význam viet kontroluje človek“ (nález 1).
2. Neukazovať „istotu 87 %“ od samotného modelu. Istota, ktorú model sám udá, býva prehnaná ([Xiong, ICLR 2024](https://arxiv.org/abs/2306.13063v2)). Ostať pri stavoch overené / návrh / chýba / rozpor s dôvodom.
3. Neladiť pravidlá na slepom pacientovi a potom ho volať slepým. Ak sa ladí, uviesť číslo pred aj po, ako to README urobilo pri pacientovi 2.

---
Podklady testov (dočasný scratchpad, mimo repa): `/private/tmp/claude-501/-Users-brunoduhar-Library-Application-Support-Claude-scratch-workspaces-86c6b80d-e417-498c-a005-1cb65ed96ea6-8ade6142-1851-4655-919e-c6be70635281-scratch-2026-10-16-1cc6b0/04c5cde1-8b12-4f75-8ea3-1fbf9a54de0c/scratchpad/eval06/` – `semanticky-chybny-model.json` (5 viet s opačným významom; spustenie: `npm run extract -- --provider fixture --fixture <súbor> --out <x>` a `npm run eval -- --extracted <x>`), `pseudo-test.mts` (test pseudonymizácie).
