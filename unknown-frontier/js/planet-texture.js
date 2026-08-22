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

// Gas giants skew toward larger bodies (matches how the term is normally
// used), everything else splits between rocky and icy by chance alone.
function pickSurfaceType(random, size) {
  const roll = random();
  if (size >= 2 && roll < 0.55) return 'gas';
  if (roll < 0.3) return 'icy';
  return 'rocky';
}

function paintRocky(ctx, w, h, base, random) {
  ctx.fillStyle = shade(base, -0.03);
  ctx.fillRect(0, 0, w, h);

  const blotchCount = 40 + Math.floor(random() * 30);
  for (let i = 0; i < blotchCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 3 + random() * (w * 0.06);
    ctx.fillStyle = shade(base, (random() - 0.5) * 0.16);
    ctx.globalAlpha = 0.5 + random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + random() * 0.5), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const craterCount = 10 + Math.floor(random() * 12);
  for (let i = 0; i < craterCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = 2 + random() * 5;
    ctx.fillStyle = shade(base, -0.16);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
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

// `hexColor` stays the body's identity color (from solar-system-data.js);
// `slug` seeds the deterministic layout, `size` nudges bigger bodies
// toward the banded gas-giant look.
export function makePlanetTexture(hexColor, slug, size) {
  const w = 128;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const base = new THREE.Color(hexColor);
  const random = mulberry32(hashString(slug));
  const surfaceType = pickSurfaceType(random, size);

  if (surfaceType === 'gas') paintGasGiant(ctx, w, h, base, random);
  else if (surfaceType === 'icy') paintIcy(ctx, w, h, base, random);
  else paintRocky(ctx, w, h, base, random);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
