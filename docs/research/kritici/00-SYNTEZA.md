# 00 – Syntéza 12 kritikov: čo s appkou do soboty a do nedele

_17. 10. 2026, 06:00 · hlavný produktový stratég · vstup: kritiky 01–12, rozhodnutia v `brainstorms/2026-10-17-kriticke-hodnotenie-appky.md`, kód (riadky overené). Čo sa už robí (Zpracování naživo, čeština, upratanie, ECOG cez telefonát, slepý test), neopakujem. **NOVÉ** = nápad, ktorý nemal žiadny kritik._

Slovník: MDT = konzílium · RČ = rodné číslo · NIS = nemocničný systém · FHIR = štandard výmeny zdravotných dát · pasca = chyba vložená do dát zadania.

## 1. Verdikt
1. Svetovo silní sme v jadre: každý údaj má doslovný citát overený programom, rozpor ukážeme oboma vetami, podklad drží stav k dátumu konzília a všetko beží v prehliadači bez internetu. To sú „wow“ momenty Abridge a Carta, ktoré však bežia v cloude ([Abridge](https://www.youtube.com/watch?v=qXPBXhUrjMc&t=935), [Carta](https://www.youtube.com/watch?v=oYu37qC4LV0&t=1350)).
2. Hračka sme v otázkach nemocnice a poisťovne: prípad nemá RČ, potvrdenie nemá meno lekára, záver sa „podpíše“ sám a nezapisuje sa, kto čo urobil (02, 09).
3. Meranie tvrdí viac, než dokazuje: 5 viet s opačným významom prešlo poistkou, pacienti sú 2 od toho istého tímu a žiadanka bez nadpisov dá 1/20 (06, 12).
4. Proces končí priskoro a bez pacientky: prípad sa uzavrie 22. 10., Alena sa diagnózu dozvie 23. 10. a liečba začína 4. 11. (04, 05, 08).
5. Vizuál je CRM pre freelancerov (fialový gradient, vizitky), nie klinický nástroj. Opravia to tokeny, nie prepis (01).

## 2. Zhoda a nezhoda kritikov
**Zhoda (3 a viac):**
- Jadro s citátmi nechať a nerozširovať do šírky (02, 03, 05, 06, 10, 11).
- Potvrdzuje a schvaľuje menovaný lekár, nie anonymný klik (02, 05, 09, 10, 11).
- Zapisovať, kto čo videl a urobil (02, 09, 11). Fronta má byť pracovný zoznam (01, 03, 04).
- Prípad uzavrieť až po začatí liečby a keď pacientka pozná plán (04, 05, 08).
- Nepredvypĺňať klinické hodnoty. Dnes `liveData.ts:230` vpíše „ECOG 1“ (05, 12).
- Úprava správy = test alebo nová verzia, nie prepis dokumentácie (02, 09). Lieky len ako citát lekára (09, 10).
- Opatrne s číslami presnosti (06, 10, 11, 12) a s napojením na NIS (02, 09, 11).

**Nezhoda → rozhodnutie:**
- *SMS a plán pre pacientku:* chcú 03 a 08 (zadanie body 15, 19), tech lead ich vyradil. → Sobota nie, v nedeľu A4 bez diagnózy.
- *„Pro plátce“ a revízny lekár:* 07 to chce v sobotu. 06 a 09 varujú, že AI súhrn pre posudzovanie nároku je podľa AI Act vysoké riziko ([Service Desk](https://ai-act-service-desk.ec.europa.eu/en/node/465)). → Nedeľa, bez AI.
- *Režim premietania:* 01 a 11 áno, 05 nie. → Len blok „Rozhodující nálezy“.
- *Voľný text v „Zkuste to rozbít“:* 12 dokázal, že rozbije motor. → Predvoľby, voľný text len s poctivým pruhom.
- *Video na úvod:* Bruno chce 1:30 + klikanie, 10 radí video v slučke. → Rozhodne Bruno. Ak pri stole stoja autorky zadania, začať klikaním.

## 3. Backlog

### VLNA 1 – do 6:40 (6 vecí, ≤ 30 min, rôzne súbory)
Po každej `npm run build` a `npm run eval`. Čísla sa nesmú zmeniť.

1. **Prehrávanie sa zastaví „dnes“.** Po správe 11 (19. 10.) stop a pruh „Dnes 19. 10. · konzilium 21. 10.“. Správy 12 a 13 až po „Ukázat, co přijde po konziliu“. Pod číslom: „65/65 citací nalezeno doslova · správnost potvrzuje člověk (0/20)“.
   *Prečo:* dnes prehrávanie prebehne cez konzílium, čo je pasca zo zadania (10). Doslovný citát nie je správny údaj (11). Texas pre prehnanú presnosť zasiahol proti firme Pieces ([Healthcare Dive](https://www.healthcaredive.com/news/texas-attorney-general-ken-paxton-settles-pieces-technologies-generative-ai-accuracy/727699/)).
   *Práca:* 0,5 h · riziko nízke · `src/pages/Live.tsx` (r. 126, 330).
2. **Nový nález navrch.** Rozpor po úprave sa zobrazí prvý, zvýraznený, a stránka sa k nemu posunie.
   *Prečo:* nový rozpor po zmene RČ je dnes pod okrajom (10, 12).
   *Práca:* 0,5 h · riziko nízke · `src/components/live/FindingsPanel.tsx`.
3. **Telefonát bez vymyslenej hodnoty.** Predvyplniť len „Telefonát 19. 10. 2026 s MUDr. Lenkou Markovou:“, hodnotu „ECOG 1“ dopíše prezentujúci. Zmazať predvoľbu „Doplnit ECOG 1 do žádanky“, lebo prepisuje list praktika.
   *Prečo:* ECOG určuje lekár (05, 12).
   *Práca:* 0,25 h · riziko nízke · `src/components/live/liveData.ts` (r. 216–218, 230), `src/data/cases.ts` (r. 54–62).
4. **Upozornenie = citát lekára.** Pravidlo hľadá vety „Upozorňuji / Upozornění:“, nie názvy liekov, a ukáže „Upozornění lékaře (zpráva 07)“. Nadpis „Tramadol + antidepresiva: riziko…“ → „Upozornění algeziologa (zpráva 12)“.
   *Prečo:* modul s upozorneniami na lieky je v MDCG 2019-11 príklad pomôcky ([MDCG rev.1, príloha I](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)) (09).
   *Práca:* 0,5 h · riziko nízke · `src/ai/rules.ts` (r. 597–598), `src/components/case/CaseHeader.tsx` (r. 64), `src/data/cases.ts` (r. 379–386). Robí ten istý agent ako bod 3.
5. **Preklepy nejdú konzíliu.** „Rozhodne konzilium“ → „Ověřit před konziliem – koordinátorka do 20. 10.“. Pri otázke praktika poznámka „položena 2. 10., před CT a histologií“ a pod ňou riadok „Otázka pro konzilium – doplní lékař KOC“.
   *Prečo:* MDT má riešiť liečbu, nie zber informácií ([RCR 2026](https://eu5mgmt.voxco.com/Media/273/Cancer_MDTs_External_Insights_Report_May_2026.pdf)) (05).
   *Práca:* 0,5 h · riziko nízke · `src/pages/MdtDoc.tsx` (r. 56, 226), `src/components/docs/mdtModel.ts` (r. 405–410).
6. **Testovací režim a poctivé vety.**
   - V okne úprav pruh „TESTOVACÍ REŽIM – simulace opravené zprávy. V provozu jsou zprávy jen ke čtení.“
   - Päta: „účel: úplnost podkladu a hlídání termínů · nenavrhuje diagnózu ani léčbu“.
   - `SUBMISSION.md`, r. 52: „navrhuje … diagnózu“ → „přebírá diagnózu od lékaře doslovně“.

   *Prečo:* oprava dokumentácie sa robí novým záznamom ([§55a zák. 372/2011](https://www.zakonyprolidi.cz/cs/2011-372)) (02, 09).
   *Práca:* 0,5 h · riziko nízke · `src/components/live/EditDrawer.tsx`, `BreakIt.tsx`, `src/components/Shell.tsx` (r. 273), `docs/pitch/SUBMISSION.md`.

### VLNA 2 – do 10:30 (8 vecí)
1. **Zápis k MDT z aktuálneho stavu.** Zápis sa vykreslí z výsledku motora vrátane úprav, telefonátu a potvrdení.
   *Prečo:* dnes porotca zmení RČ a zápis ukáže staré údaje (10).
   *Práca:* 2–3 h · riziko stredné · `Live.tsx`, `MdtDoc.tsx`, `mdtModel.ts`, `App.tsx`.
2. **Lekárka potvrdzuje a schvaľuje, s menom a časom.** Prepínač rolí koordinátorka / MUDr. L. Marková. Pri poli riadok „Sestavil motor · Ověřila … · Schválila …“. „Odeslat“ až po „Schválit“, žiadne „Potvrdit vše“.
   *Prečo:* zadanie chce handover potvrdený lekárom (body 9, 11). FHIR Provenance rozlišuje autora, overovateľa a ručiteľa ([HL7](https://hl7.org/fhir/R4/valueset-provenance-agent-type.html)). Ľudia majú sklon slepo odklikávať návrhy stroja ([Goddard 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3240751)).
   *Práca:* 2 h · riziko stredné · `Shell.tsx`, `FieldPanel.tsx`, `caseUtils.ts` (r. 189), `MdtDoc.tsx`, `GpReport.tsx` (r. 253–280).
3. **Poistka proti opačnému významu podľa NegEx (NOVÝ zdroj).** Metóda stojí na zozname záporových slov a v nemocničných správach dosiahla špecificitu 94,5 % ([Chapman 2001](https://www.dbmi.pitt.edu/wp-content/uploads/2022/10/A-simple-algorithm-for-identifying-negated-findings-and-diseases-in-discharge-summaries.pdf)).
   - Český zoznam: ne-, bez, vyloučil, neprokázal, negativní.
   - Ak sa zápor v hodnote a v citáte nezhoduje, návrh sa zamietne.
   - Test na 5 vetách kritika 06 a poctivé „zachytili sme X z 5“. Dnes prejde všetkých 5.

   *Práca:* 1,5 h · riziko nízke · `src/ai/extract.ts` (r. 127–136), `app/eval/`, `scripts/eval.mjs`.
4. **Text bez nadpisov.** 6 vzorov: „nar. D. M. RRRR“, „VZP/ZP + 3 číslice“, „tel.“, „Alergie/AA“, „Užívá/FA“, „CT/UZ + datum“. Pod 10/20 sa zobrazí pruh „Text bez nadpisů: pravidla přečetla X z 20“.
   *Prečo:* dnes motor prečíta 1/20 (12). Ukázať, kde systém zlyháva, odporúča aj Microsoft ([HAX G2](https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/)).
   *Záloha:* voľný text vypnúť.
   *Práca:* 2 h · riziko stredné · `rules.ts`, `Live.tsx`.
5. **Pripravenosť ku konzíliu.** 8–10 riadkov (štádium, ECOG, histológia, CT podľa pankreatického protokolu, vzťah k cievam, CA 19-9, drenáž žlčových ciest, antikoagulácia). Každý riadok má ✓ s citátom alebo ✗ „není v dokumentaci“ a „Vyžádat“. Nad zápisom blok „Rozhodující nálezy“.
   *Prečo:* u Aleny nájde 2 medzery, ktoré odhalilo až konzílium: drenáž a cTNM (05). Vychádza z minimálneho súboru NHS ([NHS 2020, s. 11](https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf)).
   *Práca:* 2–3 h · riziko nízke · nový `Readiness.tsx`, `mdtModel.ts`, `MdtDoc.tsx`.
6. **Uzavretie až po začatí liečby.** Nové kroky „Sdělení výsledku pacientce (dcera přítomna?)“ a „Zahájení léčby 4. 11.“. Stav „čeká na zahájení léčby“, tlačidlo „Uzavřít“ je dovtedy sivé.
   *Prečo:* MZ meria čas od prvého kontaktu po začatie liečby ([Věstník 11/2025](https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf)). 15 % rozhodnutí MDT sa nevykoná ([PubMed](https://pubmed.ncbi.nlm.nih.gov/16322114)).
   *Práca:* 1,5 h · riziko nízke · `Journey.tsx`, `GpReport.tsx`, `cases.ts`.
7. **„Kdo co dělal“ zo skutočných klikov.** Kto, rola, čo, kedy a zdroj.
   *Prečo:* EHDS dáva pacientovi právo vedieť, kto videl jeho údaje ([čl. 9](https://streamlex.eu/articles/ehds-en-art-9/)). VZP sama propaguje históriu prístupov ([vzp.cz](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu)).
   *Práca:* 1–1,5 h · riziko nízke · `session.ts`, `caseSession.ts`, nový `AuditLog.tsx`.
8. **NOVÉ: skutočný model bez Azure, priamo na notebooku.** `scripts/extract.mjs` už číta `OPENAI_BASE_URL` a program Ollama ponúka model na `localhost:11434/v1` ([Ollama](https://docs.ollama.com/api/openai-compatibility.md)).
   - Spustenie bez zmeny kódu: `OPENAI_BASE_URL=http://localhost:11434/v1 OPENAI_API_KEY=ollama OPENAI_MODEL=gemma3:12b npm run extract -- --provider openai`.
   - Gemma 3 vie 35+ jazykov hneď a 140+ v predtrénovaní ([Google](https://blog.google/technology/developers/gemma-3/)). Češtinu modelov porovnáva [BenCzechMark](https://huggingface.co/blog/benczechmark).
   - 5 behov a tabuľka: len pravidlá / pravidlá + model / test halucinácií / opačný význam (06).

   *Prečo:* AI vrstva doteraz nebežala ani raz. Takto pobeží v nemocnici a nič neodíde von.
   *Práca:* 1,5 h + sťahovanie ~8 GB (súhlas Bruna) · riziko stredné. Zlý výsledok povieme poctivo, appka sa nemení.

### VLNA 3 – nedeľné finále (6 vecí)
1. **Vizuál a fronta ako pracovný zoznam**, Alena navrchu (sekcia 4; 01, 03, 12) · 4–6 h · `theme.css`, `Queue.tsx`, `CONTRACT.md`.
2. **„Pro plátce“ a revízny lekár.** Míľniky od prvého kontaktu po liečbu (T0–T4) a dôvod meškania jedným klikom. Každá poisťovňa vidí len svojich poistencov. Revízny lekár dostane minimálny súbor polí bez AI ([§42 zák. 48/1997](https://www.zakonyprolidi.cz/cs/1997-48)). Novák bol na MDT 59 dní po prvom kontakte a väčšina čakania vznikla pred KOC (07, 09) · 4 h · nový `Payer.tsx`.
3. **Identita pacienta.** RČ a dátum narodenia všade, kontrola deliteľnosti 11 ([§13 zák. 133/2000](https://www.zakonyprolidi.cz/cs/2000-133)), u Nováka pasca s prehodenými číslicami (02) · 2,5 h · riziko stredné (treba pregenerovať `pacient2` a zlatú sadu).
4. **Kam to patrí v realite a export FHIR** overený validátorom (02).
   - **NOVÉ:** záver pôjde do datovej schránky. Od 2023 ju automaticky má každý s IČO a prijíma aj súkromné správy s fikciou doručenia ([epravo](https://www.epravo.cz/top/clanky/datova-schranka-misto-mailu-115256.html)).
   - **NOVÉ:** MZ plánuje povinné eŽádanky aj na konziliá do 7/2027, novela zatiaľ nie je schválená ([Advokátní deník](https://advokatnidenik.cz/2026/08/17/komory-zadaji-pri-zavadeni-povinnych-e-zadanek-prechodne-obdobi-bez-pokut/)). Štruktúru žiadanky potom prečítajú pravidlá priamo.

   *Práca:* 3–4 h.
5. **Pacientka v procese.** Osoby určené podľa §33 zák. 372/2011, želania zo všetkých správ (`narrative.ts`, `otherNotesFallback`), „Plán pro pacientku“ na A4 a prekážky s citátom. Pacient má v priemere 2,2 prekážky ([JONS](https://www.jons-online.com/issues/2020/june-2020-vol-11-no-6/navmetrics-initial-study-results-begin-to-shed-light-on-value-of-navigation-metrics)) (03, 08) · 3 h.
6. **Program celého MDT** s pripravenosťou 48 h vopred a možnosťou presunúť pacienta. V Barts Health tak program klesol z 89 na 57 pacientov ([NHS 2020](https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf)) (04, 05) · 2 h.

## 4. Nový vizuálny smer (od dizajnéra, na neskôr)
1. **Stíšiť:** preč gradienty, pastely, avatary a „Dobré ráno“. Ostane jedna modrá pre akcie. Fialová je predvolená farba AI generátorov ([prg.sh](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)).
2. **Farba len tam, kde musí konať človek:** červená = chýba, jantárová = rozpor, potvrdené = šedá ✓, návrh stroja = čiarkovaný obrys. Vždy aj slovo ([NHS](https://service-manual.nhs.uk/design-system/components/tag)).
3. **Fronta ako tabuľka:** riadok 40 px, skupiny Dnes na mně / Čeká na jiných, ~15 pacientov na obrazovku ([Carbon](https://carbondesignsystem.com/components/data-table/style/)).
4. **Prípad:** stály stĺpec pacienta ([Epic](https://ehealth.connect-care.ca/epic-systems/epic-modules/storyboard)), pod ním „Na tahu“, „K vyřešení“ a polia kľúč – hodnota – zdroj.
5. **Písmo:** IBM Plex Sans v 6 veľkostiach, kontrast aspoň 4,5 : 1 ([WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Zrušiť `--faint` s kontrastom 2,54 : 1.
6. **Pôvod v texte:** bodkované podčiarknutie = citát, „tel.“ = zápis koordinátorky, rozpor ako A | B vedľa seba.

Tokeny (s aliasmi starých názvov v `01-dizajn-ux.md`):
```css
:root{
  --canvas:#F4F5F7; --paper:#FFFFFF; --ink:#17202B; --ink-2:#55606E; --line:#D6DBE2;
  --accent:#0A5BB0; --tint-accent:#EAF1FA;
  --sig-missing:#B42318; --tint-missing:#FDF1F0;
  --sig-conflict:#93560A; --tint-conflict:#FFF6E8; --sig-ok:#1E7148;
  --font:"IBM Plex Sans",system-ui,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace;
  --fs-xs:12px; --fs-sm:13px; --fs-md:14px; --fs-lg:16px; --fs-xl:20px; --fs-2xl:24px;
  --row:40px; --r-sm:4px; --r-md:6px; --r-lg:8px;
  --shadow-2:0 1px 2px rgba(23,32,43,.06); --shadow-3:0 8px 24px rgba(23,32,43,.16);
}
```

## 5. Scenár pri stole (2 min)
| Čas | Klik | Povedať |
|---|---|---|
| 0:00 | Naživo → Alena, len správa 07 → „Věk“ | „Zo žiadanky je 15 z 20 údajov a pri každom je veta z originálu.“ |
| 0:15 | Přehrát → stop 19. 10. | „11 správ z 5 kanálov. Pasca: apixaban vysadený po výkone. Správy po konzíliu sa nepočítajú.“ |
| 0:45 | Myš hodnotiteľke → Zkuste to rozbít, „iné RČ“ | „Nový rozpor je navrchu s oboma vetami.“ |
| 1:05 | ECOG → Zapsat telefonát → „MUDr. Marková: ECOG 1“ | „Zdrojom je telefonát s menom lekárky.“ |
| 1:25 | Rola lekárky → Potvrdit → Zápis k MDT | „Šablóna MDT_zapis aj s rozporom, ktorý ste vyrobili.“ |
| 1:45 | Záver → Schválit → Odeslat → Kdo co dělal | „Bez internetu, slepý test Y/20. Koľko vám to trvá dnes?“ |

Bez bodu 1 z VLNY 2: v kroku 3 použiť opravu dátumu apixabanu a zápis otvoriť z prípadu.

**3 najťažšie otázky VZP**
1. *„Je to AI, alebo pravidlá na 13 správ?“* – „Jadro tvoria pravidlá a kontrola citátov, preto rovnaký vstup dá vždy rovnaký výsledok. Model píše len voľný text a ten musí prejsť kontrolou citátu aj záporu. Slepý test dal Y/20. Text bez nadpisov appka otvorene označí.“
2. *„Kto ručí, je to pomôcka, kde sú dáta?“* – „Účelom je úplný podklad a stráženie termínov. Diagnózu, liečbu ani naliehavosť neurčujeme. Upozornenia na lieky sú len citáty lekárov, lebo vlastné upozornenia by už robili z appky pomôcku ([MDCG](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)). Schvaľuje menovaný lekár, dáta zostávajú v prehliadači a DPIA robí nemocnica.“
3. *„Ako sa to dostane do NIS, k praktikovi a k VZP?“* – „Podklad pôjde do NIS ako PDF, záver eZprávou alebo do datovej schránky. VZP stačia dva signálne kódy spárované cez RČ, ako dnes robí pri kódoch 99893 a 99894 ([Onkoforum](https://www.linkos.cz/files/pro_odborniky/napl_onko_prog/sled_predikce_onko/Forum/2025-04/5--Onkoforum-04_2025-VZP.pdf)). Platí to existujúci výkon 51887 ([vyhl. 432/2025](https://www.zakonyprolidi.cz/cs/2025-432)).“

## 6. Riskantné tvrdenia
| Tvrdenie | Riziko | Povedať |
|---|---|---|
| „0 halucinácií“ | 5 viet s opačným významom prešlo (06) | „0 čísel bez opory, význam potvrdzuje človek“ |
| „20/20 · 17/17“ | 2 pacienti od toho istého tímu, 95 % interval 83–100 % | „2 fiktívni pacienti, slepý test Y/20, nie klinická validácia“ |
| „AI navrhuje diagnózu“ | účel sa posudzuje aj podľa propagácie (MDCG) | „preberá diagnózu od lekára“ |
| „nie je pomôcka“ | príliš kategorické | „podľa nášho výkladu nie, posúdi regulátor“ |
| „RČ k AI neodíde“ | skloňované mená uniknú a pseudonymizované údaje sú stále osobné ([EDPB](https://taylorwessing.com/-/media/taylor-wessing/files/germany/2025/01/tw25_edpb-guidelines-1-2025.pdf)) | „pseudonymizujeme, sú to stále osobné údaje“ |
| „Azure OpenAI EU“ | Data Zone EU smie spracúvať aj v Nórsku a Švajčiarsku ([Microsoft](https://learn.microsoft.com/azure/foundry/foundry-models/concepts/deployment-types)) a AI nebežala | „AI je voliteľná, beží v EU alebo lokálne“ |
| „praktik nepotrebuje účet“ | eZpráva funguje len medzi zapojenými ([pravidlá](https://lekarskyemail.cz/pravidla.pdf)) | „kanálom, ktorý už ambulancia má“ |
| „VZP hradí“, koruny, „GDPR compliant“ | Alena je poistenkyňa ZP 211, DPIA robí nemocnica | „poisťovne hradia“, „úsporu zmeria pilot“ |
| AI text bez štítku | AI Act ho ukladá označiť ([čl. 50](https://artificialintelligenceact.eu/article/50/)) | štítok „návrh AI“ aj v tlači |
