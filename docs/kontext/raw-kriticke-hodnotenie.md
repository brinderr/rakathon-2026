# Kritické hodnotenie appky (17. 10. 2026, 04:20–04:38)

Päť nezávislých kritikov (Opus), syntéza a kontrola realizovateľnosti. Pracovné poznámky k spovedaniu: brainstorms/2026-10-17-kriticke-hodnotenie-appky.md

## Syntéza

**(A) Verdikt**

Nie je to scam a obsahovo to nie je ani jednoduché. Appka pokrýva všetkých 6 bodov zadania a v práci s údajmi ide hlbšie než väčšina tímov: má doslovné citáty, chytá pasce v dátach a ukáže stav k dátumu konzília. V podstatnej veci máš však pravdu. Dnes je to nahraný film s tlačidlami. Alenu pripravil tím ručne (`cases.ts`: `mode: 'manual'`), okno na súbor ho nečíta (`Intake.tsx`: „prototyp ho nečíta“) a AI cez Azure nebežala ani raz (`extracted-alena.json`: „náhrada bez Azure kľúča“). Pritom funkčný „motor“, teda program, ktorý zo správ vyťahuje údaje, už máme. Skeptik ho skúšal pokaziť a reagoval správne, len nie je zapojený do appky. Netreba teda ďalšie obrazovky, treba zapojiť motor a ukázať proces naživo. Inak prvý porotca, ktorý povie „dajte tam inú správu“, z nás spraví maketu.

Na tomto sa zhodlo všetkých 5 kritikov.

**(B) Čo zadanie a porota naozaj chcú**

1. Doslova: „nasimulujte ve vaší aplikaci práci koordinátora“. Koordinátor sám vyžiada správy 01–06, objedná CT v KOC 1, zariadi biopsiu a odbery. Nestačí ukázať hotový výsledok.
2. Tri povinné výstupy:
   - funkčné demo celého priechodu,
   - správa pre konzílium podľa šablóny `MDT_zapis`,
   - ukážka odoslania záveru praktikovi.
3. „Pomocí AI vytěžit“, upozorniť na chýbajúce a nesúhlasiace údaje, „přebírejte bez domýšlení“.
4. Koordinátor doplní chýbajúce podklady a appka ich zapracuje do podkladu pre konzílium.
5. Kritérium 1: „Jak dobře řešení skutečně funguje? Co tým reálně vytvořil?“ Kritérium 2: bezpečnosť, dáta, napojenie na iné systémy. O 14:00 chodia zadávatelia priamo k stolom, takže budú chcieť klikať.

**(C) NECHAŤ**

1. Pri každom údaji je doslovný citát, ktorý overí program. Klik otvorí pôvodnú správu so zvýraznenou vetou.
2. Rozpory sú vedľa seba: apixaban vysadený 18. 10. pri výkone 12. 10., histológia vydaná pred odberom, chýbajúci ECOG (stav výkonnosti pacientky). U Nováka nádor raz vľavo a raz vpravo, cudzie rodné číslo, stratená alergia.
3. Posuvník „stav k 21. 10.“, ktorý vyradí správy 12 a 13. Je to doslovné upozornenie zo zadania.
4. „Kto je na ťahu“, 4 stavy každého kroku a tlačidlo „Urgovať“.
5. Záver pre praktika s jeho pôvodnou otázkou a s doručenkou. K tomu poisťovňa 211 → revízny lekár 211 a varovanie tramadol + antidepresíva.

**(D) VYMAZAŤ alebo SCHOVAŤ**

1. **Okno „pretiahnite PDF“ a 0,9-sekundovú falošnú „kontrolu“.** Je to presne ten moment, keď to vyzerá ako scam. Buď ho oživí bod E1, alebo ide preč.
2. **Odznak „ručne overené tímom“ ako hlavný zdroj.** Ručná verzia ostane len v pozadí ako kontrolná sada.
3. **Kartu „20/20 · 17/17 · 13/13“ z hlavnej obrazovky.** Pravidlá aj testy písal ten istý tím a bez AI vyjde to isté.
4. **„Moja bilancia“ (koruny za výkon 51887), „deň 17 z 33 – dánsky vzor“ a holandskú lehotu.** Nikto ich nechcel a Skeptik upozornil, že bilancia pôsobí ako motivácia vykazovať viac.
5. **Tlačidlo „Simulovať odpoveď“ pri ECOG.** Odpovedá vymyslená správa 14. Nahradí ho zápis telefonátu (E4).
6. **Vyše 20 štítkov „simulované“.** Nahradí ich jedna poznámka v päte. Z pitchu a zo `SUBMISSION.md` treba vyhodiť vety, ktoré demo nepotvrdí: „ostrý Azure“, „žiadosti na 5 pracovísk“, „sama eskaluje“ a odkaz na GitHub, ktorý vracia chybu 404.

**(E) PRIDAŤ**

Zoradené podľa toho, koľko prinesú za vynaloženú prácu. Hodiny sú práca agentov.

1. **[MUSÍ] Živý motor a „prehrať príchod správ“.**
   - Čo: na začiatku má appka len správu 07. Správy potom prichádzajú podľa dátumu, alebo ich niekto pretiahne ako súbory. Motor beží priamo v prehliadači (trvá 0,14 s). Polia sa plnia aj s citátmi, pasce vyskočia na červeno a správy 12 a 13 sa vyradia. Alenu appka zobrazí zo strojového výstupu ako „návrh → potvrdiť“.
   - Prečo: kritérium 1 a priama odpoveď na „scam“.
   - Práca: 3–4 h. Prevod výstupu motora do appky už rieši `scripts/build-pacient2.mjs`.
   - Riziko: stredné, treba to napojiť na obrazovky. Záloha je dnešná zmrazená verzia.
2. **[MUSÍ] „Pokazte to sami“.**
   - Čo: pri správe tlačidlo „Upraviť“. Porotca prepíše vetu alebo zmaže správu, klikne „Prepočítať“ a uvidí nový rozpor s oboma citátmi alebo údaj označený ako chýbajúci.
   - Práca: 1–1,5 h po bode 1.
   - Riziko: pravidlá sú šité na tieto správy. Keď sa zmení nadpis „Pacientka:“, 6 polí skončí ako „chýba“. Appka si nič nevymyslí, ale treba mať 3–5 úprav vopred otestovaných.
3. **[MUSÍ] Dokumenty česky a doslovne, na stiahnutie ako PDF alebo Word.**
   - Čo: „Zápis k jednání MDT“ presne podľa `MDT_zapis` a záver pre praktika.
   - Prečo: sú to 2 z 3 povinných výstupov. Slovenské prerozprávanie v českej šablóne porušuje „bez domýšlení“.
   - Práca: 1,5–2 h. Riziko: nízke.
   - Zhoda kritikov: chcú to traja, VZP a Skeptik to nespomenuli.
4. **Skutočné kroky koordinátorky.**
   - Čo:
     - „Vyžiadať 01–06“ jedným klikom (5 konceptov žiadostí na pracoviská),
     - šablóna „Pankreas“ vloží kroky a strážené poradie (biopsia až po CT),
     - „Objednať CT v KOC 1“ s termínom, miestom a stavom, ktoré sa dajú meniť,
     - telefonát sa zapíše ako poznámka, z ktorej sa doplní údaj.
   - Prečo: zadanie chce naplánovať a sledovať kroky. Dnes je v Ceste jediné tlačidlo „Urgovať“.
   - Práca: 2–3 h. Riziko: nízke až stredné.
5. **Slepý test.**
   - Čo: iný agent, ktorý nevidí naše pravidlá, napíše tretieho pacienta. Poctivé číslo (napr. „16/20, 0 vymyslených“) nahradí kartu so 100 %.
   - Práca: 1,5–2 h, môže bežať súbežne. Riziko: nízke číslo, ale presne to je náš príbeh „radšej chýba, než by si vymyslel“.
6. **Zápis z konzília → úlohy.**
   - Čo: koordinátorka vloží text zápisu a appka zo 6 odporúčaní spraví úlohy s vlastníkom a termínom (napr. onkológia 4. 11. o 10:30). Každá úloha má citát.
   - Práca: 1,5–2 h. Riziko: nízke až stredné.
7. **Ostrá AI.**
   - Čo: kľúč k Azure ostane na malom serveri, nikdy v prehliadači. AI píše len voľné texty a pomáha tam, kde pravidlá zlyhajú.
   - Práca: 1–2 h po získaní kľúča.
   - Riziko: vysoké, kľúč nikto nezohnal (STATUS ⚪).
   - Nezhoda kritikov:
     - Koordinátorka hovorí o 0,5–1 h s nízkym rizikom, Skeptik o vysokom riziku.
     - SVET tvrdí, že AI pobeží v prehliadači. Pre pravidlá to platí, pre kľúč nie.
8. **SMS pacientke (koncept).** Termín, miesto, príprava. V kóde dnes slovo „SMS“ nie je ani raz. Práca: 1 h. Riziko: nízke.

**Kapacita:** body označené MUSÍ dajú spolu asi 6–7,5 h. S 3 agentmi súbežne sú hotové okolo 10:00, potom body 4 a 5. O 11:00 zastaviť zmeny v kóde kvôli videu.

**Dnes nie:**
- QR kód, cez ktorý porotca na svojom telefóne potvrdí prijatie záveru. Navrhol ho len jeden kritik, je to 2–3 h a závisí od wifi.
- Obrazovka revízneho lekára. Navrhol ju len jeden kritik.
- FHIR export (štandard na výmenu zdravotných dát). Ten je až na nedeľné finále, kvôli cene InterSystems.

**Ďalšie nezhody kritikov:**
- Karta s presnosťou: VZP ju chce presunúť do pitchu, traja ostatní ju chcú nahradiť slepým testom. Moja voľba je slepý test.
- 3 ilustračné prípady: VZP ich považuje za šum, Skeptik ich chce nechať. Moja voľba: nechať ich ako riadky vo fronte, ale nedá sa na ne kliknúť.

**(F) Príbeh dema na 3 minúty**

1. **0:00** – Fronta: prišla žiadosť praktika (správa 07). Je to 1 dokument a väčšina z 20 polí je sivá.
2. **0:20** – „Prevziať“ → appka ukáže, čo chýba → „Vyžiadať 01–06“ → 5 konceptov na pracoviská.
3. **0:45** – „Prehrať príchod“: správy pribúdajú, dlaždice zelenajú a pri každej hodnote je citát. Koordinátorka objedná CT v KOC 1, lebo v KOC 2 nie je termín. Na červeno vyskočí apixaban 18. 10. pri výkone 12. 10.
4. **1:20** – Histológia mešká → „na ťahu je patológia“ → „Urgovať“. ECOG chýba → koordinátorka zapíše telefonát → pole sa doplní so zdrojom „telefonát“.
5. **1:40** – Posuvník na 21. 10.: správy 12 a 13 vypadnú (v podklade je 65 kg, nie 63 kg). Stiahne sa český „Zápis k jednání MDT“.
6. **2:00** – „Pokazte to sami“: porotca zmení rodné číslo alebo dátum. Za sekundu sa ukáže rozpor s oboma citátmi.
7. **2:30** – Zápis z konzília sa zmení na úlohy (ak je hotový bod E6). Záver pre praktika s jeho otázkou → odoslať → doručenka.
8. **2:50** – Číslo zo slepého testu, „nič si nevymyslí“, údaje ostávajú v EÚ, praktik nepotrebuje nový účet.

**(G) Tvoje rozhodnutia, Bruno**

1. **Zmrazíme dnešnú verziu ako zálohu a ideme naplno do bodov 1–3?** Odporúčam áno, hneď teraz.
2. **Zoženieš kľúč k Azure do 8:00?** Odporúčam skúsiť, ale demo na ňom nestavať. Bez kľúča hovoríme „pravidlá + overené citáty“ a slovo „AI“ nepreháňame.
3. **ECOG:** zadanie chce doplnenie do podkladu. Vzorový záver konzília od VZP však píše „ECOG není … stanoveno“ a „stanovit ECOG“. Odporúčam doplnenie ukázať, lebo ho zadanie chce doslova. Zdrojom má byť zápis telefonátu, nie vymyslená správa 14. Vzorový záver necháme doslovne.
4. **Jazyk:** dokumenty pre VZP a praktika budú česky. Appka môže ostať po slovensky, ak ju neprerobí redizajn. Odporúčam áno.
5. **Ak nestíhame:** po 9:30 robiť už len body označené MUSÍ. O 11:00 zastaviť zmeny v kóde a nahrávať video. Odporúčam áno.

Zdroje:
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/pages/Intake.tsx
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/data/cases.ts
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/public/data/extracted-alena.json
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/public/data/source.json
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/STATUS.md
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/docs/materials/drive/INTRO_Praha_text.md


## Kontrola realizovateľnosti (tech lead)

**Verdikt tech leada: plán je realizovateľný, ale v inom poradí a v dvoch bodoch menší**

Všetko som overil v kóde a motor som reálne spustil mimo repa. V repe som nič nezmenil.

**Čo som zistil**
1. Motor (`src/ai/extract.ts`) je napísaný tak, že pobeží priamo v prehliadači a nepotrebuje server. Na 13 správach trvá 5 až 17 ms, nie 0,14 s.
2. Samotné pravidlá bez AI dávajú presne to isté: Alena 20/20 polí a 17/17 pascí, Novák 20/20 a 13/13, nula vymyslených údajov. AI teda k číslu nič nepridáva. Jej uložené odpovede navyše napísal Claude Code ako náhradu, čo priznáva aj pole `model`.
3. Bod 0:00 v príbehu dema neplatí. Zo samotnej správy 07 motor vyplní 15 z 20 polí. Chýba ECOG, váha, vyšetrenia, laboratórium a histológia. Po správach 01–07 je to 18/20, po správe 09 vyskočí apixaban a po správe 11 histológia.
4. Pre „Pokazte to sami“ fungujú 4 úpravy:
   - iné rodné číslo v správe 10 vytvorí nový rozpor,
   - oprava dátumu apixabanu rozpor odstráni,
   - doplnený „ECOG 1“ dá 20/20,
   - zmazaná správa 11 nechá histológiu prázdnu.

   Nefunguje zmena strany nádoru u Aleny (motor ju nechytí). Zmena nadpisu „Pacientka:“ spôsobí, že 6 polí chýba.
5. Stiahnutie do PDF už existuje (tlačidlo Tlačiť/PDF). „Vyžiadať 01–06“ je dnes len riadok v zázname, nie tlačidlo.
6. Skript `build-pacient2.mjs` je šitý na Nováka a beží len na počítači, nie v prehliadači. Pre Alenu sa dá použiť len jeho logika, asi 20 riadkov.

| Položka | Verdikt | Reálne hodiny | Poznámka |
|---|---|---|---|
| D – upratať (bilancia, karta 20/20, falošná kontrola, štítky) | áno | 0,75 | Agent A hneď na začiatku, lebo ide o tie isté súbory ako E1 |
| E1 Živý motor | áno, ale v inom poradí | 3–4 | Najprv **samostatná obrazovka „Motor naživo“**: správy prichádzajú, dlaždice sa plnia, pasce svietia na červeno. Nič existujúce to nerozbije. Až potom Alenu prepnúť na výstup motora a ručnú verziu nechať ako zálohu, ktorú vieme zapnúť. Pozor: všetkých 19 polí bude „návrh“ (dnes je 14 potvrdených), takže treba tlačidlo „Potvrdiť overené“ naraz. |
| E2 Pokazte to sami | áno | 0,75–1 | Na obrazovke motora: 4 vopred pripravené úpravy z bodu 4 a k tomu voľný text |
| Okno na súbor | zjednodušiť | 0,5 | Prijme vložený text alebo súbor .txt. Čítanie PDF a Word nie, lebo nová knižnica je riziko. |
| E3 Dokumenty česky | zjednodušiť | 1–1,5 | PDF už máme, Word vynechať. Po E1 sú hodnoty české a doslovné samy od seba. Treba preložiť pevné texty a do záveru dať vzor „MDT zaver“ doslova. Beží súbežne, iné súbory. |
| E4 Kroky koordinátorky | zjednodušiť | 2 | **Áno:** „Vyžiadať 01–06“ (5 konceptov), objednanie CT s meniteľným termínom a stavom, telefonát ako nová „správa“, z ktorej motor sám vytiahne ECOG aj s citátom (nahradí vymyslenú správu 14). **Nie:** šablóna Pankreas. |
| E5 Slepý test | áno | 1,5–2 | Súbežne, appku neohrozí. Agent napíše správy aj kontrolnú sadu a pravidlá nesmie vidieť. |
| E6 Zápis z konzília → úlohy | nie | – | Zadanie po konzíliu chce len poslať záver praktikovi a doručenku, to už máme. Program by bol šitý na jediný vzorový text. |
| E7 Ostrá AI | áno, ale je to úloha pre Bruna | Bruno 0,5 + agent 0,5 (+1 živé volanie) | Kód je hotový. Chýba kľúč z aka.ms/rakathon2026, kam sa prihlasuje kartičkou kapitána (časové heslo už mohlo vypršať). Kritérium 1 sa volá „AI technologie“, preto sa to oplatí skúsiť. Živé volanie len cez malý server na notebooku a len ak kľúč príde do 8:00. |
| E8 SMS pacientke | nie | – | Zadanie ju nechce |
| **Chýba v pláne:** verejný odkaz na demo (Vercel) a verejný GitHub | áno | 1 | Keďže motor beží v prehliadači, demo pôjde aj bez servera |
| Generálka (`build`, `verify`, preklikať ukážku) | áno | 0,5 | |

**Úpravy plánu**
- Bod 0:00 v deme zmeniť na: „žiadanka vyplní 15/20, ale nemá výsledky, len píše, kde sú“. To prirodzene vedie k „Vyžiadať 01–06“.
- Zmeny v kóde zastaviť o **10:30**, nie o 11:00. Video a formulár do 12:30 sú pre dvoch netechnických ľudí málo času.
- Pred štartom urobiť zálohu dnešnej verzie. Každý agent pracuje v samostatnej kópii a spájame o 7:30 a 9:30.
- Pitch: kým Azure reálne nebeží, slovo „ostrý Azure“ nepoužívať. Hovoriť „pravidlá + overené citáty, AI navrhuje voľný text“.

**Plán do 13:00**

| Čas | Kto | Čo |
|---|---|---|
| 04:30–04:45 | všetci | záloha a rozdelenie práce |
| 04:45–05:30 | Agent A | upratovanie (D) |
| 05:30–07:30 | Agent A | obrazovka „Motor naživo“, prehrávanie príchodu správ, „Pokazte to sami“ |
| **07:30** | Agent A | **Kontrola č. 1.** Ak motor nefunguje, vrátiť zmeny a demo ide na dnešnej verzii + slepý test. |
| 07:30–09:00 | Agent A | Alena z motora, hromadné potvrdenie, telefonát |
| 09:00–10:15 | Agent A | opravy |
| 04:45–06:15 | Agent B | dokumenty česky (E3) |
| 06:15–08:30 | Agent B | „Vyžiadať 01–06“ a objednanie CT (E4) |
| 08:30–10:15 | Agent B | „Ukážku v 8 krokoch“ prerobiť na nový príbeh (krok 6 s ECOG dnes ráta s vymyslenou správou 14) |
| 04:45–06:45 | Agent C | slepý test, číslo do appky a do pitchu |
| 07:00–08:00 | Agent C | opraviť pitch a `SUBMISSION.md` |
| 09:30–10:15 | Agent C | demo na Vercel, GitHub verejne (predtým skontrolovať, či v histórii nie sú kľúče) |
| do 08:00 | Bruno | kľúč k Azure. Ak príde, Agent C od 8:00 do 9:00 pustí ostré vyťaženie (`npm run extract`). |
| 10:30–11:00 | všetci | zastaviť zmeny, generálka |
| 11:00–12:00 | tím | video |
| 12:00–12:30 | tím | formulár |
| 12:30–13:00 | – | rezerva |

**Ak nestíhame:** po 9:30 už len opravy. Keď o 7:30 obrazovka motora nefunguje, zo zmien ostane len upratovanie (D), slepý test, české dokumenty a „Vyžiadať 01–06“.

Súbory, o ktoré sa to opiera:
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/ai/extract.ts
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/pages/CaseView.tsx
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/data/cases.ts
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/components/Shell.tsx
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/eval/llm-cache/
- /Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/docs/research/04-slack-vyzvy-a-pravidla.md
- skúšobné skripty: /private/tmp/claude-501/-Users-brunoduhar-Library-Application-Support-Claude-scratch-workspaces-86c6b80d-e417-498c-a005-1cb65ed96ea6-8ade6142-1851-4655-919e-c6be70635281-scratch-2026-10-16-1cc6b0/04c5cde1-8b12-4f75-8ea3-1fbf9a54de0c/scratchpad/probe.mts a eval-alena-rules.json


## Jednotliví kritici


### VZP (zadávateľ)

**1) Verdikt**

Na obrazovke appka pokrýva všetkých 6 bodov z časti „Co má aplikace umět“ aj všetky 3 povinné výstupy. Podklad pre MDT s citátmi a pascami je hlbší, než aký čakám od väčšiny tímov. Lenže z pohľadu VZP je to zatiaľ prehliadka po vopred pripravených dátach. Pocit „scam“ je oprávnený: nie kvôli obsahu, ale preto, že v deme nie je ani jedna chvíľa, keď niečo naozaj beží. Opravou nie sú ďalšie obrazovky. Treba 1–2 veci spraviť naozaj živé.

Dôkazy:
- Alenu má appka označenú „ručne overené tímom“ (screenshot 02).
- AI nikdy nebežala naostro. V `public/data/extracted-alena.json` je pri modeli napísané „náhrada bez Azure kľúča – odpoveď z Claude Code“.
- Vlastný súbor praktika appka nečíta. V `Intake.tsx` stojí „vlastný súbor · prototyp ho nečíta“ a „kontrola“ je len 900 ms čakanie s vopred pripraveným výsledkom.
- Takmer každé odoslanie je označené „simulované“.

Ako to hodnotí porota: kritérium 1 znie „Jak dobře řešení skutečně funguje, co tým reálně vytvořil“. Hodnotiť chodia priamo zadávatelia o 14:00.

**Zadanie bod po bode (27 požiadaviek zo slidov):**
- **Naplno (14):** vstupná stránka bez formulára, označenie chýbajúceho, kopírovanie po častiach, žiadosť lekárovi o doplnenie, fronta nový/aktívny/odložený, kto je na ťahu, záver praktikovi s jeho pôvodnou otázkou, doručenka, uzavretie prípadu.
- **Povrchne (9):**
  - nahranie správ (appka ich nečíta),
  - AI vyťaženie (beží offline, Alena je ručne pripravená),
  - úlohy nemajú prioritu,
  - nový pacient z žiadanky sa vo fronte neobjaví,
  - poradie krokov appka nestráži,
  - kanály sú len koncepty e-mailov,
  - notifikácie = iba ranný prehľad,
  - revízny lekár je len statická simulácia,
  - prevzatie „v jednom kroku“.
- **Vôbec (4):**
  - komunikácia s pacientom (slovo SMS v kóde nie je ani raz),
  - sada krokov pre diagnózu (šablóna „pankreas“ chýba, krok sa nedá naplánovať, v Ceste je len tlačidlo „Urgovať“),
  - nahratie zápisu z MDT (je vopred vložený),
  - revízny lekár si nevie vyžiadať doplnenie.

**2) Čo je silné a treba nechať**
1. Doslovné citáty, ktoré program overí (137/137). Klik na údaj ukáže zvýraznenú vetu v pôvodnej správe. To je presne „bez domýšlení“ zo zadania.
2. Pasce v dátach:
   - chýba ECOG,
   - dátum apixabanu 18. 10. pri výkone 12. 10.,
   - histológia vydaná deň pred odberom,
   - u Nováka: nádor raz vľavo, raz vpravo, cudzie rodné číslo, stratená alergia.

   Zadanie výslovne chce „nesouhlasící údaje“. Toto väčšina tímov mať nebude.
3. Prepínač „stav k 21. 10.“: správy 12 a 13 do podkladu nepustí. Je to doslovné upozornenie zo zadania.
4. Podklad podľa 7 častí `MDT_zapis` a záver praktikovi: jeho pôvodná otázka, „čo to znamená pre vás“, doručenka v troch krokoch. Appka si všimla, že Alena má poisťovňu 211, nie VZP, a súhrn smeruje revíznemu lekárovi 211.
5. Meranie presnosti a test poistky (4 z 5 vymyslených návrhov zamietnuté). K tomu záznam o koordinovaní ako podklad pre výkon 51887, ktorý VZP platí. To je praktický háčik pre VZP.

**3) Čo je slabé, falošné alebo zbytočné**
1. **Alena v UI nie je výstup AI.** Výstup AI pre Alenu pritom existuje (20/20 v `extracted-alena.json`), len sa nezobrazuje. Porotca sa spýta: „Kde AI vyťažila súťažný prípad?“ Treba ukázať strojový návrh a ručnú verziu nechať ako kontrolu.
2. **Falošná „kontrola žiadanky“** (900 ms čakanie, vopred hotové nálezy). Keď porotca pretiahne svoj súbor, uvidí „prototyp ho nečíta“. Buď spraviť naostro, alebo odstrániť.
3. **„Vyžiadať a zhromaždiť“ je len história.** Správy 01–06 sú „prišlo 3.–6. 10.“ a naživo sa vyžiada iba ECOG. Ten navyše odpovie správa 14, ktorú sme si vymysleli, a zápis MDT jej odporuje („stanovit ECOG“, R5 #13).
4. **Cesta sa nedá plánovať.** Kroky sú natvrdo v dátach. Zadanie pritom chce „naplánovat … s termínem, místem a stavem“.
5. **Šum, ktorý VZP nepotrebuje:** gamifikácia „Moja bilancia“, 3 ilustračné prípady a karta „Kontrola presnosti“ hneď na hlavnej obrazovke. Štyrikrát 100 % na dátach, na ktorých sme pravidlá ladili, vyzerá ako trik (R5 #5). Meranie patrí do pitchu, nie na úvodnú stránku.
6. **Vyše 20 štítkov „simulované“.** Je to poctivé, ale spolu to hovorí „nič nefunguje“. Stačí jedna poznámka v päte a 1–2 kanály spraviť naozaj.
7. **Text na odovzdanie tvrdí viac, než demo ukáže:** „Žádanku od praktika založí jako případ“ a „AI … Azure EU“, hoci beh v Azure nikdy neprebehol (`docs/pitch/SUBMISSION.md`). Treba upraviť, nech netvrdí viac než demo.

**4) Čo chýba (zoradené podľa dopadu)**

| # | Čo presne | Prečo | Práca | Riziko |
|---|---|---|---|---|
| 1 | **Živé AI vyťaženie v appke:** nahrám správy (.docx alebo text), v appke sa spustí to isté vyťaženie (pravidlá + AI) a polia sa vyplnia s citátmi ako „návrh → potvrdiť“. Kód v `src/ai/` už je, chýba malá serverová časť, ktorá zavolá AI s kľúčom. | Kritérium 1, odpoveď na „scam“ | 3–4 h | Kľúč z portálu Rakathonu ešte nikto nevybral (STATUS.md). Odpoveď trvá 20–60 s. Záloha = uložená odpoveď s viditeľným štítkom. |
| 2 | **Celý priechod od 2. 10.:** na začiatku je len správa 07 → jedným klikom 6 žiadostí → správy prichádzajú, dlaždice zelenajú a pasce vyskakujú → šablóna „Pankreas“ naplánuje CT v KOC 1 (termín, miesto, stav) → histológia mešká → urgovať → podklad k 21. 10. | Doslovne „funkční demo celého průchodu“ | 2–3 h (dáta s dátumami doručenia už existujú) | stredné, chyby v stave dema |
| 3 | **Nahratie zápisu z MDT:** AI z neho poskladá záver praktikovi aj súhrn pre revízneho lekára (dnes sú ručne napísané v `cases.ts`) | slide 11, body 22 a 24 | 1,5–2 h | nízke, ak beží bod 1 |
| 4 | **Správa pacientke (SMS / e-mail):** termín, príprava, odkaz na pokyn lekára k apixabanu | slidy 9–10, dnes úplne chýba | 1 h | nízke |
| 5 | **Export pre nemocničný systém:** PDF a JSON podľa FHIR (Composition, DocumentReference, Provenance s citátom) | kritérium 2 (integrácia), cena InterSystems | 1,5 h | nízke, len nepreháňať sľuby |
| 6 | **Slide „Nasadenie pre VZP“:** pilot v 1 KOC na 3 mesiace, 4 merané čísla, náklad na AI na prípad vypočítaný z to



### Koordinátorka KOC

**1) Verdikt (pohľad koordinátorky KOC)**

Bruno má z polovice pravdu. Appka nie je jednoduchá: pracuje s údajmi presnejšie, než to väčšina tímov ukáže. Každý údaj má doslovný citát, appka ukazuje rozpory medzi správami, má prepínač „stav k dátumu“ a podklad podľa šablóny VZP MDT_zapis. Zároveň je to však „nahraný film s tlačidlami“. Súťažný prípad Aleny pripravil tím ručne (na obrazovke je odznak „ručne overené tímom“). AI beží len vopred a offline. Súbor, ktorý niekto nahrá sám, appka nečíta (`Intake.tsx`: „prototyp ho nečíta“). A koordinátorka v nej nič nové nevytvorí, len prehráva hotový príbeh.

Zadanie pritom doslova chce „nasimulujte ve vaší aplikaci práci koordinátora“. Kritérium hodnotenia č. 1 sa pýta „Jak dobře řešení skutečně funguje?“. Ak VZP pri stole povie „nahrajte inú správu“, dnes neobstojíme.

**2) Čo je SILNÉ – nechať**

1. Každý údaj má doslovný citát. Klik otvorí pôvodnú správu so zvýraznenou vetou (159/159 citátov overených).
2. Pasce zo zadania appka chytí:
   - chýba ECOG (stav výkonnosti),
   - apixaban vysadený „18. 10.“, teda až po výkone 12. 10.,
   - histológia vydaná pred dátumom odberu,
   - správy 12 a 13 sa do podkladu k 21. 10. nedostanú.
3. Podklad pre konzílium podľa MDT_zapis a záver pre praktika aj s jeho pôvodnou otázkou.
4. Poistka proti vymysleným hodnotám a meranie presnosti, vrátane poctivo priznaných limitov.
5. Upozornenie tramadol + antidepresíva „musí ísť ďalej“. To je presne téma výzvy „bez ztráty informací“.

**3) Čo je SLABÉ, falošné alebo zbytočné**

1. **Alena je „ručne overená tímom“.** Súťažný prípad nespracovala AI, ale človek. Strojový výsledok pre Alenu už existuje (`extracted-alena.json`, 20/20), appka ho len nepoužíva.
2. **Tlačidlo „Simulovať odpoveď“ pri ECOG a „kontrola“ žiadanky.** Kontrola je len 0,9-sekundové čakanie. Na obrazovke to doslova pôsobí ako fejk.
3. **AI je tenká a pitch ju zveličuje.** Fact-check (`raw-pitch-factcheck.md`) zistil tri veci. Výsledok 20/20 vyjde rovnako aj úplne bez AI, robia ho pravidlá. Azure sa nikdy nevolal. Odpovede AI vyrobil Claude Code ako náhradu. Ak to porotca zistí, padá dôvera.
4. **Pitch sľubuje, čo appka nevie.** Konkrétne „žiadosti na 5 pracovísk“ a „sama eskaluje“ (fact-check, body 12 a 13).
5. **Kroky cesty sa dajú len pozerať.** Zadanie chce „naplánovat a sledovat kroky … s termínem, místem a stavem“. Koordinátorka nevie objednať CT, zmeniť stav kroku ani pridať krok. Jediné tlačidlo je „Urgovať“.
6. **Fronta je 5 veľkých kariet, k tomu „Moja bilancia“, „Kontrola presnosti“ a dánske/holandské lehoty.** Pri 10–20 nových pacientoch týždenne bude mať koordinátorka podľa môjho odhadu 40–100 rozbehnutých prípadov. Potrebuje hustý zoznam, nie kartičky. Čísla presnosti sú pre porotu, nie pre ňu. Zahraničné lehoty v ČR nikto nepoužíva.
7. **Podklad pre konzílium je po slovensky v českej šablóne.** Práve tento dokument odovzdávame VZP. Má byť po česky a doslovne, a české citáty už máme.

**4) Čo CHÝBA – zoradené podľa dopadu na porotu a VZP**

1. **Živý príjem dokumentov („Doručená pošta“).**
   - Čo: koordinátorka pretiahne PDF alebo DOCX. Appka podľa mena a rodného čísla určí pacienta, ďalej typ správy, dátum a pracovisko. Odškrtne položku „vyžiadané“ a podklad sa vyplní pred očami.
   - Prečo: najviac času v praxi zaberá triediť prílohy e-mailov a skeny. Zároveň to dokazuje, že nič nie je nahrané. Originálne súbory správ v repe nie sú, len ich text, treba z neho súbory vyrobiť. Vyťažovací kód je čistý TypeScript a pobeží priamo v prehliadači.
   - Práca: 3–4 h.
   - Riziko: stredné. Pravidlá sú ladené na týchto pacientov a čítanie PDF potrebuje knižnicu.
2. **Skutočná AI cez Azure z portálu Rakathonu.**
   - Čo: kľúč do `app/.env`, nový beh vyťaženia, v appke zobraziť model a čas spracovania.
   - Prečo: v `STATUS.md` je táto úloha kapitána stále otvorená a dnes nemáme ani jedno skutočné volanie AI.
   - Práca: 0,5–1 h.
   - Riziko: nízke. Bruno však musí kľúč získať hneď ráno.
3. **Alena strojovo s potvrdením človekom (ako Josef).**
   - Čo: prepnúť Alenu na strojový výsledok, každé pole ako „návrh → potvrdiť“.
   - Prečo: rieši bod 3.1, súťažný prípad musí ukazovať AI.
   - Práca: 1,5–2 h.
   - Riziko: stredné. Treba znova otestovať priechod s ECOG a rozpormi.
4. **Šablóna cesty pre diagnózu.**
   - Čo: „C25 pankreas“ vloží sadu krokov (CT pankreatický protokol → EUS-FNB → histológia, odbery + CA 19-9 → konzílium). Koordinátorka doplní termín a miesto, napr. CT v KOC 1, lebo v KOC 2 nebol termín. Appka stráži poradie krokov.
   - Prečo: slide 10 to chce doslova.
   - Práca: 2 h.
   - Riziko: nízke až stredné.
5. **Koncepty správ jedným klikom.**
   - Čo: žiadosť o správy 01–06 na päť pracovísk a oznámenie termínu pacientke cez SMS.
   - Prečo: slide 10 chce e-mail, SMS a chat. SMS chýba úplne a žiadosti už sľubuje pitch.
   - Práca: 1–1,5 h.
   - Riziko: nízke.
6. **Telefonát → poznámka.**
   - Čo: zápis hovoru (kto, čo, termín) sa uloží do záznamu o koordinovaní a vznikne z neho ďalší krok. ECOG sa doplní takto, so zdrojom „telefonát, MUDr. Marková, 19. 10.“, namiesto tlačidla „Simulovať“.
   - Prečo: koordinátorka v praxi najviac telefonuje.
   - Práca: 1 h.
   - Riziko: nízke.
7. **Nahratie zápisu z konzília (slide 11, bod 22).**
   - Čo: koordinátorka vloží zápis z MDT. AI z neho spraví záver pre praktika a súhrn pre revízneho lekára, každú vetu s citátom.
   - Prečo: dnes je tento text pripravený vopred.
   - Práca: 1,5–2 h.
   - Riziko: stredné.

Všetko spolu je asi 11–13 h práce agentov. S 3 agentmi súbežne do 12:30 reálne stihneme body 1, 2, 3, 5 a 6. Body 4 a 7 len ak zostane čas. Pred začatím treba zamraziť dnešnú verziu ako zálohu dema.

**5) Jedna „killer“ vec**

**„Pokazte si to sami.“**
- Pri stole dáme VZP 13 správ Aleny ako súbory. Pretiahnu ich do appky a asi za pol minúty uvidia vyplnený podklad s citátmi aj tri problémy.
- Potom porotca v jednej správe sám prepíše vetu. Napríklad zmení rodné číslo v laboratórnej správe alebo dopíše „ECOG 2“.
- Appka hneď ukáže ro



### Porota a konkurencia

**1) Verdikt**

Funkcií nie je málo. Appka pokrýva všetkých 6 bodov zo slidu 12. Chytá pasce v dátach: apixaban 18. 10., histológiu vydanú pred odberom a chýbajúci ECOG. Má aj posuvník „stav k 21. 10.“, ktorý väčšina tímov mať nebude.

Problém je inde: nič v nej nebeží naživo. Súťažná pacientka Alena má v hlavičke „ručne overené tímom“. Obrazovka číta ručne napísané dáta (`cases.ts`), nie výstup AI. Okno „pretiahnite PDF“ súbor nečíta. Azure sa nikdy nezavolal (v appke nie je kľúč). Výsledok 20/20 vyjde rovnako aj úplne bez AI.

Prvý mentor, ktorý pri stole povie „dajte tam túto správu“, to odhalí a vtedy to naozaj vyzerá ako maketa. Netreba teda pridávať ďalšie funkcie, treba rozhýbať jadro.

**Kontext poroty:** V sobotu 14–16 h rozhodujú zadávatelia pri stole. Medzi mentormi je aj praktická koordinátorka Klára Vaňková. Kritérium 1 sa doslova pýta: „Jak dobře řešení skutečně funguje? Co tým reálně vytvořil?“

V Prahe majú výzvu ešte 4 tímy: MediBit, smetytech., FIT/S, Ctrl+Alt+CURE. Môj odhad typického konkurenta: nahrá 13 Word súborov, AI naživo vyplní tabuľku, stiahne sa Word a odíde e-mail, možno aj FHIR export (štandard na výmenu zdravotných dát).
- **Prebijú nás tým**, že to beží naživo a majú české dokumenty na stiahnutie.
- **My ich prebijeme hĺbkou:** citáty overené kódom, pasce, stav k dátumu, kto je na ťahu, uzavretá slučka.
- Keď spojíme oboje, máme navrch.

**2) Silné – nechať**

1. Klik na údaj otvorí originál so zvýraznenou vetou. Rozpor A/B je vedľa seba a rozhoduje človek.
2. Pasce zo zadania a posuvník „stav k 21. 10.“: správy 12 a 13 sú vyradené, v podklade je 65 kg, nie 63 kg.
3. Cesta pacientky: každý krok má 4 stavy (vyžiadané → objednané → vykonané → výsledok), vidno „kto je na ťahu“ a pri meškajúcej histológii tlačidlo „Urgovať“.
4. Doplnenie ECOG cez žiadosť, po ktorom sa pole v podklade samo prepíše. Presne toto zadanie žiada.
5. Záver pre praktika s jeho pôvodnou otázkou a blokom „Čo to znamená pre vás“. Poisťovňa 211 ide k revíznemu lekárovi a je tam varovanie tramadol + antidepresíva.

**3) Slabé, falošné alebo zbytočné**

1. **Odznak „ručne overené tímom“ pri Alene.** Zadanie chce „pomocí AI vytěžit“, súťažný prípad nemôže byť ručná práca. Treba ho zobraziť zo strojového výstupu.
2. **Okno „PDF, DOCX alebo fotka“, ktoré súbor nečíta.** To je presne ten moment „scam“. Buď ho naučiť čítať, alebo ten sľub zmazať.
3. **Karta „20/20 · 17/17 · 13/13“ na hlavnej obrazovke.** Kontrolné sady aj pravidlá písal ten istý tím a bez AI vyjde to isté. IT porotca to rozoberie za minútu. Kartu presunúť do „Ako sme merali“ a nahradiť ju slepým testom: tretieho pacienta napíše agent, ktorý pravidlá nevidel, a zverejníme poctivé číslo, aj keby bolo 16/20 (1,5 h).
4. **„AI výstup“ pri Josefovi.** Odpoveď napísal Claude Code namiesto skutočného volania AI. Slovo „AI“ nepoužívať, kým AI naozaj nezavoláme.
5. **Podklad pre konzílium = česká šablóna so slovenskými parafrázami.** Zadanie hovorí „přebírejte bez domýšlení“ a parafráza je druh domýšľania. Navyše český praktik dostane slovenský list.
6. **„Moja bilancia“ a „deň 17 z 33 – dánsky vzor“.** Nikto to nežiadal, zaberá to miesto a vyvoláva otázky. Skryť.
7. **Pitch.** Vyhodiť vety „ostrý režim Azure“ a „AI vyplní 20 polí“ (fact-check ich už označil).

**4) Čo chýba – zoradené podľa dopadu**

1. **Živé spracovanie.**
   - *Čo:* tlačidlo „Spracovať 13 správ“, prípadne nahranie pôvodných Word súborov. Polia sa plnia postupne po správach aj s citátmi. Pravidlá bežia v prehliadači bez kľúča za sekundu a Alena sa zobrazí z tohto výstupu.
   - *Prečo:* rieši falošné body 1 a 2 a priamo kritérium 1.
   - *Práca:* 3–4 h.
   - *Riziko:* stredné, treba napojiť výstup na obrazovky. Záloha sú dnešné predpočítané dáta.
2. **„Skúste nás oklamať“.**
   - *Čo:* pri správe tlačidlo „Upraviť“. Porotca zmení vetu, klikne „Prepočítať“ a objaví sa nový rozpor alebo chýbajúci údaj s citátom. Podklad pre konzílium sa prepíše.
   - *Prečo:* je to dôkaz, že nejde o maketu.
   - *Práca:* 1,5 h, stavia na bode 1.
   - *Riziko:* pravidlá nechytia hocijakú zmenu. Preto pripraviť 3 overené úpravy (ECOG, alergia, iné rodné číslo) a k tomu voľnú úpravu.
3. **České dokumenty na stiahnutie.**
   - *Čo:* „Zápis k jednání MDT“ presne podľa šablóny `MDT_zapis` s doslovnými českými vetami a „Závěr MDT pro PL“, oboje ako PDF alebo Word.
   - *Prečo:* sú to 2 z 3 povinných výstupov a porota sa na ne bude priamo pozerať.
   - *Práca:* 2–3 h.
   - *Riziko:* nízke, len nesmie prestať prechádzať kontrola citátov (`npm run verify`).
4. **Ostrá AI.**
   - *Čo:* Maťo ako kapitán hneď ráno vyzdvihne kľúč k Azure. Táto úloha stojí nevybavená od piatka. K tomu malá serverová funkcia, aby 5 voľných textov naozaj písal model a kontrola citátov bežala naživo.
   - *Prečo:* inak nemôžeme poctivo povedať „AI“.
   - *Práca:* 1–2 h po získaní kľúča.
   - *Riziko:* limity zdieľaného rozhrania. Záloha je uložená odpoveď s poctivým štítkom.
5. **Uzavretie slučky na telefóne porotcu.**
   - *Čo:* na obrazovke QR kód. Porotca ho naskenuje, otvorí sa mu stránka praktika a klikne „Potvrdzujem prijatie“. Koordinátorke sa zobrazí „doručené 14:07, potvrdil MUDr. Řezníček, slučka uzavretá“.
   - *Prečo:* „doložit doručení“ je dnes len simulované. Takto ho porota uvidí naozaj.
   - *Práca:* 2–3 h (nasadenie na web a stav zdieľaný medzi telefónom a notebookom).
   - *Riziko:* stredné (wifi, nasadenie).
6. **Záver konzília → úlohy.**
   - *Čo:* koordinátorka vloží záver konzília a appka zo 6 odporúčaní spraví úlohy s vlastníkom a termínom: onkológia 4. 11. o 10:30, ECOG, odbery, nutričná podpora, psychoonkológia, informovať dcéru. Každá úloha má citát.
   - *Prečo:* zadanie to žiada (požiadavka 22), dnes je záver len pevne vložený vzor.
   - *Práca:* 1,5–2 h.
   - *Riziko:* nízke.
7. **FHIR export.**
   - *Čo:* stiahnuteľný súbor so všetkými údajmi v štandarde FHIR, pri každom údaji odkaz na doslovný citát.
   - *Prečo:* pre nedeľné finále (v porote je Zubek z InterSystems a Bušek z HL7) a pre cenu



### Skeptik / scam detektor

**1) Verdikt**

Nie je to podvod. Pod appkou je skutočný „motor“, teda program, ktorý zo správ vyťahuje údaje (`src/ai`). Skúsil som ho pokaziť a reagoval správne: keď som v správe 09 opravil dátum apixabanu, rozpor zmizol, a keď som do správy 07 dopísal „ECOG 1“, pole sa vyplnilo. Problém je, že appka tento motor vôbec nepoužíva, takže porotca vidí hotový výsledok a pred jeho očami sa nič nedeje. Jednoduchosť nie je problém, obrazovky sú skôr preplnené. Problém je, že ukazujeme maketu výsledku, a nie proces, ako z 13 správ vznikne poriadok.

**2) Silné, nechať**

1. **Doslovné citáty.** Pri každom údaji je presná veta zo správy a klik ju zvýrazní v origináli. Program to overuje (137/137). Presne to znamená „bez ztráty informací“.
2. **Hľadanie dier a rozporov naozaj funguje.** Zmena dátumu v správe rozpor zruší, alergia na penicilín sa prepíše, a keď zmažem správu 10, laboratórium sa vráti k odberu z 1. 9. Celé vyťaženie trvá 0,14 s a dá sa spustiť aj v prehliadači.
3. **Dátum konzília.** Správy 12 a 13 motor sám vyradí, lebo vznikli po konzíliu. Zadanie to výslovne žiada.
4. **Pokrytie zadania.** Appka má všetkých 6 bodov zo slidu 12: frontu s „kto je na ťahu“, cestu pacientky, podklad podľa šablóny `MDT_zapis` a záver pre praktika s jeho pôvodnou otázkou.
5. **Poctivosť.** Čo chýba, je označené „chýba“, appka neodporúča liečbu a test s úmyselne zlou AI zamietol 4 z 5 vymyslených návrhov.

**3) Slabé alebo falošné, prerobiť**

1. **Motor a appka nie sú prepojené.** Údaje Aleny v appke sú ručne napísané v kóde (945 riadkov v `src/data/cases.ts`, odznak „ručne overené tímom“). Výstup motora sa nikde neukazuje. Vlastná kontrola tímu to priznáva: „UI ho dnes neimportuje“.
2. **Kontrola žiadanky je divadlo.** Nápis „Čítam žiadosť…“ je len 0,9 s čakanie a nálezy sú vopred napísané. Vlastný súbor appka nečíta. Prvý porotca, ktorý pretiahne svoj súbor, zistí, že sa nič nestalo.
3. **„Simulovať odpoveď“ pri ECOG je vopred pripravená hodnota** (fiktívna správa 14). Zadanie pritom výslovne chce, aby koordinátor chýbajúce údaje doplnil a appka ich zapracovala do podkladu.
4. **„AI“ neobstojí pred technickým porotcom.** Odpoveď jazykového modelu nevytvorila žiadna služba cez internet, napísal ju Claude Code počas vývoja, lebo kľúč k Azure nemáme. A režim len s pravidlami, bez AI, dá tiež 20/20 polí a 17/17 pascí. Overil som to sám. Pravidlá aj pacienta 2 sa navyše ladili na tých istých dátach, preto 100 % pôsobí podozrivo.
5. **Je to ušité na tieto správy.** Keď som zmenil nadpis „Pacientka:“ na „Jméno pacienta:“, 6 polí skončilo ako „chýba“. Je to bezpečné, lebo appka nič nevymyslí, ale prezrádza to, že pravidlá sú šité na tieto správy.
6. **Ozdoby.** „Moja bilancia“ s korunami za výkon 51887 (platba poisťovne za koordináciu) pôsobí ako motivácia vykazovať viac. „Deň 17 z 33“ je dánska norma, k tomu holandská lehota. Pre VZP to rozptyľuje, stačí jeden riadok alebo nič.
7. **Všetko odchádzajúce je „simulované“.** Žiadosti, urgencie, záver, revízny lekár aj doručenka. Mimo obrazovky nevznikne ani jeden skutočný výstup. Tri ilustračné prípady sú prázdne škrupiny: vo fronte ich nechať, ale neklikať na ne.

**4) Čo chýba, pridať (podľa dopadu na porotu)**

1. **Živé spracovanie správ.** Nahrám 13 správ alebo kliknem „prehrať príchod“ a správy pribúdajú v poradí, ako prišli. 20 polí sa postupne farbí, rozpory vyskočia, správy 12 a 13 sa vyradia.
   - Prečo: kritérium 1 sa pýta, ako dobre riešenie naozaj funguje.
   - Práca: 3–4 h. Motor existuje, prevod jeho výstupu do appky už rieši `scripts/build-pacient2.mjs`.
   - Riziko: stredné. Hodnoty budú po česky, ručnú verziu nechať ako kontrolnú sadu na porovnanie.
2. **„Skús to pokaziť“.** V origináli sa dá prepísať veta alebo zmazať správa a podklad sa za sekundu prepočíta.
   - Práca: 1 h po bode 1.
   - Riziko: nízke, môj test už prešiel.
3. **Slepý test.** Nezávislý agent, ktorý nevidí pravidlá, napíše tretieho pacienta s inou diagnózou a inými nadpismi, ďalší agent k nemu správne odpovede. Ukážeme úprimné číslo, napríklad „15/20, zvyšok označený ako chýba, 0 vymyslených“.
   - Prečo: 100 % na vlastných dátach pôsobí ako podvod, 75 % na cudzích bez vymýšľania je dôveryhodné.
   - Práca: 2 h, dá sa robiť súbežne.
   - Riziko: nízke číslo, ale presne to je náš príbeh „radšej chýba, než vymyslí“.
4. **Skutočné doplnenie.** Koordinátorka vloží odpoveď alebo hodnotu, motor ju zapracuje s citátom a zmení sa aj podklad pre konzílium. Splní to vetu zo zadania doslova.
   - Práca: 1 h po bode 1.
   - Riziko: nízke.
5. **Ostrá AI.** Kľúč Azure z portálu Rakathonu a jeden skutočný beh. V appke záznam „AI navrhla → program overil citát → prijaté alebo zamietnuté“. Kľúč ostane na počítači, nie v prehliadači. AI nech pomáha hlavne tam, kde pravidlá zlyhajú (iné nadpisy).
   - Práca: 2 h.
   - Riziko: vysoké, kľúč zatiaľ nikto nezohnal (STATUS ⚪).
6. **Jeden skutočný výstup.** Podklad a záver ako PDF a dátový súbor (JSON, prípadne FHIR, teda štandardný formát zdravotníckych dát) na stiahnutie. Voliteľne skutočný e-mail do tímovej schránky s odkazom „potvrdiť prevzatie“.
   - Práca: 1–2 h.
   - Riziko: nízke pri PDF a súbore, stredné pri e-maile.
7. **Pravidlá tolerantné na iné nadpisy** (napríklad „Jméno pacienta“, „Medikace“), overené rovnakým testom pokazených správ.
   - Práca: 1 h.
   - Riziko: nízke.

**5) Killer vec: „Pokazte to sami“**

Porotcovi podáme myš: „Zmeňte v ľubovoľnej správe čokoľvek, alebo nahrajte vlastnú.“ Podklad sa pred ním prepočíta: rozpor sa objaví aj s citátom a chýbajúci údaj je označený ako chýba, nič si nedomyslí. K tomu 20-sekundové prehranie príchodu 13 správ, ako z chaosu vzniká poriadok. Porotca potom nemusí veriť, overil si to sám. Body 1 a 2 sú spolu 4–5 h, čiže do 12:00 sa to dá stihnúť, ak dizajn beží súbežne.

Súbory s testom (v repe som nič nemenil):
- `/private/tmp/claude-501/-Users-brunoduhar-Library-Application-Support-Claude-scratch-workspaces-86c6b80d-e417-498c-a005-1cb65ed96ea6-8ade6142-1851-4655-919e-c6be70635281-scratch-



### Najlepšie riešenia na svete

**Kritický pohľad na appku Koordinátor (Rakathon, VZP)**

## 1) Verdikt
Princíp je dobrý a lepší než bežné hackathonové „nahraj PDF a AI spraví tabuľku“. Citát pri každom údaji, rozpory vedľa seba a „stav k dátumu“ robia aj najlepšie nástroje na svete (Roche navify, Microsoft so Stanfordom, Abridge). V podstatnej veci má však Bruno pravdu: dnes je to nacvičený scenár, nie stroj, ktorý pracuje. Pred porotou sa nič nespracuje naživo, dáta Aleny pripravil tím ručne, AI v appke nebeží a Azure sa nikdy nezavolal. Ak do 13:00 appka spracuje správu, ktorú nikdy nevidela, a uzavrie slučku po konzíliu, môže vyhrať. Bez toho je to pekná hračka.

## 2) Čo je SILNÉ (nechať)
1. **Doslovný citát, ktorý overí program, a klik na originál.** Vo svete je to už štandard dôveryhodnej AI: Abridge „Linked Evidence“, Microsoft na Stanforde (súhrny pre konzílium s citáciami). V českej koordinácii nič také nie je.
2. **Rozpory vedľa seba.** Napríklad apixaban 18. 10. pri výkone 12. 10., histológia vydaná pred odberom, cudzie rodné číslo, nádor raz vpravo a raz vľavo, stratená alergia. Zadanie to výslovne chce („nesouhlasící údaje“) a bežné súhrny to nerobia.
3. **„Stav k dátumu“.** Priamo plní upozornenie zadania. V materiáloch navify ani v ďalších nástrojoch som nič podobné nenašiel.
4. **Kto je na ťahu a 4 stavy kroku.** Pri meškajúcej histológii appka ukáže „mešká“. Je to presne „Hotovo, keď…“ zo slidov 9–10.
5. **Varovanie tramadol + antidepresíva po konzíliu a test poistky proti vymysleným údajom.** Toto je príbeh „informácia, ktorá by sa stratila“.

## 3) Čo je SLABÉ alebo falošné (prerobiť alebo zmazať)
1. **AI je dnes hlavne divadlo. Odtiaľ ten pocit „scam“.**
   - Alena má odznak „ručne overené tímom“.
   - Stránky appky vôbec nepoužívajú kód AI (`src/ai`).
   - Odpovede AI v cache napísal Claude Code („náhrada bez Azure kľúča“).
   - Výsledok 20/20 vyjde aj bez AI, robia ho samotné pravidlá.
2. **Políčko „Pretiahnite sem epikrízu“ je naoko.** Vlastné súbory prototyp nečíta, sám to aj píše. Buď ho oživiť, alebo zmazať.
3. **100 % na vlastných dátach na hlavnej stránke.** Pravidlá sme ladili na tých istých dvoch pacientoch. IT človek z VZP to rozoberie hneď. Nahradiť to číslom z testu naslepo, aj keby bolo 16/20.
4. **Dokumenty pre českých lekárov sú po slovensky.** Záver pre praktika („pán doktor“) aj slovenské prerozprávanie v českej šablóne MDT. VZP to nemôže nasadiť a zadanie hovorí „přebírejte bez domýšlení“.
5. **Pitch sľubuje, čo appka nerobí.** „Ostrý Azure“, „žiadosti na 5 pracovísk“, „sama eskaluje“, „VZP platí“, odkaz na GitHub vracia chybu 404. Kontrola faktov našla 37 problémov.
6. **Veľa vaty.** 3 ilustračné prípady, „Moja bilancia“, 4 karty s číslami a 5 záložiek. Hlavné „wow“ momenty sú zahrabané.

## 4) Čo CHÝBA (zoradené podľa dopadu na porotu)
1. **Živý režim.** Nová správa (vložený text alebo .docx) prejde naživo cez skrytie osobných údajov, pravidlá, AI a overenie citátov. Podklad sa vyplní pred očami poroty. Kód AI na to nepotrebuje server, beží aj v prehliadači.
   - Prečo: kritérium 1, „jak řešení skutečně funguje“.
   - Práca: 3–4 h.
   - Riziko: stredné. Bruno musí hneď vybaviť prístup k Azure (kartička kapitána, v STATUS.md stále ⚪). Pri preťažení API pomôže uložená záloha.
2. **Alena z ozajstného behu programu, nie ručne pripravená.** Odznak sa zmení na „pravidlá + AI, každý citát overený“.
   - Práca: 1–1,5 h. Riziko: nízke až stredné.
3. **Dokumenty, ktoré odchádzajú, v češtine a doslovne.** Podklad MDT, záver pre praktika aj žiadosti.
   - Práca: 1,5–2 h. Riziko: nízke.
4. **Zo zápisu konzília úlohy.** Koordinátorka nahrá zápis MDT a 6 odporúčaní sa samo stane krokmi v Ceste s vlastníkom a termínom: onkológia 4. 11. o 10:30, ECOG, odbery, posúdenie žlčových ciest, výživa, psychoonkológia. Z toho istého zápisu vznikne záver pre praktika.
   - Prečo: slide 11 aj otázka „kto je na ťahu po konzíliu“.
   - Práca: 2 h. Riziko: stredné.
5. **Pacientka a notifikácie.** Napríklad SMS „CT 8. 10., KOC 1, nalačno“, pripomienka deň vopred, potvrdenie od pacientky, upozornenie pri meškaní. Zadanie (slidy 9–10) chce e-mail, SMS, chat aj notifikácie. V kóde je „SMS“ aj „notifik“ 0-krát.
   - Práca: 1,5–2 h. Riziko: nízke, odoslanie bude simulované.
6. **Obrazovka revízneho lekára VZP (pri Novákovi, VZP 111).** Štruktúrovaný súhrn a tlačidlo „Vyžiadať doplnenie“, ktoré spadne koordinátorke do fronty. Je to vlastná rola VZP a dnes sú to len 3 štítky „simulované“.
   - Práca: 1–1,5 h. Riziko: nízke.
7. **Šablóna cesty pre pankreas s poradím krokov.** Napríklad „biopsia až po CT“ a „pred invazívnym výkonom pokyn lekára k antikoagulácii“. Taký kontrolný zoznam by problém s apixabanom zachytil ešte pred biopsiou.
   - Práca: 1,5–2 h.
   - Riziko: stredné. Treba to formulovať ako administratívny kontrolný zoznam, nie ako radu k liečbe.

Spolu je to asi 12–15 hodín práce agentov, takže musia bežať súbežne. Povinné sú body 1–4, ostatné podľa času.

## 5) Jedna „killer“ vec
**Skúška naslepo pred porotou.**
- Iný agent napíše tretieho fiktívneho pacienta a nesmie vidieť náš kód. Ideálne je, keď fiktívnu správu dodá mentor VZP.
- Porotca ju vloží do žiadanky praktika a za približne 30 sekúnd uvidí:
  - čo odišlo do AI (rodné číslo a telefón už ako zástupné značky),
  - 20 polí s citátmi, čo chýba, rozpory a návrhy žiadostí,
  - skóre tohto prvého behu, aj keď nebude 100 %.
- Tento moment treba nahrať aj do videa.

Tým padne námietka „je to vopred nachystané“ a zároveň ukážeme jedinú vec, v ktorej môžeme byť naozaj najlepší na svete. Svetové nástroje (navify, Epic, NHS Cancer 360) fungujú, len keď sú napojené na nemocničné systémy. Žiadny nájdený nástroj neposkladá podklad s overeným pôvodom každého údaju z rozhádzaných PDF, e-mailov a eZpráv, teda z prostredia, aké majú české KOC.

**Dôkazy v súboroch:**
- `/Users/brunoduhar/Library/Application Support/Claude/scratch-workspaces/86c6b80d-e417-498c-a005-1cb65ed96ea6/8ade6142-1851-4655-919e-c6be70635281/scratch-2026-10-16-1cc6b0/rakathon/app/src/pages/In

