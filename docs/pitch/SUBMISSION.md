# Text do formulára submit.rakathon.cz

**Uzávierka: sobota 17. 10. 2026, 13:00 – po 13:00 formulár nič neprijme.** Po odoslaní príde odkaz na úpravy (dá sa meniť do uzávierky),
takže **odoslať radšej skôr (napr. 11:30) a potom doladiť**. Galéria projektov je verejná (submit.rakathon.cz/projects).
Zdroj štruktúry formulára: úvodná prezentácia Rakathon Praha (`docs/materials/drive/INTRO_Praha_text.md`), polia 1–4.

Formulár je český, preto texty nižšie sú **česky + anglicky**. `[…]` = doplniť pred odoslaním.

---

## 1 · Projekt

**Název (návrh, potvrdiť s Brunom):** NIT – koordinátor cesty onkologického pacienta
*(EN: NIT – cancer patient pathway coordinator)*
Alternatíva podľa appky: „Koordinátor KOC“.

**Krátký popis (CZ, 118/140 znakov):**
> Nástroj pro koordinátora KOC: AI složí podklad pro MDT s ověřenými citacemi, ukáže, co chybí, a hlídá, kdo je na tahu.

**Short description (EN, 113/140 characters):**
> Cancer-centre coordinator tool: AI drafts the MDT brief with verified quotes, flags gaps and shows who acts next.

**Delší popis (CZ):**
> Koordinátoři v komplexních onkologických centrech (KOC) skládají podklady pro multidisciplinární tým ručně z e-mailů, telefonátů a eZpráv. Fiktivní pacientka Alena má za 50 dní 13 zpráv ze 7 pracovišť včetně dvou různých KOC – a v nich díry a rozpory, které by konzilium zdržely.
>
> NIT je pracovní nástroj koordinátora, ne další portál pro lékaře. Ráno ukáže frontu případů a u každého, kdo je na tahu a do kdy (bez skóre naléhavosti, jen termíny). Žádanku od praktika založí jako případ a praktikovi pošle potvrzení přijetí se seznamem toho, co chybí. Pravidla a AI vyplní 20 polí šablony VZP „Handover“ a ke každému údaji připojí doslovnou citaci; program ověří, že citace ve zprávě opravdu je, jinak údaj nezobrazí jako fakt. Chybějící údaje jsou označené, rozpory stojí vedle sebe a rozhodne člověk. Podklad obsahuje jen to, co bylo známo k datu konzilia. Po MDT jde závěr praktikovi a každý krok se zapíše do záznamu o koordinování.
>
> Přesnost měříme: ručně ověřená kontrolní sada pro Alenu (20 polí, 17 pastí) a druhý fiktivní pacient s karcinomem plic (20 polí, 13 pastí). Výsledek: 20/20 polí, všechny pasti zachyceny, 0 vymyšlených hodnot. Prototyp, fiktivní data, není zdravotnický prostředek.

**Longer description (EN):**
> Coordinators in Czech comprehensive cancer centres (KOC) assemble the brief for the multidisciplinary team (MDT) by hand from e-mails, phone calls and secure messages. Our fictional patient Alena has 13 reports from 7 sites in 50 days, including two different cancer centres – with gaps and contradictions that would delay the tumour board.
>
> NIT is a working tool for the coordinator, not another portal for doctors. The morning view is a queue of cases showing who acts next and by when (no urgency score, only deadlines). A GP referral becomes a case and the GP gets an acknowledgement listing what is missing. Rules and AI fill the 20 fields of the VZP handover template and attach a verbatim quote to every value; code verifies the quote really is in the report, otherwise the value is not shown as fact. Missing data is flagged, conflicts are shown side by side and a human decides. The brief contains only what was known on the MDT date. After the MDT the GP receives the conclusion and every step is logged.
>
> We measure accuracy: a hand-verified gold set for Alena (20 fields, 17 traps) and a second fictional lung-cancer patient (20 fields, 13 traps). Result: 20/20 fields, all traps caught, 0 invented values. Prototype, fictional data, not a medical device.

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
> AI (velký jazykový model, v ostrém režimu Azure OpenAI v EU) čte lékařské zprávy a navrhuje volné texty podkladu pro MDT: diagnózu, epikrízu, otázku na MDT, symptomy a přání pacienta. Strukturované části (identita, kontakty, váha, laboratoř, závěry vyšetření) čtou deterministická pravidla. Každý údaj má doslovnou citaci a program ji ověří znak po znaku; čísla v hodnotě musí být v citaci, jinak se návrh zahodí a použije se věta přímo ze zprávy. Před voláním AI nahradíme rodné číslo, telefony, e-maily, adresu, datum narození a jména tokeny. Detektory pastí hlídají nemožná data, rozpor strany nádoru, cizí rodné číslo, alergii ztracenou v novější zprávě, výsledky, které měly přijít, a zprávy vzniklé až po konzíliu. AI nikdy nedoporučuje léčbu ani nestanovuje naléhavost. Přesnost měří skript proti ručně ověřené kontrolní sadě: 20/20 polí, 17/17 a 13/13 pastí, 0 vymyšlených hodnot.

**How do you use AI? (EN)**
> An LLM (Azure OpenAI in the EU in production) reads the medical reports and drafts the free-text parts of the MDT brief: diagnosis, history, the question for the MDT, symptoms and patient wishes. Structured parts (identity, contacts, weight, labs, exam conclusions) are read by deterministic rules. Every value carries a verbatim quote that code verifies character by character; numbers in a value must appear in the quote, otherwise the proposal is dropped and the sentence from the report is used instead. Birth numbers, phones, e-mails, address, date of birth and names are replaced by tokens before any AI call. Trap detectors catch impossible dates, left/right conflicts, a foreign birth number, an allergy lost in a newer report, results that never arrived and reports written after the MDT. AI never recommends treatment or scores urgency. A script measures accuracy against a hand-verified gold set: 20/20 fields, 17/17 and 13/13 traps, 0 invented values.

**Jaký dopad a pro koho? (CZ)**
> Pro koordinátory v 15 KOC (od ledna 2026, VZP hradí jejich výkon, standardní software ale nemají), pro lékaře MDT (úplný podklad bez děr) a pro praktiky (potvrzení přijetí a závěr MDT bez nového portálu a účtu). Pacient tak nečeká kvůli chybějícímu údaji – u karcinomu plic přes 60 % pacientů nezačne léčbu do 8 týdnů od CT (MZ ČR, 2. 9. 2026). Pilot: 1 KOC, 3 měsíce, 50–100 případů; měříme čas do kompletního podkladu, díry nalezené před konziliem, odložená konzilia a minuty koordinátora.

**Impact and for whom? (EN)**
> For coordinators in the 15 Czech comprehensive cancer centres (in place since January 2026 and reimbursed by VZP, yet without standard software), for MDT doctors (a complete brief without gaps) and for GPs (acknowledgement and MDT conclusion without a new portal or account). Patients stop waiting for a missing detail – over 60 % of Czech lung-cancer patients do not start treatment within 8 weeks of the CT (Czech Ministry of Health, 2 Sep 2026). Pilot: 1 centre, 3 months, 50–100 cases, measuring time to a complete brief, gaps found before the MDT, postponed MDTs and coordinator minutes.

**FHIR od InterSystems?**
> CZ: V prototypu zatím ne. Datový model kopíruje FHIR (DocumentReference pro zprávy, Provenance s citací ke každému údaji, Task pro „kdo je na tahu“, Composition pro podklad MDT), takže přechod na InterSystems IRIS for Health je přímý krok pilotu.
> EN: Not in the prototype yet. The data model mirrors FHIR (DocumentReference, Provenance with the quote for each value, Task for “who acts next”, Composition for the MDT brief), so moving to InterSystems IRIS for Health is a direct pilot step.

*(Ak Bruno do 13:00 pridá IRIS, prepísať na „Áno: …“.)*

---

## 4 · Odkazy a obrázek

| Pole | Hodnota | Poznámka |
|---|---|---|
| Titulní obrázek (povinný, 16:9, do 8 MB) | `docs/pitch/cover.png` | prompt v COVER-PROMPT.md |
| GitHub | https://github.com/brinderr/rakathon-2026 | **Repo je súkromné?** Porota ho potom neotvorí – buď zverejniť (pred tým skontrolovať, že v histórii nie je `.env` ani kľúč), alebo odkaz vynechať. |
| Demo | […] | napr. statický build appky (`npm run build` → `dist/`) na Vercel/GitHub Pages; dáta sú fiktívne a v `public/data/` |
| Video | […] | podľa VIDEO.md (75 s) – YouTube neverejné alebo Google Drive |

## Kontrola pred odoslaním
- [ ] Čísla v textoch sedia s aktuálnym `app/public/data/eval-alena.json` a `eval-pacient-2.json` (pole `headline`).
- [ ] Všade „fiktivní data“ a „není zdravotnický prostředek“.
- [ ] Žiadne logo VZP ani nemocníc na obrázku; nevystupujeme v mene ÚRO ani VZP.
- [ ] Odoslať do 12:30, potom už len úpravy cez odkaz.
