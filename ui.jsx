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
          font: 'inherit', color: 'inherit', border: `1.5px solid ${P.accent}`,
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
      className="v1-editable-hover"
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
          font: 'inherit', color: 'inherit', border: `1.5px solid ${P.accent}`,
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
      className="v1-editable-hover"
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
        /* Bubble tracks the dude on desktop, but at narrow widths the
           bubble width approaches the container width — overflows past
           the left edge. Pin centered on mobile. */
        .kd-dude-bubble {
          left: var(--kd-bubble-left, 50%);
        }
        .kd-dude-pointer {
          left: var(--kd-pointer-left, 50%);
        }
        @media (max-width: 720px) {
          .kd-dude-bubble  { left: 50% !important; width: min(320px, 96%) !important; }
          .kd-dude-pointer { left: 50% !important; }
        }
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
        <div
          key={cycle}
          className="kd-dude-bubble"
          style={{
            position: 'absolute',
            ['--kd-bubble-left']: `${bubblePos}%`,
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
            <div
              className="kd-dude-pointer"
              style={{
                position: 'absolute',
                ['--kd-pointer-left']: `${Math.max(8, Math.min(92, 50 + (dudePos - bubblePos)))}%`,
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

// Heuristic parser: turn a free-form `when` string ("May 1", "Aug",
// "May/Jun", "Sep 1") into a Date. Year is inferred relative to today
// (anything in the past month-of-year rolls forward). Returns null
// if we can't extract a month.
const KD_MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};
function parseWhen(when, baseYear) {
  if (!when) return null;
  const s = String(when).toLowerCase();
  // Try "Mon D" or "Mon DD" first.
  const md = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+(\d{1,2})\b/);
  if (md) return new Date(baseYear, KD_MONTHS[md[1]], parseInt(md[2], 10));
  // "Mon" alone — pick mid-month (15th) as a sensible anchor.
  const m = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/);
  if (m) return new Date(baseYear, KD_MONTHS[m[1]], 15);
  return null;
}

// Live departure clock for the hero row. Ticks every minute so the
// hours readout stays current. Shows the next upcoming milestone
// pulled from state.upcoming as an actionable teaser.
function DepartureClock({ state }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const dep = new Date(state.meta.departure + 'T00:00:00');
  const ms = dep - now;
  const arrived = ms <= 0;
  const totalMin = Math.max(0, Math.floor(Math.abs(ms) / 60_000));
  const totalH = Math.floor(totalMin / 60);
  const totalD = Math.floor(totalH / 24);
  const weeks = Math.floor(totalD / 7);
  const remH = totalH - totalD * 24;

  // Find the next upcoming milestone after today (parsed from free-form when).
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextMilestone = (state.upcoming || [])
    .map(u => ({ ...u, _date: parseWhen(u.when, dep.getFullYear()) }))
    .filter(u => u._date && u._date >= today)
    .sort((a, b) => a._date - b._date)[0];

  const daysToNext = nextMilestone
    ? Math.max(0, Math.round((nextMilestone._date - today) / (1000 * 60 * 60 * 24)))
    : null;

  const depWeekday = dep.toLocaleDateString('en-US', { weekday: 'short' });
  const depDate    = dep.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Destination from meta if set, else fallback. Hardcoding 'Köln' for now.
  const destination = (state.meta && state.meta.destination) || 'Köln';

  return (
    <div className="v1-clock">
      <style>{`
        .v1-clock {
          position: relative;
          background: var(--kd-ink);
          color: var(--kd-paper);
          border-radius: 18px;
          padding: 18px 22px 16px;
          overflow: hidden;
          display: flex; flex-direction: column; gap: 10px;
          min-height: 100%;
        }
        .v1-clock::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(232,220,196,0.08) 1px, transparent 1px);
          background-size: 16px 16px;
          opacity: 0.6;
        }
        .v1-clock::after {
          content: "";
          position: absolute;
          top: -40%; right: -10%;
          width: 60%; height: 80%;
          background: radial-gradient(circle, rgba(224,113,64,0.22) 0%, transparent 60%);
          pointer-events: none;
        }
        .v1-clock > * { position: relative; z-index: 1; }

        /* ASCII airplane — bigger, more visible, hovers in the upper-right
           with a gentle bob and an accent-colored body so it actually reads. */
        .v1-clock-plane {
          position: absolute;
          top: 56px; right: 22px;
          z-index: 1;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 22px;
          line-height: 1;
          color: var(--kd-accent);
          opacity: 0.95;
          white-space: pre;
          letter-spacing: -1px;
          pointer-events: none;
          text-shadow: 0 0 14px rgba(224,113,64,0.55);
          animation: kd-plane-bob 3.6s ease-in-out infinite;
        }
        @keyframes kd-plane-bob {
          0%, 100% { transform: translateY(0)   rotate(-2deg); }
          50%      { transform: translateY(-4px) rotate(2deg); }
        }
        /* Contrail — animated dashes that flow leftward FROM the plane,
           giving the impression it's flying right. */
        .v1-clock-contrail {
          position: absolute;
          top: 70px; right: 130px;
          width: 240px; height: 2px;
          z-index: 0;
          background-image: repeating-linear-gradient(
            to right,
            rgba(224,113,64,0.55) 0,
            rgba(224,113,64,0.55) 4px,
            transparent 4px,
            transparent 12px
          );
          mask-image: linear-gradient(to right, transparent 0%, #000 60%, #000 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 60%, #000 100%);
          animation: kd-contrail-flow 1.2s linear infinite;
          pointer-events: none;
        }
        @keyframes kd-contrail-flow {
          0%   { background-position: 0 0; }
          100% { background-position: 12px 0; }
        }
        /* Subtle pulsing transmission dot — top-left, signals "live". */
        .v1-clock-pulse {
          position: absolute;
          top: 22px; left: 22px;
          z-index: 2;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--kd-accent);
          box-shadow: 0 0 0 0 rgba(224,113,64,0.6);
          animation: kd-pulse-dot 1.8s ease-out infinite;
        }
        @keyframes kd-pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(224,113,64,0.55); transform: scale(1); }
          70%  { box-shadow: 0 0 0 10px rgba(224,113,64,0);   transform: scale(1); }
          100% { box-shadow: 0 0 0 0 rgba(224,113,64,0);     transform: scale(1); }
        }
        /* Dashed runway trail along the bottom — beefier so it actually shows. */
        .v1-clock-runway {
          position: absolute;
          left: 18px; right: 18px; bottom: 6px;
          height: 2px;
          background-image: repeating-linear-gradient(
            to right,
            rgba(232,220,196,0.32) 0,
            rgba(232,220,196,0.32) 8px,
            transparent 8px,
            transparent 16px
          );
          z-index: 0;
          animation: kd-runway-drift 1.6s linear infinite;
        }
        @keyframes kd-runway-drift {
          0%   { background-position: 0 0; }
          100% { background-position: -16px 0; }
        }
        .v1-clock-flightno {
          position: absolute;
          top: 18px; right: 22px;
          z-index: 2;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 8.5px; letter-spacing: 1.4px; font-weight: 700;
          color: var(--kd-accent);
          opacity: 0.85;
          padding: 3px 8px;
          border: 1px solid rgba(224,113,64,0.5);
          border-radius: 3px;
          background: rgba(224,113,64,0.08);
        }

        .v1-clock-eyebrow {
          display: flex; align-items: baseline; justify-content: space-between;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9.5px; letter-spacing: 2.4px; font-weight: 700;
          text-transform: uppercase;
          color: var(--kd-accent);
        }
        .v1-clock-eyebrow .arrow {
          display: inline-block;
          margin: 0 6px;
          color: var(--kd-paper);
          opacity: 0.5;
          animation: kd-arrow-pulse 2.6s ease-in-out infinite;
        }
        .v1-clock-eyebrow .dest {
          color: var(--kd-paper);
          letter-spacing: 1.2px;
        }
        .v1-clock-eyebrow .stamp {
          color: var(--kd-paper);
          opacity: 0.45;
          font-size: 8.5px;
          letter-spacing: 1.4px;
        }
        @keyframes kd-arrow-pulse {
          0%, 100% { transform: translateX(0); opacity: 0.45; }
          50%      { transform: translateX(3px); opacity: 0.85; }
        }

        .v1-clock-num-row {
          display: flex; align-items: baseline; gap: 14px;
          margin-top: 2px;
        }
        .v1-clock-num {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 80px; line-height: 0.95;
          font-weight: 500; letter-spacing: -3px;
          color: var(--kd-paper);
          font-variant-numeric: tabular-nums;
          text-shadow:
            0 0 20px rgba(224,113,64,0.25),
            0 0 40px rgba(224,113,64,0.12);
        }
        .v1-clock-unit {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; letter-spacing: 2px; font-weight: 700;
          text-transform: uppercase;
          color: var(--kd-paper);
          opacity: 0.6;
        }
        .v1-clock-arrived {
          color: var(--kd-accent);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 14px; letter-spacing: 3px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .v1-clock-breakdown {
          display: flex; gap: 14px; flex-wrap: wrap;
          margin-top: -4px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 1.2px; font-weight: 600;
          color: var(--kd-paper);
          opacity: 0.6;
        }
        .v1-clock-breakdown .sep {
          opacity: 0.4;
        }

        .v1-clock-eta {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed rgba(232,220,196,0.18);
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 1.4px; font-weight: 600;
          text-transform: uppercase;
          color: var(--kd-paper);
        }
        .v1-clock-eta .label {
          color: var(--kd-accent);
          font-weight: 700;
          letter-spacing: 2px;
          margin-right: 6px;
        }
        .v1-clock-eta .val {
          opacity: 0.85;
        }
        .v1-clock-eta .weekday {
          color: var(--kd-paper);
          opacity: 0.65;
          margin-right: 4px;
        }

        .v1-clock-next {
          padding-top: 8px;
          margin-top: 4px;
          border-top: 1px dashed rgba(232,220,196,0.12);
          display: flex; align-items: baseline; gap: 8px;
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          color: var(--kd-paper);
          opacity: 0.85;
        }
        .v1-clock-next .key {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 2px; font-weight: 700;
          color: var(--kd-accent);
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .v1-clock-next .what {
          flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          font-weight: 500;
        }
        .v1-clock-next .when {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: 1px; font-weight: 700;
          color: var(--kd-paper);
          opacity: 0.6;
          flex-shrink: 0;
        }

        @media (max-width: 720px) {
          .v1-clock-num { font-size: 64px !important; letter-spacing: -2px !important; }
          .v1-clock { padding: 16px 18px 14px; }
        }
      `}</style>

      {/* Decorative ASCII layer */}
      <div className="v1-clock-pulse" aria-hidden="true"/>
      <div className="v1-clock-contrail" aria-hidden="true"/>
      <div className="v1-clock-plane" aria-hidden="true">{`    __|__
─o─(_)─o─
    ‾‾‾`}</div>
      <div className="v1-clock-runway" aria-hidden="true"/>
      <div className="v1-clock-flightno" aria-hidden="true">▶ FLT KÖLN-26</div>

      <div className="v1-clock-eyebrow">
        <span>
          {arrived ? 'Arrived' : 'Departure'}
          <span className="arrow">→</span>
          <span className="dest">{destination}</span>
        </span>
      </div>

      <div className="v1-clock-num-row">
        {arrived ? (
          <span className="v1-clock-arrived">✈ Vor Ort</span>
        ) : (
          <>
            <span className="v1-clock-num">{totalD}</span>
            <span className="v1-clock-unit">Days</span>
          </>
        )}
      </div>

      {!arrived && (
        <div className="v1-clock-breakdown">
          <span>{weeks} W</span>
          <span className="sep">·</span>
          <span>{totalH.toLocaleString()} H</span>
          <span className="sep">·</span>
          <span>{remH} H REM</span>
        </div>
      )}

      <div className="v1-clock-eta">
        <span>
          <span className="label">{arrived ? 'Was' : 'ETA'}</span>
          <span className="weekday">{depWeekday.toUpperCase()}</span>
          <span className="val">{depDate.toUpperCase()}</span>
        </span>
        <span className="val">≈ {weeks} wks</span>
      </div>

      {nextMilestone && (
        <div className="v1-clock-next" title={`${nextMilestone.what} · ${nextMilestone.when}`}>
          <span className="key">Next</span>
          <span className="what">{nextMilestone.what}</span>
          <span className="when">
            {nextMilestone.when.toUpperCase()}
            {daysToNext !== null && (daysToNext === 0 ? ' · TODAY' : ` · ${daysToNext}d`)}
          </span>
        </div>
      )}
    </div>
  );
}

// Mini month grid used by MilestoneCalendar. Shows days as a 7-col
// grid; days with a milestone are filled with the category color.
function MiniMonth({ year, month, milestones, today, departureKey, onPick }) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to a multiple of 7 so the grid is stable.
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = first.toLocaleDateString('en-US', { month: 'short' });
  const yearLabel = first.getFullYear();
  const weekdayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const todayKey = today ? `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}` : null;

  return (
    <div style={{
      flex: '1 1 130px', minWidth: 130, maxWidth: 220,
      background: P.card,
      border: `1px solid ${P.lineSoft}`,
      borderRadius: 10, padding: '10px 10px 8px',
    }}>
      <div className="va-mono" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 6, fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
        textTransform: 'uppercase',
      }}>
        <span style={{ color: P.accent }}>{monthLabel}</span>
        <span style={{ color: P.dimSoft, fontSize: 9 }}>{yearLabel}</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}>
        {weekdayLetters.map((w, i) => (
          <div key={`w${i}`} style={{
            fontSize: 8, color: P.dimSoft, textAlign: 'center',
            padding: '1px 0 3px', fontWeight: 700,
          }}>{w}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`}/>;
          const key = `${year}-${month}-${d}`;
          const ms = milestones.filter(m => m._key === key);
          const isToday = key === todayKey;
          const isDeparture = key === departureKey;
          const primary = ms[0];
          const fill = primary ? primary._color : 'transparent';
          const fg   = primary ? primary._bg    : P.dim;
          return (
            <button
              key={key}
              onClick={() => primary && onPick(primary.id)}
              title={ms.length
                ? ms.map(m => `${m.what} (${m.cat})`).join('\n')
                : new Date(year, month, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              style={{
                cursor: ms.length ? 'pointer' : 'default',
                position: 'relative',
                width: '100%', aspectRatio: '1 / 1',
                border: 'none', padding: 0,
                background: fill,
                color: primary ? '#fff' : (isToday ? P.accent : P.dim),
                fontSize: 9, lineHeight: 1, fontWeight: isToday ? 700 : 500,
                borderRadius: 3,
                boxShadow: isToday ? `inset 0 0 0 1.5px ${P.accent}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.12s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => primary && (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => primary && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isDeparture ? '✈' : d}
              {ms.length > 1 && (
                <span style={{
                  position: 'absolute', top: 1, right: 1,
                  width: 4, height: 4, borderRadius: 50,
                  background: '#fff', opacity: 0.85,
                }}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// KÖLN MAP — "Cartographer's Field Station"
// =============================================================================
// Aesthetic: vintage travel logbook page. Pins are catalog-card index
// entries with numbered prefixes; the active pin gets a paper readout
// panel with click-to-edit name + query, DMS coordinates, and
// distance-to-CBS. The map itself sits in a framed container with
// corner registration brackets (⌜⌝⌞⌟). Toolbar lets you switch map
// type (map/sat/hybrid/terrain), toggle walking directions to CBS,
// and bump the zoom level — all by rebuilding the iframe URL with no
// Google API key required.
//
// Coordinates for known Köln places live in KD_COORDS — used for the
// distance readout and DMS display. If a place's query doesn't match
// any known coords, the readout strip shows an em-dash and Δ-CBS is
// hidden. User-added pins simply join the saved-pins list.
// =============================================================================

const KD_COORDS = {
  // school (treated as the origin for distance readouts)
  'cologne business school': [50.9277, 6.9457],
  'cbs cologne business school': [50.9277, 6.9457],
  'cbs köln': [50.9277, 6.9457],
  // landmarks
  'kölner dom': [50.9413, 6.9583],
  'köln dom': [50.9413, 6.9583],
  'cologne cathedral': [50.9413, 6.9583],
  'köln hauptbahnhof': [50.9430, 6.9590],
  'köln hbf': [50.9430, 6.9590],
  'rhein, köln': [50.9375, 6.9603],
  'rhine, köln': [50.9375, 6.9603],
  'stadtgarten, köln': [50.9430, 6.9341],
  // neighborhoods
  'belgisches viertel': [50.9420, 6.9290],
  'sülz, köln': [50.9202, 6.9197],
  'ehrenfeld, köln': [50.9529, 6.9230],
  'lindenthal, köln': [50.9286, 6.9143],
  'südstadt, köln': [50.9215, 6.9485],
  // services
  'ikea köln am butzweilerhof': [50.9871, 6.8765],
  'ikea köln': [50.9871, 6.8765],
  'aldi süd köln': [50.9367, 6.9560],
  // bureaucracy (Bürgeramt Innenstadt is the central registration office)
  'bürgeramt innenstadt köln': [50.9408, 6.9580],
};

const KD_CBS_COORDS = KD_COORDS['cologne business school'];
const KD_CBS_QUERY = 'Cologne Business School, Köln, Germany';

const KD_QUICK_JUMPS = [
  { emoji: '🚉', label: 'Hbf',         query: 'Köln Hauptbahnhof, Germany' },
  { emoji: '⛪', label: 'Dom',         query: 'Kölner Dom, Köln, Germany' },
  { emoji: '🌊', label: 'Rhein',       query: 'Rhein, Köln, Germany' },
  { emoji: '🏛',  label: 'Bürgeramt',   query: 'Bürgeramt Innenstadt Köln, Germany' },
  { emoji: '🛒', label: 'IKEA',        query: 'IKEA Köln Am Butzweilerhof, Germany' },
  { emoji: '🛍', label: 'Aldi',        query: 'Aldi Süd, Köln, Germany' },
  { emoji: '🌳', label: 'Stadtgarten', query: 'Stadtgarten, Köln, Germany' },
];

const KD_MAP_TYPES = [
  { key: 'm', label: 'MAP'     },
  { key: 'k', label: 'SAT'     },
  { key: 'h', label: 'HYBRID'  },
  { key: 'p', label: 'TERRAIN' },
];

function kdLookupCoords(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return null;
  if (KD_COORDS[q]) return KD_COORDS[q];
  for (const [key, coords] of Object.entries(KD_COORDS)) {
    if (q.includes(key) || key.includes(q)) return coords;
  }
  return null;
}

function kdHaversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function kdFormatDMS(deg, isLat) {
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = Math.round((abs - d - m / 60) * 3600);
  return `${d}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″${dir}`;
}

function KolnMap({ state, setState }) {
  const map = state.map || {};
  const places   = Array.isArray(map.places) ? map.places : [];
  const activeIdx = Math.min(Math.max(0, map.activeIdx || 0), Math.max(0, places.length - 1));
  const active   = places[activeIdx];
  const mapType  = map.mapType || 'm';
  const zoom     = typeof map.zoom === 'number' ? map.zoom : 14;
  const showRoute = !!map.showRoute;

  const updateMap = (patch) => setState((s) => ({ ...s, map: { ...s.map, ...patch } }));
  const updatePlaceField = (field, value) => updateMap({
    places: places.map((p, i) => (i === activeIdx ? { ...p, [field]: value } : p)),
  });

  const setActiveIdx = (i) => updateMap({ activeIdx: i, showRoute: false });

  // Quick-jump click: if a saved pin already matches that query, switch
  // to it; otherwise add a new one and switch.
  const jumpTo = (q) => {
    const existingIdx = places.findIndex(
      (p) => (p.query || '').toLowerCase().trim() === q.query.toLowerCase().trim()
    );
    if (existingIdx >= 0) {
      updateMap({ activeIdx: existingIdx, showRoute: false });
    } else {
      const np = { id: 'p-' + Date.now(), label: q.label, query: q.query };
      updateMap({ places: [...places, np], activeIdx: places.length, showRoute: false });
    }
  };

  const addBlankPlace = () => {
    const np = { id: 'p-' + Date.now(), label: 'New pin', query: 'Köln, Germany' };
    updateMap({ places: [...places, np], activeIdx: places.length, showRoute: false });
  };

  const removeActive = () => {
    if (places.length <= 1) return;
    updateMap({
      places: places.filter((_, i) => i !== activeIdx),
      activeIdx: Math.max(0, activeIdx - 1),
      showRoute: false,
    });
  };

  const coords = active ? kdLookupCoords(active.query) : null;
  const distKm = coords ? kdHaversineKm(coords, KD_CBS_COORDS) : null;
  const isAtCBS = coords && coords[0] === KD_CBS_COORDS[0] && coords[1] === KD_CBS_COORDS[1];

  const query = active ? active.query : 'Köln, Germany';
  const src = (showRoute && !isAtCBS)
    ? `https://www.google.com/maps?saddr=${encodeURIComponent(query)}&daddr=${encodeURIComponent(KD_CBS_QUERY)}&dirflg=w&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&t=${mapType}&output=embed`;
  const openInMaps = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;

  return (
    <div className="v1-map-station">
      <style>{`
        .v1-map-station {
          position: relative;
          background:
            radial-gradient(140% 90% at 100% 0%, var(--kd-accent-soft) 0%, transparent 55%),
            var(--kd-card);
          border-radius: 18px;
          padding: 22px 24px 20px;
          overflow: hidden;
        }
        .v1-map-station::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(var(--kd-line) 1px, transparent 1px);
          background-size: 14px 14px;
          opacity: 0.35;
        }
        .v1-map-station > * { position: relative; z-index: 1; }
        .v1-map-eyebrow {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 12px; margin-bottom: 12px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 2.4px; font-weight: 700;
          text-transform: uppercase;
          color: var(--kd-accent);
        }
        .v1-map-eyebrow .station-id {
          color: var(--kd-dim-soft);
          font-weight: 600;
          letter-spacing: 1.6px;
        }
        .v1-map-eyebrow .compass {
          color: var(--kd-accent);
          font-size: 13px;
          line-height: 1;
          letter-spacing: 0;
          margin-right: 6px;
        }

        /* PIN TABS — catalog-card style */
        .v1-map-tabs {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .v1-map-tab {
          all: unset;
          cursor: pointer;
          position: relative;
          padding: 9px 14px 8px 14px;
          background: var(--kd-paper);
          border: 1px solid var(--kd-line-mid);
          border-radius: 6px;
          min-width: 92px;
          color: var(--kd-dim-strong);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .v1-map-tab:hover {
          transform: translateY(-1px);
          background: var(--kd-card);
        }
        .v1-map-tab .num {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 8.5px; letter-spacing: 1.2px; font-weight: 700;
          color: var(--kd-dim-soft);
          display: block;
          margin-bottom: 2px;
        }
        .v1-map-tab .lab {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 13px; font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.2px;
          display: block;
        }
        .v1-map-tab.is-active {
          background: var(--kd-card);
          border-color: var(--kd-accent);
          color: var(--kd-ink);
          box-shadow: 0 4px 14px -10px var(--kd-overlay),
                      inset 3px 0 0 0 var(--kd-accent);
        }
        .v1-map-tab.is-active .num { color: var(--kd-accent); }
        .v1-map-tab .delta {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 8px; letter-spacing: 0.5px;
          color: var(--kd-dim-soft);
          margin-left: 4px;
        }
        .v1-map-add {
          all: unset;
          cursor: pointer;
          padding: 8px 14px;
          background: transparent;
          border: 1px dashed var(--kd-line-dashed);
          border-radius: 6px;
          color: var(--kd-dim);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px; font-weight: 700; letter-spacing: 1.4px;
          align-self: stretch;
          display: inline-flex; align-items: center;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .v1-map-add:hover { border-color: var(--kd-accent); color: var(--kd-accent); }

        /* ACTIVE READOUT — paper card */
        .v1-map-readout {
          background: var(--kd-drawer);
          border: 1px solid var(--kd-line);
          border-left: 3px solid var(--kd-accent);
          border-radius: 8px;
          padding: 12px 14px 10px;
          margin-bottom: 14px;
        }
        .v1-map-title {
          display: flex; align-items: baseline; gap: 8px;
          margin-bottom: 4px;
        }
        .v1-map-num-tag {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; letter-spacing: 0.6px;
          color: var(--kd-accent);
          font-weight: 700;
        }
        .v1-map-name-display {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 22px; font-weight: 500;
          letter-spacing: -0.4px;
          color: var(--kd-ink);
          line-height: 1.05;
          cursor: text;
          padding: 0 4px;
          margin: 0 -4px;
          border-radius: 4px;
          transition: background 0.15s ease;
          flex: 1;
          word-break: break-word;
        }
        .v1-map-name-display:hover { background: var(--kd-hover-tint); }
        .v1-map-name-input {
          flex: 1;
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          font-size: 22px; font-weight: 500;
          letter-spacing: -0.4px;
          color: var(--kd-ink);
          background: transparent;
          border: none; border-bottom: 1.5px solid var(--kd-accent);
          padding: 0 0 1px 0;
          outline: none;
          width: 100%;
        }
        .v1-map-query-display {
          font-family: 'Figtree', sans-serif;
          font-size: 12.5px;
          color: var(--kd-dim-strong);
          line-height: 1.4;
          cursor: text;
          padding: 2px 4px;
          margin: 4px -4px 0;
          border-radius: 4px;
          word-break: break-word;
          transition: background 0.15s ease;
        }
        .v1-map-query-display:hover { background: var(--kd-hover-tint); }
        .v1-map-query-input {
          width: 100%;
          margin-top: 4px;
          padding: 5px 8px;
          font-family: 'Figtree', sans-serif;
          font-size: 12.5px;
          color: var(--kd-ink);
          background: var(--kd-card);
          border: 1px solid var(--kd-accent);
          border-radius: 4px;
          outline: none;
        }
        .v1-map-meta {
          display: flex; gap: 16px; flex-wrap: wrap;
          margin-top: 10px; padding-top: 10px;
          border-top: 1px dashed var(--kd-line);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.5px;
          align-items: center;
        }
        .v1-map-meta .pair { display: inline-flex; align-items: baseline; gap: 5px; }
        .v1-map-meta .key {
          color: var(--kd-accent);
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-size: 9px;
        }
        .v1-map-meta .val {
          color: var(--kd-ink);
          font-weight: 600;
        }
        .v1-map-meta .val.dim { color: var(--kd-dim-soft); font-weight: 500; font-style: italic; }
        .v1-map-meta .actions {
          margin-left: auto;
          display: inline-flex; gap: 4px; align-items: center;
        }
        .v1-map-meta .open-link {
          padding: 4px 10px;
          color: var(--kd-accent);
          background: transparent;
          text-decoration: none;
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          font-weight: 700; letter-spacing: 1px;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .v1-map-meta .open-link:hover {
          background: var(--kd-accent);
          color: var(--kd-card);
          border-color: var(--kd-accent);
        }
        .v1-map-del {
          all: unset; cursor: pointer;
          padding: 4px 9px;
          color: var(--kd-dim);
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 700; line-height: 1;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .v1-map-del:hover {
          color: var(--kd-danger);
          border-color: var(--kd-danger);
        }

        /* TOOLBAR */
        .v1-map-toolbar {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 10px; align-items: center;
        }
        .v1-map-seg {
          display: inline-flex;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          overflow: hidden;
        }
        .v1-map-seg button {
          all: unset;
          cursor: pointer;
          padding: 4px 11px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9.5px; letter-spacing: 1.4px; font-weight: 700;
          color: var(--kd-dim);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .v1-map-seg button:hover { color: var(--kd-ink); }
        .v1-map-seg button.is-on {
          background: var(--kd-accent);
          color: var(--kd-card);
        }
        .v1-map-route {
          all: unset; cursor: pointer;
          padding: 4px 11px;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9.5px; letter-spacing: 1.4px; font-weight: 700;
          color: var(--kd-dim);
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .v1-map-route:hover:not(:disabled) { color: var(--kd-ink); }
        .v1-map-route.is-on {
          background: var(--kd-accent);
          color: var(--kd-card);
          border-color: var(--kd-accent);
        }
        .v1-map-route:disabled { opacity: 0.35; cursor: not-allowed; }
        .v1-map-zoom {
          margin-left: auto;
          display: inline-flex;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          overflow: hidden;
        }
        .v1-map-zoom button {
          all: unset; cursor: pointer;
          width: 26px; height: 24px;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 14px; font-weight: 700; line-height: 1;
          color: var(--kd-dim);
          transition: color 0.15s ease;
        }
        .v1-map-zoom button:hover { color: var(--kd-accent); }
        .v1-map-zoom button:disabled { opacity: 0.3; cursor: not-allowed; }
        .v1-map-zoom .z-readout {
          padding: 0 9px;
          display: inline-flex; align-items: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 1.4px; font-weight: 700;
          color: var(--kd-dim);
          border-left: 1px solid var(--kd-line);
          border-right: 1px solid var(--kd-line);
        }

        /* MAP FRAME — paper border + corner registration brackets */
        .v1-map-frame {
          position: relative;
          padding: 14px;
          background: var(--kd-paper);
          border-radius: 10px;
          border: 1px solid var(--kd-line-mid);
          box-shadow:
            inset 0 0 0 1px var(--kd-card),
            0 6px 18px -10px var(--kd-overlay);
        }
        .v1-map-frame::before,
        .v1-map-frame::after,
        .v1-map-frame > .br-bl,
        .v1-map-frame > .br-br {
          content: "";
          position: absolute;
          width: 14px; height: 14px;
          border-color: var(--kd-accent);
          border-style: solid;
          opacity: 0.85;
          pointer-events: none;
        }
        .v1-map-frame::before {
          top: 4px; left: 4px;
          border-width: 1.5px 0 0 1.5px;
        }
        .v1-map-frame::after {
          top: 4px; right: 4px;
          border-width: 1.5px 1.5px 0 0;
        }
        .v1-map-frame > .br-bl {
          bottom: 4px; left: 4px;
          border-width: 0 0 1.5px 1.5px;
        }
        .v1-map-frame > .br-br {
          bottom: 4px; right: 4px;
          border-width: 0 1.5px 1.5px 0;
        }
        .v1-map-frame iframe {
          display: block;
          width: 100%;
          border-radius: 4px;
          background: var(--kd-card);
        }
        .v1-map-fig {
          position: absolute;
          bottom: -8px; right: 14px;
          padding: 0 8px;
          background: var(--kd-card);
          color: var(--kd-dim);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 8.5px; letter-spacing: 1.4px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* QUICK JUMP STRIP */
        .v1-map-quick {
          margin-top: 14px;
          display: flex; gap: 6px; flex-wrap: wrap;
          align-items: center;
        }
        .v1-map-quick-label {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 2.4px; font-weight: 700;
          text-transform: uppercase; color: var(--kd-accent);
          margin-right: 4px;
        }
        .v1-map-quick-chip {
          all: unset; cursor: pointer;
          padding: 4px 11px;
          background: var(--kd-card);
          border: 1px solid var(--kd-line-mid);
          border-radius: 999px;
          font-family: 'Figtree', sans-serif;
          font-size: 11px; font-weight: 600;
          color: var(--kd-dim-strong);
          display: inline-flex; align-items: center; gap: 5px;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .v1-map-quick-chip:hover {
          background: var(--kd-accent-soft);
          color: var(--kd-accent);
          border-color: var(--kd-accent);
          transform: translateY(-1px);
        }

        @media (max-width: 720px) {
          .v1-map-station { padding: 18px 16px 16px !important; }
          .v1-map-tab { min-width: 72px; padding: 8px 11px 7px; }
          .v1-map-name-display, .v1-map-name-input { font-size: 18px !important; }
          .v1-map-frame iframe { height: 280px !important; }
          .v1-map-meta .actions { margin-left: 0; }
        }
      `}</style>

      <div className="v1-map-eyebrow">
        <span><span className="compass">⊕</span>STATION LOG · KÖLN</span>
        <span className="station-id">FIG. {String(activeIdx + 1).padStart(2, '0')} / {String(places.length).padStart(2, '0')}</span>
      </div>

      <div className="v1-map-tabs">
        {places.map((p, i) => {
          const c = kdLookupCoords(p.query);
          const dist = c ? kdHaversineKm(c, KD_CBS_COORDS) : null;
          return (
            <button
              key={p.id}
              className={`v1-map-tab${i === activeIdx ? ' is-active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <span className="num">
                {String(i + 1).padStart(2, '0')}
                {dist !== null && (
                  <span className="delta"> · Δ {dist < 0.1 ? '0' : dist.toFixed(1)} km</span>
                )}
              </span>
              <span className="lab">{p.label}</span>
            </button>
          );
        })}
        <button className="v1-map-add" onClick={addBlankPlace}>+ NEW</button>
      </div>

      {active && (
        <KolnMapReadout
          place={active}
          idx={activeIdx}
          coords={coords}
          distKm={distKm}
          openInMaps={openInMaps}
          onLabelChange={(v) => updatePlaceField('label', v)}
          onQueryChange={(v) => updatePlaceField('query', v)}
          onRemove={places.length > 1 ? removeActive : null}
        />
      )}

      <div className="v1-map-toolbar">
        <div className="v1-map-seg">
          {KD_MAP_TYPES.map((t) => (
            <button
              key={t.key}
              className={mapType === t.key && !showRoute ? 'is-on' : ''}
              onClick={() => updateMap({ mapType: t.key, showRoute: false })}
              title={`Switch to ${t.label.toLowerCase()} view`}
            >{t.label}</button>
          ))}
        </div>
        <button
          className={`v1-map-route${showRoute ? ' is-on' : ''}`}
          onClick={() => updateMap({ showRoute: !showRoute })}
          disabled={isAtCBS}
          title={isAtCBS ? "You're at CBS already" : 'Walking directions to CBS'}
        >→ CBS</button>
        <div className="v1-map-zoom">
          <button
            onClick={() => updateMap({ zoom: Math.max(8, zoom - 1) })}
            disabled={zoom <= 8}
            title="Zoom out"
          >−</button>
          <span className="z-readout">Z{zoom}</span>
          <button
            onClick={() => updateMap({ zoom: Math.min(20, zoom + 1) })}
            disabled={zoom >= 20}
            title="Zoom in"
          >+</button>
        </div>
      </div>

      <div className="v1-map-frame">
        <span className="br-bl"/>
        <span className="br-br"/>
        <iframe
          key={src}
          title={`Köln map — ${active ? active.label : 'Köln'}`}
          src={src}
          height="380"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
        <span className="v1-map-fig">FIG. {String(activeIdx + 1).padStart(2, '0')}{showRoute ? ' · ROUTE' : ` · ${KD_MAP_TYPES.find(t => t.key === mapType)?.label || ''}`}</span>
      </div>

      <div className="v1-map-quick">
        <span className="v1-map-quick-label">Quick →</span>
        {KD_QUICK_JUMPS.map((q) => (
          <button
            key={q.label}
            className="v1-map-quick-chip"
            onClick={() => jumpTo(q)}
            title={q.query}
          >
            <span aria-hidden="true">{q.emoji}</span>
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function KolnMapReadout({ place, idx, coords, distKm, openInMaps, onLabelChange, onQueryChange, onRemove }) {
  const [editingName,  setEditingName]  = React.useState(false);
  const [editingQuery, setEditingQuery] = React.useState(false);
  const [nameDraft,  setNameDraft]  = React.useState(place.label);
  const [queryDraft, setQueryDraft] = React.useState(place.query);

  React.useEffect(() => { setNameDraft(place.label);  }, [place.label]);
  React.useEffect(() => { setQueryDraft(place.query); }, [place.query]);

  const commitName  = () => { onLabelChange((nameDraft || '').trim() || place.label);  setEditingName(false); };
  const commitQuery = () => { onQueryChange((queryDraft || '').trim() || place.query); setEditingQuery(false); };

  return (
    <div className="v1-map-readout">
      <div className="v1-map-title">
        <span className="v1-map-num-tag">[ {String(idx + 1).padStart(2, '0')} ]</span>
        {editingName ? (
          <input
            autoFocus
            className="v1-map-name-input"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName();
              if (e.key === 'Escape') { setNameDraft(place.label); setEditingName(false); }
            }}
          />
        ) : (
          <span
            className="v1-map-name-display"
            onClick={() => setEditingName(true)}
            title="Click to edit label"
          >{place.label}</span>
        )}
      </div>
      {editingQuery ? (
        <input
          autoFocus
          className="v1-map-query-input"
          value={queryDraft}
          onChange={(e) => setQueryDraft(e.target.value)}
          onBlur={commitQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitQuery();
            if (e.key === 'Escape') { setQueryDraft(place.query); setEditingQuery(false); }
          }}
        />
      ) : (
        <div
          className="v1-map-query-display"
          onClick={() => setEditingQuery(true)}
          title="Click to edit address"
        >{place.query}</div>
      )}
      <div className="v1-map-meta">
        <span className="pair">
          <span className="key">Coord</span>
          {coords ? (
            <span className="val">{kdFormatDMS(coords[0], true)} · {kdFormatDMS(coords[1], false)}</span>
          ) : (
            <span className="val dim">— unmapped —</span>
          )}
        </span>
        {distKm !== null && (
          <span className="pair">
            <span className="key">Δ CBS</span>
            <span className="val">{distKm < 0.1 ? '0' : distKm.toFixed(1)} km</span>
          </span>
        )}
        <span className="actions">
          <a
            className="open-link"
            href={openInMaps}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
          >↗ MAPS</a>
          {onRemove && (
            <button
              className="v1-map-del"
              onClick={onRemove}
              title="Delete this pin"
              aria-label="Delete pin"
            >×</button>
          )}
        </span>
      </div>
    </div>
  );
}

function MilestoneCalendar({ items, categories, departure, onPick }) {
  const today = new Date();
  // Departure date drives the right edge of the calendar.
  const dep = departure ? new Date(departure + 'T00:00:00') : null;
  const startY = today.getFullYear(), startM = today.getMonth();
  const endY = dep ? dep.getFullYear() : startY, endM = dep ? dep.getMonth() : startM + 4;
  // Build the month list, capped at 6 to keep the strip readable.
  const months = [];
  let y = startY, m = startM;
  while ((y < endY || (y === endY && m <= endM)) && months.length < 6) {
    months.push({ year: y, month: m });
    m++; if (m > 11) { m = 0; y++; }
  }
  const baseYear = startY;

  // Decorate items with parsed date + category color/bg for the grid.
  const decorated = items.map(it => {
    const d = parseWhen(it.when, baseYear);
    const cd = categories[it.cat] || { color: P.dim, bg: P.lineSoft };
    return { ...it, _date: d, _color: cd.color, _bg: cd.bg,
      _key: d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : null };
  });
  const placed = decorated.filter(it => it._date);
  const unplaced = decorated.filter(it => !it._date);

  const departureKey = dep ? `${dep.getFullYear()}-${dep.getMonth()}-${dep.getDate()}` : null;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 8, marginBottom: 10, flexWrap: 'wrap',
      }}>
        <div className="va-mono" style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: P.accent, fontWeight: 700,
        }}>Calendar · here → Köln</div>
        <div className="va-sans" style={{ fontSize: 11, color: P.dim }}>
          {placed.length} milestone{placed.length === 1 ? '' : 's'} plotted
          {unplaced.length > 0 && ` · ${unplaced.length} undated`}
        </div>
      </div>
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        {months.map(({ year, month }) => (
          <MiniMonth
            key={`${year}-${month}`}
            year={year} month={month}
            milestones={placed}
            today={today}
            departureKey={departureKey}
            onPick={onPick}
          />
        ))}
      </div>
      {/* Compact legend */}
      <div className="va-sans" style={{
        marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap',
        fontSize: 10, color: P.dim, alignItems: 'center',
      }}>
        {Object.entries(categories).map(([name, cd]) => {
          const used = placed.some(p => p.cat === name);
          if (!used) return null;
          return (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8,
                borderRadius: 2, background: cd.color,
              }}/>
              {name}
            </span>
          );
        })}
        <span style={{
          marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ color: P.accent, fontWeight: 700 }}>✈</span>
          Departure
        </span>
      </div>
    </div>
  );
}

// "What's ahead" timeline with inline add/delete editor + a calendar
// visualization at the top to make the section less wordy.
function MilestoneTimeline({ state, setState, categories }) {
  const items = Array.isArray(state.upcoming) ? state.upcoming : [];
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ when: '', what: '', cat: 'Personal' });

  const catNames = Object.keys(categories);

  const addMilestone = () => {
    const when = draft.when.trim();
    const what = draft.what.trim();
    if (!when || !what) return;
    const id = 'mu-' + Date.now();
    setState(s => ({
      ...s,
      upcoming: [...(s.upcoming || []), { id, when, what, cat: draft.cat }],
    }));
    setDraft({ when: '', what: '', cat: 'Personal' });
    setAdding(false);
  };

  const removeMilestone = (id) => {
    setState(s => ({
      ...s,
      upcoming: (s.upcoming || []).filter(u => u.id !== id),
    }));
  };

  // Brief flash to draw the eye when a calendar dot is clicked.
  const [flashId, setFlashId] = React.useState(null);
  const pickById = (id) => {
    setFlashId(id);
    const el = document.getElementById(`milestone-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setFlashId(null), 1500);
  };

  return (
    <div style={{
      background: P.card, borderRadius: 18, padding: '22px 24px',
      position: 'relative',
    }}>
      <style>{`
        .v1-timeline-row { transition: background 0.12s ease; }
        .v1-timeline-row:hover { background: var(--kd-hover); }
        .v1-timeline-row.is-flash { background: var(--kd-accent-soft); }
        .v1-timeline-row .v1-timeline-del {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .v1-timeline-row:hover .v1-timeline-del { opacity: 1; }
        .v1-timeline-del {
          all: unset;
          cursor: pointer;
          width: 20px; height: 20px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 4px;
          color: var(--kd-dim);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 13px; font-weight: 700; line-height: 1;
        }
        .v1-timeline-del:hover { background: var(--kd-hover); color: var(--kd-danger); }
      `}</style>

      <MilestoneCalendar
        items={items}
        categories={categories}
        departure={state.meta && state.meta.departure}
        onPick={pickById}
      />

      <div style={{ position: 'relative', paddingLeft: 4 }}>
        <div style={{
          position: 'absolute', left: 14, top: 10, bottom: 10, width: 2,
          background: 'linear-gradient(var(--kd-accent-soft), var(--kd-accent) 30%, var(--kd-ink))',
        }}/>
        {items.map((u, i) => {
          const isLast = i === items.length - 1;
          const key = u.id || `${u.when}::${u.what}::${i}`;
          const flashed = u.id && u.id === flashId;
          return (
            <div
              key={key}
              id={u.id ? `milestone-${u.id}` : undefined}
              className={`va-sans v1-timeline-row${flashed ? ' is-flash' : ''}`}
              style={{
                position: 'relative', paddingLeft: 36,
                padding: '6px 8px 6px 36px', borderRadius: 6, marginBottom: 4,
                display: 'grid', gridTemplateColumns: '70px 1fr auto 22px', gap: 12,
                alignItems: 'center',
                scrollMarginTop: 100,
              }}>
              <div style={{
                position: 'absolute', left: 8, top: '50%', marginTop: -7,
                width: 14, height: 14, borderRadius: '50%',
                background: isLast ? P.ink : P.card,
                border: '2px solid ' + (isLast ? P.ink : P.accent),
              }}/>
              <div className="v1-timeline-when" style={{
                fontSize: 11, color: P.accent, fontWeight: 600, letterSpacing: 0.5,
              }}>{u.when}</div>
              <div className="v1-timeline-what" style={{
                fontSize: 13, color: P.ink, fontWeight: 500,
              }}>{u.what}</div>
              <CategoryChip cat={u.cat} categories={categories}/>
              {u.id && (
                <button
                  className="v1-timeline-del"
                  onClick={() => removeMilestone(u.id)}
                  title="Delete milestone"
                  aria-label="Delete milestone"
                >×</button>
              )}
              {!u.id && <span/>}
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="va-sans v1-milestone-form" style={{
          marginTop: 14, padding: 12, borderRadius: 10,
          border: `1px dashed ${P.lineDashed}`, background: P.drawer,
          display: 'grid', gridTemplateColumns: '90px 1fr 130px auto', gap: 8,
          alignItems: 'center',
        }}>
          <input
            type="text" placeholder="When" value={draft.when}
            onChange={e => setDraft(d => ({ ...d, when: e.target.value }))}
            autoFocus
            style={{
              border: `1px solid ${P.lineMid}`, background: P.card,
              padding: '6px 8px', borderRadius: 6, fontSize: 12,
              fontFamily: 'inherit', color: P.ink, minWidth: 0,
            }}
          />
          <input
            type="text" placeholder="What" value={draft.what}
            onChange={e => setDraft(d => ({ ...d, what: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addMilestone()}
            style={{
              border: `1px solid ${P.lineMid}`, background: P.card,
              padding: '6px 8px', borderRadius: 6, fontSize: 12,
              fontFamily: 'inherit', color: P.ink, minWidth: 0,
            }}
          />
          <select
            value={draft.cat}
            onChange={e => setDraft(d => ({ ...d, cat: e.target.value }))}
            style={{
              border: `1px solid ${P.lineMid}`, background: P.card,
              padding: '6px 8px', borderRadius: 6, fontSize: 12,
              fontFamily: 'inherit', color: P.ink,
            }}
          >
            {catNames.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={addMilestone} style={{
              border: 'none', background: P.accent, color: P.card,
              padding: '6px 12px', borderRadius: 6, fontSize: 11,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Add</button>
            <button onClick={() => { setAdding(false); setDraft({ when: '', what: '', cat: 'Personal' }); }} style={{
              border: `1px solid ${P.lineMid}`, background: 'transparent',
              color: P.dim, padding: '6px 10px', borderRadius: 6, fontSize: 11,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="va-sans"
          style={{
            marginTop: 14, marginLeft: 36,
            border: `1px dashed ${P.lineDashed}`, background: 'transparent',
            color: P.dim, padding: '8px 14px', borderRadius: 8,
            fontSize: 12, fontFamily: 'inherit', fontWeight: 500,
            cursor: 'pointer',
          }}
        >+ Add milestone</button>
      )}
    </div>
  );
}

// Single-icon light/dark toggle. Shows the icon you'd switch TO —
// click ☾ to go dark, ☀ to go light.
function ThemeToggle({ state, setState }) {
  const theme = (state.ui && state.ui.theme) || 'light';
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const next = theme === 'light' ? 'dark' : 'light';
  const icon = next === 'dark' ? '☾' : '☀';
  const toggle = () => setState(s => ({ ...s, ui: { ...s.ui, theme: next } }));
  return (
    <button
      onClick={toggle}
      title={next === 'dark' ? 'Switch to dark' : 'Switch to light'}
      aria-label={next === 'dark' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        cursor: 'pointer',
        width: 30, height: 30,
        border: `1px solid ${P.lineMid}`,
        borderRadius: 999,
        background: P.card,
        color: P.dimStrong,
        fontSize: 15, lineHeight: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'background 0.18s ease, color 0.18s ease, transform 0.18s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = P.hover; e.currentTarget.style.color = P.accent; }}
      onMouseLeave={e => { e.currentTarget.style.background = P.card;  e.currentTarget.style.color = P.dimStrong; }}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
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
          background: `linear-gradient(90deg, ${P.dimSoft} 0%, ${P.accent} 100%)`,
          transition: 'width 0.7s cubic-bezier(.4,.6,.3,1)',
          borderRadius: 999,
        }}/>
      </div>

      {/* Flow diagram */}
      <div className="v1-blocked-flow" style={{
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
        <div className="v1-blocked-months" style={{
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
      <div className="v1-blocked-facts" style={{
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
          background: `linear-gradient(90deg, ${P.dimSoft} 0%, ${P.accent} 100%)`,
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
                background: c.author === 'VJ' ? 'var(--kd-vj-bubble)' : P.accentSoft,
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
          display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
        }}>
          {!checked && (() => {
            const pinned = (state.pinned || []).includes(task.id);
            const pinCount = (state.pinned || []).length;
            const disabled = !pinned && pinCount >= 3;
            return (
              <button
                onClick={() => setState(s => KD.togglePin(s, task.id))}
                disabled={disabled}
                title={pinned ? 'Unpin' : disabled ? '3 tasks already pinned — unpin one first' : 'Pin as in progress'}
                style={{
                  border: `1px solid ${pinned ? P.accent : P.lineMid}`,
                  background: pinned ? P.accent : 'transparent',
                  color: pinned ? P.card : P.dimStrong,
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 12, fontWeight: 600,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>▶</span>
                {pinned ? 'In progress' : 'Mark in progress'}
              </button>
            );
          })()}
          <button onClick={deleteTask} style={{
            border: '1px solid rgba(154,47,63,0.3)', background: 'transparent',
            color: P.danger, padding: '6px 12px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            marginLeft: 'auto',
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
