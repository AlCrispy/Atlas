import * as THREE from 'three';

// Deterministic per-slug procedural surface texture so a reload always
// paints the same body the same way, without storing per-planet art in
// solar-system-data.js. Canvas-2D only (no GLSL — see the galaxy design
// spec's "medium complexity, mobile-safe" constraint); the sphere's
// default UVs are equirectangular, so a plain rectangular canvas wraps
// cleanly around it.

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
function paintRocky(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, -0.03);
  ctx.fillRect(0, 0, w, h);

  const blotchCount = 15 + Math.floor(random() * 15);
  for (let i = 0; i < blotchCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.05);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.08);
    ctx.globalAlpha = 0.35 + random() * 0.2;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + random() * 0.5), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const craterCount = 6 + Math.floor(random() * 8);
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
function paintVolcanic(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, -0.05);
  ctx.fillRect(0, 0, w, h);

  const patchCount = 20 + Math.floor(random() * 15);
  for (let i = 0; i < patchCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * (w * 0.04);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.1);
    ctx.globalAlpha = 0.4 + random() * 0.2;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + random() * 0.4), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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
function paintOcean(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, 0);
  ctx.fillRect(0, 0, w, h);

  const landColors = ['#4a7c3f', '#3f6b36', '#7a5a3a', '#8f6a45', '#5c9450', '#c9a35a'];
  const continentCount = 8 + Math.floor(random() * 6);
  for (let i = 0; i < continentCount; i++) {
    const cx = random() * w;
    const cy = random() * h;
    ctx.globalAlpha = 0.8;
    const blobCount = 4 + Math.floor(random() * 5);
    for (let b = 0; b < blobCount; b++) {
      const x = cx + (random() - 0.5) * w * 0.18;
      const y = cy + (random() - 0.5) * h * 0.18;
      const r = 2 + random() * (w * 0.045);
      ctx.fillStyle = landColors[Math.floor(random() * landColors.length)];
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + random() * 0.4), random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

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
function paintJungle(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, 0.02);
  ctx.fillRect(0, 0, w, h);

  const canopyCount = 45 + Math.floor(random() * 25);
  for (let i = 0; i < canopyCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * (w * 0.03);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.2);
    ctx.globalAlpha = 0.45 + random() * 0.25;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + random() * 0.5), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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
function paintToxic(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, -0.02);
  ctx.fillRect(0, 0, w, h);

  const swirlCount = 10 + Math.floor(random() * 10);
  for (let i = 0; i < swirlCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.07);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.3);
    ctx.globalAlpha = 0.35 + random() * 0.25;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.3 + random() * 0.4), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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
function paintIceGiant(ctx, w, h, base, random) {
  const bandCount = 4 + Math.floor(random() * 3);
  let y = 0;
  while (y < h) {
    const bandHeight = (h / bandCount) * (0.7 + random() * 0.6);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.1);
    ctx.fillRect(0, y, w, bandHeight);
    y += bandHeight;
  }

  if (random() < 0.5) {
    const x = random() * w;
    const sy = random() * h;
    const r = w * (0.03 + random() * 0.03);
    ctx.fillStyle = shade(base, -0.15);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(x, sy, r, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function paintGasGiant(ctx, w, h, base, random) {
  const bandCount = 8 + Math.floor(random() * 6);
  let y = 0;
  while (y < h) {
    const bandHeight = (h / bandCount) * (0.6 + random() * 0.8);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.22);
    ctx.fillRect(0, y, w, bandHeight);
    y += bandHeight;
  }

  const swirlCount = 1 + Math.floor(random() * 3);
  for (let i = 0; i < swirlCount; i++) {
    const x = random() * w;
    const sy = random() * h;
    const r = w * (0.04 + random() * 0.05);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.3);
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(x, sy, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function paintIcy(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, 0.04);
  ctx.fillRect(0, 0, w, h);

  const patchCount = 25 + Math.floor(random() * 20);
  for (let i = 0; i < patchCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.05);
    ctx.fillStyle = shade(base, (random() - 0.3) * 0.2);
    ctx.globalAlpha = 0.4 + random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.4 + random() * 0.6), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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

// `hexColor` is the fallback identity color for bodies with no declared
// `type` (moons); `slug` seeds the deterministic layout; `size` nudges the
// legacy fallback toward the banded gas-giant look; `type` selects the
// realistic palette above when present.
export function makePlanetTexture(hexColor, slug, size, type) {
  const w = 128;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const random = mulberry32(hashString(slug));
  const classification = TYPE_PALETTES[type];

  if (classification) {
    const tone = classification.tones[Math.floor(random() * classification.tones.length)];
    classification.paint(ctx, w, h, new THREE.Color(tone), random);
  } else {
    const base = new THREE.Color(hexColor);
    const surfaceType = pickSurfaceType(random, size);
    if (surfaceType === 'gas') paintGasGiant(ctx, w, h, base, random);
    else if (surfaceType === 'icy') paintIcy(ctx, w, h, base, random);
    else paintRocky(ctx, w, h, base, random);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
