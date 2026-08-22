import * as THREE from 'three';

export function makeGlowTexture(innerColor, outerColor, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// An irregular, amorphous cloud shape for background nebula sprites —
// several soft radial-gradient blobs layered with additive ('lighter')
// compositing at randomized offsets/sizes, so the silhouette reads as a
// wisp of gas rather than a single clean circle. Each call produces a
// different shape.
export function makeNebulaBlobTexture(color, size = 160) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'lighter';
  const blobCount = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < blobCount; i++) {
    const cx = size * (0.28 + Math.random() * 0.44);
    const cy = size * (0.28 + Math.random() * 0.44);
    const r = size * (0.18 + Math.random() * 0.22);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// A round alpha mask for THREE.Points — without a map, GL points render as
// squares. Solid through most of the radius (unlike the wide glow falloff
// above) so particles read as crisp dots rather than hazy blobs.
export function makeDotTexture(size = 32) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.65, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
