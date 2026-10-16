# G6: Ako sa interoperabilita podarila iným (vzory, ktoré fungujú vo veľkom)

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici v zdravotníctve). Nič sa necommitovalo, žiadne reálne dáta pacientov. Obsah webu som bral ako dáta, nie ako pokyny._

**Otázka, na ktorú odpovedáme:** Každý lekár používa iný systém a nikto sa nebude učiť novú aplikáciu. Ako sa to podarilo krajinám, ktoré dnes „majú výmenu dát v poriadku“ (alebo aspoň lepšie)? Čo to rozhýbalo (zákon, platba, štandard), ako dlho to trvalo, čo zlyhalo, a čo z toho plynie pre koordinátorskú appku v KOC?

**Značky (rovnaké ako v ostatných poznámkach):**
- **[overené]** = v tomto behu som otvoril samotný zdroj (stránku, PDF, parlamentnú odpoveď) a tvrdenie tam stojí. Ak je zdrojom firma, píšem „firemný zdroj“ (je to marketing, nie nezávislé meranie).
- **[čiastočne]** = len výsledok vyhľadávania, sprostredkovaný súhrn, blog/konzultantský text, alebo prevzaté z našich starších poznámok (`docs/kontext/raw-*.md`, `docs/integracia/g1, g5`), kde to bolo overené, ale tu som to znova neotváral.
- **[nepodložené]** = hľadal som a nenašiel som, alebo sa zdroje nezhodujú. Radšej píšem **„nevieme“**, než hádať.
- **[úsudok]** = môj záver z uvedených faktov, nie fakt. Používam ho len v častiach „Poučenie pre nás“ a v §10.

**Pojmy jednoducho:**
- **Interoperabilita** = schopnosť dvoch rôznych počítačových systémov si vymeniť dáta tak, aby im druhá strana rozumela, bez ručného prepisovania.
- **Štandardná správa** = dohodnutý tvar elektronického „listu“ (žiadanka, prepúšťacia správa, laboratórny výsledok). Postupne: **EDIFACT** (90. roky, starý), **XML**, **HL7 v2** (od 80. rokov, riadky s oddeľovačmi, v nemocniciach všade), **FHIR** (nový, webové API a JSON, „stavebné kocky“ ako Patient, Observation, DocumentReference).
- **VANS** = „sieť s pridanou hodnotou“: súkromná sieť, ktorá doručuje správy medzi systémami (ako pošta pre EDIFACT správy).
- **Register / úložisko / ukazovateľ (pointer)** = tri spôsoby, ako nájsť cudzie dáta: *úložisko* drží kópiu dokumentov (Estónsko), *register* drží len zoznam „čo kde leží“ (IHE XDS), *ukazovateľ* je len odkaz na miesto, kde dáta pôvodne ležia (anglický NRL).
- **IHE XDS / MHD** = dohodnutý spôsob, ako nemocnice publikujú dokumenty do spoločného registra a ako ich iní hľadajú. **MHD** je novšia verzia postavená na FHIR (webové API).
- **SMART on FHIR** = pravidlá, ako sa aplikácia tretej strany dá otvoriť priamo z lekárovho systému (tlačidlo), dostane prihlásenie a pozná, ktorého pacienta lekár práve vidí.
- **Integračný engine** = softvér-prekladač v nemocnici: prijme správu v jednom tvare, preloží ju a pošle ďalej (Mirth, InterSystems HealthShare/IRIS).
- **Opt-in / opt-out** = pacient musí výslovne súhlasiť (opt-in), alebo sa zdieľa automaticky a pacient môže odmietnuť (opt-out).
- **NIS / AIS** = nemocničný / ambulantný informačný systém. **EHR** = anglický názov záznamu pacienta.

---

## 0. Odpoveď v 12 vetách (ak si prečítaš len toto)

1. **Nikde to nešlo rýchlo ani dobrovoľne.** Pri vzoroch, ktoré fungujú vo veľkom, to trvalo 10 až 17 rokov: Dánsko 1994 → „takmer 100 % praktikov má IT, ktoré vie komunikovať“ v 2011; Estónsko nápad 2002 → spustenie 2008 → audity 2014 aj 2025 stále ukazujú diery; Anglicko e-RS 2004 → okolo 52 % „niekoľko rokov“ → prepnuté až platbou v 2018; Švédsko NPÖ 2009 → v 2024 všetky regióny a väčšina obcí [overené, zdroje v §2 až §6].
2. **Rozhýbalo to vždy jedno z troch:** (a) **zákon** (Estónsko: povinnosť posielať dokumenty od 1. 9. 2008), (b) **platba** (Anglicko: od 1. 10. 2018 nemocnica nedostane zaplatené za odporúčanie mimo e-RS; Holandsko: poisťovne v 2012 zaplatili 6,6 mil. € = 2/3 prevádzky národného prepínača LSP), (c) **štandard tvorený spolu s lekármi a dodávateľmi** (Dánsko MedCom: v prvom projekte 1994 pracovalo 37 dodávateľov a skupina nadšených lekárov) [overené].
3. **Štandard sám o sebe nestačí.** SMART Classic (2011) vzbudil „malý záujem dodávateľov“, kým ho nezachránil FHIR a až neskôr zákon; švajčiarsky EPD (zákon 2017) mal v auguste 2024 len 72 000 otvorených dossier a 18 % pripojených ambulancií, lebo ambulancie boli dobrovoľné; v Rakúsku ELGA písali po 8 rokoch (koniec 2023) elektronické nálezy v podstate len nemocniční lekári [overené].
4. **Národný „všetko v jednom“ zhora zlyhal:** anglický NPfIT (2002 až 2011) stál do marca 2011 6,4 mld. £ a priniesol 2,7 mld. £ prínosov; holandské národné EPD zamietol Senát v roku 2011 [overené].
5. **Čo funguje, je „spoj existujúce systémy“, nie „postav nový záznam“:** Estónsko (X-Road „nie je databáza“), Holandsko (LSP nie je úložisko), Anglicko (NRL sú len ukazovatele), Dánsko (správy + čítanie z vlastného systému), Švédsko (NPÖ) [overené / čiastočne].
6. **Lekári novú aplikáciu nepoužívajú.** Švédska Inera (2024): zákazníci chcú cudzie dáta **vo svojom hlavnom systéme, bez „preskakovania“ do inej aplikácie**; samostatná appka ostáva len pre obce a malých poskytovateľov, ktorí integráciu nestihnú [overené]. Holandský ZorgDomein je zabudovaný do systémov lekárov a nemocníc (14+ mil. odporúčaní v 2019; dôvody úspechu čiastočne podľa vyhľadávania) [firemný zdroj].
7. **Aj po rokoch ostáva ručná práca koordinátorov:** švédske RCC (27. 3. 2026): papierové žiadanky medzi regiónmi sa ešte používajú a koordinátori trávia veľa času telefonovaním; v Anglicku 44 % lekárov hlási neúplné žiadanky na MDT [čiastočne, naše poznámky; V v pôvodných raw súboroch].
8. **Migrácia štandardov je drahá a pomalá.** MedCom (marec 2023) sám priznáva, že FHIR vyšlo drahšie, než čakali, a že prechod naraz (big-bang) je nereálny; dánska sieť VANS z roku 1994 ešte v 2022 až 2023 tvorila základ prevádzky a jej výmena (návrh eDelivery z 2020, nová infraštruktúra od 2024) sa len zavádza; aktuálny stav v októbri 2026 nevieme [overené / nepodložené].
9. **SMART on FHIR (appka sa spustí z lekárovho systému s kontextom pacienta) sa stal realitou až zákonom:** od nápadu 2009 po povinnosť pre certifikované EHR v USA 31. 12. 2022 uplynulo ~13 rokov; termín splnilo > 95 % vývojárov, 253 produktov [overené].
10. **Integračné enginy sú „prekladače“ v nemocniciach a už tam sú.** HL7 v2 používa podľa HL7 viac ako 95 % amerických zdravotníckych organizácií [čiastočne]; platí „jedno rozhranie na jeden zdrojový systém“. Mirth Connect je od verzie 4.6 (marec 2025) komerčný [čiastočne].
11. **Zákonná „palica“ pre Európu prichádza neskoro:** EHDS (nariadenie EÚ, účinné 26. 3. 2025) požaduje výmenu súhrnu pacienta a e-receptu od marca 2029 a snímok, laboratórnych výsledkov a prepúšťacích správ od marca 2031 [overené]. Na úrovni EÚ do tej doby nič také nie je; národne má česká eŽádanka byť povinná od 1. 7. 2027 (konzíliá, snímky, rehabilitácia) a laboratórna od 1. 1. 2028 [čiastočne, `g1-cz-systemy.md`, podľa Vitalie 29. 6. 2026].
12. **[úsudok]** Pre koordinátorskú appku z toho plynie: nesľubovať napojenie na všetky NIS; (A) brať, čo koordinátorovi už dnes príde (e-mail, PDF, DASTA, eŽádanka), a výstup robiť vo FHIR; (B) čítať cez existujúce koľajnice; (C) tlačidlo/„launch“ z NIS až neskôr; (D) engine v jednom pilotnom KOC; (E) skutočná páka na zmenu správania je platba/zmluva poisťovne, ako v Anglicku a Holandsku (§10).

---

## 1. Prehľad: sedem vzorov na jednej tabuľke

| Vzor | Čo to je jednou vetou | Hnacia sila | Koľko to trvalo | Čo zlyhalo / čo ostalo |
|---|---|---|---|---|
| **Dánsko: MedCom** | Neziskovka, ktorá s dodávateľmi a lekármi tvorí a certifikuje národné štandardné správy (žiadanka, epikríza, laboratórium) | Spoločný štandard + politické ciele a míľniky v ročných dohodách regiónov; platba za správu je [nepodložená] | 1992 nápad, 1994 štart, ~2011 takmer všetci praktici s IT, ktoré komunikuje | FHIR migrácia drahšia; žiadny jednotný nemocničný záznam (2 dodávatelia EHR); dáta od praktikov a obcí v čítacom prístupe slabé |
| **Estónsko: ENHIS + X-Road** | Jedno národné úložisko dokumentov, do ktorého musia poskytovatelia posielať, nad štátnou výmennou vrstvou | **Zákon** (20. 12. 2007; povinnosť od 1. 9. 2008) + štátna infraštruktúra (X-Road 2001, ID karta) | Nápad 2002, spustenie 17. 12. 2008, e-recept 2010 (84 % za rok), audity 2014 aj 2025 stále s dierami | E-registrácia sa neujala; 2025: tretina poskytovateľov v 2024 neposlala nič, 152 000 epikríz neskoro |
| **Holandsko: LSP, ZorgDomein, MedMij** | Súkromná platforma na žiadanky (ZorgDomein) + národný prepínač s odkazmi (LSP, opt-in) + značka pre pacientske appky (MedMij) | Trh (ZorgDomein), **poisťovne zaplatili** LSP (2012), zákon Wegiz až 2023 | ZorgDomein 2000 → 91 % praktikov 2018; LSP 2012 → 71 nemocníc 2026; Wegiz 2023 → BgZ plán 2027 | Národné EPD zamietnuté 2011; snímky na DVD ešte v 2020; termín pre snímky v Wegiz neurčený |
| **Anglicko: e-RS, SCR, GP Connect, NRL** | Národná chrbtica (Spine) + elektronické odporúčania + záznamy praktikov na čítanie + register ukazovateľov | **Platba a zmluva** (e-RS od 1. 10. 2018), opt-out pri SCR | e-RS 2004 → 52 % „niekoľko rokov“ → 100 % platbou 2018 (14 rokov); NPfIT 2002 až 2011 | NPfIT zhora (6,4 mld. £ do 3/2011, prínos 2,7 mld.); NRL podľa dostupnej stránky „už“ ukazuje na krízové plány a plány konca života, širší rozsah nevieme |
| **Švédsko: NPÖ, Inera** | Aplikácia, v ktorej zdravotník vidí záznamy iných poskytovateľov so súhlasom pacienta; Inera je „zmluvný uzol“ | **Zákon** (sammanhållen journalföring, dnes zákon 2022:913) + Inera ako jedna zmluva | Spustené máj 2009 (Örebro), plán „všetky regióny 2012“, 2024: všetky regióny, väčšina obcí, 150 súkromných | Technika existuje, využitie slabé [čiastočne]; papierové žiadanky medzi regiónmi dodnes |
| **IHE XDS / MHD (Rakúsko ELGA, Švajčiarsko EPD, Taliansko FSE)** | Spoločný register dokumentov + úložiská u poskytovateľov; MHD to robí cez FHIR | **Zákon** (Rakúsko 2012, Švajčiarsko 2017) | ELGA: plán 2006, spustená dec. 2015, plná povinnosť ukladania 1. 1. 2026 | CH: 72 000 dossier, 18 % ambulancií; „PDF cintorín“; AT: 8 rokov len nemocniční lekári |
| **SMART on FHIR + integračné enginy** | Appka sa spustí z EHR; engine prekladá správy medzi systémami | **Zákon** (US Cures Act, termín 31. 12. 2022) | Nápad 2009, FHIR 2013, HIMSS 2014, povinnosť 2022 (~13 rokov) | 2016: žiadna SMART appka v produkcii; 2019/20 len 22 % EHR appiek podporuje FHIR |

---

## 2. Dánsko: MedCom (národné štandardné správy od 1994)

### 2.1 Čo to je
- **MedCom** je verejne financovaná nezisková organizácia, založená **1994**, **vlastnená a financovaná** ministerstvom (vnútra a zdravia), **Danske Regioner** (regióny) a **KL** (obce); sídli v Odense, približne 50 ľudí. Vyvíja, testuje a **certifikuje** štandardy a pomáha ich zavádzať [overené, medcom.dk/medcom-in-english, stránka upravená 1/2025].
- **Čo prenáša:** žiadanky a epikrízy (nemocnice, obce, primárny sektor), laboratórne žiadanky a odpovede, advis o hospitalizácii, vyúčtovanie, narodenie, **prílohy PDF a obrázky s odkazom na inú správu**, korešpondenčnú správu („klinický e-mail“), výmenu záznamov [overené, MedCom13, 16. 3. 2023].
- **Doprava správ:** **VANS** sieť (od 1994), pritom **„slobodný trh s 3 schválenými VANS operátormi“**; od 2005 „Sundhedsdatanet“ pre webové služby; od 2014 **IHE XDS** pre dokumenty vo formáte CDA; od 2023 nová infraštruktúra **EHMI s eDelivery** [overené, MedCom13].
- **Rozsah dnes:** štandardy sú zabudované vo viac ako **150 IT systémoch**, vymieňa sa asi **6,5 mil. správ mesačne** [overené, Hulbaek, Int. J. Integrated Care, 4. 11. 2022]. Iné zdroje uvádzajú až 7,5 mil. (MedCom, 12. 5. 2024) alebo 5,5 mil. (Healthcare Denmark) [čiastočne, naše poznámky; čísla závisia od definície].

### 2.2 Hnacia sila (čo ich rozhýbalo)
- **Najprv problém na zemi.** V roku 1992 už viac ako 60 % všeobecných praxí malo elektronickú dokumentáciu, „ale systémy nevedeli komunikovať“. Návrh celoštátneho projektu dal 1992 Fyns Amt [overené, MedCom 1994–2014, brožúra k 20. výročiu].
- **Zdola, nie zhora.** MedCom opisuje úspech takto: skupina „nadšencov“ z lekárov a nemocničného personálu (tzv. EDI-skupina) a na druhej strane IT experti zo **60+ dodávateľov**; prvý projekt 1994 mal **37 dodávateľov** nemocničných systémov a systémov pre praktikov. Definíciu úloh aj schválenie riešení robili používatelia: „bottom-up rozvinutie“ [overené, tá istá brožúra].
- **Malé víťazstvá, žiaden veľký plán.** MedCom píše, že na začiatku nikto nemal predstavu, ako ďaleko to dôjde; cesta šla cez malé úspechy a otvorenosť k novým možnostiam [overené, tá istá brožúra].
- **Použili existujúci medzinárodný štandard a doladili ho lokálne.** Správy žiadanky/epikrízy MEDREF a MEDDIS (verzia 2.0, **december 1996**) vychádzajú z normy CEN/TC 251; autorom bola „MedCom EDI-gruppen“ (praktický lekár-konzultant, nemocničné biochemické oddelenie, DanNet, Kommunedata) a súčasťou je „konsenzuálny zoznam údajov“ (čo smie a má byť v správe) [overené, MedCom, dec. 1996].
- **Politické míľniky.** Regionálna ekonomická dohoda na rok 2011 určila, že MedCom pokračuje podľa politicky stanovených cieľov a míľnikov pre komunikáciu medzi sektormi a že jeho rola je jednoznačne výkonná [overené, brožúra, parafráza]. Podľa prezentácie MedComu ho dohoda z roku 1999 medzi amtmi a vládou urobila trvalým (dočasný projekt od 1994) [čiastočne, výsledok vyhľadávania].
- **Platba za správu?** Blog Ringholm (15. 9. 2006) tvrdí, že odosielatelia dostávali „pár eur“ za správu a príjemcovia platili podobne, aby bol proces nákladovo neutrálny [čiastočne, blog bez zdroja]. Nadpis článku Commonwealth Fund „Lessons Abroad: Advanced IT Doesn't Always Hinge on Government Funding“ naznačuje, že priame štátne dotácie za EMR neboli rozhodujúce; text sa mi nepodarilo otvoriť (403) [čiastočne]. **Konkrétnu sadzbu ani zmluvný mechanizmus pre praktikov v 90. rokoch nevieme** [nepodložené]. Zmienku o §96 Overenskomsten om almen praksis pri korešpondenčných správach som našiel, ale bez sumy [čiastočne].

### 2.3 Koľko to trvalo
- 1990 koordinačná skupina SEDI → 1992 návrh národného projektu → 1994 prvé štandardy → 1996 EDIFACT správy žiadanka a epikríza v2.0 → 2003 portál sundhed.dk → 2005 XML → **2011: blízko 100 % praxí všeobecných lekárov má IT, ktoré vie komunikovať s ostatnými** (podľa štúdie EÚ je Dánsko na 1. mieste) [overené, brožúra]. Teda **~17 rokov** od štartu po plné pokrytie praktikov.
- Elektronické odoslania: **41 %** všetkých odoslaní do 2004 (štúdia MedCom/ACCA 2005 cez Wikipedia) [čiastočne]. **Dnešné % elektronických žiadaniek a epikríz nevieme** (aktuálne číslo som nenašiel; MedCom má „monitorering“ PDF, ktoré som neotvoril) [nepodložené].
- **Čítací prístup:** e-journal projekt 2004; 2007 prvý prístup pre praktikov cez sundhed.dk; dnes lekár otvorí Sundhedsjournalen **tlačidlom zo svojho systému**, 500 000 vyhľadaní pacientov mesačne [čiastočne, naše poznámky `raw-krajina-dk.md`].

### 2.4 Čo zlyhalo / čo MedCom sám priznáva (prezentácia 16. 3. 2023, „Learning“) [overené]
- **FHIR bolo drahšie, než sa čakalo** (rozpočet: znalosť FHIR, znalosť správového prístupu, nové funkcie). Dodávatelia FHIR odporúčali, ale účet bol vyšší.
- **Prechod naraz (big-bang) je nereálny.** Mapovanie na staré štandardy je ťažké (hrozí strata dát). Nie je to 1:1 prechod; niektoré typy správ treba nahradiť iným prístupom (zdieľanie dát namiesto správ).
- **Nie je to len technická aktualizácia: „Čo je v tom pre klinikov?“** Začať s typmi správ s najväčšou klinickou potrebou a tam, kde je jasné **odovzdanie zodpovednosti za pacienta**.
- **Nevyhnutné požiadavky:** kódy pracovísk (SOR), príjem vložených príloh, **pozitívne potvrdenie doručenia** (kvitovanie).
- **Voľné prepojenie štandardov a infraštruktúry je dobré** pri modernizácii; menej štandardov nahrádza viac starých (napr. jedna FHIR žiadanka namiesto desiatok typov).
- **Plán:** FHIR správy v existujúcej VANS (od 2023: advis o hospitalizácii, korešpondencia, kvitovanie), v novej infraštruktúre od 2024 (merania z obcí k praktikovi) [overené, MedCom13]; návrh Dánskej agentúry pre zdravotné dáta (2020) je nahradiť VANS štandardom EÚ eDelivery [overené, Hulbaek 2022]. **Dátum úplného dokončenia nevieme.**
- **Dánsko stále nemá jeden nemocničný záznam:** 2 dodávatelia (Epic = Sundhedsplatformen v dvoch regiónoch, Systematic v troch); dáta od praktikov a obcí v Sundhedsjournalen sú slabé; zavedenie nového EHR narúša sledovanie ciest rakoviny; digitálny prehľad cesty onkologického pacienta je v pláne Kræftplan V až okolo 2028 [čiastočne, naše poznámky].

### 2.5 Poučenie pre nás [úsudok]
- Dánsko je dôkaz, že **národná „pošta“ s jednotnými správami funguje**, ale vzniká 15 a viac rokov, s verejnou organizáciou, certifikáciou a dohodami regiónov. Pre koordinátora je najcennejšie, že existuje **správa „prílohy a odkaz“** a **kvitovanie**: obe veci vieme napodobniť (potvrdenie, že dokument prišiel a od koho).
- Dánsky model je **posielať správu tomu, kto je na ťahu**, nie ukladať všetko na jedno miesto. Zodpovedá to koordinátorovi, ktorému príde e-mail/správa.

**Zdroje (§2):** https://medcom.dk/medcom-in-english (upravené 1/2025) · https://medcom.dk/wp-content/uploads/2023/03/medcom-det-danske-sundhedsdatanet-1994-2014.pdf (MedCom 1994–2014, brožúra 2014) · https://medcom.dk/wp-content/uploads/2023/05/MedCom13-Transition-til-FHIR-2023-03-16.pdf (16. 3. 2023) · https://medcom.dk/wp-content/uploads/2023/02/refdis20.pdf (december 1996) · https://reference-global.com/article/10.5334/ijic.ICIC22106 (4. 11. 2022) · https://en.wikipedia.org/wiki/Electronic_referrals (nedatované, načítané 16. 10. 2026) · https://www.ringholm.com/column/bribing_physicians.htm (15. 9. 2006) · naše poznámky `docs/kontext/raw-krajina-dk.md`.

---

## 3. Estónsko: zákon + centrálne úložisko + X-Road

### 3.1 Čo to je
- **X-Road** je štátna „dátová diaľnica“ (zavedená **2001**). Úrad RIA ho opisuje takto: **„X-Road nie je databáza“**, je to bezpečná vrstva na prístup k rozptýleným databázam; každá databáza má zodpovednú inštitúciu, „žiadne super-databázy ani super-inštitúcie“, dopyty idú v reálnom čase cez internet [overené, ria.ee, nedatované; rok 2001: ERR, nedatovaný článok].
- **ENHIS (národný zdravotný informačný systém, TIS/„Digilugu“)** je k tomu **centrálne úložisko dokumentov**. Madis Tiik (rodinný lekár, bývalý šéf Estonian e-Health Foundation) to opisuje tak, že trh softvéru je voľný a každá inštitúcia si vyberie vlastný, ale existuje centrálna platforma, kam musia všetky inštitúcie posielať dohodnutý rozsah štandardizovaných dokumentov, a iní si ich odtiaľ vyžiadajú [overené, ERR, nedatované; text spomína COVID, takže ~2020/21; parafráza].
- Dnes: ~14 mil. dokumentov v 2024, 28 povinných druhov dokumentov, 1,3 mil. obyvateľov [čiastočne, naše poznámky `raw-krajina-ee.md`, tam [V] podľa NKÚ 5. 12. 2025].

### 3.2 Hnacia sila
- **Zákon:** Zákon z **20. 12. 2007** o organizácii zdravotných služieb uložil poskytovateľom **posielať údaje pacientov do EHR od 1. 9. 2008**; integrovaný systém bol spustený **17. 12. 2008**. Prístup majú len ošetrujúci lekár a asistent a len počas liečby [overené, ePractice/egovmonitor cez eesti.ca, údaje z apríla 2010].
- **Štátna infraštruktúra už bola:** X-Road (2001), elektronická ID karta; Estonian eHealth Foundation vymenúva tri predpoklady prenosnosti modelu: celoštátna zabezpečená výmenná platforma, najvyššie štandardy autentifikácie/podpisu a **vynucovanie národných zákonov o zbere a výmene zdravotných dát** [čiastočne, tá istá správa, 2010].
- **Bez veľkej prestavby lokálnych systémov:** dokumenty sa „pripoja“ špeciálnymi modulmi, nemocnice si nechávajú vlastné systémy [čiastočne, tá istá správa].
- **E-recept** (od 1. 1. 2010) je príklad, keď to ide samo: **84 % receptov elektronicky už po prvom roku**, neskôr okolo 99 % (800 000 mesačne); 97 % používateľov je spokojných. Dôvod podľa ERR: systém okamžite priniesol pohodlie a ušetril námahu (opakované recepty bez návštevy lekára za 10 až 15 sekúnd) [overené, ERR]. **Rovnaký princíp: appka, ktorá všetkým strane ušetrí prácu, sa rozšíri sama.**

### 3.3 Koľko to trvalo
- 2002 nápad → 2005 koncept (4 projekty: e-záznam, digitálne snímky, e-registrácia, e-recept) → 2007 zákon → 1. 9. 2008 povinnosť → 17. 12. 2008 spustenie → 26. 10. 2009 pacientsky portál → 1. 1. 2010 e-recept → 2024 14 mil. dokumentov [overené / čiastočne].
- **V marci 2010 mal systém vyše 1 milión dokumentov, ale zo vyše 1 000 licencovaných poskytovateľov sa výmeny zúčastňovalo 309** [čiastočne, ePractice 2010].

### 3.4 Čo zlyhalo
- **NKÚ, 5. 2. 2014:** pôvodné ciele sa nenaplnili; dáta v systéme sa ešte nedali plne využiť na liečbu, štatistiku ani dohľad; **digitálny recept bol jediné štátom vytvorené e-riešenie, ktoré sa aktívne používalo**, elektronický záznam a digitálne snímky mali skromné využitie a **digitálna registrácia sa za 5 rokov od dokončenia neujala**; na spustenie e-zdravia sa dovtedy minulo 15 mil. € [overené, riigikontroll.ee].
- **NKÚ, 5. 12. 2025 (z našich poznámok):** v 1. štvrťroku 2025 prišlo do TIS **neskoro vyše 152 000 epikríz**; zhruba **tretina z ~2 100 poskytovateľov v 2024 neposlala ani jeden dokument**; **79 % epikríz** prišlo v starom formáte s menej poľami; nemocnice používajú vyše 30 rôznych IT systémov; TEHIK nemá právo prinútiť prejsť na nový formát; poisťovňa platí účet skôr, než dorazí dokument [čiastočne, `raw-krajina-ee.md`, tam [V] z PDF].
- Aj v COVID sa vo vakcinácii vrátili na papier a tabuľky (rodinní lekári prepisovali ručne) [overené, ERR].

### 3.5 Poučenie pre nás [úsudok]
- Estónsko je **jediný vzor, kde zákon vynútil posielanie do centrálneho miesta**, a aj tak po 17 rokoch chýba kvalita a včasnosť. Povinnosť bez kontroly (platba viazaná na dokument) nestačí.
- Pre KOC z toho plynie, že **dokumenty prídu neskoro, v rôznej kvalite, alebo vôbec**. Úloha koordinátorskej appky (**vidieť, čo chýba a kto ho má poslať**) je preto trvalá, nie dočasná.

**Zdroje (§3):** https://www.eesti.ca/overview-of-the-national-electronic-health-record-system-developed-by-estonia/article28256 (ePractice, údaje apríl 2010) · https://riigikontroll.ee/en/news/initially-planned-e-health-objectives-remain-unachieved (5. 2. 2014) · https://news.err.ee/1608578791/alexander-welscher-diagnosis-e-healthy (nedatované, ~2020/21) · https://ria.ee/en/news/source-code-x-road-center-was-published-foss (nedatované) · `docs/kontext/raw-krajina-ee.md`.

---

## 4. Holandsko: LSP, ZorgDomein, MedMij, Wegiz

### 4.1 Národné EPD zamietnuté, potom „prepínač“ s odkazmi
- V roku **2011 Senát jednomyselne zamietol** zákon o národnom elektronickom záznamu pacienta (hlavná výhrada: nedostatočná bezpečnosť) [overené, Computable, nedatované; dátum 5. 4. 2011 [čiastočne, výsledok vyhľadávania]].
- Koncom 2011 piati zastrešujúci zástupcovia poskytovateľov (praktici LHV, pohotovosti VHN, lekárnici KNMP, nemocnice NVZ) a pacienti NPCF založili **VZVZ**, ktorá je **od 1. 1. 2012 zodpovedná za LSP** (Landelijk Schakelpunt) [overené, odpoveď ministerky Tweede Kamer, 13. 11. 2012].
- **LSP nie je úložisko**, len odkazuje na údaje u praktika alebo v lekárni; potrebný je **súhlas pacienta (opt-in)**; sieť je rozdelená na 44 regiónov [overené, Computable; aorta-lsp.nl].
- **Pripojení (stránka 2026, bez dátumu čísel):** 4 859 praktických ambulancií, 1 828 lekární, 71 nemocníc, 51 pohotovostí praktikov, 159 samostatných klinik, 113 GGZ, 60 VVT, 34 JGZ, 29 špecialistických centier. Aplikácie: základná sada údajov BgZ, lieky, spoločné údaje pre zastupujúceho praktika, urgentný súhrn pre záchranky a pohotovosti [overené, aorta-lsp.nl, 2026]. **Počet pacientov so súhlasom nevieme** (stránka ho neuvádza) [nepodložené].

### 4.2 Hnacia sila: poisťovne zaplatili a čakali, že pripojenie vzrastie
- **Parlamentná odpoveď ministerky Schippers (13. 11. 2012) [overené]:**
  - Poisťovne (ZN) v 2012 zaplatili **6,6 mil. € = 2/3 prevádzkových nákladov LSP**.
  - Poisťovne boli ochotné **štrukturálne preplácať poskytovateľom náklady na pripojenie, ak to povedie k nárastu pripojení a používania**.
  - Poskytovatelia **váhali, lebo chýbal viacročný výhľad**; až potom vznikli 3-ročné dohody.
  - Povinné pripojenie neexistuje; poisťovne môžu do zmlúv zahrnúť LSP **len ak to profesia sama vyhlási za kvalitatívnu požiadavku**.
  - Stav k 1. 10. 2012: lekárne 845 (43 %), praktické ambulancie 2 683 (66 %), pohotovosti 41 (84 %), **nemocnice len 11 (12 %)**; spolu 3 580 (58 %).
- Neskôr: zákon **Wegiz** (povinná elektronická výmena) účinný od **1. 7. 2023**; každá konkrétna výmena sa zavádza osobitným nariadením; podľa plánu z 18. 12. 2024 má **BgZ a eOverdracht platiť od 1. 1. 2027**, **snímky: termín neurčený** [čiastočne, naše poznámky `raw-krajina-nl.md`, tam [V] Kamerstuk 27529 nr. 328]. **Novší stav po decembri 2024 nevieme.**
- **Pacientske appky (MedMij):** nadácia MedMij vznikla 2015 z iniciatívy Informatieberaad Zorg; sama appku nerobí, vydáva **značku (label)** pre appky/weby, ktoré spĺňajú dohody o bezpečnej výmene; financovaná poisťovňami a ministerstvom; značka garantuje výmenu dát, nie použiteľnosť [čiastočne, výsledky vyhľadávania a archive-it.eu; stránka medmij.nl nepíše rok ani počty].

### 4.3 ZorgDomein: vyhral trh, lebo je v systémoch lekárov
- **Súkromná platforma na odporúčania** (založená 2000). V 2019 cez ňu prešlo **14+ mil. odporúčaní**, 6+ mil. pacientov, denne ju používa **80 000+ poskytovateľov**; v januári 2021 ju investičná firma predala Rabobank [overené, firemná tlačová správa LLCP, 27. 1. 2021].
- **V 2018 ju používalo 91 % praktikov** [čiastočne, firemná prezentácia 2019, dnes 404, z našich poznámok].
- Prečo vyhrala: napojenie na množstvo informačných systémov (dnes aj štandardy založené na HL7 FHIR) a **automatické vyplnenie žiadaniek z karty pacienta**; nemocnice ju už využívajú, „nič nové netreba vyvíjať“ [čiastočne, výsledky vyhľadávania Skipr/Zorginstituut].
- Slabiny: **je v súkromných rukách** (poznámka Zorginstituut 2021) a dlho nemala alternatívu; organizácia Vecozo po regionálnych pilotoch spustila konkurenčnú službu na žiadosť zväzov nemocníc (NVZ) a praktikov (LHV) [čiastočne, Skipr, výsledok vyhľadávania; prečo to zväzy chceli, zdroj nehovorí]. **Ako sa ZorgDomein financuje (kto platí poplatky) nevieme** [nepodložené].

### 4.4 Čo zlyhalo / ostalo neúplné
- **eHealth monitor 2017 (Nictiz/Nivel):** 100 % praktikov, ktorí to potrebovali, vedelo poslať e-žiadanku; len **64 %** vedelo pripojiť dodatočné informácie, **62 %** zoznam liekov; len **24 %** vedelo elektronicky prijať snímky; **len 4 % praktikov** hovorilo, že informácie po návšteve v nemocnici prichádzajú „vždy“ včas [čiastočne, naše poznámky; tam [V] z tabuliek].
- Snímky medzi nemocnicami šli ešte v 2020 prevažne na **DVD**; zákonný termín pre snímky nie je [čiastočne, naše poznámky].
- LSP v 2012: nemocnice len 12 % pripojených; zákon o národnom EPD neprešiel; 14 rokov po tom (2026) je pripojených 71 nemocníc [overené, vyššie].

### 4.5 Poučenie pre nás [úsudok]
- **Poisťovňa ako platca infraštruktúry:** v Holandsku **poisťovne zaplatili dve tretiny prevádzky národnej výmeny a ponúkli preplácať pripojenie**. VZP už dnes koordinátora hradí a v zadaní VZP sa ako možnosť spomína „komunikačný uzol vo VZP“ [čiastočne, naše poznámky `06-prezentacie-drive.md`, deck som tu znova neotváral]. Z vzorov v tomto súbore je Holandsko jediný prípad, kde platca zo zdravotného poistenia priamo financoval národnú výmenu [úsudok; iné krajiny som z tohto pohľadu nehľadal].
- **Spoľahlivá cesta k lekárom je byť v ich systéme** (ZorgDomein sa pripája ku HIS a vyplní formulár z karty pacienta). Naopak, **prílohy** (výsledky, lieky) boli aj tu slabým miestom: presne to, čo koordinátor potrebuje.

**Zdroje (§4):** https://berthub.eu/tkconv/getraw/2012D42016 (odpoveď ministerky, Tweede Kamer, 13. 11. 2012, PDF) · https://www.computable.nl/?p=268892 (nedatované, odkazuje na list Privacy First z 5. 10. 2020) · https://www.aorta-lsp.nl/ (2026) · https://www.llcp.com/levine-leichtman-capital-partners-sells-its-investment-in-zorgdomein/ (27. 1. 2021) · https://www.archive-it.eu/knowledge-base/pgo-now-mandatory-in-healthcare (nedatované) · https://www.medmij.nl/en/ (nedatované) · `docs/kontext/raw-krajina-nl.md`.

---

## 5. Anglicko: e-RS, SCR, GP Connect, NRL (a zlyhaný NPfIT)

### 5.1 Zlyhanie „zhora“: National Programme for IT
- **Spustený 2002**, na jeho dodávke boli detailné záznamy pacientov (care records systems); vláda v **septembri 2011 oznámila rozdelenie na jednotlivé komponenty** po kritickej kontrole Major Projects Authority [overené, NAO, jún 2013].
- **Náklady a prínosy podľa ministerstva (v cenách 2004/05):** do marca 2011 **6,4 mld. £ nákladov proti 2,7 mld. £ prínosov**; do marca 2012 7,3 vs 3,7; prognóza do konca života systémov 9,8 vs 10,7; „veľmi značná neistota“, lebo ~2/3 prínosov sú budúce a nešlo ich porovnať s pôvodným cieľom (**chýbal základný stav**, baseline) [overené, NAO, jún 2013]. Vylúčené boli aj budúce náklady systému Lorenzo.
- NAO: niektoré časti programu sa podarili, iné narazili na značné ťažkosti, najmä **oneskorenia pri vývoji a nasadení detailných záznamov pacientov** (care records systems) [overené, NAO, jún 2013]. Ktoré komponenty prežili ako samostatné služby (e-RS, SCR, Spine), dokladajú ďalšie časti tejto kapitoly [čiastočne].

### 5.2 e-RS (Choose and Book): 14 rokov, kým ho zapla platba
- Prvé národné elektronické objednanie GP → prvá ambulancia (vtedy Choose and Book): obstarávanie 2003 [overené, Eve Roodhouse, NHS Digital, 6. 3. 2018]; spustenie 2004 [čiastočne, výsledky vyhľadávania Computing/NHE; cieľ ministerstva 90 % odporúčaní do 2006/07 a v 2008 asi 40 % tiež len z vyhľadávania].
- **Využitie sa „motalo okolo 52 % niekoľko rokov“**, kým NHS England nezaviedla „páky a stimuly“: **štandardná zmluva 2017/19 požaduje e-RS pre všetky prvé ambulantné konzultantské vyšetrenia a od 1. 10. 2018 sa poskytovateľovi platí len za činnosť z odporúčaní cez e-RS** [overené, tá istá správa]. K marcu 2018 prešlo na plné využitie 16 trustov a ďalších 16 plánovalo do konca marca; e-RS vtedy spracúva 50 000 odporúčaní denne; NAO (2014) odhadol dodatočné úspory až 50,5 mil. £ ročne, ak sa e-RS použije na všetky [overené, tá istá správa].
- Podpora na mieste: tím pre implementáciu a zmenu práce v spolupráci s regionálnymi tímami NHS England, implementačný balík, video prípadové štúdie [overené, tá istá správa].
- Správy späť praktikovi: štandardná zmluva (od 1. 10. 2018) vyžaduje **prepúšťaciu správu do 24 hodín a správu z ambulancie do 7 dní, štruktúrovane, priamym prenosom do systému praktika, „nie poštou, faxom ani e-mailom“** a hlavné klinické systémy musia mať otvorené rozhrania (Open API) [čiastočne, naše poznámky `raw-krajina-uk.md`; tam [V]].

### 5.3 Summary Care Record (SCR): opt-out a 40 miliónov
- SCR je súhrn z praktikovho systému (alergie, lieky, nežiaduce reakcie), ktorý vidia ostatní zdravotníci. **Do 31. 7. 2014 mal 40 mil. pacientov a odmietlo ho 1,4 %** (opt-out model); mal byť u každého pacienta už do 2010; do konca marca 2015 majú praktické ambulancie mať automatické nahrávanie súhrnu alebo zverejnený plán, ako ho dosiahnu (nová zmluva praktikov) [čiastočne, National Health Executive, 31. 7. 2014; v texte je preklep v sume programu, ignorujem].
- **GP Connect** (čítanie záznamu praktika cez FHIR API, EMIS a TPP): stav 28. 4. 2025 100 % praxí [čiastočne, naše poznámky].

### 5.4 NRL a zdieľané záznamy ICS: ukazovatele, nie úložisko
- **National Record Locator (NRL)** = register **ukazovateľov**: poskytovateľ vytvorí „pointer“ na svoje informácie, spotrebiteľ ho vyhľadá a údaje si načíta priamo u zdroja; API je FHIR [overené, api.gov.uk, nedatované]. Spustené v beta v 2018 pre záchranárov a krízové plány duševného zdravia [čiastočne, Digital Health, 11/2018, cez vyhľadávanie].
- **Dnes (stránka Community Pharmacy England, aktualizovaná 13. 1. 2026): NRL „už“ ukazuje na krízové plány duševného zdravia a plány starostlivosti na konci života; integrácia so Shared Care Record poskytovateľmi sa „preskúmava“; údaje z NRL sa začali objavovať v portáli National Care Records Service** [čiastočne, sekundárny zdroj]. Iné typy záznamov tá stránka neuvádza; **národný rozsah NRL po 8 rokoch od beta štartu 2018 teda nevieme** a zdá sa byť úzky [úsudok].
- **Shared Care Records (regionálne záznamy ICS):** NHSX dal ICS jeden rok od septembra 2020, po správe NAO, ktorá zistila, že mnohé trusty nevedia vidieť záznamy iných; ranná správa: 37 zo 42 ICS malo základné záznamy [čiastočne, výsledok vyhľadávania, dátum nevieme].

### 5.5 Čo zlyhalo / ostáva
- Aj s najlepším trackerom a e-RS: **44 % lekárov hlási neúplné údaje v žiadanke na MDT, 40 % chýbajúcu patológiu**; snímky sa okolo 2019 bežne posielali na CD poštou [čiastočne, naše poznámky; tam [V] RCR 2025].
- Dodávateľ trackera (SCR, 2024 tender): udržiavať prepojenia je náročné, zvláda to len súčasný dodávateľ [čiastočne, naše poznámky `g5-svet-appky.md`].

### 5.6 Poučenie pre nás [úsudok]
- Anglicko je učebnicový prípad: **dobrovoľný e-systém sa 14 rokov držal na 52 %; zapla ho až platba viazaná na formu odporúčania**. Pre nás: nečakať, že lekári začnú posielať štruktúrovane „z dobrej vôle“.
- **Pointer (NRL) je správny nápad, ale podľa dostupných zdrojov je po rokoch nasadený len pre úzke typy dokumentov.** Je to dôvod nepredpokladať, že „registrovanie ukazovateľov“ nám do hackathonu doručí dáta.

**Zdroje (§5):** https://www.nao.org.uk/wp-content/uploads/2013/06/10171-001_NPfiT_Review.pdf (NAO, jún 2013) · https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2018/nhs-e-referral-service-paper-switch-off (zrkadlo blogu NHS Digital, Eve Roodhouse, 6. 3. 2018) · https://www.nationalhealthexecutive.com/Health-Care-News/summary-care-record-hits-40-million-patient-milestone- (31. 7. 2014) · https://api.gov.uk/nd/national-record-locator-fhir-api/ (nedatované) · https://cpe.org.uk/nrl (4. 3. 2023, aktualizované 13. 1. 2026) · `docs/kontext/raw-krajina-uk.md`, `docs/integracia/g5-svet-appky.md`.

---

## 6. Švédsko: NPÖ a Inera

### 6.1 Čo to je
- **NPÖ (Nationell patientöversikt)** je služba Inery (spoločná firma regiónov a obcí), ktorou oprávnený zdravotník vidí záznamy o pacientovi z iných regiónov, obcí a verejne financovaných súkromných poskytovateľov. Dnes funguje cez Inerinu aplikáciu **NPÖ-app**; „spoločná dokumentácia“ je zákonom zakotvený pojem [overené, Inera, „Initial analys“, 2024].
- **Zákon:** pravidlá „sammanhållen journalföring“ (spojená dokumentácia: priamy elektronický prístup k záznamom iného poskytovateľa) boli v zákone o pacientskych údajoch (PDL 2008:355, kap. 6); **kapitola 6 bola zrušená a pravidlá sú dnes v samostatnom zákone 2022:913** [overené, riksdagen.se, text PDL načítaný 16. 10. 2026]. Samotný text zákona 2022:913 (súhlas, blokovanie medzi poskytovateľmi) som **neotvoril** [nepodložené]. V PDL (4 kap. 4 §) je pre prístup medzi jednotkami toho istého poskytovateľa právo pacienta namietať a údaje sa zablokujú (spärr) [overené]. Obecné usmernenia k NPÖ hovoria, že zdravotník potrebuje súhlas pacienta [čiastočne, výsledky vyhľadávania].
- **Spustenie:** máj 2009 v Örebro (dodávateľ Tieto), december 2009 Östergötland; **plán: všetkých 21 regiónov do 2012** [overené, HospiMedica, 4. 2. 2010].
- **Dnes (2024):** **všetky regióny, väčšina obcí a 150 súkromných poskytovateľov**; Inera je „zmluvný uzol“ pre federáciu: poskytovateľ, ktorý podpísal zmluvu s Inerou, nemusí podpisovať zmluvy s ostatnými [overené, Inera 2024].

### 6.2 Hnacia sila
- **Zákon + jedna zmluva s centrálnym uzlom.** Právny rámec pre prístup k záznamom iného poskytovateľa je od roku 2008 v zákone (dnes 2022:913); praktická vec je, že Inera robí zo všetkých zmlúv jednu [overené, riksdagen.se a Inera 2024].
- **Certifikácia aplikácií:** Inera certifikuje aplikácie tretích strán (zatiaľ **4 certifikované: 2 vlastné Inera, 2 externé**) – certifikácia zahŕňa súlad s PDL a technickú bezpečnosť; „dôvera je najväčšia výzva“ (poskytovatelia musia vedieť, že ich údaje sa zobrazujú správne aj v cudzích aplikáciách) [overené, Inera 2024].

### 6.3 Hlavná správa z 2024: zákazníci nechcú ďalšiu appku
- **Interview so 7 strategickými zástupcami** (Štokholm, Västra Götaland, Skåne, Halland, Värmland+Östergötland, mesto Štokholm, Capio): **zákazníci chcú všetku relevantnú informáciu vo svojom hlavnom systéme záznamov, aj cudziu, a nechcú, aby museli „preskakovať“ (uthopp) do inej aplikácie; počet špecializovaných systémov sa podľa nich nezníži; integrácie majú zabezpečiť, aby sa relevantné údaje zobrazili v hlavnom systéme** [overené, Inera 2024].
- **NPÖ-app musí zostať**, lebo obce a menší poskytovatelia nestíhajú integráciu dosť rýchlo [overené, Inera 2024].
- Ďalšia vec: navrhovaná služba „informationsförsörjningstjänst“ (čistý dátový tok bez používateľského rozhrania) bola v zmluvných podmienkach NPÖ spomenutá, **ale nikdy sa nerealizovala** [overené, Inera 2024]; v 2024 vznikli nové žiadosti od najväčších zákazníkov o pilotné projekty.

### 6.4 Čo zlyhalo / ostalo
- **RCC, správa 27. 3. 2026:** medzi regiónmi sa stále používajú papierové žiadanky a koordinátori trávia veľa času ich dohľadávaním telefonátmi (týka sa žiadaniek na vyšetrenia, MDK, hlásení SVF a analýz biopsií; parafráza) [čiastočne, naše poznámky `raw-krajina-se.md`; tam [V] s. 22].
- Každý región má svoj systém; viaceré ich menia (Cosmic/Cambio namiesto TakeCare do 2029); RCC: zavedenie Cosmicu spôsobilo technické problémy s prenosom dát o čakaní [čiastočne, naše poznámky].
- E-hälsomyndigheten (2021/22): technika existuje, ale nevyužíva sa dostatočne; obsah sa medzi regiónmi líši [čiastočne, naše poznámky]. Počet aktívnych používateľov NPÖ nevieme [nepodložené].

### 6.5 Poučenie pre nás [úsudok]
- **Inera je presne odpoveď na otázku „bude lekár otvárať druhú appku?“**: nie, chce, aby údaje prišli do toho, čo už otvára. Pre **používateľa, ktorý nemá integráciu** (obce, malé pracoviská, **a v našom prípade koordinátor**) ostáva **samostatná appka legitímna** (NPÖ-app je toho dôkaz).
- Aj tu: koordinátori v 2026 stále telefonujú za papierovými žiadankami. Švédske RCC ich opisuje ako každodennú realitu.

**Zdroje (§6):** https://www.inera.se/globalassets/inera/media/dokument/projekt/npo/initial-analys---npo-som-informationsforsorjningstjanst.pdf (Inera, 2024, dátum v texte nie je) · https://www.hospimedica.com/health-it/articles/294727802/swedish-national-patient-summary-gains-wide-acceptance.html (4. 2. 2010) · https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/patientdatalag-2008355_sfs-2008-355/ (načítané 16. 10. 2026) · `docs/kontext/raw-krajina-se.md` (RCC 27. 3. 2026).

---

## 7. IHE XDS / MHD: dohodnutý „register dokumentov“ a čo sa s ním stalo

### 7.1 Ako to funguje (jednoducho)
- **XDS (Cross-Enterprise Document Sharing)** = nemocnice **publikujú dokumenty** do vlastných úložísk (repository) a ich popis (metadáta: pacient, typ, dátum) sa zapíše do **jedného registra** (registry). Kto dokument hľadá, najprv sa opýta registra a potom si dokument stiahne od pôvodcu. Spoločná „záujmová doména“ (affinity domain) sa dohodne na pravidlách: identifikácia pacienta, prihlasovanie, číselníky, súhlas [overené, noze.it, nedatované; Wikipedia, načítané 16. 10. 2026].
- Rôzne domény sa spájajú cez **XCA** (Taliansko tak spája regionálne záznamy FSE; podľa tohto zdroja všetky regionálne FSE používajú IHE) [čiastočne, noze.it je konzultantský/firemný zdroj].
- **MHD (Mobile access to Health Documents)** = tie isté operácie (publikuj, hľadaj, stiahni) cez **FHIR**: Provide Document Bundle [ITI-65], Find Document Lists [ITI-66], Find Document References [ITI-67], Retrieve Document [ITI-68] [čiastočne, obsah špecifikácie IHE MHD 4.2.x podľa výsledku vyhľadávania; samotnú stránku som neotvoril].
- **Kedy vznikol XDS:** zdroje sa líšia (2003 podľa obchodnej tlače, 2004 podľa časovej osi IHE-Europe, 2005 podľa školiteľa Ringholm pre XDS.b); MHD 2017 [čiastočne, výsledky vyhľadávania, Ringholm 1. 9. 2021]. Presný rok nevieme.
- V Česku je XDS/MHD cieľový vzor: IHE MHD/MHDS (ITI-65/67/68) spomínajú experti NCEZ na pre-hack dni [čiastočne, `02-prehack-prednasky.md`].

### 7.2 Rakúsko: ELGA (XDS.b + CDA, zákon)
- **Zákon o zdravotnej telematike 2012**, nariadenie ELGA 2015; **oficiálne spustená v decembri 2015**; rozpočet približne **99 mil. €**, skutočné náklady **nikto nepozná** (neexistuje súhrn) [overené, Rechnungshof, 31. 10. 2024].
- Plánovanie od **09/2006** a model IHE XDS.b + obsah CDA (registre a úložiská, pacientsky index, audit ATNA) [čiastočne, prezentácie ELGA a IHE Europe 2019/2024 cez vyhľadávanie].
- **Audit Rechnungshofu (31. 10. 2024):** ministerstvo po spustení najprv nestanovilo ďalšie ciele ani celoštátnu stratégiu; **koncom 2023, osem rokov po spustení, písali elektronické nálezy (eBefund) v podstate len lekári v nemocniciach**; chýbali štruktúrované dokumenty pre špecialistov, **nezaradení boli ambulantní špecialisti, rádiologické ústavy a laboratóriá**; e-lieky a e-očkovanie neboli plne dokončené; zákon bol čiastočne nejednotný; **od 1. 1. 2026 musia byť všetky prepúšťacie správy, laboratórne výsledky a RTG snímky ukladané jednotne** (širšiu novelu schválila Národná rada v júli 2024) [overené, Rechnungshof].
- Opt-out: okolo 3 % obyvateľov (blog univerzity AAU; či ide o ročný alebo celkový podiel, formulácia nehovorí jasne) [čiastočne].

### 7.3 Švajčiarsko: EPD (opt-in, dobrovoľné ambulancie)
- Zákon **2017**, postupné zavádzanie **od konca 2020**; povinné pre nemocnice od 2020 a pre nové ordinácie/domovy/lekárne licencované po 2022; ostatné **dobrovoľne**. **Stav august 2024: 72 000 otvorených EPD (obyvateľstvo 9 mil.), pripojených 82 % nemocníc, 57 % domovov, 18 % ambulancií, 10 % lekární, 7 % domácej starostlivosti**; zavedenie stálo už ~100 mil. CHF [overené, heise, po 1. 10. 2024].
- **Prečo to nešlo:** nekompatibilita IT systémov, zložitý proces otvorenia, **bez prínosu pre lekárov nemajú lekári záujem (výrok predsedníčky IG eHealth)**, začarovaný kruh (nízke využitie → žiadny ťah); obsahuje len obrázkové a textové súbory, nie štruktúrované údaje; **strach z „PDF cintorína“**; pripojenie primárnych systémov je príliš komplikované [overené, heise].
- Reakcia: vláda plánuje úplnú revíziu zákona (opt-out, povinná účasť v celom reťazci, centrálna infraštruktúra), najskôr 2028 [overené, heise].

### 7.4 Názor praktika: „XDS.b dožíva“
- Ringholm (školiaca firma) tvrdí, že IHE XDS.b dosiahol koniec životného cyklu: už viac nevyhovuje (len statické dokumenty, technológia WS-* z 2000-tych rokov), preto prestali školiť; čakajú, že **MHD a MHDS** získajú vplyv a že budúcnosť je v hybridných architektúrach (dokumenty + štruktúrované dáta) [čiastočne, blog 1. 9. 2021, názor].

### 7.5 Poučenie pre nás [úsudok]
- XDS/MHD rieši **čítanie** (nájsť dokument), nie **publikovanie**: ak lekári nepublikujú, register je prázdny (CH 18 % ambulancií, AT 8 rokov len nemocnice). Pre koordinátora je preto XDS/MHD **možný budúci zdroj** (cez MHD klient), nie riešenie dnes.
- Švajčiarsky „PDF cintorín“ je presne ten prípad, keď **dokumenty bez vyťaženia štruktúry nepomôžu**; AI vyťahovanie z PDF (náš nápad) lieči reálnu slabinu, ktorú priznávajú aj Švajčiari.

**Zdroje (§7):** https://www.noze.it/en/insights/ihe-xds-affinity-domain/ (nedatované) · https://en.wikipedia.org/wiki/Cross_Enterprise_Document_Sharing (načítané 16. 10. 2026) · https://build.fhir.org/ig/IHE/ITI.MHD/toc.html (priebežná verzia 4.2.x, načítané cez vyhľadávanie) · https://rechnungshof.gv.at/rh/home/news/Meldungen_2024/Potenzial_von_elektronischer_Gesundheitsakte_ELGA_nicht_v.html (31. 10. 2024) · https://heise.de/en/background/Electronic-patient-dossier-in-Switzerland-it-is-ailing-9963571.html (po 1. 10. 2024, presný dátum v texte nie je) · https://www.ringholm.com/column/bye_bye_IHE_XDS_and_CDA.htm (1. 9. 2021) · `docs/research/02-prehack-prednasky.md`.

---

## 8. SMART on FHIR: appka spustená vo vnútri lekárovho systému

### 8.1 Ako to funguje
- **EHR launch:** EHR otvorí zaregistrovanú adresu appky s parametrami `iss` (adresa FHIR servera) a `launch` (nepriehľadný „odkaz“ na kontext). Appka z toho vyrobí žiadosť o autorizáciu; v odpovedi dostane **prístupový token** a, ak bola spustená v kontexte pacienta, aj `patient` (ktorého pacienta lekár práve vidí); ak o to požiada, vďaka `fhirUser` dostane aj identitu prihláseného používateľa. Štandardne OAuth 2.0 (s povinným PKCE) a OpenID Connect [overené, HL7 SMART App Launch v2.2.0, načítané 16. 10. 2026].
- **Standalone launch:** používateľ otvorí appku mimo EHR, kontext (pacient) sa vyberie pri autorizácii (napr. zoznamom pacientov) [overené, tá istá špecifikácia].
- Dôležité: **lekár nikde nič nezadáva ani sa neučí**; appka sa otvorí tlačidlom v jeho systéme.

### 8.2 História a hnacia sila
- **2009** Mandl a Kohane navrhli, aby sa z EHR stala „platforma na appky“ ako smartfón; **apríl 2010** financovanie z ONC (program SHARP) – projekt SMART. **SMART Classic (2011)** uspokojil vývojárov, ale **vzbudil málo záujmu dodávateľov**; v **2013** prešli na FHIR; **február 2014 (HIMSS14)** ukázali 6 appiek; štyri firmy (Cerner, Intermountain, HP pre VA, Harris) postavili prototypy, každý za menej než 2 mesiace s 1 až 2 inžiniermi; do septembra 2015 vyše 40 dodávateľov v pokusných implementáciách Argonaut [overené, Mandel a kol., JAMIA 2016, PMC4997036].
- **Ale**: autori priznávajú, že **v čase písania žiadna SMART on FHIR appka nebola nasadená v produkčnom klinickom prostredí**, ani sa neskúmali právne a obchodné bariéry [overené, tá istá štúdia].
- **Zákon:** americký **Cures Act**, finálne pravidlo ONC z roku 2020 (máj 2020 podľa názvu súboru prehľadu ONC [čiastočne]) zaviedlo kritérium **„Standardized API for patient and population services“**: certifikované EHR musia dať zákazníkom FHIR API; **termín na zavedenie 31. 12. 2022** [overené, healthit.gov, 19. 8. 2022]. **Termín splnilo viac ako 95 % certifikovaných vývojárov, 253 produktov**; k tomu je k dispozícii pre „5 000 nemocníc a 500 000+ klinikov“ [overené, healthit.gov, 10. 2. 2023]. (Tie dva zdroje nepíšu výslovne „SMART“ ani „R4“; nadväzujúce vyhľadávanie popisuje SMART App Launch a FHIR R4 ako technický základ, to je [čiastočne].)
- **Čo to vyvolalo v praxi:** v štúdii ONC (2019 až 2020) z galérií appiek Allscripts, athenahealth, Cerner, Epic a SMART: **unikátnych appiek vzrástlo z 600 na 734**, ale **FHIR podporovalo len 22 % (z 19 %), zmena nebola štatisticky významná**; najčastejšie sú administratívne appky, ktoré FHIR zvyčajne nepodporujú [overené, ONC blog, 2021].
- Reálna prax s FHIR: tím, ktorý sa pripája na 400+ FHIR serverov (Flexpa), musí používať primitívny postup (načítať jednotlivé zdroje a sledovať odkazy), lebo „ideálne“ volania sú len zriedka podporované; riešením sú prísnejšie požiadavky na zhodu [čiastočne, Ringholm/Firely, 25. 9. 2024].

### 8.3 Koľko to trvalo
- 2009 nápad → 2010 grant → 2013 FHIR → 2014 demo → **2020 pravidlo → 31. 12. 2022 povinnosť = ~13 rokov**; bez zákona to bolo v 2016 stále bez produkčných appiek [overené].

### 8.4 Poučenie pre nás [úsudok]
- **SMART je presne tá „appka bez zmeny zvykov lekára“.** Ale funguje len tam, kde výrobca NIS vystaví FHIR API a zaregistruje appku. V Česku sa v materiáloch STAPRO, Medicalc, ICZ, MEDAX **FHIR nespomína**, štát stavia eŽádanku na REST API/OAuth pre tretie strany a české FHIR návody pre onkológiu neexistujú [čiastočne, naše poznámky `g1-cz-systemy.md`]. **Či a ktorý český NIS podporuje SMART launch, nevieme.**
- Zákonný tlak v Európe je **EHDS** (§10).

**Zdroje (§8):** https://hl7.org/fhir/smart-app-launch/app-launch.html (v2.2.0, načítané 16. 10. 2026) · https://pmc.ncbi.nlm.nih.gov/articles/PMC4997036/ (Mandel a kol., JAMIA 2016) · https://healthit.gov/blog/health-information-exchange-2/on-the-road-to-cures-update-certified-api-technology/ (19. 8. 2022) · https://healthit.gov/blog/interoperability/achieving-a-major-milestone-health-it-developers-certify-to-cures-update/ (10. 2. 2023) · https://healthit.gov/blog/interoperability/research-results-published-more-apps-are-integrating-with-ehrs/ (2021) · https://www.ringholm.com/column/9_key_problems_when_conecting_to_400_FHIR_servers.htm (25. 9. 2024) · `docs/integracia/g1-cz-systemy.md`.

---

## 9. Integračné enginy: InterSystems HealthShare/IRIS a Mirth

### 9.1 Čo to je
- **Integračný engine** v nemocnici prijíma správy z jedného systému (laboratórium, NIS, PACS), **filtruje, transformuje, extrahuje a smeruje** ich ďalej. Mirth Connect to opisuje ako tlmočníka, ktorý prekladá cudzie správy do tvaru, ktorému rozumie váš systém [overené, GitHub README Mirth Connect, nedatované].
- **Prečo ich treba:** najrozšírenejší nemocničný formát je **HL7 v2**: podľa HL7 ho používa **viac ako 95 % amerických zdravotníckych organizácií** [čiastočne, HL7 wiki cez vyhľadávanie; stránka hl7.org bola nedostupná]; v prieskume ASTP/ONC z roku 2023 **96 % výmenných uzlov (HIE) prijíma HL7 v2 ADT správy** (a vyše 90 % CDA), kým FHIR API sa zavádzajú pomalšie [overené, ASTP/ONC, 18. 10. 2024].
- **Zadanie/pre-hack:** Opatřil a Kružík v ČR odporúčajú FHIR, DASTA a HL7 v2 sú dnes bežné; nemocnice majú integračné platformy (NIS, AIS, LIS, PACS) [čiastočne, `02-prehack-prednasky.md`, `g1-cz-systemy.md`].

### 9.2 InterSystems HealthShare (a IRIS for Health)
- Komponenty: **Health Connect** (integračný engine), **Unified Care Record** (longitudinálny záznam), **pacientsky index (EMPI)** pre párovanie záznamov z rôznych zdrojov, adresár poskytovateľov, portály; podporuje **FHIR, HL7 v2, IHE** [overené, produktová stránka InterSystems, nedatovaná, firemný zdroj].
- **Firemné tvrdenia (nezávisle neoverené):** cez ich engine tečie vyše 60 % dát NHS; zdieľaný záznam pokrýva vyše 25 % populácie [firemný zdroj].
- **Prípad West Midlands (tlačová správa 27. 9. 2022, firemný zdroj):** zdieľaný záznam ~**3,2 mil. obyvateľov**, takmer **400 poskytovateľov** (365 praktík, nemocnice, obce), 3 ICS; zdieľajú sa „lokálne dohodnuté súbory údajov“ (lieky, alergie, núdzové kontakty, ochrana detí); nie jedna centrálna databáza; **žiadne kvantitatívne výsledky** v správe [firemný zdroj].
- Pozor: v týchto materiáloch **nie je popísané**, ako sa pripojili zdrojové EPR ani koľko to stálo [nepodložené].
- Pre nás: InterSystems je hlavný technologický partner hackathonu (IRIS for Health s FHIR serverom); tím to má v pláne (`11-SKEPTICI-A-INTERSYSTEMS.md`).

### 9.3 Mirth Connect (NextGen) a licencia
- README repozitára stále uvádza licenciu **Mozilla Public License 2.0** [overené, GitHub, nedatované]. Podľa konzultantského blogu NextGen oznámil **19. 3. 2025** (s vydaním verzie 4.6), že od 4.6 je Mirth Connect **komerčný s jednou proprietárnou licenciou**; posledná otvorená verzia je **4.5.2**; vznikli forky **BridgeLink** (Innovar Healthcare, 4.5.4 v júli 2025) a **Open Integration Engine** (komunitný) [čiastočne, sekundárny zdroj, nenašiel som originálne oznámenie]. **Pred použitím v hackathone/produkte treba skontrolovať aktuálnu licenciu.**

### 9.4 Poučenie pre nás [úsudok]
- Engine **vždy vyžaduje jedno napojenie na jeden zdrojový systém**, ktoré niekto zaplatí a udržiava (príklad SCR: „zvláda to len súčasný dodávateľ“). V KOC je to práca **IT KOC a dodávateľa NIS**, nie koordinátora.
- Preto má zmysel postaviť výstup appky vo **FHIR** a nechať si „biele miesto“ na napojenie (rada Opatřila z pre-hack dňa), nie budovať vlastnú integráciu na 10 NIS.

**Zdroje (§9):** https://github.com/nextgenhealthcare/connect (README, nedatované) · https://healthit.gov/news/most-hies-routinely-use-hl7-v2-and-cda-health-data-standards/ (18. 10. 2024, aktualizované 23. 9. 2025) · https://intersystems.com/au/products/healthshare (nedatované, firemný zdroj) · https://intersystems.com/id/news/west-midlands-integrated-care-systems-establish-one-of-the-uks-largest-health-and-social-care-records-using-intersystems-healthshare (27. 9. 2022, firemný zdroj) · https://nirmitee.io/blog/mirth-connect-commercial-transition-migrationstrategies-for-open-source-users/ (konzultantský blog, dátum nevieme) · `docs/research/11-SKEPTICI-A-INTERSYSTEMS.md`.

---

## 10. Čo ich naozaj rozhýbalo (zákon, platba, štandard) a čo z toho plynie pre nás

### 10.1 Syntéza: hnacie sily podľa vzorov

| Hnacia sila | Kde zabrala | Rýchlosť | Kde nestačila |
|---|---|---|---|
| **Zákon s povinnosťou posielať** | EE 2008 (povinnosť), AT (zákon 2012, spustenie 2015, plná povinnosť ukladať od 1. 1. 2026), SE (zákon o spojenej dokumentácii), US (Cures Act 2020/2022) | Pomaly: 8 až 17 rokov na dobrú kvalitu | EE 2025: tretina neposlala nič; AT 2023: len nemocnice; CH: ambulancie dobrovoľné → 18 % |
| **Platba / zmluva** | UK e-RS (od 1. 10. 2018 platba len za e-RS), NL LSP (poisťovne 2/3 prevádzky 2012, preplácanie pripojenia) | Rýchlo po zapnutí: 14 rokov na 52 %, potom skok | Keď chýba viacročný výhľad financovania (NL pred 2012: poskytovatelia váhali) |
| **Štandard tvorený so všetkými** | DK MedCom (37 až 60 dodávateľov, EDI-skupina lekárov) | ~17 rokov | FHIR prechod: drahší, pomalý; ani 30 rokov neznamená jednotný záznam |
| **Trh a pohodlie** | NL ZorgDomein (91 % praktikov 2018), EE e-recept (84 % za rok) | Rýchlo, keď je v systéme lekára a ušetrí prácu | Súkromný uzol → závislosť od jedného dodávateľa; kto ZorgDomein platí, nevieme |
| **Štandard bez zákona/peňazí** | – | – | SMART Classic 2011; CH EPD (ambulancie dobrovoľné); EE e-registrácia; UK NRL (podľa dostupných zdrojov úzke nasadenie) |
| **Národný „všetko v jednom“ zhora** | – | – | UK NPfIT (2002 až 2011), NL EPD 2011 |

**Dôležité zistenie:** nenašiel som ani jednu krajinu, kde by sa **celonárodná výmena rôznorodých dát medzi systémami rôznych dodávateľov podarila za menej ako ~10 rokov**, a to ani s peniazmi alebo zákonom. **Výnimka je jednoúčelová, jednoduchá výmena:** estónsky e-recept (84 % receptov elektronicky po prvom roku, 2010) [overené, ERR]. [„Nenašiel som“ nie je dôkaz, že taká krajina neexistuje.]

**Odborné pravidlá z praxe (názor, nie meranie):** Grahame Grieve („otec FHIR“): *interoperabilita je predovšetkým problém ľudí, nie techniky*; Richelovo pravidlo: *ak zmeníš skupinu, ktorá sa dohodla, zmeníš dohodu*, teda rozhodnutie malej skupiny bez širšej komunity zlyhá [čiastočne, Ringholm/Firely, 13. 2. 2025, citované z prednášky L. McKenzieho]. Zodpovedá to dánskej skúsenosti (EDI-skupina lekárov + 37 až 60 dodávateľov).

### 10.2 Súhlas pacienta: rôzne modely (stručne)
- **Opt-out (zdieľa sa automaticky, pacient môže odmietnuť):** UK SCR (1,4 % odmietlo, 2014), AT ELGA (okolo 3 %); EE: pri liečbe bez súhlasu, pacient môže zablokovať [čiastočne]. 
- **Opt-in (musí súhlasiť):** NL LSP; CH EPD (plán prejsť na opt-out). 
- **Súhlas pacienta a možnosť zablokovať:** SE (podľa obecných usmernení k NPÖ; text zákona 2022:913 som neotvoril) [čiastočne].
- ČR: Sdílený záznam je opt-out; zdieľanie medzi lekármi kvôli liečbe súhlas nevyžaduje (zákon 372/2011 §51, §65) [čiastočne, `raw-dataflow.md`; nie som právnik].

### 10.3 Pre koordinátorskú appku: päť ciest k dátam, od najreálnejšej [úsudok]

| Cesta | Čo sa deje | Kto ďalší musí niečo urobiť | Vzor (kto to robí) | Realita pre hackathon |
|---|---|---|---|---|
| **A. „Vyťažiť, čo už príde“** | Koordinátorovi príde e-mail/PDF/Word/eZpráva s DASTA/eŽádanka; appka vyťaží, zistí, čo chýba, a výstup uloží vo FHIR | **Nikto** (ani lekár, ani NIS) | DK prílohy PDF s odkazom; SE koordinátori s papierovými žiadankami; CH „PDF cintorín“ ukazuje, že treba aj vyťaženie štruktúry | Áno, dnes. Bez čakania na rozhrania |
| **B. „Čítať cez existujúce koľajnice“** | Koordinátor má read-only prístup cez existujúci kanál (Sdílený záznam, EZKarta, ePACS, schránka eZprávy) | Stát/prevádzkovateľ siete, súhlas pacienta | SE NPÖ, DK Sundhedsjournalen, UK GP Connect | Čiastočne; závisí od prístupov KOC [nevieme, ktoré KOC majú ktoré] |
| **C. „Tlačidlo z NIS“** | Lekár/koordinátor klikne v NIS a otvorí sa appka s kontextom pacienta | Výrobca NIS (FHIR API + registrácia appky) | US SMART on FHIR, DK Sundhedsjournalen (tlačidlo) | Nie na hackathone; ukázať ako „návrh integrácie“. Podpora v českých NIS **nevieme** |
| **D. „Engine v jednom pilotnom KOC“** | IT KOC prepojí NIS (DASTA/HL7 v2) cez engine (Mirth fork, IRIS) do FHIR | IT KOC a dodávateľ NIS | UK/US HealthShare projekty (3,2 mil. obyvateľov) | Roky a zmluva; len ako plán |
| **E. „Platba / zmluva poisťovne“** | Poisťovňa priamo viaže platbu/pripojenie na elektronické posielanie | VZP, MZ, zväzy lekárov | UK e-RS (platba od 1. 10. 2018), NL (poisťovne zaplatili LSP, preplácanie pripojenia) | Mimo hackathonu, ale **toto je jediná páka, ktorú vzory ukazujú ako rozhodujúcu** |

**Čo z toho plynie pre pitch [úsudok]:**
1. **Nesľubovať „napojíme všetky NIS“ ani „jednotný profil z dát od všetkých lekárov“**: žiadna krajina z tých, čo som prešiel, to pre rôznorodé dáta za menej než ~10 rokov nedokázala, ani s peniazmi a zákonom (výnimka: jednoúčelový e-recept).
2. Povedať: **dnes beriem to, čo koordinátorovi reálne príde (A), výstup je vo FHIR (rovnaký tvar, ktorý budú vyžadovať štandardy), a pripravené je „biele miesto“ na napojenie (B, C, D)**. To sedí s radou Opatřila a Kružíka z pre-hack dňa („nestavať vlastnú databázu pacientov“).
3. Ako odpoveď na **„komunikačný uzol vo VZP“** zo zadania: vzory ukazujú, že **uzol bez páky nestačí** (NRL, XDS, SMART Classic). Páky sú **platba** (UK, NL) a **zákon** (EE, US; v EÚ EHDS až 2029/2031). VZP už koordinátora platí, čiže páku v zásade má; či ju použije (napr. viazať platbu na elektronické posielanie ako anglické e-RS), je rozhodnutie VZP/MZ, nie vec appky [úsudok].
4. **Dôkaz, že je to „ťažký“ problém, nie lenivosť IT:** MedCom 2023 sám priznáva, že FHIR vyšlo drahšie, než čakali, a že prechod naraz nejde.

### 10.4 EHDS: kedy príde zákonná „palica“ v Európe
- Nariadenie EÚ o európskom priestore zdravotných dát (odkaz na Úradný vestník L_202500327, uverejnené 5. 3. 2025), **účinné 26. 3. 2025**. **Marec 2029:** výmena súhrnu pacienta a e-receptu/e-výdaja; **marec 2031:** lekárske snímky, laboratórne výsledky a prepúšťacie správy; marec 2027 je termín pre prijatie vykonávacích aktov Komisiou. Výrobcovia EHR musia preukázať súlad (pred aj po uvedení na trh) [overené, Európska komisia, načítané 16. 10. 2026; číslo nariadenia stránka neuvádza].
- Pre koordinátora **najdôležitejšie typy dokumentov (snímky, laboratórne výsledky, prepúšťacie správy) majú povinnosť až od marca 2031** [overené]. Do tej doby na úrovni EÚ žiadny zákon lekárov k výmene týchto dokumentov nenúti; českú eŽádanku pozri §0 bod 11.
- Nuansa od odborníka: Ringholm (13. 2. 2026) píše, že prvé požiadavky platia až po marci 2029 a len pre „nové“ aplikácie uvedené na trh po tom dátume, ale očakáva, že zákazníci budú súlad s EHDS vyžadovať vo výberových konaniach a niektoré štáty môžu súlad pre existujúce aplikácie vynútiť skôr [čiastočne, názor školiteľa; text nariadenia som neotváral].

---

## 11. Čo nevieme (otvorené otázky) [nepodložené]

1. **Aktuálne % elektronických žiadaniek a epikríz v Dánsku** (MedCom monitorovanie 2023/24, PDF som neotvoril). Zdroje z 2004 (41 %) a 2008 (63 %) sú staré a sekundárne.
2. **Či mal v 90. rokoch dánsky praktik platbu za elektronickú správu** a v akej výške (blog Ringholm 2006 je jediný zdroj, bez čísel).
3. **Ako sa financuje ZorgDomein** (kto platí poplatky), a aktuálny podiel po 2019.
4. **Počet pacientov so súhlasom v LSP** a **stav Wegiz (BgZ, eOverdracht, snímky) po decembri 2024**.
5. **Počet aktívnych používateľov NPÖ** a časový priebeh pripájania regiónov po 2012.
6. **Originálne oznámenie NextGen o licencii Mirth** (mám len konzultantský blog a README, ktoré sa nezhodujú).
7. **Ktoré české NIS podporujú SMART/FHIR launch** a či existuje verejné vývojárske API; tiež, aké piloty majú nepomenované české „koordinačné aplikácie“ MZ (pozri `g5-svet-appky.md`).
8. **Presný rok vzniku XDS** (2003 až 2005 podľa zdroja) a **dátum, keď všetky švédske regióny pripojili NPÖ**.
9. **Aktuálny stav migrácie MedCom na FHIR** (viacero vĺn, žiadny celkový koncový dátum).
10. **Vplyv Cures Act na reálne klinické použitie SMART appiek** (máme počet certifikovaných produktov, nie počet nasadených appiek v nemocniciach).

---

## 12. Zdroje (súhrn, URL + dátum)

**Dánsko**
- MedCom English (upravené 1/2025): https://medcom.dk/medcom-in-english
- MedCom 1994–2014 (brožúra, 2014): https://medcom.dk/wp-content/uploads/2023/03/medcom-det-danske-sundhedsdatanet-1994-2014.pdf
- MedCom13, Transition til FHIR (16. 3. 2023): https://medcom.dk/wp-content/uploads/2023/05/MedCom13-Transition-til-FHIR-2023-03-16.pdf
- MEDREF/MEDDIS fællesvejledning v2.0 (december 1996): https://medcom.dk/wp-content/uploads/2023/02/refdis20.pdf
- Hulbaek, Int. J. Integrated Care (4. 11. 2022): https://reference-global.com/article/10.5334/ijic.ICIC22106
- Wikipedia, Electronic referrals (načítané 16. 10. 2026): https://en.wikipedia.org/wiki/Electronic_referrals
- Ringholm, Workflow Bribery (15. 9. 2006): https://www.ringholm.com/column/bribing_physicians.htm

**Estónsko**
- ePractice cez eesti.ca (údaje apríl 2010): https://www.eesti.ca/overview-of-the-national-electronic-health-record-system-developed-by-estonia/article28256
- Národný kontrolný úrad (5. 2. 2014): https://riigikontroll.ee/en/news/initially-planned-e-health-objectives-remain-unachieved
- ERR, Diagnosis: e-Healthy (nedatované, ~2020/21): https://news.err.ee/1608578791/alexander-welscher-diagnosis-e-healthy
- RIA, X-Road (nedatované): https://ria.ee/en/news/source-code-x-road-center-was-published-foss

**Holandsko**
- Tweede Kamer, odpoveď ministerky (13. 11. 2012): https://berthub.eu/tkconv/getraw/2012D42016
- Computable (nedatované): https://www.computable.nl/?p=268892
- AORTA-LSP (2026): https://www.aorta-lsp.nl/
- LLCP, ZorgDomein (27. 1. 2021): https://www.llcp.com/levine-leichtman-capital-partners-sells-its-investment-in-zorgdomein/
- MedMij (nedatované): https://www.medmij.nl/en/ · archive-it.eu (nedatované): https://www.archive-it.eu/knowledge-base/pgo-now-mandatory-in-healthcare

**Anglicko**
- NAO, NPfIT benefits statement (jún 2013): https://www.nao.org.uk/wp-content/uploads/2013/06/10171-001_NPfiT_Review.pdf
- NHS Digital blog, e-RS paper switch-off (6. 3. 2018, zrkadlo): https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2018/nhs-e-referral-service-paper-switch-off
- National Health Executive, SCR 40 mil. (31. 7. 2014): https://www.nationalhealthexecutive.com/Health-Care-News/summary-care-record-hits-40-million-patient-milestone-
- NRL FHIR API (nedatované): https://api.gov.uk/nd/national-record-locator-fhir-api/ · Community Pharmacy England, NRL (4. 3. 2023, akt. 13. 1. 2026): https://cpe.org.uk/nrl

**Švédsko**
- Inera, NPÖ initial analys (2024): https://www.inera.se/globalassets/inera/media/dokument/projekt/npo/initial-analys---npo-som-informationsforsorjningstjanst.pdf
- HospiMedica (4. 2. 2010): https://www.hospimedica.com/health-it/articles/294727802/swedish-national-patient-summary-gains-wide-acceptance.html
- Riksdagen, Patientdatalag 2008:355 (načítané 16. 10. 2026): https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/patientdatalag-2008355_sfs-2008-355/

**IHE XDS/MHD, ELGA, EPD**
- noze.it (nedatované): https://www.noze.it/en/insights/ihe-xds-affinity-domain/ · Wikipedia XDS (načítané 16. 10. 2026): https://en.wikipedia.org/wiki/Cross_Enterprise_Document_Sharing
- IHE MHD (priebežná verzia): https://build.fhir.org/ig/IHE/ITI.MHD/toc.html
- Rechnungshof, ELGA (31. 10. 2024): https://rechnungshof.gv.at/rh/home/news/Meldungen_2024/Potenzial_von_elektronischer_Gesundheitsakte_ELGA_nicht_v.html
- heise, EPD Švajčiarsko (po 1. 10. 2024): https://heise.de/en/background/Electronic-patient-dossier-in-Switzerland-it-is-ailing-9963571.html
- Ringholm, Bye bye IHE XDS and CDA (1. 9. 2021): https://www.ringholm.com/column/bye_bye_IHE_XDS_and_CDA.htm

**SMART on FHIR, Cures Act**
- HL7 SMART App Launch v2.2.0: https://hl7.org/fhir/smart-app-launch/app-launch.html
- Mandel a kol., JAMIA (2016): https://pmc.ncbi.nlm.nih.gov/articles/PMC4997036/
- ONC/healthit.gov (19. 8. 2022): https://healthit.gov/blog/health-information-exchange-2/on-the-road-to-cures-update-certified-api-technology/ · (10. 2. 2023): https://healthit.gov/blog/interoperability/achieving-a-major-milestone-health-it-developers-certify-to-cures-update/ · (2021): https://healthit.gov/blog/interoperability/research-results-published-more-apps-are-integrating-with-ehrs/
- Ringholm/Firely, 400+ FHIR serverov (25. 9. 2024): https://www.ringholm.com/column/9_key_problems_when_conecting_to_400_FHIR_servers.htm

**Enginy**
- ASTP/ONC, HIE a HL7 v2 (18. 10. 2024): https://healthit.gov/news/most-hies-routinely-use-hl7-v2-and-cda-health-data-standards/
- InterSystems HealthShare (nedatované, firemný zdroj): https://intersystems.com/au/products/healthshare · West Midlands (27. 9. 2022, firemný zdroj): https://intersystems.com/id/news/west-midlands-integrated-care-systems-establish-one-of-the-uks-largest-health-and-social-care-records-using-intersystems-healthshare
- Mirth Connect README: https://github.com/nextgenhealthcare/connect · Nirmitee blog o licencii: https://nirmitee.io/blog/mirth-connect-commercial-transition-migrationstrategies-for-open-source-users/

**EÚ**
- Európska komisia, EHDS (načítané 16. 10. 2026): https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en
- Ringholm, EHDS will have an impact well before 2029 (13. 2. 2026): https://www.ringholm.com/column/ehds-will-have-to-have-an-impact-well-before%202029.htm · Ringholm/Firely, 6 rules (13. 2. 2025): https://www.ringholm.com/column/6_rules_for_successfull_interoperability_projects.htm

**Naše poznámky (tam overené z primárnych PDF, tu neotvárané znova):** `docs/kontext/raw-krajina-dk.md`, `raw-krajina-ee.md`, `raw-krajina-nl.md`, `raw-krajina-uk.md`, `raw-krajina-se.md`, `raw-dataflow.md`, `docs/integracia/g1-cz-systemy.md`, `g5-svet-appky.md`, `docs/research/02-prehack-prednasky.md`, `11-SKEPTICI-A-INTERSYSTEMS.md`.
