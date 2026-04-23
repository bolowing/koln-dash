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
        autoFocus type="number" value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(n); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); } }}
        style={{
          font: 'inherit', color: 'inherit', border: '1.5px solid #9b4722',
          borderRadius: 6, padding: '2px 6px', width: 140,
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

function TaskDetailDrawer({ task, lane, state, setState, onClose }) {
  if (!task) return null;
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(24,20,15,0.25)',
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div style={{
        width: 420, maxWidth: '90%', height: '100%',
        background: '#fbf8f3', borderLeft: '1px solid rgba(24,20,15,0.1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
        padding: '24px 26px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 11, letterSpacing: 0.8, color: '#7a7266', textTransform: 'uppercase' }}>
            {lane}'s lane · {task.urgency === 'asap' ? 'ASAP' : task.due}
          </div>
          <button onClick={onClose} style={{
            border: 'none', background: 'transparent', fontSize: 20,
            cursor: 'pointer', color: '#7a7266', padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <div>
          <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, color: '#1d1a15' }}>
            {task.text}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
            <CategoryChip cat={task.cat} categories={state.categories || KD_DEFAULTS.categories} size="md"/>
            <UrgencyPill urgency={task.urgency} due={task.due}/>
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
      </div>
    </div>
  );
}

Object.assign(window, {
  ui_palette, CategoryChip, UrgencyPill,
  EditableNumber, EditableText, RingProgress, StackedBudgetBar,
  TaskDetailDrawer,
});
