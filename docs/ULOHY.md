# Úlohy do odovzdania (12:30) – eKoordinace

Appka: **https://ekoordinace.vercel.app** · každý push sa nasadí sám · podrobnosti v `docs/PLAN-EKOORDINACE.md`.
Odškrtávame priebežne (`[x]`). Poradie v rámci každého zoznamu = poradie práce.

---

## MATEJ (+ jeho Claude) – srdce zadania: údaje, podklad, záver

Claude stavia, Matej po každej sekcii otvorí appku, preklikne ju a povie „ďalej“ alebo čo zmeniť.

- [x] **1. Údaje pro konzilium – zobrazenie** (`#/pacienti/udaje`)
  - Skontroluj: 20 údajov v skupinách ako v šablóne zadania. Klik na zdroj otvorí správu so zvýraznenou vetou.
    Viditeľné sú 4 problémy (ECOG chýba, e-mail neúplný, rozpor pri liekoch a histológii).
- [x] **2. Doplniť a overiť**
  - Pri probléme rámček „Co udělat“: čo nesedí, vety zo správ (klik = otvorí správu), koho volať s telefónom,
    tlačidlo **Doplnit údaj** (ECOG, e-mail) / **Zapsat ověření** (lieky, histológia) → zapíše sa, kto a kedy; „Vrátit“.
  - V Prehľade má každá úloha odkaz rovno na formulár (`#/pacienti/alena/udaje/performance`). Termín konzilia sa
    mení priamo v hlavičke pacienta (dátumové pole), prípad sa prepočíta.
  - Skontroluj: zapíš ECOG ako koordinátorka (napr. „ECOG 1, od praktika“). V Prehľade zmizne úloha a počty
    klesnú (K vyřešení 4 → 3).
- [x] **3. Potvrdenie lekárom**
  - „Potvrdit lékařem“ (MUDr. Marková). Krok „Podklad pro konzilium“ v ceste sa označí ako hotový.
- [x] **4. Podklad pro konzilium podľa `MDT_zapis`** (`#/pacienti/podklad`)
  - Skontroluj vedľa Word šablóny `MDT_zapis`: 7 častí, len to, čo bolo známe k 21. 10., chýbajúce vyznačené.
- [x] **5. Podklad ako PDF**
  - Skontroluj: „Stáhnout PDF“, súbor otvor a pozri.
- [ ] **6. Závěr – obsah** (`#/pacienti/zaver`)
  - Skontroluj vedľa vzoru `MDT zaver`: čo sa praktik pýtal, čo rozhodlo konzílium, čo má sledovať on.
- [ ] **7. Odoslanie praktikovi a doručenka**
  - Skontroluj: „Odeslat praktikovi“ → Odesláno → Doručeno → Přečteno, súhrn pre revízneho lekára, posledný krok
    cesty hotový.

---

## BRUNO (+ jeho Claude) – všetko ostatné, čo treba, aby celý prechod bežal

Každá časť je vo vlastnom priečinku, kostra s popisom je pushnutá. Pred pushom `npm run check`.

- [ ] **B1. Žádanka od praktika bez formulára** (`ekoordinace/src/sections/zadanka/`, adresa `#/zadanka`)
  - [ ] zapnúť sekciu v `src/sections.tsx` (`render: () => <Zadanka />`)
  - [ ] praktik pretiahne žiadanku (pre demo aj tlačidlo „Použít žádanku z 2. 10.“)
  - [ ] polia sa vyplnia samy z motora: pacientka, ZP, diagnóza C25.0, čo praktik žiada – nič neprepisuje
  - [ ] kontrola úplnosti pred odoslaním: chýba ECOG, chýba e-mail pacientky, výsledky nie sú priložené (5 pracovísk)
  - [ ] „Odeslat do KOC 2“ → potvrdenie praktikovi „Přijato“, zápis cez `addEvent`
- [ ] **B2. Fronta prípadov = Přehled** (`ekoordinace/src/sections/prehled/`)
  - [ ] skript nad motorom pre Nováka a Brabca → `src/data/fronta.json`
  - [ ] riadok na pacienta: stav (nový / aktívny / odložený), krok, kto je na ťahu, do kedy, počet úloh
    (Alena živo cez `useCase`)
  - [ ] filtre: Čeká na mě · Čeká na jiné · Po termínu · Konzilium tento týden
  - [ ] klik na Alenu → `#/pacienti`; zapnúť sekciu v `src/sections.tsx`
- [ ] **B3. Plán cesty** (`ekoordinace/src/sections/pacient/tabs/Plan.tsx`)
  - [ ] kroky s termínom, miestom, stavom a kto je na ťahu:
    - CT – KOC 1, 8. 10.
    - biopsia – KOC 2, 12. 10.
    - odbery – KOC 2, 15. 10.
    - histológia – sľúbená do 15. 10., prišla 19. 10. → meškanie
    - algeziológ – KOC 1, 26. 10.
    - psychológ – KOC 2, 27. 10.
  - [ ] stav: vyžádáno → objednáno → provedeno → výsledek doručen
  - [ ] „SMS pacientce“ / „E-mail pracovišti“ (simulované) → `addEvent`
- [ ] **B4. Zprávy** (`ekoordinace/src/sections/pacient/tabs/Zpravy.tsx`)
  - [ ] všetkých 11 správ v zozname (komponent `DocList`), podľa dátumu, filter podľa typu; klik otvorí čítačku
  - [ ] zvlášť „Po konziliu – nepatří do podkladu“: algeziológia 26. 10., psychoonkológia 27. 10.
- [ ] **B5. Odovzdanie**
  - [ ] titulný obrázok 16:9 s logom eKoordinace (`docs/odovzdanie/`)
  - [ ] video 1:30 na novej appke (poradie dema nižšie)

---

## SPOLU

- [ ] **11:45** nahrať video. Poradie dema: žiadanka (B1) → fronta (B2) → prehľad Aleny → údaje a telefonát ECOG (2)
  → plán cesty (B3) → podklad PDF (4–5) → záver a doručenka (6–7)
- [ ] **12:15** formulár na submit.rakathon.cz: tím, mená, demo https://ekoordinace.vercel.app, video, titulný obrázok
- [ ] **12:30** odoslané
