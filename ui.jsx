// Shared UI components: CategoryChip, UrgencyPill, EditableNumber, EditableText,
// RingProgress, StackedBudgetBar, TaskDetailDrawer.

const ui_palette = {
  paper: '#f5f1ea',
  card:  '#ffffff',
  ink:   '#1d1a15',
  dim:   '#7a7266',
  line:  'rgba(24,20,15,0.08)',
  accent: '#9b4722',
  accentSoft: '#e8dfd3',
  green: '#2f7d5b',
  amber: '#b67417',
  red:   '#9a2f3f',
};

function CategoryChip({ cat, categories, size='sm' }) {
  const c = categories[cat] || { color: '#666', bg: '#eee' };
  const padding = size==='sm' ? '2px 7px' : '3px 10px';
  const fontSize = size==='sm' ? 10 : 11;
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg, color: c.color,
      padding, borderRadius: 4,
      fontSize, fontWeight: 600,
      letterSpacing: 0.2,
      fontFamily: 'inherit',
    }}>{cat}</span>
  );
}

function UrgencyPill({ urgency, due }) {
  const tone = {
    asap:  { color: '#9a2f3f', weight: 600 },
    soon:  { color: '#b67417', weight: 600 },
    later: { color: '#7a7266', weight: 500 },
  }[urgency] || { color: '#7a7266', weight: 500 };
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
        autoFocus type="number" inputMode="decimal" value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(n); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); } }}
        style={{
          font: 'inherit', color: 'inherit', border: '1.5px solid #9b4722',
          borderRadius: 6, padding: '2px 6px',
          width: '100%', maxWidth: 140,
          background: '#fff', outline: 'none',
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
          background: '#fff', outline: 'none',
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
        color: value ? 'inherit' : '#a8a095',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,71,34,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      title="Click to edit"
    >{value || placeholder}</span>
  );
}

function RingProgress({ pct, size=64, stroke=6, color='#9b4722', bg='rgba(24,20,15,0.08)' }) {
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
        fontSize: size/4.5, fontWeight: 600, color: '#1d1a15', lineHeight: 1,
      }}>{pct}%</div>
    </div>
  );
}

function StackedBudgetBar({ lines, totalEUR }) {
  const colors = {
    sent:      '#2f7d5b',
    pending:   '#d98a45',
    recurring: '#6b7b8c',
  };
  return (
    <div>
      <div style={{
        display: 'flex', height: 10, borderRadius: 999,
        overflow: 'hidden', background: 'rgba(24,20,15,0.06)',
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
        fontSize: 12, color: '#57514a',
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

function TaskDetailDrawer({ task, lane, state, setState, onClose }) {
  if (!task) return null;
  const isMobile = useIsMobile();
  const checked = !!state.checked[task.id];
  const noteObj = state.notes[task.id] || { text: '', comments: [] };
  const [draft, setDraft] = React.useState('');
  const [author, setAuthor] = React.useState(() => localStorage.getItem('kd-author') || 'VJ');

  React.useEffect(() => { localStorage.setItem('kd-author', author); }, [author]);

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
      };
    });
    onClose();
  };

  const postComment = () => {
    if (!draft.trim()) return;
    update(cur => ({
      ...cur,
      comments: [...(cur.comments || []), {
        id: 'c' + Date.now(),
        author, text: draft.trim(),
        at: new Date().toISOString(),
      }],
    }));
    setDraft('');
  };

  const categoryNames = Object.keys(state.categories || KD_DEFAULTS.categories);
  const urgencyOptions = [
    { key: 'asap',  label: 'ASAP',  color: '#9a2f3f' },
    { key: 'soon',  label: 'Soon',  color: '#b67417' },
    { key: 'later', label: 'Later', color: '#7a7266' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(24,20,15,0.25)',
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div style={{
        width: isMobile ? '100%' : 420,
        maxWidth: '100%',
        height: '100%',
        background: '#fbf8f3',
        borderLeft: isMobile ? 'none' : '1px solid rgba(24,20,15,0.1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
        padding: isMobile ? '18px 18px calc(18px + env(safe-area-inset-bottom))' : '24px 26px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'flex', flexDirection: 'column', gap: 18,
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 11, letterSpacing: 0.8, color: '#7a7266', textTransform: 'uppercase' }}>
            {lane}'s lane · {task.urgency === 'asap' ? 'ASAP' : task.due}
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            border: 'none', background: 'transparent',
            fontSize: isMobile ? 28 : 20,
            cursor: 'pointer', color: '#7a7266',
            padding: isMobile ? '4px 8px' : 0,
            marginRight: isMobile ? -8 : 0,
            marginTop: isMobile ? -4 : 0,
            lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            Task <PencilIcon/>
          </div>
          <div style={{
            fontSize: 20, fontWeight: 500, lineHeight: 1.3, color: '#1d1a15',
            border: '1px dashed rgba(24,20,15,0.12)', borderRadius: 8,
            padding: '8px 10px', background: '#fff',
          }}>
            <EditableText
              value={task.text}
              onChange={(v) => { if (v.trim()) updateTask({ text: v.trim() }); }}
              placeholder="Task title…"
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 6 }}>
              Category
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 6 : 5 }}>
              {categoryNames.map(c => {
                const col = (state.categories || KD_DEFAULTS.categories)[c];
                const active = task.cat === c;
                return (
                  <button key={c} onClick={() => updateTask({ cat: c })} style={{
                    border: active ? '1px solid ' + col.color : '1px solid transparent',
                    cursor: 'pointer',
                    background: active ? col.color : col.bg,
                    color: active ? '#fff' : col.color,
                    padding: isMobile ? '7px 12px' : '4px 11px', borderRadius: 4,
                    fontSize: isMobile ? 12 : 11, fontWeight: 600, letterSpacing: 0.2,
                    fontFamily: 'inherit',
                    opacity: active ? 1 : 0.85,
                  }}>{c}</button>
                );
              })}
            </div>
          </div>

          <div style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isMobile ? 10 : 14,
          }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 6 }}>
                Urgency
              </div>
              <div style={{ display: 'flex', gap: isMobile ? 6 : 5, flexWrap: 'wrap' }}>
                {urgencyOptions.map(u => {
                  const active = task.urgency === u.key;
                  return (
                    <button key={u.key} onClick={() => updateTask({ urgency: u.key })} style={{
                      border: '1px solid ' + (active ? u.color : 'rgba(24,20,15,0.15)'),
                      background: active ? u.color : 'transparent',
                      color: active ? '#fff' : u.color,
                      padding: isMobile ? '7px 12px' : '4px 11px', borderRadius: 999,
                      fontSize: isMobile ? 12 : 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>{u.label}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                Due <PencilIcon/>
              </div>
              <div style={{
                fontSize: 13, color: '#1d1a15', fontWeight: 500,
                border: '1px dashed rgba(24,20,15,0.12)', borderRadius: 6,
                padding: '5px 9px', background: '#fff',
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

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: checked ? '#eaf2ec' : '#fff',
          border: '1px solid ' + (checked ? '#c4dcc9' : 'rgba(24,20,15,0.08)'),
          cursor: 'pointer', fontSize: 14,
        }}>
          <input type="checkbox" checked={checked}
            onChange={e => setState(s => ({ ...s, checked: { ...s.checked, [task.id]: e.target.checked }}))}
            style={{ width: 18, height: 18, accentColor: '#2f7d5b' }}/>
          <span style={{ color: checked ? '#2f7d5b' : '#1d1a15', fontWeight: 500 }}>
            {checked ? 'Done' : 'Mark as done'}
          </span>
        </label>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 6 }}>
            Notes
          </div>
          <div style={{
            background: '#fff', border: '1px solid rgba(24,20,15,0.08)', borderRadius: 10,
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
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#7a7266', marginBottom: 8 }}>
            Comments
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {(noteObj.comments || []).length === 0 && (
              <div style={{ fontSize: 13, color: '#a8a095', fontStyle: 'italic' }}>
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
                <div style={{ fontSize: 11, color: '#57514a', marginBottom: 2, fontWeight: 600 }}>
                  {c.author} · {new Date(c.at).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 13, color: '#1d1a15', lineHeight: 1.4 }}>{c.text}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff', border: '1px solid rgba(24,20,15,0.08)', borderRadius: 10,
            padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 6, fontSize: 11, color: '#7a7266', alignItems: 'center' }}>
              Posting as
              {['VJ', 'Jul'].map(a => (
                <button key={a} onClick={() => setAuthor(a)} style={{
                  border: 'none', background: author === a ? '#1d1a15' : 'transparent',
                  color: author === a ? '#fff' : '#57514a',
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
                background: '#1d1a15', color: '#fff', border: 'none',
                padding: '6px 14px', borderRadius: 999, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>Post</button>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 12, borderTop: '1px solid rgba(24,20,15,0.08)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={deleteTask} style={{
            border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
            color: '#9a2f3f', padding: '6px 12px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Delete task</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ui_palette, CategoryChip, UrgencyPill,
  EditableNumber, EditableText, RingProgress, StackedBudgetBar,
  TaskDetailDrawer,
});
