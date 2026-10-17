// App frame: narrow icon rail on the left, top bar (brand, quick search, coordinator, guided demo), page content,
// disclaimer footer. The GP side (#intake) gets its own sand-coloured frame without the coordinator's rail,
// so it is clear whose screen it is. The guided demo („Ukázka v 8 krocích“) is a small floating panel. All UI text is Czech.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNav, type Route } from '../nav';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case } from '../types';
import { useSessions } from './session';
import { resetAllCaseSessions, useAllCaseSessions } from './case/caseSession';
import { resetDemoClock } from './case/demoClock';
import { Avatar, Button, CASE_STATUS_LABEL, CASE_STATUS_TONE, Icon, Pill, fmtDate, type IconName } from './ui';
import './Shell.css';

/** The full demo case (Alena, from the VZP assignment). */
const FULL_CASE: Case = CASES.find((c) => c.demo === 'full') ?? CASES[0];

/** Coordinator = the one who signs the documents in the VZP sample („Bc. Lucie Dvořáková – koordinátorka KOC“). */
export const COORDINATOR = {
  name: 'Lucie',
  fullName: 'Bc. Lucie Dvořáková',
  role: `koordinátorka ${FULL_CASE.koc.split(' · ')[0]}`,
};

/** The GP side (#intake) has no coordinator rail; the sand-coloured „Pohled praktika“ bar with the way back is drawn here
 *  (the Intake page itself is only the form and the confirmation). */
const GP_BAR_IN_SHELL = true;

type Section = 'queue' | 'live' | 'intake' | 'mdt';

/** Patients that have reports for the live screen (Zpracování naživo). */
const LIVE_CASES = new Set(['alena', 'novak']);

function sectionOf(page: Route['page']): Section {
  if (page === 'intake') return 'intake';
  if (page === 'live') return 'live';
  if (page === 'mdt' || page === 'gp') return 'mdt';
  return 'queue';
}

/* Accent-insensitive, case-insensitive match: "proch" finds "Procházková". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function QuickSearch({ onOpen }: { onOpen: (c: Case) => void }) {
  const { get } = useSessions();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const wrapRef = useRef<HTMLLabelElement>(null);
  const hits = useMemo(() => {
    const needle = fold(q.trim());
    if (!needle) return [];
    return CASES.filter((c) => fold(`${c.patient.firstName} ${c.patient.lastName} ${c.diagnosisShort} ${c.koc}`).includes(needle)).slice(0, 5);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, []);

  const pick = (c: Case) => { onOpen(c); setQ(''); setOpen(false); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); (e.target as HTMLInputElement).blur(); return; }
    if (!hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((i) => (i + 1) % hits.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((i) => (i - 1 + hits.length) % hits.length); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(hits[Math.min(cursor, hits.length - 1)]); }
  };

  return (
    <label className="search" aria-label="Vyhledávání" ref={wrapRef}>
      <Icon name="search" size={18} />
      <input type="search" placeholder="Hledat pacienta" autoComplete="off" value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
      {open && q.trim() && (
        <div className="search__menu" role="listbox">
          {hits.length === 0 ? (
            <div className="search__empty">Nikdo takový ve frontě není.</div>
          ) : hits.map((c, i) => {
            const status = get(c.id).closedAt ? 'closed' : c.status;
            return (
              <button type="button" key={c.id} role="option" aria-selected={i === cursor}
                className={`search__hit ${i === cursor ? 'search__hit--on' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => pick(c)}>
                <Avatar name={`${c.patient.firstName} ${c.patient.lastName}`} size={30} />
                <span className="search__hit-text">
                  <span className="search__hit-name">{c.patient.firstName} {c.patient.lastName}</span>
                  <span className="search__hit-sub">{c.patient.age} let · {c.diagnosisShort}</span>
                </span>
                <Pill tone={CASE_STATUS_TONE[status]} size="sm">{CASE_STATUS_LABEL[status]}</Pill>
              </button>
            );
          })}
        </div>
      )}
    </label>
  );
}

/* ------------------------------------------------------------ Guided demo */
interface TourStep { title: string; text: string; vzp: string; route: Route; asOf?: string }

/** 8 steps of the demo. Each names the part of the VZP assignment it covers, and its text says only what the app really does
 *  on that screen (button labels are the real ones). Steps 3–5 are the same screen (Zpracování naživo), so its state stays. */
function tourSteps(c: Case): TourStep[] {
  const id = c.id;
  const mdt = c.mdtDate ?? DEMO_TODAY;
  const ecog = c.fields.find((f) => f.key === 'performance')?.label ?? 'Stav výkonnosti (ECOG)';
  return [
    { title: 'Fronta: kdo je na tahu', vzp: 'Převzít', route: { page: 'queue' }, asOf: DEMO_TODAY,
      text: 'Pořadí jen podle termínů, žádné skóre. U každého případu je vidět, kdo je na tahu, dokdy a kolikátý je den od přijetí žádosti. Panel „Dnes“ ukáže, co je na mně.' },
    { title: 'Praktik pošle žádanku: co chybí', vzp: 'Převzít', route: { page: 'intake' },
      text: 'Klikněte „Vložit ukázku (zpráva 07)“. Kontrola hned v prohlížeči ukáže, co v žádance je (s doslovným úryvkem) a co chybí. „Odeslat“ → praktik dostane potvrzení přijetí s číslem případu.' },
    { title: 'Zpracování naživo: zprávy přicházejí', vzp: 'Vytěžit', route: { page: 'live', caseId: id },
      text: 'Na začátku je jen žádanka 07. Klikněte „Přehrát příchod zpráv“: po každé zprávě motor v prohlížeči znovu projde všechny zprávy a pole se plní. Klik na pole ukáže doslovnou větu a „Zobrazit ve zprávě“.' },
    { title: 'Pasti a rozpory', vzp: 'Koordinovat', route: { page: 'live', caseId: id },
      text: 'Panel „Pasti a rozpory“: po zprávě 09 nemožné datum apixabanu (poslední dávka 18. 10., výkon 12. 10.), po zprávě 11 histologie s odběrem 20. 10., vydaná 19. 10. Vždy s citátem, rozhoduje člověk.' },
    { title: 'Zkuste to rozbít', vzp: 'Vytěžit', route: { page: 'live', caseId: id },
      text: 'V panelu „Zkuste to rozbít“ klikněte „Jiné rodné číslo ve zprávě 10“: motor zprávu přečte znovu a přibude rozpor s oběma citáty. Nebo „Upravit“ u kterékoli zprávy → „Přepočítat“. „Vrátit původní zprávy“ vše vrátí.' },
    { title: 'Chybí ECOG → zápis telefonátu', vzp: 'Vyžádat · Doplnit', route: { page: 'case', caseId: id, tab: 'podklad' }, asOf: DEMO_TODAY,
      text: `ECOG v žádné zprávě není a aplikace si ho nedomyslí. U pole „${ecog}“ klikněte „Zapsat telefonát“ (návrh je předvyplněný) → „Uložit do podkladu“. Pole se doplní se zdrojem „telefonát · zapsala koordinátorka“.` },
    { title: `Stav k ${fmtDate(mdt)} → podklad pro konzilium`, vzp: 'Připravit', route: { page: 'mdt', caseId: id }, asOf: mdt,
      text: `Podklad podle šablony VZP „MDT_zapis“ jen z toho, co bylo známo k ${fmtDate(mdt)}: pozdější zprávy 12 a 13 se nepoužily. ECOG je označen jako záznam koordinátorky, rozpory zůstávají označené. Lékaři KOC jde až po kontrole návrhů. „Tisk / PDF“ nebo „Kopírovat celé“.` },
    { title: 'Závěr pro praktika → doručenka → uzavřít', vzp: 'Předat · Uzavřít', route: { page: 'gp', caseId: id }, asOf: mdt,
      text: 'Závěr podle vzoru VZP „MDT zaver“ s původní otázkou praktika. „Odeslat“ → doručenka (odesláno → doručeno → praktik potvrdil) a souhrn reviznímu lékaři pojišťovny. Pak „Uzavřít případ“ → záznam o koordinování.' },
  ];
}

function Tour({ step, onStep, onClose, onRestart }: { step: number; onStep: (i: number) => void; onClose: () => void; onRestart: () => void }) {
  const steps = useMemo(() => tourSteps(FULL_CASE), []);
  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <aside className="tour" aria-label="Ukázka v 8 krocích">
      <div className="tour__head">
        <span className="kicker">Ukázka · krok {step + 1} z {steps.length}</span>
        <span className="tour__head-r">
          <button type="button" className="tour__restart" onClick={onRestart} title="Zapomene vše, co se v ukázce udělalo, a začne krokem 1">Začít znovu</button>
          <button type="button" className="tour__close" onClick={onClose} aria-label="Zavřít ukázku"><Icon name="x" size={16} /></button>
        </span>
      </div>
      <div className="tour__dots" role="tablist">
        {steps.map((st, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === step} title={st.title}
            className={`tour__dot ${i === step ? 'tour__dot--on' : i < step ? 'tour__dot--done' : ''}`} onClick={() => onStep(i)}>
            {i + 1}
          </button>
        ))}
      </div>
      <h3 className="tour__title">{s.title}</h3>
      <p className="tour__text">{s.text}</p>
      <div className="tour__foot">
        <span className="tour__vzp" title="Část zadání VZP, kterou krok pokrývá">zadání VZP: <b>{s.vzp}</b></span>
        <span className="tour__btns">
          <Button variant="ghost" size="sm" icon="arrow-left" disabled={step === 0} onClick={() => onStep(step - 1)}>Zpět</Button>
          <Button size="sm" iconRight={last ? 'check' : 'arrow-right'} onClick={() => (last ? onClose() : onStep(step + 1))}>{last ? 'Hotovo' : 'Dále'}</Button>
        </span>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ Shell */
export default function Shell({ children }: { children: ReactNode }) {
  const { route, go, setAsOf } = useNav();
  const { get, sessions, resetAll } = useSessions();
  const profiles = useAllCaseSessions();
  const active = sectionOf(route.page);
  const gpMode = route.page === 'intake';
  const [tour, setTour] = useState<number | null>(null);
  /** Something was done in the demo (request, answer, confirmation, closing…) – the next juror would see it. */
  const dirty = Object.keys(sessions).length > 0 || Object.keys(profiles).length > 0;
  /** „Začít znovu“ (QA R5 #6): forget every demo action, the clock and the slider. */
  const restart = () => { resetAll(); resetAllCaseSessions(); resetDemoClock(); setAsOf(DEMO_TODAY); };

  /** Case with the nearest upcoming MDT that is not closed (falls back to the full case). */
  const nextMdt = useMemo(() => {
    const upcoming = CASES
      .filter((c) => c.mdtDate && c.mdtDate >= DEMO_TODAY && c.status !== 'closed' && !get(c.id).closedAt)
      .sort((a, b) => a.mdtDate!.localeCompare(b.mdtDate!));
    return upcoming[0] ?? FULL_CASE;
  }, [get]);

  const nav: { id: Section; label: string; sub?: string; icon: IconName; title: string }[] = [
    { id: 'queue', label: 'Případy', icon: 'cases', title: 'Fronta případů' },
    { id: 'live', label: 'Zpracování', icon: 'activity', title: 'Zpracování naživo: motor čte zprávy přímo v prohlížeči' },
    { id: 'intake', label: 'Praktik', icon: 'inbox', title: 'Pohled praktika: poslat žádanku do KOC' },
    { id: 'mdt', label: 'Konzilium', sub: fmtDate(nextMdt.mdtDate), icon: 'users',
      title: `Nejbližší konzilium ${fmtDate(nextMdt.mdtDate)} · ${nextMdt.patient.lastName} · otevřít podklad` },
  ];

  const open = (id: Section) => {
    const cid = 'caseId' in route ? route.caseId : undefined;
    if (id === 'queue') go({ page: 'queue' });
    else if (id === 'live') go({ page: 'live', caseId: cid && LIVE_CASES.has(cid) ? cid : FULL_CASE.id });
    else if (id === 'intake') go({ page: 'intake' });
    else go({ page: 'mdt', caseId: nextMdt.id });
  };

  const steps = useMemo(() => tourSteps(FULL_CASE), []);
  const goStep = (i: number) => {
    const s = steps[Math.max(0, Math.min(steps.length - 1, i))];
    setTour(i);
    go(s.route);
    if (s.asOf) setAsOf(s.asOf);
  };
  /** The guided demo always starts from a clean state, so every juror sees 19. 10. as it is. */
  const startTour = () => { restart(); goStep(0); };

  return (
    <div className={`shell ${gpMode ? 'shell--gp' : ''}`}>
      {!gpMode && (
        /* rail-col carries the background for the full page height; the rail itself sticks to the viewport.
           On phones (≤ 760 px) the column becomes a bottom bar with icons (see Shell.css). */
        <div className="rail-col">
          <aside className="rail" aria-label="Hlavní navigace">
            {nav.map((n) => (
              <button key={n.id} type="button" title={n.title} aria-current={active === n.id ? 'page' : undefined}
                className={`rail__btn ${active === n.id ? 'rail__btn--active' : ''}`} onClick={() => open(n.id)}>
                <Icon name={n.icon} size={22} />
                <span>{n.label}</span>
                {n.sub && <span className="rail__sub">{n.sub}</span>}
              </button>
            ))}
          </aside>
        </div>
      )}

      <div className="shell__main">
        {gpMode ? GP_BAR_IN_SHELL && (
          <header className="topbar topbar--gp">
            <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => go({ page: 'queue' })} title="Zpět do aplikace koordinátorky">
              <span className="gpbar__back-long">Zpět do aplikace koordinátorky</span>
              <span className="gpbar__back-short">Zpět</span>
            </Button>
            <span className="gpbar__who"><Icon name="user" size={16} /> Pohled praktika · {FULL_CASE.referringGp.name}</span>
            <Pill tone="amber" size="sm">bez účtu · žádanka jde e-mailem nebo eZprávou jako dnes</Pill>
          </header>
        ) : (
          <header className="topbar">
            <button type="button" className="brand" onClick={() => go({ page: 'queue' })} title="Na úvod">
              <span className="brand__mark"><Icon name="link" size={16} /></span>
              <span className="brand__name">Koordinátor</span>
            </button>

            {/* keyed by the screen: a half-typed search does not follow the user to another screen */}
            <QuickSearch key={`${route.page}/${'caseId' in route ? route.caseId : ''}`} onOpen={(c) => go({ page: 'case', caseId: c.id })} />

            <div className="topbar__right">
              {dirty && (
                <button type="button" className="topbar__restart" onClick={() => { restart(); go({ page: 'queue' }); }}
                  title="Zapomene vše, co se v ukázce udělalo (žádosti, potvrzení, uzavření), a vrátí stav k 19. 10." aria-label="Začít ukázku znovu">
                  <Icon name="history" size={16} /><span className="topbar__restart-text">Začít znovu</span>
                </button>
              )}
              <Button variant="ghost" size="sm" icon="route" className="topbar__tour" aria-pressed={tour !== null}
                aria-label="Ukázka v 8 krocích" title="Ukázka v 8 krocích (začne od čistého stavu)"
                onClick={() => (tour === null ? startTour() : setTour(null))}>
                <span className="topbar__tour-text">Ukázka v 8 krocích</span>
              </Button>
              <div className="me" title={COORDINATOR.fullName}>
                <div className="me__text">
                  <div className="me__name">{COORDINATOR.name}</div>
                  <div className="me__role">{COORDINATOR.role}</div>
                </div>
                <Avatar name={COORDINATOR.fullName.replace(/^(Bc|Mgr|Ing|MUDr)\.\s*/, '')} size={38} />
              </div>
            </div>
          </header>
        )}

        <main className="content">{children}</main>

        <footer className="foot">Prototyp · fiktivní data · odesílání je v prototypu simulované · není zdravotnický prostředek</footer>
      </div>

      {tour !== null && <Tour step={tour} onStep={goStep} onClose={() => setTour(null)} onRestart={startTour} />}
    </div>
  );
}
