# Formulář submit.rakathon.cz – eKoordinace

**Uzávěrka: sobota 17. 10. 2026, 13:00.** Po 13:00 formulář nic nepřijme. Po odeslání přijde odkaz na úpravy (platí do uzávěrky),
takže **odeslat do 12:30**, pak už jen dolaďovat přes odkaz. Galerie je veřejná (submit.rakathon.cz/projects).

Pole formuláře podle úvodní prezentace (`docs/materials/drive/INTRO_Praha_text.md`): 1 Projekt · 2 Tým a výzva · 3 Dopad a AI · 4 Odkazy a obrázek.
Texty popisují eKoordinaci tak, jak je teď v kódu (`ekoordinace/src`, stav 17. 10. ráno). Čísla jsou jen z `app/public/data/eval-*.json` a `app/eval/*`.
Pravidla faktů: `docs/kontext/raw-pitch-factcheck.md`. `[…]` = doplnit před odesláním.

> **Pozor:** Maťo právě přidává AI chatbota. V kódu zatím není, proto tu není ani zmínka. Až bude v nasazené verzi, přepsat pole 3 „Jak využíváte AI?“ (CZ i EN) a krok 02 v delším popisu.

---

## 1 · Projekt

**Název:** eKoordinace

**Krátký popis (CZ, 134/140 znaků):**
> Nástroj koordinátora KOC: převezme žádanku, vytěží údaje pro MDT s citacemi, ukáže, co chybí a kdo je na tahu, vrátí závěr praktikovi.

**Short description (EN, 121/140 characters):**
> Cancer-centre coordinator tool: GP referral in, MDT data with quotes, gaps flagged, who acts next, result back to the GP.

**Delší popis (CZ):**
> Koordinátoři v komplexních onkologických centrech (KOC) dnes shánějí zprávy hlavně telefonem a e-mailem. eKoordinace je jejich pracovní nástroj: provede jeden onkologický případ od žádanky praktika po potvrzené předání závěru, ve čtyřech krocích výzvy VZP. Ukazujeme ho na fiktivní pacientce Aleně z výzvy (podezření na karcinom pankreatu, 13 zpráv ze 7 zařízení, z toho 11 známých před konziliem 21. 10. 2026) a na fiktivním testovacím pacientovi, kterého jsme napsali sami.
>
> **01 Převzít – „Žádanka od praktika“.** Praktik vybere KOC a přetáhne dopis, který už má napsaný, a zprávy ze své ambulance (Word, PDF, RTF, text nebo fotka – text z fotky a skenu rozpozná OCR přímo v prohlížeči). Údaje o lékaři i pacientovi se vyplní z dopisu samy, u každého je věta, ze které pochází; praktik může cokoli opravit nebo doplnit. Před odesláním vidí, co bude koordinátorce chybět. Jedním tlačítkem „Odeslat do …“ přistane nový pacient se všemi zprávami v seznamu koordinátorky – bez dalšího formuláře.
>
> **02 Vytěžit – „Údaje pro konzilium“.** Motor v prohlížeči vyplní 20 položek ze šablony výzvy (Handover_obsah). Každá hodnota má doslovnou citaci; klik otevře zprávu se zvýrazněnou větou. Co chybí nebo si odporuje, je označené i s tím, co udělat a komu zavolat (telefony ze zpráv). Koordinátorka zapíše ověření, doplní údaj, napíše dotaz, nebo bod ponechá s důvodem – v podkladu je pak označený jako neověřený. Každou položku jde zkopírovat. Záložka „Zprávy“ drží zprávy, které přišly až po konziliu, zvlášť – do podkladu nepatří.
>
> **03 Koordinovat – „Přehled“, „Plán cesty“, „Konzilia“.** Přehled ráno ukáže, co je na koordinátorce („Na tahu jste vy“), co čeká na ostatní (vyžádané zprávy, potvrzení lékaře, přečtení závěru), nejbližší konzilium a dnešní nové zprávy – řazeno podle termínů, bez skóre naléhavosti. Karta pacienta ukazuje cestu krok za krokem a u aktuálního kroku úkoly a koho volat. Plán cesty hlídá pořadí kroků, termíny a kdo je na tahu (vyžádáno → objednáno → provedeno → výsledek doručen), ukáže zpoždění v pracovních dnech, umí urgovat a poslat SMS pacientce nebo e-mail pracovišti; nabídne sadu kroků pro karcinom slinivky i jednorázový úkol. Konzilia řadí pacienty podle data MDT se stavem podkladu a vytisknou program konzilia. Všechno se zapisuje do záznamu koordinace.
>
> **04 Zpětná vazba – „Podklad“ a „Závěr“.** Podklad má strukturu šablony MDT_zapis; lékař KOC ho potvrdí a vygeneruje PDF – tlačítko je zamčené, dokud nejsou všechny body vyřešené nebo vědomě ponechané. Závěr složí dopis praktikovi (závěr a doporučení MDT, diagnóza i se zdrojem, datum konzilia) a pošle ho jako zabezpečenou zprávu se stavem odesláno → doručeno → přečteno; dokud praktik nepřečte, jde urgovat.
>
> **Přesnost motoru** na kontrolních sadách: Alena 20/20 položek, 17/17 pastí, 0 vymyšlených hodnot, 73/73 citací doslova ve zprávách; druhý fiktivní pacient (karcinom plic) 20/20, 13/13, 0, 49/49 – po úpravě pravidel (předtím 18/20 a 6/13). Slepý test na třetím pacientovi (karcinom rekta, jiný formát zpráv): 10/20 položek, 1/4 pastí, 1 hodnota s číslem, které v citované zprávě není; po zobecnění pravidel 20/20, 4/4, 0 (to už slepé není). Kontrolní sady psal náš tým.
>
> **Poctivě:** fiktivní data, prototyp. Odesílání (žádanka, dotazy, SMS, e-mail, závěr) je simulované a zapíše se do záznamu koordinace. Zprávy zůstávají v prohlížeči. Aplikace hraje den 19. 10. 2026, kdy přišla poslední zpráva před konziliem. Nenavrhuje diagnózu ani léčbu; podle našeho výkladu (MDCG 2019-11) to není zdravotnický prostředek – definitivně posoudí regulátor.

**Longer description (EN):**
> Coordinators in Czech comprehensive cancer centres (KOC) chase reports mostly by phone and e-mail. eKoordinace is their working tool: it takes one cancer case from the GP referral to a confirmed hand-back of the result, in the four steps of the VZP challenge. We show it on Alena, the fictional patient of the challenge (suspected pancreatic cancer, 13 reports from 7 facilities, 11 of them known before the tumour board on 21 Oct 2026), and on a fictional test patient we wrote ourselves.
>
> **01 Take over – "Žádanka od praktika" (GP referral).** The GP picks the centre and drops in the letter he has already written plus reports from his practice (Word, PDF, RTF, text or a photo – photos and scans are read by OCR in the browser). His details and the patient's are filled in from the letter, each with the sentence it came from; he can correct or add anything. Before sending he sees what the coordinator will miss. One button, "Odeslat do …", puts a new patient with all reports into the coordinator's list – no extra form.
>
> **02 Extract – "Údaje pro konzilium" (data for the tumour board).** An engine in the browser fills the 20 items of the challenge template (Handover_obsah). Every value carries a verbatim quote; a click opens the report with the sentence highlighted. Missing or conflicting items are flagged with what to do and whom to call (phone numbers from the reports). The coordinator logs a check, fills in a value, sends a question, or keeps the item with a reason – the brief then marks it as unverified. Every item can be copied. The "Zprávy" tab keeps reports that arrived after the tumour board apart – they do not belong in the brief.
>
> **03 Coordinate – "Přehled", "Plán cesty", "Konzilia".** The morning overview shows what is on the coordinator, what waits for others (requested reports, the doctor's sign-off, the GP reading the result), the next tumour board and today's new reports – sorted by deadline, no urgency score. The patient page shows the pathway step by step and, for the current step, the to-dos and whom to call. The pathway plan watches the order of steps, dates and who acts next (requested → booked → done → result delivered), shows delays in working days, can chase, text the patient or e-mail a department, and offers a step set for pancreatic cancer or a one-off task. "Konzilia" lists patients by tumour-board date with the state of their brief and prints the session programme. Everything goes into the coordination log.
>
> **04 Feedback – "Podklad" and "Závěr".** The brief follows the MDT_zapis template; a centre doctor confirms it and generates a PDF – the button stays locked until every point is resolved or knowingly kept. "Závěr" builds the letter for the GP (MDT conclusion and recommendation, diagnosis with its source, tumour-board date) and sends it as a secure message with sent → delivered → read; while unread it can be chased.
>
> **Engine accuracy** on gold sets: Alena 20/20 items, 17/17 traps, 0 invented values, 73/73 quotes verbatim in the reports; a second fictional lung-cancer patient 20/20, 13/13, 0, 49/49 – after tuning the rules (before: 18/20 and 6/13). Blind test on a third patient (rectal cancer, a different report format): 10/20 items, 1/4 traps, 1 value with a number not found in the quoted report; after generalising the rules 20/20, 4/4, 0 (no longer blind). The gold sets were written by our team.
>
> **Honestly:** fictional data, a prototype. Sending (referral, questions, SMS, e-mail, result) is simulated and written to the coordination log. Reports stay in the browser. The app plays 19 Oct 2026, the day the last report before the tumour board arrived. It does not suggest a diagnosis or treatment; in our reading of MDCG 2019-11 it is not a medical device – the regulator has the final say.

---

## 2 · Tým a výzva

| Pole | Hodnota |
|---|---|
| Město | Praha |
| Výzva | VZP – Cesta pacienta bez ztráty informací |
| Název týmu | […] |
| E-mail | […] (kapitán) |
| Členové | Bruno Duhár · Matej […] |

---

## 3 · Dopad a AI

**Jak využíváte AI? (CZ)**
> Vytěžení dělá motor přímo v prohlížeči, takže zprávy nikam neodcházejí. V nasazené eKoordinaci běží deterministická pravidla: čtou identitu, kontakty, váhu, léky, laboratoř, vyšetření a histologii a hledají pasti – nemožná data, rozpor strany nádoru, jiné rodné číslo na zprávě, alergii ztracenou v novější zprávě, výsledky, které měly přijít, a zprávy vzniklé až po konziliu. Ke každé hodnotě je citace a kód ověří, že je ve zprávě doslova (tolerujeme jen mezery a typografii); čísla v hodnotě musí být v citaci, jinak se hodnota neukáže jako fakt. Text z fotek a skenů rozpozná OCR (tesseract.js s českým modelem), také v prohlížeči. Vrstva s velkým jazykovým modelem je v motoru připravená: navrhuje 5 volných textů (diagnózu přebírá od lékaře doslovně, dále epikrízu, otázku na MDT, symptomy a jiná sdělení); před voláním nahradí rodné číslo, telefony, e-maily, adresu, datum narození a jméno pacienta i kontaktní osoby tokeny a kód každý návrh ověří. Cílově poběží v EU (Azure OpenAI) nebo v nemocnici; v prototypu bez klíče odpověděl na stejný pseudonymizovaný prompt náhradní model a v nasazené eKoordinaci je tato vrstva zatím vypnutá. Test pojistky: záměrně chybná odpověď modelu – kód zamítl všechny 4 vymyšlené návrhy, jediný správný přijal a podklad zůstal 20/20. Čísla přesnosti vycházejí stejně s modelem i bez něj. Nic nedoporučuje léčbu ani nestanovuje naléhavost; rozhoduje člověk – lékař KOC potvrzuje podklad.

**How do you use AI? (EN)**
> Extraction runs in the browser, so reports never leave it. In the deployed eKoordinace, deterministic rules read identity, contacts, weight, medication, labs, exams and histology and look for traps – impossible dates, left/right conflicts, a different birth number on a report, an allergy lost in a newer report, results that never arrived and reports written after the tumour board. Every value carries a quote and code verifies it appears verbatim in the report (ignoring only whitespace and typography); numbers in a value must appear in the quote, otherwise the value is not shown as fact. Photos and scans are read by OCR (tesseract.js with the Czech model), also in the browser. An LLM layer is ready in the engine: it drafts 5 free-text parts (the diagnosis is taken verbatim from the doctor; then the history, the question for the tumour board, symptoms and other notes); before any call it replaces birth numbers, phones, e-mails, address, date of birth and the names of the patient and contact person with tokens, and code verifies every proposal. Target: in the EU (Azure OpenAI) or inside the hospital; in the prototype, without a key, a substitute model answered the same pseudonymised prompt, and in the deployed eKoordinace this layer is switched off for now. Guard test: a deliberately wrong model answer – code rejected all 4 invented proposals, accepted the single correct one and the brief stayed 20/20. The accuracy figures are the same with or without the model. Nothing recommends treatment or scores urgency; a human decides – a centre doctor confirms the brief.

**Jaký dopad a pro koho? (CZ)**
> Pro koordinátory v 15 KOC: každé KOC musí mít od roku 2026 koordinátora, za každou jeho intervenci platí zdravotní pojišťovny centru 250 Kč (výkon 51887, nejvýše jednou denně na pacienta) a koordinační aplikace se v některých KOC teprve pilotně testují (MZ ČR, 2. 9. 2026). Koordinátorka má jedno místo, kde vidí, co je na ní a do kdy, místo hledání v e-mailech a v paměti. Pro lékaře MDT: podklad, kde je u každého údaje zdroj a díry jsou vidět předem. Pro praktiky: žádanka bez dalšího formuláře a závěr konzilia zpět s potvrzením přečtení. Cílem je, aby pacient nečekal kvůli chybějícímu údaji. Pilot: 1 KOC, 3 měsíce, 50–100 případů; měříme čas do kompletního podkladu, díry nalezené před konziliem, odložená konzilia a minuty koordinátora.

**Impact and for whom? (EN)**
> For coordinators in the 15 Czech comprehensive cancer centres: every centre must have a coordinator since 2026, all health insurers pay the centre CZK 250 per intervention (code 51887, at most once a day per patient), and coordination apps are only being piloted in some centres (Czech Ministry of Health, 2 Sep 2026). The coordinator gets one place showing what is on her and by when, instead of searching e-mails and memory. For tumour-board doctors: a brief with a source for every value and gaps visible in advance. For GPs: a referral without an extra form and the result back with a read receipt. The aim is that patients no longer wait for a missing detail. Pilot: 1 centre, 3 months, 50–100 cases, measuring time to a complete brief, gaps found before the tumour board, postponed sessions and coordinator minutes.

**FHIR od InterSystems?**
> CZ: V prototypu zatím ne. Datový model lze přímo namapovat na FHIR (DocumentReference pro zprávy, Provenance s citací ke každému údaji, Task pro „kdo je na tahu“, Composition pro podklad MDT); export do FHIR zatím není.
> EN: Not in the prototype yet. The data model maps directly onto FHIR (DocumentReference for reports, Provenance with the quote for each value, Task for "who acts next", Composition for the MDT brief); there is no FHIR export yet.

---

## 4 · Odkazy a obrázek

| Pole | Hodnota | Poznámka |
|---|---|---|
| Titulní obrázek (povinný, 16:9, do 8 MB) | `docs/odovzdanie/cover-ekoordinace.png` (1920 × 1080, 0,3 MB) | Před nahráním otevřít a zkontrolovat: česky, bez loga VZP a nemocnic, název eKoordinace. |
| GitHub | doporučení níže | `github.com/brinderr/rakathon-2026` je zvenku **404** (ověřeno 17. 10. ráno) – repo je soukromé. |
| Demo | https://ekoordinace.vercel.app | Ověřeno 17. 10. ráno: odpovídá (200). Po každém nasazení otevřít v anonymním okně. |
| Video | […] | Pokud nebude, pole nechat prázdné. |

**GitHub – doporučení:**
1. Nejlépe repo **zveřejnit** (porota hodnotí „co tým reálně vytvořil“). V historii jsme nenašli soubor `.env` ani nic, co vypadá jako klíč (rychlá kontrola `git log --all`), ale před zveřejněním ještě jednou projít `app/eval/llm-cache/` a celé `docs/` – jsou tam interní poznámky (fact-check, mentoři), které budou veřejné.
2. Když zveřejnit nechcete: pole nechat **prázdné** (odkaz na 404 působí hůř než nic) a do delšího popisu nic nepsat. Kód ukážete porotě u stolu.
3. Po zveřejnění odkaz otevřít v anonymním okně, ať nejde 404.

---

## Kontrola před odesláním
- [ ] Žádné „ostrý Azure“, „AI složí“, „VZP hradí“, „0 halucinací“, „nic se neztratí“, „AI navrhuje diagnózu“.
- [ ] Všude „fiktivní data“, „simulované odesílání“, „podle našeho výkladu není zdravotnický prostředek“.
- [ ] Krátký popis CZ a EN do 140 znaků (teď 134 a 121).
- [ ] Až bude v nasazené verzi Maťův chatbot: přepsat pole 3 (CZ i EN) a krok 02.
- [ ] Odeslat do 12:30, pak už jen úpravy přes odkaz.
