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
| AI vyťaženie s overeným citátom (`npm run extract`) | matej | ✅ | app/src/ai/*, výstup public/data/extracted-alena.json + extracted-pacient-2.json; AI odpovede (rules+llm) sa práve dopĺňajú |
| Kontrolná sada a meranie (`npm run eval`) | matej | ✅ | eval/gold-alena.json (20 polí, 17 pascí), gold-pacient-2.json (20, 13) → public/data/eval-*.json, pole `headline` pre UI |
| Druhý fiktívny pacient (pľúca) | matej | ✅ | app/data-pacient-2/ (10 správ, 4 nové typy pascí) |
| Pitch a odovzdanie | matej | ✅ návrh | docs/pitch/ (PITCH, VIDEO, SUBMISSION, COVER-PROMPT, MENTORI) – doplniť názov tímu, mená, odkazy; **odoslať do 12:30** |
| Ostrý AI beh cez Azure OpenAI EU | kapitán | ⚪ | kľúč z portálu do app/.env (AZURE_OPENAI_ENDPOINT/API_KEY/DEPLOYMENT) → `npm run extract` |
| Titulný obrázok 16:9 | ⚪ | ⚪ | prompt v docs/pitch/COVER-PROMPT.md |

## Blokery
- (žiadne)
