# Audit hry „Cesta Aleny“: každé tvrdenie oproti overeným faktom

_Stav: 16. 10. 2026. Kontrolovaný súbor: `docs/HRA-CESTA-ALENY.html` (pole `L` so 16 krokmi, slovník `TERMS`, sekcia `QA`, úvod, misia, pätička). Hru som neupravoval, toto je len zoznam nálezov a návrhov. Nič som necommitoval._

## Ako to čítať

- ✅ **podložené**: tvrdenie sedí so zdrojom (zdroj je uvedený).
- ⚠️ **treba upraviť**: tvrdenie je čiastočne nepresné alebo bez zdroja. Pri každom je presné nové znenie.
- ❌ **odstrániť**: tvrdenie nemá zdroj alebo mu zdroj odporuje.
- Pole `s` = príbeh, `why` = „Prečo je to dôležité“, `lost` = „Čo sa tu pokazí“, `app` = „Čo urobí naša appka“, `who` = štítky postáv, `t` = nadpis.
- Polia `app` sú náš návrh riešenia, nie tvrdenie o realite. Kontrolujem ich len oproti tomu, čo chce zadanie VZP.
- Nové znenia používajú len overené fakty. Kde niečo nevieme, nové znenie to hovorí rovno.

## Zdroje, na ktoré sa odvolávam

**Súťažné podklady VZP** (zip zo Slacku, 16. 10. 2026; text som vytiahol sám):
- `Zadani_ulohy.docx` (ďalej „zadanie“)
- správy pacientky `01`–`13` (ďalej „správa 01“ atď.)
- `MDT zaver.docx` (ďalej „záver MDT“)
- deck `Rakathon_cesta_pacienta final.pptx` (ďalej „deck“, číslo slajdu)

**Úrady a predpisy:**
- **MZ 2. 9. 2026**: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ (text som prečítal)
- **Věstník MZ 11/2025**, čl. 6: https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf (text som prečítal)
- **Metodický pokyn MZ pre HPB centrá**, účinný od 1. 9. 2026: https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf (text som prečítal)

**Koordinátorky z praxe** (plné texty som prečítal):
- **Bulovka**:
  - rozhovor s Vaňkovou, Zdravotnický deník 4. 6. 2026: https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/
  - stránka ÚGO: https://bulovka.cz/kliniky-a-oddeleni/gastrointestinalni-onkologie/ustav-gastrointestinalni-onkologie-objednani
- **FN Olomouc**, Švarcová, 4. 11. 2025: https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci
- **MOÚ Brno**, krajský koordinátor: https://www.mou.cz/krajsky-koordinator-onkologicke-pece/t2354

**Kanály medzi lekármi** (Úloha B):
- FN HK a eZpráva 16. 6. 2025: https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu
- KN T. Bati Zlín: https://www.kntb.cz/ezprava
- tender Tišnov 2024: https://zakazky.krajbezkorupce.cz/document_204707/26026ae5be95875ae62128c60fce1d15-nt-priloha-c-2-zd-v09-1-cast-tp-specifikace-v6-docx
- ČT24 13. 7. 2024: https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090
- NKÚ cez Zdravotnický deník 16. 1. 2026: https://www.zdravotnickydenik.cz/2026/01/digitalizace-ceskeho-zdravotnictvi-nku/
- eŽádanka:
  - Medical Tribune 7. 1. 2026
  - Vitalia 29. 6. 2026: https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/
  - MZ 24. 6. 2026

**Naše staršie podklady** (tam, kde sú v nich zdroje označené [V]):
- `raw-dataflow.md` §2 a §6: vyhláška 444/2024 Sb., zákon 372/2011 §45, odborný postup KDP-AZV-20 (ÚZIS) o konzíliách
- `raw-journey.md` 0.5: skríning pankreasu, ÚZIS
- `raw-koordinatori-pocty.md`
- `raw-vykon-51887.md`
- `raw-cz-system.md`
- `raw-sk-system.md`

Tieto podklady som nečítal znova v origináli. Preto ich tvrdenia beriem ako [čiastočne].

---

## Hlavný nález (kanály)

Tri miesta v hre ešte tvrdia nepodložené veci o tom, ako sa posielajú správy:

1. **Krok 7, `app`**: „(PDF, fotky)“. Pre fotky z mobilu nie je žiadny zdroj. Pre „PDF“ nie je doslovný zdroj.
2. **QA „Prečo si lekári nepošlú správu jednoducho e-mailom?“**:
   - nápis v obrázku „papier, telefón, PDF, CD, pošta“;
   - veta „obyčajný e-mail mnohé nemocnice nepoužívajú“. Odporujú jej overené zdroje: e-mail používajú koordinátorky aj nemocnice.
3. **Krok 8, `lost`** je už opravený (veta o PDF, fotkách a pošte v ňom nie je). Chýba v ňom ale to, čo o kanáloch reálne vieme.

Overené kanály:

| Kanál | Kde je to doložené |
|---|---|
| Telefón a e-mail koordinátorky na pracoviská | FN Olomouc |
| Formulár (online alebo Word e-mailom) | Bulovka |
| Webová žiadanka | MOÚ |
| Snímky cez ePACS | Bulovka, MOÚ |
| eZpráva | FN HK, Zlín |
| Pošta pre lekárov mimo eZprávy | FN HK |
| Obyčajný e-mail | tender Tišnov |
| CD so snímkami | ČT24 |
| Papier, ktorý nosí pacient | NKÚ |
| Fax pri niektorých žiadankách na PET/CT a MR | AGEL Nový Jičín, FN Olomouc, Náchod [čiastočne] |

Ako sa ku koordinátorovi dostanú správy od praktikov a ambulancií, ktoré nie sú v ePACS, **nikto nezverejnil**.

---

## Kroky 1–16

### Krok 1: Alena žije normálne (júl)
- **`s` „Alena má 63 rokov a slabšie srdce.“**: ⚠️
  - Správa 01: paroxyzmálna fibrilácia predsiení, vysoký tlak, ejekčná frakcia 60 % (normálna), „stabilní stav“. „Slabšie srdce“ teda nesedí.
  - **Nové znenie:** „Alena má 63 rokov. Lieči sa na nepravidelný tlkot srdca (fibriláciu predsiení) a vysoký tlak.“
- **`s` „V júli bola u kardiológa a ten jej predpísal liek na riedenie krvi.“**: ⚠️
  - Správa 07: antikoaguláciu berie „od r. 2021“.
  - Správa 01: „Medikace beze změn“ a „vysadit apixaban 48 hodin předem“ pred zákrokom s vysokým rizikom krvácania.
  - **Nové znenie:** „V júli bola na kontrole u kardiológa. Liek na riedenie krvi berie od roku 2021. Kardiológ do správy napísal, že pred zákrokom s rizikom krvácania ho treba vysadiť 48 hodín vopred.“
- **`s` „Zatiaľ nič nesúvisí s rakovinou.“**: ✅ Zadanie: „kontrola u kardiologa 3 měsíce před diagnózou“. Správa 01: zažívacie ťažkosti neguje.
- **`why`**: ✅ Správa 01 (vysadiť 48 h), správa 05 bod 4 a správa 07 (upozornenie na apixaban).
- **`who`, `date`**: ✅

### Krok 2: Bolí ju brucho (pol. augusta)
- **`s` „…bolesť ide do chrbta.“**: ⚠️
  - Správa 07: od polovice augusta bolesti „v epigastriu a pravém podžebří“.
  - Šírenie do chrbta je doložené až 15. 9. (správa 05).
- **`s` „Myslí si, že to prejde, a dva týždne čaká.“**: ❌ pre „myslí si, že to prejde“, to v žiadnej správe nie je. Dva týždne sú ✅: správa 04 uvádza „asi 2 týdny trvající bolesti“ pri návšteve 1. 9.
- **`s` „Pri rakovine pankreasu je to bežné, lebo príznaky sú nenápadné.“**: ⚠️ [čiastočne], `raw-journey.md` 1.1 (NHS): príznaky sú nešpecifické.
- **Nové znenie celého `s`:** „Od polovice augusta Alenu bolí brucho, hore pod rebrami. Koncom augusta pribudnú teploty so zimnicou a tmavý moč. K lekárovi ide asi po dvoch týždňoch. Príznaky rakoviny pankreasu sú nenápadné a podobajú sa na iné choroby.“
  - Zdroj: správy 04 a 07, `raw-journey.md` 1.1.
- **`who` „dcéra“**: ⚠️ V tomto čase sa dcéra v správach nespomína (prvýkrát ako kontaktná osoba v správe 04). **Nové:** `["Alena"]`.
- **`why`**: ✅ [čiastočne]
  - `raw-journey.md` 0.5: pankreas nemá populačný skríning, 55 % prípadov sa zachytí v štádiu III–IV (ÚZIS).
  - **Voliteľne doplniť:** „V Česku sa viac ako polovica prípadov zistí v pokročilom štádiu (ÚZIS).“

### Krok 3: Prvá návšteva u praktika (1. 9.)
- **`s` „teplotu 38,1 °C“**: ✅ správy 04 a 07.
- **`s` „Praktik si myslí, že je to infekcia, dá jej antibiotiká…“**: ✅
  - Správa 04: podozrenie na infekciu močových ciest alebo žlčových ciest.
  - Ciprofloxacín od 2. 9.
- **`s` „pošle ju na odber krvi“**: ⚠️ drobnosť. Správa 02: krv aj moč. **Nové:** „pošle ju na odber krvi a moču“.
- **`s` „Krv ide do súkromného laboratória.“**: ✅ Správa 02: „Laboratoř LabJih s.r.o.“ (fiktívne).
- **`who` „sestra“**: ⚠️ V správach nie je. **Nové:** `["Alena","praktik","laboratórium"]`.
- **`why` „…počítame dni do začiatku liečby.“**: ⚠️
  - Začiatok liečby v podkladoch nie je, len termín na onkológii 4. 11. (viď krok 16).
  - **Nové znenie:** „Tu spúšťame stopky. Od tohto dňa počítame dni po prvý termín na onkológii.“

### Krok 4: Röntgen a telefonát (3.–4. 9.)
- **`s`** (RTG v inom pracovisku, v poriadku, telefonát, epikríza, objednanie ku gastroenterologičke): ✅
  - Správa 03: „Bez známek zánětlivých změn plic“.
  - Správa 04: telefonická kontrola 4. 9., objednaná na 15. 9.
- **`why` „…každá leží v inom systéme.“**: ⚠️
  - Prípad nehovorí, aké systémy pracoviská majú. Overené je len to, že ide o 4 rôzne pracoviská.
  - **Nové znenie:** „Každé vyšetrenie má vlastnú správu a každá vznikla na inom pracovisku. Už teraz sú 4 správy na 4 miestach.“

### Krok 5: U gastroenterológa (15. 9.)
- **`s` „čakala 11 dní“ a „na ultrazvuk čaká dva týždne“**: ✅
  - Od 4. 9. do 15. 9. je 11 dní.
  - Správa 05: „nejbližší volný termín 29. 9.“, teda 14 dní.
- **`why` „Čakanie medzi krokmi je normálne, ale pri rakovine je každý týždeň dôležitý.“**: ⚠️ Hodnotenie „normálne“ nemá zdroj.
  - **Nové znenie:** „Ministerstvo píše, že práve v tejto fáze (podozrenie, žiadanky, čakanie na výsledky) môže pacient stratiť týždne. Gastroenterologička už 15. 9. medzi možnými príčinami uviedla aj nádor pankreasu.“
  - Zdroj: MZ 2. 9. 2026; správa 05: „Diferenciálně diagnosticky … tumor pankreatu“.

### Krok 6: Ultrazvuk niečo našiel (29. 9.)
- **`s`**: ✅
  - Správa 06: ložisko v hlave pankreasu „suspektní z malignity“.
  - Zadanie: s nálezom „se vrátila k praktickému lékaři“.
- **`why` „Od teraz má ísť všetko rýchlo. Pacient by mal ísť do špecializovaného centra (KOC).“**: ⚠️ Smer je správny, chýba zdroj.
  - **Nové znenie:** „Ministerstvo hovorí, že pri dôvodnom podozrení na nádor má lekár kontaktovať koordinátora. Rakovinu pankreasu ministerstvo radí medzi rýchlo postupujúce nádory, ktoré majú u koordinátora prednosť.“
  - Zdroj: MZ 2. 9. 2026; Věstník 11/2025, čl. 6 ods. 3 („fast track“ diagnózy C34, C25).

### Krok 7: Praktik posiela Alenu do KOC (2. 10.)
- **`s` „Praktik napíše žiadosť do KOC (Nemocnica Lipová) a pošle ju koordinátorovi.“**: ✅ ako dej, chýba však kanál.
  - Zadanie: koordinátora aktivoval „zasláním epikrízy“. Kanál neuvádza.
  - **Nové znenie:** „Praktik napíše žiadosť do KOC (Nemocnica Lipová) a pošle ju koordinátorovi. Akým kanálom, zadanie nepíše. Na Bulovke lekár koordinátorke zavolá alebo napíše e-mail a pošle vyplnený formulár. V MOÚ Brno vyplní žiadanku na webe. Pre centrá, ktoré operujú pankreas, ministerstvo od 1. 9. 2026 určuje ako kontakt web, e-mail a telefón koordinátora.“
  - Zdroje: zadanie; stránka ÚGO Bulovka; MOÚ; Metodický pokyn HPB, časť 4.
- **`lost`**:
  - „V žiadosti nie sú výsledky, len zoznam, kde ich hľadať.“: ✅ Zadanie: „bez výsledků vyšetření“. Správa 07: „VÝSLEDKY K DISPOZICI NA JEDNOTLIVÝCH PRACOVIŠTÍCH“.
  - „Chýba e-mail na pacientku“: ✅ Správa 07 má len telefón, šablóna MDT_zapis chce „Telefon, email“. Navyše chýba aj e-mail na praktika: v správe 07 je len jeho telefón.
  - „otázka pre lekárov je všeobecná“: ⚠️ Je to hodnotenie. Fakt je, že správa 07 žiada „stanovení dalšího postupu v rámci MDT“.
  - „Praktik nedostane potvrdenie, že ju prijali.“: ⚠️ Zadanie to netvrdí doslova. Deck, slajd 5: referujúci lekár „nemá jednoduchý způsob, jak zjistit, zda byl pacient přijat“.
  - „Už prešiel 31 dní.“: ✅ výpočet (od 1. 9. do 2. 10.). Gramatika: „Už prešlo 31 dní.“
  - **Nové znenie celého `lost`:** „V žiadosti nie sú výsledky, len zoznam, kde ich hľadať. Pritom správy od kardiológa a od gastroenterologičky majú na konci poznámku, že kópiu dostal praktik. Chýba e-mail na pacientku aj na praktika. Otázka pre konzílium znie len „stanovenie ďalšieho postupu“. VZP píše, že praktik nemá jednoduchý spôsob, ako zistiť, či pacientku prijali. Už prešlo 31 dní.“
  - Zdroje: správy 01, 05, 07; deck slajd 5. Pri správach 01 a 05 je „Kopie: MUDr. Tomáš Řezníček, praktický lékař“.
- **`app` „Praktik pretiahne do appky všetko, čo má (PDF, fotky)…“**: ❌ pre „(PDF, fotky)“, zdroj nie je.
  - **Nové znenie:** „Praktik vyberie centrum, priloží epikrízu a nahrá správy, ktoré má vo svojom programe. Ručne vyplní len to najnutnejšie. Hneď vidí, že žiadosť prišla, a potom aj jej stav (napríklad „čaká na podklady“).“
  - Zdroj: deck slajd 7 („Nahraje zprávy z vlastního ambulantního softwaru“, „Nevytvářejte další rozsáhlý formulář“); deck slajd 10 (stavy prípadu).
  - Pôvodné „hneď dostane potvrdenie, že pacientku prevzali“ je prisilné. Podľa decku prípad najprv prechádza triedením („V triage“).

### Krok 8: Koordinátor naháňa správy (2.–8. 10.)
- **`s`**: ✅
  - Zadanie: „vyžádal si všechny ostatní stávající zprávy (01-06)“ a „objednal CT v KOC 1 … protože v KOC 2 nebyl dostupný termín“.
  - Päť pracovísk sedí: kardiológ, LabJih, Modřany, praktik, Poliklinika Jižní.
- **`lost` (citácie VZP)**: ✅ obsah, ⚠️ dve drobnosti:
  - Nie je to v zadaní, ale v decku (slajd 5).
  - Citácie sú skrátené. V origináli je „místo koordinace péče“ a „odpovědnosti za další krok“.
  - **Nové znenie prvej vety:** „VZP v prezentácii k výzve píše, že koordinátor „tráví veľkú časť času dohľadávaním chýbajúcich údajov a dokumentov namiesto koordinácie starostlivosti“ a že „nie je spoločný prehľad o stave prípadu, termínoch a zodpovednosti za ďalší krok“.“
- **`lost` „Správy sú z rôznych pracovísk… Akým kanálom ich koordinátor získava, zadanie neuvádza.“**: ✅ zadanie. Je to už opravená verzia, PDF, fotky ani pošta v nej nie sú.
- **Doplniť na koniec `lost`** (to, čo o kanáloch reálne vieme): „Skutočné koordinátorky opisujú hlavne telefonovanie a e-maily na pracoviská (FN Olomouc). Koordinátorka na Bulovke hovorí, že nečaká, kým správy prídu, ale sama ich zháňa. Snímky CT a MR z iných nemocníc chodia cez ePACS, sieť na posielanie snímok (Bulovka). Ako sa ku koordinátorovi dostanú správy od praktikov a ambulancií mimo nemocnice, nikto nezverejnil.“
  - Zdroje: FN Olomouc 4. 11. 2025; Zdravotnický deník 4. 6. 2026; stránka ÚGO Bulovka („CT snímky (ePACSem)“).
- **`app`**: ✅ ako návrh.
  - Zadanie: „umožnit koordinátorovi vyžádat chybějící zprávy z jiných pracovišť“.
  - Deck slajd 9: „U každého pacienta je vidět stav, termín a kdo je na tahu.“
  - „Jedným klikom“ je marketing, nie fakt. Deck slajd 12 hovorí, že produkčné napojenie patrí do ďalšej fázy.
- **`day: 33`**: ⚠️ drobnosť. Deň 33 (4. 10.) nezodpovedá žiadnej udalosti. Navrhujem `day: 31` (2. 10., deň, keď koordinátor dostane žiadosť).

### Krok 9: CT v inej nemocnici (8. 10.)
- **`s`**: ✅
  - Správa 08: CT 8. 10. v Nemocnici Severní.
  - Veľkosť nádoru a „bez známek vzdálených metastáz“.
- **`why` „Snímky sú v inej nemocnici, ako bude konzílium. Musia sa nejako dostať do KOC 2.“**: ✅
  - Konzílium je v Nemocnici Lipová (záver MDT).
  - Záver MDT chce „radiologické revizi“.
- **`why` „Keď sa to nepodarí, CT sa často robí znova.“**: ❌ zdroj nemáme.
  - **Nové znenie celého `why`:** „CT robili v Nemocnici Severní, konzílium bude v Nemocnici Lipová. Snímky sa teda musia dostať do druhej nemocnice. Skutočné centrá to opisujú cez ePACS, sieť na posielanie snímok medzi nemocnicami (Bulovka, MOÚ Brno). Niektoré nemocnice dávajú pacientom snímky aj na CD (ČT24, 2024). Ako sa snímky dostali do Lipovej, zadanie nepíše.“
  - Zdroje: stránka ÚGO Bulovka; MOÚ, leták krajského koordinátora (pole o dostupnosti v PACS); ČT24 13. 7. 2024.

### Krok 10: Biopsia a krv (12.–15. 10.)
- **`s` „odoberú kúsok pankreasu ihlou cez žalúdok“**: ⚠️
  - Správa 09: endoskop ide cez pažerák a žalúdok do dvanástnika, vpich je „z transduodenální polohy“, teda z dvanástnika.
  - **Nové znenie:** „Lekári urobia biopsiu: cez ústa zavedú hadičku s ultrazvukom až do dvanástnika a odtiaľ tenkou ihlou odoberú kúsok nádoru. O tri dni má kontrolné odbery krvi.“
- **`who` „sestra“**: ⚠️ V správe nie je. Je tam anestéziológ. **Nové:** `["gastroenterológ KOC 2","anestéziológ","laboratórium KOC 2"]`.
- **`why`**: ✅ Správa 09: „poslední dávka 18. 10. 2026 večer“ pri výkone 12. 10.

### Krok 11: Histológia potvrdí rakovinu (19. 10.)
- **`s`, `why`, `who`**: ✅ Správa 11: „Datum vydání: 19. 10. 2026“, duktálny adenokarcinóm.

### Krok 12: Koordinátor chystá podklad pre konzílium (20.–21. 10.)
- **`s` „…ručne z nich robí podklad pre konzílium…“**: ⚠️
  - Že podklad pripravuje koordinátor, je ✅: zadanie chce „Připravit podklad pro MDT“, MZ píše, že koordinátor pomáha „s kompletací podkladů“.
  - Že to dnes robí „ručne“ a ako, zadanie nepíše.
  - **Nové znenie:** „Koordinátor dáva dokopy podklad pre konzílium z 11 správ: diagnózu, lieky, výsledky, otázku pre lekárov. Ako sa to dnes robí v Lipovej, zadanie nepíše. Na Bulovke údaje zo správ prepisuje do formulára lekár, ktorý pacienta posiela.“
  - Zdroje: zadanie; MZ 2. 9. 2026; Word formulár „ŽÁDANKA do ÚGO“ (Bulovka).
- **`lost`**:
  - „ECOG nikde nie je“: ✅ záver MDT: „ECOG není v podkladech výslovně stanoveno“.
  - „váha je raz 63 a raz 65 kg“: ⚠️ Váha 63 kg je zo správy 12 z 26. 10., teda **po** konzíliu. K 21. 10. sú len 69 kg (júl, správa 01) a 65 kg (15. 9., správa 05). To je chudnutie, nie rozpor.
  - „histológia je „vydaná“ deň pred odberom“: ✅ Správa 11: odber 20. 10., vydanie 19. 10.
  - „dátum lieku nesedí“: ✅ správa 09.
  - „Lekári môžu dostať podklad neskoro alebo neúplný.“: ✅ deck slajd 5.
  - **Nové znenie celého `lost`:** „Chyby sa ľahko prehliadnu: ECOG nikde nie je, aktuálna váha chýba (posledná je 65 kg z 15. 9.), histológia je „vydaná“ deň pred odberom a dátum vysadenia lieku nesedí. VZP píše, že konzílium môže dostať podklady neskoro alebo neúplné.“
- **`app`**: ✅ ako návrh.
  - Zadanie: „upozornit na chybějící nebo nesouhlasící údaje“.
  - Deck slajd 8: „lékař validuje“.

### Krok 13: Konzílium rozhodne (21. 10.)
- **`s` „…5–6 lekárov: chirurg, onkológ, rádiológ, patológ, gastroenterológ.“**: ⚠️
  - Záver MDT: 6 lekárov (HPB chirurg, klinický onkológ, radiačný onkológ, gastroenterológ, rádiologička, patológ) a koordinátorka.
- **`s` „Rozhodnú: najprv chemoterapia, potom zvážiť operáciu.“**: ✅ záver MDT („neoadjuvantní systémovou chemoterapii“, potom znovu posúdiť resekciu).
- **Nové znenie celého `s`:** „Na konzílium sa stretne 6 lekárov a koordinátorka: chirurg, klinický onkológ, radiačný onkológ, gastroenterológ, rádiológ a patológ. Rozhodnú: najprv chemoterapia, potom znova posúdiť operáciu.“
- **`who`**: ⚠️ chýba gastroenterológ. **Nové:** `["chirurg","onkológ","gastroenterológ","rádiológ","patológ","koordinátorka"]`.
- **`why` „Bez kompletných podkladov sa rozhodnutie odloží o týždeň.“**: ❌ „o týždeň“ nemá zdroj.
  - **Nové znenie:** „Tu sa rozhoduje o liečbe. Podľa odborného postupu pre konzíliá sa má rozhodovať, až keď sú k dispozícii všetky dôležité výsledky. Aj v Aleninom prípade konzílium zapísalo, že ECOG v podkladoch chýba a treba ho doplniť pred liečbou. Či a o koľko by chýbajúce podklady rozhodnutie odložili, zadanie nepíše.“
  - Zdroje: `raw-dataflow.md` §6 (KDP-AZV-20, ÚZIS) [čiastočne]; záver MDT, bod 2.

### Krok 14: Povedia to Alene (23.–27. 10.)
- **`s` „Lekár povie Alene a dcére…“**: ⚠️
  - Správa 13: diagnózu jej oznámili 23. 10. Kto a či pri tom bola dcéra, správy nepíšu.
  - Záver MDT, bod 6: koordinátorka má Alenu informovať o pláne a s jej súhlasom komunikovať aj s dcérou.
  - **Nové znenie:** „23. 10. sa Alena dozvie diagnózu. Kto jej to povedal, správy nepíšu. Konzílium uložilo koordinátorke informovať Alenu o pláne a s jej súhlasom aj dcéru. Alena potom ide k algeziológovi (26. 10., KOC 1) a k psychologičke (27. 10., KOC 2).“
- **`who` „onkológ“**: ⚠️ nedoložené. **Nové:** `["koordinátorka","Alena","dcéra","algeziológ","psychológ"]`.
- **`why` „…lekár na bolesť a psychológ jej odporúčajú lieky, ktoré sa spolu nemusia znášať. Navzájom o sebe nevedia.“**: ❌ Zdroj mu odporuje.
  - Správa 13: psychologička o tramadole vie („Pacientka užívá tramadol – při volbě antidepresiva zohlednit riziko serotoninového syndromu“). Lieky nepredpisuje, posiela Alenu k psychiatrovi (3. 11.).
  - Správa 12: algeziológ predpísal tramadol a upozornil na riziko s antidepresívami.
  - **Nové znenie:** „Lekár na bolesť (KOC 1) jej predpísal tramadol a upozornil, že spolu s niektorými liekmi na depresiu môže byť nebezpečný. Psychologička (KOC 2) o tramadole vie a posiela Alenu k psychiatrovi, ktorý môže lieky na depresiu nasadiť. Správy sú v dvoch rôznych nemocniciach, tak to musí niekto ustrážiť.“

### Krok 15: Späť k praktikovi (po 21. 10.)
- **`s` „Výsledok konzília by mal dostať praktik aj revízny lekár poisťovne.“**: ✅ [čiastočne]
  - Praktik: zadanie („Zprávu z MDT aplikace zašle praktickému lékaři“); záver MDT, „Kopie: MUDr. Tomáš Řezníček“.
  - Revízny lekár: len deck slajd 11, v zadaní nie je. Či ide o lekára poisťovne, deck nepíše.
- **`s` „Praktik je ten, kto bude Alenu vidieť najčastejšie.“**: ❌ zdroj nemáme.
- **Nové znenie celého `s`:** „Záver konzília má dostať praktik. Tak to chce zadanie VZP aj odborný postup pre konzíliá. Prezentácia VZP chce, aby informáciu automaticky dostal aj revízny lekár.“
  - Zdroje: zadanie; `raw-dataflow.md` §6 (KDP); deck slajd 11.
- **`lost` „Zákon neurčuje, ako sa výsledok pošle, a nikto nepotvrdzuje, že ho praktik dostal. Praktik často nevie…“**: ⚠️
  - Prvá časť je [čiastočne], `raw-dataflow.md` §6: zákon 372/2011 §45 ukladá správu praktikovi, kanál ani doklad o doručení neurčuje.
  - „Nikto“ a „často“ nemajú zdroj.
  - **Nové znenie:** „Zákon hovorí, že praktik má dostať správu, ale neurčuje, akým kanálom ani ako doložiť, že prišla. VZP píše, že praktik nemá jednoduchý spôsob, ako zistiť, či pacienta prijali a ako konzílium rozhodlo.“
  - Zdroj: deck slajd 5.
- **`app` „…Appka ukáže „doručené a prečítané“…“**: ⚠️ drobnosť. Zadanie chce „doložit doručení“, deck „Předání potvrďte a případ uzavřete“. „Prečítané“ nikto nežiada a vyžadovalo by napojenie na program praktika.
  - **Nové znenie:** „Záver konzília ide praktikovi aj s pôvodnými podkladmi. Informáciu dostane aj revízny lekár. Appka ukáže, že správa bola doručená, a prípad sa uzavrie.“

### Krok 16: Začína liečba (4. 11.)
- **`t` „Začína liečba“ a `s` „Alena začína chemoterapiu“**: ❌
  - Záver MDT, bod 1: „termín na onkologické konzilium 4.11.2026 10:30“. Je to termín u onkológa, nie začiatok chemoterapie.
  - Bod 2: pred začiatkom liečby treba určiť ECOG, urobiť krv a posúdiť žlčové cesty.
  - Kedy chemoterapia začne, v podkladoch nie je.
- **`s` „Bude chodiť každé 2 týždne, niekoľko mesiacov.“**: ❌ zdroj nemáme.
- **`s` „Potom lekári zvážia operáciu.“**: ✅ záver MDT, bod 3.
- **Nové `t`:** „Termín na onkológii“.
- **Nové `s`:** „4. 11. má Alena termín na onkológii kvôli chemoterapii pred možnou operáciou. Konzílium chce pred začiatkom liečby ešte určiť ECOG, urobiť nové krvné testy a zistiť, či netreba uvoľniť žlčové cesty. Kedy chemoterapia naozaj začne, v podkladoch nie je. Po chemoterapii lekári znova posúdia operáciu.“
- **`who`**: ⚠️ „sestra“ nie je doložená. **Nové:** `["onkológ","koordinátorka","Alena"]`. Koordinátorka: záver MDT bod 6, „zajistit objednání na onkologii“.
- **`why` „Od prvej návštevy u praktika ubehlo 64 dní. 31 … pred KOC a 19 v KOC do konzília.“**: ✅ výpočet (31 + 19 + 14 = 64).
- **`why` „Cieľ ministerstva … je ideálne pár týždňov.“**: ⚠️
  - MZ 2. 9. 2026 píše konkrétne: pri „fast-track“ diagnózach majú byť čakacie doby ideálne do dvoch týždňov.
  - **Nové znenie celého `why`:** „Od prvej návštevy u praktika po tento termín prešlo 64 dní: 31 dní pred KOC, 19 dní v KOC do konzília a 14 dní od konzília po termín na onkológii. Ministerstvo píše, že pri rýchlo postupujúcich nádoroch, kam patrí aj pankreas, by čakacie doby mali byť ideálne do dvoch týždňov.“
  - Zdroje: MZ 2. 9. 2026; Věstník 11/2025, čl. 6.
  - Voliteľne: „Koordinátorka z Bulovky hovorí, že pri nádoroch tráviaceho traktu môže bežná cesta k diagnóze trvať až dva mesiace, s koordinátorom niekoľko týždňov (MZ, 2. 9. 2026).“

---

## Ostatné texty hry

### Úvod a misia
- **Úvod** („O dva mesiace neskôr bude mať diagnózu…“, „Celý prípad je fiktívny…“): ✅ Od polovice augusta do 19. 10. sú asi 2 mesiace.
- **Misia** „Sleduj Aleniných 13 správ. Ležia na 7 rôznych miestach a koordinátor ich musí dostať k sebe na jeden stôl, inak konzílium nemôže rozhodnúť.“: ⚠️
  - Správy 12 a 13 vznikli až po konzíliu (zadanie, „Upozornění“).
  - **Nové znenie:** „Sleduj Aleniných 13 správ. Ležia na 7 rôznych miestach. Pred konzíliom ich koordinátor potrebuje 11 na jednom stole.“
- **Text pri ukazovateli** „Dni od prvej návštevy u lekára (1. 9.) po začiatok liečby“: ⚠️ (viď krok 16). **Nové:** „Dni od prvej návštevy u lekára (1. 9.) po termín na onkológii (4. 11.)“.

### Slovník `TERMS`
- **„liek na riedenie krvi“** („…musí na pár dní vysadiť“): ⚠️ Správa 01 hovorí o 48 hodinách.
  - **Nové:** „Apixaban. Aby sa netvorili krvné zrazeniny. Kardiológ napísal, že pred zákrokom s rizikom krvácania sa má vysadiť 48 hodín vopred.“
- **„koordinátor“** („Nová pozícia od 1. 1. 2026…“): ⚠️ MZ: „Od roku 2026 … musí mít každé KOC minimálně jednoho koordinátora“. Na Bulovke však koordinátorky pracovali už skôr (formulár ÚGO je z 8/2024).
  - **Nové:** „Od roku 2026 ho musí mať každé KOC (niektoré nemocnice ho mali už skôr). Človek v KOC, ktorý objednáva vyšetrenia, stráži termíny a zbiera správy. Nelieči a nerozhoduje o liečbe. Nemusí byť zdravotník.“
  - Zdroje: MZ 2. 9. 2026; Věstník 11/2025, čl. 6.
- **„biopsia“** („…ide cez ústa do žalúdka“): ⚠️ správa 09.
  - **Nové:** „Odber kúska tkaniva ihlou. Pri pankrease cez hadičku s ultrazvukom, ktorá ide cez ústa a žalúdok až do dvanástnika.“
- **„chemoterapia“** („…napríklad každé 2 týždne“): ⚠️ „každé 2 týždne“ v našich zdrojoch nie je. **Nové:** „Lieky, ktoré ničia rakovinové bunky. Podávajú sa v cykloch.“
- **„KOC“** (15 + 2): ✅ zoznam MZ z 2/2026 (`raw-cz-system.md` §1.1).
- **„žiadosť“** („Musí v nej byť diagnóza, výsledky a dôvod“): ✅ [čiastočne]. `raw-dataflow.md` §2.1: vyhláška 444/2024 Sb. chce okrem iného zdôvodnenie, pracovnú diagnózu a podstatné výsledky.
- **„pankreas“, „praktik“, „konzílium“, „ECOG“, „epikríza“, „CT“, „histológia“, „ultrazvuk“, „podklad“, „revízny lekár“**: ✅ alebo ide o bežné vysvetlenie pojmu.
  - Pri „revízny lekár“ deck nepíše, či ide o lekára poisťovne [čiastočne].

### QA 1: „Koľko je tých koordinátorov?“ (`raw-koordinatori-pocty.md`)
- **`short` „V jednej nemocnici sú to zatiaľ 1 až 3 ľudia…“**: ⚠️ Podklad hovorí o 1 až 3 na **onkologickom pracovisku**. FN Ostrava má v celej nemocnici 5 koordinátorov na 5 klinikách.
  - **Nové:** „Na jednom onkologickom pracovisku sú to zatiaľ 1 až 3 ľudia. Celkový počet v Česku nikto nezverejnil.“
- **Graf, FN Ostrava „len pár hodín týždenne“**: ⚠️ Je to náš úsudok z hodín, kedy je koordinátorka k dispozícii, nie z úväzku. **Nové:** „kontakt len ut–št 10–12“.
- **„Koľko pacientov má jeden: … asi 10 nových pacientov týždenne“**: ⚠️
  - Vaňková hovorí „asi o 10 pacientů týdně“, slovo „nových“ nepoužila.
  - Máme aj druhý údaj: Švarcová, FN Olomouc, zhruba 15–20 pacientov týždenne.
  - **Nové:** „Koľko pacientov má jeden: systematicky to nikto nezverejnil. Dva údaje z rozhovorov: Bulovka asi 10 pacientov týždenne, FN Olomouc 15–20 týždenne.“
- **„Koordinátor teda nestihne všetkých, sústredí sa hlavne na… (pľúca, pankreas)“**: ⚠️ „Nestihne všetkých“ je náš záver.
  - **Nové:** „Ministerstvo chce, aby koordinátor dával prednosť rýchlo postupujúcim nádorom, napríklad pľúc a pankreasu.“
  - Zdroj: Věstník 11/2025, čl. 6 ods. 3.
- **„Kurz zatiaľ absolvovalo asi 140 záujemcov“**: ⚠️ MZ píše, že prebehli dve školenia „pro zhruba 140 zájemců“. Koľko ľudí kurz dokončilo, nevieme.
  - **Nové:** „…stačí maturita. Na ČVUT prebehli dve školenia pre zhruba 140 záujemcov. Či je kurz povinný, sme nenašli.“
- **Pravidlo „aspoň jedného koordinátora na plný úväzok“, rozdelenie podľa diagnóz, 1 000 pacientov, VFN 1 250**: ✅ Věstník 11/2025; FN Olomouc; tlačová správa VFN 29. 9. 2025.
- **`src` „Malá vzorka, 5 z 15 KOC“**: ⚠️ Nemocnica Na Pleši nie je KOC. **Nové:** „Malá vzorka: 4 KOC a Nemocnica Na Pleši (tá nie je KOC).“

### QA 2: „Za čo presne je tých 250 Kč?“ (`raw-vykon-51887.md`)
- **Suma, kód 51887, najviac 1× za deň, bez stropu, peniaze nemocnici**: ✅ vyhláška 134/1998 Sb.; úhradová vyhláška 432/2025 Sb., bod 8.5.
- **„Zásah je napríklad objednanie vyšetrenia, vyžiadanie správy alebo príprava podkladu.“**: ⚠️ Predpis „zásah“ nedefinuje (sekcia to sama hovorí v pätke).
  - **Nové:** „Za čo: za jednu „intervenciu koordinátora“ (kód 51887). Čo presne je jedna intervencia, predpis nedefinuje. Podľa Věstníka koordinátor objednáva konzíliá, vyšetrenia a operácie.“
- **„Podmienka: každý zásah musí byť zapísaný (kto ho požiadal, čo urobil, kedy).“**: ⚠️ Zápis je povinný ✅. Zoznam „kto, čo, kedy“ je ale náš výklad.
  - **Nové:** „Podmienka: každý zásah musí byť zapísaný v dokumentácii a v zázname o koordinácii. Čo presne má zápis obsahovať, predpis nepíše.“
- **„71 tisíc Kč ročne (náš výpočet)“**: ✅ je označené ako náš výpočet (23,68 mld. Kč / 332 800 pacientov).
- **Obrázok so 4 dňami**: ✅ je označený ako ilustračný.

### QA 3: „Kto koho platí?“
- **7 poisťovní, VZP 6,17 mil., štát za deti a dôchodcov, 23,7 mld. Kč na onkológiu v 2024**: ✅ [čiastočne], `raw-cz-system.md` §2.1 (VZP, finance.cz).
- **„Pacient za liečbu rakoviny v Česku takmer nič neplatí.“**: ⚠️ V našich zdrojoch to nie je. Odstrániť, alebo dohľadať zdroj.

### QA 4: „Čo je KOC a kde sú?“
- **15 + 2, platnosť do 2031, zoznam miest, 1 000 pacientov, 2 ožarovacie prístroje, koordinátor, asi 23 ROC, Slovensko bez KOC**: ✅ `raw-cz-system.md` §1; `raw-sk-system.md`.
- **„8 KOC sú štátne (fakultné nemocnice), 6 krajské a 1 súkromné“**: ⚠️ Medzi 8 štátnymi je aj MOÚ, ktoré nie je fakultná nemocnica. Vlastníctvo 5 krajských nemocníc je v podklade neoverené.
  - **Nové:** „8 KOC sú štátne (fakultné nemocnice a MOÚ), väčšina ostatných krajská a 1 súkromné.“
- **Čip „Praha · Motol + Homolka“**: drobnosť. V zozname je s nimi aj Karlovarská krajská nemocnica.

### QA 5: „Prečo si lekári nepošlú správu jednoducho e-mailom?“ (najdôležitejšia oprava)
- **Otázka sama**: ⚠️ Predpokladá, že e-mail sa nepoužíva. Zdroje hovoria opak:
  - Švarcová telefonuje a píše maily;
  - Bulovka berie formulár e-mailom;
  - Ústí prijíma dokumentáciu e-mailom;
  - tender Tišnov: dokumentácia sa „mnohdy“ posiela obyčajným e-mailom.
  - **Nová otázka:** „Ako si lekári posielajú správy?“
- **`short` „Každý lekár má iný program a tie programy spolu nekomunikujú.“**: ⚠️ Deck (poznámky k slajdu 2) hovorí „odlišné a málo kompatibilní“.
  - **Nové:** „Každý inak: telefónom, e-mailom, poštou, cez pacienta aj cez elektronické siete. Programy lekárov sú rôzne a málo spolu komunikujú.“
- **Nápis v obrázku „Medzi nimi: papier, telefón, PDF, CD, pošta“**: ❌ pre „PDF“, nemá doslovný zdroj.
  - **Nové:** „Medzi nimi: papier, telefón, e-mail, pošta, CD, eZpráva“. Každá položka je overená (NKÚ, FN Olomouc, Tišnov, FN HK, ČT24, FN HK).
- **„Praktici majú najčastejšie programy CGM alebo MEDaX, nemocnice zas STAPRO, Asseco, ICZ či Medicalc. Navzájom si nerozumejú.“**: ⚠️ [čiastočne], `raw-dataflow.md` §1: prednáška pred hackathonom a firemný údaj.
  - **Nové:** „Praktici majú najčastejšie programy CGM alebo MEDaX, nemocnice zas STAPRO, Asseco, ICZ či Medicalc. VZP píše, že sú odlišné a málo spolu komunikujú.“
- **„Zdravotné údaje by sa mali posielať šifrovane, preto obyčajný e-mail mnohé nemocnice nepoužívajú.“**: ❌ Overené zdroje mu odporujú. Jediný zdroj pre „nepoužívajú“ je z roku 2018.
  - **Nové:** „Obyčajný e-mail sa používa. Jedna nemocnica v tendri z roku 2024 píše, že sa ním zdravotná dokumentácia posiela „mnohdy“.“
- **„Elektronická žiadanka (eŽádanka) existuje od 1. 1. 2026, ale je zatiaľ dobrovoľná.“**: ✅ [s doplnením].
  - **Nové:** „Elektronická žiadanka (eŽádanka) funguje od januára 2026, ale je dobrovoľná. Do konca júna 2026 ich lekári vystavili asi 2 000 skúšobne. Povinná má byť od júla 2027, zatiaľ je to len návrh zákona.“
  - Zdroje: Vitalia 29. 6. 2026; MZ 24. 6. 2026.
- **„Centrálne miesto na všetky správy pacienta v Česku neexistuje.“**: ✅ [čiastočne], `raw-dataflow.md` §3: zdieľaný záznam neobsahuje onkologické správy.
  - **Nové (presnejšie):** „Spoločné miesto pre všetky lekárske správy pacienta v Česku nie je. Štát zatiaľ centrálne zbiera laboratórne výsledky.“
  - Zdroj: MZ 24. 6. 2026, 282 laboratórií.
- **„Preto pacienti často nosia papiere a CD so snímkami sami a ľudia údaje prepisujú ručne.“**: ⚠️ NKÚ píše „někdy“, nie „často“.
  - **Nové:** „Pacienti niekedy stále nosia papierové správy sami (NKÚ, 2026). V jednej krajskej nemocnici si 15–20 % pacientov pýta snímky na CD (ČT24, 2024). Lekári údaje opakovane prepisujú (VZP).“
- **Doplniť nové odrážky:**
  1. „Správy z nemocníc k praktikom idú čoraz viac cez eZprávu. Napríklad FN Hradec Králové posiela tým, ktorí v nej nie sú, správy stále poštou.“ (FN HK 16. 6. 2025)
  2. „Koľko správ ide ktorou cestou, nikto nezverejnil.“

### QA 6: „Čo presne postavíme?“
- **Štyri kroky (Prevziať, Vyťažiť, Koordinovať, Spätná väzba) a pravidlo, že rozhoduje človek**: ✅
  - deck slajdy 6–12;
  - „AI pouze připraví návrh → rozhoduje a potvrzuje člověk“ (slajd 8).

### Pätička
- ⚠️ Pätička uvádza len Věstník, MZ, úhradovú vyhlášku, ÚZIS a OECD. Po opravách treba doplniť zdroje kanálov.
  - **Nové:** „Fakty o systéme: Věstník MZ 11/2025, MZ ČR (2. 9. 2026), Metodický pokyn MZ pre HPB centrá (2026), úhradová vyhláška 2026, ÚZIS, OECD 2025, rozhovory s koordinátorkami (Bulovka, FN Olomouc), FN Hradec Králové, NKÚ.“

---

## Čo nevieme (a hra to má priznať, nie domýšľať)

1. Akým kanálom prišla Alenina žiadosť (správa 07). Zadanie píše len „zasláním“.
2. Akým kanálom a v akej podobe koordinátor dostal správy 01–06.
3. Ako sa snímky CT dostali z Nemocnice Severní do Lipovej.
4. Kedy Alena naozaj začne chemoterapiu.
5. Kto jej 23. 10. oznámil diagnózu.
6. Či chýbajúce podklady konzílium odkladajú a o koľko.
7. Koľko správ v Česku ide ktorým kanálom.

## Súhrn

Počty sú približné. Rátal som značky v riadkoch s hodnotením v častiach „Kroky 1–16“ a „Ostatné texty hry“. Niektoré riadky majú dve značky.

| | Počet |
|---|---|
| ✅ podložené | 39 |
| ⚠️ treba upraviť | 44 |
| ❌ odstrániť | 10 |

Tvrdenia, ktoré treba odstrániť (10):
- krok 2: „Myslí si, že to prejde“
- krok 7: „(PDF, fotky)“
- krok 9: „CT sa často robí znova“
- krok 13: „odloží o týždeň“
- krok 14: „navzájom o sebe nevedia“
- krok 15: „Praktik je ten, kto bude Alenu vidieť najčastejšie“
- krok 16: „Začína liečba / Alena začína chemoterapiu“
- krok 16: „každé 2 týždne, niekoľko mesiacov“
- QA 5: „PDF“ v obrázku
- QA 5: „obyčajný e-mail mnohé nemocnice nepoužívajú“

Najzávažnejšie vecné chyby (okrem kanálov):
- **krok 16**: 4. 11. je termín na onkológii, nie začiatok chemoterapie;
- **krok 14**: psychologička o tramadole vie;
- **krok 12**: váha 63 kg je zo správy po konzíliu;
- **krok 1**: liek nepredpísal kardiológ v júli, Alena ho berie od roku 2021.
