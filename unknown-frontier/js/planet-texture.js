import * as THREE from 'three';
import { hashString, mulberry32, shade, clamp01, makeNoise2D, applyPhotoGrain } from './texture-utils.js';

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

// Discrete land/ocean regions from a thresholded, domain-warped fbm field
// — organic coastlines instead of overlapping ellipse "continents". Land
// pixels pick one of `landColors` via a second, lower-frequency noise
// sample so neighbouring landmasses can differ in color like biomes.
function paintRegions(ctx, w, h, oceanColor, landColors, seed, { scale = 3, warp = 1.1, threshold = 0.55, coastSoftness = 0.05 } = {}) {
  const { fbm } = makeNoise2D(seed);
  const landRgb = landColors.map((hex) => new THREE.Color(hex));
  const oceanHsl = { h: 0, s: 0, l: 0 };
  oceanColor.getHSL(oceanHsl);
  const img = ctx.createImageData(w, h);
  const c = new THREE.Color();
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      let nx = u * scale;
      let ny = v * scale;
      nx += (fbm(nx + 12.3, ny + 44.1, 3) - 0.5) * warp;
      ny += (fbm(nx - 8.7, ny - 21.9, 3) - 0.5) * warp;
      const n = fbm(nx, ny, 5);
      const t = clamp01((n - threshold) / coastSoftness);

      if (t <= 0) {
        c.setHSL(oceanHsl.h, oceanHsl.s, clamp01(oceanHsl.l - (threshold - n) * 0.35));
      } else {
        const landNoise = fbm(nx * 0.7 + 100, ny * 0.7 + 100, 2);
        const landIdx = Math.min(landRgb.length - 1, Math.floor(landNoise * landRgb.length));
        if (t >= 1) {
          c.copy(landRgb[landIdx]);
        } else {
          c.setHSL(oceanHsl.h, oceanHsl.s, oceanHsl.l).lerp(landRgb[landIdx], t);
        }
      }

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

// Earth-like: blue ocean base, green/brown continents, thin white cloud
// wisps drifting over the top.
function paintOcean(ctx, w, h, base, random, seed) {
  const landColors = ['#4a7c3f', '#3f6b36', '#7a5a3a', '#8f6a45', '#5c9450', '#c9a35a'];
  paintRegions(ctx, w, h, base, landColors, seed, { scale: 2.6, warp: 1.3, threshold: 0.52, coastSoftness: 0.06 });

  ctx.fillStyle = '#f4f8fb';
  const cloudCount = 6 + Math.floor(random() * 6);
  for (let i = 0; i < cloudCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.05);
    ctx.globalAlpha = 0.15 + random() * 0.15;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.35, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
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
  oceanico: { tones: ['#2b5f8a', '#1c3f66', '#3f6f96'], paint: paintOcean },
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
  applyPhotoGrain(ctx, w, h, img, slug, { tileSize: GRAIN_TILE_SIZE, alpha: 0.16 });
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
