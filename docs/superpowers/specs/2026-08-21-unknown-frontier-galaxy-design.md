# Unknown Frontier — Procedural Galaxy Design

Date: 2026-08-21
Status: Approved (brainstorming), pending implementation plan

## Context

`unknown-frontier/unknown-frontier.html` currently shows a placeholder hero
with a small three.js solar system (`unknown-frontier/js/solar-system.js`) as
a stand-in visual while the Unknown Frontier setting is built out. The goal
is to replace that solar system with a procedurally-generated galaxy view,
inspired by [zjoooooo/galaxy-explorer](https://github.com/zjoooooo/galaxy-explorer)
(PolyForm Noncommercial License — used only as visual/feature inspiration,
no code is copied). The reference project is far larger in scope (custom
GLSL nebula shaders, ~85k particles, 5 languages, wormhole transitions,
radio jets, audio) than this site needs; this spec scopes a much smaller
"Medium complexity, mobile-safe" version fit for a static-site hero visual.

## Goals

- Replace the solar system view with an explorable procedural galaxy
  (spiral arms, core glow, nebula wisps, starfield) as the Unknown Frontier
  hero visual.
- Keep the existing site constraints: no build process, no dependencies
  beyond what's already used (three.js + OrbitControls via import map),
  content/behavior lives directly in HTML/CSS/JS.
- Stay mobile-safe: ~5,000-8,500 total particles/points across all layers.
- Add a small number of clickable placeholder "beacon" markers so the
  interaction pattern (click a point → info card) exists and is easy to
  populate with real lore later, without requiring real content now.

## Non-goals

- No custom GLSL shaders, no nebula volumetric shader field.
- No real bloom postprocessing pipeline (`UnrealBloomPass`) — glow is
  faked via additive-blended sprite textures instead.
- No audio, no multi-language UI, no wormhole/fly-to camera choreography,
  no comets, no radio jets, no FPS watchdog / dynamic quality scaling.
- No real Unknown Frontier lore/content for beacons yet — placeholders only.
- No changes to any other setting (Centuria) or to the root hub page.

## Architecture

- **`unknown-frontier/js/galaxy.js`** (new) — replaces
  `unknown-frontier/js/solar-system.js` (deleted). Single ES module, same
  loading pattern as the file it replaces: vanilla three.js + `OrbitControls`
  via the existing import map in `unknown-frontier.html`, no bundler. A
  tunables block at the top of the file (particle counts, colors, spin
  speed, arm count) mirrors the `PLANETS` constant style of the current file.
- **`unknown-frontier/unknown-frontier.html`** — script `src` swapped from
  `js/solar-system.js` to `js/galaxy.js`; hint text under the canvas updated
  to mention clicking a point ("Trascina per ruotare · Scroll per zoom ·
  Click su un punto per info"); canvas container element reused as-is.
- **`unknown-frontier/css/unknown-frontier.css`** — new rules added for the
  beacon overlay card and marker labels; existing hero/topbar/canvas rules
  untouched.

## Visual composition (~8-8.5k particles total)

| Layer | Count | Technique |
|---|---|---|
| Spiral disc | ~5,000 | Log-spiral point placement (2-3 arms), `BufferGeometry` + `PointsMaterial` with per-vertex color, warm core → cool blue arms |
| Galactic core glow | 1 sprite | Additive-blended sprite using a canvas-generated radial-gradient texture (no GLSL); slow scale pulse for a "breathing" effect |
| Nebula wisps | ~1,000-1,500 | Same canvas-gradient sprite technique as the core glow, scattered along the arms at low opacity — gas-cloud look without shaders |
| Deep-field starfield | ~2,000 | Reuses the existing `starField()` sphere-distribution approach from `solar-system.js` almost unchanged |

The whole disc group rotates slowly via a `GALAXY_SPIN` tunable, following
the rotation pattern already used for the sun/planets in the current file.

## Beacons (placeholder)

- 4-6 fixed points positioned along/near the spiral arms, defined in a
  `BEACONS` array in `galaxy.js`: `{ name: '???', position: [x, y, z] }`.
- Each beacon renders as a small glowing marker (sprite) plus an optional
  screen-space label.
- Click handling via raycasting against the beacon markers (same vanilla
  DOM/JS style as `centuria/js/nation-tabs.js` — no framework).
- A single reusable `<div id="beacon-card">` in the HTML is toggled via a
  CSS class on click, populated from the clicked beacon's data — not
  per-beacon markup. Card shows a placeholder title ("Punto sconosciuto"),
  the existing `.placeholder-badge` "In Costruzione" styling, and a close
  button. Populating real content later is a one-line edit per beacon
  entry in the `BEACONS` array.

## Camera & controls

- `OrbitControls` reused as-is (drag to rotate, scroll to zoom); `minDistance`
  / `maxDistance` retuned for galaxy scale instead of solar-system scale.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` kept from the
  current file.
- No FPS watchdog or dynamic quality scaling — the fixed ~8k particle budget
  is the perf guardrail for the mobile-safe target.

## Error handling

No new error handling beyond what exists today: this is a static,
client-side-only scene with no network calls and no user data. If WebGL is
unavailable, the canvas stays blank, matching current behavior — no
fallback UI is in scope.

## Testing

No test suite exists in this repo (static site, per CLAUDE.md). Verification
is manual, via a local static server (`python -m http.server` per the
project's existing local-testing instructions):

- Rotation/zoom feel smooth at the target particle budget.
- Clicking a beacon opens the card; clicking close (or another beacon)
  behaves correctly.
- Window resize keeps the canvas and camera aspect correct.
- Spot-check in a throttled/mobile viewport (devtools) to confirm the
  ~8k particle budget holds up reasonably on weaker hardware.

## Licensing note

`zjoooooo/galaxy-explorer` is inspiration only (feature ideas: spiral arms,
core glow, beacons-with-cards, nebula-via-particles) — no source from that
repository is copied into this project. `galaxy.js` is written from scratch
against three.js APIs directly.
