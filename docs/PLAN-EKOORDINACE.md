# eKoordinace – čo dorobiť, aby sme splnili výzvu VZP (a viac)

_Matej (Claude), 17. 10. 2026 ~09:45. Zdroj: deck VZP (slidy 5–12, prehľad v `docs/research/vyzvy/vzp-cesta-pacienta.md`),
`Zadani_ulohy`, `Handover_obsah`, `MDT_zapis`, `MDT zaver` (`docs/materials/drive/cesta-pacienta-data/`),
požiadavky 1–27 v `docs/matej-idealny-system.md`. Appka: https://ekoordinace.vercel.app_

## 1. O čom výzva je

**Problém (slide 5): informácie sa strácajú na troch miestach.**
- **Vstup:** praktik posiela správy roztrúsené a neúplné, údaje sa prepisujú dookola.
- **Vnútri KOC:** koordinátorka dohľadáva namiesto koordinovania. Nikto nevidí stav, termín a kto je na ťahu. Konzílium
  dostane podklad neskoro alebo neúplný.
- **Výstup:** praktik nevie, či pacientku prijali, čo chýba a ako konzílium rozhodlo.

Meradlo je **čas do liečby** = diagnostika + konzílium + liečba.

**Úloha (`Zadani_ulohy`):** odsimulovať prácu koordinátorky KOC 2 na Alene Procházkovej:
1. Appka zo 13 správ zloží handover pre konzílium 21. 10. 2026 podľa `Handover_obsah`.
2. AI označí, čo chýba.
3. Koordinátorka to doplní a zapracuje do handoveru.
4. Záver konzília appka pošle praktikovi a **doloží doručenie**.

**Odovzdávame tri veci:**
1. funkčné demo celého prechodu pacientky;
2. zápis pre konzílium vytvorený appkou podľa `MDT_zapis`;
3. ukážku odoslania záveru praktikovi.

**Slide 12 – demo musí ukázať:**
- (a) referovanie bez ďalšieho formulára;
- (b) AI vyťaženie s kontrolou úplnosti;
- (c) prehľad prípadov so stavom a termínom;
- (d) vlastníka každého ďalšieho kroku;
- (e) štruktúrovaný záver KOC/konzília;
- (f) spätnú väzbu a potvrdené odovzdanie.

Hodnotia autori zadania, takže rozhoduje **doslovné splnenie** „Hotovo, když…“ a použiteľnosť v praxi.

## 2. Kde sme dnes

| Slide 12 | Stav v appke |
|---|---|
| (a) referovanie bez formulára | chýba (stará appka to mala) |
| (b) vyťaženie s kontrolou úplnosti | motor hotový. Chyby a rozpory ukazujeme ako úlohy s citáciou a kontaktom. **Chýba** obrazovka 20 údajov, kopírovanie, doplnenie a potvrdenie lekárom |
| (c) prehľad prípadov | chýba, máme len jednu pacientku |
| (d) vlastník ďalšieho kroku | čiastočne: „Úkol pro vás“ a komu volať. **Chýba** plán krokov s termínom, miestom, stavom a vlastníkom |
| (e) štruktúrovaný záver | chýba podklad `MDT_zapis` aj záver |
| (f) spätná väzba a potvrdené odovzdanie | chýba |

## 3. Šesť vecí na dorobenie, s príkladmi (v poradí, ako idú v deme)

### 1. Žádanka od praktika bez formulára (a, krok 01)
- Praktik pretiahne epikrízu (zpráva 07). Appka sama vyplní pacientku (Alena Procházková, nar. 22. 7. 1963, ZP 211),
  diagnózu C25.0 a otázku pre KOC. Praktik nič neprepisuje.
- Kontrola úplnosti ešte pred odoslaním: „chybí ECOG“, „chybí e-mail pacientky“, „výsledky nejsou přiloženy – jsou na
  5 pracovištích“. Praktik môže doplniť hneď.
- „Odeslat do KOC 2“: prípad sa objaví vo fronte ako **nový** a praktik dostane potvrdenie „přijato 2. 10. 2026“.

### 2. Údaje pro konzilium = handover 20 údajov (b, krok 02 + „doplnit“ zo zadania)
- 20 riadkov podľa `Handover_obsah`. Každý má hodnotu, stav (nalezeno / chybí / rozpor), vetu zo správy (klik ju
  zvýrazní v origináli) a tlačidlo **Kopírovat** (slide 8: „výstup v kopírovatelných částech“).
- Príklady:
  - **Váha:** 65 kg (15. 9., zpráva 05). Nie 63 kg zo zprávy 12, tá je až po konzíliu.
  - **Léky:** apixaban 5 mg 1-0-1 … Rozpor: zpráva 09 píše poslednú dávku 18. 10., ale výkon bol 12. 10.
    → „Ověřit s endoskopií“.
  - **ECOG:** chybí → **„Zapsat telefonát“**: MUDr. Řezníček, 19. 10. 10:12, „ECOG 1“. Údaj má zdroj „telefonát“,
    úloha zmizne, „K vyřešení 4 → 3“, „Údaje 16 → 17“.
- **„Potvrdit lékařem“** (MUDr. Marková, čas). Zadanie: „AI pripraví návrh, lekár potvrdí.“

### 3. Prehľad prípadov = fronta koordinátorky (c, krok 03 dashboard)
- Sekcia **Přehled**: riadok na pacienta so stavom (nový / aktívny / odložený), krokom, **kto je na ťahu** a **do kedy**:
  - Alena Procházková · aktívny · Podklad pro konzilium · na tahu: vy · do 20. 10. · 4 úkoly
  - Karel Novák (pľúca) · …; Vlastimil Brabec (rektum) · … (motor oboch už spracuje)
- Filtre: Čeká na mě · Čeká na jiné · Po termínu · Konzilium tento týden.

### 4. Plán cesty s vlastníkom každého kroku (d, krok 03 cesta)
- Zadanie menuje kroky: CT v KOC 1, biopsia, kontrolné odbery, algeziológ, psychológ – každý s **termínom, miestom
  a stavom** (vyžádáno → objednáno → provedeno → výsledek doručen):
  - CT · KOC 1 Nemocnice Severní · 8. 10. · výsledek doručen
  - Biopsie EUS-FNB · KOC 2 endoskopie · 12. 10. · provedeno
  - Histologie · KOC 2 patologie · slíbeno do 15. 10., doručeno 19. 10. → **zpoždění 2 pracovní dny**
  - Algeziologie · KOC 1 · objednáno na 26. 10. · na tahu: KOC 1
  - Psychologie · KOC 2 · objednáno na 27. 10. · na tahu: KOC 2
- Pri každom kroku „Poslat SMS pacientce“ / „E-mail pracovišti“ (simulované, zapíše sa do histórie).

### 5. Podklad pro konzilium podľa `MDT_zapis` (e + odovzdávka č. 2)
- Dokument v 7 častiach šablóny:
  1. základné údaje (dátum konzília, pacientka, poisťovňa, telefón, e-mail, adresa, váha a výška, referujúci lekár);
  2. členovia konzília;
  3. diagnóza s kódom;
  4. komorbidity;
  5. výsledky vyšetrení;
  6. záver konzília;
  7. odporúčania.
- Vypĺňa sa z handoveru, **len z toho, čo bolo známe k 21. 10.** Hore poznámka: „Zprávy 12 a 13 vznikly po konziliu,
  nejsou zahrnuty.“
- Čo chýba, je vyznačené (ECOG). Tlačidlo **„Stáhnout PDF“**.

### 6. Záver praktikovi + doručenka (f, krok 04 + odovzdávka č. 3)
- Po konzíliu koordinátorka vloží záver (vzor `MDT zaver`: hraničně resekabilní, neoadjuvantní chemoterapie, onkologie
  4. 11. 10:30).
- Praktik dostane **záver s pôvodným kontextom**:
  - čo sa pýtal (prevzatie, dokončiť diagnostiku);
  - čo konzílium rozhodlo;
  - čo má sledovať on: apixaban nevysazovat svévolně, bolest, psychologická podpora, informovat dceru se souhlasem.
- **Doručenka:** „Odesláno 21. 10. 15:10 · Doručeno 15:11 · Přečteno 16:40“ (simulované, povieme to nahlas).
- Revízny lekár ZP 211 dostane súhrn automaticky (slide 11). Prípad sa uzavrie až po potvrdení doručenia.
  Krok 5 v ceste dostane fajku.

## 4. Čím prekonáme očakávanie (väčšinu už máme)
- **Každý údaj má doslovnú citáciu**, ktorú program overí. Klik ukáže zvýraznenú vetu v správe. *(máme)*
- **Pasce sú vidieť:** chýbajúci ECOG, apixaban 18. 10. po výkone 12. 10., histológia vydaná pred odberom.
  *(máme; doplniť meškanie histológie)*
- **Stav k dátumu konzília:** appka sama vyradí správy 12 a 13 aj váhu 63 kg. *(v motore máme, ukázať v podklade)*
- **Hodiny cesty:** „den 17 od žádanky · konzilium za 2 dny“. Meria to, čo VZP chce sledovať (čas do liečby).
- **Záznam o koordinovaní:** história krokov (kto, čo, kedy) = podklad pre výkon koordinátora 51887.
- **Kontrola úplnosti už u praktika:** diera sa zaplátá pri odoslaní, nie o týždeň neskôr.

## 5. Poradie a deľba (do 12:30)
- **Matej (Claude):** 2 → 5 → 6 → 4. Najprv výslovné odovzdávky (handover, zápis, záver s doručenkou).
- **Bruno:** 1 (žádanka od praktika) a 3 (fronta v sekcii Přehled), namiesto Konzilií – tie zadanie nežiada. Jeho
  priečinok: `ekoordinace/src/sections/`.
- **Matej:** logo, kontrola, formulár odovzdania (názov tímu, mená, video, odkaz https://ekoordinace.vercel.app).
- **Ak nestíhame:** 2, 5 a 6 sú povinné (odovzdávky). Z 1, 3 a 4 aspoň zjednodušene.
