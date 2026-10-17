# Otázky na mentorov (8) – prečo sú dôležité a čo s odpoveďou urobíme

Zdroj otázok: `docs/IDEALNE-RIESENIE.md` §8. Ráno (sobota 8:00 mentoring) sa pýtať v tomto poradí – **1, 3, 4, 6** majú
priamy dopad na demo a pitch pred 13:00; **2, 5, 7, 8** sú na pilot (povedať v pitchi „overíme v pilote“).
Odpovede zapisovať priamo sem pod otázku (meno, čas, citát), aby ich videl aj Brunov Claude.

---

## 1. Koordinátorka Vaňková (Bulovka) a Chrástová (spoluautorka decku)
**Otázka:** Akým kanálom vám reálne prichádzajú žiadosti a správy, koľko minút trvá jeden prípad pre MDT a ako dnes vediete záznam o koordinovaní?

**Prečo je dôležitá:** Celý návrh stojí na predpoklade, že vstupom je e-mail, telefón a eZpráva – ak to tak nie je, demo krok 2 („žiadanka príde e-mailom“) je mimo. Minúty na prípad sú jediné číslo, ktorým vieme sľúbiť úsporu.

**Čo s odpoveďou urobíme v appke:** Kanál, ktorý menujú ako hlavný, dáme ako prvý v „Prijaté“ (ikona kanála pri každej správe – `SourceDoc.channel`). Minúty na prípad dáme do pitchu ako „dnes X minút“ a do metrík pilotu. Ak záznam o koordinovaní vedú v Exceli, ukážeme export záznamu v rovnakých stĺpcoch.

## 2. MZ (Rybář) a VFN (doc. Bielčiková)
**Otázka:** Ktoré koordinačné aplikácie sa v KOC pilotne testujú (MZ ČR, 2. 9. 2026) a odkiaľ berú dáta?

**Prečo je dôležitá:** Ak už nejaké KOC pilotuje iný nástroj, porota sa spýta „v čom ste iní“. Zároveň je to zoznam možných partnerov pre pilot.

**Čo s odpoveďou urobíme:** V pitchi jedna veta o odlíšení (overené citáty + kontrola úplnosti + stav k dátumu MDT). V appke nič nemeníme; do SUBMISSION.md doplníme, s čím sa vieme prepojiť.

## 3. VZP (Bartyzal – technický mentor; Hlavinka nie je mentor, podľa našich poznámok sedí v nedeľnej porote)
**Otázka:** Čo presne má robiť „komunikačný uzol vo VZP“ (smerovať, notifikovať, platiť) a je VZP ochotná viazať platbu na doložené uzavretie slučky?

**Prečo je dôležitá:** Hlavinka (VZP) podľa našich poznámok sedí v nedeľnej porote. Ak VZP chce uzol, ktorý smeruje dokumenty, a my hovoríme „VZP je páka, nie úložisko“, musíme to povedať tak, aby to znelo ako odpoveď na ich zadanie, nie proti nemu.

**Čo s odpoveďou urobíme:** Ak „platiť za uzavretú slučku“ → v appke zvýrazníme doklad doručenia záveru praktikovi a záznam o koordinovaní ako podklad k výkonu 51887. Ak „smerovať“ → v pitchi ukážeme, že náš výstup (podklad + citáty) je presne to, čo by uzol posielal. Prosbu v pitchi (pilot v 1 KOC) prispôsobíme ich slovám.

## 4. Autorky decku
**Otázka:** Stačí ako „jedno digitálne miesto“ rola-schránka KOC a eZpráva, alebo trváte na portáli, kam praktik nahrá správy?

**Prečo je dôležitá:** Deck hovorí o „jednom digitálnom mieste“; my vedome nestavíme portál pre praktika. Ak autorky trvajú na portáli, hodnotenie „využiteľnosť u zadávateľa“ môže padnúť.

**Čo s odpoveďou urobíme:** Ak trvajú → ukážeme existujúcu stránku Intake („Odoslať pacienta do KOC“) ako ten portál (je v appke) a povieme, že praktik ho môže použiť, ale nemusí. Ak stačí schránka → v pitchi zdôrazníme „lekár sa nič nové neučí“.

## 5. IT KOC
**Otázka:** Aký máte NIS, kto spravuje certifikát EZCA II, máte schránku v eZpráve a vie váš NIS prijať dokument cez rozhranie (za koľko)?

**Prečo je dôležitá:** Určuje, či pilot začne „Fázou 0“ (PDF ručne do NIS) alebo hneď rozhraním, a koľko to stojí (verejné zmluvy ~100 tis. Kč + podpora).

**Čo s odpoveďou urobíme:** Do plánu pilotu (ONE-PAGER, pitch – cesta k realite) dáme konkrétny NIS a fázu. V appke pridáme pri podklade tlačidlo exportu v tom formáte, ktorý NIS prijme (PDF / CDA / FHIR DocumentReference).

## 6. DPO KOC
**Otázka:** Je koordinátor „iný odborný pracovník“ podľa §65 zákona 372/2011 a smieme prijímať správy na rola-schránku?

**Prečo je dôležitá:** Ak koordinátor nesmie čítať celú zdravotnú dokumentáciu, musí appka niektoré polia skryť. Bezpečnosť a regulácia sú súčasťou kritéria 2 „Využiteľnosť v praxi u zadávateľa výzvy“.

**Čo s odpoveďou urobíme:** V pitchi jedna veta o právnom základe. V appke (ak treba) rola „koordinátor“ vidí len polia podkladu a citáty, nie celé správy; pseudonymizácia pred AI ostáva v každom prípade.

## 7. Lekári KOC
**Otázka:** Ako dnes podpisujete alebo pečatíte záver MDT pre praktika (§55a ods. 4) a ktorým kanálom ho posielate?

**Prečo je dôležitá:** Krok 8 dema („záver praktikovi, doručené“) je simulovaný. Ak záver musí ísť s pečaťou nemocnice, náš e-mail nestačí – musí ho poslať nemocnica.

**Čo s odpoveďou urobíme:** V GpReport ponecháme „čaká na podpis/pečať KOC“ ako samostatný krok pred odoslaním a v pitchi povieme, kto podpisuje. Kanál (eZpráva / pošta / NIS) dáme ako predvolený pri odoslaní.

## 8. NCEZ a eZprava.net
**Otázka:** Môže dodávateľ koordinačného nástroja volať eŽádanku K a KRP certifikátom KOC a dovolí eZpráva automatický príjem treťou stranou pre KOC?

**Prečo je dôležitá:** Je to národná cesta (vlna C) – bez nej ostaneme pri ručnom vkladaní. Porota sa na škálovateľnosť pýta v nedeľu (kritérium 4).

**Čo s odpoveďou urobíme:** Do pitchu (veta 3 cesty k realite) a do SUBMISSION.md doplníme presný postup. V appke nič – adaptéry ostávajú prázdne „biele miesta“, kým to nebude jasné.

---

## Zápis odpovedí
| # | Kto odpovedal | Kedy | Odpoveď (citát) | Zapracované kde |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
