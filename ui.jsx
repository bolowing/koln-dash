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

// German phrases the dude teaches. Grouped by theme so we can bias
// selection by what the user is actually working on.
const GERMAN_PHRASES = {
  greetings: [
    { de: "Hallo!",          en: "Hello!",                     say: "HAH-loh",           tip: "Works any time of day, with anyone. Safe default." },
    { de: "Guten Morgen!",   en: "Good morning!",              say: "GOO-tun MOR-gun",   tip: "Until about 11am. After that, switch to 'Guten Tag'." },
    { de: "Guten Tag!",      en: "Good day!",                  say: "GOO-tun tahk",      tip: "Polite, neutral. Use with strangers, shopkeepers, anyone older." },
    { de: "Tschüss!",        en: "Bye!",                       say: "chooss",            tip: "Universal casual goodbye. Even the Tagesschau anchors say it." },
    { de: "Bis später!",     en: "See you later!",             say: "biss SHPAY-tuh",    tip: "Friendly sign-off when you'll see them soon." },
    { de: "Bis morgen!",     en: "See you tomorrow!",          say: "biss MOR-gun",      tip: "End-of-workday classic." },
    { de: "Servus!",         en: "Hi/Bye! (southern)",         say: "ZER-voos",          tip: "Bavaria/Austria flavor. In Köln, locals say 'Tach'." },
  ],
  basics: [
    { de: "Ja.",             en: "Yes.",                       say: "yah",               tip: "The first word everyone learns. Sometimes drawn out: jaaa." },
    { de: "Nein.",           en: "No.",                        say: "nine",              tip: "Said politely with 'nein, danke' — no, thanks." },
    { de: "Bitte.",          en: "Please / You're welcome.",   say: "BIT-tuh",           tip: "One word, two meanings. Also: 'here you go' when handing something over." },
    { de: "Danke.",          en: "Thanks.",                    say: "DAHN-kuh",          tip: "Add 'schön' or 'sehr' to be extra polite: Danke schön." },
    { de: "Entschuldigung.", en: "Excuse me / Sorry.",         say: "ent-SHOOL-dee-goong", tip: "For bumping into someone OR getting their attention." },
    { de: "Kein Problem.",   en: "No problem.",                say: "kine pro-BLAYM",    tip: "Reply when someone apologizes. Casual and warm." },
    { de: "Vielleicht.",     en: "Maybe.",                     say: "fee-LYKHT",         tip: "The German way of dodging a commitment." },
  ],
  smalltalk: [
    { de: "Wie geht's?",            en: "How's it going?",            say: "vee gates",                  tip: "Casual. Reply: 'Gut, danke' or 'Nicht schlecht' (not bad)." },
    { de: "Wie heißt du?",           en: "What's your name?",          say: "vee hyst doo",               tip: "Casual 'du' form. Use 'wie heißen Sie?' with strangers." },
    { de: "Ich heiße Jul.",          en: "My name is Jul.",            say: "ikh HY-suh",                 tip: "Or just: 'Ich bin Jul' — I'm Jul. Both work." },
    { de: "Woher kommst du?",        en: "Where are you from?",        say: "vo-HAIR komst doo",          tip: "Germans love this question. Have your answer ready." },
    { de: "Ich komme aus Indonesien.", en: "I'm from Indonesia.",      say: "ikh KOM-uh ows in-doh-NAY-zee-un", tip: "Expect follow-up questions about food and beaches." },
    { de: "Ich lerne noch Deutsch.", en: "I'm still learning German.", say: "ikh LER-nuh nokh doytch",    tip: "Disarms locals — they'll slow down (or switch to English)." },
    { de: "Sprechen Sie Englisch?",  en: "Do you speak English?",      say: "SHPREKH-un zee ENG-lish",    tip: "In Köln, almost always yes. Try German first anyway." },
    { de: "Alles klar.",             en: "All good. / Got it.",        say: "AHL-us klar",                tip: "Conversational glue. Sprinkle everywhere." },
    { de: "Genau.",                  en: "Exactly.",                   say: "guh-NOW",                    tip: "The most German word. Use it to sound fluent instantly." },
    { de: "Wirklich?",               en: "Really?",                    say: "VEERK-likh",                 tip: "Show interest. Or skepticism." },
  ],
  numbers: [
    { de: "eins, zwei, drei",     en: "one, two, three",            say: "ines, tsvy, dry",            tip: "The first three. The rest follow patterns once you've got these." },
    { de: "vier, fünf, sechs",    en: "four, five, six",            say: "feer, fuunf, zex",           tip: "Practice ordering 'sechs Brötchen' — six bread rolls — at the bakery." },
    { de: "Wie viel kostet das?", en: "How much does that cost?",   say: "vee feel KOS-tut dahss",     tip: "Universal shopping phrase." },
    { de: "Zwei Euro fünfzig.",   en: "Two euros fifty.",           say: "tsvy OY-roh FUUNF-tsikh",    tip: "Cents come after, no decimal point in speech." },
    { de: "Ein bisschen.",        en: "A little.",                  say: "ine BISS-khun",              tip: "Use for 'a little German', 'a little sugar', everything." },
    { de: "Sehr viel.",           en: "A lot.",                     say: "zair feel",                  tip: "Opposite of ein bisschen." },
  ],
  ordering: [
    { de: "Ich hätte gern…",      en: "I'd like…",                  say: "ikh HET-tuh gairn",          tip: "The polite way to order anything. Hätte = would have." },
    { de: "Ein Kaffee, bitte.",   en: "One coffee, please.",        say: "ine KAH-fay BIT-tuh",        tip: "In Germany, Kaffee usually means a small black coffee." },
    { de: "Ein Kölsch, bitte.",   en: "One Kölsch, please.",        say: "ine kurlsh BIT-tuh",         tip: "Köln's local beer. Comes in tiny 0.2L glasses to stay fresh." },
    { de: "Noch eins, bitte!",    en: "Another one, please!",       say: "nokh ines BIT-tuh",          tip: "Köbes (waiters) refill automatically. Coaster on top = stop." },
    { de: "Die Rechnung, bitte.", en: "The bill, please.",          say: "dee REKH-noong BIT-tuh",     tip: "Tip ~10% — say the rounded total when paying, don't leave coins." },
    { de: "Zum Mitnehmen.",       en: "To take away.",              say: "tsoom MIT-nay-mun",          tip: "Versus 'zum hier essen' — to eat in." },
    { de: "Prost!",               en: "Cheers!",                    say: "prohst",                     tip: "Eye contact when clinking. Otherwise: 7 years bad luck (allegedly)." },
    { de: "Guten Appetit!",       en: "Enjoy your meal!",           say: "GOO-tun ah-puh-TEET",        tip: "Said before eating. Reply: 'Danke, gleichfalls' — same to you." },
  ],
  gettingaround: [
    { de: "Wo ist…?",                  en: "Where is…?",            say: "voh ist",                    tip: "The most useful question word combo. Add anything: Wo ist der Bahnhof? Die Toilette?" },
    { de: "Wie komme ich nach Köln?",  en: "How do I get to Köln?", say: "vee KOM-uh ikh nakh kurln",  tip: "'Nach' for cities and countries. 'Zu' for specific places." },
    { de: "Links / rechts / geradeaus.", en: "Left / right / straight.", say: "links / rekhts / guh-RAH-duh-ows", tip: "Survival kit for following directions." },
    { de: "Ist dieser Platz frei?",     en: "Is this seat free?",   say: "ist DEE-zuh plahts fry",     tip: "Polite way to claim a seat on a packed train." },
    { de: "Ich verstehe nicht.",        en: "I don't understand.",  say: "ikh fer-SHTAY-uh nikht",     tip: "Better than nodding politely while lost." },
    { de: "Können Sie das wiederholen?", en: "Can you repeat that?", say: "KUR-nun zee dahss vee-duh-HOH-lun", tip: "Useful when locals speak at warp speed." },
  ],
  schimpfwoerter: [
    { de: "Scheiße!",                       en: "Shit!",                                 say: "SHY-suh",                       tip: "The all-purpose exclamation. Heard hourly on every German street." },
    { de: "Mist!",                          en: "Damn! / Crap!",                         say: "mist",                          tip: "PG version of Scheiße. Safe in front of your boss." },
    { de: "Verdammt!",                      en: "Damn it!",                              say: "fer-DAHMT",                     tip: "When you stub your toe on IKEA furniture." },
    { de: "Quatsch!",                       en: "Nonsense! / No way!",                   say: "kvatch",                        tip: "Friendly disbelief. 'Quatsch mit Soße' = nonsense with sauce." },
    { de: "Ach du Scheibenkleister!",       en: "Oh, window paste!",                     say: "akh doo SHY-bun-kly-stuh",      tip: "Hilariously G-rated 'oh shit'. Literally 'window glue'. Use in front of grandmas." },
    { de: "Verpiss dich!",                  en: "Piss off!",                             say: "fer-PISS dikh",                 tip: "Strong. Save for actual jerks, not friends." },
    { de: "Du gehst mir auf den Keks.",     en: "You're getting on my biscuit.",         say: "doo gayst meer owf dayn keks",  tip: "= 'on my nerves'. Adorable insult." },
    { de: "Halt die Klappe!",               en: "Shut your trap!",                       say: "hahlt dee KLAH-puh",            tip: "Rude but not nuclear. Klappe = the flap/lid." },
    { de: "Leck mich!",                     en: "Bite me!",                              say: "lek mikh",                      tip: "Short for the Goethe quote 'Leck mich am Arsch'. A literary insult." },
    { de: "Arschkalt",                      en: "Ass-cold",                              say: "ARSH-kahlt",                    tip: "Useful for Köln in February. 'Es ist arschkalt draußen!'" },
    { de: "Das ist mir wurst.",             en: "That's sausage to me.",                 say: "dahss ist meer voorst",         tip: "= 'I don't care'. Peak German philosophy." },
    { de: "Jetzt haben wir den Salat.",     en: "Now we have the salad.",                say: "yetst HAH-bun veer dayn zah-LAHT", tip: "= 'Now we're in a mess.' Said when the plan goes sideways." },
    { de: "Ich glaub mein Schwein pfeift.", en: "I think my pig is whistling.",          say: "ikh glowb mine shvine pfyft",   tip: "= 'You've gotta be kidding me.' Surreal disbelief." },
    { de: "Tomaten auf den Augen haben.",   en: "To have tomatoes on your eyes.",        say: "toh-MAH-tun owf dayn OW-gun HAH-bun", tip: "= 'To not see something obvious.' Useful when someone misses the joke." },
  ],
};

// Map task categories → phrase themes, so the dude leans into relevant
// vocab when you have lots of open work in that area. Light touch only —
// most rotations stay general/casual.
const CATEGORY_TO_THEME = {
  Travel: 'gettingaround', Transit: 'gettingaround',
  Food: 'ordering', Café: 'ordering', Cafe: 'ordering',
};

// Picks what the dude should say. Mostly a German phrase, occasionally
// a milestone reaction. Cycle index lets clicks rotate through phrases.
function pickDudeContent(state, progress, byCat, cycle) {
  const allTasks = [...state.lanes.VJ, ...state.lanes.Jul];
  const asap = allTasks.filter(t => t.urgency === 'asap' && !state.checked[t.id]);

  // Phrases are the default. Milestones only trigger if the user
  // explicitly cycles into the milestone slot (every 7th cycle), so
  // they don't get in the way of learning.
  if (cycle > 0 && cycle % 7 === 0) {
    if (progress.total > 0 && progress.pct >= 100) {
      return { kind: 'milestone', text: "Alles fertig! Kölsch is on me. 🍺" };
    }
    if (asap.length >= 8) {
      return { kind: 'milestone', text: `${asap.length} ASAPs stacking up. Schnell, schnell!` };
    }
  }

  // Bias theme by which categories have the most open work.
  const openByCat = {};
  allTasks.forEach(t => {
    if (!state.checked[t.id]) openByCat[t.cat] = (openByCat[t.cat] || 0) + 1;
  });
  const topCats = Object.entries(openByCat).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  // Default rotation skews to beginner/casual stuff.
  const themes = ['greetings', 'basics', 'smalltalk', 'numbers', 'ordering', 'schimpfwoerter'];
  for (const c of topCats) {
    const theme = CATEGORY_TO_THEME[c];
    if (theme && !themes.includes(theme)) themes.unshift(theme);
  }
  // Every 5th cycle, force schimpfwörter for the lulz.
  const theme = (cycle % 5 === 4)
    ? 'schimpfwoerter'
    : themes[cycle % themes.length];

  const list = GERMAN_PHRASES[theme] || GERMAN_PHRASES.greetings;
  const phrase = list[Math.floor(cycle / themes.length) % list.length];
  return { kind: 'phrase', theme, ...phrase };
}

function speakGerman(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const de = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('de'));
    if (de) u.voice = de;
    window.speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}

function OverallProgress({ state }) {
  const progress = KD.computeProgress(state);
  const byCat = KD.progressByCategory(state);
  const pct = progress.pct;
  const pctRounded = Math.round(pct);
  const [hopping, setHopping] = React.useState(false);
  const [cycle, setCycle] = React.useState(0);
  const [showTip, setShowTip] = React.useState(false);
  const hopTimer = React.useRef(null);

  const handleDudeClick = (e) => {
    e.stopPropagation();
    setHopping(true);
    setCycle(c => c + 1);
    setShowTip(false);
    clearTimeout(hopTimer.current);
    hopTimer.current = setTimeout(() => setHopping(false), 560);
  };

  React.useEffect(() => () => clearTimeout(hopTimer.current), []);

  const dudePos = Math.max(0, Math.min(100, pct));
  // Bubble is wider now — clamp the anchor further from the edges.
  const bubblePos = Math.max(28, Math.min(72, dudePos));
  const content = pickDudeContent(state, progress, byCat, cycle);
  const isPhrase = content.kind === 'phrase';

  const themeLabel = isPhrase ? ({
    greetings: 'Greetings',
    basics: 'The basics',
    smalltalk: 'Small talk',
    numbers: 'Numbers & money',
    ordering: 'Café & Kneipe',
    gettingaround: 'Getting around',
    schimpfwoerter: 'Schimpfwörter 🤬',
  })[content.theme] : null;

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
        @keyframes kd-bubble-in {
          0%   { opacity: 0; transform: translate(-50%, 4px) scale(0.94); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .kd-bubble-btn {
          background: transparent;
          border: 1px solid ${P.lineMid};
          color: ${P.dimStrong};
          font: inherit;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .kd-bubble-btn:hover { background: ${P.accent}; color: #fff; border-color: ${P.accent}; }
      `}</style>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 14, gap: 12, flexWrap: 'wrap',
      }}>
        <div className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: P.accent, fontWeight: 600,
        }}>Overall progress</div>
        <div className="va-sans" style={{ fontSize: 13, color: P.dimStrong }}>
          <span style={{ fontWeight: 600, color: P.ink }}>{progress.done}</span>
          <span style={{ color: P.dim }}> of {progress.total} tasks · </span>
          <span style={{ color: P.accent, fontWeight: 600 }}>{pctRounded}%</span>
        </div>
      </div>

      <div style={{ position: 'relative', minHeight: 168, paddingTop: showTip ? 132 : 108 }}>
        {/* Speech bubble — wider, multi-line, interactive */}
        <div key={cycle} style={{
          position: 'absolute',
          left: `${bubblePos}%`,
          top: 0,
          transform: 'translateX(-50%)',
          width: 'min(360px, 92%)',
          animation: 'kd-bubble-in 0.35s ease',
          zIndex: 3,
        }}>
          <div className="va-sans" style={{
            position: 'relative',
            background: P.card,
            color: P.ink,
            border: `1px solid ${P.lineMid}`,
            borderRadius: 14,
            padding: '10px 14px 12px',
            boxShadow: '0 4px 14px rgba(24,20,15,0.08)',
          }}>
            {isPhrase && themeLabel && (
              <div className="va-mono" style={{
                fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase',
                color: P.accent, fontWeight: 700, marginBottom: 4,
              }}>{themeLabel}</div>
            )}
            {isPhrase ? (
              <>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: P.ink,
                  lineHeight: 1.25, marginBottom: 3,
                }}>
                  <span style={{ color: P.accent, marginRight: 4 }}>“</span>
                  {content.de}
                  <span style={{ color: P.accent, marginLeft: 2 }}>”</span>
                </div>
                <div style={{ fontSize: 12.5, color: P.dimStrong, fontStyle: 'italic', lineHeight: 1.35 }}>
                  {content.en}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8, marginTop: 8, flexWrap: 'wrap',
                }}>
                  <div className="va-mono" style={{ fontSize: 10, color: P.dim, letterSpacing: 0.5 }}>
                    /{content.say}/
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="kd-bubble-btn"
                      onClick={(e) => { e.stopPropagation(); speakGerman(content.de); }}
                      title="Hear it"
                    >🔊 Say</button>
                    <button
                      className="kd-bubble-btn"
                      onClick={(e) => { e.stopPropagation(); setShowTip(t => !t); }}
                      title="Show context"
                    >{showTip ? '× Hide' : '? Tip'}</button>
                    <button
                      className="kd-bubble-btn"
                      onClick={handleDudeClick}
                      title="Next phrase"
                    >Next →</button>
                  </div>
                </div>
                {showTip && (
                  <div style={{
                    marginTop: 8, paddingTop: 8,
                    borderTop: `1px dashed ${P.lineSoft}`,
                    fontSize: 12, color: P.dimStrong, lineHeight: 1.4,
                  }}>
                    💡 {content.tip}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 13.5, color: P.ink, fontStyle: 'italic', lineHeight: 1.4 }}>
                <span style={{ color: P.accent, marginRight: 4 }}>“</span>
                {content.text}
                <span style={{ color: P.accent, marginLeft: 2 }}>”</span>
              </div>
            )}
            {/* Pointer */}
            <div style={{
              position: 'absolute',
              left: `${Math.max(8, Math.min(92, 50 + (dudePos - bubblePos)))}%`,
              bottom: -6,
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10, height: 10,
              background: P.card,
              borderRight: `1px solid ${P.lineMid}`,
              borderBottom: `1px solid ${P.lineMid}`,
            }}/>
          </div>
        </div>

        {/* The dude walks the bar — now click target */}
        <div
          onClick={handleDudeClick}
          title="Click for the next phrase"
          style={{
            position: 'absolute',
            left: `${dudePos}%`,
            bottom: 4,
            transform: 'translateX(-50%)',
            transition: 'left 0.7s cubic-bezier(.4,.6,.3,1)',
            cursor: 'pointer',
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
            background: 'linear-gradient(90deg, #e8b07e 0%, #c14a1c 100%)',
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

// ASCII-vibes light/dark toggle. Lives in the masthead. Reads/writes
// state.ui.theme and pushes the active theme onto <html data-theme>.
function ThemeToggle({ state, setState }) {
  const theme = (state.ui && state.ui.theme) || 'light';
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const setTheme = (t) => setState(s => ({
    ...s, ui: { ...s.ui, theme: t },
  }));
  const segStyle = (active) => ({
    cursor: 'pointer',
    background: active ? P.accent : 'transparent',
    color: active ? P.card : P.dim,
    border: 'none',
    padding: '4px 9px',
    font: 'inherit',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: 700,
    transition: 'background 0.18s ease, color 0.18s ease',
  });
  return (
    <div className="va-mono" style={{
      display: 'inline-flex', alignItems: 'center',
      border: `1px solid ${P.lineMid}`,
      borderRadius: 4, overflow: 'hidden',
      background: P.card,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <span aria-hidden="true" style={{
        padding: '4px 6px 4px 8px', color: P.dimSoft,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10, letterSpacing: 1,
      }}>[</span>
      <button onClick={() => setTheme('light')} style={segStyle(theme === 'light')} title="Light theme">
        {theme === 'light' ? '☀ SUN' : 'SUN'}
      </button>
      <span aria-hidden="true" style={{ color: P.dimSoft, padding: '4px 1px', fontSize: 10 }}>·</span>
      <button onClick={() => setTheme('dark')} style={segStyle(theme === 'dark')} title="Dark theme">
        {theme === 'dark' ? '☾ MOON' : 'MOON'}
      </button>
      <span aria-hidden="true" style={{
        padding: '4px 8px 4px 6px', color: P.dimSoft,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10, letterSpacing: 1,
      }}>]</span>
    </div>
  );
}

// Reusable collapsible section. Stores collapse state by id under
// state.ui.collapsed so it persists across reloads.
function Section({ id, title, subtitle, headingSize = 22, headerRight, state, setState, children }) {
  const collapsed = !!(state.ui && state.ui.collapsed && state.ui.collapsed[id]);
  const toggle = () => setState(s => ({
    ...s,
    ui: { ...s.ui, collapsed: { ...(s.ui && s.ui.collapsed), [id]: !collapsed } },
  }));
  // Stop the headerRight click from collapsing the section (tab buttons etc).
  const stop = (e) => e.stopPropagation();
  return (
    <section id={`sec-${id}`} style={{ marginBottom: collapsed ? 14 : 28, scrollMarginTop: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 14, marginBottom: collapsed ? 0 : 14, flexWrap: 'wrap',
      }}>
        <div
          onClick={toggle}
          style={{
            display: 'flex', alignItems: 'baseline', flexWrap: 'wrap',
            gap: 14, cursor: 'pointer', userSelect: 'none', flex: '1 1 auto',
          }}>
          <span aria-hidden="true" className="va-mono" style={{
            display: 'inline-block', minWidth: 22, lineHeight: 1,
            color: P.dim, fontSize: 11, letterSpacing: 0.5,
            fontWeight: 700,
            transition: 'color 0.18s ease',
          }}>{collapsed ? '[+]' : '[-]'}</span>
          <h2 className="v1-section-h2" style={{
            fontSize: headingSize, fontWeight: 400, margin: 0,
            letterSpacing: headingSize >= 28 ? -0.5 : -0.3,
          }}>{title}</h2>
          {subtitle && (
            <span className="va-sans" style={{ fontSize: 12, color: P.dim }}>{subtitle}</span>
          )}
        </div>
        {headerRight && !collapsed && (
          <div onClick={stop}>{headerRight}</div>
        )}
      </div>
      {!collapsed && children}
    </section>
  );
}

function TableOfContents({ state, setState, items }) {
  const collapsed = (state.ui && state.ui.collapsed) || {};
  const [activeId, setActiveId] = React.useState(items[0] && items[0].id);
  const [scrollPct, setScrollPct] = React.useState(0);

  // Track which section is in view via IntersectionObserver — drives the
  // glowing dot that slides down the rail as you scroll.
  React.useEffect(() => {
    const els = items
      .map(it => document.getElementById(`sec-${it.id}`))
      .filter(Boolean);
    if (!els.length) return;
    const visible = new Map();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => visible.set(e.target.id, e.intersectionRatio));
      // Pick whichever section currently has the highest visibility ratio.
      let topId = null, topRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > topRatio) { topRatio = ratio; topId = id; }
      });
      if (topId) setActiveId(topId.replace(/^sec-/, ''));
    }, {
      rootMargin: '-12% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  // Page scroll progress — fills the left rail behind the dot.
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      setScrollPct(Math.min(100, Math.max(0, (h.scrollTop || window.scrollY) / max * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = (id) => setState(s => ({
    ...s,
    ui: { ...s.ui, collapsed: { ...(s.ui && s.ui.collapsed), [id]: !collapsed[id] } },
  }));
  const scrollToSection = (id) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Dot tracks active item along the rail. Computed by index in the list.
  const activeIdx = Math.max(0, items.findIndex(it => it.id === activeId));
  const dotPct = items.length > 1 ? (activeIdx / (items.length - 1)) * 100 : 0;

  return (
    <nav className="v1-toc" aria-label="Sections">
      <style>{`
        .v1-toc {
          position: sticky;
          top: 24px;
          padding: 18px 14px 14px 18px;
          border-radius: 14px;
          background:
            radial-gradient(140% 90% at 0% 0%, var(--kd-accent-soft) 0%, transparent 55%),
            var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          box-shadow:
            0 1px 0 var(--kd-line-soft) inset,
            0 12px 28px -18px var(--kd-overlay),
            0 2px 6px -2px var(--kd-line);
          backdrop-filter: saturate(1.1) blur(6px);
          -webkit-backdrop-filter: saturate(1.1) blur(6px);
        }
        .v1-toc::before {
          content: "";
          position: absolute; inset: 0;
          border-radius: 14px;
          pointer-events: none;
          background-image: radial-gradient(var(--kd-line) 1px, transparent 1px);
          background-size: 6px 6px;
          opacity: 0.5;
        }
        .v1-toc-eyebrow {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${P.accent};
          font-weight: 700;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 14px;
          padding-left: 22px;
        }
        .v1-toc-eyebrow::before {
          content: "§";
          font-family: 'Bricolage Grotesque', serif;
          font-size: 14px;
          line-height: 1;
          color: ${P.accent};
          opacity: 0.85;
        }
        .v1-toc-list {
          list-style: none; margin: 0; padding: 0;
          position: relative;
        }
        /* The vertical rail behind everything */
        .v1-toc-rail {
          position: absolute;
          left: 5px; top: 6px; bottom: 6px;
          width: 1px;
          background: var(--kd-line-mid);
          border-radius: 1px;
          overflow: visible;
        }
        .v1-toc-rail::after {
          content: "";
          position: absolute;
          left: -0.5px; top: 0;
          width: 2px;
          height: var(--scroll-pct, 0%);
          background: var(--kd-accent);
          border-radius: 2px;
          transition: height 0.18s ease-out;
        }
        .v1-toc-dot {
          position: absolute;
          left: -3.5px;
          top: var(--dot-top, 0%);
          width: 9px; height: 9px;
          background: var(--kd-accent);
          border: 2px solid var(--kd-card);
          border-radius: 50%;
          box-shadow:
            0 0 0 1px var(--kd-accent),
            0 0 0 4px var(--kd-accent-soft),
            0 0 12px var(--kd-accent-soft);
          transition: top 0.45s cubic-bezier(.5,.1,.2,1);
          pointer-events: none;
        }
        .v1-toc-row {
          position: relative;
          display: grid;
          grid-template-columns: 22px 1fr 18px;
          align-items: baseline;
          column-gap: 4px;
          padding: 5px 0 5px 0;
        }
        .v1-toc-num {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px;
          color: ${P.dimSoft};
          letter-spacing: 0.5px;
          padding-left: 14px;
          font-variant-numeric: tabular-nums;
          transition: color 0.2s ease;
        }
        .v1-toc-link {
          all: unset;
          cursor: pointer;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          letter-spacing: -0.1px;
          line-height: 1.3;
          color: ${P.dimStrong};
          padding: 2px 0;
          transition: color 0.18s ease, transform 0.25s cubic-bezier(.4,.5,.3,1), letter-spacing 0.25s ease;
        }
        .v1-toc-link:hover {
          color: ${P.ink};
          transform: translateX(2px);
        }
        .v1-toc-row.is-active .v1-toc-link {
          color: ${P.ink};
          font-weight: 500;
          letter-spacing: 0;
        }
        /* Blinking ASCII cursor in front of the active row's label. */
        .v1-toc-row.is-active .v1-toc-link::before {
          content: ">";
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          color: ${P.accent};
          font-weight: 700;
          margin-right: 5px;
          animation: kd-cursor-blink 1.05s step-end infinite;
        }
        @keyframes kd-cursor-blink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0.15; }
        }
        .v1-toc-row.is-active .v1-toc-num {
          color: ${P.accent};
          font-weight: 700;
        }
        .v1-toc-row.is-collapsed .v1-toc-link {
          color: ${P.dim};
          text-decoration: line-through;
          text-decoration-color: var(--kd-line-strong);
          text-decoration-thickness: 1px;
        }
        .v1-toc-toggle {
          all: unset;
          cursor: pointer;
          width: 16px; height: 16px;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; line-height: 1;
          color: ${P.dimSoft};
          border-radius: 3px;
          transition: color 0.15s ease, background 0.15s ease, transform 0.2s ease;
        }
        .v1-toc-toggle:hover {
          color: ${P.accent};
          background: var(--kd-accent-soft);
          transform: scale(1.1);
        }
        .v1-toc-foot {
          margin-top: 14px;
          padding: 8px 0 0 22px;
          border-top: 1px dashed var(--kd-line-mid);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: ${P.dimSoft};
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .v1-toc-foot-pct {
          color: ${P.accent};
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="v1-toc-eyebrow">Index</div>

      <ul
        className="v1-toc-list"
        style={{ '--scroll-pct': `${scrollPct}%`, '--dot-top': `${dotPct}%` }}
      >
        <span className="v1-toc-rail" aria-hidden="true"/>
        <span className="v1-toc-dot" aria-hidden="true"/>
        {items.map(({ id, label }, i) => {
          const isCollapsed = !!collapsed[id];
          const isActive = id === activeId;
          const cls = ['v1-toc-row'];
          if (isActive) cls.push('is-active');
          if (isCollapsed) cls.push('is-collapsed');
          return (
            <li key={id} className={cls.join(' ')}>
              <span className="v1-toc-num">{String(i + 1).padStart(2, '0')}</span>
              <button
                className="v1-toc-link"
                onClick={() => scrollToSection(id)}
                aria-current={isActive ? 'true' : undefined}
              >{label}</button>
              <button
                className="v1-toc-toggle"
                onClick={() => toggle(id)}
                title={isCollapsed ? 'Expand section' : 'Collapse section'}
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >{isCollapsed ? '+' : '−'}</button>
            </li>
          );
        })}
      </ul>

      <div className="v1-toc-foot">
        <span>Scroll</span>
        <span className="v1-toc-foot-pct">{Math.round(scrollPct)}%</span>
      </div>
    </nav>
  );
}

function BlockedAccount({ state, setState }) {
  const b = state.blocked || {};
  const total = b.totalEUR || 12063;
  const monthly = b.monthlyReleaseEUR || 992;
  const months = b.months || 12;
  const deposited = Math.min(b.depositedEUR || 0, total);
  const fundedPct = total > 0 ? (deposited / total) * 100 : 0;
  const released = Math.max(0, Math.min(b.releasedCount || 0, months));
  const releasedEUR = released * monthly;
  const remainingEUR = (months - released) * monthly;

  const update = (patch) => setState(s => ({ ...s, blocked: { ...s.blocked, ...patch } }));
  const toggleStep = (id) => setState(s => ({
    ...s,
    blocked: {
      ...s.blocked,
      steps: (s.blocked.steps || []).map(st => st.id === id ? { ...st, done: !st.done } : st),
    },
  }));

  const stepsDone = (b.steps || []).filter(s => s.done).length;
  const stepsTotal = (b.steps || []).length;

  return (
    <div>
      {/* Top: provider + funding bar */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap', marginBottom: 10,
      }}>
        <div>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.accent, fontWeight: 600, marginBottom: 4,
          }}>{b.provider || 'Fintiba'} · Sperrkonto</div>
          <div className="va-sans" style={{ fontSize: 13, color: P.dimStrong }}>
            Required deposit for the German student visa
          </div>
        </div>
        <div className="va-sans" style={{ fontSize: 13, color: P.dimStrong, textAlign: 'right' }}>
          <EditableNumber
            value={deposited}
            onChange={(v) => update({ depositedEUR: Math.max(0, v) })}
            prefix="€"
            style={{ fontWeight: 600, color: P.ink }}
          />
          <span style={{ color: P.dim }}> of €{total.toLocaleString('de-DE')} · </span>
          <span style={{ color: P.accent, fontWeight: 600 }}>{Math.round(fundedPct)}%</span>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: P.lineSoft, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{
          width: `${fundedPct}%`, height: '100%',
          background: 'linear-gradient(90deg, #c8985f 0%, #9b4722 100%)',
          transition: 'width 0.7s cubic-bezier(.4,.6,.3,1)',
          borderRadius: 999,
        }}/>
      </div>

      {/* Flow diagram */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10, marginBottom: 22,
      }}>
        {[
          { label: 'Wire €12,063', sub: `From US → Fintiba`, done: deposited >= total },
          { label: `Blocked at ${b.provider || 'Fintiba'}`, sub: 'Held until activated', done: deposited >= total && b.activated },
          { label: `€${monthly}/mo released`, sub: `${released} of ${months} so far`, done: released > 0 },
          { label: 'Current account', sub: b.currentAccount || 'TBD — German bank', done: !!b.currentAccount },
        ].map((step, i, arr) => (
          <div key={i} style={{
            position: 'relative',
            background: step.done ? P.accentSoft : P.paper,
            border: `1px solid ${step.done ? P.accent : P.lineMid}`,
            borderRadius: 10, padding: '10px 12px',
          }}>
            <div className="va-mono" style={{
              fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
              color: step.done ? P.accent : P.dim, fontWeight: 700, marginBottom: 3,
            }}>Step {i + 1}{step.done ? ' ✓' : ''}</div>
            <div className="va-sans" style={{ fontSize: 13, color: P.ink, fontWeight: 600, lineHeight: 1.25 }}>
              {step.label}
            </div>
            <div className="va-sans" style={{ fontSize: 11, color: P.dim, marginTop: 2, lineHeight: 1.3 }}>
              {step.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly release timeline */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10, gap: 12, flexWrap: 'wrap',
        }}>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.accent, fontWeight: 600,
          }}>Monthly releases</div>
          <div className="va-sans" style={{ fontSize: 13, color: P.dimStrong }}>
            <span style={{ fontWeight: 600, color: P.ink }}>€{releasedEUR.toLocaleString('de-DE')}</span>
            <span style={{ color: P.dim }}> released · </span>
            <span style={{ color: P.dim }}>€{remainingEUR.toLocaleString('de-DE')} to come</span>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${months}, minmax(0, 1fr))`,
          gap: 4,
        }}>
          {Array.from({ length: months }).map((_, i) => {
            const done = i < released;
            return (
              <button
                key={i}
                onClick={() => update({ releasedCount: done ? i : i + 1 })}
                title={`Month ${i + 1}: ${done ? 'released' : 'pending'} · €${monthly}`}
                style={{
                  cursor: 'pointer',
                  background: done ? P.accent : P.lineSoft,
                  border: `1px solid ${done ? P.accent : P.lineMid}`,
                  borderRadius: 6,
                  padding: '8px 0 6px',
                  color: done ? '#fff' : P.dim,
                  font: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'background 0.15s, color 0.15s',
                }}>
                <div className="va-mono" style={{ fontSize: 9, letterSpacing: 0.5, fontWeight: 700 }}>M{i + 1}</div>
                <div style={{ fontSize: 10, fontWeight: 600 }}>€{monthly}</div>
              </button>
            );
          })}
        </div>
        <div className="va-sans" style={{ fontSize: 11, color: P.dim, marginTop: 6, fontStyle: 'italic' }}>
          Click a month to mark it released. First release happens after Anmeldung + visa activation.
        </div>
      </div>

      {/* Two-column: facts + checklist */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22,
      }}>
        <div>
          <div className="va-mono" style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: P.accent, fontWeight: 600, marginBottom: 10,
          }}>Key facts</div>
          <div className="va-sans" style={{ fontSize: 13, color: P.ink, lineHeight: 1.6 }}>
            <FactRow label="Provider" value={b.provider || 'Fintiba'}/>
            <FactRow label="Total deposit" value={`€${total.toLocaleString('de-DE')}`}/>
            <FactRow label="Monthly release" value={`€${monthly} × ${months}`}/>
            <FactRow label="Setup fee" value="€89 (one-time)"/>
            <FactRow label="Maintenance" value="≈ €4.90 / month"/>
            <FactRow label="Activation" value="After Anmeldung + visa"/>
            <FactRow label="Current account" value={
              <EditableText
                value={b.currentAccount || ''}
                onChange={(v) => update({ currentAccount: v })}
                placeholder="N26 / Sparkasse / …"
              />
            }/>
            <FactRow label="German phone" value={
              <EditableText
                value={b.germanPhone || ''}
                onChange={(v) => update({ germanPhone: v })}
                placeholder="+49 …"
              />
            }/>
          </div>
        </div>

        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 10, gap: 8,
          }}>
            <div className="va-mono" style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: P.accent, fontWeight: 600,
            }}>Checklist</div>
            <div className="va-mono" style={{ fontSize: 10, color: P.dim, letterSpacing: 0.5 }}>
              {stepsDone}/{stepsTotal}
            </div>
          </div>
          <div className="va-sans" style={{ fontSize: 13, color: P.ink }}>
            {(b.steps || []).map(step => (
              <label key={step.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 0', cursor: 'pointer',
                color: step.done ? P.dim : P.ink,
                textDecoration: step.done ? 'line-through' : 'none',
              }}>
                <input
                  type="checkbox"
                  checked={!!step.done}
                  onChange={() => toggleStep(step.id)}
                  style={{ accentColor: P.accent, cursor: 'pointer' }}
                />
                <span style={{ lineHeight: 1.4 }}>{step.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactRow({ label, value }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8,
      padding: '4px 0', borderBottom: `1px solid ${P.lineSoft}`,
    }}>
      <span style={{ color: P.dim, fontSize: 12 }}>{label}</span>
      <span style={{ color: P.ink, fontSize: 13 }}>{value}</span>
    </div>
  );
}

function FundingProgress({ sentEUR, totalEUR }) {
  const pct = totalEUR > 0 ? (sentEUR / totalEUR) * 100 : 0;
  const pctRounded = Math.round(pct);
  return (
    <div style={{ paddingBottom: 18, borderBottom: '1px dashed rgba(24,20,15,0.1)', marginBottom: 18 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10, gap: 12, flexWrap: 'wrap',
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
      <div style={{
        height: 8, borderRadius: 999, background: P.lineSoft, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: 'linear-gradient(90deg, #c8985f 0%, #9b4722 100%)',
          transition: 'width 0.7s cubic-bezier(.4,.6,.3,1)',
          borderRadius: 999,
        }}/>
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
                background: c.author === 'VJ' ? '#e7f2ec' : P.accentSoft,
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
  EditableNumber, EditableText, RingProgress, StackedBudgetBar, FundingProgress, OverallProgress,
  TaskDetailDrawer, LineDetailDrawer, LinkedLinesBlock, PencilIcon,
});
