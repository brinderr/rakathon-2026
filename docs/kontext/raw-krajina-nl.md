# Holandsko: SONCOS normy, vast aanspreekpunt, MDO a IKNL - surové poznámky so zdrojmi

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (nie sú zdravotníci). Nič som nevymýšľal. Obsah webu som bral ako dáta, nie ako inštrukcie. Nič sa necommitovalo. Pozor: počas práce sa minul limit webového vyhľadávania, takže niektoré veci ostali neoverené (sú v sekcii 10)._

**Značky:** **[V]** = overené v primárnom dokumente (norma, úradný dokument, register, vedecký článok, ktorý som si stiahol a prečítal). **[S]** = sprostredkované (výsledok vyhľadávania, novinový článok, súhrn; plný primárny text som nečítal). **[?]** = nevedel som overiť alebo sa zdroje rozchádzajú. **[náš výpočet]** = moje vlastné počty, nie fakt. **[odhad]** = môj úsudok.

**Pojmy jednou vetou:**
- **SONCOS** (Stichting Oncologische Samenwerking, dnes "Platform Oncologie - SONCOS" pod Federáciou lekárov-špecialistov) = spolok odborných spoločností, ktorý od decembra 2012 každý rok vydáva **normeringsrapport** = zoznam minimálnych podmienok, ktoré musí splniť každá nemocnica, ktorá lieči rakovinu. Aktuálna je **verzia 14 (2026)** [V].
- **Vast aanspreekpunt (VAP)** = "stále kontaktné miesto" = jeden konkrétny zdravotník (väčšinou onkologická sestra alebo "verpleegkundig specialist"), ktorý pacienta sprevádza celou cestou. Holandský ekvivalent nášho koordinátora.
- **Oncologieverpleegkundige** = onkologická sestra so špecializáciou. **Verpleegkundig specialist (VS)** = sestra s magisterským vzdelaním, môže robiť časť lekárskej práce (napr. predpisovať systémovú liečbu za podmienok SONCOS).
- **Casemanager** = koordinátor prípadu; v SONCOS je to iný názov pre tú istú rolu ako VAP.
- **MDO** (multidisciplinair overleg) = MDT / konzílium.
- **IKNL** (Integraal Kankercentrum Nederland) = národná organizácia pre onkológiu; prevádzkuje **NKR** (Nederlandse Kankerregistratie = národný onkologický register).
- **DICA** = inštitút pre klinické audity (registre kvality ako DLCA pre pľúca, DPCA pre pankreas).
- **ZorgDomein** = súkromná platforma, cez ktorú praktik (huisarts) elektronicky posiela žiadanky do nemocníc.
- **LSP** (Landelijk Schakelpunt) = národný "prepínač", cez ktorý si lekári môžu pozrieť údaje od praktika a lekárne (nie je to centrálne úložisko).
- **Twiin** = národný portál na posielanie snímok (CT, MR, RTG) medzi nemocnicami.
- **Wegiz** = zákon o povinnej elektronickej výmene údajov v zdravotníctve (účinný od 1. 7. 2023).

---

## 0. Odpoveď v 10 vetách

1. Holandsko **nemá štátny program štandardizovaných ciest ako Dánsko alebo Nórsko** a **nemá zákonné lehoty**; namiesto toho má **profesijné normy SONCOS** (od 2012, každoročne aktualizované, verzia 14 z roku 2026), ktoré musí splniť každá nemocnica, inak nesmie danú rakovinu liečiť [V: SONCOS 14; OECD/EK 2025].
2. **Lehoty SONCOS (všeobecné):** prvá návšteva v nemocnici do **1 týždňa**, diagnostika do **3 týždňov**, od prvej návštevy po začiatok liečby do **6 týždňov**; pri presune do inej nemocnice **+3 týždne**. Sú "richtinggevend" (smerodajné), nie vymáhateľné [V: SONCOS 14, s. 6].
3. **Reálne sa lehoty často neplnia:** pri skorej rakovine pľúc bol medián od prvej návštevy po liečbu **47 dní** (štádium I) a **46 dní** (štádium II) v rokoch 2014-2019; do 33 dní začalo len **24-25 %** pacientov [V: Klarenbeek 2023, NKR, 9 536 pacientov].
4. **Koordinácia:** SONCOS vyžaduje, aby **každý pacient mal okrem hlavného lekára aspoň jedno "vast aanspreekpunt c.q. casemanager"** (onkologická sestra, VS alebo iný zdravotník), ktorý je členom MDT, "dohliada na celú multidisciplinárnu a transmurálnu cestu" a je ľahko dostupný telefonicky alebo e-mailom [V: SONCOS 14, s. 6-7].
5. **Ale nie každý ho má:** prieskum pacientskej federácie NFK (4 300+ pacientov, publikované 2018) ukázal, že **štvrtina pacientov nemá žiadne stále kontaktné miesto**; z tých, čo ho majú, je to v tretine prípadov ich lekár, asi v polovici onkologická sestra [S: oncologie.nu 2018].
6. **MDT je povinné a kvantifikované:** MDO aspoň raz týždenne, prerokovať treba **aspoň 90 % pacientov** pred primárnou liečbou; zápis z MDO ide do elektronického záznamu a **praktikovi musí odísť do 2 pracovných dní** [V: SONCOS 14, s. 7-8]. (Česko: MDT pokrýva ~60 % [V: OECD ČR 2025 podľa `raw-cz-system.md`].)
7. **Koncentrácia:** pre pankreas od 2025/2026 platí minimálne **50 resekcií pankreasu ročne na pracovisko** a **150 nových pacientov ročne na pankreatickom MDO** v referenčnom centre; pre pľúca **60 anatomických resekcií** [V: SONCOS 14; indikátory 2026]. Plnenie noriem každá nemocnica **povinne a verejne hlási** (register Zorginstituut Nederland) [V].
8. **Tok informácií je digitálny, ale roztrieštený:** praktici posielajú žiadanky elektronicky (100 % praktikov, ktorí to chcú, to v roku 2017 vedelo; 98 % praktikov vedelo elektronicky prijať prepúšťaciu správu), ale **snímky sa medzi nemocnicami ešte v roku 2020 posielali hlavne na DVD**; až potom prišiel portál Twiin (75 nemocníc v roku 2022) [V: eHealth-monitor 2017; NVvR 2022]. Zákonná povinnosť výmeny snímok (Wegiz) ešte nemala ani termín (stav 12/2024) [V].
9. **Výsledky:** 5-ročné prežitie všetkých rakovín **67 %** (diagnóza 2015-2022, IKNL), pľúca **26 %**, hrubé črevo **70 %** [V: OECD/EK 2025]. CONCORD-3 (2010-14): pľúca **17,3 %** vs. Česko 10,6 %; pankreas **7,4 %** vs. 6,1 % [V]. **Ale úmrtnosť na rakovinu je takmer rovnaká ako v Česku: 256 vs. 257 na 100 000 (2021)**, lebo Holandsko má 3. najvyššiu incidenciu v EÚ [V: OECD/EK 2025].
10. **Pre našu výzvu je Holandsko najlepší vzor pre "pravidlá informačného toku" (čo musí byť pred MDO, kto posiela zápis, do 2 dní praktikovi, VAP pre každého pacienta) a pre "verejné meranie kvality nemocníc"**, ale nie vzor pre rýchlosť ciest ani pre technickú infraštruktúru [odhad].

---

## 1. Ako je systém postavený (normy, nie zákon)

- **Žiadne zákonné lehoty.** OECD: "there are no legal waiting time requirements for cancer patients in the Netherlands", SONCOS stanovil normy [V: OECD/EK 2025, s. 19].
- **SONCOS normeringsrapport:** prvý v decembri 2012; vznikol z potreby chirurgov-onkológov (NVCO), internistov-onkológov (NVMO) a radiačných onkológov (NVRO) zapísať minimálne podmienky dobrej onkologickej starostlivosti. **Revízia každý rok**, nemocnice majú **1 rok na zavedenie** novej normy [V: SONCOS 14, s. 5].
- **Tri časti od 2022:** (a) všeobecné podmienky pre každú nemocnicu, (b) normy pre onkologické siete, (c) normy pre jednotlivé typy nádorov [V: SONCOS 14].
- **Verzia 14 (2026)** pridáva **Molekulárny tumorboard (MTB)** a **normy koncentrácie z Integrálnej zdravotnej dohody (IZA 2022)** [V: SONCOS 14, s. 5; https://demedischspecialist.nl/normeringsrapport-van-soncos].
- **Ako sa to vymáha:** z noriem SONCOS je odvodená **sada indikátorov "Oncologie - SONCOS"**, ktorá je "po preskúmaní zapísaná do Registra Zorginstituut Nederland"; povinné indikátory nemocnice hlásia cez portál OmniQ (DHD) a sú **verejné** ("Transparantie: Verplicht") [V: Indicatorengids SONCOS verslagjaar 2026, v3 11/2025]. Napríklad indikátor "vast aanspreekpunt" sa pýta, či má každý pacient aspoň 1 VAP [V: indikátory 2025/2026].
- **Kontrola cez poisťovne a inšpekciu:** VAP bol najprv indikátor inšpekcie IGJ, až potom sa dostal do SONCOS [V: IKNL VAP 2025, s. 1]. Ako presne poisťovne SONCOS normy zmluvne vyžadujú: [?] (SONCOS píše, že normy pre siete "môžu byť zazmluvnené" s poisťovňami) [V: SONCOS 14, s. 14].
- **Národný plán:** Holandsko dlho nemalo vládny národný onkologický plán; od **27. 11. 2023** existuje **Nederlandse Kankeragenda** (20 cieľov na 10 rokov), ktorú pripravil "Dutch Cancer Collective" (IKNL, KWF, NFK) s ministerstvom a 100+ organizáciami [V: OECD/EK 2025, s. 7].
- **Siete:** **7 regionálnych onkologických sietí**, 4 z nich sú "komplexné" (univerzitné + bežné nemocnice + rádioterapia) [V: OECD/EK 2025, s. 21]. SONCOS normy pre siete platia od **1. 1. 2024** (dohody o presune pacientov, o MDO, o výmene údajov, spoločná onkologická komisia siete) [V: SONCOS 12/14, kap. 3]. Sieť OncoZON (Maastricht, 1,9 mil. ľudí) má akreditáciu OECI Comprehensive Cancer Network [V: OECD/EK 2025].
- **Zorgpaden:** každá nemocnica musí mať pre diagnózy s **20+ pacientmi ročne** písomnú cestu (zorgpad): aké vyšetrenia, aké minimálne doby, aké indikátory a **kto je kedy zodpovedný** [V: SONCOS 14, s. 6].
- **Hlavný lekár musí byť jasný:** "Pre pacienta musí byť vždy jasné a v zázname zapísané, kto je hlavný lekár (hoofdbehandelaar)" [V: SONCOS 14, s. 6].

---

## 2. Lehoty (normy)

### 2.1 Všeobecné (všetky rakoviny) [V: SONCOS 14, s. 6; OECD/EK 2025, s. 19]
| Úsek | Norma |
|---|---|
| žiadanka s podozrením na malignitu -> prvá návšteva v nemocnici | **max. 1 týždeň** |
| diagnostika (doorlooptijd) | **max. 3 týždne** |
| prvá návšteva -> začiatok liečby | **max. 6 týždňov** |
| presun do inej nemocnice | lehota sa môže predĺžiť o **3 týždne** |
- Od verzie 14 je pridaná veta, že lehoty sú "**richtinggevend**" (smerodajné) a závisia od dobre nastavenej cesty; odchýlka je možná "z medicínskych dôvodov" s odôvodnením [V: SONCOS 14, s. 6].
- **Popri SONCOS existujú všeobecné "treeknormy"** poisťovní a poskytovateľov: prvá návšteva a diagnostika typicky **4 týždne**, liečba **7 týždňov** [V: OECD/EK 2025, s. 19-20].
- **Sneldiagnostiek (rýchla diagnostika)** v niektorých nemocniciach: rozhovor do **48 hodín** od žiadanky, výsledky do **5 pracovných dní** [V: OECD/EK 2025, s. 20].

### 2.2 Pľúca [V: SONCOS 14, s. 34; smernica NSCLC 18. 9. 2025]
| Úsek | Norma |
|---|---|
| žiadanka -> prvá návšteva u pneumológa | **max. 5 pracovných dní**, má sa splniť u **80 %** ľudí |
| prvá návšteva -> liečba s kuratívnym cieľom | **max. 6 týždňov** (vrátane mediastinálneho stagingu, NGS a MDO) |
| prvá návšteva -> paliatívna systémová liečba alebo BSC | **max. 8 týždňov** (vrátane NGS) |
- Staršia verzia (SONCOS 12, 2024): **5 týždňov** pre pacientov s mediastinoskopiou a pre štádium IV s NGS [V: SONCOS 12, s. 33]. Od verzie 14 to bolo zmiernené na 6/8 týždňov [V; náš výpočet: porovnanie textov].

### 2.3 Pankreas
- Všeobecná norma SONCOS (6 týždňov od prvej návštevy) platí aj pre pankreas; osobitná lehota v SONCOS pre pankreas **nie je** [V: SONCOS 14, s. 25-26].
- **Holandská smernica:** liečba nádorov hlavy pankreasu a periampulárnej oblasti má začať **do 3 týždňov od MDO** [V cez Steen 2020, BJS Open, úvod abstraktu].
- Adjuvantná chemoterapia: smernica odporúča začať **do 12 týždňov od operácie** [S: štúdia NKR, PMC10165062].

### 2.4 Iné príklady [V: SONCOS 14]
- Svalovo invazívny karcinóm močového mechúra: prvá návšteva -> definitívna liečba **max. 12 týždňov**.
- Prsník: medián od biopsie po liečbu **do 6 týždňov**; "sneldiagnostiek" benígne vs. malígne **do 2 pracovných dní**.
- Hlava-krk: IKNL cieľ **80 % do 30 dní** od prvej návštevy [S: vyhľadávanie; percentá v 3.3 sú V].

---

## 3. Plnenie lehôt: konkrétne čísla

**Dôležité:** Holandsko **nemá celoštátne zverejňované ročné percento "v lehote"** ako Nórsko alebo Dánsko. Čísla sú z registrov a štúdií [odhad, na základe toho, čo som našiel].

### 3.1 Pľúca
- **Skoré štádium I-II NSCLC, 2014-2019, NKR, 9 536 pacientov** (len pacienti poslaní praktikom k pneumológovi) [V: Klarenbeek 2023, Transl Lung Cancer Res, https://pmc.ncbi.nlm.nih.gov/articles/PMC10654436/]:
  - medián od prvej návštevy po liečbu: **47 dní** (IQR 34-65) štádium I, **46 dní** (IQR 33/34-62) štádium II;
  - do 33 dní (približne vtedajšia norma 35 dní): **24 %** (štádium I, 1 755 zo 7 455) a **25 %** (štádium II, 515 z 2 081);
  - pri chirurgii štádia II zvyšovalo čakanie > 33 dní riziko úmrtia (aHR **1,36**); hlavné brzdy: EUS/EBUS a ďalšie diagnostické výkony.
  - **[náš výpočet]:** medián 46-47 dní je nad 6-týždňovou normou (42 dní), teda **viac ako polovica** pacientov v skorom štádiu nezačala liečbu do 6 týždňov.
- **Pokročilé štádium III-IV, 2016, 4 096 pacientov zo všetkých 78 nemocníc:** medián od diagnózy po liečbu **28 dní**; mediány nemocníc **17 až 68 dní** [V: van de Ven 2019, Lung Cancer, doi 10.1016/j.lungcan.2019.05.023].
- **Pokročilé štádium III-IV, 2014-2019, 10 306 pacientov, 109 nemocníc:** rýchlejší štart **nezlepšil** prežitie (pri chemoterapii/imunoterapii štádia IV mali pacienti s čakaním > 21 dní dokonca nižšie riziko úmrtia, aHR 0,81) - autori to vysvetľujú tým, že najchorejší pacienti sa liečia najskôr [V: Klarenbeek 2023, Thorax, PMID 35450944].
- **Audit DLCA (DICA):** 40 000+ pacientov, 73 nemocníc, 15 indikátorov; diagnóza -> liečba **do 21 dní: 62 %** (bez invazívnej mediastinálnej diagnostiky), **46 %** (s EUS/EBUS); **do 35 dní: 59 %** (s mediastinoskopiou) [S: prezentácia na European Cancer Summit, https://europeancancer.org/content/lung-cancer-dutch-audit; rok údajov nie je uvedený [?]].
- Pre porovnanie Česko: pri pľúcach **viac ako 60 %** pacientov nezačne liečbu do 8 týždňov od CT [S: MZ ČR 2026 podľa `raw-cz-system.md`]. Definície (od CT vs. od prvej návštevy) **nie sú rovnaké** [odhad].

### 3.2 Pankreas
- **MDO -> operácia (pankreatoduodenektómia), 2012-2016, NKR, 2 027 pacientov:** medián **25 dní** (IQR 14-36); tretiny ≤ 18 / 19-32 / ≥ 33 dní. Dlhší čas **nezhoršil celkové prežitie** (HR 0,99), ale pri adenokarcinóme s dlhým čakaním bola nižšia miera resekcie (RR 0,92) [V: Steen 2020, BJS Open, doi 10.1002/bjs5.50319].
  - **[náš výpočet]:** medián 25 dní > 21 dní (3 týždne), teda viac ako polovica pacientov sa neoperovala do 3 týždňov od MDO.
- **Operácia -> adjuvantná chemoterapia (2008-2013, 1 195 pacientov):** medián **6,7 týždňa**, medzi centrami sa nelíšil [S: PMC5083735].
- **PACAP-1 (celoštátna randomizovaná štúdia, 2018-2020, všetkých 17 holandských pankreatických sietí, 5 887 pacientov):** zavedenie 5 osvedčených postupov (perioperačná a paliatívna chemoterapia, enzýmy, dietológ, kovové stenty) **nezlepšilo 1-ročné prežitie: 24 % vs 23 %**. Paliatívna chemoterapia vzrástla z 24 % na 30 %, enzýmy z 34 % na 45 %, kovové stenty zo 74 % na 83 %. **Väčšina pacientov nedostala žiadnu liečbu nádoru** [V: Mackay 2024, JAMA Surgery, doi 10.1001/jamasurg.2023.7872].
  - Pre nás dôležité: aj keď Holandsko celoštátne a organizovane zlepšilo proces, **pankreas sa organizáciou nezachránil** [odhad].

### 3.3 Hlava a krk (príklad zlepšovania meraním)
- Do 30 dní od prvej návštevy začalo liečbu **39 % (2015) -> 64 % (2024)** pacientov [V: IKNL 18. 10. 2024, https://iknl.nl/nieuws/2024/rapport-unieke-kenmerken-kanker-hoofd-halsgebied; zdroj údajov audit DHNA].

---

## 4. Koordinátor: vast aanspreekpunt / casemanager

### 4.1 Čo hovorí norma SONCOS [V: SONCOS 14, s. 6-7; rovnaký text v SONCOS 12]
Okrem hlavného lekára má pacient prístup k **aspoň jednému stálemu kontaktnému miestu (vast aanspreekpunt) c.q. casemanagerovi v reťazci**, napr. VS, onkologická sestra alebo iný zdravotník, ktorý:
- je v **tíme, kde sa ľudia vedia zastúpiť**, a tím je súčasťou MDT pre diagnostiku a liečbu;
- **dohliada na celú multidisciplinárnu a transmurálnu cestu** (diagnostika, liečba, následná starostlivosť);
- je **odborne špecializovaný** na danú diagnózu;
- pozná pacienta "v celom jeho kontexte";
- je pre pacienta **"pevná kotva"** počas celej diagnostiky a liečby, **má prístup k záznamu**, je **telefonicky alebo e-mailom ľahko a rýchlo dostupný**;
- je kontakt aj pre iných zdravotníkov na neonkologických oddeleniach.
- **Pri sieťach (od 2024):** sieť musí mať dohodu, že pacient má **jasné kontaktné miesto počas celej cesty sieťou** (aj pri presune medzi nemocnicami) [V: SONCOS 14, s. 16].
- **Na MDT** pre pankreas, pľúca, hrubé črevo atď. musí byť povinne prítomný **"case manager a/alebo onkologická sestra a/alebo VS onkológie"** [V: SONCOS 14, tumor-špecifické normy].

### 4.2 História a právny charakter
- V&VN Oncologie (sestry) vydala odporúčanie o VAP pre pacientov s rakovinou prsníka a hrubého čreva -> z toho vznikol **indikátor inšpekcie IGJ** -> potom **norma SONCOS** [V: IKNL VAP 2025, s. 1].
- **Nie je to zákon**, je to profesijná norma s povinným verejným indikátorom [V: indikátory 2026; odhad k právnej sile].
- **Rozšírenie mimo nemocnice:** projekt **"VAP Oncologie buiten de muren van het ziekenhuis"** (VAP mimo nemocnice) beží od **1. 5. 2023** na 3 roky, vedie ho IKNL za Taskforce Cancer Survivorship Care; definícia bola finalizovaná **16. 4. 2025**. Cieľ: kontaktné miesto v primárnej starostlivosti aj po liečbe [V: IKNL VAP 2025; OECD/EK 2025, s. 24].
  - Dôvod: v prieskume NFK **85 %** respondentov malo aj viac ako 10 rokov po diagnóze telesné alebo psychické ťažkosti [V cez IKNL VAP 2025, s. 1].

### 4.3 Realita
- **NFK prieskum (4 300+ pacientov, publikované 1. 8. 2018):** **25 %** nemá žiadne stále kontaktné miesto; z tých, čo ho majú, **asi 1/3** má ako VAP svojho lekára, **asi 1/2** onkologickú sestru; dôležitosť VAP hodnotia **8,9 z 10**; po skončení liečby VAP často "zmizne"; menej ako polovica dostane dosť informácií po liečbe [S: https://www.oncologie.nu/nieuws/een-vast-aanspreekpunt-zeer-gewenst-nog-onvoldoende-geregeld/].
- **Novšie celoštátne percento VAP** (po zavedení indikátora) som nenašiel [?].
- **Koľko je VAP/casemanagerov:** celoštátny počet nepoznám [?]. OECD: Holandsko má **1 745 sestier na 1 000 nových prípadov rakoviny** (EÚ 1 376), ale len **593 lekárov** (EÚ 679); chýbajú praktici a onkologické sestry v nemocniciach aj v komunite [V: OECD/EK 2025, s. 18].
- **Ako sa VAP financuje** (či je to osobitná platba ako v ČR 250 Kč/deň, alebo súčasť DBC balíka): [?].

### 4.4 Porovnanie s Českom [odhad]
- ČR: **min. 1 koordinátor na plný úväzok na KOC** (od 1/2026), platba za deň zásahu [z `raw-cz-system.md`].
- NL: **VAP pre každého pacienta** v každom nádorovom tíme (typicky sestra, ktorá je aj na MDT); nie je to jedna osoba pre celé centrum, ale rola v každom tíme. Zároveň však 1/4 pacientov (2018) VAP nemala.

---

## 5. MDO (multidisciplinárny tím)

### 5.1 Norma SONCOS [V: SONCOS 14, s. 7-8; rovnaké v SONCOS 12]
- MDO **aspoň raz týždenne** (pri zriedkavejších nádoroch môže byť raz za 2 týždne);
- prerokuje sa **aspoň 90 % pacientov** (okrem nízkych štádií kože a močového mechúra), **pred primárnou liečbou** a pri primárnej operácii aj **po operácii**;
- možnosť **konzultácie referenčného centra** na každom MDO;
- nemocnice v sieti sa musia dohodnúť: **minimálna lehota na prihlásenie** pacienta na MDO, **aké informácie musia byť minimálne dodané** a ako; **dodanie "prednostne digitálne"**;
- jasný predseda, prezentuje ošetrujúci lekár;
- zápis: jednoznačný záver/odporúčanie, kto bol prítomný, kto píše; **zápis sa číta počas MDO naživo**; ak sa ide od smernice, treba to zdôvodniť; zápis sa uloží do **EPD nemocnice, kde sa pacient lieči**;
- **jediný zápis** sa používa na spätnú väzbu (aby nevznikali viaceré verzie);
- **zoznam adresátov** zápisu + kto ho posiela; myslieť na **praktika a iných odosielajúcich**; **zápis z MDO sa posiela praktikovi do 2 pracovných dní**.
- Tieto pravidlá vznikli z projektu **MDO 2.0** a "Generieke blauwdruk MDO" (Citrien, Radboudumc) [V: SONCOS 12, poznámka 2].
- Pri zriedkavých nádoroch MDO **určí, kto koho kontaktuje**, a zabezpečí odovzdanie informácií [V: SONCOS 14].

### 5.2 Zloženie (príklady) [V: SONCOS 14]
- **Pankreas (týždenne):** chirurg, gastroenterológ (MDL), internista-onkológ, rádiológ, radiačný onkológ, patológ, **case manager a/alebo onkologická sestra a/alebo VS**; + možnosť týždennej konzultácie referenčného centra.
- **Pľúca (týždenne):** pneumológ, chirurg, radiačný onkológ, rádiológ/nukleárny medik, patológ, **case manager/sestra/VS**.

### 5.3 Realita
- MDO je podľa OECD "štandardná súčasť liečby"; nemocnice zverejňujú frekvenciu a zloženie MDO [V: OECD/EK 2025, s. 21].
- **Záťaž:** počet MDO aj pacientov na MDO rastie; Radboudumc mal **23 MDO**, jedno trvá **1-1,5 hodiny**; predseda SONCOS (2021): "podmienky pre efektívnu organizáciu MDO zatiaľ chýbajú" [S: oncologie.nu 30. 7. 2021]. Preto MDO 2.0 a **stupňovanie MDO** (miestne / regionálne / národné podľa zložitosti) [S].
- **Celoštátne skutočné percento pacientov prerokovaných na MDO** som nenašiel [?].
- Česko: MDT pokrytie ~60 % nových pacientov so solídnym nádorom [V: OECD ČR 2025 podľa `raw-cz-system.md`].

---

## 6. Ako tečú informácie

### 6.1 Praktik -> nemocnica (žiadanka)
- Holandský praktik (huisarts) je vstupná brána k špecialistovi [odhad, všeobecne známe; v primárnom zdroji som to neoveroval [?]].
- **ZorgDomein:** v roku 2018 ho používalo **91 % praktikov**, 55 000 zdravotníkov, **12+ miliónov** žiadaniek, objednávok diagnostiky, telekonzultácií a správ ročne; 2 milióny pacientov sa ročne prihlásia [S: prezentácia ZorgDomein 16. 5. 2019 na datavoorgezondheid.nl, dnes 404]. Novšie čísla [?].
- **eHealth-monitor 2017 (Nictiz/Nivel):** z praktikov, ktorí to považujú za potrebné, vedelo **100 %** poslať elektronickú žiadanku k špecialistovi (2014: 91 %), ale len **64 %** vedelo poslať k nej **dodatočné informácie** (napr. výsledky predchádzajúcich vyšetrení) a **62 %** aktuálny zoznam liekov [V: Nictiz eHealth-monitor 2017, tab. 7.13].
- Rýchla diagnostika: rozhovor do 48 h od žiadanky v niektorých nemocniciach [V: OECD/EK 2025].

### 6.2 Snímky
- **Do roku 2020 sa snímky v Holandsku medzi nemocnicami posielali hlavne na DVD.** Potom projekt "DVD exit" a portál **Twiin**: v roku 2022 bolo pripojených **75 nemocníc + 20 ďalších poskytovateľov**, cez portál išlo takmer **100 000 snímok mesačne**; pacient môže snímky stiahnuť cez odkaz a kód [V: NVvR, https://radiologen.nl/ecr2022-twiin]. Konečný cieľ Twiin: snímky a správy **na časovej osi** (zatiaľ nie) [V].
- Regionálne siete XDS existovali skôr: napr. XDS-Noord Nederland (11 nemocníc, ~200 000 pacientov ročne, od 2009) [V: Computable 1. 3. 2019].
- **Zákon Wegiz:** "beeldbeschikbaarheid" (dostupnosť snímok) je medzi prioritami, ale v Kamerbrief z **18. 12. 2024** má **dátum AMvB "n.t.b." (ešte neurčený)** [V: Kamerstuk 27529 nr. 328]. Novší stav [?].
- eHealth-monitor 2017: len **24 %** praktikov vedelo elektronicky prijať **samotné snímky**, ale **99 %** správu z rádiológie [V: tab. 7.16].

### 6.3 Patológia, register
- Patológia: národná databanka **Palga**; je jedným zo zdrojov, z ktorých IKNL zisťuje nové prípady (spolu s nemocničnými registráciami DHD a hematologickými laboratóriami) [V: https://iknl.nl/nkr].
- **NKR:** celoštátne od **1989**; údaje zbierajú **vyškolení dátoví manažéri IKNL priamo v nemocniciach** zo zdravotnej dokumentácie; bez individuálneho súhlasu (verejný záujem, výskum, štatistika) [V: iknl.nl/nkr]. OECD: Holandsko patrí ku krajinám s najaktuálnejšími údajmi (predbežné údaje 2023 už začiatkom 2024) [V: OECD/EK 2025, s. 7].
- **DICA** audity (DLCA pre pľúca, DPCA pre pankreas, DSCA pre hrubé črevo) sú **povinné** pre nemocnice, ktoré danú rakovinu liečia [V: SONCOS 14]. V roku 2022 IKNL a DICA podpísali dohodu o efektívnejšom zbere údajov počas celej cesty pacienta [V: OECD/EK 2025, s. 21].

### 6.4 Nemocnica -> praktik
- **Zápis z MDO do 2 pracovných dní praktikovi** (norma SONCOS, vyššie) [V].
- **eHealth-monitor 2017:** **98 %** praktikov vedelo elektronicky prijať prepúšťaciu správu; **77 %** špecialistov vedelo elektronicky poslať prepúšťaciu správu praktikovi [V: tab. 7.16, 7.20].
- Ako praktici vnímali informácie po návšteve pacienta v nemocnici (2017): **včas "pravidelne" 80 %, "vždy" 4 %, "niekedy" 16 %**; **úplné "pravidelne" 85 %, "vždy" 8 %** [V: tab. 7.17]. Teda ani v Holandsku informácia nepríde "vždy" včas [náš výpočet: len 4 % "vždy"].
- Pri paliatívnej starostlivosti SONCOS vyžaduje koordináciu s praktikom [V: SONCOS 14].

### 6.5 Národné služby a zákony
- **LSP (Landelijk Schakelpunt):** nie je centrálne úložisko, len odkazuje na údaje u praktika/lekárne; potrebný **súhlas pacienta (opt-in)**. Pripojených: **4 859 praktických ambulancií, 1 828 lekární, 71 nemocníc, 51 pohotovostí praktikov** (stránka 2026, bez dátumu počtov). Cez LSP idú hlavne údaje pre zastupujúceho praktika, lieky, urgentné zhrnutia, **Basisgegevensset Zorg (BgZ)** [V: https://www.aorta-lsp.nl/]. Počet pacientov so súhlasom: staršie údaje ~11 mil. [S, bez dátumu] -> [?].
- **Wegiz** (zákon o elektronickej výmene údajov) účinný od **1. 7. 2023**; každá výmena sa zavádza osobitným nariadením (AMvB) [S: Staatsblad 2023, 135]. Plán z **18. 12. 2024**: **BgZ (základná sada údajov) a eOverdracht (sesterské odovzdanie) od 1. 1. 2027**, **snímky: termín neurčený**, akútna starostlivosť: neurčený [V: Kamerstuk 27529 nr. 328]. Infraštruktúra "Landelijk Dekkend Netwerk" je podmienkou, ale termín nie je [V].
- **Pacient:** od **1. 7. 2020** má zákonné právo na **elektronický prístup** k dokumentácii a bezplatnú elektronickú kópiu (Wabvpz čl. 15d); nemocnice zaviedli portály s podporou programu VIPP [S: Dirkzwager; Nictiz]. Percento pacientov, ktorí portál používajú: [?].

### 6.6 Zhrnutie toku [odhad]
| Krok | Holandsko | Poznámka |
|---|---|---|
| Praktik -> nemocnica | elektronicky (ZorgDomein), prílohy nie vždy | 2017: 64 % vedelo pridať výsledky |
| Snímky medzi nemocnicami | Twiin push portál od ~2020 | do 2020 DVD; zákonná povinnosť bez termínu |
| Podklady na MDO | dohoda v sieti o "minimálnych informáciách", prednostne digitálne | norma od 2022/2024 |
| MDO -> praktik | 1 zápis v EPD, do 2 pracovných dní | norma SONCOS |
| Prepúšťacia správa | elektronicky (98 % praktikov vie prijať) | 2017 |
| Pacient | portál, zákonné právo od 7/2020 | |
| Register | NKR dátoví manažéri v každej nemocnici | od 1989 |

---

## 7. Výsledky (prežitie, úmrtnosť)

### 7.1 Národné dáta (IKNL / NKR)
- **5-ročné relatívne prežitie všetkých rakovín:** **53 %** (diagnóza 1995-2004) -> **62 %** (2005-2014) -> **67 %** (2015-2022) [V: OECD/EK 2025, s. 20, obr. 14, zdroj IKNL 2024].
| Rakovina | 1995-2004 | 2015-2022 |
|---|---|---|
| Pľúca | 12 % | **26 %** |
| Hrubé črevo | 56 % | **70 %** |
| Prsník | 82 % | 89 % |
| Prostata | 80 % | 89 % |
| Krčok maternice | 65 % | 70 % |
- **Novšie (IKNL, 30. 6. 2026):** 5-ročné prežitie **70 %** pre rakoviny so štádiom, **71 %** všetky (údaje 2020-2024); **pankreas pod 10 %** [S: ANP / Hart van Nederland, https://www.hartvannederland.nl/milieu-gezondheid/zorg/artikelen/overlevingskans-kanker-neemt-verder-toe-vooral-latere-stadia]. IKNL správa 7/2024: **68 %** (2018-2022) [S: NOS 15. 7. 2024]. Pozor: IKNL teraz počíta prežitie aj z 3-ročného sledovania, čísla sa môžu ešte mierne znížiť [S: NOS].
- **Pankreas:** PACAP-1: **1-ročné prežitie 23-24 %** (2018-2020) [V].
- **Incidencia:** 130 000 nových diagnóz v 2024; 45 600 úmrtí na rakovinu v 2023 (27 % všetkých úmrtí) [V: iknl.nl/nkr]. Holandsko má **3. najvyššiu incidenciu v EÚ**: muži 710, ženy 589 na 100 000 (EÚ 684 a 488; odhad ECIS 2022) [V: OECD/EK 2025].

### 7.2 Medzinárodné porovnanie
**CONCORD-3** (Allemani a kol., Lancet 2018, tab. 5; 5-ročné čisté prežitie, vekovo štandardizované; NL aj CZ majú 100 % pokrytie populácie) [V: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/]:
| Diagnóza 2010-2014 | **Holandsko** | **Česko** | Dánsko | rozdiel NL - CZ [náš výpočet] |
|---|---|---|---|---|
| Hrubé črevo | **63,1 %** | 56,1 % | 61,6 % | +7,0 p. b. |
| Konečník | **65,3 %** | 52,3 % | 64,8 % | +13,0 p. b. |
| Pankreas | **7,4 %** | 6,1 % | 8,0 % | +1,3 p. b. |
| Pľúca | **17,3 %** | 10,6 % | 16,6 % | +6,7 p. b. |
| Prsník | **86,6 %** | 81,4 % | 86,1 % | +5,2 p. b. |
- **Trend NL** (2000-04 -> 2010-14): pľúca 12,4 -> **17,3**; pankreas 3,7 -> **7,4**; hrubé črevo 58,1 -> **63,1**; konečník 58,0 -> **65,3** [V].
- **Trend CZ:** pľúca 8,6 -> 10,6; pankreas 3,6 -> 6,1; hrubé črevo 48,0 -> 56,1 [V].
- Nórsko pre porovnanie (z `raw-krajina-no.md`): pľúca 19,0 %, pankreas 9,5 %, hrubé črevo 66,7 % - **Nórsko je o niečo lepšie než Holandsko** [V].
- **ICBP SURVMARK-2:** Holandsko v ňom **nie je** [V: zoznam krajín v Norway súbore].
- **EUROCARE-6** prežitie pre NL som nenašiel [?] (OECD cituje EUROCARE-6 len pre prevalenciu).

**Úmrtnosť (OECD/EK 2025, 2021, na 100 000)** [V: s. 4]:
- Holandsko **256**, EÚ **235**, Česko **257** [Česko: OECD ČR 2025 podľa `raw-cz-system.md` a `raw-krajina-no.md`].
- Pokles 2011-2021 o **14,7 %** (jeden z najväčších v EÚ); muži -19 %, ženy -12 %.
- Rakovina pľúc u žien: **48/100 000**, o **63 % nad priemerom EÚ** (následky fajčenia).
- Potenciálne stratené roky života (PYLL): **1 180/100 000**, o **13 % menej než EÚ** (1 355); pokles o 25 % od 2012 [V].
- **[odhad]:** Holandsko lepšie prežíva (vyššie % prežitia), ale **má viac prípadov** (fajčenie v minulosti, starnutie), preto je **celková úmrtnosť takmer rovnaká ako v Česku**. Kvalitu systému preto treba posudzovať cez prežitie a PYLL, nie cez hrubú úmrtnosť.

### 7.3 Je zlepšenie zásluhou systému?
- OECD to pripisuje "čiastočne" **koncentrácii služieb, MDT a silným sieťam** [V: OECD/EK 2025, s. 3 a 21] - to je však hodnotenie, nie dôkaz príčiny [odhad].
- **Rýchlosť sama o sebe nestačí:** v pokročilých pľúcach rýchlejší štart nezlepšil prežitie (Klarenbeek 2023) a v pankrease celoštátne zavedenie best practices nezlepšilo 1-ročné prežitie (PACAP-1) [V].

---

## 8. Čo funguje a čo nie (pre Bruna a Maťa)

**Čo funguje:**
1. **Jeden národný zoznam minimálnych noriem (SONCOS)**, ktorý sa každý rok aktualizuje a nemocnica bez jeho splnenia danú rakovinu nelieči [V].
2. **Povinné a verejné indikátory** (register Zorginstituut, OmniQ), vrátane otázky "má každý pacient VAP?" [V].
3. **VAP / casemanager pre každého pacienta** ako norma; sestra je aj na MDT [V].
4. **Presné pravidlá pre MDO a informačný tok:** minimálne podklady, digitálne dodanie, 1 zápis v EPD, **zápis praktikovi do 2 pracovných dní** [V].
5. **Koncentrácia** (pankreas 50 resekcií, 150 pacientov na MDO; pľúca 60 resekcií) [V].
6. **Silný register (NKR) a audity (DICA)**: dátoví manažéri v každej nemocnici, údaje od 1989, aktuálnosť [V].
7. **Elektronická žiadanka od praktika je bežná** (ZorgDomein, 91 % praktikov 2018) [S].
8. **Výsledky:** prežitie 67-71 %, pľúca 26 %, výrazne lepšie ako Česko v CONCORD-3 [V].

**Čo nefunguje (aj v Holandsku):**
1. **Lehoty nie sú zákonné ani celoštátne merané**; pri skorých pľúcach medián **46-47 dní**, do 33 dní len ~**24 %** pacientov [V].
2. **VAP chýba štvrtine pacientov** (2018) a po liečbe často zmizne [S].
3. **Snímky sa do roku 2020 posielali na DVD**; zákonná povinnosť výmeny snímok ešte nemá termín (12/2024) [V].
4. **Prílohy k žiadankám** (výsledky, lieky) nie sú samozrejmosťou (64 %, 62 % v 2017) [V].
5. **MDO je preťažené** (rastúci počet pacientov, 1-1,5 h na stretnutie) [S].
6. **Informácie praktikovi prichádzajú "vždy včas" len podľa 4 % praktikov** (2017) [V].
7. **Nedostatok** praktikov a onkologických sestier; menej lekárov na pacienta ako priemer EÚ [V].
8. **Pankreas:** napriek celoštátnemu projektu sa 1-ročné prežitie nezlepšilo; väčšina pacientov nedostane liečbu nádoru [V].

---

## 9. Čo si z toho vziať pre VZP výzvu [odhad]

- **Ukradnúť (najmä):**
  1. **Pravidlo "1 zápis z MDO, uložený v zázname, do 2 pracovných dní praktikovi"** - presne rieši našu stratu informácií po konzíliu; dá sa merať (čas od MDO po doručenie).
  2. **"Minimálne podklady pre MDO" dohodnuté vopred a dodané digitálne** - náš checklist úplnosti pred konzíliom.
  3. **VAP pre každého pacienta s menom v zázname** (nie len "1 koordinátor na centrum") + VAP prítomný na MDO.
  4. **Pri presune medzi nemocnicami jasné kontaktné miesto** a "+3 týždne" ako explicitná tolerancia.
  5. **Verejný indikátor "má pacient VAP?"** a ďalšie povinné indikátory.
- **Poučiť sa z chýb:**
  1. Normy bez **merania času v reálnom čase** nestačia: Holandsko ani dnes nevie celoštátne povedať, koľko % pacientov je v lehote.
  2. Aj bohatá krajina mala **DVD so snímkami do roku 2020**; technický prechod trvá roky, preto je dôležité začať jednoduchým odkazom na dokument, nie centrálnym úložiskom.
  3. Prieskum medzi pacientmi (NFK) odhalil, že **norma na papieri ≠ skúsenosť pacienta** (25 % bez VAP).
- **Medzera, ktorú nikto nerieši úplne:** dôkaz, že **praktik zápis z MDO naozaj dostal a prečítal**, a sledovanie, **ktorý podklad pred MDO chýba**. SONCOS to predpisuje, ale nemeria [odhad].

---

## 10. Čo som nevedel overiť [?]

1. **Celoštátne percento pacientov liečených v lehote SONCOS** (1/3/6 týždňov) - nenašiel som; IKNL podľa všetkého nezverejňuje ročný ukazovateľ ako Nórsko.
2. Celoštátne **percento pacientov prerokovaných na MDO** (norma 90 %) a novšie percento pacientov s **VAP** po roku 2018.
3. **Počet VAP/casemanagerov** a spôsob ich **financovania**.
4. Aktuálne čísla **ZorgDomein** (po 2019) a **LSP** (počet súhlasov).
5. Novší stav **Wegiz** po 12/2024 (najmä termín pre snímky a BgZ).
6. **EUROCARE-6** prežitie pre NL a CZ; presné IKNL čísla pre pankreas a pľúca 2020-2024 (mám len "pankreas pod 10 %" z agentúrnej správy).
7. Rok údajov v prezentácii DLCA (62 % / 46 % / 59 %).
8. Ktoré EPD systémy používajú holandské nemocnice a akým podielom.
9. Počet pankreatických centier po zavedení normy 50 resekcií (v PACAP-1 2018-2020 ich bolo 17 sietí).
10. **Limit webového vyhľadávania sa minul** počas práce; body 1-9 sa dajú doplniť v ďalšom kole (napr. iknl.nl, dica.nl, nictiz.nl, rivm.nl e-healthmonitor).

---

## 11. Zdroje (URL a rok)

**Normy a indikátory**
- SONCOS normeringsrapport 14 (2026): https://demedischspecialist.nl/sites/default/files/2026-02/soncos_normeringsrapport_versie_14_2026.pdf
- SONCOS - zmeny v14 oproti v13 (2026): https://demedischspecialist.nl/sites/default/files/2026-02/soncos_normeringrapport_versie_14_2026_wijzigingen.pdf
- SONCOS normeringsrapport 13 (2025) (len odkaz, nečítal som): https://demedischspecialist.nl/sites/default/files/2025-02/soncos_normeringsrapport_versie_13_2025.pdf
- SONCOS normeringsrapport 12 (2024): https://www.nvog.nl/wp-content/uploads/2024/02/SONCOS-normeringsrapport-versie-12-2024.pdf
- Prehľad SONCOS: https://demedischspecialist.nl/normeringsrapport-van-soncos
- Indicatorengids Oncologie - SONCOS, verslagjaar 2026, v3 (11/2025): https://www.zorginzicht.nl/static/prozin_bijlage/a8c0d31c-2cdf-4eee-81b0-7dcdffd42008-indicatorengids-oncologie---soncos-verslagjaar-2026.pdf
- Indicatorengids Oncologie - SONCOS, verslagjaar 2025: https://zorginzicht.nl/binaries/content/assets/zorginzicht/kwaliteitsinstrumenten/indicatorengids-oncologie---soncos-verslagjaar-2025.pdf
- Smernica NSCLC, modul lehoty (18. 9. 2025): https://richtlijnendatabase.nl/richtlijn/niet_kleincellig_longcarcinoom/organisatie_van_zorg/maximaal_aanvaardbare_wachttijden.html
- IKNL: Definitie en taakomschrijving VAP Oncologie buiten de muren van het ziekenhuis (16. 4. 2025): https://iknl.nl/getmedia/a397e44d-644e-49b8-a2ad-3b9624593b27/Definitie-taakomschrijving-VAP-oncologie.pdf

**Medzinárodné a národné štatistiky**
- OECD/EK: EU Country Cancer Profile Netherlands 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-nl-2024-1678-en.pdf
- CONCORD-3, Allemani a kol., Lancet 2018: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/
- IKNL: Nederlandse Kankerregistratie (2026): https://iknl.nl/nkr
- IKNL: hlava-krk správa (18. 10. 2024): https://iknl.nl/nieuws/2024/rapport-unieke-kenmerken-kanker-hoofd-halsgebied
- NOS: prežitie 68 % (15. 7. 2024): https://nos.nl/l/2528933
- ANP / Hart van Nederland: prežitie 70/71 %, pankreas < 10 % (30. 6. 2026): https://www.hartvannederland.nl/milieu-gezondheid/zorg/artikelen/overlevingskans-kanker-neemt-verder-toe-vooral-latere-stadia

**Vedecké štúdie**
- Klarenbeek a kol., Transl Lung Cancer Res 2023 (štádium I-II, 2014-2019): https://pmc.ncbi.nlm.nih.gov/articles/PMC10654436/ (doi 10.21037/tlcr-23-256)
- Klarenbeek a kol., Thorax 2023 (štádium III-IV, 2014-2019): doi 10.1136/thoraxjnl-2021-218059, PMID 35450944
- van de Ven a kol., Lung Cancer 2019 (štádium III-IV, 2016): https://pure.eur.nl/en/publications/variation-in-the-time-to-treatment-for-stage-iii-and-iv-non-small/ (doi 10.1016/j.lungcan.2019.05.023)
- Steen a kol., BJS Open 2020 (MDO -> pankreatoduodenektómia): doi 10.1002/bjs5.50319, PMID 32841533
- Mackay a kol., JAMA Surgery 2024 (PACAP-1): doi 10.1001/jamasurg.2023.7872, PMID 38353966
- Adjuvantná chemoterapia pri pankrease, NKR 2008-2013 [S]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5083735/
- Sieťová liečba pankreasu a načasovanie chemoterapie [S]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10165062/

**Audit, koordinácia, MDO (sekundárne)**
- DLCA prezentácia, European Cancer Organisation: https://europeancancer.org/content/lung-cancer-dutch-audit
- NFK prieskum VAP, Oncologie Up-to-date (1. 8. 2018): https://www.oncologie.nu/nieuws/een-vast-aanspreekpunt-zeer-gewenst-nog-onvoldoende-geregeld/
- Blauwdruk optimaal MDO, Oncologie Up-to-date (30. 7. 2021): https://www.oncologie.nu/nieuws/blauwdruk-optimaal-mdo-trekt-aandacht-van-soncos/

**Výmena údajov**
- Nictiz/Nivel eHealth-monitor 2017, tabuľky: https://nivel.nl/sites/default/files/bestanden/Nictiz_eHealth_monitor_2017_tabellen.pdf
- AORTA-LSP (VZVZ, 2026): https://www.aorta-lsp.nl/
- Kamerbrief Wegiz, Kamerstuk 27529 nr. 328 (18. 12. 2024): https://zoek.officielebekendmakingen.nl/kst-27529-328.html
- Wegiz účinnosť 1. 7. 2023, Staatsblad 2023, 135 [S]: https://zoek.officielebekendmakingen.nl/stb-2023-135.html
- Twiin, NVvR (2022): https://radiologen.nl/ecr2022-twiin
- XDS-Noord Nederland, Computable (1. 3. 2019): https://www.computable.nl/?p=160893
- ZorgDomein prezentácia (16. 5. 2019) [S, dnes 404]: https://datavoorgezondheid.nl/binaries/datavoorgezondheid/documenten/publicaties/2019/05/16/presentaties-leveranciers-16-mei-2019/190516.01_Pitch_Zorgdomein.pdf
- Elektronický prístup pacienta od 1. 7. 2020, Dirkzwager [S]: https://www.dirkzwager.nl/kennis/artikelen/per-1-juli-2020-nieuwe-rechten-en-verplichtingen-met-betrekking-tot-het-elektronisch-patientendossier

**Interné súbory (pre porovnanie s ČR)**
- `raw-cz-system.md` (koordinátor od 1/2026, MDT ~60 %, pľúca > 60 % nad 8 týždňov, úmrtnosť 257,6)
- `raw-krajina-no.md` (CONCORD-3 tabuľka pre NO, CZ, DK, SE)
