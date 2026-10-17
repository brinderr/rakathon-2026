// Czech wording for the texts the extractor (src/ai/*) writes: field values, notes, findings, conflict explanations.
// The extractor still writes its own sentences in Slovak; this adapter turns them into Czech for the screen.
// It only rewrites the extractor's own words. Quotes from the reports („…“) are never touched – they stay verbatim.
// A text the adapter does not know (e.g. when the extractor is already Czech) passes through unchanged.

type Rule = [RegExp, string];

/** Whole sentences (with captured parts). Order matters: longer, more specific sentences first. */
const SENTENCES: Rule[] = [
  // impossible dates
  [/Materiál má dátum odberu (.+?), ale správa bola vydaná (.+?) a biopsia prebehla (.+?) \(správa (\S+?)\)\. Pravdepodobne preklep – overte s patológiou\./g,
    'Materiál má datum odběru $1, ale zpráva byla vydána $2 a biopsie proběhla $3 (zpráva $4). Pravděpodobně překlep – ověřte s patologií.'],
  [/Materiál má dátum odberu (.+?), ale správa bola vydaná (.+?)\. Pravdepodobne preklep – overte s patológiou\./g,
    'Materiál má datum odběru $1, ale zpráva byla vydána $2. Pravděpodobně překlep – ověřte s patologií.'],
  [/Posledná dávka je zapísaná na (.+?), teda po dátume výkonu (.+?)\. Dátum je nemožný – overte s pracoviskom, kedy bol liek naozaj vysadený\./g,
    'Poslední dávka je zapsána na $1, tedy po datu výkonu $2. Takové datum není možné – ověřte s pracovištěm, kdy byl lék opravdu vysazen.'],
  [/Udalosť z (.+?) je zapísaná v správe vydanej (.+?) – dátum je nemožný\./g,
    'Událost z $1 je zapsána ve zprávě vydané $2 – takové datum není možné.'],
  // side of the finding
  [/Strana nálezu nesedí: správy (.+?) uvádzajú (pravú|ľavú) stranu, správy (.+?) (pravú|ľavú)\./g, 'Strana nálezu nesouhlasí: zprávy $1 uvádějí $2 stranu, zprávy $3 $4.'],
  [/Strana nálezu nesedí: správy (.+?) uvádzajú (pravú|ľavú) stranu, správa (.+?) (pravú|ľavú)\./g, 'Strana nálezu nesouhlasí: zprávy $1 uvádějí $2 stranu, zpráva $3 $4.'],
  [/Strana nálezu nesedí: správa (.+?) uvádza (pravú|ľavú) stranu, správy (.+?) (pravú|ľavú)\./g, 'Strana nálezu nesouhlasí: zpráva $1 uvádí $2 stranu, zprávy $3 $4.'],
  [/Strana nálezu nesedí: správa (.+?) uvádza (pravú|ľavú) stranu, správa (.+?) (pravú|ľavú)\./g, 'Strana nálezu nesouhlasí: zpráva $1 uvádí $2 stranu, zpráva $3 $4.'],
  [/Overiť s pracoviskom – strana rozhoduje o operácii aj ožarovaní\./g, 'Ověřit s pracovištěm – strana rozhoduje o operaci i ozařování.'],
  // birth number
  [/Správa (\S+) \((.+?), (\d{1,2}\. \d{1,2}\. \d{4})\) má iné rodné číslo \((.+?)\) ako ostatné správy \((.+?)\)\. Overiť, či patrí tomuto pacientovi – dovtedy jej údaje nepoužívať ako fakt\./g,
    'Zpráva $1 ($2, $3) má jiné rodné číslo ($4) než ostatní zprávy ($5). Ověřit, zda patří tomuto pacientovi – do té doby její údaje nepoužívat jako fakt.'],
  // announced results
  [/Správa (\S+) \((.+?), (\d{1,2}\. \d{1,2}\. \d{4})\) avizuje doplnenie: (.+?)\. K (.+?) v dokumentácii nie je – vyžiadať pred konzíliom\./g,
    'Zpráva $1 ($2, $3) avizuje doplnění: $4. K $5 v dokumentaci není – vyžádat před konziliem.'],
  // planned control without a report
  [/Správa (\S+) plánuje kontrolu (.+?), ale správa z nej v dokumentácii nie je – možno chýba\./g,
    'Zpráva $1 plánuje kontrolu $2, ale zpráva z ní v dokumentaci není – možná chybí.'],
  // reports after the MDT date
  [/Správy (.+?) vznikli po (.+?) – do podkladu pre konzílium nepatria \(zadanie VZP: len to, čo bolo známe k dátumu konzília\)\./g,
    'Zprávy $1 vznikly po $2 – do podkladu pro konzilium nepatří (zadání VZP: jen to, co bylo známo k datu konzilia).'],
  [/Správa (.+?) vznikla po (.+?) – do podkladu pre konzílium nepatrí \(zadanie VZP: len to, čo bolo známe k dátumu konzília\)\./g,
    'Zpráva $1 vznikla po $2 – do podkladu pro konzilium nepatří (zadání VZP: jen to, co bylo známo k datu konzilia).'],
  // contacts
  [/Chýba e-mail odosielajúceho lekára \(zápis pre konzílium ho vyžaduje\) – telefón je uvedený\./g,
    'Chybí e-mail odesílajícího lékaře (zápis pro konzilium ho vyžaduje) – telefon je uveden.'],
  [/Chýba e-mail pacienta – zápis pre konzílium \(MDT_zapis\) vyžaduje telefón aj e-mail\./g,
    'Chybí e-mail pacienta – zápis pro konzilium (MDT_zapis) vyžaduje telefon i e-mail.'],
  [/Chýba e-mail pacienta aj odosielajúceho lekára\./g, 'Chybí e-mail pacienta i odesílajícího lékaře.'],
  [/E-mail pacienta v dokumentácii chýba \(zápis pre konzílium ho vyžaduje\)\./g, 'E-mail pacienta v dokumentaci chybí (zápis pro konzilium ho vyžaduje).'],
  [/Telefón ani e-mail pacienta nie sú uvedené\./g, 'Telefon ani e-mail pacienta nejsou uvedeny.'],
  [/Kontaktná osoba nie je uvedená\./g, 'Kontaktní osoba není uvedena.'],
  // performance status
  [/Skóre ECOG ani Karnofsky nie je v žiadnej správe\./g, 'Skóre ECOG ani Karnofsky není v žádné zprávě.'],
  [/Správa (\S+) uvádza len slovný popis „(.+?)“ – to nie je skóre\./g, 'Zpráva $1 uvádí jen slovní popis „$2“ – to není skóre.'],
  [/Chýba výkonnostný stav \(ECOG\/Karnofsky\)\./g, 'Chybí stav výkonnosti (ECOG/Karnofsky).'],
  [/Žiadanka neuvádza výkonnostný stav – je v správe (\S+): „(.+?)“\./g, 'Žádanka neuvádí stav výkonnosti – je ve zprávě $1: „$2“.'],
  // referral pre-check
  [/Žiadanka neobsahuje výsledky vyšetrení – uvádza len, kde sú \((\d+) pracovísk\)\. Treba ich vyžiadať\./g,
    'Žádanka neobsahuje výsledky vyšetření – uvádí jen, kde jsou ($1 pracovišť). Je třeba je vyžádat.'],
  [/Žiadanka neobsahuje výsledky vyšetrení – uvádza len, kde sú \(viac pracovísk\)\. Treba ich vyžiadať\./g,
    'Žádanka neobsahuje výsledky vyšetření – uvádí jen, kde jsou (více pracovišť). Je třeba je vyžádat.'],
  [/Pacient užíva liek na riedenie krvi – pred invazívnym výkonom treba postup podľa lekára\./g,
    'Pacient užívá lék na ředění krve – před invazivním výkonem je třeba postup podle lékaře.'],
  [/Súhlas so zdieľaním informácií s blízkou osobou je v žiadanke\./g, 'Souhlas se sdílením informací s blízkou osobou je v žádance.'],
  [/^Vyžiadať: /g, 'Vyžádat: '],
  // allergies
  [/Správa (\S+) \((\d{1,2}\. \d{1,2}\. \d{4})\) uvádza „(.+?)“, ale správa (\S+) z (\d{1,2}\. \d{1,2}\. \d{4}) zaznamenala: (.+?)\. Overiť pred ďalším vyšetrením alebo liečbou – novšia správa alergiu pravdepodobne neprevzala\./g,
    'Zpráva $1 ($2) uvádí „$3“, ale zpráva $4 z $5 zaznamenala: $6. Ověřit před dalším vyšetřením nebo léčbou – novější zpráva alergii pravděpodobně nepřevzala.'],
  [/Staršia správa (\S+) uvádza „(.+?)“ – alergia bola zistená neskôr \((.+?)\)\./g, 'Starší zpráva $1 uvádí „$2“ – alergie byla zjištěna později ($3).'],
  [/Alergická anamnéza nie je uvedená\./g, 'Alergická anamnéza není uvedena.'],
  // weight and height
  [/Novšia hodnota (.+?) vznikla až po (.+?), preto do podkladu nepatrí\./g, 'Novější hodnota $1 vznikla až po $2, proto do podkladu nepatří.'],
  [/Váha ani výška nie sú v správach uvedené\./g, 'Váha ani výška nejsou ve zprávách uvedeny.'],
  [/Výška chýba\./g, 'Výška chybí.'],
  [/(^|\s)Skôr: /g, '$1Dříve: '],
  // identity
  [/Podľa označenia „(.+?)“ v správe\./g, 'Podle označení „$1“ ve zprávě.'],
  [/Vek nie je v správach výslovne uvedený\./g, 'Věk není ve zprávách výslovně uveden.'],
  [/Kód poisťovne nie je uvedený\./g, 'Kód pojišťovny není uveden.'],
  [/Kód poisťovne nie je v číselníku – overiť\./g, 'Kód pojišťovny není v číselníku – ověřit.'],
  [/ – nie VZP, súhrn pre revízneho lekára ide tejto poisťovni\./g, ' – není to VZP, souhrn pro revizního lékaře jde této pojišťovně.'],
  [/Meno nie je uvedené\./g, 'Jméno není uvedeno.'],
  [/Priezvisko nie je uvedené\./g, 'Příjmení není uvedeno.'],
  // anamnesis, labs, exams, histology
  [/Osobná anamnéza nie je uvedená\./g, 'Osobní anamnéza není uvedena.'],
  [/Lieková anamnéza nie je uvedená\./g, 'Léková anamnéza není uvedena.'],
  [/Laboratórne výsledky nie sú k dispozícii\./g, 'Laboratorní výsledky nejsou k dispozici.'],
  [/Uvedené všetky nádorové markery \((.+?)\), nielen zvýšené\./g, 'Uvedeny všechny nádorové markery ($1), nejen zvýšené.'],
  [/Nádorové markery v dokumentácii nie sú\./g, 'Nádorové markery v dokumentaci nejsou.'],
  [/Žiadne vyšetrenia v dokumentácii\./g, 'Žádná vyšetření v dokumentaci.'],
  [/Plné znenie výsledku je v pôvodnej správe \(klik na citát\)\./g, 'Plné znění výsledku je v původní zprávě (klikněte na citát).'],
  [/Histológia zatiaľ nie je k dispozícii\./g, 'Histologie zatím není k dispozici.'],
  [/Chýba avizovaný dodatok \((.+?)\)\./g, 'Chybí avizovaný dodatek ($1).'],
  // free-text fields
  [/Diagnóza nie je v dokumentácii uvedená\./g, 'Diagnóza není v dokumentaci uvedena.'],
  [/Epikríza nie je k dispozícii\./g, 'Epikríza není k dispozici.'],
  [/Otázka pre konzílium nie je v žiadanke uvedená\./g, 'Otázka pro konzilium není v žádance uvedena.'],
  [/Otázka je všeobecná \(dokončiť diagnostiku a určiť postup\) – lekár KOC ju pred konzíliom môže spresniť\./g,
    'Otázka je obecná (dokončit diagnostiku a určit postup) – lékař KOC ji před konziliem může upřesnit.'],
  [/Príznaky nie sú opísané\./g, 'Příznaky nejsou popsány.'],
  [/Žiadne ďalšie informácie ani želania pacienta\./g, 'Žádné další informace ani přání pacienta.'],
  [/Žiadne ďalšie informácie\./g, 'Žádné další informace.'],
  [/Bez overeného citátu – nezobrazovať ako fakt, overiť ručne\./g, 'Bez ověřeného citátu – nezobrazovat jako fakt, ověřit ručně.'],
  [/K tomuto dátumu ešte neprišla správa, z ktorej sa údaj berie\./g, 'K tomuto datu ještě nepřišla zpráva, ze které se údaj bere.'],
];

/** Short phrases inside values and leftover parts of sentences (applied outside quotes only). */
const PHRASES: Rule[] = [
  [/(\d+) rokov\b/g, '$1 let'],
  [/e-mail neuvedený/g, 'e-mail neuveden'],
  [/váha neuvedená/g, 'váha neuvedena'],
  [/výška neuvedená/g, 'výška neuvedena'],
  [/\(podozrenie v žiadanke, /g, '(podezření v žádance, '],
  [/\(v žiadanke, /g, '(v žádance, '],
  [/bez odchýlok/g, 'bez odchylek'],
  [/ · vydané /g, ' · vydáno '],
  [/\bvýsledok\b/g, 'výsledek'],
  [/\(správa (\S+?), /g, '(zpráva $1, '],
  [/\(správa (\S+?)\)/g, '(zpráva $1)'],
  [/pravú(?=[\s.,]|$)/g, 'pravou'],
  [/ľavú(?=[\s.,]|$)/g, 'levou'],
];

/** Splits a text into quoted parts („…“ and "…") and the rest, so phrase rules never touch a quote. */
function outsideQuotes(s: string, f: (part: string) => string): string {
  return s.split(/(„[^“]*“)/).map((part, i) => (i % 2 === 1 ? part : f(part))).join('');
}

/** Czech version of a text written by the extractor. Unknown text is returned unchanged. */
export function cz(text: string | undefined): string {
  if (!text) return '';
  let s = text;
  for (const [re, to] of SENTENCES) s = s.replace(re, to);
  s = outsideQuotes(s, (part) => {
    let p = part;
    for (const [re, to] of PHRASES) p = p.replace(re, to);
    return p;
  });
  return s;
}

/** Words that would show that a Slovak sentence slipped through (used by the self-check in development). */
export const SLOVAK_HINT = /\b(nie je|nie sú|správa|správy|správe|chýba|žiadank\w*|uvádza|overiť|overte|dátum\w*|ktor\w+|alebo|môže|ešte|podľa|ďalš\w*|vyžiadať|preto|teda|rokov|lekár\w*)\b|[äôľĺŕ]/i;

/** True when a text (outside quotes) still contains Slovak words. */
export function looksSlovak(text: string): boolean {
  return SLOVAK_HINT.test(text.replace(/„[^“]*“/g, ''));
}
