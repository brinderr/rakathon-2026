# Video – storyboard (75 s, záložné demo + odkaz do formulára)

**Účel:** 1) odkaz „video“ vo formulári submit.rakathon.cz, 2) záloha, ak živé demo na pitchi zlyhá.
**Formát:** 16:9, 1920 × 1080, nahrávka skutočnej obrazovky appky (nie maketa), titulky v slovenčine, hudba potichu.
**Hlas:** pokojný, ľudský, bez „AI revolúcie“. Voiceover čítať z tejto tabuľky (≈ 150 slov ≈ 75 s).
**Pravidlo:** v každom zábere je vidieť pätička „Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka“.

| # | Čas | Obrazovka (čo je vidieť) | Akcia / pohyb kamery | Voiceover (SK) | Text na obrazovke |
|---|---|---|---|---|---|
| 1 | 0:00–0:06 | Čierna → 13 papierov správ rozhádzaných po stole (alebo rýchla montáž 13 náhľadov zo `source.json`) | Papiere sa rozletia do strán | „Alena má 63 rokov a podozrenie na rakovinu pankreasu.“ | **13 správ · 7 miest · 50 dní** |
| 2 | 0:06–0:12 | Montáž: e-mail, telefón, eZpráva (ikony) | Rýchle strihy | „Jej správy ležia u praktika, na poliklinike a v dvoch rôznych nemocniciach.“ | – |
| 3 | 0:12–0:20 | Appka: **Fronta** – „Čaká na mňa / Čaká na iných / Konzílium tento týždeň“ | Pomalý zoom na riadok Alena | „Koordinátorka KOC ráno vidí, kto je na ťahu a do kedy.“ | **Kto je na ťahu** |
| 4 | 0:20–0:28 | **Prijaté** → žiadanka praktika (správa 07) | Klik, prípad sa založí | „Žiadanka od praktika príde e-mailom a prípad sa založí sám. Praktik dostane potvrdenie a zoznam, čo chýba.“ | **Prijaté · potvrdenie odoslané** |
| 5 | 0:28–0:38 | **Prípad → Semafor podkladu** (20 polí, žlté/červené) | Prejazd po semafore | „Pravidlá a AI z trinástich správ vyplnia dvadsať polí šablóny VZP. Čo chýba alebo si odporuje, je označené – nič si nedomýšľajú.“ | **Chýba ECOG · nemožný dátum lieku · histológia pred odberom** |
| 6 | 0:38–0:46 | Klik na hodnotu → **zvýraznená veta v pôvodnej správe** | Zoom na zvýraznenie | „Každý údaj má doslovný citát. Program overí, že tá veta v správe naozaj je.“ | **0 polí bez citátu** |
| 7 | 0:46–0:54 | **Prepínač „stav k 21. 10.“** – váha 65 kg, správy 12 a 13 zmiznú | Prepnúť tam a späť | „Podklad obsahuje len to, čo bolo známe v deň konzília.“ | **stav k 21. 10. 2026** |
| 8 | 0:54–1:02 | **Podklad pre konzílium** → **Záver pre praktického lekára** → „doručené“ | Posun dokumentom, klik „odoslať“ | „Lekár podklad potvrdí a praktik dostane záver tam, kde ho číta. Slučka je uzavretá.“ | **Doručené praktikovi** |
| 9 | 1:02–1:10 | Terminál alebo karta „Na kontrolnej sade“ (`eval-alena.json` → headline) | Čísla sa objavia po jednom | „Na kontrolnej sade: dvadsať z dvadsiatich polí, sedemnásť zo sedemnástich pascí, nula vymyslených hodnôt.“ | **20/20 polí · 17/17 pascí · 0 vymyslených** |
| 10 | 1:10–1:15 | Biela obrazovka, názov projektu | Fade | „Nič sa nestratí a vždy vieš, kto je na ťahu.“ | **Nič sa nestratí a vždy vieš, kto je na ťahu.** · Rakathon 2026 · VZP |

## Technické poznámky
- Nahrávať v Chrome, okno 1920 × 1080, zoom 110 %, kurzor zvýrazniť. Zvuk (voiceover) nahrať zvlášť a zostrihať pod obraz.
- Čísla v zábere 9 vziať **z aktuálneho** `app/public/data/eval-alena.json` (pole `headline`) – po každom novom behu `npm run eval` sa môžu zmeniť.
- Žiadne logo VZP ani nemocníc (nevystupujeme v ich mene); názvy nemocníc v dátach sú fiktívne.
- Export: MP4 H.264, do ~50 MB; nahrať na YouTube (neverejné) alebo Google Drive a odkaz dať do formulára.
- Ak treba 60 s: vynechať zábery 2 a 7.
