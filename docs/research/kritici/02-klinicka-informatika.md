# Kritik 02: klinická informatika (CMIO fakultnej nemocnice)

_17. 10. 2026, hraná rola. Nehodnotím to, čo sa už rieši. ECOG a jeho autora rieši kritik 05._

## Verdikt
Jadro je správne a lepšie než bežné „AI zhrnutie“: pri každom údaji je doslovný citát, rozpor ukáže obe strany a podklad drží stav k dátumu konzília. Naivné je všetko, na čo sa pýta CIO, právnik a VZP: prípad nemá identifikátor pacienta, potvrdenie nemá meno, záver sa „podpíše“ sám pri odoslaní a nikde sa nezapisuje, kto sa na čo pozeral. Do 10:30 sa dá za ~4 h práce agentov ukázať identita, podpis lekára a auditná stopa. Integrace a export FHIR patria na nedeľu.

## Top nálezy

**1. Prípad nemá identitu pacienta.**
- **Problém:** `Case.patient` má len meno, vek a poisťovňu, chýba rodné číslo (RČ) aj dátum narodenia. Kontrola RČ berie za správne to RČ, ktoré je v prípade najčastejšie. Cudzia správa je teda v prípade skôr, než sa preverí.
- **Dôkaz:**
  - kód: `app/src/types.ts`, `app/src/ai/rules.ts:583`;
  - shot 28: N-04 je v prípade Nováka, len prečiarknutá;
  - shot 08: záver nemá RČ, hoci vzor VZP „MDT zaver“ ho má;
  - obe Novákove RČ (660314/1243 aj 1234) nie sú deliteľné 11, takže sú neplatné ([§13 ods. 3 zák. 133/2000](https://www.zakonyprolidi.cz/cs/2000-133));
  - identifikácia je cieľ č. 1 bezpečnostných cieľov MZ ([Věstník 13/2021](https://mzd.gov.cz/?p=126839)).
- **Zmena:**
  - RČ a dátum narodenia do hlavičky, podkladu aj záveru;
  - kontrola deliteľnosti 11;
  - Novák dostane platné RČ 660314/1248 a pasca budú prehodené číslice (1284). Appka tak odlíši „preklep“ od „RČ iného človeka“. Treba pregenerovať pacient2 a gold sadu;
  - na nedeľu krok „Příjem“: správa bez zhody RČ + priezviska + dátumu narodenia pôjde do fronty „Nepřiřazené dokumenty“. RČ samo nestačí, číslo pojištěnca sa od neho niekedy líši ([VZP](https://www.vzp.cz/platci/informace/povinnosti-platcu-metodika/3-2-formulare-pro-pojistence)).
- **Dopad:** vysoký.
- **Práca:** 1 h + 1,5 h (fronta).

**2. Potvrdenie nemá meno ani čas.**
- **Problém:** uloží sa ako `{kind:'confirmed', date, note}` s textom „potvrdila koordinátorka“.
- **Dôkaz:** `caseUtils.ts:189`, `CaseView.tsx:388`, hoci `docs/pitch/SUBMISSION.md:66` sľubuje „Provenance s citací“. Provenance je vo FHIR záznam pôvodu ([HL7](https://hl7.org/fhir/R4/valueset-provenance-agent-type.html)). Rozlišuje *assembler* (algoritmus, nie autor), *verifier* (kto overil) a *legal* (kto právne ručí).
- **Zmena:** pri poli riadok „Sestavil: motor v1 · Ověřila: Bc. L. Dvořáková 19. 10. 09:42 · Zdroj: zpráva 09“.
- **Dopad:** vysoký.
- **Práca:** 0,5–1 h.

**3. Záver sa „podpíše“ pri odoslaní.**
- **Problém:** „Odeslat“ prepne rámik na „Zapečetěno … podepsáno“, ale nikto konkrétny nepodpísal. „Co to znamená pro vás“ je nový klinický text, jeho autorom má byť lekár MDT.
- **Dôkaz:** `GpReport.tsx:253–263, 280`, shot 08. [§55a ods. 4 zák. 372/2011](https://www.zakonyprolidi.cz/cs/2011-372) žiada pri odoslaní inej osobe pečať s razítkom alebo podpis zdravotníka.
- **Zmena:**
  - stav „Ke schválení lékařem MDT“ a tlačidlo „Schválit (MUDr. L. Marková)“ (simulované);
  - až potom sa odomkne „Odeslat“;
  - v dokumente „Schválila … 14:05“, koordinátorka len „odeslala“.
- **Dopad:** vysoký.
- **Práca:** 0,5–1 h.

**4. Chýba auditná stopa.**
- **Problém:** „Záznam o koordinování“ (shot 06) je vopred napísaný príbeh pre výkon 51887. Nezapisuje, kto čo otvoril, potvrdil alebo exportoval.
- **Dôkaz:** `cases.ts` (log). EHDS [čl. 9](https://streamlex.eu/articles/ehds-en-art-9/) dáva pacientovi právo vedieť, kto, kedy a aké údaje videl, aspoň 3 roky dozadu. [Príloha II, bod 3.2](https://www.ringholm.com/ehds/annex-ii.htm) žiada logovanie od systémov.
- **Zmena:** záložka „Auditní stopa“ sa plní zo skutočných klikov (osoba, čas, kategória dát, pôvod). Riadok sa dá zobraziť ako FHIR AuditEvent podľa [IHE BALP](https://profiles.ihe.net/ITI/BALP/index.html). Vznikne priamo z klikov porotcu.
- **Dopad:** vysoký (kritérium 2).
- **Práca:** 1–1,5 h.

**5. Appka neodpovedá na otázku „odkiaľ to v realite príde?“.**
- **Problém:**
  - kanál je len štítok;
  - shot 08 sľubuje „Praktik nepotrebuje žiadny účet“, ale eZpráva funguje len medzi zapojenými pracoviskami s IČP ([pravidlá](https://lekarskyemail.cz/pravidla.pdf); ~4 519 účtov v 6/2025, `docs/integracia/g1-cz-systemy.md`);
  - doručenku prepína časovač (`GpReport.tsx:79`).
- **Zmena (nedeľa):** obrazovka „Integrace“: pri každej z 13 správ zdroj → kanál → čo čítame → stav „prototyp / pilot / národně“. Napríklad:
  - 02: eZpráva s DASTA, čítame bez AI;
  - 09–11: NIS cez HL7 v2;
  - 07: neskôr eŽádanka ([API NCEZ](https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_Popis_API_e%C5%BD%C3%A1danky.pdf)).

  Pod tým identita (kmeňový register cez certifikát nemocnice), prihlásenie (SSO + MFA) a zápis do NIS.
- **Dopad:** vysoký vo finále.
- **Práca:** 1,5–2 h.

**6. „Zkuste to rozbít“ prepisuje zdrojovú správu.**
- **Problém a dôkaz:** `BreakIt.tsx` vyzýva „přepište text“. Podľa [§55a ods. 7](https://www.zakonyprolidi.cz/cs/2011-372) sa oprava robí novým záznamom a pôvodný obsah ostáva čitateľný.
- **Zmena:** premenovať na „Přišla opravená verze zprávy“: uloží sa ako v2 s odkazom na v1 (FHIR `relatesTo: replaces`, [HL7](https://hl7.org/fhir/R4/valueset-document-relationship-type.html)) a pri poli sa ukáže „v1 → v2“.
- **Dopad:** stredný.
- **Práca:** 0,5–1 h.

**7. Veta „datový model kopíruje FHIR“ nemá dôkaz.**
- **Problém:** `SUBMISSION.md:66`, ale appka nič neexportuje.
- **Zmena (nedeľa):** tlačidlo „Export FHIR“ vytvorí balík (Bundle):
  - Composition (7 častí MDT_zapis, schvaľuje lekár);
  - Patient s RČ podľa [CZ Core](https://build.fhir.org/ig/HL7-cz/cz-core/StructureDefinition-cz-patient.html);
  - 13× DocumentReference;
  - Provenance ku každému poľu;
  - AuditEvent.

  Balík prejde HL7 validátorom a ukážeme výsledok. InterSystems a Asseco v porote by tvrdenie bez exportu vyvrátili.
- **Dopad:** vysoký vo finále.
- **Práca:** 2–3 h.

## Nové nápady zo sveta
1. **AI Transparency on FHIR** (HL7, ballot 01/2026, [návod](https://hl7.org/fhir/uv/aitransparency/2026Jan/general_guidance.html)): štítok `AIAST` („ovplyvnila AI“) a Provenance, v ktorom je AI zariadenie a človek ju overuje.
   - *V appke:* pri textoch od AI čip „AI návrh · ověřila L. D.“, v exporte AIAST.
2. **„Kdo nahlížel do mých údajů“** (EHDS čl. 9, systémy od [2029/2031](https://www.ringholm.com/ehds/article-105.htm)).
   - *V appke:* v auditnej stope prepínač „Pohled pacientky“.
3. **Zápis do NIS cez HL7 v2 MDM^T02** ([hl7.eu](https://hl7.eu/refactored/msgMDM_T02.html)).
   - *V appke:* „Uložit do NIS“ ukáže správu s RČ a PDF podkladu. Stav dokumentu TXA-17 ([tabuľka 0271](https://terminology.hl7.org/1.0.0/CodeSystem-v2-0271.json.html)) je pred podpisom `IP` (rozpracovaný) a po podpise `LA` (právne overený). Nemocnica nepotrebuje nový server.
4. **IHE XTB-WD** ([IHE](https://wiki.ihe.net/index.php/Cross-enterprise_Tumor_Board_Workflow_Definition), trial 2014): štandardné úlohy konzília medzi organizáciami, každá s dokumentmi a vlastníkom.
   - *V appke:* kroky Cesty pomenovať podľa neho a pripísať „podle IHE XTB-WD“.
5. **Národné identifikátory CZ Core** (RČ, rezortný identifikátor RID, číslo pojištěnca; [HL7 CZ](https://build.fhir.org/ig/HL7-cz/cz-core/StructureDefinition-cz-patient.html)).
   - *V appke:* v hlavičke „RČ ✓ · RID ověří registr (pilot)“. Ten istý kľúč použije export aj párovanie.

## Čo nerobiť
1. **Neukazovať zelené fajky „napojené na NIS / eZprávu“.** Verejné API dodávateľov NIS sme nenašli (`docs/integracia/A-architektura.md`).
2. **Nestavať v sobotu FHIR server.** Stačí export JSON z prehliadača.
3. **Nerobiť „Potvrdit vše“ ani odoslanie bez lekára.** Človek má sklon slepo odklikať návrh stroja (automation bias), čo je dobre zdokumentované ([Goddard, JAMIA 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3240751)).
