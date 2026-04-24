// Shared UI components: CategoryChip, UrgencyPill, EditableNumber, EditableText,
// RingProgress, StackedBudgetBar, TaskDetailDrawer.

const P = KD.palette;

function CategoryChip({ cat, categories, size='sm' }) {
  const c = categories[cat] || { color: '#666', bg: '#eee' };
  const fallback = (KD_DEFAULTS.categories[cat] || {});
  const emoji = c.emoji || fallback.emoji;
  const padding = size==='sm' ? '2px 7px' : '3px 10px';
  const fontSize = size==='sm' ? 10 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color,
      padding, borderRadius: 4,
      fontSize, fontWeight: 600,
      letterSpacing: 0.2,
      fontFamily: 'inherit',
    }}>{emoji && <span aria-hidden="true" style={{ fontSize: fontSize + 1 }}>{emoji}</span>}{cat}</span>
  );
}

function UrgencyPill({ urgency, due }) {
  const color = KD.urgencyColor[urgency] || P.dim;
  const weight = urgency === 'later' ? 500 : 600;
  const tone = { color, weight };
  return (
    <span style={{
      fontSize: 11, color: tone.color, fontWeight: tone.weight,
      marginLeft: 6,
    }}>{due}</span>
  );
}

function EditableNumber({ value, onChange, prefix='', suffix='', style }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => { setDraft(String(value)); }, [value]);

  if (editing) {
    return (
      <input
        className="v1-editable-input"
        autoFocus type="number" inputMode="decimal" value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(n); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); } }}
        style={{
          font: 'inherit', color: 'inherit', border: '1.5px solid #9b4722',
          borderRadius: 6, padding: '2px 6px', width: 140,
          background: P.card, outline: 'none',
          ...style,
        }}
      />
    );
  }
  return (
    <span
      onClick={() => setEditing(true)}
      style={{
        cursor: 'text',
        borderRadius: 4,
        padding: '0 2px',
        transition: 'background .15s',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,71,34,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      title="Click to edit"
    >{prefix}{Number(value).toLocaleString('de-DE')}{suffix}</span>
  );
}

function EditableText({ value, onChange, placeholder='', multiline=false, style }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value || '');
  React.useEffect(() => { setDraft(value || ''); }, [value]);

  const commit = () => { onChange(draft); setEditing(false); };

  if (editing) {
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag
        autoFocus value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter' && !multiline) e.target.blur();
          if (e.key === 'Escape') { setDraft(value || ''); setEditing(false); }
        }}
        placeholder={placeholder}
        style={{
          font: 'inherit', color: 'inherit', border: '1.5px solid #9b4722',
          borderRadius: 6, padding: multiline ? '8px 10px' : '2px 6px',
          background: P.card, outline: 'none',
          width: '100%', resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? 70 : 'auto',
          fontFamily: 'inherit',
          ...style,
        }}
      />
    );
  }
  return (
    <span
      onClick={() => setEditing(true)}
      style={{
        cursor: 'text',
        borderRadius: 4,
        padding: '0 2px',
        color: value ? 'inherit' : P.dimSoft,
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,71,34,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      title="Click to edit"
    >{value ? (multiline ? KD.linkify(value) : value) : placeholder}</span>
  );
}

function RingProgress({ pct, size=64, stroke=6, color=P.accent, bg=P.line }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct/100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset .4s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        fontSize: size/4.5, fontWeight: 600, color: P.ink, lineHeight: 1,
      }}>{pct}%</div>
    </div>
  );
}

function GermanDude({ size = 52, hopping = false, waving = false }) {
  const anim = hopping ? 'kd-hop 0.55s ease'
             : waving  ? 'kd-wave 0.9s ease'
             : 'kd-bob 1.4s ease-in-out infinite';
  return (
    <svg width={size} height={size} viewBox="0 0 64 72" style={{
      display: 'block',
      animation: anim,
      transformOrigin: 'bottom center',
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))',
    }}>
      {/* Legs (walking) */}
      <rect x="26" y="54" width="4" height="12" fill="#2a1d10" rx="1">
        <animateTransform attributeName="transform" type="rotate"
          values="-12 28 54; 12 28 54; -12 28 54" dur="0.7s" repeatCount="indefinite"/>
      </rect>
      <rect x="34" y="54" width="4" height="12" fill="#2a1d10" rx="1">
        <animateTransform attributeName="transform" type="rotate"
          values="12 36 54; -12 36 54; 12 36 54" dur="0.7s" repeatCount="indefinite"/>
      </rect>
      {/* Shoes */}
      <ellipse cx="28" cy="68" rx="4" ry="2" fill="#1a1208"/>
      <ellipse cx="36" cy="68" rx="4" ry="2" fill="#1a1208"/>
      {/* Lederhosen body */}
      <path d="M20 38 Q20 56 26 56 L38 56 Q44 56 44 38 Z" fill="#8a4a22"/>
      {/* Suspender straps */}
      <path d="M25 38 L28 22" stroke="#5a2f12" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M39 38 L36 22" stroke="#5a2f12" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Heart on lederhosen */}
      <path d="M30 46 q0 -2 2 -2 q2 0 2 2 q0 2 -2 4 q-2 -2 -2 -4 z" fill="#d8c060"/>
      {/* Shirt */}
      <path d="M22 22 L22 40 L42 40 L42 22 Z" fill="#f6ead0"/>
      {/* Arms */}
      <path d="M22 26 Q14 32 16 42" stroke="#f0c79a" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M42 26 Q50 30 48 38" stroke="#f0c79a" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Beer mug in right hand */}
      <rect x="46" y="34" width="8" height="10" fill="#f4d76a" stroke="#5a2f12" strokeWidth="1.2" rx="1"/>
      <ellipse cx="50" cy="35" rx="3.5" ry="1.4" fill="#fffdf2"/>
      <path d="M54 36 Q57 37 57 39 Q57 41 54 42" fill="none" stroke="#5a2f12" strokeWidth="1.2"/>
      {/* Head */}
      <circle cx="32" cy="18" r="8" fill="#f0c79a"/>
      {/* Ears */}
      <circle cx="24" cy="18" r="1.6" fill="#e2b384"/>
      <circle cx="40" cy="18" r="1.6" fill="#e2b384"/>
      {/* Eyes */}
      <circle cx="29" cy="17" r="1" fill="#1a1208"/>
      <circle cx="35" cy="17" r="1" fill="#1a1208"/>
      {/* Cheeks */}
      <circle cx="27" cy="20" r="1.4" fill="#e89878" opacity="0.55"/>
      <circle cx="37" cy="20" r="1.4" fill="#e89878" opacity="0.55"/>
      {/* Mustache */}
      <path d="M27 22 Q29 24 32 23 Q35 24 37 22" stroke="#3a2410" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Tyrolean hat */}
      <ellipse cx="32" cy="11" rx="11" ry="1.8" fill="#2f4a2c"/>
      <path d="M24 11 Q26 3 32 3 Q38 3 40 11 Z" fill="#3a5a36"/>
      <path d="M24 11 Q32 13 40 11" stroke="#243d22" strokeWidth="0.8" fill="none"/>
      {/* Hat band */}
      <path d="M25 9 L39 9" stroke="#1f3220" strokeWidth="1.6"/>
      {/* Feather */}
      <path d="M39 9 Q43 4 41 0" stroke="#b8331a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M40 5 L43 6" stroke="#b8331a" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function FundingProgress({ sentEUR, totalEUR }) {
  const pct = totalEUR > 0 ? (sentEUR / totalEUR) * 100 : 0;
  const pctRounded = Math.round(pct);
  const [hopping, setHopping] = React.useState(false);
  const hopTimer = React.useRef(null);

  React.useEffect(() => {
    const onClick = () => {
      setHopping(true);
      clearTimeout(hopTimer.current);
      hopTimer.current = setTimeout(() => setHopping(false), 560);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      clearTimeout(hopTimer.current);
    };
  }, []);

  const dudePos = Math.max(0, Math.min(100, pct));

  return (
    <div style={{ paddingBottom: 18, borderBottom: '1px dashed rgba(24,20,15,0.1)', marginBottom: 18 }}>
      <style>{`
        @keyframes kd-bob {
          0%,100% { transform: translateY(0) rotate(-1.5deg); }
          50%     { transform: translateY(-2px) rotate(1.5deg); }
        }
        @keyframes kd-hop {
          0%   { transform: translateY(0) scale(1,1); }
          25%  { transform: translateY(-14px) scale(1.05, 0.95) rotate(-4deg); }
          55%  { transform: translateY(0) scale(0.96, 1.04); }
          75%  { transform: translateY(-4px) scale(1.02, 0.98) rotate(2deg); }
          100% { transform: translateY(0) scale(1,1); }
        }
        @keyframes kd-wave {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(-8deg); }
        }
      `}</style>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 14, gap: 12, flexWrap: 'wrap',
      }}>
        <div className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: P.accent, fontWeight: 600,
        }}>Funding progress</div>
        <div className="va-sans" style={{ fontSize: 13, color: P.dimStrong }}>
          <span style={{ fontWeight: 600, color: P.ink }}>€{sentEUR.toLocaleString('de-DE')}</span>
          <span style={{ color: P.dim }}> of €{totalEUR.toLocaleString('de-DE')} · </span>
          <span style={{ color: P.accent, fontWeight: 600 }}>{pctRounded}%</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 64 }}>
        <div style={{
          position: 'absolute',
          left: `${dudePos}%`,
          bottom: 4,
          transform: 'translateX(-50%)',
          transition: 'left 0.7s cubic-bezier(.4,.6,.3,1)',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          <GermanDude hopping={hopping}/>
        </div>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 6, borderRadius: 999, background: P.lineSoft,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: 'linear-gradient(90deg, #c8985f 0%, #9b4722 100%)',
            transition: 'width 0.7s cubic-bezier(.4,.6,.3,1)',
            borderRadius: 999,
          }}/>
        </div>
      </div>

      <div className="va-mono" style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
        marginTop: 8,
      }}>
        <span style={{ color: P.dim }}>Jakarta, Indonesia</span>
        <span style={{ color: P.accent, fontWeight: 600 }}>Köln →</span>
      </div>
    </div>
  );
}

function StackedBudgetBar({ lines, totalEUR }) {
  const colors = KD.statusColor;
  return (
    <div>
      <div style={{
        display: 'flex', height: 10, borderRadius: 999,
        overflow: 'hidden', background: P.lineSoft,
      }}>
        {lines.map(l => (
          <div key={l.id} style={{
            width: `${(l.amountEUR/totalEUR)*100}%`,
            background: colors[l.status] || '#bbb',
          }} title={`${l.label} — €${l.amountEUR.toLocaleString('de-DE')}`}/>
        ))}
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 12,
        fontSize: 12, color: P.dimStrong,
      }}>
        {lines.map(l => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              display: 'inline-block', width: 9, height: 9, borderRadius: 999,
              background: colors[l.status] || '#bbb',
            }}/>
            <span>{l.label} (€{l.amountEUR.toLocaleString('de-DE')})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.6 }}>
      <path d="M8.5 1.5l2 2-6.5 6.5H2v-2l6.5-6.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  );
}

function TaskDetailDrawer({ task, lane, state, setState, onClose, onOpenLine }) {
  if (!task) return null;
  const checked = !!state.checked[task.id];
  const noteObj = state.notes[task.id] || { text: '', comments: [] };
  const [draft, setDraft] = React.useState('');
  const author = state.meta.currentUser || 'VJ';
  const setAuthor = (a) => setState(s => ({ ...s, meta: { ...s.meta, currentUser: a } }));

  const update = (fn) => setState(s => {
    const nextNotes = { ...s.notes };
    const cur = nextNotes[task.id] || { text: '', comments: [] };
    nextNotes[task.id] = fn(cur);
    return { ...s, notes: nextNotes };
  });

  const updateTask = (patch) => setState(s => ({
    ...s,
    lanes: {
      ...s.lanes,
      [lane]: s.lanes[lane].map(t => t.id === task.id ? { ...t, ...patch } : t),
    },
  }));

  const deleteTask = () => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setState(s => {
      const nextNotes = { ...s.notes };
      const nextChecked = { ...s.checked };
      delete nextNotes[task.id];
      delete nextChecked[task.id];
      return {
        ...s,
        lanes: { ...s.lanes, [lane]: s.lanes[lane].filter(t => t.id !== task.id) },
        notes: nextNotes,
        checked: nextChecked,
        money: {
          ...s.money,
          lines: s.money.lines.map(l => ({
            ...l, taskIds: (l.taskIds || []).filter(id => id !== task.id),
          })),
        },
      };
    });
    onClose();
  };

  const linkedLines = KD.linkedLines(state, task.id);

  const unlinkLine = (lineId) => setState(s => ({
    ...s,
    money: {
      ...s.money,
      lines: s.money.lines.map(l => l.id === lineId
        ? { ...l, taskIds: (l.taskIds || []).filter(id => id !== task.id) }
        : l),
    },
  }));

  const linkExistingLine = (lineId) => {
    if (!lineId) return;
    setState(s => ({
      ...s,
      money: {
        ...s.money,
        lines: s.money.lines.map(l => l.id === lineId
          ? { ...l, taskIds: Array.from(new Set([...(l.taskIds || []), task.id])) }
          : l),
      },
    }));
  };

  const postComment = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setState(s => {
      const nextNotes = { ...s.notes };
      const cur = nextNotes[task.id] || { text: '', comments: [] };
      nextNotes[task.id] = {
        ...cur,
        comments: [...(cur.comments || []), {
          id: 'c' + Date.now(), author, text, at: new Date().toISOString(),
        }],
      };
      return KD.logActivity({ ...s, notes: nextNotes }, author, 'commented on', task.text);
    });
    setDraft('');
  };

  const categoryNames = Object.keys(state.categories || KD_DEFAULTS.categories);
  const urgencyOptions = KD.urgencyOptions;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
      background: P.overlay,
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div className="v1-drawer" style={{
        width: 420, maxWidth: '90%', height: '100%',
        background: P.drawer, borderLeft: '1px solid rgba(24,20,15,0.1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
        padding: '24px 26px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 11, letterSpacing: 0.8, color: P.dim, textTransform: 'uppercase' }}>
            {lane}'s lane · {task.urgency === 'asap' ? 'ASAP' : task.due}
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', fontSize: 20,
            cursor: 'pointer', color: P.dim, padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            Task <PencilIcon/>
          </div>
          <div style={{
            fontSize: 20, fontWeight: 500, lineHeight: 1.3, color: P.ink,
            border: `1px dashed ${P.lineMid}`, borderRadius: 8,
            padding: '8px 10px', background: P.card,
          }}>
            <EditableText
              value={task.text}
              onChange={(v) => { if (v.trim()) updateTask({ text: v.trim() }); }}
              placeholder="Task title…"
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
              Category
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {categoryNames.map(c => {
                const col = (state.categories || KD_DEFAULTS.categories)[c];
                const active = task.cat === c;
                return (
                  <button key={c} onClick={() => updateTask({ cat: c })} style={{
                    border: active ? '1px solid ' + col.color : '1px solid transparent',
                    cursor: 'pointer',
                    background: active ? col.color : col.bg,
                    color: active ? P.card : col.color,
                    padding: '4px 11px', borderRadius: 4,
                    fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
                    fontFamily: 'inherit',
                    opacity: active ? 1 : 0.85,
                  }}>{c}</button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
                Urgency
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {urgencyOptions.map(u => {
                  const active = task.urgency === u.key;
                  return (
                    <button key={u.key} onClick={() => updateTask({ urgency: u.key })} style={{
                      border: '1px solid ' + (active ? u.color : P.lineStrong),
                      background: active ? u.color : 'transparent',
                      color: active ? P.card : u.color,
                      padding: '4px 11px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>{u.label}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                Due <PencilIcon/>
              </div>
              <div style={{
                fontSize: 13, color: P.ink, fontWeight: 500,
                border: `1px dashed ${P.lineMid}`, borderRadius: 6,
                padding: '5px 9px', background: P.card,
              }}>
                <EditableText
                  value={task.due}
                  onChange={(v) => updateTask({ due: v.trim() || 'TBD' })}
                  placeholder="TBD"
                />
              </div>
            </div>
          </div>
        </div>

        <LinkedLinesBlock
          lines={linkedLines}
          allLines={state.money.lines}
          onOpenLine={onOpenLine}
          onUnlink={unlinkLine}
          onLink={linkExistingLine}
        />

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: checked ? '#eaf2ec' : P.card,
          border: '1px solid ' + (checked ? '#c4dcc9' : P.line),
          cursor: 'pointer', fontSize: 14,
        }}>
          <input type="checkbox" checked={checked}
            onChange={e => setState(s => ({ ...s, checked: { ...s.checked, [task.id]: e.target.checked }}))}
            style={{ width: 18, height: 18, accentColor: P.success }}/>
          <span style={{ color: checked ? P.success : P.ink, fontWeight: 500 }}>
            {checked ? 'Done' : 'Mark as done'}
          </span>
        </label>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
            Notes
          </div>
          <div style={{
            background: P.card, border: `1px solid ${P.line}`, borderRadius: 10,
            padding: 12, minHeight: 80, fontSize: 14, lineHeight: 1.45,
          }}>
            <EditableText
              value={noteObj.text}
              onChange={(v) => update(cur => ({ ...cur, text: v }))}
              placeholder="Add sub-steps, links, or instructions…"
              multiline
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 8 }}>
            Comments
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {(noteObj.comments || []).length === 0 && (
              <div style={{ fontSize: 13, color: P.dimSoft, fontStyle: 'italic' }}>
                No comments yet — leave a note for each other.
              </div>
            )}
            {(noteObj.comments || []).map(c => (
              <div key={c.id} style={{
                background: c.author === 'VJ' ? '#f4ead9' : '#e1ecf7',
                borderRadius: 10, padding: '8px 12px',
                alignSelf: c.author === 'VJ' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
              }}>
                <div style={{ fontSize: 11, color: P.dimStrong, marginBottom: 2, fontWeight: 600 }}>
                  {c.author} · {new Date(c.at).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 13, color: P.ink, lineHeight: 1.4, wordBreak: 'break-word' }}>{KD.linkify(c.text)}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: P.card, border: `1px solid ${P.line}`, borderRadius: 10,
            padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 6, fontSize: 11, color: P.dim, alignItems: 'center' }}>
              Posting as
              {['VJ', 'Jul'].map(a => (
                <button key={a} onClick={() => setAuthor(a)} style={{
                  border: 'none', background: author === a ? P.ink : 'transparent',
                  color: author === a ? P.card : P.dimStrong,
                  padding: '2px 8px', borderRadius: 999, fontSize: 11, cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600,
                }}>{a}</button>
              ))}
            </div>
            <textarea
              value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postComment(); }}
              placeholder="Write a comment… (⌘+Enter to send)"
              style={{
                border: 'none', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', fontSize: 13, minHeight: 50,
                background: 'transparent',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={postComment} style={{
                background: P.ink, color: P.card, border: 'none',
                padding: '6px 14px', borderRadius: 999, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>Post</button>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 12, borderTop: `1px solid ${P.line}`,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={deleteTask} style={{
            border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
            color: P.danger, padding: '6px 12px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Delete task</button>
        </div>
      </div>
    </div>
  );
}

function LinkedLinesBlock({ lines, allLines, onOpenLine, onUnlink, onLink }) {
  const [picking, setPicking] = React.useState(false);
  const available = allLines.filter(l => !lines.some(ll => ll.id === l.id));
  const statusColor = KD.statusColor;

  return (
    <div>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        Linked budget lines
      </div>
      {lines.length === 0 && !picking && (
        <div style={{ fontSize: 12, color: P.dimSoft, fontStyle: 'italic', marginBottom: 6 }}>
          No linked line items.
        </div>
      )}
      {lines.map(l => (
        <div key={l.id} style={{
          background: P.card, border: `1px solid ${P.line}`, borderRadius: 10,
          padding: '8px 10px', marginBottom: 6,
          display: 'grid', gridTemplateColumns: '8px 1fr auto auto', gap: 10, alignItems: 'center',
          cursor: 'pointer',
        }} onClick={() => onOpenLine && onOpenLine(l.id)}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: statusColor[l.status] || '#bbb' }}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: P.ink }}>{l.label}</div>
            <div style={{ fontSize: 11, color: P.dim, marginTop: 1 }}>{l.status}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: P.ink }}>€{(l.amountEUR || 0).toLocaleString('de-DE')}</div>
          <button onClick={e => { e.stopPropagation(); onUnlink(l.id); }} style={{
            border: 'none', background: 'transparent', color: P.danger,
            cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
          }}>Unlink</button>
        </div>
      ))}
      {picking ? (
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <select
            autoFocus
            onChange={e => { if (e.target.value) { onLink(e.target.value); setPicking(false); } }}
            defaultValue=""
            style={{
              flex: 1, fontFamily: 'inherit', fontSize: 12, padding: '6px 8px',
              borderRadius: 8, border: '1px solid rgba(24,20,15,0.15)', background: P.card,
            }}
          >
            <option value="" disabled>Pick a line item…</option>
            {available.map(l => (
              <option key={l.id} value={l.id}>{l.label} · €{(l.amountEUR||0).toLocaleString('de-DE')}</option>
            ))}
          </select>
          <button onClick={() => setPicking(false)} style={{
            border: 'none', background: 'transparent', color: P.dim,
            cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
          }}>Cancel</button>
        </div>
      ) : (
        available.length > 0 && (
          <button onClick={() => setPicking(true)} style={{
            border: `1px dashed ${P.lineDashed}`, background: 'transparent', color: P.dim,
            padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
            fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
          }}>+ Link existing line</button>
        )
      )}
    </div>
  );
}

function LineDetailDrawer({ lineId, state, setState, onClose, onOpenTask }) {
  const line = state.money.lines.find(l => l.id === lineId);
  if (!line) return null;

  const updateLine = (patch) => setState(s => ({
    ...s,
    money: {
      ...s.money,
      lines: s.money.lines.map(l => l.id === line.id ? { ...l, ...patch } : l),
    },
  }));

  const deleteLine = () => {
    if (!confirm('Delete this line item? This cannot be undone.')) return;
    setState(s => ({
      ...s,
      money: { ...s.money, lines: s.money.lines.filter(l => l.id !== line.id) },
    }));
    onClose();
  };

  const allTasks = [
    ...state.lanes.VJ.map(t => ({ ...t, lane: 'VJ' })),
    ...state.lanes.Jul.map(t => ({ ...t, lane: 'Jul' })),
  ];
  const linkedTasks = (line.taskIds || []).map(id => allTasks.find(t => t.id === id)).filter(Boolean);
  const availableTasks = allTasks.filter(t => !(line.taskIds || []).includes(t.id));
  const [picking, setPicking] = React.useState(false);

  const unlinkTask = (taskId) => updateLine({ taskIds: (line.taskIds || []).filter(id => id !== taskId) });
  const linkTask = (taskId) => {
    if (!taskId) return;
    updateLine({ taskIds: Array.from(new Set([...(line.taskIds || []), taskId])) });
  };

  const statusOptions = KD.statusOptions;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
      background: P.overlay, backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div className="v1-drawer" style={{
        width: 420, maxWidth: '90%', height: '100%',
        background: P.drawer, borderLeft: '1px solid rgba(24,20,15,0.1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
        padding: '24px 26px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 11, letterSpacing: 0.8, color: P.dim, textTransform: 'uppercase' }}>
            Budget line · {line.status}
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', fontSize: 20,
            cursor: 'pointer', color: P.dim, padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            Label <PencilIcon/>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 500, lineHeight: 1.3, color: P.ink,
            border: `1px dashed ${P.lineMid}`, borderRadius: 8,
            padding: '8px 10px', background: P.card,
          }}>
            <EditableText
              value={line.label}
              onChange={(v) => { if (v.trim()) updateLine({ label: v.trim() }); }}
              placeholder="Line item label…"
            />
          </div>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                Amount (EUR) <PencilIcon/>
              </div>
              <div style={{
                fontSize: 16, fontWeight: 500, color: P.ink,
                border: `1px dashed ${P.lineMid}`, borderRadius: 6,
                padding: '5px 9px', background: P.card,
              }}>
                €<EditableNumber
                  value={line.amountEUR}
                  onChange={(n) => updateLine({ amountEUR: n })}
                />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
                Status
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {statusOptions.map(s => {
                  const active = line.status === s.key;
                  return (
                    <button key={s.key} onClick={() => updateLine({ status: s.key })} style={{
                      border: '1px solid ' + (active ? s.color : P.lineStrong),
                      background: active ? s.color : 'transparent',
                      color: active ? P.card : s.color,
                      padding: '4px 10px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>{s.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
            Note
          </div>
          <div style={{
            background: P.card, border: `1px solid ${P.line}`, borderRadius: 10,
            padding: 12, minHeight: 50, fontSize: 13, lineHeight: 1.45,
          }}>
            <EditableText
              value={line.note}
              onChange={(v) => updateLine({ note: v })}
              placeholder="Add details, wire reference, etc…"
              multiline
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: P.dim, marginBottom: 6 }}>
            Linked tasks
          </div>
          {linkedTasks.length === 0 && !picking && (
            <div style={{ fontSize: 12, color: P.dimSoft, fontStyle: 'italic', marginBottom: 6 }}>
              No linked tasks.
            </div>
          )}
          {linkedTasks.map(t => (
            <div key={t.id} style={{
              background: P.card, border: `1px solid ${P.line}`, borderRadius: 10,
              padding: '8px 10px', marginBottom: 6,
              display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center',
              cursor: 'pointer',
            }} onClick={() => onOpenTask && onOpenTask(t.id, t.lane)}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: P.ink,
                  textDecoration: state.checked[t.id] ? 'line-through' : 'none',
                  opacity: state.checked[t.id] ? 0.5 : 1,
                }}>{t.text}</div>
                <div style={{ fontSize: 11, color: P.dim, marginTop: 1 }}>{t.lane}'s lane · {t.due}</div>
              </div>
              <CategoryChip cat={t.cat} categories={state.categories || KD_DEFAULTS.categories}/>
              <button onClick={e => { e.stopPropagation(); unlinkTask(t.id); }} style={{
                border: 'none', background: 'transparent', color: P.danger,
                cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              }}>Unlink</button>
            </div>
          ))}
          {picking ? (
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <select
                autoFocus
                onChange={e => { if (e.target.value) { linkTask(e.target.value); setPicking(false); } }}
                defaultValue=""
                style={{
                  flex: 1, fontFamily: 'inherit', fontSize: 12, padding: '6px 8px',
                  borderRadius: 8, border: '1px solid rgba(24,20,15,0.15)', background: P.card,
                }}
              >
                <option value="" disabled>Pick a task…</option>
                {availableTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.lane} · {t.text}</option>
                ))}
              </select>
              <button onClick={() => setPicking(false)} style={{
                border: 'none', background: 'transparent', color: P.dim,
                cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
              }}>Cancel</button>
            </div>
          ) : (
            availableTasks.length > 0 && (
              <button onClick={() => setPicking(true)} style={{
                border: `1px dashed ${P.lineDashed}`, background: 'transparent', color: P.dim,
                padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
              }}>+ Link existing task</button>
            )
          )}
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{
          paddingTop: 12, borderTop: `1px solid ${P.line}`,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={deleteLine} style={{
            border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
            color: P.danger, padding: '6px 12px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Delete line item</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  CategoryChip, UrgencyPill,
  EditableNumber, EditableText, RingProgress, StackedBudgetBar, FundingProgress,
  TaskDetailDrawer, LineDetailDrawer, LinkedLinesBlock, PencilIcon,
});
