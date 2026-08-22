import * as THREE from 'three';

// Canvas-generated text sprite for world-space HUD labels (galaxy names,
// etc.) — same "bake it with the 2D canvas API" approach as
// glow-texture.js, in the site's usual Orbitron font. Canvas is sized to
// the measured text so the sprite's aspect ratio matches the label
// instead of being force-fit into a square.
export function makeLabelTexture(text, color, { fontSize = 48 } = {}) {
  const label = text.toUpperCase();
  const letterSpacing = fontSize * 0.18;
  const font = `700 ${fontSize}px Orbitron, sans-serif`;

  const measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = font;
  measureCtx.letterSpacing = `${letterSpacing}px`;
  const textWidth = measureCtx.measureText(label).width;

  const paddingX = fontSize * 0.6;
  const paddingY = fontSize * 0.7;
  const canvas = document.createElement('canvas');
  canvas.width = textWidth + paddingX * 2;
  canvas.height = fontSize + paddingY * 2;

  const ctx = canvas.getContext('2d');
  ctx.font = font;
  ctx.letterSpacing = `${letterSpacing}px`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Soft glow pass, then a crisp core pass on top — matches the
  // additive-glow look used for beacons/core-glow elsewhere in the scene.
  ctx.shadowColor = color;
  ctx.shadowBlur = fontSize * 0.4;
  ctx.fillStyle = color;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return { texture, aspect: canvas.width / canvas.height };
}
