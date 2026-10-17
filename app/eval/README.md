# Meranie presnosti AI vyťaženia (`npm run eval`)

Všetko je na **fiktívnych dátach**. Cieľ: dokázať číslom, že podklad pre konzílium je úplný a **nič si nevymýšľa**.

| Súbor | Čo to je |
|---|---|
| `gold-alena.json` | Ručne overená správna odpoveď pre 20 polí šablóny VZP „Handover_obsah“ + 17 pascí v správach Aleny (stav k MDT 21. 10. 2026). Každý dôkaz (`evidence`) je doslovný úryvok zo správy – eval ho pri každom behu overí, takže ani zlatá sada si nemôže nič vymyslieť. |
| `gold-pacient-2.json` | To isté pre druhého fiktívneho pacienta (pľúca, `data-pacient-2/`): 20 polí + 13 pascí, z toho 4 nové typy a kontroly falošných poplachov. |
| `llm-cache/<hash>.request.json` | Presná požiadavka na AI (už pseudonymizovaná – rodné čísla, telefóny, e-maily, adresa, dátum narodenia a mená sú tokeny). Takto vidno, čo by odišlo do Azure OpenAI v EÚ. |
| `llm-cache/<hash>.json` | Odpoveď AI na tú požiadavku (offline prehrávanie, demo funguje bez internetu). Pole `model` hovorí, odkiaľ odpoveď je. |
| `llm-fixtures/halucinujuci-model-alena.json` | **Test poistky:** úmyselne chybná AI odpoveď (vymyslené štádium T3N1M0, vymyslené čísla, citát zo správy po konzíliu, vymyslené želanie pacientky). |
| `vysledok-test-halucinacii.json` | Výsledok testu poistky: 4 z 5 AI návrhov zamietnuté s dôvodom, správny prešiel, podklad stále 20/20 a 0 vymyslených hodnôt. |

## Ako sa počíta
- **Pole správne** = správny stav (vyplnené / chýba), v hodnote sú všetky povinné údaje (`accept`), nie je tam nič zakázané (`reject`), má aspoň jeden overený citát a necituje správu po konzíliu.
- **Pasca zachytená** = výstup obsahuje upozornenie alebo rozpor, ktorý pasca vyžaduje (napr. rozpor citujúci správu 09 s dátumom 18. 10.), alebo naopak **neobsahuje** falošný poplach.
- **Pole bez overeného citátu** = hodnota, ku ktorej žiadny citát nie je doslova v správe (eval to overuje sám, neverí štatistike extraktora).
- **Vymyslená hodnota** = dátum, číslo, telefón alebo e-mail v hodnote, ktorý nie je v citovanej správe, alebo vyplnené pole, ktoré má podľa zlatej sady chýbať (napr. odhadnutý ECOG).

## Príkazy
```bash
npm run extract                                  # Alena: pravidlá + AI (z app/.env, inak offline cache) → public/data/extracted-alena.json
npm run eval                                     # → public/data/eval-alena.json (pole "headline" pre UI)
npm run extract -- --case pacient-2 && npm run eval -- --case pacient-2
npm run extract -- --provider none               # len pravidlá, bez AI
npm run extract -- --provider fixture --fixture eval/llm-fixtures/halucinujuci-model-alena.json --out /tmp/halu.json
npm run eval -- --extracted /tmp/halu.json --out /tmp/eval-halu.json
```

## Poctivo
- Zlaté sady a pravidlá písal ten istý tím. Pravidlá sme po prvom behu na pacientovi 2 zovšeobecnili (predtým 18/20 polí, 6/13 pascí). Ďalší pacient by mal prísť **naslepo** od niekoho iného.
- Bez kľúča k Azure OpenAI v pracovnom prostredí odpovedal na presne tú istú pseudonymizovanú požiadavku náhradný model (vidno v poli `model`); s kľúčom v `app/.env` stačí spustiť `npm run extract` a odpoveď sa nahrá nanovo.

## „Zkuste to rozbít“ – testy úprav (`npm run eval:mutations`)
Porotca mení text správ priamo v appke. `scripts/eval-mutations.mjs` urobí tie isté úpravy, spustí motor (len pravidlá, ako v prehliadači) a overí reakciu aj to, že sa nič nevymyslelo (každý citát doslova v upravenej správe, každé číslo/dátum hodnoty v citovanej správe). Výsledok: `eval/vysledok-mutace.json`; úpravy pre tlačidlá v UI: `public/data/mutace.json`.

| Úprava | Očakávaná reakcia |
|---|---|
| iné RČ v laboratórnej správe 10 | nový rozpor „jiné rodné číslo“, laboratórium = rozpor, obe citácie |
| poslednú dávku apixabanu (09) opraviť na 10. 10. | rozpor apixabanu zmizne, histológia ostane |
| doplniť „ECOG 1“ do žiadanky (07) | výkonnostný stav vyplnený, 20/20 |
| zmazať správu 11 | histológia „chybí“, diagnóza si adenokarcinóm nevymyslí |
| v CT (08) „kaudy“ namiesto „hlavy“ slinivky | nový rozpor lokalizácie s citátom zo správy 08 |
| nadpis „Jméno a příjmení:“ / „Pacient:“ namiesto „Pacientka:“ | meno, pohlavie, vek, poisťovňa ostanú (pohlavie z „63letá pacientka“, nie z mena) |
| priezvisko veľkými písmenami prvé („PROCHÁZKOVÁ Alena“) | meno a priezvisko správne rozdelené |
| zmazať vek aj dátum narodenia / kontaktnú osobu | „chybí“ (vek sa nepočíta z rodného čísla) |
| Novák: opraviť stranu v bronchoskopii / RČ v laboratóriu | rozpor zmizne |
| podstrčený chybný výstup (ECOG 1, 63 kg, e-mail, citát mimo správ) | eval nedá 20/20 a nájde vymyslené hodnoty |

## Slepý test – pacient 3 (Vlastimil Brabec, karcinóm rekta, `data-pacient-3/`)
- **Kto ho napísal:** agent, ktorý nevidel `src/ai/rules.ts`, zlaté sady ani správy Aleny a Nováka – dostal len 20 kľúčov polí a typy kontrol. Napísal 10 správ vo vlastnom formáte (dátumy „06.07.2026“, priezvisko veľkými, laboratórium ako tabuľka po riadkoch, štítky „Anamnéza onemocnění:“, „Otázka pro MDT:“) a zlatú sadu so 4 pascami (nejasné ložisko v pečeni × „cM0“, alergia na kontrast len v CT, warfarín → apixabán u kardiológa, dodatok dMMR po žiadosti).
- **Pred úpravou – oficiálne slepé číslo:** **10/20 položiek, 1/4 pascí, 1 položka bez overeného citátu, 1 nepodložená hodnota** (typ vyšetrenia = názov súboru), 19/19 citátov doslova → `public/data/eval-pacient-3.json`. Rovnaký výsledok pre pravidlá zmrazené pred kolom 2 (commit 279b0eb) aj po úlohe 3 (f4c45a1). Zapísané do gitu skôr, než som správy pacienta 3 otvoril (commit 88c1255).
- **Prečo:** motor nepoznal žiadosť o MDT („žádáme o projednání“), štítkové bloky namiesto nadpisov, laboratórium po riadkoch, CT/MR so štítkom „Vyšetření:“, endoskopický protokol, dodatok histológie a zmenu liekov u kardiológa. Kde nevedel, nechal pole prázdne – nič klinické si nevymyslel.
- **Po úprave (už nie slepé):** 20/20, 4/4, 0 vymyslených, 60/60 citátov → `eval/vysledok-pacient-3-po-uprave.json`. Zmeny sú všeobecné (nové typy správ a formátov + 3 nové detektory: zmena liekov „převádím z X na Y / trvale vysazen“, odporúčané vyšetrenie, ktoré sa pred konzíliom neurobilo, „cM0“ × „metastázu nelze vyloučit“). Alena a Novák ostali 20/20, testy úprav 14/14.
- **Čo z toho plynie:** na novom formáte motor bez úprav zvládol polovicu a radšej nechal prázdne, než by si vymýšľal. Skutočný test je ďalší slepý pacient od niekoho iného.
