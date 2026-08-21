# Unknown Frontier Triangle-of-Galaxies + Black Hole Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Unknown Frontier hero from a single spiral galaxy to three distinct galaxies (spiral, elliptical, irregular) at the vertices of an equilateral triangle, with a clickable black hole at the centroid, all reusing the existing hover/click/card interaction system.

**Architecture:** A new `unknown-frontier/js/galaxy-shapes.js` module holds three pure builder functions (`buildSpiralGalaxy`, `buildEllipticalGalaxy`, `buildIrregularGalaxy`) plus the shared `makeGlowTexture` helper — each builder returns a self-contained `THREE.Group` positioned at given world coordinates, with no knowledge of the triangle layout. `unknown-frontier/js/galaxy.js` is rewritten as the orchestrator: it positions the three groups at triangle vertices, adds a new black hole (event horizon + accretion disk + glow), and generalizes the existing beacon/hover/click system to a single flat array spanning all three galaxies' beacons plus the black hole.

**Tech Stack:** three.js 0.160.0 (existing import map, unchanged), `OrbitControls` addon, vanilla JS/CSS/HTML — no build step, no test framework (per project convention, verification is manual in-browser or careful code re-read when a browser isn't available).

**Spec:** `docs/superpowers/specs/2026-08-21-unknown-frontier-triangle-galaxies-design.md` (extends `docs/superpowers/specs/2026-08-21-unknown-frontier-galaxy-design.md`, which this plan's Task 4 supersedes the single-galaxy portions of)

## Global Constraints

- No build process, no new dependencies — only `three` + `three/addons/controls/OrbitControls.js` via the existing import map in `unknown-frontier.html` (unchanged from before).
- Total particle budget across all layers: **~9,500-10,500** (this plan's exact figures: spiral disc 3000 + nebula 800 = 3800, elliptical 2500, irregular 2000, starfield 1500, black hole accretion disk 500 = **10,300 total**).
- No custom GLSL shaders, no `UnrealBloomPass`.
- All user-visible text is Italian; all code (comments, identifiers) is English, per `CLAUDE.md`.
- Site palette for Unknown Frontier's cool tones (spiral galaxy, nebula, beacons): `--hz-cyan: #4fd8e8`, `--hz-cyan-lt: #9df0fa`, `--hz-violet: #8a6ae8` — same hex values already used in `galaxy.js` today, carried into `galaxy-shapes.js` unchanged.
- **Elliptical galaxy and black-hole accretion disk use new warm hex values** (`0xe8dcc8` pale warm sand for the elliptical, `0xffe8c8`→`0xff9a4f` warm inner-to-outer for the accretion disk) — the site's `--hz-*` CSS custom properties are all cool-toned and none is "warm," but the approved design explicitly calls for "warm, uniform color" (elliptical) and "warm orange/white" (accretion disk). Introducing new warm hex literals for these two elements is the correct, deliberate resolution — not a palette violation, since these JS three.js color literals were never bound to the CSS custom properties in the first place (the original spiral/nebula/beacon colors just happen to numerically match `--hz-*` values).
- Irregular galaxy uses one existing cool tone (`0x4fd8e8`, matching `--hz-cyan`) alternated with one new warm tone (`0xe8846f`) per blob, for a "cooler and warmer hues" mix as the design specifies.
- Canvas container element and id (`<div id="solar-system" class="solar-system-canvas">`) and the `#beacon-card` overlay markup are reused as-is — no HTML restructuring.

---

### Task 1: `galaxy-shapes.js` — glow texture helper + spiral galaxy builder

**Files:**
- Create: `unknown-frontier/js/galaxy-shapes.js`

**Interfaces:**
- Produces: `export function makeGlowTexture(innerColor, outerColor, size = 128)` → `THREE.CanvasTexture` (identical implementation to the one currently in `galaxy.js`, just exported from this new file). `export function buildSpiralGalaxy(opts)` → `THREE.Group`, where `opts` is `{ position: [x,y,z], discParticleCount, nebulaParticleCount, radius, armCount, coreColor, armColor, nebulaColor }` (all optional with defaults shown in the code below). The returned group's `userData.coreGlow` holds a reference to the pulsing core-glow `THREE.Sprite` child, for the orchestrator (Task 4) to animate.
- Consumed by: Task 4 (imports `makeGlowTexture` and `buildSpiralGalaxy` from this file). Tasks 2 and 3 append `buildEllipticalGalaxy`/`buildIrregularGalaxy` to this same file — neither of those two builders needs `makeGlowTexture` itself, but this file remains the single source of it for the rest of the codebase (Task 4's orchestrator and Task 5's black hole both import it from here).

- [ ] **Step 1: Create `unknown-frontier/js/galaxy-shapes.js` with `makeGlowTexture` and `buildSpiralGalaxy`**

```js
import * as THREE from 'three';

export function makeGlowTexture(innerColor, outerColor, size = 128) {
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

export function buildSpiralGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    discParticleCount = 3000,
    nebulaParticleCount = 800,
    radius = 40,
    armCount = 3,
    coreColor = 0x9df0fa,
    armColor = 0x4fd8e8,
    nebulaColor = 0x8a6ae8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  // Disc
  const armTightness = 0.55;
  const discPositions = new Float32Array(discParticleCount * 3);
  const discColors = new Float32Array(discParticleCount * 3);
  const coreColorObj = new THREE.Color(coreColor);
  const armColorObj = new THREE.Color(armColor);

  for (let i = 0; i < discParticleCount; i++) {
    const arm = i % armCount;
    const armAngleOffset = (arm / armCount) * Math.PI * 2;
    const t = Math.random();
    const r = t * radius;
    const spiralAngle = armAngleOffset + r * armTightness + (Math.random() - 0.5) * 0.5;
    const height = (Math.random() - 0.5) * 2 * (1 - t) * 3;

    discPositions[i * 3] = Math.cos(spiralAngle) * r;
    discPositions[i * 3 + 1] = height;
    discPositions[i * 3 + 2] = Math.sin(spiralAngle) * r;

    const color = coreColorObj.clone().lerp(armColorObj, t);
    discColors[i * 3] = color.r;
    discColors[i * 3 + 1] = color.g;
    discColors[i * 3 + 2] = color.b;
  }

  const discGeometry = new THREE.BufferGeometry();
  discGeometry.setAttribute('position', new THREE.BufferAttribute(discPositions, 3));
  discGeometry.setAttribute('color', new THREE.BufferAttribute(discColors, 3));
  const discMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  group.add(new THREE.Points(discGeometry, discMaterial));

  // Nebula wisps
  const nebulaTexture = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
  const nebulaPositions = new Float32Array(nebulaParticleCount * 3);
  const nebulaColors = new Float32Array(nebulaParticleCount * 3);
  const nebulaColorObj = new THREE.Color(nebulaColor);

  for (let i = 0; i < nebulaParticleCount; i++) {
    const arm = i % armCount;
    const armAngleOffset = (arm / armCount) * Math.PI * 2;
    const t = Math.random();
    const r = t * radius * 0.9;
    const spiralAngle = armAngleOffset + r * armTightness + (Math.random() - 0.5) * 0.9;
    const height = (Math.random() - 0.5) * 4;

    nebulaPositions[i * 3] = Math.cos(spiralAngle) * r;
    nebulaPositions[i * 3 + 1] = height;
    nebulaPositions[i * 3 + 2] = Math.sin(spiralAngle) * r;

    nebulaColors[i * 3] = nebulaColorObj.r;
    nebulaColors[i * 3 + 1] = nebulaColorObj.g;
    nebulaColors[i * 3 + 2] = nebulaColorObj.b;
  }

  const nebulaGeometry = new THREE.BufferGeometry();
  nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
  const nebulaMaterial = new THREE.PointsMaterial({
    size: 6,
    map: nebulaTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(nebulaGeometry, nebulaMaterial));

  // Pulsing core glow (orchestrator animates this via group.userData.coreGlow)
  const coreGlowTexture = makeGlowTexture('rgba(157,240,250,0.9)', 'rgba(157,240,250,0)');
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: coreGlowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  coreGlow.scale.set(18, 18, 1);
  group.add(coreGlow);
  group.userData.coreGlow = coreGlow;

  return group;
}
```

- [ ] **Step 2: Verify**

No automated test suite in this repo. Run `node --check unknown-frontier/js/galaxy-shapes.js` to confirm syntax validity. If Chrome browser tools are available (try `ToolSearch` with query `select:mcp__claude-in-chrome__tabs_context_mcp`), you may attempt a quick real check — but do not loop retrying if the extension isn't connected; a syntax check plus careful code re-read is sufficient given this is pure transcription from working code already proven in production (`unknown-frontier/js/galaxy.js`'s current spiral-disc and nebula-wisp math, which this step parameterizes without changing the formulas).

- [ ] **Step 3: Commit**

```bash
git add unknown-frontier/js/galaxy-shapes.js
git commit -m "feat(unknown-frontier): add galaxy-shapes module with spiral galaxy builder"
```

---

### Task 2: Elliptical galaxy builder

**Files:**
- Modify: `unknown-frontier/js/galaxy-shapes.js`

**Interfaces:**
- Consumes: `THREE` (already imported in the file).
- Produces: `export function buildEllipticalGalaxy(opts)` → `THREE.Group`, where `opts` is `{ position, particleCount, radius, color }`.

- [ ] **Step 1: Append `buildEllipticalGalaxy` to the end of `unknown-frontier/js/galaxy-shapes.js`**

```js

export function buildEllipticalGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 2500,
    radius = 35,
    color = 0xe8dcc8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(color);
  const dimColor = baseColor.clone().multiplyScalar(0.45);

  for (let i = 0; i < particleCount; i++) {
    const t = Math.pow(Math.random(), 1.5);
    const r = t * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.3;
    positions[i * 3 + 1] = Math.cos(phi) * r * 0.6;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.85;

    const color3 = dimColor.clone().lerp(baseColor, 1 - t);
    colors[i * 3] = color3.r;
    colors[i * 3 + 1] = color3.g;
    colors[i * 3 + 2] = color3.b;
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

  group.add(new THREE.Points(geometry, material));
  return group;
}
```

- [ ] **Step 2: Verify**

`node --check unknown-frontier/js/galaxy-shapes.js`. No automated test suite; careful code re-read for correctness (uniform-sphere direction sampling via `theta`/`phi`, radius biased toward center via `Math.pow(Math.random(), 1.5)`, non-uniform axis scaling for the elliptical silhouette, brighter-core-dimmer-edge color lerp).

- [ ] **Step 3: Commit**

```bash
git add unknown-frontier/js/galaxy-shapes.js
git commit -m "feat(unknown-frontier): add elliptical galaxy builder"
```

---

### Task 3: Irregular galaxy builder

**Files:**
- Modify: `unknown-frontier/js/galaxy-shapes.js`

**Interfaces:**
- Consumes: `THREE` (already imported in the file).
- Produces: `export function buildIrregularGalaxy(opts)` → `THREE.Group`, where `opts` is `{ position, particleCount, radius, colorA, colorB }`.

- [ ] **Step 1: Append `buildIrregularGalaxy` to the end of `unknown-frontier/js/galaxy-shapes.js`**

```js

export function buildIrregularGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 2000,
    radius = 30,
    colorA = 0x4fd8e8,
    colorB = 0xe8846f,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const blobCount = 3;
  const blobCenters = [];
  for (let b = 0; b < blobCount; b++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 0.5;
    blobCenters.push([
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * radius * 0.3,
      Math.sin(angle) * dist,
    ]);
  }

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const tintA = new THREE.Color(colorA);
  const tintB = new THREE.Color(colorB);
  const blobRadius = radius * 0.45;

  const gaussianJitter = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  for (let i = 0; i < particleCount; i++) {
    const blobIndex = i % blobCount;
    const blob = blobCenters[blobIndex];

    positions[i * 3] = blob[0] + gaussianJitter() * blobRadius;
    positions[i * 3 + 1] = blob[1] + gaussianJitter() * blobRadius * 0.5;
    positions[i * 3 + 2] = blob[2] + gaussianJitter() * blobRadius;

    const tint = blobIndex % 2 === 0 ? tintA : tintB;
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  group.add(new THREE.Points(geometry, material));
  return group;
}
```

- [ ] **Step 2: Verify**

`node --check unknown-frontier/js/galaxy-shapes.js`. No automated test suite; careful code re-read (3 randomly-placed blob centers within `radius * 0.5` of local origin, particles jittered around their blob via a summed-random "gaussian-ish" spread, color alternates by `blobIndex % 2` so each blob is internally consistent-colored while blobs alternate hue).

- [ ] **Step 3: Commit**

```bash
git add unknown-frontier/js/galaxy-shapes.js
git commit -m "feat(unknown-frontier): add irregular galaxy builder"
```

---

### Task 4: Rewrite `galaxy.js` as the triangle-layout orchestrator

**Files:**
- Modify: `unknown-frontier/js/galaxy.js` (full rewrite — replace entire file contents)

**Interfaces:**
- Consumes: `makeGlowTexture`, `buildSpiralGalaxy`, `buildEllipticalGalaxy`, `buildIrregularGalaxy` from `./galaxy-shapes.js` (Tasks 1-3).
- Produces: module-level `scene`, `camera`, `renderer`, `controls`, `clock` (same names/roles as before). `spiralGalaxy`, `ellipticalGalaxy`, `irregularGalaxy` (each a `THREE.Group`, positioned at a triangle vertex, added directly to `scene`). `beaconMeshes` (flat `THREE.Sprite[]` array spanning all three galaxies' beacons — Task 5 pushes one more entry for the black hole). A `// === Black hole (Task 5) ===` marker comment in the module-level setup section, and a `// === Black hole disk spin (Task 5) ===` marker comment inside `animate()`, both left in place verbatim for Task 5's scripted edits.

This task fully replaces the current single-galaxy `galaxy.js` (which still has the old inline spiral/nebula-wisp/beacon code from the previous plan) with the new triangle-layout orchestrator. The interaction system (raycaster, pointer, hover, click-vs-drag gating, beacon card show/hide) is carried over with identical logic — only `beaconMeshes` now spans 3 galaxies instead of 1.

- [ ] **Step 1: Overwrite `unknown-frontier/js/galaxy.js` completely with this content**

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, buildSpiralGalaxy, buildEllipticalGalaxy, buildIrregularGalaxy } from './galaxy-shapes.js';

// === Tunables ===
const STARFIELD_COUNT = 1500;
const TRIANGLE_SIDE = 200;
const TRIANGLE_RADIUS = TRIANGLE_SIDE / Math.sqrt(3);
const SPIRAL_SPIN = 0.015;
const ELLIPTICAL_SPIN = 0.006;
const IRREGULAR_SPIN = 0.01;
const BLACKHOLE_DISK_SPIN = 0.08;

const BEACON_SCALE = 2.5;
const BEACON_HOVER_SCALE = 3.2;

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 140, 260);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 20;
controls.maxDistance = 500;

// === Starfield ===
function buildStarfield() {
  const count = STARFIELD_COUNT;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 250 + Math.random() * 250;
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

// === Triangle layout ===
function triangleVertex(index) {
  const angle = Math.PI / 2 + (index * 2 * Math.PI) / 3;
  return [Math.cos(angle) * TRIANGLE_RADIUS, 0, Math.sin(angle) * TRIANGLE_RADIUS];
}

// === Galaxies ===
const spiralGalaxy = buildSpiralGalaxy({
  position: triangleVertex(0),
  discParticleCount: 3000,
  nebulaParticleCount: 800,
  radius: 40,
});
scene.add(spiralGalaxy);

const ellipticalGalaxy = buildEllipticalGalaxy({
  position: triangleVertex(1),
  particleCount: 2500,
  radius: 35,
});
scene.add(ellipticalGalaxy);

const irregularGalaxy = buildIrregularGalaxy({
  position: triangleVertex(2),
  particleCount: 2000,
  radius: 30,
});
scene.add(irregularGalaxy);

// === Beacons ===
const SPIRAL_BEACONS = [
  { name: 'Punto sconosciuto', position: [12, 1, -7] },
  { name: 'Punto sconosciuto', position: [-17, -1, 9] },
  { name: 'Punto sconosciuto', position: [21, 2, 13] },
  { name: 'Punto sconosciuto', position: [-9, -1, -20] },
  { name: 'Punto sconosciuto', position: [27, 1, -3] },
];

const ELLIPTICAL_BEACONS = [
  { name: 'Punto sconosciuto', position: [15, 3, 10] },
  { name: 'Punto sconosciuto', position: [-20, -2, 8] },
  { name: 'Punto sconosciuto', position: [8, 4, -22] },
  { name: 'Punto sconosciuto', position: [-12, -3, -15] },
  { name: 'Punto sconosciuto', position: [22, 1, -5] },
];

const IRREGULAR_BEACONS = [
  { name: 'Punto sconosciuto', position: [10, 2, 8] },
  { name: 'Punto sconosciuto', position: [-15, -1, -10] },
  { name: 'Punto sconosciuto', position: [18, -2, -5] },
  { name: 'Punto sconosciuto', position: [-8, 3, 15] },
  { name: 'Punto sconosciuto', position: [5, -3, -18] },
];

const beaconTexture = makeGlowTexture('rgba(138,106,232,1)', 'rgba(138,106,232,0)');

function addBeaconSprites(beaconList, parentGroup, targetArray) {
  beaconList.forEach((beacon) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: beaconTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    sprite.scale.set(BEACON_SCALE, BEACON_SCALE, 1);
    sprite.position.set(...beacon.position);
    sprite.userData.beacon = beacon;
    parentGroup.add(sprite);
    targetArray.push(sprite);
  });
}

const beaconMeshes = [];
addBeaconSprites(SPIRAL_BEACONS, spiralGalaxy, beaconMeshes);
addBeaconSprites(ELLIPTICAL_BEACONS, ellipticalGalaxy, beaconMeshes);
addBeaconSprites(IRREGULAR_BEACONS, irregularGalaxy, beaconMeshes);

// === Black hole (Task 5) ===

// === Interaction ===
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

// A click that follows a camera drag (OrbitControls) should not open the
// beacon card: track the pointer-down position and only treat the click
// as a real beacon click if the pointer barely moved before release.
const CLICK_DRAG_THRESHOLD = 5;
let pointerDownPosition = null;

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerDownPosition = { x: event.clientX, y: event.clientY };
});

// Hover feedback: swap the cursor to pointer and grow the beacon's glow
// when a beacon sprite sits under the pointer, so beacons read as clickable.
let hoveredBeacon = null;

renderer.domElement.addEventListener('pointermove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(beaconMeshes);
  const hit = hits.length > 0 ? hits[0].object : null;

  if (hit !== hoveredBeacon) {
    if (hoveredBeacon) {
      hoveredBeacon.scale.set(BEACON_SCALE, BEACON_SCALE, 1);
    }
    if (hit) {
      hit.scale.set(BEACON_HOVER_SCALE, BEACON_HOVER_SCALE, 1);
    }
    hoveredBeacon = hit;
    renderer.domElement.style.cursor = hit ? 'pointer' : '';
  }
});

renderer.domElement.addEventListener('click', (event) => {
  if (pointerDownPosition) {
    const dx = event.clientX - pointerDownPosition.x;
    const dy = event.clientY - pointerDownPosition.y;
    const dragDistance = Math.hypot(dx, dy);
    if (dragDistance >= CLICK_DRAG_THRESHOLD) {
      return;
    }
  }

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(beaconMeshes);
  if (hits.length > 0) {
    showBeaconCard(hits[0].object.userData.beacon);
  }
});

// === Animation loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  spiralGalaxy.rotation.y += delta * SPIRAL_SPIN;
  ellipticalGalaxy.rotation.y += delta * ELLIPTICAL_SPIN;
  irregularGalaxy.rotation.y += delta * IRREGULAR_SPIN;
  irregularGalaxy.rotation.z = Math.sin(elapsed * 0.15) * 0.05;

  const spiralCoreGlow = spiralGalaxy.userData.coreGlow;
  if (spiralCoreGlow) {
    const corePulse = 18 + Math.sin(elapsed * 0.5) * 2;
    spiralCoreGlow.scale.set(corePulse, corePulse, 1);
  }

  // === Black hole disk spin (Task 5) ===

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

- [ ] **Step 2: Verify**

`node --check unknown-frontier/js/galaxy.js`. No automated test suite. Careful code re-read: confirm the import path `./galaxy-shapes.js` resolves to the file created in Tasks 1-3, confirm all three galaxy groups are added to `scene`, confirm `beaconMeshes` collects exactly 15 sprites (5 per galaxy x 3), confirm both `// === Black hole (Task 5) ===` marker comments (one in setup, one inside `animate()`) are present verbatim for Task 5's scripted edits. If Chrome browser tools are available, attempt a real check (page loads, three galaxies visible at triangle vertices, hover/click still works on all 15 beacons) — do not loop retrying if the extension isn't connected.

- [ ] **Step 3: Commit**

```bash
git add unknown-frontier/js/galaxy.js
git commit -m "feat(unknown-frontier): rewrite galaxy.js as triangle-layout orchestrator with 3 galaxy types"
```

---

### Task 5: Black hole (event horizon + accretion disk + glow)

**Files:**
- Modify: `unknown-frontier/js/galaxy.js`

**Interfaces:**
- Consumes: `scene`, `makeGlowTexture` (already imported), `beaconMeshes`, `BLACKHOLE_DISK_SPIN` (Task 4's tunable, already declared but unused until this task).
- Produces: `blackHoleDisk` (`THREE.Points`, referenced in the animate loop for rotation) — no later task depends on this file further.

- [ ] **Step 1: Replace the setup marker with the black hole builder and construction**

Replace:
```js
// === Black hole (Task 5) ===
```
with:
```js
// === Black hole ===
function buildBlackHole() {
  const group = new THREE.Group();

  const eventHorizon = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  group.add(eventHorizon);

  const glowTexture = makeGlowTexture('rgba(180,150,255,0.5)', 'rgba(180,150,255,0)');
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  glow.scale.set(14, 14, 1);
  group.add(glow);

  const diskTexture = makeGlowTexture('rgba(255,200,140,1)', 'rgba(255,200,140,0)');
  const diskParticleCount = 500;
  const diskPositions = new Float32Array(diskParticleCount * 3);
  const diskColors = new Float32Array(diskParticleCount * 3);
  const innerColor = new THREE.Color(0xffe8c8);
  const outerColor = new THREE.Color(0xff9a4f);

  for (let i = 0; i < diskParticleCount; i++) {
    const t = Math.random();
    const r = 6 + t * 8;
    const angle = Math.random() * Math.PI * 2;

    diskPositions[i * 3] = Math.cos(angle) * r;
    diskPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    diskPositions[i * 3 + 2] = Math.sin(angle) * r;

    const color = innerColor.clone().lerp(outerColor, t);
    diskColors[i * 3] = color.r;
    diskColors[i * 3 + 1] = color.g;
    diskColors[i * 3 + 2] = color.b;
  }

  const diskGeometry = new THREE.BufferGeometry();
  diskGeometry.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
  diskGeometry.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));
  const diskMaterial = new THREE.PointsMaterial({
    size: 1.2,
    map: diskTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const disk = new THREE.Points(diskGeometry, diskMaterial);
  disk.rotation.x = 0.3;
  group.add(disk);

  const hitSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  }));
  hitSprite.scale.set(10, 10, 1);
  group.add(hitSprite);

  scene.add(group);

  return { disk, hitSprite };
}

const { disk: blackHoleDisk, hitSprite: blackHoleHitSprite } = buildBlackHole();
blackHoleHitSprite.userData.beacon = { name: 'Buco Nero', position: [0, 0, 0] };
beaconMeshes.push(blackHoleHitSprite);
```

- [ ] **Step 2: Replace the animate-loop marker with the disk-spin line**

Replace:
```js
  // === Black hole disk spin (Task 5) ===
```
with:
```js
  blackHoleDisk.rotation.y += delta * BLACKHOLE_DISK_SPIN;
```

- [ ] **Step 3: Verify**

`node --check unknown-frontier/js/galaxy.js`. No automated test suite. Careful code re-read: confirm `buildBlackHole()` is defined and called before `beaconMeshes.push(blackHoleHitSprite)` runs, confirm `blackHoleDisk` (destructured from the return value) is the exact name referenced in the animate-loop edit, confirm the black hole group is added to `scene` (not to any galaxy group — it must stay static at the triangle centroid, not rotate with any galaxy). If Chrome browser tools are available, attempt a real check (dark sphere with glow and orange ring visible at scene center, hovering/clicking it opens a card titled "Buco Nero") — do not loop retrying if unavailable.

- [ ] **Step 4: Commit**

```bash
git add unknown-frontier/js/galaxy.js
git commit -m "feat(unknown-frontier): add clickable black hole at triangle centroid"
```

---

### Task 6: Final camera tuning and full manual verification

**Files:**
- Modify: `unknown-frontier/js/galaxy.js` (camera/controls tuning only, if needed)

**Interfaces:**
- Consumes: everything built in Tasks 1-5.
- Produces: nothing new — this task validates the finished feature against the spec's Testing section.

- [ ] **Step 1: Tune camera framing**

Open `http://localhost:8000/unknown-frontier/unknown-frontier.html` (start `python -m http.server 8000` from the repo root first) and check the default camera position (`camera.position.set(0, 140, 260)` in `galaxy.js`) frames the whole triangle (3 galaxies + black hole) without heavy clipping, at both a wide desktop viewport and a narrow ~390px mobile width (devtools device toolbar). If clipping is visible, adjust `camera.position.set(...)` and/or `controls.maxDistance` (currently `500`) in `galaxy.js` until the full composition is visible on load at typical viewport sizes. Keep changes minimal — only what's needed to fix real clipping/framing problems you actually observe (same approach as the previous plan's final tuning task).

- [ ] **Step 2: Run the full manual verification checklist from the spec**

With the local server running, confirm each of these (from `docs/superpowers/specs/2026-08-21-unknown-frontier-triangle-galaxies-design.md`, Testing section):

- Rotation/zoom feel smooth at the ~10,300-particle budget (drag to rotate, scroll to zoom, no stutter).
- Hover feedback (cursor + scale-grow) and click-to-open-card work for all 16 clickable points: 5 beacons each on the spiral, elliptical, and irregular galaxies, plus the black hole (card title "Buco Nero", distinct from the "Punto sconosciuto" beacons).
- Close button / clicking a different point / clicking empty space all behave correctly.
- Window resize keeps canvas/camera aspect correct (no stretching).
- Default camera framing shows the whole triangle + black hole without heavy clipping, at both desktop and mobile viewport sizes.
- Open devtools, throttle CPU (e.g. 4x-6x slowdown) and switch to a mobile device viewport (e.g. 390x844) — confirm the scene still renders and responds to drag/zoom/hover without becoming unusable.
- No errors in the browser console at any point above.

- [ ] **Step 3: Commit any tuning changes**

If Step 1 required camera/controls changes:
```bash
git add unknown-frontier/js/galaxy.js
git commit -m "fix(unknown-frontier): tune triangle-galaxies camera framing"
```

If no changes were needed, skip this commit — nothing to add.

---

## Self-Review Notes

- **Spec coverage:** file architecture / `makeGlowTexture` relocation (Task 1), spiral galaxy re-scoped (Task 1), elliptical galaxy (Task 2), irregular galaxy (Task 3), triangle layout + starfield resize + camera reframing + beacon generalization (Task 4), black hole (Task 5), per-galaxy spin differentiation (Task 4's animate loop), camera/testing (Task 6) — all spec sections have a corresponding task.
- **Placeholder scan:** no TBD/TODO markers; all code blocks are complete and runnable as written.
- **Type/name consistency checked:** `makeGlowTexture`, `buildSpiralGalaxy`, `buildEllipticalGalaxy`, `buildIrregularGalaxy` (exported names match import names used in Task 4 exactly); `spiralGalaxy`/`ellipticalGalaxy`/`irregularGalaxy` (Task 4, referenced in its own animate loop); `beaconMeshes` (Task 4 creates and populates it, Task 5 pushes one more entry — same array reference, no re-declaration); `blackHoleDisk`/`BLACKHOLE_DISK_SPIN` (Task 4 declares the tunable and the animate-loop marker, Task 5 defines `blackHoleDisk` and fills in the marker referencing it) — every cross-task name matches exactly.
- **Particle budget verified:** 3000 + 800 (spiral) + 2500 (elliptical) + 2000 (irregular) + 1500 (starfield) + 500 (black hole disk) = 10,300, within the ~9,500-10,500 target stated in Global Constraints.
