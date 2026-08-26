import * as THREE from 'three';

// Procedural detail maps (map/normalMap/roughnessMap) for starship hulls —
// the primitive-stacked hulls in starship-shapes.js read as "toy-like"
// partly because their surfaces are perfectly flat/uniform. A real normal
// map (derived from an actual height field, not just noise dumped into the
// RGB channels) plus matching albedo/roughness variation is a cheap way to
// break that up without adding any new geometry.
//
// Two flavors: makeHullPanelMaps (hard-surface panel lines + rivets, for
// Terrestre/Velmyr/Coralith) and makeOrganicSkinMaps (ridged veins + pore
// blotches, for Ythar). Both build a height field first and derive the
// normal map from its actual gradient (Sobel-style finite difference) —
// not a shortcut, since a fabricated normal map that doesn't match any real
// surface reads as noisy/wrong under raking light.

function mulberry32(seed) {
  let a = seed | 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function smootherstep(t) { return t * t * (3 - 2 * t); }

function makeNoise2D(seed) {
  function hashLattice(ix, iy) {
    let h = seed | 0;
    h ^= Math.imul(ix | 0, 0x27d4eb2f);
    h ^= Math.imul(iy | 0, 0x165667b1);
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }
  function noise(x, y) {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const sx = smootherstep(x - x0), sy = smootherstep(y - y0);
    const n00 = hashLattice(x0, y0), n10 = hashLattice(x0 + 1, y0);
    const n01 = hashLattice(x0, y0 + 1), n11 = hashLattice(x0 + 1, y0 + 1);
    const nx0 = n00 + (n10 - n00) * sx;
    const nx1 = n01 + (n11 - n01) * sx;
    return nx0 + (nx1 - nx0) * sy;
  }
  function fbm(x, y, octaves = 4, lacunarity = 2, persistence = 0.5) {
    let amp = 1, freq = 1, sum = 0, norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += noise(x * freq, y * freq) * amp;
      norm += amp;
      amp *= persistence;
      freq *= lacunarity;
    }
    return sum / norm;
  }
  return { noise, fbm };
}

// Turns a height field (Float32Array, values roughly 0-1) into a tangent-
// space normal map — a real gradient via central differences, not invented
// per-pixel noise, so it actually matches the albedo/roughness painted
// from the same height field.
function heightFieldToNormalMap(height, size, strength) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const nx = -dx, ny = -dy, nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const idx = (y * size + x) * 4;
      img.data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function finishTexture(canvas, { srgb = false } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// === Hard-surface panel maps (Terrestre / Velmyr / Coralith) ===
export function makeHullPanelMaps(seedInput, { size = 512, repeat = 3 } = {}) {
  const seed = typeof seedInput === 'string' ? hashString(seedInput) : seedInput;
  const random = mulberry32(seed);

  // Irregular panel grid — not a uniform checkerboard, since real hull
  // plating doesn't tile evenly. Lines stored as fractional positions so
  // both the height field and the albedo/roughness canvases agree exactly.
  const vLines = [];
  for (let x = 0; x < 1; x += 0.12 + random() * 0.1) vLines.push(x);
  const hLines = [];
  for (let y = 0; y < 1; y += 0.16 + random() * 0.14) hLines.push(y);

  const height = new Float32Array(size * size).fill(0.5);
  const lineHalfWidthPx = 1.4;
  const grooveDepth = 0.16;

  function carveLine(isVertical, frac) {
    const centerPx = frac * size;
    const span = Math.ceil(lineHalfWidthPx * 3);
    for (let o = -span; o <= span; o++) {
      const d = Math.abs(o) - lineHalfWidthPx;
      const falloff = d <= 0 ? 1 : Math.max(0, 1 - d / (span - lineHalfWidthPx));
      const dip = grooveDepth * falloff;
      if (isVertical) {
        const x = (Math.round(centerPx) + o + size) % size;
        for (let y = 0; y < size; y++) height[y * size + x] -= dip;
      } else {
        const y = (Math.round(centerPx) + o + size) % size;
        for (let x = 0; x < size; x++) height[y * size + x] -= dip;
      }
    }
  }
  vLines.forEach((f) => carveLine(true, f));
  hLines.forEach((f) => carveLine(false, f));

  // Rivets at a random subset of grid intersections — small raised bumps.
  const rivets = [];
  vLines.forEach((vx) => {
    hLines.forEach((hy) => {
      if (random() < 0.35) rivets.push([vx, hy]);
    });
  });
  const rivetRadiusPx = 2.2;
  rivets.forEach(([fx, fy]) => {
    const cx = fx * size, cy = fy * size;
    const span = Math.ceil(rivetRadiusPx * 2);
    for (let oy = -span; oy <= span; oy++) {
      for (let ox = -span; ox <= span; ox++) {
        const dist = Math.sqrt(ox * ox + oy * oy);
        if (dist > rivetRadiusPx) continue;
        const bump = (1 - dist / rivetRadiusPx) * 0.22;
        const x = (Math.round(cx) + ox + size) % size;
        const y = (Math.round(cy) + oy + size) % size;
        height[y * size + x] += bump;
      }
    }
  });

  // Fine scuff noise so panels aren't perfectly smooth between the lines.
  const { fbm } = makeNoise2D(seed ^ 0x9e3779b9);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm((x / size) * 10, (y / size) * 10, 3) - 0.5;
      height[y * size + x] += n * 0.03;
    }
  }

  const normalMap = heightFieldToNormalMap(height, size, 2.2);

  // Albedo: near-white with darkened seams/grime and slightly bright rivets.
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size; albedoCanvas.height = size;
  const actx = albedoCanvas.getContext('2d');
  actx.fillStyle = '#f2f2f0';
  actx.fillRect(0, 0, size, size);
  actx.strokeStyle = 'rgba(70,70,70,0.55)';
  actx.lineWidth = 2;
  vLines.forEach((f) => { const x = f * size; actx.beginPath(); actx.moveTo(x, 0); actx.lineTo(x, size); actx.stroke(); });
  hLines.forEach((f) => { const y = f * size; actx.beginPath(); actx.moveTo(0, y); actx.lineTo(size, y); actx.stroke(); });
  actx.fillStyle = 'rgba(255,255,255,0.7)';
  rivets.forEach(([fx, fy]) => {
    actx.beginPath();
    actx.arc(fx * size, fy * size, rivetRadiusPx, 0, Math.PI * 2);
    actx.fill();
  });
  // Sparse dark grime speckles.
  actx.fillStyle = 'rgba(40,40,35,0.12)';
  for (let i = 0; i < size * 0.6; i++) {
    const x = random() * size, y = random() * size, r = 1 + random() * 2.5;
    actx.beginPath(); actx.arc(x, y, r, 0, Math.PI * 2); actx.fill();
  }
  const map = finishTexture(albedoCanvas, { srgb: true });

  // Roughness: base mid value, rougher along grime/seams, shinier at rivets.
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size; roughCanvas.height = size;
  const rctx = roughCanvas.getContext('2d');
  rctx.fillStyle = '#8a8a8a';
  rctx.fillRect(0, 0, size, size);
  rctx.strokeStyle = 'rgba(210,210,210,0.5)';
  rctx.lineWidth = 2;
  vLines.forEach((f) => { const x = f * size; rctx.beginPath(); rctx.moveTo(x, 0); rctx.lineTo(x, size); rctx.stroke(); });
  hLines.forEach((f) => { const y = f * size; rctx.beginPath(); rctx.moveTo(0, y); rctx.lineTo(size, y); rctx.stroke(); });
  rctx.fillStyle = 'rgba(60,60,60,0.6)';
  rivets.forEach(([fx, fy]) => {
    rctx.beginPath(); rctx.arc(fx * size, fy * size, rivetRadiusPx, 0, Math.PI * 2); rctx.fill();
  });
  const roughnessMap = finishTexture(roughCanvas);

  [map, normalMap, roughnessMap].forEach((t) => t.repeat.set(repeat, repeat));

  return { map, normalMap, roughnessMap };
}

// === Organic skin maps (Ythar) — ridged veins + pore blotches instead of
// straight panel lines, since a grown hull shouldn't read as machined. ===
export function makeOrganicSkinMaps(seedInput, { size = 512, repeat = 2 } = {}) {
  const seed = typeof seedInput === 'string' ? hashString(seedInput) : seedInput;
  const random = mulberry32(seed);
  const { fbm } = makeNoise2D(seed);
  const { fbm: fbmBlotch } = makeNoise2D(seed ^ 0x5bd1e995);

  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      // Ridged noise: fold fbm around 0 so it creates thin winding veins
      // instead of smooth blobs.
      const n = fbm(u * 5, v * 5, 5, 2, 0.55);
      const ridge = 1 - Math.abs(n - 0.5) * 2;
      const veins = Math.pow(Math.max(0, ridge), 6) * 0.35;
      const blotch = (fbmBlotch(u * 3.2, v * 3.2, 3) - 0.5) * 0.12;
      height[y * size + x] = 0.5 + veins - blotch;
    }
  }

  const normalMap = heightFieldToNormalMap(height, size, 3.0);

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size; albedoCanvas.height = size;
  const actx = albedoCanvas.getContext('2d');
  actx.fillStyle = '#e7e2ec';
  actx.fillRect(0, 0, size, size);
  const img = actx.getImageData(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const h = height[y * size + x];
      const dark = Math.max(0, 0.5 - h) * 1.6;
      const idx = (y * size + x) * 4;
      img.data[idx] = Math.max(0, img.data[idx] - dark * 90);
      img.data[idx + 1] = Math.max(0, img.data[idx + 1] - dark * 70);
      img.data[idx + 2] = Math.max(0, img.data[idx + 2] - dark * 100);
    }
  }
  actx.putImageData(img, 0, 0);
  const map = finishTexture(albedoCanvas, { srgb: true });

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size; roughCanvas.height = size;
  const rctx = roughCanvas.getContext('2d');
  rctx.fillStyle = '#5a5a5a';
  rctx.fillRect(0, 0, size, size);
  const rimg = rctx.getImageData(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const h = height[y * size + x];
      const veinShine = Math.max(0, h - 0.6) * 200;
      const idx = (y * size + x) * 4;
      rimg.data[idx] = Math.max(0, rimg.data[idx] - veinShine);
      rimg.data[idx + 1] = rimg.data[idx];
      rimg.data[idx + 2] = rimg.data[idx];
    }
  }
  rctx.putImageData(rimg, 0, 0);
  const roughnessMap = finishTexture(roughCanvas);

  [map, normalMap, roughnessMap].forEach((t) => t.repeat.set(repeat, repeat));

  return { map, normalMap, roughnessMap };
}
