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
