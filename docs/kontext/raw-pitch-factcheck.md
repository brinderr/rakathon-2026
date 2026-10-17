# Fact-check pitch materiálov (SUBMISSION, COVER-PROMPT, PITCH, VIDEO, MENTORI)

Stav: sobota 17. 10. 2026, ráno. Zlúčené z dvoch kontrol a doplnené vlastným overením (repo, `npm run extract/eval` do scratchpadu, MZ ČR web, GitHub).
Súbory v `docs/pitch/` som **nemenil** (patria Maťovi). Čísla riadkov sedia so stavom súborov k 02:03.
Cesty sú relatívne ku koreňu repa `rakathon/`.

## TL;DR

- **Skontrolovaných tvrdení: 111.** Na opravu je **62 riadkov** (tabuľky A a A2). Ide o **37 rôznych problémov**, lebo rovnaká chyba je často v CZ aj EN texte, v pitchi aj vo videu. Z toho 5 riadkov sú overené čísla, ku ktorým treba doplniť výhradu. **49 tvrdení je overených bez zmeny** (tabuľka B).
- **Najhoršie (porota by to chytila hneď):**
  1. „ostrý režim Azure OpenAI v EU“ – Azure sa nikdy nevolal, kľúč nie je. AI odpovede v repe sú z náhradného modelu.
  2. Čísla 20/20 · 17/17 · 13/13 sa pripisujú „AI“, ale **vychádzajú rovnako aj úplne bez AI** (dnes som spustil `--provider none` pre oboch pacientov: 20/20, 17/17 a 20/20, 13/13). Robí ich pravidlový kód, AI navrhuje len 5 voľných textov.
  3. Demo kroky 3 a 6 appka nevie (žiadosti na 5 pracovísk, „sama eskaluje“). Krok 2 a záber 4 videa ukazujú simuláciu na strane praktika, nie automatické založenie prípadu.
  4. „VZP hradí / platí“: 250 Kč platia nemocnici **všetky** zdravotné poisťovne (vyhláška 432/2025 Sb., bod 8.5). Alena je navyše v ZP 211, nie vo VZP.
  5. „standardní software nemají“ je v rozpore s MZ: „V některých KOC se pilotně testují také koordinační aplikace“ (MZ ČR, 2. 9. 2026, overené dnes).
  6. GitHub odkaz vracia 404 (overené dnes: repo aj API 404, profil `brinderr` existuje → repo je súkromné alebo neexistuje).
  7. „13 zpráv za 50 dní“: 13 správ je z 99 dní (20. 7.–27. 10.), 50 dní je praktik → konzílium.
  8. Druhý pacient 20/20 bez výhrady: pravidlá sa upravili po prvom behu (predtým 18/20, 6/13), obe kontrolné sady písal tím.
- **Oprava oproti dvom predošlým kontrolám:**
  - Kontrola 2 písala, že pri Alene AI vôbec nebežala (`mode: rules`, `llmFieldsAccepted: 0`). **To už neplatí.** Súbory sa prepísali o 02:11. Teraz je u oboch pacientov `mode: rules+llm`, 5 prijatých AI polí a `model: „náhrada bez Azure kľúča – odpoveď z Claude Code…“`. Záver sa ale nemení: skóre nezávisí od AI.
  - Kontrola 1 navrhla kanály koordinátorov citovať ako „(MZ ČR, 2. 9. 2026)“. **Tá stránka kanály (telefón, e-mail, eZpráva) vôbec nespomína** (overené dnes). Správny zdroj sú FN Olomouc, Bulovka a FN HK (`docs/kontext/raw-audit-hry.md`).
  - Headline evalu je teraz 72/72 citátov (Alena) a 49/49 (pacient 2). Číslo „81/81“ z kontroly 2 je staré.

---

## A. Na opravu (najdôležitejšie prvé)

Verdikty: **NEPRESNÉ** = treba prepísať. **NEOVERITEĽNÉ** = zmierniť alebo vypustiť. **NEEXISTUJE** = appka to nevie.

| # | Súbor:riadok | Presný pôvodný text | Verdikt | Presná náhrada | Zdroj |
|---|---|---|---|---|---|
| 1 | SUBMISSION.md:54 | AI (velký jazykový model, v ostrém režimu Azure OpenAI v EU) | NEPRESNÉ – ostrý režim neexistuje, Azure sa nikdy nevolal | AI (velký jazykový model; cílově Azure OpenAI v EU, v prototypu bez klíče odpověděl na stejný pseudonymizovaný prompt náhradní model) | `app/public/data/extracted-alena.json` a `extracted-pacient-2.json`, `meta.model`; v `app/` nie je `.env`; `app/eval/README.md`, časť „Poctivo“ |
| 2 | SUBMISSION.md:57 | An LLM (Azure OpenAI in the EU in production) | NEPRESNÉ | An LLM (target: Azure OpenAI in the EU; in the prototype, without an Azure key, a substitute model answered the same pseudonymised prompt) | ako #1 |
| 3 | PITCH.md:51 | V ostrom režime beží AI v EÚ (Azure OpenAI) a rodné čísla ani telefóny k nej neodídu – to náš kód robí už dnes. | NEPRESNÉ | AI má bežať v EÚ (Azure OpenAI), v prototype zatiaľ odpovedal náhradný model na ten istý pseudonymizovaný prompt. Rodné čísla ani telefóny k AI neodídu – to náš kód robí už dnes. | ako #1; `app/src/ai/pseudo.ts` |
| 4 | PITCH.md:73 | V ostrom režime Azure OpenAI v EÚ; pred volaním nahradíme rodné číslo, telefóny, e-maily, adresu, dátum narodenia a mená tokenmi ([RČ_1] …). | NEPRESNÉ (Azure + „mená“) | Cieľovo Azure OpenAI v EÚ, v prototype náhradný model a len fiktívne dáta. Pred volaním nahradíme rodné číslo, telefóny, e-maily, adresu, dátum narodenia a meno pacienta aj kontaktnej osoby tokenmi ([RČ_1] …). Mená lekárov zatiaľ ostávajú. | `app/src/ai/pseudo.ts` (`addName` len PACIENT a KONTAKT); `app/eval/llm-cache/4234a107c7884be5.request.json` obsahuje „MUDr. Ivana Křížová“ a ďalšie mená lekárov, meno pacientky 0× |
| 5 | SUBMISSION.md:18 | Nástroj pro koordinátora KOC: AI složí podklad pro MDT s ověřenými citacemi, ukáže, co chybí, a hlídá, kdo je na tahu. | NEPRESNÉ – podklad skladajú hlavne pravidlá | Nástroj pro koordinátora KOC: pravidla a AI složí podklad pro MDT s ověřenými citacemi, ukáže, co chybí, a hlídá, kdo je na tahu. *(129/140 znakov)* | Dnešný beh `npm run extract -- --provider none` + `npm run eval` (do scratchpadu): Alena 20/20, 17/17; pacient 2 20/20, 13/13, teda **bez AI**. `extracted-*.json`: `llmFieldsAccepted: 5` |
| 6 | SUBMISSION.md:21 | Cancer-centre coordinator tool: AI drafts the MDT brief with verified quotes, flags gaps and shows who acts next. | NEPRESNÉ | Cancer-centre coordinator tool: rules plus AI draft the MDT brief with verified quotes, flag gaps and show who acts next. *(121/140)* | ako #5 |
| 7 | SUBMISSION.md:26 | Pravidla a AI vyplní 20 polí šablony VZP „Handover“ | NEPRESNÉ (podiel AI aj „šablona VZP“) | Pravidla vyplní 20 položek ze zadání výzvy (Handover_obsah) a AI navrhne pět volných textů (diagnóza, epikríza, otázka na MDT, symptomy, jiná sdělení) | `Handover_obsah.docx`: „Podobu formuláře a datovou strukturu navrhnou soutěžící.“; AI polia v `app/eval/llm-cache/4234a107c7884be5.json` |
| 8 | SUBMISSION.md:33 | Rules and AI fill the 20 fields of the VZP handover template | NEPRESNÉ | Rules fill the 20 fields of the challenge's handover list (Handover_obsah) and AI drafts five free-text parts | ako #7 |
| 9 | PITCH.md:27 | „Pravidlá a AI z 13 správ vyplnia 20 polí šablóny VZP a ukážu **diery: chýba ECOG, nemožný dátum apixabanu, histológia vydaná deň pred odberom, chýba e-mail** – nič nedomýšľa.“ | NEPRESNÉ – pred konzíliom bolo 11 správ; e-mail nie je pole semaforu; obrazovka ukazuje predpočítané dáta | „Z 11 správ, ktoré existovali pred konzíliom, vyplnia pravidlá 20 polí zo zadania výzvy a AI navrhne voľné texty. Appka ukáže **diery: chýba ECOG, nemožný dátum apixabanu, histológia vydaná deň pred odberom** – nič nedomýšľa.“ (Na otázku: v deme sú výsledky predpočítané.) | `app/public/data/source.json` (01–11 do 21. 10., 12 a 13 až potom); UI berie dáta z `app/src/data/cases.ts`, `extracted-*.json` ani `eval-*.json` nenačítava |
| 10 | VIDEO.md:14 | „Pravidlá a AI z trinástich správ vyplnia dvadsať polí šablóny VZP. Čo chýba alebo si odporuje, je označené – nič si nedomýšľajú.“ | NEPRESNÉ | „Z jedenástich správ pred konzíliom vyplnia pravidlá a AI dvadsať polí zo zadania výzvy. Čo chýba alebo si odporuje, je označené – nič si nedomýšľajú.“ | ako #9 |
| 11 | PITCH.md:40 | Výsledok: **20 z 20 polí, 17 zo 17 pascí, 0 vymyslených hodnôt.** | Čísla OVERENÉ, ale chýba, odkiaľ sú | Výsledok: **20 z 20 polí, 17 zo 17 pascí, 0 vymyslených hodnôt** – rovnako s AI aj bez nej, lebo čísla a dátumy berú pravidlá. AI len navrhuje voľné texty a kód ich overí. Kontrolnú sadu sme písali sami. | `app/public/data/eval-alena.json` (headline); dnešný beh bez AI (#5); `app/eval/README.md` „Poctivo“ |
| 12 | PITCH.md:26 | \| 3 \| **Prípad → Čo treba vyriešiť** (vyžiadať správy 01–06) \| „Žiadanka výsledky neobsahuje, len píše, kde sú – appka pripraví **žiadosti na 5 pracovísk** so správnym adresátom.“ \| | NEEXISTUJE – appka žiada len po jednom poli; „Vyžiadané správy 01–06“ je pevný riadok v Zázname | \| 3 \| **Prípad → Čo treba vyriešiť → ECOG → Vyžiadať → Simulovať odpoveď** \| „ECOG v správach chýba – appka pripraví žiadosť o doplnenie, a keď odpoveď príde, pole zozelenie (v prototype simulované).“ \| | `app/src/components/case/FieldList.tsx:36`, `RequestModal.tsx`; `app/src/data/cases.ts:466` |
| 13 | PITCH.md:29 | „Histológia mala prísť do 3 pracovných dní, prišla neskôr – appka to **sama eskaluje**, nikto to nemusí strážiť v hlave.“ | NEEXISTUJE – nič sa neeskaluje; pri 19. a 21. 10. je histológia doručená a štítok „mešká“ sa nezobrazí | Klik: **Cesta pacientky, posuvník dátumu na 17. 10.** Veta: „Histológia mala prísť do 3 pracovných dní, teda do 15. 10. – appka ukáže, že krok mešká, takže to nikto nemusí strážiť v hlave.“ | `app/src/components/case/Journey.tsx:46` (štítok len pri `late > 0`); `cases.ts:345` (termín 15. 10., doručené 19. 10.) |
| 14 | PITCH.md:25 | \| 2 \| **Prijaté → žiadanka praktika (správa 07)** \| „Žiadanka od praktika príde e-mailom, prípad sa založí sám a praktikovi hneď odíde **potvrdenie prijatia so zoznamom, čo chýba**.“ \| | NEPRESNÉ – `#intake` je strana praktika, „kontrola“ je 900 ms časovač, prípad sa vo fronte nezaloží | \| 2 \| **Nová žiadanka (strana praktika) → Skontrolovať → Odoslať** \| „Takto vyzerá prijatie žiadanky: kontrola a automatické potvrdenie praktikovi so zoznamom, čo chýba – v prototype simulované.“ \| | `app/src/pages/Intake.tsx:1–2, 54, 118–127` („automatické potvrdenie · simulované“) |
| 15 | VIDEO.md:13 | „Žiadanka od praktika príde e-mailom a prípad sa založí sám. Praktik dostane potvrdenie a zoznam, čo chýba.“ · text **Prijaté · potvrdenie odoslané** | NEPRESNÉ | Voiceover: „Keď príde žiadanka od praktika, praktik hneď dostane potvrdenie a zoznam, čo chýba.“ Text: **Potvrdenie prijatia · simulácia**. Obrazovka: „Nová žiadanka (strana praktika)“. | ako #14 |
| 16 | SUBMISSION.md:60 | Pro koordinátory v 15 KOC (od ledna 2026, VZP hradí jejich výkon, standardní software ale nemají) | NEPRESNÉ (platiteľ) + NEOVERITEĽNÉ (software) | Pro koordinátory v 15 KOC (povinní od ledna 2026; každou jejich intervenci hradí zdravotní pojišťovny centru částkou 250 Kč, výkon 51887; koordinační aplikace se v některých KOC teprve pilotně testují – MZ ČR, 2. 9. 2026) | Vyhláška 432/2025 Sb., příl. 1, bod 8.5 (https://www.zakonyprolidi.cz/cs/2025-432), `docs/kontext/raw-vykon-51887.md`; MZ 2. 9. 2026 (overené dnes): „V některých komplexních onkologických centrech se pilotně testují také koordinační aplikace“ – https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ |
| 17 | SUBMISSION.md:63 | (in place since January 2026 and reimbursed by VZP, yet without standard software) | NEPRESNÉ | (mandatory in every centre since January 2026; each intervention is reimbursed to the centre by all health insurers – code 51887, CZK 250; coordination apps are only being piloted in some centres – Czech Ministry of Health, 2 Sep 2026) | ako #16; MZ 2. 9. 2026: „Od roku 2026 proto musí mít každé komplexní onkologické centrum (KOC) minimálně jednoho koordinátora“ |
| 18 | PITCH.md:55 | „Koordinátori sú v každom z 15 KOC od januára a VZP za ich výkon platí – ale **štandardný nástroj nemajú**. | NEPRESNÉ | „Každé z 15 KOC musí mať od roku 2026 koordinátora a poisťovne nemocnici platia za každú jeho intervenciu 250 Kč – **spoločný nástroj však zatiaľ nie je**, ministerstvo koordinačné aplikácie len pilotne testuje. | ako #16 a #17 |
| 19 | PITCH.md:78 | VZP už platí výkon koordinátora (250 Kč) | NEPRESNÉ – platia všetky poisťovne, peniaze idú nemocnici, najviac 1× denne na pacienta | poisťovne už platia nemocnici 250 Kč za intervenciu koordinátora (výkon 51887, najviac raz denne na pacienta) | ako #16. Alena: „Zdravotní pojišťovna: 211“ (`source.json`) |
| 20 | SUBMISSION.md:78 | https://github.com/brinderr/rakathon-2026 | NEPRESNÉ – zvonku 404 | Repo zverejniť (pred tým skontrolovať v histórii `.env` a kľúče), alebo pole nechať prázdne | `curl` 17. 10. 2026: github.com/brinderr/rakathon-2026 → 404, api.github.com/repos/… → 404, github.com/brinderr → 200 |
| 21 | SUBMISSION.md:24 | Fiktivní pacientka Alena má za 50 dní 13 zpráv ze 7 pracovišť včetně dvou různých KOC | NEPRESNÉ – 13 správ je z 99 dní; „pracoviště“ v zadaní = oddelenia (12) | Fiktivní pacientka Alena má 13 zpráv ze 7 zařízení včetně dvou různých KOC; od praktika ke konziliu uběhlo 50 dní | `source.json`: správy 20. 7.–27. 10. 2026; 1. 9. (praktik) → 21. 10. (MDT) = 50 dní |
| 22 | SUBMISSION.md:31 | Our fictional patient Alena has 13 reports from 7 sites in 50 days, including two different cancer centres | NEPRESNÉ | Our fictional patient Alena has 13 reports from 7 facilities, including two different cancer centres; 50 days passed from the first GP visit to the tumour board | ako #21 |
| 23 | SUBMISSION.md:28 | Výsledek: 20/20 polí, všechny pasti zachyceny, 0 vymyšlených hodnot. | Čísla OVERENÉ, chýba podstatná výhrada | Výsledek: 20/20 polí, všechny pasti zachyceny, 0 vymyšlených hodnot. Kontrolní sady psal náš tým a pravidla jsme po prvním běhu na druhém pacientovi upravili (předtím 18/20 polí a 6/13 pastí); slepý test na dalším pacientovi teprve čeká. | `app/eval/README.md` „Poctivo“; `eval-pacient-2.json` |
| 24 | SUBMISSION.md:35 | Result: 20/20 fields, all traps caught, 0 invented values. | ako #23 | Result: 20/20 fields, all traps caught, 0 invented values. Both gold sets were written by our team and we tuned the rules after the first run on the second patient (before: 18/20 fields, 6/13 traps); a blind test is still to come. | ako #23 |
| 25 | PITCH.md:41 | Na **druhom pacientovi** s rakovinou pľúc a štyrmi novými pascami – nádor raz vpravo, raz vľavo, stratená alergia, cudzie rodné číslo – tiež **20 z 20**. | NEPRESNÉ (chýba výhrada; „cudzie“ RČ) | Na **druhom fiktívnom pacientovi** s rakovinou pľúc a štyrmi novými typmi pascí – napríklad nádor raz vpravo, raz vľavo, stratená alergia, iné rodné číslo na laboratórnej správe – po úprave pravidiel tiež **20 z 20** (pred úpravou 18 z 20). Ďalší pacient pôjde naslepo. | ako #23; `app/eval/gold-pacient-2.json` (`birth-number-mismatch`) |
| 26 | PITCH.md:77 | Áno – druhý fiktívny pacient má rakovinu pľúc, inú poisťovňu, žiadanku od špecialistu a iné pasce; 20/20 polí. | Doplniť | Áno – druhý fiktívny pacient má rakovinu pľúc, inú poisťovňu, žiadanku od špecialistu a iné pasce; 20/20 polí po úprave pravidiel (pred ňou 18/20). V appke ho zatiaľ nie je, ukázať vieme len výsledok evalu. | ako #23; `app/src/data/cases.ts` (len Alena) |
| 27 | SUBMISSION.md:54 | Před voláním AI nahradíme rodné číslo, telefony, e-maily, adresu, datum narození a jména tokeny. | NEPRESNÉ – tokenizuje sa len meno pacienta a kontaktnej osoby | Před voláním AI nahradíme rodné číslo, telefony, e-maily, adresu, datum narození a jméno pacienta i kontaktní osoby tokeny. | ako #4 |
| 28 | SUBMISSION.md:57 | Birth numbers, phones, e-mails, address, date of birth and names are replaced by tokens before any AI call. | NEPRESNÉ | Birth numbers, phones, e-mails, address, date of birth and the names of the patient and contact person are replaced by tokens before any AI call. | ako #4 |
| 29 | SUBMISSION.md:24 | Koordinátoři v komplexních onkologických centrech (KOC) skládají podklady pro multidisciplinární tým ručně z e-mailů, telefonátů a eZpráv. | NEOVERITEĽNÉ ako všeobecné tvrdenie (kanály áno, „všetci ručne“ nie) | Koordinátoři v komplexních onkologických centrech (KOC) dnes shánějí zprávy hlavně telefonem a e-mailem, část center přijímá eZprávu (FN Olomouc, Bulovka, FN Hradec Králové). | `docs/kontext/raw-audit-hry.md:31–36, 71–75`; IDEALNE-RIESENIE Z7. **Necitovať MZ 2. 9. 2026** – kanály tam nie sú (overené dnes) |
| 30 | SUBMISSION.md:31 | Coordinators in Czech comprehensive cancer centres (KOC) assemble the brief for the multidisciplinary team (MDT) by hand from e-mails, phone calls and secure messages. | NEOVERITEĽNÉ | Coordinators in Czech comprehensive cancer centres (KOC) chase reports mostly by phone and e-mail; some centres also receive secure eZpráva messages. | ako #29 |
| 31 | PITCH.md:15 | Koordinátorka v KOC to dnes skladá ručne z e-mailov a telefonátov. | NEOVERITEĽNÉ pre Alenu (zadanie kanál neuvádza) | Skutočné koordinátorky opisujú, že správy zháňajú hlavne telefonátmi a e-mailmi (FN Olomouc, Bulovka). | ako #29 |
| 32 | SUBMISSION.md:54 | program ji ověří znak po znaku | NEPRESNÉ – kód toleruje typografiu | program ověří, že je ve zprávě doslova (tolerujeme jen mezery a typografii – pomlčky, uvozovky, ×) | `app/src/ai/text.ts:7–10` |
| 33 | SUBMISSION.md:57 | code verifies character by character | NEPRESNÉ | code verifies it appears verbatim in the report (ignoring only whitespace and typography such as dashes, quotes and ×) | ako #32 |
| 34 | SUBMISSION.md:24 | a v nich díry a rozpory, které by konzilium zdržely | NEOVERITEĽNÉ (nemerali sme) | a v nich díry a rozpory: chybí ECOG, datum vysazení apixabanu nesedí a histologie je „vydaná“ den před odběrem | `app/eval/gold-alena.json` (`ecog-missing`, `apixaban-impossible-date`, `histology-issued-before-sampling`); `source.json` správa 11: vydanie 19. 10., odber 20. 10. |
| 35 | SUBMISSION.md:31 | with gaps and contradictions that would delay the tumour board | NEOVERITEĽNÉ | with gaps and contradictions: no ECOG, an impossible anticoagulant date and a histology report issued the day before the biopsy | ako #34 |
| 36 | PITCH.md:15–16 | A v tých správach sú diery a rozpory, ktoré by konzílium zdržali. | NEOVERITEĽNÉ | A v tých správach sú diery a rozpory, ktoré musí niekto pred konzíliom nájsť. | ako #34 |
| 37 | SUBMISSION.md:66 | Datový model kopíruje FHIR (DocumentReference pro zprávy, Provenance s citací ke každému údaji, Task pro „kdo je na tahu“, Composition pro podklad MDT) | NEPRESNÉ – v kóde nie je nič z FHIR | Datový model lze přímo namapovat na FHIR (DocumentReference pro zprávy, Provenance s citací ke každému údaji, Task pro „kdo je na tahu“, Composition pro podklad MDT); export do FHIR zatím není | `grep -ri fhir app/src` → nič; vlastný typ `Provenance` v `app/src/ai/extract.ts:34` |
| 38 | SUBMISSION.md:67 | The data model mirrors FHIR (DocumentReference, Provenance with the quote for each value, Task for “who acts next”, Composition for the MDT brief) | NEPRESNÉ | The data model maps directly onto FHIR (DocumentReference, Provenance with the quote for each value, Task for “who acts next”, Composition for the MDT brief); there is no FHIR export yet | ako #37 |
| 39 | PITCH.md:76 | výstup modelujeme podľa FHIR (DocumentReference, Provenance s citátom) | NEPRESNÉ | výstup vieme namapovať na FHIR (DocumentReference, Provenance s citátom), export zatiaľ nemáme | ako #37 |
| 40 | SUBMISSION.md:60 / :63 | Pacient tak nečeká kvůli chybějícímu údaji / Patients stop waiting for a missing detail | NEOVERITEĽNÉ (nemerali sme) | Cílem je, aby pacient nečekal kvůli chybějícímu údaji / The aim is that patients no longer wait for a missing detail | pilot to má zmerať (SUBMISSION:60, metriky pilotu) |
| 41 | SUBMISSION.md:26 / :33 | Žádanku od praktika založí jako případ a praktikovi pošle potvrzení přijetí se seznamem toho, co chybí. … Po MDT jde závěr praktikovi / A GP referral becomes a case and the GP gets an acknowledgement … After the MDT the GP receives the conclusion | NEPRESNÉ – v prototype sa nič neodosiela | … co chybí (v prototypu simulováno). … Po MDT jde závěr praktikovi (v prototypu simulováno) / … (simulated in the prototype) | `Intake.tsx` („simulované“), `app/src/pages/GpReport.tsx` |
| 42 | PITCH.md:49 | „Dnes beriem to, čo koordinátorovi reálne chodí: telefón, e-mail na spoločnú adresu a eZprávu – ministerstvo od septembra predpisuje centrám HPB presne e-mail a telefón koordinátora.“ | NEPRESNÉ – appka dnes žiadny kanál neprijíma; je to metodický pokyn, nie zákon | „V pilote budeme brať to, čo koordinátorovi reálne chodí: telefón, e-mail na spoločnú adresu a eZprávu – metodický pokyn MZ pre centrá HPB od 1. 9. 2026 uvádza ako kontakt práve univerzálny e-mail a telefón koordinátora.“ | `docs/ULTIMATNY-SYSTEM.md:40`; https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf; kanály: `raw-audit-hry.md:71–75` |
| 43 | PITCH.md:51 | „Keď bude eŽádanka K povinná a spustí sa štátna výmena dokumentov, napojíme sa cez certifikát KOC. | NEPRESNÉ (povinnosť je len návrh) + NEOVERITEĽNÉ (certifikát) | „Ak bude vystavenie eŽádanky povinné (zatiaľ je to návrh novely) a spustí sa štátna výmena dokumentov, chceme sa napojiť cez certifikát KOC – či to ide, overujeme s NCEZ. | `docs/IDEALNE-RIESENIE.md` Z14 (MZ: 1. 7. 2027, Vitalia: 1/2028); MENTORI.md otázka 8 je otvorená |
| 44 | PITCH.md:1 | # Pitch – 3 minúty | NEOVERITEĽNÉ – dĺžka nie je zverejnená; v sobotu nie je javisko | # Pitch – dĺžku overiť u organizátorov (v sobotu 14:00–16:00 zadávatelia obchádzajú tímy; dĺžka nedeľného pitchu nie je zverejnená, odhad 5–6 min) | `docs/research/05-slack-refresh.md:12, 14, 173` |
| 45 | PITCH.md:74 | Nie: nerobíme diagnózu, skóre naliehavosti ani odporúčanie liečby – zbierame, overujeme úplnosť a strážime termíny. | NEOVERITEĽNÉ (právny záver) | Podľa nášho výkladu pokynu MDCG 2019-11 nie: nerobíme diagnózu, skóre naliehavosti ani odporúčanie liečby – zbierame, overujeme úplnosť a strážime termíny. Definitívne to posúdi regulátor. | `docs/IDEALNE-RIESENIE.md:70` a Z24 (MDCG 2019-11 rev.1) |
| 46 | PITCH.md:42 / SUBMISSION.md:54 | **kód zahodil 4 z 5 návrhov** a podklad ostal čistý / kód zamítl 4 z 5 návrhů | OVERENÉ, ale znie, akoby kód zahodil aj správny návrh | **kód zahodil všetky 4 vymyslené návrhy**, jediný správny prijal a podklad ostal 20 z 20 / kód zamítl všechny 4 vymyšlené návrhy, jediný správný přijal | `app/eval/vysledok-test-halucinacii.json` (accepted 1 = `mdtQuestion`, rejected 4) |
| 47 | PITCH.md:72 | Podstrčený zlý výstup (ECOG 1, 63 kg, vymyslený e-mail) eval chytil celý. | OVERENÉ len mimo repa | Text môže ostať, ale dôkaz treba uložiť do `app/eval/` (dnes je len v scratchpade: 17/20 polí, 13/17 pascí, 4 vymyslené hodnoty) | `…/scratchpad/eval-bad.json` (kontrola 2, 02:15) |
| 48 | SUBMISSION.md:54 / :57 | AI nikdy nedoporučuje léčbu ani nestanovuje naléhavost. / AI never recommends treatment or scores urgency. | OVERENÉ ako pravidlo, nie ako dôkaz | AI má zakázáno doporučovat léčbu a stanovovat naléhavost; fronta se řadí jen podle termínů. / The AI is instructed never to recommend treatment or score urgency; the queue is sorted by deadlines only. | `app/src/ai/prompt.ts:12`; `app/src/pages/Queue.tsx` |

### A2. Menšie opravy (video, obálka, mentori, appka)

| # | Súbor:riadok | Presný pôvodný text | Verdikt | Presná náhrada | Zdroj |
|---|---|---|---|---|---|
| 49 | VIDEO.md:18 | Terminál alebo karta „Na kontrolnej sade“ (`eval-alena.json` → headline) | NEEXISTUJE (karta) | Terminál s `npm run eval` (čísla 20/20 · 17/17 · 0 sedia) | v `app/src` nie je `headline` ani načítanie `eval-*.json` |
| 50 | VIDEO.md:16 | váha 65 kg, správy 12 a 13 zmiznú | NEPRESNÉ | váha 65 kg, správy 12 a 13 sa presunú do „Prídu neskôr“ | `app/src/components/case/DataCards.tsx:137` |
| 51 | VIDEO.md:15 | **0 polí bez citátu** | NEPRESNÉ (ECOG je prázdny) | **0 vyplnených polí bez citátu** | `extracted-alena.json`: `missing: 1`, `fieldsWithoutVerifiedCitation: 0` |
| 52 | VIDEO.md:6 | v každom zábere je vidieť pätička „Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka“ | V appke OVERENÉ, zábery 1, 2 a 10 sú mimo appky | Do záberov 1, 2 a 10 pridať pätičku v strihu | `app/src/components/Shell.tsx:132` |
| 53 | VIDEO.md:10 | „Alena má 63 rokov a podozrenie na rakovinu pankreasu.“ · **13 správ · 7 miest · 50 dní** | OVERENÉ (fiktívne), formulácia ako #21 | „Alena je fiktívna pacientka, má 63 rokov a podozrenie na rakovinu pankreasu.“ · **13 správ · 7 zariadení · 50 dní od praktika po konzílium** | ako #21 |
| 54 | app/src/pages/GpReport.tsx:160 (demo krok 8) | Lehota 2 pracovné dni od konzília | NEPRESNÉ ako české pravidlo – je to holandská norma | Náš cieľ: 2 pracovné dni od konzília (podľa holandskej normy SONCOS) – alebo to v pitchi nekomentovať | `docs/kontext/raw-krajina-nl.md:29` (SONCOS 14) |
| 55 | SUBMISSION.md:54 / :57 | cizí rodné číslo / a foreign birth number | NEPRESNÉ (ide o iné RČ na jednej správe) | jiné rodné číslo na laboratorní zprávě / a different birth number on the lab report | `gold-pacient-2.json` (`birth-number-mismatch`) |
| 56 | COVER-PROMPT.md:25 | zhora pohľad na mapu Prahy so 7 bodmi (pracoviská), spojenými jednou tyrkysovou niťou do jedného bodu „KOC“ | NEPRESNÉ – 2 zo 7 zariadení nie sú v Prahe; prípad má 2 KOC; skutočná mapa by z fiktívnych nemocníc robila reálne | zhora pohľad na abstraktnú mapu „Praha a okolie“ bez skutočných ulíc, so 7 bodmi (zariadenia), spojenými jednou tyrkysovou niťou do bodu „KOC 2“ (druhý bod „KOC 1“ pre CT) | `source.json`: Jesenice 252 42, Dolní Břežany 252 41; správy 08 a 12 z KOC 1, 09–11 a 13 z KOC 2 |
| 57 | COVER-PROMPT.md:31, PITCH.md:3 a :59, VIDEO.md:19 | Nič sa nestratí a vždy vieš, kto je na ťahu. | NEOVERITEĽNÉ (absolútny sľub) | Aby sa nič nestratilo a bolo jasné, kto je na ťahu. | – |
| 58 | MENTORI.md:16 | ## 2. MZ (Rybář, Bielčiková) | NEPRESNÉ – Bielčiková nie je z MZ | ## 2. MZ (Rybář) a VFN (doc. Bielčiková) | `docs/research/09-partneri-a-vitazne-vzorce.md:223` (Bielčiková: VFN / Nemocnice Na Františku) |
| 59 | MENTORI.md:17 | sa v KOC pilotujú od februára 2026 | NEPRESNÉ – začiatok pilotu nikto neuviedol | sa v KOC pilotne testujú (MZ ČR, 2. 9. 2026) | MZ 2. 9. 2026 (#16); MZ 4. 2. 2026 aplikácie nespomína (overené dnes) |
| 60 | MENTORI.md:23 | ## 3. VZP (Hlavinka, Bartyzal) | NEPRESNÉ – Hlavinka nie je mentor | ## 3. VZP (Bartyzal – technický mentor; Hlavinka nie je mentor, podľa našich poznámok sedí v nedeľnej porote) | `docs/research/04-slack-vyzvy-a-pravidla.md:53` (zoznam mentorov); `docs/research/10-VYHODNOTENIE-VYZIEV.md:276` |
| 61 | MENTORI.md:9 | ## 1. Koordinátorky (Vaňková, Chrástová) | Vaňková OVERENÉ, Chrástová NEOVERITEĽNÉ | ## 1. Koordinátorka Vaňková (Bulovka) a Chrástová (spoluautorka decku) | `docs/research/06-prezentacie-drive.md:69` (autori decku); Vaňková: Zdravotnický deník 4. 6. 2026 (kontrola 2) |
| 62 | MENTORI.md:47 | To je otázka „bezpečnosť a regulácia“ z hodnotiacich kritérií. | NEPRESNÉ – samostatné kritérium nie je | Bezpečnosť a regulácia sú súčasťou kritéria 2 „Využiteľnosť v praxi u zadávateľa výzvy“. | `docs/research/05-slack-refresh.md:189` |

---

## B. Overené (ponechať)

| Súbor:riadok | Tvrdenie | Zdroj |
|---|---|---|
| SUBMISSION:3–4 | Uzávierka 17. 10. 13:00, odkaz na úpravy, galéria je verejná | `docs/materials/drive/INTRO_Praha_text.md` |
| SUBMISSION:17–21 | Krátky popis do 140 znakov, CZ aj EN; dnes 118 a 113 znakov | INTRO; prepočítané |
| SUBMISSION:44 | Výzva „VZP – Cesta pacienta bez ztráty informací“ | INTRO, `Zadani_ulohy.docx` |
| SUBMISSION:24 | „7“ (ako 7 zariadení) | `source.json` |
| SUBMISSION:24 | „dvou různých KOC“ | správy 08 a 12 z KOC 1, 09–11 a 13 z KOC 2 |
| SUBMISSION:26 | „20“ položiek | `Handover_obsah.docx` |
| SUBMISSION:26 | Fronta bez skóre naliehavosti, len termíny | `app/src/pages/Queue.tsx` |
| SUBMISSION:26 | Podklad obsahuje len to, čo bolo známe k dátumu konzília | `extracted-alena.json` `docsExcluded` 12 a 13 |
| SUBMISSION:26 | Rozpory stoja vedľa seba, rozhodne človek | `extracted-*.json` `conflicts` (2 a 3) |
| SUBMISSION:28, :54 | Alena: 20 polí, 17 pascí; pacient 2: 20 polí, 13 pascí; 20/20, 17/17, 13/13, 0 vymyslených | `eval-alena.json`, `eval-pacient-2.json` (headline, 17. 10. 02:11 a 02:04) |
| SUBMISSION:54 | Štruktúrované časti čítajú deterministické pravidlá | `app/src/ai/rules.ts`; beh bez AI dáva 20/20 |
| SUBMISSION:54 | Čísla v hodnote musia byť v citáte, inak sa použije veta zo správy | `vysledok-test-halucinacii.json` (dôvody zamietnutia) |
| SUBMISSION:54 | Detektory: nemožné dátumy, strana nádoru, iné RČ, stratená alergia, chýbajúce výsledky, správy po MDT | `gold-alena.json`, `gold-pacient-2.json` |
| SUBMISSION:54 | Test poistky: zámerne chybná odpoveď, 4 z 5 zamietnuté, podklad 20/20 | `vysledok-test-halucinacii.json` |
| SUBMISSION:60 | „15 KOC“ | MZ 4. 2. 2026: „ve všech patnácti komplexních onkologických centrech“ (overené dnes); zoznam MZ 2/2026 |
| SUBMISSION:60 | „od ledna 2026“ (CZ) | MZ 4. 2. 2026: „Od ledna 2026“; MZ 2. 9. 2026: „Od roku 2026 … musí mít“ (overené dnes) |
| SUBMISSION:60 | Pľúca: viac ako 60 % nezačne liečbu do 8 týždňov od CT (MZ ČR, 2. 9. 2026) | MZ 2. 9. 2026, doslova: „více než 60 % pacientů s karcinomem plic nezahájí léčbu do osmi týdnů od provedení CT“ (overené dnes) |
| SUBMISSION:60 | Pilot 1 KOC, 3 mesiace, 50–100 prípadov | Návrh, nie fakt – OK |
| SUBMISSION:65–67 | FHIR: „V prototypu zatím ne“ | V kóde nie je FHIR |
| SUBMISSION:28 | „Prototyp, fiktivní data, není zdravotnický prostředek“ | INTRO: „Jen prototyp · Ne zdravotnický prostředek“ |
| COVER:1 | Obrázok je povinný, 16:9, do 8 MB | INTRO |
| COVER:32 | „Rakathon 2026 · výzva VZP „Cesta pacienta bez ztráty informací“ · prototyp, fiktívne dáta“ | INTRO, `Zadani_ulohy.docx` |
| COVER:15 | Zelené, oranžové a červené bodky (stav polí, nie naliehavosť) | `app/src/components/case/Semaphore.tsx` |
| PITCH:13 | Alena 63 r., 50 dní od praktika po konzílium | `source.json`; `raw-journey.md:26` (pridať „fiktívna“) |
| PITCH:14 | 13 správ zo 7 miest, 2 KOC | `source.json` |
| PITCH:24 | Demo krok 1: fronta, kto je na ťahu a do kedy, len termíny | `Queue.tsx` |
| PITCH:28 | Demo krok 5: klik na hodnotu → zvýraznená veta; citáty doslova | `OriginalPanel.tsx`; eval 72/72 a 49/49 citátov |
| PITCH:29 | Histológia do 3 pracovných dní (12. 10. pondelok → 15. 10.), doručená 19. 10. | správa 09 a 11, `cases.ts:345` |
| PITCH:30 | Demo krok 7: stav k 21. 10., 65 kg z 15. 9., 63 kg až po konzíliu | správy 05 a 12; `gold-alena.json` `weight-63-after-mdt` |
| PITCH:31 | Demo krok 8: potvrdenie, záver praktikovi, doručené, záznam (označené „simulácia“) | `MdtDoc.tsx`, `GpReport.tsx` |
| PITCH:39 | Kontrolná sada: 20 polí a 17 pascí | `gold-alena.json` |
| PITCH:46 | Predtým 6 z 13 pascí | `app/eval/README.md` |
| PITCH:51 | Rodné čísla ani telefóny k AI neodídu | `pseudo.ts`; v uložených požiadavkách sú len tokeny |
| PITCH:71 | T3N1M0, „úbytok 8 kg“, citát po konzíliu, vymyslené želanie → 4 z 5 zamietnuté, 0 vymyslených | `vysledok-test-halucinacii.json` |
| PITCH:72 | Skript `npm run eval` prepočíta výsledok pri každej zmene | `app/scripts/eval.mjs` |
| PITCH:74 | Fronta je zoradená len podľa termínov | `Queue.tsx` |
| PITCH:75 | Anglicko: elektronické odporúčania (e-RS) roky okolo 52 % | `IDEALNE-RIESENIE.md` Z31 (NHS Digital, 2018). Presnejšie: „e-RS, kým ho nezapla platba“ |
| PITCH:77 | Druhý pacient: iná diagnóza, iná poisťovňa (ZP 111), žiadanka od špecialistu | `app/data-pacient-2/` |
| VIDEO:10 | 63 r., pankreas, 13 správ, 50 dní | `source.json` |
| VIDEO:18 | Čísla 20/20 · 17/17 · 0 | `eval-alena.json` |
| MENTORI:3 | Sobota 8:00 mentoring | `research/05-slack-refresh.md` §2.1 |
| MENTORI:35 | Stránka Intake je v appke | `app/src/pages/Intake.tsx` |
| MENTORI:40 | EZCA II, rozhranie okolo 100 tis. Kč | `IDEALNE-RIESENIE.md` Z11, Z42 |
| MENTORI:45 | §65 zák. 372/2011 Sb., „jiný odborný pracovník“ | §65 ods. 2 písm. a), zakonyprolidi.cz |
| MENTORI:52 | §55a ods. 4 – podpis alebo pečať | zák. 372/2011 Sb. |
| MENTORI:61 | Škálovateľnosť je nedeľné kritérium 4 | `research/05-slack-refresh.md:193` |
| MENTORI:26 | Hlavinka v nedeľnej porote | len nepriamo: `research/10-VYHODNOTENIE-VYZIEV.md:276` |
| MENTORI:28 | Výkon 51887 ako podklad k úhrade | `raw-vykon-51887.md` |
| MENTORI:9 | Vaňková je koordinátorka (Bulovka) | Zdravotnický deník 4. 6. 2026 (kontrola 2) |

*(Overené čísla, ku ktorým treba doplniť výhradu, sú v tabuľke A: #11, #23, #46, #47, #48.)*

---

## C. Čo som dnes overil sám (nad rámec dvoch kontrol)

| Čo | Výsledok |
|---|---|
| `npm run extract -- --provider none` + `npm run eval` pre oboch pacientov (výstup do scratchpadu, `public/data` nezmenené) | Alena 20/20, 17/17, 0 vymyslených, 63/63 citátov; pacient 2 20/20, 13/13, 0 vymyslených, 44/44 citátov. **Skóre je teda rovnaké aj bez AI.** |
| Aktuálne `extracted-*.json` (02:11 / 02:04) | `mode: rules+llm`, `llmFieldsAccepted: 5`, `model: „náhrada bez Azure kľúča – odpoveď z Claude Code…“`. V `app/` nie je `.env`. |
| MZ ČR 2. 9. 2026 | Sedí: „více než 60 %…“, „pilotně testují také koordinační aplikace“, „Od roku 2026 … musí mít … minimálně jednoho koordinátora“, „hrazen částkou 250 Kč“. Telefón, e-mail ani eZprávu ako kanály stránka **neuvádza**. |
| MZ ČR 4. 2. 2026 | Sedí: „Od ledna 2026 budou ve všech patnácti komplexních onkologických centrech“. Aplikácie ani platiteľa nespomína. |
| GitHub | repo 404, API 404, profil 200 |
| `Handover_obsah.docx` | „Údaje, které má AI vytěžit z dokumentace referujícího lékaře. Podobu formuláře a datovou strukturu navrhnou soutěžící.“ |
| `request.json` v llm-cache | meno pacientky 0×, mená lekárov ostávajú (napr. MUDr. Ivana Křížová) |
