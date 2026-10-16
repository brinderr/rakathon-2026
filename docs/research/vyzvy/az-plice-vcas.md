# Praha – Plíce včas: chytrá cesta k prevenci (AstraZeneca) – hĺbková analýza

_Stav: piatok 16. 10. 2026, cca 16:45. Slack bol iba čítaný (nič sa neposielalo), nič sa necommitovalo. Písané pre Bruna a Maťa (nie sú technici), odborné pojmy sú vysvetlené v zátvorke._

Značky: **[Slack]** zo Slacku, **[Drive]** z prezentácie na Google Drive, **[web]** z webu, **[dáta]** z dátových súborov výzvy (moja analýza), **[odhad]** môj odhad, **[?]** neisté alebo som to nevedel overiť. Vlastné prepočty sú označené „(náš prepočet)“.

**Obmedzenia tohto prieskumu (poctivo):** (1) web search sa mi v polovici práce vyčerpal (limit), takže „existujúce riešenia“ sú postavené na priamych stránkach firiem a na predchádzajúcich súboroch 07–09, nie na širokom hľadaní. (2) Dátové súbory `1_patients.csv` a `3_chest_ct_examinations.csv` sa mi cez Slack nepodarilo načítať (server neodpovedal ani na viacero pokusov); prečítal som dátový slovník, `2_smoking_history.csv` a `4_patients_contact_history.csv` celé. Čísla o veku pacientov a o CT vyšetreniach teda nemám [?].

---

## 0. TL;DR (verdikt na jednu stranu)

- **Čo to je:** Nemocnica/ambulancia má v systéme údaje o pacientoch. Treba **automaticky nájsť ľudí, ktorí patria do bezplatného programu skríningu rakoviny pľúc** (55–74 rokov, fajčiar/bývalý fajčiar, bez CT hrudníka za posledný mesiac), **ukázať, prečo ich systém vybral alebo vyradil, poslať im zrozumiteľnú neutrálnu správu** (portál, list alebo úloha pre praktika), **sledovať doručenie a reakciu** a nechať zdravotníka všetko skontrolovať. Dáta: 300 vymyslených pacientov v 5 CSV súboroch. [Slack, Drive]
- **Prečo je to zaujímavé:** Skríning pľúc **funguje** (v štúdiách o 20–24 % menej úmrtí na rakovinu pľúc) a **v Česku je zadarmo**, ale **chodí naň málo ľudí**. Podľa OECD pilot trpí slabým zapojením praktikov a slabou účasťou po odoslaní. Za 4 roky bolo oslovených asi 44 tisíc klientov VZP z odhadovaných 250–500 tisíc oprávnených v celej krajine. **Keď sa ľudí opýtajú, dve tretiny povedia áno** (29 278 z 43 735). Zlyháva teda hlavne **vyhľadanie a oslovenie**, nie ochota. To je presne to, čo výzva rieši. [web, viď §3]
- **Naše šance:** Dnes je na výzve **1 tím z Prahy (MSFZ)**, pravdepodobne dôjde ešte 1–3. Zadanie je **jasné a malé**, dáta sú **hotové**, demo za noc je **veľmi reálne**. AstraZeneca napísala, že chce prototyp **preklopiť do reálnej praxe a pomôcť na každom kroku**. Víťaza výzvy v sobotu vyberá zadávateľ (AZ + mentorka), víťaz ide do nedeľného finále. [Slack, Drive]
- **Slabé miesta:** (a) zadanie je v jadre **pravidlový filter** – samo osebe nie je „wow“ ani veľmi „AI“, treba ho obohatiť (čítanie neštruktúrovaného textu, bezpečné generovanie správ, sledovanie celej cesty, FHIR). (b) **Kupec je nejasný** (VZP portál inovácií chce úsporu rozpočtu, skríning náklady zvyšuje). (c) Pravidlá majú **rozpory** (balíčkoroky áno/nie) – treba sa spýtať mentora. (d) Na výzvu sa ešte môžu prihlásiť ďalšie tímy do 19:00.
- **Moje celkové skóre (vážený priemer): 6,9 / 10** (tabuľka v §7). Je to jedna z **bezpečných výziev s vysokou šancou na finále** a silným príbehom, nie najväčšia „veľká téma“.

---

## 1. Presné zadanie

### 1.1 Kto, čo, kde
- **Zadávateľ:** AstraZeneca ČR. **Garantka:** prim. MUDr. Ivana Čierná-Peterová (pneumologička – lekárka pre pľúcne choroby – z ambulancie v Brandýse nad Labem; 1. podpredsedníčka Českej pneumologickej a ftizeologickej spoločnosti). **Mentori v kanáli:** Luboš Matys (AstraZeneca, chodí po sále), Josef Plasil (AstraZeneca), Olena Vasylenko (Microsoft), Ondřej Hoferek (InterSystems – dáva dáta k niektorým pražským výzvam, v tomto kanáli je tiež). [Slack, Drive]
- **Slack kanál:** `#plice-vcas-chytra-cesta-k-prevenci` (predtým `cesta-ke-screeningu-plic`; na webe výberu tímov sa ešte volá „Cesta ke screeningu plic“). Je **krátky**: žiadne vlákna ani otázky tímov, len správy mentora a „joined“ hlášky. Posledná správa 16. 10. 13:50. [Slack]
- **Čo napísal mentor (parafráza):** dáta pre 300 pacientov a README s podrobnejšími pokynmi sú v prílohách; na otázky odpovedajú na Slacku kedykoľvek; zaujíma ich **hlavne prototyp, ktorý sa po Rakathone dá preklopiť do reálnej klinickej praxe**, a s ďalším vývojom budú **radi nápomocní na každom kroku a s maximálnou podporou**. [Slack, 13:41 a 13:50]
- **Popis kanála (1 veta zadania):** „Pomozte oslovit pacienty pro screening plicního karcinomu: nástroj v nemocničním IS vyhledá splňující kritéria programu Prevence pro plíce, bez CT hrudníku za poslední měsíc. Navrhněte srozumitelné info: pacienty odkažte na praktika či pneumologa.“ [Slack]

### 1.2 Čo presne treba vyrobiť (z README + prezentácie)
**Kritériá programu v zadaní** [Drive – 4 slidy, README]:
- **Zaradenie:** vek **55–74 rokov vrátane**; **aktívny alebo bývalý fajčiar**.
- **Vylúčenie:** **CT hrudníka za posledný mesiac**.
- **Súčasť výzvy – kontakt:** navrhnúť cestu oslovenia s odporúčaním obrátiť sa na **praktického lekára alebo regionálneho pneumológa** a **zároveň informovať praktika** o oslovených pacientoch.

**Cieľ („automatický systém a aplikácia“)** – má: [README]
1. nájsť pacientov splňujúcich kritériá;
2. zohľadniť CT hrudníka za posledný mesiac;
3. **ukázať dôvod, prečo bol pacient vytipovaný alebo vyradený**;
4. navrhnúť vhodný komunikačný kanál;
5. **automaticky odoslať pripravenú informačnú správu**;
6. **evidovať stav doručenia a reakciu pacienta**;
7. umožniť **zdravotníkovi výsledok skontrolovať alebo upraviť**.

**Odporúčaný postup:** načítanie dát, vyhodnotenie kritérií, kontrola nedávneho CT, identifikácia vhodných pacientov, výber kanála, odoslanie správy, evidencia komunikácie.

**Odporúčané výstupné stavy:** `ELIGIBLE` (vhodný na kontakt), `EXCLUDED_AGE`, `EXCLUDED_SMOKING_STATUS`, `EXCLUDED_PACK_YEARS` (fajčiarska záťaž pod hranicou), `EXCLUDED_RECENT_CT`, `NEEDS_REVIEW` (údaje chýbajú, sú neúplné alebo si odporujú).

**Kanály kontaktu:** pacientsky portál; listová pošta/tlačový výstup; úloha pre praktika alebo pneumológa. **Správa má byť zrozumiteľná a neutrálna; nesmie pacientovi oznamovať diagnózu ani tvrdiť, že je automaticky zaradený do screeningu.**

**Čo zadanie NEhovorí:** presný formát odovzdania špecifický pre túto výzvu, váhy kritérií ani cenu pre víťaza výzvy [?]. Platia všeobecné kritériá: sobota 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť; v nedeľu pribudne škálovateľnosť a kvalita prezentácie a tímu. [Drive – INTRO Praha, viď 05]

### 1.3 Dáta (5 CSV, 300 vymyslených pacientov, „iba pre Rakathon, nie na reálne klinické rozhodovanie“)
Dátový slovník (zhrnutie) [dáta]:
| Súbor | Čo obsahuje |
|---|---|
| `1_patients.csv` | ID pacienta, dátum narodenia, pohlavie, kraj, ID praktika, ID pneumológa (voliteľné), **aktívny pacientsky portál (áno/nie)**, **preferovaný kanál** (portál/list/tlač/žiadny), **súhlas so správami cez portál**, dátum poslednej návštevy praktika, syntetický telefón, adresa a e-mail |
| `2_smoking_history.csv` | stav (súčasný/bývalý/nikdy/neznámy), cigarety za deň, rok začiatku a konca fajčenia, **balíčkoroky uvedené a vypočítané** (pack-years = koľko krabičiek denne × roky), zdroj, **kvalita údajov (complete/partial/conflicting)**, dátum záznamu, **voľný text** z anamnézy |
| `3_chest_ct_examinations.csv` | ID CT, pacient, dátum a čas, modalita, **oblasť (chest/abdomen/head)**, **protokol (standard_chest / ldct / standard_abdomen / standard_head)**, **stav (completed/scheduled/cancelled)**, text žiadanky a nálezu, zdrojový systém (RIS/PACS/NIS), **príznak externého pracoviska** |
| `4_patients_contact_history.csv` | ID kontaktu, pacient, čas, kanál, typ správy (`lung_screening_information` / `other_prevention_information`), stav doručenia (delivered/read/failed), **reakcia (interested / not_interested / no_response)**, kto to spracoval (SYSTEM alebo ID lekára) |
| `5_data_dictionary.csv` | slovník polí |

**Moje zistenia z dát (overené na súboroch 2 a 4, [dáta]):**
1. **Súbor 2 sú len 10 šablón zopakovaných 30-krát** (300 riadkov). Podľa mojej analýzy: 30 × „nikdy nefajčil“ (10 %), 30 × „neznámy“ (10 %), 30 × „súčasný fajčiar bez počtu cigariet“ (10 %; z toho 28 „partial“, 2 „conflicting“), a 180 riadkov s úplnými údajmi. Dáta sú teda **čisté a malé**, ale s úmyselnými pascami.
2. **Pasca „balíčkoroky“:** 60 pacientov (20 %) má fajčiarsku záťaž len **7,5 balíčkoroka**. Zadanie z prezentácie hovorí „balíčkoroky teraz nezohľadňujeme“, ale README má stav `EXCLUDED_PACK_YEARS` a **reálny program vyžaduje ≥ 20 balíčkorokov** (viď §3). Ak sa balíčkoroky ignorujú, vyberie sa 240 zo 300 podľa fajčenia; podľa reálneho pravidla len 150 spoľahlivo + 30 neistých. **Štvrtina (60 z 240) oslovených by v skutočnom programe podmienky nesplnila** (náš prepočet, ešte pred filtrom veku a CT).
3. **Pasca „zlý výpočet“:** 30 pacientov „fajčí približne dve krabičky denne od 1998“ má `pack_years_calculated = 28`, ale správne by to bolo 40 cigariet/20 × 28 rokov = **56** (náš prepočet). Systém by teda nemal slepo veriť predpočítanému stĺpcu, ale **prepočítať si ho sám a upozorniť na rozdiel**.
4. **Pasca „pokazený CSV riadok“:** 28 riadkov v súbore 2 má o jedno pole menej (chýba hodnota `pack_years_calculated`), takže ich bežný import (napr. pandas) načíta **posunuté o stĺpec**. Navyše sú **riadky v súboroch zabalené celé do úvodzoviek** (v tom, ako ich zobrazuje Slack nástroj, vyzerá každý riadok ako jedno pole) – treba overiť na pôvodnom súbore.
5. **Pasca „diakritika“:** voľné texty majú **zničenú češtinu** („Kou_í p_ibli_n_ dv_ krabi_ky denn_“ = „Kouří přibližně dvě krabičky denně“) – znaky č, ř, š, ý, ů sa zmenili na „_“ (typické pre export z Excelu „CSV Macintosh“). Pravidlá typu „hľadaj slovo krabička“ zlyhajú, **jazykový model tomu rozumie** (to je skutočné odôvodnenie použitia AI).
6. **Kontaktná história (súbor 4):** 100 kontaktov, **všetky cez portál**, každý tretí pacient (SYN-000001, 4, 7 …). **75 je o skríningu pľúc, 25 o inej prevencii** (to nie je kontakt o pľúcach, nesmie sa započítať!). Z 75 správ o pľúcach: **17 „zaujíma ma“ (23 %), 9 „nezaujíma“ (12 %), 41 bez odpovede (55 %), 8 nedoručených (11 %)** (náš prepočet). To určuje logiku: „zaujíma“ → úloha pre praktika; „nezaujíma“ → už neoslovovať; „nedoručené“ → iný kanál; „bez odpovede“ → pripomienka; nedávno oslovený → neposielať znova.
7. **Dátum:** kontakty končia 30. 9. 2026, „dnes“ je 16. 10. 2026 – systém musí mať „dnešný dátum“ ako parameter, aby sa dal demonštrovať.

### 1.4 Hodnotenie, termíny, formát
- **Sobota 17. 10.:** odovzdanie do **13:00** (tvrdý deadline, `submit.rakathon.cz`), 14:00–16:00 **zadávatelia obchádzajú tímy** (nie javisko), 16:00 nahlásia víťazov, 17:00 vyhlásenie. **Víťaz každej výzvy ide do nedeľného finále** (14:00, Kampus Plzeňská, Praha-Motol; pitch pred porotou). [Drive, 05]
- **Odovzdáva sa:** názov, popis do 140 znakov, popis AI a dopadu, povinný titulný obrázok 16:9 do 8 MB, odkazy na GitHub, demo, video. [05]
- **Kto rozhoduje v sobotu:** zadávateľ výzvy (AstraZeneca + mentorka). **AZ nemá miesto v 12-člennej nedeľnej porote** (zloženie podľa rakathon.cz/lide, viď 09). Nedeľná porota: platca VZP, ministerstvo, vláda, nemocnice, výskum, pacientska organizácia, technologické firmy. [09]
- **Cena pre víťaza výzvy:** nie je špecifikovaná [?]. Všeobecné: 100/50/25 tis. Kč, InterSystems 1 500 € (dá sa kombinovať s hocijakou výzvou – tu sa núka **FHIR výstup**, viď §5).
- **Postoj AZ k hodnoteniu:** nie sú publikované žiadne špecifické váhy; slová mentora poukazujú na „prenositeľnosť do praxe“. [Slack]

### 1.5 Nejasnosti, ktoré by sa dali vyriešiť jednou správou mentorovi (len návrh, nič sme neposlali)
1. **Balíčkoroky:** hranica 20 (ako reálny program) alebo ignorovať (ako slid)? Odporúčam implementovať **prepínač** a ukázať oba počty.
2. **„CT hrudníka“ alebo „LDCT“?** Prezentácia hovorí CT hrudníka za mesiac, README LDCT. Má sa vylúčiť aj bežné CT hrudníka a CT z externého pracoviska? Čo plánované (`scheduled`) a zrušené (`cancelled`)? CT brucha/hlavy nevylučuje.
3. **Kto správu posiela** – nemocnica, ambulancia, alebo praktik? A čo pacienti **bez súhlasu so správami cez portál** (len listom/úlohou pre praktika)?
4. **Čo ak je údaj „bývalý fajčiar“ veľmi starý** (reálny program sa pýta aj na dobu od skončenia, náš zdroj ju neuvádza [?])?
5. **Má AZ dostať niečo z dát** (verím, že nie – dáta zostávajú v nemocnici) a ako vidí hranicu medzi osvetou a propagáciou liekov?

---

## 2. Koncový užívateľ

### 2.1 Kto presne to bude používať
**Primárni užívatelia** (v zadaní „zdravotník“, ktorý výsledok kontroluje a upravuje):
1. **Sestra/koordinátor skríningu v ambulancii praktického lekára alebo pneumológa** – dostane zoznam ľudí „pripravených na oslovenie“, jedným klikom schváli odoslanie a rieši „na kontrolu“.
2. **Praktický lekár** – **musí byť informovaný** o oslovených pacientoch a dostáva **úlohu**, keď pacient odpovie „zaujíma ma“. V reálnom programe je to práve praktik, kto pacientov vyberá a odosiela k pneumológovi. [web: prevenceproplice.cz, OECD]
3. **Pneumológ** – pri zaujatých pacientoch robí vyšetrenie a posiela na nízkodávkové CT (LDCT = CT s nízkou dávkou žiarenia).

**Sekundárni:** **pacient** (55–74 rokov, fajčiar alebo bývalý fajčiar; často bez smartfónu, s emóciami ako hanba alebo strach), **rádiologické pracovisko** (dostane kvalitnejšie nasmerovaných ľudí), **VZP a Národné skríningové centrum** (dostanú merateľný lievik).

### 2.2 Jeho deň (modelový scenár, nie meraný fakt)
- **Dr. Nováková, praktička** s ordináciou plnou ľudí: starostlivosť o stovky až tisíce registrovaných pacientov (typicky okolo 1 500–2 000 [?] – z pamäti, neoverené), 7–10 minút na pacienta, papierovanie od rána. Program skríningu jej hovorí: „vyberte si z vašich pacientov tých, čo fajčia ≥ 20 balíčkorokov a sú vo veku 55–74“. **Na to nemá ani čas, ani nástroj** – vo svojom softvéri vie filtrovať vek, ale fajčenie je v anamnéze voľným textom („fajčil krabičku denne“, „fajčí asi 30 cigariet“), niekde chýba, niekde si dva záznamy odporujú.
- **Sestra v pneumologickej ambulancii alebo na rádiológii:** vidí pacientov z iných dôvodov, ale **nevie**, že niektorý z nich je pre skríning vhodný – a nevie ani, či v inej nemocnici nemal nedávno CT hrudníka (príznak `is_external`).
- **Pacient, pán 63-ročný:** fajčil 30 rokov, bol pred pár rokmi „na rtg“, **nikto ho nikdy neoslovil**. Keby dostal jednoduchý, nehodnotiaci list od svojej ambulancie („máte právo na bezplatné vyšetrenie, ak chcete, obráťte sa na praktika“), s dvojtretinovou šancou by mohol súhlasiť (viď §3: 67 % súhlasilo pri oslovení).

### 2.3 Prečo dnešný stav zlyháva (5 dôvodov)
1. **Výber robí človek ručne** a nemá na to čas. OECD uvádza, že praktici vyberajú účastníkov zo svojich pacientov a že pilot má zatiaľ „malý vplyv na celkový záchyt“. [web: OECD 2025]
2. **Potrebné údaje sú rozhádzané a špinavé:** fajčenie vo voľnom texte, chýbajúce počty cigariet, rozporné záznamy, CT v inom systéme alebo v inej nemocnici. Aj organizátori to v dátach nasimulovali: **60 zo 300 záznamov (20 %) o fajčení sa nedá použiť bez kontroly**. [dáta]
3. **Niet uzavretého cyklu:** nikto nesleduje, kto bol oslovený, čítal správu, reagoval, išiel k praktikovi a dostal CT. OECD výslovne pomenúva **slabé zapojenie praktikov a slabú účasť pacientov po odoslaní** a chýbajúcu osvetu. [web]
4. **Rovnaká správa pre všetkých, bez kontextu** (kanál, preferencie, súhlas) – a pri citlivej téme (fajčenie, stigma) to znižuje ochotu. [odhad, v súlade s Wikipedia/stigma]
5. **Strach z chýb:** keď je kritérium „CT za mesiac“ posudzované ručne, hrozí duplicitné CT (zbytočná dávka žiarenia, zbytočné náklady) alebo naopak vynechanie človeka. [odhad]

---

## 3. Dôkazy o probléme (čísla a zdroje)

### 3.1 Veľkosť a ťažoba choroby
| Údaj | Hodnota | Zdroj |
|---|---|---|
| Česko: nové prípady rakoviny pľúc ročne (priemer 2020–2024) | **~6 600** | [prevenceproplice.cz](https://www.prevenceproplice.cz) |
| Česko: úmrtia ročne | **viac ako 5 000** | [prevenceproplice.cz](https://www.prevenceproplice.cz) |
| Podiel pacientov s pokročilým ochorením pri zistení | **67 %** | [prevenceproplice.cz](https://www.prevenceproplice.cz) |
| 5-ročné prežitie, diagnóza 2015–19 | **17 %** (zlepšenie o ~6 p. b.) | [OECD Country Cancer Profile ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Prežitie podľa štádia | **štádium 1: 62 %, štádium 4: 6 %** | tamže |
| Denní fajčiari v ČR | **16 %** ľudí 15+ (2022), priemerne 12 cigariet/deň | tamže |
| Cieľová populácia programu (55–74, ≥ 20 balíčkorokov) | **odhadom 250–500 tisíc** ľudí | [prevenceproplice.cz/pro-lekare](https://www.prevenceproplice.cz/cs/pro-lekare/) |

### 3.2 Skríning funguje (zahraničné štúdie)
- **NLST** (USA, 53 454 ľudí): CT s nízkou dávkou vs. röntgen hrudníka = **o 20,0 % menej úmrtí na rakovinu pľúc** (95 % interval 6,8–26,7) a o 6,7 % menej úmrtí z akejkoľvek príčiny. [NEJM 2011, PMC4356534](https://pmc.ncbi.nlm.nih.gov/articles/PMC4356534/)
- **NELSON** (Holandsko/Belgicko, 13 195 mužov): po 10 rokoch pomer rizika úmrtia na rakovinu pľúc **0,76** (interval 0,61–0,94), teda ~24 % menej; u 2 594 žien 0,67, ale interval (0,38–1,14) zahŕňa 1, nie je preukázané. [NEJM 2020, abstrakt cez Europe PMC](https://europepmc.org/article/MED/31995683)
- **Cena:** v NLST stálo CT skríning **+1 631 USD na človeka** a vyšlo **81 000 USD za získaný rok života upravený o kvalitu (QALY)** – teda **je to nákladovo efektívne, ale nešetrí to peniaze platiteľa**. [Black et al., NEJM 2014](https://europepmc.org/article/MED/25372087)
- **Európa:** SAM EÚ odporučila skríning pre súčasných a bývalých fajčiarov (2022); Česko je podľa NSC v projekte SOLACE a jednou z mála krajín s celoštátnym programom (so Chorvátskom a Poľskom). [Wikipedia – Lung cancer screening](https://en.wikipedia.org/wiki/Lung_cancer_screening), [reakcia NSC](https://www.zdravotnickydenik.cz/app/uploads/2026/02/reakce-nsc-a-odbornych-spolecnosti.pdf)

### 3.3 Český program a kde „tečie“
- **Pilot od 1. 1. 2022** (päť rokov). Vek 55–74, **≥ 20 cigariet denne ≥ 20 rokov (≥ 20 balíčkorokov)**, aktívny alebo bývalý fajčiar. Cesta: **praktik** (alebo pneumológ) pacienta vyberie → **pneumológ** vyšetrí → **akreditované rádiologické pracovisko** urobí LDCT → podľa výsledku ďalší postup. **Zadarmo**, hradené z verejného poistenia. [prevenceproplice.cz](https://www.prevenceproplice.cz/cs/program/kde/), [VZP 28. 7. 2026](https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic)
- **Čísla VZP (do konca Q1 2026):** oslovených **43 735** klientov (praktici a pneumológovia), súhlasilo **29 278** (**67 %**, náš prepočet), **631 rizikových nálezov** (2,2 % z tých, čo súhlasili – náš prepočet), len minulý rok **14 tisíc** (v prvom roku asi 4 tisíc). Podľa kraja: Praha 6 678, Stredočeský 3 991, Ústecký 3 930. [VZP 28. 7. 2026]
- **NSC (Národné skríningové centrum) a odborné spoločnosti:** pozitívne uzlíky u **3,2 %**, **polovica zachytených nádorov v 1. štádiu**; „osloveno cez 40 000“. (Je to obhajoba programu po kritickom článku „Každé páté CT plic je omyl“ z 12. 2. 2026, berme ako stranu programu.) [reakcia NSC](https://www.zdravotnickydenik.cz/app/uploads/2026/02/reakce-nsc-a-odbornych-spolecnosti.pdf)
- **OECD (stav polovica 2024):** účasť je nižšia, ako sa čakalo, ale podiel včasných štádií je vyšší ako v bežnej populácii; na rozšírenie treba riešiť **nízke aktívne zapojenie praktikov, nízku účasť pacientov po odoslaní od praktika a informačnú kampaň**. [OECD 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf)
- **Čo z toho plynie (náš prepočet a úsudok):** keď sa pacient osloví, **dvaja z troch súhlasia** (pozor: oslovujú ho motivovaní praktici, takže je to zrejme nadhodnotené). Na 250–500 tisíc oprávnených v krajine pripadá za 4 roky ~44 tisíc oslovených klientov VZP; presný podiel nevieme (rozdielne definície, VZP nie je celá krajina), **rádovo ide o jednotky až nízke desiatky percent [?]**. Úzke hrdlo je **vyhľadanie a oslovenie**, nie ochota.

### 3.4 Čo je „dnes“ a prečo je to teraz
- Pilot má byť päťročný (2022–2026/27), takže sa blíži rozhodnutie o ďalšom osude; ministerstvo plánuje pľúcny skríning ako ďalší celoštátny program [?] (z predchádzajúceho prieskumu, `09`, bez priameho zdroja). [OECD, 09]
- VZP uvádza od 21. 9. 2026 **Portál inovácií** s tematickou výzvou pre digitálne technológie v onkológii od 1. 11. 2026 (až 300 mil. Kč na 2027, ale stále s filtrom „približne 5 % pozitívny dopad na rozpočet“ – viď platba). [VZP 21. 9. 2026](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju)

### 3.5 Čo sa nedá doložiť (poctivosť)
- **Žiadny dôkaz, že lepšie správy (alebo AI správy) zvýšia skutočnú účasť na CT** (07 uvádza iba RCT o očkovaní HPV: krátkodobý záujem áno, očkovanie nie). Treba to povedať ako hypotézu a navrhnúť meranie v pilote.
- **Presný podiel oprávnených, ktorí boli oslovení**, nepoznáme. **Čas ušetrený praktikom** nemáme z verejného zdroja [?].
- **Podiel chýbajúcich údajov o fajčení v reálnych ambulantných záznamoch** som nenašiel [?] (v datasete je 20 %, ale je to simulácia).

---

## 4. Existujúce riešenia na trhu (čo robia, cena, medzery)

_Pozn.: web search sa mi vyčerpal, tu som overil iba priame stránky firiem; ceny nie sú verejné nikde [?]._

| Riešenie | Kto | Čo robí | Cena | Čo robí zle / medzera |
|---|---|---|---|---|
| **Ručný výber praktikom + web Prevence pro plíce** | Česko, program NSC/odborné spoločnosti | Praktik z vlastných pacientov vyberie vhodných, odošle k pneumológovi; web má mapu pracovísk a algoritmus | Zadarmo (hradí poisťovňa), čas lekára | Ručné, bez nástroja na vyhľadanie a sledovanie; OECD: slabé zapojenie praktikov [web] |
| **NHS England – Lung Health Check / skríning** | Anglicko | Pozýva fajčiarov (aj bývalých) 55–74 rokov podľa záznamov u praktika; následne „zdravotná kontrola“ a ponuka CT; ak praktik nepozná stav fajčenia, pacient má požiadať o aktualizáciu záznamu | Štátne | Stránka potvrdzuje, že **identifikácia stojí na kvalite záznamu u praktika**; metóda vyhľadávania nie je popísaná [web: nhs.uk, stránka kontrolovaná 27. 3. 2023] |
| **Qure.ai (qTrack, qXR, nodulové riešenia)** | India/USA; partner AZ | qTrack = platforma pre skríningové programy a manažment prípadov (dashboardy, koordinácia); AI pre RTG/CT. AZ+Qure.ai: plán „5 miliónov preskúmaných pacientov do 2025“ (v rámci EDISON Alliance) | Nezverejnené [?] | Stránka nepopisuje výber oprávnených ani oslovenie; ide hlavne o obraz a program po vyšetrení [web: qure.ai] |
| **Optellum (Virtual Nodule Clinic, Patient Discovery AI)** | UK/USA | Rieši pacientov s **pľúcnym uzlíkom** (identifikácia a priorita), AI riziko malignity; má FDA a CE/UKCA | Nezverejnené [?] | Začína **po** nájdení uzlíka, nie pred CT; nie oslovenie fajčiarov [web: optellum.com] |
| **Carebot** | Česko | AI druhé čítanie mamografie a RTG hrudníka, „stovky zariadení“, kolo >1,5 mil. € (júl 2026) | Úhrada nepotvrdená | Obraz, nie výber a oslovenie ľudí [08, Lupa] |
| **Všeobecné nástroje na prijímanie pacientov/outreach (napr. Phreesia)** | USA | Predvyšetrovacie dotazníky, pripomienky | Nezverejnené | Stránka nespomína pľúcny skríning ani výber oprávnených [web: phreesia.com] |
| **Česká nemocničná IS (napr. Asseco MedWorks)** | Česko | Základný nemocničný systém | – | Modul na vyhľadávanie oprávnených na pľúcny skríning som nenašiel [?] |

**Kto už platí:** za samotné vyšetrenie (LDCT) platí poisťovňa. **Za nástroj na identifikáciu a oslovenie som žiadneho českého platiteľa nenašiel [?]**; medzinárodne platia nemocnice a programy (UK, USA) – v tabuľke nie sú čísla.

**Kde je priestor urobiť to lepšie:**
1. **Pred CT, nie po ňom:** existujúce AI nástroje riešia obraz a uzlíky; **výber a oslovenie ľudí** je slabo pokryté.
2. **Pravidlá českého programu** (vek, ≥ 20 balíčkorokov, doklady, kanály) a **po česky**: žiadny produkt, ktorý by som našiel, to nemá hotové [?].
3. **Špinavé údaje:** nástroj, ktorý poctivo povie „toto neviem, skontrolujte“ (`NEEDS_REVIEW`) a vysvetlí prečo.
4. **Uzavretý cyklus:** oslovenie → doručenie → reakcia → úloha praktikovi → CT – vo forme jednoduchého lievika, aký VZP a NSC v dátach nevidia.
5. **Jednoduchšie a lacnejšie:** čítačka jednej dávky CSV/FHIR a jedna obrazovka, bez dlhej implementácie.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Princíp: „AI číta a píše, pravidlá rozhodujú, človek schvaľuje“
Rozhodnutie o tom, **kto je vhodný**, robia **jasné, vypísané pravidlá** (dá sa dokázať, prečo; netreba veriť „čiernej skrinke“). **AI** (jazykový model, LLM) použijeme tam, kde má skutočný zmysel:
1. **Čítačka neštruktúrovaného textu:** z poškodených voľných poznámok o fajčení a z textu žiadaniek/nálezov CT vyťahuje fakty („fajčil krabičku denne 1989–2020“, „CT hrudníka v inej nemocnici pred 10 dňami“) s citáciou zdroja a istotou. Použije sa len keď štruktúrované pole chýba alebo si odporuje; vždy je označené „AI navrhla – overiť“.
2. **Pisateľ správ:** vytvorí neutrálnu, jednoduchú češtinu pre každý kanál (portál: krátka; list: väčšie písmo; úloha pre praktika: stručné zhrnutie). **Bezpečnostná kontrola** (pevný zoznam zakázaných formulácií, napr. diagnóza, „ste zaradený“, „máte rakovinu“) zaručí, že správa spĺňa pokyn README.
3. **Vysvetľovač:** pri každom pacientovi jedna veta „Prečo“ (sada krokov so zdrojmi: vek ✓, fajčenie ✓, 31 balíčkorokov ✓ ak prepočítané z 20 cigariet × 26 rokov, posledné CT hrudníka pred 14 mesiacmi ✓).

### 5.2 Produkt „DechRadar“ (pracovný názov): 4 obrazovky
1. **Dnešný prehľad** – veľké čísla a lievik: _300 skontrolovaných → X vhodných → Y oslovených → Z prečítalo → W zaujíma → V u praktika._ Kruhový graf stavov (`ELIGIBLE`, `NEEDS_REVIEW`, `EXCLUDED_*`).
2. **Kartička pacienta** – semafor, „Prečo?“ so zdrojmi, navrhnutý kanál s dôvodom („má aktívny portál a súhlas“, „preferuje list“, „bez súhlasu: úloha pre praktika“), náhľad správy, tlačidlá **Schváliť / Upraviť / Preskočiť**. Označenie „už oslovený pred 6 týždňami, bez odpovede“ a „už nezaujíma → neoslovovať“.
3. **Na kontrolu (`NEEDS_REVIEW`)** – čo chýba a čo AI navrhuje („chýba počet cigariet – opýtať sa pacienta; návrh 3 otázok“), s jedným klikom na schválenie opravy.
4. **Pravidlá** – posuvníky a prepínače (vek 55–74; **balíčkoroky: program ≥ 20 / „slajd: ignorovať“**; okno CT 30 dní; čakacia lehota pred opakovaným oslovením). Vedľa stojí **„čo sa zmení“** (živé počty). Toto je nenásilný spôsob, ako upozorniť mentora na rozpor v zadaní.

**Sledovanie a výstupy:** doručenie a reakcia (zo súboru 4: _interested → automaticky úloha pre praktika; not_interested → potlačiť; failed → iný kanál; no_response po 14 dňoch → pripomienka_); **zoznam oslovených pre praktika** (README: „uvedomiť praktika“); export **FHIR** (`Task` = úloha pre praktika, `Communication` = odoslaná správa, `Consent` = súhlas) pre cenu InterSystems; **auditný záznam** (kto čo schválil).

### 5.3 Demo za jednu noc (realistické)
- **Čo postaviť (poradie):** (1) odolný načítač 5 súborov (zabalené riadky, chýbajúce stĺpce, poškodená diakritika), (2) pravidlový stroj s 6 stavmi + `already_contacted`/`needs_followup` ako odvodené podstavy, (3) prehľadová obrazovka a kartička, (4) generátor správ + bezpečnostná kontrola, (5) simulácia sledovania (tlačidlo „simulovať odpovede“), (6) FHIR export, (7) voliteľne čítačka textu.
- **Odhad náročnosti pre Claude Code:** jadro (1–5) približne 6–8 hodín práce agenta; FHIR + čítačka textu 2–3 hodiny; video a titulný obrázok paralelne. **Technické riziko nízke**, dáta sú malé a lokálne (dá sa spustiť aj bez Azure).
- **Čo ukážeme v 3-min pitchi** (odhad času, oficiálna dĺžka nie je uvedená [?]):
  - 0:00–0:20 **Háčik:** „V Česku zomrie ročne viac ako 5 000 ľudí na rakovinu pľúc. Keď ju chytíme v 1. štádiu, prežije 62 %, v 4. len 6 %. Bezplatný program existuje. Za 4 roky doň vstúpilo asi 29 000 klientov VZP. Prečo nie viac? Lebo ľudí musí vyberať praktik z hlavy.“
  - 0:20–0:40 **Používateľ:** sestra/praktička, ktorá nemá čas; voľný text, chýbajúce údaje.
  - 0:40–2:05 **Demo (video 60–80 s):** načítanie 300 pacientov, lievik za 2 sekundy; kartička; „Prečo“; vyplnenie chýbajúceho údaja; správa v češtine; schválenie; simulované odpovede; úloha pre praktika; prepínač „balíčkoroky“ a počty pred/po (60 ľudí by sa oslovilo zbytočne).
  - 2:05–2:35 **Dôvera:** rozhoduje pravidlo, AI iba číta a píše, človek schvaľuje; správa nehovorí diagnózu; syntetické dáta; nič nejde k AZ.
  - 2:35–3:00 **Pokračovanie:** pilot v jednej pneumologickej ambulancii + 3 ordináciách s AZ a ČPFS; merať: podiel oslovených z oprávnených, čas do kontaktu, podiel „zaujíma“ → LDCT; FHIR napojenie.
- **Video (Bruno):** 60–90 s, fiktívny „pán Josef“ (jasne označený ako vymyslený) v dvoch časových líniách (dnes vs. s nástrojom), potom záznam obrazovky; hudba a titulky, bez dramatizácie diagnózy. Titulný obrázok 16:9: lievik + pľúca ako línia.

### 5.4 „Šialený“ ambiciózny variant: „DechRadar Autopilot“
Rozšírenie o tri veci, ak zostane čas:
1. **Hlasový asistent po česky** (AI hlas), ktorý **zavolá ľuďom bez portálu** (kategória „list/žiadny kanál“), v 40 sekundách vysvetlí program, položí 3 otázky (počet cigariet, príznaky; pri varovných signáloch ako vykašliavanie krvi odporučí **ihneď zavolať praktika alebo 155**), a navrhne termín u praktika. V demo ukážeme **zavolanie na telefón na pódiu** alebo nahrávku. Plne **so súhlasom** a na synteticky zadané číslo (inak je to regulačne citlivé).
2. **„Nudge“ v reálnom čase cez FHIR** (správa „pacient práve prišiel“): keď sa v nemocnici objaví oprávnený pacient z iného dôvodu, personálu naskočí jedna riadka „ponúknite skríning“. Využíva InterSystems FHIR, takže ide aj o cenu 1 500 €.
3. **Národný „radar“ pre VZP a NSC:** anonymná mapa oslovenia po krajoch a lievik (použitím verejných čísel + simulovaných scenárov „čo ak oslovíme o 10 % viac“; s jasne uvedenými predpokladmi NLST/NELSON, **nie** ako predpoveď).
**Kompromis:** vyššie „wow“, vyššie regulačné a technické riziko (hlas, súhlas, živé demo); odporúčam variant pripraviť ako **nahrané video** a v pitchi ho použiť ako „víziu“, nie ako jadro.

### 5.5 Čím sa odlíšime od konkurencie na výzve
Väčšina tímov postaví **tabuľku s filtrom a šablónu správy**. My ponúkneme: (1) **poctivé zaobchádzanie so špinavými dátami** (3 pasce z §1.3), (2) **balíčkoroky prepínač a zobrazenie dopadu**, (3) **uzavretý cyklus a lievik**, (4) **FHIR výstup**, (5) **príbeh a video**. To sú presne tri hodnotené veci v sobotu: AI a prevedenie, využiteľnosť v praxi, inovatívnosť.

---

## 6. Konkurencia na hackathone a oprávnenosť

**Môže ju pražský tím zvoliť? Áno.** Je to **pražská výzva** (zo 12 pražských vo formulári: 3 VZP + 9 pražských). Brnianske/ostravské výzvy pre pražský tím vo formulári nie sú (viď §2.6 v `05`), ale tu to nie je potrebné. Výber do **dnes 19:00**, kapitán na `submit.rakathon.cz/vyzvy/vybrat`, iba jedna výzva. [05, web]

**Stav k ~16:30 (živá tabuľa, 23 pražských tímov má výzvu, 5 ešte nevybralo):** [web: submit.rakathon.cz/vyzvy]
- **Prihlásený 1 tím: MSFZ.** Tím **FSMZ** (rovnaký stôl a kapitán) ešte nevybral – pravdepodobne duplicita [?].
- **Neprihlásené tímy, ktoré môžu prísť** (podľa toho, kto vstúpil do kanála): **quattro formaggi** (2 členovia v kanáli, tím ešte nie je na tabuli výziev), **walking legs** (1 člen, výzvu nevybrali), plus **traja jednotlivci** bez uvedeného tímu v kanáli. Členovia tímov **VI KA** (už na Hlídači NÚ) a **Čímžtopádem Vyléčeno** (už na mamografe) do kanála vstúpili len „na pozretie“, vo výzve nie sú. Členovia z Ostravy v kanáli nehrajú rolu (výzva je pražská). [Slack]
- **Odhad konečného počtu tímov na výzve: 2–3** (najpravdepodobnejšie MSFZ + 1–2 ďalšie, najviac 4) [odhad].
- **Sila súperov:** nepoznám ich schopnosti. Jednoduché zadanie priťahuje viac tímov a „hotové“ riešenia budú podobné; to nás núti odlíšiť sa (§5.5).
- **Šanca vyhrať výzvu pri 2–3 tímoch:** zhruba 35–55 % [odhad], pri dobrom výsledku (dáta, odlíšenie, video) viac. **Šanca vo finále** už závisí od 20+ ďalších víťazov (lekársky zaujímavých výziev ako MDT Copilot alebo VZP výzvy).
- **Dôležité:** víťaza v sobotu určuje **AZ s mentorkou**, nie anonymná porota. Pre nich je dôležité: **verné kritériá programu, správne zaobchádzanie s dátami, zrozumiteľná neutrálna správa, prenositeľnosť do praxe**. AZ nie je v nedeľnej porote, takže vo finále musíme presvedčiť VZP/ministerstvo/nemocnice (silný argument: národný program, OECD, čísla VZP). [05, 09]

---

## 7. Skóre (1–10, prísne a kalibrované: 5 = priemer medzi výzvami, 9–10 výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| **velkost** – veľkosť problému | 1,0 | **7** | ~6 600 nových prípadov a >5 000 úmrtí ročne, cieľová populácia 250–500 tisíc; menšia než plošné skríningy (mamograf >1,3 mil. záznamov), ale najsmrteľnejšia diagnóza. |
| **zdravie** – dopad na zdravie | 1,5 | **8** | Skríning znižuje úmrtia o 20–24 % (NLST, NELSON); prežitie 62 % v 1. vs. 6 % v 4. štádiu. Účinok nášho nástroja je nepriamy (cez oslovenie a účasť), preto nie 9. |
| **cas** – úspora času | 1,0 | **6** | Ušetrí hodiny ručného výberu a kontroly CT; pridá prácu pri `NEEDS_REVIEW` a odpovediach. |
| **peniaze** – úspora/zisk | 1,2 | **5** | LDCT pridáva náklady (+1 631 USD/osoba v NLST), je nákladovo efektívne, ale nešetrí platiteľa; nepriamy zisk pre nemocnicu (objem CT) a AZ (viac včasných pacientov). |
| **bottleneck** – akútnosť | 1,5 | **7** | OECD pomenúva presne tento problém (zapojenie praktikov, účasť po odoslaní); pilot sa blíži rozhodnutiu; AZ aj odborná spoločnosť chcú posun. Nie je to však aktuálne obstarávaná potreba ako u koordinátorov. |
| **platba** – ochota platiť | 1,2 | **5** | Platiteľa LDCT poznáme (VZP), ale **za nástroj** nie: portál inovácií VZP filtruje na ~5 % pozitívny dopad na rozpočet, čo skríning nespĺňa; AZ ako sponzor pilotu je reálny, no s obmedzeniami farmafirmy. |
| **jednoduchost** – jednoduchosť pre užívateľa | 1,0 | **8** | Jedna obrazovka „schváliť/upraviť“; sestra nepotrebuje školenie; pacient dostane jednu krátku správu. Integrácia do softvéru ordinácií je dlhšia cesta. |
| **data** – dostupnosť a kvalita dát | 1,0 | **8** | 300 pacientov, slovník, README, hotové už teraz. Malé, šablónovité, s rozpormi (balíčkoroky, formát súborov); chýba presný prah. |
| **realizovatelnost** – demo za noc | 1,0 | **9** | Pravidlá + dashboard + generovanie správ; žiadna závislosť od Azure; výrazne menšie technické riziko než MDT Copilot alebo trial matching. |
| **wow** – príbeh a pitch | 1,2 | **6** | Silný príbeh a čísla, ale „filter + správa“ sám nie je ohromujúci; potenciál vyššieho wow cez video, lievik, prepínač balíčkorokov a hlasový variant (7–8). |
| **partner** – hodnota zadávateľa/networku | 1,2 | **6** | AZ: veľká farmafirma s motívom a priamou ponukou podpory, mentorka vedie pľúcnu odbornú spoločnosť; AZ však nesedí v nedeľnej porote a nenakupuje nemocničné IT. |
| **konkurencia** – šanca na finále | 1,0 | **8** | Dnes 1 tím (+1–3 možní); v sobotu rozhoduje zadávateľ; riziko prílivu tímov do 19:00. |
| **pokracovanie** – po hackathone | 0,8 | **7** | AZ sľubuje „maximálnu podporu na každom kroku“; jasný pilot (1 ambulancia + 3 ordinácie) a odborné napojenie; prekážky: GDPR, napojenie na softvér ordinácií. |
| **fit** – fit s tímom | 0,8 | **7** | Maťo: CT/LDCT, radiačná ochrana a kontrola dozoru; Bruno: tón správy, príbeh, video. Kódovanie robí Claude, takže „fit“ je skôr v pitchi a v dôveryhodnosti. |
| **riziko** – regulačné/klinické (vyššie = bezpečnejšie) | 0,6 | **7** | Nestanovuje diagnózu, rozhodujú pravidlá a človek; syntetické dáta. Zostáva GDPR (zdravotné údaje, fajčenie), MDR (hraničné, asi mimo, ak ide o administratívny výber [?]), vzťah s farmafirmou, citlivá téma (kritika programu). |

**Vážený priemer** (súčet váh 16,0): **110,3 / 16,0 = 6,9 / 10.**

---

## 8. Riziká a čo ešte overiť pred 19:00

1. **Rozpor v pravidlách (balíčkoroky, CT vs. LDCT):** spýtať sa Luboša Matysa na Slacku (len návrh; my sme nič neposlali). Medzitým implementovať prepínač.
2. **Príliv tímov** do 19:00 (5 pražských tímov ešte nevybralo, 7 z organizátorského zoznamu nie je na tabuli). Pozrieť tabuľu `submit.rakathon.cz/vyzvy` tesne pred rozhodnutím.
3. **Slabé „AI“ a „wow“:** bez čítačky textu, hlasu a videa zostane riešenie podobné ostatným. Zapracovať aspoň čítačku textu + lievik + video.
4. **Súkromie a právo [?]:** zdravotné údaje (fajčenie) a automatické správy pacientom; potrebný právny základ (zdravotná starostlivosť/verejný záujem), ochrana osobných údajov (poverenec), súhlas s portálom. AZ **nesmie dostať osobné údaje**; farmafirma nesmie propagovať svoje lieky – nástroj aj správy musia byť **nebrandované a edukačné** (presné kódexy som nekontroloval).
5. **Dôvera v program:** kritický článok „Každé páté CT plic je omyl“ (12. 2. 2026) a odpoveď NSC ukazujú, že téma je citlivá; správy treba písať **neutrálne**, bez prehnaných sľubov.
6. **Hodnota správ nie je dokázaná** (3.5): v pitchi nehovoriť „zvýšime účasť o X %“, ale „meriame to v pilote“.
7. **Platiteľ** (platba 5): v pitchi neposkytnúť nepravdu o VZP portáli; rozumne uviesť AZ a ČPFS ako partnerov pilotu a hľadať financovanie (nie sľubovať).
8. **Čo som nevidel:** súbory `1_patients.csv` a `3_chest_ct_examinations.csv` (server neodpovedal). Pred voľbou by bolo dobré rýchlo si ich pozrieť (vek, CT) – rozhodnutie to nezmení, len spresní demo.

---

## 9. Zdroje (URL)

**Slack/Drive (čítané):** kanál `#plice-vcas-chytra-cesta-k-prevenci` (rakathon2026), README.pdf (`docs/materials/slack/refresh-1600/plice-vcas_README.pdf`), Drive deck „Astra Plíce“ https://drive.google.com/file/d/16yUnx85Hu-Kwpt7sUdV-VW36IKepQlAy/view, `5_data_dictionary.csv`, `2_smoking_history.csv`, `4_patients_contact_history.csv` (Slack ID F0C9N9XKWTX, F0C9C7H2A3Z, F0C9X9J6B6G). Tabuľa tímov: https://submit.rakathon.cz/vyzvy.

**Web:**
- Program Prevence pro plíce: https://www.prevenceproplice.cz , https://www.prevenceproplice.cz/cs/program/pro-koho/ , https://www.prevenceproplice.cz/cs/program/kde/ , https://www.prevenceproplice.cz/cs/pro-lekare/
- VZP, 28. 7. 2026: https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic
- VZP, Portál inovácií, 21. 9. 2026: https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju
- OECD/EK Country Cancer Profile Czechia 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- Reakcia NSC a odborných spoločností (február 2026): https://www.zdravotnickydenik.cz/app/uploads/2026/02/reakce-nsc-a-odbornych-spolecnosti.pdf
- NLST (NEJM 2011): https://pmc.ncbi.nlm.nih.gov/articles/PMC4356534/
- NELSON (NEJM 2020), abstrakt: https://europepmc.org/article/MED/31995683
- NLST nákladová efektívnosť (NEJM 2014): https://europepmc.org/article/MED/25372087
- NHS England: https://www.nhs.uk/tests-and-treatments/lung-cancer-screening/
- Wikipedia (prehľad programov): https://en.wikipedia.org/wiki/Lung_cancer_screening
- Lung Ambition Alliance (AZ, Guardant Health, GLCC): https://www.lungambitionalliance.com/
- Qure.ai: https://www.qure.ai/ ; Optellum: https://www.optellum.com/ ; Phreesia: https://www.phreesia.com/ ; AstraZeneca ČR: https://www.astrazeneca.cz/ (nezmieňuje pľúcny skríning)

**Vnútorné súbory repa:** `docs/research/04, 05, 06, 07, 08, 09`, `docs/materials/slack/INDEX.md`.
