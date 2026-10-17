# Text do formulára submit.rakathon.cz

**Uzávierka: sobota 17. 10. 2026, 13:00 – po 13:00 formulár nič neprijme.** Po odoslaní príde odkaz na úpravy (dá sa meniť do uzávierky),
takže **odoslať do 12:30 a potom už len dolaďovať cez odkaz**. Galéria projektov je verejná (submit.rakathon.cz/projects).
Štruktúra formulára: úvodná prezentácia Rakathon Praha (`docs/materials/drive/INTRO_Praha_text.md`), polia 1–4.
Texty nižšie: **česky + anglicky** (formulár chce CZ aj EN). `[…]` = doplniť pred odoslaním. Opravené podľa `docs/kontext/raw-pitch-factcheck.md`.

---

## 1 · Projekt

**Název (potvrdiť s Brunom):** NIT – koordinátor cesty pacienta
*(EN: NIT – cancer patient pathway coordinator)*

**Krátký popis (CZ, 123/140 znaků):**
> Nástroj pro koordinátora KOC: složí podklad pro MDT z doslovných citací ze zpráv, ukáže, co chybí, a hlídá, kdo je na tahu.

**Short description (EN, 117/140 characters):**
> Cancer-centre coordinator tool: builds the MDT brief from verbatim report quotes, flags gaps and shows who acts next.

**Delší popis (CZ):**
> Koordinátoři v komplexních onkologických centrech (KOC) dnes shánějí zprávy hlavně telefonem a e-mailem, část center přijímá eZprávu. Fiktivní pacientka Alena má 13 zpráv ze 7 zařízení včetně dvou různých KOC; od praktika ke konziliu uběhlo 50 dní. A v nich díry a rozpory: chybí ECOG, datum vysazení apixabanu nesedí a histologie je „vydaná“ den před odběrem.
>
> NIT je pracovní nástroj koordinátora, ne další portál pro lékaře. Ráno ukáže frontu případů a u každého, kdo je na tahu a do kdy (bez skóre naléhavosti, jen termíny). Když přijde žádanka od praktika, praktik dostane potvrzení přijetí se seznamem toho, co chybí (v prototypu simulováno). Zprávy zpracuje motor přímo v prohlížeči: pravidla vyplní 20 položek ze zadání výzvy (Handover_obsah), volitelná AI navrhne pět volných textů z vět lékařů (diagnózu přebírá od lékaře doslovně) a ke každému údaji je doslovná citace – program ověří, že ve zprávě opravdu je, jinak údaj nezobrazí jako fakt. Chybějící údaje jsou označené, rozpory stojí vedle sebe a rozhodne člověk; kdo změní text zprávy, hned uvidí nový rozpor nebo „chybí“. Chybějící ECOG koordinátorka doplní zápisem telefonátu. Podklad obsahuje jen to, co bylo známo k datu konzilia, a má strukturu zápisu z jednání MDT. Po MDT jde závěr praktikovi (v prototypu simulováno) a každý krok se zapíše do záznamu o koordinování.
>
> Přesnost měříme na ručně ověřených kontrolních sadách: Alena 20/20 položek a 17/17 pastí, druhý fiktivní pacient s karcinomem plic 20/20 a 13/13, 0 čísel a dat bez opory ve zprávách – stejně s AI i bez ní; význam vět potvrzuje člověk. Kontrolní sady psal náš tým a pravidla jsme po prvním běhu na druhém pacientovi upravili (předtím 18/20 položek a 6/13 pastí). Slepý test na třetím pacientovi (karcinom rekta, jiný formát zpráv), kterého napsal agent bez přístupu k pravidlům: 10/20 položek a 1/4 pastí – co motor neznal, nechal prázdné; po zobecnění pravidel 20/20 a 4/4 (to už ale slepé není). Jsou to fiktivní pacienti a prototyp, ne klinická validace. Účel: úplný podklad pro MDT a hlídání termínů; nenavrhuje diagnózu ani léčbu. Podle našeho výkladu (MDCG 2019-11) to není zdravotnický prostředek – definitivně posoudí regulátor.

**Longer description (EN):**
> Coordinators in Czech comprehensive cancer centres (KOC) chase reports mostly by phone and e-mail; some centres also receive secure eZpráva messages. Our fictional patient Alena has 13 reports from 7 facilities, including two different cancer centres; 50 days passed from the first GP visit to the tumour board. The reports hide gaps and contradictions: no ECOG, an impossible anticoagulant date and a histology report issued the day before the biopsy.
>
> NIT is a working tool for the coordinator, not another portal for doctors. The morning view is a queue of cases showing who acts next and by when (no urgency score, only deadlines). When a GP referral arrives, the GP gets an acknowledgement listing what is missing (simulated in the prototype). An engine running in the browser processes the reports: rules fill the 20 items of the challenge's handover list (Handover_obsah), optional AI drafts five free-text parts from the doctors' sentences (the diagnosis is taken verbatim from the doctor), and every value carries a verbatim quote that code verifies in the report – otherwise the value is not shown as fact. Missing data is flagged, conflicts are shown side by side and a human decides; edit a report and a new conflict or a "missing" flag appears at once. The coordinator fills the missing ECOG from a logged phone call. The brief contains only what was known on the MDT date and follows the MDT record template. After the MDT the GP receives the conclusion (simulated in the prototype) and every step is logged.
>
> We measure accuracy on hand-verified gold sets: Alena 20/20 items and 17/17 traps, a second fictional lung-cancer patient 20/20 and 13/13, 0 numbers or dates without support in the reports – with or without AI; a human confirms the meaning of sentences. Both gold sets were written by our team and we tuned the rules after the first run on the second patient (before: 18/20 items, 6/13 traps). Blind test on a third patient (rectal cancer, a different report format) written by an agent with no access to our rules: 10/20 items and 1/4 traps – what the engine did not know it left empty; after generalising the rules 20/20 and 4/4 (no longer blind). These are fictional patients and a prototype, not a clinical validation. Purpose: a complete MDT brief and deadline tracking; it does not suggest a diagnosis or treatment. In our reading of MDCG 2019-11 it is not a medical device – the regulator has the final say.

---

## 2 · Tým a výzva

| Pole | Hodnota |
|---|---|
| Město | Praha |
| Výzva | VZP – Cesta pacienta bez ztráty informací |
| Název týmu | […] |
| E-mail | […] (kapitán) |
| Členové | Bruno […] · Matej […] |

---

## 3 · Dopad a AI

**Jak využíváte AI? (CZ)**
> Jádrem je motor, který čte lékařské zprávy a běží přímo v prohlížeči. Deterministická pravidla vyplní identitu, kontakty, váhu, léky, laboratoř, vyšetření a histologii a hledají pasti. Volitelný velký jazykový model (cílově v EU nebo lokálně v nemocnici; v prototypu bez klíče odpověděl na stejný pseudonymizovaný prompt náhradní model) navrhuje pět volných textů z vět lékařů: diagnózu nestanovuje, přebírá ji od lékaře doslovně (žádanka, závěr histologie); dále epikrízu, otázku na MDT, symptomy a jiná sdělení. Každý údaj má citaci a program ověří, že je ve zprávě doslova (tolerujeme jen mezery a typografii – pomlčky, uvozovky, ×); čísla v hodnotě musí být v citaci a zápor musí sedět s citovanou větou (podle metody NegEx; věty s opačným významem zachyceny 5 z 5, falešné poplachy 0 z 18), jinak se návrh zahodí a použije se věta přímo ze zprávy. Před voláním AI nahradíme rodné číslo, telefony, e-maily, adresu, datum narození a jméno pacienta i kontaktní osoby tokeny (i pseudonymizovaná data jsou stále osobní údaje). Detektory pastí hlídají nemožná data, rozpor strany nádoru, jiné rodné číslo na laboratorní zprávě, alergii ztracenou v novější zprávě, výsledky, které měly přijít, a zprávy vzniklé až po konziliu. Upozornění na léky netvoříme, jen citujeme lékaře („Upozornění lékaře ve zprávě 07“). AI má zakázáno doporučovat léčbu a stanovovat naléhavost; fronta se řadí jen podle termínů. Čísla přesnosti (20/20 položek, 17/17 a 13/13 pastí, 0 čísel bez opory ve zprávách) vycházejí stejně s AI i bez ní; význam vět potvrzuje člověk. Test pojistky: záměrně chybná odpověď AI (vymyšlené stadium, čísla, citace ze zprávy po konziliu, přání pacientky) – kód zamítl všechny 4 vymyšlené návrhy, jediný správný přijal a podklad zůstal 20/20.

**How do you use AI? (EN)**
> The core is an engine that reads medical reports and runs in the browser. Deterministic rules fill identity, contacts, weight, medication, labs, exams and histology and look for traps. An optional LLM (target: in the EU or locally in the hospital; in the prototype, without a key, a substitute model answered the same pseudonymised prompt) drafts five free-text parts from the doctors' sentences: it does not make a diagnosis but takes it verbatim from the doctor (referral, histology conclusion); then the history, the question for the MDT, symptoms and other notes. Every value carries a quote and code verifies it appears verbatim in the report (ignoring only whitespace and typography such as dashes, quotes and ×); numbers in a value must appear in the quote and a negation must match the quoted sentence (NegEx-style; flipped-meaning sentences caught 5 of 5, false alarms 0 of 18), otherwise the proposal is dropped and the sentence from the report is used instead. Birth numbers, phones, e-mails, address, date of birth and the names of the patient and contact person are replaced by tokens before any AI call (pseudonymised data is still personal data). Trap detectors catch impossible dates, left/right conflicts, a different birth number on the lab report, an allergy lost in a newer report, results that never arrived and reports written after the MDT. We never write our own medication warnings, we only quote the doctor ("Doctor's warning in report 07"). The AI is instructed never to recommend treatment or score urgency; the queue is sorted by deadlines only. The accuracy figures (20/20 items, 17/17 and 13/13 traps, 0 numbers without support in the reports) are the same with or without AI; a human confirms the meaning of sentences. Guard test: a deliberately wrong AI answer (invented stage, numbers, a quote from a post-MDT report, a fake patient wish) – code rejected all 4 invented proposals, accepted the single correct one and the brief stayed 20/20.

**Jaký dopad a pro koho? (CZ)**
> Pro koordinátory v 15 KOC (povinní od ledna 2026; každou jejich intervenci hradí zdravotní pojišťovny centru částkou 250 Kč, výkon 51887; koordinační aplikace se v některých KOC teprve pilotně testují – MZ ČR, 2. 9. 2026), pro lékaře MDT (úplný podklad bez děr) a pro praktiky (potvrzení přijetí a závěr MDT kanálem, který ambulance už má – bez nového portálu). Cílem je, aby pacient nečekal kvůli chybějícímu údaji – u karcinomu plic více než 60 % pacientů nezahájí léčbu do osmi týdnů od CT (MZ ČR, 2. 9. 2026). Pilot: 1 KOC, 3 měsíce, 50–100 případů; měříme čas do kompletního podkladu, díry nalezené před konziliem, odložená konzilia a minuty koordinátora.

**Impact and for whom? (EN)**
> For coordinators in the 15 Czech comprehensive cancer centres (mandatory in every centre since January 2026; each intervention is reimbursed to the centre by all health insurers – code 51887, CZK 250; coordination apps are only being piloted in some centres – Czech Ministry of Health, 2 Sep 2026), for MDT doctors (a complete brief without gaps) and for GPs (acknowledgement and MDT conclusion through a channel the practice already uses – no new portal). The aim is that patients no longer wait for a missing detail – over 60 % of Czech lung-cancer patients do not start treatment within 8 weeks of the CT (Czech Ministry of Health, 2 Sep 2026). Pilot: 1 centre, 3 months, 50–100 cases, measuring time to a complete brief, gaps found before the MDT, postponed MDTs and coordinator minutes.

**FHIR od InterSystems?**
> CZ: V prototypu zatím ne. Datový model lze přímo namapovat na FHIR (DocumentReference pro zprávy, Provenance s citací ke každému údaji, Task pro „kdo je na tahu“, Composition pro podklad MDT); export do FHIR zatím není.
> EN: Not in the prototype yet. The data model maps directly onto FHIR (DocumentReference, Provenance with the quote for each value, Task for “who acts next”, Composition for the MDT brief); there is no FHIR export yet.

---

## 4 · Odkazy a obrázek

| Pole | Hodnota | Poznámka |
|---|---|---|
| Titulní obrázek (povinný, 16:9, do 8 MB) | `docs/odovzdanie/cover.png` (Bruno, 1920 × 1080, 0,5 MB) | Texty na obrázku majú byť česky a so sloganom „Aby se nic neztratilo a bylo jasné, kdo je na tahu.“ (Bruno) |
| GitHub | […] | Repo `brinderr/rakathon-2026` je zvonku **404 (súkromné)**. Buď ho zverejniť (pred tým skontrolovať, že v histórii nie je `.env` ani kľúč), alebo pole nechať prázdne. |
| Demo | https://claude.ai/artifact/5JEhKBgT3g6mhAQ44PrHH4 | Brunova appka; po prerobení na „Zpracování naživo“ znovu nahrať a **overiť v anonymnom okne**. |
| Video | […] | podľa VIDEO.md (max 1:30, česky, hlas ElevenLabs) – YouTube neverejné alebo Google Drive |

## Kontrola pred odoslaním
- [x] Slepý test doplnený (`app/public/data/eval-pacient-3.json`: 10/20, 1/4; po úprave `app/eval/vysledok-pacient-3-po-uprave.json`: 20/20, 4/4).
- [ ] Čísla sedia s `app/public/data/eval-alena.json` a `eval-pacient-2.json`.
- [ ] Všade „fiktivní data“ a „podle našeho výkladu není zdravotnický prostředek“; žiadne „ostrý Azure“, „VZP hradí“, „AI složí“, „0 halucinací“, „nic si nevymyslí“, „AI navrhuje diagnózu“, „RČ k AI neodejde“ (kritici 06, 09, syntéza § 6).
- [ ] Žiadne logo VZP ani nemocníc na obrázku; nevystupujeme v mene ÚRO ani VZP.
- [ ] Odoslať do 12:30, potom už len úpravy cez odkaz.
