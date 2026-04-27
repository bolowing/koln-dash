// Variation A — Cozy single-scroll dashboard.
// Warm paper background, rounded cards, editorial typography.

const P = KD.palette;

function VariationA({ onReset }) {
  const [state, setState] = useKDState();
  const [openTask, setOpenTask] = React.useState(null);
  const [openLineId, setOpenLineId] = React.useState(null);
  const [showAddLine, setShowAddLine] = React.useState(false);
  const [tab, setTab] = React.useState('all');
  const [catFilter, setCatFilter] = React.useState(null);
  const [collapsedGroups, setCollapsedGroups] = React.useState({});
  const toggleGroup = (key, currentlyCollapsed) =>
    setCollapsedGroups(s => ({ ...s, [key]: !currentlyCollapsed }));

  const progress = KD.computeProgress(state);
  const byCat    = KD.progressByCategory(state);
  const totals   = KD.moneyTotals(state);
  const days     = KD.daysUntil(state.meta.departure);
  const cats     = state.categories || KD_DEFAULTS.categories;

  const toggleCheck = (id) => setState(s => {
    const willBeChecked = !s.checked[id];
    let next = { ...s, checked: { ...s.checked, [id]: willBeChecked } };
    if (!willBeChecked) return next;
    // Auto-unpin when a task is completed.
    next = KD.unpin(next, id);
    const task = [...s.lanes.VJ, ...s.lanes.Jul].find(t => t.id === id);
    if (!task) return next;
    return KD.logActivity(next, s.meta.currentUser || 'VJ', 'completed', task.text);
  });

  const togglePin = (id) => setState(s => KD.togglePin(s, id));

  const setCurrentUser = (u) =>
    setState(s => ({ ...s, meta: { ...s.meta, currentUser: u } }));

  const openTaskById = (taskId, lane) => {
    const t = state.lanes[lane]?.find(x => x.id === taskId);
    if (t) { setOpenLineId(null); setOpenTask({ task: t, lane }); }
  };

  const monthlyGap = Math.round(
    ((state.money.monthlyReleaseEUR || 0) - (state.money.monthlyCostEUR || 0))
    * (state.money.fxEurUsd || 1)
  );

  const targetDate = new Date(state.meta.departure + 'T00:00:00')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="v1-root" style={{
      fontFamily: "'Figtree', -apple-system, 'Segoe UI', sans-serif",
      background: P.paper,
      color: P.ink,
      minHeight: '100%',
      padding: '36px 40px 60px',
      position: 'relative',
      fontFeatureSettings: "'ss01', 'cv11'",
    }}>
      <style>{`
        .va-sans { font-family: 'Figtree', -apple-system, 'Segoe UI', sans-serif; }
        .va-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .v1-display,
        .v1-h1,
        .v1-section-h2,
        .v1-days-num { font-family: 'Bricolage Grotesque', system-ui, sans-serif; font-optical-sizing: auto; }
        .v1-hero-row > * { min-width: 0; }

        /* Two-column layout: TOC sidebar + main content. Single column on narrow. */
        .v1-layout { display: block; }
        .v1-layout > .v1-toc-col { display: none; }
        @media (min-width: 1180px) {
          .v1-layout {
            display: grid;
            grid-template-columns: 220px 1fr;
            column-gap: 36px;
          }
          .v1-layout > .v1-toc-col {
            display: block;
            /* Aside must stretch to the grid row's full height so the
               sticky nav inside has room to scroll-track the viewport. */
            align-self: stretch;
            position: relative;
          }
        }
        .v1-main-col { min-width: 0; }
      `}</style>

      <div className="v1-layout">
        <aside className="v1-toc-col">
          <TableOfContents
            state={state} setState={setState}
            items={[
              { id: 'progress', label: 'Progress' },
              { id: 'money',    label: 'Money movement' },
              { id: 'blocked',  label: 'Blocked account' },
              { id: 'map',      label: 'Köln map' },
              { id: 'tasks',    label: 'Tasks' },
              { id: 'ahead',    label: "What's ahead" },
            ]}
          />
        </aside>
        <div className="v1-main-col">

      {/* Masthead */}
      <header className="v1-masthead" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingBottom: 22, borderBottom: `1px solid ${P.lineMid}`,
        marginBottom: 28,
      }}>
        <div>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.accent, marginBottom: 4,
          }}>Study abroad · {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <h1 className="v1-h1" style={{
            fontSize: 56, fontWeight: 500, lineHeight: 1,
            margin: 0, letterSpacing: -1.4,
          }}>
            Study abroad in <em style={{ color: P.accent, fontStyle: 'italic', fontWeight: 500 }}>Köln</em>
          </h1>
          <div className="va-sans" style={{
            fontSize: 13, color: P.dimStrong, marginTop: 8,
          }}>
            Vernon · {state.meta.program} · '26–'27 · updated {new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })}
          </div>
          {(state.meta.degrees || []).length > 0 && (
            <div className="va-sans" style={{
              marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
            }}>
              <span style={{
                fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8,
                color: P.dim, fontWeight: 600,
              }}>Degree ·</span>
              {state.meta.degrees.map((d, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ fontSize: 11, color: P.dimSoft, fontStyle: 'italic' }}>or</span>}
                  <span style={{
                    fontSize: 11, color: P.accent, background: P.accentSoft,
                    padding: '3px 9px', borderRadius: 4, fontWeight: 600,
                  }}>{d}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="va-sans v1-masthead-right" style={{
          textAlign: 'right', fontSize: 12, color: P.dimStrong, lineHeight: 1.7,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
        }}>
          <WhoAmI currentUser={state.meta.currentUser || 'VJ'} setCurrentUser={setCurrentUser}/>
          <div style={{ color: P.dim, fontSize: 11 }}>
            Köln · 15° Cloudy · €1 = ${state.money.fxEurUsd.toFixed(2)}
          </div>
          <ThemeToggle state={state} setState={setState}/>
        </div>
      </header>

      <ActivityFeed
        activity={state.activity || []}
        state={state} setState={setState}
        onOpenTask={(t, lane) => setOpenTask({ task: t, lane })}
        onToggleCheck={toggleCheck}
      />

      {/* Hero row */}
      <section className="v1-hero-row" style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1.2fr',
        gap: 18, marginBottom: 28,
      }}>
        <DepartureClock state={state}/>
        <FxCalculator state={state} setState={setState}/>
      </section>

      {/* Progress — the hero narrative: tasks done, Bavarian dude + advice */}
      <Section
        id="progress"
        title="Progress"
        subtitle="How close we are — with commentary from the lederhosen department"
        headingSize={30}
        state={state} setState={setState}
      >
        <div className="v1-progress-card" style={{
          background: P.card, borderRadius: 18, padding: '24px 26px',
        }}>
          <OverallProgress state={state}/>

          <div className="va-sans" style={{
            display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4,
          }}>
            {Object.entries(byCat).map(([cat, d]) => {
              const c = cats[cat] || { color: P.dim, bg: P.lineSoft, emoji: '' };
              return (
                <div key={cat} style={{
                  display: 'grid',
                  gridTemplateColumns: '18px minmax(90px, auto) 1fr 48px 32px',
                  gap: 12, alignItems: 'center',
                  padding: '8px 2px',
                  borderTop: `1px solid ${P.lineSoft}`,
                  fontSize: 12.5,
                }}>
                  <span aria-hidden="true" style={{ fontSize: 13, opacity: 0.75 }}>{c.emoji}</span>
                  <span style={{ color: P.ink, fontWeight: 500 }}>{cat}</span>
                  <span style={{ color: P.dim, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.next === 'All done ✓' ? 'All done' : `Next: ${d.next}`}
                  </span>
                  <div style={{
                    height: 4, background: P.lineSoft, borderRadius: 999, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${d.pct}%`, height: '100%',
                      background: c.color, borderRadius: 999,
                      transition: 'width .4s ease',
                    }}/>
                  </div>
                  <span className="va-mono" style={{
                    fontSize: 10, color: P.dim, textAlign: 'right', letterSpacing: 0.5,
                  }}>{d.done}/{d.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Money movement — demoted but still full-featured */}
      <Section
        id="money"
        title="Money movement"
        subtitle="Total budget + what's moved so far"
        state={state} setState={setState}
      >
        <div className="v1-money-card" style={{
          background: P.card, borderRadius: 18, padding: '24px 26px',
        }}>
          <FundingProgress sentEUR={totals.sentEUR} totalEUR={totals.totalEUR}/>

          <div className="v1-money-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36,
            paddingBottom: 18, borderBottom: '1px dashed rgba(24,20,15,0.1)',
          }}>
            <MoneyStat label="Total budget" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>€</span>
                {totals.totalEUR.toLocaleString('de-DE')}</>
            } sub={`≈ $${Math.round(totals.totalEUR * totals.eurToUsd).toLocaleString()} USD`}/>
            <MoneyStat label="Sent so far" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>€</span>
                {totals.sentEUR.toLocaleString('de-DE')}</>
            } sub={`${totals.totalEUR ? Math.round(totals.sentEUR/totals.totalEUR * 100) : 0}% of total · derived from line statuses`}/>
            <MoneyStat label="Remaining" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>€</span>
                {totals.remainingEUR.toLocaleString('de-DE')}</>
            } sub={`≈ $${Math.round(totals.remainingEUR * totals.eurToUsd).toLocaleString()} USD still to move`}/>
          </div>

          <div style={{ paddingTop: 18 }}>
            <StackedBudgetBar lines={state.money.lines} totalEUR={totals.totalEUR}/>
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {state.money.lines.map((line, i) => (
              <div key={line.id} className="va-sans"
                onClick={() => setOpenLineId(line.id)}
                onMouseEnter={e => e.currentTarget.style.background = P.hover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto',
                  gap: 16, alignItems: 'center',
                  padding: '10px 8px', marginLeft: -8, marginRight: -8,
                  borderRadius: 8, cursor: 'pointer',
                  borderTop: i === 0 ? 'none' : `1px solid ${P.lineSoft}`,
                  fontSize: 13,
                  transition: 'background .12s',
                }}
              >
                <div>
                  <div style={{ color: P.ink, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {line.label}
                    {(line.taskIds || []).length > 0 && (
                      <span title={(line.taskIds || []).length + ' linked task(s)'} style={{
                        fontSize: 10, color: P.accent, background: P.accentSoft,
                        padding: '1px 6px', borderRadius: 4, fontWeight: 600,
                      }}>↳ {(line.taskIds || []).length}</span>
                    )}
                  </div>
                  <div style={{ color: P.dim, fontSize: 11, marginTop: 1 }}>{line.note}</div>
                </div>
                <StatusDot status={line.status}/>
                <div style={{ fontFamily: 'inherit', fontWeight: 500, minWidth: 90, textAlign: 'right' }}>
                  €{(line.amountEUR || 0).toLocaleString('de-DE')}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowAddLine(true)} className="va-sans" style={{
            marginTop: 14, border: `1px dashed ${P.lineDashed}`,
            background: 'transparent', color: P.dim,
            padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
            fontSize: 13, width: '100%', fontFamily: 'inherit', fontWeight: 500,
          }}>+ Add line item</button>
        </div>
      </Section>

      {/* Blocked account — Fintiba Sperrkonto rundown (sub-section of Money) */}
      <Section
        id="blocked"
        title="Blocked account"
        subtitle="Wire once, draw €992/mo for living expenses"
        state={state} setState={setState}
      >
        <div style={{
          background: P.card, borderRadius: 18, padding: '24px 26px',
        }}>
          <BlockedAccount state={state} setState={setState}/>
        </div>
      </Section>

      {/* Köln map — embedded Google Maps with editable pins */}
      <Section
        id="map"
        title="Köln map"
        subtitle="School, neighborhoods, future addresses"
        state={state} setState={setState}
      >
        <KolnMap state={state} setState={setState}/>
      </Section>

      {/* Tasks */}
      <Section
        id="tasks"
        title="Tasks"
        subtitle="Tap a task to open · click the box to check off"
        headingSize={30}
        state={state} setState={setState}
        headerRight={
          <div className="va-sans" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[['all','All'],['asap','ASAP'],['mine','VJ'],['jul','Jul']].map(([k,label]) => (
              <button key={k} className="v1-tab-btn" onClick={() => setTab(k)} style={{
                border: 'none',
                background: tab === k ? P.ink : 'transparent',
                color: tab === k ? P.card : P.dimStrong,
                padding: '6px 14px', borderRadius: 999, fontSize: 12,
                cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit',
              }}>{label}</button>
            ))}
          </div>
        }
      >
        {/* Category filter chips — click one to narrow, click again to clear */}
        <div className="va-sans" style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14,
          alignItems: 'center',
        }}>
          <span className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.dim, fontWeight: 600, marginRight: 4,
          }}>Filter</span>
          {Object.entries(cats).map(([cat, c]) => {
            const all = [...state.lanes.VJ, ...state.lanes.Jul].filter(t => t.cat === cat);
            const done = all.filter(t => state.checked[t.id]).length;
            const active = catFilter === cat;
            const complete = all.length > 0 && done === all.length;
            return (
              <button key={cat} onClick={() => setCatFilter(active ? null : cat)} style={{
                border: active ? `1.5px solid ${c.color}` : `1px solid ${P.line}`,
                background: active ? c.bg : (complete ? 'transparent' : P.card),
                color: active ? c.color : P.dimStrong,
                padding: '4px 10px', borderRadius: 999, fontSize: 11.5,
                cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: complete && !active ? 0.55 : 1,
                transition: 'all .12s',
              }}>
                <span aria-hidden="true">{c.emoji}</span>
                <span>{cat}</span>
                <span className="va-mono" style={{
                  fontSize: 10, fontWeight: 500,
                  color: active ? c.color : P.dim,
                  letterSpacing: 0.5,
                }}>{done}/{all.length}</span>
              </button>
            );
          })}
          {catFilter && (
            <button onClick={() => setCatFilter(null)} style={{
              border: 'none', background: 'transparent',
              color: P.accent, padding: '4px 6px', fontSize: 11,
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
              textDecoration: 'underline',
            }}>Clear</button>
          )}
        </div>

        <div className="v1-tasks-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Lane
            title="VJ's lane" lane="VJ"
            visible={tab === 'all' || tab === 'asap' || tab === 'mine'}
            filterASAP={tab === 'asap'}
            catFilter={catFilter}
            collapsedGroups={collapsedGroups}
            onToggleGroup={toggleGroup}
            state={state} setState={setState}
            onOpen={(t) => setOpenTask({ task: t, lane: 'VJ' })}
            onToggle={toggleCheck}
            onTogglePin={togglePin}
            categories={cats}
          />
          <Lane
            title="Jul's lane" lane="Jul"
            visible={tab === 'all' || tab === 'asap' || tab === 'jul'}
            filterASAP={tab === 'asap'}
            catFilter={catFilter}
            collapsedGroups={collapsedGroups}
            onToggleGroup={toggleGroup}
            state={state} setState={setState}
            onOpen={(t) => setOpenTask({ task: t, lane: 'Jul' })}
            onAdd={() => addTask('Jul')}
            onToggle={toggleCheck}
            categories={cats}
          />
        </div>
      </Section>

      {/* What's ahead — timeline with inline editor */}
      <Section
        id="ahead"
        title="What's ahead"
        subtitle="Milestones between here and Köln"
        headingSize={30}
        state={state} setState={setState}
      >
        <MilestoneTimeline state={state} setState={setState} categories={cats}/>
      </Section>

      {/* ASCII flight-strip — purely decorative footer ornament */}
      <pre className="va-mono" style={{
        marginTop: 30, marginBottom: 0,
        fontSize: 10, color: P.dimSoft, opacity: 0.55,
        textAlign: 'center', whiteSpace: 'pre',
        letterSpacing: 0, lineHeight: 1.3,
      }} aria-hidden="true">
{`                                          __|__
   ───────────────────────────────────o──(_)──o──────────►   K Ö L N
                                          ‾‾‾`}
      </pre>

      <footer className="va-sans v1-foot" style={{
        marginTop: 12, paddingTop: 16,
        borderTop: `1px solid ${P.line}`,
        fontSize: 11, color: P.dimSoft,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>Numbers and checkboxes save automatically (this browser).</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span>{state.meta.program}</span>
          {onReset && (
            <button onClick={onReset} style={{
              border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
              color: P.danger, padding: '4px 10px', borderRadius: 6,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Reset state</button>
          )}
        </div>
      </footer>

      {openTask && (
        <TaskDetailDrawer
          task={openTask.task} lane={openTask.lane}
          state={state} setState={setState}
          onClose={() => setOpenTask(null)}
          onOpenLine={(lineId) => { setOpenTask(null); setOpenLineId(lineId); }}
        />
      )}

      {openLineId && (
        <LineDetailDrawer
          lineId={openLineId}
          state={state} setState={setState}
          onClose={() => setOpenLineId(null)}
          onOpenTask={(taskId, lane) => { setOpenLineId(null); openTaskById(taskId, lane); }}
        />
      )}

      {showAddLine && (
        <AddLineDialog
          state={state} setState={setState}
          onClose={() => setShowAddLine(false)}
          categories={cats}
        />
      )}

        </div>
      </div>
    </div>
  );
}

function WhoAmI({ currentUser, setCurrentUser }) {
  return (
    <div className="v1-whoami" style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: P.card, borderRadius: 999, padding: 3,
      border: `1px solid ${P.line}`, fontSize: 11,
    }}>
      <span style={{ color: P.dim, paddingLeft: 8, paddingRight: 2, fontWeight: 500 }}>Signed in as</span>
      {['VJ', 'Jul'].map(u => (
        <button key={u} onClick={() => setCurrentUser(u)} style={{
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: currentUser === u ? P.ink : 'transparent',
          color: currentUser === u ? P.card : P.dimStrong,
        }}>{u}</button>
      ))}
    </div>
  );
}

function ActivityFeed({ activity, state, setState, onOpenTask, onToggleCheck }) {
  const pinnedIds = (state && Array.isArray(state.pinned)) ? state.pinned : [];
  const pinnedCards = pinnedIds
    .map(id => KD.findTask(state, id))
    .filter(Boolean);
  const hasPinned = pinnedCards.length > 0;
  const hasActivity = activity && activity.length > 0;
  if (!hasPinned && !hasActivity) return null;

  const fmtAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'now';
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    return Math.floor(h / 24) + 'd';
  };
  // Compress wordy verbs to a single glyph so the ticker fits on one line.
  const verbGlyph = (verb) => {
    const v = (verb || '').toLowerCase();
    if (v.includes('complet')) return '✓';
    if (v.includes('comment')) return '💬';
    if (v.includes('line'))    return '€';
    return '+'; // 'added task' and unknowns
  };
  const latest = (activity || []).slice(0, 4);
  const unpin = (id) => setState(s => KD.unpin(s, id));

  return (
    <section className="v1-activity">
      <style>{`
        /* Single-line ticker — no wrap, fade-out on the right edge so
           overflow looks intentional instead of clipped. */
        .v1-activity {
          position: relative;
          margin-bottom: 20px;
          padding: 10px 24px 10px 14px;
          background: var(--kd-accent-soft);
          border-radius: 12px;
          border: 1px solid var(--kd-line);
          display: flex; align-items: center; gap: 12px;
          flex-wrap: nowrap; overflow: hidden;
          min-width: 0;
          mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 28px), transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, #000 0, #000 calc(100% - 28px), transparent 100%);
        }
        .v1-activity-eyebrow {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--kd-accent); font-weight: 700; flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .v1-activity-divider {
          width: 1px; height: 16px; background: var(--kd-line-mid); flex-shrink: 0;
        }
        .v1-pin-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 4px 3px 8px;
          border-radius: 999px;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-left: 2px solid var(--kd-accent);
          font-size: 12px; color: var(--kd-ink);
          flex-shrink: 0;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .v1-pin-chip:hover { background: var(--kd-hover); transform: translateY(-1px); }
        .v1-pin-chip-text {
          font-weight: 500;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: 160px;
        }
        .v1-pin-chip-btn {
          all: unset; cursor: pointer;
          width: 18px; height: 18px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%;
          color: var(--kd-dim);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .v1-pin-chip-btn:hover { background: var(--kd-hover); }
        .v1-pin-chip-btn.is-done:hover { color: var(--kd-success); }
        .v1-pin-chip-btn.is-x:hover    { color: var(--kd-danger); }
        /* Recent items: tight grouping, no wrapping inside an item */
        .v1-act-item {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; color: var(--kd-dim-strong);
          display: inline-flex; align-items: baseline; gap: 5px;
          flex-shrink: 0; white-space: nowrap;
        }
        .v1-act-item .author {
          color: var(--kd-ink); font-weight: 600;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.5px;
        }
        .v1-act-item .glyph {
          color: var(--kd-accent); font-weight: 700;
          font-size: 11px;
        }
        .v1-act-item .target {
          color: var(--kd-ink);
          overflow: hidden; text-overflow: ellipsis;
          max-width: 140px;
          display: inline-block; vertical-align: bottom;
        }
        .v1-act-item .ago {
          color: var(--kd-dim-soft); font-size: 9.5px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          letter-spacing: 0.5px;
        }
        .v1-act-item + .v1-act-item {
          margin-left: 4px;
          padding-left: 12px;
          border-left: 1px solid var(--kd-line);
        }
      `}</style>

      {hasPinned && (
        <>
          <span className="v1-activity-eyebrow">
            <span aria-hidden="true">▶</span>
            Now <span style={{ color: P.dimSoft, fontWeight: 600 }}>{pinnedCards.length}/3</span>
          </span>
          {pinnedCards.map(({ task, lane }) => (
            <span key={task.id} className="v1-pin-chip" onClick={() => onOpenTask(task, lane)} title={`${lane} · ${task.text}`}>
              <span className="va-mono" style={{ fontSize: 9, color: P.dim, fontWeight: 700, letterSpacing: 1 }}>{lane}</span>
              <span className="v1-pin-chip-text">{task.text}</span>
              <span style={{ display: 'inline-flex', gap: 1 }} onClick={e => e.stopPropagation()}>
                <button className="v1-pin-chip-btn is-done" onClick={() => onToggleCheck(task.id)} title="Mark done" aria-label="Mark done">
                  <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5L5 9.5L10 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="v1-pin-chip-btn is-x" onClick={() => unpin(task.id)} title="Unpin" aria-label="Unpin"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, lineHeight: 1, fontWeight: 700 }}>×</button>
              </span>
            </span>
          ))}
        </>
      )}

      {hasPinned && hasActivity && <span className="v1-activity-divider" aria-hidden="true"/>}

      {hasActivity && (
        <span className="v1-activity-eyebrow">Recent</span>
      )}
      {latest.map((a, i) => (
        <span
          key={a.id || i}
          className="v1-act-item"
          title={`${a.author} ${a.verb} ${a.target}`}
        >
          <span className="author">{a.author}</span>
          <span className="glyph" aria-label={a.verb}>{verbGlyph(a.verb)}</span>
          <span className="target">{a.target}</span>
          <span className="ago">· {fmtAgo(a.at)}</span>
        </span>
      ))}
    </section>
  );
}

function MoneyStat({ label, value, sub }) {
  return (
    <div>
      <div className="va-mono" style={{
        fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: P.dim,
      }}>{label}</div>
      <div className="v1-display" style={{ fontSize: 36, fontWeight: 500, letterSpacing: 0, lineHeight: 1.1, marginTop: 6 }}>
        {value}
      </div>
      <div className="va-sans" style={{ fontSize: 11, color: P.dim, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function StatusDot({ status }) {
  const opt = KD.statusOptions.find(o => o.key === status);
  const s = opt ? { color: opt.color, label: opt.label } : { color: '#bbb', label: status };
  return (
    <div title={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: s.color }}/>
      <span className="v1-status-label" style={{ fontSize: 11, color: P.dimStrong, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {s.label}
      </span>
    </div>
  );
}

function Lane({ title, lane, visible, filterASAP, catFilter, collapsedGroups, onToggleGroup, state, setState, onOpen, onAdd, onToggle, onTogglePin, categories }) {
  const pinnedSet = new Set(state.pinned || []);
  if (!visible) return <div/>;
  const lp = KD.laneProgress(state, lane);
  let tasks = state.lanes[lane];
  if (filterASAP) tasks = tasks.filter(t => t.urgency === 'asap');
  if (catFilter) tasks = tasks.filter(t => t.cat === catFilter);

  // Group tasks by category, preserving the ordering in `categories`. Unknown
  // categories get appended at the end under their own group so nothing falls
  // off the list.
  const catOrder = Object.keys(categories);
  const grouped = {};
  for (const t of tasks) {
    (grouped[t.cat] = grouped[t.cat] || []).push(t);
  }
  const orderedCats = [
    ...catOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !catOrder.includes(c)),
  ];

  return (
    <div style={{
      background: P.card, borderRadius: 18, padding: '20px 20px 14px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingBottom: 12, borderBottom: `1px solid ${P.lineSoft}`,
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 20, fontWeight: 400, letterSpacing: -0.3,
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        }}>{title}</div>
        <div className="va-sans" style={{ fontSize: 12, color: P.dim }}>
          <strong style={{ color: P.ink, fontWeight: 600 }}>{lp.done}</strong> / {lp.total}
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="va-sans" style={{
          fontSize: 12, color: P.dim, padding: '14px 4px', fontStyle: 'italic',
        }}>Nothing here with that filter.</div>
      )}

      {orderedCats.map(cat => {
        const groupTasks = grouped[cat];
        const c = categories[cat] || { color: P.dim, bg: P.lineSoft, emoji: '' };
        const done = groupTasks.filter(t => state.checked[t.id]).length;
        const total = groupTasks.length;
        const complete = total > 0 && done === total;
        const key = `${lane}:${cat}`;
        const override = collapsedGroups[key];
        const collapsed = override !== undefined ? override : complete;
        return (
          <div key={cat} style={{ marginBottom: 4 }}>
            <button
              onClick={() => onToggleGroup(key, collapsed)}
              className="va-sans"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 4px', marginTop: 2, fontFamily: 'inherit',
                borderBottom: `1px dashed ${P.lineSoft}`,
                textAlign: 'left',
              }}
            >
              <span style={{
                display: 'inline-block', width: 10, color: c.color,
                fontSize: 10, transform: collapsed ? 'rotate(-90deg)' : 'none',
                transition: 'transform .15s',
              }}>▾</span>
              <span aria-hidden="true" style={{ fontSize: 13 }}>{c.emoji}</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: c.color,
                letterSpacing: 0.2,
              }}>{cat}</span>
              <span className="va-mono" style={{
                fontSize: 10, color: P.dim, letterSpacing: 1, marginLeft: 'auto',
                textDecoration: complete ? 'none' : 'none',
              }}>{done}/{total}{complete ? ' ✓' : ''}</span>
            </button>
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 2 }}>
                {groupTasks.map(t => (
                  <TaskRow key={t.id} t={t} lane={lane}
                    checked={!!state.checked[t.id]}
                    pinned={pinnedSet.has(t.id)}
                    pinnedCount={(state.pinned || []).length}
                    hasNotes={!!(state.notes[t.id] && (state.notes[t.id].text || (state.notes[t.id].comments||[]).length))}
                    commentCount={(state.notes[t.id]?.comments||[]).length}
                    linkedLineCount={state.money.lines.filter(l => (l.taskIds||[]).includes(t.id)).length}
                    onOpen={onOpen} onToggle={onToggle} onTogglePin={onTogglePin} categories={categories}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <QuickAddTask lane={lane} state={state} setState={setState} categories={categories}/>
    </div>
  );
}

// Keyword → category guesser for quick-add. Order matters: more specific
// patterns before general ones. Returns null if nothing matches.
function guessCategory(text) {
  const t = text.toLowerCase();
  const rules = [
    [/\b(apostille|translate|translation|cert(ificate)?|transcript|diploma|motivation|cv|jis|signature|binus|cbs|visa|appointment|videx|anabin)\b/, 'Visa docs'],
    [/\b(wire|fund|send|pay(ment)?|invoice|tuition|merrill|fintiba|€|\$|usd|eur|idr|cash)\b/, 'Financial'],
    [/\b(apartment|wohnung|housing|landlord|kaution|rent|miete|kalt|warm|besichtigung|sublet|wg|flat)\b/, 'Housing'],
    [/\b(bank|account|n26|sparkasse|girokonto|iban|bic|debit|card|sim|phone|nummer|prepaid)\b/, 'Banking'],
    [/\b(flight|fly|book|ticket|train|bahn|move-?in|trip|berlin|köln|cologne)\b/, 'Travel'],
  ];
  for (const [re, cat] of rules) if (re.test(t)) return cat;
  return null;
}

// Most-common category among unchecked tasks in this lane — used as the
// default when the user hasn't typed anything for the keyword guesser.
function mostCommonCat(state, lane) {
  const tasks = (state.lanes[lane] || []).filter(t => !(state.checked || {})[t.id]);
  if (!tasks.length) return null;
  const counts = {};
  tasks.forEach(t => { counts[t.cat] = (counts[t.cat] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function QuickAddTask({ lane, state, setState, categories }) {
  const catNames = Object.keys(categories);
  const urgencyOptions = KD.urgencyOptions;
  const initialCat = mostCommonCat(state, lane) || catNames[0] || 'Personal';

  const [text, setText] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const [cat, setCat] = React.useState(initialCat);
  const [userPickedCat, setUserPickedCat] = React.useState(false);
  const [urgency, setUrgency] = React.useState('soon');
  const [due, setDue] = React.useState('Soon');
  const [date, setDate] = React.useState(''); // ISO YYYY-MM-DD — plots on the calendar

  // When user picks a date, auto-fill the 'due' display unless they've
  // typed something custom there already.
  const onDateChange = (iso) => {
    setDate(iso);
    if (iso && (due === 'Soon' || due === '' || /^[A-Z][a-z]{2} \d{1,2}$/.test(due))) {
      const dt = new Date(iso + 'T00:00:00');
      setDue(dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
  };

  // As text changes, auto-pick a category from keywords — but stop the
  // auto-detect once the user explicitly clicks a category chip.
  React.useEffect(() => {
    if (userPickedCat) return;
    if (!text.trim()) return;
    const guess = guessCategory(text);
    if (guess && categories[guess]) setCat(guess);
  }, [text, userPickedCat]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const taskId = 'x' + Date.now();
    setState(s => {
      const newTask = {
        id: taskId, text: trimmed,
        cat, due: due.trim() || 'TBD', urgency,
      };
      if (date) newTask.date = date;  // ISO date drives the calendar plot
      const next = {
        ...s,
        lanes: { ...s.lanes, [lane]: [...s.lanes[lane], newTask] },
      };
      return KD.logActivity(next, next.meta.currentUser || 'VJ', 'added task', trimmed);
    });
    setText(''); setDate('');
    // Re-arm the keyword guesser for the next entry.
    setUserPickedCat(false);
  };

  const reset = () => {
    setText(''); setDate('');
    setCat(mostCommonCat(state, lane) || catNames[0] || 'Personal');
    setUserPickedCat(false);
    setUrgency('soon'); setDue('Soon');
    setExpanded(false);
  };

  const activeCat = categories[cat] || { color: P.dim, bg: P.lineSoft };

  return (
    <div className="va-sans" style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
        <input
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') reset();
          }}
          placeholder={`+ Quick add to ${lane}'s lane…`}
          style={{
            flex: 1, minWidth: 0,
            border: `1px dashed ${P.lineDashed}`, background: 'transparent',
            color: P.ink, fontFamily: 'inherit', fontSize: 13,
            padding: '8px 12px', borderRadius: 10, outline: 'none',
          }}
        />
        {/* Visible category chip — shows what the task will be filed as.
            Click to expand the form and pick something else. */}
        <button
          onClick={() => setExpanded(true)}
          title={`Category: ${cat}${userPickedCat ? '' : ' (auto)'} — click to change`}
          style={{
            border: `1px solid ${activeCat.color || P.lineMid}`,
            background: activeCat.bg || 'transparent',
            color: activeCat.color || P.dim,
            padding: '0 10px', borderRadius: 10, cursor: 'pointer',
            fontSize: 11, fontFamily: 'inherit', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            whiteSpace: 'nowrap',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
        >
          {activeCat.emoji && <span aria-hidden="true" style={{ fontSize: 12 }}>{activeCat.emoji}</span>}
          <span>{cat}</span>
          {!userPickedCat && (
            <span className="va-mono" style={{
              fontSize: 8, letterSpacing: 0.5, opacity: 0.65,
              border: `1px solid currentColor`, padding: '0 3px', borderRadius: 2,
              marginLeft: 2,
            }}>AUTO</span>
          )}
        </button>
        <button
          onClick={() => setExpanded(v => !v)}
          title={expanded ? 'Collapse options' : 'Expand options'}
          aria-label="Toggle options"
          style={{
            border: `1px dashed ${P.lineDashed}`,
            background: expanded ? P.accentSoft : 'transparent',
            color: expanded ? P.accent : P.dim,
            padding: '0 12px', borderRadius: 10, cursor: 'pointer',
            fontSize: 12, fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontWeight: 700, letterSpacing: 0.5,
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
        >{expanded ? '▴' : '▾'}</button>
      </div>

      {expanded && (
        <div style={{
          marginTop: 8, padding: '12px 14px',
          border: `1px dashed ${P.lineDashed}`, borderRadius: 10,
          background: P.drawer,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* Category chips */}
          <div>
            <div className="va-mono" style={{
              fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
              color: P.dim, fontWeight: 700, marginBottom: 6,
            }}>Category</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {catNames.map(c => {
                const cd = categories[c];
                const active = cat === c;
                return (
                  <button key={c} onClick={() => { setCat(c); setUserPickedCat(true); }} style={{
                    border: '1px solid ' + (active ? cd.color : P.lineMid),
                    background: active ? cd.bg : 'transparent',
                    color: active ? cd.color : P.dimStrong,
                    padding: '3px 9px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  }}>{cd.emoji && <span aria-hidden="true">{cd.emoji}</span>}{c}</button>
                );
              })}
            </div>
          </div>

          {/* Urgency + due in a row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 130px', gap: 10,
            alignItems: 'end',
          }}>
            <div>
              <div className="va-mono" style={{
                fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
                color: P.dim, fontWeight: 700, marginBottom: 6,
              }}>Urgency</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {urgencyOptions.map(u => {
                  const active = urgency === u.key;
                  return (
                    <button key={u.key} onClick={() => setUrgency(u.key)} style={{
                      border: '1px solid ' + (active ? u.color : P.lineMid),
                      background: active ? u.color : 'transparent',
                      color: active ? P.card : u.color,
                      padding: '3px 10px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease, color 0.15s ease',
                    }}>{u.label}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="va-mono" style={{
                fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
                color: P.dim, fontWeight: 700, marginBottom: 6,
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span>Due</span>
                {date && <span style={{ color: P.accent, letterSpacing: 0.5 }}>↳ on calendar</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 4 }}>
                <input
                  type="date" value={date}
                  onChange={e => onDateChange(e.target.value)}
                  title="Pick a date — plots a dot on the What's-ahead calendar"
                  style={{
                    minWidth: 0,
                    border: `1px solid ${P.lineMid}`, background: P.card,
                    color: P.ink, fontFamily: 'inherit', fontSize: 12,
                    padding: '5px 9px', borderRadius: 6, outline: 'none',
                  }}
                />
                <input
                  value={due} onChange={e => setDue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit(); }}
                  placeholder={date ? 'Label (auto)' : 'e.g. May 1, ASAP, TBD'}
                  title="How the due date displays on the task row"
                  style={{
                    width: '100%', minWidth: 0,
                    border: `1px solid ${P.lineMid}`, background: P.card,
                    color: P.ink, fontFamily: 'inherit', fontSize: 12,
                    padding: '5px 9px', borderRadius: 6, outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <button onClick={reset} style={{
              border: `1px solid ${P.lineMid}`, background: 'transparent',
              color: P.dim, padding: '5px 12px', borderRadius: 6, fontSize: 11,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>Reset</button>
            <button onClick={submit} disabled={!text.trim()} style={{
              border: 'none',
              background: text.trim() ? P.accent : P.lineMid,
              color: P.card, padding: '5px 14px', borderRadius: 6,
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span aria-hidden="true" style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              }}>↵</span>
              Add to {lane}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ t, checked, pinned = false, pinnedCount = 0, hasNotes, commentCount, linkedLineCount = 0, onOpen, onToggle, onTogglePin, categories }) {
  const canPin = pinned || pinnedCount < 3;
  const pinDisabled = !pinned && !canPin;
  return (
    <div
      id={`task-${t.id}`}
      className="va-sans v1-task-row"
      style={{
        display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 10,
        padding: '9px 8px', borderRadius: 8, cursor: 'pointer',
        transition: 'background .12s',
        background: pinned ? P.accentSoft : 'transparent',
        scrollMarginTop: 100,
      }}
      onMouseEnter={e => { if (!pinned) e.currentTarget.style.background = P.hover; }}
      onMouseLeave={e => { e.currentTarget.style.background = pinned ? P.accentSoft : 'transparent'; }}
      onClick={() => onOpen(t)}
    >
      <div className="v1-task-check" onClick={e => { e.stopPropagation(); onToggle(t.id); }} style={{
        width: 18, height: 18, borderRadius: 5, marginTop: 2,
        border: '1.5px solid ' + (checked ? P.success : P.overlayStrong),
        background: checked ? P.success : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5L5 9.5L10 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <div>
        <div style={{
          fontSize: 13.5, color: P.ink, lineHeight: 1.4,
          textDecoration: checked ? 'line-through' : 'none',
          opacity: checked ? 0.5 : 1,
        }}>{t.text}</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CategoryChip cat={t.cat} categories={categories}/>
          <UrgencyPill urgency={t.urgency} due={t.due}/>
          {linkedLineCount > 0 && (
            <span title={linkedLineCount + ' linked budget line(s)'} style={{
              fontSize: 10, color: P.accent, background: P.accentSoft,
              padding: '1px 6px', borderRadius: 4, fontWeight: 600, marginLeft: 4,
            }}>€ {linkedLineCount}</span>
          )}
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, paddingTop: 2,
        color: P.dimSoft, fontSize: 11,
      }}>
        {commentCount > 0 && (
          <span title={commentCount + ' comments'} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 3h10v7H5l-3 3V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            {commentCount}
          </span>
        )}
        {hasNotes && !commentCount && (
          <span title="Has notes" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: P.accent }}/>
        )}
        {!checked && onTogglePin && (
          <button
            className="v1-task-pin"
            onClick={e => { e.stopPropagation(); if (!pinDisabled) onTogglePin(t.id); }}
            disabled={pinDisabled}
            title={pinned ? 'Click to unpin' : pinDisabled ? '3 tasks already pinned — unpin one first' : 'Pin as in progress'}
            aria-label={pinned ? 'Unpin' : 'Pin as in progress'}
            style={{
              border: `1px solid ${pinned ? P.accent : P.lineMid}`,
              background: pinned ? P.accent : P.card,
              cursor: pinDisabled ? 'not-allowed' : 'pointer',
              padding: '3px 8px', borderRadius: 999,
              color: pinned ? P.card : P.dimStrong,
              opacity: pinDisabled ? 0.4 : 1,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9, lineHeight: 1, fontWeight: 700, letterSpacing: 1,
              textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
            }}
          >
            <span style={{ fontSize: 10 }}>{pinned ? '◉' : '○'}</span>
            {pinned ? 'Pinned' : 'Pin'}
          </button>
        )}
      </div>
    </div>
  );
}

function AddLineDialog({ state, setState, onClose, categories }) {
  const [label, setLabel] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [status, setStatus] = React.useState('pending');
  const [note, setNote]   = React.useState('');
  const [alsoTask, setAlsoTask] = React.useState(true);
  const [taskLane, setTaskLane] = React.useState('VJ');
  const [taskCat, setTaskCat] = React.useState('Financial');
  const [taskDue, setTaskDue] = React.useState('Soon');
  const [taskUrgency, setTaskUrgency] = React.useState('soon');

  const catNames = Object.keys(categories);
  const statusOptions = KD.statusOptions;
  const urgencyOptions = KD.urgencyOptions;

  const create = () => {
    if (!label.trim()) return;
    const lineId = 'm-' + Date.now();
    let newTaskId = null;
    setState(s => {
      let next = { ...s };
      if (alsoTask) {
        newTaskId = 'x' + Date.now();
        next = {
          ...next,
          lanes: {
            ...next.lanes,
            [taskLane]: [...next.lanes[taskLane], {
              id: newTaskId, text: label.trim(),
              cat: taskCat, due: taskDue.trim() || 'TBD', urgency: taskUrgency,
            }],
          },
        };
      }
      const newLine = {
        id: lineId, label: label.trim(), amountEUR: Number(amount) || 0,
        status, note: note.trim(),
        taskIds: newTaskId ? [newTaskId] : [],
      };
      next = { ...next, money: { ...next.money, lines: [...next.money.lines, newLine] } };
      return KD.logActivity(next, next.meta.currentUser || 'VJ', 'added line', label.trim());
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: P.overlayStrong, backdropFilter: 'blur(3px)',
    }} onClick={onClose}>
      <div className="v1-dialog" onClick={e => e.stopPropagation()} style={{
        width: 480, maxWidth: '94%', background: P.drawer,
        borderRadius: 16, padding: '22px 24px',
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 0.8, color: P.dim, textTransform: 'uppercase' }}>
              New budget entry
            </div>
            <div style={{
              fontSize: 22, fontWeight: 500, marginTop: 2,
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}>Add line item</div>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', fontSize: 20,
            cursor: 'pointer', color: P.dim, padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <FieldLabel>Label</FieldLabel>
          <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
            placeholder="e.g. Flights · Jakarta → Köln"
            style={fieldStyle()}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <FieldLabel>Amount (EUR)</FieldLabel>
            <input type="number" value={amount}
              onChange={e => setAmount(e.target.value)}
              style={fieldStyle()}/>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <div style={{ display: 'flex', gap: 5 }}>
              {statusOptions.map(s => {
                const active = status === s.key;
                return (
                  <button key={s.key} onClick={() => setStatus(s.key)} style={{
                    border: '1px solid ' + (active ? s.color : P.lineStrong),
                    background: active ? s.color : P.card,
                    color: active ? P.card : s.color,
                    padding: '6px 10px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', flex: 1,
                  }}>{s.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <FieldLabel>Note (optional)</FieldLabel>
          <input value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. Round-trip via SQ"
            style={fieldStyle()}/>
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: alsoTask ? P.accentSoft : P.card,
          border: '1px solid ' + (alsoTask ? '#e0cfa8' : P.line),
          cursor: 'pointer', fontSize: 13,
        }}>
          <input type="checkbox" checked={alsoTask}
            onChange={e => setAlsoTask(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: P.accent }}/>
          <span style={{ color: P.ink, fontWeight: 500 }}>
            Also create a linked task
          </span>
        </label>

        {alsoTask && (
          <div style={{
            padding: 12, background: P.card, borderRadius: 10,
            border: `1px solid ${P.line}`,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Lane</FieldLabel>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['VJ','Jul'].map(l => (
                    <button key={l} onClick={() => setTaskLane(l)} style={{
                      border: '1px solid ' + (taskLane === l ? P.ink : P.lineStrong),
                      background: taskLane === l ? P.ink : P.card,
                      color: taskLane === l ? P.card : P.ink,
                      padding: '6px 10px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', flex: 1,
                    }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Due</FieldLabel>
                <input value={taskDue} onChange={e => setTaskDue(e.target.value)}
                  style={fieldStyle()}/>
              </div>
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {catNames.map(c => {
                  const col = categories[c]; const active = taskCat === c;
                  return (
                    <button key={c} onClick={() => setTaskCat(c)} style={{
                      border: '1px solid ' + (active ? col.color : 'transparent'),
                      background: active ? col.color : col.bg,
                      color: active ? P.card : col.color,
                      padding: '4px 11px', borderRadius: 4,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>{c}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <FieldLabel>Urgency</FieldLabel>
              <div style={{ display: 'flex', gap: 5 }}>
                {urgencyOptions.map(u => {
                  const active = taskUrgency === u.key;
                  return (
                    <button key={u.key} onClick={() => setTaskUrgency(u.key)} style={{
                      border: '1px solid ' + (active ? u.color : P.lineStrong),
                      background: active ? u.color : P.card,
                      color: active ? P.card : u.color,
                      padding: '6px 10px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>{u.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', color: P.dim,
            padding: '8px 14px', borderRadius: 8, fontSize: 12,
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>Cancel</button>
          <button onClick={create} disabled={!label.trim()} style={{
            background: label.trim() ? P.ink : 'rgba(24,20,15,0.3)',
            color: P.card, border: 'none',
            padding: '8px 16px', borderRadius: 8, fontSize: 12,
            fontWeight: 600, cursor: label.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}>Create</button>
        </div>
      </div>
    </div>
  );
}

function FxCalculator({ state, setState }) {
  const fxEurUsd = state.money.fxEurUsd || 1.10;
  const fxEurIdr = state.money.fxEurIdr || 18200;
  // The single source of truth is EUR; each currency input is derived
  // unless it's the focused one, which holds the user's typed string.
  const [eurAmount, setEurAmount] = React.useState(1000);
  const [focused, setFocused] = React.useState('EUR');
  const [draft, setDraft] = React.useState('1.000');
  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fromEur = (eur, cur) =>
    cur === 'EUR' ? eur : cur === 'USD' ? eur * fxEurUsd : eur * fxEurIdr;
  const toEur = (v, cur) =>
    cur === 'EUR' ? v : cur === 'USD' ? v / fxEurUsd : v / fxEurIdr;

  const refresh = async () => {
    setFetching(true); setError(null);
    const result = await KD.refreshExchangeRates(setState);
    if (result !== 'ok') setError(result);
    setFetching(false);
  };

  React.useEffect(() => {
    const last = state.money.fxUpdatedAt ? new Date(state.money.fxUpdatedAt).getTime() : 0;
    if (Date.now() - last > 60 * 60 * 1000) refresh();
  }, []);

  const timeAgo = () => {
    if (!state.money.fxUpdatedAt) return 'tap to update';
    const diff = Date.now() - new Date(state.money.fxUpdatedAt).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return min + 'm ago';
    const h = Math.floor(min / 60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  };

  const currencies = [
    { key: 'EUR', symbol: '€',  flag: '🇪🇺', locale: 'de-DE' },
    { key: 'USD', symbol: '$',  flag: '🇺🇸', locale: 'en-US' },
    { key: 'IDR', symbol: 'Rp', flag: '🇮🇩', locale: 'id-ID' },
  ];

  const fmt = (cur, v) => {
    const c = currencies.find(x => x.key === cur);
    return v.toLocaleString(c.locale, { maximumFractionDigits: 0 });
  };

  // Quick-amount chips — adapt unit to the currency being typed in.
  const quickChips = (cur) => cur === 'IDR'
    ? [100000, 1000000, 5000000, 10000000]
    : [100, 1000, 5000, 10000];

  // Locale-aware parser: EUR (de-DE) uses '.' as thousands separator
  // and ',' as decimal; USD/IDR use the inverse. parseFloat alone gets
  // de-DE wrong ("1.000" → 1 instead of 1000).
  const parseLocalized = (raw, cur) => {
    const cleaned = raw.replace(/[^\d.,-]/g, '');
    if (cur === 'EUR') {
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
    }
    return parseFloat(cleaned.replace(/,/g, '')) || 0;
  };

  const setFromInput = (cur, raw) => {
    setDraft(raw);
    setEurAmount(toEur(parseLocalized(raw, cur), cur));
  };

  const setQuick = (cur, val) => {
    setEurAmount(toEur(val, cur));
    setFocused(cur);
    setDraft(fmt(cur, val));
  };

  return (
    <div className="v1-fx-card" style={{
      background: P.card,
      border: `1px solid ${P.lineMid}`,
      borderRadius: 18, padding: '16px 18px 14px',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        .v1-fx-card::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(120% 80% at 100% 0%, var(--kd-accent-soft) 0%, transparent 55%);
          opacity: 0.6;
          pointer-events: none;
        }
        .v1-fx-row {
          position: relative;
          display: grid;
          grid-template-columns: 26px 36px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 8px 4px;
          border-bottom: 1px solid var(--kd-line-soft);
          transition: background 0.15s ease;
        }
        .v1-fx-row:last-of-type { border-bottom: none; }
        .v1-fx-row.is-active::before {
          content: "";
          position: absolute;
          left: -18px; top: 6px; bottom: 6px;
          width: 3px;
          background: var(--kd-accent);
          border-radius: 2px;
          box-shadow: 0 0 10px var(--kd-accent-soft);
        }
        .v1-fx-flag {
          font-size: 18px; line-height: 1;
          filter: saturate(0.9);
        }
        .v1-fx-code {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 1.4px; font-weight: 700;
          color: var(--kd-dim);
          text-transform: uppercase;
        }
        .v1-fx-row.is-active .v1-fx-code { color: var(--kd-accent); }
        .v1-fx-input {
          all: unset;
          width: 100%;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 22px; line-height: 1.05; letter-spacing: -0.5px;
          color: var(--kd-dim-strong);
          font-weight: 400;
          cursor: text;
        }
        .v1-fx-row.is-active .v1-fx-input {
          color: var(--kd-ink);
          font-weight: 500;
        }
        .v1-fx-symbol {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 16px; color: var(--kd-dim);
          font-weight: 400;
          text-align: right;
          padding-right: 4px;
        }
        .v1-fx-row.is-active .v1-fx-symbol {
          color: var(--kd-accent);
          font-weight: 500;
        }
        .v1-fx-chips {
          display: flex; gap: 4px; flex-wrap: wrap;
          margin-top: 6px;
        }
        .v1-fx-chip {
          all: unset;
          cursor: pointer;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.5px; font-weight: 600;
          color: var(--kd-dim);
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--kd-line-mid);
          background: var(--kd-card);
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .v1-fx-chip:hover {
          background: var(--kd-accent);
          color: var(--kd-card);
          border-color: var(--kd-accent);
        }
      `}</style>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 8, position: 'relative',
      }}>
        <div className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: P.accent, fontWeight: 700,
        }}>FX · Rate board</div>
        <button onClick={refresh} disabled={fetching} style={{
          border: `1px solid ${error ? P.danger : P.lineMid}`,
          background: 'transparent',
          color: error ? P.danger : P.dim,
          cursor: fetching ? 'wait' : 'pointer',
          fontSize: 9, fontWeight: 700, letterSpacing: 1,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap',
        }}>
          {fetching ? '↻ updating…' : error ? '⚠ retry' : `↻ ${timeAgo()}`}
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        {currencies.map(c => {
          const isActive = focused === c.key;
          const value = isActive ? draft : fmt(c.key, fromEur(eurAmount, c.key));
          return (
            <div key={c.key} className={`v1-fx-row ${isActive ? 'is-active' : ''}`}>
              <span className="v1-fx-flag" aria-hidden="true">{c.flag}</span>
              <span className="v1-fx-code">{c.key}</span>
              <input
                className="v1-fx-input v1-large-input"
                type="text" inputMode="decimal"
                value={value}
                onFocus={(e) => {
                  setFocused(c.key);
                  setDraft(fmt(c.key, fromEur(eurAmount, c.key)));
                  setTimeout(() => e.target.select(), 0);
                }}
                onChange={(e) => setFromInput(c.key, e.target.value)}
              />
              <span className="v1-fx-symbol">{c.symbol}</span>
            </div>
          );
        })}
      </div>

      <div className="v1-fx-chips">
        {quickChips(focused).map(v => (
          <button key={v} className="v1-fx-chip" onClick={() => setQuick(focused, v)}>
            {currencies.find(x => x.key === focused).symbol}{fmt(focused, v)}
          </button>
        ))}
      </div>

      <div className="va-mono" style={{
        marginTop: 2, paddingTop: 8,
        borderTop: `1px dashed ${P.lineSoft}`,
        fontSize: 9, letterSpacing: 1, color: P.dim,
        textTransform: 'uppercase', fontWeight: 600,
        display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
      }}>
        <span>€1 = ${fxEurUsd.toFixed(4)}</span>
        <span>€1 = Rp {Math.round(fxEurIdr).toLocaleString('id-ID')}</span>
      </div>

      <div className="va-mono" style={{
        marginTop: 6,
        fontSize: 9, letterSpacing: 1, color: P.dimSoft,
        textTransform: 'uppercase', fontWeight: 600,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 8, flexWrap: 'wrap',
      }}>
        <a
          href="https://open.er-api.com/v6/latest/EUR"
          target="_blank" rel="noopener noreferrer"
          style={{ color: P.dimSoft, textDecoration: 'none', borderBottom: `1px dashed ${P.lineMid}` }}
          title="Open the raw rate JSON in a new tab"
        >via open.er-api.com</a>
        <a
          href={`https://www.google.com/finance/quote/EUR-${focused === 'EUR' ? 'USD' : focused}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            color: P.accent, textDecoration: 'none',
            border: `1px solid ${P.lineMid}`, borderRadius: 999,
            padding: '2px 8px', fontWeight: 700,
          }}
          title="Spot-check on Google Finance"
        >📈 Google</a>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8,
      color: P.dim, marginBottom: 4,
    }}>{children}</div>
  );
}

function fieldStyle() {
  return {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    border: `1px solid ${P.lineStrong}`, background: P.card,
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
  };
}

window.VariationA = VariationA;
