# Ideálny systém „NIT“: ako splniť všetkých 27 požiadaviek VZP najlepšie na svete

_Matej (Claude), 17. 10. 2026 v noci. Stavia na zadaní VZP (prezentácia, slidy 6–12, a `Zadani_ulohy`), na Brunovom
`docs/IDEALNE-RIESENIE.md` a na výskume krajín v `docs/kontext/raw-krajina-*.md`, `raw-vitaz-proces.md` a
`docs/integracia/g5-svet-appky.md`. Čísla sú z týchto súborov, kde majú zdroje. Ku každej funkcii píšeme, čo je
**DEMO** (postavíme do soboty, simulované) a čo **IDEÁL** (ako by to fungovalo naplno, 2027–2031)._

---

## 0. Hlavná myšlienka v 5 vetách

1. Najlepšie krajiny nemajú lepšiu appku. Majú **hodiny, vlastníka a meranie**:
   - **Dánsko:** každý krok cesty je kód udalosti s lehotou v dňoch. Pankreas: 6 + 27 + 10 dní, plnenie 87 % pri
     operácii.
   - **Anglicko:** mesačne zverejňuje lehoty za každú nemocnicu.
   - **Švédsko:** pri pankrease má viac ako 90 % pacientov menovanú kontaktnú sestru.
   - **Holandsko:** záver konzília musí ísť praktikovi do 2 pracovných dní.
2. **Estónsko ukazuje opak.** Má najlepšie digitálne „koľajnice“ v Európe (TIS, 14 mil. dokumentov ročne), ale cestu
   onkologického pacienta nikto nemeria ani za ňu neručí. Koľajnice nestačia, chýba **vrstva zodpovednosti**.
3. Česko od 1. 1. 2026 má **človeka** (koordinátor v 15 KOC) aj **platbu** (250 Kč, kód 51887). Nemá **hodiny**, **nástroj**
   ani **meranie**.
4. NIT je teda **vrstva zodpovednosti nad tým, čo už existuje**. Neberie lekárom ich systémy. Dá koordinátorovi
   „dánske hodiny“, „anglický tracker“, „holandské pravidlá toku“ a „švédsky plán pre pacienta“. Funguje nad e-mailom,
   PDF a eZprávou, kým nie sú národné rozhrania.
5. Vedľajší produkt pre VZP a ministerstvo: **prvé meranie ciest onkologických pacientov v ČR**, ktoré dnes podľa OECD
   neexistuje. Presne to chce Duškov: „datově řízená instituce“ a „platba za výsledek“.

---

## 1. Štyri vrstvy systému

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. MERANIE (VZP, MZ, KOC)   % ciest v lehote, kde sa čaká, kto mešká       │  ← Dánsko SDS, Anglicko CWT
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. HODINY A VLASTNÍK        každý prípad: deň X z Y, kto je na ťahu, do kedy │  ← Dánsko pakkeforløb, UK PTL
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. PODKLAD S DÔKAZOM        20 polí handoveru, každé s citátom, semafor     │  ← NL SONCOS, UK „deň 38“
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. VSTUP A VÝSTUP           žiadanka s kontrolou úplnosti → … → záver späť  │  ← DK MedCom, UK e-RS
│                             s potvrdením doručenia                          │
└─────────────────────────────────────────────────────────────────────────────┘
   pod tým: dnešné kanály ČR (e-mail na rola-schránku, eZpráva, ePACS, telefón)
            → zajtra eŽádanka K, AAfD, EHDS (2029/2031), všetko vo FHIR
```

---

## 2. Požiadavky 1–27: ako ich splníme

### 01 PREVZIAŤ (slide 7)

| # | Požiadavka | Ako to splníme | Vzor zo sveta |
|---|---|---|---|
| 1 | Vstupná obrazovka na odoslanie do KOC | **„Odoslať do KOC“ jedným krokom**, podobne ako dánska „dynamická žiadanka“ priamo v systéme lekára. **DEMO:** jedna stránka, kam praktik pretiahne súbory, bez registrácie (jednorazový bezpečný odkaz). **IDEÁL:** tlačidlo priamo v ambulantnom softvéri (CGM a MEDaX majú ~70 % trhu), ktoré odošle eŽádanku typu K | DK: REF01 cez národné smerovanie žiadaniek; UK: e-RS, od 2018 nemocnica nedostane zaplatené za odoslanie mimo e-RS |
| 2 | Výber KOC zo zoznamu | Zoznam 15 KOC (+2 detské) z oficiálneho zoznamu MZ (2/2026). Pri každom centre kontakt koordinátora a **spádová oblasť** (HPB pokyn MZ od 9/2026). Aplikácia navrhne spádové centrum | DK: žiadanka podľa regiónu a cesty (B07 → konkrétne oddelenie) |
| 3 | Údaje lekára + nacionále + epikríza + podozrivá diagnóza | **Nič sa neprepisuje.** AI vytiahne nacionále a podozrenie z nahratej epikrízy, lekár len potvrdí. Pole „podozrenie“ ponúkne kódy MKN-10 (napr. C25.0) | DK: povinný obsah žiadanky (dôvod podozrenia, nález, lieky vrátane riedenia krvi, telefón pacienta, „pacient bol informovaný o podozrení“) |
| 4 | Nahrať správy z ambulantného softvéru | Pretiahnutie PDF, DOCX alebo skenu. **IDEÁL:** priamy export z ambulantného systému cez FHIR (DocumentReference) | NO, DK: elektronické žiadanky s prílohami (ale aj Nórsko má problém s prílohami medzi nemocnicami) |
| 5 | **Hotovo:** koordinátor má všetko v jednom kroku | **Kontrola úplnosti už pri odoslaní:** praktik vidí „chýba telefón pacientky, chýba ECOG“ a môže doplniť, kým ešte odosiela. Potom **automatické potvrdenie prijatia** späť praktikovi | DK MedCom: kladné a záporné potvrdenia doručenia; ČR dnes: praktik nevie, či pacienta prijali (slide 5) |

### 02 VYŤAŽIŤ (slide 8)

| # | Požiadavka | Ako to splníme | Vzor |
|---|---|---|---|
| 6 | AI vytiahne údaje do štruktúry | 20 polí z `Handover_obsah`. **Pri každom údaji je doslovný citát a program overí, že citát v dokumente naozaj je.** Ak nie je, údaj zahodí. Laboratórne výsledky v DASTA číta bez AI, podľa kódov NČLP | UK „deň 38“: minimálny dátový set pri odovzdaní; NL: čo musí byť hotové pred konzíliom |
| 7 | Označiť, čo chýba | Semafor polí: 🟢 potvrdené, 🟡 návrh AI, 🔴 chýba, 🟠 rozpor. Hore súhrn „16/20, 2 chýbajú, 2 rozpory, 0 polí bez citátu“. **Pasce z dát Aleny** (13 kusov, napr. chýba ECOG, nemožný dátum apixabanu, histológia z budúcnosti) musia všetky svietiť | UK: 44 % lekárov na konzíliách hlási neúplné žiadanky, 40 % chýbajúcu patológiu (RCR 2025). Problém je všade, nikto ho nerieši automaticky |
| 8 | Výstup v kopírovateľných častiach | Tlačidlo **„Kopírovať“ pri každom bloku** (diagnóza, lieky, vyšetrenia…) v čistom texte pre nemocničný systém. Celý podklad ako PDF a FHIR | ČR: koordinátor musí všetko zapisovať do nemocničného systému (Věstník MZ) |
| 9 | Lekár skontroluje a potvrdí | Postup: AI navrhne, koordinátor skontroluje so zdrojom, **lekár KOC potvrdí**. V auditnom zázname je, kto čo prijal, opravil alebo zamietol | Inovačný portál VZP: ľudský dohľad je podmienka; Duškov: „pacienti nebudou pokusnými králíky“ |
| 10 | Kontaktovať lekára a vyžiadať doplnenie | Pri červenom poli tlačidlo **„Vyžiadať“**. Pripraví žiadosť na **správneho adresáta** (napr. „správa 01 → kardiológia Jesenice“). Odoslaná žiadosť je úloha s termínom. Keď správa príde, pole sa samo doplní | UK: „cancer trackers“ urgujú chýbajúce podklady; SE: koordinátori dnes overujú papierové žiadanky telefonicky (RCC 2026) |
| 11 | **Hotovo:** potvrdený handover a zoznam chýbajúcich údajov | Obrazovka „Podklad MDT“ podľa `MDT_zapis`. **Prepínač „stav k 21. 10.“:** správy po konzíliu (12, 13) sa nezobrazia, váha je 65 kg, nie 63 kg | – |
| + | **Bonus: riadok „Snímky a dávka“ (Maťo)** | Zoznam CT, MR a PET zo správ, kde sú uložené a či ich KOC vidí (stav ePACS). Upozornenie na duplicitné CT a orientačná kumulatívna dávka (označená ako odhad). Opora: Euratom 2013/59, čl. 55 ods. 2 písm. d) | UK „deň 38“ vyžaduje snímky a popisy; NL ešte v 2020 posielalo snímky na DVD; ČR: ePACS mal v 2018 len ~4 % vyšetrení |

### 03 KOORDINOVAŤ: dashboard (slide 9)

| # | Požiadavka | Ako to splníme | Vzor |
|---|---|---|---|
| 12 | Fronta so stavmi nový / aktívny / odložený | Obrazovka „Moje prípady“ so stavmi zo zadania a filtrami **Čaká na mňa · Čaká na iných · Mešká · Konzílium tento týždeň** | UK: PTL (patient tracking list), zoznam všetkých v 62-dňovej ceste |
| 13 | Detail: kontext + úlohy s termínom a prioritou | Detail prípadu (bloky A–H podľa Bruna). **Priorita = termín, nie zdravotný stav.** Zoradenie podľa zdravotných dát by z aplikácie urobilo zdravotnícku pomôcku (MDR) | – |
| 14 | Nový pacient pristane v dashboarde príslušného KOC | Žiadanka z kroku 01 sa sama stane prípadom v stave „nový“ v danom KOC | DK: nemocnica pri prijatí zapíše „žiadanka prijatá“ a **spustia sa hodiny** |
| 15 | Všetci pacienti na jednom mieste, komunikácia s lekárom a pacientom | Jedna fronta pre celé KOC (aj pre viac koordinátorov), pri prípade vlákno správ | – |
| 16 | **Hotovo:** stav, termín, kto je na ťahu | Každý riadok má **„Na ťahu: patológia KOC 2 · do 15. 10. · mešká 4 dni“**. **Navyše: hodiny cesty.** „Deň 12 z cieľových 33 do rozhodnutia“, s farbou podľa termínu | **DK:** cieľ 6 dní do prvej návštevy, 27 dní vyšetrovanie, 10 dní do operácie. **NL:** 1 + 3 + 6 týždňov |

### 03 KOORDINOVAŤ: cesta pacienta (slide 10)

| # | Požiadavka | Ako to splníme | Vzor |
|---|---|---|---|
| 17 | Jednorazová úloha alebo sada krokov pre diagnózu | **Šablóny ciest podľa diagnózy.** „Pankreas“ = CT pankreatickým protokolom → EUS biopsia (vysadiť riedenie krvi 48 h vopred) → odbery a onkomarkery → histológia → konzílium → onkológ. Jedným klikom sa spustí celá sada, každý krok s cieľovou lehotou | **DK:** 26 národných ciest (pankreas B07 s blokmi A/B/C); **NO:** 26 ciest; **SE:** 32 ciest; **UK:** časovaná cesta pre pankreas (deň 5 CT, deň 10 konzílium, deň 21 plán) |
| 18 | Hlídať posloupnost, termíny, stav | Kroky majú **závislosti** (biopsia až po CT, konzílium až po histológii) a **štyri stavy: vyžiadané → objednané → vykonané → výsledok doručený**. „Odoslané“ ešte nie je „objednané“ (Tichopad, prednáška) | UK: pri presune medzi nemocnicami platí „deň 38“, kto mešká, nesie zlyhanie v štatistike |
| 19 | Komunikácia e-mail / SMS / chat | **E-mail** lekárom (rola-schránka), **SMS pacientke** (termín, miesto, čo si priniesť, napr. „vysadiť Eliquis 48 h pred biopsiou podľa pokynu lekára“), **chat** koordinátor ↔ oddelenie pri prípade. **DEMO:** simulované odoslanie, viditeľné v histórii | **SE:** „Min vårdplan“, digitálny plán liečby pre pacienta (vyše 100 000 plánov) a portál 1177 |
| 20 | Notifikácie, hlídání termínů | Upozornenie deň pred termínom a v deň termínu. Po termíne **eskalácia**: najprv koordinátor, potom vedúci lekár. Denný súhrn „dnes mešká 3, dnes treba urgovať 5“ | UK: mesačne verejné lehoty za každú nemocnicu |
| 21 | **Hotovo:** kde prípad je, kto na ťahu, do kedy | Časová os cesty s „teraz“ (Brunova hra Alena) + jeden riadok „Na ťahu“ | – |
| + | **Bonus: stránka „Moja cesta“ pre pacientku** | Jednoduchá stránka cez jednorazový odkaz (bez účtu): ďalší termín, kto je jej koordinátor a telefón. Súhlas so zdieľaním s dcérou je už v správe 07 | **SE:** kontaktná sestra pre 90 % pacientov s pankreasom; **NL:** „vast aanspreekpunt“ (stála kontaktná osoba) pre každého |

### 04 SPÄTNÁ VÄZBA (slide 11)

| # | Požiadavka | Ako to splníme | Vzor |
|---|---|---|---|
| 22 | Koordinátor vyberie prípad a nahrá správu z MDT | Nahrá záver alebo ho vyplní podľa vzoru `MDT zaver`. AI ho rozdelí do polí (diagnóza, TNM, odporúčanie, ďalší krok) | DK: konzílium je kód výkonu; pri národnom konzíliu sa v registri sám vytvorí formulár |
| 23 | Odosielajúci lekár dostane výsledok + pôvodný kontext | Praktik dostane **štruktúrovaný záver + čo sa pýtal + čo sa rozhodlo + čo má sledovať on** (napr. riedenie krvi, bolesť, psychológ). **Lehota 2 pracovné dni**, ktorú hodiny strážia. V ČR musí dokument podpísať alebo zapečatiť **nemocnica** (§55a ods. 4 zákona 372/2011): NIT ho pripraví, nemocničný systém podpíše | **NL:** zápis z konzília praktikovi do 2 pracovných dní; **UK:** prepúšťacia správa do 24 h, ambulantná do 7 dní, štruktúrovane priamo do systému praktika |
| 24 | Revízny lekár dostane informáciu automaticky | Pre poisťovňu pacientky (**pozor: Alena má ZP 211, nie VZP 111**, takže sme otvorení všetkým poisťovniam) vznikne **štruktúrovaný súhrn**: diagnóza, rozhodnutie konzília, plánovaná liečba (dôležité pri centrových liekoch). **DEMO:** simulované odoslanie. **IDEÁL:** cez B2B kanál poisťovne v FHIR | ČR: pri pankrease poisťovňa platí liečbu až po konzíliu (OECD 2025) |
| 25 | Revízny lekár si vyžiada doplnenie | Jeho otázka sa objaví ako úloha „Na ťahu: koordinátor“ s termínom, odpoveď ide späť tým istým vláknom | – |
| 26 | Potvrdiť odovzdanie a uzavrieť prípad | Prípad sa uzavrie **až po potvrdení doručenia** praktikovi aj poisťovni. Potom sa zapíše „záznam o koordinovaní“, ktorý je zároveň podklad pre výkon 51887 | DK MedCom: potvrdenie doručenia je súčasť štandardu |
| 27 | **Hotovo:** výsledok s kontextom, odovzdanie potvrdené | Zelená fajka „Uzavreté 22. 10. · praktik: doručené · ZP 211: doručené“ | – |

---

## 3. „Overkill“: čo nikto iný mať nebude

1. **Hodiny cesty podľa Dánska.** Každý prípad má udalosti:
   - žiadanka prijatá,
   - prvá návšteva,
   - rozhodnutie konzília,
   - začiatok liečby,
   - podozrenie vyvrátené.
   
   Navrhneme **českú obdobu kódov AFB07A/B/C/F**. Z toho sa sama počíta lehota pre každý prípad aj pre celé KOC.
2. **Národný panel pre VZP a ministerstvo.** Len anonymné súhrny, nikdy mená:
   - % ciest v cieľovej lehote podľa KOC,
   - kde sa najviac čaká (CT? histológia?),
   - koľko záverov prišlo praktikovi do 2 dní.
   
   Česko dnes čakanie nesleduje (OECD 2025). Dánsko zverejňuje štvrťročne, Anglicko mesačne. Pre Duškova je to
   „datově řízená“ VZP a podklad pre „platbu za výsledok“.
3. **Kontrola úplnosti už u praktika.** Chýbajúce veci sa ukážu ešte pred odoslaním, nie až u koordinátora o týždeň
   neskôr. To je najlacnejšie miesto, kde sa diera dá zaplátať.
4. **Prepínač „stav k dátumu“.** Podklad obsahuje len to, čo bolo známe v deň konzília. Žiadny iný nástroj to nemá.
5. **Riadok „Snímky a dávka“.** Prepája cestu pacienta s radiačnou ochranou (Euratom). Do budúcna sa dá napojiť na
   DQC monitor a Radiačný preukaz pacienta (SK).
6. **Jedno jadro, viac odborov.** Šablóny ciest sa dajú vymeniť za kardiológiu, diabetes, iktus a duševné zdravie.
   Presne tam chce Duškov rozšíriť koordinátorov.

---

## 4. Ako to funguje v ideálnom svete (Alena, verzia 2029)

| Deň | Čo sa stane | Kto na ťahu |
|---|---|---|
| 0 | Praktik pri nálize ultrazvuku klikne vo svojom systéme „Odoslať do KOC“. NIT hneď ukáže „chýba telefón pacientky a ECOG“, praktik ich doplní | praktik |
| 0 | KOC 2 prijme žiadanku a **spustia sa hodiny**. Praktik dostane potvrdenie prijatia | koordinátor |
| 0–1 | AI vyťaží 13 správ, vyžiada chýbajúce cez eŽádanku a AAfD, snímky z KOC 1 cez ePACS (stav „v PACS KOC 2 ✓“) | koordinátor + pracoviská |
| 1 | Šablóna „Pankreas“ objedná CT, biopsiu a odbery. Alena dostane SMS s termínmi a odkaz „Moja cesta“ | oddelenia |
| 6 | Prvá návšteva (dánsky cieľ: 6 dní) | KOC |
| 12 | Histológia mešká: eskalácia, patológia dostane upozornenie | patológia |
| 19 | Konzílium. Podklad je úplný a potvrdený lekárom, „0 polí bez citátu“ | konzílium |
| 20 | Záver ide praktikovi (podpísaný nemocnicou) aj poisťovni, oba potvrdené. Prípad je uzavretý | – |
| štvrťrok | VZP vidí: „KOC 2 pankreas: 84 % ciest v lehote, najdlhšie sa čaká na histológiu“ | VZP, MZ |

V skutočnosti Alene od odoslania do KOC po konzílium trvalo 19 dní a ďalších 31 dní pred tým (spolu 50 dní od prvej
návštevy u praktika). Koordinátorka z FN Bulovka hovorí: bez koordinátora „minimálne dva mesiace“, s ním „dva, tri
týždne“.

---

## 5. Čo je reálne a kedy (aby sme v pitchi neklamali)

| Vlna | Čo | Kedy |
|---|---|---|
| **A: hackathon** | Všetkých 27 bodov ako **funkčné demo nad dátami Aleny**. Odosielanie (e-mail, SMS, poisťovňa) je **simulované**, a to povieme nahlas. FHIR výstup, prípadne cez InterSystems IRIS | sobota 13:00 |
| **B: pilot v 1 KOC** | „Fáza 0“ bez rozhrania: rola-schránka, PDF do nemocničného systému, meranie 3 mesiace (čas do úplného podkladu, minúty koordinátora, odložené konzíliá). Potom podanie na **onkologickú výzvu inovace.vzp.cz** | 2027 |
| **C: národne** | Napojenie cez certifikát KOC na eŽádanku K, AAfD, register pacientov, EHDS (súhrn pacienta 2029, snímky a správy 2031). Národný panel hodín | 2028–2031 |

**Nehovoriť:** „napojené na NIS“, „AI rozhodne“, „nasadené“, „GDPR compliant“, „VZP uzol“.
**Hovoriť:** „Nič sa nestratí a vždy vieš, kto je na ťahu.“ a „Dánske hodiny pre českých koordinátorov.“

---

## 6. Otvorené otázky na mentorov (zajtra ráno)

1. Môžeme navrhnúť cieľové lehoty (napr. dánske 6/27/10 dní) ako konfigurovateľné, alebo VZP chce iba merať?
2. Akým kanálom dnes reálne ide informácia revíznemu lekárovi (požiadavka 24)?
3. Je SMS pacientovi v poriadku z pohľadu nemocnice (súhlas, GDPR)?
4. Koľko minút trvá koordinátorovi príprava jedného prípadu? (Jedno skutočné číslo do pitchu.)
