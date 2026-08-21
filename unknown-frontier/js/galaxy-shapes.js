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

export function buildSpiralGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    discParticleCount = 3000,
    nebulaParticleCount = 800,
    radius = 40,
    armCount = 3,
    coreColor = 0x9df0fa,
    armColor = 0x4fd8e8,
    nebulaColor = 0x8a6ae8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  // Disc
  const armTightness = 0.55;
  const discPositions = new Float32Array(discParticleCount * 3);
  const discColors = new Float32Array(discParticleCount * 3);
  const coreColorObj = new THREE.Color(coreColor);
  const armColorObj = new THREE.Color(armColor);

  for (let i = 0; i < discParticleCount; i++) {
    const arm = i % armCount;
    const armAngleOffset = (arm / armCount) * Math.PI * 2;
    const t = Math.random();
    const r = t * radius;
    const spiralAngle = armAngleOffset + r * armTightness + (Math.random() - 0.5) * 0.5;
    const height = (Math.random() - 0.5) * 2 * (1 - t) * 3;

    discPositions[i * 3] = Math.cos(spiralAngle) * r;
    discPositions[i * 3 + 1] = height;
    discPositions[i * 3 + 2] = Math.sin(spiralAngle) * r;

    const color = coreColorObj.clone().lerp(armColorObj, t);
    discColors[i * 3] = color.r;
    discColors[i * 3 + 1] = color.g;
    discColors[i * 3 + 2] = color.b;
  }

  const discGeometry = new THREE.BufferGeometry();
  discGeometry.setAttribute('position', new THREE.BufferAttribute(discPositions, 3));
  discGeometry.setAttribute('color', new THREE.BufferAttribute(discColors, 3));
  const discMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  group.add(new THREE.Points(discGeometry, discMaterial));

  // Nebula wisps
  const nebulaTexture = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
  const nebulaPositions = new Float32Array(nebulaParticleCount * 3);
  const nebulaColors = new Float32Array(nebulaParticleCount * 3);
  const nebulaColorObj = new THREE.Color(nebulaColor);

  for (let i = 0; i < nebulaParticleCount; i++) {
    const arm = i % armCount;
    const armAngleOffset = (arm / armCount) * Math.PI * 2;
    const t = Math.random();
    const r = t * radius * 0.9;
    const spiralAngle = armAngleOffset + r * armTightness + (Math.random() - 0.5) * 0.9;
    const height = (Math.random() - 0.5) * 4;

    nebulaPositions[i * 3] = Math.cos(spiralAngle) * r;
    nebulaPositions[i * 3 + 1] = height;
    nebulaPositions[i * 3 + 2] = Math.sin(spiralAngle) * r;

    nebulaColors[i * 3] = nebulaColorObj.r;
    nebulaColors[i * 3 + 1] = nebulaColorObj.g;
    nebulaColors[i * 3 + 2] = nebulaColorObj.b;
  }

  const nebulaGeometry = new THREE.BufferGeometry();
  nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
  const nebulaMaterial = new THREE.PointsMaterial({
    size: 6,
    map: nebulaTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(nebulaGeometry, nebulaMaterial));

  // Pulsing core glow (orchestrator animates this via group.userData.coreGlow)
  const coreGlowTexture = makeGlowTexture('rgba(157,240,250,0.9)', 'rgba(157,240,250,0)');
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: coreGlowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  coreGlow.scale.set(18, 18, 1);
  group.add(coreGlow);
  group.userData.coreGlow = coreGlow;

  return group;
}

export function buildEllipticalGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 2500,
    radius = 35,
    color = 0xe8dcc8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(color);
  const dimColor = baseColor.clone().multiplyScalar(0.45);

  for (let i = 0; i < particleCount; i++) {
    const t = Math.pow(Math.random(), 1.5);
    const r = t * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.3;
    positions[i * 3 + 1] = Math.cos(phi) * r * 0.6;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.85;

    const color3 = dimColor.clone().lerp(baseColor, 1 - t);
    colors[i * 3] = color3.r;
    colors[i * 3 + 1] = color3.g;
    colors[i * 3 + 2] = color3.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  group.add(new THREE.Points(geometry, material));
  return group;
}
