# Brno a Ostrava/Olomouc: rýchle vyhodnotenie 11 výziev

_Stav: piatok 16. 10. 2026, cca 16:50 (živá tabuľa submit.rakathon.cz/vyzvy bola stiahnutá pri tejto kontrole). Čítané iba na čítanie, nič sa neposielalo, nič sa necommitovalo. Značka **[?]** = neisté. Odborné pojmy sú v zátvorke._

## 0. Hlavný záver v 5 riadkoch

1. **Pražský tím si ani jednu z týchto 11 výziev nemôže reálne zvoliť.** Formulár výberu najprv pýta mesto a ukáže len výzvy toho mesta (pre Prahu 12 výziev), tím musí byť fyzicky v meste výzvy. Výslovný zákaz sme nenašli, ale cesta tam nie je (podrobnosti v §1).
2. Na zásluhách (vážené skóre z 15 kritérií) vychádza hore **TriaLink (7,2)**, **EduAIttractive (7,1)**, **Chytřejší plánování stacionáře (6,7)** a **PillGaze (6,6)**. Dole sú **Když realita (4,3)**, **AI Surgical Copilot (4,6)** a **ProstaPaper (5,1)**.
3. **Pre nás najviac sedí EduAIttractive** (výroba edukačných videí = Brunovo remeslo, fit 10/10), ale je v Brne.
4. Najčistejší 'zákazník + peniaze + jednoduchý produkt' je **plánovanie stacionára** (jasný kupec, malé riziko, 1 tím). V Prahe ekvivalent nie je.
5. Pražské ekvivalenty, ktoré sa na tieto výzvy najviac podobajú: TriaLink = **AI Trial Matching** (4 tímy), MDT FNO = **MDT Copilot**, AI NOR = **VZP Cesta pacienta**, Vzkazy/EduAIttractive (príbeh a video) = **Twincer** (0 tímov).

## 1. Môže tieto výzvy riešiť tím sediaci v Prahe?

**Odpoveď: prakticky NIE.** Čo som overil:

| Zistenie | Zdroj | Istota |
|---|---|---|
| Formulár `submit.rakathon.cz/vyzvy/vybrat` má pole **Mesto (Praha/Brno/Ostrava)** a text 'Nejdřív vyber město.'. Každá výzva má atribút mesta a zoznam sa filtruje v prehliadači. Pre Prahu zoznam obsahuje **12 výziev** (3 VZP + 9 pražských), pre Brno 9 a pre Ostravu 8. Tri VZP výzvy sú v zozname každého mesta. | Priamo som načítal HTML formulára (read-only GET) a živú tabuľu `/vyzvy`. | Overené |
| Či server odmietne výzvu z iného mesta, ak by niekto obišiel zoznam, **neviem** (filtrovanie je v prehliadači). Takto obchádzať formulár by bolo proti zadaniu a nesnažil som sa o to. | Kód stránky (js-filter-list) | [?] |
| **Tím musí byť onsite**: na otázku, či môže byť člen tímu na diaľku, odpovedal Vaňásek 'Oba členové musí být fyzicky na místě' (vlákno v #02-dotazy, 16. 10. popoludní). Brnianski a ostravskí mentori konzultujú len svoje miestne tímy. | Slack #02-dotazy (vlákno), 05 §2.4 a §2.6 | Overené |
| Slack #02-dotazy: **nikto sa nepýtal na zmenu mesta** a organizátori nič výslovne nezakázali ani nepovolili. Súvisiace odpovede: 'riešite vždy jednu výzvu' (Vaňásek) a 'víťazi výziev vrátane VZP zo všetkých miest postupujú do finále' (Studeník). | Slack #02-dotazy (vlákna z 14.-15. 10.) | Overené |
| Praktická stránka: uzávierka výberu je dnes 19:00, hackovanie už beží od 14:00 a nedeľné finále je v Prahe. Presun do Brna/Ostravy a nová registrácia tímu tam sa dnes nedá stihnúť [môj odhad]. | 05 §2.1 | Odhad |

**Ak by ste jednu z nich chceli napriek tomu:** jediná férová cesta je spýtať sa organizátorov (Studeník, Baštař) priamo, ale odpoveď by musela prísť pred 19:00 a tím by musel byť v danom meste. Odporúčam radšej zobrať pražský ekvivalent (stĺpec v tabuľke nižšie). Nič som organizátorom nepísal.

## 2. Tabuľka skóre (1-10, vyššie = lepšie pre nás)

Váhy: Veľkosť 1, Zdravie 1.5, Čas 1, Peniaze 1.2, Bottleneck 1.5, Platba 1.2, Jednoduchosť 1, Dáta 1, Realizovateľnosť 1, Wow 1.2, Partner 1.2, Konkurencia 1, Pokračovanie 0.8, Fit 0.8, Riziko 0.6. Vážené skóre = vážený priemer (1-10). Skóre sú na zásluhách výzvy; **dostupnosť pre Prahu je zvlášť (stĺpec 'Praha?')**. Pri 'Konkurencii' vyššie = menej silných tímov.

| # | Výzva | Mesto | Veľkosť | Zdravie | Čas | Peniaze | Bottleneck | Platba | Jednoduchosť | Dáta | Realizovateľnosť | Wow | Partner | Konkurencia | Pokračovanie | Fit | Riziko | **Vážené** | Praha? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | TriaLink | Brno | 7 | 7 | 8 | 6 | 8 | 6 | 8 | 7 | 9 | 7 | 7 | 7 | 8 | 6 | 7 | **7.19** | NIE |
| 2 | EduAIttractive | Brno | 7 | 5 | 9 | 6 | 8 | 6 | 7 | 7 | 7 | 9 | 7 | 6 | 7 | 10 | 6 | **7.08** | NIE |
| 3 | Chytřejší plánování onkologického stacionáře | Ostrava | 6 | 4 | 8 | 7 | 7 | 6 | 8 | 5 | 8 | 7 | 6 | 8 | 6 | 7 | 9 | **6.66** | NIE |
| 4 | PillGaze | Brno | 7 | 6 | 7 | 5 | 7 | 5 | 7 | 7 | 8 | 9 | 7 | 5 | 6 | 7 | 5 | **6.57** | NIE |
| 5 | AI asistent multidisciplinárního týmu | Ostrava | 7 | 7 | 8 | 6 | 8 | 6 | 6 | 5 | 8 | 7 | 6 | 3 | 6 | 5 | 6 | **6.37** | NIE |
| 6 | AI NOR | Ostrava | 7 | 3 | 8 | 5 | 7 | 5 | 8 | 6 | 9 | 5 | 6 | 7 | 7 | 5 | 8 | **6.22** | NIE |
| 7 | Onkologický AI průvodce | Ostrava | 8 | 5 | 6 | 4 | 6 | 4 | 8 | 6 | 9 | 5 | 6 | 3 | 5 | 5 | 4 | **5.61** | NIE |
| 8 | Vzkazy pro budoucnost | Brno | 3 | 4 | 2 | 2 | 3 | 2 | 9 | 9 | 9 | 9 | 4 | 5 | 4 | 8 | 7 | **5.11** | NIE |
| 9 | ProstaPaper | Brno | 3 | 3 | 5 | 3 | 5 | 3 | 6 | 6 | 5 | 6 | 7 | 8 | 5 | 6 | 7 | **5.05** | NIE |
| 10 | AI Surgical Copilot | Ostrava | 3 | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 3 | 10 | 5 | 3 | 4 | 6 | 3 | **4.59** | NIE |
| 11 | Když realita překoná prognózu | Brno | 3 | 3 | 3 | 2 | 3 | 2 | 6 | 7 | 8 | 4 | 4 | 6 | 4 | 5 | 8 | **4.27** | NIE |

_Poradie je podľa váženého skóre. Skóre sú môj odhad z podkladov, nie meranie; pri číslach vždy kliknite na zdroj v karte nižšie._

### Pražský ekvivalent každej výzvy

| Výzva (Brno/Ostrava) | Najbližšie v Prahe |
|---|---|
| TriaLink | AI Trial Matching (FNMH): rovnaký problém, 4 tímy |
| EduAIttractive | žiadny (najbližšie Twincer, Plíce včas: komunikácia s pacientom) |
| Chytřejší plánování onkologického stacionáře | žiadny (v Prahe nie je výzva na plánovanie kapacít) |
| PillGaze | žiadny presný (najbližšie MEDDI ONCO, Digitální hlídač NÚ: pacientska appka) |
| AI asistent multidisciplinárního týmu | MDT Copilot (Asseco): 1 tím, jasné váhy hodnotenia |
| AI NOR | VZP Cesta pacienta (2 tímy): vyťaženie údajov z dokumentov |
| Onkologický AI průvodce | MEDDI ONCO (1 tím), Digitální hlídač NÚ (2 tímy) |
| Vzkazy pro budoucnost | Twincer (Fuck Cancer): ľudský príbeh, 0 tímov |
| ProstaPaper | žiadny (najbližšie VZP Cesta pacienta: extrakcia do štruktúry) |
| AI Surgical Copilot | žiadny (najbližšie PACS Comparator Check, 1 tím) |
| Když realita překoná prognózu | žiadny (najbližšie VZP Kvalita péče na konci života: analytika, 0 tímov) |

## 3. Karty výziev (v poradí podľa skóre)

### 1. TriaLink (MOÚ Brno) - vážené skóre 7.19

- **Problém:** Nájsť vhodnú klinickú štúdiu pre pacienta trvá lekárovi ~45 minút ručným porovnávaním protokolov; v MOÚ je v intervenčných štúdiách len ~5 % pacientov (Západ 10-15 %). Cieľ: pod 30 sekúnd.
- **Koncový používateľ:** Onkológ / študijná koordinátorka v MOÚ; sekundárne pacient, ktorý si štúdiu hľadá sám.
- **Najlepší nápad na riešenie:** Web s rozhodovacím stromom (diagnóza MKN-10, klinické štádium, biomarkery ako KRAS G12C/HER2/TMB, línia liečby) nad CSV exportom bežiacich štúdií z NIS SONIS; lokálny LLM vyplní parametre z nahranej anonymizovanej správy; tlačidlo vygeneruje referral e-mail študijnej koordinátorke (simulované odoslanie). Overené na 5 kazuistikách.
- **Odvážny ('šialený') nápad:** Pacient nahrá fotku/PDF správy a za 30 sekúnd vidí 'štúdie, ktoré by ťa mohli zaujímať' s vysvetlením po česky, zatiaľ čo odpočítava stopky 45 minút -> 30 sekúnd priamo vo videu.
- **Hlavné riziká:**
  - Zhoda s podmienkami štúdie je rozhodnutie lekára; výstup musí byť 'predvýber', nie odporúčanie liečby
  - Dáta sú cez CESNET odkaz; kazuistiky musia byť anonymné/syntetické; lokálny LLM znamená iný stack ako Azure
  - V Prahe sa to isté rieši výzvou AI Trial Matching (4 tímy) - nápad nie je nový a trh na hackathone je preplnený
  - Pražský tím ju nemôže zvoliť (Brno)
- **Konkurencia:** 1 tím v Brne (Podbranč); pražský ekvivalent AI Trial Matching má 4 tímy
- **Pražský tím?** NIE - výzva je v Brne (tím musí byť fyzicky v Brne). Pražský ekvivalent: AI Trial Matching (FNMH, 4 tímy), rovnaký problém.
- **Zdroje:**
  - Zadanie: docs/materials/slack/trialink/RAKATHON_2026_MOU_Vyzva3_TriaLink_prezentace.pptx (6 slidov, čítané priamo)
  - Dôkazy o trhu: docs/research/07-trendy-a-bottlenecky.md B6 (Unger JNCI 2019; TrialGPT Nat Commun 2024; JAMIA 2026; Triomics)

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 7 | MOÚ ~5 000 nových pacientov ročne, ČR ~60 000 nových malignít ročne; len ~8 % pacientov sa do štúdie dostane (Unger, JNCI 2019 [07 B6]). |
| Zdravie (váha 1.5) | 7 | Prístup k novej liečbe pre pacienta; AI matching nájde viac vhodných pacientov (81,8 % vs 36,4 % ručne, malá štúdia JAMIA 2026 [07 B6]). |
| Čas (váha 1) | 8 | 45 minút -> pod 30 sekúnd je merateľné a zrozumiteľné (TriaLink slide 3). |
| Peniaze (váha 1.2) | 6 | Štúdie hradené sponzorom šetria nemocnici; nábor je pre štúdie problém (57 % predčasných ukončení pre nedostatok pacientov [07 B6]). |
| Bottleneck (váha 1.5) | 8 | Zadávateľ ho meria číslami; trh signalizuje dopyt (Triomics 22 mil. USD séria B, tvrdenie firmy [07]). |
| Platba (váha 1.2) | 6 | Nemocnice a sponzori štúdií; priamu českú platobnú linku som nenašiel [08 §7.3]. |
| Jednoduchosť (váha 1) | 8 | Štyri vstupy a výsledok; lekár aj pacient pochopia za minútu. |
| Dáta (váha 1) | 7 | SONIS export, číselník biomarkerov, TNM, >=10 kazuistík + verejné registre; prístup cez CESNET. |
| Realizovateľnosť (váha 1) | 9 | Filtrovanie + extrakcia LLM + simulovaný e-mail: za noc dobre zvládnuteľné. |
| Wow (váha 1.2) | 7 | Stopky 45 min -> 30 s a pacient s nahratou správou; silný hák, no téma je v Prahe opakovaná. |
| Partner (váha 1.2) | 7 | MOÚ Brno, hodnota 7/10; druhá etapa = celá sieť KOC. |
| Konkurencia (váha 1) | 7 | Len 1 tím v Brne; ale celkovo veľmi zrelá téma. |
| Pokračovanie (váha 0.8) | 8 | Zadanie už počíta s 2. etapou (všetky KOC v ČR). |
| Fit (váha 0.8) | 6 | Bruno: príbeh pacienta a video; Maťo: bez priameho prínosu. |
| Riziko (váha 0.6) | 7 | Lekár rozhoduje; lokálny LLM a anonymné údaje; nízke klinické riziko. |

### 2. EduAIttractive (MOÚ Brno) - vážené skóre 7.08

- **Problém:** Zdravotníci opakujú tie isté informácie mnohým pacientom a internet/AI môže zavádzať; treba z odborných podkladov rýchlo vyrobiť krátke profesionálne edukačné videá, kde zdravotník nekontroluje celé video veta po vete celé hodiny, ale len minúty.
- **Koncový používateľ:** Zdravotník (lekár/sestra) v MOÚ, ktorý schvaľuje obsah; konečný divák je pacient 60+.
- **Najlepší nápad na riešenie:** Pipeline: odborný text/podcast -> veta po vete so zdrojom (odsek alebo časová značka, informácie nad zdroj viditeľne označené) -> scény (text, hlas, obraz) -> schvaľovanie po scénach a vetách -> oprava len dotknutej scény -> automatická kontrola (prepis hlasu vs. schválený text, titulky max 2 riadky, kontrast) -> varianty (kratšie/dlhšie, jednoduchší jazyk, preventívny/paliatívny tón). Výstup: nástroj + aspoň 3 videá; meria sa minúty práce zdravotníka a Kč za minútu videa.
- **Odvážny ('šialený') nápad:** Zdravotník na tablete 'tapne' scénu a povie opravu hlasom; scéna sa za pár sekúnd prerenderuje. Vo videu pitchu je samotný pitch vyrobený rovnakým nástrojom a v rohu bežia stopky 'minúty práce zdravotníka'.
- **Hlavné riziká:**
  - Kvalita generovaného videa/hlasu v češtine a rate limity pri výrobe aspoň 3 videí cez noc
  - Lekárska presnosť: každá veta musí mať zdroj, inak lekár nesúhlasí; treba disciplínu 'nad rámec zdroja = označiť'
  - Natáčanie krátkeho podcastu so zdravotníkmi je na mieste v Brne
  - Pražský tím ju nemôže zvoliť (Brno); TokenPerSecond je silný tím na rovnakej výzve
- **Konkurencia:** 2 tímy v Brne (JOTOZO & Magdalénka, TokenPerSecond)
- **Pražský tím?** NIE - výzva je v Brne (tím musí byť fyzicky v Brne). Pražský ekvivalent: žiadny; najbližšie Twincer (Fuck Cancer, 0 tímov, video/UX) a Plíce včas (komunikácia s pacientom).
- **Zdroje:**
  - Zadanie (Drive, PDF): https://drive.google.com/file/d/1iP2T0Dp2TCyXR2CMM_EKGw-_KyDUdhh2/view
  - Súhrn: docs/research/05-slack-refresh.md §1.11

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 7 | Edukácia sa týka každého pacienta a každého zdravotníka, ktorý opakuje rovnaké vysvetlenia. |
| Zdravie (váha 1.5) | 5 | Zrozumiteľné informácie zlepšujú porozumenie a dodržiavanie liečby; priamy dopad na prežitie nemerateľný, vzdelávanie bolo najúčinnejšie pri účasti na skríningu (OR 1,55 [07 B2]). |
| Čas (váha 1) | 9 | Zadanie výslovne cieli z hodín kontroly na minúty. |
| Peniaze (váha 1.2) | 6 | Zadanie merané v Kč na minútu videa a minútach práce zdravotníka. |
| Bottleneck (váha 1.5) | 8 | Čas zdravotníka je pomenované úzke hrdlo v samotnom zadaní. |
| Platba (váha 1.2) | 6 | Centrum digitálnej medicíny MOÚ + platforma Orbiso sú reálny odberateľ; cena produktu neznáma [?]. |
| Jednoduchosť (váha 1) | 7 | Schvaľuje sa po scénach a vetách; treba to spraviť extrémne jednoducho pre zdravotníka. |
| Dáta (váha 1) | 7 | Videopodcasty, texty a letáky dodané; zdravotníci môžu nahovoriť podcast. |
| Realizovateľnosť (váha 1) | 7 | Skladanie scén, TTS, titulky a kontrola sú zvládnuteľné; náročná je kvalita a čas generovania 3 videí. |
| Wow (váha 1.2) | 9 | Produkt je video: pitch sa dokáže sám a Bruno má štúdio a nástroje. |
| Partner (váha 1.2) | 7 | MOÚ Brno 7/10; Šedo (Centrum digitálnej medicíny) je v nedeľnej porote. |
| Konkurencia (váha 1) | 6 | 2 tímy; hodnotí sa audiovizuálna kvalita, v čom by sme mali výhodu, ale TokenPerSecond je silný. |
| Pokračovanie (váha 0.8) | 7 | Orbiso platforma a opakované používanie MOÚ; priamy pilot je realistický. |
| Fit (váha 0.8) | 10 | Bruno vedie AI video štúdio: toto je presne jeho remeslo. |
| Riziko (váha 0.6) | 6 | Lekárska presnosť obsahu a hlasy/tváre osôb; zdroj ku každej vete to znižuje, nehrá sa s pacientskymi údajmi. |

### 3. Chytřejší plánování onkologického stacionáře (FN Ostrava) - vážené skóre 6.66

- **Problém:** Každý pacient má inú dĺžku aplikácie chemoterapie a kapacita je obmedzená (vzor: 20 kresiel, 6 lôžok, prevádzka 7:00-15:30); plánovanie je manuálne, vznikajú čakania a prestoje.
- **Koncový používateľ:** Staničná/plánovacia sestra a vedenie onkologického stacionára (denný ústavný pobyt).
- **Najlepší nápad na riešenie:** Plánovač: predikcia počtu pacientov, odhad dĺžky aplikácie podľa režimu, optimalizácia rozloženia počas dňa a týždňa (MILP/OR-Tools), semafor obsadenosti kresiel, simulácia 'čo ak' (napr. + 3 pacienti, výpadok sestry) a jednoduchý dashboard. Dáta: anonymizované objednávky za 30 dní a aplikačný rozpis chemoterapie.
- **Odvážny ('šialený') nápad:** Živá animácia dňa na stene stacionára: kreslá sa plnia a uvoľňujú v čase, semafor mení farby a posuvník 'čo keď príde ešte jeden pacient' prepočíta deň za sekundu.
- **Hlavné riziká:**
  - Dáta len za 30 dní a čísla v slide sú ilustračné; model režimov môže byť veľmi hrubý
  - Zadávateľka (Fukasová) je mentorka a podľa Slacku aj porotkyňa [?]; chce reálnu použiteľnosť, nie pekný graf
  - Ostrava je mimo hry pre Prahu a v Prahe na plánovanie výzva nie je
- **Konkurencia:** 1 tím v Ostrave (Pokorní vítězové)
- **Pražský tím?** NIE - výzva je v Ostrave (tím musí byť fyzicky v Ostrave). Pražský ekvivalent: žiadny (nie je žiadna pražská výzva na plánovanie).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1Ew4PFs1yxQ1-x1FyXaDnMXvvWsBJ7f2k/view
  - Precedens 2025 (RadMan, MILP, Cena hackerov): docs/research/01-rakathon-prehlad-a-vitazi.md; docs/research/09-partneri-a-vitazne-vzorce.md §4.1

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 6 | Denný stacionár má každé onkologické centrum; všetci pacienti s chemoterapiou. |
| Zdravie (váha 1.5) | 4 | Menej čakania a stresu pre pacienta; nepriamo včasná liečba. |
| Čas (váha 1) | 8 | Menej čakania pacientov aj prestojov sestier. |
| Peniaze (váha 1.2) | 7 | Lepšie využitie kresiel a menej nadčasov je merateľné v Kč. |
| Bottleneck (váha 1.5) | 7 | Kapacita je reálny problém FNO; slide počíta s ilustračnými číslami. |
| Platba (váha 1.2) | 6 | Nemocnica je kupec; plánovacie nástroje existujú, takže treba odlíšiť. |
| Jednoduchosť (váha 1) | 8 | Denná tabuľa so semaforom je veľmi jednoduchá pre sestru. |
| Dáta (váha 1) | 5 | 30 dní anonymizovaných objednávok a aplikačný rozpis; tenké dáta. |
| Realizovateľnosť (váha 1) | 8 | Optimalizácia + simulácia + dashboard je zvládnuteľné za noc (precedens RadMan 2025). |
| Wow (váha 1.2) | 7 | Animovaný deň a 'čo ak' sú vizuálne dobré, no nie emočné. |
| Partner (váha 1.2) | 6 | FN Ostrava 6/10; zadávateľka je mentorka aj porotkyňa v Slacku. |
| Konkurencia (váha 1) | 8 | Len 1 tím; téma je operačná, menej atraktívna pre tímy s 'AI'. |
| Pokračovanie (váha 0.8) | 6 | FNO je pilotné miesto Zdravotníctva 4.0; reálne nasadenie je možné. |
| Fit (váha 0.8) | 7 | Maťo: optimalizácia/plánovanie je príbuzné RadMan (PET) a rádiologickému prostrediu; Bruno: vizuál. |
| Riziko (váha 0.6) | 9 | Prevádzková optimalizácia bez rozhodnutia o liečbe; nízke riziko. |

### 4. PillGaze (MOÚ Brno) - vážené skóre 6.57

- **Problém:** Zber zoznamu užívaných liekov je pomalý a ručný; pacient nemá zoznam alebo prinesie ručne písané poznámky s chybami, a bežné nástroje na kontrolu interakcií berú len jednotlivé lieky.
- **Koncový používateľ:** Onkologický pacient (často starší) a lekár/sestra pri odbere farmakologickej anamnézy.
- **Najlepší nápad na riešenie:** Mobilná webová appka (PWA): pacient odfotí ručne písaný zoznam aj krabičky, vision-LLM ich prevedie na zoznam so silou a denným rozpisom, zlúči zdroje podľa spoľahlivosti a označí neistoty. Lekár dostane tabuľku (kopírovať do dokumentácie), prenos cez jednorazový 4-miestny PIN s platnosťou ~3 min bez ukladania na server; kontrola interakcií a rozpoznanie onko režimov (skratky) len v lekárskom rozhraní z verejných databáz.
- **Odvážny ('šialený') nápad:** 'Pill detective': pacient len natočí 10-sekundové video, ako vyberá lieky z poličky a krabičky pred kamerou, a AI z toho za pár sekúnd zloží zoznam; lekár ho zoskenuje z obrazovky telefónu.
- **Hlavné riziká:**
  - Kontrola interakcií je klinická podpora rozhodovania (MDR riziko); treba jasne 'len informácia, rozhodne lekár'
  - Presnosť čítania ručného písma a podobných názvov/sôl; chybný liek je horší ako žiadny
  - Slabé verejné databázy interakcií bez licencie / API limity [?]
  - 3 brnianske tímy, atraktívne a vizuálne zadanie; pražský tím ju nemôže zvoliť
- **Konkurencia:** 3 tímy v Brne (Going Bananas, modulBit, bahnaci.cz)
- **Pražský tím?** NIE - výzva je v Brne (tím musí byť fyzicky v Brne). Pražský ekvivalent: žiadny presný; najbližšie MEDDI ONCO a Digitální hlídač NÚ (pacientska appka).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1UvMHWw9AUr2C98xYS2Ost3IKhbhNBedK/view
  - Súhrn: docs/research/05-slack-refresh.md §1.9; kópia docs/materials/slack/refresh-1600/pillgaze_RAKATHON_2026_MOU_Rusinko.docx

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 7 | Zoznam liekov potrebuje každý onkologický pacient pri každom príjme; v MOÚ ~5 000 nových pacientov ročne (TriaLink slide 2). |
| Zdravie (váha 1.5) | 6 | Menej chýb a prehliadnutých interakcií pri chemoterapii; presné čísla o škodách nemám [?]. |
| Čas (váha 1) | 7 | Zadanie výslovne uvádza zdĺhavý ručný zber; presný čas na pacienta nie je uvedený [?]. |
| Peniaze (váha 1.2) | 5 | Úspora času sestry/lekára a menej udalostí; presné čísla chýbajú. |
| Bottleneck (váha 1.5) | 7 | Zadávateľ ho popisuje ako reálnu bolesť (nespoľahlivé údaje, ručné prepisovanie). |
| Platba (váha 1.2) | 5 | Kupec je nemocnica; v ČR nie je úhrada za takúto službu, existujú aj nástroje medication reconciliation [?]. |
| Jednoduchosť (váha 1) | 7 | Odfotiť + PIN je jednoduché; pacienti 70+ nie vždy ovládajú smartfón (Tichopád, 02). |
| Dáta (váha 1) | 7 | Zadávateľ dá vzorové zoznamy aj s chybami, fotky obalov, zoznam nástrojov a onko režimov (CESNET odkaz). |
| Realizovateľnosť (váha 1) | 8 | Vision-LLM + normalizácia + PIN prenos sú zvládnuteľné za noc; interakcie cez verejné DB sú najslabší článok. |
| Wow (váha 1.2) | 9 | Odfotím škatuľky a ručný zoznam, o chvíľu čistá tabuľka a PIN prenos: veľmi dobre sa natáča. |
| Partner (váha 1.2) | 7 | MOÚ Brno, hodnota 7/10 (09 §3.8); Šedo z MOÚ v nedeľnej porote. |
| Konkurencia (váha 1) | 5 | 3 tímy a atraktívne vizuálne zadanie; konkurencia sa bude pretekať v presnosti OCR. |
| Pokračovanie (váha 0.8) | 6 | MOÚ má vlastnú appku MEDDI Onco; napojenie je reálne, ale úhradová cesta nejasná. |
| Fit (váha 0.8) | 7 | Bruno: demo/video ako hlavná zbraň; Maťo: bez priameho prínosu. |
| Riziko (váha 0.6) | 5 | Zdravotné údaje cez fotky (GDPR), interakcie = podpora rozhodovania (MDR); PIN bez ukladania to znižuje. |

### 5. AI asistent multidisciplinárního týmu (FN Ostrava) - vážené skóre 6.37

- **Problém:** Informácie pre onkologické konzílium (MDT) sú v 5 systémoch (NIS, laboratórium, PACS, patológia, genetika) a lekár ich ručne skladá; konzílium má na prípad 2-4 minúty a podklady sú neúplné.
- **Koncový používateľ:** Onkológ / lekár pripravujúci MDT a členovia konzília (chirurg, rádiológ, patológ).
- **Najlepší nápad na riešenie:** Z fiktívnych zdravotných dokumentácií vyrobiť dva výstupy: interaktívnu prezentačnú appku pre MDT (schéma pacienta, súhrn, rozklikávacie údaje, časová os) a report/PDF pre dokumentáciu alebo žiadanku. Každé tvrdenie s odkazom na zdroj, 'v dokumentácii sa nenachádza' namiesto odhadu.
- **Odvážny ('šialený') nápad:** Konzílium na jednej obrazovke: AI pripraví 30-sekundový hlasový briefing pre každého člena podľa jeho odboru a podčiarkne rozpory medzi správami.
- **Hlavné riziká:**
  - Veľmi preplnená téma: rovnaká ako MDT Copilot (Asseco) s explicitným bodovaním; v Ostrave dva tímy
  - Zadávateľ: 'nechceme ďalší systém, kde lekár hľadá' - treba extrémne jednoduchú prezentáciu
  - Dáta: ukážky fiktívnych prípadov + štruktúra protokolu FNO; mock dáta cez InterSystems mentora [?]
  - Pražský tím ju nemôže zvoliť (Ostrava)
- **Konkurencia:** 2 tímy v Ostrave (Codebridge, zombie_apocalypse); Super Team MEMOyA mal hotový základ pre túto tému, ale nie je na tabuli [04, ?]
- **Pražský tím?** NIE - výzva je v Ostrave (tím musí byť fyzicky v Ostrave). Pražský ekvivalent: MDT Copilot (Asseco, 1 tím, výslovné váhy hodnotenia).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1jfyTMIPGVjZd_iDhfDH1KMev9FiPfboN/view
  - Pražský ekvivalent so zadaním a váhami: docs/materials/slack/mdt-copilot/

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 7 | MDT sa týka väčšiny nových solídnych nádorov v centrách (~60 % v ČR 2022 [07 B5]). |
| Zdravie (váha 1.5) | 7 | Lepšie podklady = menej omeškaní a chýb pri rozhodnutí o liečbe; meškanie 4 týždňov = +6-8 % rizika úmrtia pri operácii [07]. |
| Čas (váha 1) | 8 | Hodiny príprav a 3-5 minút na prípad [06 §7]. |
| Peniaze (váha 1.2) | 6 | MDT je platený osobitným výkonom a podmienkou úhrady inovatívnych liekov [07 B5]. |
| Bottleneck (váha 1.5) | 8 | Úspora času zdravotníkov sa opakuje v ~9 výzvách [06 §7]; MDT má 2-4 min na prípad [07]. |
| Platba (váha 1.2) | 6 | Nemocnice/KOC; dodávatelia ako Asseco už cieľ pokrývajú, takže trh existuje aj konkuruje. |
| Jednoduchosť (váha 1) | 6 | Kladie sa dôraz na 'nie ďalší systém'; vizuál musí byť čistý a rýchlo čitateľný. |
| Dáta (váha 1) | 5 | Fiktívne ukážky a štruktúra protokolu; objem a kvalita neistá. |
| Realizovateľnosť (váha 1) | 8 | Extrakcia + RAG + časová os + PDF zvládnuteľné; kvalita citácií rozhoduje. |
| Wow (váha 1.2) | 7 | Časová os a klik na zdroj dobre vyzerajú, ale je to známy typ riešenia. |
| Partner (váha 1.2) | 6 | FN Ostrava, hodnota 6/10; Cvek z FNO v nedeľnej porote. |
| Konkurencia (váha 1) | 3 | Dva tímy a rovnaká téma má silných hráčov v celom hackathone. |
| Pokračovanie (váha 0.8) | 6 | FNO je pilotné miesto ministerského programu Zdravotníctvo 4.0 [09]. |
| Fit (váha 0.8) | 5 | Bruno: prezentácia/UX; Maťo: zobrazovacie dáta v MDT sú čiastočne jeho oblasť. |
| Riziko (váha 0.6) | 6 | Podpora rozhodovania lekára; ľudský dohľad a zdroj pri každom tvrdení riziko znižujú. |

### 6. AI NOR (FN Ostrava, Národný onkologický register) - vážené skóre 6.22

- **Problém:** Údaje o každom novom onkologickom prípade treba ručne preniesť z ambulantných a prepúšťacích správ a histológie do formulára Národného onkologického registra (diagnóza, MKN-10, morfológia, TNM, štádium, liečba, recidíva).
- **Koncový používateľ:** Zdravotný registrátor / lekár vo FN Ostrava, ktorý vypĺňa hlásenie do NOR.
- **Najlepší nápad na riešenie:** LLM extrakcia do pevnej schémy formulára; ku každému poľu uvedie zdrojový odsek dokumentu (zvýraznený), pri chýbajúcom údaji označí 'nenájdené' a zdravotník potvrdí alebo opraví. Meranie podľa zadania: presnosť, úplnosť, správne priradenie, dohľadateľnosť, počet opráv, čas na záznam. FHIR export (InterSystems cena).
- **Odvážny ('šialený') nápad:** 'Registrátor v pozadí': kým lekár píše prepúšťaciu správu, formulár NOR sa vypĺňa v druhom okne a pred odoslaním zostane len jedno tlačidlo 'Potvrdiť' s počtom opráv.
- **Hlavné riziká:**
  - Presnosť extrakcie pri TNM a morfológii (LLM 87,7 % v jednej štúdii na správach rakoviny prsníka [07 B10])
  - Hodnotí sa meraním; potrebujeme referenčné odpovede a poctivú metriku
  - Téma je 'nudná byrokracia'; wow vzniká len z čísiel a zdrojov v obraze
  - Pražský tím ju nemôže zvoliť (Ostrava); Claude-heavy tím pixed.cz je na výzve
- **Konkurencia:** 1 tím v Ostrave (www.pixed.cz, Claude-heavy); predtým 0 tímov
- **Pražský tím?** NIE - výzva je v Ostrave (tím musí byť fyzicky v Ostrave). Pražský ekvivalent: VZP Cesta pacienta (2 tímy; vyťaženie údajov z dokumentov) a cena InterSystems.
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1KygyqRIrCiicGsRlyWrExSLDgHARZcNZ/view
  - Presnosť LLM extrakcie a slovenská paralela NOR: docs/research/07-trendy-a-bottlenecky.md B10; docs/research/08-cesky-kontext-a-trh.md §8

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 7 | Hlásenie do registra je povinné pre každý nový onkologický prípad v každej nemocnici; presný počet ročne som neuvádzal [?]. |
| Zdravie (váha 1.5) | 3 | Nepriamy dopad cez kvalitu dát registra, ktorá riadi plánovanie a politiku. |
| Čas (váha 1) | 8 | Zadanie výslovne meria čas na záznam a počet opráv. |
| Peniaze (váha 1.2) | 5 | Úspora práce registrátorov; presné čísla nemám. |
| Bottleneck (váha 1.5) | 7 | Slovenský register sa dlho spracúval ručne (NOR SR do 2023 [08]); podobný ručný proces je zrejmý aj v ČR. |
| Platba (váha 1.2) | 5 | Nemocnice majú zákonnú povinnosť hlásiť; kto zaplatí za nástroj, nie je jasné. |
| Jednoduchosť (váha 1) | 8 | Dokument dnu, vyplnený formulár so zdrojom von, jedno potvrdenie. |
| Dáta (váha 1) | 6 | Modelové správy, histológia, vzor formulára a číselník MKN-10; objem neznámy. |
| Realizovateľnosť (váha 1) | 9 | Extrakcia do schémy s dohľadateľným zdrojom je presne to, čo Claude zvládne; merateľné. |
| Wow (váha 1.2) | 5 | Byrokratická téma; vizuálne efektné je len zvýraznenie zdroja. |
| Partner (váha 1.2) | 6 | FN Ostrava 6/10; ÚZIS/NOR kontext zvyšuje hodnotu. |
| Konkurencia (váha 1) | 7 | 1 tím, ale Claude-heavy; zadanie je presne merateľné, takže víťazí kvalita. |
| Pokračovanie (váha 0.8) | 7 | Škálovateľné na všetky nemocnice a FHIR; InterSystems cena sa hodí. |
| Fit (váha 0.8) | 5 | Bruno: príbeh o čase; Maťo: bez priameho prínosu. |
| Riziko (váha 0.6) | 8 | Lekár potvrdzuje, žiadne klinické rozhodnutie; nízke riziko. |

### 7. Onkologický AI průvodce (FN Ostrava) - vážené skóre 5.61

- **Problém:** Pacient nepotrebuje viac informácií, ale správne, overené a zrozumiteľné informácie v správny čas; zdravotníci odpovedajú na tie isté otázky dookola.
- **Koncový používateľ:** Onkologický pacient a jeho rodina (často starší); sekundárne sestra na telefóne.
- **Najlepší nápad na riešenie:** Chatbot s RAG nad nemocničnými podkladmi (Modrá kniha, časté otázky, kontakty): odpovedá len zo zdrojov a uvedie ich, pri rizikovej situácii (príznaky) pošle pacienta k zdravotníkovi, vie dotazník EQ-5D a z neho kvalitu života v čase. Nie je lekár, nediagnostikuje, nevymýšľa si.
- **Odvážny ('šialený') nápad:** Hlasový sprievodca pre seniorov (zavolám a opýtam sa), ktorý po rozhovore pošle sestre jednovetové hlásenie s farebnou úrovňou naliehavosti.
- **Hlavné riziká:**
  - Chatbot je najpreplnenejšia téma; ťažko sa odlíšiť
  - Pacientska LLM aplikácia: halucinácie a eskalácia; ESMO ELCAP vyžaduje dohľad a jasnú eskaláciu [07 B7]
  - Silný tím na rovnakej výzve (Holub: skúsený React/AI fullstack, vyhral 2 pitch súťaže [04])
  - Pražský tím ju nemôže zvoliť (Ostrava)
- **Konkurencia:** 2 tímy v Ostrave (Wigym Trio, Holub)
- **Pražský tím?** NIE - výzva je v Ostrave (tím musí byť fyzicky v Ostrave). Pražský ekvivalent: MEDDI ONCO Challenge (1 tím), Digitální hlídač NÚ (2 tímy).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1QlUR289pRB5iDS5mgY1dsA7yq0LhqyOE/view
  - Regulačný rámec chatbotov: docs/research/07-trendy-a-bottlenecky.md B7 (ESMO ELCAP, PRO-TECT)

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 8 | Týka sa všetkých onkologických pacientov nemocnice a ich rodín, 24/7. |
| Zdravie (váha 1.5) | 5 | Lepšie porozumenie a včasné rozpoznanie rizika; dôkaz o prežití nie je (PRO-TECT 2025: HR 0,99 [07 B7]), o kvalite života áno. |
| Čas (váha 1) | 6 | Menej rutinných telefonátov; presný údaj o ušetrených hodinách nie je uvedený [?]. |
| Peniaze (váha 1.2) | 4 | Úspora práce sestier, bez priamej úhrady v ČR (telemedicína väčšinou nehradená [07 B7]). |
| Bottleneck (váha 1.5) | 6 | Zadávateľ ho popisuje, ale informácií je veľa a nie je to akútny kritický bod. |
| Platba (váha 1.2) | 4 | Nemocnica áno, no česká úhrada chýba; cena by musela byť nízka. |
| Jednoduchosť (váha 1) | 8 | Chat je pre pacienta prirodzený; hlas by to ešte zjednodušil. |
| Dáta (váha 1) | 6 | Informačné materiály, odporúčané postupy, EQ-5D, FAQ, kontakty; dáta o pacientoch netreba. |
| Realizovateľnosť (váha 1) | 9 | RAG chatbot je najľahšie zvládnuteľný za noc. |
| Wow (váha 1.2) | 5 | Chatbot je všade; wow vznikne len v ošetrení bezpečnosti a hlasu. |
| Partner (váha 1.2) | 6 | FN Ostrava, hodnota 6/10; Cvek z FNO je v nedeľnej porote. |
| Konkurencia (váha 1) | 3 | Dva tímy, jeden z nich skúsený; téma najpreplnenejšia zo všetkých. |
| Pokračovanie (váha 0.8) | 5 | Pilot možný, ale podobných riešení je veľa. |
| Fit (váha 0.8) | 5 | Bruno: tón a príbeh; Maťo: bez priameho prínosu. |
| Riziko (váha 0.6) | 4 | Pacientsky LLM chatbot v onkológii: zodpovednosť, halucinácie a správna eskalácia sú citlivé (možné MDR). |

### 8. Vzkazy pro budoucnost (FN Olomouc, 'Schránka vzpomínek') - vážené skóre 5.11

- **Problém:** Vážne chorý rodič chce svojim deťom zanechať osobné listy a spomienky, ale chýba mu láskavý, jednoduchý a súkromný nástroj, ktorý beží na telefóne.
- **Koncový používateľ:** Rodič s vážnym ochorením (nie je technik, v ťažkej životnej situácii); neskôr dieťa.
- **Najlepší nápad na riešenie:** Mobilná webová appka: profil fiktívneho dieťaťa, textový list (vytvoriť, uložiť ako koncept, upraviť, dokončiť, nájsť v prehľade), trvalé uloženie (prežije reštart), láskavý tón bez odpočtov. Rozšírenie: hlas s prevodom na text, foto, export. Hlavná hodnota je UX a emócia.
- **Odvážny ('šialený') nápad:** Rodič len rozpráva a AI z hlasu urobí pekne napísaný list v jeho štýle a zachová aj nahrávku; list sa dieťaťu odomkne v dohodnutý deň.
- **Hlavné riziká:**
  - Zadanie je malé a ľahké; všetky tímy ho zvládnu, takže sa rozhoduje len UX a emócia (ťažko sa odlíši)
  - Slabý ekonomický príbeh a žiadny jasný platca; pri kritériu 'využiteľnosť u zadávateľa' ide len o psychosociálnu starostlivosť
  - Citlivá téma: pitch nesmie pôsobiť manipulatívne; reálne dáta (osobné listy) by boli mimoriadne citlivé
  - Pražský tím ju nemôže zvoliť (Brno)
- **Konkurencia:** 1 tím v Brne (Výherní tým); 05 uvádzal 2 (vrátane RationAI) [?]
- **Pražský tím?** NIE - výzva je v Brne (tím musí byť fyzicky v Brne). Pražský ekvivalent: Twincer (Fuck Cancer, ľudský príbeh, 0 tímov).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1slFt7v_NYwUQj7KNbhJVDT2qxkumFlrL/view
  - Podklady a 9 obrazoviek: docs/materials/slack/vzkazy-pro-budoucnost/ (Podklady_canvas.md)

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 3 | Rodičov s vážnou chorobou a malými deťmi je málo; presné číslo v podkladoch nie je [?]. |
| Zdravie (váha 1.5) | 4 | Psychická pohoda a kvalita života, nie prežitie ani včasnosť. |
| Čas (váha 1) | 2 | Nie je o úspore času. |
| Peniaze (váha 1.2) | 2 | Žiadna priama úspora ani príjem. |
| Bottleneck (váha 1.5) | 3 | Skutočná ľudská potreba, ale nie systémový bottleneck, na ktorý by bol 'dopyt teraz'. |
| Platba (váha 1.2) | 2 | Žiadny jasný platca; možno nemocničná psychológia alebo nadácia. |
| Jednoduchosť (váha 1) | 9 | Je jednoduchá z princípu; to je jej hlavná vlastnosť. |
| Dáta (váha 1) | 9 | Dáta netreba, všetko je fiktívne; k dispozícii sú návrhy 9 obrazoviek. |
| Realizovateľnosť (váha 1) | 9 | CRUD appka s trvalým uložením sa za noc dá spraviť čisto. |
| Wow (váha 1.2) | 9 | Veľmi silný emocionálny príbeh, výborne sa rozpráva aj natáča. |
| Partner (váha 1.2) | 4 | FN Olomouc, hodnota 5/10; nemá porotcu v nedeľnej porote. |
| Konkurencia (váha 1) | 5 | Málo tímov, no zadanie je jednoduché a každý ho vylepší; víťazí cit a UX. |
| Pokračovanie (váha 0.8) | 4 | Nemocnica by ju možno zaradila ako psychosociálnu službu; obchodný model chýba. |
| Fit (váha 0.8) | 8 | Bruno: príbeh a vizuál sú jeho silná stránka; Maťo bez prínosu. |
| Riziko (váha 0.6) | 7 | Fiktívne dáta a nízke klinické riziko; citlivé obsahom, nie regulačne. |

### 9. ProstaPaper (MOÚ Brno) - vážené skóre 5.05

- **Problém:** Patológ kreslí rozsah nádoru prostaty na papier a píše nález do NIS; údaje treba previesť do registra COMPARE (REDCap) tak, aby rádiológ a urológ dostali spätnú väzbu.
- **Koncový používateľ:** Patológ a koordinátor registra COMPARE v MOÚ; sekundárne rádiológ a urológ.
- **Najlepší nápad na riešenie:** Nástroj prečíta text histologického nálezu (vlastnosti jednotlivých ložísk podľa slovníka registra), z naskenovanej schémy prostaty určí, v ktorých segmentoch sú ložiská (vision-LLM + kalibrovaná mriežka), a vyrobí CSV importovateľné do REDCap. Lekár potvrdí.
- **Odvážny ('šialený') nápad:** Interaktívny 3D model prostaty, ktorý sa po nahraní skenu schémy 'rozsvieti' v postihnutých segmentoch a porovná sa s MR rádiológa vedľa seba (spätná väzba pre učenie).
- **Hlavné riziká:**
  - Čítanie ručne kreslenej schémy je presnosť-rizikové; veľkosť vzorky schém nie je známa [?]
  - Veľmi úzka nika (jeden register, jedno pracovisko) a slabý príbeh pre 3-min pitch
  - Treba prístup do testovacieho REDCap (zadávateľ ho doručí večer) a dáta cez CESNET odkaz
  - Pražský tím ju nemôže zvoliť (Brno)
- **Konkurencia:** 1 tím v Brne (Patrik Vrbovsky); RationAI (MUNI) sa pôvodne zaujímala [04]
- **Pražský tím?** NIE - výzva je v Brne (tím musí byť fyzicky v Brne). Pražský ekvivalent: žiadny; najbližšie VZP Cesta pacienta (extrakcia do štruktúry).
- **Zdroje:**
  - Zadanie (Drive, pptx 15 MB): https://drive.google.com/file/d/1IE6ETWQ5uwkWKeIoPIYiVB85GViu-Daf/view
  - Súhrn: docs/research/05-slack-refresh.md §1.10

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 3 | Jeden register jednej choroby a pracoviska; prostata je častá, ale ide o spätnú väzbu medzi odbormi. |
| Zdravie (váha 1.5) | 3 | Nepriamy dopad: lepšie učenie a presnejšie dáta v registri. |
| Čas (váha 1) | 5 | Odstráni ručné prepisovanie schém do REDCap; rozsah (koľko nálezov ročne) nie je uvedený [?]. |
| Peniaze (váha 1.2) | 3 | Úspora práce registra; žiadny priamy príjem. |
| Bottleneck (váha 1.5) | 5 | Reálny, ale lokálny proces (papier -> register). |
| Platba (váha 1.2) | 3 | Kupca nevidím mimo samotného MOÚ/registra. |
| Jednoduchosť (váha 1) | 6 | Nahrať sken a text, skontrolovať, exportovať: jednoduché pre používateľa. |
| Dáta (váha 1) | 6 | Vzorka anonymných schém a nálezov + dátový slovník + testovací REDCap; veľkosť vzorky neznáma. |
| Realizovateľnosť (váha 1) | 5 | Presné priradenie ložísk k segmentom zo scanu je najťažšia časť; demo je možné, presnosť neistá. |
| Wow (váha 1.2) | 6 | Sken kresby -> zvýraznená mapa prostaty je pekná vizuálna ukážka, no úzka. |
| Partner (váha 1.2) | 7 | MOÚ Brno, hodnota 7/10; zadávateľ je rádiológ, čo je Maťovi odborne blízke. |
| Konkurencia (váha 1) | 8 | 1 tím; slabá konkurencia, ale aj nízka viditeľnosť výzvy. |
| Pokračovanie (váha 0.8) | 5 | Môže ísť do rutiny registra COMPARE; nie je to široký produkt. |
| Fit (váha 0.8) | 6 | Maťo: zobrazovanie/rádiológia je blízka; Bruno: vizuály sú dobré. |
| Riziko (váha 0.6) | 7 | Anonymné dáta, lekár potvrdzuje; klinické riziko nízke. |

### 10. AI Surgical Copilot (FN Olomouc, robotická chirurgia obličky) - vážené skóre 4.59

- **Problém:** Robotický chirurg vidí pri operácii nádoru obličky len povrch; CT má iba pred operáciou. Treba z CT (DICOM) vytvoriť 3D model obličky, nádoru a ciev a priložiť ho do videa z kamery robota.
- **Koncový používateľ:** Chirurg pri robotickej operácii nádoru obličky (urológ/onkochirurg), sekundárne rádiológ.
- **Najlepší nápad na riešenie:** Úroveň 1: segmentácia obličky/nádoru/ciev z CT (TotalSegmentator, nnU-Net, SAM 2) a 3D model, Dice voči ručnej anotácii. Úroveň 2: model priložený do videa s pomocou človeka (ručné zarovnanie). Úroveň 3 (bonus): automatická registrácia a sledovanie. Dáta: 8 anonymizovaných pacientov (video + CT), potrebné GPU.
- **Odvážny ('šialený') nápad:** 'Röntgenový pohľad': na videu z robota sa cez povrch obličky vo vhodnej priehľadnosti vynorí nádor a cievy, pri pohybe kamery model 'plynie' s tkanivom.
- **Hlavné riziká:**
  - Registrácia pohyblivého orgánu je výskumná úloha; úroveň 3 sa za noc nedá
  - GPU a modely: bez GPU a so 'zdieľanými rate limitmi' je trénovanie nereálne; TotalSegmentator nie je určený pre nádor obličky [?]
  - Výskumný prototyp nie je zdravotnícky prostriedok (MDR); navigácia pri operácii je vysoko riziková oblasť
  - Silná technická konkurencia (Zero Latency, OncoMedViz mali záujem o computer vision)
- **Konkurencia:** 2 tímy v Ostrave (Prestige, Sněženky a Michal); ďalšie tímy s computer vision sa zaujímali
- **Pražský tím?** NIE - výzva je v Ostrave (tím musí byť fyzicky v Ostrave). Pražský ekvivalent: žiadny; zobrazovanie sa najviac približuje PACS Comparator Check (FNMH).
- **Zdroje:**
  - Zadanie (Drive, pptx): https://drive.google.com/file/d/1Xvvsk0ln_h1ANK09xBocCCTuTjBARrX0/view
  - Súhrn: docs/research/05-slack-refresh.md §1.12

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 3 | V ČR 3 224 nových nádorov obličky ročne (NOR/ÚZIS podľa decku), operovaných robotom je podmnožina. |
| Zdravie (váha 1.5) | 5 | Presnejšia lokalizácia môže šetriť tkanivo a skrátiť operáciu; dôkaz pre tento prototyp nemáme. |
| Čas (váha 1) | 4 | Kratšia orientácia v operačnom poli; nie rutinný ušetrený čas. |
| Peniaze (váha 1.2) | 4 | Hodnotu má pre nemocnicu s robotickou chirurgiou, ale nie je zrejmá úspora. |
| Bottleneck (váha 1.5) | 5 | Reálna klinická potreba chirurgov, no nie systémový bottleneck. |
| Platba (váha 1.2) | 4 | Nemocnice kupujú navigáciu, ale cesta úhrady neznáma. |
| Jednoduchosť (váha 1) | 4 | Operačná sála, kamera a DICOM sú komplikované pre používateľa aj pre integráciu. |
| Dáta (váha 1) | 4 | Len 8 pacientov (video + CT) v Dropboxe; GPU a veľké súbory. |
| Realizovateľnosť (váha 1) | 3 | Segmentácia áno, prekrytie s pomocou človeka možno, automatická registrácia nie; veľké riziko, že demo za noc nebude presvedčivé. |
| Wow (váha 1.2) | 10 | 3D model obličky a nádoru nad videom z robota je najvizuálnejšie demo zo všetkých výziev. |
| Partner (váha 1.2) | 5 | FN Olomouc 5/10; nie je v nedeľnej porote. |
| Konkurencia (váha 1) | 3 | Dva tímy a techniky so zameraním na computer vision; vysoká technická poprečka. |
| Pokračovanie (váha 0.8) | 4 | Výskumný prototyp, návrh na ďalšiu spoluprácu skôr než pilot. |
| Fit (váha 0.8) | 6 | Maťo: DICOM/zobrazovanie je jeho oblasť; Bruno: vizuály a video sú silné. |
| Riziko (váha 0.6) | 3 | Chirurgická navigácia je pre MDR vysoké riziko; len výskum, nesmie ísť do klinickej praxe. |

### 11. Když realita překoná prognózu (FN Brno, Klinika dětské onkologie) - vážené skóre 4.27

- **Problém:** Systematicky nájsť deti s onkologickou chorobou, ktorých priebeh (hospitalizácie, komplikácie) sa vymyká očakávaniu podľa diagnózy a veku, vyčísliť mieru prekvapenia a vysvetliť, čo ich odlišuje.
- **Koncový používateľ:** Detský onkológ / klinický výskumník vo FN Brno (nie dátový analytik).
- **Najlepší nápad na riešenie:** Model očakávaného priebehu (napr. gradient boosting s kvantilovou regresiou) -> odchýlka na pacienta; vysvetlenie jednotlivca (SHAP = ukáže, ktoré vlastnosti prispeli) a zhlukovanie samotných outlierov; jednoduchý dashboard so zoznamom od najprekvapivejších, tlačidlá potvrdiť/zamietnuť a export CSV. Dáta: 157 pacientov, 17 864 epizód, 1 624 laboratórnych výsledkov (balík release_fin.zip).
- **Odvážny ('šialený') nápad:** Každý outlier ako 'príbeh na časovej osi': čiara skutočného priebehu sa odlepí od očakávanej a AI jednou vetou povie, prečo je tento pacient iný ako 9 z 10 podobných. Lekár prstom potvrdí alebo zamietne.
- **Hlavné riziká:**
  - Veľmi malá kohorta: 157 pacientov, úmrtie len u 1, štádium známe u 26, liečba v dátach chýba (05 §1.8) - ťažko dokázať niečo silné
  - Pravidlá dát: nenahrávať do verejných repozitárov ani služieb mimo schváleného prostredia, po hackathone zmazať - obmedzuje GitHub/demo/video
  - Hodnotí sa 'kreativita a učenlivosť v práci s dátami' - subjektívne, slabý obchodný ťah
  - Pražský tím ju nemôže zvoliť (Brno)
- **Konkurencia:** 2 tímy v Brne (Brainless, Axolotl); živá tabuľa submit.rakathon.cz/vyzvy
- **Pražský tím?** NIE - výzva je v Brne (formulár ponúka pražskému tímu len 12 pražských výziev, tím musí byť fyzicky v Brne). Pražský ekvivalent: žiadny; najbližšie je VZP Kvalita péče na konci života (analytika, 0 tímov).
- **Zdroje:**
  - Zadanie (Drive, PDF): https://drive.google.com/file/d/1yj4tnTmTNf-vidf5ZgoXoI0Fvs6T8y3n/view
  - Súhrn a overenie dát: docs/research/05-slack-refresh.md §1.8; kópia zadania docs/materials/slack/refresh-1600/kdyz-realita_Vyzva_KDO_Outlier.docx

| Kritérium | Skóre | Prečo |
|---|---|---|
| Veľkosť (váha 1) | 3 | Detská onkológia = malá populácia; dataset len 157 pacientov [05 §1.8]; metóda by sa dala preniesť inam. |
| Zdravie (váha 1.5) | 3 | Nepriamy dopad: nové poznatky o netypických priebehoch; nič, čo hneď mení liečbu konkrétneho dieťaťa. |
| Čas (váha 1) | 3 | Nahradí ručné hľadanie 'zaujímavých' pacientov, ale nie je to opakovaná denná úloha. |
| Peniaze (váha 1.2) | 2 | Výskumný prínos, žiadna priama úspora ani príjem. |
| Bottleneck (váha 1.5) | 3 | Nie je to akútna prevádzková bolesť, ide o výskumnú zvedavosť klinika. |
| Platba (váha 1.2) | 2 | Nie je jasný kupec; skôr akademická spolupráca. |
| Jednoduchosť (váha 1) | 6 | Dashboard so zoznamom outlierov je jednoduchý, ale vysvetlenia (SHAP, zhluky) treba urobiť čitateľné pre lekára bez dátového vzdelania. |
| Dáta (váha 1) | 7 | Hotový čistý balík (3 CSV + datapackage), ale malý a bez liečby/štádia; dni epizód náhodne posunuté o 0-3 dni. |
| Realizovateľnosť (váha 1) | 8 | Tabuľkové dáta, klasický ML + dashboard: za noc sa dá spraviť s Claude Code. |
| Wow (váha 1.2) | 4 | Príbeh detí je silný, ale samotná analýza outlierov je abstraktná a vizuálne nenápadná. |
| Partner (váha 1.2) | 4 | FN Brno detská onkológia (hodnota 4/10 v 09), bez porotcu v nedeľnej porote. |
| Konkurencia (váha 1) | 6 | 2 tímy; subjektívne kritérium tvorivosť dáva šancu aj originálnemu nápadu. |
| Pokračovanie (váha 0.8) | 4 | Možná výskumná spolupráca s klinikou, nie produkt ani pilot. |
| Fit (váha 0.8) | 5 | Bruno: príbeh a vizualizácia; Maťo: radiačná ochrana tu nepomôže. |
| Riziko (váha 0.6) | 8 | Pseudonymizované dáta, žiadne klinické rozhodnutie, ale prísne pravidlá nakladania s dátami. |

## 4. Čo z toho plynie pre pražský výber

- **Vzorec 'úzka prevádzková úloha + presná optimalizácia' vyhral aj minule** (RadMan, plán PET cez MILP, Cena hackerov 2025 [01, 09]). Najbližšia výzva tohto typu je plánovanie stacionáru v Ostrave, v Prahe obdoba nie je.
- **Extrakcia z voľného textu do štruktúry** (AI NOR, ProstaPaper, TriaLink, PillGaze) je podľa expertov otvorená príležitosť [06 §7 bod 2]. V Prahe ju pokrýva VZP Cesta pacienta (krok VYŤAŽIŤ), MDT Copilot a Trial Matching.
- **Video a príbeh** (Bruno): v Prahe je jediná výzva, kde to je hlavná zbraň, Twincer (0 tímov), plus komunikácia s pacientom v Plíce včas. EduAIttractive je v Brne.
- **Radiačná ochrana a zobrazovanie** (Maťo): Surgical Copilot (Ostrava) a ProstaPaper (Brno) sú najbližšie; v Prahe PACS Comparator Check (1 tím) a AZ Plíce včas (nízkodávkové CT).
- **Konkurencia:** aj na týchto výzvach sú silné tímy (Holub na AI průvodce, TokenPerSecond na EduAIttractive, Claude-heavy pixed.cz na AI NOR). Málo tímov neznamená ľahké víťazstvo.

## 5. Neistoty a čo som nevedel overiť

- Či server odmietne výzvu z iného mesta [?].
- Presné počty pacientov/rokov pri PillGaze, AI NOR a Vzkazy: v podkladoch nie sú, preto sú označené [?].
- Presnosť a licencie verejných databáz liekových interakcií (PillGaze) [?].
- Či TotalSegmentator vie segmentovať nádor obličky (Surgical Copilot) [?].
- MEMOyA (ostravský tím s hotovým MDT základom) nie je na živej tabuli výziev [?].
- Počty tímov sa menia aj o pár minút; 5 pražských tímov ešte nevybralo výzvu a 7 tímov z organizátorskej listiny nie je na tabuli.
- Slidy SMART ONCO AA (VFN, Praha) sa nepodarilo prečítať; netýka sa tejto úlohy.

## Zdroje, na ktoré sa odvolávam

- docs/research/05-slack-refresh.md (zadania, odovzdanie, konkurencia), 06-prezentacie-drive.md, 07-trendy-a-bottlenecky.md, 08-cesky-kontext-a-trh.md, 09-partneri-a-vitazne-vzorce.md, 01-rakathon-prehlad-a-vitazi.md
- Slack (iba čítané): #02-dotazy, #01-oznameni; živý formulár a tabuľa: https://submit.rakathon.cz/vyzvy/vybrat, https://submit.rakathon.cz/vyzvy
- Drive priečinok so zadaniami: https://drive.google.com/drive/folders/1tM6p2V4plY4FXScZTXNmPDNgg0PDoJkr
