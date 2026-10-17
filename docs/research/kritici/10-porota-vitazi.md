# 10 – Porotca a kouč: čo vyhráva pri stole

_17. 10. 2026, ~05:30. Hodnotí stav appky po rozbehnutých zmenách (Zpracování naživo, čeština, upratanie). Veci, ktoré sa už robia, tu neopakujem._

## Verdikt

Po zmenách bude mať appka to, čo na zdravotníckych hackathonoch vyhráva: funkčný proces na realistických dátach, ktorý si hodnotiteľ sám vyskúša. Slabé miesto už nie je „scam“, ale choreografia. Spracovanie naživo nie je prepojené so zápisom MDT, nezastaví sa v deň konzília a najsilnejší moment, keď hodnotiteľ niečo pokazí, sa zobrazí mimo obrazovky. Pri stole budú pravdepodobne stáť autorky zadania, teda koordinátorky, a človek z dát VZP (`docs/research/vyzvy/vzp-cesta-pacienta.md` §1.7). Vyhrá tím, ktorý im dá myš do ruky a za 2 minúty sa s nimi dostane až k odoslanému záveru.

## Top nálezy

**1. Chýba scenár u stola.** `PITCH.md` stále opisuje starú prehliadku v 8 krokoch. MLH počíta pri stole asi s 2 min na demo a 1 min na otázky (https://guide.mlh.com/general-information/judging-and-submissions/judging-plan). Zmena: nasledujúci scenár, ktorý funguje až po nálezoch 2–6.

| # | Klik | Čo povedať |
|---|---|---|
| 1 (0:00) | Naživo → Alena, len správa 07 → pole „Věk“ → veta v origináli | „Zo žiadanky je vyplnených 15 z 20 polí. Čo v nej nie je, ostane červené.“ |
| 2 (0:15) | Přehrát příchod zpráv → prehrávanie zastaví 21. 10. | „Prišli správy zo 7 miest. Vyskočila pasca: apixaban vysadený až po biopsii. Správy 12 a 13 do podkladu nepatria.“ |
| 3 (0:45) | Myš dostane hodnotiteľka → Zkuste to rozbít | „Hneď je tu nový rozpor s oboma vetami. Čo motor nevie, označí ‚chybí‘. Vymyslieť si nesmie.“ |
| 4 (1:05) | ECOG → Zapsat telefonát → „ECOG 1“ | „Zdrojom je telefonát koordinátorky. Podklad je 20/20.“ |
| 5 (1:25) | Potvrdiť ako lekár KOC → Zápis k jednání MDT | „Šablóna MDT_zapis, česky, aj s rozporom, ktorý ste vyrobili.“ |
| 6 (1:45) | Záver pre praktika → Odeslat → doručenka | „Bez internetu, slepý test Y/20, nič vymyslené. Stopky ukazujú 1:52. Koľko vám to trvá dnes?“ |

Dopad: vysoký. Práca: 0,5 h nácviku.

**2. Spracovanie naživo a dokumenty sú dva oddelené svety.** `Live.tsx` drží stav len vo vlastnom `useState`, `App.tsx` nemá route `live` a `MdtDoc` číta ručné `cases.ts`. Keď hodnotiteľka zmení RČ a potom otvorí zápis, uvidí v ňom staré údaje. Zmena: tlačidlo „Zápis k MDT z tohto stavu“, ktoré zápis vykreslí z aktuálneho `ExtractionResult` vrátane úprav, telefonátu a potvrdení. Dopad: vysoký. Práca: 2–3 h.

**3. Nový rozpor nie je vidieť.** `live-1440-preset-rc.png`: po zmene RČ je navrchu stále rozpor s apixabanom a nový rozpor je pod okrajom obrazovky. Zmena: nový nález dať navrch, zvýrazniť ho, posunúť k nemu obrazovku a oba citáty RČ ukázať vedľa seba. Dopad: vysoký. Práca: 0,5 h.

**4. Prehrávanie prebehne aj cez konzílium.** `live-1440-all.png` ukazuje „přijato 13 z 13 · stav k 27. 10.“ a vypnutý prepínač. `STEP_MS` sa nikde nezastaví, a to je presne pasca zo zadania. Zmena: po správe 11 sa prehrávanie samo zastaví a ukáže pruh „21. 10. – den konzilia, podklad uzavřen“. Správy 12 a 13 prídu až po kliknutí „Pokračovat po konziliu“. Dopad: vysoký. Práca: 0,5–1 h.

**5. Stôl nie je pripravený na striedanie hodnotiteľov.** Appka má dva rôzne resety („Začít znovu“ a „Začať odznova“) a stav prípadov prežije. Zmena:
- jedno „Reset dema“ v hornej lište, ku ktorému patrí aj klávesová skratka a adresa `#reset`,
- prepínač pacientov Alena / Novák / Pacient 3 (slepý test),
- zväčšenie na 125 % (editor správ má dnes písmo 12 px),
- stopky od „Přehrát“ po „Odeslat“.

Dopad: vysoký. Práca: 1–1,5 h.

**6. Potvrdiť má lekár.** `FieldPanel.tsx` má tlačidlo „Potvrdit (zkontroloval člověk)“ a potvrdzuje sa každé z 19 polí zvlášť. Zadanie (požiadavky 9 a 11) chce handover potvrdený lekárom. Zmena: tlačidlo „Potvrdit sekci“ s rolou „MUDr. … (onkolog KOC)“ a v zápise riadok „potvrdil/a, čas“. Dopad: stredný až vysoký. Práca: 1 h.

**7. Tri najťažšie otázky VZP.** Odpoveď „Nie je to zdravotnícka pomôcka“ v `PITCH.md` je príliš sebaistá, keď v hlavičke svieti „POZOR Antikoagulace“ (screenshot 02).
- *„Je to AI, alebo pravidlá ušité na 13 správ?“* „Jadro sú pravidlá a overovanie citátov. Preto to ide bez internetu a rovnaký vstup dá rovnaký výstup. Na pacientovi, ktorého písal niekto, kto pravidlá nevidel, to dalo Y/20 a nič vymyslené (klik na Pacient 3).“
- *„Kde sú dáta, kto ručí, je to zdravotnícka pomôcka?“* „Beží to v prehliadači a wifi je vypnutá. Bez potvrdenia lekára nič nejde do podkladu. Diagnózu ani liečbu neurčujeme a varovania sú citácie lekárov. Program na termíny podľa MDCG 2019-11 rev.1 pomôckou nie je, hľadanie liekových interakcií by ňou už bolo. Preto ho vedome nerobíme.“ (https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en) K tomu zmena v appke: pri každom varovaní uviesť „ze zprávy 07“ (0,25 h).
- *„Budem to prepisovať do NIS? Kto to zaplatí?“* „Na začiatku nie: podklad sa uloží ako PDF do NIS. Napojenie na systém nemocnice príde až potom. Platí to dnešný výkon koordinátora (250 Kč, raz denne) a záznam o koordinovaní vzniká popri práci.“ (https://www.zakonyprolidi.cz/cs/2025-432, pilot cez https://inovace.vzp.cz)

Dopad: vysoký. Práca: 0,5 h.

## Nové nápady zo sveta

1. **Stopky „zmerajte si to sami“.** Víťazi mávajú dôkaz kontaktu s používateľom: víťazný GlukoScan v IKEM oslovil nevidiaceho diabetika (https://ekonomickydenik.cz/aplikace-nevidome-diabetiky-i-mene-cekani-osetreni-ikem-hostil-hackathon). U nás: na konci dema svieti „Hotový podklad: 1:52“. Odpoveď koordinátorky na otázku, koľko jej to trvá dnes, si so súhlasom zapíšeme do nedeľného pitchu.
2. **„Spustit 100×“.** Jazykový model dal pri teplote 0 v 1 000 behoch 80 rôznych výstupov (https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference). Rakathon 2025 vyhral tím s iným prístupom ako ostatní (https://fel.cvut.cz/en/what-s-on/news/37553-technology-from-fee-ctu-changes-cancer-treatment-two-prizes-for-student-teams-from-rakathon-2025). U nás: „100/100 rovnakých výsledkov za 1 s“. Tímy, ktoré stavajú len na jazykovom modeli, toto neukážu.
3. **Lietadlový režim.** Demo Google Gemini bolo zostrihané (https://www.techradar.com/computing/artificial-intelligence/that-mind-blowing-gemini-ai-demo-was-staged-google-admits) a „AI“ firmy Builder.ai robili ľudia (https://www.techspot.com/news/108173-builderai-collapses-after-revelation-ai-since-2017-really-hundreds-engineers.html). U nás: v kroku 6 vypneme wifi a prepočítame, vo videu bude titulok „záznam v reálnom čase“.
4. **Karta motoru.** Coalition for Health AI (CHAI) zverejnila „nutričnú etiketu“ pre zdravotnícku AI (https://www.healthcareitnews.com/news/chai-launches-open-source-healthcare-ai-nutrition-label-model-card). U nás: jedna obrazovka o tom, čo motor číta, čo nerobí, ako dopadol test (Y/20), aké má známe slabiny (napríklad stranu nádoru) a kto zaň ručí.
5. **Tabuľa pokusov.** Hra Gandalf, v ktorej ľudia skúšajú prelomiť AI, zozbierala 18 miliónov pokusov (https://www.destructoid.com/players-have-tried-to-crack-security-companys-password-game-over-4-million-times/). U nás: „Dnes to skúsilo rozbiť 7 ľudí · zachytené 7× · vymyslené 0“. V nedeľu z toho bude slajd.

## Čo nerobiť

1. **Nezačínať 1:30 videom.** Autorky zadania problém poznajú a porota chce vidieť riešenie, nie počuť znova zadanie (https://www.youtube.com/watch?v=k00WsEPDmrU). Video nech beží potichu v slučke na druhom zariadení.
2. **Nespoliehať sa na wifi ani na súkromný odkaz.** Appku spustiť lokálne (`npm run preview`), verejný odkaz overiť v anonymnom okne a video mať uložené offline.
3. **Nehádať sa**, keď koordinátorka povie „u nás to tak nefunguje“. Zapísať si to doslova, je to najlepší materiál pre kritérium 5.
