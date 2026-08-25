import * as THREE from 'three';
import { hashString, mulberry32, clamp01, makeNoise2D, applyPhotoGrain } from './texture-utils.js';
import { STAR_TYPES } from './star-types.js';

// Deterministic per-slug procedural star surface — same recipe as
// planet-texture.js: a seeded fbm noise field for the big shape (here,
// granulation — the sun's mottled convection-cell surface — rather than
// continents), tinted per spectral class from star-types.js, finished with
// a low-alpha grain pass tiled from a real NASA/SDO photo of the Sun's
// photosphere. The photo is used only as fine texture (see
// texture-utils.js's applyPhotoGrain) — a single shared source works for
// every spectral type because the grain layer's hue comes from whatever
// it's composited over ('overlay' blend), not from the photo itself.

// A real 2010-08-19 SDO/AIA image of the Sun (NASA — public domain),
// vendored locally per this repo's no-hotlinking convention. `SUN_SAFE_RECT`
// keeps sampled grain tiles inside the plain granulation field, away from
// the image's black background, limb corona, and the two bright plage
// clusters — none of which should repeat as a tiling artifact.
const sunImage = new Image();
sunImage.src = '../resources/star-textures/sun_sdo_aia.jpg';
const SUN_SAFE_RECT = { x: 500, y: 450, w: 350, h: 300 };

// Dark convection lanes, a hot mid tone, and near-white cell centers — the
// same "cascading mix" trick as the black hole shader's fire palette,
// driven by fbm instead of radial heat. The mid tone is pulled warmer and
// more saturated than the type's flat catalog color (e.g. G-type "Gialla"
// #ffd23f) — a real photosphere reads as vivid orange/red plasma, not a
// pastel swatch, and bands are kept narrow (sharp `n` cutoffs below) so
// the pattern survives being shrunk to a small on-screen sphere instead of
// blurring into a flat tint.
function paintGranulation(ctx, w, h, base, seed, { scale = 6, octaves = 5, warp = 1.6 } = {}) {
  const { fbm } = makeNoise2D(seed);
  const baseHsl = { h: 0, s: 0, l: 0 };
  base.getHSL(baseHsl);

  const hotHue = ((baseHsl.h - 0.045) % 1 + 1) % 1;
  const hotSat = Math.min(1, baseHsl.s * 1.2 + 0.15);
  const mid = new THREE.Color().setHSL(hotHue, hotSat, clamp01(baseHsl.l * 0.72));
  const dark = new THREE.Color().setHSL(hotHue, hotSat, clamp01(baseHsl.l * 0.22));
  const bright = new THREE.Color().setHSL(hotHue, hotSat * 0.4, clamp01(baseHsl.l * 1.5 + 0.35));

  const img = ctx.createImageData(w, h);
  const c = new THREE.Color();
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      let nx = u * scale;
      let ny = v * scale;
      nx += (fbm(nx + 14.7, ny + 61.2, 3) - 0.5) * warp;
      ny += (fbm(nx - 33.1, ny - 8.4, 3) - 0.5) * warp;
      const n = fbm(nx, ny, octaves);

      c.copy(dark).lerp(mid, clamp01((n - 0.1) / 0.35));
      if (n > 0.62) c.lerp(bright, clamp01((n - 0.62) / 0.22));

      const idx = (y * w + x) * 4;
      img.data[idx] = c.r * 255;
      img.data[idx + 1] = c.g * 255;
      img.data[idx + 2] = c.b * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// A couple of soft, brighter plage-like patches — echoes the bright active
// regions visible in real photosphere photos without tracing their shape.
function paintActiveRegions(ctx, w, h, random) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const count = 1 + Math.floor(random() * 3);
  for (let i = 0; i < count; i++) {
    const x = random() * w;
    const y = random() * h;
    const r = w * (0.05 + random() * 0.05);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.45)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// `type` is a star-types.js spectral class (O..M); an unrecognized type
// falls back to a G-like yellow-white so a made-up class never crashes.
export function makeStarTexture(type, slug) {
  const w = 256;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const seed = hashString(slug);
  const random = mulberry32(seed);
  const base = new THREE.Color(STAR_TYPES[type]?.color || '#ffd23f');

  paintGranulation(ctx, w, h, base, seed);
  paintActiveRegions(ctx, w, h, random);
  applyPhotoGrain(ctx, w, h, sunImage, slug, { tileSize: 40, alpha: 0.32, contrast: 2, safeRect: SUN_SAFE_RECT });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
