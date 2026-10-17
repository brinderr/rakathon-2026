# Pitch – 3 minúty (VZP: Cesta pacienta bez ztráty informací)

> **Hlavná veta:** „Nič sa nestratí a vždy vieš, kto je na ťahu.“
> Nehovoríme „AI vyťaží dokumenty“. AI je nástroj, sľub je úplnosť a jasný ďalší krok.

Rozdelenie (návrh): **Bruno** hák + demo (postavil UI), **Maťo** čísla, cesta k realite a prosba.
Demo beží z appky (`npm run dev`), záloha = nahrávka obrazovky (VIDEO.md). Časy sú orientačné, nahlas to treba raz odstopovať.

---

## 0:00 – 0:15 · Hák (Bruno)

„Toto je Alena, 63 rokov. Od prvej návštevy u praktika po konzílium uplynulo **50 dní** a jej príbeh je
v **13 správach zo 7 miest** – praktik, kardiológ, laboratórium, röntgen, poliklinika a **dve rôzne onkologické centrá**.
Koordinátorka v KOC to dnes skladá ručne z e-mailov a telefonátov. A v tých správach sú diery a rozpory,
ktoré by konzílium zdržali.“

*(Na plátne: fronta prípadov, Alena navrchu.)*

## 0:15 – 1:45 · Živé demo v 8 krokoch (Bruno klikne, povie jednu vetu)

| # | Klik v appke | Jedna veta |
|---|---|---|
| 1 | **Fronta** („Čaká na mňa / Čaká na iných / Konzílium tento týždeň“) | „Ráno koordinátorka vidí všetky prípady a pri každom, **kto je na ťahu a do kedy** – žiadne skóre, len termíny.“ |
| 2 | **Prijaté → žiadanka praktika (správa 07)** | „Žiadanka od praktika príde e-mailom, prípad sa založí sám a praktikovi hneď odíde **potvrdenie prijatia so zoznamom, čo chýba**.“ |
| 3 | **Prípad → Čo treba vyriešiť** (vyžiadať správy 01–06) | „Žiadanka výsledky neobsahuje, len píše, kde sú – appka pripraví **žiadosti na 5 pracovísk** so správnym adresátom.“ |
| 4 | **Semafor podkladu** (žlté a červené polia) | „Pravidlá a AI z 13 správ vyplnia 20 polí šablóny VZP a ukážu **diery: chýba ECOG, nemožný dátum apixabanu, histológia vydaná deň pred odberom, chýba e-mail** – nič nedomýšľa.“ |
| 5 | **Klik na hodnotu → zvýraznená veta v pôvodnej správe** | „Každý údaj má **doslovný citát**; program overí, že tá veta v správe naozaj je – inak sa údaj nezobrazí ako fakt.“ |
| 6 | **Cesta pacientky** (vyžiadané ≠ objednané ≠ vykonané) | „Histológia mala prísť do 3 pracovných dní, prišla neskôr – appka to **sama eskaluje**, nikto to nemusí strážiť v hlave.“ |
| 7 | **Prepínač „stav k 21. 10.“** | „Podklad obsahuje len to, čo bolo známe v deň konzília: **váha 65 kg z 15. 9.**, nie 63 kg zo správy, ktorá vznikla až po ňom.“ |
| 8 | **Podklad pre konzílium → Záver praktikovi → doručené** | „Lekár KOC podklad potvrdí, praktik dostane záver tam, kde ho číta, a v zázname o koordinovaní je každý krok – **slučka je uzavretá**.“ |

*(Ak demo zlyhá: pustiť VIDEO.md od záberu 3 a pokračovať slovami.)*

## 1:45 – 2:30 · Čísla a cesta k realite (Maťo)

**Čísla (z `npm run eval`, súbor `app/public/data/eval-alena.json`):**

„Postavili sme si **kontrolnú sadu**: ručne overenú správnu odpoveď pre všetkých 20 polí a **17 pascí**, ktoré sú v Aleniných správach.
Výsledok: **20 z 20 polí správne, 17 zo 17 pascí zachytených, 0 vymyslených hodnôt** a 72 citátov – všetky doslova v správach.
Aby to nebolo ušité na jednu pacientku, máme **druhého fiktívneho pacienta** s rakovinou pľúc a štyrmi novými pascami: nádor raz vpravo a raz vľavo, alergia na kontrast stratená v žiadanke, cudzie rodné číslo v laboratóriu a výsledok, ktorý mal prísť a neprišiel. Aj tam **20 z 20 a 0 vymyslených**.“

*(Poctivo, ak sa spýtajú: pravidlá sme po prvom behu na druhom pacientovi zovšeobecnili – predtým zachytili 6 z 13 pascí. Preto ďalší pacient pôjde naslepo.)*

**Cesta k realite (3 vety, IDEALNE-RIESENIE §7.3):**
1. „Dnes beriem to, čo koordinátorovi reálne chodí: telefón, e-mail na spoločnú adresu a eZprávu – ministerstvo od septembra predpisuje centrám HPB presne e-mail a telefón koordinátora.“
2. „Pilot je jedno KOC: najprv tri mesiace bez rozhrania, podklad ako PDF do NIS a meranie; až potom rozhranie. Lekár sa nič nové neučí a nedostane žiadny nový účet.“
3. „Keď bude eŽádanka K povinná a spustí sa štátna výmena dokumentov, napojíme sa cez certifikát KOC. V ostrom režime beží AI v EÚ (Azure OpenAI) a rodné čísla ani telefóny k nej neodídu – to náš kód robí už dnes.“

## 2:30 – 3:00 · Prosba (Maťo)

„Koordinátori sú v každom z 15 KOC od januára a VZP za ich výkon platí – ale **štandardný nástroj nemajú**.
Prosíme VZP o jedno: **pilot v jednom KOC na 3 mesiace, 50 až 100 prípadov**. Meriame štyri čísla:
čas do kompletného podkladu, diery nájdené pred konzíliom, odložené konzíliá a minúty koordinátora.

**Nič sa nestratí a vždy vieš, kto je na ťahu.**“

---

## Čo nehovoriť (IDEALNE-RIESENIE §7.3)
„napojené na NIS“, „AI rozhodne“, „GDPR compliant“, „nasadené“, „lieky dokedy“, „VZP uzol“ ako hotová vec, Missouri −30 % ako náš výsledok.
Žiadne skóre naliehavosti, žiadne odporúčanie liečby – nie sme zdravotnícka pomôcka.

## Otázky poroty – pripravené odpovede

| Otázka | Odpoveď (1–2 vety) |
|---|---|
| Čo ak AI halucinuje? | AI len navrhuje. Program overí, že každý citát je doslova v správe a že každé číslo v hodnote je v citáte; inak návrh zahodí a použije vetu priamo zo správy. Na kontrolnej sade 0 vymyslených hodnôt. |
| Ako ste to merali? | Ručne overená správna odpoveď pre 20 polí + pasce, každý dôkaz overený doslova v texte; skript `npm run eval` to prepočíta pri každej zmene. Podstrčený zlý výstup (ECOG 1, 63 kg, vymyslený e-mail) eval chytil celý. |
| Kam idú dáta pacienta? | V ostrom režime Azure OpenAI v EÚ; pred volaním nahradíme rodné číslo, telefóny, e-maily, adresu, dátum narodenia a mená tokenmi ([RČ_1] …). Na hackathone len fiktívne dáta. |
| Je to zdravotnícka pomôcka (MDR)? | Nie: nerobíme diagnózu, skóre naliehavosti ani odporúčanie liečby – zbierame, overujeme úplnosť a strážime termíny. Fronta je zoradená len podľa termínov. |
| Prečo nie portál pre praktika? | Portál = nový účet, heslo a MFA; dobrovoľné kanály v Anglicku roky stáli okolo 52 %. Praktik u nás nič nové nerobí – dostane len potvrdenie prijatia a zoznam, čo chýba. |
| Ako sa napojíte na nemocnicu? | Fáza 0 bez rozhrania (rola-schránka, PDF do NIS), potom rozhranie cez engine nemocnice; výstup modelujeme podľa FHIR (DocumentReference, Provenance s citátom). |
| Funguje to aj na inú diagnózu? | Áno – druhý fiktívny pacient má rakovinu pľúc, inú poisťovňu, žiadanku od špecialistu a iné pasce; 20/20 polí. |
| Čo to stojí a kto platí? | Náš odhad: náklady na AI sú malé oproti minútam koordinátora; VZP už platí výkon koordinátora (250 Kč) – nástroj mu tie minúty šetrí a každý krok dokladá. Presné čísla zmeriame v pilote. |
