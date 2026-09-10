import * as THREE from 'three';

// Procedural canvas textures for the deep-space phenomena on the galaxy
// overview (see space-phenomena.js). All generation is seeded, so the same
// seed always bakes the same cloud — the map looks identical on every reload
// instead of reshuffling its nebulae.

export function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createValueNoise(rand) {
  const perm = new Uint8Array(512);
  const values = new Float32Array(256);
  const order = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = order[i & 255];
  for (let i = 0; i < 256; i++) values[i] = rand();

  return function noise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const X = xi & 255;
    const Y = yi & 255;
    const a = values[perm[perm[X] + Y]];
    const b = values[perm[perm[X + 1] + Y]];
    const c = values[perm[perm[X] + Y + 1]];
    const d = values[perm[perm[X + 1] + Y + 1]];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function fbm(noise, x, y, octaves) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// `stops` is [[t, [r, g, b]], ...] sorted by t in 0..1.
function sampleRamp(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const k = (t - t0) / (t1 - t0);
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
    }
  }
  return stops[stops.length - 1][1];
}

// Runs `shade(u, v, r)` for every pixel (u/v in -1..1, r = distance from
// center) and writes color * density on an opaque black ground. These
// textures are only ever drawn with additive blending, where black adds
// nothing — so there's no need for real alpha, and avoiding it sidesteps
// canvas premultiplied-alpha quantization, which turned thin gas a muddy
// grey once uploaded to WebGL.
function bakeTexture(size, shade) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(size, size);
  const data = image.data;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = (px / (size - 1)) * 2 - 1;
      const v = (py / (size - 1)) * 2 - 1;
      const r = Math.sqrt(u * u + v * v);
      const i = (py * size + px) * 4;
      data[i + 3] = 255;
      if (r >= 1) continue;
      const { d, color } = shade(u, v, r);
      data[i] = color[0] * d;
      data[i + 1] = color[1] * d;
      data[i + 2] = color[2] * d;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Color ramps, dark/desaturated at low density so thin gas stays a faint
// tint and only the dense knots get bright.
export const NEBULA_PALETTES = {
  emission: [[0, [30, 4, 30]], [0.35, [130, 24, 80]], [0.72, [225, 80, 120]], [1, [255, 200, 195]]],
  reflection: [[0, [4, 12, 40]], [0.4, [34, 76, 180]], [0.76, [100, 165, 250]], [1, [215, 235, 255]]],
  oxygen: [[0, [0, 24, 30]], [0.4, [16, 118, 130]], [0.8, [80, 215, 205]], [1, [225, 255, 250]]],
  sulfur: [[0, [34, 12, 0]], [0.4, [150, 66, 16]], [0.8, [240, 160, 64]], [1, [255, 238, 200]]],
  violet: [[0, [16, 6, 42]], [0.4, [80, 54, 176]], [0.8, [160, 130, 250]], [1, [238, 228, 255]]],
};

// Diffuse gas cloud: domain-warped fBm density, an irregular noisy
// silhouette, and optional dark dust lanes cut through it.
export function makeNebulaCloudTexture({ seed, palette, size = 256, dust = 0.6, stretch = 1 }) {
  const rand = mulberry32(seed);
  const noise = createValueNoise(rand);
  const ox = rand() * 100;
  const oy = rand() * 100;
  return bakeTexture(size, (u, v, r) => {
    const nx = (u / stretch) * 1.7 + ox;
    const ny = v * 1.7 + oy;
    const qx = fbm(noise, nx, ny, 4);
    const qy = fbm(noise, nx + 5.2, ny + 1.3, 4);
    const density = fbm(noise, nx + 1.9 * qx, ny + 1.9 * qy, 5);
    const edgeNoise = fbm(noise, u * 2.2 + oy, v * 2.2 + ox, 3);
    let shape = 1 - smoothstep(0.15, 0.95, r + (edgeNoise - 0.5) * 0.7);
    shape *= 1 - smoothstep(0.85, 1, r);
    let d = Math.max(0, density - 0.26) / 0.74;
    d = d ** 1.5 * shape * 2.8;
    if (dust > 0) {
      const lane = fbm(noise, nx * 2.3 + qx * 2, ny * 2.3 + qy * 2, 4);
      d *= 1 - dust * smoothstep(0.5, 0.66, lane);
    }
    d = Math.min(1, d);
    return { d, color: sampleRamp(palette, d) };
  });
}

// Ring Nebula–style planetary nebula: teal inner bubble, orange-red shell,
// faint red outer halo, white dwarf pinpoint at the center.
export function makePlanetaryNebulaTexture({ seed, size = 192 }) {
  const rand = mulberry32(seed);
  const noise = createValueNoise(rand);
  const ox = rand() * 100;
  return bakeTexture(size, (u, v, r) => {
    const n = fbm(noise, u * 4 + ox, v * 4, 4);
    const shellR = 0.46 + (n - 0.5) * 0.08;
    const shell = Math.exp(-(((r - shellR) / 0.1) ** 2)) * (0.55 + n * 0.7);
    const inner = Math.exp(-((r / 0.36) ** 2)) * 0.45;
    const halo = Math.exp(-(((r - 0.68) / 0.16) ** 2)) * 0.18 * (0.6 + n);
    const core = Math.exp(-((r / 0.035) ** 2));
    const d = Math.min(1, shell + inner + halo + core) * (1 - smoothstep(0.85, 1, r));
    const total = shell + inner + halo + core + 1e-5;
    const color = [
      (shell * 255 + inner * 90 + halo * 200 + core * 255) / total,
      (shell * 120 + inner * 220 + halo * 50 + core * 255) / total,
      (shell * 70 + inner * 230 + halo * 60 + core * 255) / total,
    ];
    return { d, color };
  });
}

// Veil-style supernova remnant: a broken expanding shell made of thin
// ridged filaments, drifting between hot blue-white and hydrogen red.
export function makeSupernovaRemnantTexture({ seed, size = 256 }) {
  const rand = mulberry32(seed);
  const noise = createValueNoise(rand);
  const ox = rand() * 100;
  const oy = rand() * 100;
  return bakeTexture(size, (u, v, r) => {
    const warp = fbm(noise, u * 2 + ox, v * 2 + oy, 3);
    const shellR = 0.6 + (warp - 0.5) * 0.25;
    const shell = Math.exp(-(((r - shellR) / 0.17) ** 2));
    const ridgeRaw = fbm(noise, u * 3.5 + warp * 2 + ox, v * 3.5 + oy, 5);
    const ridge = (1 - Math.abs(ridgeRaw * 2 - 1)) ** 7;
    const gaps = smoothstep(0.35, 0.55, fbm(noise, u * 1.5 + oy, v * 1.5 + ox, 3));
    const d = Math.min(1, shell * ridge * gaps * 2.4) * (1 - smoothstep(0.88, 1, r));
    const hue = smoothstep(0.35, 0.65, fbm(noise, u * 1.2 - ox, v * 1.2 - oy, 3));
    const red = [255, 90, 80];
    const blue = [120, 200, 255];
    const color = [
      red[0] + (blue[0] - red[0]) * hue,
      red[1] + (blue[1] - red[1]) * hue,
      red[2] + (blue[2] - red[2]) * hue,
    ];
    return { d, color };
  });
}
