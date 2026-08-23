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

// A thin glowing ring (stroked circle with radial falloff), for target-lock
// style markers that need to sit around a point and always face the camera
// — used as a Sprite map rather than in-scene geometry, so no per-frame
// billboarding math is needed.
export function makeRingTexture(color, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = size * 0.36;
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.05;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.12;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

// A thin glowing line — bright in the middle, tapering to transparent at
// both ends and both edges — for streak/trail sprites, as opposed to the
// round falloff of makeGlowTexture.
export function makeStreakTexture(color, width = 128, height = 16) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const hGradient = ctx.createLinearGradient(0, 0, width, 0);
  hGradient.addColorStop(0, `${color}00`);
  hGradient.addColorStop(0.5, color);
  hGradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = hGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'destination-in';
  const vGradient = ctx.createLinearGradient(0, 0, 0, height);
  vGradient.addColorStop(0, 'rgba(255,255,255,0)');
  vGradient.addColorStop(0.5, 'rgba(255,255,255,1)');
  vGradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = vGradient;
  ctx.fillRect(0, 0, width, height);

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
