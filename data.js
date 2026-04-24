// Shared data model for the Köln dashboard.
// Exposes window.KD_DEFAULTS, window.useKDState, and window.KD (helpers).
//
// State shape (JSDoc, for IDE hints only — no TS build step):
// @typedef {'sent'|'pending'|'recurring'} LineStatus
// @typedef {'asap'|'soon'|'later'} Urgency
// @typedef {{ id:string, text:string, cat:string, due:string, urgency:Urgency }} Task
// @typedef {{ id:string, label:string, amountEUR:number, status:LineStatus, note:string, taskIds:string[] }} MoneyLine
// @typedef {{ id:string, author:string, text:string, at:string }} Comment
// @typedef {{ text:string, comments:Comment[] }} NoteEntry
// @typedef {{ meta:object, money:object, categories:object, lanes:{VJ:Task[],Jul:Task[]}, upcoming:object[], notes:Record<string,NoteEntry>, checked:Record<string,boolean> }} KDState

(function() {
  const DEPARTURE = '2026-09-01';

  // Shared option/color tables. Single source of truth for status + urgency tokens.
  const STATUS_OPTIONS = [
    { key: 'sent',      label: 'Sent',      color: '#2f7d5b' },
    { key: 'pending',   label: 'Pending',   color: '#d98a45' },
    { key: 'recurring', label: 'Recurring', color: '#6b7b8c' },
  ];
  const URGENCY_OPTIONS = [
    { key: 'asap',  label: 'ASAP',  color: '#9a2f3f' },
    { key: 'soon',  label: 'Soon',  color: '#b67417' },
    { key: 'later', label: 'Later', color: '#7a7266' },
  ];
  const STATUS_COLOR  = Object.fromEntries(STATUS_OPTIONS.map(o => [o.key, o.color]));
  const URGENCY_COLOR = Object.fromEntries(URGENCY_OPTIONS.map(o => [o.key, o.color]));

  const PALETTE = {
    paper:    '#f5efe4',
    card:     '#fffaf1',
    drawer:   '#fbf5e9',
    hover:    '#f0e7d4',
    ink:      '#1a120a',
    dimStrong:'#4d3f31',
    dim:      '#7a6a55',
    dimSoft:  '#b0a288',
    accent:   '#c14a1c',
    accentSoft: '#f4e0cb',
    danger:   '#a02a2a',
    success:  '#3f7a3a',
    lineSoft:   'rgba(26,18,10,0.06)',
    line:       'rgba(26,18,10,0.09)',
    lineMid:    'rgba(26,18,10,0.13)',
    lineStrong: 'rgba(26,18,10,0.17)',
    lineDashed: 'rgba(26,18,10,0.20)',
    overlay:       'rgba(26,18,10,0.28)',
    overlayStrong: 'rgba(26,18,10,0.42)',
  };

  const DEFAULTS = {
    meta: {
      departure: DEPARTURE,
      travelerName: 'VJ',
      travelerFull: 'Vernon',
      destination: 'Köln',
      program: 'CBS — Cologne Business School',
      duration: 'Full academic year',
      degrees: [
        'B.Sc. Finance and Management (3+1)',
        'B.Sc. International Business (3+1)',
      ],
      currentUser: 'VJ',
    },

    money: {
      totalBudget: 24854,
      sentUSD: 2000,
      fxEurUsd: 1.10,
      fxEurIdr: 18200,
      monthlyReleaseEUR: 992,
      monthlyCostEUR: 600,
      lines: [
        { id: 'm-fintiba', label: 'Fintiba blocked account', amountEUR: 11904, status: 'pending', note: 'Monthly €992 × 12 (Bürgschaft)', taskIds: [] },
        { id: 'm-tuition', label: 'CBS tuition — Wire 1 of 2', amountEUR: 2000, status: 'sent', note: 'Merrill 529 → CBS', taskIds: [] },
        { id: 'm-tuition2',label: 'CBS tuition — Wire 2 of 2', amountEUR: 8150, status: 'pending', note: 'Remaining tuition balance', taskIds: ['j2'] },
        { id: 'm-setup',   label: 'One-time setup (flight, deposit, visa)', amountEUR: 2809, status: 'pending', note: 'Flight + Kaution + Visa fees', taskIds: [] },
        { id: 'm-living',  label: 'Monthly living (food, transit, phone)', amountEUR: 600, status: 'recurring', note: 'Est. €600/mo on top of Fintiba', taskIds: [] },
      ],
    },

    categories: {
      'Visa docs': { color: '#2f7d5b', bg: '#e7f2ec', emoji: '\u{1F4C4}' },
      Financial:   { color: '#8a5a2b', bg: '#f4ead9', emoji: '\u{1F4B8}' },
      Housing:     { color: '#7a4da8', bg: '#efe6f7', emoji: '\u{1F3E0}' },
      Banking:     { color: '#2b5a8a', bg: '#e1ecf7', emoji: '\u{1F3E6}' },
      Travel:      { color: '#a83d5a', bg: '#f7e1e8', emoji: '✈️' },
    },

    lanes: {
      VJ: [
        { id: 't1',  text: 'Share Fintiba details + wire instructions', cat: 'Financial', due: 'May 1', urgency: 'soon' },
        { id: 't2',  text: 'Apply for Visa credit card (Indonesian bank)', cat: 'Banking', due: 'Pre-departure', urgency: 'soon' },
        { id: 't3',  text: 'Confirm JIS registrar signature on HS cert', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't4',  text: 'Apostille + translate birth certificate', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't5',  text: 'Apostille + translate HS cert + report', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't6',  text: 'Request BINUS double degree letter', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't7',  text: 'Request final BINUS transcript', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't8',  text: 'Write motivation letter (signed + dated)', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't9',  text: 'Prepare CV (with photo + signature)', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
        { id: 't10', text: 'Get language certificates (CBS + BINUS)', cat: 'Visa docs', due: 'ASAP', urgency: 'asap' },
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
      { when: 'Jul',    what: 'Docs apostilled + shipped', cat: 'Visa docs' },
      { when: 'Aug',    what: 'Visa appointment · Berlin', cat: 'Travel' },
      { when: 'Aug',    what: 'Sign housing contract',     cat: 'Housing' },
      { when: 'Sep 1',  what: 'Fly Köln + move-in',        cat: 'Travel' },
    ],

    notes: {},
    checked: {},
    activity: [],
  };

  const STORAGE_KEY = 'kd-state-v1';

  function useKDState() {
    const [state, setState] = React.useState(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Migration: 'Documents' category was renamed to 'Visa docs'. Rewrite
          // the category map and any task.cat references so older saved state
          // keeps working.
          if (parsed.categories && parsed.categories.Documents && !parsed.categories['Visa docs']) {
            parsed.categories = { ...parsed.categories, 'Visa docs': parsed.categories.Documents };
            delete parsed.categories.Documents;
          }
          const renameCat = (t) => t.cat === 'Documents' ? { ...t, cat: 'Visa docs' } : t;
          if (parsed.lanes) {
            parsed.lanes = {
              ...parsed.lanes,
              VJ:  (parsed.lanes.VJ  || []).map(renameCat),
              Jul: (parsed.lanes.Jul || []).map(renameCat),
            };
          }
          if (Array.isArray(parsed.upcoming)) {
            parsed.upcoming = parsed.upcoming.map(u => u.cat === 'Documents' ? { ...u, cat: 'Visa docs' } : u);
          }
          // Deep-merge categories per-key so persisted categories from older
          // state versions still pick up new fields (e.g. emoji).
          const mergedCats = { ...DEFAULTS.categories };
          for (const key of Object.keys(parsed.categories || {})) {
            mergedCats[key] = { ...DEFAULTS.categories[key], ...parsed.categories[key] };
          }
          return { ...DEFAULTS, ...parsed,
            meta:  { ...DEFAULTS.meta,  ...(parsed.meta||{}) },
            money: { ...DEFAULTS.money, ...(parsed.money||{}) },
            lanes: { ...DEFAULTS.lanes, ...(parsed.lanes||{}) },
            categories: mergedCats,
            checked: parsed.checked || {},
            notes: parsed.notes || {},
            activity: Array.isArray(parsed.activity) ? parsed.activity : [],
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
    const remainingEUR = totalEUR - sentEUR;
    return { totalEUR, sentEUR, remainingEUR, eurToUsd };
  }

  function linkedTasks(state, line) {
    const ids = (line && line.taskIds) || [];
    if (!ids.length) return [];
    const all = [
      ...state.lanes.VJ.map(t => ({ ...t, lane: 'VJ' })),
      ...state.lanes.Jul.map(t => ({ ...t, lane: 'Jul' })),
    ];
    return ids.map(id => all.find(t => t.id === id)).filter(Boolean);
  }

  function linkedLines(state, taskId) {
    return state.money.lines.filter(l => (l.taskIds || []).includes(taskId));
  }

  // Splits text into strings and <a> elements for any http(s) URLs it contains.
  // Returns an array suitable for rendering inside a React node.
  const URL_REGEX = /\b(https?:\/\/[^\s<>"')]+)/g;
  function linkify(text) {
    if (!text) return text;
    const parts = [];
    let last = 0;
    let match;
    URL_REGEX.lastIndex = 0;
    while ((match = URL_REGEX.exec(text)) !== null) {
      if (match.index > last) parts.push(text.slice(last, match.index));
      parts.push(React.createElement('a', {
        key: 'u' + match.index,
        href: match[1],
        target: '_blank',
        rel: 'noopener noreferrer',
        style: { color: PALETTE.accent, textDecoration: 'underline' },
        onClick: (e) => e.stopPropagation(),
      }, match[1]));
      last = match.index + match[1].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length ? parts : text;
  }

  // Appends an activity entry; keeps the last 20. Call from setState callbacks.
  function logActivity(s, author, verb, target) {
    const entry = {
      id: 'a' + Date.now() + Math.random().toString(36).slice(2, 6),
      at: new Date().toISOString(),
      author, verb, target,
    };
    const prev = Array.isArray(s.activity) ? s.activity : [];
    return { ...s, activity: [entry, ...prev].slice(0, 20) };
  }

  // Pulls fresh EUR→USD / EUR→IDR from open.er-api.com and merges into state.
  // Returns 'ok' | 'failed' | 'offline' so the caller can render a status label.
  async function refreshExchangeRates(setState) {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/EUR');
      const data = await res.json();
      if (data && data.result === 'success' && data.rates) {
        setState(s => ({
          ...s,
          money: {
            ...s.money,
            fxEurUsd: data.rates.USD || s.money.fxEurUsd,
            fxEurIdr: data.rates.IDR || s.money.fxEurIdr,
            fxUpdatedAt: new Date().toISOString(),
          },
        }));
        return 'ok';
      }
      return 'failed';
    } catch (e) {
      return 'offline';
    }
  }

  window.KD_DEFAULTS = DEFAULTS;
  window.useKDState = useKDState;
  window.KD = {
    daysUntil, formatEUR, formatUSD, computeProgress,
    progressByCategory, laneProgress, moneyTotals,
    linkedTasks, linkedLines,
    refreshExchangeRates, linkify, logActivity,
    statusOptions: STATUS_OPTIONS,
    urgencyOptions: URGENCY_OPTIONS,
    statusColor: STATUS_COLOR,
    urgencyColor: URGENCY_COLOR,
    palette: PALETTE,
    STORAGE_KEY,
  };
})();
