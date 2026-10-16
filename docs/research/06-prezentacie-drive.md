# 06 – Prezentácie zadávateľov (Google Drive + Slack): čo chcú, čo zdôrazňujú

_Stav: piatok 16. 10. 2026 ~16:00. Čítané iba na čítanie (Drive konektor + Slack). Nič sa nikam neposielalo._
_Značky: **[?]** = neisté / neoverené. Text v zátvorke vysvetľuje odborný pojem._

**Skratky, ktoré sa opakujú:** KOC = komplexné onkologické centrum (veľké špecializované centrum); ROC = regionálne centrum; MDT = multidisciplinárny tím (porada lekárov rôznych odborov, ktorá rozhoduje o liečbe jedného pacienta); NIS = nemocničný informačný systém; PACS = archív snímok (CT, MR…); FHIR = medzinárodný formát na výmenu zdravotných dát; RAG = AI najprv vyhľadá pasáže vo vlastných dokumentoch a odpovedá iba z nich; PROMs = údaje, ktoré o sebe hlási pacient (dotazník).

---

## 0. Ako som to získal a čo sa nepodarilo

- **Hlavný odkaz organizátorov** (Slack #01-oznameni, #02-dotazy, #05-info-ostrava, 16. 10. 13:43): všetky prezentácie zo všetkých miest sú v jednom Drive priečinku: https://drive.google.com/drive/folders/1tM6p2V4plY4FXScZTXNmPDNgg0PDoJkr (podpriečinky **Praha** 14 súborov, **Brno** 6, **Ostrava** 10). Priečinok je verejne čitateľný.
- Prečítané cez Drive konektor (textový prepis slidov): všetky súbory v Prahe okrem jedného, všetky v Brne a Ostrave okrem videa. Zoznam s odkazmi: `docs/materials/drive/LINKS.md`.
- **Nepodarilo sa prečítať:**
  - `VFN – SMART ONKO AA.pptx` (66 MB, slidy sú zrejme len obrázky, text sa nevytiahol) – odkaz nižšie, obsah **[?]**.
  - Slidy A. Tichopáda (Slack, 11 MB, nad limitom 10 MB nástroja) – obsah poznáme z prepisu prednášky, pozri 02-prehack-prednasky.md.
  - `videoklip_FNO_2026.mp4` (video FN Ostrava) – nepozeral som.
  - Duplikáty VZP prezentácií v priečinku Ostrava (rovnaké názvy ako v Prahe) – nečítal som znova, **[?]** identické.
- **Nesťahoval som originály súborov** z Drive (sťahovanie vyžaduje výslovný súhlas používateľa). Do repa som uložil len malé podklady zo Slacku (pozri sekciu 6) a textový výťah z INTRO prezentácie.

---

## 1. NAJDÔLEŽITEJŠIE NOVÉ ZISTENIE: „INTRO (Praha)“ – pravidlá, kritériá, termíny

Zdroj: Slack #03-info-praha, T. Studeník, 16. 10. 14:25, súbor „Copy of Rakathon 2026 – INTRO (Praha).pdf“ (7 MB, 85 strán, Slack file ID F0C9CH0RUEB). Textový výťah: `docs/materials/drive/INTRO_Praha_text.md`. **Toto doteraz chýbalo v súbore 04** (tam bolo „kritériá nezverejnené“).

**Termíny**
- **Piatok 16. 10. 19:00** – kapitán potvrdí jednu výzvu (https://submit.rakathon.cz/vyzvy/vybrat). Zmeniť sa dá do uzávierky (správa P. Vaňáska v #03-info-praha, 15:36).
- **Sobota 17. 10. 13:00** – odovzdanie projektu; po 13:00 formulár nič neprijme.
- **Sobota 14:00** – hodnotenie: **zadávatelia výziev obchádzajú svoje tímy**; 16:00 nahlásia víťazov; 17:00–18:00 vyhlásenie víťazov výziev. **Víťaz každej výzvy postupuje do nedeľného finále v Prahe.**
- **Nedeľa 18. 10.** – finále, Kampus Plzeňská, 2. LF UK (budova A), Praha 5 – Motol. Registrácia 13:00, pitche (osobne pred porotou) 14:00–16:30, vyhlásenie 17:00–18:00. Prenos online na rakathon.cz. Dĺžka jedného pitchu v INTRO **nie je uvedená [?]** (MDT Copilot zadanie hovorí 5 min).

**Hodnotiace kritériá (sobota aj nedeľa)**
1. **AI technológie a prevedenie** – ako dobre riešenie reálne funguje, čo tím počas hackathonu skutočne vytvoril, práca s AI a dátami.
2. **Využiteľnosť v praxi u zadávateľa výzvy** – zodpovedá zadaniu a potrebám užívateľa, je realisticky nasaditeľné (bezpečnosť, dáta, regulácia, integrácia).
3. **Inovatívnosť** – nový alebo neočividný prístup so skutočnou výhodou.
- **Navyše vo finále:** 4. **Škálovateľnosť** (dá sa preniesť mimo jedného nasadenia, reálna cesta k pokračovaniu), 5. **Kvalita prezentácie a tímu** (zrozumiteľné a presvedčivé, motivovaný tím pokračovať).

**Čo sa odovzdáva** (https://submit.rakathon.cz): názov, krátky popis do 140 znakov (+ dlhší nepovinný), mesto/výzva/tím/členovia (2–4), ako využívate AI, aký dopad a pre koho, či používate FHIR od InterSystems, **titulný obrázok povinný (do 8 MB, 16:9)**, odkazy GitHub / demo / video. Po odoslaní dostanete odkaz na úpravy do uzávierky. Galéria projektov: submit.rakathon.cz/projects.

**Pravidlá v skratke:** tím 2–4 ľudia na mieste; môže odovzdať iba jednu výzvu (+ InterSystems cenu); len prototyp (nie zdravotnícky prostriedok); autorstvo ostáva tímu, organizátori a partneri dostanú nevýhradnú licenciu; nezverejňovať neverejné dáta pacientov ani know-how.

**Ceny:** 100 000 / 50 000 / 25 000 Kč (odovzdanie v nedeľu). Partnerské: **VZP cena** (60 minút s generálnym riaditeľom VZP ČR, „Kreslo pre inovácie“, pre najlepší tím výziev VZP), InterSystems 1 500 EUR, NÚVR (účasť na Czech Annual Cancer Research Meeting 23.–25. 11. 2026, Olomouc), FEI VŠB-TUO (iba Ostrava), MEDDI ONCO Award (najväčší potenciál pre prax, možný workshop a proof of concept), Caelestinus „divoká karta“ (priamy vstup do 2027 Batch medzi top 25 startupov sveta), Cena hackerov (volia účastníci; masterclass PitchPerfect.cz v hodnote 30 000 Kč), Asseco CE (rozvoj prototypu s mentormi a kontaktmi).

**Čo z toho plyne (moja interpretácia, nie z podkladov):**
- Sobotu rozhoduje **zadávateľ výzvy osobne pri tíme** – demo musí byť ukázateľné na mieste a „využiteľnosť u zadávateľa“ je kritérium č. 2. Súťažíme hlavne s tímami **v tej istej výzve**, nie so všetkými ~100.
- Pri VZP výzvach nie je z INTRO jasné, či sa víťaz určuje za každé mesto zvlášť, alebo jeden celonárodný **[?]** (00-SUHRN predpokladal „z každého mesta“).
- Nie je jasné, či tím z Prahy smie voliť výzvu z Brna alebo Ostravy (formulár má pole „Mesto“) **[?]**. Otázka Jana Hlavsu (#02-dotazy 13:34), či sa po odovzdaní v sobotu smie v nedeľu ďalej upravovať, **nemá odpoveď [?]**.

---

## 2. VZP – tri spoločné výzvy (všetky mestá)

Prezentácie boli predstavené v piatok 10:45 (stream z Prahy). Dáta: anonymizované, cez Portál účastníka `aka.ms/rakathon2026` (tímový Azure účet); technický mentor VZP Jan Bartyzal.

### 2.1 Od pozvánky k mamografu
- **Súbor:** „VZP – Od pozvánky k mamografu.pptx“ (12 slidov). **Autor:** Ing. Antonín Hlavinka (VZP); mentorka Helena Damovská. **Odkaz:** https://drive.google.com/file/d/1jpN3tlCxpvTmsduJL3Ogkb1qC5b-pguf/view
- **Čo riešia:** nie „no-show“ na už objednaný termín, ale či adresne oslovená žena **absolvuje skríning v určenom období po oslovení**.
- **Čísla 2024 (slide 4, vlastné dáta VZP):** 292 176 pozvánok; celková účasť po adresnom pozvaní **18,9 %**; ženy oslovené prvýkrát (~55 tis.) **44,5 %**; ženy opakovane pozývané aj po 11. pozvaní (~59 tis.) iba **3,2 %**. Slide si kladie otázku: prečo 59 tisíc žien opakovane oslovujeme a ony to ani po 11. pozvaní neriešia.
- **Bolesť:** všetky ženy dostávajú podobnú komunikáciu, hoci ich šanca prísť je veľmi rozdielna; historické dáta nepovedia, **prečo** žena neprišla; bez experimentu sa nedá povedať, či zásah zabral.
- **4 úlohy:** KDO (predikcia rizika neúčasti) → PREČO (faktory a segmenty) → ČO (konkrétna podpora pre segment) → AKO OVERIŤ (návrh experimentu / A/B testu).
- **Hypotézy segmentov (výslovne „nie hotové“):** pravidelná preventistka v omeškaní → pripomienka + objednanie; nízky kontakt so zdravotníctvom → viac kanálov; v starostlivosti, ale bez prevencie → zapojiť praktika/gynekológa; opakovane nereagujúca → iný kanál, telefonická navigácia, pomoc s objednaním; regionálna bariéra → navigácia na dostupné pracovisko.
- **Čo chcú na konci:** skóre rizika, hlavné faktory, pár zrozumiteľných segmentov, návrh intervencií, návrh experimentu. Slide: cieľom nie je len predpovedať, kto nepríde, ale **navrhnúť, čo s tým robiť, a ako overiť, že to funguje**.
- **Dáta:** viac ako 1,3 mil. záznamov + dátový slovník. Spresnenie od mentorky (Slack #od-pozvanky-k-mamografu, 15:34): „Príloha B“ bola len pomocná príloha a omylom ostala v popise; prediktory (vstupné premenné) sú v bode 7 (B3 história skríningu, B4 preventívne správanie). Referenčný čas = dátum pozvánky.
- **Otvorené:** či dáta obsahujú informáciu o minulých pozvánkach/SMS (efekt intervencie) – otázka tímu bez odpovede **[?]**; spoločná testovacia sada pre porovnanie tímov – otázka bez odpovede **[?]**; kontaktná osoba na slide 11 nebola doplnená.
- **Dopad podľa slidu:** lepšie cielenie komunikácie, efektívnejšie využitie zdrojov, vyššia účasť, meratelný efekt.

### 2.2 Cesta pacienta bez ztráty informací
- **Súbor:** „VZP – Cesta pacienta bez ztráty informací.pptx“ (13 slidov). **Autori:** doc. Z. Bielčiková, Ing. K. Vaňková, Mgr. T. Chrástová, RNDr. M. Rybář, Mgr. M. Tůmová, MUDr. M. Klimeš Lipánová. **Odkaz:** https://drive.google.com/file/d/1kjyKaGu0UTa6F5_ew7VxNxpUz6wrwOXj/view
- **Kontext:** ministerstvo zdravotníctva zaviedlo **koordinátora** (človek v KOC, ktorý organizuje cestu pacienta), VZP jeho prácu hradí; „ďalším krokom je nástroj, ktorý mu uľahčí administratívu“. KOC majú v starostlivosti ≈ **65 % všetkých onkologických pacientov** (slide 2) – narážajú na kapacity. Koordinátori dnes suplujú chýbajúcu elektronizáciu a slabú komunikáciu KOC–ROC. Ako možnosť sa spomína aj „komunikačný uzol vo VZP“.
- **Koordinátor stráži čas do liečby** (T1 diagnostika + T2 MDT + T3 liečba). Ukážkový prípad: pán Novák – prvý príznak 5. 1., operácia 26. 1. (21 dní).
- **Kde sa strácajú informácie (3 miesta):** (1) vstup – dokumentácia príde roztrieštene a neúplne, lekári opakovane prepisujú; (2) vnútri KOC – koordinátor hľadá dokumenty namiesto koordinovania, MDT dostane podklady neskoro alebo neúplné; (3) výstup – odosielajúci lekár nevie, či bol pacient prijatý, čo chýba a ako MDT rozhodol.
- **Zadanie – 4 kroky, jedna diagnóza, jeden prípad od referovania po spätnú väzbu:** PREVZIAŤ (jedno digitálne miesto na vstup do KOC, **bez ďalšieho veľkého formulára**; nahrať správy z ambulantného softvéru) → VYŤAŽIŤ (AI z dokumentácie vytiahne kľúčové údaje do pevnej štruktúry, **označí, čo chýba**, lekár potvrdí) → KOORDINOVAŤ (fronta pacientov: nový / aktívny / odložený; detail s úlohami, termínmi a „kto je na ťahu“; sady úloh podľa diagnózy, e-mail/SMS/chat, notifikácie) → SPÄTNÁ VÄZBA (štruktúrovaný záver MDT späť referujúcemu a revíznemu lekárovi, potvrdené odovzdanie).
- **Demo musí ukázať:** referovanie bez ďalšieho formulára; AI vyťaženie s kontrolou úplnosti; prehľad prípadov so stavom a termínom; vlastníka každého kroku; štruktúrovaný záver; potvrdené odovzdanie. „Rakathon overí princíp, produkčná integrácia patrí do ďalšej fázy.“
- **Konkrétny súťažný prípad (Slack, organizátor 14:05, balík `cesta-pacienta-data.zip`)** – pozri sekciu 6.1: fiktívna pacientka s rakovinou pankreasu, 13 správ z rôznych pracovísk, aplikácia má pripraviť handover pre MDT 21. 10. 2026, označiť chýbajúce podklady, umožniť ich doplnenie a po MDT poslať záver praktikovi.
- **Čo by pomohlo:** ťahať údaje z existujúcich správ, nič nepísať nanovo; AI iba navrhne, človek potvrdí; vždy ukázať, čo chýba a kto má ďalší krok.

### 2.3 Kvalita péče na konci života
- **Súbor:** „VZP – Kvalita péče na konci života.pptx“ (11 slidov). **Autorka:** doc. MUDr. Hana Študentová, Ph.D., MHA (mentorka; online aj Mgr. Kateřina Holá, Ph.D.). **Odkaz:** https://drive.google.com/file/d/1kA6iKeDJ9EX7VanWXOtgi1LEyI9gs3bm/view
- **Otázka:** dá sa z anonymizovaných dát vytvoriť **transparentný analytický rámec**, ktorý ukáže vzorce starostlivosti (protinádorovej aj nemocničnej) v závere života a upozorní na odchýlky, ktoré treba odborne vysvetliť? **Nehodnotí sa konkrétny pacient, lekár ani pracovisko.**
- **Problém:** záver života je v dátach popísaný menej systematicky; chýba jednotný opakovateľný rámec; pacienti sa líšia (diagnóza, štádium, vek, ďalšie choroby), takže **hrubé rozdiely nie sú rozdielmi v kvalite**; niektoré klinické info v dátach nie je.
- **4 kroky:** ZMERAŤ (indikátory, kohorta; zmienený Power BI) → ZOHĽADNIŤ (case-mix = rozdiely medzi pacientmi) → POROVNAŤ (variabilita, štatistická neistota) → VYSVETLIŤ (oddeliť zistenia od hypotéz).
- **Tvrdé hranice riešenia:** kraj bydliska ≠ poskytovateľ; koniec protinádorovej liečby ≠ začiatok paliatívnej (ak údaj v dátach nie je, nedopočítavať); korelácia ≠ kvalita; populačná analýza ≠ individuálne rozhodovanie (**žiadna individuálna prognóza úmrtia, žiadne rozhodnutie o ukončení liečby**).
- **Realistický výstup za víkend:** jedna diagnóza, celý postup; report kvality dát; **5–8 indikátorov**; hrubé aj základne upravené porovnanie; prehľadný dashboard; faktory spojené s vyššou intenzitou liečby; **3 konkrétne hypotézy**; reprodukovateľný postup. Bonus: druhá diagnóza.
- **Dátový slovník** (Google Doc od K. Holá, Slack #kvalita-pece-na-konci-zivota, 14:45): sleduje sa iba pacient s úmrtím a príčinou smrti z diagnózy C (črevo C18, pankreas C25, pľúca C34, prsník C50, prostata C61, oblička C64, močový mechúr C67). Hlavný ukazovateľ: **podiel pacientov so systémovou liečbou (ATC skupina L01, bez metotrexátu, mitomycínu, epirubicínu) alebo rádioterapiou v posledných 30 / 14 dňoch života**; počíta sa z dátumov diagnózy, začiatku a dĺžky liečby a úmrtia, osobitne podľa toho, či pacient dostal ďalšiu líniu liečby. Otvorené dáta: https://onconet.cz/cs/data/otevrena-data-diagnozy/.
- **Čo by pomohlo:** srozumiteľné grafy a opatrné formulácie; vždy ukázať neistotu; ostatné ukazovatele si môžu tímy vymyslieť (mentorka v Slacku).
- **Poznámka:** je to skôr analytika pre poisťovňu/odborníkov než nástroj pre lekára pri lôžku.

---

## 3. Praha – výzvy mesta

### 3.1 FN Motol a Homolka – 3 výzvy (AI Trial Matching, PACS Comparator Check, Digitálny hlídač nežiaducich účinkov)
- **Súbor:** „Alina_FNMH_Rakathon výzvy – onkologie FNM.pdf“ (10 strán). **Autorka:** MUDr. Alina Pirshtuk, Onkologická klinika FNMH. **Odkaz:** https://drive.google.com/file/d/1VKP3UXN5p_YmiqrtI4gq-RnRUF5xZQ1O/view
- **Spoločný dataset:** anonymizované lekárske správy, textové popisy CT, laboratórne výsledky, vykázané výkony a lieky, ďalšie dáta z NIS u aktuálne liečených pacientov. **Neobsahuje snímky ani prístup do archívu snímkov (ePACS).** (Slack: kde dataset fyzicky je, nie je jasné **[?]**.)
- **AI Trial Matching:** kritériá zaradenia/vyradenia klinickej štúdie previesť do strojovej podoby, porovnať s pacientom, pri každom výsledku vysvetliť mieru zhody (nie len áno/nie) a ukázať, čo je splnené / nesplnené / chýba. Zadávateľka chce, aby ju systém upozornil, že pacient spĺňa kritériá štúdie ešte predtým, než ju to napadne. Vstupy: dataset, zoznam štúdií FNMH (~90, xlsx), clinicaltrials.gov.
- **PACS Comparator Check:** pred plánovaným CT/MR/PET alebo MDT zistiť zo správ, ktoré staršie zobrazovacie vyšetrenia sú relevantné, overiť ich dostupnosť v PACS (**kontrolu treba simulovať**, snímky nie sú), chýbajúce včas označiť. Cieľ po lekársky: zadať pacienta na MDT a nemusieť obvolávať pol republiky, aby poslali staré snímky.
- **Digitálny hlídač nežiaducich účinkov:** pravidelný krátky dotazník podľa diagnózy a liečby, rady pri zvládaní symptómov (pri akútnych ťažkostiach odkaz na ambulanciu/155), automatické upozornenie tímu pri prekročení hraníc. Podľa slidu pravidelné hlásenie symptómov znižuje počet pohotovostí a predlžuje prežitie (Basch et al., JAMA 2017) – **neoverené mimo slidu [?]**. Vstupy: dataset, súhrny o lieku z databázy SÚKL, **CTCAE v6.0** (stupnica závažnosti nežiaducich účinkov).
- **Silný signál:** zadávateľka chce byť informovaná **o závažných účinkoch, nie o každej drobnosti** (riziko „únavy z poplachov“).
- **Podpora:** mentorka na mieste aj na Slacku (04, §1.2).

### 3.2 MEDDI Onco – AI spoločník pacienta medzi kontrolami
- **Súbory:** „MEDDI – MEDDI Onco.pdf“ (zadanie) a „MEDDI_Onco_Rakathon_2026.pptx“ (úvodné slovo J. Pecinu, zakladateľa a CEO). **Odkazy:** https://drive.google.com/file/d/1UFHs13Muitry1SEXqPRqw6eFJmXJ5bvL/view , https://drive.google.com/file/d/1ozmZmwRXvcJiJs9aSg2ZT7SjA5ORQrNZ/view . Zadanie predstavil Patrik Litschmann.
- **Problém z praxe:** väčšinu liečby trávi pacient doma a kladie si tri otázky: je to normálne? mám volať lekárovi? potrebujem pomoc hneď? Informácie sú roztrieštené a tím môže zhoršenie zachytiť neskoro.
- **Zadanie:** funkčný prototyp AI, ktorý **zisťuje stav** (symptómy, intenzita, vývoj), **pozná kontext liečby** (lieky, cykly), **rozpozná riziko** v 4 úrovniach, **odporučí krok**, **upozorní tím** a **zhrnie pre lekára**.
- **4 úrovne:** zelená = ďalšie sledovanie; žltá = tím sa ozve do konca nasledujúceho pracovného dňa; oranžová = telekonzultácia, lekár do 2 hodín; červená = neodkladná pomoc (155), napr. horúčka ≥ 38 °C pri chemoterapii.
- **Mantinely:** žiadna diagnóza a zmena liečby; úrovne 2–4 vždy končia u zdravotníka; každé odporúčanie hovorí, z čoho vychádza; pri pochybnosti **vyššia úroveň, nikdy nižšia**; centrum Po–Pi 7:00–15:30, inak služobný lekár MOÚ alebo 155; ostrá prevádzka na AWS v EÚ (pre prototyp je povolený akýkoľvek model).
- **Dáta:** 14 fiktívnych pacientov, 171 záznamov domáceho sledovania, 4 dotazníky, referenčné vyhodnotenie pri 100 % záznamov; správy s preklepmi, bez diakritiky, aj po slovensky; scenáre: horúčka pri poklese bielych krviniek, imunitná kolitída, plíživé srdcové zlyhávanie, liekové interakcie a krvácanie, paliatívna pacientka (píše dcéra), správa odporujúca dotazníku.
- **Ako testujú:** na **6 skrytých pacientoch**, prehrávanie v čase (riešenie vidí len to, čo sa už stalo); sleduje sa zachytenie oranžových a červených aj zbytočné poplachy. **Podhodnotenie červenej je najvážnejšia chyba.**
- **Hodnotenie:** klinický prínos a bezpečnosť 30 %; použiteľnosť pre pacienta a tím 25 %; kvalita technológie a AI 20 %; jednoduchosť a zrozumiteľnosť UI 15 %; možnosť integrácie 10 %.
- **Tipy zadávateľa:** pracovať s trendom, nie s jednou odpoveďou; správa pacienta má prednosť pred dotazníkom; pacientovi jasný ďalší krok ľudsky a bez odborných termínov; **súhrn, ktorý lekár prečíta za 30 sekúnd**; integráciu len navrhnúť (API počas Rakathonu nebude). Bonus: jazykový model, ktorý s pacientom hovorí hlasom (CEO ocení).
- **Čísla z keynote (zdroj: produktový materiál MEDDI, bez nezávislého overenia, slide to sám uvádza):** v Masarykovom onkologickom ústave sa používa od 2020; > 15 500 pacientov v systéme (údaj od J. Pecinu, 16. 10.); odhadovaná úspora práce ≈ 137 000 Kč ročne na jednu všeobecnú sestru (ocenenie ušetreného času, nie hotovostná úspora); ~5 000 novodiagnostikovaných onko pacientov ročne v MOÚ.
- **Cena MEDDI ONCO Award** pre riešenie s najväčším potenciálom pre prax (INTRO).

### 3.3 NÚVR Research Matchmaker
- **Súbor:** „NÚVR – Research Matchmaker.pptx“ (6 slidov). **Zadávateľ:** Národný ústav pre výskum rakoviny (kontakt Aleksi Šedo). **Odkaz:** https://drive.google.com/file/d/1j1U1jmJ666aH2-3bFOBSh1bAAHKa4Ruq/view
- **Čo chcú:** AI platformu, ktorá nájde **partnerov, technológie a zdroje** v českom onkologickom výskume; pilot **30–60 tímov** NÚVR, potom celý ústav a národná úroveň.
- **3 prínosy:** partneri (granty, publikácie, validačné štúdie), kapacity (expertíza, modely, kohorty, biobanky, prístroje), medzery a duplicity.
- **Dôležité priznanie zadávateľa:** AI je riešiteľná časť, **ťažšie je spoľahlivý a udržiavaný katalóg tímov** – dáta musia mať vlastníka a pravidelnú aktualizáciu.
- **Ako to má vyzerať:** dotaz v prirodzenom jazyku (príklad: tím na nádorové mikroprostredie s modelom mozgových metastáz a priestorovou transkriptomikou pre spoločný grant) → odporúčanie s odpoveďou: prečo je skupina relevantná, čo ponúka, čo projektu chýba, aký je prvý spoločný krok, **s dohľadateľným zdrojom**.
- **Kritérium úspechu:** funkčné demo, ktoré pre konkrétny výskumný zámer odporučí partnerov, zdroje a prvý krok a vie svoje odporúčanie obhájiť.
- **Dáta:** v prezentácii nie sú pomenované žiadne datasety **[?]** (pripraviť jednotnú štruktúru z 30–60 tímov je súčasť úlohy).
- **Cena NÚVR:** účasť na Czech Annual Cancer Research Meeting (Olomouc, 23.–25. 11. 2026).

### 3.4 Plíce včas – cesta ku skríningu pľúc (AstraZeneca)
- **Súbor:** „Astra_Plicee_Rakathon_prim.Čierná Peterová.pptx“ (4 slidy). **Mentorka:** prim. MUDr. Ivana Čierná-Peterová (pneumologička, 1. podpredsedníčka ČPFS). **Odkaz:** https://drive.google.com/file/d/16yUnx85Hu-Kwpt7sUdV-VW36IKepQlAy/view
- **Výzva:** navrhnúť, ako v ambulantnom alebo nemocničnom systéme **vybrať pacientov vhodných na oslovenie skríningovým programom** včasného záchytu rakoviny pľúc.
- **Zaradenie:** vek 55–74 rokov (vrátane), aktívny alebo bývalý fajčiar (zatiaľ bez ohľadu na „balíčkoroky“). **Vylúčenie:** CT hrudníka za posledný mesiac.
- **Súčasť výzvy:** navrhnúť **cestu oslovenia pacienta** s odporúčaním kontaktovať praktika alebo regionálneho pneumológa a zároveň **informovať praktika**.
- **Kontext zo slidu:** rakovina pľúc je najčastejšia príčina úmrtí medzi onkologickými diagnózami; odkaz na www.PrevenceProPlice.cz.
- **Medzera:** slidy neuvádzajú dáta ani technické zadanie ani hodnotenie **[?]** – treba sa opýtať v kanáli #plice-vcas-chytra-cesta-k-prevenci.

### 3.5 SMART ONCO AA: Příprava bez čekání (VFN)
- **Súbor:** „VFN – SMART ONKO AA.pptx“ (66 MB). **Garant:** Jan Bláha (VFN). **Odkaz (veľký súbor, iba odkaz):** https://drive.google.com/file/d/1_Z654kP1TFtO9teie0KasDZVk1qZFLBU/view
- **Obsah neznámy [?]** – textový prepis je prázdny (slidy sú pravdepodobne obrázky), kanál na Slacku bez zadania. Známe je iba: názov, InterSystems ho radí do kategórie „overiť a doplniť – SQL/API“ a **dáta k nemu dáva InterSystems mentor** (slide „Access to challenge data – Prague“).
- Ak by to tím zvažoval, treba si prezentáciu otvoriť ručne v prehliadači alebo sa opýtať J. Bláhu.

### 3.6 MDT Copilot (Asseco Central Europe)
- **Súbory:** „MDT_Copilot_zadani_upravené_2026_v02.pptx“ (13 slidov) + „Asseco_keynote_v03_MB.pptx“. **Autori/zadávatelia:** Michal Bušek (aj porotca), mentori Ľuboslav Piljan (Asseco) a Ondřej Hoferek (InterSystems / HL7 ČR). **Odkazy:** https://drive.google.com/file/d/1TdVOrigp1Pur2JmcGl0OAc64b_LF5fPp/view , https://drive.google.com/file/d/1x1IrNcV4KEdqiFnfataEhVZlj2k4pOhv/view
- **Problém:** MDT rozhoduje o liečbe, ale na jedného pacienta je **len 3–5 minút** a treba sa zorientovať v mnohoročnej histórii; nálezy v elektronickom zdravotníctve sú voľný text bez štruktúry; **chýba hlas pacienta** (dotazník PROMs na porade zvyčajne nie je).
- **Misia:** webová aplikácia, ktorá s AI spojí dáta pacienta, **za pár sekúnd pripraví prehľadný podklad pre každého člena komisie** a na konci zapíše rozhodnutie ako oficiálny záznam. Zlaté pravidlo: AI pripravuje, zhŕňa, upozorňuje a navrhuje, **rozhodujú vždy lekári**.
- **4 bloky výstupu:** A) súhrn (orientácia do 30 s, kondícia ECOG podľa lekára aj pacienta, časová os); B) pohľad odborníkov (aspoň 3 roly) + B2 podpora rozhodovania (možnosti liečby z doporučených postupov **s citáciou**, vhodnosť pre klinické štúdie, 2–3 otázky do diskusie); C) záver a akčný plán + export (PDF / HL7 FHIR).
- **4 pravidlá:** nastaviteľnosť (predseda si „naklikne“ sekcie a poradie); **varovné signály** (AI hľadá rozpory medzi zdrojmi, napr. nízky hemoglobín a pacient hlási extrémnu únavu); **dohľadateľnosť** (klik na zdroj; keď údaj chýba, AI to povie, nehádže); človek rozhoduje a text od AI je vizuálne odlíšený.
- **Dáta (deklarované):** mock záznamy z eZdravia, PROMs (min. 2 vyplnenia), nominácia na MDT, výťahy z guidelines + 3–5 fiktívnych štúdií, 3–5 príbehov pacientov so **zámerne vloženými chybami a správnym riešením**, bonus prepis diskusie. Samotné dáta na Slacku zatiaľ nie sú (04) **[?]**.
- **Hodnotenie (váhy):** klinická hodnota a UX 30 %; nastaviteľnosť 20 %; spoľahlivosť AI 20 %; dátová integrácia a štandardy 15 %; podpora procesu a zodpovedná AI 15 %; až +10 % za bonusy (kvalita, nie počet). **Finále: 5 minút, jeden pacient, celý cyklus naživo.**
- **Z keynote – prečo je čas dôležitý:** každé 4 týždne meškania liečby zvyšujú riziko úmrtia; slide uvádza 1–13 % (Hanna et al., BMJ 2020). Abstrakt a súhrn štúdie: https://www.bmj.com/content/371/bmj.m4087 – pri operácii uvádza zvýšenie rizika o 6–8 % na 4 týždne, pri systémovej liečbe rozpätie 1,01–1,28 násobku (presný rozsah „1–13 %“ zo slidu som nepotvrdil **[?]**).
- **Slovenské dáta (OnkoAsist, Asseco pre NCZI, 2019):** keď praktik správne vysloví podozrenie, diagnostika sa skráti – pľúca z 65 na 44 dní, prsník zo 104 na 49, hrubé črevo z 59 na 42. Dnes praktik podozrenie správne označí iba v ~10 % prípadov; cieľ projektu je takmer polovica (~46 %, prsník 57 %). Projekt pokrýva pľúca, kolorektum, prsník, 12 dodávateľov IS.
- **Cena Asseco CE:** mentoring, kontakty v českom/slovenskom zdravotníctve, zázemie na dotiahnutie prototypu.

### 3.7 Twincer / Cancer Twin (Fuck Cancer)
- **Súbor:** „Fuck Cancer – CancerTwin.pdf“ (11 slidov). **Zadávateľ:** pacientska organizácia Fuck Cancer (David Foldyna). **Odkaz:** https://drive.google.com/file/d/1D7aK5in0E4rOc-Q1qzx5ofP9ZkuWwWs6/view
- **Myšlienka:** „Nemusím na to byť sám“ – spojiť onkologických pacientov s podobnou skúsenosťou (aj z druhého konca sveta).
- **Tok:** profil pod prezývkou (bez e-mailu, krátky zdravotný dotazník) → zhoda v percentách (diagnóza, štádium, vekové pásmo; krajina nerozhoduje; pohlavie je dobrovoľná preferencia; vždy ukázať dôvod odporúčania) → rozhovor písaním alebo diktovaním, **AI prekladá medzi jazykmi** → obľúbení a história **len v telefóne**.
- **Druhá časť – analytika pacientských skúseností:** AI rozpoznáva témy, potreby a ich vývoj; výstupy pre lekárov, pacientske organizácie a výskum; členenie podľa veku, krajiny, pohlavia, diagnózy a fázy (pred / počas / po liečbe). Podmienky: iba anonymizované výstupy so súhlasom, malé skupiny sa nezobrazujú, pri každom výsledku počet profilov a obdobie; **početnosť rady nedokazuje jej bezpečnosť ani účinnosť**.
- **Dizajn pre pacientov:** 5 krátkych krokov, veľké voľby, nastaviteľná veľkosť písma, zvuk predvolene vypnutý.
- **Ďalšie produkty organizácie (ukazujú, čo robia):** EmpathyVR (VR návrat domov počas hospitalizácie), Help4Hero (AI nájde natočenú video odpoveď, odpovedá herec) – záujem o AI a video zážitky.
- **Prílohy (xlsx v Slacku):** texty aplikácie CZ/EN, číselník diagnóz, zadanie analytických výstupov (04, §1.2).

### 3.8 InterSystems – partnerská cena (nad všetkými výzvami)
- **Súbory:** „InterSystems Keynote.pptx“ (O. Hoferek), „Rakathon 2026 InterSystems Challenge Intro.pptx“. **Odkazy:** https://drive.google.com/file/d/1yAc3qi20PmEi5Udfay5den7QKKmONlb2/view , https://drive.google.com/file/d/1BuTChiXUgJM1sMzhNtVhlwUl9XXTfMny/view ; opis výzvy: https://developer.intersystems.com/intersystems-challenge-at-rakathon-2026/
- **Cena 1 500 EUR**, **kombinovateľná s ľubovoľnou inou výzvou**. Treba použiť InterSystems IRIS for Health, FHIR server, generatívnu AI s vector search (hľadanie podľa významu), alebo agentný prístup (AI volá nástroje nad SQL/API/FHIR).
- **Kritériá:** inovácia a reálny dopad (jasný zdravotný problém a cesta k MVP); zmysluplné využitie technológie InterSystems s AI/FHIR; technická súdržnosť (dátový model, architektúra).
- **Rady z workshopu:** FHIR na vstupe a výstupe, vlastný model vnútri je v poriadku; FHIR server urobiť hlavným úložiskom; nenechať FHIR na koniec; **„KEEP IT SIMPLE“**; FHIR sám nezaručuje kvalitu ani bezpečnosť; kód od AI agentov treba testovať.
- **Mapa výziev na typ AI (workshop):** MDT Copilot, Trial Matching, NÚVR = hľadať súvislosti (vector search/RAG); PACS Comparator, SMART ONCO AA, Cesta pacienta = overiť a doplniť (SQL/API); mamograf, skríning pľúc, hlídač NÚ = vyhodnotiť riziko (modely/pravidlá); PillGaze, ProstaPaper, AI NOR = zapísať do databázy (validácia/FHIR/API).
- **Dáta v Prahe:** pre Smart Onco AA a MDT Copilot cez InterSystems mentora (osobne alebo Slack), pre ostatné cez autorov výziev; VZP dáta v Azure. Mentori Praha: Ondřej Hoferek, Gabriel Ing; online 24/7 (piatok 20–24, sobota 0–8).
- **Pozadie ceny:** víťazov vyzývajú do inkubátora Caelestinus (3 mesiace, kontakty, grant bez podielu vo firme); v INTRO „divoká karta“ do 2027 Batch.

---

## 4. Brno a Ostrava – výzvy iných miest (stručne; nie je jasné, či ich môže voliť tím z Prahy **[?]**)

### Brno
- **Schránka vzpomínek (FN Olomouc; L. Fuxová, K. Holá)** – https://drive.google.com/file/d/1slFt7v_NYwUQj7KNbhJVDT2qxkumFlrL/view  
  Mobilná aplikácia, kde rodič (hlavne pri závažnej chorobe) ukladá listy, hlas a spomienky pre deti („Som tu s tebou, len inak“). MVP = **textový list**: profil fiktívneho dieťaťa, napísať / uložiť ako koncept / upraviť / dokončiť / nájsť v prehľade, **uložené musí prežiť reštart dema**. Akceptácia v 5 krokoch. Tón: láskavý, bez tlaku a odpočtov, súkromný, len fiktívne dáta; odovzdanie dieťaťu sa rieši až neskôr. Nice-to-have: foto, hlas, prevod reči na text, export.
- **Když realita překoná prognózu (FN Brno; A. Winklerová, V. Dušek)** – https://drive.google.com/file/d/1yj4tnTmTNf-vidf5ZgoXoI0Fvs6T8y3n/view  
  Nájsť **pacientov (deti), ktorých priebeh sa výrazne líši od očakávanej prognózy** (outlieri = zdroj nového poznania). Dáta: ~250 detí s onkologickou chorobou, 3 súbory (pacienti, epizódy starostlivosti, laboratórne výsledky). Postup: nájsť zhluky typických priebehov → zmerať vzdialenosť → vysvetliť → lekár potvrdí význam. **Hlavné hodnotiace kritérium: tvorivosť a učenlivosť v práci s dátami.**
- **EduAIttractive (MOÚ; MUDr. Jiří Šedo)** – https://drive.google.com/file/d/1iP2T0Dp2TCyXR2CMM_EKGw-_KyDUdhh2/view  
  Nástroj, ktorý z **odborných podkladov rýchlo vyrobí krátke profesionálne edukačné videá** (animácie, infografika, prípadne záber ľudí) pre pacientov; náväznosť na platformu Orbiso. **Úzke hrdlo je čas zdravotníka:** dnes prechádza celé video a kontroluje každú vetu – cieľ skrátiť z hodín na minúty. Požiadavky: schvaľovanie po scénach a vetách, **každá veta má zdroj** (odstavec alebo časová značka podcastu; informácia navyše sa označí), oprava jednej scény bez výroby celého videa, automatická kontrola (prepis hlasu vs. schválený text, výslovnosť, titulky, vady obrazu), varianty (kratšie/dlhšie/jednoduchší jazyk/preventívny vs. paliatívny tón), prístupnosť pre divákov 60+ (čeština, titulky najviac 2 riadky, pokojné tempo, kontrast). **Výstup: nástroj + aspoň 3 videá z dodaných podkladov. Hodnotí sa kvalita AV výstupu a čas + náklady (minúty práce zdravotníka, Kč na minútu hotového videa).**
- **PillGaze (MOÚ; Martin Rusinko)** – https://drive.google.com/file/d/1UvMHWw9AUr2C98xYS2Ost3IKhbhNBedK/view  
  Mobilná aplikácia pre pacienta: **odfotí ručne písaný zoznam liekov a krabičky**, AI ich zmení na štruktúrovaný zoznam, lekár dostane tabuľku (ctrl+C/V do dokumentácie) a môže si vyžiadať kontrolu liekových interakcií (aj onkologické režimy cez skratky). **Prenos anonymne cez krátky PIN (max 4 miesta, platnosť napr. 3 minúty)**, zoznam sa neukladá na externé úložisko. Dnes je zber farmakologickej anamnézy ručný a zdĺhavý, údaje od pacientov sú nespoľahlivé. Dáta: vzorové zoznamy (aj s chybami), fotky obalov, zoznam nástrojov na kontrolu interakcií, prehľad onkologických režimov.
- **ProstaPaper (MOÚ; Michal Standara)** – https://drive.google.com/file/d/1IE6ETWQ5uwkWKeIoPIYiVB85GViu-Daf/view (15 MB, čítané cez Drive)  
  Patológ dnes **kreslí rozsah nádoru prostaty na papier** a píše nález do NIS; rádiológ a urológ chcú spätnú väzbu, aby sa učili. Úloha: nástroj prečíta text histológie, odvodí vlastnosti ložísk podľa registra, **z naskenovanej schémy určí, v ktorých segmentoch prostaty ložiská sú**, a uloží to do registra COMPARE (REDCap). Úspech za 48 hodín: sken schémy + text → parametrická forma importovateľná do REDCap. Vstup: obrázok schémy + text so spoločným ID pacienta; testovacia verzia registra dodaná.
- **TriaLink (MOÚ; P. Grell, Š. Selvekerová)** – mimo Drive priečinka, zhrnuté v 04 (§1.3): v MOÚ > 140 aktívnych štúdií (~50 intervenčných), len ~5 % pacientov v intervenčných štúdiách (Západ 10–15 %), ručné hľadanie štúdie ~45 min, cieľ < 30 s. Dáta cez CESNET FileSender (neťahané).

### Ostrava (všetko FN Ostrava okrem Surgical Copilot – FN Olomouc)
- **1 – Onkologický AI průvodce (doc. Jakub Cvek)** – https://drive.google.com/file/d/1QlUR289pRB5iDS5mgY1dsA7yq0LhqyOE/view  
  Pacient nepotrebuje viac informácií, ale **správne, overené a zrozumiteľné v správny čas**. Chatbot: odpovedá z nemocničných pokynov, uvedie zdroj, zmeria stav dotazníkom EQ-5D, pri rizikovej situácii nasmeruje na zdravotníka. Nie je lekár, nediagnostikuje, nesmie si vymýšľať. Prínos: informácie 24/7, menej rutinných telefonátov, meranie kvality života. Dáta: informačné materiály, Modrá kniha (odporúčané postupy), EQ-5D, časté otázky, zoznam kontaktov.
- **2 – AI asistent MDT (Cvek)** – https://drive.google.com/file/d/1jfyTMIPGVjZd_iDhfDH1KMev9FiPfboN/view  
  Informácie sú v 5 systémoch (NIS, laboratórium, PACS, patológia, genetika) a lekár ich ručne skladá. Dva výstupy: **prezentačná aplikácia** (interaktívny prehľad, časová os, rozklik) a **report** (PDF pre dokumentáciu / žiadosť o ďalšie vyšetrenie). Zadávateľ: nechceme ďalší systém, kde lekár hľadá, chceme nástroj, ktorý informácie nájde, usporiada a pripraví na rozhodnutie. Dáta: ukážky dokumentácie fiktívnych pacientov + štruktúra MDT protokolu FNO. (Obdoba MDT Copilota.)
- **3 – Chytrejšie plánovanie onkologického stacionára (Mgr. Erika Hajnová Fukasová; aj porotkyňa)** – https://drive.google.com/file/d/1Ew4PFs1yxQ1-x1FyXaDnMXvvWsBJ7f2k/view  
  Každý pacient má inú dĺžku aplikácie chemoterapie, kapacity sú obmedzené (ukážka: 20 kresiel, 6 lôžok, prevádzka 7:00–15:30). AI má predikovať vyťaženie, odhadnúť trvanie liečby podľa režimu, navrhnúť rozloženie pacientov, varovať pred rizikovými časmi, simulovať „čo ak“ a mať jednoduchý dashboard. Dáta: anonymizované objednávky za 30 dní, aplikačný rozpis chemoterapie. Čísla v slide sú ilustračné.
- **4 – AI NOR (Ing. Magdaléna Najbrtová)** – https://drive.google.com/file/d/1KygyqRIrCiicGsRlyWrExSLDgHARZcNZ/view  
  Automaticky **vytiahnuť údaje z onkologickej dokumentácie do formulára národného onkologického registra** (diagnóza a lokalizácia, MKN-10, morfológia, grading, TNM, štádium, liečba, recidíva), s odkazom na miesto v dokumente a potvrdením zdravotníkom. Hodnotia sa: presnosť, úplnosť, správne priradenie, dohľadateľnosť zdroja, **počet opráv, čas na záznam**. Dáta: ambulantné správy, histológia, prepúšťacie správy, vzor formulára, slovník MKN-10.
- **5 – Surgical Copilot (doc. Vladimír Študent, FN Olomouc)** – https://drive.google.com/file/d/1Xvvsk0ln_h1ANK09xBocCCTuTjBARrX0/view  
  Robotický chirurg vidí pri operácii nádoru obličky len povrch; CT má iba pred operáciou. Úloha: z CT (DICOM) vytvoriť 3D model (oblička, nádor, cievy), **priložiť ho do videa z kamery robota**, aby bolo vidieť nádor, ktorý kamera nevidí. Najťažšie: registrácia (oblička sa hýbe a deformuje). Dáta: **iba 8 pacientov** (video + CT), odporúčané predtrénované modely (TotalSegmentator, nnU-Net, SAM 2). Tri úrovne úspechu (segmentácia → prekrytie s pomocou človeka → automatické sledovanie). Čísla: 3 224 nových nádorov obličky ročne v ČR (NOR/ÚZIS 2019–2023). Prototyp je len pre výskum.
- 6 – InterSystems intro (rovnaké ako v Prahe). Priečinok obsahuje aj video FNO (nepozeral som) a duplikáty troch VZP prezentácií.

---

## 5. Pre-hack day (15. 10.) a technické prezentácie

- **Aleš Tichopád – Cesta onkologického pacienta (FBMI/ČVUT).** Slidy: Slack, 11 MB (https://rakathon2026.slack.com/files/U0C9BP5EC5V/F0C9H7XGBH7/analyza_cesty_onkologickeho_pacienta_fbmi_final.pptx; vyžaduje prihlásenie do Slacku) – **slidy som neprečítal**, nasledujúce body sú z prepisu prednášky v 02-prehack-prednasky.md:
  - Najväčší zmätok a najväčší zisk času je **na začiatku cesty** (podozrenie → diagnóza → začiatok liečby).
  - **40 % pacientov s rakovinou pľúc čaká na operáciu viac ako 8 týždňov**; pacienti absolvujú 2.–4. bronchoskopiu; veľké rozdiely medzi nemocnicami (MDT, testy, začiatok liečby). Špecializované centrum môže mať čakanie až pol roka (posun zo štádia 1 do 3).
  - MDT je často len telefonát dvoch lekárov, bez záznamu a sledovania.
  - **Koordinácia ako proces:** úloha → vlastník → lehota → potvrdenie prevzatia → výnimka a eskalácia (odoslaná žiadanka ≠ objednané ≠ vykonané vyšetrenie).
  - Koordinátor často nie je lekár → systém má v pozadí viesť algoritmus; pacienti sú často 70+ a nie všetci vedia ovládať smartfón.
  - Vzorky aj snímky cestujú s pacientom a strácajú sa; výsledky chodia poštou.
  - Kapacity centier sa nerežú celosystémovo (pacient by šiel ďaleko, ale nevie, kde je miesto); testujú učenie so spätnou väzbou (reinforcement learning) na rozhodovanie KOC vs. ROC; cieľ vracať dobre zaliečených pacientov do regiónov.
  - Zdroj uvádzaný v prednáške na zdržanie liečby: Hanna et al., BMJ 2020 (https://www.bmj.com/content/371/bmj.m4087).
- **Michal Opatřil – České eHealth v kostce** (PDF 8 str., Umbrellateam; `docs/materials/slack/01-oznameni/`):
  - Nie je jedna centrálna databáza; 4 vrstvy (EÚ, štátne služby, výmenná vrstva, poskytovatelia). Hlavné pravidlo: **technická interoperabilita ≠ klinicky a právne funkčná služba**.
  - Nestavať: vlastnú databázu pacientov, vlastné elektronické žiadanky (štát stavia centrálny systém; žiadanka je stavový automat, nie PDF).
  - Dokumenty sa nesdieľajú, ale **„zpřístupňují“** (zostávajú u poskytovateľa); vyhľadanie a získanie dokumentov cez IHE MHD (publikovať ITI-65, nájsť ITI-67, získať ITI-68) nad FHIR R4.
  - Návrh novely zákona 325: povinná elektronická dokumentácia od 2029, povinné e-žiadanky od 2027/2028 (**návrh**, nie platné právo).
  - Výzva pre hackerov: **AI, ktorá z voľného textu vytvorí štruktúrované dáta** (lekári chcú písať voľne). Cena pre víťazný tím: vstup na technické stretnutie výrobcov NIS 19. 10. v Prahe (ILF).
- **Hynek Kružík – HL7 FHIR a európsky Common Cancer Model** (pptx; zhrnutie v 02): FHIR R4 je štandard; EHDS (európsky priestor pre zdravotné dáta) núti systémy ku FHIR; model rakoviny je v pripomienkovaní, namapovaný zatiaľ len Patient; odporúča pozrieť základné FHIR resources a používané číselníky; proprietárne rozhrania nemajú zmysel.
- **Luc Chatty – Beyond the hackathon (Hospitals on FHIR, PHOENIX, XiA)** (PDF 16 str.; https://hospitalsonfhir.eu): sľubný prototyp je len začiatok, skúška je, či ho môže použiť **ďalšia nemocnica**. FHIR je „spoločná zmluva“, nie zázračná zástrčka („ukladať JSON ≠ byť interoperabilný“). 6 rád na prvých 48 hodín: začni pracovným postupom (kto rozhoduje, s akým kontextom), vyber FHIR zmluvy, používaj existujúce číselníky, plánuj dôveru (identita, prístup, pôvod), testuj mimo dema, zdieľaj artefakty. Špecifikácia PHOENIX: https://build.fhir.org/ig/hl7-eu/cancer-common/ . Súvis s finálovým kritériom Škálovateľnosť.
- **Ondřej Hoferek – Technický workshop FHIR & AI s InterSystems IRIS** (PDF 26 str.): RAG, vector search, agentné volanie nástrojov, prečo FHIR (ľahšie nasadenie v ďalšej nemocnici, dáta s klinickým kontextom, výsledok späť do systému lekára bez prepisovania, príprava na EHDS), FHIR server ako hlavné úložisko, Docker šablóna na GitHube; úskalia: neodkladať FHIR, nezahltiť sa detailmi, **keep it simple**.
- **Microsoft – technický sprievodca** (PDF; spracované v 03-prehack-tech-a-vyzvy.md): portál, tímový účet, OpenAI-kompatibilné API, zdieľané limity (retry), Contributor v resource group, Copilot kredit. Pre výber výzvy nerozhoduje.
- **INTRO (Praha)** – pozri sekciu 1.

---

## 6. Ďalšie podklady, ktoré sa objavili

### 6.1 Cesta pacienta – súťažný balík (Slack, 14:05)
- Súbor `cesta-pacienta-data.zip` (3,2 MB; Slack file ID F0CAN57HADN) – v repe iba 4 špecifikačné dokumenty: `docs/materials/drive/cesta-pacienta-data/` (Zadani_ulohy, Handover_obsah, MDT_zapis, MDT zaver). 13 správ pacientky z balíka a prezentáciu som neukladal (správy obsahujú vymyslené telefónne čísla a adresy; prezentácia je na Drive).
- **Prípad:** fiktívna 63-ročná pacientka (Alena Procházková), rakovina hlavy pankreasu; 13 správ zo 7 pracovísk (kardiológia, laboratórium, RTG, praktik, gastroenterológia, UZ, žiadosť praktika o prevzatie do KOC 2, CT v KOC 1, biopsia, kontrolné odbery, histológia, algeziológia, psychológ).
- **Úloha:** (1) prevziať žiadosť praktika; (2) umožniť koordinátorovi vyžiadať a zhromaždiť správy; (3) AI vyťaží údaje podľa zoznamu `Handover_obsah` (meno, vek, poisťovňa, kontakty, diagnóza, otázka pre MDT, komorbidity, lieky, alergie, výkonnostný stav, váha a výška, príznaky a ich začiatok, vyšetrenia s dátumom/miestom/výsledkom, laboratórne výsledky vrátane onkomarkerov, histológia, iné vrátane prianí pacienta) a **upozorní na chýbajúce alebo nesúhlasiace údaje**; (4) naplánovať a sledovať kroky (CT, biopsia, odbery, algeziológ, psychológ) s termínom, miestom a stavom; (5) pripraviť podklad na MDT **21. 10. 2026 len z údajov známych k tomu dňu** (správy algeziológa a psychológa vznikli až po MDT); (6) po MDT poslať záver MDT praktikovi a **doložiť doručenie**.
- **Odovzdáva sa:** funkčné demo celého priechodu, správa na MDT podľa šablóny `MDT_zapis`, ukážka odoslania záveru praktikovi. Pravidlo: údaje preberať bez domýšľania, čo chýba, označiť.
- **Pasce, ktoré som si všimol (kontrola AI):** ECOG (výkonnostný stav) nie je výslovne uvedený; v správe o histológii je dátum odberu vzorky 20. 10. 2026, pritom správa je vydaná 19. 10. **[?]** (možný zámerný rozpor); praktik píše o nutnosti vysadiť apixaban pred výkonom, MDT záver hovorí „samostatne nevysadzovať“.

### 6.2 Mamograf – spresnenia z Slacku
- Pozri sekciu 2.1 (príloha B, prediktory, referenčný čas, otvorené otázky o testovacej sade a histórii pozvánok).

---

## 7. SIGNÁLY DOPYTU – čo zadávatelia najviac zdôrazňovali

Zoradené podľa toho, v koľkých prezentáciách sa to opakuje (počítané z prečítaných materiálov).

1. **Ušetriť čas zdravotníkom / koordinátorom (najčastejšie, ~9 výziev).** MDT: 3–5 min na prípad a hodiny príprav (Asseco, FN Ostrava); koordinátor hľadá dokumenty namiesto koordinácie (VZP Cesta); kontrola videa zaberá hodiny, cieľ minúty (EduAIttractive); zdĺhavý odber liekov (PillGaze); ručné vypĺňanie registra (AI NOR, ProstaPaper); plánovanie stacionára; súhrn pre lekára „za 30 sekúnd“ (MEDDI). Merajú aj priamo: minúty práce, počet opráv, Kč za minútu videa.
2. **AI ako „vyťažovač“ voľného textu do štruktúry (~8 výziev).** AI NOR, ProstaPaper, Cesta pacienta, MDT Copilot, Ostrava MDT, PillGaze (OCR zoznamov a krabičiek), Trial Matching (kritériá štúdií), PACS Comparator (zo správ), TriaLink. Rovnako to ako otvorenú príležitosť pomenoval M. Opatřil.
3. **„Nie ďalší systém, nie ďalší formulár.“** Cesta pacienta (výslovne bez veľkého formulára), Ostrava MDT (nechceme ďalší systém, kde sa hľadá), PillGaze (zapadnúť do práce lekára, kopírovať do dokumentácie), MEDDI (UI musí byť jednoduché; hodnotí sa 15 %), FHIR workshop (keep it simple). Zadávatelia nechcú nové návyky – chcú nástroj, ktorý sa vkladá do toho, čo už robia.
4. **Dôvera: AI navrhne, človek potvrdí; každé tvrdenie má zdroj; AI nehádže.** MDT Copilot (citácie, klik na zdroj, „údaj chýba“), EduAIttractive (každá veta má zdroj), AI NOR (dohľadateľnosť), AI průvodce (uvádza zdroj), MEDDI (vysvetliteľnosť), Cesta pacienta (lekár potvrdí).
5. **Čas do liečby a včasný záchyt.** Asseco/OnkoAsist (4 týždne meškania, podozrenie u praktika), VZP Cesta (T1+T2+T3), Tichopád (40 % pľúc > 8 týždňov), mamograf (prevencia), Plíce (výber ľudí na skríning), FNMH (trial matching „skôr, než nás to napadne“).
6. **Merateľný dôkaz, nie dojem.** VZP mamograf: A/B experiment; MEDDI: skrytý test na 6 pacientoch a trest za podhodnotenie červenej; MDT Copilot: ground truth a 5-min demo jedného pacienta; EduAIttractive: čas a náklady; AI NOR: presnosť, úplnosť, počet opráv; Kvalita života: reprodukovateľný postup a neistota.
7. **Bezpečnostné hranice sú súčasť zadania.** Žiadna diagnóza ani zmena liečby (MEDDI, AI průvodce); pri pochybnosti vyššia úroveň; žiadna individuálna prognóza (VZP Kvalita života); upozorňovať na závažné, nie na každú drobnosť (FNMH hlídač); anonymita (PillGaze PIN, Twincer prezývka, malé skupiny sa nezobrazujú).
8. **Štandardy a „zapadne to do ďalšej nemocnice“.** FHIR/IHE MHD (Opatřil, Kružík, Chatty, InterSystems, Asseco); vo finále kritérium Škálovateľnosť. Zadávatelia VZP/KOC hovoria otvorene: „Rakathon overí princíp, produkčná integrácia je ďalšia fáza.“
9. **Pacient ako unavený/starší človek.** Jasný ďalší krok bez odborných termínov (MEDDI), veľké písmo a pokojné tempo pre 60+ (EduAIttractive, Twincer), pacienti 70+ nie vždy ovládajú smartfón (Tichopád). Pre video/UX: laskavý, nenátlakový tón (Schránka vzpomínek).
10. **Komunikácia a obsah (príležitosť pre video/marketing).** Mamograf: návrh konkrétnych intervencií a kanálov pre segmenty (v zadaní je „návrh experimentu“, tvorba správ nie je zakázaná); Plíce: navrhnúť cestu oslovenia pacienta a informovanie praktika; EduAIttractive: generatívne video je priamo predmet výzvy; Fuck Cancer: AI video zážitky (Help4Hero). **[?] Ide o môj záver; zadanie nikde nehovorí „vyrobte kampaň“.**

### Pripravenosť podkladov (z toho, čo som videl; dôležité pre „kódovanie cez noc“)

| Výzva | Zadanie jasné | Dáta/prípady k dispozícii | Poznámka |
|---|---|---|---|
| VZP mamograf | áno | > 1,3 mil. záznamov (Azure) | otvorené: testovacia sada, história pozvánok |
| VZP Cesta pacienta | áno (4 kroky + „demo musí ukázať“) | 1 prípad, 13 správ + šablóny (Slack zip) | veľmi presné kritériá dema |
| VZP Kvalita života | áno, ale analytické | otvorené dáta + slovník | skôr dashboard než nástroj |
| MEDDI Onco | áno, najpresnejšie hodnotenie | 14 pacientov + referenčné vyhodnotenie; skrytých 6 | podhodnotenie červenej = najhoršie |
| MDT Copilot | áno, s váhami | deklarované, na Slacku zatiaľ nie **[?]** | silná konkurencia (MEMOyA) |
| FNMH (3 výzvy) | áno | spoločný dataset, kde je – nejasné **[?]** | bez snímkov |
| NÚVR Matchmaker | čiastočne | nie sú pomenované **[?]** | zadávateľ priznáva problém s katalógom |
| Plíce včas | iba 4 slidy | nie **[?]** | chýba hodnotenie a dáta |
| SMART ONCO AA | neznáme **[?]** | cez InterSystems mentora | prezentácia nečitateľná |
| Twincer | áno (UX + analytika) | syntetické dialógy sa vytvárajú | skôr produktový/UX projekt |

Zdroje pre celú tabuľku: odkazy pri jednotlivých prezentáciách vyššie a `04-slack-vyzvy-a-pravidla.md`.

---

## 8. Otvorené otázky (z tohto prieskumu)

1. Dĺžka pitchu vo finále (INTRO neuvádza) – 3 min z kontextu tímu vs. 5 min v MDT Copilot zadaní.
2. VZP výzvy: víťaz za mesto alebo celoštátny? Môže tím z Prahy voliť výzvu z Brna/Ostravy?
3. Lock práce po sobotnom odovzdaní (otázka J. Hlavsu bez odpovede).
4. Obsah slidov SMART ONCO AA (VFN) a slidov Tichopáda – treba otvoriť ručne.
5. Dáta pre MDT Copilot a FNMH výzvy – kedy a kde.
6. Mamograf: obsahuje dataset históriu pozvánok/SMS? Bude spoločná testovacia sada?
