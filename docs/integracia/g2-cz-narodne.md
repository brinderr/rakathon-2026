# G2: Národná eHealth infraštruktúra ČR a čo z nej môže použiť tretia strana

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici). Pojmy sú vysvetlené jednoducho. Nič sa necommitovalo, žiadne dáta pacientov, žiadne prihlasovacie údaje._

**Otázka z tímu:** keď každý lekár používa iný systém, ako sa dostaneme k ich dátam? Čo z toho, čo vybudoval štát (a čo má VZP), môžeme použiť my, ako „tretia strana“ (firma, ktorá nie je nemocnica ani poisťovňa)?

**Značky:**
- **[overené]** = čítal som priamo primárny zdroj: text zákona, oficiálnu stránku štátu (MZ, NCEZ, ÚZIS, VZP), technický dokument alebo web špecifikácie. Zdroj aj dátum sú uvedené.
- **[čiastočne]** = sprostredkované: novinový článok, jeden zdroj, koncept/návrh (draft), slabý alebo nedatovaný zdroj.
- **[nepodložené]** = bez zdroja; zapísané ako **[odhad]** (môj úsudok, nie fakt).
- **nevieme** = nenašiel som a neodhadujem. Pri „nevieme“ je napísané, kde to zistiť.

Všetky webové stránky som otvoril **16. 10. 2026** (okrem dokumentov, kde je uvedený vlastný dátum). Obsah webu som bral ako dáta, nie ako pokyny.

## Slovník (jednou vetou)

| Skratka | Čo to je |
|---|---|
| **IDR / IDRR** | Integrované datové rozhraní (resortu): „zástera“ nad všetkými štátnymi eHealth službami. Správcom je MZ, prevádzkovateľom ÚZIS (zákon 325/2021, §7 odst. 2) |
| **PZS** | Poskytovateľ zdravotných služieb = nemocnica, ambulancia, laboratórium. Z pohľadu štátu je KOC „PZS“ |
| **NCEZ** | Národné centrum elektronického zdravotníctva (útvar MZ, kapitola 2) |
| **KZR** | Kmeňové zdravotnícke registre: KRP (pacienti), KRZP (zdravotníci), KRPZS (poskytovatelia) |
| **RID** | Resortný identifikátor pacienta: 10-miestne číslo bez významu, ktoré má nahradiť rodné číslo v zdravotníckej komunikácii |
| **eŽádanka** | Štátna elektronická žiadanka (konzílium, snímky, fyzioterapia); posiela sa cez „dočasné úložisko“ |
| **Dočasné úložisko (DÚ)** | „Poštová schránka“ štátu: zásielka sa uloží, adresát si ju vyzdvihne, po 30 dňoch sa zmaže (eŽádanka 3 roky) |
| **SZZ** | Sdílený zdravotní záznam: štátom vedený krátky záznam (krvná skupina, alergie, preventívne prehliadky) |
| **EZKarta** | Mobilná aplikácia štátu pre pacienta (očkovanie, výsledky, prevencia) |
| **NPEZ / eZdraví** | Národný portál elektronického zdravotníctva, web `ezdravi.gov.cz`; vstup pre občana, zdravotníka, poskytovateľa |
| **NCP / NCPeH** | Národné kontaktné miesto pre eHealth: brána pre výmenu pacientskeho súhrnu a eReceptu (v EÚ aj v ČR) |
| **AAfD** | Akreditovaná afinitná doména: plánovaný „smerovač“ (index), ktorý vie, u ktorého poskytovateľa je aký dokument; dokumenty ostávajú u pôvodcu |
| **EZCA II** | Certifikačná autorita eHealth: vydáva certifikáty, ktorými sa systémy preukazujú štátu |
| **JSU** | Jednotná správa uživatelů: štátny systém identity a rolí pre eHealth |
| **NIA** | Národná identita (prihlásenie cez eOP, Bankovú identitu, mojeID) |
| **FHIR** | Moderný štandard zdravotných dát (JSON/REST). **IG** = implementačná príručka: presné pravidlá, ako FHIR použiť pre jeden prípad |
| **EHDS** | Európsky priestor zdravotných dát (nariadenie EÚ 2025/327) |

---

## 0. Odpoveď v 15 bodoch (ak si prečítaš len toto)

1. **Štát nestaval „jednu databázu pacientov“, ale súbor centrálnych služieb**: kmeňové registre, výmenná sieť s dočasným úložiskom, eŽádanka, Registr oprávnění, SZZ, portál, EZKarta, katalóg služieb a NCP (zákon 325/2021 §27). Centrálne služby sú **bezplatné** (§27 odst. 3) [overené].
2. **Všetky tieto služby sú postavené pre poskytovateľov (nemocnice, ambulancie), nie pre „tretie strany“.** Systém sa štátu preukazuje **systémovým certifikátom EZCA II**, ktorý dostane poskytovateľ (jeho štatutárny zástupca) [overené: Manuál EZ pre PZS, FAQ 16. 9. 2026 a „Autentizace k API gateway“ 7. 10. 2026; zákon §42 odst. 1].
3. **Dôsledok pre nás: štátne služby vieme volať len „v mene KOC“** (ako modul alebo dodávateľ KOC), nie ako samostatná firma s vlastným prístupom [odhad na základe bodu 2]. Pre vývoj a demo existuje **verejné testovacie prostredie T2**, určené dodávateľom softvéru [overené].
4. **eŽádanka:** pilot od 1/2026, API verzia 2 (telo žiadanky je **FHIR Bundle**), typy **K (konziliárna)**, Z (zobrazovacia), FT (fyzioterapia). Vystavených bolo asi **2 000** (jún 2026) [čiastočne]. **Povinná od 1. 7. 2027 je zatiaľ len návrh novely**, vláda ju podľa nájdených zdrojov ešte neschválila [čiastočne].
5. **Konziliárna eŽádanka (K) je štátom navrhnutý „vstup do KOC“.** Jej FHIR príručka je však len priebežný build (CI, verzia 1.0.0, 15. 10. 2026), nie vydaný štandard [overené].
6. **Kmeňové registre** (KRP, KRZP, KRPZS) majú REST API (JSON). Smú ich čítať len vymenované osoby: poskytovatelia, poisťovne, ministerstvá, úrady. **Firma-tretia strana na zozname nie je** a údaje z KRP sa nesmú použiť na iný účel než poskytovanie zdravotných služieb (§24 odst. 2, pokuta do 50 000 Kč) [overené].
7. **NRPZS** (zoznam poskytovateľov) je **verejný** (vyhľadávanie + otvorené dáta, dataset sa práve sťahuje do Národného katalógu otvorených dát). **NRZP** (zdravotníci) je neverejný. **ROB** (register obyvateľov) tretia strana nevidí; KRP ho volá za poskytovateľa [overené / čiastočne].
8. **SZZ obsahuje len emergentný záznam a výsledky prevencie/screeningu, onkologické správy tam nie sú.** Pacientsky súhrn je **dobrovoľný** (o jeho vedení rozhoduje poskytovateľ) a prechádza cez NCP [overené: zákon 325/2021 §34a; zákon 372/2011 §56a].
9. **Jednotná cesta „nemocnica ↔ nemocnica“ pre dokumenty ešte nie je v ostrej prevádzke.** Štandard AAfD má stav **DRAFT** (verzia 09 rev. d, 16. 3. 2026), HIE príručka (MHD + ATNA) je **verzia 0.0.1 draft** (15. 10. 2026). Novela navrhuje „registrované výmenné siete“ [overené / čiastočne].
10. **NCP (NCPeH CZ):** správca MZ, prevádzkovateľ Kraj Vysočina. K 30. 8. 2026 je **30 z 37** uvedených poskytovateľov pripojených, medzi nimi podľa môjho priradenia aj **≈11 z 15 KOC**. Používa **CDA**, nie FHIR [overené / odhad pri priradení KOC].
11. **HL7 ČR vydalo (STU 1.0, FHIR R4):** CZ Core, terminológiu, nález obrazového vyšetrenia, **nález laboratórneho vyšetrenia** a žiadanku na obrazové vyšetrenie. **Prepúšťacia správa (0.1.0), pacientsky súhrn (0.0.1), ambulantná správa (0.1.0), lab. žiadanka (0.0.1) sú drafty. Onkologický IG v ČR neexistuje**; európsky Cancer Common Model je v ballote [overené].
12. **EHDS:** nariadenie platí od 26. 3. 2025; vykonávacie akty do 3/2027; **pacientsky súhrn a eRecept 26. 3. 2029; snímky, laboratórne výsledky a prepúšťacie správy 26. 3. 2031** [overené].
13. **VZP:** poskytuje **VZP Point** (webová aplikácia) a **B2B webové služby** (overenie poistenia, registrujúci lekár, „overenie poskytnutej starostlivosti“, odovzdanie dávok). Dokumentácia WSDL/XSD je verejná, **používať ich smie poskytovateľ so zmluvou a certifikátom**. **API na „čo bolo pacientovi vykázané“ pre tretie strany nenašlo som**; pacient to vidí v Moje VZP s oneskorením do ~50 dní + až 3 mesiace [overené].
14. **„Komunikačný uzol vo VZP“** je len jedna veta v poznámkach k slajdu 2 zadania. Žiadny iný zdroj nenašiel som: **nevieme, čo presne VZP myslí** [overené: deck; inak nevieme]. Podobný uzol už existuje v štáte (NIX-ZD uzol nad výmennými sieťami) [overené].
15. **Čo z toho plynie [odhad]:** neslúbiť „napojíme sa na štát“. Povedať: „vrstva nad čímkoľvek; vstup je to, čo koordinátor už dostáva; výstup je FHIR v štátnych profiloch; do architektúry dávame pripravené adaptéry (KRP/RID, eŽádanka K, NCP), ktoré sa zapnú cez certifikát KOC“.

---

## 1. Zákon 325/2021 Sb. a termíny

### 1.1 Čo zákon robí
- Zákon o elektronizaci zdravotnictví: platnosť od 8. 9. 2021, účinnosť od 1. 1. 2022; aktuálne znenie k 1. 4. 2026, verzia 9 [overené: https://www.zakonyprolidi.cz/cs/2021-325, 16. 10. 2026].
- Stavba zákona: časť 2 (§7–37) = Integrované datové rozhraní; hlava IV obsahuje **kmeňové registre** (§16–25), **služby vytvárajúce dôveru** (§26), **centrálne služby** (§27–36) a **žurnál činností** (§37) [overené].
- Centrálne služby (§27 odst. 1): a) nahliadanie do kmeňových údajov, b) zápis do KRP, c) výmenná sieť, d) eŽádanka, e) Registr oprávnění, f) SZZ, g) Portál elektronického zdravotníctva, h) EZKarta, i) katalóg služieb; podľa odst. 2 aj NCP. **Sú bezplatné** (odst. 3) [overené].
- Výmennú sieť zriaďuje ministerstvo: bezpečný šifrovaný kanál na odovzdávanie a zdieľanie dokumentácie medzi poskytovateľmi, poskytovateľmi a pacientmi, poskytovateľmi a poisťovňami, ÚZIS, IPZS (§30) [overené].
- **NCEZ v zákone nie je ako orgán vôbec spomenutý**; zákon hovorí o ministerstve (správca) a ÚZIS (prevádzkovateľ) [overené: §7 odst. 2].

### 1.2 Povinnosti poskytovateľov a kedy začali platiť (platné právo)

| Od kedy | Čo | Zdroj |
|---|---|---|
| 1. 1. 2022 | Zákon účinný (základ) | §45 [overené] |
| 1. 1. 2023 | Väčšina IDR: §7 odst. 3, §8, §10–15, §18, §20–24, **§26–37 (centrálne služby)**, §41; ministerstvo malo služby zriadiť (§44) | §45 písm. b [overené] |
| 1. 7. 2023 | §5, §16 odst. 4, §17 | §45 písm. c [overené] |
| **1. 1. 2025** | **§4 písm. a): poskytovateľ dodržiava štandardy elektronického zdravotníctva** vydané MZ | §45 písm. e [overené] |
| **1. 1. 2026** | **§4 písm. b–d:** využívať kmeňové údaje; evidovať v IS identifikátory zdravotníkov a pacientov (RID); zaznamenávať činnosť všetkých prihlásených pracovníkov | §45 písm. d [overené] |
| 1. 1. 2026 | Novela **236/2025 Sb.** (eŽádanka, EZKarta, úpravy SZZ). Presné znenie som nečítal [čiastočne: https://www.pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-zakona-o-elektronizaci-zdravotnictvi]; vláda ju schválila 2. 10. 2024 [čiastočne: https://mzd.gov.cz/tiskove-centrum-mz/vlada-schvalila-novelu-zakona-o-elektronizaci-zdravotnictvi/] |

Ďalšie pravidlá z textu:
- **§42 odst. 1:** správca informačného systému, ktorý pristupuje k IDR, zabezpečí, aby sa jeho IS autentizoval **resortným systémovým certifikátom** [overené].
- **§5:** poskytovateľ určí „pověřené pracovníky“, overí ich totožnosť a prideľuje im prístupy; **ak je pracovník zdravotník, overí ho v KRZP**. Zákon teda počíta aj s pracovníkmi, ktorí zdravotníci nie sú (napr. koordinátor bez zdravotného vzdelania) [overené, výklad odhad].
- **Pokuty (§40):** do 25 000 Kč (§5 písm. a, zápis do KZR) a do 50 000 Kč (nedodržanie štandardov, neprijatie eŽádanky, neevidovanie identifikátorov, zneužitie údajov z KRP zdravotníkom); prejednáva ministerstvo (§41) [overené].
- **Prijať eŽádanku musí každý oprávnený poskytovateľ** (§31a odst. 4 písm. a), ak tomu nebráni technické vybavenie alebo zákonné právo odmietnuť; **vystaviť** ju elektronicky zatiaľ povinné nie je (pozri 1.3) [overené].

### 1.3 Pripravovaná „novela 2.0“ (návrh, nie platné právo)

| Čo | Termín podľa návrhu | Zdroj a istota |
|---|---|---|
| eŽádanka povinná: konzílium, zobrazovanie, rehabilitácia (podľa Vitalie aj lázně) | **1. 7. 2027** | MZ, 24. 6. 2026 [overené: https://mzd.gov.cz/tiskove-centrum-mz/elektronizace-zdravotnictvi-pokracuje-ministerstvo-predstavilo-nove-moznosti-prace-se-zdravotnickymi-daty-i-dalsi-legislativni-zmeny/]; lázně: Vitalia 29. 6. 2026 [čiastočne] |
| eŽádanka laboratórna | **1. 1. 2028** (Vitalia) vs. „koniec 2027“ (Zdravotnický deník 24. 6. 2026) | [čiastočne], zdroje sa rozchádzajú |
| Povinná elektronická zdravotnícka dokumentácia | **od 2029** (1. 1. 2029 podľa ZD 24. 6. 2026) | [čiastočne], v iných článkoch „26. 3. 2029“ pre pacientsky súhrn |
| Pacientsky súhrn ako elektronický záznam | 26. 3. 2029 | Zdravotnický deník, august 2026 [čiastočne] |
| Ďalšie kategórie (lekárske správy, laboratórne a diagnostické výsledky, prepúšťacie správy) | 26. 3. 2031 | tamtiež [čiastočne] |
| Registrované výmenné siete, SZZ, prepojenie zdravotných a sociálnych dát, príprava na EHDS | bez dátumu v tlačovej správe | MZ 24. 6. 2026 [overené] |
| Papierová žiadanka | dovolená len pri výpadku elektriny/internetu/systému, spätne zadať do 3 dní | ZD, august 2026 [čiastočne] |

**Stav legislatívy:** vnútorné pripomienkové konanie skončilo (MZ 24. 6. 2026); vonkajšie skončilo a materiál „čaká na predloženie vláde“ (Zdravotnický deník, 08/2026: https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/). Minister chcel novelu predložiť vláde do konca septembra (ČTK k EZKarte, 3. 9. 2026) [čiastočne]. **Či vláda novelu medzitým schválila: nevieme** (nenašiel som správu). Overiť na `vlada.gov.cz` (program a uznesenia) alebo `odok.cz`.
**Výhrady:** Hospodárska, Lekárska (ČLK) a Stomatologická komora žiadajú prechodné obdobie bez pokút; ČLK chce zrušiť povinnosť viesť dokumentáciu výlučne elektronicky alebo odklad aspoň na 26. 3. 2031 [čiastočne, ZD 08/2026].
**Peniaze:** MZ investovalo do elektronizácie zhruba 1 mld. Kč; náklady na ordinácie nevie presne určiť; súkromní lekári odhadli 15 mld. Kč a chcú dotácie [čiastočne].
Opatřil na prehack dni (15. 10. 2026) to isté zhrnul slajdom „Ďalšia novela 325, návrh 2026: povinná elektronická dokumentácia od 2029, povinné eŽádanky od 2027/2028, registrované výmenné siete/SZZ, vybrané povinnosti EHDS. Nejde o už účinné povinnosti“ [overené: `docs/materials/slack/01-oznameni/Ceske_eHealth_v_kostce_Rakathon_2026_Michal_Opatril.pdf`, slajd 4].

> **Oprava oproti `raw-dataflow.md` §3.1:** tam stálo „žiadny termín povinnosti eŽádanky nie je stanovený“. Dnes existuje **navrhovaný** termín 1. 7. 2027. Právne záväzný ešte nie je. Prijatie eŽádanky záväzné je od 1/2026.

---

## 2. NCEZ: kto to je a kde nájsť čo

- **Právna forma:** NCEZ je **odbor Ministerstva zdravotníctva**, nie samostatná organizácia. MZ 4. 6. 2026 rozhodlo, že ním ostane; časť odborných kapacít sa presúva do FN Ostrava (začiatok 9/2026, hotovo do konca 2026, nový model od 1/2027). Riaditeľ **Petr Foltýn**. Financovanie z EÚ končí v roku 2026, od 2027 má ísť národné [overené: https://mzd.gov.cz/tiskove-centrum-mz/narodni-centrum-elektronickeho-zdravotnictvi-zustane-soucasti-ministerstva-zdravotnictvi-resort-chysta-posileni-kapacit-i-nove-odborne-zazemi-v-ostrave/, 4. 6. 2026]. Tribune (21. 5. 2026) písal o návrhu samostatnej príspevkovej organizácie; MZ nakoniec zvolilo odbor [čiastočne].
- **Čo NCEZ robí:** prevádzkuje eŽádanky, portál eZdraví a EZKartu [čiastočne: Tribune 21. 5. 2026]; vydáva **Standardy EZ**; vedie testovacie prostredia.
- **Národná stratégia elektronického zdravotníctva 2025–2035** (40 cieľov v 5 oblastiach; predstavená 17. 10. 2025). **Nespomína otvorené API ani tretie strany**, len súkromný sektor ako jeden zo zdrojov financovania [overené: https://mzd.gov.cz/tiskove-centrum-mz/narodni-strategie-elektronickeho-zdravotnictvi-cr-2025-2035-prinese-moderni-propojeny-a-bezpecny-e-health-system/, 17. 10. 2025].
- **Kde čo nájsť** (tri weby):
  1. `https://ncez.mzcr.cz/` = štandardy, popisy komponentov, testovacie prostredia, výzvy IROP/NPO (web je občas zastaralý; stránka eŽádanky má v pätičke © 2020).
  2. `https://mzcr.atlassian.net/wiki/spaces/EPZS/overview` = **„Manuál EZ pro PZS“** (kľúč EPZS): živá dokumentácia API, zmeny, FAQ. V zadaní sa volá „národný eHealth manuál“. Presný názov priestoru je „Manuál EZ pro PZS“ („Kuchařka pro integraci poskytovatelů ke službám EZ“) [overené]. **Je verejne čitateľný bez prihlásenia.**
  3. `https://ig.ezdravi.gov.cz/` a `https://hl7.cz/fhir` = FHIR príručky.
- **IROP 78/79/80 a NPO 22:** dotačné výzvy, v ktorých musí projekt poskytovateľa/dodávateľa preukázať napojenie na centrálne služby (kmeňové registre, DÚ, eŽádanka, Registr oprávnění, žurnál, EZCA, NPEZ, notifikácie, SZZ, NIA, NCP) [overené: https://ncez.mzcr.cz/cs/node/5516, https://ncez.mzcr.cz/cs/node/5517]. **Toto je motor, ktorý núti výrobcov NIS/AIS pripájať sa.** Termíny na stránke nie sú. Nevieme, koľko výrobcov to už má hotové (NCEZ odhaduje, že ~70 % výrobcov ambulantného softvéru to zavedie v roku 2026 [čiastočne, Vitalia 29. 6. 2026]).

---

## 3. Národné kontaktné miesto (NCP / NCPeH)

- **Čo to je:** centrálna služba IDR podľa zákona 372/2011 **§69a**; komunikuje s kontaktnými miestami iných štátov EÚ, umožňuje odovzdať **pacientsky súhrn** alebo inú elektronicky vedenú dokumentáciu; **správcom je MZ** [overené: https://www.zakonyprolidi.cz/cs/2011-372, §69a, §56a–56d].
- **Prevádzkovateľ:** **Kraj Vysočina** (projekty NIX-ZD.CZ I–III so SÚKL a MZ, spolufinancované EÚ) [overené: https://ncez.mzcr.cz/cs/narodni-kontaktni-misto-elektronickeho-zdravotnictvi/narodni-kontaktni-misto-pro-elektronicke; Kraj Vysočina, ISSS 2025: https://archiv.isss.cz/archiv/2025/download/prezentace/vysocina_jirakova-pavlinec.pdf].
- **Čo je v ostrej prevádzke:** cezhraničný pacientsky súhrn od 2017; cezhraničný eRecept/eVýdaj od 5/2023; **vnútroštátne** odovzdanie pacientskeho súhrnu pre poskytovateľov aj pre pacienta cez Portál občana a aplikáciu GOV.CZ; v príprave originálne dokumenty, prepúšťacie správy, laboratórne správy, snímky [čiastočne: prezentácia Kraja Vysočina, 2025, dátum bez presného dňa].
- **Dôležité pre nás:** podľa zákona (**§56b**) smie poskytovateľ, ktorý vedie dokumentáciu elektronicky, ju **na žiadosť poskytovateľa, v ktorého starostlivosti pacient je, odovzdať cez NCP**. Čiže **právny základ „KOC si vyžiada dokumenty od iného poskytovateľa“ cez štátny uzol existuje** [overené]. Pacient môže s predávaním do zahraničia vysloviť nesúhlas (§56c) [overené]. Či to reálne funguje medzi dvoma českými nemocnicami v praxi a ako často: **nevieme**.
- **Kto je pripojený:** web `nixzd.cz/poskytovatele` (stav **30. 8. 2026**) uvádza 37 poskytovateľov, **30 s „ANO“**, 7 „v přípravě“ (Liberec, Na Homolce, Pelhřimov, Česká Lípa, Boskovice, Dobřany, Tišnov) [overené: https://www.nixzd.cz/poskytovatele]. Medzi pripojenými sú MOÚ, VFN, Bulovka, FN Královské Vinohrady, FN Hradec Králové, FN Olomouc, FN Plzeň, FN Brno, Krajská zdravotní, Nemocnice Pardubického kraje, KN T. Bati, Nemocnice České Budějovice, Nemocnice Jihlava a ďalší.
  - **Priradenie ku KOC je môj odhad:** z 15 KOC je v zozname ≈ **11** (KV, HK, Olomouc, Plzeň, Zlín, MOÚ, Ústí cez Krajskú zdravotnú, České Budějovice, Jihlava, Bulovka/VFN, Pardubice). Nie sú: Ostrava, Motol (Na Homolce „v přípravě“), Liberec („v přípravě“), Nový Jičín [odhad: názvy som priraďoval ručne].
- **Formáty:** NCPeH uvádza **CDA** (pacientsky súhrn L1, „OrCD L1“), **nie FHIR** [overené: https://ncez.mzcr.cz/cs/node/5517, https://www.nixzd.cz/poskytovatele]. Podporované prípady: PS, eP/eD, originálny dokument, laboratórna správa.
- **Podmienky pripojenia:** dotazník a prevádzkový poriadok na `nixzd.cz`, kontakt `info@nixzd.cz`; konkrétne kroky na samotnej stránke nie sú [čiastočne].
- **Precedens pre „komunikačný uzol“:** v prezentácii Kraja Vysočina je „centrálny uzol NIXZD“, ktorý na dotaz občana pýta všetky pripojené nemocnice a výmenné siete a zobrazí zoznam zariadení s dostupným dokumentom [čiastočne: slajd v prezentácii ISSS 2025].

---

## 4. eŽádanka: špecifikácia, FHIR, API, štatistiky

### 4.1 Čo je (zákon)
- **§31a:** elektronický požiadavok poskytovateľa na zdravotnú službu, odovzdaný cez dočasné úložisko. MZ pridelí unikátny identifikátor; vystavujúci poskytovateľ ju bez odkladu uloží do DÚ, **písomne oznámi pacientovi identifikátor**, na požiadanie ju **vytlačí**; oprávnený poskytovateľ ju musí **prijať** a po službe **zapísať, že ju poskytol**; prístup majú ešte pacient, poisťovňa (kontrola) a ÚZIS; vymaže sa **3 roky** po poskytnutí služby (§31 odst. 3) [overené].
- Opatřil: „eŽádanka je **stavový automat**, nie elektronické PDF“ (vystaviť, uložiť, vyhľadať, prijať, vybaviť, výsledok; výnimky: storno, nerealizovateľné, rozdelenie, návrat do obehu) a „rozhranie centrálnej služby ≠ automaticky dokumentové IHE MHD API“ [overené: slajd 9, pre-hack 15. 10. 2026]. Radil: **nestavať vlastný systém žiadaniek** [overené: `02-prehack-prednasky.md`].

### 4.2 Typy, verzie, dokumentácia (stav 15. 10. 2026)
Zdroj: Manuál EZ pro PZS, stránka „eŽádanky“ (verzia 12, upravená 15. 10. 2026) [overené: https://mzcr.atlassian.net/wiki/spaces/EPZS/pages/56000561].
- Podporované **tri typy: K** (konziliárna), **Z** (zobrazovacie vyšetrenie), **FT** (fyzioterapia a ergoterapia). Rehabilitácia, lázně a laboratórne žiadanky tam ako samostatné typy nie sú.
- Dokumentačný balík **platný od 1. 10. 2026**: Standard systému eŽádanka **2.0**, obecná funkčná špecifikácia 1.0, špecifikácia typu K **7.0**, typu Z 2.0, typu FT 7.0, **OpenAPI rozhranie V2 verzie 2.0.0**, testovacia sada pre Postman (T2) 1.0. Staršia dokumentácia (v1.1) platí do 30. 9. 2026, len pre systémy, ktoré ešte neprešli na v2.
- Žiadanku po vystavení **nemožno upraviť** (iba storno a nová). Existujú aj **neadresné** žiadanky: môže ich prijať ktorýkoľvek poskytovateľ, ktorý preukáže oprávnenie kódom žiadanky alebo číslom dokladu pacienta.
- Pacient ju vidí v EZKarte alebo v NPEZ.

### 4.3 API pre poskytovateľov
- **Verzia 2:** koreň `/eZadanky`, operácie `POST /api/v2/zadanka` (uložiť), `.../vyhledat`, `.../vyhledatAktivni`, `{id}/nacist`, `PATCH {id}/prijmout`, `/vratitDoObehu`, `/zaznacitNeproveditelnost`, `/stornovat`, `/vyridit`. Telo je **systémová hlavička + FHIR Bundle typu document**. Stavy z číselníka v TermX. Optimistické zamykanie (`If-Match`/`ETag`, pri nesúlade 409) [overené: https://mzcr.atlassian.net/wiki/spaces/EPZS/pages/59670529].
- **Verzia 2 je nasadená na testovacom prostredí T2 od 25. 9. 2026**; v1 platí do 30. 9. 2026. **Či je v2 už v produkcii: nevieme** (v changelogu nie je) [overené: https://mzcr.atlassian.net/wiki/spaces/EPZS/pages/393642129]. V produkcii (PROD) boli eŽádanky verzie 1.11.19 k 17. 6. 2026.
- **Starý dokument NCEZ „EZ_Popis_API_eŽádanky.pdf“** (označený INTERNAL, verzia 00/00, súbor z 3. 7. 2025) opisuje **verziu 1** (JSON + Base64 prílohy PDF/CDA/DICOM). Je **zastaralý**; pozor, citovali sme ho v `g1-cz-systemy.md` ako „aktuálny“ [overené: https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_Popis_API_e%C5%BD%C3%A1danky.pdf].
- **Autentizácia:** certifikát EZCA II + `client_id` + JWT assertion (RS256, platnosť ~60 s) → token z JSU. B2B režim je pre PZS s resortným certifikátom, B2C (portál) pre ostatných cez NIA (pozri kap. 7).
- **Rozdiel pre nás:** volanie vidí len žiadanky, ku ktorým má oprávnenie (žiadateľ/adresát/preukázaný kód). Nič ako „zoznam všetkých žiadaniek pre KOC“ pre tretiu stranu [overené: stránka eŽádanky, „vždy pouze v kontextu konkrétní eŽádanky“].

### 4.4 FHIR príručka pre K a FT (to, čo nás zaujíma)
- **HL7 Czech Order IG**, verzia 1.0.0, **ci-build** („not an authorized publication“, stav k 15. 10. 2026), FHIR R4, v súlade s eHN a Xt-EHR; definuje **K** (konzílium: žiadosť o odborné stanovisko, vyšetrenie/liečbu u špecialistu alebo odporúčanie do ambulantnej či lôžkovej starostlivosti) a **FT**. Súčasť zdravotnej dokumentácie; pri hradenej starostlivosti je podmienkou úhrady [overené: https://build.fhir.org/ig/HL7-cz/k-order/en/index.html].
- Obsahuje: hlavičku (pacient, poistenie, autor), telo (klinická informácia vo voľnom texte + kódy, diagnóza, **lieky**, požadované vyšetrenie), prezentovanú formu a **prílohy `A.5`** (Base64 + názov + typ obsahu) [overené: logický model LMEnAttachmentsOrderCz, LMEnClinicalInformationCz].
- Na portáli `ig.ezdravi.gov.cz` (5. 8. 2026) je medzi **vydanými** IG len žiadanka na obrazové vyšetrenie; **K/FT medzi vydanými nie je** napriek odkazu zo stránky eŽádanky [overené]. Teda: **čo presne bude „záväzný“ tvar K žiadanky, ešte nie je zmrazené** [odhad z draft stavu].

### 4.5 Štatistiky
- „Zatiaľ asi **2 000** eŽádanek vystavených skúšobne“ od 1/2026 do jún 2026 (Foltýn, Vitalia 29. 6. 2026) [čiastočne]. Skorší údaj ČTK: ~260 [čiastočne, dátum neznámy]. **Novšie číslo nenašiel som.** Medzi typmi sa nerozlišuje.
- Tribune (21. 5. 2026): žiadanky na vyšetrenia, diagnostiku a zobrazovanie sa dajú vystaviť cez portál eZdraví; Foltýn: „Dokud nebudou povinné, nebudou plošně používány.“ [čiastočne]. Cieľ: lekár ju píše v softvéri, ktorý už používa, nie na portáli.

### 4.6 Čo to znamená pre koordinátora [odhad]
- K žiadanka je **prirodzený štátny kanál „PREVZIAŤ“** z VZP zadania (praktik odošle konzíliovú žiadanku do KOC s prílohami). Dnes je dobrovoľná; povinnosť 7/2027 je návrh. V roku 2026 teda KOC **nemôže spoliehať**, že mu bude chodiť od všetkých.
- Aj keď príde, prílohy sú **dokumenty vo forme súborov**, nie štruktúrované výsledky. AI vyťaženie z príloh a kontrola úplnosti zostáva našou pridanou hodnotou.

---

## 5. Sdílený zdravotní záznam, pacientský súhrn, EZKarta

| Služba | Čo obsahuje / robí | Stav | Zdroj |
|---|---|---|---|
| **SZZ** (§34a) | **Emergentný záznam** (krvná skupina, alergie, nežiaduce účinky liekov, transfúzne reakcie, lieky podané/vydané za posledných 12 mesiacov alebo na lôžku) a **výsledky preventívnych a screeningových vyšetrení**. Zdravotníci ho čítajú, ak pacient **nevysloví nesúhlas** (opt-out); zapisujú poskytovatelia | API v3 na T1/T2 od 28. 7. 2026; v PROD sa menia služby Prehľadu prevencie (24. 8. 2026); novela plánuje „SZZ“ rozšíriť (výsledky aj od iných lekárov) | zákon [overené]; Manuál EZ pro PZS, changelog [overené]; MZ 24. 6. 2026 [overené] |
| **Onkologické správy v SZZ?** | **Nie.** Zákon vymedzuje len emergentný záznam a prevenciu/screening | – | zákon §34a [overené] |
| **Pacientsky súhrn (PS)** | Základné údaje o zdraví a poskytnutých službách; **voliteľný** (rozhoduje poskytovateľ); odovzdáva sa cez NCP; CDA | Cezhranične od 2017. IG FHIR pre PS: **0.0.1 draft** (15. 8. 2026). Povinný elektronicky podľa návrhu novely od 26. 3. 2029 | zákon 372/2011 §56a [overené]; hl7.cz [overené]; ZD 08/2026 [čiastočne] |
| **EZKarta** | Mobilná aplikácia **len pre pacienta** po overení totožnosti: údaje z NZIS, eReceptu, dokumentácie, IDR (§35a). Nová generácia **3. 9. 2026**: preventívne prehliadky, **10 vybraných laboratórnych parametrov za 5 rokov**; dáta sa zapisujú ~mesiac po odbere | Produkcia od 3/2024; žiadanky „neskôr“ | zákon [overené]; MZ 21. 3. 2025 [overené]; Echo24/ČTK 9/2026 [čiastočne] |
| **Národný laboratórny systém** | ÚZIS centralizuje výsledky: **282 laboratórií, 405 mil. výsledkov, 28 skupín testov** (prvá fáza: prevencia a screening od 2020); občan ich uvidí v eZdraví/EZKarte od konca 8/2026, zdieľa sa aj s poisťovňami | Beží; **dostupnosť pre zdravotníkov a koordinátorov nevieme** | MZ 24. 6. 2026 [overené] |

**Pre nás:** profil pacienta s laboratórnymi výsledkami zo štátnych zdrojov **dnes nie je cez štát dostupný koordinátorovi**. Dáta o labe sú u pacienta (EZKarta), u labu/lekára a (čiastočne) v NZIS. To je dôležité tvrdenie do pitchu: „štátna jednotná lab história pre zdravotníka zatiaľ neexistuje“ [odhad na základe zákona §34a a MZ 24. 6. 2026].

**Tretia osoba (§33):** pacient môže udeliť súhlas „tretej osobe“ (právnickej aj fyzickej), ktorá potom v jeho mene nahliada na jeho údaje; súhlas sa podáva ministerstvu písomne s úradne overeným podpisom alebo vzdialene a dá sa kedykoľvek odvolať; eviduje ho Registr oprávnění [overené: zákon §32–33; NCEZ Standard Kmenové registry v0.7, s. 15–16]. **Či sa dá takto oprávniť KOC alebo koordinátora a čo by tak videl: nevieme.** Otázka na NCEZ.

---

## 6. Kmeňové registre (KRP, KRZP, KRPZS) a ich vzťah k NRPZS, NRZP, ROB

**Pozor na pomenovanie.** V zadaní sa pýtame na „NRPZS, NRZP, ROB“. V zákone 325/2021 sú **kmeňové registre** tri: **KRPZS, KRZP, KRP** (§16). NRPZS a NRZP sú **staršie národné registre ÚZIS** podľa zákona 372/2011 (§74–77), ktoré kmeňové registre **plnia dátami**. ROB je **základný register štátu** (register obyvateľov), z ktorého KRP preberá referenčné údaje.

| Register | Čo v ňom je | Identifikátor | Odkiaľ plní | Kto smie čítať | Verejnosť |
|---|---|---|---|---|---|
| **KRP** (pacienti) | Trvalá identita pacienta, **zdravotné poistenie (len verejné)**, registrujúci lekár, dátum úmrtia, kontakt | **RID** (10-miestne číslo bez významu, nesmie začínať 0, má nahradiť rodné číslo); dočasný DRID pre výpadky a novorodencov | Základné registre cez ISZR (ROB, RÚIAN), CRP/CRZ poisťovní | §24: poskytovateľ a jeho zdravotníci (len k svojim pacientom, v nevyhnutnom rozsahu), pacient a **jeho tretie osoby**, poisťovňa, ČSSZ, SÚKL, MZ, ÚZIS, NCP, SZÚ, Polícia ČR (obmedzene), MD, MPSV/IPZS | Nie |
| **KRZP** (zdravotníci) | Údaje o zdravotníkoch (kvalifikácia, pracovný vzťah) | KRZPID = rovnaký ako v NRZP | **NRZP** (ÚZIS), kópia 1:1 | PZS, komory, MZ, kraje, SÚKL, ÚZIS, poisťovne, ČSSZ… | Nie (NRZP „neverejný referenčný register“ [čiastočne: MZ prezentácia]) |
| **KRPZS** (poskytovatelia) | IČO, miesta poskytovania, pracoviská, odbornosti, ordinačné hodiny, lôžka | **IČO** | **NRPZS** (ÚZIS), ktorý je napojený na základné registre | PZS, poisťovne, komory, kraje, MZ, SÚKL, SZÚ, ÚZIS, NCP… | NRPZS áno |

Zdroje: zákon 325/2021 §16–25 [overené]; NCEZ **Standard EZ Kmenové registry**, verzia 0.7 platná od 2. 10. 2025 (v hlavičke nevyplnený dátum schválenia) [overené: https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_SL01.03_Standard%20EZ%20Kmenov%C3%A9%20registry_v0.7a.pdf]; NCEZ „KRPZS: Účel, funkce a vnější API“ v1.0 od 11. 6. 2025 [overené: https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_KRPZS_popis_API_FINAL.pdf]; FAQ Manuálu EZ [overené].

**Čo vieme o API:**
- Produkčná adresa `https://api.csez.gov.cz/krp/`, `/krzp/`, `/krpzs/` (test `gwy-ext-sec-t2.csez.cz`); dokumentácia Swagger/OpenAPI na `.../apidoc/` [overené: Manuál EZ, „API endpointy“, upravené 31. 8. 2026].
- **KRP API v1 a v2 pre PZS bolo vypnuté 15. 9. 2026, dostupné je v3** [overené: changelog 27. 8. 2026]. Veľké hromadné ztotožnenie: max. 10 000 položiek (17. 9. 2026).
- Každé volanie nesie **ID žiadosti, dôvod/účel a dátum** (audit) [overené]. Rate-limiting. Formát JSON, hromadné XML, pre starší ISSS aj SOAP [overené: KRPZS API].
- KRP vie ztotožniť pacienta podľa **RID, NIA BSI, AIFO, mena + dátumu narodenia (+ čísla dokladu)**, nájsť duplicity, spojiť záznamy [overené: Standard KZR, kap. 4.5].
- **Zapisovať/meniť** údaje pacienta sa neodporúča a ztotožnené referenčné údaje sa meniť nedajú; zdravotník smie meniť len svoje kontaktné údaje v NRZP [overené: FAQ].

**Kto k nim nesmie:** zoznamy čitateľov (§24 pre KRP, §20 pre KRPZS, NCEZ Standard pre KRZP) **neobsahujú firmu-dodávateľa ako takú**. §24 odst. 2 zakazuje iné využitie než uvedené účely a §40 odst. 5 dáva zdravotníkovi pokutu do 50 000 Kč za využitie na iný účel než poskytovanie zdravotných služeb [overené]. **Pre nás to znamená:** KRP/RID vieme používať len ako súčasť KOC pri starostlivosti o jeho pacientov, **nie na vlastné analýzy ani trénovanie**.

**NRPZS (verejné):** web `https://nrpzs.uzis.cz/` (16. 10. 2026) = vyhľadávanie poskytovateľa, mapa, **regionálne prehľady „Onkologická péče“**, „Data ke stažení“. Otvorená dátová sada „sa presúva do Národného katalógu otvorených dát“ [overené]. Podľa zákona obsahuje aj **počty lôžok a obsadenosť lôžok** podľa oboru (§74 odst. 1 písm. m) [overené: zákon 372/2011]; či je obsadenosť reálne plnená: **nevieme**. Kontaktné údaje poskytovateľa (telefón, e-mail, ID dátovej schránky) sú tiež súčasťou (§74 odst. 1 písm. c) [overené] → **adresár KOC a jeho koordinátora sa dá brať z NRPZS**, ak ho tam KOC zapísalo [odhad].
**NRZP:** neverejný, prístup len definovaných osôb; zdravotník vidí svoje dáta po žiadosti [čiastočne: MZ prezentácia, ÚZIS].
**ROB:** nie je API pre tretie strany; KRP volá ISZR za poskytovateľa [overené: Standard KZR]. Priamy prístup pre súkromnú firmu **nevieme / netreba** (a nezískame ho).

---

## 7. Identita a prístup zdravotníka

**Dva režimy** (z NCEZ dokumentov a Manuálu) [overené, ak nie je uvedené inak]:

1. **B2B, systém-systém.**
   - Systém (NIS/AIS) má **systémový certifikát EZCA II**; `client_id` = IČO poskytovateľa + názov certifikátu. Systém podpíše **JWT assertion (RS256, ~60 s)**, brána API si pre ňu vypýta token od **JSU** (`jsuint-auth-ez.csez.cz/connect/token` v produkcii, `jsuint-auth-t2.csez.cz/...` v teste). Zdroj: Manuál EZ, „Autentizace k API gateway“ (upravené 7. 10. 2026).
   - **Produkčný certifikát** vydáva portál `https://ezca.mzd.gov.cz/` **štatutárnemu zástupcovi poskytovateľa** (vedenému v základných registroch): vygeneruje nový alebo zaregistruje existujúci (SÚKL/EREG, európsky kvalifikovaný, EZCA I). Zdroj: FAQ Manuálu EZ (upravené 16. 9. 2026).
   - **Pre dodávateľa to znamená:** certifikát patrí poskytovateľovi. Samostatný certifikát „pre tretiu stranu“ som nenašiel. Zákon (§42 odst. 1) hovorí, že správca IS pristupujúceho k IDR zabezpečí autentizáciu systémovým certifikátom [overené].
2. **B2C, človek cez portál.** `https://ezdravi.gov.cz` → „Přihlásit“ → rola **Občan / Zdravotnický pracovník / Poskytovatel zdravotních služeb / Poskytovatel IT služeb** → prihlásenie **Identitou občana (NIA)** alebo Bankovou identitou. Systém zistí, pre ktorého PZS pracuješ (podľa NRPZS/KRPZS) [overené: FAQ Manuálu EZ]. Lekár si môže vygenerovať **osobný certifikát** na EZCA a potom sa prihlasovať ním (prvé prihlásenie osobnou identitou).
3. **Rola „Poskytovatel IT služeb“** existuje v ponuke rolí. **Čo presne znamená, kto ju môže mať a či na ňu viaže prístup dodávateľa k dátam: nevieme** (v dostupnej dokumentácii nie je popísaná). Otázka na NCEZ.

**Testovanie pre vývojárov (verejné):**
- Testovacie prostredie **T2** (`gwy-ext-sec-t2.csez.cz`) je určené „odbornej verejnosti, najmä dodávateľom softvéru“; používajú sa **zdieľané verejné testovacie identity pacientov a testovací certifikát poskytovateľa** (zverejnený v FAQ; heslo k nemu je tam tiež zverejnené, ja ho do dokumentov **neprepisujem**). Postman sada na životný cyklus žiadanky typu Z, certifikáty platia do 7. a 12. 1. 2027 [overené: Manuál EZ, API eŽádanky]. Testovací portál `https://npez-pub-t2.csez.cz/` s testovacími identitami NIA (LoA Low). „Nie je určený na verejné testovanie, môže byť nestabilný“.
- **Kto smie realizovať B2B v produkcii:** poskytovateľ. **Hlavičky volania:** `X-Correlation-Id` a `User-Agent` sú podľa stránky „API endpointy“ odporúčané od 1. 9. 2026 a **povinné od 1. 1. 2027**; v API eŽádanky je `User-Agent` už dnes požadovaný spolu s JWT assertion [overené: Manuál EZ, API endpointy a API eŽádanky].

**Koordinátor bez zdravotného vzdelania:** Věstník MZ 11/2025 nevyžaduje zdravotnícke vzdelanie. Zákon §5 pozná „pověřené pracovníky“, ktorých totožnosť overí poskytovateľ; zdravotníkov overuje v KRZP [overené]. **Či koordinátor-nezdravotník môže pracovať v NPEZ (rola „Zdravotnický pracovník“ je viazaná na KRZP), nevieme.** V B2B scenári to rieši vlastné prihlasovanie KOC do jeho IS [odhad].

---

## 8. „Národný manuál“: zoznam služieb a API (Manuál EZ pro PZS)

Zdroj: priestor EPZS, stav 15. 10. 2026; endpointy „API endpointy“ (31. 8. 2026) [overené: https://mzcr.atlassian.net/wiki/spaces/EPZS/pages/80904194]. Cesta je rovnaká pre test (`https://gwy-ext-sec-t2.csez.cz/<cesta>/`) a produkciu (`https://api.csez.gov.cz/<cesta>/`).

| Služba | Cesta | Poznámka |
|---|---|---|
| Kmeňový registr pacientov (KRP) | `/krp/` | API v3 (v1/v2 vypnuté 15. 9. 2026) |
| Kmeňový registr zdravotníckych pracovníkov | `/krzp/` | |
| Kmeňový registr poskytovateľov | `/krpzs/` | GET podľa IČO + číselníky + reklamácie + notifikácie |
| Dočasné úložisko | `/docasneUloziste/` | zásielky: odosielateľ → adresát, 30 dní |
| eŽádanky | `/eZadanky/` | v2 na T2 od 25. 9. 2026 |
| Systém notifikácií | `/notifikace/` | upozornenia o zmene kmeňových údajov (len informácia o zmene, nie hodnota) |
| Registr oprávnění | `/registrOpravneni/` | súhlasy pacienta, zastupovanie |
| Služby vytvárajúce dôveru (EZCA II) | `/ezca2/` | pečate, časové pečiatky, certifikáty |
| Sdílený zdravotní záznam | `/sdilenyZdravotniZaznam/` | v3 |
| Elektronické lékařské posudky | `/elektronickePosudky/` | posudky pre vodičov a zbrane |
| Terminologický server | `apio.csez.gov.cz/apidoc/` (verejné, bez prihlásenia) + `termx.ezdravi.gov.cz` | FHIR číselníky, SNOMED |
| Dočasné úložisko / AAfD | – | AAfD stránka: **DRAFT**, „Standard AAfD – návrh“, verzia 09 rev. d, upravené 16. 3. 2026 |
| Zdravotné poisťovne | KRP pre ZP | samostatný hostiteľ (`ais17678-zp.krp.mzcr.cms2.cz` zabezpečený 31. 8. 2026) |

Ostatné: Katalóg služeb EZ (KSEZ), Žurnál činností (neverejný), Plán vývoja CSEZ.
**Katalóg služeb (KSEZ, §36):** eviduje centrálne služby, **aplikácie zverejňované ministerstvom na portáli** a **služby EZ, ktoré spravuje poskytovateľ** (teda aj systémy tretích strán prevádzkované poskytovateľmi). Registrácia služby cez NPEZ so schvaľovacím workflow; pre vývojárov a „technických partnerov“ ponúka dokumentáciu a testovacie nástroje. Verzia 1.0.0 v produkcii od 23. 4. 2026 [overené: zákon §36; NCEZ KSEZ prezentácia; changelog]. **Toto je jediná štátom predpokladaná formálna cesta „zapísať“ aj cudziu službu.** Praktické podmienky schválenia nevieme.

---

## 9. HL7 FHIR implementačné príručky (HL7 ČR)

Zdroj: `https://hl7.cz/fhir` a `https://ig.ezdravi.gov.cz/` (aktualizované **5. 8. 2026**), konkrétne verzie z hlavičiek jednotlivých IG (CI build, stav 15. 10. 2026) [overené].

| IG | Verzia / stav | Poznámka |
|---|---|---|
| **CZ Base and Core** (`hl7.fhir.cz.core`) | **1.0.0 STU 1**, FHIR R4 | stojí na **HL7 Europe Base 2.0.0**; pravidlá pre identifikátory a základné zložky |
| **Terminológia** | 1.0.0 STU 1 (balík `cz.terminology` 0.3.0) | |
| **Nález obrazového vyšetrenia** (`img`) | 1.0.0 STU 1 | kompatibilné s EÚ |
| **Nález laboratórneho vyšetrenia** (`lab`) | **1.0.0 Release** | podľa **HL7 Europe Laboratory Report 2.0.0**; obsahuje CodeSystem NČLP; príklady aj pre EHDSI; nerieši, *ako* správu poslať |
| **Žiadanka na obrazové vyšetrenie** (`img-order`) | 1.0.0 STU 1 | |
| Prepúšťacia správa (`hdr`) | **0.1.0 Draft** (21. 9. 2026) | |
| Pacientsky súhrn (`ps`) | **0.0.1 Draft** (15. 8. 2026) | |
| Ambulantná správa (`amb`) | 0.1.0 Draft | |
| Laboratórna žiadanka (`lab-order`) | 0.0.1 Draft | |
| Obecná žiadanka K, FT (`k-order`/`order`) | 1.0.0 ci-build, aktívne k 15. 10. 2026 | pozri 4.4 |
| Záznam výjazdu ZZS (`cz-ems`) | 0.0.2 Draft | |
| **eHealth API / HIE (IHE MHD + RESTful ATNA)** | **0.0.1 Draft** (15. 10. 2026) | národné rozšírenia transakcií ITI-65/66/67/68, ITI-20, ITI-81 „v prostredí akreditovaných afinitných domén“ |
| **Onkológia** | **žiadny IG v ČR** | |

Európsky kontext (z prednášky HL7 Rakathon 15. 10. 2026): **European Cancer Common Data Model** je v stave **1.0.0-ballot**, hotový je koncepčný a logický model, mapovanie na FHIR a OMOP sa dokončuje, **zatiaľ je namapovaný len pacient**; profily budú vychádzať z **HL7 EU Base** a pravdepodobne aj z **mCODE** (americký, STU4 4.0.0) [overené: `docs/materials/slack/01-oznameni/HL7_Rakathon_2026_uvod-1.pptx`, slajdy 10–20; `02-prehack-prednasky.md`]. HL7 Workgroup Meeting Málaga 16.–20. 11. 2026 má celý deň Cancer Common.

**Pre nás:** všetko, čo vyrobíme ako „výstup“, by sa malo **rozumne dať vyjadriť v týchto profiloch** (CZ Core Patient, lab report, imaging report), a pre onkologické súhrny **nie je čo dodržať** (taký IG neexistuje), takže môžeme navrhnúť mapovanie ako malý príspevok [odhad].

---

## 10. EHDS: harmonogram 2027–2031

Nariadenie (EÚ) **2025/327**, v Úradnom vestníku 5. 3. 2025, **platí od 26. 3. 2025** [overené: https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en].

| Dátum | Čo | Istota |
|---|---|---|
| **26. 3. 2025** | Nariadenie v platnosti (prechodné obdobie) | [overené] |
| **marec 2027** | Komisia prijme kľúčové vykonávacie akty; nariadenie sa ako celok začína uplatňovať 26. 3. 2027, s výnimkami | [overené: EK]; [čiastočne: čl. 105 podľa sekundárnych zdrojov] |
| **26. 3. 2029** | Primárne použitie: **pacientsky súhrn a eRecept/eVýdaj** vo všetkých členských štátoch; sekundárne použitie: pravidlá pre väčšinu kategórií; systémy EHR spracúvajúce tieto kategórie musia spĺňať Kapitolu III | [overené: EK]; EHR systémy [čiastočne] |
| **26. 3. 2031** | **Zobrazovacie snímky, laboratórne výsledky, prepúšťacie správy**; zvyšné kategórie sekundárneho použitia (napr. genomika); systémy „in-house“ a „ako služba“ podľa čl. 26 ods. 2 | [overené: EK]; výnimky čl. 26(2) [čiastočne] |
| marec 2035 | Tretie krajiny môžu žiadať o pripojenie k HealthData@EU | [overené: EK] |

Dopad v ČR: **EEHRxF** (európsky formát výmeny) ≈ „technická vyhláška“ k EHDS; **MyHealth@EU** = európska platforma; NCPeH sa pripája; systémy, ktoré spracúvajú prioritné kategórie, majú povinnosť FHIR rozhrania [overené: Kružík, Opatřil, `02-prehack-prednasky.md`]. České IG sú buď odvodené z európskych, alebo deklarujú kompatibilitu [overené: hl7.cz]. Návrh novely 325 presúva vybrané povinnosti EHDS do českého práva (2029 PS, 2031 ostatné) [čiastočne].
Dôležité rozlíšenie (Opatřil, slajd 7): **EZD ≠ EHR ≠ IS**; PDF je len „lidsky čitelný“ fallback, interoperabilný záznam je FHIR [overené].

---

## 11. VZP: čo poskytuje a čo nie

### 11.1 VZP Point a B2B služby
- **VZP Point** (`point.vzp.cz`) = zabezpečená **webová aplikácia** pre poskytovateľov, zamestnávateľov, inštitúcie, exekútorov a poisťovne; poskytovateľ cez ňu posiela **dávky** (KDAVKA, FDAVKA), prijíma dokumenty a **overuje**: platnosť poistenia, platnosť zmluvy, EHIC, „registrujúci PZS pojištěnce“, „overenie poskytnutej starostlivosti“, kapitácia; sťahuje číselníky [overené: https://vzp.cz/e-vzp/vzp-point/co-umoznuje-vzp-point, https://www.vzp.cz/e-vzp/vzp-point/registrace-a-obecne-informace, 16. 10. 2026].
- **Registrácia:** partner bez zmluvy podá „Žádost o registraci partnera do systému e-VZP“ (datová schránka, pobočka, pošta), dostane aktivačný kľúč; treba unikátny e-mail a **české mobilné číslo**; prihlásenie Identitou občana, Bank iD, heslom + SMS alebo certifikátom [overené].
- **B2B webové služby** (systém-systém): pre PZS synchrónne (stav a priebeh poistenia, registrácia ku kapitácii, stav zmluvy podľa IČP/IČPP, EHIC, registrujúci PZS, vyhľadávanie SZZ, **overenie poskytnutej starostlivosti**), asynchrónne (prevzatie dávok s kontrolným protokolom VZPkontrol, faktúry, zoznam registrovaných poistencov), číselníky [overené: https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b].
- **Podmienky:** B2B smie používať **poskytovateľ (s IČZ)**, zamestnávateľ, exekútor, inštitúcia; treba **zmluvu alebo dodatok o predávaní dát**, služby sa **neaktivujú automaticky**; elektronický certifikát + UID; **vývojári softvéru môžu na žiadosť získať prístup do simulačného prostredia (SIMU)**; dopyty `ekk@vzp.cz` [overené: https://www.vzp.cz/e-vzp/b2b-komunikace/registrace-a-obecne-informace-o-b2b].
- **Dokumentácia je verejná:** popisy služieb so **WSDL a XSD v ZIP prílohách**; dátumy dokumentov od 2010 do 5/2026 (napr. „Ověření poskytnuté péče“ 26. 2. 2026); opisy vstupných/výstupných dátových rozhraní a kódov v dokumentácii nie sú [overené: https://www.vzp.cz/e-vzp/informace-pro-sw-firmy/b2b-komunikace/popis-b2b-sluzeb].
- **Pre onkológiu a koordinátora** VZP nezverejnila žiadnu osobitnú B2B službu. Najbližšie sú „Registrujúci PZS (aj pracovisko koordinovanej starostlivosti)“ a „Overenie poskytnutej starostlivosti“ (frekvenčne limitovaná starostlivosť) [overené].

### 11.2 Dáta o vykázaných výkonoch
- **Pacient** vidí „vykázanú starostlivosť“ v aplikácii **Moje VZP** (podľa odborov a lekárov; tlač cez VZP Point „přehled vykázané péče pojištěnce“). Obsahuje len to, čo zariadenia **vykázali a VZP spracovala a uznala**. Spracovanie trvá **do 50 dní** po skončení mesiaca a zariadenia môžu vykazovať **až o 3 mesiace neskôr** [overené: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci]. **Pre aktuálnu koordináciu je to nepoužiteľné** (oneskorenie), vhodné skôr na spätný pohľad na cestu (Tichopadova analytika) [odhad].
- **Poskytovateľ** (cez B2B) vie len úzke dopyty, nie „vypíš výkony pacienta“.
- **Výkon č. 51887 „Intervencia koordinátora onkologickej starostlivosti“:** 250 Kč za výkon, max. 1× za deň na pacienta, platí sa KOC; je to **signálny výkon** (čas 0, bez bodov). VZP z neho vie, **že** koordinácia pri pacientovi v KOC prebehla (deň), nie jej obsah [overené: `docs/kontext/raw-vykon-51887.md`, zákon 134/1998 a vyhláška 432/2025 Sb.]. VZP teda môže vedieť, **v ktorých dňoch bol pacient v KOC koordinovaný**; ďalšie čítanie nevieme.
- **Agregované dáta:** pre iné výzvy Rakathonu VZP dáva anonymizované súbory (mamograf, koniec života) cez Azure; pre túto výzvu podľa kanála nie sú potrebné [čiastočne: `docs/research/vyzvy/vzp-cesta-pacienta.md`, bod 31].
- **ZDRAVEL (pôvodne IZIP):** portál VZP pre pacientov/lekárov; podľa jednej univerzitnej prednášky **odstavený v 10/2021** [čiastočne, jeden zdroj]. Dnešný stav: nevieme.

### 11.3 „Komunikačný uzol ve VZP“
- **Presné znenie** (poznámky ku slajdu 2 zadania, autori Bielčiková, Rybář, Vaňková, Chrástová, Tůmová, Klimeš Lipánová): „Protože informační systémy zdravotnických zařízení jsou odlišné a málo kompatibilní, nabízí se možnost podpořit delegaci péče ze strany KOC také tvorbou komunikačního uzlu ve VZP.“ [overené: `Rakathon_cesta_pacienta final.pptx`, poznámky slajdu 2, balík `cesta-pacienta-data.zip` z 16. 10. 2026]. Kontext: koordinátori „suplujú chýbajúcu elektronizáciu a nedostatočnú komunikáciu medzi KOC a ROC“.
- **Iný zdroj nenašiel som.** Ani na vzp.cz, ani v správach MZ. **Nevieme, či ide o plán, nápad alebo otázku do súťaže.**
- Čo z toho môžeme povedať [odhad]:
  - Štátne „uzly“ už existujú: výmenná sieť + dočasné úložisko, NIX-ZD/NCP uzol nad nemocnicami, súkromné siete (eZpráva, ClinicBox, MEDDOX, MISE), plánované AAfD. VZP uzol by bol ďalší, alebo by sa musel zaradiť medzi ne (zákon §30 poznáva poskytovateľov ↔ poisťovne; novela navrhuje „registrované výmenné siete“).
  - Poisťovňa má **zmluvný vzťah s každým PZS**, B2B kanál s certifikátom a vie, kto je registrujúci lekár; to sú reálne vstupy pre „adresár a smerovanie“. Obsah dokumentácie však poisťovňa dnes nedostáva.
  - Pre MVP uzol netreba. Pre pitch stačí: „náš nástroj sa vie pripojiť na ktorýkoľvek uzol (štát, VZP, sieť), lebo stojí na FHIR a adaptéroch“.
- **Otázka pre VZP porotu (Hlavinka) a mentorov:** čo presne uzol má vykonávať (smerovať žiadosti? ukladať dokumenty? len notifikovať?) a kto by ho prevádzkoval.

---

## 12. Čo z toho môže použiť tretia strana: verdikt

| Služba | Kto ju smie volať | Vieme ju použiť v hackathone? | Vieme ju použiť v ostrej prevádzke? |
|---|---|---|---|
| **T2 testovacie prostredie** (KRP, eŽádanky, DÚ, SZZ) | dodávatelia softvéru, verejné testovacie identity | **Áno** (demo „vyzerá a volá ako štát“; neposkytuje reálne dáta) | – |
| **eŽádanka K/Z/FT (API v2)** | PZS s certifikátom EZCA II | Len ukážka formátu (FHIR Bundle z IG príkladov) | **Cez KOC** (jeho certifikát); K IG ešte nie je vydaný |
| **KRP / RID** | PZS (len k svojim pacientom) | Mock s poľom RID | Cez KOC; **nie na vlastné účely** (§24 odst. 2) |
| **KRZP** | PZS, komory, ministerstvá… | Netreba | Overenie zdravotníka v KOC systéme |
| **NRPZS** (verejný) | **kto-koľvek** | **Áno** (adresár KOC, kontakty, odbornosti) | **Áno** |
| **NRZP, ROB** | definované osoby | Nie | Nie (cez KRP) |
| **NCP (NCPeH)** | PZS po pripojení | Nie | Cez KOC; CDA; ≈ 11/15 KOC uvedených (odhad) |
| **SZZ** | PZS a zdravotníci s oprávnením | Nie | Nič onkologické; len emergentný záznam a prevencia |
| **EZKarta, Moje VZP** | pacient | Nie | Len ak pacient sám prinesie/zdieľa (nevieme formu) |
| **KSEZ (katalóg služieb)** | registrácia cez NPEZ so schválením | Nie | Možná cesta „zapísať“ našu službu; podmienky nevieme |
| **HL7 CZ IG** (CZ Core, lab, img, img-order) | verejné | **Áno** (generovať a validovať FHIR) | Áno |
| **VZP Point / B2B** | zmluvný PZS (certifikát + UID) | Nie | Cez KOC |
| **Štátna jednotná lab história pre zdravotníka** | – | – | **Dnes neexistuje** (len občan cez EZKarta) |

---

## 13. Čo z toho plynie pre nás [odhad, nie fakt]

1. **Architektúra „adaptérov“ s bielym miestom** (Opatřil: „nechajte miesto na overenie pacienta voči autoritatívnemu zdroju“):
   - **Adaptér KRP/RID:** pole RID, `ztotožnenie` ako služba (mock), v ostrej prevádzke volaná certifikátom KOC.
   - **Adaptér eŽádanka K:** import FHIR Bundle (z príkladov IG) → handover; export odpovede (výsledok MDT) späť cez `vyridit` v budúcnosti.
   - **Adaptér NCP:** cieľový (CDA PS) vstup a pull cez KOC, keď bude KOC chcieť.
   - **Adaptér „e-mail/PDF/Word“ (dnešný reálny kanál):** hlavný vstup; to je kanál, ktorým koordinátori dnes pracujú.
   - **Výstup FHIR:** CZ Core Patient + lab report + imaging report ako „zrkadlo“ vyťažených údajov.
2. **Neučiť lekárov nič nové a nestavať vlastnú žiadanku ani databázu pacientov** (Opatřil). Naša databáza je **pracovný priestor koordinátora** pri jednom KOC, nie register.
3. **Čo môžeme bezpečne tvrdiť:** „Štát buduje koľajnice: eŽádanka, kmeňové registre, SZZ, NCP, EZKarta. Chodia po nich len poskytovatelia. Žiadna z nich nezbiera podklady pre koordinátora ani nezatvára slučku k praktikovi. Preto stavíme vrstvu, ktorá sa na tieto koľajnice vie napojiť cez KOC.“
4. **Čo netvrdiť:**
   - že „napojíme sa na štátne API“ (nemáme prístup a nemôžeme ho mať bez KOC);
   - že eŽádanka je povinná (je to návrh novely, ktorú vláda zrejme ešte neschválila);
   - že SZZ obsahuje onkologické správy alebo lab históriu (nie);
   - že existuje onkologický FHIR profil v ČR (nie);
   - že VZP má API na výkony pacienta pre tretie strany (nenašli sme);
   - že „komunikačný uzol VZP“ existuje (je to jedna veta v poznámke).
5. **Stratégia pre KOC pilot:** KOC si vie pre nás (ako svojho dodávateľa) požiadať o testovací a potom produkčný certifikát; tretiu stranu to technicky nevyžaduje vlastniť. Overiť s mentorkami (Vaňková, Chrástová), kto u nich spravuje certifikát a akú NIS/AIS má.

---

## 14. Čo som nevedel overiť (nevieme) a otázky

1. **Či vláda schválila novelu 325** (po auguste 2026) a v akej podobe (termíny 7/2027, 1/2028, 2029).
2. **Či je eŽádanka typ K v produkcii** a koľko ich je (číslo ~2 000 je z júna 2026 a nerozlišuje typ). **Či je API v2 už v PROD.**
3. **Kto smie žiadať certifikát pre produkciu** inak než štatutár poskytovateľa; čo je rola „Poskytovatel IT služeb“ v NPEZ.
4. **Či môže koordinátor-nezdravotník pracovať v NPEZ** a aké sú jeho oprávnenia.
5. **Či môže pacient sprístupniť svoje údaje KOC ako „tretej osobe“** (§33) a čo by sa dalo čítať (EZKarta, lab výsledky).
6. **Či sa NCP už používa na odoslanie dokumentov medzi dvoma českými nemocnicami** (domáci pull podľa §56b) a ako často.
7. **Stav AAfD** (draft) a termín spustenia; počet domén (Opatřil na pre-hack prednáške hovoril o piatich miestach [čiastočne]).
8. **Dostupnosť centrálnych lab výsledkov pre zdravotníkov** (SZZ v novele).
9. **Čo je „komunikačný uzol ve VZP“** a či ho VZP plánuje.
10. **Dnešný stav ZDRAVEL** a či VZP poskytuje pacientske dáta API.
11. **Presné dátumy povinností výrobcov EHR podľa EHDS** (čl. 105) z Úradného vestníka (mám len sekundárne zdroje).
12. **Aktuálny stav verejného datasetu NRPZS v katalógu otvorených dát** (presúva sa).

**Otázky na ILF 19. 10. a mentorov (Foltýn/NCEZ, výrobcovia, KOC):**
- „Ako môže dodávateľ koordinačného nástroja pre KOC získať prístup k API eŽádanky a KRP: cez certifikát KOC, alebo vlastný?“
- „Bude typ K (konziliárna) povinný pre odosielanie do KOC a kedy bude IG vydaný ako STU?“
- „Dá sa cez NCP získať dokument od iného KOC a kto z KOC to dnes používa?“
- „Môže pacient dať KOC prístup k svojim údajom v EZKarte/SZZ?“
- (VZP) „Čo presne je komunikačný uzol vo VZP a kto ho má vlastniť?“

---

## 15. Zdroje (URL a dátum; všetko otvorené 16. 10. 2026, ak nie je uvedené inak)

**Zákony a oficiálne dokumenty [overené]**
- Zákon 325/2021 Sb., znenie k 1. 4. 2026: https://www.zakonyprolidi.cz/cs/2021-325
- Zákon 372/2011 Sb. (§45, §56a–d, §69a–c, §74–77): https://www.zakonyprolidi.cz/cs/2011-372
- NCEZ, Standard EZ Kmenové registry v0.7 (platnosť 2. 10. 2025): https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_SL01.03_Standard%20EZ%20Kmenov%C3%A9%20registry_v0.7a.pdf
- NCEZ, KRPZS popis API v1.0 (11. 6. 2025): https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_KRPZS_popis_API_FINAL.pdf
- NCEZ, eŽádanky popis API (INTERNAL, v1, súbor 3. 7. 2025): https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_Popis_API_e%C5%BD%C3%A1danky.pdf
- NCEZ, KSEZ prezentácia a popis API: https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_KSEZ_komponenty_prezentace.pdf
- NCEZ, napojenie na povinné systémy a NCPeH (IROP/NPO): https://ncez.mzcr.cz/cs/node/5516 , https://ncez.mzcr.cz/cs/node/5517 , testovacia afinitná doména https://ncez.mzcr.cz/cs/node/5546
- Manuál EZ pro PZS (Confluence, verejné): https://mzcr.atlassian.net/wiki/spaces/EPZS/overview ; eŽádanky (15. 10. 2026) …/pages/56000561 ; API eŽádanky …/pages/59670529 ; API endpointy (31. 8. 2026) …/pages/80904194 ; Autentizace k API GW (7. 10. 2026) …/pages/160530443 ; Novinky a dostupnosť služieb (7. 10. 2026) …/pages/393642129 ; FAQ (16. 9. 2026) …/pages/190251018 ; AAfD (16. 3. 2026) …/pages/421167107 ; SZZ …/pages/55935089
- HL7 ČR FHIR IG: https://hl7.cz/fhir , https://ig.ezdravi.gov.cz/ (5. 8. 2026), CI buildy https://build.fhir.org/ig/HL7-cz/k-order/ , …/HIE/ , …/hdr/ , …/ps/
- MZ: NCEZ zostáva odborom (4. 6. 2026): https://mzd.gov.cz/tiskove-centrum-mz/narodni-centrum-elektronickeho-zdravotnictvi-zustane-soucasti-ministerstva-zdravotnictvi-resort-chysta-posileni-kapacit-i-nove-odborne-zazemi-v-ostrave/
- MZ: Elektronizace zdravotnictví pokračuje (24. 6. 2026): https://mzd.gov.cz/tiskove-centrum-mz/elektronizace-zdravotnictvi-pokracuje-ministerstvo-predstavilo-nove-moznosti-prace-se-zdravotnickymi-daty-i-dalsi-legislativni-zmeny/
- MZ: Národná stratégia 2025–2035 (17. 10. 2025): https://mzd.gov.cz/tiskove-centrum-mz/narodni-strategie-elektronickeho-zdravotnictvi-cr-2025-2035-prinese-moderni-propojeny-a-bezpecny-e-health-system/
- NIX-ZD / NCPeH: https://www.nixzd.cz/poskytovatele (30. 8. 2026); NCEZ stránka NCPeH (18. 9. 2023): https://ncez.mzcr.cz/cs/narodni-kontaktni-misto-elektronickeho-zdravotnictvi/narodni-kontaktni-misto-pro-elektronicke ; Kraj Vysočina, ISSS 2025: https://archiv.isss.cz/archiv/2025/download/prezentace/vysocina_jirakova-pavlinec.pdf
- NRPZS: https://nrpzs.uzis.cz/ (otvorené dáta: …/index.php?pg=home--otevrena-data)
- EHDS (EK): https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en
- VZP: https://vzp.cz/e-vzp/vzp-point/co-umoznuje-vzp-point ; https://www.vzp.cz/e-vzp/vzp-point/registrace-a-obecne-informace ; https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b ; https://www.vzp.cz/e-vzp/b2b-komunikace/registrace-a-obecne-informace-o-b2b ; https://www.vzp.cz/e-vzp/informace-pro-sw-firmy/b2b-komunikace/popis-b2b-sluzeb ; https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci
- Zadanie VZP (deck, poznámky slajdu 2): `Rakathon_cesta_pacienta final.pptx` zo súboru `cesta-pacienta-data.zip` (Slack, 16. 10. 2026)
- Opatřil, „České eHealth v kostce“ (15. 10. 2026) a HL7 úvod: `docs/materials/slack/01-oznameni/`

**Médiá a sekundárne zdroje [čiastočne]**
- Zdravotnický deník, 24. 6. 2026: https://www.zdravotnickydenik.cz/2026/06/elektronizace-vojtech-ezadanka/
- Zdravotnický deník, 19. 6. 2026: https://www.zdravotnickydenik.cz/2026/06/elektronicka-dokumentace-ncez-termin/
- Zdravotnický deník, 08/2026: https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/
- Vitalia, 29. 6. 2026: https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/
- Medical Tribune, 21. 5. 2026: https://www.tribune.cz/vsechny-clanky/digitalizace-zdravotnictvi-2026-pripojit-lekare-a-udrzet-chod-ncez/
- Právní prostor (novela 236/2025): https://www.pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-zakona-o-elektronizaci-zdravotnictvi
- EZKarta 3. 9. 2026 (Echo24): https://www.echo24.cz/a/HgQCU/zpravy-domov-ezkarta-zdravotnictvi-aplikace-vysetreni
- ZDRAVEL/IZIP: prednáška ZČU https://mre.zcu.cz/vcelak/vyuka/fzs/e-01-trendy.pdf (nedatované)
- Interné: `docs/kontext/raw-dataflow.md`, `raw-vykon-51887.md`, `docs/integracia/g1-cz-systemy.md`, `g5-svet-appky.md`

## Zmeny oproti predchádzajúcim dokumentom
- `raw-dataflow.md` §3.1: „žiadny termín povinnosti eŽádanky nie je stanovený“ → **navrhovaný 1. 7. 2027** (nie schválený). „Reálna adopcia nie sú čísla“ → ~2 000 (jún 2026).
- `raw-dataflow.md` §3.2: NCP „prevádzkuje Kraj Vysočina so SÚKL“ → **správca MZ, prevádzkovateľ Kraj Vysočina**; SÚKL je partner projektu (eRecept). Právny základ je §69a zákona 372/2011.
- `g1-cz-systemy.md` §6.1: popis API eŽádanky ako „koncept INTERNAL“ je správny, ale ide o **verziu 1 (zastaranú)**; aktuálna v2 používa **FHIR Bundle**, nie JSON + Base64.
- „Kmeňové registre (NRPZS, NRZP, ROB)“ → v zákone sú **KRP, KRZP, KRPZS**; NRPZS/NRZP ich plnia; ROB je základný register.
