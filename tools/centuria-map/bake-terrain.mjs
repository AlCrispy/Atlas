// Bakes centuria/resources/map/centuria-terrain.png from the painted world map
// (centuria/resources/Centuria.png). Run: node tools/centuria-map/bake-terrain.mjs
//
// Output channels (grid of MAP_W/SCALE × MAP_H/SCALE):
//   R = land (0 sea … 255 land, soft coastline)
//   G = mountain density
//   B = forest density
// The land mask is traced from the painting (land is warm bronze, sea is a
// neutral slate); mountains and forests are hand-authored polygons in the
// painting's pixel space, since they can't be told apart reliably by color.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, encodePng } from './png.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'centuria/resources/Centuria.png');
const OUT = path.join(ROOT, 'centuria/resources/map/centuria-terrain.png');
const SCALE = 4;

// ── Regions, in source pixels (1672 × 941) ──────────────────────────────
// Painted ornaments that read as "warm" but are not land.
const EXCLUDE = [
  [[0, 0], [1672, 0], [1672, 36], [560, 36], [180, 130], [0, 290]],     // top border arc
  [[0, 560], [80, 600], [140, 760], [330, 941], [0, 941]],              // bottom-left clockwork
  [[1390, 0], [1672, 0], [1672, 420], [1600, 330], [1420, 250], [1390, 120]], // top-right clockwork
  [[1640, 0], [1672, 0], [1672, 941], [1640, 941]],                     // right edge
  [[770, 330], [950, 330], [950, 372], [770, 372]],                     // "Lega di Aurelion" label
  [[890, 55], [980, 55], [980, 90], [890, 90]],                         // "Velikor" label
];
const EXCLUDE_CIRCLES = [[1540, 830, 115]];                            // compass rose

// Isola Perennogelo is drawn as clockwork in the painting; add a real island.
const ADD_LAND = [
  [[1480, 170], [1530, 140], [1590, 150], [1625, 185], [1600, 225], [1540, 235], [1490, 215]],
  // Kalveor's dark peaks fall below the warmth threshold
  [[1075, 655], [1115, 720], [1200, 885], [1120, 915], [1010, 915], [940, 885], [1035, 720]],
];

// Velikor's inland lakes.
const LAKES = [
  [[1010, 195], [1060, 185], [1085, 215], [1060, 245], [1015, 235]],
  [[1205, 200], [1250, 195], [1265, 230], [1225, 245]],
  [[1345, 375], [1395, 365], [1415, 400], [1385, 425], [1350, 410]],
];

const MOUNTAINS = [
  // central spine, Kassendyr → Valdherba
  [[790, 470], [900, 430], [1010, 420], [1150, 450], [1300, 440], [1430, 450], [1560, 470], [1600, 520],
   [1480, 540], [1330, 540], [1200, 560], [1080, 600], [950, 610], [840, 580], [780, 530]],
  // Kalveor
  [[1075, 660], [1110, 720], [1190, 880], [1120, 905], [1010, 905], [950, 880], [1040, 720]],
  // Kassendyr highlands
  [[560, 600], [620, 590], [690, 610], [700, 670], [640, 680], [570, 660]],
  // Velikor northern hills
  [[950, 110], [1040, 90], [1120, 110], [1150, 170], [1080, 200], [990, 190]],
  [[1020, 250], [1110, 230], [1180, 280], [1140, 330], [1050, 320]],
  // Terre Ignote ridges
  [[330, 300], [420, 280], [460, 330], [400, 370], [340, 350]],
  [[210, 470], [300, 450], [330, 520], [260, 560], [200, 530]],
];

const FORESTS = [
  // Velikor eastern woods
  [[1225, 120], [1300, 110], [1345, 180], [1330, 260], [1270, 250], [1230, 190]],
  [[1240, 290], [1310, 280], [1340, 360], [1310, 430], [1250, 420], [1230, 350]],
  [[1050, 300], [1120, 290], [1140, 370], [1080, 400], [1040, 360]],
  [[1150, 330], [1210, 320], [1220, 400], [1160, 410]],
  // Kassendyr lowlands
  [[610, 690], [720, 680], [770, 740], [700, 770], [620, 750]],
  [[720, 770], [820, 760], [850, 830], [760, 850], [710, 820]],
  // Valdherba
  [[1190, 570], [1300, 560], [1340, 640], [1300, 760], [1210, 760], [1180, 660]],
  [[1340, 560], [1450, 550], [1540, 600], [1520, 680], [1400, 700], [1350, 640]],
  [[1260, 700], [1380, 700], [1450, 740], [1400, 790], [1280, 790]],
  // Terre Ignote
  [[200, 380], [280, 370], [300, 430], [230, 450], [190, 420]],
];

// ── Helpers ─────────────────────────────────────────────────────────────
function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function blur(src, w, h, r) {
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < w) { s += src[y * w + xx]; n++; } }
    tmp[y * w + x] = s / n;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; n++; } }
    out[y * w + x] = s / n;
  }
  return out;
}

// Drops connected land blobs smaller than minCells (compass dots, rhumb-line
// knots, stray label strokes).
function dropSmallBlobs(mask, w, h, minCells) {
  const seen = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    const stack = [start], blob = [];
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop(); blob.push(i);
      const x = i % w, y = (i / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, ni = ny * w + nx;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h && mask[ni] && !seen[ni]) { seen[ni] = 1; stack.push(ni); }
      }
    }
    if (blob.length < minCells) for (const i of blob) mask[i] = 0;
  }
}

// ── Bake ────────────────────────────────────────────────────────────────
const img = decodePng(fs.readFileSync(SRC));
const W = Math.floor(img.width / SCALE), H = Math.floor(img.height / SCALE);

const warmth = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let s = 0;
  for (let dy = 0; dy < SCALE; dy++) for (let dx = 0; dx < SCALE; dx++) {
    const i = ((y * SCALE + dy) * img.width + x * SCALE + dx) * img.channels;
    s += img.data[i] - img.data[i + 2];
  }
  warmth[y * W + x] = s / (SCALE * SCALE);
}

const smooth = blur(warmth, W, H, 2);
const land = new Uint8Array(W * H);
const mountain = new Float32Array(W * H), forest = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const px = (x + 0.5) * SCALE, py = (y + 0.5) * SCALE, i = y * W + x;
  let isLand = smooth[i] > 6.5;
  if (EXCLUDE.some(p => inPoly(px, py, p))) isLand = false;
  if (EXCLUDE_CIRCLES.some(([cx, cy, r]) => (px - cx) ** 2 + (py - cy) ** 2 < r * r)) isLand = false;
  if (ADD_LAND.some(p => inPoly(px, py, p))) isLand = true;
  if (LAKES.some(p => inPoly(px, py, p))) isLand = false;
  land[i] = isLand ? 1 : 0;
  mountain[i] = MOUNTAINS.some(p => inPoly(px, py, p)) ? 1 : 0;
  forest[i] = FORESTS.some(p => inPoly(px, py, p)) ? 1 : 0;
}
dropSmallBlobs(land, W, H, 60);
// Fill tiny holes (sea specks inside land) by running the same pass on the inverse.
const sea = land.map(v => 1 - v);
dropSmallBlobs(sea, W, H, 12);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (LAKES.some(p => inPoly((x + 0.5) * SCALE, (y + 0.5) * SCALE, p))) sea[y * W + x] = 1;
}
for (let i = 0; i < W * H; i++) land[i] = 1 - sea[i];

const landSoft = blur(Float32Array.from(land), W, H, 1);
const mountSoft = blur(mountain, W, H, 3);
const forestSoft = blur(forest, W, H, 2);

const out = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  out[i * 3] = Math.round(landSoft[i] * 255);
  out[i * 3 + 1] = Math.round(mountSoft[i] * land[i] * 255);
  out[i * 3 + 2] = Math.round(forestSoft[i] * land[i] * 255);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, encodePng({ width: W, height: H, channels: 3, data: out }));
console.log(`wrote ${path.relative(ROOT, OUT)} (${W}×${H})`);
