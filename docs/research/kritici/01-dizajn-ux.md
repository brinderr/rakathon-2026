# Kritik 01 – dizajn a UX (17. 10. 2026)

## Verdikt
Appka nevyzerá ako klinický nástroj, lebo ju tak nikto nenavrhol: `app/CONTRACT.md` predpisuje „fialovo-mätový gradient“ a fronta je takmer kópia Dribbble konceptu CRM pre freelancerov (`app/design/ref-1-crm-cards.jpg`). Obsah je silný, ale prekrýva ho dekorácia, takže na 1440×900 vidno len 3 pacientov a prvá vec na vyriešenie u Aleny je až ~1 320 px pod horným okrajom. Netreba to skrášliť, treba to stíšiť: pracovný zoznam, jedna modrá a farba len tam, kde musí konať človek (~8 h práce agentov, väčšinu zmeny spravia samotné tokeny).

## Top nálezy

**1. Slop predpisuje kontrakt, agenti ho len kreslia.**
Dôkaz: sekcia Dizajn v `CONTRACT.md` (ref-1, ref-4 = Dribbble shoty), `src/theme.css` (`--accent-grad`, `--pastel-1..3`, žiary na `body`). Fialová je predvolená farba AI generátorov, autor Tailwindu sa za `bg-indigo-500` ospravedlnil ([prg.sh](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)).
Zmena: prepísať sekciu Dizajn, zmazať `design/ref-*.jpg`, vložiť tokeny z prílohy, odstrániť 16× `gradient` v CSS.
Dopad: vysoký, inak sa slop vráti. Práca: 0,5 h.

**2. Fronta sú vizitky, nie pracovný zoznam (worklist).**
Dôkaz: `01-fronta.png`: 5 kariet po ~380 px, meno na stred, krúžok s iniciálami, mikro-stĺpce KONZÍLIUM / NA ŤAHU / TERMÍN = From / Sector / Budget z ref-1. Ranný prehľad, filtre a karty hovoria to isté trikrát. Epic stavia zoznamy pacientov ako tabuľky so stĺpcami ([Connect Care](https://builder.connect-care.ca/norms/build-style/documentation-style-guide/patient-list-styles)).
Zmena: tabuľka s riadkom 40 px ([Carbon](https://carbondesignsystem.com/components/data-table/style/)): Pacient (priezvisko, vek, dg.) | Další krok | Na tahu | Termín (po termíne červené „−3 dny“) | Konzilium | Podklad („14/20 · chybí 1 · rozpory 2“). Skupiny „Dnes na mně / Čeká na jiných / Odložené“ nahradia ranný prehľad aj čipy. Bez avatarov a „Dobré ráno“.
Dopad: vysoký. Na obrazovku sa zmestí ~15 pacientov namiesto 3 a porota vidí, že nástroj unesie aj 60 prípadov (kritériá 2 a 4). Práca: 2 h.

**3. Prípad má dekoráciu hore a prácu dole.**
Dôkaz: `02-pripad-alena.png`: hlavička 230 px s avatarom, 4 pastelové metriky v štyroch jednotkách (14/20, deň 17, 4/7, 20/20), potom 20 farebných dlaždíc. Prehľad a Podklad ukazujú tie isté rozpory dvakrát.
Zmena: poradie (a) stĺpec pacienta (nápad 1), (b) lišta „Na tahu“ (krok · kto · do kedy · jedno tlačidlo), (c) „K vyřešení (6)“, (d) 20 polí ako riadky kľúč – hodnota – zdroj ([NHS summary list](https://service-manual.nhs.uk/design-system/components/summary-list)). Prehľad a Podklad zlúčiť, metriky zmazať, mriežku nahradiť vetou a pásikom z 20 dielikov.
Dopad: vysoký, pri klikaní uvidia ako prvé rozpor pri apixabane. Práca: 2 h.

**4. Farba hlási hlavne „v poriadku“.**
Dôkaz: Alena má 14 zelených dlaždíc a 1 červenú, Novák 17 béžových; spolu 5 stavových farieb, fialová a 3 pastely. NHS radí čo najmenej štítkov a nespoliehať sa len na farbu ([NHS tag](https://service-manual.nhs.uk/design-system/components/tag)).
Zmena: potvrdené = šedý text s malou ✓. Farbu dostane len to, čo čaká na človeka: červená = chybí / po termínu, jantárová = rozpor. Návrh stroja = čiarkovaný obrys bez farby. Pri farbe vždy aj slovo.
Dopad: vysoký. Práca: 1 h.

**5. Písmo je drobné a kontrast slabý.**
Dôkaz: CSS má 27 veľkostí písma, 49 deklarácií je pod 12 px (najmenšia 8,5 px). `--faint` #9CA3AF má na bielej kontrast 2,54 : 1 a nesie text na 39 miestach; WCAG AA žiada 4,5 : 1 ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)).
Zmena: 6 veľkostí (12/13/14/16/20/24), `--faint` zrušiť. IBM Plex Sans má všetky číslice rovnako široké (overené v súbore z Google Fonts), takže dátumy a laboratórne hodnoty lícujú; na „zpráva 07“ IBM Plex Mono. Obe majú české znaky.
Dopad: stredný. Práca: 1 h.

**6. Text nahradili čipy.**
Dôkaz: 26× `<Pill>`, 9× `<SourceChip>`, 37× `border-radius: 999px`. Novák má v riadku 17 päť čipov „správa“ a nad MDT dokumentom je 7 farebných čipov (`07-podklad-mdt.png`).
Zmena: zdroje ako tichý text „zpr. 02, 03, 05“ (čísla klikateľné), stav prípadu do stĺpca, ilustračné prípady sivé a neklikateľné. Nad MDT jedna veta „Před odesláním: 3 návrhy, 2 rozpory, chybí ECOG“ a jedno tlačidlo.
Dopad: stredný. Práca: 1 h.

**7. Ikony klamú.**
Dôkaz: v `08-zaver-praktik.png` dostali pokyny pre praktika zelené fajky, akoby boli splnené. Navyše majú pastelový gradient a fialový tieň pod tlačidlom.
Zmena: číslovaný zoznam s ľavou linkou 3 px a ploché tlačidlá.
Dopad: stredný, lekár VZP si to všimne. Práca: 0,3 h.

**8. Na mobile je prvá obrazovka len vizitka.**
Dôkaz: v `m-02-pripad-alena.png` zaberá celý displej hlavička.
Zmena: hlavička na 2 riadky (meno · vek · ZP, ⚠ apixaban) a hneď pod ňou „Na tahu“.
Dopad: nízky. Práca: 0,5 h.

## Nové nápady zo sveta

**1. Stály stĺpec pacienta (Epic Storyboard).** Epic presunul hlavičku do stále viditeľného ľavého stĺpca, aby sa menej skákalo medzi obrazovkami ([Connect Care](https://ehealth.connect-care.ca/epic-systems/epic-modules/storyboard), [UNMC](https://www.unmc.edu/newsroom/2019/11/27/coming-soon-changes-to-one-chart-patient-workspace/)). U nás stĺpec 260 px na každej záložke: meno, vek, ZP 211, KOC 2, konzilium 21. 10., praktik s telefónom, ⚠ apixaban, „den 17 od přijetí“.

**2. Pôvod údaja vidno priamo v texte (Abridge, FDA).** V Abridge stačí ukázať na frázu v poznámke a uvidíš jej zdroj v prepise ([Abridge](https://www.abridge.com/press-release/abridge-inside-emory)). FDA chce, aby si lekár vedel sám overiť, z čoho softvér vychádza ([FDA 2026](https://www.fda.gov/media/191561/download)). U nás tri značky: bodkované podčiarknutie = citát (myšou ukáže vetu), čiarkovaný obrys = návrh stroja, „tel.“ = zápis koordinátorky. Rovnako aj v „Zpracování naživo“ a v MDT, takže bezpečnosť (kritérium 2) je vidno bez slajdu.

**3. Rozpor ako porovnanie verzií (GitHub split diff).** GitHub ukazuje dve verzie vedľa seba ([GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-comparing-branches-in-pull-requests)). U nás A | B, spoločný text šedý, rozdiel („12. 10.“ verzus „18. 10.“) jantárovo podfarbený, pod tým „Platí A / Platí B / Ověřit telefonem“.

**4. Klávesnica a príkazy (Linear, Oracle Health).** Linear spustí akúkoľvek akciu cez ⌘K ([Linear](https://linear.app/enablement/guide/navigating-linear)), nové EHR od Oracle stavia na príkazoch namiesto menu ([Healthcare Dive](https://www.healthcaredive.com/news/oracle-new-ehr-artificial-intelligence-ai/757588/)). U nás J/K posúva vo fronte, Enter otvorí prípad, ⌘K „Procházková → vyžádat ECOG“. Na nedeľu stačí 20 s ukážky.

**5. Režim pre konzílium (navify Tumor Board).** navify stavia konzílium okolo jedného súhrnu pacienta a Roche uvádza o 30 % kratšiu prípravu ([HospiMedica](https://www.hospimedica.com/patient-care/articles/294785112/digital-tumor-dashboard-improves-case-review-efficiency.html)). Pilotná štúdia s podporou Roche to potvrdila u onkológov a chirurgov ([Krupinski 2018](https://doaj.org/article/0ebaf74a4b3442b89da21b5dc0cd71b2)). U nás tlačidlo „Promítnout“: MDT podklad na celú obrazovku, písmo 20 px, ←/→ medzi pacientmi dňa, rozpory navrchu.

Screenshoty Epicu, navify a Doctolibu sú za prihlásením, preto vychádzam z ich popisov. Epic Cosmos je dátová platforma, nie pracovná obrazovka ([uOttawa](https://www.uottawa.ca/faculty-medicine/research-and-innovation/omari-newsletter-blogs/cosmos-powerful-data-resource-researchers)).

## Čo nerobiť
1. Žiadny tmavý režim, sklo, žiara ani animované čísla. Pri stole rozhoduje, či sa to dá prečítať na cudzom notebooku.
2. Fronta sa nefarbí podľa „rizika“. Skóre naliehavosti zakazuje kontrakt (MDR), farba ukazuje len stav údaja a poradie určuje termín.
3. Pred 13:00 nič neprepisovať od nuly. Najprv tokeny (30 min), potom fronta a prípad. Dokumenty (MDT, záver) už vyzerajú ako papier, stačí im nové písmo.

## Príloha: tokeny (nahradí `:root` v `src/theme.css`)
Staré názvy ostávajú ako aliasy, takže sa zmena prejaví hneď. Písmo pridať do `index.html` cez `<link>`: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`.

```css
:root {
  /* 6 základných */
  --canvas: #F4F5F7;  /* pozadie appky */
  --paper:  #FFFFFF;  /* plochy, riadky */
  --ink:    #17202B;  /* text, 16,4:1 */
  --ink-2:  #55606E;  /* vedľajší text, 6,4:1 na bielej, 5,9:1 na canvas */
  --line:   #D6DBE2;  /* 1px čiary */
  --accent: #0A5BB0;  /* jediná farba akcie a odkazu, 6,7:1 */
  /* 3 signálne – vždy so slovom, nikdy veľká plocha */
  --sig-missing: #B42318;  --tint-missing: #FDF1F0;   /* chybí, po termínu */
  --sig-conflict: #93560A; --tint-conflict: #FFF6E8;  /* rozpor */
  --sig-ok: #1E7148;                                  /* len malá ✓ */
  --tint-accent: #EAF1FA;                             /* vybraný riadok */
  /* písmo a hustota */
  --font: "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
  --fs-xs: 12px; --fs-sm: 13px; --fs-md: 14px; --fs-lg: 16px; --fs-xl: 20px; --fs-2xl: 24px;
  --row: 40px; --row-compact: 32px;
  --r-sm: 4px; --r-md: 6px; --r-lg: 8px; --r-xl: 8px;
  --shadow-1: none; --shadow-2: 0 1px 2px rgba(23,32,43,.06);
  --shadow-3: 0 8px 24px rgba(23,32,43,.16);           /* iba modál a bočný panel */
  --gap: 16px; --gutter: 24px;
  /* aliasy starých názvov */
  --surface: var(--paper); --surface-glass: var(--paper); --canvas-2: var(--canvas);
  --muted: var(--ink-2); --faint: var(--ink-2); --hair: var(--line); --hair-2: #C3CAD3;
  --accent-soft: var(--tint-accent); --accent-ring: rgba(10,91,176,.25); --accent-grad: var(--accent);
  --pastel-1: var(--paper); --pastel-2: var(--paper); --pastel-3: var(--paper);
  --mint: var(--sig-ok); --mint-soft: transparent; --mint-ink: var(--sig-ok);
  --amber: var(--ink-2); --amber-soft: transparent; --amber-ink: var(--ink-2);   /* návrh = bez farby */
  --orange: var(--sig-conflict); --orange-soft: var(--tint-conflict); --orange-ink: var(--sig-conflict);
  --coral: var(--sig-missing); --coral-soft: var(--tint-missing); --coral-ink: var(--sig-missing);
  --sky: var(--accent); --sky-soft: var(--tint-accent); --sky-ink: var(--accent);
}
body { background: var(--canvas); font-size: var(--fs-md); line-height: 1.45; } /* bez radiálnych žiar */
h1, h2, h3, h4 { font-weight: 600; letter-spacing: 0; }
.kicker { text-transform: none; letter-spacing: 0; font-size: var(--fs-sm); font-weight: 600; }
```
