# UX audit eKoordinace – orientácia a klikateľnosť

17. 10. 2026, pred odovzdaním 13:00. Preklikané na `localhost:5199` (1440×900): Přehled, Pacienti (zoznam, Alena aj Josef, všetkých 6 záložiek), Konzilia, Žádanka od praktika (aj s ukážkou Aleny), hľadanie, zvonček. Kód som iba čítal, nič som nemenil.

Zoradené podľa dopadu na demo pred porotou VZP. Námaha: S = do 10 min, M = do 30 min.
Vlastník (podľa CLAUDE.md): Matej = `sections/pacient/` okrem Zpráv a Plánu, `state/` · Bruno = `prehled/`, `zadanka/`, `konzilia/`, `tabs/Zpravy.tsx`, `tabs/Plan.tsx` · zdieľané = `App.tsx`, `sections.tsx`, `styles.css`, `ui/` (len po dohode).

---

## 1. Počty úloh si navzájom odporujú (zvonček, Přehled, zoznam, pacient, Konzilia) – M, zdieľané (Matej `live.ts` + Bruno `Fronta`/`Konzilia`)

**Obrazovka:** všade.
**Problém:** pri Josefovi Novákovi app tvrdí štyri rôzne veci naraz:
- Přehled: „Vyřešit 4 body před konziliem, do 21. 10.“,
- Konzilia: „4 body k vyřešení“,
- zoznam Pacienti: zelené „bez úkolů“,
- karta pacienta: „K vyřešení **0** · vše vyřešeno“.

Na zvončeku je **4**, ale dlaždica „Na tahu jste vy“ ukazuje **3** a pod ňou sú 4 + 4 body. Príčina: zvonček, zoznam a dlaždica na pacientovi počítajú `todo` aktuálneho kroku (`steps.find(s => s.status === 'now').todo`), kým Přehled a Konzilia počítajú otvorené polia (`fields` so stavom chybí / neúplné / rozpor). Toto je najväčšie riziko dema, lebo porota klikne z Přehledu na Josefa a uvidí „0“.
**Oprava:**
- `src/sections/pacient/live.ts`: pridať jednu funkciu `openPoints(data, state)`, ktorá vráti `fields.filter(f => f.todo && ['chybí','neúplné','rozpor'].includes(f.status)).length` (ak `!state.confirmed`, inak 0).
- Použiť ju v `App.tsx` (`useOpenTasks`), `PatientsList.tsx` (riadky 16–18 a chip na r. 35), `PatientPage.tsx` (dlaždica „K vyřešení“, `openTasks`), `Konzilia.tsx` (r. 24) a `Fronta.tsx`.
- Zvonček má ukazovať to isté číslo ako dlaždica „Na tahu jste vy“ (počet položiek `mine`). `aria-label` potom „Na tahu jste vy (3)“.

## 2. Záložka „Zprávy“ je prázdna („Připravujeme.“) – S, Bruno

**Obrazovka:** Pacient › Zprávy.
**Problém:** je to druhá záložka, porota na ňu klikne skoro určite a uvidí prázdnu kartu. Zoznam správ pritom už existuje: na Přehledu pacienta je „Zprávy pacienta (9)“ a v kroku cesty `DocList`.
**Oprava:** `src/sections/pacient/tabs/Zpravy.tsx` – namiesto `<Soon>` vykresliť `DocList` z `../Journey` nad `Object.values(useContext(CaseCtx).data.documents)` zoradenými podľa dátumu, klik → `props.openDoc(id)`. Ak to do 12:45 nestihneš, vyhoď záložku z `TABS` v `PatientPage.tsx`. Prázdna záložka je horšia než žiadna.

## 3. Na „Žádanke od praktika“ sa nedá poznať, že som teraz praktik – S, zdieľané + Bruno

**Obrazovka:** Žádanka od praktika.
**Problém:** obsah je pohľad praktického lekára, ale celý rám ostáva koordinátorkin: vľavo dole „Bc. Lucie Dvořáková · Koordinátorka“, hore hľadanie pacientov KOC, zvonček s 4 úlohami a simulovaný deň. Jediná stopa je drobný sivý podnadpis „Pohled praktického lékaře“. Porota nevie, či žádanku posiela koordinátorka alebo lekár.
**Oprava:**
- `App.tsx`: keď `section.id === 'zadanka'`, nad `<main>` zobraziť pás „Pohled praktického lékaře – takto posílá žádanku MUDr. Tomáš Řezníček. ‹Zpět do eKoordinace›“ (tmavý text na `--soft`, bez červenej). V `side-user` zobraziť „MUDr. Tomáš Řezníček · praktický lékař“ a skryť zvonček aj hľadanie.
- `sections.tsx` + `styles.css`: položku v menu oddeliť čiarou a malým nadpisom „Pro praktika“, aby nebola na rovnakej úrovni ako práca koordinátorky.

## 4. Dvakrát „Přehled“ a drobčeky neukazujú záložku – S, Matej

**Obrazovka:** Pacient (všetky záložky).
**Problém:** v menu je „Přehled“ (fronta) a prvá záložka pacienta sa volá tiež „Přehled“. Drobčeky ukazujú iba „Pacienti › Alena Procházková“, takže po scrollnutí pod záložky človek nevie, kde je. Titulok okna je stále „eKoordinace“.
**Oprava:** `PatientPage.tsx`:
- v `TABS` premenovať `prehled` na **„Souhrn“** (id nechať kvôli odkazom),
- drobčeky: `Pacienti › <a href="#/pacienti/{id}">Alena Procházková</a> › <span class="crumb-now">{tab.label}</span>`,
- `useEffect(() => { document.title = `${tab.label} · ${data.patient.name} · eKoordinace` })`. To isté (`Přehled`, `Pacienti`, `Konzilia`) v `App.tsx` podľa `section.label`.

## 5. Tlačidlá v hlavičke pacienta sú iba ikony – S, Matej

**Obrazovka:** hlavička pacienta (telefón, list, bublina).
**Problém:** tri červené štvorčeky bez textu, význam je iba v tooltipe. Pri ukazovaní na projektore sa nedá povedať „kliknem na Vyžádat zprávu“, lebo také tlačidlo nevidno. Sú to pritom hlavné akcie koordinátorky.
**Oprava:** `PatientPage.tsx` (`PatientHead`) a `PhoneContacts.tsx`: ikona + text, trieda `btn-ghost`: **„Zavolat“**, **„Vyžádat zprávu“**, **„Napsat praktikovi“**. `round-btn` nechať iba pre úzke displeje (`@media (max-width: 820px)` text skryť).

## 6. Čo je klikateľné, nevyzerá tak (a naopak) – S, zdieľané (`styles.css`) + Matej (`pacient.css`) + Bruno (`fronta.css`, `konzilia.css`)

**Obrazovka:** Přehled, Pacienti, karta pacienta, Konzilia.
**Problém:**
- Zoznam pacientov: celý riadok je odkaz, ale nemá hover ani šípku. Na Přehledu je šípka, ale tiež bez hoveru.
- Dlaždice vyzerajú rovnako, ale na pacientovi je 1. („Údaje pro konzilium 16 z 20“) mŕtva a 2. a 3. sú klikateľné. Hover mení iba farbu čísla.
- V Konziliách je meno pacienta odkaz, ale je čierne ako bežný text.

**Oprava:**
- `styles.css`: `.stat-link:hover { background: var(--soft); }` a do každého `.stat-link` dať na koniec `<Icon name="right" size={16} />` (sivú).
- `pacient.css`: `.pt-link:hover { background: var(--soft); }` a šípka `right` na konci riadku. `fronta.css`: `.ov-list a:hover { background: var(--soft); }`.
- `PatientPage.tsx`: prvú dlaždicu zmeniť na `<a className="stat stat-link" href={`#/pacienti/${id}/udaje`}>`.
- `konzilia.css`: `.kz-who a b { text-decoration: underline; text-decoration-color: var(--line); }`.

## 7. Veci, ktoré vyzerajú ako ovládanie, a nie sú (alebo sú nebezpečné) – S, zdieľané + Matej

**Obrazovka:** ľavé menu, horná lišta, hlavička pacienta.
**Problém:**
- Karta „Bc. Lucie Dvořáková“ vľavo dole má šípku hore, ako keby otvárala menu, ale nerobí nič.
- „Simulovaný den 19. 10. 2026“ má rámček ako tlačidlo alebo výber dátumu. Je to iba informácia.
- Termín konzilia v hlavičke je natívny `input type=date`. Vyzerá ako text, ale pri jednom kliknutí počas dema sa dá zmeniť a všetky lehoty („za 2 dny“, „zítra“) sa rozsypú.

**Oprava:**
- `App.tsx`: z `side-user` odstrániť `<Icon name="up" …>`.
- `.sim-day` v CSS: bez rámčeka, sivý text s ikonou kalendára. Text v `title` nechať.
- `PatientPage.tsx` (`MdtDate`): zobraziť dátum ako text + malý odkaz „změnit“, ktorý až potom ukáže `<input type="date">`.

## 8. Dva rôzne modely cesty pacienta (Souhrn vs. Plán cesty) – M, Bruno (`Plan.tsx`) + Matej (`PatientPage.tsx`)

**Obrazovka:** Pacient › Přehled a Pacient › Plán cesty.
**Problém:** Přehled ukazuje 5 krokov (Žádost od praktika → Předchozí zprávy → Vyšetření → Podklad pro konzilium → Závěr praktikovi). Plán cesty ukazuje 7 iných čipov (CT, Biopsie EUS-FNB, Kontrolní odběry, Histologie, Podklad, Konzilium (MDT), Závěr) a vlastné dlaždice, kde je „1 zpoždění“, ktoré na Přehledu nikde nie je. Porota sa spýta, ktorá cesta platí.
**Oprava:** `tabs/Plan.tsx`: pod nadpis „Plán cesty pacientky“ dať jednu vetu „Kroky ze Souhrnu rozepsané na jednotlivá vyšetření a termíny“. V `PatientPage.tsx` (dlaždica „K vyřešení“ alebo nová) ukázať aj zpoždění z plánu, aby sa čísla zhodovali. Aktuálny krok „Podklad pro konzilium“ označiť v oboch rovnako (červená = teraz).

---

## Ďalšie (ak ostane čas)

### 9. Hľadanie otvorí pacienta, nie nájdenú správu – M, Matej (+ Bruno pre Zprávy)
`Search.tsx`: zásah na správu vedie na `#/pacienti/<id>` (Souhrn) a správa sa neotvorí. Pri Josefovi sa navyše ukazuje surový názov súboru „07_Histologie_MSD_2026-09-23“. **Oprava:** `Hit` doplniť o `docId`, `go()` → `#/pacienti/<id>/zpravy/<docId>` a v Zprávach otvoriť `openDoc(path[1])`. Pri demo prípade ukazovať `d.title`, nie `d.ref`.

### 10. Závěr je „hotový“ pred konziliom – S, Matej
Pacient › Závěr: simulovaný deň je 19. 10., konzilium 21. 10., ale záložka ukazuje vyplnený závěr MDT. **Oprava:** `tabs/Zaver.tsx`: ak `data.today < data.mdtDate`, nad dokument dať pás „Konzilium proběhne 21. 10. – níže je ukázka závěru, který pak dostane praktik“ a eyebrow „UKÁZKA“.

### 11. Zoznam pacientov: nekonzistentné stĺpce a akcie – S, Matej
`PatientsList.tsx`: hlavička stĺpca raz „Teď na řadě“, raz „Stav“, a hodnoty v riadkoch nesedia pod sebou. Alena nemá ×, ostatní áno, a nie je vysvetlené prečo. **Oprava:** vždy „Teď na řadě“ (pri novom „Přidat zprávy“). Pri Alene dať namiesto × sivý chip „demo“. „Obnovit demo“ presunúť vedľa nadpisu ako textový odkaz, nech nekonkuruje „Nový pacient“.

### 12. Žádanka: nepovinné polia svietia ako chyba – S, Bruno
`Zadanka.tsx`: pri poliach „doplňte, pokud víte“ (e-mail, výkonnostný stav, váha) je červený chip „chybí“, takže formulár pôsobí rozbito, hoci sa dá odoslať. **Oprava:** pri nepovinných poliach dať neutrálny chip „nevyplněno“ (`--soft` / `--muted`). „chybí“ nechať iba tam, kde to KOC naozaj blokuje.

---

### Čo funguje dobre (nemeniť)
- Aktívna položka menu (biela + červená) aj `aria-current`, aktívna záložka (`aria-selected`).
- Podklad: zamknuté tlačidlo „Potvrdit a vygenerovat PDF“ má vysvetlenie a zoznam „Nejdřív vyřešte 4 body“ s „Vyřešit ›“.
- Závěr: zamknuté „Odeslat praktikovi“ s textom „Zamčeno – nejdřív potvrďte podklad · Otevřít podklad“.
- Krok „Teď na řadě“ v cestě: jasné, čo urobiť a koho volať.
- Žádanka: číslované kroky 1–3 a hlavná akcia je jediné červené tlačidlo.
