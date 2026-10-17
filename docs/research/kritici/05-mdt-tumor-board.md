# 05 – Kritik: MDT a softvér pre tumor boardy

## Verdikt
Podklad pre konzílium je poctivý archív: každá hodnota má citát, platí stav k dátumu a dodržiava šablónu VZP. Lekárom na MDT však zatiaľ čas neušetrí. Nemá aktuálnu otázku pre konzílium a chýbajúci e-mail váži rovnako ako chýbajúci ECOG (výkonnostný stav). Rozpory v dátumoch, ktoré vyrieši jeden telefonát, posiela na rozhodnutie siedmim špecialistom. Svetové nástroje (navify, NHS „streamlining“) stoja na pripravenosti prípadu: kým nie je kompletný minimálny súbor údajov, prípad na MDT nejde. Doplniť sa to dá lacno, pravidlami bez AI.

## Top nálezy

**1. Otázka pre konzílium je zastaraná otázka praktika**
- Problém: v časti 3 stojí veta z 2. 10. „…k dokončení diagnostiky (CT břicha, histologická verifikace)…“. K 19. 10. sú CT aj histológia hotové a skutočná otázka znie: resekabilita a liečebný plán (vzor „MDT zaver“: „hraničně resekabilní“).
- Dôkaz: shot 07, `mdtModel.ts:399–404`. `Handover_obsah` má samostatné pole „Požadavek/otázka na MDT“. Podľa RCR 2026 vidí 44 % respondentov problém v nedostatočných žiadankách na MDT (https://eu5mgmt.voxco.com/Media/273/Cancer_MDTs_External_Insights_Report_May_2026.pdf).
- Zmena: pole „Otázka pro konzilium“ vyplní prezentujúci lekár KOC: vyberie typ (diagnóza a staging / resekabilita / léčebný plán / restaging / jiné) a pripíše jednu vetu. Otázka praktika ostane pod ňou ako kontext so štítkom „položena 2. 10., před CT a histologií“. Bez otázky tlačidlo „Poslat lékaři k potvrzení“ nefunguje. AI otázku nevymýšľa.
- Dopad: **vysoký** · 1–1,5 h

**2. Chýbajúce údaje nemajú váhu**
- Problém: počítadlo „chybí: 3“ = e-mail pacientky, e-mail praktika, ECOG. Pre rozhodnutie je dôležitý len ECOG. Dve medzery, ktoré skutočné konzílium riešilo, appka pred MDT vôbec nehlási: biliárnu drenáž (bilirubín 38 → 23 µmol/l, žlčovod 11 mm, o stente ani ERCP ani slovo) a štádium cTNM.
- Dôkaz: shot 07. Vzor záveru: „ECOG není v podkladech výslovně stanoveno“, „není doložena biliární drenáž“. Drenáž appka spomenie až v závere pre praktika (`GpReport.tsx:31`). Minimálny súbor údajov NHS pre MDT: štádium, výkonnostný stav, histológia, komorbidity, klinické štúdie, genetika, želanie pacienta (s. 11, https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf).
- Zmena: pridať panel „Připravenost ke konziliu“ s 8–10 riadkami: minimum NHS a k nemu položky pre pankreas (CT podľa pankreatického protokolu, vzťah k cievam, CA 19-9, žlčové cesty a drenáž, antikoagulácia, úbytok váhy). Každý riadok má buď ✓ s citátom, alebo ✗ „není v dokumentaci“ s tlačidlom „Vyžádat“. Administratívne medzery idú do samostatného riadku. Zoznam schvaľuje vedúci MDT; appka iba kontroluje, či údaj v dokumentácii je.
- Dopad: **vysoký** (kritériá 1 aj 2: zachytí 2 medzery, ktoré lekári VZP objavili až na konzíliu) · 2–3 h

**3. Preklepy v dátumoch idú „na rozhodnutie konzília“**
- Problém: „poslední dávka apixabanu 18. 10.“ pri biopsii 12. 10. a „odběr 20. 10.“ pri výsledku vydanom 19. 10. sú preklepy. Vyrieši ich telefonát na endoskopiu a patológiu, nie MDT.
- Dôkaz: `MdtDoc.tsx:56` („rozhodne konzilium“), `:227`; shot 07. RCR 2026 odporúča, aby sa MDT venovalo „treatment decisions rather than administrative or information-gathering tasks“.
- Zmena: predvolený štítok „Ověřit před konziliem – koordinátorka do 20. 10.“, k nemu úloha v Ceste a vyriešenie cez „Zapsat telefonát“ s menom zdroja. Konzíliu ostane len klinický rozpor s uvedeným dôvodom.
- Dopad: **stredný až vysoký** (lekár VZP si to všimne za pár sekúnd) · 1 h

**4. Rozhodujúce nálezy sú na konci chronologického zoznamu**
- Problém: časť 5 sa začína kardiológiou z júla, močom a RTG a histológia je až posledná. CT zhŕňa jedna veta, hoci o resekabilite rozhodujú jednotlivé cievy.
- Dôkaz: shot 07. Okolo polovice pacientov sa na MDT preberá najviac 2 minúty (NHS 2020, s. 3). Štandardná šablóna popisu CT pankreasu požaduje stav každej cievy (SAR/APA, https://pubmed.ncbi.nlm.nih.gov/24354378/). Správa 08 ich má všetky: VMS ~200° so zúžením, AMS do 150°, truncus coeliacus a a. hepatica communis bez kontaktu.
- Zmena: nad tabuľku pridať blok „Rozhodující nálezy“ v poradí: histológia → CT doslovne po cievach → uzliny a metastázy → CA 19-9 vedľa bilirubínu z toho istého dňa → „cTNM: není v dokumentaci – stanoví MDT“. Ostatné vyšetrenia zbaliť.
- Dopad: **vysoký** pre lekárov · 1,5–2 h

**5. Appka nevie, či sú snímky pripravené na revíziu**
- Problém: CT robili v KOC 1 a vo vzore stojí „k potvrzení MDT po radiologické revizi“. Konzílium je v Ceste jedna karta bez podkrokov.
- Dôkaz: shot 04. `cases.ts:581` („Snímky i popis přes ePACS“): údaj máme, ale v podklade nie je. Kritériom kvality MDT sú „current images available digitally“ (Taylor 2012, https://pmc.ncbi.nlm.nih.gov/articles/PMC3489862/).
- Zmena: do karty Konzílium a do panela z bodu 2 pridať 4 riadky: „Snímky v PACS KOC 2 ✓ 8. 10.“, „Revize radiologem: čeká“, „Prezentuje: MUDr. Svoboda“, „Na programu od 20. 10.“.
- Dopad: **stredný** (kritérium 2: realita a integrácia) · 0,5–1 h

**6. ECOG z telefonátu: kto ho stanovil?**
- Problém: ECOG je klinické hodnotenie. Ak ho koordinátorka zapíše z rozhovoru s pacientkou, lekár VZP to spochybní. Záver pre praktika navyše podľa vzoru píše „stanovit ECOG“ (`GpReport.tsx:29`), takže podklad s ECOG 1 bude so záverom v rozpore.
- Zmena: do telefonátu zapísať „uvedla pacientka: soběstačná…“ ako údaj od pacientky. Pole ECOG ostane „stanoví lékař“, alebo pôjde o telefonát s MUDr. Markovou a jej meno bude uvedené ako zdroj.
- Dopad: **stredný** · 0,5 h

## Nové nápady zo sveta
1. **Triedenie prípadov na „standardní postup“ a „k diskusi“** (NHS 2020, s. 9–11). Na programe sú všetci, no jasné prípady s kompletnými údajmi sa len zapíšu. V Barts Health sa vďaka tomu program skrátil z 89 na 57 pacientov (s. 14). *V appke:* obrazovka „Program konzilia 21. 10.“ s riadkom na každého pacienta, semaforom pripravenosti a prepínačom, o ktorom rozhoduje lekár KOC. Český štandardný postup je Modrá kniha ČOS (https://www.linkos.cz/files/modra-kniha/25/938.pdf). Na finále.
2. **Presunutie prípadu, keď chýbajú údaje.** Navify sľubuje „simple to reschedule cases when information is missing“ (https://assets.roche.com/f/198420/x/96d7d8297a/navify-tumor-board-brochure-en.pdf). *V appke:* deň pred MDT ponúkne pri červenom paneli „Přesunout na další konzilium“ alebo „Projednat s výhradou“ a upozorní prezentujúceho. 44 % respondentov RCR vidí problém v opakovanom prejednávaní. 1 h.
3. **Sledovať, či sa rozhodnutie MDT naozaj vykonalo.** Nevykonalo sa 15 % rozhodnutí MDT, pri pankrease častejšie; hlavnými dôvodmi boli komorbidity a voľba pacienta (https://pubmed.ncbi.nlm.nih.gov/16322114). Demo navify končí kontrolou „treatment adherence“ (https://www.youtube.com/watch?v=hJ2gY0g4BIA). *V appke:* v Ceste po konzíliu chýba hlavný krok, onkológia 4. 11. o 10:30 (shot 04). Prípad sa uzavrie až po začatí liečby. Na finále.
4. **Ako o AI hovoriť v pitchi.** V štúdii navify sa skrátil čas na zber klinických údajov, nie na revíziu snímok a preparátov (https://www.youtube.com/watch?v=7RUB92Ehd4g). Microsoft so Stanfordom zatiaľ svojich agentov pre tumor boardy „has not yet put it to real-time clinical use“ (https://news.microsoft.com/source/features/ai/meet-4-developers-leading-the-way-with-ai-agents/). *Veta do pitchu:* „Šetríme tú časť, ktorú šetrí navify, teda zber a overenie údajov. Snímky nechávame rádiológovi.“
5. **Klinické štúdie a genetika ako riadky pripravenosti** (minimum NHS, s. 11). *V appke:* 2 riadky „neposouzeno“, ktoré lekár odklikne ako „netýká se“ alebo „posoudit na MDT“. 0,5 h.

## Čo nerobiť
1. Neurčovať cez AI resekabilitu, štádium cTNM ani liečbu. Vzor to necháva „k potvrzení MDT po radiologické revizi“ a zadanie žiada „bez domýšlení“.
2. Nemeniť štruktúru `MDT_zapis`. Všetky doplnky označiť „doplněno nad rámec šablony“, ako je to dnes pri otázke.
3. Nestavať prehliadač snímok ani prezentačný režim so slajdmi ako navify. Stačí stav „snímky dostupné / revize hotová“.
