# Ako sa dnes v ČR presúvajú informácie o pacientovi (kanály a nástroje)

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici). Pojmy sú vysvetlené jednoducho. Nič sa necommitovalo, žiadne reálne dáta pacientov._

**Značky:** **[V]** = overené mnou priamo v primárnom zdroji (text zákona, PDF) · **[S]** = sprostredkované (zhrnutie webstránky, výsledok vyhľadávania, firemná prezentácia) · **[?]** = nevedel som overiť, ber ako otvorenú otázku · **[odhad]** = môj úsudok, nie fakt.
Pozn.: súťaž je česká (VZP, Rakathon), preto ČR. Slovensko sa objaví len ako paralela (OnkoAsist) a v bode 3.

---

## 0. Odpoveď v 10 vetách (ak si prečítaš len toto)

1. **Neexistuje jedna „diaľnica“ pre dáta pacienta.** Dáta sú rozptýlené v desiatkach nemocničných a ordinačných systémov a presúvajú sa po mnohých kanáloch naraz: papier, PDF/e-mail, telefón, súkromné „siete“ jednotlivých firiem a len pomaly sa rozbiehajúce štátne služby.
2. **Nemocnice** používajú **nemocničný informačný systém (NIS)** od niekoľkých firiem (STAPRO, Asseco, Medicalc, ICZ, CGM a ďalšie); trh je rozdrobený a **každá nemocnica nemusí mať ten istý** [S, §1].
3. **Praktici** používajú **ambulantný systém (AIS)**; podľa prednášky z pre-hack dňa dominujú **CGM a MEDaX (spolu cca 70 %)** [S, §1]. Presný počet rôznych systémov som nenašiel [?].
4. **Odoslanie do KOC (komplexné onkologické centrum):** zákon definuje, čo má **žiadanka** obsahovať, ale **neurčuje jeden povinný kanál** [V, §2]. MZ opisuje koordinátora ako „červené tlačidlo“ pre lekárov v regióne, no **nezverejnilo žiadny formulár ani e-mail** [S, §2]. Skutočný kanál (e-mail/telefón/papier) teda závisí od konkrétneho KOC [?].
5. **Štátne elektronické služby** (eRecept, **eŽádanka**, dočasné úložisko, Sdílený zdravotní záznam, EZKarta) **existujú**, ale **eŽádanka je zatiaľ dobrovoľná na vystavenie** (prijať ju musia) a **bez centrálneho úložiska dokumentov** [V/S, §3].
6. **Snímky (CT/MR)** idú po **ePACS** (ICZ): pripojených je všetkých ~140 akútnych nemocníc a ~105 ambulantných zariadení (štúdia 2020), no je to len ~4 % všetkých vyšetrení [S, §3].
7. **Čo nefunguje:** súkromné siete spolu nekomunikujú, PDF/sken nie je strojovo čitateľný, údaje sa prepisujú a pacient často nosí papiere a CD sám [S, §4].
8. **GDPR/súhlas:** pre **liečbu a nadväznú starostlivosť súhlas pacienta na zdieľanie medzi lekármi nie je potrebný** (zákon 372/2011 §51, §65) [V, §5]; súhlas treba pre tretie osoby (napr. rodina) a pri Sdíleném záznamu platí **opt-out** (pacient môže namietať) [V, §5].
9. **MDT (tumor board):** zvoláva a eviduje ho **koordinátor/administrátor MDT**, rozhodovať sa má **až keď je kompletná dokumentácia**; výsledok sa má poslať ošetrujúcemu aj praktikovi, ale **kanál ani dôkaz doručenia zákon nepredpisuje** [V, §6].
10. **Medzera pre nás:** nikde sa nepísalo o jednotnom nástroji, ktorý by zbieral dokumenty z rôznych zdrojov, strážil úplnosť, a **uzavrel slučku s dôkazom doručenia** [odhad, §7].

---

## 1. Kto robí systémy a koľko ich je

### 1.1 Nemocničné systémy (NIS) – v nemocnici a v KOC
- **Počet nemocníc:** v roku 2024 bolo v ČR **160 nemocníc s akútnou lôžkovou starostlivosťou** (49 199 lôžok) a **21 050 samostatných ordinácií** lekárov (bez detašovaných pracovísk); spolu **52 749 lekárov** [S: ÚZIS cez ČSÚ, 19. 3. 2026, https://zpravy.kurzy.cz/853952-vybrana-data-o-zdravotni-peci-akutni-luzkovou-peci-zajistovalo-v-roce-2024-na-uzemi-ceska-160/].
- **Dodávatelia NIS (čo som našiel):**
  - **STAPRO** – podľa pre-hack prednášky najväčší dodávateľ, „viac generácií NIS“ [S: `docs/research/02-prehack-prednasky.md`, Opatřil]; tradičný dodávateľ NIS VFN Praha [S: https://ekonomickydenik.cz/stapro-napada-modernizaci-informacniho-systemu-vfn-na-prutazich-ci-krachu-projektu-vydela/]; produkty FONS Enterprise a FONS Akord (z propagačného príspevku na LinkedIn; ide o testovanie, nie potvrdené nasadenie) [S, slabý zdroj].
  - **Asseco** – NIS **MedWorks**, ponúkaný v ČR, SR a Maďarsku [S: https://ce.asseco.com/cz/reseni/poskytovatele-zdravotni-pece/nemocnicni-informacni-system/medworks-445/].
  - **Medicalc** – NIS **Medicalc4** (databáza Oracle) a výmenná platforma **mex2** na prepájanie zariadení a súkromných lekárov [S: výsledok vyhľadávania z technickej špecifikácie na lawinsider.com/cs/contracts/jAwAV32LlXy].
  - **ICZ** – významný hráč vedľa STAPRO [S: Ekonomický deník]; produkty **ISAC/eMeDOcS** (výmena dokumentov), **ePACS** (snímky), **MEDDOX** (podľa pre-hack prednášky) [S].
  - **CGM (CompuGroup Medical ČR)** – ambulantný softvér, v nemocniciach **ClinicBox/„CLICKBOX“ sieť** (pozri §3) [V: prezentácia CGM 4. 12. 2024, https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf].
  - **Zlatokop (IKEM)** – NIS, ktorý IKEM ponúka bezplatne iným nemocniciam; využila ho Nemocnica Na Homolce [S: Ekonomický deník, odkaz vyššie].
- **Tržné podiely a „ktorý KOC používa ktorý NIS“: nenašiel som** [?]. Odpoveď typu „má každá nemocnica iný?“ je preto: **nie každá, ale nie je jeden štandard a systémov je viac generácií** [S + odhad].

### 1.2 Systémy praktikov a ambulancií (AIS)
- **CGM + MEDaX ≈ 70 % ambulancií** [S: Opatřil, pre-hack, `02-prehack-prednasky.md`]. CGM samo tvrdí, že jeho softvér používa takmer 70 % lekárov v ambulantnom sektore [S, slabý zdroj – firemný text bez dátumu: https://www.technickytydenik.cz/rubriky/archiv-technik/elektronizace-zdravotnictvi-se-prosazuje-ve-stale-vice-ordinacich_32505.html]. Obe čísla sa **nesedia presne** (CGM+MEDaX vs. len CGM) – ber ako „dominuje 1–2 firmy“ [?].
- **Počet rôznych AIS v ČR: nenašiel som** [?].
- Praktici sú tisíce malých ordinácií, každá si vyberá softvér sama. Neoficiálny odhad: ~5 000 praktikov pre dospelých [S, odhad združenia praktikov, https://www.seznamzpravy.cz/clanek/domaci-pocet-pediatru-klesa-pulka-z-nich-je-v-duchodovem-veku-252324; neoficiálne].

### 1.3 Kontext KOC (stručne, aby bolo jasné, „kam“ sa posiela)
- **15 komplexných onkologických centier (KOC)** v ČR; niektoré sú **zložené z viacerých nemocníc** (napr. FN Motol + ÚVN + Nem. Na Homolce; Nem. Na Bulovce + VFN + FTN). Zoznam: FN Královské Vinohrady, FN Hradec Králové, FN Olomouc, FN Plzeň, FNsP Ostrava, Motol/ÚVN/Homolka, KN Liberec, KN Zlín, MOÚ Brno, MN Ústí n. L., Nem. České Budějovice, Nem. Jihlava, Bulovka/VFN/FTN, Nový Jičín, Pardubický kraj. Karlovarský kraj nemá centrum [V: NOP ČR 2030, Kiss, https://www.linkos.cz/files/pro_odborniky/napl_onko_prog/sled_predikce_onko/Forum/2024-09/1-Doc-Kiss-Organizace-pece-dostupnost_solidni-tumory.pdf].
- **Vedúci KOC** je lekár (klinická alebo radiačná onkológia), KOC riadi **Radu KOC a ROS** a pripravuje **„Cesty pacienta“** pre diagnózy; dohliada na **multioborové (indikačné) komisie** [V: tá istá prezentácia].
- **KOC je označenie pre nemocnicu (alebo skupinu nemocníc), nie samostatná firma** [V: „nositeľ statútu KOC“ je nemocnica]. Vlastníctvo/financovanie jednotlivých KOC (štát/kraj/mesto) som nerozlišoval [?].
- **Koordinátor:** od 2026 musí mať každé KOC **minimálne jedného koordinátora** [S: MZ ČR 2. 9. 2026, https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/]; nemusí byť zdravotník („nie je podmienkou zdravotnícke vzdelanie“) [S: https://mzd.gov.cz/tiskove-centrum-mz/koordinovat-je-slusnost/]; platí sa **250 Kč za výkon**, celkovo „nižšie desiatky miliónov Kč ročne“ [S, MZ 2. 9. 2026]. **Koľko koordinátorov je v jednom KOC a koľko pacientov na jedného: nenašiel som** [?]. Na školeniach ČVUT bolo ~140 záujemcov [S, MZ].

---

## 2. Ako praktik pošle pacienta do KOC (od podozrenia po prvý kontakt)

### 2.1 Čo hovorí zákon a MZ
- **Žiadanka (vyžiadanie ďalších zdravotných služieb)** musí obsahovať: požadované služby, zdôvodnenie, naliehavosť, posledný zdravotný stav vrátane podstatných výsledkov, doterajšiu liečbu, pracovnú diagnózu, zásadné anamnestické údaje [V: vyhláška 444/2024 Sb. o zdravotnickej dokumentácii, účinná od 1. 1. 2025, https://www.zakonyprolidi.cz/cs/2024-444]. Predošlá vyhláška 98/2012 je zrušená k 1. 1. 2025 [V: https://www.zakonyprolidi.cz/cs/2012-98].
- **Forma dokumentácie je zákonom otvorená:** môže byť „listinná, elektronická alebo kombinácia“ [V: zákon 372/2011 §53, https://www.zakonyprolidi.cz/cs/2011-372]. Teda **papier je legálny a bežný**.
- **Nadväzná starostlivosť je povinnosť:** poskytovateľ musí „bez zbytočného odkladu“ odovzdať správu praktikovi a ďalším poskytovateľom informácie potrebné na nadväznosť (§45 odst. 2 písm. f, g) [V: 372/2011].
- **MZ: koordinátor 1** vstupuje, keď je „vysoké podozrenie“ na rakovinu, najčastejšie cez **praktika alebo ambulantného špecialistu**; pre lekárov v regióne má byť „červené tlačidlo“ (kontaktný bod); najprv sa zameriava na **fast-track diagnózy** (pľúca, pankreas); pôsobí hlavne na „predsunutých“ pracoviskách (pneumológia, gastroenterológia) [S: MZ 2. 9. 2026, odkaz vyššie]. **Článok MZ nespomína e-mail, telefón, formulár ani písomnú žiadosť** [S] – a zadanie VZP hovorí o „písomnej žiadosti“ lekára [zadanie v repo, `vzp-cesta-pacienta.md` §2.1; z MZ 26. 9. 2025].
- **Ako reálne vyzerá odoslanie, nie je nikde štandardizované [?].** Zadanie VZP samo (slide 5) hovorí: „dokumentácia prichádza roztrieštene a často neúplne, lekári opakovane prepisujú údaje“ [V: `docs/materials/drive/cesta-pacienta-data/`, zhrnuté v `vzp-cesta-pacienta.md` §1.2]. Fiktívny prípad: epikríza praktika „bez výsledkov vyšetrení“, výsledky „sú na jednotlivých pracoviskách“ [V: správa 07].

### 2.2 Kanály – čo som overil a čo nie
| Kanál | Stav | Zdroj |
|---|---|---|
| **Papierová žiadanka / správa** (pacient ju nosí) | legálny, bežný; eŽádanku treba na požiadanie vedieť **vytlačiť** | [V] 325/2021 §31a odst. 3 písm. d; 372/2011 §53 |
| **eŽádanka** (elektronická žiadanka) | existuje v zákone; **pilot od 2. 1. 2026, vystavovať je dobrovoľné, prijať ju musí každé zariadenie**, ak ju pacient prinesie (okrem technických prekážok) | [V] zákon; [S] Naše zdravotnictví, Zdravé zprávy (viď §3) |
| **Telefón** | MZ opisuje koordinátora ako „kontaktný bod“; konkrétny telefón/linka nie je verejne zjednotená | [S] MZ; skutočná prax [?] |
| **E-mail** | právne pole zložité: zdravotné údaje sa majú posielať šifrovane; v reportáži z 2018 nemocnica uviedla, že e-mail nemôže používať (bez šifrovania) a posiela **doporučenou poštou** | [S: Právo/Novinky 23. 5. 2018 – staré, https://www.novinky.cz/domaci/clanek/spitaly-pouzivaji-predpotopni-metody-komunikace-boji-se-o-data-15010]. Dnešná prax [?] |
| **Fax** | **nenašiel som žiaden zdroj** o dnešnom používaní v ČR [?] | – |
| **Dátová schránka** | v zákonoch sa objavuje len pri **registrácii poskytovateľa do Národného kontaktného miesta** (dátová správa do schránky správcu); ako bežný kanál medzi lekármi **nepotvrdené** [?] | [V] vyhláška 444/2024 (pacientský súhrn) |
| **Proprietárne siete firiem** (CGM ClinicBox, eZpráva, ICZ MEDDOX/ISAC, STAPRO MISE, Medicalc mex2) | fungujú **vnútri jednej siete**; medzi sieťami nie | [S, §3] |

---

## 3. Elektronická výmena: čo je v ČR k dispozícii

### 3.1 Štátna vrstva (zákon 325/2021 Sb. o elektronizácii zdravotníctva)
**Overené v texte zákona (znenie k 1. 4. 2026, https://www.zakonyprolidi.cz/cs/2021-325) [V]:**
- **Dočasné úložisko** (časť „výmennej siete“): na dočasné uloženie a zdieľanie zdravotnej dokumentácie; zásielka tam zostane **najviac 30 dní** alebo do vyzdvihnutia; **prístup má len odosielateľ a adresát** (§31).
- **eŽádanka** (§31a): elektronický požiadavok poskytovateľa na zdravotné služby, odovzdaný cez dočasné úložisko. Poskytovateľ, ktorý ju vystavil, ju musí **bezodkladne uložiť do úložiska**, **písomne oznámiť pacientovi identifikátor** a na požiadanie ju **vytlačiť**. Poskytovateľ, ktorý službu robí, ju **musí prijať** (ak tomu nebráni technické vybavenie alebo právo odmietnuť), a **bezodkladne zapísať, že službu poskytol**. Mazanie po **3 rokoch**. Prístup má aj pacient, poisťovňa (kontrola) a ÚZIS.
- **Sdílený zdravotní záznam – SZZ** (§34a): **emergentný záznam** (krvná skupina, alergie, nežiaduce účinky liekov, lieky za 12 mesiacov…) a **výsledky preventívnych a skríningových vyšetrení**. Lekári ho môžu čítať len ak pacient **nevysloví nesúhlas** (opt-out). **Nie je tam onkologická správa ani MDT záver.**
- **Povinnosti poskytovateľov:** dodržiavať štandardy elektronického zdravotníctva od **1. 1. 2025** (§4 písm. a); využívať kmeňové údaje, evidovať identifikátory pacientov/zdravotníkov a zaznamenávať činnosť pracovníkov od **1. 1. 2026** (§4 písm. b–d). Väčšina paragrafov o výmennej sieti (§26–37) účinná od **1. 1. 2023**. Za porušenie eŽádanka/SZZ povinností sú priestupky s pokutou **do 25 000 resp. 50 000 Kč** (§40).
- Novela **236/2025 Sb.** (mení 325/2021) platí od **1. 1. 2026**, okrem niektorých ustanovení; mení najmä eŽádanku, SZZ a EZKartu [S: https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-zakona-o-elektronizaci-zdravotnictvi].

**Prakticky (čo sa spustilo k 1. 1. 2026) [S: https://nasezdravotnictvi.cz/aktualita/centralni-system-elektronickeho-zdravotnictvi-se-spousti-1-ledna-2026-co-se-zmeni]:**
- portál **eZdravi.gov.cz** (vstup pre poskytovateľov cez NIA/certifikát), **kmeňové zdravotnícke registre** (pacienti, zdravotníci, poskytovatelia), **eŽádanky** (jedinečný kód + QR kód, **„využívanie je zatiaľ úplne dobrovoľné“**), aplikácia **EZKarta** (očkovanie, eŽádanky, záznamy, prevencia), **dočasné úložisko**, SZZ. V plánoch od **1. 5. 2026**: viac funkcií EZKarty (SZZ, notifikácie, Index prevencie).
- **Pripojenie systémov**: poskytovatelia a správcovia IS „by mali“ budovať priame pripojenie – ide o odporúčanie, **právny termín som nenašiel** [S].
- **eŽádanka – typy:** od 1/2026 **zobrazovacie** (CT, RTG, MR, USG), **rehabilitácia** a **konziliárne** (typicky onkológia); **laboratórne** od 6/2026; platí 3 roky; lekár ju vystavuje vo svojom NIS/AIS alebo cez webové rozhranie NPEZ (pre malé ordinácie) [S: https://www.zdravezpravy.cz/2025/11/28/e-zadanky-vystavi-doktori-od-ledna-2026-jen-na-nektera-vysetreni/]. (Pozn.: nástroj na čítanie stránky v zhrnutí preložil „e-žádanka“ ako „e-prescription“; ide o žiadanku na vyšetrenie, nie recept.)
- **Od kedy je eŽádanka povinná?** **Žiadny termín nie je stanovený** – „povinné používanie sa môže riešiť až neskôr, keď systém bude fungovať“ [S: Naše zdravotnictví]. **Povinné je len prijatie** (§31a odst. 4).
- **eRecept** je naproti tomu **povinný od 1. 1. 2018** [S: Naše zdravotnictví] (v reportáži z 2018: ~35 000 lekárov v systéme, 80 % receptov elektronicky [S: Právo/Novinky 2018]).
- **Reálna adopcia eŽádanky po 1/2026: nenašiel som čísla** [?].

### 3.2 Národné kontaktné miesto a EÚ
- **NCPeH (Národní kontaktní místo)** je centrálna služba v zákone; poskytovateľ môže viesť **pacientsky súhrn** a odovzdávať ho cez NCP do iných štátov EÚ; pacient môže **namietať** proti odoslaniu do zahraničia [V: 325/2021 §20, §32, §33; 372/2011 §69c; vyhláška 444/2024]. V ČR NCP prevádzkuje Kraj Vysočina so SÚKL (eRecept v zahraničí) [S: https://www.businessinfo.cz/clanky/diky-projektu-si-cesi-mohou-vyzvednout-leky-na-erecept-i-behem-dovolene-v-zahranici/ , výsledok vyhľadávania]. Pre onkologickú cestu v rámci ČR **nie je relevantné**.
- **EHDS** (nariadenie EÚ 2025/327): v platnosti od **26. 3. 2025**; vykonávacie akty do **marca 2027**; výmena **pacientskych súhrnov a eRecept/eVýdaj marec 2029**; **snímky, laboratórne výsledky, prepúšťacie správy marec 2031** [S: https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_cs ; české termíny doplnené z prezentácie NCEZ, https://ncez.mzcr.cz/sites/default/files/media-documents/03%20konfNCEZ%20IKEM_EHDS_KJirakova_18062025.pdf]. Dôsledok: systémy budú musieť mať FHIR rozhranie a výmenný formát EÚ [S: Kružík a Opatřil, pre-hack, `02-prehack-prednasky.md`]. Pre dnešok nás to neobmedzuje, ale hovorí, **kam sa trh uberá**.

### 3.3 Štandardy a súkromné/ regionálne siete
- **DASTA** – český národný dátový štandard na výmenu zdravotníckych informácií; prvá verzia MZ 1994; ÚZIS ho používa na dávkové výkazy (verzia 4) [S: https://www.transfuznispolecnost.cz/media/2_jak_spolu_komunikuji_it_syste_my_darebnicek.pdf ; https://www.uzis.cz/res/file/vykazy/ekonomicke-vykazy-datove-rozhrani.pdf]. Väčšina nemocničných IS ho podporuje, HL7 sa vo veľkom nepoužíva [S: Ekonomický deník 2019, staré, dnešok [?]].
- **HL7 FHIR / IHE (MHD, MHDS, ATNA)** – cieľový štandard; NCEZ ho pripravuje, **zatiaľ je namapovaný len Patient**, klinické časti nie [S: Kružík, pre-hack, `02-prehack-prednasky.md`]. **Žiadny dnešný onkologický koordinačný tok na ňom nestojí** [odhad].
- **ePACS (ICZ)** – národná výmena **obrazových dát (DICOM)**: **všetkých 140 akútnych nemocníc a ~105 ambulantných zariadení** má ePACS; prenesených vyšetrení **12 000 (2008) → viac ako 640 000 (2018)**, čo je ~**4 %** všetkých vyšetrení; systém je určený hlavne na zdieľanie medzi akútnymi nemocnicami [S: Bruthans, Applied Clinical Informatics 11:104–111, 2020, https://www.thieme-connect.de/products/ejournals/html/10.1055/s-0040-1701252 – abstrakt z vyhľadávania, stránku nešlo otvoriť]. Dnešné čísla [?].
- **ReDiMed / MeDiMed** – regionálny PACS Masarykovej univerzity; o dnešnom stave a pripojených nemocniciach som **nenašiel aktuálne údaje** [?] (zdroje 2007–2016; diplomová práca ČVUT porovnáva ePACS a ReDiMed, https://dspace.cvut.cz/handle/10467/67582).
- **ICZ ISAC / eMeDOcS** – decentralizovaná platforma na výmenu dokumentácie a žiadaniek medzi nemocnicami, stojí na HL7/DICOM/IHE a prepája „niekoľko desiatok zariadení“; **bez centrálneho ukladania** [S: https://www.iczgroup.com/en/products-and-services/healthcare/integration-and-communication-in-healthcare/].
- **CGM ClinicBox (v prezentácii „CLICKBOX“)** – sieť na elektronické odovzdanie dokumentácie z nemocníc do ambulancií; **2 841 pracovísk k 4. 12. 2024** [V: prezentácia CGM, nzip.cz, odkaz v §1.1]. Pozn.: firemný údaj; názov v dokumente je „CLICKBOX“ (pravdepodobne ClinicBox) [?].
- **eZpráva** – napr. Nemocnica Česká Lípa ju v 2018 zaviedla na posielanie lekárskych správ praktikom [S: https://www.letemsvetemapplem.eu/?p=138938 , výsledok vyhľadávania].
- Prednáška z pre-hack dňa: **eZpráva, MEDDOX (ICZ), ePACS, ClinicBox (CGM), STAPRO MISE sú navzájom nekompatibilné proprietárne „health share“ siete**, niektoré sa práve prepájajú [S: Opatřil, `02-prehack-prednasky.md`].
- **Národný onkologický register (NOR, ÚZIS):** v zápisoch z Fóra onkologov (2023) ÚZIS uviedol, že **stav elektronizácie hlásenia je „nadále tragický“** – napriek platnému zákonu a technickej pripravenosti od 2019 **nedodáva dáta takmer polovica veľkých fakultných nemocníc** [V: https://www.linkos.cz/files/pro_odborniky/o-cos/zapisy/2023/Zapis-Forum-onkologu-25-9-2023.pdf]. Dôležitý signál o kvalite dátových tokov v onkológii.

---

## 4. Čo funguje a čo nie

| Oblasť | Čo funguje | Čo nefunguje | Zdroj |
|---|---|---|---|
| **Recepty** | eRecept povinný od 2018, väčšina receptov elektronicky | – | [S] Naše zdravotnictví, Právo 2018 |
| **Laboratórium ↔ ambulancia** | elektronická laboratórna žiadanka a výsledky v softvéri lekára „bežne funguje“ (CGM) | chýbajú štandardy a „rozostrené“ identity pacientov (podľa vnútra, zdravotníctva, sociálky, poisťovní) | [V] prezentácia CGM 12/2024 |
| **Snímky** | ePACS: výmena DICOM medzi akútnymi nemocnicami | len ~4 % vyšetrení; ambulancie čiastočne; pacient často nosí CD | [S] Bruthans 2020 |
| **Správy medzi lekármi** | v rámci jednej siete (ClinicBox, eZpráva, ISAC…) | **siete spolu nekomunikujú**; inak pošta/ručne | [S] Opatřil pre-hack |
| **Zhromaždenie podkladov pre KOC** | – | koordinátor dohľadáva výsledky z 5–7 pracovísk v rôznych formách (zadanie VZP) | [V] zadanie, `vzp-cesta-pacienta.md` |
| **Prepisovanie** | – | lekári „opakovane prepisujú údaje, ktoré už existujú“ (zadanie VZP); lekári tráveli 49 % času pri PC/papieroch a 27 % pri pacientovi (USA) | [V] zadanie; [S] Sinsky 2016 |
| **Sken/PDF** | PDF je len „fallback“ (ľudsky čitateľná príloha) | nie je strojovo čitateľný; **sken papiera sa musí podľa vyhlášky doplniť doložkou podpísanou el. podpisom a časovou pečiatkou, aby nahradil originál** | [S] Opatřil; [V] vyhláška 444/2024 §7 odst. 7 |
| **Opakované vyšetrenia** | – | keď cudzie snímky nie sú k dispozícii, opakuje sa **72 %** vyšetrení; keď sú v PACS len **11 %** (USA, UCSF) | [S] AJR 2012, https://doi.org/10.2214/ajr.11.6890 |
| **Nová eŽádanka** | – | dobrovoľná, adopcia neznáma, zatiaľ typy zobrazovacie/rehabilitácia/konziliárne | [S] viď §3.1 |
| **Koordinačné aplikácie v KOC** | pilotne v niektorých KOC (nepomenované) | neexistuje štandardný nástroj; spoločný prehľad kapacít sa len pripravuje | [S] MZ 2. 9. 2026 |
| **Strata dokumentov** | – | anekdota z pre-hack dňa: „stratilo sa preventívne CT na CD“; pacient „lieta s papiermi, často neúplnými“ (Tichopád) | [S] `02-prehack-prednasky.md` |

---

## 5. GDPR a súhlas pacienta pri zdieľaní

**Dôležité: nie som právnik. Toto je orientačné zhrnutie z textov zákonov; pre produkt treba právnu analýzu.**

1. **Zdieľanie medzi lekármi kvôli liečbe nevyžaduje súhlas pacienta.** Zákon 372/2011 §51 odst. 2 písm. a): **nie je porušením mlčanlivosti** „odovzdávanie informácií nevyhnutných na zabezpečenie nadväznosti poskytovaných zdravotných služieb“. §65 odst. 2: do dokumentácie môžu **bez súhlasu** nahliadať pracovníci poskytovateľa, ktorí sa podieľajú na starostlivosti, „v nevyhnutnom rozsahu“ [V: https://www.zakonyprolidi.cz/cs/2011-372]. GDPR čl. 9 odst. 2 písm. h) (zdravotná starostlivosť) je právny základ pre spracovanie zdravotných údajov – potvrdené len sprostredkovane [S: výsledok vyhľadávania, dokument Európskej komisie].
2. **Súhlas je potrebný pre tretie osoby:** rodina/dcéra – §65 odst. 1 písm. b) („osoby určené pacientom“); v elektronickom zdravotníctve musí pacient súhlas pre tretiu osobu podať **písomne s overeným podpisom, alebo elektronicky cez elektronickú identifikáciu** a môže ho **kedykoľvek odvolať** (325/2021 §33) [V]. (V našom fiktívnom prípade je súhlas pacientky so zdieľaním s dcérou zapísaný v správe 07 a želanie v správe 13 vznikla po MDT – viď `vzp-cesta-pacienta.md` §1.8.)
3. **SZZ = opt-out.** Zdravotníci môžu čítať Sdílený záznam, **ak pacient nevysloví nesúhlas** (namietať vie cez Registr oprávnění) [V: 325/2021 §34a odst. 7, §32 odst. 6].
4. **Do zahraničia (NCP/EÚ)** môže pacient namietať proti odoslaniu pacientskeho súhrnu [V: 325/2021 §32 odst. 6, §33].
5. **MDT:** pacient má byť informovaný, že plánovanie liečby tímom je súčasť starostlivosti a že jeho prípad môžu prerokovať zdravotníci, s ktorými sa nestretol; súhlas sa má získať „v súlade s miestnymi protokolmi“ a treba určiť, kto za to zodpovedá [V: KDP „Organizace a činnost multidisciplinárních týmů v onkologii“, ÚZIS/NIKEZ, v3.0, 12/2022, https://kdp.uzis.cz/res/guideline/20-organizace-cinnost-multidisciplinarniho-tymu-v-onkologii-final.pdf].
6. **E-mail:** zdravotné údaje sa majú posielať **zabezpečene (šifrované)**; v ČR som nenašiel oficiálne stanovisko ÚOOÚ k e-mailu medzi lekármi [?]. Nemecký úrad v 2022 hodnotil samotné TLS ako nedostatočné pre e-recepty s QR kódom (vendorový blog, slabý zdroj) [S]. Dosledok: **„pošli prílohy e-mailom“ je právne aj bezpečnostne najcitlivejší kanál** [odhad].
7. **Pre náš softvér** (odhad, nie právne poradenstvo): ak by bol nasadený v KOC, KOC je správca údajov a my sprostredkovateľ (zmluva podľa GDPR čl. 28), je potrebný záznam o činnostiach, bezpečnosť a hosting v EÚ; AI spracovanie zdravotných údajov patrí do kategórie osobitných údajov; v hackathone používame **iba fiktívne dáta**.

---

## 6. MDT: ako sa dnes zvoláva, zapisuje a ako sa výsledok dostane k praktikovi

**Hlavný zdroj:** klinický doporučený postup **KDP-AZV-20 „Organizace a činnost multidisciplinárních týmů v onkologii“** (ÚZIS/NIKEZ, v3.0, 12/2022, doporučená aktualizácia 1. 1. 2027) [V: https://kdp.uzis.cz/res/guideline/20-organizace-cinnost-multidisciplinarniho-tymu-v-onkologii-final.pdf].

- **Kto môže referovať pacienta na MDT:** „každý lekár, ktorý sa počas diagnostiky, liečby a ďalšej starostlivosti dostane do kontaktu s pacientom, ideálne ošetrujúci lekár“. **Rozhodnutie pacienta nereferovať na MDT sa musí zapísať do dokumentácie** [V, KDP].
- **Kompletnosť je podmienka:** „diskusia a rozhodnutie o možnostiach liečby by mali prebehnúť **iba vtedy, keď sú všetky relevantné výsledky a informácie k dispozícii, t. j. kompletná dokumentácia je k dispozícii všetkým členom MDT**“ [V, KDP]. Presne to rieši naša výzva (chýbajúce podklady).
- **Organizácia:** každý MDT má **predsedu** a **koordinátora (administrátora)**, ktorý zodpovedá za **objednávanie pacientov, zápis zo schôdzok, poskytovanie informácií a potrebnú komunikáciu a zabezpečenie následnej starostlivosti**; účasť sa zaznamenáva; frekvencia „podľa veľkosti centra“; forma osobne, telefonicky, videokonferenčne [V, KDP]. Ak sa nedá včas zvolať MDT, **liečba sa nesmie odložiť** [V, KDP].
- **Žiadna jednotná podoba v ČR:** výzva MZ na KOC 2026–2031 žiada od každého centra popis **počtu MDT, štruktúry, frekvencie, formy (kontaktne/on-line/konzultačne), možnosti prezentovať externých pacientov a spolupráce s MDT iných centier** [V: Príloha č. 4 Výzvy KOC, https://mzd.gov.cz/wp-content/uploads/2025/07/Vyzva-KOC-2026-2031-Priloha-c.-4-5.docx]. Čiže **každé KOC si to robí po svojom** a presný tool na zvolávanie/zápis (e-mail, kalendár, NIS modul, Teams…) **nie je zjednotený [?]** – otázka na mentorov.
- **Zápis výsledku:** KDP žiada **spoločné dokumentačné postupy** vyhovujúce všetkým členom tímu a zaznamenávanie účasti, frekvencie a rozhodnutí; **plán liečby má byť formálny, písomný** [V, KDP]. Konkrétny formulár zápisu v ČR je lokálny [?] (zadanie hackathonu dáva vzor `MDT_zapis`, 7 sekcií).
- **Výsledok k praktikovi:** KDP: „informácie o výsledku rokovania sa odovzdávajú ošetrujúcemu a **praktickému lekárovi pacienta**“; v letáku pre pacienta: „váš onkologický špecialista zašle vášmu praktickému lekárovi informácie s odporúčaním MDT a počiatočným plánom liečby“ [V, KDP]. Zákon k tomu pridáva všeobecnú povinnosť správy praktikovi (372/2011 §45 odst. 2 písm. f) [V]. **Neurčuje kanál ani dôkaz doručenia** [V] – to je to, čo zadanie VZP nazýva „zavrieť slučku“.
- **Peniaze a evidencia:** existuje **výkon signalizujúci, že pacient prešiel MDT** (podiel zverejňuje indiko.cz); ÚZIS/ČOS však uviedli, že **vykazovaný podiel je nízky** a môže odrážať len vykazovanie, nie realitu; všetci novodiagnostikovaní pacienti nemôžu prejsť MDT pre obmedzené kapacity [V: zápis Fóra onkologov 25. 9. 2023, odkaz v §3.3; S: MZ 2. 9. 2026 – podiel zverejňovaný po centrách].
- **Pri pankrease** platí poisťovňa liečbu až po MDT; pokrytie MDT v ČR ~60 % nových solídnych nádorov [V/S: OECD ČR 2025, citované v `vzp-cesta-pacienta.md` §3.2] – teda **zápis z MDT je aj platobný dokument**.

---

## 7. Čo z toho plynie pre NIT (náš nástroj) – môj úsudok

1. **Vstup musí byť „to, čo koordinátor už dostáva“** (e-mail s prílohami, PDF, sken, Word), lebo žiadny jednotný kanál neexistuje a eŽádanka je dobrovoľná [odhad na základe §2–§3].
2. **Výstup má byť štruktúrovaný (FHIR) a pripravený na budúce napojenie** – štátne služby aj EHDS sa k nemu blížia [S, §3.2].
3. **Slučka „výsledok → praktik“ je povinnosť v zákone bez predpísaného kanála ani dôkazu** → dôkaz doručenia je reálna pridaná hodnota [V + odhad].
4. **Kompletnosť podkladov pred MDT je výslovná požiadavka klinického postupu** → kontrola úplnosti a „kto je na ťahu“ nie je vymyslená funkcia, ale priamo z KDP [V].
5. **Sken ≠ originál** (vyhláška 444/2024 §7): dokument z PDF/skenu pre MDT je pracovná pomôcka, nie náhrada zdravotnej dokumentácie – v produkte to treba povedať otvorene [V].
6. **Neslúbiť integráciu s NIS** (desiatky systémov, žiadny dominantný štandard v nemocniciach), len „vrstvu nad čímkoľvek“ [odhad, §1].

---

## 8. Čo som nevedel overiť [?] (pre mentorov / ďalšie kolo)

- Presný **počet rôznych AIS a NIS** a ich podiely; ktorý KOC používa aký NIS (nenašiel som verejný register).
- **Ako reálne** praktik posiela pacienta do konkrétneho KOC (e-mail na koordinátora? telefón? tlačivo? NIS?), či používajú **fax** a **dátovú schránku**; koľko koordinátorov má jedno KOC a koľko pacientov na jedného.
- **Adopcia eŽádanky** po 1/2026 a **termín jej povinnosti** (nestanovený); reálny stav SZZ a EZKarty.
- Dnešný stav **ReDiMed**, aktuálne počty pripojených v **ePACS / ISAC / MEDDOX / ClinicBox** (len staré alebo firemné údaje).
- Ako sa v konkrétnom KOC **zvoláva MDT** (nástroj) a kde je uložený **zápis** (NIS modul vs. dokument).
- Stanovisko **ÚOOÚ** k e-mailu a k AI spracovaniu zdravotných dát.
- Slovensko: **OnkoAsist (NCZI)** – dnešný stav neznámy [S: https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html].

**Odporúčané 4 otázky na mentorov (Chrástová, Vaňková, Bielčiková):**
1. „Ako vám dnes praktik pošle žiadosť o prevzatie – e-mailom, telefonicky, cez NIS, papierom? Kde ju dostávate?“
2. „Aké systémy používa vaše KOC (NIS, PACS) a vidíte do dokumentov z iných nemocníc?“
3. „Ako zvoláte MDT a kde sa zapisuje záver? Ako sa dostane k praktikovi a ako viete, že dorazil?“
4. „Koľko minút trvá príprava jedného prípadu a ako často sa MDT odloží pre chýbajúci údaj?“

---

## 9. Zdroje (prehľad)

**Zákony a vyhlášky (čítané priamo) [V]:**
- Zákon 325/2021 Sb. o elektronizaci zdravotnictví (znění k 1. 4. 2026): https://www.zakonyprolidi.cz/cs/2021-325
- Zákon 372/2011 Sb. o zdravotních službách (znění 1. 1.–31. 12. 2026): https://www.zakonyprolidi.cz/cs/2011-372
- Vyhláška 444/2024 Sb. o zdravotnické dokumentaci (od 1. 1. 2025): https://www.zakonyprolidi.cz/cs/2024-444 ; zrušená 98/2012: https://www.zakonyprolidi.cz/cs/2012-98
- KDP-AZV-20 Organizace a činnost MDT v onkologii (v3.0, 12/2022): https://kdp.uzis.cz/res/guideline/20-organizace-cinnost-multidisciplinarniho-tymu-v-onkologii-final.pdf
- Příloha č. 4 Výzvy KOC 2026–2031 (MZ): https://mzd.gov.cz/wp-content/uploads/2025/07/Vyzva-KOC-2026-2031-Priloha-c.-4-5.docx
- Zápis Fóra onkologů 25. 9. 2023 (ČOS): https://www.linkos.cz/files/pro_odborniky/o-cos/zapisy/2023/Zapis-Forum-onkologu-25-9-2023.pdf
- NOP ČR 2030 – KOC (Kiss, 9/2024): https://www.linkos.cz/files/pro_odborniky/napl_onko_prog/sled_predikce_onko/Forum/2024-09/1-Doc-Kiss-Organizace-pece-dostupnost_solidni-tumory.pdf
- CGM: Sdílená zdravotnická data v ambulancích (4. 12. 2024): https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf

**Sprostredkované [S]:**
- MZ ČR 2. 9. 2026, koordinátori: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ ; https://mzd.gov.cz/tiskove-centrum-mz/koordinovat-je-slusnost/
- Naše zdravotnictví – spustenie centrálneho systému 1. 1. 2026: https://nasezdravotnictvi.cz/aktualita/centralni-system-elektronickeho-zdravotnictvi-se-spousti-1-ledna-2026-co-se-zmeni
- Zdravé zprávy 28. 11. 2025 – eŽádanky: https://www.zdravezpravy.cz/2025/11/28/e-zadanky-vystavi-doktori-od-ledna-2026-jen-na-nektera-vysetreni/
- Právní prostor – novela 236/2025: https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-zakona-o-elektronizaci-zdravotnictvi
- EHDS (Európska komisia): https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_cs ; NCEZ: https://ncez.mzcr.cz/sites/default/files/media-documents/03%20konfNCEZ%20IKEM_EHDS_KJirakova_18062025.pdf
- ePACS: Bruthans 2020, https://www.thieme-connect.de/products/ejournals/html/10.1055/s-0040-1701252 ; ICZ: https://www.iczgroup.com/en/products-and-services/healthcare/integration-and-communication-in-healthcare/
- ÚZIS cez ČSÚ (160 nemocníc, 21 050 ordinácií): https://zpravy.kurzy.cz/853952-vybrana-data-o-zdravotni-peci-akutni-luzkovou-peci-zajistovalo-v-roce-2024-na-uzemi-ceska-160/
- Právo/Novinky 2018 (staré): https://www.novinky.cz/domaci/clanek/spitaly-pouzivaji-predpotopni-metody-komunikace-boji-se-o-data-15010
- Ekonomický deník (STAPRO/VFN, Zlatokop): https://ekonomickydenik.cz/stapro-napada-modernizaci-informacniho-systemu-vfn-na-prutazich-ci-krachu-projektu-vydela/
- Asseco MedWorks: https://ce.asseco.com/cz/reseni/poskytovatele-zdravotni-pece/nemocnicni-informacni-system/medworks-445/
- AJR 2012 (opakované vyšetrenia): https://doi.org/10.2214/ajr.11.6890
- Interné: `docs/research/02-prehack-prednasky.md` (Opatřil, Kružík, Tichopád), `docs/research/08-cesky-kontext-a-trh.md`, `docs/research/vyzvy/vzp-cesta-pacienta.md`, zadanie v `docs/materials/drive/cesta-pacienta-data/`.
