# Kritik 12 – živý test laika (17. 10. 2026)

Appku som preklikal ako ospalý porotca bez návodu (port 5188; šírky 1366, 1280, 1024 a 390 px).

## Verdikt
Za 30 sekúnd som pochopil, že ide o frontu pacientov, nie však, čo appka robí lepšie než e-mail: úvod nespomína 13 správ ani podklad a prvá karta je prázdna ukážka. So „Ukázkou v 8 krocích“ appka presviedča (rozpor pri apixabane, telefonát → zelené pole, doručenka praktikovi), no sám sa strácam, lebo sprievodca len rozpráva a nič neukáže. Najväčšie riziko na sobotu: keď zadávateľ VZP napíše vlastnú žiadanku obyčajnými vetami, motor z nej prečíta 1 údaj z 20.

## Top nálezy

**1. Vlastný text bez nadpisov rozbije motor (1/20).**
Dôkaz: do Žiadanky (`#intake`) som napísal žiadanku vetami („posílám pana Karla Dvořáka, nar. 3. 4. 1958, pojišťovna VZP (111), tel. …, Užívá metformin…, Alergie: penicilin“). Výsledok: „1 v textu je · 18 chybí“ vrátane mena, veku, poisťovne, liekov a alergie. Pri ECOG appka našla „ECOG 1.“ a zároveň napísala „‚soběstačná‘ není skóre“ (poznámka natvrdo z Aleny). Motor obrazovky naživo (`src/ai/extract.ts`) dá z toho istého textu tiež 1/20 a ako ECOG vráti celú prvú vetu; s nadpismi „Pacient:“, „FA:“, „AA:“ dá 11/20. Plán „Pokazte to sami… a k tomu voľný text“ (`docs/kontext/raw-kriticke-hodnotenie.md`) na toto narazí.
Zmena: (a) pridať 6 pravidiel pre bežné vety: „nar. D. M. RRRR“, „VZP/ZP + 3 číslice“, „tel.“, „Alergie/AA“, „Užívá/FA“, „RTG/CT/UZ + dátum“; (b) poznámky pri poliach Žiadanky počítať z vloženého textu, nie z Aleny; (c) poctivý pruh pri slabom výsledku (pozri nápad 5).
Dopad: vysoký. Práca: 2–3 h.

**2. Úvod nepovie, čo to je, a prvá karta je slepá ulička.**
Dôkaz: na `#` je len „Dobré ráno, Lucie.“ a ranný prehľad. Prvá karta, Kučera („ukázka“), ukazuje 0 % a „Podklad ještě nezačal“; po „Převzít žádost“ ostane „Vyžádat CT“ bez tlačidla. Alena je tretia, na mobile asi 2,5 obrazovky nadol.
Zmena: Alenu pripnúť navrch („případ ze zadání VZP“), ostatné ukážky zbaliť do „Další ilustrační případy (3)“. Nad frontu dať riadok „13 zpráv o pacientce → podklad pro konzilium s citáty“ a tlačidlá „Spustit ukázku (2 min)“ a „Zpracování naživo“.
Dopad: vysoký. Práca: 1 h.

**3. „Ukázka v 8 krocích“ rozpráva, ale neukazuje.**
Dôkaz: v kroku 4 („Klikněte na pole 8“) je pole pod okrajom a zakrýva ho karta sprievodcu. Krok 5 („Pole 12“) vyroluje stránku nahor. Krok 2 sľubuje potvrdenie po odoslaní, „Dále“ ho preskočí. Na mobile je sprievodca len ikona bez textu.
Zmena: každý krok vyroluje k cieľu a obtiahne ho pulzujúcim rámom, karta sa presunie na opačnú stranu, pribudne tlačidlo „Udělat za mě“ a na mobile text „Ukázka“.
Dopad: vysoký, lebo zadávatelia klikajú sami. Práca: 2 h.

**4. Na obrazovke naživo nevidno, čo sa zmenilo.**
Dôkaz: `app/design/shots/live-1440-start.png`, `live-390-start.png` (obrazovka ešte nemá cestu v `App.tsx`). Panely začínajú pri 1440 px asi 430 px od vrchu, na mobile pod okrajom. Pole podľa `Live.css:128` len zabliká, appka k nemu neroluje, takže apixaban (pole 12) po správe 09 nevidno.
Zmena: pri tlačidlách prilepený riadok „Zpráva 09: +1 údaj · 1 nová past (apixaban)“, klik naň vyroluje k poľu.
Dopad: vysoký, je to hlavná obrazovka dema. Práca: 1 h.

**5. „Další krok“ nie je tlačidlo.**
Dôkaz: `src/pages/CaseView.tsx:457–470` len vypíše „Doplnit stav výkonnosti (ECOG)… do 20. 10.“. Tlačidlá „Vyžádat“ a „Zapsat telefonát“ sú o dve karty nižšie, pri 1280×720 pod okrajom.
Zmena: do karty pridať hlavné tlačidlo, ktoré volá rovnaké `requestField`/`callField`. U Kučeru otvorí žiadosť o CT.
Dopad: stredný až vysoký. Práca: 1 h.

**6. Pri telefonáte appka sama vpíše „ECOG 1“ a zajtrajší dátum.**
Dôkaz: `src/data/cases.ts:59–60` vopred vyplní „ECOG 1“ s dátumom 20. 10., hoci appka ukazuje „pondělí 19. 10.“; po uložení je pole „potvrzeno“. Appka, ktorá sľubuje „nic nedomýšlíme“, si tu klinickú hodnotu vymyslí.
Zmena: dátum = `DEMO_TODAY`, poznámka a hodnota prázdne; „ECOG 1“ napíše prezentujúci naživo.
Dopad: stredný až vysoký, lekár z VZP si to všimne. Práca: 0,3 h.

**7. Prípad Novák (AI) pôsobí ako zlyhanie.**
Dôkaz: na `#case/novak` je kruh „0 %“, lebo appka počíta len potvrdené polia; 17 návrhov je v drobnom texte. Vysvetlivky AI sú po slovensky („60 rokov“, „Overiť…“) pod nadpisom „píše jazykem zprávy“ (`FieldList.tsx:53`; dáta `src/data/pacient2.gen.ts`, `src/ai/rules.ts`) – preklad musí zasiahnuť aj generované dáta.
Zmena: namiesto 0 % pruh „17 návrhů čeká · 3 rozpory · 0 potvrzeno“.
Dopad: stredný. Práca: 0,5 h.

**8. Pri 1024 px sa stránka posúva do strany a F5 zmaže prácu.**
Dôkaz: pri 1024×768 má stránka 1049 px, avatar v hornej lište pretečie a dlaždica semaforu sa oreže na „Stav výkonno…“ (práve chýbajúce pole). Stav dema žije len v pamäti (README); po novom načítaní zmizol zapísaný telefonát.
Zmena: pod 1100 px skryť meno v `.topbar__right`, názvy dlaždíc na 2 riadky, reláciu ukladať do `sessionStorage` (v try/catch).
Dopad: stredný. Práca: 1 h.

## Nové nápady zo sveta

1. **Pomoc pri prvku namiesto balíčka kariet.** Návody typu „balíček kariet“ ľudia preskakujú, pomoc má prísť vo chvíli, keď ju potrebujú ([NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)). U nás: namiesto 8 kariet malá bublina priamo pri poli 14 („Chybí – zapište telefonát“), ktorá sa ukáže, až keď k poľu prídem.
2. **Chodbový test pred 14:00.** Päť ľudí nájde asi 85 % problémov s používaním ([NN/g](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/)). Keď je prvý klik správny, úloha sa podarí v 87 % prípadov ([MeasuringU](https://measuringu.com/first-click/)). U nás: traja ľudia z iných tímov dostanú úlohu „Zjistěte, co Aleně chybí do konzilia, a doplňte to“; zapíšeme prvý klik a opravíme miesto, kde sa zasekli dvaja.
3. **„Co je nového od poslední návštěvy“.** Google Docs po návrate zvýrazní zmeny od poslednej návštevy ([Google](https://blog.google/products/g-suite/version-control-to-major-tom-keeping-track-of-work-in-g-suite)). U nás v hlavičke prípadu: „Od 16. 10.: přišla histologie (zpráva 11) → pole 19 vyplněno + 1 rozpor.“ Koordinátorka s desiatkami prípadov to využije každý deň.
4. **Najdôležitejšie navrch v Závere pre praktika.** Hlavná informácia má ísť prvá ([NN/g](https://www.nngroup.com/articles/inverted-pyramid/)). U nás je „Co to znamená pro vás, pane doktore“ až pod celým doslovným zápisom (`#gp/alena`). Presunúť to hneď pod otázku praktika a zápis zbaliť do „Celý zápis (doslovně)“.
5. **Ukázať hranicu motora.** Microsoft radí ukázať, ako dobre systém funguje a kde robí chyby ([HAX, zásada 2](https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-how-well-the-system-can-do-what-it-can-do/)). U nás: keď motor prečíta menej než 10 z 20 údajov, ukáže pruh „Text bez nadpisů: pravidla přečetla X z 20. V provozu tu nastoupí jazykový model, každé jeho tvrzení musí mít doslovný citát.“ Na obrazovke naživo karta „Co motor neumí“ s tlačidlom, ktoré to predvedie. Porota uvidí, že tím pozná svoje limity (kritérium 2).

## Čo nerobiť
1. Nedávať do „Zkuste to rozbít“ prázdne textové pole bez upozornenia, kým nie je hotový bod 1. Jediná veta od zadávateľa zhodí dôveru v celé demo.
2. Nepridávať ďalšie karty do sprievodcu ani ďalšie ilustračné prípady. Radšej menej, ale každé tlačidlo musí niečo urobiť.
3. Nepredvypĺňať klinické hodnoty ani dátumy kvôli plynulosti dema. Presne takúto skratku porota hľadá pri kritériu bezpečnosti.
