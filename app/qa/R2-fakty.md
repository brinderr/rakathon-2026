# R2 – kontrola faktov (všetky texty, ktoré appka zobrazuje)

Stav: 17. 10. 2026, kód v `app/src` + dáta. **Nič som nemenil.** Overoval som voči `public/data/source.json` (13 správ + šablóny VZP vrátane „MDT zaver“), `docs/ULTIMATNY-SYSTEM.md`, `docs/kontext/raw-*.md`, `docs/IDEALNE-RIESENIE.md` a screenshotom v `design/shots/`.

**Strojová kontrola:** všetkých 81 citátov `cite(...)` v `src/data/cases.ts` je doslovne v texte správy (vlastný skript v scratchpade, `npm run verify` som nespúšťal, lebo zapisuje `cases.json`). Laboratórne hodnoty (27 riadkov z 15. 10., 24 z 1. 9.) a lieky sedia 1 : 1 so správami 02, 07 a 10.

## Prehľad

| # | Závažnosť | Kde | Problém v skratke |
|---|---|---|---|
| 1 | VYSOKÁ | `src/components/Shell.tsx:31` | Koordinátorka „Klára“ nie je v zdrojoch, podpisuje sa „Bc. Lucie Dvořáková“ |
| 2 | VYSOKÁ | `src/pages/GpReport.tsx:160, 173` | „Lehota 2 pracovné dni“ je holandská norma, appka ju podáva ako pravidlo |
| 3 | VYSOKÁ (mimo UI) | `data-pacient-2/*.txt` | „Nemocnice Benešov, Máchova 400“ je zrejme adresa skutočnej nemocnice |
| 4 | STREDNÁ | `src/pages/Queue.tsx:22–24`, `Metrics.tsx:46` | „ČR lehoty nemá“ je príliš silné; pankreasový cieľ sa ukazuje aj pri pľúcach, čreve a prsníku |
| 5 | STREDNÁ | `cases.ts:101, 561`, `ai/rules.ts:139` | Súhrn „patrí“ reviznému lekárovi: povinnosť bez zdroja |
| 6 | STREDNÁ | `GpReport.tsx:35–37, 194` vs `cases.ts:485–486` | Záver odoslaný 21. 10. o 16:40 vs. 22. 10. o 9:00 v zázname |
| 7 | STREDNÁ | `cases.ts:537` | „Ďalší krok: chemoterapia“ znie ako pokyn appky, ide pritom o termín u onkológa |
| 8 | STREDNÁ | `cases.ts:43, 46, 71`, `CaseView.tsx:74, 167–170` | Správa 14 má v texte 20. 10., v appke 19. 10. a je „prijatá“ aj bez žiadosti |
| 9 | STREDNÁ | `CaseView.tsx:171` | „ECOG 1“ sa zobrazí ako potvrdené bez označenia „ukážka“ |
| 10 | STREDNÁ | `Intake.tsx:262` | „Zo žiadosti sme prečítali: nádor…“, žiadosť pritom hovorí len o podozrení |
| 11 | STREDNÁ | `cases.ts:63, 464, 526` | Žiadosť „prišla e-mailom“, ale „chýba e-mail praktika“ |
| 12 | STREDNÁ | `cases.ts:215` | Bolesť „do chrbta od polovice augusta“: v správach to tak nie je |
| 13 | STREDNÁ | `mdtModel.ts:201–204`, `cases.ts:429–431` | Kultivácia E. coli je zarátaná medzi hodnoty „v referenčných medziach“, chýbajú patologické hodnoty moču |
| 14 | NÍZKA | `MdtDoc.tsx:152` | „údajov s citátom“ započítava aj zdroje bez citátu |
| 15 | NÍZKA | `DataCards.tsx:43` | „Hodnoty presne tak, ako ich vydalo laboratórium“, ide pritom o výber s preloženými názvami |
| 16 | NÍZKA | `cases.ts:240` | „plné znenie … v časti Vyšetrenia“: sú tam slovenské zhrnutia |
| 17 | NÍZKA | `cases.ts:312–317` | „Je veľmi úzkostná“ nemá citát zo správy 13 |
| 18 | NÍZKA | `cases.ts:186` | „Bez známych alergií“, v zdroji je „AA: neguje“ |
| 19 | NÍZKA | `CaseHeader.tsx:28` | Mamologička Šťastná je v hlavičke označená ako „praktik“ |
| 20 | NÍZKA | `cases.ts:579–590` | Kučera má termín konzília aj „vyžiadané CT“, hoci žiadosť ešte nie je prevzatá |
| 21 | NÍZKA | `DataCards.tsx:126, 179` | Kanály, dátumy prijatia a časy úkonov sú simulované, ale neoznačené |
| 22 | NÍZKA | `MdtDoc.tsx:136, 174, 203` | „Vytvorené 19. 10.“, ale „údaje známe k 21. 10.“ |
| 23 | NÍZKA | `GpReport.tsx:215, 218` | 51887: platí sa za výkon uznaný poisťovňou, nie automaticky „za deň“ |
| 24 | NÍZKA | `GpReport.tsx:141` | §55a ods. 4 je zjednodušený (chýba časové razítko a podpis zdravotníka) |
| 25 | NÍZKA | `Intake.tsx:110` | E-mail `koordinator@nemocnica-lipova.cz` môže byť skutočná doména |
| 26 | NÍZKA | `ai/extract.ts:253` | „Pravdepodobne preklep“ je domýšľanie |
| 27 | NÍZKA | `public/data/extracted-alena.json` vs `eval-alena.json` | 63 vs. 72 citátov, režim „rules“ vs. „rules+llm“ |
| 28 | NÍZKA | `cases.ts:535` | „vzdialené metastázy nie sú“, chýba aj podozrivá uzlina |
| 29 | NÍZKA | `cases.ts:576, 602` vs `data-pacient-2/01` | Tá istá „MUDr. Hana Benešová“ v Říčanoch aj v Benešove |
| 30 | NÍZKA | `GpReport.tsx` (celá stránka) | Výsledok konzília z 21. 10. sa ukazuje pri „dnes“ = 19. 10. bez označenia |
| 31 | NÍZKA, voliteľné | celá appka | „Nemocnica Lipová/Severní“: vlastné mená sú v zdroji „Nemocnice …“ |

---

## VYSOKÁ

### 1. Vymyslená koordinátorka „Klára“
- **Súbor:** `src/components/Shell.tsx:31`. Zobrazuje sa v hornej lište na každej obrazovke a v pozdrave „Dobré ráno, Klára.“ (`Queue.tsx:120`).
- **Text:** `export const COORDINATOR = { name: 'Klára', role: 'koordinátorka' };`
- **Prečo je to zlé:** Meno Klára nie je v žiadnom zdroji. Koordinátorka KOC je vo vzore VZP „MDT zaver“: „Bc. Lucie Dvořáková – koordinátorka KOC“. Appka sama podpisuje žiadosť o ECOG (`cases.ts:198`), e-mail v Žiadanke (`Intake.tsx:110`) aj záver pre praktika (`cases.ts:537`) ako Lucie Dvořáková. Na jednej obrazovke tak vystupujú dve rôzne koordinátorky.
- **Oprava:** `export const COORDINATOR = { name: 'Lucie', role: 'koordinátorka KOC 2' };`

### 2. „Lehota 2 pracovné dni“ podaná ako české pravidlo
- **Súbor:** `src/pages/GpReport.tsx:160` a `:173`
- **Text:** „Lehota 2 pracovné dni od konzília: odoslať do 23. 10. 2026.“ / „Odoslané v deň konzília, v lehote 2 pracovných dní (do 23. 10. 2026). Doručenie doložené.“
- **Prečo je to zlé:** Je to holandská norma SONCOS (`ULTIMATNY-SYSTEM.md` §2.4, `kontext/raw-krajina-nl.md:29`). Český predpis s takouto lehotou zdroje neuvádzajú. Porotca z VZP to môže brať ako tvrdenie o ČR.
- **Oprava (riadok 160):** `Cieľ podľa holandského vzoru (norma SONCOS): záver praktikovi do 2 pracovných dní, teda odoslať do <strong>{fmtDate(deadline)}</strong>. V ČR takú lehotu predpis neurčuje.`
- **Oprava (riadok 173):** `Odoslané v deň konzília, v cieli 2 pracovných dní podľa holandského vzoru (do {fmtDate(deadline)}). Doručenie doložené (simulované).`

### 3. Druhý pacient používa adresu skutočnej nemocnice (v UI sa nezobrazuje, ale je v repe a v eval)
- **Súbory:** `data-pacient-2/02_…, 03_…, 05_…, 09_…` („Nemocnice Benešov (fiktivní)“, „Máchova 400, 256 01 Benešov“), `04_…` („Laboratoř Benešov s.r.o. (fiktivní)“, tá istá adresa), `01_…` („Radiologické oddělení Nemocnice Benešov“). Ďalej `source-pacient-2.json` a `eval/llm-cache/*.request.json`.
- **Prečo je to zlé:** Na Máchovej 400 v Benešove sídli podľa mojich vedomostí skutočná Nemocnice Rudolfa a Stefanie Benešov. Treba to overiť, ale ani so slovom „(fiktivní)“ neimitujme reálne pracovisko. Zdroje VZP používajú vymyslené názvy (Nemocnice Lipová, Poliklinika Jižní).
- **Oprava:** Všade nahradiť „Nemocnice Benešov“ za „Nemocnice Podhájí“, „Máchova 400“ za „Nemocniční 40“ a „Laboratoř Benešov s.r.o.“ za „Laboratoř LabPodhájí s.r.o.“. Potom spustiť `node data-pacient-2/build.mjs && npm run extract -- --case pacient-2 && npm run eval -- --case pacient-2`. Upraviť aj citáty v `eval/gold-pacient-2.json`, ak obsahujú tieto názvy.

---

## STREDNÁ

### 4. „ČR lehoty nemá“ a pankreasový cieľ pri iných diagnózach
- **Súbor:** `src/pages/Queue.tsx:22–24` (tooltip „cieľ“ na každej karte), `src/components/case/Metrics.tsx:46`
- **Text:** „… Cieľ 33 dní = dánske lehoty pre pankreas (6 dní do prvej návštevy + 27 dní do rozhodnutia). Zahraničný vzor, ČR lehoty nemá.“ / „dánsky vzor pre pankreas: 6 + 27 dní“
- **Prečo je to zlé:** (a) Overené je len to, že čakacie doby sa v ČR systematicky nesledujú (OECD 2025). MZ pritom uvádza pre rýchlo postupujúce nádory vrátane pankreasu cieľ „ideálne do 2 týždňov“ (`kontext/raw-cz-system.md` §4.2, `research/vyzvy/vzp-cesta-pacienta.md:156`). „Nemá lehoty“ je teda príliš silné. `ULTIMATNY-SYSTEM.md:82` volí presnejšiu formuláciu: „zahraničný vzor, nie česká norma“. (b) Ten istý text sa zobrazuje aj pri Kučerovi (pľúca), Pospíšilovej (črevo) a Královej (prsník). Pre ne dánske lehoty pre pankreas neplatia.
- **Oprava (Queue.tsx:22–24):** `'Hodiny cesty: dni od prijatia žiadanky oproti cieľovej lehote. Cieľ 33 dní = dánsky vzor pre pankreas (6 dní do prvej návštevy + 27 dní do rozhodnutia, Sundhedsdatastyrelsen). Zahraničný vzor, nie česká norma: ČR záväzné lehoty nemá, MZ uvádza len cieľ „ideálne do 2 týždňov“ pre rýchlo postupujúce nádory. Pri iných diagnózach je v deme nastavený ten istý cieľ (ukážka).'`
- **Oprava (Metrics.tsx:46):** `dánsky vzor pre pankreas: {DK_FIRST_VISIT_DAYS} + {DK_DECISION_DAYS} dní{c.demo === 'light' ? ' · ukážka, pri tejto diagnóze sa lehota nastaví inak' : ''}`

### 5. Súhrn „patrí“ reviznému lekárovi
- **Súbory a texty:**
  - `cases.ts:101`: „Pozor: nie je to VZP. Súhrn pre revízneho lekára patrí poisťovni 211.“
  - `cases.ts:561`: „… Súhrn konzília (diagnóza C25.0, rozhodnutie, plánovaná liečba) patrí reviznému lekárovi ZP MV ČR (211). …“ (zobrazuje sa v GpReport)
  - `ai/rules.ts:139`: „… – nie VZP, súhrn pre revízneho lekára ide tejto poisťovni“
- **Prečo je to zlé:** V zadaní VZP revízny lekár nie je. Spomína ho len prezentácia (slajd 11) a tá nepíše, či ide o lekára poisťovne (`kontext/raw-audit-hry.md:246`). Revízny lekár „nerozhoduje o liečbe“ (`kontext/raw-journey.md:192`, zdroj VZP). Kanál nepoznáme (`IDEALNE-RIESENIE.md:325`). Slovo „patrí“ tvrdí povinnosť, pre ktorú nemáme zdroj. Fakt, že kód 211 je ZP MV ČR a nie VZP, je overený a môže zostať.
- **Oprava `cases.ts:101`:** `note: 'Pozor: nie je to VZP, ale ZP MV ČR (211). Ak má súhrn dostať aj revízny lekár (chce to prezentácia VZP), išiel by poisťovni 211.',`
- **Oprava `cases.ts:561`:** `note: 'Pacientka nie je poistenkyňa VZP. Prezentácia VZP chce, aby informáciu dostal aj revízny lekár; pri tejto pacientke by to bol revízny lekár ZP MV ČR (211). Kanál v ČR nemáme overený, odoslanie je v prototype simulované.',`
- **Oprava `ai/rules.ts:139`:** `' – nie VZP; prípadný súhrn pre revízneho lekára by išiel tejto poisťovni'`

### 6. Dátum odoslania záveru sa líši medzi doručenkou a záznamom
- **Súbory:** `GpReport.tsx:35–37` (odoslané 21. 10. 2026 o 16:40, doručené o 16:41, potvrdené 22. 10. o 8:15), `GpReport.tsx:194` („súhrn odoslaný · 21. 10. 2026“) vs. `cases.ts:485–486` (`date: '2026-10-22', time: '09:00', action: 'Záver odoslaný praktikovi'` a `09:10 … Súhrn pre revízneho lekára`).
- **Prečo je to zlé:** Záznam o koordinovaní a doručenka si protirečia. Praktik by „potvrdil“ (22. 10. o 8:15) skôr, než bol záver podľa záznamu odoslaný (22. 10. o 9:00).
- **Oprava `cases.ts:485–486`:**
  ```ts
  { date: '2026-10-21', time: '16:40', action: 'Záver odoslaný praktikovi', detail: 'eZpráva, zapečatené nemocnicou; doručené 16:41 (v prototype simulované).', billable: true },
  { date: '2026-10-21', time: '16:45', action: 'Súhrn pre revízneho lekára ZP MV ČR (211)', detail: 'Diagnóza, rozhodnutie konzília, plánovaná liečba (v prototype simulované).', billable: true },
  { date: '2026-10-22', time: '08:15', action: 'Praktik potvrdil doručenie záveru', detail: 'Doručenka (v prototype simulované).', billable: false },
  ```
  Dôsledok: dní so zásahom bude 10 namiesto 11, teda 2 500 Kč namiesto 2 750 Kč. Prepočíta sa samo.

### 7. „Ďalší krok: chemoterapia pred operáciou“
- **Súbor:** `cases.ts:537` (GpReport, „Čo to znamená pre vás“)
- **Text:** „Ďalší krok: chemoterapia pred operáciou. Onkologické konzílium 4. 11. 2026 o 10:30 (MUDr. Kalous). …“
- **Prečo je to zlé:** Bez zmienky o konzíliu to znie ako pokyn appky (pravidlo: žiadne odporúčania liečby). Dá sa to aj prečítať tak, že 4. 11. sa začína chemoterapia. Zápis MDT (bod 1) však uvádza len „termín na onkologické konzilium“; `raw-audit-hry.md:260`: „Je to termín u onkológa, nie začiatok chemoterapie.“ Chýba aj bod 2 zápisu (pred liečbou určiť ECOG, krv, CA 19-9, žlčové cesty).
- **Oprava:** `'Konzílium odporúča najprv chemoterapiu (neoadjuvantnú). Ďalší krok: termín na onkologickom konzíliu 4. 11. 2026 o 10:30 (MUDr. Kalous). Pred začiatkom liečby konzílium žiada určiť ECOG, doplniť krvné testy a CA 19-9 a posúdiť žlčové cesty. Termíny zariadi koordinátorka KOC, Bc. Lucie Dvořáková.',`
  Do `citations` pridať `cite('MDT', '2. Před zahájením léčby: stanovit ECOG, doplnit aktuální krevní obraz, jaterní a renální parametry, ionty a CA 19-9')`. Citát je doslovne v „MDT zaver“, overené.

### 8. Fiktívna správa 14 (ECOG): dátumy nesedia a je „prijatá“ aj bez žiadosti
- **Súbory:** `cases.ts:43` („Datum: 20. 10. 2026“), `:46` („V Praze dne 20. 10. 2026“), `:71` (`examDate: '2026-10-20', receivedAt: '2026-10-20'`), `CaseView.tsx:167–170` (pri simulácii prepíše dátum na `DEMO_TODAY` = 19. 10.)
- **Prečo je to zlé:** (a) Po kliknutí na „Simulovať odpoveď“ panel ukazuje „vyšetrenie 19. 10. 2026 · prijaté 19. 10. 2026“, text tej istej správy však hovorí 20. 10. (screenshot `14-pole-doplnene.png`). (b) Správa je natvrdo v `ALENA_DOCS`. Pri posuvníku „konzílium 21. 10.“ alebo „všetko“ ju appka v Dokumentoch ukazuje ako prijatú 20. 10., aj keď ECOG nikto nevyžiadal a pole ECOG ostáva „chýba“. Vzor VZP pritom hovorí „ECOG není v podkladech výslovně stanoveno“.
- **Oprava:** V `EXTRA_DOCS['14']` zmeniť na `'Datum: 19. 10. 2026'` a `'V Praze dne 19. 10. 2026'`. Na riadku 71 dať `examDate: '2026-10-19', receivedAt: '2026-10-19'`. V `CaseView.tsx:74` skryť správy z `resolvedBy`, kým neprídu:
  ```ts
  const pending = new Set(c.fields.map((f) => f.resolvedBy?.docId).filter(Boolean));
  const base = c.docs.filter((d) => !pending.has(d.id) || arrivedById[d.id]).map((d) => { …ako doteraz… });
  ```
  Správu 14 z `c.docs` neodstraňovať, `scripts/verify.mjs:69` ju potrebuje kvôli citátu `resolvedBy`.

### 9. „ECOG 1“ sa po simulácii ukáže ako potvrdený fakt bez označenia „ukážka“
- **Súbor:** `CaseView.tsx:171`, text poznámky: `doplnené z odpovede · správa ${r.docId}`
- **Prečo je to zlé:** ECOG 1 je číslo, ktoré v podkladoch VZP nie je. Zelené „potvrdené“ bez označenia ho podáva ako fakt. Podklad pre konzílium (`MdtDoc`) zároveň ďalej ukazuje „Stav výkonnosti (ECOG): nie je v dokumentácii“. Je to v zhode so vzorom VZP, ale v deme to vyzerá ako rozpor.
- **Oprava:** `note: \`doplnené z odpovede · správa ${r.docId} · ukážka (fiktívna správa pre demo)\`` a toast na riadku 175 rovnako: `` `Prišla odpoveď · správa ${r.docId} (ukážka) · pole „${f.label}“ doplnené` ``. MdtDoc nemeniť, pri prezentácii to povedať nahlas (pozri poznámky na konci).

### 10. Žiadanka: „Zo žiadosti sme prečítali: nádor hlavy pankreasu“
- **Súbor:** `Intake.tsx:262` (`{c.diagnosisShort}` = `cases.ts:506` „nádor hlavy pankreasu (C25.0)“)
- **Prečo je to zlé:** Žiadosť 07 uvádza „Suspektní diagnóza: C25.0 – suspektní tumor hlavy pankreatu“. V čase žiadosti (2. 10.) ide o podozrenie, histológia prišla až 19. 10. Appka „prečítala“ niečo, čo v žiadosti nie je.
- **Oprava:** `<span className="doc-pill">podozrenie: {c.diagnosisShort}</span>`

### 11. Žiadosť „prišla e-mailom“, ale „chýba e-mail praktika“
- **Súbory:** `cases.ts:63` (`id: '07' … channel: 'e-mail'`), `:464` („E-mailom prišla epikríza MUDr. Řezníčka“), `:526` („Chýba e-mail praktika na doručenie záveru (uvedený je len telefón).“), `Intake.tsx:125` (potvrdenie „(e-mail)“)
- **Prečo je to zlé:** Ak žiadosť prišla e-mailom, koordinátorka adresu odosielateľa má. Zadanie kanál neuvádza (`raw-audit-hry.md:152`) a záver appka posiela cez eZprávu.
- **Oprava:** `cases.ts:63` → `channel: 'eZpráva'`; `cases.ts:464` → `detail: 'Cez eZprávu prišla epikríza MUDr. Řezníčka (správa 07). Založený prípad, spustené hodiny cesty.'`. Text na riadku 526 nechať. Hlavička prípadu potom ukáže „prijaté cez eZpráva“ a potvrdenie pôjde tiež cez eZprávu.

### 12. Príznaky: bolesť „do chrbta“ už od polovice augusta
- **Súbor:** `cases.ts:215` (pole 16, zobrazuje sa aj v Podklade pre konzílium ako „Celkový stav“)
- **Text:** „Od polovice augusta bolesť v nadbrušku, ktorá ide do chrbta (horšia po jedle a v noci). …“
- **Prečo je to zlé:** Správa 07 uvádza od polovice augusta bolesti „v epigastriu a pravém podžebří“. Šírenie do chrbta je doložené až 15. 9. (správa 05) a 2. 10. (správa 07). Text spája dve časové informácie do jednej.
- **Oprava:** `value: 'Od polovice augusta bolesti v nadbrušku a pod pravým rebrom; teraz bolesť vystreľuje do chrbta, horšia po jedle a v noci. Nechutenstvo, chudnutie, tmavý moč, 1. 9. žltkasté bielka očí. Teploty od septembra nemala.',` Existujúce citáty to pokrývajú.

### 13. Laboratórium 1. 9.: kultivácia „v referenčných medziach“, patologický moč chýba
- **Súbory:** `components/docs/mdtModel.ts:201–204`, `cases.ts:429–431`
- **Text v Podklade pre konzílium:** „… Moč – leukocyty ++ (H); ďalších 12 hodnôt v referenčných medziach“ (screenshot `07-podklad-mdt.png`)
- **Prečo je to zlé:** Medzi týmito 12 hodnotami je „Moč – kultivácia: Escherichia coli 10⁴ CFU/ml“. Podľa správy 02 je to „Signifikance nálezu hraniční“, nie normálna hodnota. Správa 02 navyše označuje H aj „Bílkovina + H“, „Krev + H“ a „Sediment – Leukocyty 65 H /µl“ a tie v appke vôbec nie sú.
- **Oprava `mdtModel.ts:204`:** `+ (rest > 0 ? \`${show.length ? '; ' : ''}ďalších ${rest} hodnôt bez označenia H/L (celá tabuľka v prípade)\` : '');`
- **Oprava `cases.ts` (za riadok 430):**
  ```ts
  r02('Moč – bielkovina', '+', '', 'neg.', 'H'),
  r02('Moč – krv', '+', '', 'neg.', 'H'),
  r02('Sediment – leukocyty', '65', '/µl', '0–10', 'H'),
  ```
  Potom spustiť `npm run verify` (kontroluje, či sú hodnoty v správe 02).

---

## NÍZKA

### 14. „údajov s citátom“ započítava aj zdroje bez citátu
- **Súbor:** `MdtDoc.tsx:152` (`{model.stats.cited} údajov s citátom`)
- **Prečo:** `mdtModel.ts:92–98` priradí poznámku pod čiarou každej hodnote s `docId`, aj keď nemá doslovný citát. Napríklad zhrnutia vyšetrení majú poznámky 13–21 bez citátu (screenshot 07).
- **Oprava:** `{model.stats.cited} údajov so zdrojom`

### 15. „Hodnoty presne tak, ako ich vydalo laboratórium“
- **Súbor:** `DataCards.tsx:43`
- **Prečo:** Hodnoty sedia, ale názvy sú preložené (Hemoglobín, Vápnik…) a tabuľka je výber (chýba časť moču a antibiogram).
- **Oprava:** `H = nad medzou, L = pod medzou (ako ich označilo laboratórium). Hodnoty sú prepísané presne, názvy vyšetrení sú preložené. Je to výber, celé znenie nájdete v origináli (klik).`

### 16. „plné znenie každého vyšetrenia sú v časti Vyšetrenia“
- **Súbor:** `cases.ts:240`
- **Oprava:** `note: 'Dátum, miesto a typ každého vyšetrenia sú v časti Vyšetrenia, plné znenie po kliknutí v origináli správy. Veľkosť ložiska sa líši podľa metódy (UZ 34 × 30 mm, CT 35 × 31 mm, EUS 33 × 29 mm).',`

### 17. „Je veľmi úzkostná“ bez citátu zo správy 13
- **Súbor:** `cases.ts:312–317` (`LATER_VALUES.alena`, kľúč `other`)
- **Oprava:** `value: '… Výrazná úzkosť a depresívna nálada – psychológ odporúča pokračovať v podpornej psychoterapii 1× týždenne.'` a pridať `cite('13', 'Nálada depresivní, výrazná anxieta, afekt labilní.')`. Citát je doslovne v správe 13, overené.

### 18. Alergie
- **Súbor:** `cases.ts:186`, `value: 'Bez známych alergií'`
- **Prečo:** Zdroj uvádza „AA: neguje“, teda alergie popiera. Ide o drobný posun významu.
- **Oprava:** `value: 'Alergie neguje'`

### 19. „praktik“ pri mamologičke
- **Súbor:** `CaseHeader.tsx:28` („praktik {c.referringGp.name}“). Pri Královej sa zobrazí „praktik MUDr. Petra Šťastná“, ale podľa `cases.ts:695, 720` je to mamologická ambulancia.
- **Oprava:** `<IcPerson size={14} /> odosielajúci lekár {c.referringGp.name}…`

### 20. Kučera: konzílium a CT pred prevzatím žiadosti
- **Súbor:** `cases.ts:579` (`mdtDate: '2026-10-28'`), `:586–590` (krok CT `requested` 19. 10.), `:581` (`status: 'new'`, ďalší krok „Prevziať žiadosť…“)
- **Prečo:** Žiadosť ešte nie je prevzatá („čaká na prevzatie“, `:615`), a predsa už má termín konzília aj vyžiadané CT.
- **Oprava:** Riadok 579 zmazať a v `steps` nechať `[]`.

### 21. Simulované kanály, dátumy prijatia a časy úkonov nie sú označené
- **Súbory:** `DataCards.tsx:126` (DocsList: „prijaté 6. 10.“ + kanál), `DataCards.tsx:179` (LogCard)
- **Prečo:** Zadanie VZP neuvádza, kedy a ako koordinátor dostal správy 01–06, ani časy jeho úkonov. V `cases.ts` sú vymyslené (napr. „RTG hrudníka poštou“).
- **Oprava:** Pod zoznam dokumentov a do LogCard doplniť `<p className="cs-hint">Kanály, dátumy prijatia a časy úkonov sú v deme simulované – zadanie ich neuvádza.</p>`

### 22. Podklad „vytvorený 19. 10.“ s „údajmi známymi k 21. 10.“
- **Súbor:** `MdtDoc.tsx:136, 174` („údaje známe k 21. 10. 2026“) vs `:203` („Vytvorené 19. 10. 2026“)
- **Oprava:** V oboch miestach `údaje pre konzílium {fmtDate(model.asOf)} · stav k {fmtDate(DEMO_TODAY)}`

### 23. Výkon 51887
- **Súbor:** `GpReport.tsx:218` („Výkon 51887 = 250 Kč za deň so zásahom, najviac 1× denne; vykazuje nemocnica v NIS.“), `:215` (súčet „2 750 Kč · podklad pre výkon 51887“)
- **Prečo:** Vyhl. 432/2025 Sb., bod 8.5: 250 Kč „za každý výkon č. 51887 … zdravotní pojišťovnou uznaný“, najviac 1× za deň na pacienta (`raw-vykon-51887.md:31–37`). Suma je len potenciálna.
- **Oprava (218):** `Výkon 51887 = 250 Kč za jednu intervenciu koordinátora, ktorú uzná poisťovňa, najviac 1× denne na pacienta; vykazuje nemocnica.` **(215, label):** `podklad pre výkon 51887 (ak ho poisťovňa uzná)`

### 24. §55a ods. 4
- **Súbor:** `GpReport.tsx:141`, text „(§55a ods. 4 zák. 372/2011 Sb. – podpíše alebo zapečatí nemocnica, nie náš e-mail)“
- **Prečo:** Podľa `IDEALNE-RIESENIE.md:282` ide o časové razítko + pečať nemocnice **alebo** uznávaný podpis zdravotníka.
- **Oprava:** `(§55a ods. 4 zák. 372/2011 Sb.: časové razítko a pečať nemocnice alebo uznávaný podpis zdravotníka – nie náš e-mail)`

### 25. E-mail koordinátora na možno skutočnej doméne
- **Súbor:** `Intake.tsx:110` (`koordinator@${slug(hospital)}.cz` → `koordinator@nemocnica-lipova.cz`, v hlavičke „Od“ bez označenia „fiktívne“)
- **Oprava:** `email: 'koordinator.koc2@example.cz'` (alebo `.example`, rezervovaná doména)

### 26. „Pravdepodobne preklep“ (Maťova AI časť)
- **Súbor:** `src/ai/extract.ts:253`, výstup v `public/data/extracted-alena.json` (konflikt histológie)
- **Prečo:** Ide o domýšľanie. Či je chybný odber 20. 10., vydanie 19. 10. alebo výkon 12. 10., zo zdrojov nevieme.
- **Oprava:** `… (správa ${proc.id})` + `. Jeden z dátumov je chybný – overte s patológiou, že výsledok patrí k tejto vzorke.` Potom znovu spustiť `npm run extract && npm run eval`.

### 27. Metadáta extrakcie a evalu si odporujú
- **Súbory:** `public/data/extracted-alena.json` (`meta.mode: "rules"`, `stats.citations: 63`, `generatedAt 23:55`) vs `public/data/eval-alena.json` (`extraction.mode: "rules+llm"`, headline „72/72 citátov“, `00:06`). Súbor v skutočnosti obsahuje 68 citátov polí + 4 v rozporoch = 72.
- **Oprava:** Pred odovzdaním spustiť `npm run extract && npm run eval` (aj `-- --case pacient-2`), aby `meta` a `headline` boli z toho istého behu. V pitchi k „20/20“ dodať, že zlatú sadu písal ten istý tím (`eval/README.md`, časť „Poctivo“).

### 28. Odpoveď konzília pre praktika
- **Súbor:** `cases.ts:535`, text „… vzdialené metastázy nie sú. …“
- **Prečo:** Zdroj uvádza „bez známek vzdálených metastáz“ a zároveň „přítomna suspektní regionální uzlina“. Uzlina v texte chýba.
- **Oprava:** `answer: 'Biopsia potvrdila nádor hlavy pankreasu (duktálny adenokarcinóm, G2–G3). Na CT nádor zasahuje do ciev, je podozrivá regionálna uzlina, bez známok vzdialených metastáz. Konzílium ho hodnotí ako hranične resekabilný (hranične operovateľný) a odporúča najprv chemoterapiu, potom nové CT a opätovné posúdenie operácie.',` Do citácií pridať `cite('MDT', 'přítomna suspektní regionální uzlina, bez známek vzdálených metastáz')`. Citát je doslovný, overené.

### 29. Jedna „MUDr. Hana Benešová“ na dvoch miestach
- **Súbory:** `cases.ts:576, 602` (praktička v Říčanoch, pacient Kučera) vs `data-pacient-2/01_…` (praktická lekárka v Benešove)
- **Oprava:** Pri Kučerovi premenovať na `MUDr. Jana Sedláčková` (na oboch riadkoch).

### 30. Záver konzília (21. 10.) pri „dnes“ = 19. 10.
- **Súbor:** `GpReport.tsx` (DocHeader `subtitle`)
- **Oprava:** Do `subtitle` pridať `<span className="doc-pill doc-pill--amber">ukážka: stav po konzíliu {fmtDate(mdt)}</span>`

### 31. (voliteľné) Vlastné mená pracovísk
- Appka píše „Nemocnica Lipová/Severní“, zdroj „Nemocnice Lipová/Severní“ a „KOC Nemocnice Lipová“. Je to konzistentné, ale ide o preklad vlastného mena. Ak bude čas: `koc: 'KOC 2 · Nemocnice Lipová'` a podobne v `place` (`cases.ts`) a `KOC_FALLBACK` (`Intake.tsx:20`).

---

## Na vedomie: chyby priamo v podkladoch VZP (nemeniť, appka ich správne ukazuje alebo cituje)
- Správa 09: výkon 12. 10., ale „poslední dávka 18. 10. 2026 večer“ a „apixaban znovu od 21. 10.“. Appka to ukazuje ako rozpor. Pole 12 je v poriadku.
- Správa 11: „odběr 20. 10. 2026“, „Datum vydání: 19. 10. 2026“. Appka to ukazuje ako rozpor. Pole 19 je v poriadku.
- MDT zaver: „MUDr. Ondřej Kalous – radiační onkologie“ je uvedený pri „onkologické konzilium“ (neoadjuvantná chemoterapia). Appka to cituje doslova, nekomentovať.
- Dánske čiastkové lehoty 6 + 27: `ULTIMATNY-SYSTEM.md:66` ich vedie ako overené (SDS 2023), `raw-krajina-dk.md:75` však píše, že rozpis na fázy pri pankrease nečítal [?]. Súčty 43/44/48 dní sú overené. Ak sa niekto spýta, odkázať na monitorovací model SDS 2023.

## Overené bez nálezu
- **Mená v prípade Aleny:** Řezníček, Malý, Křížová, Kopecký, Hájková, Fiala, Svoboda, Marková, Pokorný, Holub, Veselá, Šebestová, Kolářová, Dvořáková, Hrubý, Kalous, Šimková a dcéra Petra Horká sú všetci v zdrojoch. **MUDr. Lenka Marková je v správach:** 10 („Indikující lékař: MUDr. Lenka Marková, onkologická ambulance KOC“), 13 (odosielajúca lekárka, kópia) a v „MDT zaver“ (klinická onkológia). Adresát žiadosti o ECOG je teda v poriadku.
- **Poisťovne:** 111 VZP, 201 VoZP, 205 ČPZP, 207 OZP (plný názov správne), 209 ZPŠ, 211 ZP MV ČR, 213 RBP (`ai/rules.ts:84–91`, `cases.ts`). Overené, že 211 nie je VZP (`raw-journey.md:28`).
- **Kódy MKN:** C25.0 (hlava pankreasu), C34.1 (horný lalok pľúc), C18.7 (sigmoideum), C50.4 (horný vonkajší kvadrant prsníka), R52.1, F41.2, MKN-O 8500/3. Popisy sedia.
- **Dátumy a dni v týždni:** 19. 10. 2026 je pondelok (pozdrav v Queue); 12. 10. je pondelok, takže „do 3 pracovných dní“ = 15. 10. (správne); 21. 10. + 2 pracovné dni = 23. 10.; „deň 17 z 33“ (2. 10. → 19. 10.).
- **Rodné číslo / pohlavie:** 635722 → mesiac 57 − 50 = 07, teda žena, nar. 22. 7. 1963. Sedí so správou 07.
- **Rozpory v poli 12 a 19, váha 65 kg k 21. 10. vs. 63 kg až 26. 10., vynechanie správ 12 a 13 v podklade:** všetko sedí so zdrojmi a so zadaním.
- **Výkon 51887, 250 Kč, max. 1× denne, vykazuje nemocnica:** overené (vyhl. 432/2025 Sb., bod 8.5), oprava formulácie v nálezoch 23.
- **§55a ods. 4 zák. 372/2011:** overené (`IDEALNE-RIESENIE.md`, Z13), spresnenie v náleze 24.
- **Fronta:** `Queue.tsx:103–110` radí len podľa termínu ďalšieho kroku a dátumu konzília, zdravotné údaje nepoužíva.
- **Gamifikácia:** všetky čísla v paneli „Moja bilancia“ sú označené „ukážka“ a ide len o administratívne kroky.
- **Odporúčania liečby:** appka sama nič neodporúča, len cituje zápis konzília (výnimka formulácie v náleze 7).
- **Povinná poznámka** „Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka“ je na každej obrazovke (`Shell.tsx`).

## Poznámky pre prezentujúceho (aby demo nehovorilo niečo iné, než ukazuje obrazovka)
- Ranný prehľad dnes ukazuje **„nič neurguje“** (histológia prišla dnes o 12:40), nie „urgovať 2“ zo scenára v `CONTRACT.md`.
- Kontrola žiadanky: **telefón pacientky v žiadosti je.** Nehovoriť „chýba telefón“ (scenár v `matej-overdeliver.md` §7, krok 1). Chýbajú výsledky 5 vyšetrení, ECOG, váha a e-maily.
- Hodiny cesty ukazujú **„deň 17 z 33“**, nie „deň 12“.
- Po „Simulovať odpoveď“ je ECOG zelený len v prípade. Podklad pre konzílium ostáva „nie je v dokumentácii“, rovnako ako vo vzore VZP („ECOG není v podkladech výslovně stanoveno“). Povedať: „Doplnenie je simulácia, podklad drží len to, čo je doložené.“
- Kontrola žiadanky je v deme predpočítaná (`cases.ts` `precheck`), nie počítaná naživo. Ak sa niekto spýta, odkázať na `public/data/extracted-alena.json` (rovnaké zistenia z extraktora).
