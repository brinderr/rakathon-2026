# NIT – aby sa niť cesty pacienta nepretrhla

**Výzva:** VZP – Cesta pacienta bez ztráty informací (Rakathon 2026, Praha)

**Problém (číslo, ktoré bolí):** Viac ako **60 %** pacientov s rakovinou pľúc v Česku nezačne liečbu do 8 týždňov od CT ([MZ ČR, 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)). Časť času sa stráca hľadaním správ: pacientka zo zadania VZP má 13 dokumentov a 50 dní od praktika po konzílium (náš výpočet z fiktívnych dát).

**Pre koho:** Koordinátor/ka v komplexnom onkologickom centre (KOC). Od januára 2026 je v každom z 15 centier, VZP platí 250 Kč za výkon, štandardný softvér preň však neexistuje (MZ ČR).

**Riešenie:** Praktik alebo koordinátor iba pretiahne správy, nič nové nevypĺňa. AI zloží podklad pre onkologické konzílium; pri každom údaji je citát zo zdroja, ktorý aplikácia overí, a čo chýba alebo si odporuje, je označené. Aplikácia ukáže, kto je na ťahu a dokedy, a po konzíliu pošle záver praktikovi s dôkazom doručenia.

**Prečo teraz / dôkazy:**
- Každé 4 týždne meškania: riziko úmrtia +6–8 % pri operácii ([Hanna, BMJ 2020](https://doi.org/10.1136/bmj.m4087)).
- Nedostupné cudzie snímky: opakuje sa 72 % vyšetrení, nahraté v archíve len 11 % ([AJR 2012](https://doi.org/10.2214/ajr.11.6890)).
- VZP otvorila Inovačný portál, onkológia je prvá ([inovace.vzp.cz](https://inovace.vzp.cz)); procesné nástroje zatiaľ nie sú výslovne zahrnuté [?].

**Čo ukážeme na demo:** 13 správ → hotový podklad za sekundy → klik na údaj ukáže zdroj → „chýba výkonnostný stav, nemožný dátum lieku, rozpor v histológii“ → plán krokov s vlastníkom → zápis z konzília len z údajov známych v ten deň → odoslané praktikovi, doručené. Výstup aj vo FHIR (štandard výmeny zdravotných dát).

**Prečo my:** Maťo pracuje v radiačnej ochrane a zobrazovaní (vystupujeme za seba, nie v mene ÚRO): pridáme riadok „snímky“, aby sa zbytočne neopakovalo CT. Bruno vedie kreatívne a video štúdio: príbeh pacientky a video zo skutočnej obrazovky. Kód píše Claude Code, my ručíme za obsah a kontrolu.

**Ďalší krok:** 3-mesačný pilot v 1 KOC (50–100 prípadov). Meriame čas po kompletný podklad, diery nájdené pred konzíliom, odložené konzíliá a minúty koordinátora. Prosba: 60 minút s generálnym riaditeľom VZP a pilotné centrum.

**Alternatívy:** (2) AZ Plíce včas – nájsť a osloviť ľudí na bezplatný skríning pľúc · (3) MEDDI ONCO – AI semafor pre pacientov doma, ktorý neprehliadne „červenú“.
