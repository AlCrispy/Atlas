import * as THREE from 'three';

// Deterministic per-slug procedural surface texture so a reload always
// paints the same body the same way, without storing per-planet art in
// solar-system-data.js. Canvas-2D only (no GLSL — see the galaxy design
// spec's "medium complexity, mobile-safe" constraint); the sphere's
// default UVs are equirectangular, so a plain rectangular canvas wraps
// cleanly around it.
//
// Big-shape layers (continents, rock mottling, cloud bands) come from a
// seeded 2D value-noise fbm rather than scattered ellipses — reads as
// organic terrain instead of a field of blobs. A final low-alpha "grain"
// pass, tiled from a random crop of one of the real Sol-system photos in
// resources/planet-textures/, adds photographic micro-detail on top —
// only a small desaturated/contrast-boosted tile is used, never the whole
// photo, so no planet ends up visibly wearing Mars's continents.

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(base, amount) {
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const c = new THREE.Color();
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amount)));
  return `#${c.getHexString()}`;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function clamp255(v) {
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
function makeNoise2D(seed) {
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

// Integer lattice hash for 3D value noise — same murmur-style finalizer as
// hashLattice above, extended with a third input.
function hashLattice3(seed, ix, iy, iz) {
  let h = seed | 0;
  h ^= Math.imul(ix | 0, 0x27d4eb2f);
  h ^= Math.imul(iy | 0, 0x165667b1);
  h ^= Math.imul(iz | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

// 3D counterpart to makeNoise2D — paintOceanic below samples it on a
// cylinder (cos/sin of the equirectangular u coordinate) rather than a
// flat rectangle so the land field is seamless at u=0/u=1 by construction,
// instead of needing a margin/fade patch at the wrap seam.
function makeNoise3D(seed) {
  function noise3D(x, y, z) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const z0 = Math.floor(z);
    const sx = smootherstep(x - x0);
    const sy = smootherstep(y - y0);
    const sz = smootherstep(z - z0);
    const h = (ix, iy, iz) => hashLattice3(seed, ix, iy, iz);
    const nx00 = h(x0, y0, z0) + (h(x0 + 1, y0, z0) - h(x0, y0, z0)) * sx;
    const nx10 = h(x0, y0 + 1, z0) + (h(x0 + 1, y0 + 1, z0) - h(x0, y0 + 1, z0)) * sx;
    const nx01 = h(x0, y0, z0 + 1) + (h(x0 + 1, y0, z0 + 1) - h(x0, y0, z0 + 1)) * sx;
    const nx11 = h(x0, y0 + 1, z0 + 1) + (h(x0 + 1, y0 + 1, z0 + 1) - h(x0, y0 + 1, z0 + 1)) * sx;
    const nxy0 = nx00 + (nx10 - nx00) * sy;
    const nxy1 = nx01 + (nx11 - nx01) * sy;
    return nxy0 + (nxy1 - nxy0) * sz;
  }

  function fbm(x, y, z, octaves = 4, lacunarity = 2, persistence = 0.5) {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += noise3D(x * freq, y * freq, z * freq) * amp;
      norm += amp;
      amp *= persistence;
      freq *= lacunarity;
    }
    return sum / norm;
  }

  return { noise3D, fbm };
}

// A sum of a few integer-frequency sine harmonics over u*2*PI — exactly
// periodic at u=0/u=1 for any integer frequency, so a jagged coastline
// built from it wraps perfectly at the seam for free. Used for the polar
// ice caps' edges below.
function makeEdgeProfile(random, harmonicCount, amplitude) {
  const harmonics = [];
  for (let i = 0; i < harmonicCount; i++) {
    harmonics.push({
      freq: 2 + Math.floor(random() * 4),
      amp: (amplitude * (0.4 + random() * 0.6)) / (i + 1),
      phase: random() * Math.PI * 2,
    });
  }
  const maxAmp = harmonics.reduce((sum, h) => sum + h.amp, 0);
  const edgeAt = (u) => harmonics.reduce((sum, h) => sum + Math.sin(h.freq * u * Math.PI * 2 + h.phase) * h.amp, 0);
  return { edgeAt, maxAmp };
}

// Same seeded harmonics computed without touching ctx, so the land mask
// can know each cap's worst-case (max jagged excursion) edge position in
// px from its pole *before* anything is drawn, and drawPolarCaps below
// reproduces the identical shape when it actually paints.
function computeCapMargins(seed, capFraction, jitterFraction, h) {
  if (capFraction <= 0) return { topMaxPx: 0, botMaxPx: 0 };
  const baseCapPx = capFraction * h;
  const jitterPx = jitterFraction * h;
  const top = makeEdgeProfile(mulberry32(seed ^ 0x51ed270b), 3, jitterPx);
  const bot = makeEdgeProfile(mulberry32(seed ^ 0x2545f491), 3, jitterPx);
  return { topMaxPx: baseCapPx + top.maxAmp, botMaxPx: baseCapPx + bot.maxAmp };
}

// A sphere's equirectangular top/bottom row all maps to a single point
// (the pole) — whatever's painted there always looks like a messy pinch
// from any angle. A solid ice cap sidesteps it: a pinch in a flat field is
// invisible, and it doubles as a normal-looking polar ice cap. Drawn last
// so it overlays land/forest near the poles too.
function drawPolarCaps(ctx, w, h, seed, capFraction, jitterFraction, color) {
  if (capFraction <= 0) return;
  const baseCapPx = capFraction * h;
  const jitterPx = jitterFraction * h;
  const steps = Math.max(32, Math.floor(w / 4));

  const top = makeEdgeProfile(mulberry32(seed ^ 0x51ed270b), 3, jitterPx);
  const bot = makeEdgeProfile(mulberry32(seed ^ 0x2545f491), 3, jitterPx);

  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * w;
    const y = Math.max(0, baseCapPx + top.edgeAt(x / w));
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w, h);
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * w;
    const y = Math.min(h, h - baseCapPx + bot.edgeAt(x / w));
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// Fills the whole canvas from a warped fbm field, varying lightness (and
// optionally hue) around `base` — the shared "organic mottling" layer used
// by every terrain type that isn't discrete land/ocean regions.
function paintMottled(ctx, w, h, base, seed, { scale = 5, octaves = 4, variance = 0.06, hueVariance = 0, warp = 0 } = {}) {
  const { fbm } = makeNoise2D(seed);
  const baseHsl = { h: 0, s: 0, l: 0 };
  base.getHSL(baseHsl);
  const img = ctx.createImageData(w, h);
  const c = new THREE.Color();
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      let nx = u * scale;
      let ny = v * scale;
      if (warp) {
        nx += (fbm(nx + 31.4, ny + 7.1, 2) - 0.5) * warp;
        ny += (fbm(nx - 17.2, ny - 91.7, 2) - 0.5) * warp;
      }
      const n = fbm(nx, ny, octaves) - 0.5;
      const l = clamp01(baseHsl.l + n * variance);
      const hue = ((baseHsl.h + n * hueVariance) % 1 + 1) % 1;
      c.setHSL(hue, baseHsl.s, l);
      const idx = (y * w + x) * 4;
      img.data[idx] = c.r * 255;
      img.data[idx + 1] = c.g * 255;
      img.data[idx + 2] = c.b * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Turbulent horizontal bands for gas/ice giants — a per-pixel domain warp
// bends each row's band boundary instead of drawing flat rectangles, which
// is what turns straight stripes into Jupiter-style turbulence.
function paintBandedGiant(ctx, w, h, base, random, seed, {
  bandCountRange = [8, 14],
  variance = 0.22,
  warpAmount = 5,
  stormCount = [1, 3],
  stormVariance = 0.3,
} = {}) {
  const { fbm } = makeNoise2D(seed);
  const bandCount = bandCountRange[0] + Math.floor(random() * (bandCountRange[1] - bandCountRange[0] + 1));
  const baseHsl = { h: 0, s: 0, l: 0 };
  base.getHSL(baseHsl);

  const bandLightness = [];
  for (let i = 0; i < bandCount; i++) {
    bandLightness.push(clamp01(baseHsl.l + (random() - 0.5) * variance));
  }

  const img = ctx.createImageData(w, h);
  const c = new THREE.Color();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const warp = (fbm(u * 5, y * 0.06, 4) - 0.5) * warpAmount;
      const warpedY = y + warp;
      const bandIdx = ((Math.floor((warpedY / h) * bandCount) % bandCount) + bandCount) % bandCount;
      const detail = (fbm(u * 10 + 30, y * 0.1 + 30, 3) - 0.5) * 0.03;
      c.setHSL(baseHsl.h, baseHsl.s, clamp01(bandLightness[bandIdx] + detail));
      const idx = (y * w + x) * 4;
      img.data[idx] = c.r * 255;
      img.data[idx + 1] = c.g * 255;
      img.data[idx + 2] = c.b * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const storms = stormCount[0] + Math.floor(random() * (stormCount[1] - stormCount[0] + 1));
  for (let i = 0; i < storms; i++) {
    const x = random() * w;
    const sy = random() * h;
    const r = w * (0.03 + random() * 0.05);
    ctx.fillStyle = shade(base, (random() - 0.5) * stormVariance);
    ctx.globalAlpha = 0.5 + random() * 0.2;
    ctx.beginPath();
    ctx.ellipse(x, sy, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Fallback for bodies with no declared `type` (moons): gas giants skew
// toward larger bodies, everything else splits between rocky and icy by
// chance alone.
function pickSurfaceType(random, size) {
  const roll = random();
  if (size >= 2 && roll < 0.55) return 'gas';
  if (roll < 0.3) return 'icy';
  return 'rocky';
}

// Kept close to a single flat tone on purpose — a real airless rock body
// reads as "one uniform earthy color", not a patchwork.
function paintRocky(ctx, w, h, base, random, seed) {
  paintMottled(ctx, w, h, base, seed, { scale: 5, octaves: 4, variance: 0.05 });

  const craterCount = 10 + Math.floor(random() * 14);
  for (let i = 0; i < craterCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * 4;
    ctx.fillStyle = shade(base, -0.1);
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Sand-colored dune streaks running with the equator, plus a few darker
// rock outcrops breaking up the flatness.
function paintDesert(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, 0.02);
  ctx.fillRect(0, 0, w, h);

  let y = 0;
  while (y < h) {
    const bandHeight = 1.5 + random() * 3;
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.14);
    ctx.globalAlpha = 0.3 + random() * 0.25;
    ctx.save();
    ctx.translate(0, y);
    ctx.beginPath();
    ctx.moveTo(0, bandHeight / 2);
    const steps = 8;
    for (let s = 0; s <= steps; s++) {
      const x = (w / steps) * s;
      const wobble = Math.sin(s * 1.7 + random() * 6) * bandHeight * 0.4;
      ctx.lineTo(x, bandHeight / 2 + wobble);
    }
    for (let s = steps; s >= 0; s--) {
      const x = (w / steps) * s;
      const wobble = Math.sin(s * 1.7 + random() * 6) * bandHeight * 0.4;
      ctx.lineTo(x, -bandHeight / 2 + wobble);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    y += bandHeight;
  }
  ctx.globalAlpha = 1;

  const outcropCount = 5 + Math.floor(random() * 6);
  for (let i = 0; i < outcropCount; i++) {
    const x = random() * w;
    const oy = random() * h;
    const r = 2 + random() * (w * 0.03);
    ctx.fillStyle = shade(base, -0.22);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(x, oy, r, r * 0.5, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Dark basalt crust split by branching cracks of glowing lava.
function paintVolcanic(ctx, w, h, base, random, seed) {
  paintMottled(ctx, w, h, base, seed, { scale: 6, octaves: 4, variance: 0.05, warp: 0.3 });

  const lavaColors = ['#ff6a2b', '#ff9d3f', '#ffce6b'];
  const veinCount = 5 + Math.floor(random() * 5);
  for (let i = 0; i < veinCount; i++) {
    let x = random() * w;
    let y = random() * h;
    ctx.strokeStyle = lavaColors[Math.floor(random() * lavaColors.length)];
    ctx.lineWidth = 0.8 + random() * 1.2;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segments = 4 + Math.floor(random() * 4);
    for (let s = 0; s < segments; s++) {
      x += (random() - 0.5) * w * 0.12;
      y += (random() - 0.5) * h * 0.12;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, 1.2 + random(), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Flat-color ocean/land/forest with a hard (unblurred) coastline, plus
// jagged polar ice caps — replaces the earlier fbm-shaded paintOcean/
// paintRegions after feedback that version read as too smeared/grainy.
// Tuned live in unknown-frontier/systems/_planet-lab.html (kept in the
// repo for any future revisit); this ports the locked-in look. Colors and
// the noise/threshold shape are randomized per slug (within ranges tuned
// in that lab) so oceanic worlds don't all share one palette, narrowed
// from the lab's full slider ranges to keep every roll reading as an
// ocean-dominant world rather than occasionally flipping to mostly-land.
function randomHueColor(random, hueMin, hueMax, satRange, lightRange) {
  const hue = (hueMin + random() * (hueMax - hueMin)) / 360;
  const sat = satRange[0] + random() * (satRange[1] - satRange[0]);
  const light = lightRange[0] + random() * (lightRange[1] - lightRange[0]);
  return new THREE.Color().setHSL(hue, sat, light);
}

function paintOceanic(ctx, w, h, base, random, seed) {
  const oceanColor = randomHueColor(random, 185, 225, [0.45, 0.75], [0.35, 0.55]);
  const landColor = randomHueColor(random, 25, 95, [0.3, 0.65], [0.4, 0.62]);
  const forestColor = randomHueColor(random, 95, 150, [0.3, 0.6], [0.22, 0.4]);

  const landScale = 1.5 + random() * 5;
  const landThreshold = 0.45 + random() * 0.17;
  const forestScale = 3 + random() * 10;
  const forestThreshold = 0.4 + random() * 0.2;
  const polarCap = 0.05 + random() * 0.04;
  const polarJitter = 0.02 + random() * 0.025;
  const polarWater = 0.04 + random() * 0.04;

  const { fbm } = makeNoise3D(seed);
  const oc = oceanColor;
  const lc = landColor;
  const fc = forestColor;
  const img = ctx.createImageData(w, h);
  const c = new THREE.Color();

  const capMargins = computeCapMargins(seed, polarCap, polarJitter, h);
  const waterPx = polarWater * h;
  const topSafePx = capMargins.topMaxPx + waterPx;
  const botSafePx = h - capMargins.botMaxPx - waterPx;

  // Sampled on a circle (cos/sin of u*2*PI) rather than a flat u/v
  // rectangle — cos/sin are exactly periodic, so u=0 and u=1 land on the
  // *same* point on that circle and the coastline is seamless by
  // construction. No margin/fade patch needed at the wrap seam.
  const landRing = landScale / (Math.PI * 2);
  const forestRing = forestScale / (Math.PI * 2);

  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const angle = u * Math.PI * 2;

      const landN = fbm(Math.cos(angle) * landRing, Math.sin(angle) * landRing, v * landScale, 4);
      let landT = landN > landThreshold ? 1 : 0;

      if (y < topSafePx || y > botSafePx) landT = 0;

      if (landT <= 0) {
        c.copy(oc);
      } else {
        const forestN = fbm(Math.cos(angle) * forestRing + 50, Math.sin(angle) * forestRing + 50, v * forestScale, 3);
        const forestT = forestN > forestThreshold ? 1 : 0;
        c.copy(forestT > 0 ? fc : lc);
      }

      const idx = (y * w + x) * 4;
      img.data[idx] = c.r * 255;
      img.data[idx + 1] = c.g * 255;
      img.data[idx + 2] = c.b * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  drawPolarCaps(ctx, w, h, seed, polarCap, polarJitter, '#dfe6e6');
}

// Dense green canopy with darker mottling and the occasional brown
// clearing; cloud wisps like the ocean world but sparser.
function paintJungle(ctx, w, h, base, random, seed) {
  paintMottled(ctx, w, h, base, seed, { scale: 7, octaves: 4, variance: 0.12, warp: 0.4 });

  const clearingCount = 2 + Math.floor(random() * 3);
  for (let i = 0; i < clearingCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * (w * 0.03);
    ctx.fillStyle = '#7a5a3a';
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#f4f8fb';
  const cloudCount = 3 + Math.floor(random() * 3);
  for (let i = 0; i < cloudCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.04);
    ctx.globalAlpha = 0.1 + random() * 0.1;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.3, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Sickly yellow-green turbulence — like a gas band pattern but chaotic and
// blotchy rather than clean, evoking a corrosive atmosphere.
function paintToxic(ctx, w, h, base, random, seed) {
  paintMottled(ctx, w, h, base, seed, { scale: 4, octaves: 5, variance: 0.18, hueVariance: 0.04, warp: 0.8 });

  ctx.strokeStyle = shade(base, -0.25);
  ctx.lineWidth = 1;
  const veinCount = 5 + Math.floor(random() * 5);
  for (let i = 0; i < veinCount; i++) {
    let x = random() * w;
    let y = random() * h;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segments = 3 + Math.floor(random() * 3);
    for (let s = 0; s < segments; s++) {
      x += (random() - 0.5) * w * 0.15;
      y += (random() - 0.5) * h * 0.1;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// No real-world reference point on purpose: irregular crystalline shards
// in a shifting multi-hue palette so it reads as unmistakably alien.
function paintExotic(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, -0.05);
  ctx.fillRect(0, 0, w, h);

  const baseHsl = { h: 0, s: 0, l: 0 };
  base.getHSL(baseHsl);
  const shardCount = 30 + Math.floor(random() * 25);
  for (let i = 0; i < shardCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * (w * 0.05);
    const c = new THREE.Color();
    c.setHSL((baseHsl.h + (random() - 0.5) * 0.35 + 1) % 1, Math.min(1, baseHsl.s + 0.1), 0.4 + random() * 0.35);
    ctx.fillStyle = `#${c.getHexString()}`;
    ctx.globalAlpha = 0.45 + random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.4 + random() * 0.6), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Ice-giant bands: fewer, softer, and cooler than a gas giant's — Uranus
// and Neptune read almost flat next to Jupiter's storms.
function paintIceGiant(ctx, w, h, base, random, seed) {
  paintBandedGiant(ctx, w, h, base, random, seed, {
    bandCountRange: [4, 7],
    variance: 0.12,
    warpAmount: 3,
    stormCount: [0, 1],
    stormVariance: 0.15,
  });
}

function paintGasGiant(ctx, w, h, base, random, seed) {
  paintBandedGiant(ctx, w, h, base, random, seed, {
    bandCountRange: [8, 14],
    variance: 0.24,
    warpAmount: 5,
    stormCount: [1, 3],
    stormVariance: 0.3,
  });
}

function paintIcy(ctx, w, h, base, random, seed) {
  paintMottled(ctx, w, h, base, seed, { scale: 5, octaves: 4, variance: 0.09, warp: 0.5 });

  ctx.strokeStyle = shade(base, 0.12);
  ctx.lineWidth = 1;
  const crackCount = 6 + Math.floor(random() * 6);
  for (let i = 0; i < crackCount; i++) {
    let x = random() * w;
    let cy = random() * h;
    ctx.beginPath();
    ctx.moveTo(x, cy);
    const segments = 3 + Math.floor(random() * 3);
    for (let s = 0; s < segments; s++) {
      x += (random() - 0.5) * w * 0.15;
      cy += (random() - 0.5) * h * 0.15;
      ctx.lineTo(x, cy);
    }
    ctx.globalAlpha = 0.3;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = shade(base, 0.3);
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, w, h * 0.08);
  ctx.fillRect(0, h * 0.92, w, h * 0.08);
  ctx.globalAlpha = 1;
}

// Each planet classification (see planet-types.js) gets its own realistic
// palette and paint pattern, so a "mondo oceanico" always reads blue with
// green/brown continents, a "roccioso" stays a near-uniform earthy tone,
// and so on — independent of whatever hex happens to sit in the data file.
// The tone itself is still picked deterministically per slug, so the same
// planet paints the same way on every reload.
const TYPE_PALETTES = {
  roccioso: { tones: ['#9c8b7a', '#8c7a6b', '#a89685', '#7d6c5c'], paint: paintRocky },
  desertico: { tones: ['#d9a066', '#e0c896', '#c9895a', '#e8d2a0'], paint: paintDesert },
  vulcanico: { tones: ['#3a2c26', '#2b2320', '#4a352c'], paint: paintVolcanic },
  // paintOceanic ignores this tone entirely and generates its own
  // randomized ocean/land/forest palette per slug — kept as a one-entry
  // array only so the shared dispatch below (which always picks a tone
  // before calling paint) has something harmless to pick.
  oceanico: { tones: ['#4d8fc4'], paint: paintOceanic },
  glaciale: { tones: ['#cdeef2', '#9fb8c4', '#b8e2ea'], paint: paintIcy },
  giungla: { tones: ['#2d5c36', '#3f7d4a', '#4a8f52'], paint: paintJungle },
  tossico: { tones: ['#8fae1f', '#c9d94a', '#6f8a1a'], paint: paintToxic },
  esotico: { tones: ['#8a5ae0', '#e05a9a', '#5ae0c9'], paint: paintExotic },
  gg: { tones: ['#d9a066', '#e0c896', '#c9895a', '#e8d2a0'], paint: paintGasGiant },
  gh: { tones: ['#4d7ea8', '#7fd1d9', '#3f5fb0', '#9fb8c4'], paint: paintIceGiant },
};

// Real Sol-system photos (same files solar-system.js loads directly for
// mercurio/venere/terra/marte/giove/saturno/urano/nettuno) reused here only
// as a source of fine grain — a small random crop, desaturated and
// contrast-boosted, tiled over the finished planet at low opacity. Never
// the whole photo, so the recognizable macro shapes (Mars's continents,
// Jupiter's bands) never show through on an unrelated world.
const GRAIN_SOURCES = [
  '../resources/planet-textures/mercurymap.jpg',
  '../resources/planet-textures/venusmap.jpg',
  '../resources/planet-textures/marsmap1k.jpg',
  '../resources/planet-textures/jupitermap.jpg',
  '../resources/planet-textures/saturnmap.jpg',
  '../resources/planet-textures/uranusmap.jpg',
  '../resources/planet-textures/neptunemap.jpg',
  '../resources/planet-textures/earth_atmos_2048.jpg',
];

// Preloaded eagerly at module load so the images are usually already
// decoded by the time the first texture is painted; a planet built before
// its chosen source finishes loading just skips the grain pass (it's a
// subtle finishing touch, not load-bearing for the type's look).
const grainImages = GRAIN_SOURCES.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

const GRAIN_TILE_SIZE = 48;

function applyGrain(ctx, w, h, slug) {
  const img = grainImages[hashString(`${slug}:grain`) % grainImages.length];
  if (!img.complete || !img.naturalWidth) return;

  const sx = hashString(`${slug}:grain-x`) % Math.max(1, img.naturalWidth - GRAIN_TILE_SIZE);
  const sy = hashString(`${slug}:grain-y`) % Math.max(1, img.naturalHeight - GRAIN_TILE_SIZE);

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = GRAIN_TILE_SIZE;
  tileCanvas.height = GRAIN_TILE_SIZE;
  const tileCtx = tileCanvas.getContext('2d');
  tileCtx.drawImage(img, sx, sy, GRAIN_TILE_SIZE, GRAIN_TILE_SIZE, 0, 0, GRAIN_TILE_SIZE, GRAIN_TILE_SIZE);

  const tileData = tileCtx.getImageData(0, 0, GRAIN_TILE_SIZE, GRAIN_TILE_SIZE);
  const d = tileData.data;
  for (let i = 0; i < d.length; i += 4) {
    const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const contrasted = clamp255((luma - 128) * 1.4 + 128);
    d[i] = d[i + 1] = d[i + 2] = contrasted;
  }
  tileCtx.putImageData(tileData, 0, 0);

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(tileCanvas, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// `hexColor` is the fallback identity color for bodies with no declared
// `type` (moons); `slug` seeds the deterministic layout; `size` nudges the
// legacy fallback toward the banded gas-giant look; `type` selects the
// realistic palette above when present.
export function makePlanetTexture(hexColor, slug, size, type) {
  const w = 256;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const seed = hashString(slug);
  const random = mulberry32(seed);
  const classification = TYPE_PALETTES[type];

  if (classification) {
    const tone = classification.tones[Math.floor(random() * classification.tones.length)];
    classification.paint(ctx, w, h, new THREE.Color(tone), random, seed);
  } else {
    const base = new THREE.Color(hexColor);
    const surfaceType = pickSurfaceType(random, size);
    if (surfaceType === 'gas') paintGasGiant(ctx, w, h, base, random, seed);
    else if (surfaceType === 'icy') paintIcy(ctx, w, h, base, random, seed);
    else paintRocky(ctx, w, h, base, random, seed);
  }

  applyGrain(ctx, w, h, slug);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
