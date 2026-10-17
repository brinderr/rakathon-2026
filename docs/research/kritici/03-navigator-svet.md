# 03 – Pohľad navigátorky (USA/UK/Kanada)

## Verdikt
V tom, čo svetové navigačné nástroje nevedia, je appka pred nimi: pri každom údaji má doslovný citát, ukáže rozpory a stav k dátumu. V tom, čo navigátorka robí celý deň (pracovný zoznam, prekážky, kontakt s pacientkou, dôvody meškania), za nimi zaostáva, lebo dnes pripravuje podklad pre MDT, ale pacientku cestou nevedie. Najviac získame za najmenej práce, ak ten istý motor s citátmi pustíme aj na prekážky a dôvody meškania: v správach Aleny už sú a VZP z nich uvidí, kde a prečo sa strácajú dni.

## Top nálezy

**1. Prekážky (barriers) appka neeviduje**
- Problém: navigátorka s prekážkami pracuje celý deň. Appka sleduje kroky, ale nie to, prečo ich pacientka nemusí zvládnuť.
- Dôkaz:
  - Správa 07 uvádza „SA: vdova, žije sama, dcera bydlí v téže obci“, „t. č. v pracovní neschopnosti“ a „prosím o zvážení psychologické podpory“.
  - CT bolo v Nemocnici Severní (Praha 8), biopsia v Lipovej (Praha 4), pacientka býva v Dolních Břežanoch.
  - AONN+: v priemere 2,2 prekážky na pacienta, najčastejšie praktické (34 %; doprava, práca, obavy). S nimi pacienti čakali na liečbu 56 dní, priemer bol 43 dní (https://www.jons-online.com/issues/2020/june-2020-vol-11-no-6/navmetrics-initial-study-results-begin-to-shed-light-on-value-of-navigation-metrics).
  - V Epic programe RWJBarnabas malo aspoň jednu prekážku 98 % pacientov (https://www.jons-online.com/issues/2025/december-2025-vol-16-no-12/using-an-epic-based-barriers-to-care-assessment-to-guide-care-navigation-in-a-large-oncology-service-line).
- Zmena:
  - V Prehľade pribudne blok „Překážky“.
  - Motor navrhne kandidátov s citátom: žije sama, pracovná neschopnosť, úzkosť, dva kroky po sebe v rôznych nemocniciach.
  - Kategórie podľa AONN: praktické, emočné, fyzické, finančné, rodinné.
  - Koordinátorka klikne „potvrdit → úkol“ (napr. „doprava na CT 8. 10. – pomůže dcera?“) alebo „není překážka“.
  - Potvrdené prekážky idú do poľa „Jiná důležitá sdělení“.
- Dopad: **vysoký**. AI pracuje aj mimo šablóny, je to inovácia a VZP to v praxi využije.
- Práca: 2 h.

**2. Meškanie bez dôvodu**
- Problém: Cesta ukáže „4 dni po termíne · urgované 16. 10.“, ale nezapíše prečo ani u koho. Neukáže ani intervaly.
- Dôkaz:
  - shots/04.
  - Škótsko pri každom prekročení lehoty vyžaduje časovú os, odpoveď na otázku, či sa mu dalo predísť, a „Clinical or social reasons“. Tlaky na služby odhaľujú týždenné porady nad zoznamom (https://gov.scot/publications/once-scotland-cancer-waiting-times-effective-breach-analysis-2023).
  - MZ od koordinátora chce, aby hlásil systémové prekážky (docs/kontext/raw-cz-system.md §3.2).
- Zmena:
  - Pri meškajúcom kroku jedným klikom vybrať dôvod: kapacita pracoviska / chýba podklad / pacientka / preobjednané.
  - Panel „Kde se ztrácejí dny“: čas od vyžiadania po výsledok oproti termínu, ktorý sľúbilo samotné pracovisko (shots/06: histológia „do 3 pracovných dní“). Bez zahraničných noriem.
- Dopad: **vysoký**. Dáta pre platiteľa a argument pre škálovateľnosť.
- Práca: 1–1,5 h.

**3. Fronta sú karty, navigátorky pracujú zo zoznamu**
- Problém: 5 veľkých kariet. Pri desiatkach otvorených prípadov sa v nich nedá orientovať.
- Dôkaz:
  - shots/01, `Queue.tsx` (`className="cards"`).
  - Cerner „Oncology Navigator Worklist“ zobrazí dôležité údaje o pacientoch priamo v zozname (https://hi.northernlighthealth.org/Flyers/Non-Providers/Oncology/Clinical-Staff/Oncology-Navigator-Worklist.aspx).
  - Epic má „Navigation Tasks“ s reportom budúcich, aktuálnych a meškajúcich úloh (https://epicsupport.sites.uiowa.edu/node/1611).
  - NHS sleduje pacientov na čakacom zozname PTL (https://standards.nhs.uk/published-standards/cancer-62-day-patient-tracking-list).
- Zmena:
  - Predvolená tabuľka so stĺpcami: Pacient · Dg (C25/C34 rýchla cesta) · Deň od žiadanky · Ďalší krok · Na ťahu · Termín · Meškanie · Posledný kontakt.
  - Zoradenie podľa termínu.
  - Ranný prehľad ostane, karty budú v prepínači.
- Dopad: **stredný**. Slide 9 chce „stav, termín, kto je na ťahu“ na jeden pohľad.
- Práca: 1–1,5 h.

**4. Distres sa zachytí až po konzíliu**
- Problém: Teplomer distresu 8/10 a HADS (dotazník úzkosti a depresie) 14/12 prídu až v správe 13 z 27. 10. Praktik pritom žiadal psychologickú podporu už 2. 10.
- Dôkaz:
  - V USA je skríning distresu povinný štandard CoC 5.2 (https://www.accc-cancer.org/education-and-resources/practice-management-operations/fundamentals/comprehensive-care/psychosocial-oncology-care).
  - Hranica ≥ 4 je overená na 1 108 pacientoch (https://pubmed.ncbi.nlm.nih.gov/23423789/).
- Zmena:
  - Do pripravovaného „Zapsat telefonát“ pridať nepovinný riadok „Teploměr distresu 0–10 (uvedla pacientka)“.
  - Pri hodnote ≥ 4 vznikne úloha „nabídnout kontakt na psychoonkologii / informovat lékaře“. Je to administratívny krok, nie diagnóza.
- Dopad: **stredný**.
- Práca: 0,5–1 h.

**5. Kontakt s pacientkou nie je samostatný záznam**
- Problém: chýba pokus o kontakt (dovolala sa / nedovolala sa), „ďalší kontakt do“ a v hlavičke údaj, kto smie dostávať informácie.
- Dôkaz:
  - shots/02, shots/06.
  - V Epicu navigátorky dokumentujú v samostatnom „Patient Outreach encounter“ (U Iowa, odkaz vyššie).
  - §33 zák. 372/2011 Sb.: pacient určí, kto smie byť informovaný, a záznam o tom je súčasťou dokumentácie (https://www.zakonyprolidi.cz/cs/2011-372).
  - Správa 07: „Souhlasí se sdílením informací s dcerou.“
- Zmena:
  - V hlavičke „Smí být informována: Petra Horká (dcera) · souhlas, zpráva 07“.
  - Telefonát doplniť o kanál, výsledok a „další kontakt do“. Výsledok sa prenesie do stĺpca „Posledný kontakt“.
- Dopad: **stredný** (kritérium 2, regulácia).
- Práca: 1 h.

## Nové nápady zo sveta
1. **„Předat zástupu“**
   - Prečo: KOC majú 1–3 koordinátorky (docs/kontext/raw-koordinatori-pocty.md). Pri dovolenke alebo chorobe sa informácie strácajú, čo je presne téma výzvy.
   - Zdroje:
     - Štruktúrované odovzdanie I-PASS znížilo počet chýb o 23 % a odovzdanie netrvalo dlhšie (https://doi.org/10.1056/NEJMsa1405556).
     - NHS sa pýta, ako sa zaistí kontinuita, keď má pacient viac kontaktných osôb (https://www.england.nhs.uk/wp-content/uploads/2019/07/B1332-NHS-Cancer-Programme-Faster-Diagnosis-Framework-v5.pdf).
   - V appke: ku každému otvorenému prípadu 4 riadky s citátmi:
     - stav,
     - na čo čakáme, od koho a do kedy,
     - rozpory a prekážky,
     - čo urobiť, ak…
   - Práca: 1,5 h.
2. **„Vaše koordinátorka a vaše kroky“**
   - Zdroje:
     - V ontárskych diagnostických programoch hodnotili pacienti, ktorí poznali svojho navigátora, skúsenosť dobre aj pri dlhom čakaní (https://pxjournal.org/journal/vol2/iss2/12).
     - NHS chce, aby navigátor dal pacientom a blízkym „an overall timeline“ (FDF, odkaz vyššie).
   - V appke: z Cesty jedna strana v jednoduchej češtine. Obsahuje meno a telefón koordinátorky a kroky s dátumom a miestom, len podľa zdrojov. Dá sa vytlačiť alebo poslať dcére podľa súhlasu.
   - Práca: 1 h.
3. **Týždenná porada nad meškaním (na nedeľu)**
   - Stránka zoskupí meškajúce kroky podľa pracoviska a dôvodu z nálezu 2. Škótsky vzor, odkaz vyššie.
   - Práca: 1,5 h.
4. **Upraviteľná mapa cesty (na nedeľu)**
   - Diagnostické programy v Ontáriu postupujú podľa „Diagnostic Pathway Map“ od Cancer Care Ontario (https://pmc.ncbi.nlm.nih.gov/articles/PMC7908893).
   - V appke: diagnóza C25 ako dátový súbor krokov a závislostí, ktorý si KOC upraví samo.
5. **Do pitchu: záznam o koordinovaní ako auditná stopa k výkonu 51887**
   - Medicare od roku 2024 platí navigáciu (G0023) a vyžaduje zdokumentovaný súhlas (https://www.aafp.org/practice-operations/billing-and-coding/g0023-g0024-g0140-g0146-pin-codes).
   - Len ako veta v pitchi, v appke žiadne koruny.

## Čo nerobiť
1. **AI skóre rizika ani poradie podľa rizika.**
   - Dôkazy o zoznamoch rizikových pacientov od Jvionu pochádzajú od výrobcu (https://www.onclive.com/view/ai-system-helps-guide-care-for-highrisk-patients-in-oncology).
   - Model sepsy od Epicu pri nezávislom overení prehliadol 67 % prípadov (https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2781313).
   - Poradie nech zostane len podľa termínov.
2. **Portál pacienta s triážou symptómov (ako Navigating Cancer).**
   - Patrí do fázy liečby a triáž robia sestry (https://cjon.ons.org/publications-research/voice/news-views/03-2026/evolving-role-nursing-triage-oncologys-fast-paced).
   - Český koordinátor nemusí byť zdravotník (Věstník MZ 11/2025, Čl. 6, https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf).
3. **Dlhé dotazníky potrieb ako formulár** (napr. Macmillan HNA).
   - Zadanie hovorí „Nevytvárať ďalší rozsiahly formulár“.
   - Prekážky navrhne motor, človek ich len potvrdí. Navyše sa pýtame jedine na teplomer distresu.
