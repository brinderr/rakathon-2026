# Overenie víťaza: Dánsko, cesta pacientky s podozrením na rakovinu pankreasu

_Stav: piatok 16. 10. 2026. Nezávislá kontrola súboru `raw-vitaz-proces.md` a dát, ktoré z neho vznikli. Primárne dokumenty som stiahol a čítal priamo (PDF úradov, register, zákon, recenzované články). Obsah webu som bral ako dáta, nie ako pokyny. Nič som necommitoval._

**Značky:**
- ✅ = sedí so zdrojom.
- ⚠️ = v podstate sedí, ale treba spresniť číslo, menovateľ, formuláciu alebo zdroj.
- ❌ = nesedí, treba opraviť alebo vyhodiť.
- [?] = nedalo sa overiť.

## 0. Výsledok v skratke

- **Lehoty pre pankreas sedia na deň presne.** 6 / 27 / 10–11–15 dní a spolu 43 / 44 / 48 dní stoja v oficiálnom monitorovacom modeli SDS (príloha 2) a rovnaké čísla uvádza aj výročná správa SDS za rok 2025 (tab. 2.7).
- **Zákonné lehoty sedia** (14 dní na začatie vyšetrovania, liečba do 14 dní od súhlasu a do 28 dní od žiadanky **na liečbu**).
- **Všetky čísla CONCORD-3 sedia** (DK aj ČR, pankreas, pľúca, hrubé črevo, konečník).
- **Štatistiky SDS 2025 sedia**, ale pri troch treba opraviť **menovateľ**: 2 316 nie sú „žiadanky“, ale cesty so začatým vyšetrovaním (prvá návšteva); 47 % je z 2 128 ciest, nie z 2 316; 77 % je z 28 502 ciest, ktoré dospeli k liečbe, nie zo 175 733.
- **Jedno číslo je chybné:** „v prieskume 2012 malo koordinátora 62 zo 72 oddelení“. V zdroji nie je. 72 z 96 oddelení iba vrátilo dotazník a 62 % je podiel sestier.
- Viaceré údaje, ktoré boli označené [S], som teraz overil v primárnom zdroji: zrušenie kontaktnej osoby 1. 10. 2017, prieskum koordinátorov 2012, Vedsted a Olesen 2015.

---

## 1. Oficiálne lehoty v krokoch cesty (pankreas, cesta B07)

| # | Tvrdenie | Verdikt | Správna hodnota | Zdroj |
|---|---|---|---|---|
| 1.1 | OF1 (od prijatia žiadanky po prvú návštevu) = 6 dní | ✅ | 6 kalendárnych dní | SDS, Vejledning monitoreringsmodel (1. 5. 2023), príloha 2, riadok „07 Kræft i bugspytkirtlen“: https://cdn1.gopublic.dk/sundhedsdatastyrelsen/media/16379/Monitoreringsmodel%20Organspecifik%20kraeft.pdf |
| 1.2 | OF2 (vyšetrovanie po rozhodnutie) = 27 dní | ✅ | 27 dní (OF2A diagnóza potvrdená aj OF2B vyvrátená) | to isté |
| 1.3 | OF3 = 10 (operácia) / 11 (chemo) / 15 (žiarenie) dní | ✅ | 10 / 11 / 15 | to isté |
| 1.4 | OF4 = 43 / 44 / 48 dní | ✅ | 43 / 44 / 48. Platí aj v 2025: „Standardforløbstid: Kirurgisk: 43 dage, Medicinsk: 44 dage og Strålebehandling: 48 dage“ | SDS, årsopgørelse 2025 (12. 6. 2026), tab. 2.7: https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf |
| 1.5 | Lehoty sú v kalendárnych dňoch | ✅ | „Standardforløbstiderne er angivet i kalenderdage“ | SDS model 2023, príloha 2 |
| 1.6 | Súčet a dni Aleny: 10 → 16 → 43 → 53 / 54 / 58 | ✅ | 10 + 6 = 16; 16 + 27 = 43; 43 + 10 / 11 / 15 = 53 / 54 / 58 [náš výpočet]. Deň 10 a deň 36 sú ilustrácia, je to správne označené | – |
| 1.7 | Kódy AFB07A, B, C, F1/F2/F3, X1 | ⚠️ | A = žiadanka do cesty prijatá, B = prvá návšteva, F1 = operácia, F2 = liečba liekmi, F3 = žiarenie, X1 = podozrenie vyvrátené: ✅. **Rozhodnutie nie je „AFB07C“, ale AFB07C1** („beslutning: tilbud om initial behandling“). Varianty: C1A (liečba v zahraničí), C2* (liečba nie je relevantná). OF3 sa počíta od C1. Existujú aj X2 (želanie pacienta) a X9 (iný dôvod) | SDS model 2023, kap. 3.1 a 4 |
| 1.8 | „Od prijatia žiadanky sa počítajú všetky lehoty“ | ⚠️ | Od AFB07A sa počíta OF1 a celkový čas OF4. OF2 beží od prvej návštevy (AFB07B), OF3 od rozhodnutia (AFB07C1) | SDS model 2023, kap. 4 |
| 1.9 | Od 8/2021 sa za príchod počíta aj virtuálny kontakt | ✅ | „fysisk fremmøde inkluderer virtuel kontakt med sundhedsfagligt indhold“, august 2021 | SDS model 2023, kap. 1.16 |
| 1.10 | Od 2/2023 sa cysty (okrem pseudocýst) nepočítajú ako vstupné kritérium | ✅ | Platí od februára 2023. Pozor: stránka Region H (akt. 7. 12. 2022) ešte píše, že cysty sa majú posielať do cesty, takže je zastaraná | SDS 2023 a SDS 2026; sundhed.dk Region H |
| 1.11 | Zákon: vyšetrovanie musí **začať** do 14 dní od prijatia žiadanky | ✅ | „udredning … opstartes senest 14 dage efter, at sygehuset har modtaget henvisningen til udredning“. Základ: sundhedsloven § 88 a vyhláška č. 584 z 28. 4. 2015 | Danske Regioner, faktaark 12. 4. 2024: https://www.regioner.dk/media/rupbf04u/faktaark-hvad-er-de-maksimale-ventetider.pdf |
| 1.12 | Zákon: liečba do 14 dní od súhlasu a do 28 dní od žiadanky | ⚠️ | Sedí, ale 28 dní sa počíta od prijatia **žiadanky na liečbu** („henvisningen til behandling“), nie od pôvodnej žiadanky na vyšetrovanie. V súhrne to treba dopísať. Rovnako to platí pre doliečbu | to isté; Rigsrevisionen 13/2023 |
| 1.13 | „Inak musí región ponúknuť inú nemocnicu (iný región, súkromnú, zahraničnú)“ | ⚠️ | Sedí, ale **len keď lehotu nestihne z kapacitných dôvodov**. Ak nenájde nič, nastupuje Sundhedsstyrelsen. Lehota neplatí pri zdravotnom dôvode alebo pri želaní pacienta | Danske Regioner 2024 |
| 1.14 | Štandardné lehoty nie sú právo, sú „rettesnor“ (smerodajná hodnota) | ✅ | „Forløbstiderne er dermed ikke en ny rettighed, men de kan bruges som en rettesnor“ | Leták Region Nordjylland, január 2010: https://rn.dk/-/media/Rn_dk/Sundhed/Patient-i-Region-Nordjylland/Hospitaler/Pjecer-om-pakkeforløb-for-kræft/Pakkeforløb-for-bugspytkirtelkræft.pdf |
| 1.15 | Diagnostická cesta (nešpecifické príznaky): štandard 22 dní, 2025 splnené 84 % z 9 952 | ✅ | DF3 = 22 dní, 84 %, n = 9 952 | SDS 2026, tab. 4 |
| 1.16 | Filter u praktika: výsledky do 4 pracovných dní, rozhodnutie do 8 pracovných dní | ✅ (zmeniť [S] na [V]) | „sent electronically to the GP within four working days“, rozhodnutie do 8 pracovných dní | Vedsted P, Olesen F, Br J Cancer 2015;112(Suppl 1):S65–S69: https://pmc.ncbi.nlm.nih.gov/articles/PMC4385978/ |
| 1.17 | Pre krok „praktik → ultrazvuk“ a pre epikrízu praktikovi oficiálna lehota neexistuje | ✅ (nenašiel som ani ja) | [?] | – |
| 1.18 | Chemoterapia po operácii zvyčajne 2–3 týždne po nej | ✅ | „kemoterapi, som indledes 2-3 uger efter operationen“ (leták 2010, starý) | RN 2010 |
| 1.19 | Celý text opisu cesty na sst.dk nedostupný | ✅ (rovnako u mňa) | sst.dk vracia HTTP 429 a bezpečnostnú kontrolu proti robotom. Neobchádzal som ju. Lehoty potvrdzujú dva oficiálne dokumenty SDS, takže to nevadí | – |

---

## 2. Štatistiky v tabuľke (Dánsko aj ČR)

| # | Ukazovateľ | Tvrdenie | Verdikt | Správna hodnota | Zdroj |
|---|---|---|---|---|---|
| 2.1 | CONCORD-3, pankreas | DK 8,0 %, ČR 6,1 % | ✅ | DK 8,0 (7,0–9,1), ČR 6,1 (5,4–6,7); diagnózy 2010–2014, vekovo štandardizované čisté 5-ročné prežitie | Allemani a kol., Lancet 2018;391:1023–75, tab. 5: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/ |
| 2.2 | CONCORD-3, pľúca | 16,6 / 10,6 % | ✅ | DK 16,6, ČR 10,6 | to isté |
| 2.3 | CONCORD-3, hrubé črevo / konečník | DK 61,6 / 64,8, ČR 56,1 / 52,3 | ✅ | presne tak | to isté |
| 2.4 | URL pre CONCORD-3 | ti.ch | ⚠️ | Odkaz www4.ti.ch vracia stránku ochrany proti robotom, nie PDF. Nahradiť odkazom PMC (vyššie) | – |
| 2.5 | DK pankreas, národné dáta | ženy 14 %, muži 17 % (2022–24) | ✅ | ženy 14 (12–16), muži 17 (15–19); vekovo štandardizované relatívne 5-ročné prežitie. 1-ročné: ženy 40, muži 39 | SDS, Kræftoverlevelse i Danmark 2010–2024 (26. 2. 2026), tab. 1 a 2: https://cdn.sundhedsdatastyrelsen.dk/sundhedsdatastyrelsen/Media/639076903175066575/kraeftoverlevelse-i-danmark-2010-2024.pdf |
| 2.6 | ČR pankreas, národné dáta | 9,3 % všetci, 12,6 % liečení (2015–19) | ✅ | 9,3 (8,6–10,0) a 12,6 (11,5–13,8). ÚZIS používa relatívne prežitie (Ederer), metóda je iná ako v SDS, takže „neporovnávať priamo“ je správne | ÚZIS, Novotvary 2019–2021, tab. 3.11.1: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf |
| 2.7 | DK všetky rakoviny (bez nemelanómovej kože) | ženy 74 %, muži 71 % (2022–24) | ✅ | 74 / 71 % | SDS 2026, kap. 1.2 |
| 2.8 | Úmrtnosť na rakovinu na 100 000 | DK 271, ČR 257 (2021) | ✅ | Sedí. Do popisu doplniť „**vekovo štandardizovaná**“ a priemer EÚ **235** | OECD/EK Country Cancer Profile 2025, DK: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-dk-2024-1664-en.pdf ; ČR: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf |
| 2.9 | DK pankreas: objem | „2 316 začatých ciest B07“ | ⚠️ | 2 316 = cesty so **začatým vyšetrovaním**, teda prvou návštevou (kód AFB07B), nie prijaté žiadanky. 2024: 2 077 | SDS 2026, tab. 1f a jej poznámka |
| 2.10 | DK pankreas: podiel vyvrátených podozrení | „z 2 316 ciest v 47 % vyvrátené“ | ⚠️ | **47 % z 2 128** ciest, ktoré dospeli k rozhodnutiu o liečbe alebo k vyvráteniu (ukazovateľ OA1), nie z 2 316 | SDS 2026, tab. 2.7 |
| 2.11 | ČR pankreas: objem | 2 393 nových prípadov, 2 343 úmrtí (2021) | ✅ | presne tak | ÚZIS Novotvary 2019–2021 |
| 2.12 | Národná cesta s lehotami | „26 orgánových + 2 diagnostické“, zdroj SDS 2023 | ⚠️ | Číslo 26 je od **Rigsrevisionen** („I april 2023 var der 26 pakkeforløb, der dækker ca. 40 kræftsygdomme“), nie zo SDS. SDS monitoruje **31 číslovaných orgánových ciest** (jeden opis môže mať viac čísel; pankreas B07, žlčové cesty B08 a pečeň B10 majú spoločný opis). Diagnostické cesty sú 2 ✅. Výpočet 6 + 27 + 10/11/15 ✅ | Rigsrevisionen 13/2023, s. 18–19: https://cdn.rigsrevisionen.dk/rigsrevisionen/Media/638487768194279679/SR1323.pdf ; SDS model 2023, kap. 2 a príloha 1 |
| 2.13 | ČR: národná cesta s lehotami | „nie“ | ✅ | OECD: „Waiting times for cancer care are not monitored and evaluated systematically in Czechia.“ | OECD ČR 2025, s. 22 |
| 2.14 | Podiel pacientov primárne v orgánovej ceste | 40–45 % | ✅ (zmeniť [S] na [V]) | „on average only 40–45%“ | Vedsted a Olesen 2015 |
| 2.15 | % ciest v štandardnej lehote | 77 % všetky; pankreas 87 / 71 / 57 % | ⚠️ | 77 % ✅, ale je to podiel z **28 502 ciest, ktoré dospeli k liečbe** (OF4), a čísla 2025 sú predbežné. Pankreas: 87 % (n = 254), 71 % (n = 406), 57 % (n = 20) ✅. Celoštátne počty SDS zaokrúhľuje na 5. 2024: 89 / 77 / 47 % | SDS 2026, tab. 1d, 2.7, 2a.7 |
| 2.16 | ČR: >60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT | ✅ ako výrok MZ | „více než 60 % pacientů s karcinomem plic nezahájí léčbu do osmi týdnů od provedení CT“. MZ neuvádza dátový zdroj, preto ostáva [S] | MZ ČR, 2. 9. 2026: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ |
| 2.17 | Zákonná max. lehota DK | 14 / 14 / 28 dní, inak iná nemocnica | ⚠️ | pozri 1.12 a 1.13 (28 dní od žiadanky **na liečbu**, iná nemocnica len pri nedostatku kapacity) | Danske Regioner 2024 |
| 2.18 | Prekročenie zákonnej lehoty, pankreas | 22 % z 2 203 (7/2019–6/2023, vrátane platných dôvodov) | ✅ | presne tak (obr. 6, údaje LPR 1. 7. 2019 – 30. 6. 2023; graf obsahuje platné aj neplatné dôvody) | Rigsrevisionen 13/2023, obr. 6 |
| 2.19 | Čas od žiadanky po rozhodnutie, pankreas | štandard 33 dní (6 + 27) | ✅ | [náš výpočet z SDS 2023] | – |
| 2.20 | ČR výrok koordinátorky FN Bulovka | „minimálne 2 mesiace“, s koordinátorom „2–3 týždne“ | ✅ ako citát | „Standardní cestou to jsou minimálně dva měsíce.“; „během dvou, tří týdnů mít diagnózu“. Je to výrok, nie štatistika (správne označené) | Zdravotnický deník, 4. 6. 2026: https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/ |
| 2.21 | DK národné MDT pankreas | 198 pacientov 2018–20, 24 % operovaných | ✅ | „I alt 48 (24%) ud af de 198 patienter … endte op med resektion efter nMDT“ | DPCD, Ugeskrift for Læger 1/2023: https://content.ugeskriftet.dk/sites/default/files/2023-01/Dansk%20Pancreas%20Cancer%20Database.pdf |
| 2.22 | ČR pokrytie MDT | ~60 % solídnych nádorov v KOC (2022); pankreas sa platí len po MDT | ✅ | „nearly 60% of patients treated for a solid malignant tumour in a KOC for the first time in 2022“; „HIF reimbursement is conditional on an MDT consultation – including pancreatic“ | OECD ČR 2025, s. 21–22 |
| 2.23 | Elektronické žiadanky DK | 6,5 mil. správ MedCom mesačne; REF01 s potvrdením | ✅ | 6,5 mil. (Danske Regioner 2024). REF01 „Sygehushenvisning“, PositivReceipt XCTL03, NegativeReceipt XCTL02 existujú | Danske Regioner, faktaark EPJ 2024: https://regioner.dk/media/bgqfv3xb/faktaark-epj-it-systemer-ssk-apr24.pdf ; MedCom, Kommunestatistik 12/2025: https://medcom.dk/wp-content/uploads/2026/01/kommunestatistik-december-2025.pdf |
| 2.24 | ČR eŽádanka | od 1/2026, vystavenie dobrovoľné, adopcia neznáma | ✅ (podľa predošlej kontroly `raw-factcheck.md`) | stránku Zdravé zprávy som teraz neotvoril (blokovaná doména) | – |
| 2.25 | Sundhedsjournalen | 500 000 unikátnych vyhľadaní pacientov mesačne | ✅ | „500.000 unikke patientopslag i Sundhedsjournalen om måneden“ | Danske Regioner 2024 |
| 2.26 | ČR: ePACS asi 4 % vyšetrení (2018) | ✅ | viac ako 640 000 vyšetrení v 2018, asi 4 % všetkých | Bruthans J, Appl Clin Inform 2020, doi:10.1055/s-0040-1701252 (podľa výsledku vyhľadávania, plný text som neotvoril) [S] |
| 2.27 | PAL | 67 % (cieľ 90 % do 2020) | ⚠️ | Číslo sedí, ale je to **prieskum, ako to pacienti zažili**: 67 % uviedlo, že malo (aj striedajúceho sa) lekára, ktorý plní rolu PAL. Je to **rovnaká úroveň ako v 2017, pred zavedením PAL**. Cieľ 90 % do 2020 je z Kræftplan IV ✅. 31 % niekedy nevedelo, ktorý lekár je zodpovedný ✅. Prieskum: n = 3 070, odpovedalo 44,6 % | Kræftens Bekæmpelse, Barometerundersøgelse 2023, del 1: https://edagsorden.regionh.dk/cms/HtmlPublication-8622/enclosures/6.pdf |
| 2.28 | Zodpovednosť na pacientovi / výsledky meškali alebo sa stratili | 12 % / 6 % | ✅ | 12 % musel prevziať časť zodpovednosti (ďalších 6 % v menšej miere), n = 2 943; 6 % zažilo, že výsledky meškali alebo sa stratili | Barometer 2023, s. 13 |
| 2.29 | Koordinátori DK | povinný od 2010/2012, 62 % sestry (2012) | ✅ (zmeniť [S] na [V]) | „I 2010 blev det vedtaget at indføre … forløbskoordinatorfunktioner“ (Kræftplan III); 62 % sestry, 26 % sekretárky a iní, 12 % lekári; prieskum jún 2012 | Axelsen KR a kol., Ugeskr Læger 2015;177:1175: https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2015-06/artikel_5945.pdf |
| 2.30 | Koordinátori ČR | min. 1,0 úväzku na KOC (min. 15 v 15 KOC); 250 Kč za výkon 51887; zdroj Věstník 11/2025 | ⚠️ | Čísla sedia. Zdroj pre **250 Kč nie je Věstník**, ale **úhradová vyhláška 432/2025 Sb., bod 8.5** (a MZ 2. 9. 2026). Věstník 11/2025 hovorí o 1,0 úväzku a vzdelaní. 15 KOC pre dospelých (+ 2 pre deti) | `raw-factcheck.md` a `raw-vykon-51887.md`; MZ 2. 9. 2026 |
| 2.31 | (len v súbore) Dodržanie zákonných pravidiel 99,8 % zo 64 442 ciest (4–6/2024) | ✅ | „In 99.8% of cases, the rules on the maximum waiting times rules were respected.“ | OECD DK 2025 |

---

## 3. Role a systémy: počty a názvy

### 3.1 Role

| # | Rola a tvrdenie | Verdikt | Správna hodnota | Zdroj |
|---|---|---|---|---|
| 3.1 | Praktik: zapísaných asi 98 % obyvateľov | ✅ [S] | 98 % (viac sekundárnych zdrojov) | výsledok vyhľadávania (JABFM 2012, prílohy BMC) |
| 3.2 | Príjem žiadaniek: Region H „CVI“, Nordjylland chirurgia tráviaceho traktu Aalborg | ✅ | Region H: „Henvisning sendes til CVI (brug den dynamiske henvisning)“. Nordjylland: „Mavetarm-Kirurgisk Afd., Aalborg UH“ (stránka aktualizovaná 12. 6. 2026). Význam CVI [?] | sundhed.dk Region H a Region Nordjylland |
| 3.3 | Praktik musí pacientovi povedať o podozrení a zapísať to do žiadanky | ✅ | „Pt skal være informeret om, at der er mistanke om kræft, hvilket også skal anføres på henvisningen“ | sundhed.dk Region H (akt. 7. 12. 2022) |
| 3.4 | „Povinný obsah žiadanky“ | ⚠️ | Oba regióny píšu „**bør** indeholde“ (má obsahovať), nie „skal“. Region H: diagnóza (obs pro), anamnéza a podozrenie, nález, vyšetrenia vrátane krvi, liečba, lieky, čo bolo povedané pacientovi, komorbidity, telefón. Region Nordjylland navyše: antikoagulačná liečba, perorálne antidiabetiká, alergia, potreba tlmočníka. Telefón je len v Region H | sundhed.dk Region H; Region Nordjylland |
| 3.5 | Forløbskoordinator: 62 / 26 / 12 %; ~10 % sleduje pacienta cez celú cestu; 46 % chodí na MDT | ✅ | presne tak; 42 % na MDT chodí zriedka alebo nikdy | Axelsen a kol. 2015 |
| 3.6 | (len v súbore, tabuľka rolí) „v prieskume 2012 malo koordinátora 62 zo 72 oddelení“ | ❌ | V zdroji nie je. Správne: **72 z 96 oddelení vrátilo dotazník** (107 dotazníkov, 90 úplných). Asi polovica oddelení mala 1 koordinátora, 36 % dvoch a viac, 14 % funkciu pridalo existujúcim pozíciám | Axelsen a kol. 2015 |
| 3.7 | Kontaktná osoba zrušená 1. 10. 2017 | ✅ (zmeniť [S] na [V]) | zákon L 167 A, prijatý 18. 5. 2017: „Kapitel 23 a ophæves“, „Loven træder i kraft den 1. oktober 2017“ | https://www.retsinformation.dk/api/pdf/191229 |
| 3.8 | PAL od 2017 | ✅ [S] | zavádzanie od 2017, najprv onkologickí pacienti | výsledok vyhľadávania (dokumenty Folketingu k L 167); `raw-krajina-dk.md` |
| 3.9 | MDT regionálne 1–3× týždenne, často virtuálne | ✅ | „typisk 1-3 gange ugentligt … ofte med virtuel deltagelse på tværs af hospitaler“ | List a kol., Ugeskr Læger 2025;187:V10250788: https://content.ugeskriftet.dk/sites/default/files/V10250788_WEB.pdf |
| 3.10 | Národné MDT pre pankreas „na Rigshospitalet od 8/2018“, „hraničné prípady“ | ⚠️ | Od augusta 2018 ✅, kód ZZ0190D3 ✅, automatický formulár v DPCD pre pacientov od 1. 1. 2022 ✅. DPCD píše: pacienti **bez metastáz**, posúdenie možnosti operácie; **Rigshospitalet zodpovedá za zápis dát**. „Hraničné“ (borderline) má len prezentácia Rigshospitalet 2026 [S]. Pokyn Sundhedsstyrelsen je z apríla 2019 | DPCD 2023; SST „National MDT konference ved kræft i bugspytkirtlen“, apríl 2019 (len obsah, cez vyhľadávanie) |
| 3.11 | Patientvejleder v každom regióne, mlčanlivosť | ✅ | „I alle regioner er der patientvejledere … tavshedspligt“ | RN 2010 |
| 3.12 | „Rigsrevisionen: ostrá kritika (2024)“ | ⚠️ | „Påtaler skarpt“ (ostrá kritika) napísali **Statsrevisorerne** 15. 4. 2024 na základe správy Rigsrevisionen | Rigsrevisionen 13/2023, s. II |
| 3.13 | „98 % pacientov, ktorým región nevedel dať liečbu načas, nedostalo správnu ponuku“ | ⚠️ | Sedí, ale je to **podľa výkladu ministerstva**. Regióny s výkladom nesúhlasia. Pri asi 3 300 cestách je spor, či ponuka spĺňala zákon. V 2 % vzorky dostal pacient reálnu ponuku inej nemocnice | Rigsrevisionen 13/2023, bod 35–37 |
| 3.14 | ČR koordinátor: bez zdravotníckeho vzdelania, K1/K2/K3, Bulovka asi 10 pacientov týždenne, Olomouc 15–20 | ✅ / [S] | Bulovka: „V průměru jde asi o 10 pacientů týdně“ ✅. Olomouc [S] | ZD 4. 6. 2026; `raw-factcheck.md` |

### 3.2 Systémy

| # | Systém a tvrdenie | Verdikt | Správna hodnota | Zdroj |
|---|---|---|---|---|
| 3.15 | LPR: „175 733 ciest začatých v 2025 … 77 % v lehote“ | ⚠️ | 175 733 = cesty so **začatým vyšetrovaním** (prvá návšteva), 2024: 168 442. 77 % je zo **28 502** ciest s liečbou (OF4), nie zo 175 733 | SDS 2026, tab. 1f a 1d |
| 3.16 | LPR: „5 typov udalostí“ | ✅ s poznámkou | Na OF1–OF4 a OA1 stačí A, B, C1, F*, X1. Register má aj C1A, C2*, X2, X9 | SDS model 2023, kap. 3.1 |
| 3.17 | Nemocničné EHR: Epic v 2 regiónoch, Systematic v 3; z viac ako 20 systémov na 2 dodávateľov (2024) | ✅ | Hovedstaden a Sjælland: Sundhedsplatformen (Epic). Midtjylland **Midt EPJ**, Syddanmark **EPJ SYD**, Nordjylland **NordEPJ** (všetky od Systematic). „flere end 20 forskellige systemer“ za čias žúp | Danske Regioner 2024 |
| 3.18 | Sundhedsjournalen: 500 000 vyhľadaní; 4 % ciest cez hranicu regiónu, 54 % cez hranicu sektora | ✅ | presne tak („4% af alle behandlingsforløb … 54% går på tværs af sektorer“) | Danske Regioner 2024 |
| 3.19 | Sundhedsjournalen: „laboratórium v reálnom čase, zápisy, epikrízy, popisy snímok, termíny“ | ⚠️ | Zdroj uvádza: laboratórne výsledky v reálnom čase, chorobopis (patientjournal), zoznam liekov, očkovania, popisy rádiologických vyšetrení „a mnoho ďalšieho“. **Epikrízy a termíny v tomto zdroji nie sú** [?] | Danske Regioner 2024 |
| 3.20 | MedCom: REF01, XCTL02/03, epikrízy; FHIR od 2024, začína sa žiadankami | ✅ | REF01 „Sygehushenvisning“, XCTL03 PositivReceipt, XCTL02 NegativeReceipt. FHIR roadmapa a analýza modernizácie žiadaniek spolu s DNHF (zápisnica 30. 4. 2024) | MedCom 12/2025; MedCom13 styregruppe: https://medcom.dk/wp-content/uploads/2024/04/Referat-af-5.-moede-i-MedCom-13-styregruppe.pdf |
| 3.21 | MedCom: „takmer 7,5 mil.“ správ mesačne | [?] | Nepodarilo sa overiť. Používať 6,5 mil. (Danske Regioner 2024) | – |
| 3.22 | DNHF (národné smerovanie žiadaniek) | ✅ | žiadanky s konkrétnym príjemcom (REF01 a i.) idú cez DNHF; objem [?] | MedCom 12/2025 |
| 3.23 | WebReq a FMK | ✅ | „Parakliniske undersøgelser som kan bestilles samlet i WebReq“; „opdateret medicinstatus (FMK)“; „blodprøverne kan nu tages i almen praksis“ (akt. 16. 7. 2024). Popis FMK „v reálnom čase pre nemocnice, praktikov, obce a lekárne“ ostáva [S] | sundhed.dk Region H, Diagnostiske enheder |
| 3.24 | DPCD | ✅ | kód ZZ0190D3, automatický formulár, prospektívny zber od 1. 1. 2022 | DPCD 2023 |
| 3.25 | IBI na snímky medzi regiónmi | [?] | dnešný stav som neoveril | – |
| 3.26 | ČR: ÚZIS meria od prvého zobrazenia, nie od žiadanky | ✅ | „Počet dnů od ‚index data‘ do data diagnózy … od prvního sledovaného zobrazovacího nebo endoskopického vyšetření v intervalu až půl roku před datem stanovení diagnózy“ | ÚZIS, Onco_C25, 20. 11. 2025: https://www.onconet.cz/res/file/otevrena-data/otevrena-data-c25.pdf |

### 3.3 Ďalšie tvrdenia z krokov

| # | Tvrdenie | Verdikt | Poznámka a zdroj |
|---|---|---|---|
| 3.27 | Vstupné kritériá B07 (žltačka, nádor na zobrazení, nejasný proces, recidíva) | ✅ | rovnaké v Region H (2022) aj v Region Nordjylland (2026) |
| 3.28 | Pri nešpecifických príznakoch najprv diagnostická cesta; zobrazenie môže objednať aj praktik | ✅ | „Ptt med uspecifikke almensymptomer bør udredes i …“; „Skanningen kan være initieret af almen praksis …“ (Region H) |
| 3.29 | Bloky vyšetrení A/B/C | ✅ | leták RN 2010 (starý, dnešná verzia [?]) |
| 3.30 | Realita 2025 podľa regiónov (tabuľka v súbore) | ✅ | všetky čísla sedia so SDS 2026, tab. 2.7 a 2a.7 |
| 3.31 | Prvá liečba 2025: 257 operácií, 428 chemoterapií, 25 ožarovaní | ✅ | SDS 2026, tab. 1h.1–1h.3. 254 vs 257: do výpočtu OF4 idú len cesty so správnym poradím kódov |
| 3.32 | „Spätná väzba praktikovi sa rieši až v Kræftplan V“ | ⚠️ | Epikríza ide elektronicky cez MedCom už dnes. Kræftplan V (jún 2025) spúšťa projekt na **lepšie** odovzdávanie informácií pri epikrízach a žiadankách, s dôrazom na rakovinu. Digitálny prehľad cesty pre pacienta: vývoj „frem mod 2028“ ✅ (Udmøntningsaftale KPV 2025) |
| 3.33 | Povinnosť zapisovať plán sledovania zrušená v 2024; sledovanie u vlastného lekára od 2027 | ✅ s poznámkou | Zrušila sa **registrácia** plánov v nemocniciach, regióny ich majú robiť ďalej. Ministerstvo: rámec „frem mod 2027, hvor tilbuddet om opfølgning hos egen læge bliver implementeret“ (Rigsrevisionen C122/25) |

---

## 4. Zoznam opráv

1. **2 316** = cesty so začatým vyšetrovaním (prvá návšteva, AFB07B), nie žiadanky.
2. **47 % je z 2 128** ciest (OA1), nie z 2 316.
3. **77 % je z 28 502** ciest s liečbou (OF4, predbežné 2025), nie zo 175 733. 175 733 = cesty so začatým vyšetrovaním.
4. **Kód rozhodnutia je AFB07C1**, nie AFB07C. Varianty C1A a C2*.
5. **„Od AFB07A sa počítajú všetky lehoty“** zmeniť na OF1 a OF4. OF2 beží od B, OF3 od C1.
6. **28 dní** sa počíta od žiadanky **na liečbu**. Ponuka inej nemocnice platí len pri nedostatku kapacity.
7. **„26 orgánových ciest“:** zdroj je Rigsrevisionen 2024 (26 opisov, asi 40 diagnóz). SDS monitoruje 31 číslovaných ciest.
8. **„Povinný obsah žiadanky“** zmeniť na „odporúčaný (bør)“ a rozdeliť položky podľa regiónu.
9. **PAL 67 %** = výpoveď pacientov v prieskume, rovnaká úroveň ako 2017 pred zavedením.
10. **Obsah Sundhedsjournalen** opraviť podľa zdroja (lieky, očkovania, chorobopis). Epikrízy a termíny vyhodiť alebo označiť [?].
11. **„62 zo 72 oddelení malo koordinátora“** vymazať. Správne: 72 z 96 oddelení vrátilo dotazník.
12. **Zdroj 250 Kč:** úhradová vyhláška 432/2025 Sb., bod 8.5, nie Věstník 11/2025.
13. **„Ostrá kritika“** pripísať Statsrevisorerne (15. 4. 2024). **98 %** označiť „podľa výkladu ministerstva“.
14. **Národné MDT:** „pacienti bez metastáz“ (DPCD). Rigshospitalet zodpovedá za zápis dát. „Hraničné“ len [S].
15. **Úmrtnosť:** doplniť „vekovo štandardizovaná“, priemer EÚ 235.
16. **„Spätná väzba až v Kræftplan V“** preformulovať (epikríza ide už dnes, KPV ju má zlepšiť).
17. **MedCom 7,5 mil.** označiť [?], ponechať 6,5 mil.
18. **URL CONCORD-3** nahradiť PMC5879496 (tab. 5).
19. **Zmeniť na [V]:** kontaktná osoba 1. 10. 2017 (L 167 A), prieskum koordinátorov (Axelsen 2015), Vedsted a Olesen 2015.
20. **EHR:** doplniť názvy Midt EPJ, EPJ SYD, NordEPJ.

---

## 5. Čo sa nedalo overiť [?]

- Plný text opisu cesty Sundhedsstyrelsen (sst.dk vracia 429 a kontrolu proti robotom). Lehoty sú overené cez dva dokumenty SDS.
- Význam skratky „CVI“ v Region Hovedstaden.
- MedCom „takmer 7,5 mil.“ správ mesačne.
- Dnešný stav zdieľania snímok medzi regiónmi (IBI).
- Obsah Sundhedsjournalen nad rámec Danske Regioner 2024 (epikrízy, termíny).
- Stránka Zdravé zprávy o eŽádanke (doména blokovaná). Spolieham sa na predošlú kontrolu v `raw-factcheck.md`.
- Plný text Bruthans 2020 (ePACS 4 %) som neotvoril, mám len abstrakt cez vyhľadávanie.

---

## 6. Zdroje, ktoré som v tomto behu čítal

**Dánsko:**
- SDS, Vejledning monitoreringsmodel, pakkeforløb for kræftområdet (1. 5. 2023): https://cdn1.gopublic.dk/sundhedsdatastyrelsen/media/16379/Monitoreringsmodel%20Organspecifik%20kraeft.pdf
- SDS, Monitorering af kræftområdet, årsopgørelse 2025 (12. 6. 2026): https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf
- SDS, Kræftoverlevelse i Danmark 2010–2024 (26. 2. 2026): https://cdn.sundhedsdatastyrelsen.dk/sundhedsdatastyrelsen/Media/639076903175066575/kraeftoverlevelse-i-danmark-2010-2024.pdf
- Danske Regioner, Faktaark maksimale ventetider (12. 4. 2024): https://www.regioner.dk/media/rupbf04u/faktaark-hvad-er-de-maksimale-ventetider.pdf
- Danske Regioner, Faktaark EPJ og datadeling (2024): https://regioner.dk/media/bgqfv3xb/faktaark-epj-it-systemer-ssk-apr24.pdf
- Rigsrevisionen, beretning 13/2023 (apríl 2024): https://cdn.rigsrevisionen.dk/rigsrevisionen/Media/638487768194279679/SR1323.pdf
- Rigsrevisionen, notát C122/25 (11/2025): https://cdn.rigsrevisionen.dk/rigsrevisionen/Media/638999090239949977/C122-25.pdf
- Udmøntningsaftale Kræftplan V (jún 2025): https://www.ism.dk/Media/638926676927162662/KPV-udmoentningsaftale-2025.pdf
- OECD/EK, Country Cancer Profile Denmark 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-dk-2024-1664-en.pdf
- DPCD, Ugeskrift for Læger 1/2023: https://content.ugeskriftet.dk/sites/default/files/2023-01/Dansk%20Pancreas%20Cancer%20Database.pdf
- List H a kol., Ugeskr Læger 2025;187:V10250788: https://content.ugeskriftet.dk/sites/default/files/V10250788_WEB.pdf
- Axelsen KR a kol., Ugeskr Læger 2015;177:1175 (prieskum koordinátorov 2012): https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2015-06/artikel_5945.pdf
- Kræftens Bekæmpelse, Barometerundersøgelse 2023, del 1: https://edagsorden.regionh.dk/cms/HtmlPublication-8622/enclosures/6.pdf
- Zákon L 167 A (afvikling af kontaktpersonordningen), prijatý 18. 5. 2017: https://www.retsinformation.dk/api/pdf/191229
- MedCom, Kommunestatistik december 2025: https://medcom.dk/wp-content/uploads/2026/01/kommunestatistik-december-2025.pdf
- MedCom13 styregruppe, zápisnica 30. 4. 2024: https://medcom.dk/wp-content/uploads/2024/04/Referat-af-5.-moede-i-MedCom-13-styregruppe.pdf
- sundhed.dk Region Hovedstaden, pankreas (akt. 7. 12. 2022): https://www.sundhed.dk/sundhedsfaglig/information-til-praksis/hovedstaden/almen-praksis/patientbehandling/patientforloeb/pakkeforloeb/kraeft-pakker/kreaft-bugspytkirtel-galde-lever
- sundhed.dk Region Hovedstaden, Diagnostiske enheder (akt. 16. 7. 2024): https://www.sundhed.dk/sundhedsfaglig/information-til-praksis/hovedstaden/almen-praksis/patientbehandling/patientforloeb/forloebsbeskrivelser-icpc/a-alment-og-uspecificeret/diagnostiske-enheder/
- sundhed.dk Region Nordjylland, pankreas (akt. 12. 6. 2026): https://www.sundhed.dk/sundhedsfaglig/information-til-praksis/nordjylland/almen-praksis/patientbehandling/patientforloeb/forloebsbeskrivelser/d-fordoejelsesorganer/kraeft-i-bugspytkirtlen-galdeganene-og-lever
- Region Nordjylland, leták o pankrease (január 2010): https://rn.dk/-/media/Rn_dk/Sundhed/Patient-i-Region-Nordjylland/Hospitaler/Pjecer-om-pakkeforløb-for-kræft/Pakkeforløb-for-bugspytkirtelkræft.pdf
- Vedsted P, Olesen F, Br J Cancer 2015;112(Suppl 1):S65–S69: https://pmc.ncbi.nlm.nih.gov/articles/PMC4385978/

**Porovnanie a Česko:**
- Allemani C a kol., CONCORD-3, Lancet 2018;391:1023–75, tab. 5: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/
- ÚZIS, Novotvary 2019–2021: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf
- ÚZIS, Onco_C25 (20. 11. 2025): https://www.onconet.cz/res/file/otevrena-data/otevrena-data-c25.pdf
- OECD/EK, Country Cancer Profile Czechia 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- MZ ČR, 2. 9. 2026: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- Zdravotnický deník, rozhovor s K. Vaňkovou (4. 6. 2026): https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/
- Bruthans J, Appl Clin Inform 2020 (ePACS), doi:10.1055/s-0040-1701252 [S, abstrakt]
