// Variation A — Cozy single-scroll dashboard.
// Warm paper background, rounded cards, editorial typography.

function VariationA({ onReset }) {
  const [state, setState] = useKDState();
  const [openTask, setOpenTask] = React.useState(null);
  const [tab, setTab] = React.useState('all');

  const progress = KD.computeProgress(state);
  const byCat    = KD.progressByCategory(state);
  const totals   = KD.moneyTotals(state);
  const days     = KD.daysUntil(state.meta.departure);
  const cats     = state.categories || KD_DEFAULTS.categories;

  const toggleCheck = (id) => setState(s => ({
    ...s, checked: { ...s.checked, [id]: !s.checked[id] }
  }));

  const addTask = (lane) => {
    const text = prompt('New task for ' + lane + ':');
    if (!text) return;
    const id = 'x' + Date.now();
    setState(s => ({
      ...s,
      lanes: { ...s.lanes, [lane]: [...s.lanes[lane], { id, text, cat: 'Documents', due: 'Soon', urgency: 'soon' }]}
    }));
  };

  const targetDate = new Date(state.meta.departure + 'T00:00:00')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      fontFamily: '"Instrument Serif", Georgia, serif',
      background: '#f5f1ea',
      color: '#1d1a15',
      minHeight: '100%',
      padding: '36px 40px 60px',
      position: 'relative',
    }}>
      <style>{`
        .va-sans { font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; }
        .va-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      {/* Masthead */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingBottom: 22, borderBottom: '1px solid rgba(24,20,15,0.12)',
        marginBottom: 28,
      }}>
        <div>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: '#9b4722', marginBottom: 4,
          }}>Family HQ · {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <h1 style={{
            fontSize: 56, fontWeight: 400, lineHeight: 1,
            margin: 0, letterSpacing: -1,
          }}>
            VJ is moving to <em style={{ color: '#9b4722', fontStyle: 'italic' }}>Köln</em>
          </h1>
          <div className="va-sans" style={{
            fontSize: 13, color: '#57514a', marginTop: 8,
          }}>
            Shared dashboard for Vernon (CBS '26–'27) · updated {new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })}
          </div>
        </div>

        <div className="va-sans" style={{
          textAlign: 'right', fontSize: 12, color: '#57514a', lineHeight: 1.7,
        }}>
          <div style={{ color: '#7a7266' }}>Köln weather</div>
          <div><strong style={{ color: '#1d1a15' }}>15°</strong> · Cloudy</div>
          <div style={{ marginTop: 6 }}>EUR → USD · {state.money.fxEurUsd.toFixed(2)}</div>
        </div>
      </header>

      {/* Hero row */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr',
        gap: 18, marginBottom: 28,
      }}>
        <div style={{
          background: '#1d1a15', color: '#f5f1ea',
          borderRadius: 18, padding: '22px 26px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6,
          }}>Days until departure</div>
          <div style={{
            fontSize: 120, fontWeight: 400, lineHeight: 1, letterSpacing: -4,
            marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 14,
          }}>
            {days}
            <span className="va-sans" style={{
              fontSize: 12, opacity: 0.6, fontWeight: 400,
              letterSpacing: 0,
            }}>Target · {targetDate}</span>
          </div>
          <div className="va-sans" style={{
            fontSize: 12, marginTop: 4, opacity: 0.7,
          }}>
            ≈ {Math.round(days/7)} weeks · {Math.round(days/30)} months
          </div>
        </div>

        <div style={{
          background: '#fff', borderRadius: 18, padding: '22px 24px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <RingProgress pct={progress.pct} size={92} stroke={8} color="#9b4722"/>
          <div>
            <div className="va-mono" style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#9b4722',
            }}>Prep complete</div>
            <div className="va-sans" style={{ fontSize: 22, fontWeight: 500, marginTop: 4, lineHeight: 1.2 }}>
              {progress.done} of {progress.total} tasks
            </div>
            <div className="va-sans" style={{ fontSize: 12, color: '#7a7266', marginTop: 2 }}>
              across {Object.keys(cats).length} categories
            </div>
          </div>
        </div>

        <div style={{
          background: '#f4ead9', borderRadius: 18, padding: '22px 24px',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#8a5a2b',
          }}>Monthly gap · allowance vs costs</div>
          <div style={{ fontSize: 44, fontWeight: 400, letterSpacing: -1, marginTop: 6, color: '#9a2f3f' }}>
            −$86
          </div>
          <div className="va-sans" style={{ fontSize: 12, color: '#57514a', lineHeight: 1.5 }}>
            Fintiba releases <strong>€992/mo</strong>.<br/>
            Est. <strong>€600 living + phone + transit</strong> covered.<br/>
            Discretionary: <strong>~€180</strong>.
          </div>
        </div>
      </section>

      {/* Money */}
      <section style={{ marginBottom: 28 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14,
        }}>
          <h2 style={{ fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Money</h2>
          <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>
            Total budget + what's moved so far
          </span>
        </div>

        <div style={{
          background: '#fff', borderRadius: 18, padding: '24px 26px',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36,
            paddingBottom: 18, borderBottom: '1px dashed rgba(24,20,15,0.1)',
          }}>
            <MoneyStat label="Total budget" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>€</span>
                <EditableNumber
                  value={totals.totalEUR}
                  onChange={() => {}}
                  style={{ pointerEvents: 'none' }}
                /></>
            } sub={`≈ $${Math.round(totals.totalEUR * totals.eurToUsd).toLocaleString()} USD`}/>
            <MoneyStat label="Sent so far" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>€</span>
                <EditableNumber
                  value={Math.round(state.money.sentUSD / totals.eurToUsd)}
                  onChange={(n) => setState(s => ({ ...s, money: { ...s.money, sentUSD: Math.round(n * s.money.fxEurUsd) }}))}
                /></>
            } sub={`${Math.round((state.money.sentUSD/totals.eurToUsd)/totals.totalEUR * 100)}% of total`}/>
            <MoneyStat label="USD wired" value={
              <><span className="va-sans" style={{ fontSize: 13 }}>$</span>
                <EditableNumber
                  value={state.money.sentUSD}
                  onChange={(n) => setState(s => ({ ...s, money: { ...s.money, sentUSD: n }}))}
                /></>
            } sub="Merrill → CBS · Wire 1"/>
          </div>

          <div style={{ paddingTop: 18 }}>
            <StackedBudgetBar lines={state.money.lines} totalEUR={totals.totalEUR}/>
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {state.money.lines.map((line, i) => (
              <div key={line.id} className="va-sans" style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto',
                gap: 16, alignItems: 'center',
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(24,20,15,0.06)',
                fontSize: 13,
              }}>
                <div>
                  <div style={{ color: '#1d1a15', fontWeight: 500 }}>{line.label}</div>
                  <div style={{ color: '#7a7266', fontSize: 11, marginTop: 1 }}>{line.note}</div>
                </div>
                <StatusDot status={line.status}/>
                <div style={{ fontFamily: 'inherit', fontWeight: 500, minWidth: 90, textAlign: 'right' }}>
                  <EditableNumber
                    prefix="€"
                    value={line.amountEUR}
                    onChange={(n) => setState(s => ({
                      ...s, money: { ...s.money, lines: s.money.lines.map(l => l.id === line.id ? { ...l, amountEUR: n } : l) }
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks */}
      <section style={{ marginBottom: 28 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <h2 style={{ fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Tasks</h2>
            <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>Tap a task to open · click the box to check off</span>
          </div>
          <div className="va-sans" style={{ display: 'flex', gap: 4 }}>
            {[['all','All'],['asap','ASAP'],['mine','VJ'],['jul','Jul']].map(([k,label]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                border: 'none',
                background: tab === k ? '#1d1a15' : 'transparent',
                color: tab === k ? '#fff' : '#57514a',
                padding: '6px 14px', borderRadius: 999, fontSize: 12,
                cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit',
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Lane
            title="VJ's lane" lane="VJ"
            visible={tab === 'all' || tab === 'asap' || tab === 'mine'}
            filterASAP={tab === 'asap'}
            state={state} setState={setState}
            onOpen={(t) => setOpenTask({ task: t, lane: 'VJ' })}
            onAdd={() => addTask('VJ')}
            onToggle={toggleCheck}
            categories={cats}
          />
          <Lane
            title="Jul's lane" lane="Jul"
            visible={tab === 'all' || tab === 'asap' || tab === 'jul'}
            filterASAP={tab === 'asap'}
            state={state} setState={setState}
            onOpen={(t) => setOpenTask({ task: t, lane: 'Jul' })}
            onAdd={() => addTask('Jul')}
            onToggle={toggleCheck}
            categories={cats}
          />
        </div>
      </section>

      {/* Readiness */}
      <section style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
          <h2 style={{ fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Readiness</h2>
          <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>Readiness by category + timeline</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(byCat).map(([cat, d]) => (
              <div key={cat} style={{
                background: '#fff', borderRadius: 14, padding: '14px 16px',
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 10,
              }}>
                <div>
                  <div className="va-sans" style={{
                    fontSize: 13, fontWeight: 600, color: cats[cat].color,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                      background: cats[cat].color,
                    }}/>
                    {cat}
                  </div>
                  <div className="va-sans" style={{ fontSize: 11, color: '#7a7266', marginTop: 6 }}>
                    Next: {d.next}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="va-sans" style={{ fontSize: 22, fontWeight: 500, color: '#1d1a15', lineHeight: 1 }}>
                    {d.pct}%
                  </div>
                  <div className="va-sans" style={{ fontSize: 10, color: '#7a7266' }}>
                    {d.done}/{d.total}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff', borderRadius: 18, padding: '22px 24px',
            position: 'relative',
          }}>
            <div className="va-mono" style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: '#9b4722', marginBottom: 14,
            }}>Timeline · what's next</div>
            <div style={{ position: 'relative', paddingLeft: 4 }}>
              <div style={{
                position: 'absolute', left: 14, top: 10, bottom: 10, width: 2,
                background: 'linear-gradient(#e8dfd3, #9b4722 30%, #1d1a15)',
              }}/>
              {state.upcoming.map((u, i) => (
                <div key={i} className="va-sans" style={{
                  position: 'relative', paddingLeft: 36, marginBottom: 14,
                  display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12,
                  alignItems: 'center',
                }}>
                  <div style={{
                    position: 'absolute', left: 8, top: 6, width: 14, height: 14,
                    borderRadius: '50%',
                    background: i === state.upcoming.length - 1 ? '#1d1a15' : '#fff',
                    border: '2px solid ' + (i === state.upcoming.length - 1 ? '#1d1a15' : '#9b4722'),
                  }}/>
                  <div style={{ fontSize: 11, color: '#9b4722', fontWeight: 600, letterSpacing: 0.5 }}>{u.when}</div>
                  <div style={{ fontSize: 13, color: '#1d1a15', fontWeight: 500 }}>{u.what}</div>
                  <CategoryChip cat={u.cat} categories={cats}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="va-sans" style={{
        marginTop: 30, paddingTop: 16,
        borderTop: '1px solid rgba(24,20,15,0.08)',
        fontSize: 11, color: '#9b8f7f',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>Numbers and checkboxes save automatically (this browser).</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span>{state.meta.program}</span>
          {onReset && (
            <button onClick={onReset} style={{
              border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
              color: '#9a2f3f', padding: '4px 10px', borderRadius: 6,
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
        />
      )}
    </div>
  );
}

function MoneyStat({ label, value, sub }) {
  return (
    <div>
      <div className="va-mono" style={{
        fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#7a7266',
      }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 6 }}>
        {value}
      </div>
      <div className="va-sans" style={{ fontSize: 11, color: '#7a7266', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    sent:      { color: '#2f7d5b', label: 'Sent' },
    pending:   { color: '#d98a45', label: 'Pending' },
    recurring: { color: '#6b7b8c', label: 'Recurring' },
  };
  const s = map[status] || { color: '#bbb', label: status };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: s.color }}/>
      <span style={{ fontSize: 11, color: '#57514a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {s.label}
      </span>
    </div>
  );
}

function Lane({ title, lane, visible, filterASAP, state, onOpen, onAdd, onToggle, categories }) {
  if (!visible) return <div/>;
  const lp = KD.laneProgress(state, lane);
  let tasks = state.lanes[lane];
  if (filterASAP) tasks = tasks.filter(t => t.urgency === 'asap');

  return (
    <div style={{
      background: '#fff', borderRadius: 18, padding: '20px 20px 14px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingBottom: 12, borderBottom: '1px solid rgba(24,20,15,0.06)',
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 20, fontWeight: 400, letterSpacing: -0.3,
          fontFamily: '"Instrument Serif", Georgia, serif',
        }}>{title}</div>
        <div className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>
          <strong style={{ color: '#1d1a15', fontWeight: 600 }}>{lp.done}</strong> / {lp.total}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map(t => (
          <TaskRow key={t.id} t={t} lane={lane}
            checked={!!state.checked[t.id]}
            hasNotes={!!(state.notes[t.id] && (state.notes[t.id].text || (state.notes[t.id].comments||[]).length))}
            commentCount={(state.notes[t.id]?.comments||[]).length}
            onOpen={onOpen} onToggle={onToggle} categories={categories}
          />
        ))}
      </div>

      <button onClick={onAdd} className="va-sans" style={{
        marginTop: 10, border: '1px dashed rgba(24,20,15,0.18)',
        background: 'transparent', color: '#7a7266',
        padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
        fontSize: 12, width: '100%', fontFamily: 'inherit', fontWeight: 500,
      }}>+ Add task to {lane}'s lane</button>
    </div>
  );
}

function TaskRow({ t, checked, hasNotes, commentCount, onOpen, onToggle, categories }) {
  return (
    <div
      className="va-sans"
      style={{
        display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 10,
        padding: '9px 8px', borderRadius: 8, cursor: 'pointer',
        transition: 'background .12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#faf6ef'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onClick={() => onOpen(t)}
    >
      <div onClick={e => { e.stopPropagation(); onToggle(t.id); }} style={{
        width: 18, height: 18, borderRadius: 5, marginTop: 2,
        border: '1.5px solid ' + (checked ? '#2f7d5b' : 'rgba(24,20,15,0.35)'),
        background: checked ? '#2f7d5b' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5L5 9.5L10 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <div>
        <div style={{
          fontSize: 13.5, color: '#1d1a15', lineHeight: 1.4,
          textDecoration: checked ? 'line-through' : 'none',
          opacity: checked ? 0.5 : 1,
        }}>{t.text}</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CategoryChip cat={t.cat} categories={categories}/>
          <UrgencyPill urgency={t.urgency} due={t.due}/>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 4, paddingTop: 2,
        color: '#a8a095', fontSize: 11,
      }}>
        {commentCount > 0 && (
          <span title={commentCount + ' comments'} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 3h10v7H5l-3 3V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            {commentCount}
          </span>
        )}
        {hasNotes && !commentCount && (
          <span title="Has notes" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: '#9b4722' }}/>
        )}
      </div>
    </div>
  );
}

window.VariationA = VariationA;
