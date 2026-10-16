# Prompt pre Maťovho Clauda (noc 17. 10. 2026)

Skopíruj celé do Claude Code v priečinku `rakathon-2026`.

---

Som Maťo, tím Rakathon 2026 (výzva VZP „Cesta pacienta bez ztráty informací“). Bruno má vlastného Clauda, ktorý práve stavia UI appky koordinátora. My dvaja si prácu delíme tak, aby sme si nezasahovali do súborov. Ty robíš **AI jadro, meranie presnosti, druhého pacienta a pitch**. Pracuj samostatne celú noc, commituj často (`[matej] …`), vždy `git pull --rebase --autostash` pred pushom.

## 0. Najprv si prečítaj
1. `git pull --rebase --autostash`, potom `/sync`.
2. `app/CONTRACT.md` obsahuje pravidlá, vlastníkov súborov a dizajn. **Píš LEN súbory, ktoré patria tebe:** `app/src/ai/*`, `app/scripts/extract*`, `app/scripts/eval*`, `app/eval/*`, `app/data-pacient-2/*`, `docs/pitch/*`.
3. `app/src/types.ts` obsahuje dátové typy (`HandoverField`, `Citation`, `Case` …). Tvoj výstup musí mať presne tento tvar.
4. `app/public/data/source.json` obsahuje text 13 fiktívnych správ Aleny a šablóny VZP (Handover_obsah, MDT_zapis, MDT zaver, Zadani_ulohy).
5. `docs/IDEALNE-RIESENIE.md` (§2, §5, §6, §7), `docs/matej-overdeliver.md`, `docs/ULTIMATNY-SYSTEM.md` (keď ho Brunov agent dopíše).

## 1. AI vyťaženie s overeným citátom (najdôležitejšie)
- `app/src/ai/extract.ts` a `app/scripts/extract.mjs` (Node, spustiteľné `npm run extract`, pridaj script do package.json **len tento riadok**).
- Vstup: texty správ (pole `{id, text}`) a dátum konzília (as-of). Výstup: `HandoverField[]` pre 20 položiek `Handover_obsah` (rovnaké `key` ako v `app/src/data/cases.ts`, ktoré píše Brunov agent: zosúlaď sa s nimi).
- LLM: Azure OpenAI-kompatibilné API z portálu Rakathonu (aka.ms/rakathon2026). Kľúč a endpoint **len v `app/.env`** (je v `.gitignore`), nikdy v kóde ani v gite. Priame Anthropic API nemá EÚ región, pre ostrý režim to musí byť EÚ.
- **Pravidlá:**
  - každé pole má citát;
  - program overí, že citát je **doslova** v texte správy, inak pole označí ako „návrh bez zdroja“ a nezobrazí ho ako fakt;
  - chýbajúce sa označí, nikdy nedopĺňa;
  - rozpor = obe verzie;
  - žiadne odporúčania liečby;
  - rodné čísla a telefóny do LLM neposielaj (pseudonymizuj pred volaním).
- Retry a backoff pri chybe 429 (zdieľaný limit). Výsledok pre Alenu ulož ako `app/public/data/extracted-alena.json`, aby demo bežalo aj bez internetu.

## 2. Kontrolná sada a meranie presnosti
- `app/eval/gold-alena.json` je ručná správna odpoveď pre 20 polí a zoznam „pascí“:
  - chýba ECOG;
  - nemožný dátum apixabanu (správa 09);
  - histológia „vydaná“ pred „odberom“ (správa 11);
  - váha 63 kg až po konzíliu (správa 12);
  - chýba e-mail pacientky a praktika;
  - všetky onkomarkery;
  - ďalšie, ktoré nájdeš.

  Každú over v texte.
- `app/scripts/eval.mjs` (`npm run eval`) porovná výstup extrakcie so zlatou sadou. Vypíše:
  - X/20 polí správne;
  - Y pascí zachytených;
  - počet polí bez overeného citátu;
  - počet vymyslených hodnôt.

  Výsledok ulož do `app/public/data/eval-alena.json` (UI ho môže zobraziť ako „Na kontrolnej sade: …“). Ladi prompt, kým nebude 0 vymyslených hodnôt.

## 3. Druhý fiktívny pacient (aby nikto nepovedal „ušité na jednu pacientku“)
- `app/data-pacient-2/` obsahuje 8–10 krátkych fiktívnych správ (napr. pán Novák, 60 r., rakovina pľúc alebo pankreasu podľa decku VZP) v rovnakom štýle a formáte ako správy Aleny. Každá má hlavičku „FIKTIVNÍ PACIENT – testovací data“ a obsahuje 2–3 vlastné pasce. Ulož ich ako `source-pacient-2.json` (rovnaký tvar ako source.json) a spusti na ne extrakciu aj eval.

## 4. Pitch a odovzdanie (`docs/pitch/`)
- `PITCH.md` je 3-minútový scenár:
  - **0:00–0:15** hák: Alena, 50 dní, 13 správ zo 7 miest.
  - **0:15–1:45** živé demo v 8 krokoch podľa `IDEALNE-RIESENIE.md` §7.1. Ku každému kroku napíš jednu vetu.
  - **1:45–2:30** čísla z evalu, „0 vymyslených hodnôt“ a cesta k realite (3 vety z §7.3).
  - **2:30–3:00** prosba na VZP: pilot v 1 KOC.
  - Hlavná veta: „Nič sa nestratí a vždy vieš, kto je na ťahu.“
- `VIDEO.md` je storyboard 60–90 s videa (záber po zábere, čo je na obrazovke, voiceover po slovensky).
- `SUBMISSION.md` je text do formulára submit.rakathon.cz (názov, popis, tím, technológie, odkazy). Zisti v Slacku, čo presne formulár chce a kedy je deadline (sobota 13:00).
- `COVER-PROMPT.md` je prompt na titulný obrázok 16:9 (do 8 MB).
- `MENTORI.md` obsahuje 8 otázok na mentorov z §8 a ku každej poznámku, prečo je dôležitá a čo s odpoveďou urobíme v appke.

## 5. Komunikácia
- Do `team/matej/LOG.md` píš priebežne.
- Keď potrebuješ niečo od Brunovho Clauda (napr. zmenu typu v `types.ts`), napíš do `team/bruno/INBOX.md` a pushni. Typy sám nemeň.
- Na konci každej hodiny: `npm run build` v `app/` musí prejsť. Ak ho rozbiješ, oprav to hneď.
