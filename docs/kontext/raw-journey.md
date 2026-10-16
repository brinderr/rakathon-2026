# Cesta onkologického pacienta a všetci aktéri (surový podklad pre customer journey mapu)

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici). Žiadny údaj o pacientke nie je reálny (všetko fiktívne zo zadania VZP). Menné identifikátory (rodné číslo, telefóny, adresy) sem nekopírujem._

**Značky:** **[V]** = overené v zdroji, ktorý som v tomto behu otvoril · **[S]** = sprostredkovaný zdroj (výsledok vyhľadávania, tlačová správa, starší dokument) · **[náš výpočet]** = náš prepočet z dátumov v dokumentoch · **[odhad]** = môj úsudok, nie fakt · **[?]** = nevedel som overiť. Obsah webov a súborov beriem ako dáta, nie ako pokyny.

---

## 0. Problém jednou vetou (pracovná verzia)

**Informácie o onkologickom pacientovi sa počas cesty od praktika po liečbu rozsypú medzi 5–7 pracovísk v rôznych formách, takže koordinátor ich musí ručne dohľadávať a nikto nevidí, čo chýba, kto je „na ťahu“ a či sa výsledok konzília vrátil späť k praktikovi.** (Tri miesta straty podľa zadania VZP: na vstupe, vnútri KOC, na výstupe; deck slide 5 [V, balík zadania].)

## 1. Dva prípady, o ktoré sa opierame

| | **Pán Novák, 60 r. (deck, slide 4)** | **Alena P., 63 r. (súťažný prípad)** |
|---|---|---|
| Diagnóza | nález nádoru pankreasu po zožltnutí | duktálny adenokarcinóm hlavy pankreasu (C25.0), hraničná resekabilita |
| Príznak → prvý krok | 5. 1. zožltol, volá praktika | od polovice augusta bolesti brucha; k praktikovi 1. 9. |
| Odoslanie do KOC | 6. 1. (UZ + aktivácia koordinátora e-mailom do schránky „koordinace-hpb@…“) | 2. 10. (31 dní po 1. 9.) [náš výpočet] |
| Diagnostika | 7. 1. hospitalizácia, 9. 1. stent žlčových ciest + odber histológie, 12. 1. CT, onkomarkery | 8. 10. CT (KOC 1), 12. 10. EUS-FNB biopsia (KOC 2), 15. 10. odbery, 19. 10. histológia |
| MDT | 13. 1. a 20. 1. (2 konzíliá) | 21. 10. (jedno) |
| Liečba | **operácia 26. 1. = 21 dní od príznaku** | onkologické konzílium 4. 11. 10:30 (MDT odporúča neoadjuvantnú chemoterapiu); **64 dní od 1. 9.** |

Poznámky:
- „Novák“ je naše označenie; deck má iba „Pacient 60 let“ (v súboroch nie je slovo „Novák“) [V, deck].
- Prevzatie → MDT v prípade Aleny: 2. 10. → 21. 10. = **19 dní v KOC**, **31 dní pred KOC** (1. 9. → 2. 10), spolu **50 dní** od prvého kontaktu po MDT; od polovice augusta cca **67 dní** po MDT a **81 dní** po konzílium [všetko náš výpočet z dátumov správ].
- **Pozor, mätúce označenie:** „KOC 1“ a „KOC 2“ v zadaní sú dve **rôzne nemocnice** (Nemocnica Severní = KOC 1, Nemocnica Lipová = KOC 2), nie „typ koordinátora“. Typy koordinátora podľa MZ sú K1/K2/K3 (nižšie) [V, zadanie].
- **Nová zhoda, ktorú treba mať na pamäti:** pacientka má v dokumentoch „ZP 211“. Kód 211 je **Zdravotní pojišťovna ministerstva vnitra ČR**, **nie VZP** (VZP je 111) [V: https://mzd.gov.cz/wp-content/uploads/2013/07/fondy_zustatky_popis-dat.txt]. Teda „poisťovňa“ a „revízny lekár“ v našom prípade nemusí byť VZP; nástroj nesmie byť „iba pre VZP“. Či je to zámer zadávateľov, neviem [?].

## 2. Kto je koordinátor (aby sme sa nestratili)

- Nelieči a nerozhoduje o liečbe; spája kroky, stráži vyšetrenia, výsledky a termíny, pomáha pacientovi orientovať sa, konajú na základe požiadavky ošetrujúceho lekára; všíma si opakované prieťahy [V: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ , MZ 2. 9. 2026].
- **Tri typy:** K1 pri silnom podozrení na nádor vedie pacienta diagnostikou a odovzdá ho s podkladmi do KOC (pôsobí aj na „predsunutých“ pracoviskách, napr. gastroenterológia, pneumológia); K2 pôsobí v KOC po diagnóze a pomáha s podkladmi pre MDT; K3 rieši následnú starostlivosť po liečbe [V, MZ 2. 9. 2026]. Deck to kreslí ako K1 „pred liečbou“, K2 „počas liečby“, K3 „po liečbe“ [V, deck slide 3 obrázok]. **Obe verzie sa nezhodujú presne** (MZ: K2 = po diagnóze pred MDT; deck: K2 = počas liečby) [?]. Alena = v praxi K1 + K2 v jednom KOC [odhad].
- **Nemusí byť zdravotník** (po zaškolení a s vymedzenými kompetenciami) [V, MZ 2. 9. 2026]. Od 2026 aspoň 1 koordinátor v každom KOC; platba **250 Kč** za výkon z verejného poistenia; „nižšie desiatky miliónov Kč ročne“ [V, MZ 2. 9. 2026].
- Počet KOC: 15 KOC pre dospelých (+2 detské); KOC je štatút nemocnice (1–3 poskytovatelia), nie samostatná inštitúcia; musí mať aj klinického psychológa, nutričnú terapiu, sociálneho pracovníka, paliatívu a „pracovníka pre koordináciu“ [V cez sesterský podklad `raw-cz-system.md` §1: Věstník MZ 11/2025, https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf ; zoznam KOC https://mzd.gov.cz/wp-content/uploads/2026/02/Seznam-KOCdo-a-KOCde-unor-2026-v.-1.0.pdf].

## 3. Cesta po etapách (mikrokroky)

Skratky: PL = praktický lekár, KOC = komplexné onkologické centrum, MDT = multidisciplinárny tím (konzílium lekárov rôznych odborov), NIS = nemocničný informačný systém, AIS = ambulantný systém, EUS-FNB = biopsia pankreasu ihlou cez endoskop, ECOG = stupeň výkonnosti pacienta (0–4).

### Etapa 0. Zdravý človek: prevencia a skríning
Cieľ: nájsť rakovinu skôr, ako urobí príznaky.

| # | Kto | Čo robí | Nástroj / kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 0.1 | Pacient (zdravý), PL | Preventívna prehliadka u PL od 18 r. raz za 2 roky (hradená) | ordinácia, objednávka telefón/web | 1× / 2 roky [V: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/jakou-preventivni-peci-mi-v-dospelosti-pokryva-verejne-zdravotni-pojisteni] | Na prehliadky chodí menej ako 40 % ľudí (analýza VZP, staršie dáta) [S: https://www.vzp.cz/o-nas/aktuality/analyza-vzp-na-preventivni-prohlidky-k-praktikovi-chodi-mene-nez-40-lidi] |
| 0.2 | VZP (poisťovňa) | Adresné pozvánky na skríning listom (od 2014); pripomienky v aplikácii Moje VZP | papierový list, Moje VZP | ročne | Odozva len ~19–20 % (mamografia 2014: 19,5 %); všetci dostanú rovnakú správu [S: https://www.vzp.cz/o-nas/aktuality/kazda-5-pozvanka-uspela-na-mamograf-loni-prislo-o-120-tisic-zen-vice-nez-pred-sedmi-lety , prevzaté z `08`] |
| 0.3 | Pacient, PL/gynekológ, skríningové centrum | Mamografia od 45 r. každé 2 roky; test krvi v stolici alebo kolonoskopia; cytológia; pľúcny nízkodávkový CT pilot; prostata pilot | žiadanka, centrum, laboratórium | termín podľa centra | Účasť: mamografia ~60 %, kolorektál ~29 % (OECD 2022) [S: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf]. Veková hranica kolorektálneho skríningu: VZP stránka 50 r. vs. MZ 45 r. (rozpor, [?]) |
| 0.4 | Rádiológ, laboratórium, PL | Výsledok skríningu ide pacientovi/PL; hraničné nálezy sa môžu „odložiť na budúci rok“ | PDF/papier/NIS | dni–týždne | Skríning nie je dostatočne systematizovaný, pacient nemá jedného sprievodcu [V: `02` Tichopad, prednáška 15. 10. 2026] |
| 0.5 | — | **Pankreas nemá populačný skríning.** USPSTF odporúča neskríningovať bezpríznakových dospelých; v zozname hradených skríningov v ČR pankreas nie je | — | — | Rakovina pankreasu sa preto zisťuje až podľa príznakov; 55 % prípadov sa zachytí v štádiu III–IV [V: https://www.aafp.org/afp/2019/1215/od1 ; ÚZIS Novotvary 2019–2021, https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf] |

Ďalší aktéri: Národné skríningové centrum (ÚZIS), mamografické centrá (73 centier, VZP [S: `08`]), MZ.
Emócia pacienta: pokoj až ľahostajnosť; „mne sa to nestane“ [odhad].

### Etapa 1. Prvé príznaky doma
Cieľ: človek si všimne, že niečo nie je v poriadku, a ide to riešiť.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 1.1 | Pacient | Všimne si príznaky: bolesť v hornej časti brucha so šírením do chrbta, zožltnutie očí a kože, tmavý moč, svetlá stolica, strata chuti, chudnutie, únava | — | Alena: ~2 týždne bolesti pred návštevou; tmavý moč 5 dní [V: správa 04]. Novák: zožltol 5. 1., volá PL hneď [V: deck] | Príznaky sú nešpecifické a často sú aj pri iných chorobách [V: https://www.nhs.uk/conditions/pancreatic-cancer/symptoms/]; niekto rieši hneď, niekto popiera a príde neskoro [V: `02` Tichopad] |
| 1.2 | Pacient | Samoliečba (voľnopredajné lieky na bolesť) | lekáreň | dni | Maskuje problém; Alena brala paracetamol, len čiastočná úľava [V: správa 07] |
| 1.3 | Rodina / blízki | Všimnú si, povzbudia, odvezú, volajú dcéra | telefón | — | Alena žije sama, dcéra v tej istej obci [V: správa 04]; pacienti nad 70 r. často nezvládajú smartfón [V: `02` Tichopad] |
| 1.4 | Zamestnávateľ | Pacientka dosiaľ pracuje (účtovníčka) | — | — | Absencia sa rieši až neskôr PN [V: správy 04, 07] |
| 1.5 | Pacient | Objedná sa k PL (telefón/web/čakáreň) | telefón, web | Alena prvá návšteva 1. 9. | Slobodná voľba lekára: PL nie je povinná „brána“; pacient môže ísť priamo k špecialistovi, ale sám sa musí zorientovať [V: https://mzd.gov.cz/tiskove-centrum-mz/lekaru-je-dost-chodime-k-nim-ale-zbytecne-casto-rika-odbornice-z-ministerstva-zdravotnictvi/ (24. 10. 2018)] |

Emócia: bagatelizácia, potom obava; „nechcem otravovať“ [odhad].

### Etapa 2. Praktický lekár: prvé vyšetrenie a liečba „naslepo“
Cieľ: PL zistí, čo to môže byť, a rozhodne o ďalších krokoch.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 2.1 | PL | Anamnéza + vyšetrenie 1. 9. (teplota 38,1 °C, mierna žltačka očí) | ambulantný softvér (AIS; CGM + MEDaX tvoria spolu cca 70 % trhu) | 1 návšteva | PL má len papier/PDF od kardiológa (kópia), nie živý prístup [V: správa 01 „Kopie PL“; `02` Opatřil] |
| 2.2 | Sestra PL, laboratórium LabJih | Odber krvi a moču 1. 9.; výsledky v ten deň, kultivácia moču až 4. 9. | lab report (PDF/papier) | 0–3 dni | Výsledky chodia ako samostatné dokumenty [V: správa 02] |
| 2.3 | Rádiologické centrum | RTG pľúc 3. 9. na žiadosť PL | žiadanka, PDF | 2 dni | Ďalší dokument v inej budove [V: správa 03] |
| 2.4 | PL | Empirická liečba antibiotikom (od 2. 9., 7 dní) pre podozrenie na infekciu; telefonická kontrola 4. 9. | telefón | 3 dni | Pôvodná príčina sa nenájde, prieťah ~4 týždne k zobrazeniu brucha [V: správy 04, 06] |
| 2.5 | PL, ČSSZ, zamestnávateľ | Ak je potrebné, PL vystaví eNeschopenku; prvých 14 dní platí zamestnávateľ náhradu mzdy (60 %), od 15. dňa ČSSZ nemocenské | eNeschopenka (elektronicky) | od 15. dňa ČSSZ | Alena je k 2. 10. už v PN [V: správa 07; https://www.cssz.gov.cz/-/nejcastejsi-otazky-k-docasne-pracovni-neschopnosti] |
| 2.6 | PL | Objedná gastroenterológa (4. 9. → termín 15. 9.) | telefón/web | 11 dní čakania | Čakanie nepatrí do žiadneho „fast tracku“ [V: správa 04] |

Emócia: neistota; „čo to je?“; úľava po antibiotikách [odhad].

### Etapa 3. Odborník a prvé zobrazenie
Cieľ: zistiť, čo je v bruchu.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 3.1 | Gastroenterológ (Poliklinika Jižní) | Vstupné vyšetrenie 15. 9. (bolesť do chrbta, úbytok 4 kg); objedná USG „na najbližší voľný termín“ | ambulantná správa, objednávka | USG 29. 9. = 14 dní | Čakanie na USG; upozornenie na apixaban (48 h pred výkonom) [V: správa 05] |
| 3.2 | Rádiológ (RDG polikliniky) | USG 29. 9.: ložisko hlavy pankreasu 34×30 mm „suspektné z malignity“; odporúča CT s pankreatickým protokolom alebo EUS | správa → gastroenterológ | 1 deň | Výsledok ide „cestou gastroenterológa“; pacientka s nálezom sama ide späť k PL [V: správa 06; zadanie] |
| 3.3 | PL | Snaží sa zabezpečiť CT, v dostupných pracoviskách termín nenašiel (2. 10.) | telefóny | 3 dni (29. 9. → 2. 10.) | Kapacity zobrazenia nie sú vidieť; spoločný prehľad kapacít je len „v príprave“ [V: správa 07; MZ 2. 9. 2026] |
| 3.4 | Pacient, rodina | Čaká, bolesť rastie, stráca na váhe | — | — | Alena hlási „výrazná úzkosť, zlý spánok“ [V: správa 07] |

Emócia: strach, vyčerpanie z čakania.

### Etapa 4. Odoslanie do KOC (žiadosť o prevzatie)
Cieľ: PL odovzdá prípad do centra, ktoré má všetky odbory.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 4.1 | PL | Rozhodne o odoslaní do KOC a vyberie centrum (15 KOC pre dospelých) | zoznam KOC | — | Nie je jeden jednotný vstup; zákon určuje obsah žiadanky, nie kanál (e-mail/telefón/papier závisí od KOC) [S: `raw-dataflow.md` §0; deck slide 7] |
| 4.2 | PL | Napíše epikrízu + „žiadosť o prevzatie do KOC 2“ (2. 10.) s podozrením C25.0 | Word/PDF z AIS | 1 hod | **Výsledky vyšetrení v epikríze nie sú** — len zoznam 5 pracovísk, kde sa dajú nájsť; chýba e-mail pacientky; otázka na MDT je všeobecná [V: správa 07] |
| 4.3 | PL | Odošle žiadosť koordinátorovi KOC | e-mail do spoločnej schránky koordinácie (príklad v decku „koordinace-hpb@…“); iné kanály [?] | deň | PL nedostane potvrdenie, či bol prípad prijatý, čo chýba, ani ako MDT rozhodlo [V: deck slide 5] |
| 4.4 | PL | Upozorní na apixaban, úzkosť; uvedie, že pacientka vie o podozrení a **súhlasí so zdieľaním informácií s dcérou** | text v epikríze | — | Súhlas je len veta v texte, nie štruktúrované pole [V: správa 07] |
| 4.5 | Pacient | Dozvie sa „podozrenie na nádor“ | rozhovor u PL | — | Silná emócia, žiadna navigácia v ďalšom kroku |

Čas: Alena 31 dní od 1. 9. do odoslania; Novák 0–1 deň (UZ a aktivácia koordinátora 6. 1.) [náš výpočet; V: deck].
Emócia: šok, strach, bezmocnosť.

### Etapa 5. Prevzatie koordinátorom: dohľadanie dokumentov a plán
Cieľ: koordinátor zhromaždí všetko a naplánuje kroky.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 5.1 | Koordinátor KOC 2 | Otvorí novú žiadosť v schránke, rozhodne o prevzatí (nový → aktívny) | e-mail, NIS KOC [?] | v ten deň | Pracuje na základe požiadavky ošetrujúceho lekára; MZ očakáva používanie NIS „v plnom rozsahu“ a písomný záznam o koordinácii [S: `raw-cz-system.md` §3.2, Věstník MZ 11/2025 Čl. 6] |
| 5.2 | Koordinátor | Zistí, čo chýba (správy 01–06) a vyžiada ich u kardiológa, LabJih, Rádiologického centra, PL, gastroenterológa, RDG | telefón, e-mail; formy PDF/foto/CD [odhad] | dni | Každé pracovisko odpovie inak; niečo príde poštou; správy nie sú strojovo čitateľné [odhad podľa `02`, `raw-dataflow.md` §0] |
| 5.3 | Koordinátor | Objedná CT — KOC 2 nemá voľný termín, objedná v **KOC 1** | telefón/e-žiadanka [?] | 2. 10. → 8. 10. = 6 dní | Obrazové dáta (snímky) z KOC 1 musia byť dostupné pre rádiológa v KOC 2 — správa o tom nehovorí [V: zadanie, správa 08] |
| 5.4 | Koordinátor, endoskopia KOC 2 | Objedná biopsiu EUS-FNB (12. 10.) a kontrolné odbery (15. 10.) | interný NIS/telefón | 10–13 dní od žiadosti | Apixaban treba vysadiť 48 h vopred; v správe je nemožný dátum poslednej dávky [V: správa 09] |
| 5.5 | Koordinátor | Objedná onkológa, psychológa, algeziológa; informuje pacientku a dcéru o termínoch | telefón/SMS/e-mail [odhad] | — | Termíny „v hlave a v e-maile“ [odhad `vzp-cesta-pacienta.md` §2.2]; psychológ a algeziológ prídu až po MDT [V: zadanie] |
| 5.6 | Doprava (rodina, ZZS, zdravotnícka doprava) | Pacientka cestuje medzi 3 pracoviskami (Praha 8, Praha 4, mimo Prahy) | auto/MHD; sanitka len pri zdravotnej indikácii (tlačivo VZP-34, najbližší zmluvný poskytovateľ) | — | Doprava sa hradí len zo zdravotných dôvodov, nie pre zlé spojenie [V: https://www.vzp.cz/o-nas/aktuality/preprava-pacienta-vozidlem-zdravotnicke-dopravni-sluzby (21. 7. 2023)] |
| 5.7 | Vedenie nemocnice, dodávateľ NIS | Vedenie rozhoduje o kapacite koordinátorov (min. 1,0 úväzku na KOC) a nástrojoch; NIS dodávajú STAPRO, Asseco, CGM, ICZ — vzájomne nekomunikujú | NIS | — | Nekompatibilné siete (eZpráva, MEDDOX, ePACS, ClinicBox, STAPRO MISE) [V: `02` Opatřil] |

Čas v KOC: 2. 10. → 21. 10. = 19 dní [náš výpočet].
Emócia: úľava („niekto sa ma ujal“) aj zmätok („kam mám ísť, kedy?“) [odhad; Hlas onkologických pacientov: priemerne 4 špecialisti, kým pacient získa termín [S: https://www.novinky.cz/clanek/zdravi-cesta-onkologickeho-pacienta-systemem-je-slozita-kazde-zdrzeni-je-riziko-40499342 (1. 12. 2024)]].

### Etapa 6. Diagnostika v KOC: CT, biopsia, patológia, laboratórium
Cieľ: potvrdiť, že ide o rakovinu, a zistiť rozsah.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 6.1 | Rádiológ (KOC 1) | CT brucha a hrudníka s kontrastom 8. 10.: nádor 35 mm, obkružuje v. mesenterica superior ~200°, kontakt s a. mesenterica superior do 150°, podozrivá uzlina, bez vzdialených metastáz | popis → PDF; snímky v PACS/na CD | 1 deň | Snímky a správa v inej nemocnici než MDT; opakované vyšetrenia sa robia v 72 % pri nedostupných cudzích snímkach vs 11 % pri nahraných do PACS [V: https://doi.org/10.2214/ajr.11.6890] |
| 6.2 | Endoskopista, anestéziológ, sestra (KOC 2) | EUS-FNB 12. 10. v analgosedácii (3 prechody ihly); informovaný súhlas | protokol (PDF) | 1 deň | Apixaban: „posledná dávka 18. 10.“ pri výkone 12. 10. a „znova od 21. 10.“ (dátumový rozpor, nehádať) [V: správa 09] |
| 6.3 | Patológ (KOC 2) | Histológia: duktálny adenokarcinóm G2–G3, perineurálna invázia, imunohistochémia; vydaná 19. 10. | patologický nález | sľúbené do 3 prac. dní, vydané na 5. pracovný deň | Materiál „odber 20. 10.“, správa vydaná 19. 10. (rozpor) [V: správa 11; náš výpočet] |
| 6.4 | Laboratórium (KOC 2) | Odbery 15. 10.: CA 19-9 312 kU/l (vysoké), CA 125 48 (mierne vysoké), CEA v norme; bilirubín 23 | LIS → NIS | 1 deň | Vzorový záver spomína iba CA 19-9 [V: správa 10, MDT zaver] |
| 6.5 | Onkológ ambulancie KOC | Indikuje kontrolné odbery; **ECOG (výkonnostný stav) nie je nikde v dokumentoch** | ambulantná správa | — | ECOG sa objaví až v záveri MDT ako „nestanovené“ [V: MDT zaver] |
| 6.6 | [Novák] Gastroenterológ/endoskopista | Stent žlčových ciest + histológia 9. 1.; CT 12. 1. | hospitalizácia | 5 dní | Vo „fast-tracku“ ide všetko za 7 dní [V: deck slide 4] |
| 6.7 | MZ / ÚZIS | Meria čas od prvého zobrazovacieho vyšetrenia; čakacie doby sa nesledujú systematicky | indiko.cz | — | Chýba presná metrika [V: OECD ČR 2025; MZ 24. 3. 2026 cez `08`] |

Čas: CT → histológia 8. 10. → 19. 10. = 11 dní [náš výpočet].
Emócia: strach z biopsie, 5 dní napätého čakania na výsledok [odhad].

### Etapa 7. Príprava podkladu pre MDT (handover)
Cieľ: zložiť „spis“ na rozhodnutie, ktorý je úplný k dnešnému dňu.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 7.1 | Koordinátor | Z 11 dokumentov (správy 01–11) zloží handover (20 položiek: nacionále, kontakty, epikríza, otázka MDT, komorbidity, lieky, alergie, ECOG, váha/výška, príznaky, vyšetrenia, labáky, histológia, želania pacienta) a zápis MDT (7 sekcií) | Word, e-mail, NIS | hodiny až dni [odhad; presné minúty treba od mentorov, [?]] | Ručné prepisovanie; ECOG, e-mail pacientky, zoznam členov MDT chýbajú; váha 65 kg (15. 9.), nie 63 kg (26. 10.) [V: zadanie, správy] |
| 7.2 | Koordinátor | Kontrola úplnosti: čo chýba, čo si odporuje | vlastná kontrola | — | Napr. rozpor kardiológ (vysadiť apixaban 48 h) vs MDT záver (samostatne nevysadzovať, postup individuálne) [V: správy 01, 05, MDT zaver] |
| 7.3 | Koordinátor ↔ PL / onkológ | Vyžiada doplnenie chýbajúceho (napr. ECOG) | e-mail/telefón | — | Odpoveď nemusí prísť pred MDT [odhad] |
| 7.4 | Prezentujúci lekár (gastroenterológ KOC 2) | Pripraví krátku prezentáciu prípadu | slajdy/NIS | 2–4 min na prípad na MDT [S, `vzp-cesta-pacienta.md` §2.1] | Podklad príde neskoro alebo neúplný [V: deck slide 5] |
| 7.5 | Pravidlo | Do podkladu patrí len to, čo bolo známe k 21. 10.; správy 12 (algeziológ 26. 10.) a 13 (psychológ 27. 10.) nie | — | — | Správa 13 sa týka súhlasu s dcérou — už je v správe 07 [V: zadanie] |
| 7.6 | Guideline | Diskusia a rozhodnutie majú prebehnúť až keď je kompletná dokumentácia dostupná všetkým členom MDT; zároveň liečba sa nemá odkladať, ak sa MDT nedá včas zvolať | — | — | Napätie medzi úplnosťou a rýchlosťou [V: https://kdp.uzis.cz/res/guideline/20-organizace-cinnost-multidisciplinarniho-tymu-v-onkologii-final.pdf , verzia 3.0 z 13. 12. 2022] |

Dôkaz o probléme: v Leeds mal pankreatický MDT neúplné podklady pri odoslaní u 65 % pacientov [S: https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf]; UK MDT pre pľúca: rozhodnutie odložené ~24 %, ECOG doložený len u ~60 % [S][?, `vzp-cesta-pacienta.md` §3.3].
Emócia pacienta: nevidí tento krok; čaká [odhad].

### Etapa 8. Konzílium MDT a rozhodnutie
Cieľ: spoločne rozhodnúť o liečbe.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 8.1 | Koordinátor/administrátor MDT | Organizuje schôdzu, určí, kto sa prerokuje, zhromaždí informácie, zapisuje výsledok, informuje ošetrujúceho a praktického lekára | zoznam prípadov, NIS/e-mail | pred schôdzou | Úloha „kto je zodpovedný za zápis a odoslanie“ je len odporúčanie, nie povinný postup [V: KDP v3.0] |
| 8.2 | Členovia MDT | 21. 10.: HPB chirurg, klinický onkológ, radiačný onkológ, gastroenterológ, rádiológ, patológ + koordinátor KOC; minimum je 3 (diagnostik, chirurg, internista-onkológ) | osobne/videokonferencia | frekvencia „podľa veľkosti centra“; príklad jednej digestívnej komisie: 1× týždenne ~20 prípadov | MDT sa v praxi môže zúžiť na „telefonát dvoch lekárov“ bez zápisu [V: KDP v3.0; `02` Tichopad] |
| 8.3 | Rádiológ | Revízia CT: presné cT/cN sa potvrdí po radiologickej revízii | PACS | — | Dostupnosť snímkov z KOC 1 [V: MDT zaver] |
| 8.4 | Predsedajúci MDT | Vedie rozhodnutie: hraničná resekabilita → neoadjuvantná systémová chemoterapia, potom restaging a nové MDT | zápis | 21. 10. (2 dni po histológii) | Pri pankrease platí poisťovňa liečbu až po MDT; zápis je teda aj platobný dokument [V: OECD ČR 2025 cez `vzp-cesta-pacienta.md` §3.2]; MDT pokrýva ~60 % nových pacientov so solídnym nádorom (odporúča sa ~80 %) [V: OECD ČR 2025] |
| 8.5 | Poisťovňa pacienta | Zaznamená výkon MDT; platí liečbu | výkazy | — | U Aleny je poisťovňa kódu 211, nie VZP [V: MZ kódy ZP] |

Pre borderline-resekabilný nádor odporúčajú konsenzuálne guideliny neoadjuvantnú chemoterapiu [V: https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq].
Emócia pacienta: nie je prítomný; čaká na telefón [odhad]. 6–24 % prípadov MDT sa odloží pre chýbajúce údaje [S][?, štúdie z `vzp-cesta-pacienta.md` §3.3].

### Etapa 9. Oznámenie pacientovi a rodine + podporná starostlivosť
Cieľ: pacient rozumie plánu a dostane podporu.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 9.1 | Onkológ KOC 2 (kto presne [?]) | Oznámi diagnózu a plán; diagnóza bola pacientke oznámená 23. 10. | rozhovor | 2 dni po MDT | Podľa správy 13 nasleduje depresívna reakcia [V: správa 13] |
| 9.2 | Pacientka, dcéra | Dcéra ako hlavná opora; pacientka žiada informovať aj dcéru; zákon umožňuje pacientovi určiť osoby, ktoré smú dostať informácie | súhlas, rozhovory | — | Súhlas rozptýlený v dokumentoch (07, 13, záver MDT) [V: správy; https://www.epravo.cz/top/clanky/pravo-na-informace-o-zdravotnim-stavu-a-nakladani-s-nimi-104523.html (§ 33 zákona 372/2011, S)] |
| 9.3 | Koordinátor | Informuje pacientku o pláne, po súhlase komunikuje aj s dcérou; objedná onkologické konzílium (4. 11. 10:30), návazné vyšetrenia | telefón/SMS/e-mail | 14 dní do konzília | Kontakt a sprevádzanie je „iba koordinátor“ [V: MDT zaver, odporúčanie 6] |
| 9.4 | Algeziológ (KOC 1, 26. 10.) | Bolesť NRS 6/10 v pokoji, 8/10 prielomová; nasadí tramadol, metamizol, paracetamol, metoklopramid, laktulózu; kontrola 14 dní | ambulantná správa | 5 dní po MDT | Tramadol + antidepresíva = riziko serotonínového syndrómu — informácia musí dôjsť k psychiatrovi [V: správa 12] |
| 9.5 | Klinický psychológ (KOC 2, 27. 10.), psychiater (3. 11.) | HADS úzkosť 14, depresia 12; distress 8/10; podporná terapia 1×/týždeň | správa | 6 dní po MDT | Cross-pracovisko (KOC 1 vs KOC 2) [V: správa 13] |
| 9.6 | Nutričný terapeut / dietológ | Výživa pre úbytok váhy a nechutenstvo (odporúčanie MDT 4) | [?] | [?] | V dokumentoch nie je, kto a kde to zabezpečí [V: MDT zaver] |
| 9.7 | Lekáreň | Výdaj nových liekov na eRecept; identifikátor (12-miestny kód) príde SMS/e-mailom alebo aplikáciou | eRecept | deň | Údaje o platnosti staršie (2018–19) — overiť aktuálne [S: https://mzd.gov.cz/tiskove-centrum-mz/erecept-se-osvedcil-jeho-oblibenost-roste/] |
| 9.8 | Pacientske organizácie | Hlas onkologických pacientov mapuje cestu pacienta, robí prieskumy (~1 000 respondentov, priemerne 4 špecialisti na telefonovanie, 20 % >50 km k onkológovi); Liga proti rakovine Praha podporuje pacientov (rehabilitačné pobyty) | web, telefón | — | Informácie o poradní nie sú v jednom mieste [S: Novinky 1. 12. 2024; LPR cez výsledok vyhľadávania [?]] |

Emócia pacienta (z dokumentov): plačlivosť, napätie, obavy z operácie, bolesti a budúcnosti, nespavosť, strata záujmu o obľúbené činnosti, vyčerpanie; distress 8/10 [V: správa 13].

### Etapa 10. Spätná väzba: praktik, revízny lekár, registre; uzavretie slučky
Cieľ: všetci, ktorí to potrebujú, vedia, ako MDT rozhodlo.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 10.1 | Koordinátor | Vyberie referovaný prípad, nahrá správu z MDT (diagnóza C25.0, 6 odporúčaní) | NIS/e-mail | v deň MDT | Dnes nie je jednotný nástroj; formát nie je štruktúrovaný [V: deck slide 11] |
| 10.2 | PL (kópia záveru) | Dostane záver aj s pôvodným kontextom o pacientovi; potvrdí doručenie | e-mail/pošta/NIS [?] | — | Kanál ani **dôkaz doručenia** zákon nepredpisuje [S: `raw-dataflow.md` §0 bod 9]; PL dnes nevie, či bol pacient prijatý, čo chýba a ako MDT rozhodlo [V: deck slide 5] |
| 10.3 | Revízny lekár (lekár poisťovne) | Dostane informáciu automaticky; môže vyžiadať doplnenie | poisťovňa | — | Čo revízny lekár robí: kontroluje vyúčtovanie, schvaľuje úhradu vybraných liekov/pomôcok/výkonov, píše posudky; **nerozhoduje o liečbe** [V: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/co-delaji-revizni-lekari-k-cemu-slouzi-revizni-cinnost-vzp]. Deck nehovorí, ktorej poisťovne revízny lekár je [?] |
| 10.4 | KOC / patológ | Hlásenie novotvaru do Národného onkologického registra (NOR, ÚZIS); osobitné hlásenie z patológie | elektronicky/papier | — | KOC má povinne posielať hlásenie za každého pacienta, ktorého liečbu prevzalo [S: https://www.uzis.cz/res/file/registry/nor/nor-metodika-010-20180817-1.pdf ; presné lehoty [?]] |
| 10.5 | Vedenie nemocnice, MZ | Počet intervencií koordinátora je sledovaný indikátor kvality; čas do liečby a podiel pacientov s MDT sa zverejňujú po centrách | indiko.cz | mesiace | MDT vykazované ≠ MDT reálne [S: `08` §8] |
| 10.6 | Koordinátor | Uzavrie slučku → stav „uzavretý“ | — | — | Dnes nikto nevie, či je slučka uzavretá [V: `vzp-cesta-pacienta.md` §2.2] |

Emócia pacienta: nevidí túto vrstvu; ak sa slučka nezavrie, PL nevie odpovedať na otázku „čo mi povedali?“ [odhad].

### Etapa 11. Liečba: chemoterapia, restaging, operácia, ožarovanie
Cieľ: začať a doviesť liečbu.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 11.1 | Onkológ | Onkologické konzílium 4. 11., plán neoadjuvantnej chemoterapie; informovaný súhlas | ambulancia | 14 dní po MDT | Konkrétny režim v MDT závere nie je uvedený [V: MDT zaver] |
| 11.2 | Nemocničná lekáreň | Centralizovaná príprava cytostatík (v ČR 46 pracovísk, > 0,5 mil. dávok ročne): žiadanka → kontrola farmaceutom → príprava → transport | NIS, žiadanka | v deň podania | Pozdržanie lekárne = pozdržanie podania [S: https://www.cls.cz/media/tiskova_zprava_nemocnicni_farmacie.pdf (2024)] |
| 11.3 | Sestra (denná onkológia) | Podanie chemoterapie; sledovanie | pracovisko KOC | cyklus; v štúdii A021501 8 cyklov po 2 týždňoch (≈ 16 týždňov) | Údaje z USA štúdie; plán určí onkológ [V: https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq] |
| 11.4 | Rodina, doprava | Sprevádzanie, doprava na cykly; poisťovňa hradí sanitku len zo zdravotných dôvodov, spolucestujúceho len ak je odôvodnený lekárom | VZP-34, vlastné auto | — | Sociálne dôvody nestačia [V: VZP doprava 21. 7. 2023] |
| 11.5 | Zamestnávateľ, ČSSZ | PN: prvých 14 dní náhrada mzdy 60 %, od 15. dňa nemocenské; dĺžka podpory [?]; dlhodobé ošetrovné pre rodinu až 90 dní (hospitalizácia aspoň 4 dni, v terminálnom stave bez hospitalizácie) | eNeschopenka, ČSSZ | — | Pravidlá sa menia; overiť aktuálne [V: ČSSZ; S: https://www.cssz.gov.cz/dlouhodobe-osetrovne] |
| 11.6 | Sociálne služby | Príspevok na starostlivosť (zákon 108/2006), sociálny pracovník KOC | Úrad práce, KOC | — | Podmienky [?]; stránka MPSV sa nedala prečítať [?] |
| 11.7 | Radiačný onkológ | Rádioterapia: pre Alenu v závere MDT nie je; adjuvantná chemorádioterapia má sporný prínos | — | — | [S: NCI PDQ] [?] pre typické trvanie |
| 11.8 | MDT (opätovne) | Po neoadjuvancii: kontrolné CT, CA 19-9, nové MDT; posúdenie resekability | PACS, NIS | po liečbe | Nový handover = znovu ručne [V: MDT zaver odporúčanie 3] |
| 11.9 | Chirurg HPB | Operácia: pankreatoduodenektómia (Whipple) s cievnou rekonštrukciou; operačná mortalita 1–16 % | operačná sála | Novák: operovaný 26. 1. (21 dní) | Komplikácie; riziko varuje záver MDT (horúčka, zimnica, ikterus → okamžite lekár) [V: NCI PDQ; MDT zaver] |
| 11.10 | Onkológ | Adjuvantná chemoterapia po operácii: 12 cyklov FOLFIRINOX po 2 týždňoch (≈ 6 mesiacov) alebo 6 cyklov gemcitabínu | KOC | mesiace | Štúdie; konkrétny plán [?] [V: NCI PDQ] |
| 11.11 | Poisťovňa | Platí liečbu po MDT; revízny lekár schvaľuje lieky viazané na jeho súhlas (konkrétne lieky v pankrease [?]) | výkazy | — | Administratívna záťaž centrových liekov (55 signálnych výkonov pre 16 liekov k 4/2025) [S: `raw-cz-system.md` §2.4] |

Emócia: únava, nežiaduce účinky, strach o prácu a peniaze; nádej pri operácii [odhad].

### Etapa 12. Sledovanie po liečbe (koordinátor 3) a recidíva
Cieľ: včas zachytiť návrat choroby a zvládnuť život po liečbe.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 12.1 | Koordinátor 3 | Zabezpečí následnú starostlivosť po ukončení liečby | NIS | po liečbe | MZ ho zaviedol (K3), ale prax a nástroje sú len pilotné [V: MZ 2. 9. 2026] |
| 12.2 | Onkológ, PL | Kontroly (CT, CA 19-9); intervaly [?] | ambulancia | — | Rozdelenie zodpovednosti KOC vs PL |
| 12.3 | MDT | Pri návrate choroby opäť restaging a nové MDT (cyklus) | NIS | — | Nový ručný handover [V: `02` Tichopad] |
| 12.4 | Pacient, rodina | Návrat do práce, rehabilitácia, pacientske organizácie | — | — | Ťažko dostupné info o podpore |
| 12.5 | Pacient | 5-ročné prežitie pri pankrease v ČR 9,3 % (u liečených 12,6 %; diagnóza 2015–2019) | — | — | Silný strach z recidívy [V: ÚZIS Novotvary 2019–2021, https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf] |

### Etapa 13. Paliatíva a koniec života (ak sa neoperuje alebo choroba postupuje)
Cieľ: dôstojný život a úľava od bolesti.

| # | Kto | Čo robí | Kanál | Čas | Čo sa môže pokaziť |
|---|---|---|---|---|---|
| 13.1 | MDT, onkológ | Zmena cieľa liečby na úľavu | — | — | Neskoré rozhodnutie |
| 13.2 | Algeziológ | Silné opioidy, prípadne neurolýza plexus coeliacus | KOC 1 | kontrola po 14 dňoch | [V: správa 12; NCI PDQ] |
| 13.3 | Paliatívny tím / mobilný hospic / lôžkový hospic | Domáca a nemocničná paliatíva; ročne v ČR zomiera ~110 000 ľudí, ~65 000 potrebuje paliatívu | telefón, NIS | — | 62 % zomiera na lôžkach nemocníc, 26 % doma [V: MZ/ÚZIS/ČSPM 2025 cez `08` §6: https://mzd.gov.cz/wp-content/uploads/2025/04/Analyticka-cast-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2025.pdf] |
| 13.4 | Rodina | Dlhodobé ošetrovné bez hospitalizácie pri terminálnom stave; príspevok na starostlivosť | ČSSZ, Úrad práce | — | Vyčerpanie opatrovateľa [S: ČSSZ] |
| 13.5 | Poisťovňa, MZ | Domáca paliatíva v štandardných úhradách od 2017; mobilné špecializované tímy 71 → 157 do 2035 (návrh) | — | — | Dáta o starostlivosti doma nie sú systematicky zbierané [V: `08` §6] |

---

## 4. Všetci aktéri (kto, čo chce, čo ho bolí)

Priamy aktér = zapisuje alebo číta informácie v procese koordinátora (mal by byť v našom nástroji). Nepriamy = platí, reguluje alebo je dotknutý.

| Aktér | Rola v ceste | Čo chce | Bolesť | Priamy? |
|---|---|---|---|---|
| Pacient (Alena, Novák) | stred celej cesty | rýchlo vedieť, čo je a čo bude; byť ušetrený prepisovania | nevie, kam ísť; je „kuriér“ výsledkov; strach | priamo (cieľ) |
| Rodina / blízki (dcéra) | oporníci, doprava, súhlas | informácie a zapojenie | súhlas rozptýlený v dokumentoch; nikto im nevie povedať | nepriamo (po súhlase priamo) |
| Praktický lekár | odosielateľ | jednoduché odovzdanie a spätná väzba | prepisuje; nevie, či prijali | **áno** |
| Sestra (PL, KOC, denná onkológia) | odbery, podanie liečby, koordinácia MDT | jasné zadania | duplicitné zadávanie | čiastočne |
| Špecialista (gastroenterológ) | prvé podozrenie | rýchly termín CT | čakanie na USG a CT | čiastočne |
| Rádiológ | zobrazenie, revízia CT | všetky snímky a klinická otázka | snímky inde; opakované CT | čiastočne |
| Endoskopista, anestéziológ | EUS-FNB | včasná príprava (apixaban) | rozpory v dátumoch | nepriamo |
| Patológ | histológia | úplná klinická otázka | oneskorenie, rozpor dátumu odberu | čiastočne |
| Laboratórium (LabJih, KOC) | odbery, onkomarkery | správne identifikovať pacienta | výsledky v samostatných PDF | nepriamo |
| Koordinátor KOC | hlavný používateľ | všetko na jednom mieste | dohľadáva údaje; nevidí stav | **áno (hlavný)** |
| Lekári MDT (HPB chirurg, klinický a radiačný onkológ, gastroenterológ, rádiológ, patológ) | rozhodnutie | úplný podklad v 2–4 min | podklad neskoro/neúplný | **áno** |
| Revízny lekár poisťovne | kontrola a schválenie úhrady | štruktúrovaný záver | informácie prichádzajú ručne [odhad] | **áno** (podľa decku) |
| Poisťovňa (VZP 111 alebo iná; Alena 211) | platí | menej zbytočných výkonov, doložiteľný MDT | meškanie, duplikácie | nepriamo |
| Nemocnica / vedenie | prevádzka KOC | kvalita, indikátory, plnenie lehôt | kapacita, nekompatibilné systémy | nepriamo (kupec) |
| Dodávateľ NIS (STAPRO, Asseco, CGM, ICZ) | systémy | napojiteľnosť, FHIR | proprietárne siete | nepriamo |
| MZ ČR | koncepcia, KOC štatút | skrátiť čas do liečby | nevie merať čakacie doby | nepriamo |
| ÚZIS / NOR / NSC | registre a štatistika | úplné a včasné hlásenia | duplicitné hlásenia | nepriamo |
| NCEZ | eŽádanky, sdílený záznam, kapacity | adopcia | nová infraštruktúra, dobrovoľné | nepriamo |
| Lekáreň | výdaj liekov, cytostatiká | platný eRecept | prerušenie, nedostupnosť | nepriamo |
| Zamestnávateľ / ČSSZ | PN, nemocenské | hladká administratíva | pacient vypadne z práce | nepriamo |
| Sociálne služby (Úrad práce, KOC sociálny pracovník) | príspevok na starostlivosť, služby | včasná žiadosť | pacient nevie, na čo má nárok | nepriamo |
| Pacientske organizácie (Hlas onkologických pacientov, Liga proti rakovině) | podpora, advokácia | zrozumiteľná cesta | rozptýlené informácie | nepriamo |
| Doprava (rodina, zdravotnícka doprava) | prevoz | hradená, ak indikovaná | pravidlá hradenia len zo zdravotných dôvodov | nepriamo |
| Psychológ / psychiater, algeziológ, nutričný terapeut | podporná starostlivosť | prístup k plnej anamnéze | informácie medzi pracoviskami | čiastočne |
| Paliatívny tím / hospic | koniec života | skorý kontakt | neskoré zapojenie | nepriamo |
| Asociace koordinátorů, ČVUT FBMI, indiko.cz | výučba, metodika, indikátory | sieťovanie koordinátorov | — | nepriamo |

## 5. Najväčšie straty informácie (poradie podľa dopadu)

1. **Odovzdanie PL → KOC:** epikríza bez výsledkov, len zoznam, kde ich nájsť; bez e-mailu; neurčitá otázka na MDT.
2. **Dohľadávanie 6 správ z 5 pracovísk** v rôznych formách (PDF, fotka, CD, pošta), bez jednotného miesta.
3. **Snímky a obraz:** CT v KOC 1, MDT v KOC 2; opakovanie vyšetrení je 72 % vs 11 % podľa dostupnosti [V: AJR 2012].
4. **Rozpory v dátach:** apixaban (posledná dávka 18. 10. pri výkone 12. 10.), histológia (odber 20. 10., vydaná 19. 10.), nikde ECOG, váha 63 vs 65 kg.
5. **Rozpor v odporúčaniach:** kardiológ vs MDT k apixabanu; tramadol vs antidepresíva medzi KOC 1 a KOC 2.
6. **Nikto nevidí „kto je na ťahu“:** úloha, vlastník, lehota, potvrdenie, eskalácia chýbajú [V: `02` Tichopad].
7. **Spätná väzba k PL bez dôkazu doručenia;** revízny lekár nedostane nič automaticky [V: deck slides 5, 11].
8. **Súhlas a kto smie byť informovaný** je rozptýlený v troch dokumentoch.
9. **Pacient ako kuriér:** sám sa vracia s nálezom; priemerne volá 4 špecialistov [S: Hlas, Novinky].
10. **Kapacity neviditeľné:** nikto nevie, kde je voľné CT [V: MZ 2. 9. 2026: spoločný prehľad len v príprave].
11. **Čas sa nemeria presne:** čakacie doby sa v ČR nesledujú systematicky [V: OECD ČR 2025].
12. **Hlásenia do NOR a indikátory** sa tvoria zo samostatných zdrojov (duplicita) [S].

## 6. Čo som nevedel overiť [?]

- Kanál odoslania PL → KOC v praxi (e-mail/fax/pošta/NIS) a či sú v ČR potvrdenia o prijatí; deck ukazuje len e-mail do schránky koordinácie. V decku je e-mail raz „…@vfn.cz“ v texte, inokedy „…@ftn.cz“ v odkaze (rozpor) [V: deck slide 4].
- Skutočný čas koordinátora na jeden prípad pre MDT a počet prípadov na koordinátora (treba mentorov).
- Presná frekvencia MDT v KOC 2 (guideline hovorí „podľa veľkosti“; jedno centrum 1× týždenne) [V: KDP v3.0].
- Typ nástroja, ktorý dnes KOC používajú (NIS, Excel, e-mail) a pilotné aplikácie.
- Kto presne oznamuje diagnózu a kedy; či pacient chodí na MDT.
- Konkrétny chemoterapeutický režim, trvanie ožarovania, intervaly kontrol po liečbe.
- Aké lieky v pankrease schvaľuje revízny lekár; či je „revízny lekár“ v decku z poisťovne alebo z KOC.
- Podmienky príspevku na starostlivosť a invalidného dôchodku (MPSV/ČSSZ stránky sa nedali prečítať).
- Kto zabezpečí výživu a nutričnú terapiu.
- Vek kolorektálneho skríningu (45 vs 50).

## 7. Zdroje (všetky otvorené v tomto behu, ak nie je [S])

- MZ ČR, koordinátori, 2. 9. 2026: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- MZ ČR, koordinátor, 4. 2. 2026: https://mzd.gov.cz/tiskove-centrum-mz/koordinator-onkologicke-pece-klicova-zmena-ktera-zrychli-lecbu-a-muze-zachranit-stovky-zivotu/
- KDP Organizace a činnost MDT v onkologii v3.0 (13. 12. 2022): https://kdp.uzis.cz/res/guideline/20-organizace-cinnost-multidisciplinarniho-tymu-v-onkologii-final.pdf a súhrn …-souhrn.pdf
- VZP revízní lékaři: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/co-delaji-revizni-lekari-k-cemu-slouzi-revizni-cinnost-vzp
- ČSSZ PN: https://www.cssz.gov.cz/-/nejcastejsi-otazky-k-docasne-pracovni-neschopnosti ; ošetřovné: https://www.cssz.gov.cz/dlouhodobe-osetrovne [S]
- VZP doprava (21. 7. 2023): https://www.vzp.cz/o-nas/aktuality/preprava-pacienta-vozidlem-zdravotnicke-dopravni-sluzby
- VZP prevence: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/jakou-preventivni-peci-mi-v-dospelosti-pokryva-verejne-zdravotni-pojisteni
- NHS príznaky: https://www.nhs.uk/conditions/pancreatic-cancer/symptoms/ ; NCI PDQ: https://www.cancer.gov/types/pancreatic/hp/pancreatic-treatment-pdq ; USPSTF: https://www.aafp.org/afp/2019/1215/od1
- MZ svobodná voľba lekára (24. 10. 2018): https://mzd.gov.cz/tiskove-centrum-mz/lekaru-je-dost-chodime-k-nim-ale-zbytecne-casto-rika-odbornice-z-ministerstva-zdravotnictvi/
- Novinky, Hlas onkologických pacientov (1. 12. 2024): https://www.novinky.cz/clanek/zdravi-cesta-onkologickeho-pacienta-systemem-je-slozita-kazde-zdrzeni-je-riziko-40499342
- Kódy zdravotných poisťovní: https://mzd.gov.cz/wp-content/uploads/2013/07/fondy_zustatky_popis-dat.txt
- Zadanie VZP, deck a 13 správ (fiktívne): Slack https://rakathon2026.slack.com/archives/C0C84GD9JAG/p1792152304485149 ; repo `docs/materials/drive/cesta-pacienta-data/`
- Repo research: `docs/research/vyzvy/vzp-cesta-pacienta.md`, `02-prehack-prednasky.md` (Tichopad, Opatřil), `08-cesky-kontext-a-trh.md`; sesterské podklady `docs/kontext/raw-cz-system.md`, `raw-dataflow.md`
- ÚZIS Novotvary 2019–2021: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf ; ÚZIS NOR metodika: https://www.uzis.cz/res/file/registry/nor/nor-metodika-010-20180817-1.pdf [S]
- OECD ČR 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf ; Hanna BMJ 2020: https://doi.org/10.1136/bmj.m4087 ; AJR 2012: https://doi.org/10.2214/ajr.11.6890
- Cytostatiká: https://www.cls.cz/media/tiskova_zprava_nemocnicni_farmacie.pdf [S] ; eRecept: https://mzd.gov.cz/tiskove-centrum-mz/erecept-se-osvedcil-jeho-oblibenost-roste/ [S]
- § 33 zákona 372/2011 (sprostredkovane): https://www.epravo.cz/top/clanky/pravo-na-informace-o-zdravotnim-stavu-a-nakladani-s-nimi-104523.html [S]
