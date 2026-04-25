// Variation A — Cozy single-scroll dashboard.
// Warm paper background, rounded cards, editorial typography.

const P = KD.palette;

function VariationA({ onReset }) {
  const [state, setState] = useKDState();
  const [openTask, setOpenTask] = React.useState(null);
  const [openLineId, setOpenLineId] = React.useState(null);
  const [showAddLine, setShowAddLine] = React.useState(false);
  const [addTaskLane, setAddTaskLane] = React.useState(null);
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

  const addTask = (lane) => setAddTaskLane(lane);

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
        <div className="v1-days-card" style={{
          background: P.ink, color: P.paper,
          borderRadius: 18, padding: '22px 26px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6,
          }}>Days until departure</div>
          <div className="v1-days-num" style={{
            fontSize: 76, fontWeight: 500, lineHeight: 1, letterSpacing: -2,
            marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            {days}
            <span className="va-sans" style={{
              fontSize: 12, opacity: 0.65, fontWeight: 400,
              letterSpacing: 0,
            }}>days</span>
          </div>
          <div className="va-sans" style={{
            fontSize: 12, marginTop: 4, opacity: 0.7,
            display: 'flex', justifyContent: 'space-between', gap: 12,
          }}>
            <span>Target · {targetDate}</span>
            <span style={{ opacity: 0.8 }}>≈ {Math.round(days/7)} weeks</span>
          </div>
        </div>

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
            onAdd={() => addTask('VJ')}
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

      {/* What's ahead — timeline only */}
      <Section
        id="ahead"
        title="What's ahead"
        subtitle="Milestones between here and Köln"
        headingSize={30}
        state={state} setState={setState}
      >
        <div style={{
          background: P.card, borderRadius: 18, padding: '22px 24px',
          position: 'relative',
        }}>
          <div style={{ position: 'relative', paddingLeft: 4 }}>
            <div style={{
              position: 'absolute', left: 14, top: 10, bottom: 10, width: 2,
              background: 'linear-gradient(#f4e0cb, #c14a1c 30%, #1a120a)',
            }}/>
            {state.upcoming.map((u, i) => (
              <div key={i} className="va-sans v1-timeline-row" style={{
                position: 'relative', paddingLeft: 36, marginBottom: 14,
                display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12,
                alignItems: 'center',
              }}>
                <div style={{
                  position: 'absolute', left: 8, top: 6, width: 14, height: 14,
                  borderRadius: '50%',
                  background: i === state.upcoming.length - 1 ? P.ink : P.card,
                  border: '2px solid ' + (i === state.upcoming.length - 1 ? P.ink : P.accent),
                }}/>
                <div className="v1-timeline-when" style={{ fontSize: 11, color: P.accent, fontWeight: 600, letterSpacing: 0.5 }}>{u.when}</div>
                <div className="v1-timeline-what" style={{ fontSize: 13, color: P.ink, fontWeight: 500 }}>{u.what}</div>
                <CategoryChip cat={u.cat} categories={cats}/>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <footer className="va-sans v1-foot" style={{
        marginTop: 30, paddingTop: 16,
        borderTop: `1px solid ${P.line}`,
        fontSize: 11, color: '#9b8f7f',
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

      {addTaskLane && (
        <AddTaskDialog
          lane={addTaskLane}
          state={state} setState={setState}
          onClose={() => setAddTaskLane(null)}
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
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    return Math.floor(h / 24) + 'd';
  };
  const latest = (activity || []).slice(0, 5);
  const unpin = (id) => setState(s => KD.unpin(s, id));

  return (
    <section className="v1-activity" style={{
      marginBottom: 20, padding: '10px 14px', background: P.accentSoft,
      borderRadius: 12, border: `1px solid ${P.line}`,
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
    }}>
      <style>{`
        .v1-pin-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 4px 3px 9px;
          border-radius: 999px;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-left: 2px solid var(--kd-accent);
          font-size: 12px; color: var(--kd-ink);
          max-width: 280px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .v1-pin-chip:hover { background: var(--kd-hover); transform: translateY(-1px); }
        .v1-pin-chip-text {
          font-weight: 500;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: 200px;
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
      `}</style>

      {hasPinned && (
        <>
          <span className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.accent, fontWeight: 700, flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ display: 'inline-block' }}>▶</span>
            Now <span style={{ color: P.dimSoft, fontWeight: 600 }}>{pinnedCards.length}/3</span>
          </span>
          {pinnedCards.map(({ task, lane }) => (
            <span key={task.id} className="v1-pin-chip" onClick={() => onOpenTask(task, lane)} title="Open task">
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

      {hasPinned && hasActivity && (
        <span aria-hidden="true" style={{
          width: 1, height: 18, background: P.lineMid, flexShrink: 0,
        }}/>
      )}

      {hasActivity && (
        <span className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: P.accent, fontWeight: 600, flexShrink: 0,
        }}>Recent</span>
      )}
      {latest.map((a, i) => (
        <span key={a.id || i} className="va-sans" style={{
          fontSize: 12, color: P.dimStrong, display: 'flex', alignItems: 'baseline', gap: 6,
          minWidth: 0,
        }}>
          <strong style={{ color: P.ink, fontWeight: 600 }}>{a.author}</strong>
          <span style={{ color: P.dim }}>{a.verb}</span>
          <span style={{ color: P.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{a.target}</span>
          <span style={{ color: P.dimSoft, fontSize: 10 }}>· {fmtAgo(a.at)}</span>
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

      <QuickAddTask lane={lane} setState={setState} onMore={onAdd}/>
    </div>
  );
}

function QuickAddTask({ lane, setState, onMore }) {
  const [text, setText] = React.useState('');
  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const taskId = 'x' + Date.now();
    setState(s => {
      const next = {
        ...s,
        lanes: {
          ...s.lanes,
          [lane]: [...s.lanes[lane], {
            id: taskId, text: trimmed,
            cat: 'Visa docs', due: 'TBD', urgency: 'soon',
          }],
        },
      };
      return KD.logActivity(next, next.meta.currentUser || 'VJ', 'added task', trimmed);
    });
    setText('');
  };
  return (
    <div className="va-sans" style={{
      marginTop: 10, display: 'flex', gap: 6, alignItems: 'stretch',
    }}>
      <input
        value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); }}
        placeholder={`+ Quick add to ${lane}'s lane…`}
        style={{
          flex: 1, border: `1px dashed ${P.lineDashed}`, background: 'transparent',
          color: P.ink, fontFamily: 'inherit', fontSize: 13,
          padding: '8px 12px', borderRadius: 10, outline: 'none',
        }}
      />
      <button onClick={onMore} title="More options" style={{
        border: `1px dashed ${P.lineDashed}`, background: 'transparent',
        color: P.dim, padding: '0 12px', borderRadius: 10, cursor: 'pointer',
        fontSize: 14, fontFamily: 'inherit', fontWeight: 500,
      }}>⋯</button>
    </div>
  );
}

function TaskRow({ t, checked, pinned = false, pinnedCount = 0, hasNotes, commentCount, linkedLineCount = 0, onOpen, onToggle, onTogglePin, categories }) {
  const canPin = pinned || pinnedCount < 3;
  const pinDisabled = !pinned && !canPin;
  return (
    <div
      className="va-sans v1-task-row"
      style={{
        display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 10,
        padding: '9px 8px', borderRadius: 8, cursor: 'pointer',
        transition: 'background .12s',
        background: pinned ? P.accentSoft : 'transparent',
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
  const [base, setBase] = React.useState('EUR');
  const [amount, setAmount] = React.useState(1000);
  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState(null);

  const toEur = (v, cur) =>
    cur === 'EUR' ? v : cur === 'USD' ? v / fxEurUsd : v / fxEurIdr;
  const fromEur = (eur, cur) =>
    cur === 'EUR' ? eur : cur === 'USD' ? eur * fxEurUsd : eur * fxEurIdr;

  const eurEquiv = toEur(amount, base);
  const vals = {
    EUR: fromEur(eurEquiv, 'EUR'),
    USD: fromEur(eurEquiv, 'USD'),
    IDR: fromEur(eurEquiv, 'IDR'),
  };

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
    { key: 'EUR', label: 'EUR', symbol: '€' },
    { key: 'USD', label: 'USD', symbol: '$' },
    { key: 'IDR', label: 'IDR', symbol: 'Rp' },
  ];

  const localeFor = (cur) => cur === 'IDR' ? 'id-ID' : cur === 'EUR' ? 'de-DE' : 'en-US';
  const fmt = (cur, v) => v.toLocaleString(localeFor(cur), { maximumFractionDigits: cur === 'IDR' ? 0 : 0 });

  const baseSym = currencies.find(c => c.key === base).symbol;
  const inputValue = vals[base].toLocaleString(localeFor(base), { maximumFractionDigits: 0 });
  const other = currencies.filter(c => c.key !== base);

  return (
    <div className="v1-fx-card" style={{
      background: P.accentSoft, borderRadius: 18, padding: '18px 22px',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: P.accent,
        }}>FX calculator</div>
        <div className="va-sans" style={{
          display: 'flex', gap: 2, background: 'rgba(138,90,43,0.12)',
          borderRadius: 999, padding: 2,
        }}>
          {currencies.map(c => (
            <button key={c.key} onClick={() => setBase(c.key)} style={{
              border: 'none',
              background: base === c.key ? P.ink : 'transparent',
              color: base === c.key ? P.card : P.accent,
              padding: '3px 10px', borderRadius: 999,
              fontSize: 10, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: 0.3,
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="va-sans" style={{ fontSize: 16, color: P.accent, fontWeight: 500 }}>{baseSym}</span>
        <input
          className="v1-large-input"
          type="text" size={1} inputMode="decimal"
          value={inputValue}
          onChange={e => {
            const raw = e.target.value.replace(/[^\d.-]/g, '');
            setAmount(parseFloat(raw) || 0);
          }}
          onFocus={e => e.target.select()}
          style={{
            flex: 1, minWidth: 0, width: 0,
            border: 'none', background: 'transparent', outline: 'none',
            fontSize: 38, fontWeight: 400, letterSpacing: -1, color: P.ink,
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", padding: 0,
            lineHeight: 1.1,
          }}
        />
      </div>

      <div className="va-sans" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        fontSize: 12, color: P.dimStrong,
      }}>
        {other.map(c => (
          <div key={c.key} style={{
            display: 'flex', alignItems: 'baseline', gap: 4, minWidth: 0,
          }}>
            <span style={{ color: P.accent, fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>{c.label}</span>
            <span style={{
              fontSize: 13, color: P.ink, fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.symbol} {fmt(c.key, vals[c.key])}</span>
          </div>
        ))}
      </div>

      <div className="va-sans" style={{
        marginTop: 'auto', paddingTop: 8,
        borderTop: '1px dashed rgba(138,90,43,0.3)',
        fontSize: 10, color: P.accent,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          €1 = ${fxEurUsd.toFixed(2)} · Rp {Math.round(fxEurIdr).toLocaleString('id-ID')}
        </span>
        <button onClick={refresh} disabled={fetching} style={{
          border: 'none', background: 'transparent',
          color: error ? P.danger : P.accent,
          cursor: fetching ? 'wait' : 'pointer',
          fontSize: 10, fontWeight: 600, fontFamily: 'inherit',
          padding: 0, textDecoration: 'underline', whiteSpace: 'nowrap',
        }}>{fetching ? 'updating…' : error ? 'offline · retry' : timeAgo()}</button>
      </div>
    </div>
  );
}

function AddTaskDialog({ lane, state, setState, onClose, categories }) {
  const [text, setText] = React.useState('');
  const [cat, setCat] = React.useState('Visa docs');
  const [due, setDue] = React.useState('Soon');
  const [urgency, setUrgency] = React.useState('soon');
  const [alsoLine, setAlsoLine] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [lineStatus, setLineStatus] = React.useState('pending');

  const catNames = Object.keys(categories);
  const urgencyOptions = KD.urgencyOptions;
  const statusOptions = KD.statusOptions;

  const create = () => {
    if (!text.trim()) return;
    const taskId = 'x' + Date.now();
    setState(s => {
      let next = {
        ...s,
        lanes: {
          ...s.lanes,
          [lane]: [...s.lanes[lane], {
            id: taskId, text: text.trim(),
            cat, due: due.trim() || 'TBD', urgency,
          }],
        },
      };
      if (alsoLine) {
        const lineId = 'm-' + Date.now();
        next = {
          ...next,
          money: {
            ...next.money,
            lines: [...next.money.lines, {
              id: lineId, label: text.trim(),
              amountEUR: Number(amount) || 0,
              status: lineStatus, note: '',
              taskIds: [taskId],
            }],
          },
        };
      }
      return KD.logActivity(next, next.meta.currentUser || 'VJ', 'added task', text.trim());
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
              {lane}'s lane
            </div>
            <div style={{
              fontSize: 22, fontWeight: 500, marginTop: 2,
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            }}>Add task</div>
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', fontSize: 20,
            cursor: 'pointer', color: P.dim, padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <FieldLabel>Task</FieldLabel>
          <input autoFocus value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') create(); }}
            placeholder="e.g. Book Germany trip with Hafiz"
            style={fieldStyle()}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <FieldLabel>Due</FieldLabel>
            <input value={due} onChange={e => setDue(e.target.value)}
              style={fieldStyle()}/>
          </div>
          <div>
            <FieldLabel>Urgency</FieldLabel>
            <div style={{ display: 'flex', gap: 5 }}>
              {urgencyOptions.map(u => {
                const active = urgency === u.key;
                return (
                  <button key={u.key} onClick={() => setUrgency(u.key)} style={{
                    border: '1px solid ' + (active ? u.color : P.lineStrong),
                    background: active ? u.color : P.card,
                    color: active ? P.card : u.color,
                    padding: '6px 10px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', flex: 1,
                  }}>{u.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <FieldLabel>Category</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {catNames.map(c => {
              const col = categories[c]; const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
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

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: alsoLine ? P.accentSoft : P.card,
          border: '1px solid ' + (alsoLine ? '#e0cfa8' : P.line),
          cursor: 'pointer', fontSize: 13,
        }}>
          <input type="checkbox" checked={alsoLine}
            onChange={e => setAlsoLine(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: P.accent }}/>
          <span style={{ color: P.ink, fontWeight: 500 }}>
            Also create a linked budget line
          </span>
        </label>

        {alsoLine && (
          <div style={{
            padding: 12, background: P.card, borderRadius: 10,
            border: `1px solid ${P.line}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
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
                  const active = lineStatus === s.key;
                  return (
                    <button key={s.key} onClick={() => setLineStatus(s.key)} style={{
                      border: '1px solid ' + (active ? s.color : P.lineStrong),
                      background: active ? s.color : P.card,
                      color: active ? P.card : s.color,
                      padding: '6px 8px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', flex: 1,
                    }}>{s.label}</button>
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
          <button onClick={create} disabled={!text.trim()} style={{
            background: text.trim() ? P.ink : 'rgba(24,20,15,0.3)',
            color: P.card, border: 'none',
            padding: '8px 16px', borderRadius: 8, fontSize: 12,
            fontWeight: 600, cursor: text.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}>Create</button>
        </div>
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
