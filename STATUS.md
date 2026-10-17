# STATUS – kto čo robí

_Aktualizuj pri každom `/handoff`. Stav: 🔵 robí sa · ✅ hotové · ⛔ blokované · ⚪ voľné_

| Úloha | Vlastník | Stav | Poznámka |
|---|---|---|---|
| Setup repa a tímového workflow | bruno | ✅ | CLAUDE.md, hooky, príkazy |
| Research: zameranie Rakathonu, výzvy, minuloroční víťazi | bruno | ✅ | docs/research/00-SUHRN.md |
| Stiahnuť materiály zo Slacku | bruno | ✅ | docs/materials/slack/INDEX.md |
| Výber výzvy (submit.rakathon.cz) | obaja | ✅ | VZP – Cesta pacienta bez ztráty informací |
| Trhový research výziev (dopyt, konkurencia, expanzia, ÚRO) | matej | ✅ | docs/research/matej-trh-expanzia-uro.md |
| Získať prístup (kartička kapitána, Copilot) | kapitán | ⚪ | |
| AI vyťaženie s overeným citátom (`npm run extract`) | matej | ✅ | app/src/ai/*, výstup public/data/extracted-alena.json + extracted-pacient-2.json (pravidlá + AI, všetky AI návrhy overené) |
| Kontrolná sada a meranie (`npm run eval`) | matej | ✅ | eval/gold-alena.json (20 polí, 17 pascí), gold-pacient-2.json (20, 13) → public/data/eval-*.json, pole `headline` pre UI |
| Druhý fiktívny pacient (pľúca) | matej | ✅ | app/data-pacient-2/ (10 správ, 4 nové typy pascí) |
| Pitch a odovzdanie | matej | ✅ | docs/pitch/ (PITCH, VIDEO, SUBMISSION, COVER-PROMPT, MENTORI) – doplniť názov tímu, mená, odkazy; **odoslať do 12:30** |
| Slepý test – pacient 3 (agent bez prístupu k pravidlám) | matej | ✅ | app/data-pacient-3/: naslepo 10/20 položiek, 1/4 pascí (public/data/eval-pacient-3.json); po zovšeobecnení pravidiel 20/20, 4/4 (eval/vysledok-pacient-3-po-uprave.json) |
| Motor pre „Zkuste to rozbít“ (česky, odolný) | matej | ✅ | npm run eval:mutations 14/14; public/data/mutace.json = 6 pripravených úprav pre UI |
| Vlna 1 kritikov: upozornenia na lieky len ako citát lekára + poctivé vety v SUBMISSION/PITCH | matej | ✅ | nález `doctor-warning-<zpráva>`; „0 čísel bez opory, význam potvrzuje člověk“ |
| Poistka proti opačnému významu (NegEx) | matej | ✅ | `npm run eval:guard`: 5/5 viet kritika 06 (bez nej 0/5), ďalšie 3/5, falošné poplachy 0/18 → public/data/pojistka.json |
| Text bez nadpisov (vzory vnútri viet + poctivý pruh) | matej | 🔵 | src/ai/plain.ts, `meta.plainText.notice`; slepé žiadanky píše agent bez pravidiel → `npm run eval:plain` |
| Ostrý AI beh cez Azure OpenAI EU | kapitán | ⚪ | kľúč z portálu do app/.env (AZURE_OPENAI_ENDPOINT/API_KEY/DEPLOYMENT) → `npm run extract` |
| Titulný obrázok 16:9 | ⚪ | ⚪ | prompt v docs/pitch/COVER-PROMPT.md |

## Blokery
- (žiadne)
