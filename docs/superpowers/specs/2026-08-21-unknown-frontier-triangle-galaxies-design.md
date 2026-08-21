# Unknown Frontier — Triangle of Galaxies + Central Black Hole Design

Date: 2026-08-21
Status: Approved (brainstorming), pending implementation plan

## Context

The Unknown Frontier hero currently renders a single procedurally-generated
spiral galaxy (`unknown-frontier/js/galaxy.js`, built per
`docs/superpowers/specs/2026-08-21-unknown-frontier-galaxy-design.md`), with
5 clickable placeholder beacons, hover feedback, and a shared info-card
overlay. This spec expands that scene to three distinct galaxies —
positioned at the vertices of an equilateral triangle — with a central black
hole, extending the existing visual language rather than replacing it.

## Goals

- Add two more procedurally-generated galaxies, visually distinct from the
  existing spiral and from each other (elliptical + irregular).
- Position all three galaxies at the vertices of an equilateral triangle,
  with a black hole (event horizon + accretion disk) at the centroid.
- Keep the total scene mobile-safe by shrinking each galaxy's particle
  budget rather than growing the overall budget proportionally.
- Add 5 more placeholder beacons per new galaxy (matching the existing
  spiral's 5), plus make the black hole itself clickable, all reusing the
  existing hover/click/card interaction system.
- Default camera view shows the whole triangle composition on load.

## Non-goals

- No real physics, no gravitational lensing shader, no accurate orbital
  mechanics between the three galaxies (they are static at their triangle
  vertices; only their internal star-field groups spin in place).
- No custom GLSL shaders, no `UnrealBloomPass`, no new dependencies — same
  constraints as the original galaxy spec.
- No real lore/content for the 10 new beacons or the black hole yet —
  placeholders only, same as the existing 5.
- No changes to Centuria or the root hub page.

## Architecture

- **`unknown-frontier/js/galaxy-shapes.js`** (new) — exports
  `buildSpiralGalaxy(opts)`, `buildEllipticalGalaxy(opts)`,
  `buildIrregularGalaxy(opts)`, and `makeGlowTexture(innerColor, outerColor,
  size)` (moved here from `galaxy.js`, since all three shape builders and
  the black hole need it). Each shape builder takes an options object
  (particle count, radius, position, colors) and returns a `THREE.Group`
  positioned at the given world coordinates and centered on local origin —
  the builders have no knowledge of the triangle layout; the orchestrator
  positions the returned groups.
- **`unknown-frontier/js/galaxy.js`** (rewritten as orchestrator) — scene,
  camera, renderer, `OrbitControls`, calls the 3 shape builders plus a new
  `buildBlackHole()`, holds one flattened `beaconMeshes` array spanning all
  4 objects (3 galaxies + black hole) for raycasting, runs the animate loop
  (each galaxy group can spin at its own rate for visual differentiation),
  and generalizes the existing hover/click/card logic to the combined list.
- **`unknown-frontier/unknown-frontier.html`** / **`unknown-frontier/css/unknown-frontier.css`**
  — no structural changes expected (the existing `#beacon-card` overlay is
  reused as-is for all 16 clickable points); only the script tag imports
  the new module if needed.

## Particle budget (~9,500-10,500 total, mobile-safe)

| Layer | Count | Notes |
|---|---|---|
| Spiral galaxy disc | 3,000 | Same log-spiral math as today, reduced from 5,000; radius ~40 (down from 60) |
| Spiral nebula wisps | 800 | Reduced from 1,200 |
| Elliptical galaxy | ~2,500 | Dense smooth ovoid cloud, radial falloff, no arms, no nebula (ellipticals are gas-poor) |
| Irregular galaxy | ~2,000 | 2-3 offset blob clusters, chaotic silhouette, mixed blue/reddish knots |
| Shared starfield backdrop | 1,500 | Reduced from 2,000 (single shared backdrop, not per-galaxy) |
| Black hole accretion disk | ~500 | Flat annulus of points around the event horizon sphere |

## Galaxy shapes

- **Spiral (existing, re-scoped)**: unchanged log-spiral placement formula,
  cyan core → cyan arms, violet nebula wisps — just at the reduced budget
  and radius above.
- **Elliptical (new)**: smooth ovoid point cloud with no arm structure —
  points distributed with a radial falloff from center (denser toward the
  middle), squashed non-uniformly on one axis for an elliptical silhouette.
  Warm, uniform color (amber/bone tones from the existing palette) —
  visually distinct from the spiral's cyan/violet.
- **Irregular (new)**: 2-3 randomly-placed, overlapping Gaussian-ish blob
  clusters offset from a common center, no symmetry — mixed color tinting
  per blob (alternating cooler and warmer hues from palette-adjacent
  colors) for a chaotic, clearly-not-spiral-or-elliptical silhouette.

## Triangle layout

Three galaxy groups placed at the vertices of an equilateral triangle in
the XZ plane, side length ~200 units (enough separation that each galaxy's
~40-radius footprint doesn't overlap its neighbors, with room at the
centroid for the black hole and its accretion disk). The black hole sits
at the triangle's centroid. Each galaxy group's `position` is set to its
computed vertex coordinates; the shape builders themselves are unaware of
the triangle — they always build centered on local origin.

## Black hole

- **Event horizon**: small dark sphere (`SphereGeometry` +
  `MeshBasicMaterial`, near-black, unlit) at the triangle centroid.
- **Accretion disk**: ~500-point flat annulus (`THREE.Points`, slight tilt)
  using `makeGlowTexture` with warm orange/white colors, additive blend,
  spinning faster than any galaxy group (reads as "actively feeding").
- **Ambient glow**: one `makeGlowTexture`-based sprite behind the disk
  (same recipe as the existing `coreGlow`), dim violet/white, for a soft
  glow bleed.
- **Clickable**: yes — added to the shared `beaconMeshes` raycasting list
  with the same hover-grow + card behavior as beacons. Card title is
  **"Buco Nero"** (not the `'Punto sconosciuto'` placeholder used by
  beacons — a black hole is a known category, not unknown lore), with the
  same "In Costruzione" badge as everything else.

## Beacons & interaction (generalized)

- 5 placeholder beacons per new galaxy (10 total new, 15 overall across all
  three galaxies), same shape/data as the existing spiral's 5:
  `{ name: 'Punto sconosciuto', position: [x, y, z] }` in each galaxy's
  local space. Beacons are children of their galaxy's own group, so they
  rotate/wobble with it — same pattern as today's spiral beacons.
- The black hole's clickable hit target (the sphere, or an invisible
  slightly-larger hit sprite if the sphere proves too small to click
  reliably) is added to the same combined `beaconMeshes` array used for
  raycasting.
- The existing pointermove-hover (cursor + scale-grow) and
  drag-vs-click-distance-gate logic is unchanged in behavior — it is
  generalized only in that it now iterates a 16-entry combined array
  instead of 5.

## Camera & controls

- Default camera position and `OrbitControls` framing show the entire
  triangle composition on load (not just the spiral galaxy) — starting
  point ~`(0, 140, 260)`, to be empirically tuned during
  implementation/verification exactly as the original galaxy's camera was.
- `controls.maxDistance` raised to ~500 to allow zooming out further than
  the current 220; `controls.minDistance` unchanged (~20) so zooming into
  one galaxy up close still works.

## Per-galaxy spin

Each galaxy group spins at its own rate for visual differentiation (free
consequence of separating the groups): the spiral keeps its current
`GALAXY_SPIN` rate, the elliptical spins noticeably slower (ellipticals are
visually "calmer"), and the irregular gets a slight wobble/tumble in
addition to slow rotation for its chaotic character. Exact rates are
implementation-detail tunables, not fixed by this spec beyond "visibly
different from each other."

## Error handling

Unchanged from the original galaxy spec: no new error handling needed —
static, client-side-only scene, no network calls, no user data. WebGL
unavailability still means a blank canvas (no fallback UI).

## Testing

Manual, via local static server, same approach as the original galaxy spec:

- Rotation/zoom feel smooth at the new (~10k) particle budget.
- Hover feedback (cursor + scale-grow) and click-to-open-card work for all
  16 clickable points (5 per galaxy x 3 + black hole), including on the
  newly-added elliptical and irregular galaxies' beacons.
- Close button / clicking a different point / clicking empty space all
  behave correctly, same as today.
- Window resize keeps canvas/camera aspect correct.
- Default camera framing shows the whole triangle + black hole without
  heavy clipping, at both desktop and mobile viewport sizes.
- Spot-check in a throttled/mobile viewport (devtools) to confirm the
  ~10k particle budget holds up reasonably on weaker hardware.
- No console errors at any point.

## Licensing note

Same as the original galaxy spec: `zjoooooo/galaxy-explorer` remains
inspiration only for the general concept of multiple distinct galaxy
"types" with clickable beacons — no source is copied; all shape math here
is original, written from scratch against three.js APIs.
