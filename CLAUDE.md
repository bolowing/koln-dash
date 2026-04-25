# CLAUDE.md

Personal dashboard tracking my brother VJ's study-abroad semester in Köln. Two people use it — me (Jul) and VJ — to keep budget, prep tasks, and FX conversions in one place.

See `README.md` for the run/layout/state overview. Notes specifically for working in here:

## Stack quirks

- No bundler, no build step. Plain `index.html` + Babel Standalone in the browser.
- Script load order matters: `data.js` → `ui.jsx` → `dashboard.jsx`. Everything attaches to `window` (`KD`, `KD_DEFAULTS`).
- React 18 via UMD from unpkg. No JSX imports — components are global.
- Deployed as a static site on Vercel; pushing to `main` ships it.

## Editing conventions

- Use tokens from `window.KD` (`KD.palette`, `KD.statusColor`, `KD.urgencyColor`) instead of hardcoded hex.
- State shape is documented as JSDoc typedefs at the top of `data.js` — update those when adding fields.
- Persisted state lives under `localStorage` key `kd-state-v1`. Migrations on shape changes need a thought (or bump the key); the footer "Reset state" button is the escape hatch.
- Mobile styles live as overrides in `index.html`'s `<style>` block under `@media (max-width: 720px)`. Class names there (`v1-*`) must match what `dashboard.jsx` / `ui.jsx` render.

## Tasks lanes

Tasks are split across two lanes: VJ and Jul. Keep that distinction when adding task-related features.

## What this project is NOT

Not a product, not multi-user, not backed by a server. Don't add auth, a backend, a build pipeline, or a framework migration unless explicitly asked.
