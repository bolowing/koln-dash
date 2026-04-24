// Shared data model for the Köln dashboard.
// Exposes window.KD_DEFAULTS, window.useKDState, and window.KD (helpers).

(function() {
  const DEPARTURE = '2026-09-01';

  const DEFAULTS = {
    meta: {
      departure: DEPARTURE,
      travelerName: 'VJ',
      travelerFull: 'Vernon',
      destination: 'Köln',
      program: 'CBS — Cologne Business School',
      duration: 'Full academic year',
    },

    money: {
      totalBudget: 24854,
      sentUSD: 2000,
      fxEurUsd: 1.10,
      lines: [
        { id: 'm-fintiba', label: 'Fintiba blocked account', amountEUR: 11904, status: 'pending', note: 'Monthly €992 × 12 (Bürgschaft)' },
        { id: 'm-tuition', label: 'CBS tuition — Wire 1 of 2', amountEUR: 10150, status: 'sent', note: '€2,000 wired · €8,150 pending' },
        { id: 'm-setup',   label: 'One-time setup (flight, deposit, visa)', amountEUR: 2809, status: 'pending', note: 'Flight + Kaution + Visa fees' },
        { id: 'm-living',  label: 'Monthly living (food, transit, phone)', amountEUR: 600, status: 'recurring', note: 'Est. €600/mo on top of Fintiba' },
      ],
    },

    categories: {
      Documents: { color: '#2f7d5b', bg: '#e7f2ec' },
      Financial: { color: '#8a5a2b', bg: '#f4ead9' },
      Housing:   { color: '#7a4da8', bg: '#efe6f7' },
      Banking:   { color: '#2b5a8a', bg: '#e1ecf7' },
      Travel:    { color: '#a83d5a', bg: '#f7e1e8' },
    },

    lanes: {
      VJ: [
        { id: 't1',  text: 'Share Fintiba details + wire instructions', cat: 'Financial', due: 'May 1', urgency: 'soon' },
        { id: 't2',  text: 'Apply for Visa credit card (Indonesian bank)', cat: 'Banking', due: 'Pre-departure', urgency: 'soon' },
        { id: 't3',  text: 'Confirm JIS registrar signature on HS cert', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't4',  text: 'Apostille + translate birth certificate', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't5',  text: 'Apostille + translate HS cert + report', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't6',  text: 'Request BINUS double degree letter', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't7',  text: 'Request final BINUS transcript', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't8',  text: 'Write motivation letter (signed + dated)', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't9',  text: 'Prepare CV (with photo + signature)', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't10', text: 'Get language certificates (CBS + BINUS)', cat: 'Documents', due: 'ASAP', urgency: 'asap' },
        { id: 't11', text: 'Find housing — send Jul links + est. rent', cat: 'Housing', due: 'ASAP', urgency: 'asap' },
        { id: 't12', text: 'Open German current account', cat: 'Banking', due: 'On arrival', urgency: 'later' },
      ],
      Jul: [
        { id: 'j1', text: 'Confirm tuition Wire 1 received by CBS', cat: 'Financial', due: 'May 1', urgency: 'soon' },
        { id: 'j2', text: 'Initiate Merrill 529 Wire 2 (€10,150)', cat: 'Financial', due: 'ASAP', urgency: 'asap' },
        { id: 'j3', text: 'Fund Fintiba blocked account (€11,904)', cat: 'Financial', due: 'After W2', urgency: 'soon' },
        { id: 'j4', text: 'Book Germany trip with Hafiz (move-in)', cat: 'Travel', due: 'TBD', urgency: 'later' },
      ],
    },

    upcoming: [
      { when: 'May 1',  what: 'Confirm Wire 1 received',   cat: 'Financial' },
      { when: 'May',    what: 'Send Wire 2 to CBS',        cat: 'Financial' },
      { when: 'Jun',    what: 'Fund Fintiba account',      cat: 'Financial' },
      { when: 'Jul',    what: 'Docs apostilled + shipped', cat: 'Documents' },
      { when: 'Aug',    what: 'Visa appointment · Berlin', cat: 'Travel' },
      { when: 'Aug',    what: 'Sign housing contract',     cat: 'Housing' },
      { when: 'Sep 1',  what: 'Fly Köln + move-in',        cat: 'Travel' },
    ],

    notes: {},
    checked: {},
  };

  const STORAGE_KEY = 'kd-state-v1';

  function useKDState() {
    const [state, setState] = React.useState(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...DEFAULTS, ...parsed,
            meta:  { ...DEFAULTS.meta,  ...(parsed.meta||{}) },
            money: { ...DEFAULTS.money, ...(parsed.money||{}) },
            lanes: { ...DEFAULTS.lanes, ...(parsed.lanes||{}) },
            checked: parsed.checked || {},
            notes: parsed.notes || {},
          };
        }
      } catch(e) {}
      return DEFAULTS;
    });

    React.useEffect(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
    }, [state]);

    return [state, setState];
  }

  function daysUntil(dateStr) {
    const target = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000*60*60*24));
    return Math.max(0, diff);
  }

  function formatEUR(n) { return '€' + n.toLocaleString('de-DE'); }
  function formatUSD(n) { return '$' + n.toLocaleString('en-US'); }

  function computeProgress(state) {
    const allTasks = [...state.lanes.VJ, ...state.lanes.Jul];
    const done = allTasks.filter(t => state.checked[t.id]).length;
    const total = allTasks.length || 1;
    return { done, total, pct: Math.round((done/total) * 100) };
  }

  function progressByCategory(state) {
    const cats = Object.keys(state.categories || DEFAULTS.categories);
    const out = {};
    const all = [...state.lanes.VJ, ...state.lanes.Jul];
    for (const cat of cats) {
      const inCat = all.filter(t => t.cat === cat);
      const done = inCat.filter(t => state.checked[t.id]).length;
      const next = inCat.find(t => !state.checked[t.id]);
      out[cat] = {
        done, total: inCat.length,
        pct: inCat.length ? Math.round((done/inCat.length)*100) : 0,
        next: next ? next.text : 'All done ✓',
      };
    }
    return out;
  }

  function laneProgress(state, lane) {
    const tasks = state.lanes[lane] || [];
    const done = tasks.filter(t => state.checked[t.id]).length;
    return { done, total: tasks.length };
  }

  function moneyTotals(state) {
    const eurToUsd = state.money.fxEurUsd;
    const totalEUR = state.money.lines.reduce((a, l) => a + (l.amountEUR || 0), 0);
    const sentEUR  = state.money.lines.filter(l => l.status==='sent').reduce((a,l) => a + l.amountEUR, 0);
    return { totalEUR, sentEUR, eurToUsd };
  }

  function useIsMobile(breakpoint = 720) {
    const [isMobile, setIsMobile] = React.useState(() =>
      typeof window !== 'undefined' && window.innerWidth <= breakpoint
    );
    React.useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
      };
    }, [breakpoint]);
    return isMobile;
  }

  window.KD_DEFAULTS = DEFAULTS;
  window.useKDState = useKDState;
  window.useIsMobile = useIsMobile;
  window.KD = {
    daysUntil, formatEUR, formatUSD, computeProgress,
    progressByCategory, laneProgress, moneyTotals,
    STORAGE_KEY,
  };
})();
