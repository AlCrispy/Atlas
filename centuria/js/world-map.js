import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { makeGear, makeCompass, makeCitadel, makeTowerTown, BRASS, DARK_BRONZE } from './world-map-props.js';

// Centuria world map as a tilted 3D diorama — bronze landmasses on a slate
// sea, modelled on the painted atlas (resources/Centuria.png).
//
// Terrain comes from resources/map/centuria-terrain.png, baked from the
// painting by tools/centuria-map/bake-terrain.mjs (R = land, G = mountains,
// B = forest). All positions below are in the painting's pixel space
// (1672 × 941, origin top-left) so they can be read straight off the image.

const PAINT_W = 1672;
const PAINT_H = 941;
const WORLD_W = 16.72;
// The painting is seen at an angle, so its north-south axis is foreshortened;
// stretch it back a little for the top-down terrain.
const WORLD_D = 9.41 * 1.15;
const SEA_LEVEL = 0;

const NATIONS = [
  { name: 'Kassendyr', epithet: "L'Impero del Sangue Persistente", tag: 'Vecchio Continente · Sud-Ovest',
    url: 'nations/kassendyr.html', px: [745, 625], label: [640, 560], kind: 'citadel' },
  { name: 'Lega di Aurelion', epithet: 'Commercio, Circolo e Conoscenza', tag: 'Vecchio Continente · Centro',
    url: 'nations/aurelion.html', px: [1010, 395], label: [860, 352], kind: 'town' },
  { name: 'Velikor', epithet: 'La Repubblica delle Pianure', tag: 'Vecchio Continente · Nord',
    url: 'nations/velikor.html', px: [1150, 215], label: [935, 75], kind: 'town' },
  { name: 'Valdherba', epithet: 'Il Regno della Cura e della Conoscenza', tag: 'Vecchio Continente · Confini Meridionali',
    url: 'nations/valdherba.html', px: [1440, 640], label: [1520, 605], kind: 'town' },
  { name: 'Kalveor', epithet: 'La Terra della Fiamma Nera', tag: 'Vecchio Continente · Sud',
    url: '', px: [1072, 800], label: [1080, 880], kind: 'spire' },
  { name: 'Isola Perennogelo', epithet: 'Il Confine del Mondo Conosciuto', tag: 'Arcipelago · Nord-Est',
    url: '', px: [1550, 190], label: [1565, 110], kind: 'spire' },
  { name: 'Terre Ignote', epithet: 'Diario delle Scoperte', tag: 'Nuovo Continente · In Esplorazione',
    url: 'terre-ignote.html', px: [300, 470], label: [230, 385], kind: 'none', big: true },
];

const OCEANS = [
  { name: 'Mare Settentrionale', px: [700, 150] },
  { name: 'Dawntrost Sea', px: [1330, 30] },
  { name: 'Mare di Kassian', px: [520, 820] },
  { name: 'Oceano Inesplorato', px: [70, 900] },
];

// Brass gears lying on the table around the map edge: [x, y, radius, teeth, spin direction].
const BORDER_GEARS = [
  [60, 40, 150, 22, 1], [250, -30, 110, 18, -1], [-20, 240, 90, 14, -1],
  [30, 900, 190, 26, 1], [240, 960, 110, 16, -1], [-30, 700, 80, 12, 1],
  [1610, 60, 150, 22, -1], [1440, -20, 90, 14, 1],
];
// Small clockwork scattered over Terre Ignote, as in the painting.
const LAND_GEARS = [[400, 455, 22, 10], [455, 440, 16, 8], [235, 700, 20, 9], [330, 520, 14, 8]];

// ── Coordinate helpers ─────────────────────────────────────────────────
const toWorldX = px => (px / PAINT_W - 0.5) * WORLD_W;
const toWorldZ = py => (py / PAINT_H - 0.5) * WORLD_D;
const pxToUnits = p => (p / PAINT_W) * WORLD_W;

// Deterministic PRNG so the map looks the same on every visit.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, octaves = 4) {
  let sum = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) { sum += valueNoise(x * freq, y * freq) * amp; freq *= 2; amp *= 0.5; }
  return sum;
}
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ── Textures ───────────────────────────────────────────────────────────
// Tileable cracked-mosaic pattern (the painting's tessellated surface).
function makeCrackleCanvas(size = 512, cells = 14, seed = 7) {
  const rand = mulberry32(seed);
  const pts = [];
  for (let i = 0; i < cells * cells; i++) pts.push([rand(), rand()]); // jitter within each cell
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const ci = Math.floor(u * cells), cj = Math.floor(v * cells);
    let f1 = 9, f2 = 9;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ii = (ci + di + cells) % cells, jj = (cj + dj + cells) % cells;
      const [jx, jy] = pts[jj * cells + ii];
      const dx = (ci + di + jx) / cells - u;
      const dy = (cj + dj + jy) / cells - v;
      const d = Math.hypot(dx, dy);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
    }
    const edge = smoothstep(0, 0.012, f2 - f1);
    const shade = 0.55 + 0.45 * edge;
    const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(shade * 255);
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

// Slate sea with gilded rhumb lines and bearing circles.
function makeSeaTexture(crackle) {
  const w = 2048, h = Math.round(2048 * WORLD_D / WORLD_W);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const sx = w / PAINT_W, sy = h / PAINT_H;

  const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.65);
  grad.addColorStop(0, '#2a2e33');
  grad.addColorStop(1, '#15181b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.55;
  const small = document.createElement('canvas');
  small.width = small.height = 160;
  small.getContext('2d').drawImage(crackle, 0, 0, 160, 160);
  ctx.fillStyle = ctx.createPattern(small, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  const gold = a => `rgba(194,152,74,${a})`;
  // Bearing circles around the central gulf
  const cx = 860 * sx, cy = 470 * sy;
  ctx.strokeStyle = gold(0.28);
  ctx.lineWidth = 1.4;
  for (let r = 180; r < 1600; r += 170) {
    ctx.beginPath(); ctx.ellipse(cx, cy, r * sx, r * sy, 0, 0, Math.PI * 2); ctx.stroke();
  }
  // Rhumb lines from the gulf and from the compass rose
  ctx.lineWidth = 1;
  for (const [ox, oy, alpha] of [[cx, cy, 0.22], [1540 * sx, 830 * sy, 0.16]]) {
    ctx.strokeStyle = gold(alpha);
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * w * 1.5, oy + Math.sin(a) * w * 1.5); ctx.stroke();
    }
  }
  // Waypoint studs
  const rand = mulberry32(99);
  ctx.fillStyle = gold(0.7);
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2, r = 180 + Math.floor(rand() * 8) * 170;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * sx, cy + Math.sin(a) * r * sy, 2.2, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeCloudTexture(seed) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(seed);
  for (let i = 0; i < 38; i++) {
    const x = size * (0.22 + rand() * 0.56), y = size * (0.3 + rand() * 0.4), r = size * (0.08 + rand() * 0.16);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(176,164,146,0.3)');
    g.addColorStop(1, 'rgba(176,164,146,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function loadImageData(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Bilinear sample of the baked terrain mask; u, v in [0, 1].
function makeSampler({ width, height, data }) {
  return (u, v) => {
    const x = Math.min(width - 1.001, Math.max(0, u * width - 0.5));
    const y = Math.min(height - 1.001, Math.max(0, v * height - 0.5));
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const out = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      const p = (xx, yy) => data[(yy * width + xx) * 4 + c] / 255;
      const top = p(x0, y0) * (1 - fx) + p(x0 + 1, y0) * fx;
      const bot = p(x0, y0 + 1) * (1 - fx) + p(x0 + 1, y0 + 1) * fx;
      out[c] = top * (1 - fy) + bot * fy;
    }
    return out;
  };
}

// ── Scene ──────────────────────────────────────────────────────────────
export async function createWorldMap(container) {
  const mask = makeSampler(await loadImageData(new URL('../resources/map/centuria-terrain.png', import.meta.url).href));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101216);
  scene.fog = new THREE.Fog(0x101216, 14, 26);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(34, container.clientWidth / container.clientHeight, 0.05, 60);
  const HOME_TARGET = new THREE.Vector3(0, 0, 0.35);
  const HOME_POS = new THREE.Vector3(0, 11.2, 8.2);
  camera.position.copy(HOME_POS);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(HOME_TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;
  controls.minDistance = 3;
  controls.maxDistance = 15;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = 1.12;
  controls.minAzimuthAngle = -0.6;
  controls.maxAzimuthAngle = 0.6;
  controls.zoomToCursor = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
  controls.update();

  // Lighting: warm low key light from the north-west, cool fill.
  scene.add(new THREE.HemisphereLight(0x8a93a0, 0x1a140c, 0.3));
  const sun = new THREE.DirectionalLight(0xffd29a, 3.2);
  sun.position.set(-8, 6, -4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 7, bottom: -7, near: 1, far: 30 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x7fa0c0, 0.5);
  rim.position.set(6, 4, 7);
  scene.add(rim);

  const crackle = makeCrackleCanvas();

  // Sea
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_W * 1.6, WORLD_D * 1.6),
    new THREE.MeshStandardMaterial({ map: makeSeaTexture(crackle), metalness: 0.3, roughness: 0.7 }),
  );
  sea.material.map.repeat.set(1, 1);
  // The sea texture covers the map area; scale UVs so it maps onto the inner rect.
  const uv = sea.geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - 0.5) * 1.6 + 0.5, (uv.getY(i) - 0.5) * 1.6 + 0.5);
  sea.material.map.wrapS = sea.material.map.wrapT = THREE.MirroredRepeatWrapping;
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = SEA_LEVEL;
  sea.receiveShadow = true;
  scene.add(sea);

  // Terrain
  const heightAt = (u, v) => {
    const [land, mount] = mask(u, v);
    const coast = smoothstep(0.3, 0.7, land);
    const n = fbm(u * 38, v * 22);
    const ridge = 1 - Math.abs(fbm(u * 24 + 5, v * 14 + 3) * 2 - 1);
    return -0.08 + coast * (0.13 + n * 0.05) + mount * coast * (0.08 + ridge * 0.16);
  };
  const SEG_X = 440, SEG_Z = Math.round(SEG_X * WORLD_D / WORLD_W);
  const terrainGeo = new THREE.PlaneGeometry(WORLD_W, WORLD_D, SEG_X, SEG_Z);
  terrainGeo.rotateX(-Math.PI / 2);
  const pos = terrainGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cSea = new THREE.Color(0x1d2024), cLow = new THREE.Color(0x2a1f11), cHigh = new THREE.Color(0x6a5028);
  const cCoast = new THREE.Color(0xb48c4a), cMount = new THREE.Color(0x241a0e), cForest = new THREE.Color(0x1f2412);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / WORLD_W + 0.5, v = pos.getZ(i) / WORLD_D + 0.5;
    pos.setY(i, heightAt(u, v));
    const [land, mount, forest] = mask(u, v);
    const n = fbm(u * 60 + 11, v * 34 + 7, 3);
    tmp.copy(cLow).lerp(cHigh, smoothstep(0.35, 0.7, n));
    tmp.lerp(cMount, mount * 0.6).lerp(cForest, forest * 0.55);
    const rimBand = smoothstep(0.35, 0.5, land) * (1 - smoothstep(0.55, 0.75, land));
    tmp.lerp(cCoast, rimBand * 0.85);
    tmp.lerp(cSea, 1 - smoothstep(0.3, 0.45, land));
    colors.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();
  const crackleTex = new THREE.CanvasTexture(crackle);
  crackleTex.wrapS = crackleTex.wrapT = THREE.RepeatWrapping;
  crackleTex.repeat.set(26, 26 * WORLD_D / WORLD_W);
  crackleTex.colorSpace = THREE.SRGBColorSpace;
  const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({
    vertexColors: true, map: crackleTex, metalness: 0.45, roughness: 0.62,
  }));
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  scene.add(terrain);

  const worldHeight = (x, z) => heightAt(x / WORLD_W + 0.5, z / WORLD_D + 0.5);
  const cityPoints = NATIONS.filter(n => n.kind !== 'none').map(n => [toWorldX(n.px[0]), toWorldZ(n.px[1])]);
  const nearCity = (x, z, r) => cityPoints.some(([cx, cz]) => (cx - x) ** 2 + (cz - z) ** 2 < r * r);

  // Mountains: faceted bronze peaks, gilded toward the summit.
  {
    const geo = new THREE.ConeGeometry(1, 1, 5, 1);
    geo.translate(0, 0.5, 0);
    const pc = geo.attributes.position, gc = new Float32Array(pc.count * 3);
    const base = new THREE.Color(0x21180c), peak = new THREE.Color(0xcfa35c);
    for (let i = 0; i < pc.count; i++) {
      tmp.copy(base).lerp(peak, Math.pow(pc.getY(i), 2.2));
      gc.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(gc, 3));
    const flat = geo.toNonIndexed();
    flat.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.75, roughness: 0.36, flatShading: true });
    const rand = mulberry32(1234);
    const matrices = [];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let tries = 0; tries < 120000 && matrices.length < 3400; tries++) {
      const u = rand(), v = rand();
      const [land, mount] = mask(u, v);
      if (land < 0.6) continue;
      // Clump peaks into ridges instead of an even carpet; stray hills on open land.
      const clump = smoothstep(0.3, 0.6, fbm(u * 30 + 2, v * 17 + 9)) * 0.8 + 0.2;
      const density = mount > 0.05 ? mount * clump : 0.02;
      if (rand() > density) continue;
      const x = (u - 0.5) * WORLD_W, z = (v - 0.5) * WORLD_D;
      if (nearCity(x, z, 0.4)) continue;
      const h = (0.06 + Math.pow(rand(), 2.5) * 0.26) * (0.6 + mount * 0.6) * (0.7 + clump * 0.5);
      const r = h * (0.4 + rand() * 0.25);
      p.set(x, worldHeight(x, z) - 0.02, z);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI * 2);
      s.set(r, h, r * (0.8 + rand() * 0.4));
      matrices.push(m4.compose(p, q, s).clone());
    }
    const mesh = new THREE.InstancedMesh(flat, mat, matrices.length);
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // Forests: dense stands of tiny dark conifers.
  {
    const geo = new THREE.ConeGeometry(1, 1, 6, 1);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3b4526, metalness: 0.4, roughness: 0.6 });
    const rand = mulberry32(4321);
    const matrices = [];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let tries = 0; tries < 200000 && matrices.length < 9000; tries++) {
      const u = rand(), v = rand();
      const [land, mount, forest] = mask(u, v);
      if (land < 0.65 || rand() > forest * (1 - mount)) continue;
      const x = (u - 0.5) * WORLD_W, z = (v - 0.5) * WORLD_D;
      if (nearCity(x, z, 0.2)) continue;
      const h = 0.05 + rand() * 0.05;
      p.set(x, worldHeight(x, z) - 0.005, z);
      s.set(h * 0.32, h, h * 0.32);
      matrices.push(m4.compose(p, q, s).clone());
    }
    const mesh = new THREE.InstancedMesh(geo, mat, matrices.length);
    const shade = new THREE.Color();
    matrices.forEach((m, i) => {
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, shade.setHSL(0.16 + rand() * 0.06, 0.28, 0.2 + rand() * 0.12));
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // Capitals
  for (const n of NATIONS) {
    if (n.kind === 'none') continue;
    const x = toWorldX(n.px[0]), z = toWorldZ(n.px[1]);
    const obj = n.kind === 'citadel' ? makeCitadel(2.4) : makeTowerTown(n.kind === 'spire' ? 0.8 : 1, { domes: n.kind !== 'spire' });
    obj.position.set(x, worldHeight(x, z) - 0.01, z);
    scene.add(obj);
  }

  // Clockwork: border gears spin slowly, land gears tick.
  const spinners = [];
  const gearRand = mulberry32(77);
  for (const [px, py, r, teeth, dir] of BORDER_GEARS) {
    const gear = makeGear({ radius: pxToUnits(r), teeth, toothDepth: pxToUnits(r) * 0.1, thickness: 0.06,
      material: gearRand() > 0.5 ? BRASS : DARK_BRONZE });
    gear.position.set(toWorldX(px), 0.02 + gearRand() * 0.08, toWorldZ(py));
    scene.add(gear);
    spinners.push({ obj: gear.userData.spin, speed: (0.12 / pxToUnits(r)) * dir * 0.3 });
  }
  for (const [px, py, r, teeth] of LAND_GEARS) {
    const x = toWorldX(px), z = toWorldZ(py);
    const gear = makeGear({ radius: pxToUnits(r), teeth, toothDepth: pxToUnits(r) * 0.18, thickness: 0.02, holes: 4 });
    gear.position.set(x, worldHeight(x, z) + 0.01, z);
    scene.add(gear);
    spinners.push({ obj: gear.userData.spin, speed: (gearRand() > 0.5 ? 1 : -1) * 0.4 });
  }

  // Armillary frame: two thin brass rings around the whole map.
  for (const [r, t] of [[9.35, 0.04], [9.65, 0.025]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 256), BRASS);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.03, 0.2);
    ring.scale.set(1, 0.72, 1);
    ring.castShadow = true;
    scene.add(ring);
  }

  const compass = makeCompass(1.05);
  compass.position.set(toWorldX(1545), 0.01, toWorldZ(830));
  scene.add(compass);

  // Drifting clouds over the unexplored west.
  const clouds = [];
  const cloudRand = mulberry32(5);
  for (let i = 0; i < 9; i++) {
    const mat = new THREE.SpriteMaterial({ map: makeCloudTexture(10 + i), transparent: true, depthWrite: false, opacity: 0.5 });
    const sprite = new THREE.Sprite(mat);
    const size = 1.2 + cloudRand() * 1.2;
    sprite.scale.set(size * 1.6, size, 1);
    const base = new THREE.Vector3(toWorldX(20 + cloudRand() * 200), 0.45 + cloudRand() * 0.35, toWorldZ(280 + cloudRand() * 420));
    sprite.position.copy(base);
    scene.add(sprite);
    clouds.push({ sprite, base, phase: cloudRand() * Math.PI * 2 });
  }

  // ── Labels & popups (HTML overlay) ───────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'map3d-overlay';
  container.appendChild(overlay);

  const popup = document.createElement('div');
  popup.className = 'map3d-popup';
  popup.hidden = true;
  overlay.appendChild(popup);
  let popupAnchor = null;

  const anchors = [];
  for (const n of NATIONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'map3d-label' + (n.big ? ' map3d-label--big' : '') + (n.url ? '' : ' map3d-label--locked');
    btn.textContent = n.name;
    overlay.appendChild(btn);
    const lx = toWorldX(n.label[0]), lz = toWorldZ(n.label[1]);
    const anchor = { el: btn, pos: new THREE.Vector3(lx, Math.max(0.05, worldHeight(lx, lz)) + 0.12, lz), nation: n };
    anchors.push(anchor);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openPopup(anchor);
    });
  }
  for (const o of OCEANS) {
    const el = document.createElement('span');
    el.className = 'map3d-ocean';
    el.textContent = o.name;
    overlay.appendChild(el);
    anchors.push({ el, pos: new THREE.Vector3(toWorldX(o.px[0]), 0.02, toWorldZ(o.px[1])) });
  }

  function openPopup(anchor) {
    const n = anchor.nation;
    const link = n.url
      ? `<a class="map-popup-link" href="${n.url}">Esplora →</a>`
      : '<span class="map-popup-link locked">In arrivo</span>';
    popup.innerHTML = `
      <button type="button" class="map3d-popup-close" aria-label="Chiudi">×</button>
      <div class="map-popup">
        <div class="map-popup-tag">${n.tag}</div>
        <div class="map-popup-name">${n.name}</div>
        <div class="map-popup-epithet">${n.epithet}</div>
        ${link}
      </div>`;
    popup.querySelector('.map3d-popup-close').addEventListener('click', closePopup);
    popup.hidden = false;
    popupAnchor = anchor;
  }
  function closePopup() {
    popup.hidden = true;
    popupAnchor = null;
  }
  renderer.domElement.addEventListener('pointerdown', closePopup);

  const projected = new THREE.Vector3();
  function placeOverlay() {
    const w = container.clientWidth, h = container.clientHeight;
    for (const a of anchors) {
      projected.copy(a.pos).project(camera);
      const visible = projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1;
      a.el.style.display = visible ? '' : 'none';
      if (visible) a.el.style.transform = `translate(${(projected.x * 0.5 + 0.5) * w}px, ${(-projected.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
    }
    if (popupAnchor) {
      projected.copy(popupAnchor.pos).project(camera);
      popup.style.transform = `translate(${(projected.x * 0.5 + 0.5) * w}px, ${(-projected.y * 0.5 + 0.5) * h}px) translate(-50%, calc(-100% - 18px))`;
    }
  }

  // Keep the camera over the map when panning.
  const PAN_LIMIT_X = WORLD_W * 0.45, PAN_LIMIT_Z = WORLD_D * 0.45;
  const clampTarget = () => {
    const t = controls.target;
    const cx = THREE.MathUtils.clamp(t.x, -PAN_LIMIT_X, PAN_LIMIT_X);
    const cz = THREE.MathUtils.clamp(t.z, -PAN_LIMIT_Z, PAN_LIMIT_Z);
    if (cx !== t.x || cz !== t.z || t.y !== 0) {
      camera.position.x += cx - t.x; camera.position.z += cz - t.z; camera.position.y -= t.y;
      t.set(cx, 0, cz);
    }
  };
  controls.addEventListener('change', clampTarget);

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);

  // Only animate while the map is on screen.
  let onScreen = true;
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(container);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!onScreen) return;
    const t = clock.elapsedTime;
    for (const s of spinners) s.obj.rotation.y += s.speed * dt;
    compass.rotation.y = Math.sin(t * 0.25) * 0.04;
    for (const c of clouds) {
      c.sprite.position.x = c.base.x + Math.sin(t * 0.05 + c.phase) * 0.35;
      c.sprite.position.z = c.base.z + Math.cos(t * 0.04 + c.phase) * 0.15;
    }
    controls.update();
    renderer.render(scene, camera);
    placeOverlay();
  });

  return {
    resetView() {
      camera.position.copy(HOME_POS);
      controls.target.copy(HOME_TARGET);
      controls.update();
    },
  };
}

const el = document.getElementById('centuria-map');
if (el) {
  createWorldMap(el).then(map => {
    const reset = document.getElementById('centuria-map-reset');
    if (reset) reset.addEventListener('click', () => map.resetView());
  }).catch(err => {
    console.error('Centuria map failed to load', err);
    el.classList.add('map3d-failed');
  });
}
