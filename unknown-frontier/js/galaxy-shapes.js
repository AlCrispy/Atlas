import * as THREE from 'three';
import { makeGlowTexture } from './glow-texture.js';

export { makeGlowTexture };

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

export function buildLenticularGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 1800,
    radius = 25,
    color = 0x7d8bb0,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(color);
  const bulgeColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 0.4);
  const edgeColor = baseColor.clone().multiplyScalar(0.6);
  const bulgeCount = Math.floor(particleCount * 0.3);

  for (let i = 0; i < particleCount; i++) {
    if (i < bulgeCount) {
      // Dense central bulge, no arms
      const t = Math.pow(Math.random(), 1.5);
      const r = t * radius * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

      colors[i * 3] = bulgeColor.r;
      colors[i * 3 + 1] = bulgeColor.g;
      colors[i * 3 + 2] = bulgeColor.b;
    } else {
      // Flat disc, uniform density per area, no spiral structure
      const r = Math.sqrt(Math.random()) * radius;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * radius * 0.06;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      const diskColor = baseColor.clone().lerp(edgeColor, r / radius);
      colors[i * 3] = diskColor.r;
      colors[i * 3 + 1] = diskColor.g;
      colors[i * 3 + 2] = diskColor.b;
    }
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

export function buildDwarfGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 1200,
    radius = 14,
    color = 0x9df0fa,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(color);
  const dimColor = baseColor.clone().multiplyScalar(0.4);

  for (let i = 0; i < particleCount; i++) {
    // Tight spherical concentration - much more center-biased than the
    // elliptical galaxy's falloff, and no axis squashing (true sphere).
    const t = Math.pow(Math.random(), 2.5);
    const r = t * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.cos(phi) * r;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

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
    opacity: 0.9,
    depthWrite: false,
  });

  group.add(new THREE.Points(geometry, material));
  return group;
}

export function buildRingGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    ringParticleCount = 2200,
    nucleusParticleCount = 300,
    radius = 20,
    ringColor = 0x4fd8e8,
    nucleusColor = 0xfff2c8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const totalCount = ringParticleCount + nucleusParticleCount;
  const positions = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const ringColorObj = new THREE.Color(ringColor);
  const nucleusColorObj = new THREE.Color(nucleusColor);
  const ringInner = radius * 0.62;

  // Bright star-forming ring, offset outward from a mostly-hollowed core —
  // the collisional-ring look (a companion punched through the disc).
  for (let i = 0; i < ringParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = ringInner + Math.random() * (radius - ringInner);
    const height = (Math.random() - 0.5) * 1.4;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * r;

    const t = (r - ringInner) / (radius - ringInner);
    const color = ringColorObj.clone().lerp(nucleusColorObj, (1 - t) * 0.3);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  // Sparse remnant nucleus left behind at the center
  for (let i = 0; i < nucleusParticleCount; i++) {
    const idx = ringParticleCount + i;
    const t = Math.pow(Math.random(), 1.5);
    const r = t * radius * 0.12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[idx * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[idx * 3 + 1] = Math.cos(phi) * r;
    positions[idx * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

    colors[idx * 3] = nucleusColorObj.r;
    colors[idx * 3 + 1] = nucleusColorObj.g;
    colors[idx * 3 + 2] = nucleusColorObj.b;
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

  const nucleusGlowTexture = makeGlowTexture('rgba(255,242,200,0.7)', 'rgba(255,242,200,0)');
  const nucleusGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: nucleusGlowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  nucleusGlow.scale.set(radius * 0.3, radius * 0.3, 1);
  group.add(nucleusGlow);

  return group;
}

export function buildPeculiarGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    coreParticleCount = 1400,
    tailParticleCount = 900,
    radius = 22,
    coreColor = 0xe8846f,
    tailColor = 0x8a6ae8,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const totalCount = coreParticleCount + tailParticleCount;
  const positions = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const coreColorObj = new THREE.Color(coreColor);
  const tailColorObj = new THREE.Color(tailColor);

  // Warped, off-center core — two overlapping density peaks instead of one
  // clean center, reading as a pair mid-merger rather than a settled galaxy.
  const coreCenters = [
    [radius * 0.12, 0, radius * 0.05],
    [-radius * 0.18, radius * 0.06, -radius * 0.08],
  ];
  for (let i = 0; i < coreParticleCount; i++) {
    const center = coreCenters[i % coreCenters.length];
    const t = Math.pow(Math.random(), 1.6);
    const r = t * radius * 0.35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = center[0] + Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = center[1] + Math.cos(phi) * r * 0.6;
    positions[i * 3 + 2] = center[2] + Math.sin(phi) * Math.sin(theta) * r;

    const color = coreColorObj.clone().lerp(tailColorObj, Math.random() * 0.2);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  // Two tidal tails swept out in opposite directions from the core
  for (let i = 0; i < tailParticleCount; i++) {
    const idx = coreParticleCount + i;
    const tail = i % 2 === 0 ? 1 : -1;
    const t = Math.random();
    const sweep = t * Math.PI * 0.9 * tail;
    const r = radius * 0.3 + t * radius * 0.85;
    const spread = (1 - t) * radius * 0.08 + radius * 0.05;

    positions[idx * 3] = Math.cos(sweep) * r + (Math.random() - 0.5) * spread;
    positions[idx * 3 + 1] = tail * t * radius * 0.25 + (Math.random() - 0.5) * spread;
    positions[idx * 3 + 2] = Math.sin(sweep) * r + (Math.random() - 0.5) * spread;

    const color = tailColorObj.clone().lerp(coreColorObj, 1 - t);
    colors[idx * 3] = color.r;
    colors[idx * 3 + 1] = color.g;
    colors[idx * 3 + 2] = color.b;
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

export function buildIrregularGalaxy(opts = {}) {
  const {
    position = [0, 0, 0],
    particleCount = 2000,
    radius = 30,
    colorA = 0x4fd8e8,
    colorB = 0xe8846f,
  } = opts;

  const group = new THREE.Group();
  group.position.set(...position);

  const blobCount = 3;
  const blobCenters = [];
  for (let b = 0; b < blobCount; b++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 0.5;
    blobCenters.push([
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * radius * 0.3,
      Math.sin(angle) * dist,
    ]);
  }

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const tintA = new THREE.Color(colorA);
  const tintB = new THREE.Color(colorB);
  const blobRadius = radius * 0.45;

  const gaussianJitter = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  for (let i = 0; i < particleCount; i++) {
    const blobIndex = i % blobCount;
    const blob = blobCenters[blobIndex];

    positions[i * 3] = blob[0] + gaussianJitter() * blobRadius;
    positions[i * 3 + 1] = blob[1] + gaussianJitter() * blobRadius * 0.5;
    positions[i * 3 + 2] = blob[2] + gaussianJitter() * blobRadius;

    const tint = blobIndex % 2 === 0 ? tintA : tintB;
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  group.add(new THREE.Points(geometry, material));
  return group;
}
