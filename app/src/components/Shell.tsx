// App frame: narrow icon rail on the left, top bar (brand, quick search, coordinator, guided demo), page content,
// disclaimer footer. The GP side (#intake) gets its own sand-coloured frame without the coordinator's rail,
// so it is clear whose screen it is. The guided demo ("Ukážka v 8 krokoch") is a small floating panel.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNav, type Route } from '../nav';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case } from '../types';
import { useSessions } from './session';
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

/** The GP side (#intake) has no coordinator rail; the sand-coloured "Pohľad praktika" bar with the way back is drawn here
 *  (the Intake page itself is only the form and the confirmation). */
const GP_BAR_IN_SHELL = true;

type Section = 'queue' | 'intake' | 'mdt';

function sectionOf(page: Route['page']): Section {
  if (page === 'intake') return 'intake';
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
    <label className="search" aria-label="Vyhľadávanie" ref={wrapRef}>
      <Icon name="search" size={18} />
      <input type="search" placeholder="Hľadať pacienta" autoComplete="off" value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
      {open && q.trim() && (
        <div className="search__menu" role="listbox">
          {hits.length === 0 ? (
            <div className="search__empty">Nikto taký vo fronte nie je.</div>
          ) : hits.map((c, i) => {
            const status = get(c.id).closedAt ? 'closed' : c.status;
            return (
              <button type="button" key={c.id} role="option" aria-selected={i === cursor}
                className={`search__hit ${i === cursor ? 'search__hit--on' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => pick(c)}>
                <Avatar name={`${c.patient.firstName} ${c.patient.lastName}`} size={30} />
                <span className="search__hit-text">
                  <span className="search__hit-name">{c.patient.firstName} {c.patient.lastName}</span>
                  <span className="search__hit-sub">{c.patient.age} r. · {c.diagnosisShort}</span>
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

/** 8 steps of the demo (docs/IDEALNE-RIESENIE.md §7.1); each names the part of the VZP assignment it covers. */
function tourSteps(c: Case): TourStep[] {
  const id = c.id;
  const no = (key: string) => c.fields.findIndex((f) => f.key === key) + 1;
  const mdt = c.mdtDate ?? DEMO_TODAY;
  return [
    { title: 'Fronta: kto je na ťahu', vzp: 'Převzít', route: { page: 'queue' }, asOf: DEMO_TODAY,
      text: 'Poradie len podľa termínov. Pri každom prípade je vidieť, kto je na ťahu a dokedy. Ranný prehľad povie, čo dnes urgovať.' },
    { title: 'Pohľad praktika: kontrola žiadanky', vzp: 'Převzít', route: { page: 'intake' },
      text: 'Kliknite „Vložiť ukážku“. Ešte pred odoslaním praktik vidí, čo v žiadanke chýba. Po odoslaní dostane potvrdenie prijatia.' },
    { title: `Prípad ${c.patient.firstName} ${c.patient.lastName}: úplnosť podkladu`, vzp: 'Vytěžit', route: { page: 'case', caseId: id }, asOf: DEMO_TODAY,
      text: 'Semafor 20 polí podľa šablóny VZP: potvrdené, návrh, chýba, rozpor. Čo chýba, sa označí, nikdy nedomýšľa.' },
    { title: 'Klik na údaj = veta v origináli', vzp: 'Vytěžit', route: { page: 'case', caseId: id, tab: 'podklad' }, asOf: DEMO_TODAY,
      text: `Kliknite na pole ${no('diagnosis')} (diagnóza). Otvorí sa pôvodná správa so zvýraznenou vetou. Každý citát overil program.` },
    { title: 'Rozpor vedľa seba', vzp: 'Koordinovat', route: { page: 'case', caseId: id, tab: 'podklad' }, asOf: DEMO_TODAY,
      text: `Pole ${no('medication')} (lieky): dva dátumy z tej istej správy vedľa seba. Rozhoduje človek, nie appka.` },
    { title: 'Vyžiadať ECOG → odpoveď → zelená', vzp: 'Vyžádat', route: { page: 'case', caseId: id, tab: 'podklad' }, asOf: DEMO_TODAY,
      text: `Pole ${no('performance')} (ECOG) → Vyžiadať → Odoslať → Simulovať odpoveď. Pole zozelenie a záznam o koordinovaní sa doplní.` },
    { title: `Stav k ${fmtDate(mdt)}: deň konzília`, vzp: 'Koordinovat', route: { page: 'case', caseId: id, tab: 'dokumenty' }, asOf: mdt,
      text: 'Posuvník „Stav k dátumu“ ukáže len to, čo bolo v deň konzília známe. Neskoršie správy zošednú.' },
    { title: 'Podklad → záver praktikovi → uzavrieť', vzp: 'Připravit · Uzavřít', route: { page: 'mdt', caseId: id }, asOf: mdt,
      text: 'Podklad podľa šablóny MDT_zapis, potom „Záver pre praktika“ s doručenkou a uzavretie prípadu: dni so zásahom = podklad pre výkon 51887.' },
  ];
}

function Tour({ step, onStep, onClose }: { step: number; onStep: (i: number) => void; onClose: () => void }) {
  const steps = useMemo(() => tourSteps(FULL_CASE), []);
  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <aside className="tour" aria-label="Ukážka v 8 krokoch">
      <div className="tour__head">
        <span className="kicker">Ukážka · krok {step + 1} z {steps.length}</span>
        <button type="button" className="tour__close" onClick={onClose} aria-label="Zavrieť ukážku"><Icon name="x" size={16} /></button>
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
        <span className="tour__vzp" title="Časť zadania VZP, ktorú krok pokrýva">zadanie VZP: <b>{s.vzp}</b></span>
        <span className="tour__btns">
          <Button variant="ghost" size="sm" icon="arrow-left" disabled={step === 0} onClick={() => onStep(step - 1)}>Späť</Button>
          <Button size="sm" iconRight={last ? 'check' : 'arrow-right'} onClick={() => (last ? onClose() : onStep(step + 1))}>{last ? 'Hotovo' : 'Ďalej'}</Button>
        </span>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ Shell */
export default function Shell({ children }: { children: ReactNode }) {
  const { route, go, setAsOf } = useNav();
  const { get } = useSessions();
  const active = sectionOf(route.page);
  const gpMode = route.page === 'intake';
  const [tour, setTour] = useState<number | null>(null);

  /** Case with the nearest upcoming MDT that is not closed (falls back to the full case). */
  const nextMdt = useMemo(() => {
    const upcoming = CASES
      .filter((c) => c.mdtDate && c.mdtDate >= DEMO_TODAY && c.status !== 'closed' && !get(c.id).closedAt)
      .sort((a, b) => a.mdtDate!.localeCompare(b.mdtDate!));
    return upcoming[0] ?? FULL_CASE;
  }, [get]);

  const nav: { id: Section; label: string; sub?: string; icon: IconName; title: string }[] = [
    { id: 'queue', label: 'Prípady', icon: 'cases', title: 'Fronta prípadov' },
    { id: 'intake', label: 'Praktik', icon: 'inbox', title: 'Pohľad praktika: poslať žiadanku do KOC' },
    { id: 'mdt', label: 'Konzílium', sub: fmtDate(nextMdt.mdtDate), icon: 'users',
      title: `Najbližšie konzílium ${fmtDate(nextMdt.mdtDate)} · ${nextMdt.patient.lastName} · otvoriť podklad` },
  ];

  const open = (id: Section) => {
    if (id === 'queue') go({ page: 'queue' });
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

  return (
    <div className={`shell ${gpMode ? 'shell--gp' : ''}`}>
      {!gpMode && (
        <aside className="rail" aria-label="Hlavná navigácia">
          {nav.map((n) => (
            <button key={n.id} type="button" title={n.title} aria-current={active === n.id ? 'page' : undefined}
              className={`rail__btn ${active === n.id ? 'rail__btn--active' : ''}`} onClick={() => open(n.id)}>
              <Icon name={n.icon} size={22} />
              <span>{n.label}</span>
              {n.sub && <span className="rail__sub">{n.sub}</span>}
            </button>
          ))}
        </aside>
      )}

      <div className="shell__main">
        {gpMode ? GP_BAR_IN_SHELL && (
          <header className="topbar topbar--gp">
            <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => go({ page: 'queue' })}>Späť do appky koordinátora</Button>
            <span className="gpbar__who"><Icon name="user" size={16} /> Pohľad praktika · {FULL_CASE.referringGp.name}</span>
            <Pill tone="amber" size="sm">ukážka · bez účtu, takto dnes posiela žiadanku</Pill>
          </header>
        ) : (
          <header className="topbar">
            <button type="button" className="brand" onClick={() => go({ page: 'queue' })} title="Na úvod">
              <span className="brand__mark"><Icon name="link" size={16} /></span>
              <span className="brand__name">Koordinátor</span>
            </button>

            <QuickSearch onOpen={(c) => go({ page: 'case', caseId: c.id })} />

            <div className="topbar__right">
              <Button variant="ghost" size="sm" icon="route" className="topbar__tour" aria-pressed={tour !== null}
                onClick={() => (tour === null ? goStep(0) : setTour(null))}>
                Ukážka v 8 krokoch
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

        <footer className="foot">Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka</footer>
      </div>

      {tour !== null && <Tour step={tour} onStep={goStep} onClose={() => setTour(null)} />}
    </div>
  );
}
