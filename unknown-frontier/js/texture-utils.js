import * as THREE from 'three';

// Shared seeded-hash, seeded-noise, and "real photo as a low-alpha grain
// layer" helpers used by both planet-texture.js and star-texture.js — the
// same "organic noise for shape, a real photo only for fine detail" recipe
// applies to any procedurally painted celestial body, not just planets.

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shade(base, amount) {
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const c = new THREE.Color();
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amount)));
  return `#${c.getHexString()}`;
}

export function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

export function clamp255(v) {
  return Math.min(255, Math.max(0, v));
}

// Integer lattice hash (murmur-style finalizer) — gives a stable,
// well-distributed value in [0,1] for any (seed, ix, iy), which is all a
// value-noise grid needs.
function hashLattice(seed, ix, iy) {
  let h = seed | 0;
  h ^= Math.imul(ix | 0, 0x27d4eb2f);
  h ^= Math.imul(iy | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function smootherstep(t) {
  return t * t * (3 - 2 * t);
}

// Seeded 2D value noise plus fbm (fractal sum of octaves). `fbm` returns a
// value roughly in [0,1] — callers center it themselves (`fbm(...) - 0.5`)
// when they need a signed offset.
export function makeNoise2D(seed) {
  function noise2D(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const sx = smootherstep(x - x0);
    const sy = smootherstep(y - y0);
    const n00 = hashLattice(seed, x0, y0);
    const n10 = hashLattice(seed, x0 + 1, y0);
    const n01 = hashLattice(seed, x0, y0 + 1);
    const n11 = hashLattice(seed, x0 + 1, y0 + 1);
    const ix0 = n00 + (n10 - n00) * sx;
    const ix1 = n01 + (n11 - n01) * sx;
    return ix0 + (ix1 - ix0) * sy;
  }

  function fbm(x, y, octaves = 4, lacunarity = 2, persistence = 0.5) {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += noise2D(x * freq, y * freq) * amp;
      norm += amp;
      amp *= persistence;
      freq *= lacunarity;
    }
    return sum / norm;
  }

  return { noise2D, fbm };
}

// Tiles a small, random, desaturated/contrast-boosted crop of a real photo
// over the whole canvas at low opacity in 'overlay' blend mode — adds
// photographic micro-detail without importing the photo's macro shape (a
// planet or star's identity comes entirely from the procedural paint
// underneath; the photo only contributes grain). `img` must already be
// loaded — a not-yet-loaded image is skipped silently, since this is a
// finishing touch, not load-bearing for the body's look. `safeRect`
// restricts sampling to a sub-region of the source image (e.g. to avoid a
// photo's background or a bright feature that would read as a repeating
// artifact if tiled) — omit it to sample the whole image.
export function applyPhotoGrain(ctx, w, h, img, seedStr, { tileSize = 48, alpha = 0.16, contrast = 1.4, safeRect } = {}) {
  if (!img.complete || !img.naturalWidth) return;

  const rect = safeRect || { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  const maxX = Math.max(1, rect.w - tileSize);
  const maxY = Math.max(1, rect.h - tileSize);
  const sx = rect.x + (hashString(`${seedStr}:grain-x`) % maxX);
  const sy = rect.y + (hashString(`${seedStr}:grain-y`) % maxY);

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = tileSize;
  tileCanvas.height = tileSize;
  const tileCtx = tileCanvas.getContext('2d');
  tileCtx.drawImage(img, sx, sy, tileSize, tileSize, 0, 0, tileSize, tileSize);

  const tileData = tileCtx.getImageData(0, 0, tileSize, tileSize);
  const d = tileData.data;
  for (let i = 0; i < d.length; i += 4) {
    const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const contrasted = clamp255((luma - 128) * contrast + 128);
    d[i] = d[i + 1] = d[i + 2] = contrasted;
  }
  tileCtx.putImageData(tileData, 0, 0);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(tileCanvas, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
