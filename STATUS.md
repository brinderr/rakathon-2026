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
| Text bez nadpisov (vzory vnútri viet + poctivý pruh) | matej | ✅ | src/ai/plain.ts, `meta.plainText.notice`; `npm run eval:plain`: sada 1 naslepo 41/80 → po úprave 66/80; **sada 2 naslepo 53/80**; 0 vymyslených |
| **eKoordinace – nová appka** (`ekoordinace/`) | matej | 🔵 | krok 1 hotový: hlavička s diagnózou z histológie, cesta v 5 krokoch (hotové kroky malé), úlohy s kontaktmi, „Dnes nové“; appka rozdelená na sekcie (pravidlá v ekoordinace/README.md); ďalej záložka Zprávy |
| eKoordinace M1 Údaje pro konzilium + doplnenie + potvrdenie lekárom | matej | ✅ | `tabs/Udaje.tsx`: zobrazenie ✅, Doplnit údaj / Zapsat ověření ✅ (živé počty, zvonček), termín konzilia v hlavičke ✅; ďalej potvrdenie lekárom |
| eKoordinace M2 Podklad podľa MDT_zapis + PDF | matej | ✅ | `tabs/Podklad.tsx`: 7 častí MDT_zapis zo živého prípadu, zdroje, potvrdenie lekárom, Tisk/PDF, Kopírovat |
| eKoordinace M3 Závěr praktikovi + doručenka + revízny lekár | matej | ✅ | `tabs/Zaver.tsx`: závěr praktikovi s doručenkou; súhrn revíznemu lekárovi poisťovne pacientky ide automaticky, jeho žiadosť o doplnenie = úloha v Přehledu (simulované) |
| eKoordinace B1 Žádanka od praktika bez formulára | bruno | ⚪ | `src/sections/zadanka/` (`#/zadanka`) |
| eKoordinace B2 Přehled (dashboard koordinátorky) | matej | ✅ | `src/sections/prehled/` – prevzal Matej na vlastnú žiadosť (Bruno sa toho nedotkol) |
| eKoordinace Konzilia (program konzílií) | matej | ✅ | `src/sections/konzilia/`: sedenia podľa dátumu, stav podkladov, Program konzilia PDF, po konziliu stav záveru |
| eKoordinace B3 Plán cesty (termín, miesto, stav, kto na ťahu) | bruno | ⚪ | `tabs/Plan.tsx` |
| eKoordinace B4 Zprávy (+ po konziliu zvlášť) | bruno | ⚪ | `tabs/Zpravy.tsx` |
| Odovzdanie: video, titulný obrázok s logom, formulár | bruno + matej | ⚪ | do 12:30, demo = https://ekoordinace.vercel.app |
| Nasadenie eKoordinace na Vercel | matej + bruno | ✅ | **https://ekoordinace.vercel.app** – každý push do `ekoordinace/` sa nasadí sám (GitHub Actions, `.github/workflows/ekoordinace-vercel.yml`) |
| Ostrý AI beh cez Azure OpenAI EU | kapitán | ⚪ | kľúč z portálu do app/.env (AZURE_OPENAI_ENDPOINT/API_KEY/DEPLOYMENT) → `npm run extract` |
| Titulný obrázok 16:9 | matej | ✅ | `docs/odovzdanie/banner-ekoordinace.jpg` (Apple štýl, tmavý; svetlý `-svetla.jpg`), zdroj `docs/odovzdanie/banner/banner.html` |

## Blokery
- (žiadne)
