# koln-dash

Personal study-abroad dashboard for a semester in Köln. Tracks budget, tasks
(Kanban-style, split across two lanes — VJ & Jul), and an FX calculator. State
persists in `localStorage`.

## Run locally

No build step. Serve the folder with any static server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly — React, ReactDOM, and Babel Standalone are
loaded from unpkg.

## Layout

```
index.html       Entry point + <App/> wrapper. Loads scripts in order.
data.js          State model, defaults, helpers (window.KD / window.KD_DEFAULTS).
ui.jsx           Shared components: chips, pills, editable fields, drawers.
dashboard.jsx    Top-level VariationA layout + section components.
```

All scripts attach to `window` — there is no bundler. Runtime order matters:
`data.js` → `ui.jsx` → `dashboard.jsx`.

## State

Shape is documented as JSDoc typedefs at the top of `data.js`
(`KDState`, `Task`, `MoneyLine`, `Comment`, `NoteEntry`, `LineStatus`, `Urgency`).
Persisted under `localStorage` key `kd-state-v1`. Use the "Reset state" button
in the footer to wipe it.

## Shared tokens

Status + urgency options, colors, and a small palette live on `window.KD`:

- `KD.statusOptions` / `KD.statusColor` — `sent` / `pending` / `recurring`
- `KD.urgencyOptions` / `KD.urgencyColor` — `asap` / `soon` / `later`
- `KD.palette` — paper / card / ink / dim / line / accent / danger

Prefer these over hardcoding hex values in new components.

## FX rates

`KD.refreshExchangeRates(setState)` pulls EUR→USD and EUR→IDR from
`open.er-api.com` and writes them onto `state.money`. It returns
`'ok' | 'failed' | 'offline'` so the caller can show a status label.
The `FxCalculator` component auto-refreshes once per hour.

## Deployment

Deployed via Vercel (static). Nothing to configure — push and it ships.
