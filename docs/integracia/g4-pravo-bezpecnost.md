# G4: Právo a bezpečnosť pre platformu, ktorá zbiera zdravotné dáta z viacerých zdrojov a používa AI

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici). Pojmy sú vysvetlené jednoducho. Nič sa necommitovalo, žiadne reálne dáta pacientov._

**Dôležité:** nie sme právnici a toto nie je právne stanovisko. Je to mapa: čo hovoria zákony a oficiálne dokumenty, čo z toho vyplýva pre našu appku a čo ešte nevieme. Pred pilotom v nemocnici treba právnika a DPO nemocnice (DPO = pověřenec pro ochranu osobních údajů, človek v nemocnici, ktorý hlieda na ochranu osobných údajov).

**Značky:**
- **[overené]** = čítal som text zákona, vyhlášky, nariadenia alebo oficiálneho dokumentu (zdroje sú v §17 s URL a dátumom čítania).
- **[čiastočne]** = sprostredkované: právnická kancelária, blog, výsledok vyhľadávača, starý alebo nedatovaný údaj.
- **[odhad]** = môj úsudok, nie fakt. **nevieme** = nenašiel som a neodhadujem; pri každom je napísané, koho sa opýtať.

**Ako som overoval (poctivo):** texty zákonov a vyhlášok som čítal cez nástroj WebFetch zo stránky zakonyprolidi.cz (konsolidované znenia platné k 16. 10. 2026). Nástroj vracia výťah (krátke citácie a čísla paragrafov), nie celý text. Čísla paragrafov a citácie preto ber ako spoľahlivé, ale **pred tým, než ich niekomu citujete ako právny argument, otvorte originál** (odkazy v §17). Zákon 372/2011 som nečítal celý (400 000 znakov), len paragrafy o mlčanlivosti, dokumentácii a nahliadaní (§45, §51–§57, §65–§66).

**Skratky:** KOC = komplexné onkologické centrum. MDT = multidisciplinárny tím (konzílium). NIS = nemocničný informačný systém. PHI = zdravotné údaje pacienta, ktoré ho identifikujú. DPA = zmluva o spracovaní osobných údajov (Data Processing Agreement, v ČR „zpracovatelská smlouva“). DPIA = posúdenie vplyvu na ochranu osobných údajov (Data Protection Impact Assessment). MDR = nariadenie EÚ o zdravotníckych pomôckach 2017/745. MDSW = softvér, ktorý je zdravotníckou pomôckou. LLM = veľký jazykový model (ako Claude alebo GPT).

---

## 0. Odpoveď v 20 bodoch (ak si prečítaš len toto)

1. **Oprava zadania:** zákon **325/2021 Sb. nie je kybernetický zákon**. Je to zákon **o elektronizaci zdravotnictví** (eRecept, eŽádanka, Sdílený zdravotní záznam, kmeňové registre) [overené, Z13]. Kybernetický zákon je **264/2025 Sb., o kybernetické bezpečnosti** (česká verzia NIS2), účinný od **1. 11. 2025**, zrušil starý 181/2014 [overené, Z14, Z18]. V dokumentoch preto nepíšte „325/2021 = kyberbezpečnosť“.
2. **Hackathon je bezpečný, ak dodržíme pravidlá:** zadanie VZP hovorí, že všetky dáta sú fiktívne [overené, Z41]; pravidlá Rakathonu zakazujú vkladať reálne osobné dáta pacientov bez výslovného písomného oprávnenia a hovoria, že výstupy nie sú zdravotnícke pomôcky [overené, Z40]. Máme čistú situáciu: **žiadne reálne dáta = žiadny GDPR problém v demo**. Pozor: dodržať to aj pri testovaní (žiadne dokumenty od známych, príbuzných ani z internetu s reálnymi pacientmi).
3. **Zdravotné dáta sú „osobitná kategória“** (GDPR čl. 9): spracovanie je v zásade zakázané a povolené len pri výnimke. Pre liečbu a organizáciu zdravotnej starostlivosti je to výnimka čl. 9 ods. 2 písm. h) (na základe práva a pod mlčanlivosťou) [overené, Z1]. Súhlas pacienta tu **nie je** hlavný základ; základom je zákon a to, že údaje spracúva nemocnica.
4. **Zdieľanie medzi ošetrujúcimi bez súhlasu je v ČR legálne**, ale len v nevyhnutnom rozsahu: zákon 372/2011 §51 odst. 2 písm. a) (odovzdanie informácií pre nadväznosť starostlivosti) a §65 odst. 2 písm. a) (nahliadať smú pracovníci poskytovateľa, ktorí sa podieľajú na starostlivosti) [overené, Z10].
5. **Otvorená otázka č. 1:** je **koordinátor** (často nelekár, napr. inžinierka ekonómie) osobou podľa §65 odst. 2 písm. a)? Zákon hovorí o osobe so zdravotníckou kvalifikáciou **„nebo jiném odborném pracovníkovi“**, ktorý sa podieľa na poskytovaní služieb, alebo o osobe plniacej ďalšie úlohy podľa zákonov [overené text, Z10]. Že koordinátor pod to spadá, je **[odhad]** (koordinátor je zamestnanec KOC a jeho úlohu určil Věstník MZ), jednoznačné to nie je. Opýtať sa DPO nemocnice.
6. **Roly:** nemocnica (KOC) je **správca** údajov (rozhoduje, prečo a ako), my sme **spracovateľ** (robíme to na jej príkaz). Spracovateľ potrebuje s nemocnicou **zmluvu podľa čl. 28 GDPR** [overené, Z2]. Bez nej nesmie nijaký pilot začať.
7. **Kyberzákon sa nemocníc týka, nás priamo nie:** príloha vyhlášky 408/2025 zaraďuje poskytovateľa zdravotných služieb do **režimu vyšších povinností, ak je „velký podnik“**, do nižšieho, ak je „střední podnik“ [overené, Z15]. Malá firma (my) nie je regulovaná sama, ale nemocnica **musí s nami uzavrieť zmluvu s konkrétnymi bezpečnostnými ustanoveniami** (príloha č. 5 vyhlášky 409/2025, položky a–r) [overené, Z16]. Tým sa kyberzákon dostane k nám cez zmluvu.
8. **Čo nemocnica bude chcieť od dodávateľa** (z textu vyhlášky): audit u dodávateľa, kontrola podzhotoviteľov, hlásenie incidentov, exit stratégia a vrátenie/likvidácia dát, MFA, logy min. 18 mesiacov, penetračné testy, informovanie o žiadostiach cudzích orgánov o dáta [overené, Z16, §5 a §6 tohto dokumentu].
9. **Cloud:** v prečítaných zákonoch som **nenašiel zákaz** uložiť zdravotnú dokumentáciu mimo ČR [čiastočne: 372/2011 §51–§66 nemá pravidlo o mieste uloženia, 325/2021 podľa výťahu tiež nie; starý právny článok z 2017 tvrdí to isté, Z21]. Rozhoduje GDPR (prenosy do tretích krajín) a **zmluva s nemocnicou**: vyhláška 409/2025 berie „uloženie mimo štátu“ a „žiadosti cudzieho orgánu o dáta“ ako riziko, ktoré treba ošetriť v zmluve [overené, Z16].
10. **MDR (je naša appka zdravotnícka pomôcka?):** podľa pokynu MDCG 2019-11 rev.1 (jún 2025) **nemocničné informačné systémy, úložiská záznamov a komunikačné systémy samy zdravotníckou pomôckou nie sú**; stávajú sa ňou moduly, ktoré **spracúvajú, interpretujú alebo vyhodnocujú** zdravotné informácie na zdravotný účel [overené, Z22]. Naša „administratívna/koordinačná“ appka (zber dokumentov, kontrola úplnosti, úlohy a lehoty) je **[odhad] mimo MDR**. Riziko je v AI funkciách (zhrnutia pre MDT, hodnotenie naliehavosti).
11. **Pravidlo 11 MDR:** softvér, ktorý poskytuje informácie na rozhodnutia o diagnostike alebo liečbe, je **minimálne trieda IIa** (potreba notifikovanej osoby), IIb alebo III pri vážnom dopade [overené, Z22]. Preto: **appka nesmie tvrdiť, že diagnostikuje, odporúča liečbu ani určuje naliehavosť**.
12. **EU AI Act (vysokorizikové AI):** naša appka v bežnej podobe **nie je v zozname Annex III** (zoznam obsahuje „emergency healthcare patient triage“ a hodnotenie nároku na základné verejné služby, nie onkologickú koordináciu) [overené, Z25]. Vysokorizikovou by sa stala **len cez MDR**: ak je to zdravotnícka pomôcka s notifikovanou osobou (trieda IIa a viac), je zároveň vysokorizikový AI systém [overené, Z23].
13. **Termíny AI Act sa posunuli (Digital Omnibus on AI):** vysokorizikové pravidlá pre samostatné systémy (Annex III) od **2. 12. 2027**, pre systémy vo výrobkoch (Annex I, tam patrí MDR) od **2. 8. 2028** [čiastočne: EP briefing, Council tlačová správa 29. 6. 2026, Z27, Z28]. Pre hackathon aj pilot to znamená: pravidlá vysokého rizika ešte neplatia, ale dizajnujeme tak, aby sme sa im vyhli alebo ich vedeli splniť.
14. **Auditné logy sú zákonná povinnosť, nie bonus:** informačný systém so zdravotnou dokumentáciou musí zaznamenávať **„veškeré činnosti provedené ve zdravotnické dokumentaci“** (vyhláška 444/2024 §6) [overené, Z11]; kyberpravidlá chcú logy prístupov k záznamom uchovávať **aspoň 18 mesiacov** (409/2025 §22) [overené, Z16]. Dizajn logu je v §9.
15. **Pseudonymizácia (nahradenie mena kódom) nie je anonymizácia:** pseudonymizované údaje sú stále osobné údaje, kým existuje kľúč [overené definícia čl. 4 ods. 5, Z8; čiastočne EDPB 01/2025 a rozsudok C-413/23 P zo 4. 9. 2025, Z36, Z37]. Pre LLM to znamená: pred odoslaním vyrezať mená, rodné čísla, adresy, kontakty; tým riziko znížime, ale GDPR sa nás stále týka.
16. **LLM v EÚ:** Azure OpenAI s nasadením „Data Zone EU“ spracúva prompty v rámci členských štátov EÚ a Microsoft deklaruje, že prompty sa nepoužívajú na trénovanie [overené, Z30]. **Anthropic API priamo EÚ región nemá** (inference_geo len `us` alebo `global`, workspace geo len `us`) [overené, Z31]; Claude cez Microsoft Foundry má pre Azure-hosted len US Data Zone [overené, Z31]; cez Amazon Bedrock existuje EÚ geografický profil, ale AWS sám hovorí, že treba cieľové regióny overiť [overené, Z32, Z33]. Pre pilot teda: **Azure OpenAI EU alebo Bedrock EU, nie priamy Anthropic API**.
17. **DPIA (posúdenie vplyvu) bude povinné/odporúčané:** veľké spracovanie osobitných kategórií údajov ho spúšťa (čl. 35 ods. 3 písm. b)) [overené, Z5]; česká výnimka pre lekárov (bod 5 zoznamu ÚOOÚ z 8. 1. 2020) platí len pre jednotlivého lekára **bez spracovateľa, bez zdieľania medzi poskytovateľmi a bez prenosov do tretích krajín** [overené, Z9], čo my nespĺňame. DPIA robí nemocnica, my pomáhame (čl. 28 ods. 3 písm. f)).
18. **Pilot nie je „len spustiť appku v nemocnici“:** potrebuje (a) nemocnicu ako správcu, (b) DPA, (c) DPIA, (d) bezpečnostné schválenie nemocnice, (e) písomné určenie účelu softvéru (MDR), (f) EÚ hosting, (g) pseudonymizáciu a logy, (h) rozhodnutie, ako sa pilot právne uzavrie (verejné zákazky: **nevieme**, Z45). Detail v §14.
19. **Produkcia pridáva:** formálny režim dodávateľa podľa príloh vyhlášok 409/410, pravidelné pentesty (min. raz za 2 roky pri vyššom režime, a pred spustením), audit, SLA, exit, prípadne **MDR certifikáciu**, a **EHDS** (nariadenie 2025/327): ak by sa naša appka kvalifikovala ako „EHR system“ (systém na zobrazenie/import/konverziu zdravotných údajov pre poskytovateľov), pravidlá pre kategórie laboratórne výsledky, snímky a prepúšťacie správy by začali platiť od **26. 3. 2031**, pre súhrny pacienta a recepty od **26. 3. 2029** [overené dátumy, Z29; či sa na nás vzťahuje: **nevieme**].
20. **Čo povedať porote (jedna veta):** „Appka je koordinačný nástroj, nie zdravotnícka pomôcka: AI iba vyťahuje údaje s odkazom na zdroj a hlási chýbajúce, rozhoduje koordinátor, všetko sa loguje, údaje idú cez pseudonymizáciu na EÚ hosting a v demo sú len fiktívne dáta.“

---

## 1. Kto je kto: roly a toky dát

```
 Praktik / špecialista / laboratórium        KOC (nemocnica) = SPRÁVCA        Naša firma = SPRACOVATEĽ
 (pôvodní držitelia dokumentácie)  ------>   koordinátor pripraví podklady -->  hostuje appku, volá LLM
        |  odovzdanie pre nadväznosť          MDT, správa praktikovi              (podspracovateľ: cloud, LLM)
        |  §45 odst. 2 písm. f, g; §51(2)(a)
```

| Otázka | Odpoveď | Značka |
|---|---|---|
| Kto je správca (controller)? | Nemocnica/KOC. Rozhoduje o účele (príprava MDT, koordinácia) a prostriedkoch. | [odhad] z definície rolí; čl. 28 predpokladá správcu a spracovateľa [overené, Z2] |
| Kto sme my? | Spracovateľ, ak appku prevádzkujeme pre nemocnicu a spracúvame údaje na jej pokyn. Ak by sme údaje používali na vlastné ciele (napr. trénovanie vlastného modelu), stali by sme sa správcom a to by bolo problém. | [odhad] |
| Kto sú podspracovatelia? | Cloud (Azure/AWS), poskytovateľ LLM, e-mail/SMS brána, monitoring. Každý musí mať písomné povolenie nemocnice (konkrétne alebo všeobecné) a rovnaké záväzky v zmluve; my ručíme za neho. | [overené, Z2: čl. 28 ods. 2 a 4] |
| Kto je pôvodný držiteľ dokumentácie? | Poskytovateľ, ktorý službu poskytol (praktik, nemocnica). Prednáška z pre-hack dňa: dokumentáciu **nemožno „zdieľať“, možno ju len „zpřístupnit“**; dáta ostávajú u pôvodného poskytovateľa. | [overené, Z42: `02-prehack-prednasky.md`] |
| Kto je v Rakathone správca údajov o účastníkoch? | Insane Business Ideas s.r.o. (len údaje účastníkov, nie pacientov). | [overené, Z40, čl. 11] |

**Dôsledok pre dizajn:** appka je „okno“ pre koordinátora na to, čo je u poskytovateľov. Čo najmenej vlastných kópií, čo najviac odkazov a vytiahnutých polí so zdrojom. Je to zhodné s radou z pre-hack dňa „nestavať vlastnú databázu pacientov“ [overené, Z42].

---

## 2. GDPR (nariadenie 2016/679) pre zdravotné dáta

| Čl. | Čo hovorí (jednoducho) | Čo to znamená pre nás | Značka |
|---|---|---|---|
| **4(15)** | „Údaje týkajúce sa zdravia“ sú údaje o fyzickom alebo duševnom zdraví vrátane zdravotných služieb. | Všetko v profile pacienta (diagnóza, labáky, lieky, termíny vyšetrení) je zdravotný údaj. Aj samotný fakt „pacient je v KOC“. | [overené, Z8] |
| **9(1)** | Spracovanie zdravotných údajov je **zakázané**, pokiaľ neplatí výnimka. | Potrebujeme výnimku. | [overené, Z1] |
| **9(2)(h)** | Výnimka pre preventívnu/pracovnú medicínu, diagnostiku, poskytovanie zdravotnej starostlivosti alebo riadenie zdravotných služieb, **na základe práva EÚ/štátu alebo zmluvy so zdravotníkom** a s ochranami z odst. 3. | Hlavný základ pre nemocnicu. Pre nás platí „cez nemocnicu“. | [overené, Z1] |
| **9(3)** | Takéto údaje spracúva osoba (alebo pod jej zodpovednosťou) viazaná **profesijnou mlčanlivosťou**. | Naši ľudia s prístupom k PHI musia byť zmluvne a zákonne viazaní mlčanlivosťou. V ČR zákon 372/2011 §51 odst. 5 písm. g) viaže mlčanlivosťou aj „iné osoby, ktoré sa pri práci podľa zákona dozvedeli zdravotné informácie“. | [overené, Z1, Z10] |
| **9(2)(a)** | Výslovný súhlas pacienta. | Nie je náš hlavný základ. Potrebný pri **tretích osobách** (rodina) a pri niečom navyše (výskum, vlastné vylepšovanie modelu). | [overené, Z1]; rodina [čiastočne, Z42 `raw-dataflow.md` §5] |
| **5(1)(c), (e), (f), 5(2)** | Minimalizácia (len čo je nevyhnutné), obmedzenie uloženia (nie dlhšie než treba), integrita a dôvernosť, zodpovednosť (vedieť to preukázať). | Zbierať a zobrazovať len, čo MDT potrebuje; retencia; dôkazy (logy, dokumentácia). | [overené, Z47] |
| **15** | Pacient má právo vedieť, **či sa jeho údaje spracúvajú, získať prístup, vedieť príjemcov alebo ich kategórie a plánovanú dobu uloženia**. | Nemocnica bude od nás potrebovať vedieť vyrobiť „kto a komu údaje sprístupnil“ (logy, zoznam podspracovateľov). | [overené, Z50] |
| **25** | Ochrana údajov „už v návrhu“ (napr. pseudonymizácia) a „štandardne“: spracúvajú sa len údaje nevyhnutné pre daný účel (množstvo, rozsah, doba, **kto má prístup**). | RBAC, pridelenie pacientov, minimum polí v handoveri. | [overené, Z48] |
| **22** | Právo nebyť predmetom rozhodnutia založeného **výlučne** na automatizovanom spracovaní s významnými účinkami; pre osobitné kategórie sa to ešte sprísňuje (22(4)). | AI nesmie sama rozhodnúť o liečbe, termíne či odmietnutí. Vždy človek (koordinátor/lekár). | [overené, Z6] |
| **28** | Zmluva so spracovateľom; povinný obsah v §11 tohto dokumentu. | Podmienka pilotu. | [overené, Z2] |
| **32** | Bezpečnosť primeraná riziku: **pseudonymizácia a šifrovanie**, trvalá dôvernosť/integrita/dostupnosť, obnova po výpadku, pravidelné testovanie. | Technický základ našej bezpečnosti. | [overené, Z3] |
| **33** | Správca hlási porušenie ochrany dát úradu **do 72 hodín**; spracovateľ hlási správcovi „bez zbytočného odkladu“. | V DPA dohodnúť pevnú lehotu (odhad: 24 h; číslo „24“ **nie je v GDPR**, je to dohoda). | [overené, Z4]; 24 h [odhad] |
| **35** | DPIA pri vysokom riziku; povinné okrem iného pri „rozsiahlom spracovaní osobitných kategórií údajov“ (35(3)(b)). | Pred pilotom. Pozri bod 17 vyššie. | [overené, Z5, Z9] |
| **37** | Povinný DPO pri rozsiahlom spracovaní osobitných kategórií ako hlavnej činnosti. | Nemocnica ho má. My ako malá firma pravdepodobne nemusíme (**nevieme**), ale určiť kontaktnú osobu pre ochranu údajov je rozumné. | [overené text čl. 37, Z7]; náš prípad [odhad] |
| **44 a ďalej** | Prenos osobných údajov do tretej krajiny je povolený len pri splnení podmienok kapitoly V (rozhodnutie o primeranosti, štandardné zmluvné doložky a pod.), tak aby ochrana nebola oslabená. | Radšej vôbec žiadny prenos: EÚ hosting aj pre LLM (§12). | [overené čl. 44, Z49]; podrobnosti ďalších článkov kapitoly V som nečítal; ČR kontext [čiastočne, Z21] |

**Poznámky:**
- **Zdravotníctvo a súhlas:** pracovník ministerstva (MZ, 2018) uvádza, že väčšina spracovania v zdravotníctve je daná zákonom, a súhlas pacienta je potrebný len pri „nadstavbových“ aktivitách [čiastočne, výsledok vyhľadávania z mzd.gov.cz, nenačítané celé]. Súhlasí to s `raw-dataflow.md` §5 [overené, Z42].
- **Digital Omnibus pre GDPR:** Komisia 19. 11. 2025 navrhla zmeny (napr. relatívna definícia osobných údajov). EDPB a EDPS (spoločné stanovisko 2/2026) sú proti zmene definície. **Stav v októbri 2026 nevieme**, je to stále návrh v Parlamente a Rade [čiastočne, Z43]. Nezakladať na tom nič.
- **Česká úprava:** zákon 110/2019 Sb. o zpracování osobních údajů dopĺňa GDPR (podľa ÚOOÚ zoznamu sa naň odvoláva čl. 10) [čiastočne, Z9]. Jeho text som nečítal.

---

## 3. Zákon 372/2011 Sb. (o zdravotních službách): kto smie čo vidieť

Znenie platné v roku 2026 [overené, Z10]. Zdravotnícka dokumentácia je zákonom chránená a poskytovateľ za ňu zodpovedá.

### 3.1 Mlčanlivosť a výnimky (§51)
- **§51 odst. 1:** poskytovateľ zachováva mlčanlivosť o všetkých skutočnostiach týkajúcich sa pacienta.
- **§51 odst. 2 písm. a):** **nie je porušením mlčanlivosti** odovzdanie informácií nevyhnutných na zabezpečenie **nadväznosti** poskytovaných služieb. To je právny základ pre to, aby praktik poslal epikrízu do KOC a KOC poslal záver MDT praktikovi.
- **§51 odst. 2 písm. e):** výmena medzi zdravotníkmi a sociálnymi pracovníkmi koordinujúcimi sociálno-zdravotné služby, v nevyhnutnom rozsahu.
- **§51 odst. 5:** mlčanlivosť sa vzťahuje aj na **každého, kto sa pri práci podľa tohto alebo iných zákonov dozvie zdravotné informácie** (písm. g), na osoby, ktoré nahliadajú bez súhlasu (písm. d), na osoby v príprave (písm. c). **Naši vývojári a admini s prístupom k PHI sú v dosahu tohto ustanovenia**; nemocnica to ešte zmluvne zosilní.

### 3.2 Povinnosť odovzdať informácie ďalej (§45)
- **§45 odst. 2 písm. f)** bez zbytočného odkladu odovzdať správu o poskytnutých službách registrujúcemu praktikovi (ak je to nevyhnutné pre nadväznosť a poskytovateľ je známy), poskytovateľovi, ktorý službu vyžiadal, a na vyžiadanie aj ZZS alebo pacientovi.
- **§45 odst. 2 písm. g)** bez zbytočného odkladu odovzdať iným poskytovateľom zdravotných alebo sociálnych služieb potrebné informácie nevyhnutné pre nadväznosť.
- Zákon **neurčuje kanál ani doklad o doručení** [overené, Z42: `raw-dataflow.md` §6]. Preto krok „zavrieť slučku“ (VZP) nie je právne predpísaný a je to náš priestor.

### 3.3 Kto smie nahliadať bez súhlasu pacienta (§65)
- **§65 odst. 2:** do dokumentácie smú **bez súhlasu pacienta** nahliadať vymenované osoby, **len ak je to v záujme pacienta alebo na účel ich poverenia, a len „v nezbytném rozsahu“**.
- **Písm. a)** (to je naše): *pracovník poskytovateľa a osoba v obdobnom postavení, ak je (1) osobou so spôsobilosťou na výkon zdravotníckeho povolania **alebo iným odborným pracovníkom** a podieľa sa na poskytovaní služieb pacientovi, alebo (2) osobou plniacou ďalšie úlohy podľa tohto zákona alebo iných predpisov* [overené, Z10].
- Ďalšie písmená (b až s) sú orgány a inšpektori (poisťovne, SÚKL, súdni znalci, NZIS atď.). **Písm. p)** umožňuje poskytovateľom z iných štátov EÚ cez národný kontaktný bod, ak pacient nenamietol. Našej appky sa netýkajú.
- **§65 odst. 1:** pacient, zástupcovia a ním určené osoby (v prítomnosti poverenej osoby).
- **§65 odst. 3:** študenti len na výučbu.

**Čo z toho plynie pre appku:**
1. **Jeden používateľ = jedna osoba s rolou.** Žiadne zdieľané účty.
2. **Pozeranie len na pacientov, ktorých má koordinátor pridelených** (nie „celá databáza KOC“). To je prakticky vyjadrenie „v nevyhnutnom rozsahu“ [odhad].
3. **Zobraziť v handoveri len, čo MDT potrebuje** (nie celú históriu, ak nie je relevantná) [odhad].
4. Bod 5 v §0 (je koordinátor „iný odborný pracovník“?) sa musí vyjasniť s DPO nemocnice.

### 3.4 Záznam o nahliadnutí a dokumentácia v elektronickej podobe
- **§66 odst. 6:** každé nahliadnutie, výpis alebo kópia sa zaznamenáva do dokumentácie pacienta, **okrem nahliadnutia podľa §65 odst. 2 písm. a) a odst. 3** [overené, Z10]. Zákon teda nevyžaduje papierový záznam, keď nahliada ošetrujúci. Technické logy sú ale iná vec (vyhláška 444/2024, §9 nižšie).
- **§55 odst. 1:** dokumentácia môže byť listinná, elektronická alebo kombinovaná. Papier je legálny [overené, Z10].
- **§55a odst. 1:** každý záznam v elektronickej dokumentácii musí mať **identifikátor záznamu**. **§55a odst. 7:** opravy a doplnenia sa robia ako **nové záznamy**, takže pôvodný obsah ostáva dohľadateľný [overené, Z10]. Dizajn: **nič neprepisovať, len pridávať verzie** (to platí pre dokumentáciu poskytovateľa; ako to platí pre naše vytiahnuté polia, nevieme, ale takto sa to správa bezpečne).
- **§66 odst. 4:** pacient môže elektronickú dokumentáciu vidieť na diaľku, ak to technika poskytovateľa umožňuje [overené, Z10].

### 3.5 Vyhláška 444/2024 Sb. o zdravotnickej dokumentácii (účinná od 1. 1. 2025)
Nahradila vyhlášku 98/2012 (tá je od 1. 1. 2025 zrušená, a starší článok o cloude z 2017 sa na ňu odvoláva) [overené, Z11, Z12].
- **§6:** informačný systém s elektronickou dokumentáciou **zaznamenáva všetky činnosti vykonané v dokumentácii** [overené, Z11].
- **§7 odst. 1:** použiť technické prostriedky, ktoré zaručujú, že sa v záznamoch **nedajú údaje dodatočne upraviť**. **§7 odst. 2:** systém eviduje zoznam identifikátorov záznamov. **§7 odst. 3:** zálohy aspoň raz denne (v dňoch, keď sa dáta zmenili) na iných médiách; **§7 odst. 5–6:** dlhodobé kópie aspoň raz za kalendárny rok, chránené pred zmenou. **§7 odst. 9:** dokumentáciu možno exportovať vo formáte čitateľnom inými systémami podľa štandardu elektronického zdravotníctva [overené podľa výťahu, Z11].
- **Archivácia:** všeobecne 5 rokov, pri hospitalizácii 40 rokov, pri dispenzárnej starostlivosti 10 rokov, rádioterapia so zárením 100 rokov (príloha 3) [overené podľa výťahu, Z11]. Pre nás: **nemocnica určuje retenciu; my musíme vedieť údaje vymazať/vrátiť podľa jej pokynu**, nie ich držať „navždy“.

**Neistota:** či sa tieto pravidlá vzťahujú aj na našu appku, ak v nej držíme len kópie/výťahy, **nevieme**. Bezpečné je správať sa, akoby áno (logy, nemennosť, zálohy).

---

## 4. Zákon 325/2021 Sb. (o elektronizaci zdravotnictví): to NIE JE kyberzákon

[overené, Z13: stránka zakonyprolidi.cz, znenie č. 9 platné k 1. 4. 2026; paragrafy podľa výťahu nástroja]

**Čo to je:** štátne elektronické zdravotníctvo: integrované dátové rozhranie (§7–37), kmeňové registre (§16–25), výmenná sieť (§30), dočasné úložisko (§31), **eŽádanka (§31a)**, Registr oprávnění (§32–33), **Sdílený zdravotní záznam (§34a)**, Portál (§35), EZKarta (§35a), **žurnál činností (§37)**. Národný kontaktný bod NCPeH (§20 a ďalšie).

**Čo je relevantné pre nás:**
- **§4 písm. a):** poskytovateľ musí dodržiavať **štandardy elektronického zdravotníctva** vydané ministerstvom (od 1. 1. 2025). **§5 písm. b):** systémy používané s integrovaným rozhraním musia byť „plne kompatibilné“ so špecifikáciou. **§42:** systém sa na rozhranie prihlasuje **resortným systémovým certifikátom**. Zákon nepozná „certifikáciu dodávateľa“ ako takú; certifikáty vydáva ministerstvo (§38) [overené podľa výťahu, Z13]. **Dôsledok:** ak sa budeme chcieť napojiť na eŽádanku či iné štátne služby, musíme prejsť onboardingom NCEZ (**ako presne, nevieme**; Národný manuál elektronického zdravotníctva na mzcr.atlassian.net, Z42).
- **Sdílený zdravotní záznam (§34a):** obsahuje **emergentný zdravotný záznam** (krvná skupina, alergie, lieky za 12 mesiacov atď.) a **výsledky preventívnych a skríningových vyšetrení**, nie celú anamnézu. Nahliadať smú osoby so zdravotníckou kvalifikáciou **a „iní odborní pracovníci v priamej súvislosti s poskytovaním služieb“**, ak pacient **nevyslovil nesúhlas** (opt-out, evidovaný v Registri oprávnění) [overené podľa výťahu, Z13]. Znova otázka, či koordinátor spadá pod „iného odborného pracovníka“ (**nevieme**).
- **§37 žurnál činností:** pacient aj zdravotník vidia záznamy o činnostiach týkajúcich sa pacienta v rozhraní (čas, druh, účel, kto). Platí pre rozhranie, nie automaticky pre systémy poskytovateľov [overené podľa výťahu, Z13]. **Naša appka by mala vedieť odpovedať na rovnakú otázku: „kto sa pozeral na môj profil?“** (pre žiadosť pacienta o prístup, čl. 15 GDPR) [odhad].
- **Miesto uloženia:** výslovnú požiadavku „dáta v ČR“ som v zákone nenašiel [čiastočne, výťah].

---

## 5. Kybernetická bezpečnosť: zákon 264/2025 Sb. (NIS2) a vyhlášky 408, 409, 410/2025 Sb.

### 5.1 Čo platí a odkedy
- **Zákon č. 264/2025 Sb., o kybernetické bezpečnosti**, platný od 4. 8. 2025, **účinný od 1. 11. 2025**; nahradil zákon 181/2014 vrátane jeho vyhlášok. Je to česká transpozícia smernice NIS2 (EÚ 2022/2555) [overené, Z14; čiastočne, Z18].
- Vykonávacie vyhlášky účinné od 1. 11. 2025: **334/2025** (Portál NÚKIB), **408/2025** (regulované služby), **409/2025** (bezpečnostné opatrenia, **vyšší** režim), **410/2025** (**nižší** režim); súvisiace **411/2025** (bezpečnostné úrovne informačných systémov verejnej správy) a **412/2025** (pravidlá pre orgány verejnej moci pri používaní cloudu) [overené, Z18].
- V jednom liste NÚKIB (18. 8. 2026) je zákon uvedený ako „265/2025“; ide zrejme o preklep, lebo 265/2025 je sprievodný novelizačný zákon, hlavný je 264/2025 [overené, Z14, Z19; vysvetlenie preklepu je **[odhad]**].
- Zdravotníctvo je v zozname odvetví v §4 odst. 1 písm. a) bod 11 [overené, Z14].

### 5.2 Týka sa to nemocnice? (vyhláška 408/2025, príloha, oddiel 18 Zdravotníctvo)
[overené, Z15]
| Služba | Podmienka | Režim |
|---|---|---|
| 18.1 Poskytovanie zdravotných služieb podľa zákona o zdravotných službách | veľký podnik | **vyšší** |
| 18.1 | stredný podnik | **nižší** |
| 18.1 (druhý odstavec) | organizačná zložka štátu oprávnená poskytovať zdravotné služby | vyšší |
| 18.2 Zdravotnická záchranná služba | bez podmienky | vyšší |
| 18.7 Výrobca zdravotníckych pomôcok podľa nariadenia EÚ | veľký alebo stredný podnik | len **nižší** |

- **Veľkosť podniku** sa posudzuje podľa odporúčania Komisie 2003/361/ES (limity sa prepočítavajú na Kč kurzom ČNB) [overené, Z15]. Pre príspevkové organizácie (fakultné nemocnice) NÚKIB hovorí, že si musia **samy vyhodnotiť**, či sú poskytovateľom regulovanej služby, a nie je to automatické [čiastočne, NÚKIB FAQ, Z20]. **Pre konkrétne KOC nevieme.** Veľké fakultné nemocnice budú pravdepodobne „veľký podnik“ (**[odhad]**, sú to organizácie s tisíckami zamestnancov).
- **Čo to znamená pre nás:** naša malá firma **nie je** regulovanou službou (cloud, dátové centrum, riadené služby sú regulované len od stredného podniku; malé a mikropodniky tam nie sú) [overené, Z15: 16.8, 16.9, 16.13]. Ak by sme sa kedysi stali **výrobcom zdravotníckej pomôcky**, regulovaní by sme boli len ako stredný alebo veľký podnik [overené, Z15: 18.7].
- **Nemocnica, ak je regulovaná, musí riadiť dodávateľov** (§14 odst. 1 písm. a) bod 7 zákona; §9 vyhlášky 409). **Vybrať dodávateľa v rozpore s §13 odst. 5 zákona je priestupok** (§59 odst. 1 písm. g)). Pokuty v zákone môžu dosiahnuť **až 250 mil. Kč alebo 2 % svetového obratu** (§59 odst. 4) [overené podľa výťahu, Z14]. Nemocnica preto bude opatrná.

### 5.3 Hlásenie incidentov (regulovaná nemocnica)
Vyšší režim hlási NÚKIB: **prvotné hlásenie do 24 hodín**, **oznámenie do 72 hodín** po zistení, **záverečná správa do 30 dní** od oznámenia (§16) [overené podľa výťahu, Z14]. Nižší režim hlási Národnému CERT len incidenty s významným dopadom (§15 odst. 2). **Z toho plynie:** my musíme nemocnici nahlásiť incident **rýchlo** (príloha 5 písm. i): hodiny určí zmluva; **24 h je [odhad] rozumná požiadavka** a nemocnica si o ňu pravdepodobne povie.

### 5.4 Bezpečnostné opatrenia podľa vyhlášky 409/2025 (vyšší režim): čo sa dotkne aj nás
[overené, Z16; paragrafy podľa výťahu]
| Oblasť | Požiadavka | Čo to znamená pre nás |
|---|---|---|
| Riadenie dodávateľov (§9, príloha 5) | zoznam významných dodávateľov; hodnotenie rizík pred zmluvou; pravidelný prehľad plnenia; zmluva s ustanoveniami z prílohy 5 | §11 nižšie |
| Riadenie prístupu (§13) | prístup len v miere nevyhnutnej na prácu; oddelené účty používateľa a admina; po skončení zmluvy zrušiť účty | RBAC; žiadne trvalé admin účty; offboarding |
| Identity (§19) | **vícefaktorová autentizácia aspoň 2 rôznymi typmi faktorov** | MFA/SSO (nemocničný IdP) |
| Logovanie (§21–23, §22) | zaznamenávať prihlásenia (aj zlyhané), privilegované činnosti, zmeny oprávnení, **prístupy k záznamom**; čas s pásmom; centralizovane, s ochranou integrity, **min. 18 mesiacov**; synchronizovaný čas | §9 nižšie |
| Aplikačná bezpečnosť (§24) | skenovanie zraniteľností aspoň raz ročne; **penetračné testy pred spustením, po významnej zmene a aspoň raz za 2 roky** | Externý pentest pred pilotom (**[odhad]**, že to nemocnica bude chcieť) |
| Kryptografia (§25) | len aktuálne odolné algoritmy; bezpečná komunikácia vrátane **e-mailu** | TLS 1.2+/šifrovanie v pokoji; **žiadne PHI v tele e-mailu** (pozri §13) |
| Zálohy (§26) | pravidelné, šifrované, testované, oddelené prostredie | Zálohy s testom obnovy |
| Akvizícia a vývoj (§12) | oddelené prostredia (prevádzkové, vývojové, testovacie); bezpečnostné požiadavky pri nákupe a vývoji | **Žiadne reálne PHI v dev/test** |
| Riadenie rizík (§8) | hodnotenie rizík aspoň raz ročne a pri zmenách | Pripraviť podklady |

**Nižší režim** (vyhláška 410/2025) má jednoduchšie požiadavky, ale tiež vyžaduje, aby zmluvy s dodávateľmi obsahovali ustanovenia z prílohy č. 2 (audit dodávateľa, reťazenie dodávateľov, exit, sankcie, riadenie zmien, incidenty, kontinuita); logy uchováva podľa vlastných potrieb [overené podľa výťahu, Z17].

### 5.5 Vyhláška 412/2025 (cloud pre orgány verejnej moci)
Pravidlá pre **orgány verejnej moci**, ktoré používajú poskytovateľov cloudu [overené, Z18 názov]. **Či sa vzťahujú na nemocnicu, nevieme.** Opýtať sa NÚKIB: regulace@nukib.gov.cz (adresa z FAQ NÚKIB, Z20 [čiastočne]).

---

## 6. Cloud a dátová rezidencia v ČR

| Tvrdenie | Značka |
|---|---|
| Zákon 372/2011 (§51–§66): **nenašiel som** pravidlo o mieste uloženia dokumentácie | [overené v prečítanom rozsahu, Z10] |
| Zákon 325/2021: výslovnú požiadavku „uložiť v ČR“ som nenašiel; zákon sa týka štátnych služieb | [čiastočne, výťah Z13] |
| Právny článok (Pierstone, 5. 6. 2017): ČR neukladá osobitné obmedzenia na spracovanie citlivých údajov v cloude; prenosy do zahraničia sa riadia všeobecnými pravidlami GDPR. **Článok je z čias pred GDPR a odvoláva sa na zrušenú vyhlášku 98/2012**, ber ho iba ako smer | [čiastočne, Z21] |
| Vyhláška 409/2025: v prílohe 3 je ako **zraniteľnosť** uvedené „umiestnenie aktíva mimo územia štátu“ pri nedostatočnom povedomí o jeho právnom prostredí; príloha 5 písm. i) bod 4 a písm. r) chce, aby dodávateľ **hlásil žiadosti cudzích orgánov o dáta a postupoval prísne** | [overené podľa výťahu, Z16] |
| NÚKIB (list z 18. 8. 2026): pre **poskytovateľov hostingu a cloudu**, ktorí sú povinnými osobami, platí vykonávacie nariadenie Komisie 2024/2690; kto povinnou osobou nie je, tie štandardy plniť nemusí, ale odporúča sa | [overené, Z19] |
| NÚKIB nevydal (v tom, čo som našiel) osobitné odporúčanie pre cloud v nemocniciach | [čiastočne: neúspešné hľadanie] |
| Bezpečný prakticky-právny záver | **Hosting v EÚ (ideálne v ČR/regióne) + zmluva, ktorá rieši cudzie žiadosti o dáta.** Nemocnica si to môže chcieť prísnejšie (napr. len ČR): **nevieme**, opýtať sa. |

**Prenosy do USA:** rámec EÚ-USA Data Privacy Framework napadol Latombe; Všeobecný súd žalobu zamietol 3. 9. 2025, odvolanie C-703/25 P je pred Súdnym dvorom, **rozsudok som nenašiel** (stav jún 2026) [čiastočne, Z34]. Dôvod ďalej uprednostniť EÚ hosting a nespoliehať sa na DPF.

**Microsoft EU Data Boundary:** Microsoft ho dokončil vo februári 2025 (dáta a spracovanie hlavných cloudových služieb v EÚ/EFTA), niektoré výnimky pretrvávajú; otázka práva USA vyžadovať dáta od americkej firmy (CLOUD Act) tým **nie je uzavretá** [čiastočne: TechCrunch 26. 2. 2025 a ďalšie, Z35]. Nemocnica sa môže pýtať aj na toto.

---

## 7. MDR: je naša appka zdravotnícka pomôcka?

Zdroj: **MDCG 2019-11 rev.1** (jún 2025) „Qualification and classification of software“ [overené, Z22]. Je to nezáväzný, ale určujúci výkladový pokyn koordinačnej skupiny členských štátov. Posudzuje sa **zamýšľaný účel určený výrobcom** (to, čo tvrdíme my v dokumentácii a komunikácii), nie to, ako ho používa používateľ.

### 7.1 Rozhodovací strom v 5 krokoch (skrátene)
1. Je to softvér? (áno)
2. Je to príslušenstvo zdravotníckej pomôcky alebo ju riadi? (nie)
3. **Robí s dátami niečo viac než ukladanie, archivovanie, komunikáciu, jednoduché vyhľadávanie, bezstratovú kompresiu?** Ak nie, nie je to MDSW. Ak áno, ďalej.
4. **Je akcia na prospech jednotlivého pacienta?** Nie je, ak ide len o agregáciu populačných dát, všeobecné postupy (nie pre konkrétneho pacienta), literatúru, atlasy, epidemiologické štúdie a registre.
5. Potom je to MDSW.

### 7.2 Čo pokyn výslovne hovorí a čo z toho vyplýva
| Výrok pokynu (parafráza) | Náš dôsledok |
|---|---|
| **Nemocničné informačné systémy** (prijatie, objednávanie, poistenie, fakturácia) **nie sú samy zdravotníckou pomôckou**; moduly k nim ňou môžu byť. | Naša koordinačná appka je v tejto kategórii. |
| **Informačné systémy, ktoré iba prenášajú, ukladajú, konvertujú, formátujú, archivujú**, nie sú zdravotníckou pomôckou. Aj EHR systémy sú pri nahradení papierovej karty mimo MDR. | Zber a zobrazenie dokumentov: v poriadku. |
| **Komunikačné systémy** (e-mail, správy) sú všeobecné, nie zdravotnícka pomôcka. | Odosielanie správy praktikovi: v poriadku. |
| Moduly, ktoré **zbierajú administratívne údaje, ukladajú anamnézu, fakturujú, napájajú sa na recepty**, sú **non-MDSW**. | Správa úloh, lehôt, kontaktov: v poriadku. |
| „Jednoduché vyhľadávanie“ nie je MDSW, ale **vyhľadávanie pomocou NLP (spracovania prirodzeného jazyka), ktoré prispieva k zdravotnému účelu, už „jednoduché“ nie je**. | AI, ktorá z textu správ vyťahuje polia, je na hrane: bezpečná je len ak slúži **administratívnemu** účelu (úplnosť podkladov) a nie klinickému. |
| Softvér, ktorý **spracúva, analyzuje, interpretuje, počíta, vytvára alebo mení** zdravotné informácie, **môže byť MDSW, ak to riadi zdravotný zamýšľaný účel** (príklady: zmena zobrazenia dát na lekársky účel, hľadanie nálezov podporujúcich diagnózu). | Nevytvárať „klinické zhrnutia“ s tvrdením, že pomáhajú rozhodnúť o liečbe. |
| Príklad z laboratórneho IS: modul, ktorý **hodnotí kritickosť testov a automaticky preusporiada poradie objednávok podľa dát pacienta, je MDSW.** | **Nepriraďovať skóre naliehavosti ani automaticky meniť poradie pacientov.** To je pre nás červená čiara. |
| Rozhodovacia podpora, ktorá kombinuje lekárske databázy a algoritmy s dátami pacienta a **odporúča diagnózu/prognózu/liečbu**, **je** zdravotná pomôcka. | Žiadne odporúčania liečby (v zhode s pravidlami iných výziev). |

### 7.3 Pravidlo 11 (trieda rizika)
[overené, Z22] Softvér určený na poskytovanie informácií **používaných na rozhodnutia o diagnostike alebo terapii** je **trieda IIa**, okrem prípadov, keď rozhodnutie môže spôsobiť **smrť alebo nezvratné zhoršenie** (trieda III) alebo **vážne zhoršenie alebo chirurgický zákrok** (trieda IIb). Softvér na monitorovanie fyziologických procesov je IIa, pri životne dôležitých parametroch IIb. „Všetok ostatný softvér“ je trieda I. Keď platí viac pravidiel, použije sa najprísnejšie. Príklad z pokynu: softvér na analýzu obrazu melanómu s účelom diagnostiky rakoviny je **trieda III**. Z triedy IIa vyššie je potrebná **notifikovaná osoba**. Pri onkologickej diagnostike by sa pri klinickej funkcii dalo čakať vysokú triedu, nie nízku **[odhad]**; klasifikáciu rozhoduje zamýšľaný účel a dôsledok chyby, nie odbor.

### 7.4 Ako to chceme držať (návrh zamýšľaného účelu a hranice funkcií)
**Návrh vety do dokumentácie [odhad]:** „Nástroj slúži koordinátorovi onkologickej starostlivosti na zhromažďovanie dokumentov od rôznych poskytovateľov, kontrolu úplnosti podkladov voči zoznamu, ktorý určuje nemocnica, a sledovanie úloh a lehôt. Nie je určený na diagnostiku, voľbu liečby, určovanie naliehavosti ani na nahradenie klinického posúdenia.“

| Funkcia | Pohľad MDR | Poznámka |
|---|---|---|
| Zber a zobrazenie dokumentov, história vyšetrení, lieky s dátumami | zelená | Ukladanie/archivácia/zobrazenie |
| Vytiahnutie polí z textu **s odkazom na zdroj** (meno, dátumy, výsledok, alergie) a **označenie chýbajúcich** polí podľa zoznamu nemocnice | zelená až žltá | Zelená, kým je to „kde to v dokumente je“, žltá, ak AI začne interpretovať (napr. dopočíta PS skóre) |
| Generovanie „epikrízy/zhrnutia pre MDT“ | **žltá** | Ak je to verbatim zostavenie z dokumentov so zdrojmi, bližšie k zelenej; ak AI „vyhodnocuje stav“, ide do MDSW |
| **Skóre naliehavosti, poradie pacientov, „odporúčaný ďalší krok“, „podozrenie na“** | **červená** | Vedie k pravidlu 11; nerobiť |
| Odporúčanie liečby/vyšetrenia podľa guidelinu | červená | Rozhodovacia podpora |
| Pripomienky a úlohy podľa lehôt (napr. „chýba výsledok histológie 5 dní“) | zelená | Procesná logika, nie klinická (predpoklad: lehoty určuje človek) [odhad] |
| Odoslanie záveru MDT praktikovi | zelená | Komunikácia |

**Ďalšie MDR veci [čiastočne/nevieme]:**
- Ak by sme sa rozhodli ísť cestou pomôcky (trieda IIa+), je potrebný systém riadenia kvality, riadenie rizík, klinické hodnotenie, notifikovaná osoba a evidencia u SÚKL (SÚKL je český orgán; zákon 375/2022 Sb. o zdravotnických prostředcích dopĺňa MDR) [čiastočne, výsledky vyhľadávania]. Zoznam harmonizovaných noriem (napr. pre životný cyklus softvéru) som **neoveril**.
- Nemocnica môže vyrobiť pomôcku pre vlastné použitie (in-house, čl. 5 ods. 5 MDR); to je iná cesta ako dodávateľ [čiastočne: spomína MDCG 2025-6 v tabuľke, Z23].
- **Hraničné prípady posudzuje SÚKL/MDCG**, nie my. Pre istotu napísať si zamýšľaný účel a nechať ho posúdiť regulačným konzultantom pred pilotom.

### 7.5 EHDS (Európsky priestor pre zdravotné dáta, nariadenie 2025/327)
- Nadobudlo účinnosť dvadsiaty deň po vyhlásení (marec 2025), **všeobecne sa uplatňuje od 26. 3. 2027**. Čl. 105 zavádza postupné uplatňovanie ustanovení (čl. 3–15, 25, 26, 27 a ďalšie) podľa kategórií údajov: pre kategórie (a) až (c) čl. 14 ods. 1 a EHR systémy určené na ich spracovanie od **26. 3. 2029**, pre kategórie (d) až (f) od **26. 3. 2031**; kapitola III o EHR systémoch sa na systémy uvedené do prevádzky podľa čl. 26 ods. 2 uplatňuje od **26. 3. 2031** [overené podľa výťahu, Z29: čl. 105]. Že (a)–(c) sú súhrn pacienta a e-recepty a (d)–(f) snímky, **laboratórne výsledky** a **prepúšťacie správy**, mám zo sekundárnych zhrnutí [čiastočne]. Ako sa dátumy pre čl. 25–27 presne prekrývajú s kapitolou III, **nevieme**.
- **EHR systém** = systém, ktorý umožňuje ukladať, sprostredkovať, exportovať, importovať, konvertovať, upravovať alebo zobrazovať údaje z prioritných kategórií a je určený výrobcom na použitie poskytovateľmi pri starostlivosti o pacienta [overené, Z29: čl. 2 ods. 2 písm. k)].
- **Môže nás to týkať v produkcii** (zobrazujeme a importujeme laboratórne výsledky, správy). **Nevieme**, či by sme boli EHR systémom. MDCG 2019-11 rev.1 výslovne spomína, že softvér a moduly môžu podliehať súčasne MDR aj EHDS [overené, Z22]. Pre hackathon a pilot nerelevantné.

---

## 8. EU AI Act (nariadenie 2024/1689): vysokorizikové AI

### 8.1 Kedy je systém vysokorizikový
- **Cesta cez Annex III (čl. 6 ods. 2):** systém z vymenovaných oblastí. V zdravotníctve sú tam: **(5a)** hodnotenie nároku na základné verejné dávky a služby (vrátane zdravotných), **(5d)** triedenie tiesňových volaní a **„emergency healthcare patient triage systems“** (urgentný príjem) [overené, Z25]. Onkologická koordinácia sa tam výslovne nenachádza. Čl. 6 ods. 3 navyše dovoľuje výnimky (úzka procedurálna úloha, zlepšenie už hotovej ľudskej práce, prípravná úloha), **nie však pri profilovaní** fyzických osôb [overené, Z24].
- **Cesta cez produktové právo (čl. 6 ods. 1):** AI je súčasť produktu podľa Annex I (tam je MDR) alebo ním samým a produkt prechádza **posúdením zhody treťou stranou**. Podľa spoločného FAQ MDCG a AI Board (MDCG 2025-6): zdravotnícka pomôcka **triedy IIa, IIb, III** je vysokorizikový AI systém; trieda I bez notifikovanej osoby nie [overené, Z23, tabuľka 1].
- **Z toho plynie:** naše „koordinačné“ riešenie bez klinických funkcií **[odhad]** nespadá ani pod jednu cestu. Ak by sme sa posunuli k zdravotnej funkcii (§7), spadneme pod MDR aj AI Act súčasne.

### 8.2 Termíny po Digital Omnibus on AI
- Komisia navrhla 19. 11. 2025 odklad; trialóg sa dohodol 7. 5. 2026; Parlament schválil 16. 6. 2026; Rada schválila finálne **29. 6. 2026** [čiastočne: EP briefing + URL tlačovej správy Rady, Z27, Z28]. Číslo nariadenia a dátum vyhlásenia (jeden blog uvádza 2026/1744, účinnosť 27. 7. 2026) **nie sú overené**.
- **Nové dátumy:** vysokorizikové AI **Annex III od 2. 12. 2027**, **Annex I (produkty ako MDR) od 2. 8. 2028**; označovanie AI generovaného obsahu: lehota do 2. 12. 2026 pre systémy už na trhu pred 2. 8. 2026 [čiastočne, Z27].
- **AI gramotnosť (čl. 4):** pôvodne povinnosť poskytovateľov a nasadzujúcich zabezpečiť gramotnosť zamestnancov; po zmene je znenie mäkšie („prijať opatrenia na podporu rozvoja“ gramotnosti) [čiastočne: označenia zmien na artificialintelligenceact.eu, Z26]. Presné finálne znenie nevieme.
- **Dodávatelia modelov (GPAI):** povinnosti pre poskytovateľov univerzálnych modelov platia od 2. 8. 2025 (to sa týka OpenAI/Anthropic, nie nás) [čiastočne, z pamäti; neoverené v tejto správe].
- **Česká implementácia:** návrh zákona o umelej inteligencii (dozor ČTÚ ako primárny orgán, ÚOOÚ, ČNB). K 10. 8. 2026 **nebol prijatý**; aktuálny stav nevieme [čiastočne, Z44].
- **Rakathon a AI Act:** pravidlá Rakathonu hovoria, že použitie generatívnej AI môže mať vlastné licenčné podmienky a nesmie viesť k neoprávnenému spracovaniu osobných údajov [overené, Z40, čl. 6].

---

## 9. Auditné logy: čo, prečo, ako

### 9.1 Odkiaľ vyplýva povinnosť (zhrnutie)
| Zdroj | Čo vyžaduje | Značka |
|---|---|---|
| Vyhláška 444/2024 §6 | IS so zdravotnou dokumentáciou zaznamenáva **všetky činnosti** v dokumentácii | [overené, Z11] |
| Vyhláška 444/2024 §3 odst. 1 písm. t) | evidencia nahliadnutí do dokumentácie (kedy, kto, v akom rozsahu) | [čiastočne podľa výťahu, Z11] |
| Zákon 372/2011 §66 odst. 6 | záznam o každom nahliadnutí/výpise/kópii v dokumentácii, **okrem** nahliadnutia ošetrujúcich (§65 odst. 2 písm. a) | [overené, Z10] |
| Vyhláška 409/2025 §22 | logy prihlásení, privilegovaných operácií, zmien oprávnení, prístupov k záznamom; **min. 18 mesiacov**; integrita, centrálny zber | [overené podľa výťahu, Z16] |
| Zákon 325/2021 §37 | žurnál činností v integrovanom rozhraní, viditeľný pacientovi a zdravotníkovi | [overené podľa výťahu, Z13] |
| GDPR čl. 5(2), 32 | zodpovednosť (vedieť preukázať súlad) a primeraná bezpečnosť; logy sú prostriedok, nie samostatná povinnosť v GDPR | [overené, Z3, Z47]; že logy sú „prostriedok“, je [odhad] |
| Pre-hack prednáška | **IHE ATNA** = audit a bezpečná komunikácia; „zahrňte, ak sa dá“ (nerieši oprávnenia) | [overené, Z42: `02-prehack-prednasky.md`] |

### 9.2 Štandardy, ktoré môžeme použiť
- **FHIR AuditEvent (R4):** zaznamenáva bezpečnostne relevantné udalosti: kto (aplikácie, procesy, služby, používatelia), čo, kedy, kde, a ku ktorým objektom prístup bol [overené, Z39].
- **IHE BALP (Basic Audit Log Patterns):** opakovateľné vzory pre AuditEvent pri FHIR operáciách, tokenoch (SAML/OAuth), súhlasoch; dôraz na to, aby log správne identifikoval pacienta, ak je predmetom [overené, Z39].

### 9.3 Návrh logu pre našu appku [odhad, z požiadaviek vyššie]
**Čo logovať:** prihlásenie/odhlásenie/zlyhané; zobrazenie profilu pacienta; otvorenie dokumentu; export/tlač handoveru; **každé volanie AI** (ktoré dokumenty, model a verzia, ID šablóny promptu, hash vstupu, nie plný text s PHI); **čo koordinátor s AI výstupom urobil** (prijal, upravil, zamietol); import z externého zdroja (zdroj, čas, hash); zmeny údajov (kto, čo, kedy, predtým/potom); odoslanie správy (komu, kanál, potvrdenie); zmeny oprávnení; admin akcie; vymazanie; zamietnutý prístup.
**Čo má záznam obsahovať:** kto (ID používateľa, rola), čo (akcia, typ a ID objektu), kedy (UTC + časové pásmo), odkiaľ (IP/zariadenie), prečo (ID prípadu/MDT), výsledok.
**Vlastnosti:** len pridávanie (append-only), odolné proti úprave (napr. reťazenie hashov), synchronizovaný čas, prístup do logov len pre audítora, uchovávanie podľa zmluvy (nemocnica pravdepodobne chce aspoň 18 mesiacov, **[odhad]** podľa 409/2025 §22), **logy samotné obsahujú minimum PHI** (pseudonymný ID pacienta), upozornenia na neobvyklé správanie (hromadné prezeranie).
**V UI:** obrazovka „Kto sa pozeral na tohto pacienta“ pre nemocničného DPO a audítora (ukáže porote zrelosť).

---

## 10. Pseudonymizácia: čo to je a čo nie je

- **Definícia (GDPR čl. 4 ods. 5):** spracovanie údajov tak, aby ich nebolo možné priradiť konkrétnej osobe bez ďalších informácií, ktoré sa uchovávajú oddelene a chránia [overené, Z8]. Čl. 32 ju výslovne uvádza ako bezpečnostné opatrenie [overené, Z3].
- **Nie je to anonymizácia.** Pseudonymizované údaje ostávajú osobnými údajmi, kým existuje spôsob spätnej identifikácie. EDPB prijal Usmernenia 01/2025 o pseudonymizácii 16. 1. 2025 (verejná konzultácia; či a v akej podobe ich EDPB prijal finálne, **nevieme**, text som neotvoril) [čiastočne, Z36]. Súdny dvor v C-413/23 P (EDPS v SRB, 4. 9. 2025) potvrdil kontextový prístup: pseudonymizované údaje nemusia byť osobné pre príjemcu, ktorý ich nevie spätne identifikovať, ale **pre toho, kto drží kľúč, osobné ostávajú**, a informačné povinnosti voči dotknutým osobám ostávajú [čiastočne: zhrnutia kancelárií, Z37].
- **Čo to znamená pre nás (správa kľúča):** my budeme po pseudonymizácii stále držať kľúč (alebo ho má nemocnica). Pre nás aj pre nemocnicu to **zostáva osobný údaj**.

### Návrh architektúry (3 vrstvy) [odhad]
1. **Úložisko identity** (meno, adresa, rodné číslo/číslo poistenca, kontakty) oddelene, s vlastnými právami; kľúč u nemocnice alebo v oddelenom KMS.
2. **Klinické úložisko** s pseudonymným ID pacienta.
3. **Vrstva pred LLM:** pred odoslaním do modelu vyrezať/zamaskovať priame identifikátory (mená, RČ, adresy, telefón, e-mail, názvy konkrétnych ambulancií) a po návrate ich vrátiť zo správnych polí. Rozsiahly voľný text môže pacienta identifikovať aj bez mena (zriedkavá diagnóza + malé mesto + dátum), takže to **neoznačovať ako „anonymné“**. Úspešnosť maskovania merať na fiktívnych dokumentoch (recall).
- **Rodné číslo / číslo poistenca (v handoveri „číslo zdravotní pojišťovny“) nikdy neposielať do LLM** (dizajnové rozhodnutie, nie zákon).

---

## 11. Zmluva so spracovateľom (DPA) a zmluva s dodávateľom

### 11.1 Povinný obsah podľa čl. 28 GDPR [overené, Z2]
Zmluva musí stanoviť predmet a trvanie, povahu a účel spracovania, typy údajov a kategórie dotknutých osôb, práva a povinnosti správcu. Spracovateľ sa zaväzuje:
a) spracúvať údaje **len na zdokumentovaný pokyn** správcu (vrátane prenosov do tretích krajín),
b) zaviazať oprávnené osoby **mlčanlivosťou**,
c) prijať bezpečnostné opatrenia podľa čl. 32,
d) dodržať podmienky pre **podspracovateľov** (predchádzajúce písomné povolenie, konkrétne alebo všeobecné; pri všeobecnom informovať o zmenách, aby mohol správca namietať; rovnaké záväzky a plná zodpovednosť spracovateľa za podspracovateľa),
e) pomáhať s právami dotknutých osôb,
f) pomáhať pri bezpečnosti, hlásení porušení, DPIA a konzultáciách (čl. 32–36),
g) po skončení služby podľa voľby správcu **vymazať alebo vrátiť** všetky údaje a existujúce kópie,
h) poskytnúť informácie a umožniť **audity a inšpekcie**,
a) okrem toho **ihneď informovať správcu**, ak podľa neho pokyn porušuje nariadenie.

### 11.2 Čo pridáva kyberzákon: príloha č. 5 vyhlášky 409/2025 (zmluvy s významnými dodávateľmi)
[overené, Z16] Nemocnica v režime vyšších povinností musí dať do zmluvy relevantné z týchto ustanovení:
| Písm. | Obsah |
|---|---|
| a | bezpečnosť informácií (dôvernosť vrátane mlčanlivosti, integrita, dostupnosť) |
| b | oprávnenie užívať dáta |
| c | autorstvo programového kódu, licencie |
| d | **kontrola zavedených opatrení (pravidlá zákazníckeho auditu)** |
| e | **reťazenie dodávateľov**: podzhotovitelia sa zaviažu dodržiavať dohody v plnom rozsahu |
| f | dodržiavanie bezpečnostných politík nemocnice alebo ich odsúhlasenie |
| g | riadenie zmien |
| h | súlad zmluvy s právnymi predpismi |
| i | **informovanie o**: (1) kybernetických incidentoch súvisiacich s plnením, (2) riadení rizík a zvyškových rizík, (3) významnej zmene kontroly/vlastníctva, (4) **žiadostiach cudzích orgánov o dáta**, (5) osobách, ktoré prídu do styku s dôvernými informáciami (bezpečnostné role, pentesteri, administrátori) |
| j | **exit stratégia** (prechodné obdobie, migrácia dát) |
| k | riadenie kontinuity činností |
| l | **SLA** a spôsob realizácie bezpečnostných opatrení |
| m | pravidlá **bezpečného vývoja** |
| n | **formát predania dát** na požiadanie |
| o | **pravidlá likvidácie dát** |
| p | právo **jednostranne odstúpiť/vypovedať bez výpovednej doby** pri významnej zmene kontroly nad dodávateľom |
| q | **sankcie** za porušenie |
| r | postup pri **žiadostiach cudzieho orgánu o dáta** (posúdiť zákonnosť, snažiť sa zabrániť sprístupneniu, sprístupniť len nevyhnutné) |

### 11.3 Naše vlastné DPA: čo si pripraviť [odhad]
Zoznam podspracovateľov s regiónmi; lehota na hlásenie incidentu (24 h); plán exitu (export vo formáte FHIR/JSON/PDF a vymazanie do N dní, potvrdenie o vymazaní); zákaz používať údaje nemocnice na vlastné trénovanie modelov; zákaz prenosu mimo EÚ; zoznam našich osôb s prístupom; pravidlá pre prístup podpory (JIT, schválenie, záznam); pentest report; politika bezpečného vývoja.

---

## 12. Hosting LLM v EÚ

### 12.1 Čo je doložené

| Poskytovateľ | Čo hovoria oficiálne dokumenty | Značka |
|---|---|---|
| **Azure OpenAI / Foundry Models (Microsoft)** | Prompty a odpovede **nie sú dostupné iným zákazníkom ani OpenAI**, **nepoužívajú sa na zlepšovanie modelov bez povolenia**. Spracovanie sa deje v zákazníkom určenej geografii; pri typoch nasadenia **„DataZone“** v rámci zvolenej zóny: pre zdroj v členskom štáte EÚ sa prompty môžu spracúvať **v tomto alebo inom členskom štáte EÚ**. Pri **„Global“** nasadení v ľubovoľnej geografii, kde je model. Dáta v pokoji (nahrané súbory, uložené stavy, úložisko pre monitorovanie zneužitia) ostávajú v zákazníkom určenej geografii. Monitorovanie zneužitia môže vzorku promptov uložiť a nechať skontrolovať človeka (v EHP zamestnanci Microsoftu z EHP); **schválení zákazníci môžu požiadať o úpravu (vypnutie ukladania a ľudskej kontroly)**. Zmluvný rámec: Microsoft Products and Services DPA. Strana aktualizovaná 5. 6. 2026. | [overené, Z30] |
| **Anthropic Claude (priame API)** | `inference_geo` má hodnoty len **`global`** (predvolené) a **`us`**; **EÚ hodnota neexistuje**. **Workspace geo** (kde sú dáta v pokoji) je zatiaľ len **`us`**. | [overené, Z31] |
| **Claude v Microsoft Foundry** | `inference_geo` neplatí; pri hostovaní na Azure existuje **US Data Zone Standard** (inferencia v USA). EÚ Data Zone pre Claude som v dokumentácii **nenašiel**. | [overené, Z31]; tretie zdroje tvrdia, že EÚ zóna je „pripravovaná“ [čiastočne] |
| **Claude na Amazon Bedrock** | AWS dokumentuje **geografické cross-region inference profily** (US, EÚ, APAC), kde sa požiadavka spracuje v rámci geografie; **globálne profily** smerujú kamkoľvek. AWS výslovne varuje: **neverte len predpone profilu, overte cieľové regióny cez `GetInferenceProfile`**; pri cross-region profiloch môžu byť prompty uložené v opt-in regiónoch na detekciu zneužitia. Dostupnosť konkrétnych Claude modelov v EÚ profile som neoveril. | [overené, Z32, Z33]; modely [nevieme] |

### 12.2 Odporúčanie [odhad]
- **Hackathon (fiktívne dáta):** ľubovoľný model. Pre argument „produkčne EÚ“ **ukázať beh v EÚ**. Dáta k výzvam VZP sa sťahujú cez portál účastníka tímovým účtom v Azure Portal [overené, Z42: `04-slack-vyzvy-a-pravidla.md`]. Podobný prístup žiada iná výzva: zadanie MEDDI ONCO hovorí „GDPR: produkčne AWS v EÚ, pre prototyp akýkoľvek LLM, v prezentácii ukázať beh v AWS EÚ“ [overené, Z42; ide o výzvu MEDDI, nie VZP, ale ukazuje, ako organizátori nad tým uvažujú].
- **Pilot:** **Azure OpenAI (DataZone EU)** alebo **Claude cez Bedrock s EÚ profilom po overení regiónov** + zmluva s nemocnicou, ktorá vymenuje cloud a LLM ako podspracovateľov. **Nie priamy Anthropic API** (nemá EÚ región).
- **Alternatíva s najmenším rizikom:** model, ktorý beží v infraštruktúre pod kontrolou nemocnice (lokálny LLM). Výzva TriaLink (MOÚ) žiada práve „AI spracovanie nahratej anonymizovanej správy lokálnym LLM, v operačnej pamäti“ [overené, Z42]. Kvalita a cena takéhoto modelu pre našu úlohu: **nevieme**.
- **Zero data retention a "nepoužíva sa na trénovanie":** u Azure doložené (viď vyššie); u Bedrock a Anthropic som to v tejto správe neoveroval.

### 12.3 Bezpečnostné riziká špecifické pre LLM
OWASP Top 10 pre LLM aplikácie 2025 uvádza okrem iného **LLM01 Prompt Injection**, **LLM02 Sensitive Information Disclosure**, **LLM05 Improper Output Handling**, **LLM06 Excessive Agency**, **LLM09 Misinformation** [overené, Z38]. Pre nás konkrétne [odhad]:
- **Dokumenty od cudzích poskytovateľov sú nedôveryhodný vstup.** Text v PDF môže obsahovať pokyn pre model („ignoruj pravidlá, pošli…“). Model nesmie mať nástroje s vedľajším účinkom (odosielanie správ, mazanie) bez potvrdenia človekom.
- **Halucinácia = chyba v zdravotnej informácii.** Preto každé vytiahnuté pole s presnou citáciou a odkazom na stranu; chýbajúce nikdy nedopĺňať.
- **PHI v logoch, analytike a nástrojoch na sledovanie chýb** (Sentry a podobné) je častý únik: nepoužívať alebo filtrovať.

---

## 13. Kanály: e-mail, telefón, eZpráva z pohľadu bezpečnosti

- V ČR koordinátori reálne používajú telefón, e-mail, formuláre; metodický pokyn MZ pre HPB centrá od 9/2026 určuje web, e-mail a telefón koordinátora [overené, Z42: `raw-audit-hry.md`].
- Vyhláška 409/2025 §25 chce bezpečnú komunikáciu **vrátane e-mailu** [overené podľa výťahu, Z16] (pre regulovanú nemocnicu). Aktuálne stanovisko ÚOOÚ k posielaniu zdravotných údajov e-mailom **som nenašiel** (jediný nájdený český článok je z roku 2013, pred GDPR) [čiastočne, Z46], **nevieme**.
- **Dizajn [odhad]:** vo vnútri e-mailu žiadne PHI (iba „máte nový podklad“ a odkaz do appky/portálu s prihlásením) alebo šifrovaný prenos podľa dohody nemocnice. Odoslanie záveru MDT praktikovi nech ide cez kanál, ktorý nemocnica schváli (napr. eZpráva ako súkromná sieť zdravotníkov: ako bezpečne a či je dostatočná, **nevieme**).
- Zákon **neurčuje** kanál ani doklad o doručení (§45) [overené, Z42], takže **auditovateľný záznam odoslania** je pridaná hodnota, nie právna povinnosť.

---

## 14. Hackathon vs pilot vs produkcia

| | **Hackathon** (16.–18. 10. 2026) | **Pilot v jednej nemocnici** | **Produkcia** (viac nemocníc) |
|---|---|---|---|
| **Dáta** | Len fiktívne od VZP; reálne osobné dáta zakázané bez výslovného písomného oprávnenia; po akcii dáta zmazať/vrátiť podľa pokynu [overené, Z40, Z41] | Najprv syntetické/fiktívne v nemocničnom sandboxe; reálne dáta až po podpísaní zmluvy, DPIA a bezpečnostnom schválení | Reálne dáta; nemocnica ako správca |
| **Roly** | Nikto nie je správca pacientskych dát (nie sú) | Nemocnica = správca, my = spracovateľ | To isté + zoznam podspracovateľov |
| **Zmluvy** | Pravidlá Rakathonu v1.0 (licencia na výstupy pre organizátorov a partnerov, nevýhradná) [overené, Z40, čl. 5] | **DPA (čl. 28)** + bezpečnostné prílohy + NDA + pilotná zmluva | Dodávateľská zmluva s prílohou 5 (alebo 2) vyhlášok 409/410, SLA, exit |
| **DPIA** | netreba | **Áno** (robí nemocnica, my pomáhame) | Áno a aktualizovať |
| **Hosting a LLM** | Ľubovoľný, ideálne ukázať EÚ | **EÚ** (Azure DataZone EU / Bedrock EU po overení) | EÚ, zmluvne zakázať prenos |
| **Bezpečnosť** | Základná hygiena, nič v gite, žiadne PHI v logoch | MFA/SSO, šifrovanie, logy, externý pentest pred spustením, incidentný proces | Pentesty pravidelne (min. každé 2 roky, nemocnica), zálohy a obnova, audit dodávateľa, SLA |
| **Logy** | Ukážkový auditný log v UI | Plný auditný log s uchovaním podľa nemocnice | Centrálny, nemenný, min. 18 mesiacov (409 §22) |
| **MDR** | Výstupy sú prototypy, nie pomôcky; nepoužiť na rozhodovanie o péči [overené, Z40, čl. 4] | **Písomný zamýšľaný účel + posúdenie, že nejde o pomôcku**; nerobiť skóre ani odporúčania | Ak sa pridajú klinické funkcie: MDR cesta (QMS, klinické hodnotenie, notifikovaná osoba pri IIa+) |
| **AI Act** | nerelevantné | Zdokumentovať, prečo nie je vysokorizikový; transparentnosť | Ak MDR IIa+: vysokorizikový od 2. 8. 2028 [čiastočne] |
| **EHDS** | – | – | Posúdiť, či ide o „EHR system“ (2029/2031) |
| **Kto schvaľuje** | Porota, mentori | DPO + IT/bezpečnosť + vedenie KOC (+ právnik nemocnice) | + NÚKIB režim dodávateľa nemocnice |
| **Otvorené** | – | **Ako sa pilot zmluvne uzavrie** (verejné zákazky): **nevieme** [Z45]; či je pilot výskum s etickou komisiou, ak merajú presnosť na reálnych dátach: **nevieme** | Ceny, certifikácie |

**Verejné zákazky:** nemocnice sa väčšinou riadia zákonom 134/2016 Sb.; či „bezplatný pilot“ spadá pod zadávanie, som **nenašiel** (len prípad IKEM, kde NKÚ kritizoval delenie nákupov na menšie) [čiastočne, Z45]. Opýtať sa právnika nemocnice pred sľubom „zadarmo“.

---

## 15. Čo urobiť v kóde a v prezentácii hneď (hackathon)

**V appke:**
1. Roly (koordinátor, správca, audítor) a **pridelenie pacientov**; žiadne zdieľané účty.
2. **Auditný log** viditeľný v UI (§9) + export.
3. Každé AI-vytiahnuté pole zobrazuje **citáciu zo zdroja, dokument a stranu**; chýbajúce sa len **označí**, nedopĺňa.
4. AI je **návrh**; koordinátor potvrdí (Art. 22 GDPR; pravidlo „človek rozhoduje“).
5. **Vrstva pseudonymizácie pred LLM** a konfiguračné prepínanie na EÚ endpoint.
6. **Žiadne PHI v logoch, analytike, repozitári**; žiadne reálne dáta v dev/test.
7. Tlačidlo „vymazať všetko / exportovať“ a nastaviteľná retencia (exit stratégia, príloha 5 písm. j, n, o).
8. Odoslanie správy praktikovi: bez PHI v tele e-mailu; záznam odoslania v logu.
9. Obrana proti prompt injection: dokument = dáta; model bez nástrojov s vedľajším účinkom.
10. Zreteľný text v UI: „Prototyp pre Rakathon, nie zdravotnícka pomôcka; fiktívne dáta.“ (v súlade s čl. 4 pravidiel).

**Do prezentácie:** jedna slajda „Bezpečnosť a právo“ s vetou z bodu 20 a tromi tvrdeniami, ktoré vieme doložiť: (1) EÚ hosting + pseudonymizácia, (2) auditný log a zdroj pri každom poli, (3) hranica MDR: nerobíme diagnostiku ani skóre. **Netvrdiť:** „sme GDPR compliant“, „certifikované“, „anonymizované“, „AI rozhoduje“. Hovoriť: „navrhnuté pre GDPR a NIS2 dodávateľské požiadavky“.

**Otázky na pondelňajšie stretnutie 19. 10. 2026 v ILF Praha (ak postúpime):** ako výrobcovia NIS chcú dodávateľov z hľadiska bezpečnosti; či poznajú vzor DPA a bezpečnostného dotazníka; či nemocnice posudzujú koordinátora ako „iného odborného pracovníka“; kto je zodpovedný za schválenie externého nástroja (IT, DPO, vedenie) [odhad, otázky, nie fakty].

---

## 16. Otvorené otázky a koho sa spýtať

| Otázka | Koho |
|---|---|
| Je koordinátor „iný odborný pracovník“ podľa §65 odst. 2 písm. a) a SZZ §34a odst. 7? | DPO a právnik KOC; MZ |
| Je konkrétne KOC „veľký podnik“ (vyšší režim kyberzákona)? Platí pre nemocnicu vyhláška 412/2025 o cloude? | CISO KOC; NÚKIB (regulace@nukib.gov.cz, Z20) |
| Aké presne bezpečnostné požiadavky a dotazník kladie KOC na dodávateľa? | CISO/IT KOC |
| Je naša appka „EHR system“ podľa EHDS? | Právnik so zameraním na eHealth |
| Je pilot zadarmo mimo zákona o zadávání veřejných zakázek? | Právnik nemocnice |
| Je pilot s meraním presnosti na reálnych dátach výskum (etická komisia, iný právny základ)? | DPO, etická komisia nemocnice |
| Aktuálny stanovisko ÚOOÚ k e-mailu so zdravotnými údajmi | uoou.gov.cz |
| Ktoré Claude modely sú v Bedrock EÚ profile a kam presne smerujú? | AWS dokumentácia modelu + `GetInferenceProfile` |
| Finálne znenie Digital Omnibus on AI, čl. 4 a čl. 50, číslo nariadenia | EUR-Lex |
| Stav Digital Omnibus pre GDPR | Rada EÚ/Parlament |
| Zoznam harmonizovaných noriem pre softvér (ak by sme šli MDR cestou) | regulačný konzultant, SÚKL |

---

## 17. Zdroje (všetko čítané 16. 10. 2026, pokiaľ nie je uvedené inak)

**GDPR a súvisiace**
- Z1 GDPR čl. 9: https://gdpr-info.eu/art-9-gdpr/
- Z2 GDPR čl. 28: https://gdpr-info.eu/art-28-gdpr/
- Z3 GDPR čl. 32: https://gdpr-info.eu/art-32-gdpr/
- Z4 GDPR čl. 33: https://gdpr-info.eu/art-33-gdpr/
- Z5 GDPR čl. 35: https://gdpr-info.eu/art-35-gdpr/
- Z6 GDPR čl. 22: https://gdpr-info.eu/art-22-gdpr/
- Z7 GDPR čl. 37: https://gdpr-info.eu/art-37-gdpr/
- Z8 GDPR čl. 4: https://gdpr-info.eu/art-4-gdpr/
- Z9 Zoznam ÚOOÚ operácií bez DPIA (preklad EDPB, 8. 1. 2020): https://edpb.europa.eu/system/files/2023-03/cz_art35-5_gdpr_list_final.pdf
- Z36 EDPB, Guidelines 01/2025 on Pseudonymisation (prijaté 16. 1. 2025; sprostredkovane): https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en
- Z37 C-413/23 P, EDPS v SRB, 4. 9. 2025 (sprostredkovane: A&O Shearman, Clifford Chance, Bird & Bird): https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2025/09/pseudonymized-data-after-edps-v-srb.html
- Z43 Digital Omnibus GDPR (sprostredkovane): https://www.iubenda.com/en/blog/eu-digital-omnibus-gdpr-changes-proposed-amendments-explained/
- Z34 Latombe / DPF (sprostredkovane): https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20251201-european-court-of-justice-to-review-challenge-to-eu-us-data-privacy-framework

**České zdravotnícke právo**
- Z10 Zákon 372/2011 Sb.: https://www.zakonyprolidi.cz/cs/2011-372
- Z11 Vyhláška 444/2024 Sb.: https://www.zakonyprolidi.cz/cs/2024-444
- Z12 Vyhláška 98/2012 Sb. (zrušená 1. 1. 2025): https://www.zakonyprolidi.cz/cs/2012-98
- Z13 Zákon 325/2021 Sb.: https://www.zakonyprolidi.cz/cs/2021-325
- Z21 Cloud ve zdravotnictví (Pierstone, 5. 6. 2017, staré): https://www.pravniprostor.cz/clanky/pravo-it/cloud-ve-zdravotnictvi

**Kybernetická bezpečnosť**
- Z14 Zákon 264/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-264
- Z15 Vyhláška 408/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-408
- Z16 Vyhláška 409/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-409
- Z17 Vyhláška 410/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-410
- Z18 Právní prostor, 13. 11. 2025: https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novy-zakon-o-kyberneticke-bezpecnosti-jeho-provadeci-predpisy-nabyly-ucinnosti
- Z19 NÚKIB, list č. j. 21144/2026-NÚKIB-E/210 z 18. 8. 2026: https://nukib.gov.cz/download/uredni_deska/odpovedi_106/2026_21_Informace-k-bezpecnostnim-opatrenim-pri-poskytovani-hostingovych-nebo-cloudovych-sluzeb.pdf
- Z20 NÚKIB FAQ (výkon svěřených pravomocí, sprostredkovane): https://portal.nukib.gov.cz/storage/uploads/2026/02/09/faq_vykon-sverenych-pravomoci_uid_6989e069b8c1f.pdf

**MDR, AI Act, EHDS**
- Z22 MDCG 2019-11 rev.1 (jún 2025): https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf
- Z23 MDCG 2025-6 (jún 2025): https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf
- Z24 AI Act čl. 6: https://artificialintelligenceact.eu/article/6/
- Z25 AI Act Annex III: https://artificialintelligenceact.eu/annex/3/
- Z26 AI Act čl. 4 (so značkami zmien): https://artificialintelligenceact.eu/article/4/
- Z27 EPRS, Digital Omnibus on AI (2026): https://www.europarl.europa.eu/RegData/etudes/BRIE/2026/782651/EPRS_BRI(2026)782651_EN.pdf
- Z28 Rada EÚ, tlačová správa 29. 6. 2026 (URL z výsledkov vyhľadávania, stránku som nevedel otvoriť): https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/
- Z29 Nariadenie (EÚ) 2025/327, čl. 2 a 105: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202500327
- Z44 Český návrh zákona o AI (sprostredkovane): https://dostupnyadvokat.cz/blog/cesky-navrh-zakona-o-umele-inteligenci

**Cloud a LLM**
- Z30 Microsoft, Data, privacy, and security for Foundry Models sold by Azure (aktualizované 5. 6. 2026): https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy
- Z31 Anthropic, Data residency: https://platform.claude.com/docs/en/manage-claude/data-residency
- Z32 AWS Bedrock, cross-Region inference: https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html
- Z33 AWS Bedrock, inference profiles support: https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html
- Z35 Microsoft EU Data Boundary (sprostredkovane, TechCrunch 26. 2. 2025): https://techcrunch.com/2025/02/26/microsoft-finalizes-its-eu-sovereign-cloud-project/
- Z38 OWASP Top 10 for LLM Applications 2025: https://genai.owasp.org/llm-top-10/
- Z47 GDPR čl. 5: https://gdpr-info.eu/art-5-gdpr/
- Z48 GDPR čl. 25: https://gdpr-info.eu/art-25-gdpr/
- Z49 GDPR čl. 44: https://gdpr-info.eu/art-44-gdpr/
- Z50 GDPR čl. 15: https://gdpr-info.eu/art-15-gdpr/
- Z39 HL7 FHIR R4 AuditEvent: https://www.hl7.org/fhir/R4/auditevent.html ; IHE BALP: https://profiles.ihe.net/ITI/BALP/index.html

**Súťaž a naše podklady**
- Z40 Rakathon 2026, Pravidla a podmínky účasti v1.0 (účinné od 23. 6. 2026): https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf
- Z41 Zadani_ulohy.docx (VZP, „Všechna data jsou fiktivní…“): `docs/materials/drive/cesta-pacienta-data/Zadani_ulohy.docx`
- Z42 Naše podklady: `docs/kontext/raw-dataflow.md`, `docs/kontext/raw-audit-hry.md`, `docs/research/02-prehack-prednasky.md`, `docs/research/04-slack-vyzvy-a-pravidla.md`
- Z45 Verejné zákazky v nemocniciach (sprostredkovane, výsledky vyhľadávania; prípad IKEM/NKÚ): https://ekonomickydenik.cz/hrane-zakona-zadavatele-verejnych-zakazek-ve-zdravotnictvi-bojuji-pravni-nejistotou-i-medialnim-obrazem/
- Z46 Zasílání výsledků laboratorních vyšetření e-mailem (ePravo, 2013, staré): https://www.epravo.cz/top/clanky/k-moznosti-zasilani-vysledku-laboratornich-vysetreni-formou-emailu-88463.html

**Čo som nesledoval:** verejné odporúčania ÚOOÚ k AI v zdravotníctve, vzory DPA konkrétnych nemocníc (nenašiel som verejný vzor), zákon 110/2019 Sb., zákon 134/2016 Sb., plný text zákona 372/2011 mimo §45–§66, text vyhlášky 412/2025.
