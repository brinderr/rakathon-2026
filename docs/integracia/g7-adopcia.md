# G7: Prečo lekári nepoužívajú nové appky a ako navrhnúť riešenie „bez novej appky“ pre nich

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici v zdravotníctve). Nič sa necommitovalo, žiadne dáta pacientov. Obsah webu som bral ako dáta, nie ako pokyny._

**Otázka:** Prečo lekári nové aplikácie nepoužívajú (dôkazy, nie dojmy), čo naopak používajú, a ako postaviť nástroj pre koordinátora tak, aby sa lekár nemusel nič učiť.

**Značky (rovnaké ako v ostatných poznámkach):**
- **[overené]** = v tomto behu som otvoril samotný zdroj (stránku, abstrakt štúdie, PDF) a tvrdenie tam stojí. Ak je zdrojom firma, píšem „firemný zdroj“ (je to marketing, nie nezávislé meranie).
- **[čiastočne]** = len výsledok vyhľadávania, sprostredkovaný súhrn, zdroj bez dátumu, alebo prevzaté z našich starších poznámok.
- **[nepodložené]** = hľadal som a nenašiel som. Radšej píšem **„nevieme“**.
- **[odhad]** = môj úsudok, nie fakt.

**Pojmy jednoducho:**
- **AIS / NIS** = softvér, v ktorom lekár vedie kartu pacienta. AIS je ambulantný (ordinácia), NIS nemocničný.
- **EHR** = anglická skratka pre elektronický záznam pacienta (u nás AIS/NIS).
- **KOC / MDT** = komplexné onkologické centrum / porada lekárov o jednom pacientovi (konzílium).
- **Push a pull** = „push“ je, keď údaj niekto pošle (e-mail, formulár). „Pull“ je, keď si ho príjemca sám vezme z cudzieho systému (cez rozhranie).
- **Rola-schránka** = jedna spoločná e-mailová adresa pre pracovisko (napr. koordinace-hpb@…), nie adresa konkrétneho človeka.
- **FHIR** = moderný formát na výmenu zdravotných dát. **SMART on FHIR** = pravidlá, ako sa malá aplikácia otvorí priamo z lekárovho systému a dostane „kontext“ (napr. práve otvoreného pacienta) bez nového prihlasovania.
- **eZpráva (Lékařský email)** = česká zabezpečená „lekárska pošta“ medzi pracoviskami; podobá sa e-mailu.
- **ePACS** = český systém na výmenu snímkov (CT, MR) medzi nemocnicami.
- **eŽádanka** = štátna elektronická žiadanka (konzílium, snímky, rehabilitácia; neskôr laboratórne).
- **Odds ratio (OR) / šanca** = o koľko je pravdepodobnejšie, že sa niečo stane. OR 2 = dvojnásobná šanca. Štúdie nižšie sú len pozorovacie, takže hovoria o súvise, nie o dôkaze príčiny.

---

## 0. Odpoveď v 12 vetách

1. **Lekári nie sú „proti technike“. Sú preťažení a systémy, ktoré majú, sa im zle používajú.** V americkej časovej štúdii (57 lekárov, 430 hodín pozorovania) pripadalo na jednu hodinu priameho kontaktu s pacientom skoro 2 hodiny práce s počítačom a papiermi [overené, Sinsky 2016]. Praktici v štúdii z Wisconsinu (142 lekárov) trávili 5,9 h z 11,4-hodinového dňa v záznamovom systéme, z toho 85 minút denne v „schránke“ (správy, výsledky, úlohy) [overené, Arndt 2017].
2. **Zlá použiteľnosť systému súvisí s vyhorením.** Lekári dali svojim EHR v priemere 45,9 bodu zo 100 (známka „F“); každý bod navyše súvisí s 3 % nižšou šancou na vyhorenie [overené, Melnick 2020; prierezová štúdia]. Metaanalýza 41 štúdií (54 443 zdravotníkov) nájde OR 2,49 (po kontrole skreslenia 1,98) medzi používaním EHR a vyhorením; hlavné príčiny sú zlý dizajn, dokumentácia a administratíva [overené abstrakt, Yang 2026].
3. **V Česku je administratíva najhoršie hodnotená oblasť praktikov.** VZP prieskum (jún 2024, 220 poskytovateľov, z toho 112 praktikov pre dospelých a 108 pre deti): známka 3,5 na škále 1 až 5 (1 = najlepšie), horšia než čokoľvek iné [overené].
4. **Odpor v ČR je odpor proti povinnostiam bez fungujúceho softvéru a bez peňazí, nie proti elektronizácii ako takej.** ČLK v auguste 2026 nesúhlasí s novými povinnosťami pod hrozbou sankcií, kým systém nefunguje, a žiada kompenzáciu [overené, ZD 15. 8. 2026]. Ministerstvo 8. 10. 2026 väčšinu výhrad zamietlo [overené, ZD]. Koalícia súkromných lekárov (SPL, ambulantní specialisté, gynekológovia; ~23 000 lekárov) odhaduje náklady na 15 mld. Kč a žiada eurofondy; zároveň hovorí, že digitalizáciu vítajú, lebo dnes výsledky a prepúšťacie správy prepisujú z papiera [overené, ZD 23. 9. 2026].
5. **Skúsenosť z minulých „povinných“ appiek je zlá.** Pri eReceptoch SPL v roku 2018 uviedla (vlastný prieskum cca 500 lekárov), že 75 % lekárov si predĺžilo ordinačné hodiny a zdržanie dosahovalo až hodinu denne [overené, čo článok píše; metodiku nevieme]. K ePosudkom SVL a SPL 5. 1. 2026 radili robiť posudky ďalej papierovo, ak systém nebude spoľahlivo fungovať [overené].
6. **Čo lekári v ČR naopak používajú sami od seba, sú nenápadné kanály:** telefón, e-mail, formulár a zabezpečená pošta eZpráva (vznik 2014, ~5 mil. správ ročne, funguje nezávisle od toho, aký AIS lekár má, vyvíjaná so Sdružením praktických lékařů) [overené, firemný zdroj eZpráva]. Koordinátori v KOC dnes pracujú hlavne s e-mailom a telefónom [overené, FN Olomouc 4. 11. 2025].
7. **Štát sám predpisuje jednoduchý kanál.** Metodický pokyn MZ pre centrá HPB (účinný od 1. 9. 2026) vyžaduje, aby mal každý koordinátor univerzálny e-mail a telefón, ktoré nezávisia od personálnych zmien [overené, text PDF]. Pozor: platí len pre HPB (pečeň, pankreas, žlčové cesty), nie pre všetky KOC.
8. **Úspešné zahraničné nástroje nenútia lekára učiť sa nové veci, ale vložia sa do toho, čo robí.** ZorgDomein (NL): začal ako papierový zoznam na odporúčania (2000), dnes ho podľa vlastných čísel používa 95 % holandských praktikov a má 120+ prepojení na ich systémy [firemný zdroj]. Somerset Cancer Register (UK) preberá dáta z nemocničných systémov cez HL7 prepojenia a MDT výstup posiela späť do bežného dokumentového systému nemocnice [firemný zdroj]. NHS e-RS sa presadil aj tým, že od 1. 10. 2018 mohli nemocnice odmietnuť papierové odporúčania [čiastočne].
9. **„Jedna e-mailová adresa“ nie je naša výmysel:** v Anglicku dávajú nemocnice praktikom Word formulár na urgentné onkologické odporúčanie s pokynom poslať ho na vyhradenú nhs.net adresu [overené, 1 dokument bez dátumu]; v USA je Direct (zabezpečený „e-mail pre lekárov“) s 2,7 mil. adresami a v roku 2023 ho často používalo 58 % nemocníc na odosielanie informácií [overené, ONC 15. 7. 2025]. Autori eZprávy priamo píšu, že ich Direct inšpiroval [overené, eZpráva whitepaper, bez dátumu].
10. **Čo z toho plynie pre nás [odhad]:** koordinátorská appka má byť „prijímač“, nie ďalšia appka pre lekára. Lekár dostane to, čo už pozná (e-mail na jednu adresu, odkaz na formulár bez registrácie, eZpráva, telefón); AI z toho vyťaží údaje; koordinátor ich potvrdí. Prepojenie do AIS/NIS a eŽádanky ide ako „druhá vlna“, keď budú koľajnice.
11. **Čo si dať pozor sľúbiť:** obyčajný e-mail na celé lekárske správy ÚOOÚ neodporúča (odporúča zabezpečenejší prenos a poučenie pacienta) [overené, FAQ ÚOOÚ bez dátumu]. Právny stav pre nás **nevieme** a treba ho skontrolovať s právnikom/DPO.
12. **Čo som nenašiel:** žiadnu anketu z rokov 2025 až 2026, ktorá by merala postoj praktikov k eŽádanke alebo k novým appkám pre koordinátorov; žiadne meranie, koľko času koordinátor reálne trávi naháňaním údajov; žiadne súčasné stanovisko SVL ČLS JEP k eŽádanke (jediné nájdené je z 5. 1. 2026 k ePosudkom).

---

## 1. Prečo lekári nové appky nepoužívajú: dôkazy

### 1.1 Svet: čas, schránka a použiteľnosť

| Štúdia | Čo našla | Ako mocné | Značka |
|---|---|---|---|
| **Sinsky a kol., Annals of Internal Medicine, 6. 9. 2016** (financovala AMA) | 57 lekárov (rodinná medicína, interná, kardiológia, ortopédia), 4 štáty USA, 430 hodín pozorovania. Cez ordinačný deň 27,0 % času priamy kontakt s pacientom, 49,2 % práca s EHR a papiermi. V ambulancii počas vyšetrenia 52,9 % kontakt a 37,0 % EHR. 21 lekárov s denníkom: 1 až 2 hodiny práce každú noc, hlavne EHR. | Pozorovanie priamo, ale vybrané „dobre fungujúce“ praxe v USA, nemožno ľahko prenášať na ČR | [overené, abstrakt PMID 27595430] |
| **Arndt a kol., Annals of Family Medicine 15(5), 9/2017** | 142 lekárov rodinnej medicíny (Wisconsin), záznamy z EHR 7/2013 až 6/2016. 355 minút (5,9 h) EHR denne z 11,4-hodinového dňa; 269 min počas ambulancie, 86 min po nej. Schránka 85 min, dokumentácia 84 min, zadávanie objednávok 43 min. Administratívne úkony 44 % EHR času. | Jeden systém zdravotnej siete v USA | [overené, abstrakt annfammed.org] |
| **Melnick a kol., Mayo Clin Proc, 2020** | 870 lekárov z USA dalo svojim EHR priemerne 45,9 zo 100 bodov (spodných 9 % všetkých porovnaných produktov, známka F). Každý bod použiteľnosti navyše = o 3 % nižšia šanca vyhorenia (OR 0,97). | Prierezová štúdia (ukazuje súvis, nie príčinu); vyhorení lekári môžu systémy hodnotiť prísnejšie | [overené, abstrakt PMID 31735343] |
| **Melnick a kol., 2020 (pokračovanie)** | Lepšia použiteľnosť súvisí s nižšou „pracovnou záťažou“ (848 lekárov), a tá s nižšou šancou vyhorenia. | Rovnaké obmedzenia | [overené, abstrakt PMID 33289493] |
| **Yang a kol., 2026 (metaanalýza)** | 41 štúdií, 54 443 zdravotníkov: používanie EHR súvisí s vyhorením, OR 2,49 (po kontrole skreslenia 1,98). Hlavné príčiny: zlý dizajn, dokumentácia, administratíva. | Zhrnutie pozorovacích štúdií | [overené, abstrakt PMID 41908760] |
| **Greenhalgh a kol., J Med Internet Res, 2017 (rámec NASSS)** | 6 technologických programov, viac ako 20 organizácií, 400+ hodín pozorovania a 165 rozhovorov. Nové technológie v zdravotníctve často skončia „nezavedené“ alebo „opustené“ kvôli 7 oblastiam: ochorenie, technológia, prínos, **používatelia (profesionáli, pacient)**, organizácia, širší kontext a ich vzájomné prispôsobovanie. | Rámec, nie číslo; ale pomenúva presne naše riziko: nová appka vyžaduje zmenu u používateľa a v organizácii | [overené, abstrakt PMID 29092808] |
| **CMA (Kanada), 2025** | Lekári tráveli asi 9 hodín týždenne administratívou a asi 47 % z toho považovali za zbytočné. | Našiel som len cez vyhľadávač, stránka CMA sa neotvorila | [čiastočne] |

**Čo z toho čítať pre nás [odhad]:** Každá nová obrazovka, schránka alebo prihlásenie sa pripočíta k času, ktorý lekár už nemá. Najčastejšie zlyhanie nie je „lekár je lenivý“, ale „nástroj pridal prácu bez toho, že by niečo zobral“. Preto test pre každý náš návrh: **čo lekárovi ubudne, keď to použije?**

### 1.2 ČR: odpor, ankety a postoje

| Dátum | Kto | Čo povedal / zistil | Značka |
|---|---|---|---|
| **5. 10. 2015** | Medical Tribune: zástupcovia ČLS JEP (Svačina, Zeman, Mucha, Dušek) | Lekári nie sú proti elektronizácii (eRecept, eNeschopenka, zdieľanie snímkov vítajú), ale odmietajú plošnú povinnosť, netestované nástroje a projekty, ktoré pridávajú byrokraciu; uspejú len nástroje, ktoré papierovanie zmenšia. Mucha: jedna minúta navyše na pacienta pri 35 až 90 pacientoch denne = asi 1,5 h denne. | [čiastočne; sprostredkovaný súhrn, 2015] |
| **17. 1. 2018** | Zdravotnický deník (ČTK), SPL, Petr Šonka | Prieskum SPL (cca 500 lekárov): viac ako polovica mala s eReceptom problém, 75 % si predĺžilo ordinačné hodiny, takmer štvrtina strávila až 3 minúty navyše na recept, zdržanie až hodina denne; kritika: neprívetivé rozhranie, pomalá odozva, nejasné chybové hlásenia. | [overené, čo článok píše; metodika nevieme] |
| **bez dátumu (z obsahu odhad 2018 až 2019)** | SVL (Býma, Herber), tlačová správa | Praktici trávia asi 40 až 50 % času v ordinácii administratívou (tlačivá ČSSZ, lázeňské poukazy, hlásenia poisťovniam); „prepisujeme a posielame si papiere“. Je to vyhlásenie spoločnosti, nie meranie. | [čiastočne; dátum nevieme] |
| **11. 6. 2024** | VZP prieskum (zber 8. až 17. 4. 2024) | 220 poskytovateľov (112 praktikov pre dospelých, 108 pre deti). Administratíva 3,5 na škále 1 až 5 = najhoršie hodnotená oblasť; nespokojnosť rastie s dĺžkou praxe, počtom pacientov a vo veľkých mestách. Článok nehovorí, ktoré tlačivá ani IT. | [overené] |
| **5. 1. 2026** (podpis 31. 12. 2025) | SVL ČLS JEP (Býma, Mucha) a SPL | K ePosudkom od 1. 1. 2026: autori pochybujú, že to bude fungovať v softvéri ordinácií (AIS); ak nie, radia pokračovať papierovo. Dôvod: systém sa ešte ladil na konci 2025. | [overené, svl.cz] |
| **15. 8. 2026** | Zdravotnický deník (ČTK) | ČLK nesúhlasí s novými povinnosťami pod sankciou, kým systém nefunguje; v dohodovacom konaní 2027 chýba podpora úprav softvéru pre špecialistov a praktikov; žiada kompenzáciu a zrušenie povinného výlučne elektronického vedenia dokumentácie (alebo odklad aspoň na 26. 3. 2031). Povinné eŽádanky: od júla 2027 (konzíliá, zobrazovanie, rehabilitácia), laboratórne o pol roka neskôr; dokumentácia od 2029. | [overené] |
| **23. a 25. 9. 2026** | ZD (ČTK), ITBiz (ČTK): Koalícia súkromných lekárov (~23 000 lekárov; hovorili Šonka za SPL, Dvořák za gynekológov, Jojko za SAS) | Odhad nákladov na digitalizáciu súkromných ordinácií 15 mld. Kč (asi 100 000 Kč na bežnú ordináciu, 150 až 250 000 na zubnú), žiadosť o eurofondy 2028 až 2034. Praktici hovoria, že výsledky a prepúšťacie správy dostávajú ťažko a papier prepisujú ručne; digitalizáciu vítajú. Metódu odhadu článok neuvádza. | [overené; metodiku nevieme] |
| **8. 10. 2026** | Zdravotnický deník (Koubová) | MZ vyriešilo 238 podstatných pripomienok od 23 subjektov a zamietlo väčšinu požiadaviek komôr (odklad, bezsankčné obdobie, kompenzácia). Náklady podľa MZ: ~207 mil. Kč ročne na IT podporu pre ~25 000 ambulantných poskytovateľov, prvý rok 658 až 732 mil. Kč. MZ pripúšťa, že malé samostatné ordinácie môžu mať veľkú finančnú a organizačnú záťaž; sankcie budú posudzované individuálne. | [overené] |
| **29. 6. 2026** | Vitalia (Válková) | eŽádanka sa skúša od 1/2026, vystavených asi 2 000; odhad, že asi 70 % dodávateľov softvéru ju zavedie v 2026; povinnosť od 1. 7. 2027 (konzíliá, zobrazovanie, rehabilitácia, kúpele) a 1. 1. 2028 (laboratórne). Riaditeľ NCEZ: dodávatelia softvéru sa pripájajú rôznym tempom. | [overené] |
| **31. 12. 2025 (aktual. 2. 1. 2026)** | MZ tlačová správa | Priamy prístup cez Portál elektronického zdravotníctva zostáva vždy základnou a funkčnou možnosťou; softvér ordinácií sa bude prepájať postupne. (Pozor: vyhľadávač mi tvrdil, že MZ označuje prepojenie s AIS za „preferované“. Správa to **nehovorí**.) | [overené] |

**Čo z toho plynie [odhad]:**
- Odpor praktikov má tri konkrétne dôvody: (1) systém nefunguje v ich softvéri, (2) žiadne peniaze na úpravy, (3) čas navyše na pacienta. Nič z toho nie je „nechcú sa učiť“.
- Pre koordinátorský nástroj to znamená: **nič, čo vyžaduje od lekára zmenu softvéru, školenie alebo nový účet, nebude mať adopciu v roku 2026 až 2027.**
- Naopak, tam, kde nový kanál nahradí prepisovanie (prepúšťacia správa prichádza elektronicky namiesto papiera), lekári ho vítajú (eZpráva).

### 1.3 Čo lekári v ČR reálne používajú (a nikto ich k tomu nenútil)

| Kanál | Dôkaz | Značka |
|---|---|---|
| **Telefón + e-mail koordinátorky** | FN Olomouc (4. 11. 2025): koordinátorka (netradične nie zdravotníčka) hovorí, že je to „hodne kancelárska práca s e-mailom a telefónom“; prejde jej asi 15 až 20 pacientov týždenne. | [overené] |
| **Formulár + telefón** | Bulovka, rozhovor so Vaňkovou (ZD 4. 6. 2026): odosielajúci lekári formulár poznajú; keď praktik zistí podozrenie na rakovinu pankreasu, zavolá koordinátorke; ~10 pacientov týždenne; lekári boli spočiatku zdržanliví a nevedeli, čo od koordinátora žiadať; štandardný systém na kontaktovanie odosielajúcich lekárov v spádovej oblasti neexistuje. | [overené] |
| **Online formulár (MS Forms) alebo Word e-mailom na ugo@bulovka.cz, snímky cez ePACS** | Stránka Bulovka ÚGO: postup pre lekárov je „kontaktujte koordinátorku, pošlite formulár (online alebo Word), priložte epikrízu, výsledky, snímky cez ePACS“. Žiadna registrácia ani prihlásenie sa na stránke nespomína. Dátum nie je uvedený (cesta k Word súboru obsahuje 2025/09/23). | [overené; dátum odhad] |
| **Elektronická žiadosť o koordináciu (webový formulár)** | MOÚ Brno, krajský koordinátor: formulár na stránke vyžaduje identifikáciu žiadateľa a pacienta, diagnózu, predošlé výsledky, dôvod; má pole na prílohy a antispam. Či treba prihlásenie, stránka nehovorí. Telefón je uvedený. Dátum nie je. | [overené] |
| **eZpráva (zabezpečená pošta)** | Stránka eZprava.net / lekarskyemail.cz (načítané 16. 10. 2026, bez dátumu): vznik 2014 na Mostecku, dnes po celej ČR, používajú ju praktici, špecialisti, nemocnice a laboratóriá; ~5 mil. správ ročne; cena 399 Kč ročne bez limitu správ (prvý rok zdarma); vyvíjaná so Sdružením praktických lékařů ČR; funguje nezávisle od AIS; ponúka aj „virtuálnu tlačiareň“, cez ktorú sa dá poslať správu z ktoréhokoľvek systému. Staršia verzia whitepaperu hovorí, že odosielanie aj príjem sú zadarmo. | [overené, firemný zdroj] |
| **Správy z nemocníc do eZprávy** | FN Hradec Králové (16. 6. 2025) posiela prepúšťacie správy registrovaným praktikom automaticky cez eZprávu; tým, ktorí v nej nie sú, ďalej poštou. | [čiastočne; z našich starších poznámok] |

**Poučenie [odhad]:** V ČR už existuje kultúra „pošlem formulár a zavolám“ a „pošlem správu cez eZprávu“. Dá sa na ňu nalepiť, bez toho, aby sme učili niekoho nový program.

---

## 2. Vzory „bez novej appky“ (zero-UI)

„Zero-UI“ tu znamená: **lekár nemusí otvoriť novú obrazovku, ktorú nepozná.** Nie je to vždy úplne pravda (ZorgDomein má obrazovku, ale lekár ju otvára zo svojho systému), preto pri každom vzore píšem, čo musí lekár urobiť.

### 2.1 Prehľadová tabuľka

| # | Vzor | Čo musí urobiť lekár | Kto robí prácu | Funguje s ľubovoľným AIS? | Reálny príklad |
|---|---|---|---|---|---|
| **P1** | **Jedna e-mailová adresa (rola-schránka) + automatické spracovanie príloh** | Pošle e-mail s prílohou (PDF, Word, fotka) tak, ako dnes | Koordinátor + AI (vyťaží, koordinátor potvrdí) | Áno | MZ pokyn HPB (CZ), Bulovka (Word e-mailom), NHS 2WW (nhs.net), US Direct |
| **P2** | **Webový formulár bez registrácie** | Klikne na odkaz, vyplní polia, nahrá prílohy | Lekár vypĺňa; koordinátor kontroluje | Áno (stačí prehliadač) | Bulovka (MS Forms), MOÚ Brno |
| **P3** | **Integrácia do žiadanky v AIS/NIS** | Vyberie „odoslať“ vo svojom systéme | Výrobca softvéru + sieť (ZorgDomein, e-RS, eŽádanka) | Len tam, kde výrobca prepojenie spravil | ZorgDomein (NL), e-RS (UK), eŽádanka (CZ) |
| **P4** | **SMART on FHIR** (malá aplikácia otvorená zo systému s kontextom pacienta) | Klikne na odkaz v systéme | Výrobca musí podporovať FHIR a SMART | Nie, len moderné systémy | Epic/Oracle svet; v ČR doložené zatiaľ nie |
| **P5** | **Pull z existujúcich koľajníc** (koordinátor si berie dáta sám) | Nič | Rozhranie a súhlasy | Len keď zdroj vystaví rozhranie | GP Connect (UK), SZZ/eŽádanka API (CZ), FHIR |
| **P6** | **Push notifikácia späť lekárovi** (záver MDT, stav) | Nič, dostane to v kanáli, ktorý používa | Koordinátor / systém | Áno, ak ide e-mailom, eZprávou či poštou | SCR „MDT Outcome Letter to GP“, ADT oznámenia v USA |

### 2.2 P1: jedna adresa + automatické spracovanie príloh

**Čo je doložené:**
- **Štát to v ČR už predpisuje pre HPB centrá.** Metodický pokyn MZ (účinný od 1. 9. 2026, čl. 4): komunikačné kanály sú web, e-mail a telefón koordinátora; e-mail aj telefón majú byť univerzálne a nezávislé od zmeny ľudí. V prílohe je zoznam centier s generickými adresami typu „koordinace-hpb@…“ a telefónmi [overené, https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf].
- **Bulovka**: lekár môže vyplnený Word formulár poslať e-mailom na adresu ugo@bulovka.cz [overené].
- **Anglicko**: dokument Royal Orthopaedic Hospital pre urgentné odporúčanie pri podozrení na kosťovú a mäkkotkanivovú rakovinu: po vyplnení poslať e-mailom na vyhradenú adresu nhs.net, nekompletné odporúčania sa neprijímajú, priložiť zhrnutie z karty praktika [overené, 1 dokument, bez dátumu]. Iné miestne dokumenty udávajú podobné „generické adresy“ (podľa vyhľadávača) [čiastočne]. Rozhodnutie, e-RS verzus e-mail, závisí od miestnej nemocnice [čiastočne].
- **USA, Direct**: je to zabezpečený „e-mail pre lekárov“, ktorý spustili v roku 2010; ONC (15. 7. 2025) uvádza 2,7 mil. adries a 5,3 mld. správ; v roku 2023 ho často používalo 58 % nemocníc na odosielanie informácií, najviac zo všetkých meraných spôsobov [overené, https://healthit.gov/blog/interoperability/achieving-widespread-use-of-direct-secure-messaging-by-us-hospitals/].
- **Automatické spracovanie príloh sa už predáva**: Tennr (USA) číta faxové a e-mailové odporúčania, vyťaží údaje a pošle ich do systému praxe; ich investor IVP uvádza presnosť nad 99,8 % (nenezávislé neoverené) a ~10 mil. dokumentov mesačne [čiastočne; firemné a investorské zdroje].

**Čo musí vedieť náš návrh:**
- ÚOOÚ (FAQ zdravotníctvo, bez dátumu) hovorí, že dôležitejšie časti dokumentácie (napr. celé lekárske správy) majú ísť zabezpečenejšie než obyčajný e-mail a pacienta treba poučiť o rizikách; menej citlivé časti (napr. snímky) môžu ísť spôsobom, ktorý si pacient zvolil a zaznamenal sa [overené, https://uoou.gov.cz/profesional/qa-otazky-a-odpovedi/zdravotnictvi].
- **Nevieme**, ako to v praxi riešia koordinátori Bulovky a FN Olomouc a čo hovorí právnik/DPO na prijímanie správ na jednu adresu. Zabezpečená alternatíva v ČR existuje: eZpráva (šifrovanie na strane klienta, S/MIME). **Nevieme**, či eZpráva dovolí automatizovaný príjem treťou stranou (pravidlá z roku 2016 hovoria, že klienty tretích strán sú povolené, ak spĺňajú štandardy; či to platí dnes, nevieme) [čiastočne].

### 2.3 P2: webový formulár bez registrácie

- Bulovka používa **MS Forms** a MOÚ vstavaný formulár s prílohami a antispamom [overené]. Obe stránky nehovoria o povinnom prihlásení.
- Výhoda: nič sa neinštaluje, funguje v ľubovoľnom prehliadači, štruktúra polí zaručí, že príde všetko dôležité (Bulovka vymenúva výsledky, ktoré potrebuje).
- Slabina: lekár údaje **opäť prepisuje** z ordinačného systému. To je presne tá práca, na ktorú sa sťažujú (prepisovanie). Preto formulár nie je finálne riešenie, len prechodné [odhad].
- Štátny analóg: eŽádanka cez webový portál (základná, vždy funkčná cesta pre poskytovateľov) [overené, MZ 2. 1. 2026]. Toto nemáme dôvod duplikovať: prednáška pred hackathonom odporúča **nestavať vlastný systém žiadaniek**, štát ho stavia [čiastočne, naše poznámky z 02-prehack-prednasky.md].

### 2.4 P3: integrácia do žiadanky v systéme lekára

**ZorgDomein (Holandsko), firemný zdroj, stránky načítané 16. 10. 2026, bez dátumu:**
- Vznik v roku 2000 ako papierový zoznam odporúčaní („verwijsklapper“), v roku 2001 digitálna verzia [overené, firemný zdroj].
- Podľa vlastných čísel: 95 % praktikov používa ZorgDomein na hľadanie nadväzujúcej starostlivosti, 27 mil. odporúčaní, žiadostí a pod., 160 000 zdravotníkov s osobným účtom, 8 800 organizácií, 120+ prepojení na elektronické záznamy, 100-milióntu odporúčanie spracovali 16. 3. 2022 [firemný zdroj].
- Prepojenie: 58 % pripojených zariadení už má integráciu so svojím záznamovým systémom; odporúčania a žiadosti sa potom objavia automaticky v ich systéme, bez ručného prepisu; používa sa HL7 a FHIR [firemný zdroj]. ZorgDomein píše, že má prepojenia „na všetky informačné systémy praktikov a pôrodných asistentov“ [firemný zdroj].
- Detail pre praktika (podľa vyhľadávania, sprostredkované): lekár spúšťa ZorgDomein zo svojho systému, údaje o pacientovi a praxi sa predvyplnia; zamestnanci ordinácie používajú vlastný účet s plnomocenstvom lekára [čiastočne].
- **Poučenie [odhad]:** Aj „zero-UI“ ZorgDomein má obrazovku a účet. Zaviedol sa preto, že nahradil niečo, čo lekár už mal (papierový zoznam), a že sa dostal do jeho systému. A trvalo to viac než 20 rokov. Pre hackathon nereálne.

**NHS e-RS (Anglicko):**
- Nahradil Choose and Book 15. 6. 2015; po spustení boli výpadky a praktici išli na fax [čiastočne, Wikipedia a jej zdroje].
- Cez API (FHIR, verzia STU3) je možné e-RS funkcie volať priamo z ordinačného systému namiesto webu [čiastočne, vyhľadávanie vývojárskej dokumentácie NHS England; stránku NHS som nemohol otvoriť].
- Zásadný poučný moment: od 1. 10. 2018 mohli nemocnice podľa štandardnej zmluvy NHS odmietnuť papierové odporúčania z praxe na prvé konzultantské ambulantné vyšetrenie, a nedostali by za ne platbu. Platilo to aj pre urgentné odporúčania pri podozrení na rakovinu [čiastočne; 3 zdroje z vyhľadávania, žiaden z England.nhs.uk]. **Adopciu teda nespôsobila krásna appka, ale zmluvný tlak.** V ČR podobný tlak plánuje MZ (povinné eŽádanky od 2027); dôsledky sú vyššie, vidno v časti 1.2.

**Somerset Cancer Register (Anglicko), zdroj: stránka Somerset NHS Foundation Trust, načítané 16. 10. 2026:**
- Je to „tracker“ pre onkologické pacientov a MDT (webová aplikácia; od odporúčania praktika po koniec liečby) [overené, firemný zdroj].
- Prepojenia: **eImport** (HL7 spojenia na patológiu, rádiológiu a endoskopiu, a na protinádorovú liečbu, rádioterapiu a chirurgiu), **eReferral** (HL7, predvypĺňa obrazovku odporúčania údajmi o pacientovi a termínoch; zdarma pri kúpe SCR), **eDocuments** (posiela PDF, napr. **MDT Outcome Letter to GP**, priamo do dokumentového systému nemocnice), **eTertiary** (posielanie odporúčaní medzi nemocnicami so SCR) [overené, firemný zdroj].
- Skutočnosť: bez prepojenia sa dáta prepisujú. Správa nemocnice z roku 2014 hovorí, že nie sú prepojenia na priame aktualizácie z klinických systémov a dáta sa zadávali dvakrát; novšie pracovné inzeráty (Frimley) opisujú, že pracovníci zapisujú odporúčania do SCR z EPIC, e-RS alebo z listov [čiastočne].
- **Poučenie [odhad]:** koordinátorský nástroj nie je „kúzlo“, ale súčasť nemocničnej infraštruktúry. Zaujímavé je, že **výstup** (záver MDT pre praktika) ide cez už existujúci dokumentový systém, nie cez novú appku pre praktika.

### 2.5 P4: SMART on FHIR

- Špecifikácia SMART App Launch (verzia 2.2.0): popisuje, ako sa aplikácia spustí z relácie v EHR a dostane „launch context“ (napríklad vybraného pacienta) bez znovuprihlasovania; druhý režim („Backend Services“) je pre automatizované programy bez používateľa [overené, https://hl7.org/fhir/smart-app-launch/].
- V ČR: vo firemných materiáloch výrobcov AIS/NIS nebola podpora FHIR doložená; štátne API eŽádanky je REST + JSON + OAuth 2.0, nie SMART [čiastočne, z G1].
- **Dôsledok [odhad]:** SMART je dobrý cieľ do budúcna a vhodný ako výstupný formát (FHIR), ale **nie je to cesta ako dostať dáta od praktika v ČR v roku 2026.** Prednášajúci pred hackathonom (Tichopad) naopak hovoria, že výmena má ísť cez FHIR až do nástrojov koordinátorov [čiastočne, naše poznámky]. Rozpor sa dá zmieriť: **FHIR použiť vnútri a na výstupe, vstup zbierať kanálmi, ktoré lekári už majú.**

### 2.6 P5: push alebo pull

| | **Push** (odosielateľ pošle) | **Pull** (príjemca si vezme) |
|---|---|---|
| Príklady | e-mail, formulár, eZpráva, US Direct, fax | FHIR dotaz, API eŽádanky (ulož/vyhľadaj/načítaj), SZZ, GP Connect |
| Práca lekára | Malá, ale **každý raz** niečo musí urobiť | Nulová, ak už raz boli nastavené oprávnenia |
| Potrebuje | Len kanál, ktorý obe strany majú | Rozhranie na strane zdroja, súhlasy, autentifikácia |
| V ČR dnes pre onkológiu | **Áno** (e-mail, telefón, formulár, eZpráva) | **Zatiaľ nie** (SZZ len vybrané štruktúrované dáta; centrálne úložisko dokumentov neexistuje; eŽádanka cez API je koncept) [čiastočne] |
| Riziko | Nekompletné dáta, zlý formát | Rozhrania sú drahé a lokálne; výrobcovia ich neotvárajú (G1) |

**Záver [odhad]:** Pre rok 2026 treba **push na vstupe** (bez námahy pre lekára), **pull ako ďalšiu vlnu**, keď budú koľajnice (SZZ, eŽádanka API). Na rozhraní oboch svetov dáva zmysel „koordinátor je ten, kto aktívne zavolá a stiahne“, čo je dnes realita (Bulovka, FN Olomouc).

### 2.7 P6: notifikácie praktikovi

- **SCR**: výstup MDT (Outcome Letter to GP) sa posiela do bežného dokumentového systému [overené, firemný zdroj].
- **USA (CMS)**: od 1. 5. 2021 musia nemocnice posielať oznámenia o prijatí, prepustení a preložení pacienta jeho praktikovi alebo inému zodpovednému poskytovateľovi (pravidlo vydané 1. 5. 2020); technológia je ľubovoľná [čiastočne; vyhľadávanie CMS FAQ].
- **ČR**: FN Hradec Králové posiela prepúšťacie správy praktikom automaticky cez eZprávu [čiastočne].
- **Pozor na schránku [odhad]:** Praktik v štúdii (Arndt 2017) trávi v schránke EHR v priemere 85 minút denne [overené]. Každá naša notifikácia je ďalšia správa. Posielať len to, čo vyžaduje akciu alebo čo praktik chce (záver MDT, potvrdenie prijatia s tým, čo chýba), v kanáli, v ktorom komunikuje.

---

## 3. Návrh pre nás: rebrík „bez novej appky pre lekára“ [odhad]

**Zásada:** nová appka je len pre koordinátora. Lekár používa to, čo má. Appka je „prijímač a skladač“, nie ďalšia sieť.

| Stupeň | Čo urobí lekár | Čo urobí appka | Pripravenosť v ČR 2026 | Poznámka |
|---|---|---|---|---|
| **0. Telefón** | Zavolá koordinátorovi | Koordinátor si zapíše hovor (diktát alebo rýchla poznámka), appka doplní kartu a pošle odpoveď e-mailom, čo ešte chýba | Hotové (Bulovka, FN Olomouc) | Najlacnejšie a najlepšie na začiatok. Vzniká záznam o pôvode údaja („z telefonátu, kto, kedy“). |
| **1. E-mail na jednu adresu** | Pošle e-mail s prílohami (PDF, Word, fotka) | Príjem do spoločnej schránky, AI vyťaží údaje a navrhne ich do profilu, koordinátor potvrdí; autoodpoveď odosielateľovi, čo ešte chýba | Hotové ako prax; právny a bezpečnostný rámec **nevieme** (časť 2.2) | Zodpovedá pokynu MZ pre HPB. Zdroj údajov a dôveryhodnosť musia byť vidieť pri každom poli. |
| **2. Odkaz na formulár** | Klikne na odkaz (z e-mailu koordinátora, QR), vyplní ho, nahrá prílohy | Formulár bez prihlásenia; polia podľa toho, čo koordinátor potrebuje na MDT; predvyplnené, čo sa dá | Hotové ako prax (Bulovka, MOÚ) | Lekár prepisuje. Preto odkaz, nie povinnosť. |
| **3. eZpráva** | Pošle zo svojho systému (virtuálna tlačiareň alebo eZpráva klient) | Prijímacia adresa koordinátora v eZpráve, spracovanie DASTA a PDF/A príloh | Kanál existuje; **či sa dá automatizovať príjem, nevieme** | Overiť u prevádzkovateľa eZprava.net s.r.o. |
| **4. Štátna eŽádanka** | Vystaví žiadanku v AIS alebo portáli, ako bude povinné | Prijme/načíta cez API, ak sa koordinátor stane „poskytovateľom“ s oprávnením | Pilot od 1/2026; povinná od 7/2027 a 1/2028; API je koncept | **Nestavať vlastný žiadankový systém** |
| **5. AIS/NIS integrácia, FHIR, SMART** | Nič nové | Pull dát alebo SMART aplikácia | Nepripravené (G1) | Druhá vlna, mimo hackathonu |

**Výstup späť praktikovi:** záver MDT a plán odoslať **tým istým kanálom, ktorým dáta prišli** (e-mail, eZpráva, pošta) alebo cez nemocničný dokumentový systém, nie cez novú appku pre praktika.

**Čo z toho vyplýva pre produkt a demo [odhad]:**
1. Ukázať príjem z e-mailu a z odkazu na formulár. Obidva sú doložené v praxi a nepotrebujú nič od lekára.
2. AI len **navrhuje**, rozhoduje a potvrdzuje koordinátor (to sa zhoduje aj so zadaním VZP).
3. Každý údaj nesie **pôvod** (od koho, kedy, z akého kanála, ktorá príloha). Bez toho koordinátor nemá dôvod veriť.
4. Výstup vo FHIR a v čitateľnej podobe pre MDT. Nestavať vlastnú centrálnu databázu pacientov a nevymýšľať vlastné žiadanky.
5. Zámerne **nesľubovať** napojenie na NIS/AIS ani „všetci lekári to budú používať“. Povedať: „začíname kanálmi, ktoré lekári dnes používajú.“
6. V ukážke používať len vymyslené dáta (pravidlo repa).

---

## 4. Čo nevieme a ako to zistiť

| # | Otázka | Prečo na nej záleží | Koho sa opýtať |
|---|---|---|---|
| 1 | Aké je **aktuálne stanovisko SVL ČLS JEP a SPL k eŽádanke** (nie k ePosudkom)? Našiel som len ePosudek z 5. 1. 2026; web SPL je väčšinou len pre členov. | Hlas praktikov | SVL (svl.cz, časopis Practicus), SPL ČR |
| 2 | Existuje **anketa 2025 až 2026** o postojoch praktikov k eŽádanke alebo k novým appkám? Nenašiel som ju. | Dôkaz pre prezentáciu | SVL, SPL, ČLK |
| 3 | Koľko času koordinátor reálne tratí **zháňaním údajov**? Nenašiel som žiadne meranie ani u nás, ani v zahraničí. | Číslo pre prínos nástroja | Vaňková (Bulovka), Švarcová (FN Olomouc), krajský koordinátor MOÚ |
| 4 | Ako sa riešia **bezpečnosť a právo** pri prijímaní správ na jednu e-mailovú adresu? | Tvrdé obmedzenie pre P1 | DPO nemocnice, právnik; MZ/ÚOOÚ |
| 5 | Dovolí **eZpráva** automatizovaný príjem treťou stranou (API/klient)? Aké sú podmienky? | P1 vs P3 (zabezpečený kanál) | eZprava.net s.r.o. |
| 6 | Koľko praktikov používa **eZprávu**? Firma udáva ~5 mil. správ ročne, ale počet používateľov som nenašiel. Zdroje na seba nesedia (účty vs. pracoviská). | Dosah kanála | eZprava.net s.r.o., SPL |
| 7 | Aké **koordinačné softvéry** MZ v pilotoch skutočne skúša (pozri G5: nepomenované)? | Možný konkurent/partner | MZ, NCEZ |
| 8 | Aký je **skutočný model financovania** ZorgDomein (kto platí)? Nenašiel som. | Prenositeľnosť | ZorgDomein, LHV/NVZ (NL) |
| 9 | Aký je **plný text** pokynu MZ o koordinátoroch KOC (nielen HPB) a čo hovorí o e-maile? | Rozšírenie z HPB na všetky KOC | MZ ČR |

---

## 5. Opravy a spoľahlivosť zdrojov (čo som zamietol)

- Vyhľadávač mi na jeden dotaz tvrdil, že SPL podporuje eZprávu za „400 Kč ročne“. Zdroj to nepotvrdil: 400 Kč súvisí s podpisom eReceptu (MZ). **Cena eZprávy je 399 Kč ročne podľa stránky eZpráva** (prvý rok zdarma) [overené, firemný zdroj]. Tvrdenie o podpore SPL ostáva len v podobe „vyvíjané so Sdružením praktických lékařů“ (firemné vyhlásenie) a nezávisle som ho nepotvrdil.
- Vyhľadávač tvrdil, že MZ označuje integráciu eŽádanky do AIS za „preferovanú cestu“. Tlačová správa MZ (2. 1. 2026) hovorí, že **základná a vždy funkčná je cesta cez portál** a prepojenie softvéru sa pridáva postupne. Používam to druhé.
- Vyhľadávač pri Arndtovi 2017 nevedel potvrdiť 5,9 hodiny. Po otvorení abstraktu stránky annfammed.org číslo **platí** (355 min z 11,4-hodinového dňa).
- Čísla CMA (Kanada) a ZorgDomein-detaily o spúšťaní z HIS beriem len ako [čiastočne].
- Stránky `england.nhs.uk` a `digital.nhs.uk` sa nepodarilo otvoriť (blokované), preto všetko o NHS e-RS je z tretích zdrojov [čiastočne].
- Vyjadrenia SVL o „40 až 50 % času“ nemám datované; ide o tlačovú správu spoločnosti, nie o meranie.

---

## 6. Zdroje (URL + dátum; „načítané 16. 10. 2026“ = otvorené v tomto behu)

**Štúdie a prehľady**
- Sinsky a kol., Ann Intern Med, 6. 9. 2016, PMID 27595430: https://pubmed.ncbi.nlm.nih.gov/27595430/ (abstrakt cez Europe PMC, načítané 16. 10. 2026)
- Arndt a kol., Ann Fam Med 15(5):419-426, 9/2017: https://www.annfammed.org/content/15/5/419 (načítané 16. 10. 2026)
- Melnick a kol., Mayo Clin Proc, 2020, PMID 31735343 a PMID 33289493 (abstrakty cez Europe PMC, načítané 16. 10. 2026)
- Yang a kol., 2026, PMID 41908760 (abstrakt cez Europe PMC, načítané 16. 10. 2026)
- Greenhalgh a kol., J Med Internet Res, 2017, PMID 29092808 (abstrakt cez Europe PMC, načítané 16. 10. 2026)
- CMA, „Losing doctors to desk work“, 2025: https://www.cma.ca/physician-wellness-hub/content/losing-doctors-to-desk-work (len z výsledku vyhľadávania)

**ČR: lekári, postoje, politika**
- VZP prieskum, 11. 6. 2024: https://www.vzp.cz/o-nas/aktuality/pruzkum-vzp-cr-s-delkou-praxe-spokojenost-lekaru-klesa-citi-se-vycerpanejsi-a-pocituji-horsi-spolupraci-s-pacienty
- ZD (ČTK), 17. 1. 2018, SPL k eReceptu: https://www.zdravotnickydenik.cz/2018/01/prakticti-lekari-kritizuji-erecept-zdrzeni-pry-az-hodinu-denne-sukl-mlci/
- Medical Tribune, 5. 10. 2015 (Lékaři vs. elektronizace): https://www.tribune.cz/archiv/lekari-vs-elektronizace-zdravotnictvi-ne-to-uz-neplati/
- SVL ČLS JEP, ePosudek, 5. 1. 2026: https://www.svl.cz/odborny-obsah/aktualni-oznameni/eposudek-100151
- SVL, administratíva 40 až 50 % (bez dátumu): https://www.praktickylekarpraha6.cz/odborna-spolecnost-prakticti-lekari-venuji-az-50-procent-casu-administrative
- ZD (ČTK), 15. 8. 2026, povinné e-žádanky: https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/
- ZD (Koubová), 8. 10. 2026, MZ zamietlo výhrady komôr: https://www.zdravotnickydenik.cz/2026/10/elektronizace-natvrdo-ministerstvo-smetlo-vyhrady-komor/
- ZD (ČTK), 23. 9. 2026, 15 mld. Kč: https://www.zdravotnickydenik.cz/2026/09/digitalizace-ordinaci-15-miliard-korun-soukromi-lekari-dotace-od-statu/ ; ITBiz 25. 9. 2026: https://www.itbiz.cz/ordinace-vycislily-naklady-na-elektronizaci-na-15-mld-kc-chteji-dotace/
- Vitalia, 29. 6. 2026: https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/
- MZ tlačová správa o Portáli lekára a pacienta (31. 12. 2025, aktual. 2. 1. 2026): https://mzd.gov.cz/tiskove-centrum-mz/spusteni-nove-digitalni-sluzby-portal-lekare-a-pacienta/
- ČLK KV, 19. 12. 2025, prehľad zmien 2026: https://www.clkv.cz/2025/12/19/elektronizace-zdravotnictvi-od-1-1-2026-prehled-zmen-pro-lekare/
- Metodický pokyn MZ pre HPB (od 1. 9. 2026): https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf
- ÚOOÚ, FAQ zdravotníctvo (bez dátumu): https://uoou.gov.cz/profesional/qa-otazky-a-odpovedi/zdravotnictvi
- eZpráva (Lékařský email), stránka a whitepaper (bez dátumu): https://www.lekarskyemail.cz/ a https://www.lekarskyemail.cz/whitepaper.pdf

**ČR: koordinátori**
- Bulovka ÚGO, pokyny pre lekárov (bez dátumu): https://bulovka.cz/kliniky-a-oddeleni/gastrointestinalni-onkologie/ustav-gastrointestinalni-onkologie-objednani
- MOÚ Brno, krajský koordinátor (bez dátumu): https://www.mou.cz/krajsky-koordinator-onkologicke-pece/t2354
- FN Olomouc, 4. 11. 2025: https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci
- ZD (Koubová), 4. 6. 2026, Vaňková (Bulovka): https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/

**Zahraničné vzory**
- ZorgDomein, o nás, huisartsen a koppelingen (bez dátumu): https://zorgdomein.com/over-ons/ons-verhaal/ ; https://zorgdomein.com/partners/koppelingen/ ; https://zorgdomein.com/onze-oplossingen/epd-koppeling-aanvragen/ ; https://zorgdomein.com/zorgprofessional/huisartsenpraktijken/
- Somerset Cancer Register, interfaces a o produkte (načítané 16. 10. 2026, bez dátumu): https://www.somersetft.nhs.uk/somerset-cancer-register/somerset-cancer-register/interfaces/ ; https://www.somersetft.nhs.uk/somerset-cancer-register/somerset-cancer-register/about-scr-and-rms/
- NHS e-RS (Wikipedia, sekundárne): https://en.wikipedia.org/wiki/NHS_e-Referral_Service ; paper switch-off (vyhľadávanie, bez otvorenia primárnej stránky): https://www.england.nhs.uk/digitaltechnology/connecteddigitalsystems/nhs-e-referral-service/standard-contract-faqs/
- Royal Orthopaedic Hospital, formulár 2WW (bez dátumu): https://roh.nhs.uk/doc-men-hidden/76-new-2ww-referral-for-gp
- ONC/HealthIT.gov, Direct Secure Messaging, 15. 7. 2025: https://healthit.gov/blog/interoperability/achieving-widespread-use-of-direct-secure-messaging-by-us-hospitals/
- CMS, ADT patient event notifications (vyhľadávanie): https://www.cms.gov/priorities/burden-reduction/overview/interoperability/frequently-asked-questions/admission-discharge-and-transfer-patient-event-notification-conditions-participation-cop-42-cfr
- HL7 SMART App Launch 2.2.0: https://hl7.org/fhir/smart-app-launch/
- Tennr (firemné a investorské zdroje): https://www.ivp.com/content/tennr-a-cure-for-healthcare-paperwork/ ; https://fiercehealthcare.com/health-tech/tennr-clinches-101m-build-out-ai-automates-patient-referral-workflows

**Naše staršie poznámky**
- `docs/integracia/g1-cz-systemy.md`, `docs/integracia/g5-svet-appky.md`, `docs/kontext/raw-audit-hry.md`, `docs/research/02-prehack-prednasky.md`
