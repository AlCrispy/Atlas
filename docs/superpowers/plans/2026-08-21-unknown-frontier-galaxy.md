# Unknown Frontier Procedural Galaxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder solar system on the Unknown Frontier page with a procedurally-generated, mobile-safe galaxy (spiral arms, core glow, nebula wisps, starfield) with clickable placeholder beacons.

**Architecture:** Single new ES module `unknown-frontier/js/galaxy.js` (vanilla three.js + `OrbitControls`, no bundler, loaded via the import map already in `unknown-frontier.html`) replaces `unknown-frontier/js/solar-system.js`. All visual layers (starfield, spiral disc, core glow, nebula wisps, beacons) are added to one `THREE.Scene` and rendered in a single `requestAnimationFrame` loop. Beacon clicks use raycasting against sprite markers and toggle one reusable HTML overlay card.

**Tech Stack:** three.js 0.160.0 (via `cdn.jsdelivr.net`, existing import map), `OrbitControls` addon, vanilla JS/CSS/HTML — no build step, no test framework (per project convention, verification is manual in-browser).

**Spec:** `docs/superpowers/specs/2026-08-21-unknown-frontier-galaxy-design.md`

## Global Constraints

- No build process, no new dependencies — only `three` + `three/addons/controls/OrbitControls.js` via the existing import map in `unknown-frontier.html`.
- Total particle/point budget across all layers: ~5,000-8,500 (mobile-safe target from the spec).
- No custom GLSL shaders, no `UnrealBloomPass` — glow is faked via canvas-generated additive-blended sprite/point textures.
- No audio, no multi-language UI, no comets, no radio jets, no FPS watchdog.
- All user-visible text is Italian; all code (comments, identifiers) is English, per `CLAUDE.md`.
- No source is copied from `zjoooooo/galaxy-explorer` — inspiration only, written from scratch against three.js APIs.
- Site palette for Unknown Frontier (from `unknown-frontier/css/unknown-frontier.css`): `--hz-cyan: #4fd8e8`, `--hz-cyan-lt: #9df0fa`, `--hz-violet: #8a6ae8`, `--hz-bone: #d6dcf2`, `--hz-ash: #7d8bb0`, `--hz-panel-lt: #131a2e`, `--hz-steel: #2a3550`. Use these, not Centuria's gold accent — Unknown Frontier has no gold in its palette.
- Canvas container element and id (`<div id="solar-system" class="solar-system-canvas">`) are reused as-is — no HTML restructuring of the hero.

---

### Task 1: Base scene scaffold + starfield, wire up HTML, remove old file

**Files:**
- Create: `unknown-frontier/js/galaxy.js`
- Delete: `unknown-frontier/js/solar-system.js`
- Modify: `unknown-frontier/unknown-frontier.html` (script `src`, hint text)

**Interfaces:**
- Produces: module-level `scene` (`THREE.Scene`), `camera` (`THREE.PerspectiveCamera`), `renderer` (`THREE.WebGLRenderer`), `container` (the `#solar-system` div), `clock` (`THREE.Clock`), and an `animate()` loop that later tasks hook into via marked comment sections (`// === Disc (Task 2) ===`, `// === Core glow (Task 3) ===`, `// === Nebula wisps (Task 4) ===`, `// === Beacons (Task 5) ===`). The loop computes `const delta = clock.getDelta();` each frame before `controls.update()` — later tasks use this `delta` for rotation.

- [ ] **Step 1: Delete the old solar system script**

```bash
rm "unknown-frontier/js/solar-system.js"
```

- [ ] **Step 2: Create `unknown-frontier/js/galaxy.js` with the base scene, starfield, and animation loop**

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// === Tunables ===
const GALAXY_SPIN = 0.015;
const ARM_COUNT = 3;
const DISC_RADIUS = 60;
const DISC_PARTICLE_COUNT = 5000;
const NEBULA_PARTICLE_COUNT = 1200;
const STARFIELD_COUNT = 2000;

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 45, 95);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 20;
controls.maxDistance = 220;

// === Starfield ===
function buildStarfield() {
  const count = STARFIELD_COUNT;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 150 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.7 });
  scene.add(new THREE.Points(geometry, material));
}
buildStarfield();

// === Disc (Task 2) ===

// === Core glow (Task 3) ===

// === Nebula wisps (Task 4) ===

// === Beacons (Task 5) ===

// === Animation loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
```

- [ ] **Step 3: Update `unknown-frontier/unknown-frontier.html` to load the new script and hint text**

Change:
```html
<script type="module" src="js/solar-system.js"></script>
```
to:
```html
<script type="module" src="js/galaxy.js"></script>
```

Change:
```html
<p class="hz-hint">Trascina per ruotare · Scroll per zoom</p>
```
to:
```html
<p class="hz-hint">Trascina per ruotare · Scroll per zoom · Click su un punto per info</p>
```

- [ ] **Step 4: Manually verify in browser**

Run: `python -m http.server 8000` from the repo root, open `http://localhost:8000/unknown-frontier/unknown-frontier.html`.

Expected: dark canvas with a scattered white starfield fills the `#solar-system` container; drag rotates the (empty, star-only) scene; scroll zooms between the configured min/max distance; no console errors.

- [ ] **Step 5: Commit**

```bash
git add unknown-frontier/js/galaxy.js unknown-frontier/unknown-frontier.html
git rm unknown-frontier/js/solar-system.js
git commit -m "feat(unknown-frontier): scaffold galaxy scene, remove solar system"
```

---

### Task 2: Spiral disc point cloud

**Files:**
- Modify: `unknown-frontier/js/galaxy.js`

**Interfaces:**
- Consumes: `scene` (`THREE.Scene`), `DISC_RADIUS`, `ARM_COUNT`, `DISC_PARTICLE_COUNT`, `GALAXY_SPIN`, `delta` (from the animate loop, Task 1).
- Produces: module-level `galaxyDisc` (`THREE.Points`), rotated by `GALAXY_SPIN * delta` each frame — later tasks (nebula wisps) reuse the same spiral-placement approach but do not depend on `galaxyDisc` directly.

- [ ] **Step 1: Add the spiral disc builder above the `// === Disc (Task 2) ===` marker**

Replace:
```js
// === Disc (Task 2) ===
```
with:
```js
// === Disc ===
function buildSpiralDisc() {
  const count = DISC_PARTICLE_COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const coreColor = new THREE.Color(0x9df0fa);
  const armColor = new THREE.Color(0x4fd8e8);
  const armTightness = 0.55;

  for (let i = 0; i < count; i++) {
    const arm = i % ARM_COUNT;
    const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
    const t = Math.random();
    const radius = t * DISC_RADIUS;
    const spiralAngle = armAngleOffset + radius * armTightness + (Math.random() - 0.5) * 0.5;
    const height = (Math.random() - 0.5) * 2 * (1 - t) * 3;

    positions[i * 3] = Math.cos(spiralAngle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(spiralAngle) * radius;

    const color = coreColor.clone().lerp(armColor, t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  const disc = new THREE.Points(geometry, material);
  scene.add(disc);
  return disc;
}
const galaxyDisc = buildSpiralDisc();
```

- [ ] **Step 2: Rotate the disc in the animation loop**

Replace:
```js
  const delta = clock.getDelta();

  controls.update();
```
with:
```js
  const delta = clock.getDelta();

  galaxyDisc.rotation.y += delta * GALAXY_SPIN;

  controls.update();
```

- [ ] **Step 3: Manually verify in browser**

Reload `http://localhost:8000/unknown-frontier/unknown-frontier.html`.

Expected: a 3-armed spiral disc of colored points (cyan-ish, brighter near center) visible in the scene, slowly rotating; starfield still visible behind it; no console errors.

- [ ] **Step 4: Commit**

```bash
git add unknown-frontier/js/galaxy.js
git commit -m "feat(unknown-frontier): add rotating spiral disc to galaxy scene"
```

---

### Task 3: Core glow sprite

**Files:**
- Modify: `unknown-frontier/js/galaxy.js`

**Interfaces:**
- Consumes: `scene`, `clock` (for pulsing via `clock.getElapsedTime()`).
- Produces: `makeGlowTexture(innerColor, outerColor, size = 128)` (returns `THREE.CanvasTexture`) — reused by Task 4 (nebula) and Task 5 (beacons); `coreGlow` (`THREE.Sprite`), pulsed each frame.

- [ ] **Step 1: Add the glow texture helper and core glow sprite above the `// === Core glow (Task 3) ===` marker**

Replace:
```js
// === Core glow (Task 3) ===
```
with:
```js
// === Glow texture helper ===
function makeGlowTexture(innerColor, outerColor, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// === Core glow ===
const coreGlowTexture = makeGlowTexture('rgba(157,240,250,0.9)', 'rgba(157,240,250,0)');
const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: coreGlowTexture,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
coreGlow.scale.set(18, 18, 1);
scene.add(coreGlow);
```

- [ ] **Step 2: Pulse the core glow in the animation loop**

Replace:
```js
  const delta = clock.getDelta();

  galaxyDisc.rotation.y += delta * GALAXY_SPIN;

  controls.update();
```
with:
```js
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  galaxyDisc.rotation.y += delta * GALAXY_SPIN;
  const corePulse = 18 + Math.sin(elapsed * 0.5) * 2;
  coreGlow.scale.set(corePulse, corePulse, 1);

  controls.update();
```

- [ ] **Step 3: Manually verify in browser**

Reload the page.

Expected: a soft glowing light-blue blob at the galaxy center, slowly pulsing in size, additively blended (brighter where it overlaps the disc); no console errors.

- [ ] **Step 4: Commit**

```bash
git add unknown-frontier/js/galaxy.js
git commit -m "feat(unknown-frontier): add pulsing core glow sprite"
```

---

### Task 4: Nebula wisps

**Files:**
- Modify: `unknown-frontier/js/galaxy.js`

**Interfaces:**
- Consumes: `scene`, `makeGlowTexture` (Task 3), `DISC_RADIUS`, `ARM_COUNT`, `NEBULA_PARTICLE_COUNT`.
- Produces: `nebulaWisps` (`THREE.Points`) — no later task depends on this directly (it is not rotated, to keep the animation loop simple and matte the disc's rotation is enough motion cue).

- [ ] **Step 1: Add the nebula wisps builder above the `// === Nebula wisps (Task 4) ===` marker**

Replace:
```js
// === Nebula wisps (Task 4) ===
```
with:
```js
// === Nebula wisps ===
const nebulaTexture = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');

function buildNebulaWisps() {
  const count = NEBULA_PARTICLE_COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const nebulaColor = new THREE.Color(0x8a6ae8);
  const armTightness = 0.55;

  for (let i = 0; i < count; i++) {
    const arm = i % ARM_COUNT;
    const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
    const t = Math.random();
    const radius = t * DISC_RADIUS * 0.9;
    const spiralAngle = armAngleOffset + radius * armTightness + (Math.random() - 0.5) * 0.9;
    const height = (Math.random() - 0.5) * 4;

    positions[i * 3] = Math.cos(spiralAngle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(spiralAngle) * radius;

    colors[i * 3] = nebulaColor.r;
    colors[i * 3 + 1] = nebulaColor.g;
    colors[i * 3 + 2] = nebulaColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    map: nebulaTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const wisps = new THREE.Points(geometry, material);
  scene.add(wisps);
  return wisps;
}
const nebulaWisps = buildNebulaWisps();
```

- [ ] **Step 2: Manually verify in browser**

Reload the page.

Expected: faint violet-tinted soft cloud patches following the spiral arms, additively blended, don't overpower the disc points; total scene still feels like a galaxy, not a blur; no console errors.

- [ ] **Step 3: Commit**

```bash
git add unknown-frontier/js/galaxy.js
git commit -m "feat(unknown-frontier): add nebula wisps along spiral arms"
```

---

### Task 5: Beacons (placeholder markers + info card)

**Files:**
- Modify: `unknown-frontier/js/galaxy.js`
- Modify: `unknown-frontier/unknown-frontier.html` (add `#beacon-card` markup)
- Modify: `unknown-frontier/css/unknown-frontier.css` (add beacon card + close button styles)

**Interfaces:**
- Consumes: `scene`, `camera`, `renderer`, `makeGlowTexture` (Task 3).
- Produces: `BEACONS` array (`{ name: string, position: [number, number, number] }[]`), `beaconMeshes` (`THREE.Sprite[]`), click handling wired directly to `renderer.domElement` — no later task depends on these (final task in the plan).

- [ ] **Step 1: Add the `#beacon-card` markup to `unknown-frontier/unknown-frontier.html`**

Replace:
```html
<div id="solar-system" class="solar-system-canvas"></div>
<p class="hz-hint">Trascina per ruotare · Scroll per zoom · Click su un punto per info</p>
```
with:
```html
<div id="solar-system" class="solar-system-canvas"></div>
<div id="beacon-card" class="beacon-card">
  <button class="beacon-card-close" aria-label="Chiudi">&times;</button>
  <p class="placeholder-badge">In Costruzione</p>
  <h3 class="beacon-card-title">Punto sconosciuto</h3>
</div>
<p class="hz-hint">Trascina per ruotare · Scroll per zoom · Click su un punto per info</p>
```

- [ ] **Step 2: Add beacon card styles to `unknown-frontier/css/unknown-frontier.css`**

Append to the end of the file:
```css
.beacon-card {
  position: fixed; z-index: 400;
  bottom: 32px; left: 50%;
  transform: translate(-50%, 20px);
  width: min(320px, calc(100vw - 48px));
  background: var(--hz-panel-lt);
  border: 1px solid var(--hz-steel);
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  padding: 24px;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.beacon-card.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}
.beacon-card .placeholder-badge { margin-bottom: 14px; }
.beacon-card-title {
  font-family: 'Orbitron', sans-serif; font-size: 1rem;
  color: var(--hz-bone); letter-spacing: 0.05em;
}
.beacon-card-close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none; cursor: pointer;
  font-size: 1.2rem; line-height: 1; color: var(--hz-ash);
  transition: color 0.2s;
}
.beacon-card-close:hover { color: var(--hz-cyan-lt); }
```

- [ ] **Step 3: Add beacon markers and click handling to `unknown-frontier/js/galaxy.js`**

Replace:
```js
// === Beacons (Task 5) ===
```
with:
```js
// === Beacons ===
const BEACONS = [
  { name: '???', position: [18, 2, -10] },
  { name: '???', position: [-25, -1, 14] },
  { name: '???', position: [32, 3, 20] },
  { name: '???', position: [-14, -2, -30] },
  { name: '???', position: [40, 1, -5] },
];

const beaconTexture = makeGlowTexture('rgba(138,106,232,1)', 'rgba(138,106,232,0)');
const beaconMeshes = BEACONS.map((beacon) => {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: beaconTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  sprite.scale.set(2.5, 2.5, 1);
  sprite.position.set(...beacon.position);
  sprite.userData.beacon = beacon;
  scene.add(sprite);
  return sprite;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const beaconCard = document.getElementById('beacon-card');
const beaconCardTitle = beaconCard.querySelector('.beacon-card-title');
const beaconCardClose = beaconCard.querySelector('.beacon-card-close');

function showBeaconCard(beacon) {
  beaconCardTitle.textContent = beacon.name;
  beaconCard.classList.add('is-visible');
}

function hideBeaconCard() {
  beaconCard.classList.remove('is-visible');
}

beaconCardClose.addEventListener('click', hideBeaconCard);

renderer.domElement.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(beaconMeshes);
  if (hits.length > 0) {
    showBeaconCard(hits[0].object.userData.beacon);
  }
});
```

- [ ] **Step 4: Manually verify in browser**

Reload the page.

Expected: 5 small violet glowing markers scattered among the disc; clicking directly on one opens the card at the bottom with "Punto sconosciuto" title and "In Costruzione" badge; clicking the card's close button (×) hides it; clicking empty space does nothing; no console errors.

- [ ] **Step 5: Commit**

```bash
git add unknown-frontier/js/galaxy.js unknown-frontier/unknown-frontier.html unknown-frontier/css/unknown-frontier.css
git commit -m "feat(unknown-frontier): add clickable placeholder beacons with info card"
```

---

### Task 6: Final tuning pass and full manual verification

**Files:**
- Modify: `unknown-frontier/js/galaxy.js` (camera/controls distance tuning only, if needed)

**Interfaces:**
- Consumes: everything built in Tasks 1-5.
- Produces: nothing new — this task validates the finished feature against the spec's Testing section.

- [ ] **Step 1: Tune camera framing**

Open `http://localhost:8000/unknown-frontier/unknown-frontier.html` and check the default camera position (`camera.position.set(0, 45, 95)` in `galaxy.js`) frames the full disc + nebula without heavy clipping. If the disc edges or nebula wisps are cut off at the default zoom, adjust `camera.position.set(...)` and/or `controls.maxDistance` in `galaxy.js` (currently `220`) until the full galaxy is visible on load at typical viewport sizes (test at both a wide desktop width and a narrow ~390px mobile width via devtools device toolbar).

- [ ] **Step 2: Run the full manual verification checklist from the spec**

With the local server still running, confirm each of these (from `docs/superpowers/specs/2026-08-21-unknown-frontier-galaxy-design.md`, Testing section):

- Rotation/zoom feel smooth at the current particle budget (drag to rotate, scroll to zoom, no stutter).
- Clicking a beacon opens the card; clicking close (or a different beacon) behaves correctly.
- Resizing the browser window keeps canvas and camera aspect correct (no stretching).
- Open devtools, throttle CPU (e.g. 4x-6x slowdown) and switch to a mobile device viewport (e.g. 390x844) — confirm the scene still renders and responds to drag/zoom without becoming unusable.
- No errors in the browser console (`read_console_messages` or devtools Console tab) at any point above.

- [ ] **Step 3: Commit any tuning changes**

If Step 1 required camera/controls changes:
```bash
git add unknown-frontier/js/galaxy.js
git commit -m "fix(unknown-frontier): tune galaxy camera framing"
```

If no changes were needed, skip this commit — nothing to add.

---

## Self-Review Notes

- **Spec coverage:** architecture (Task 1), spiral disc (Task 2), core glow (Task 3), nebula wisps (Task 4), starfield (Task 1), beacons + card (Task 5), camera/controls (Task 1 + Task 6), error handling (no new code needed — matches spec's "none beyond existing behavior"), testing (Task 6) — all spec sections have a corresponding task.
- **Placeholder scan:** no TBD/TODO markers; all code blocks are complete and runnable as written.
- **Type/name consistency checked:** `scene`, `camera`, `renderer`, `container`, `clock`, `delta`, `elapsed`, `galaxyDisc`, `makeGlowTexture`, `coreGlow`, `nebulaTexture`, `nebulaWisps`, `BEACONS`, `beaconMeshes`, `beaconCard*` — each name is defined exactly once and reused with the same spelling and shape across all tasks that reference it.
