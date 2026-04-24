// Variation A — Cozy single-scroll dashboard.
// Warm paper background, rounded cards, editorial typography.

function VariationA({ onReset }) {
  const [state, setState] = useKDState();
  const [openTask, setOpenTask] = React.useState(null);
  const [tab, setTab] = React.useState('all');
  const isMobile = useIsMobile();

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
      padding: isMobile ? '20px 16px 40px' : '36px 40px 60px',
      position: 'relative',
    }}>
      <style>{`
        .va-sans { font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; }
        .va-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      {/* Masthead */}
      <header style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        gap: isMobile ? 12 : 0,
        paddingBottom: isMobile ? 16 : 22,
        borderBottom: '1px solid rgba(24,20,15,0.12)',
        marginBottom: isMobile ? 20 : 28,
      }}>
        <div>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: '#9b4722', marginBottom: 4,
          }}>Family HQ · {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <h1 style={{
            fontSize: isMobile ? 34 : 56,
            fontWeight: 400, lineHeight: 1,
            margin: 0, letterSpacing: isMobile ? -0.5 : -1,
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
          textAlign: isMobile ? 'left' : 'right',
          fontSize: 12, color: '#57514a', lineHeight: 1.7,
          display: isMobile ? 'flex' : 'block',
          gap: isMobile ? 16 : 0,
          flexWrap: 'wrap',
        }}>
          <div>
            <span style={{ color: '#7a7266' }}>Köln weather · </span>
            <strong style={{ color: '#1d1a15' }}>15°</strong>
            <span style={{ color: '#7a7266' }}> Cloudy</span>
          </div>
          <div>EUR → USD · {state.money.fxEurUsd.toFixed(2)}</div>
        </div>
      </header>

      {/* Hero row */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr 1fr',
        gap: isMobile ? 12 : 18,
        marginBottom: isMobile ? 20 : 28,
      }}>
        <div style={{
          background: '#1d1a15', color: '#f5f1ea',
          borderRadius: 18, padding: isMobile ? '18px 20px' : '22px 26px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6,
          }}>Days until departure</div>
          <div style={{
            fontSize: isMobile ? 76 : 120,
            fontWeight: 400, lineHeight: 1,
            letterSpacing: isMobile ? -2 : -4,
            marginTop: 6,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: isMobile ? 10 : 14,
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
          background: '#fff', borderRadius: 18,
          padding: isMobile ? '18px 20px' : '22px 24px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <RingProgress pct={progress.pct} size={isMobile ? 76 : 92} stroke={8} color="#9b4722"/>
          <div>
            <div className="va-mono" style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#9b4722',
            }}>Prep complete</div>
            <div className="va-sans" style={{ fontSize: isMobile ? 19 : 22, fontWeight: 500, marginTop: 4, lineHeight: 1.2 }}>
              {progress.done} of {progress.total} tasks
            </div>
            <div className="va-sans" style={{ fontSize: 12, color: '#7a7266', marginTop: 2 }}>
              across {Object.keys(cats).length} categories
            </div>
          </div>
        </div>

        <div style={{
          background: '#f4ead9', borderRadius: 18,
          padding: isMobile ? '18px 20px' : '22px 24px',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#8a5a2b',
          }}>Monthly gap · allowance vs costs</div>
          <div style={{ fontSize: isMobile ? 36 : 44, fontWeight: 400, letterSpacing: -1, marginTop: 6, color: '#9a2f3f' }}>
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
      <section style={{ marginBottom: isMobile ? 20 : 28 }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: isMobile ? 8 : 14,
          marginBottom: 14,
        }}>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Money</h2>
          <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>
            Total budget + what's moved so far
          </span>
        </div>

        <div style={{
          background: '#fff', borderRadius: 18,
          padding: isMobile ? '18px 18px' : '24px 26px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 14 : 36,
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
      <section style={{ marginBottom: isMobile ? 20 : 28 }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'baseline',
          justifyContent: 'space-between',
          gap: isMobile ? 10 : 0,
          marginBottom: 14,
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: isMobile ? 8 : 14,
          }}>
            <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Tasks</h2>
            <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>
              {isMobile ? 'Tap a task to open · tap box to check' : 'Tap a task to open · click the box to check off'}
            </span>
          </div>
          <div className="va-sans" style={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
          }}>
            {[['all','All'],['asap','ASAP'],['mine','VJ'],['jul','Jul']].map(([k,label]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                border: 'none',
                background: tab === k ? '#1d1a15' : 'transparent',
                color: tab === k ? '#fff' : '#57514a',
                padding: isMobile ? '8px 16px' : '6px 14px',
                borderRadius: 999, fontSize: 13,
                cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit',
                minHeight: isMobile ? 36 : 'auto',
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 12 : 18,
        }}>
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
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: isMobile ? 8 : 14,
          marginBottom: 14,
        }}>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5 }}>Readiness</h2>
          <span className="va-sans" style={{ fontSize: 12, color: '#7a7266' }}>Readiness by category + timeline</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr',
          gap: isMobile ? 12 : 18,
        }}>
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
            background: '#fff', borderRadius: 18,
            padding: isMobile ? '18px 18px' : '22px 24px',
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
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '52px 1fr' : '60px 1fr auto',
                  gap: isMobile ? 8 : 12,
                  alignItems: 'center',
                }}>
                  <div style={{
                    position: 'absolute', left: 8, top: 6, width: 14, height: 14,
                    borderRadius: '50%',
                    background: i === state.upcoming.length - 1 ? '#1d1a15' : '#fff',
                    border: '2px solid ' + (i === state.upcoming.length - 1 ? '#1d1a15' : '#9b4722'),
                  }}/>
                  <div style={{ fontSize: 11, color: '#9b4722', fontWeight: 600, letterSpacing: 0.5 }}>{u.when}</div>
                  <div style={{
                    fontSize: 13, color: '#1d1a15', fontWeight: 500,
                    display: 'flex', alignItems: 'center',
                    gap: 8, flexWrap: 'wrap',
                    gridColumn: isMobile ? '2 / 3' : 'auto',
                  }}>
                    <span>{u.what}</span>
                    {isMobile && <CategoryChip cat={u.cat} categories={cats}/>}
                  </div>
                  {!isMobile && <CategoryChip cat={u.cat} categories={cats}/>}
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
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 10 : 0,
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
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
  const isMobile = useIsMobile();
  const map = {
    sent:      { color: '#2f7d5b', label: 'Sent' },
    pending:   { color: '#d98a45', label: 'Pending' },
    recurring: { color: '#6b7b8c', label: 'Recurring' },
  };
  const s = map[status] || { color: '#bbb', label: status };
  return (
    <div title={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: s.color }}/>
      {!isMobile && (
        <span style={{ fontSize: 11, color: '#57514a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {s.label}
        </span>
      )}
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
  const isMobile = useIsMobile();
  const boxSize = isMobile ? 22 : 18;
  const hitSize = isMobile ? 32 : 22;
  return (
    <div
      className="va-sans"
      style={{
        display: 'grid',
        gridTemplateColumns: `${hitSize}px 1fr auto`,
        gap: isMobile ? 8 : 10,
        padding: isMobile ? '8px 6px' : '9px 8px',
        borderRadius: 8, cursor: 'pointer',
        transition: 'background .12s',
        alignItems: 'flex-start',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#faf6ef'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onClick={() => onOpen(t)}
    >
      <div
        onClick={e => { e.stopPropagation(); onToggle(t.id); }}
        role="checkbox"
        aria-checked={checked}
        style={{
          width: hitSize, height: hitSize,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: isMobile ? -2 : 0,
          marginLeft: isMobile ? -4 : 0,
        }}
      >
        <div style={{
          width: boxSize, height: boxSize, borderRadius: 5,
          border: '1.5px solid ' + (checked ? '#2f7d5b' : 'rgba(24,20,15,0.35)'),
          background: checked ? '#2f7d5b' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}>
          {checked && (
            <svg width={boxSize - 7} height={boxSize - 7} viewBox="0 0 12 12"><path d="M2 6.5L5 9.5L10 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: isMobile ? 14.5 : 13.5,
          color: '#1d1a15', lineHeight: 1.4,
          textDecoration: checked ? 'line-through' : 'none',
          opacity: checked ? 0.5 : 1,
          overflowWrap: 'anywhere',
        }}>{t.text}</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
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
