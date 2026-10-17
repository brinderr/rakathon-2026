# Kritické hodnotenie appky koordinátora KOC
Začaté: 17. 10. 2026, 04:20 · Stav: prebieha

## Východisko
Bruno (04:18): „Myslíš si, že toto je najlepší spôsob a najlepšie riešenie na celom svete na tento daný problém? Príde mi to veľmi zjednodušené… dizajn je šrot, to ešte doriešime. Ale čo sa týka funkcionality, je toto maximum, čo vieme spraviť? Nemusí to byť viac premakané? Čo od nás chcú v zadaní? Nechcú aj praktickejšiu ukážku, ako to vyzerá v praxi? … keď pozriem tú appku teraz, tak scam, moc jednoduché. Zamysli sa kriticky, či je toto tá najlepšia cesta, čo spraviť lepšie, čo vymazať, čo pridať. Či keď to ukážeme, VZP bude z toho v riti.“

Kontext: odovzdanie sobota 17. 10. 13:00 (formulár submit.rakathon.cz), 3-min pitch, titulný obrázok hotový. Appka: app/ (Vite + React), demo https://claude.ai/artifact/5JEhKBgT3g6mhAQ44PrHH4. Vizuál sa rieši neskôr, teraz funkcionalita.

## Rozhodnutia
- **Smer**: zálohovať dnešnú verziu a ísť do živého motora (spracovanie naživo), „Pokazte to sami“, dokumentov doslovne; nech je to viac funkčné, „reálny mozog“ beží lokálne v prehliadači (Bruno nechal na Claudovi, kolo 1)
- **Azure kľúč**: Bruno skúsi zohnať (aka.ms/rakathon2026, kartička kapitána); demo na ňom nestavať (kolo 1)
- **Upratanie**: necháva na Claudovi → vymazať bilanciu v korunách, kartu 20/20 z hlavnej obrazovky, falošnú kontrolu PDF, štítky „simulované“ (jedna poznámka v päte); z hodín cesty ostane „deň X od prijatia žiadosti“ (kolo 1)
- **ECOG**: doplnenie cez zápis telefonátu, ktorý koordinátorka napíše sama (žiadne dáta o telefonáte neexistujú, v deme to vpíše prezentujúci, označené ako vstup koordinátorky); vymyslená správa 14 preč (kolo 1)
- **Jazyk**: VŠETKO česky – appka, dokumenty, video, titulný obrázok (kolo 1, Bruno: „Appka musí byť česky“)
- **Prezentácia**: sobota 14:00 = zadávatelia VZP chodia k stolom (nie javisko) → funkčné demo na notebooku + krátke video ako otvárák; 3 min pitch nie je zverejnený, javisko je až nedeľné finále. Odporúčanie: jedno video do ~2:20 (zlá cesta → čo sa musí stať → platforma na Alene), česky, ElevenLabs hlas, použije sa vo formulári, pri stole aj vo finále; naživo 20–30 s úvod + „pokazte to sami“ pri stole (kolo 1, čaká na potvrdenie)

## Zistené fakty
Celé hodnotenie: docs/kontext/raw-kriticke-hodnotenie.md (5 kritikov + syntéza + tech lead).
- Nie je to scam a obsahovo to nie je jednoduché: všetkých 6 bodov zadania je pokrytých, práca s údajmi (doslovné citáty, pasce, stav k dátumu) je hlbšia než u bežného tímu. Zhoda všetkých 5 kritikov.
- Ale dnes je to „nahraný film s tlačidlami“: Alenu pripravil tím ručne (cases.ts mode 'manual'), okno na súbor v Žiadanke súbor nečíta, Azure AI nebežala ani raz (AI odpovede napísal Claude ako náhradu).
- Motor (src/ai/extract.ts) pobeží priamo v prehliadači bez servera, 5–17 ms na 13 správ; samotné pravidlá dajú Alena 20/20 · 17/17, Novák 20/20 · 13/13, 0 vymyslených – AI k číslu nič nepridáva (tech lead to spustil).
- Zo samotnej žiadanky 07 motor vyplní 15/20 polí; po správach 01–07 18/20; po 09 vyskočí apixaban, po 11 histológia.
- „Pokazte to sami“ – fungujú 4 úpravy: iné RČ v správe 10 → rozpor; oprava dátumu apixabanu → rozpor zmizne; „ECOG 1“ → 20/20; zmazaná správa 11 → histológia prázdna. Nefunguje: zmena strany nádoru u Aleny; zmena nadpisu „Pacientka:“ → 6 polí chýba.
- Zadanie doslova: „nasimulujte ve vaší aplikaci práci koordinátora“; povinné výstupy: funkčné demo celého priechodu, zpráva k MDT dle MDT_zapis, ukážka odoslania záveru PL. Kritérium 1: „Jak dobře řešení skutečně funguje?“; kritérium 2: bezpečnosť, dáta, napojenie. O 14:00 zadávatelia chodia k stolom a budú klikať.
- Slabé / zbytočné: falošná 0,9 s „kontrola“ PDF, odznak „ručne overené tímom“, karta 20/20 na hlavnej obrazovke (pravidlá aj testy písal ten istý tím), bilancia v korunách (pôsobí ako motivácia vykazovať), dánske/holandské lehoty, „Simulovať odpoveď“ s vymyslenou správou 14, 20+ štítkov „simulované“.
- Chýba: proces naživo (príchod správ → plnenie polí → pasce), „Vyžiadať 01–06“ ako akcia, objednanie CT s meniteľným termínom, telefonát ako zdroj údaja, české doslovné dokumenty, slepý test na treťom pacientovi, verejný odkaz na demo a GitHub.
- Nerobiť dnes: šablóna Pankreas, zápis z MDT → úlohy, SMS pacientke, QR kód, obrazovka revízneho lekára, FHIR (to je až na nedeľné finále).
- Azure kľúč: portál aka.ms/rakathon2026, prihlásenie kartičkou kapitána (časové heslo mohlo vypršať).

## Otvorené otázky
- Je funkcionalita dosť silná pre VZP a porotu? Čo pridať, čo vymazať, čo zlepšiť?
- Vizuál a UX: rieši sa po funkcionalite (náčrt / ukážka na reakciu).

## Brief
(doplní sa na konci)
