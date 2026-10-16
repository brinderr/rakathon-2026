# Praha – PACS Comparator Check (FN Motol a Homolka) – hĺbková analýza

_Stav: piatok 16. 10. 2026 ~16:30. Slack iba čítaný (nič sa neposielalo), nič sa necommitovalo._
_Značky: **[PDF]** zadanie FNMH, **[Slack]** kanál výzvy a ďalšie kanály, **[Drive]** prezentácia organizátorov, **[web]** overené na webe, **[repo]** z našich súborov 02–09, **[znalosť]** z mojich vlastných znalostí a v tejto relácii som to neoveril, **[?]** neisté alebo nezaznelo._
_Poznámka k zdrojom: v tejto relácii sa vyčerpal limit webového vyhľadávania, takže po prvých overeniach som už nemohol dohľadávať ďalšie čísla. Čo je overené a čo nie, je vždy vyznačené._

---

## 0. Verdikt v skratke

- **Čo to je jednoducho:** Keď má pacient dostať CT, MR alebo PET (zobrazovacie vyšetrenie) alebo ísť na onkologické konzílium (MDT), lekár musí vidieť aj **staré snímky na porovnanie**. Tie sú často v inej nemocnici, na CD u pacienta alebo nikto nevie, kde sú. Úloha: AI zo správ zistí, **ktoré staré vyšetrenia sú potrebné**, systém **overí, či sú v archíve snímok (PACS)**, a **včas označí, čo chýba**. Archív snímok **nemáme**, kontrolu treba nasimulovať. [PDF]
- **Silné stránky:** veľmi jednoduchý produkt (jeden zoznam so semaforom), demo za noc je realistické, na výzve je zatiaľ **1 tím z 23**, zadávateľka je onkologička z najväčšej nemocnice v ČR a jej IT riaditeľ je v porote, InterSystems túto výzvu výslovne radí do kategórie „overiť a doplniť (SQL/API)“.
- **Slabé stránky:** nie je tu jasný platiaci kupec, dáta sú len textové (a zatiaľ nie sú ani v Slacku), vizuálne „wow“ je skromné (bez snímok), priamy dôkaz o rozsahu problému v Česku **nemáme**.
- **Vážené skóre (moje, prísne):** cca **6,1 / 10** (detail v §7). Je to „bezpečná“ voľba s dobrou šancou na finále, nie výzva s najväčším príbehom.
- **Najdôležitejšia vec na zistenie ešte pred 19:00:** opýtať sa Aliny Pirshtuk (je v miestnosti pre mentorov, „first come first serve“), kto dnes v praxi snímky obvoláva a kde sa dataset fyzicky berie (§2.5 a §1.7).

---

## 1. Presné zadanie

### 1.1 Odkiaľ to vieme
1. **Prezentácia výziev FNMH** (10 strán, autorka MUDr. Alina Pirshtuk, Onkologická klinika FNMH): `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf`. Prečítané celé. **[PDF]**
2. **Slack kanál `#pacs-comparator-check`**: prečítaný celý (od vzniku 9. 10. po 16. 10. 15:58). Obsahuje len **štyri vecné správy od Aliny** (a zoznam, kto sa pripojil). **Žiadne vlákna (threads), žiadne ďalšie súbory** než ten istý PDF. **[Slack]**
3. **Drive / INTRO Praha:** výzva je na slide „Predstavenie pražských výziev“ (garantka Alina Pirshtuk) a na InterSystems slide, ktorý ju zaraďuje medzi výzvy typu „**overiť a doplniť – SQL / API**“ (spolu so SMART ONCO AA a Cesta pacienta). **[Drive]**
4. Repo: `04-slack-vyzvy-a-pravidla.md` §1.2, `05-slack-refresh.md`, `06-prezentacie-drive.md` §3.1. **[repo]**

### 1.2 Úloha (čo má nástroj urobiť) [PDF]
- Zabezpečiť, aby mal lekár **pred plánovaným CT, MR, PET alebo pred MDT** k dispozícii **všetky dôležité predchádzajúce vyšetrenia**.
- **V PACS automaticky overiť dostupnosť relevantných snímok a obrazových sérií** (séria = jedna dávka rezov, napr. „tenké rezy s kontrastom“).
- **Chýbajúce podklady včas označiť** a pripraviť **prehľad prípadov na dorešenie** (alebo ich rovno dorešiť, v PDF je „dořešit/ zajistit snímky“).

### 1.3 Požadovaný výstup (4 kroky zo slidu „Od plánovaného vyšetrenia k prehľadu na dorešenie“) [PDF]
1. **Vstup:** pacient s plánovaným CT/MR/PET alebo s prerokovaním na MDT.
2. **Čo je relevantné:** zo správ určiť, ktoré zobrazovacie vyšetrenia má lekár mať.
3. **Kontrola v PACS:** overiť dostupnosť snímok a sérií.
4. **Dorešenie:** včas označiť chýbajúce podklady alebo zabezpečiť snímky.

**Čo reálne chcú (veta zadávateľky):** zadať pacienta na MDT a „neobvolávať polovicu republiky“, aby poslali staré snímky. [PDF]

### 1.4 Dáta, ktoré dostaneme [PDF + Slack]
- **Jeden spoločný dataset pre 3 výzvy FNMH:** anonymizované lekárske správy, **textové popisy CT**, laboratórne výsledky, **vykázané výkony a lieky** (výkony = čo nemocnica vykázala poisťovni, napr. „CT hrudníka“), ďalšie dáta z nemocničného systému (NIS) u práve liečených onkologických pacientov.
- **Dataset NEOBSAHUJE:** žiadne snímky, žiadny prístup do ePACS. **Kontrolu dostupnosti treba simulovať.**
- **Kde dataset fyzicky je:** nie je v Slacku. Alina (13:00): „pre získanie datasetu kontaktujte Ondru Hoferka“ (InterSystems mentor, Praha). Podľa InterSystems slidu dáta k FNMH výzvam dáva on alebo Gabriel Ing osobne či cez Slack. Formát, veľkosť a počet pacientov **nie sú známe [?]**. K 16:30 nikto v kanáli nenapísal, že dataset dostal.
- **Dôležitá úvaha (hypotéza [?]):** v „vykázaných výkonoch“ pravdepodobne uvidíme, **ktoré CT/MR/PET boli urobené priamo na FNMH** (a teda sú v ich PACS). Zmienky o vyšetreniach z **iných pracovísk** budú len v texte správ. Z toho sa dá postaviť **simulácia, ktorá nie je vymyslená z vecí**: vyšetrenia z FNMH = dostupné, zmienky o cudzích = treba získať. Treba overiť, keď dataset dostaneme.

### 1.5 Kritériá a kto hodnotí
- **Špecifické kritériá pre túto výzvu nie sú** (ani v PDF, ani v kanáli). Platia všeobecné: **sobota** 1) AI technológia a prevedenie, 2) využiteľnosť v praxi u zadávateľa, 3) inovatívnosť; **nedeľa** pridáva 4) škálovateľnosť a 5) kvalita prezentácie a tímu. Váhy nie sú zverejnené. **[Drive – INTRO, repo 05 §2.3]**
- **Sobotné hodnotenie robí zadávateľ výzvy:** v sobotu 14:00–16:00 obchádza tímy, o 16:00 nahlási víťaza. Tu je to **Alina Pirshtuk** (onkologička), pre kritérium 2 teda **kľúčový človek**. Víťaz výzvy ide do nedeľného finále (14:00, 2. LF UK Motol). **[Drive]**
- **Odovzdanie je v sobotu 17. 10. o 13:00** (tvrdý deadline): názov, popis do 140 znakov, „ako používate AI, aký dopad“, **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub/demo/video. **[Drive]**
- V nedeľnej porote je okrem iných **Miroslav Pavlíček, námestník pre IT FN Motol a Homolka**, a **Martin Zubek (InterSystems)**. To je pre túto výzvu výhodné: porozumejú integrácii do PACS a FHIR. **[repo 09]**

### 1.6 Mentori a kontakty (bez kontaktných údajov)
- **Alina Pirshtuk** – garantka a mentorka (Onkologická klinika FNMH). Dnes v miestnosti pre mentorov, na Slacku do ~19–20 h a v sobotu aj ďalej. **[Slack]**
- **Tomáš Panský** – mentor uvedený pri výzvach FNMH v zozname výziev. **[Slack #02]**
- **Dr. Pavel Škrobánek, Dr. Míša Klimeš Lipánová** – ďalší kontakt z kliniky, ktorých odporučila Alina. **[Slack]**
- **Ondřej Hoferek, Gabriel Ing** – InterSystems (Praha): **dáta a FHIR**. **[Slack]**
- Microsoft (Praha): Michal Marusan (architektúra, prototyp), Olena Vasylenko, Bernardo Sunderhus (frontend, len po anglicky). **[repo 05]**
- **Albert Štěrba** (člen dozornej rady VZP, neurochirurg) ponúka overiť, „či to rieši skutočný problém a čo ho čaká až po úhradu“. Dostupný cez `#07-hledam-mentora`. **[repo 05]**

### 1.7 Čo nie je jasné [?]
1. **Dataset:** kedy a v akom formáte príde (CSV, JSON, FHIR, voľné texty), či sú v ňom dátumy a názvy iných nemocníc.
2. **Naplánované vyšetrenia a MDT:** v datasete asi nebude „kalendár“. Pravdepodobne si musíme **vyrobiť vlastný zoznam plánovaných vyšetrení/MDT** (z poznámok typu „kontrola CT o 3 mesiace“ alebo syntetický rozvrh).
3. **Čo presne znamená „dořešit“:** stačí prehľad, alebo má nástroj aj poslať žiadosť? (V PDF je „označiť/zabezpečiť“.) Odporúčam ukázať aspoň **pripravenú žiadosť** a sledovanie stavu.
4. Či zadávateľ pri jedinom tíme **musí** vyhlásiť víťaza (nikto sa nepýtal). **[repo 05 §3.1]**

---

## 2. Koncový užívateľ

> **Pozor:** nasledujúci „deň v živote“ je **moja rekonštrukcia** z PDF zadania, z predprednášok a z toho, čo vieme o koordinátoroch. **Nie je overená rozhovorom.** V §2.5 je 6 otázok, ktoré treba Aline položiť.

### 2.1 Kto presne
| Rola | Čo robí | Prečo je dôležitá pre nástroj |
|---|---|---|
| **Koordinátor onkologickej starostlivosti / sestra / sekretárka MDT** (hlavný užívateľ) | Pripravuje zoznam pacientov na MDT, dohľadáva podklady, volá a píše do iných nemocníc. Od 1/2026 má každé zo 15 komplexných onkologických centier koordinátora; softvérový nástroj pre nich štandardne neexistuje. **[web: MZ ČR, 2. 9. 2026]** | Vie, čo chýba, ale nemá nástroj, ktorý by to hľadal za neho. |
| **Onkológ (lekár, ktorý zadáva pacienta)** (napr. Alina) | Zadáva pacienta na MDT alebo objednáva CT/MR/PET. | Chce to „zadať a mať pokoj“. |
| **Rádiológ a rádiologický asistent / recepcia CT-MR-PET** | Pred vyšetrením chce mať staré snímky pri ruke, aby mohol porovnávať a merať zmeny nádoru. | Bez starých snímok píše „bez porovnania“ a hodnota správy klesá. |
| **Pacient** | Nosí CD, pamätá si, kde bol vyšetrený. | Dnes je často „poštárom“ medzi nemocnicami. **[repo 07: „stratilo sa preventívne CT na CD“]** |

### 2.2 Deň v živote koordinátora [rekonštrukcia, treba overiť]
- **Utorok 7:30.** Vo štvrtok je MDT, na zozname 18 pacientov. U každého treba mať **posledné CT/MR/PET a základné (východiskové) vyšetrenie** pred liečbou. Zoznam jej dal onkológ, správy leží v NIS, snímky v PACS.
- **8:30.** Pri 12 pacientoch je všetko vo vlastnom PACS. Pri 6 správa píše „CT z regionálnej nemocnice“, „podľa dodaného CD“, „MR v súkromnom centre“. Kde presne je snímka, nikto nevie.
- **9:00–12:00.** Telefonáty: rádiológia v regióne, súkromné centrum, pacient („máte to CD?“). Žiadosť cez ePACS (sieť na posielanie snímok medzi nemocnicami) sa dá poslať **len ak viem, kde snímka je**. **[web: ICZ ePACS]**
- **Streda večer.** Dve snímky ešte nedorazili, jedna prišla neúplná (chýba séria). Rádiológ na MDT nemá s čím porovnávať.
- **Štvrtok MDT.** Prípad sa **odloží o týždeň** alebo sa **objedná opakované CT**. Pacient čaká, dostane ďalšiu dávku žiarenia.

### 2.3 Čo bolí
1. **Nevie sa, že snímka existuje a kde.** Informácia je len v texte správy alebo v pamäti pacienta.
2. **Nevie sa, čo je relevantné.** „Posledné CT brucha“ alebo aj „základné PET“? Pre každé vyšetrenie a diagnózu iné pravidlo.
3. **Zistí sa to neskoro.** Chýbajúca snímka sa objaví až na MDT alebo pri vyšetrení, keď je neskoro (a objednať opakované CT je jednoduchšie ako lovenie).
4. **Nikto za to nenesie zodpovednosť.** Žiadosť „niekomu poslať“ nemá sledovanie stavu (žiadané, dorazilo, kompletné).
5. **Ručná práca a telefóny** namiesto lekárskej práce.

### 2.4 Prečo dnešný stav zlyháva (fakty)
- **Archív v nemocnici dokáže vopred načítať staré snímky len zo **svojho** archívu.** To je štandardná funkcia PACS (predvolené načítanie, „prefetch“). Cez hranicu nemocnice nevidí. **[znalosť]**
- **Existuje sieť ePACS (ICZ), ktorá snímky medzi nemocnicami posiela v štandarde DICOM** (2017: viac ako 300 zariadení, všetky veľké nemocnice). Ale je to **decentralizované: odoslanie a prevzatie je v réžii každého pracoviska** a lekár si staré snímky **musí sám vyžiadať**. Chýba teda vrstva „kde sú snímky pacienta, kto ich má poslať a či prišli“. **[web: ICZ referenčný list 2017]** (Aktuálny počet pripojených zariadení som nenašiel [?].)
- **Systémy spolu nehovoria.** Na pre-hack dni odznelo, že existuje viac nekompatibilných sietí (eZpráva, MEDDOX, ePACS, ClinicBox, STAPRO MISE). **[repo 02]** V ČR navyše nie je centrálne úložisko zdravotných dát, existuje len „Index“ (kde dokument je). **[repo 08]**
- **Zlúčenie Motola a Homolky od 1. 1. 2026** zvyšuje počet prepojení medzi pracoviskami. (Či oba areály dnes používajú jeden PACS, **nevieme [?]**.) **[repo 09]**
- Správa často **neuvádza všetky použité staré vyšetrenia**: pri priamom pozorovaní rádiológov bolo v správe citovaných len **58,6 %** (116 zo 198) starších vyšetrení, ktoré rádiológ naozaj použil. Znamená to, že zoznam „čo treba“ vyčítaný zo správ je **dolný odhad**. **[S – výsledok vyhľadávania, JMI 2018: https://journals.spiedigitallibrary.org/journals/journal-of-medical-imaging/volume-5/issue-03/031409/Consultation-and-citation-rates-for-prior-imaging-studies-and-documents/10.1117/1.JMI.5.3.031409.full]**

### 2.5 Otázky pre Alinu Pirshtuk (5 minút, ešte pred 19:00)
1. **Kto dnes volá a píše** kvôli starým snímkam: koordinátor, sestra, vy, rádiológ? Koľko takých prípadov je týždenne a koľko trvá jeden?
2. **Odkiaľ snímky chodia** (aké nemocnice/centrá)? Chodí to cez ePACS, CD alebo e-mail? Kedy sa dozviete, že snímka chýba?
3. **Čo je pre vás „relevantné“** pred MDT a pred CT/MR/PET? Aké okno (3, 6, 12 mesiacov)? Východiskové vyšetrenie pred liečbou áno/nie?
4. **Čo sa stane, keď snímka chýba:** odloží sa MDT, objedná sa opakované CT, píše sa „bez porovnania“? Ako často?
5. **Bude v datasete** zmienka o vyšetreniach z iných nemocníc a kódy výkonov CT/MR/PET?
6. **Čo by vás presvedčilo**, že by ste to v pondelok reálne použili?

---

## 3. Dôkazy o probléme (čísla a štúdie)

**Poctivé úvodné priznanie:** priamy český údaj „v X % prípadov chýbajú staré snímky“ som **nenašiel [?]**. Najlepší verejný dôkaz je zo zahraničia a je z jednej štúdie. Preto v pitchi odporúčam hovoriť o **princípe a smere**, nie o presnom českom čísle.

| Údaj | Číslo | Zdroj | Kvalita a limit |
|---|---|---|---|
| **Opakované vyšetrenia, keď cudzie snímky chýbajú** (UCSF, 267 pacientov pred chemoembolizáciou pečene, AJR 2012) | Bez dostupných cudzích snímok sa opakovalo **72 %** vyšetrení; keď boli na CD/filme, ale nenahrané, **52 %**; keď sa **nahrali do PACS**, len **11 %** (vlastné snímky: 13 %). | https://doi.org/10.2214/ajr.11.6890 ; potvrdenie: https://www.auntminnie.com/imaging-informatics/enterprise-imaging/pacs-vna/article/15600720/importing-outside-studies-cuts-repeat-imaging-exams a https://radiologybusiness.com/topics/health-it/enterprise-imaging/ajr-no-repeats-importing-outside-exams-pacs-cuts-imaging | **Overené (abstrakt + 2 správy).** Jedna štúdia, jedno pracovisko, USA, špecifická skupina (pred TACE), retrospektívna. Opakovanie z nových akútnych dôvodov sa nepočítalo. Menšie čísla v skoršom abstrakte (75/56/12 %) sú predbežná verzia. |
| **Rádiológ a cudzie snímky** | Prehodnocovanie cudzích snímok zaberá na niektorých terciárnych pracoviskách až **22 % práce rádiológov**; vyšetrenia s formálnym popisom cudzích snímok sa opakovali o **32 % menej**. | https://radiologybusiness.com/topics/medical-imaging/diagnostic-screening/providing-reads-outside-images-slashes-rate-repeat-scans | **[S – iba z výsledku vyhľadávania, stránka sa nedala otvoriť (403).]** Zdroj: UCSF. |
| **Štandard pre MDT** | Britský Royal College of Radiologists má audit „dostupnosť snímok a správ na MDT“ s cieľom **100 %**: snímky a indikácia aj pôvodná správa majú byť k dispozícii **pred** poradou, inak hrozí „oneskorenie liečby a nesprávne závery“. | https://www.rcr.ac.uk/career-development/audit-quality-improvement/auditlive-radiology-templates/availability-of-imaging-material-images-and-reports-at-multi-disciplinary-team-mdt-meetings-qsi-refs-xr-703-xr-704/ | **Overené (stránka prečítaná).** Je to štandard (cieľ), nie nameraná miera chýbania. |
| **Oneskorenie liečby škodí** | Každé 4 týždne meškania: +6–8 % riziko smrti pri operácii, pri liekovej liečbe 1–28 % podľa typu. | repo 07 [Z6], BMJ 2020 (Hanna et al.) | **Overené v repe**, ale **nemáme dôkaz, o koľko týždňov chýbajúce snímky liečbu oddialia** [?]. Pozorovacie štúdie. |
| **Česko: MDT sa používa málo** | MDT sa dostane k ~**60 %** nových pacientov so solídnym nádorom v centre (odporúča sa ~80 %); pri pankrease, prsníku a všetkých inovatívnych liekoch je úhrada **viazaná na MDT**. | repo 07 (OECD/EK 2025, [Z3]) | **Overené v repe.** Plynie z toho: počet MDT porád a príprav bude **rásť**. |
| **Česko: koordinátori** | Od 1/2026 koordinátor v každom z 15 centier, **250 Kč za výkon**, zdieľaný prehľad kapacít zobrazovacích metód sa len pripravuje; viac než **60 %** pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT. | https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ | **Overené v repe 08.** Číslo o pľúcach je o celej ceste, nie len o snímkach. |
| **Sledovanie čakacích dôb** | V ČR sa čakacie doby systematicky nesledujú (OECD). Aj „čas do vyriešenia chýbajúcich snímok“ sa dnes nemeria. | repo 08 (OECD ČR 2025) | Dôvod, prečo je dobrý **KPI pre pilot**. |
| **Radiačná dávka** (téma pre Maťa) | Malá štúdia (54 pacientov s melanómom na imunoterapii): medián 8 CT, **64 %** prekročilo kumulatívnu dávku **100 mSv**. Veľký register (5,6 mil. CT): **opakované zobrazovanie je hlavný dôvod vysokých dávok**. | repo 07 [Z41]: https://doi.org/10.21037/qims-24-2102 ; https://doi.org/10.1093/bjr/tqag115 | **Overené v repe, len abstrakty.** Malá štúdia, jedno pracovisko. |
| **Právny rámec (žiarenie)** | Smernica EÚ 2013/59/Euratom požaduje **odôvodnenie každého lekárskeho ožiarenia** a podľa mojej pamäti aj to, aby sa **pred novým ožiarením zohľadnili už existujúce diagnostické informácie** (čl. 55). | https://eur-lex.europa.eu/eli/dir/2013/59/oj | **[znalosť – NEOVERENÉ, stránku som nevedel načítať; číslo odseku nepoznám.]** Maťo vie overiť za 2 minúty. V českom atómovom zákone (263/2016 Sb., §§ 84–87) som takú povinnosť nenašiel. |
| **EÚ: európsky priestor zdravotných dát (EHDS)** | Obrazové nálezy, labáky a prepúšťacie správy majú byť v EÚ výmenné najneskôr do **2031**. | repo 07 [Z42] | **[S]**, termíny sa líšia podľa právnikov. Smer: výmena obrazových dát bude povinná, nástroje „kde je snímka“ budú potrebné. |

**Čo z toho vyplýva pre pitch:** hlavné číslo je **72 % vs. 11 %** (s priznaním „štúdia z USA, jedna“). Doplniť ho má **vlastné číslo z datasetu**, ak ho dostaneme (napr. „v X z Y správ CT stojí, že porovnanie nebolo možné“). To je najsilnejšia vec, ktorú môžeme získať za noc. **[návrh, vyžaduje dataset]**

**Čo nevieme [?]:** koľko CT/MR/PET sa v ČR robí ročne, koľko stojí jedno opakované CT pre VZP (nenašiel som overený cenník), koľko času týždenne zaberá koordinátorom dohľadávanie snímok. Ilustračný prepočet nemá zmysel bez týchto čísel; na pilot ich treba **zmerať** (§5.7).

---

## 4. Existujúce riešenia na trhu

> Ceny sa takmer nikdy nezverejňujú. Veci označené **[znalosť]** sú z mojich znalostí a v tejto relácii som ich neoveril.

| Typ riešenia | Príklady | Čo robí dobre | Čo nerobí (medzera) |
|---|---|---|---|
| **Predvolené načítanie starých snímok v PACS** (prefetch, „hanging protocols“) | takmer každý nemocničný PACS **[znalosť]** | Keď sú snímky vo vlastnom archíve, pri otvorení vyšetrenia sa predvolia. | **Nevidí cez hranicu nemocnice.** Nevie, že snímka existuje inde. Nečíta voľný text správ. |
| **Sieť na posielanie snímok medzi nemocnicami** | **ICZ ePACS** (ČR, >300 zariadení v 2017, DICOM, decentralizované) **[web]** | Bezpečný prenos, bez CD. | Lekár musí **vedieť, kde snímka je**, a **vyžiadať ju**. Nemá sledovanie stavu ani „dorešenie“. |
| **Portály na zdieľanie obrazových dát** | NHS Image Exchange Portal (Sectra), cloud výmena (Ambra/Intelerad, Nuance PowerShare a podobné), PostDICOM, Medicai **[znalosť]** | Technicky dokážu snímky preniesť. | Sú to **prepravné trasy**, nie asistent, ktorý zo správ zistí, **čo** treba. Cena zväčša nezverejnená [?]. |
| **Nástroje pre onkologické konzíliá** | Roche navify Tumor Board, Microsoft Healthcare Agent Orchestrator (rádiologický agent), Asseco MedWorks, český **MDT Copilot (Asseco, vlastná výzva)** **[repo 07, 08; znalosť]** | Zhromaždia podklady a zobrazia ich pre MDT. | Zameriavajú sa na **zobrazenie a súhrn**, nie na **kontrolu úplnosti a obstaranie chýbajúcich snímok** pred poradou. Cena nezverejnená. |
| **Koordinačné aplikácie v centrách** | pilotné aplikácie v „niektorých KOC“, portál indiko.cz **[repo 08]** | Sledujú termíny a úlohy. | Dodávateľov som nenašiel [?]. Nie je medzi nimi známy nástroj na **snímky a komparátory**. |
| **AI na čítanie snímok** | Carebot (CZ; AI druhé čítanie mamografie a RTG hrudníka), Aidoc, Rad AI a ďalšie **[repo 08; znalosť]** | Pomáhajú pri čítaní obrazu. | **Nerobia logistiku starých snímok.** A **nemajú mechanizmus úhrady** (VZP to priznáva). **[repo 07 §2.3]** |

**Kto za to dnes platí:** nikto výslovne. Dopravu snímok (ePACS) financuje projekt s pověřením MZ a nemocnice; AI v zobrazovaní nemá v ČR úhradu; telemedicína zväčša tiež nie. **[repo 07, 08]** Kupec by bol **nemocnica (klinika + IT)** alebo **dodávateľ PACS/NIS** ako modul. Cesta cez **VZP inovačný portál** (onkologická výzva od 11/2026 alebo až od októbra, a až 300 mil. Kč na 2027 – obe čísla sú v repe označené [?]) vyžaduje **výrobcu s klinickým partnerom, regulačnú spôsobilosť a preukázanú úsporu aspoň 5 %**. Pre čisto organizačný nástroj je to **neisté [?]**.

**Kde je priestor urobiť to lepšie:**
1. **Pred vyšetrením, nie po ňom.** Skontrolovať úplnosť, keď je pacient len naplánovaný (je čas ešte zabezpečiť).
2. **Čítanie voľného textu:** vytiahnuť zo správ „CT v nemocnici X dňa Y“, „podľa CD“, „bez porovnania“.
3. **Zodpovednosť a sledovanie:** stav „vyžiadané / dorazilo / kompletné“ s dátumom a menom, aby nič nezapadlo.
4. **Nepredávame nový archív ani novú sieť.** Vrstva nad existujúcim PACS a ePACS cez štandardy (DICOMweb, FHIR), čo presne radili experti na pre-hack dni („nestavať vlastnú databázu pacientov“). **[repo 02, 09]**
5. **Lacno a jednoducho:** LLM + pravidlá, jedna obrazovka.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Pracovný názov a veta
**„Nikdy bez srovnání“** (pracovný názov). Jednoduchá veta: _Ráno vidíte, kto na zajtrajšie CT alebo konzílium nemá potrebné staré snímky, prečo ich potrebuje, kde sú, a jedným klikom ich vyžiadate._

Návrh popisu do 140 znakov (český, 133 znakov): **„Nikdy bez srovnání: AI ze zpráv pozná, které staré snímky lékař potřebuje, ověří je v PACS a chybějící vyžádá dřív, než se sejde MDT.“**

### 5.2 Čo ukazuje produkt (3 obrazovky, nič iné)
1. **Ranný zoznam (hlavná obrazovka).** Riadok = pacient s naplánovaným CT/MR/PET alebo MDT. Stĺpce: pacient (pseudonym), čo a kedy, **semafor**, „za koľko dní termín“, tlačidlo. Semafor:
   - **Zelená:** všetky potrebné staré snímky sú v PACS, kompletné (séria aj rezy).
   - **Žltá:** snímka je u inej nemocnice alebo na CD, **žiadosť je pripravená** (jedným klikom).
   - **Červená:** snímku sa nepodarilo nájsť alebo je neúplná, treba človeka.
   - **Sivá:** AI si nie je istá, kontrola človekom.
   - **Nikdy zelená bez pozitívneho potvrdenia** (konzervatívne).
2. **Detail prípadu.** Časová os všetkých zobrazovacích vyšetrení (vlastné vs. cudzie). Pri každom „potrebnom“ staršom vyšetrení: **prečo ho potrebujeme** (citát z konkrétnej správy, kliknutie na zdroj), **kde je**, **stav**, tlačidlo „Vyžiadať“ (pripravená žiadosť v češtine, pripravený text pre pacienta „doneste CD“). Lekár môže **nesúhlasiť** (zapíše sa).
3. **Prehľad pre vedenie.** Podiel prípadov s kompletnými snímkami **aspoň 24 h pred termínom**, medián času vyriešenia, **z ktorých nemocníc chýba najviac snímok** (tipy na trvalé napojenie).

### 5.3 Ako to funguje (jednoducho)
1. **Čítanie správ (AI).** LLM z českých správ a popisov CT vytiahne **zoznam zobrazovacích udalostí**: typ (CT/MR/PET), oblasť, dátum, **kde sa urobilo** (FNMH alebo iné), **zdrojová veta**, „porovnanie nebolo možné“, odporúčané kontroly. Výstup je štruktúrovaný (JSON) a uložený ako **FHIR** (ImagingStudy = vyšetrenie, ServiceRequest = plánované vyšetrenie, Task = žiadosť na dorešenie).
2. **Čo je relevantné (pravidlá + AI).** Čitateľné a **upraviteľné pravidlá**, napr.: pre CT hrudníka posledné CT hrudníka + základné vyšetrenie pred liečbou; pre PET posledné diagnostické CT; pre MDT všetko od diagnózy. AI iba navrhne a vysvetlí, **pravidlá definuje rádiológ/onkológ**. (Maťo a Alina vedia odsúhlasiť 5–8 pravidiel.)
3. **Kontrola dostupnosti (simulovaný PACS).** Funkcia „existuje vyšetrenie typu X pre pacienta Y v rozmedzí dátumov?“ s **dvoma zameniteľnými adaptérmi**: (a) FHIR **ImagingStudy** v InterSystems IRIS for Health, (b) malý **DICOMweb QIDO-RS** server (štandardný spôsob, ako sa PACS pýta „aké snímky máš?“). Zmena adresy = skutočný PACS. Stavy: kompletné, **čiastočné (chýba séria)**, len správa bez snímok, **na CD**, **u inej nemocnice (ePACS)**, nenájdené.
4. **Dorešenie.** Pripravená žiadosť + sledovanie stavu (vyžiadané, dorazilo, overené), čo mení farbu v zozname.
5. **Meranie.** Vlastný testovací súbor s **vloženými medzerami** (viď 5.6), presnosť a úplnosť zobrazené v prezentácii.

### 5.4 Ako simulovať PACS, aby to neznelo „vymyslené“
- **Variant A (ak dataset príde):** vyšetrenia, ktoré dataset uvádza ako vykázané na FNMH, **sú v PACS**. Zmienky o cudzích vyšetreniach (iná nemocnica, CD) sú **mimo PACS**. Zvyšok (čiastočné série, „v sieti ePACS“) **zvolíme transparentne ako scenáre** a povieme to nahlas.
- **Variant B (ak dataset nepríde do ~21:00):** Claude vygeneruje **40 syntetických pacientov** s realistickými českými správami a vloženými medzerami (označené ako syntetické). Ground truth (správna odpoveď) je známy, takže vieme merať presnosť.
- **Vždy:** nikde nezverejňovať skutočné údaje pacientov (pravidlá §4), dataset z Motola do verejného GitHubu nedávať.

### 5.5 Čo ukážeme v 3-minútovom pitchi (odhad dĺžky pitchu v nedeľu: 5–6 min [?], zadanie 3 min)
| Čas | Obsah |
|---|---|
| 0:00–0:20 | **Hák:** veta Aliny „neobvolávat půlku republiky“ + číslo **72 % vs. 11 %** opakovaných vyšetrení (s priznaním zdroja a limitu). |
| 0:20–0:45 | **Kto a koľko:** koordinátorka Jana, štvrtkové MDT, 18 pacientov, 6 má snímky inde. Dnes telefón a CD. |
| 0:45–2:00 | **Demo:** ranný zoznam, klik na červenú, citát zo správy, žiadosť jedným klikom, stav sa mení na zelenú; rádiológ vidí kompletné porovnanie. |
| 2:00–2:30 | **Ako to funguje a že to je bezpečné:** AI číta česky, nič nediagnostikuje, človek rozhoduje, nikdy zelená bez potvrdenia, FHIR + DICOMweb, napojiteľné na ePACS, **čísla z testu** (napr. „zachytili sme X z Y vložených medzier“). |
| 2:30–3:00 | **Škálovanie a pilot:** funguje pre každú nemocnicu s PACS; pilot na onkológii FNMH; KPI: podiel prípadov s kompletnými snímkami 24 h vopred, čas vyriešenia, počet telefonátov. |

### 5.6 Video 1–1,5 min (pre Bruna)
- Jeden príbeh: pacientka z regiónu, CD v šuplíku, koordinátorka s telefónom, **počítadlo „telefonát č. 9“**. Strih na ráno s nástrojom: semafor sa prepne, telefón zostane ležať.
- Vizuály: časová os vyšetrení, farby semaforu, citát zo správy podčiarknutý, žiadosť odchádza.
- Záver: veta „Nikdy bez srovnání“ + QR na demo.
- **Titulný obrázok 16:9:** semafor + časová os, názov, jedna veta.

### 5.7 Plán na noc (všetko spraví Claude Code; ľudia robia to, čo Claude nemôže)
**Ľudia (Bruno, Maťo):**
1. **Pred 19:00** vybrať výzvu a opýtať sa Aliny 6 otázok (§2.5). Požiadať Ondřeja Hoferka o dataset (kto, kedy, v akom formáte).
2. **Maťo:** odsúhlasiť 5–8 pravidiel „čo je relevantné“ a overiť poznámky o žiarení (typické dávky, odkaz na smernicu). Nástroj **nikdy neodporúča „nerob vyšetrenie“**, iba upozorní.
3. **Bruno:** storyboard videa, hlas, strih.
4. V sobotu pred 13:00: odovzdať formulár (názov, popis, titulný obrázok, odkazy), pripraviť **zálohu dema** (video/obrazovky) pre prípad výpadku.

**Claude Code (približný postup):**
- Hodina 0–1: nastavenie prostredia (Azure LLM kľúč z portálu, IRIS for Health s FHIR serverom z InterSystems šablóny), načítanie datasetu alebo generovanie syntetického.
- Hodina 1–3: extrakcia zobrazovacích udalostí z textu + testovací súbor + meranie.
- Hodina 3–5: simulovaný PACS (FHIR a QIDO-RS adaptér), pravidlá relevancie, generovanie žiadostí.
- Hodina 5–8: webové rozhranie (3 obrazovky), vysvetlenia a citáty.
- Hodina 8–10: testy, ošetrenie chýb (retry kvôli zdieľaným limitom API), nahratie dema, titulný obrázok.
- Spánok a odovzdanie.

### 5.8 Kombinácia s cenou InterSystems (1 500 EUR)
Výzva je v InterSystems mape výslovne typ „overiť a doplniť – SQL/API“. **FHIR ImagingStudy v IRIS FHIR serveri je zmysluplné použitie technológie**, nie nálepka, a je v súlade s radou expertov (výmena dát cez štandardy, nie vlastná databáza). V poli odovzdania „FHIR od InterSystems?“ odpovedáme **áno**.

### 5.9 Čo robí nástroj správne aj z pohľadu bezpečnosti
- Nediagnostikuje, nemení liečbu, **rieši logistiku a úplnosť podkladov**. Človek potvrdzuje. Pri pochybnosti **eskaluje na človeka**.
- Všetko dohľadateľné: každé tvrdenie má **zdrojovú vetu**.
- **Falošné „zelené“ je najhoršia chyba** (lekár by si myslel, že má všetko). Preto zelená len pri pozitívnom potvrdení. **[návrh]**

### 5.10 „Šialený“ ambiciózny variant: **Prior Radar** (nulový dotyk)
Nástroj sa **spustí sám** v momente, keď sa objaví objednávka CT/MR/PET alebo nominácia na MDT (v praxi z eŽádanky alebo HL7/FHIR ServiceRequest):
1. **Sám nájde** všetky zmienky o starších vyšetreniach a opýta sa vlastného PACS aj ostatných (cez DICOMweb/ePACS).
2. **Sám pošle žiadosť** do iných nemocníc a sleduje stav, pacientovi pošle SMS „doneste CD“ len ak ostatné zlyhá.
3. **Na deň vyšetrenia** pripraví rádiológovi **dvojicu „teraz vs. predtým“ vedľa seba** a predvypočíta zmenu (kroky: zarovnanie objemov podobne ako víťazný RadioProtect z minulého roka, meranie lézií pre RECIST). Na demo by išli **syntetické DICOM súbory** (bez skutočných pacientov) alebo verejné vzorové dáta (licenciu treba overiť).
4. **Kontrolný zoznam kumulatívnej dávky** (Maťo): počet predchádzajúcich CT a typické efektívne dávky ako informácia pre lekára.
5. **Federovaný „Index snímok“:** nehromadí snímky, iba **zoznam, kde ktoré sú** (rovnaký princíp ako „Index“ v českom Sdílenom zdravotním záznamu).
**Realita:** na 1 noc stíhateľné sú body 1–2 a časť 5; body 3–4 sú „wow nadstavba“ s rizikom. Odporúčam **základný produkt (5.1–5.5) ako istotu** a Prior Radar iba ako sľub „ďalší krok“ v pitchi, ak zostane čas na krátku ukážku.

---

## 6. Konkurencia na hackathone

### 6.1 Stav na tabuli (~16:00, `submit.rakathon.cz/vyzvy`, opätovne načítané ~16:20, bez zmeny) [web + Slack]
- **PACS Comparator Check: 1 tím zo 23 v Prahe, „404: tumor not found“** (v kanáli traja členovia; ich schopnosti **nepoznáme [?]**). Tím tiež v 15:01 písal, že ešte nedostal prístup do Azure.
- Pražské výzvy podľa počtu tímov: 0 tímov: Kvalita péče, Twincer; **1 tím: PACS, MEDDI, Plíce včas, SMART ONCO AA, MDT Copilot**; 2: Cesta pacienta, Hlídač NÚ, NÚVR; 3: mamograf; 4: AI Trial Matching. (Pozri repo 05 §3.1.)

### 6.2 Kto môže prísť do 19:00 [?]
- **Nezaregistrovaných pražských tímov je 5:** Ctrl+Alt+CURE, FIT/S, FSMZ (pravdepodobne duplicita MSFZ), Pražský Meridian, **walking legs**. Navyše **7 tímov z organizátorskej listiny ešte nie je na tabuli** (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, **radiQA**, Risk off). Čísla sa budú meniť a skôr smerom hore.
- **Pixel Predators (víťazi 2025 s RadioProtect, DICOM a 3D registrácia CT)** majú zvolený **AI Trial Matching**, ale ich členovia sú aj v kanáli `#pacs-comparator-check`. Ide o **najsilnejší imagingový tím** v Prahe. Ak by prešli na PACS, bude to najťažší súper. **Slabý signál**: v Slacku je každý kanál verejný a mnohí sa pripojili do viacerých.
- **radiQA** (názov naznačuje rádiológiu, **žiadny signál zo Slacku**), **walking legs** a **FIT/S** sú v kanáli `#pacs-comparator-check`. Zatiaľ nevybrali. FIT/S sa podľa repa zaujíma aj o SMART ONCO AA a Cesta pacienta.
- **Odhad pred 19:00:** **1–3 tímy** na tejto výzve (najpravdepodobnejšie 2). Ešte stále medzi najmenej obsadenými výzvami v Prahe.

### 6.2b Rozdiel v prístupe
Súper s DICOM zázemím bude pravdepodobne tlačiť **technický obraz** (spracovanie DICOM, zarovnanie). My ponúkame **prácu so správami, logistiku, sledovanie a FHIR**, čo zadávateľka výslovne popísala („z textu zistiť, čo treba“, „označiť“, „prehľad na dorešenie“). Ak by prišiel taký súper, je k dispozícii nadstavba „Prior Radar“ (5.10).

### 6.3 Môže pražský tím túto výzvu zvoliť?
**Áno, je to pražská výzva (nie brnianska/ostravská).** Formulár výberu ponúka pražským tímom 12 výziev vrátane PACS Comparator Check. Výber a zmenu možno robiť do **dnes 19:00**. Obaja členovia musia byť fyzicky na mieste v Prahe. **[repo 05 §2.6]**

---

## 7. Skórovanie (1–10, prísne, 5 = priemer medzi výzvami)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| **velkost** – veľkosť problému | 1 | **6** | Zobrazovanie sa týka takmer každého onkologického pacienta (viac ako 61 000 nových prípadov ročne podľa OECD, MZ hovorí o viac než 90 000), MDT sa má rozšíriť z ~60 % na ~80 %. Ale podiel prípadov, kde snímky naozaj chýbajú, v ČR **nepoznáme [?]**. |
| **zdravie** – dopad na zdravie | 1,5 | **5** | Nepriamy: menej odložených porád a opakovaných CT (menej žiarenia, UCSF 72 % vs. 11 %), lepšie porovnanie. Priamy dôkaz o prežití **chýba**; link „chýbajúca snímka → oneskorená liečba“ nie je v číslach. |
| **cas** – úspora času | 1 | **7** | Priamo ruší telefonáty a ručné dohľadávanie; rádiológ strávi s cudzími snímkami až 22 % práce (UCSF, [S]); jasne merateľné (čas vyriešenia). |
| **peniaze** – úspora/zisk | 1,2 | **5** | Evitované opakované CT a odložené MDT, voľná kapacita CT. Ale v systéme platenom za výkon nemocnica z opakovaného CT aj zarába, poisťovňa šetrí. Číslo na jedno CT som neoveril. |
| **bottleneck** – akútnosť dopytu | 1,5 | **6** | Zadávateľka to sama pomenovala, v ČR sa MDT rozširuje a vznikajú koordinátori, FNMH sa zlúčilo. Ale prenos snímok (ePACS) existuje; problém je „posledná míľa“, nie nedostatok infraštruktúry. Nie je to bolesť číslo 1 onkológie. |
| **platba** – ochota platiť | 1,2 | **4** | Kupec nejasný (klinika/IT nemocnice alebo dodávateľ PACS), žiadna úhrada, VZP inovačný portál nepasuje na organizačný nástroj [?]; trh s výmenou snímok v zahraničí existuje, ceny nepoznáme. |
| **jednoduchost** – jednoduchosť pre užívateľa | 1 | **8** | Jeden zoznam, semafor, jedno tlačidlo; žiadne nové zadávanie údajov ani nový archív. |
| **data** – dostupnosť a kvalita dát | 1 | **4** | Len text, **dataset zatiaľ nie je v Slacku** (cez Hoferka), snímky nie, **overenie dostupnosti nemá ground truth**, treba ho vyrobiť. Text správ na podstatnú časť úlohy stačí. |
| **realizovatelnost** – demo za noc | 1 | **8** | LLM extrakcia + pravidlá + simulovaný DICOMweb/FHIR + jednoduché UI sú štandardná práca. Záloha: syntetický dataset s vloženými medzerami a meraním. Riziko je dataset, nie technika. |
| **wow** – wow a príbeh | 1,2 | **5** | Príbeh „neobvolávať polovicu republiky“ je ľudský a Bruno ho dá dobre rozprávať, ale bez snímok je vizuál suchý (semafor a zoznam). Prior Radar by to zdvihol, ale je riskantný. |
| **partner** – hodnota partnera a networku | 1,2 | **8** | FNMH je najväčší klinický partner v ČR (repo 09: 9/10), IT riaditeľ v porote, precedens z 2025 (RadioProtect → spolupráca s Motolom), zadávateľka hodnotí osobne; InterSystems radí výzvu do „overiť a doplniť“ a cena sa dá kombinovať. |
| **konkurencia** – šanca vyhrať výzvu | 1 | **7** | 1 registrovaný tím z 23; riziko neskoršieho príchodu Pixel Predators (DICOM) alebo radiQA; schopnosti tímu „404“ neznáme. |
| **pokracovanie** – pilot po hackathone | 0,8 | **5** | Pilot na onkológii FNMH je reálny, ale produkčné napojenie na PACS/NIS rieši nemocničné IT a dodávateľ; nemocnica je podľa repa finančne napätá. |
| **fit** – fit s tímom | 0,8 | **8** | Maťo: zobrazovanie a radiačná ochrana (relevancia, dávky, opakované vyšetrenia); Bruno: príbeh a video. Technické veci spraví Claude. (Maťo nevystupuje v mene ÚRO.) |
| **riziko** – nízke regulačné/klinické riziko | 0,6 | **8** | Administratívny/logistický nástroj bez diagnostiky, človek rozhoduje, dáta anonymizované. Hranica k zdravotníckej pomôcke (MDR) je pravdepodobne nepresiahnutá, ale **toto je moje posúdenie [znalosť], neoverené**. |

**Vážený súčet:** 98,1 / 16,0 = **cca 6,1 / 10.**
Výpočet: 6·1 + 5·1,5 + 7·1 + 5·1,2 + 6·1,5 + 4·1,2 + 8·1 + 4·1 + 8·1 + 5·1,2 + 8·1,2 + 7·1 + 5·0,8 + 8·0,8 + 8·0,6 = 98,1; súčet váh = 16,0.

---

## 8. Hlavné riziká a ako ich zmierniť
1. **Dataset nepríde včas alebo nebude použiteľný** → plán B so syntetickými pacientmi a známou správnou odpoveďou (5.4). Kontaktovať Hoferka hneď.
2. **„Simulovaný PACS je vymyslený“** → ukotviť simuláciu v datasete (vykázané výkony = vlastný PACS), transparentne povedať, čo je scenár, a použiť skutočný protokol (DICOMweb/FHIR), aby stačilo prepísať adresu.
3. **„Je to len zoznam úloh“** → ukázať, že AI číta voľný český text, má zdroj pri každom tvrdení a **meraná presnosť**.
4. **Falošne zelená (najhoršia chyba)** → zelená len pri pozitívnom potvrdení, sivá pri neistote.
5. **Silnejší imagingový súper (Pixel Predators)** → odlišný prístup (logistika, text, FHIR), a ak treba, Prior Radar.
6. **Slabé wow** → silný príbeh, číslo z datasetu, krátke video.
7. **Regulácia a ochrana údajov** → nič nediagnostikuje; anonymizované dáta; v ostrej prevádzke spracovanie v EÚ s dohodou o spracúvaní údajov.
8. **Neoverené tvrdenia v tejto analýze** → označené [?], [S], [znalosť]; hlavne **smernica 2013/59/Euratom** (odsek neznámy) a **vendori/ceny** (bez webu).

## 9. Zdroje (URL)
- Zadanie FNMH: `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf` (Drive kópia: https://drive.google.com/file/d/1VKP3UXN5p_YmiqrtI4gq-RnRUF5xZQ1O/view)
- Slack kanál `#pacs-comparator-check` (rakathon2026), tabuľa výziev https://submit.rakathon.cz/vyzvy
- UCSF/AJR 2012: https://doi.org/10.2214/ajr.11.6890 ; https://www.auntminnie.com/imaging-informatics/enterprise-imaging/pacs-vna/article/15600720/importing-outside-studies-cuts-repeat-imaging-exams ; https://radiologybusiness.com/topics/health-it/enterprise-imaging/ajr-no-repeats-importing-outside-exams-pacs-cuts-imaging
- UCSF – popisy cudzích snímok [S]: https://radiologybusiness.com/topics/medical-imaging/diagnostic-screening/providing-reads-outside-images-slashes-rate-repeat-scans
- RCR audit MDT: https://www.rcr.ac.uk/career-development/audit-quality-improvement/auditlive-radiology-templates/availability-of-imaging-material-images-and-reports-at-multi-disciplinary-team-mdt-meetings-qsi-refs-xr-703-xr-704/
- JMI 2018 (citácie starších snímok) [S]: https://journals.spiedigitallibrary.org/journals/journal-of-medical-imaging/volume-5/issue-03/031409/Consultation-and-citation-rates-for-prior-imaging-studies-and-documents/10.1117/1.JMI.5.3.031409.full
- ICZ ePACS referenčný list (2017): https://www.iczgroup.com/wp-content/uploads/2017/08/ICZ_RL_HEA_ICZ-ePACS_CZ_1707_TISK_02.pdf
- MZ ČR (koordinátori, 2. 9. 2026): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- Dávka: https://doi.org/10.21037/qims-24-2102 ; https://doi.org/10.1093/bjr/tqag115 (cez repo 07)
- Smernica 2013/59/Euratom [neoverené]: https://eur-lex.europa.eu/eli/dir/2013/59/oj
- Repo: `docs/research/04`, `05`, `06`, `07` (B9, B5), `08` (§4, §5, §8), `09` (§3.2, §4.3)
