# 02 – Prehack day: dopoludňajšie prednášky (15. 10. 2026)

**Zdroj:** Wispr Flow meeting `daf0bc51-1a8f-49e7-98e4-c5e62f3a7d77` – „Oncology Clinical Trajectory and Screening“, Zoom, cca 9:44–12:07 (SELČ). Prečítaný celý prepis (~105 tis. znakov) + automatické zhrnutie.
**Poznámka k prepisu:** moderátor je v prepise označený ako „Speaker 3“; podľa kontextu ide pravdepodobne o **Tomáša Studeníka** (organizátor, Aleš aj Šárka ho oslovujú menom). Pozor: v tretej prednáške je ako „Speaker 3“ označený aj **Hynek Kružík**, takže jeho slová a moderátorove sa v prepise miešajú. Rozlišoval som podľa obsahu.

---

## Prehľad rečníkov

| Rečník | Organizácia / rola (podľa prepisu) | Téma |
|---|---|---|
| **Aleš Tichopad** | ČVUT (analyzujú klinické trajektórie), na fakulte školia koordinátorov onko-pacientov; spomína aj prácu pre ministerstvo na doporučených postupoch | Cesta onkologického pacienta, skríning, koordinácia starostlivosti, KOC vs. ROC |
| **Šárka Fajtlová** | Národní onkologické centrum (NOC) Brno | Otázka z publika: bezpečná výmena citlivých dát medzi inštitúciami |
| **Michal Opatřil** | 23 rokov v obore, 15 rokov implementoval NISy; „Umbrella tým“ (založil so ženou), externý expert pre MZ ČR; spoluautor novely zákona 325 | „České eHealth v kostce“ – ekosystém, legislatíva, štandardy, čo nestavať |
| **Hynek Kružík** | Externý expert Národního centra elektronického zdravotnictví (NCEZ) pre interoperabilitu, správa terminologického servera, technický líder HL7 ČR a jej zástupca v HL7 Europe; spolutvorca EHDS / EHRxF štandardov | HL7 FHIR a európsky **Common Cancer Model** |
| **Moderátor („Speaker 3“)** | organizátor Rakathonu | logistika, Q&A |

---

## 1. Aleš Tichopad – cesta onkologického pacienta a koordinácia

### Biológia a prečo záleží na čase
- Rakovina nevzniká zo dňa na deň – roky sa vyvíja cez **prekancerózy** (hyperplázia, karcinóm in situ, polypy/adenómy v hrubom čreve, Barrettov segment, podozrivé znamienka / melanóm).
- Nádor nie je homogénny: **klony medzi sebou súťažia**, liečba (napr. chemoterapia) môže uvoľniť priestor rezistentnejším, agresívnejším klonom. Nádor dnes už nie je ten istý ako pred rokom → **boj o čas**.
- Riziko rastie s vekom; pacienti sú často **70+**, kognitívne krehkí, nie každý vie ovládať smartfón. Výnimka: napr. ženy s karcinómom prsníka okolo 40 (aktívne pacientske organizácie). Pacienti s karcinómom pankreasu alebo pľúc sa do koordinovaného systému zapájajú ťažšie.
- Karcinóm hrubého čreva je v ČR častý (prevalencia podľa neho klesá); najvyššia v regióne je vraj v Maďarsku; súvis so životným štýlom a stravou.

### Skríning
- „Cesta pacienta často začína skríningom a skríningovým nálezom.“
- Problém: skríning nie je dostatočne **systematizovaný**; je obrovský priestor pre systémy, ktoré ho budú riadiť, sledovať, optimalizovať a informovať pacienta.
- Skríning musí prebiehať pravidelne (u žien podľa neho raz za 1–2 roky) → pacientky potrebujú koordinačnú pomoc, „zmysluplné aplikácie, ktoré vedú a sledujú“.
- **Kvázinálezy / hraničné suspektné nálezy**: centrum si nie je isté, či pacienta ďalej riešiť, a odloží to na budúci rok.
- **Compliance**: skríning je nepríjemný (napr. endoskopia pri Barrettovi), treba riešenia, ktoré zvýšia, že pacient na skríning reálne príde.

### Patient pathway vs. patient journey
- **Klinická trajektória (patient pathway)** = sekvencia diskrétnych udalostí v zdravotníckom prostredí, z vykázanej starostlivosti (poisťovne) alebo z NIS. Niektoré udalosti sú **míľniky**, iné irelevantné (zubár, očné).
- **Pacientska skúsenosť (patient journey)** = širšie, sociálno-ekonomické a osobné: rodina, úrady, doprava na vyšetrenie a pod.

### Fázy cesty a kde to škrípe
1. **Prediagnostické uvedomenie** – príznaky; niekto rieši hneď, niekto popiera a príde neskoro.
2. **Vstup do systému, diferenciálna diagnostika** – suspekcia; tu sa dá vyhrať najviac času. Potvrdenie histopatologicky.
3. **Terapeutické rozhodnutie – multidisciplinárny tým (MDT)** – chirurg, onkológ, radiológ; pacient má na MDT nárok. Realita: „MDT“ často znamená telefonát dvoch lekárov. MDT má byť právny akt so zápisom; chýba tracking. Pre výrobcov drahých liekov je kvalitný MDT dôležitý, lebo tam sa rozhoduje o liečbe.
4. **Liečba a bariéry** – pacient nepríde / nemôže prísť, nie je termín, špecializované centrum zavalené (čakanie aj pol roka → posun zo štádia 1 do 3). **Kapacity centier nie sú riadené celosystémovo**: pacient by aj šiel na druhý koniec republiky, ale nevie, že tam je miesto.
5. **Perzistencia, adherencia, outcome**; recidíva → restaging (cyklus); následná starostlivosť, kúpele, kontroly; život po rakovine (vyššie riziko ďalšieho nádoru).

### Fragmentácia v praxi
- Histologické laboratórium môže byť inde než pracovisko, kde vzorku odobrali → **cestuje pacient aj kus jeho tkaniva**; vzorky sa strácajú, nevie sa, kde je výsledok.
- Osobná skúsenosť: preventívne CT na CD sa stratilo.
- Výsledky chodia poštou; „zdravotníctvo nemáme digitalizované“.

### Čísla a dáta (z ich analýz trajektórií)
- **40 % pacientov s karcinómom pľúc čaká na operáciu viac ako 8 týždňov.** Karcinóm pľúc je „zabijak číslo jedna“.
- Pacienti často absolvujú **2., 3. aj 4. bronchoskopiu** namiesto jednej (nekvalitné výkony, malé centrá, ktoré si kúpili bronchoskop) → argument pre **centralizáciu kľúčových výkonov**.
- Obrovská **heterogenita medzi nemocnicami**: početnosť bronchoskopie, MDT, začatia liečby (SX chirurgia, PHT farmakoterapia, RT rádioterapia). Mnohí nemajú MDT ani vykázaný.
- Sledujú aj, či prebehlo **PD-L1 / mutačné testovanie** pred voľbou liečby.
- Odkaz na metaanalýzu (Hanna et al., 2020): oneskorenie liečby zvyšuje mortalitu.
- Najväčší zmätok a potreba koordinácie je v **ranej fáze** (podozrenie → diagnóza → začiatok liečby).

### Koordinácia ako softvérový proces (jeho slide)
- **Úloha** → **vlastník** (konkrétna osoba; dnes často chýba, robí to koordinátor) → **odborne určená lehota** → **potvrdenie prevzatia** (odoslaná žiadanka ≠ objednané ≠ vykonané vyšetrenie) → **výnimka a eskalácia** (chýba výsledok, odmietnutie, pacient neprišiel → úloha pre koordinátora).
- Pacient by mal rozumieť, čo ho čaká, kde, prečo – dnes často nerozumie ani názvu odbornosti, kam ho posielajú. Lekári sú preťažení.
- **Koordinátor často nie je lekár** („nekvalifikovaný nelekár“) → systém by mal mať proces/algoritmus „v pozadí“ a navádzať ho.
- **Digitalizácia doporučených postupov** (guidelines, napr. algoritmus pre karcinóm pľúc) – firmy majú záujem ich čo najskôr previesť do digitálnych návodných postupov; mali by sedieť v NIS a navádzať lekára.

### KOC vs. ROC – alokácia
- Najväčšia dilema dneška: ktoré kroky robiť v **KOC** (komplexné onkologické centrum) a ktoré v **ROC** / periférii.
- Testujú **reinforcement learning**, ktorý pre každý míľnik vyhodnocuje, kde pacient viac benefituje; vyjde článok. Hľadajú silných partnerov: „velmi rád bych, kdyby někdo jako opravdu silnej se s náma spojil.“
- Cieľ: vracať dobre zaliečených pacientov z KOC späť do regiónov, odľahčiť čakárne v Prahe/Brne.
- Princíp sa dá zovšeobecniť: IBD, diabetes, stavy po mŕtvici/infarkte – všade pacienti „blúdia“.

---

## 2. Q&A – Šárka Fajtlová (NOC Brno): výmena citlivých dát
- Za **najpálčivejší problém** označila bezpečné zdieľanie dokumentov a údajov medzi inštitúciami: rôzne NIS, žiadne jednotné cesty, citlivé dáta, kyberbezpečnosť, GDPR, a zároveň jednoduchosť pre lekárov, koordinátorky aj pacientov.
- Centralizácia vďaka ministerstvu naberá obrátky. Dlhodobo očakáva riešenie cez afinitnú doménu, ale „kdyby šlo vymyslet něco takového… budu skákat radostí“.
- **Aleš Tichopad:** koordinačné nástroje treba pripojiť k NIS; pacient dnes lieta s papiermi, často neúplnými. Výmena má ísť cez **HL7 FHIR** až do nástrojov koordinátorov; to je práca NCEZ. OMOP a dátové sklady sú skôr analytické. Riešenie, ktoré by štandardy obišlo, by malo podľa neho nízku akceptáciu.

---

## 3. Michal Opatřil – České eHealth v kostce

### Štyri veci, ktoré si treba zapamätať
Nemusíte byť experti, ale nestavajte riešenie, ktoré „umrie“, lebo nezapadne do ekosystému.

**(1) Kde vznikajú dáta**
- U **poskytovateľov zdravotných služieb** (nemocnice, ambulancie, laboratóriá) v produkčných systémoch: **NIS, AIS, LIS**, integračné platformy, **PACS** (rádiodiagnostika).
- Trh je rozdrobený: najväčší je **STAPRO** (viac generácií NIS); v ambulanciách dominujú **CGM a MEDaX** (spolu cca 70 %). Úspešné riešenie sa raz musí napojiť na tieto systémy.
- **Zdravotnícka dokumentácia** je zákonom taxatívne vymedzená (čo do nej nespadá, sú „zdravotné dáta“). Vedie sa často hybridne (papier + PC).

**(2) Ako sú dáta popísané**
- Nestačí dáta preniesť, druhá strana im musí **porozumieť**: rovnaký protokol + **sémantika/terminológia**.
- Smer odboru: od narratívneho textu k štruktúrovaným dátam.
- **Kľúčová výzva pre hackerov:** vyvážiť štruktúrované a narratívne dáta. Lekári chcú písať voľný text; príliš veľa štruktúrovaných polí ich „ubije“. **AI, ktorá z naratívu vytvorí štruktúrované dáta**, funguje dobre („Pohrajte si s tím“, sám je v takom inkubátore).

**(3) Ako sa k dátam dostaneme** – akreditované afinitné domény, IHE MHD/MHDS (nižšie).

**(4) Ako to zapadne do prevádzky** – pripravované centrálne služby.

### Architektúra
- **Nie je to jedna databáza**, neexistuje centrálny dátový sklad všetkej dokumentácie.
- **EU:** nariadenie **EHDS**; **EEHRxF** (European EHR Exchange Format) ≈ „technická vyhláška k EHDS“ – dobrý kľúčový pojem do promptov. **MyHealth@EU** = európska platforma; **NCPeH** (národný kontaktný bod, sídli na Vysočine).
- **Centrálne služby (vo výstavbe):** eŽádanky, kmenové registre, doplnkové dočasné úložisko.
- **Výmenná vrstva:** akreditované afinitné domény.
- **Koncoví poskytovatelia:** NIS, LIS…
- Dnes existujú navzájom nekompatibilné proprietárne „health share“ siete: **eZpráva, MEDDOX (ICZ), ePACS (ICZ, obrazové dáta), ClinicBox (CGM), STAPRO MISE**. Niektoré sa práve prepájajú; cieľ je všetky zinteroperabilniť.

### Legislatíva (na promptovanie AI)
- **Zákon 372** o zdravotných službách – „alfa omega“.
- **Zákon 325** o elektronizácii zdravotníctva – novela (verzia 2.0) je v medzirezortnom pripomienkovaní.
- **Vyhláška o zdravotníckej dokumentácii** – taxatívne, čo do dokumentácie patrí.
- **EHDS**:
  - **Primárne využitie** – dáta konkrétneho pacienta; **prioritné kategórie (EHR)**: **pacientsky súhrn** („pre vás dosť dôležitá entita“), prepúšťacia správa, laboratórny výsledok, správa zo zobrazovacieho vyšetrenia, správa o výjazde ZZS (Kružík dopĺňa aj ePreskripciu a dispenzáciu). Členské štáty ich zavádzajú podľa roadmapy **2027–2031**.
  - **Sekundárne využitie** – de facto anonymizované dáta pre výskum, inovácie, štatistiku, plánovanie (európsky dátový priestor).
  - Každá kategória má **EHR archetyp** (klinická štruktúra pre človeka + dátová štruktúra vo FHIR).
- **Pozor:** EHR podľa EHDS ≠ česká elektronická zdravotnícka dokumentácia (**EZDok** je viazaná na poskytovateľa, pacient len pasívne nahliada; EHR je širší pojem). Systém, ktorý s EHR pracuje, je „EHR systém“.
- **PDF** = len fallback / ľudsky čitateľná príloha, nie primárny nosič.

### FHIR
- Fast Healthcare Interoperability Resources, štandard HL7; „ak dnes tvoríte niečo moderné, musíte pracovať s FHIR, inak je to nezmyselné proprietárne riešenie.“

### Kmeňové registre (dôležité pre hackathon)
- Tri: **pacientov, zdravotníckych pracovníkov, poskytovateľov zdravotných služieb** – autoritatívne zdroje.
- V nemocniciach sú bežné duplicity/triplicity pacientov s rovnakým rodným číslom.
- **Hint:** „netrávte 3 dni pripájaním na proprietárne rozhranie kmeňových registrov“, ale nechajte si v architektúre **„biele miesto“**: tu overíme pacienta voči autoritatívnemu zdroju cez API. **Nestavajte izolovanú vec s vlastnou databázou pacientov.**

### eŽiadanky – NESTAVAŤ
- Štát stavia centrálny systém eŽiadaniek: prvá vlna konziliárne, FT (fyzioterapia), zobrazovacie žiadanky; neskôr laboratórne. „Ak by sa niekto rozhodol robiť žiadankový systém, nie je to dobrý nápad.“

### Terminológia „zpřístupnit“ vs. „sdílet“
- Zdravotnícku dokumentáciu nemožno „zdieľať“; vždy ju má poskytovateľ (jeho forenzná ochrana). Správne: **„zpřístupnit“**.

### Akreditované afinitné domény (AAD)
- Centrálny „smerovač“, ktorý vie, u ktorého poskytovateľa sú aké dáta. Budujú sa na **5 miestach v ČR**.
- **Nie sú repozitár** – dáta ostávajú u pôvodného poskytovateľa; AAD ich umožní vyhľadať a sprístupniť (routing).
- Riešenie by malo rátať s interoperabilitou a architektonickými princípmi siete AAD.

### IHE MHD (Mobile access to Health Documents)
- Štandardizované API na publikovanie, vyhľadávanie, získavanie dokumentov. Kroky: **publish (ITI-65)** → index → **find (ITI-67)** → retrieve (ITI-68). „Tieto veci nemusíte vynachádzať, zoberte ich a dajte do riešenia.“
- Expertné poznámky: **DocumentReference** nie je dokument ani databáza, ale štandardizované metadáta odkazujúce na obsah. (V prepise: „66 slúži na vyhľadávanie záznamu dokumentu, 67 vyhľadáva jednotlivé referencie“ – pravdepodobne prehodené/ITI-66 = Find List, ITI-67 = Find Document References.)
- **MHDS** je jadro AAD – nový, nie veľmi rozšírený, ale nie exotika; rátajte s ním.
- **IHE ATNA** – audit a bezpečná komunikácia (nerieši oprávnenia); zahrňte, ak sa dá.
- „IHE prosím používajte… zapromptujte AI, aby ho používala.“

### Terminológie podľa Opatřila
- Labáky: **NČLP** (národný číselník laboratórnych položiek); **LOINC v ČR nie je a dlho nebude**.
- **MKN-10** – jediná všeobecne ujatá nomenklatúra.
- **SNOMED CT** – super, ale „málokto ho pozná a takmer nikto nepoužíva“ (okrem rádiodiagnostiky). Ak ho použijete, zvážte AI, ktorá SNOMED kódy generuje z naratívu.
- Rádiológia: **DICOM**.

### Zdroje (rozcestník pre vývojárov)
- **hl7.org/fhir/R4** – základná syntax a interakcie.
- **hl7.cz** (a hl7.cz/fhir) – české implementačné guidy (IG), česká terminológia.
- **profiles.ihe.net** – IHE profily (MHD, MHDS, ATNA…).
- **mzcr.atlassian.net** – **Národný manuál elektronického zdravotníctva**: všetky API vrátane kmeňových registrov („extrémne dôležité“).
- Ďalší odkaz na EHDS a implementačný kalendár (presná URL v prepise nie je – bude v prezentácii na Slacku).

### Cena pre víťazný tým
- **Pondelok 19. 10. 2026, ILF (Institut postgraduálního vzdělávání) Praha** – unikátne technické stretnutie všetkých výrobcov NIS/AIS/LIS, integračných a telemedicínskych platforiem o interoperabilite a českých IG. **Víťazný tým v plnom počte dostane vstupy.** Michal pošle vstupenky, keď sa dozvie víťaza.
- Kontakt: LinkedIn (QR v prezentácii), ochotne konzultuje startupy.

---

## 4. Hynek Kružík – HL7 FHIR a European Common Cancer Model

### HL7 / FHIR v skratke
- HL7 = nezisková organizácia, 30+ rokov štandardov; pracovné skupiny s klinikmi, pacientmi, regulátormi. Licencia otvorená („public good“).
- V2 (hlavne USA, labáky/zariadenia), V3/**CDA** (Európa), teraz prechod na **FHIR**: aktuálne **R4**, niektoré krajiny R5, očakáva sa prechod na **R6** (odhad cca do roka).
- FHIR nerieši len výmenu (resources), ale aj REST rozhrania, operácie na FHIR serveri, terminologické služby, security (podpisovanie bundlov). Dá sa využiť aj na **sekundárne použitie** (analýzy), aj keď tam je zavedenejší **OMOP**.
- **Resource** = stavebný blok (Patient, RelatedPerson, Observation, Composition, Bundle…), skladajú sa ako lego do profilov (prepúšťacia správa, lab žiadanka, lab nález…). Pravidlo **80/20**: 80 % potrieb natívne, zvyšok cez profilovanie a **extensions**.

### ČR a EHDS
- ČR je aktívna v európskej štandardizácii: technické štandardy, funkčné špecifikácie, vykonávacie akty k EHDS (Komisia ich vydá **najneskôr v marci 2027**); ČR spravuje logický informačný model pre EK.
- České IG sú buď odvodené z európskych, alebo deklarujú kompatibilitu – **validátor českých profilov validuje aj proti európskym**.
- Každý systém, ktorý spracúva prioritné EHR kategórie (prepúšťacie správy, labáky vrátane obrazovej informácie, pacientsky súhrn, ePreskripcia, dispenzácia), **musí preukázať EHDS compliance** → FHIR rozhranie a prístup pacientov aj klinikov. „Bič“ na štandardizáciu.

### European Common Cancer Model (HL7 Europe)
- Onkológia nie je v aktuálnych EU IG rozpracovaná do detailu. HL7 Europe spolu s onkologickými asociáciami a pacientskymi organizáciami cca rok pripravuje **common cancer model** ako základ pre profily jednotlivých use-casov: prepúšťacia/prekladová správa, informácie pre care team, histopatológia, súhrn pre care team, sekundárne využitie.
- Hotový je **konceptuálny → logický informačný model** (strojovo spracovateľný); je v **ballotingu** (verejná oponentúra a hlasovanie). Link na model bol na slide (prezentácia príde na Slack).
- Oblasti modelu: pacient, diagnostika, liečebné epizódy, vývoj ochorenia, odpoveď na liečbu, kontroly.
- Príklady: pacient má navyše **pohlavie pri narodení a pohlavie v čase diagnózy** (vs. administrative gender; v labákoch „pohlavie pre interpretáciu nálezu“). **Staging**: TNM klinický vs. patologický; iné klasifikácie pre nesolídne nádory.
- Ďalšie kroky: **mapovanie na FHIR** – zatiaľ namapovaný **len Patient**; klinické časti ešte nie. Potom FHIR profily. **Mapovanie na OMOP** pre sekundárne využitie – zatiaľ len Person + kódové systémy.
- Skladačka: **FHIR R4 core → HL7 EU Base** (jedna definícia pacienta, bindingy) → doménové IG; plus európsky profil **API/metadát cez IHE MHD**; plus **mCODE** (americký onko IG). Očakáva sa kombinácia EU Base + adopcia mCODE profilov; politika (európska suverenita voči USA) môže zasiahnuť.

### Terminológia – odlišný názor než Opatřil
- **SNOMED CT zavádzajú všade, kde sa dá** – všetky nové profily (prepúšťacie správy, labáky: typy vzoriek, techniky, skúmavky, aditíva, substancie), **okrem NČLP kódov**. Dôvod: preferovaná terminológia EÚ, v EHDS sa mu nevyhneme. Kódovať však len tam, kde to prináša pridanú hodnotu; pre strojové spracovanie sa bez kódov nezaobídeme ani v ére LLM.
- **LOINC**: v FHIR preferovaný pre observations; spolupráca Regenstrief–SNOMED: **85 % laboratórnych LOINC kódov** je v LOINC Ontology (extenzia SNOMED CT).

### Odporúčania pre hackathon (Kružík)
- Súťaž vás to „asi veľmi neovplyvní“, ale: **budúce systémy musia podporovať HL7 FHIR rozhranie** → nemá zmysel robiť proprietárne rozhranie.
- **Na DASTU zabudnite** pre nový vývoj (udržiava sa len kvôli existujúcemu).
- Na otázku moderátora „čo je pre quick & dirty prototyp najdôležitejšie“: 1) pozrieť **základné FHIR resources** (stavebné kocky), 2) pozrieť **používané terminologické systémy** – štruktúra a terminológia spolu súvisia; pozor na **prekoordináciu vs. postkoordináciu** (prekoordinované číselníky neobsahujú všetky kombinácie, model má ďalšie elementy).
- (V Q&A zaznelo:) Claude a Codex s dobrým promptom „compliance s EHDS“ to dokážu zachytiť.

### Pozvánky
- **19. 10. – ILF** (stretnutie výrobcov, viď vyššie).
- **16.–20. 11. 2026 – HL7 Workgroup Meeting, Málaga** – celý jeden deň venovaný European Common Cancer Model. HL7 pracovné skupiny sú otvorené aj nečlenom. Kontakt: hl7.cz.

---

## 5. Logistika a organizačné info

- **Dáta pre hackathon / FHIR token na testovacie dáta:** otázka z chatu – odpoveď: rieši sa na **popoludňajších sessions Microsoft a InterSystems** (v týchto prednáškach žiadny dataset ani API kľúč nezaznel).
- **Program popoludnia 15. 10.:**
  - **13:00 – workshop Microsoft** (GitHub Copilot a ďalšie nástroje od Microsoftu) – „aspoň jeden človek z tímu“.
  - **14:30 – workshop InterSystems** („kruciálny“) – veľa dát a ako urobiť hack zapojiteľný do informačného prostredia nemocníc.
  - **15:30 – workshop s Lucom Schattym** (prepis: „Luk Šaty“; francúzsky/európsky expert na FHIR) – napojiteľnosť riešení mimo ČR, v EÚ.
- **Mentori / konzultácie:**
  - **Aleš Tichopad** – v **piatok dopoludnia na raňajkách v Motole** (Praha), pridá sa na Slack, telefón zverejnia pre vzdialenú konzultáciu (účastníci aj z Brna a Ostravy).
  - **Michal Opatřil** – LinkedIn, konzultácie projektov.
  - **Hynek Kružík** – cez hl7.cz, e-mail/telefón.
- **Prezentácie** všetkých rečníkov pôjdu na **Slack** (poslané na info@seehex.com).
- **Vyhlásenie výsledkov: nedeľa.** Moderátor spomína „24 hodín na proof of concept“ a „zajtra… finále“; presný harmonogram tu nezaznel.
- **Cena:** vstupy na ILF event 19. 10. pre víťazný tým (moderátor to zverejní na Slacku).
- **Kritériá hodnotenia ani konkrétne zadania challengov v tejto časti nezazneli.** Implicitne sa opakovalo: interoperabilita (FHIR/IHE), napojiteľnosť do NIS, súlad s EHDS, životaschopnosť po hackathone.

---

## Príležitosti pre nápady

Problémové oblasti, ktoré rečníci zdôrazňovali (zoradené približne podľa dôrazu):

1. **Koordinácia onko-pacienta v ranej fáze (podozrenie → diagnóza → začiatok liečby)** – úlohy, vlastníci, lehoty, potvrdenie prevzatia, eskalácia, keď výsledok chýba alebo pacient neprišiel. Nástroj pre **koordinátora-nelekára** s guidelinom „v pozadí“. Tichopad: „ten pacient si to tak nějak zajišťuje sám“. Dáta: 40 % pľúcnych pacientov čaká na operáciu > 8 týždňov.
2. **Bezpečné sprístupnenie dokumentácie medzi inštitúciami** (Šárka, NOC Brno: „taková fakt jako nejpalčivější věc“) – nad FHIR + IHE MHD/MHDS, s overením pacienta cez kmeňový register, ATNA auditom a súladom s GDPR. Musí byť jednoduché pre lekára, koordinátorku aj pacienta.
3. **Systematizovaný skríning a compliance** – pozvánky, pripomienky, sledovanie intervalov, riešenie **hraničných nálezov** (aby sa „nepočkalo do budúceho roka“), motivácia prísť na nepríjemné vyšetrenie. Tichopad: „obrovský prostor pro vývoj vlastně systémů, které by to řídily“.
4. **Digitálny multidisciplinárny tým (MDT / tumor board)** – príprava podkladov, hybridné stretnutie, záznam rozhodnutia ako právneho aktu, tracking, prípadné zapojenie pacienta.
5. **Kapacity a alokácia KOC vs. ROC** – prehľad voľných kapacít naprieč centrami („on to neví, že je tam místo“), routing pacientov, vracanie zaliečených pacientov do regiónov; Tichopadov tím robí RL a hľadá partnerov.
6. **Digitalizácia doporučených postupov (guidelines) do rozhodovacích algoritmov** v NIS – napr. diagnostický strom karcinómu pľúc, kontrola, či prebehlo PD-L1 / mutačné testovanie pred liečbou.
7. **AI: naratív → štruktúrované dáta** (vrátane kódovania do SNOMED CT / MKN-10, FHIR resources) – Opatřil: „Pohrajte si s tím“; kľúčové je neubiť lekárov formulármi.
8. **Pacientska zrozumiteľnosť a patient journey pre seniorov 70+** – vysvetliť, kam a prečo ide, nezávisle od smartfónu; sociálna pomoc, úrady, doprava.
9. **Sledovanie vzoriek a výsledkov** (tkanivo putuje do iného laboratória, stráca sa, nevie sa, kde je výsledok).
10. **Kvalita a variabilita starostlivosti** – benchmark nemocníc (počet bronchoskopií, prítomnosť MDT, čas do liečby) z dát trajektórií; centralizácia kľúčových výkonov.
11. **Onko dáta podľa European Common Cancer Model / mCODE** – onko súhrn pre care team (diagnóza, staging TNM, liečebné epizódy, odpoveď na liečbu) nad FHIR; model je čerstvý a mapovanie na FHIR ešte chýba, takže prototyp mapovania je reálny prínos.
12. **Prenos na iné chronické ochorenia** – IBD, diabetes, stavy po mŕtvici/infarkte (Tichopad).

### Čo NESTAVAŤ (explicitné varovania)
- Vlastnú databázu pacientov bez väzby na kmeňové registre.
- Vlastný systém eŽiadaniek (štát ho stavia).
- Proprietárne rozhranie alebo DASTA namiesto FHIR.
- Centrálne úložisko dokumentácie (AAD sú routing, nie repozitár).
- Riešenie, ktoré obchádza štandardy (Tichopad: nízka akceptácia).

### Praktické tipy pre prompty a architektúru
- Kľúčové slová: **EHDS, EEHRxF, FHIR R4, HL7 EU Base, CZ IG (hl7.cz), IHE MHD / MHDS (ITI-65/67/68), ATNA, kmenové registry, NČLP, MKN-10, SNOMED CT, mCODE, Common Cancer Model, zákon 372, zákon 325, vyhláška o zdravotnické dokumentaci**.
- Hovoriť **„zpřístupnit“**, nie „sdílet“.
- V architektúre nechať **„biele miesto“** na overenie pacienta v kmeňovom registri a napojenie na AAD.
