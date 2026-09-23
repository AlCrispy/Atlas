import * as THREE from 'three';

// Procedural brass/bronze props for the Centuria world map: clockwork gears,
// the compass rose, the Kassendyr citadel and generic capital towers.
// Every builder returns a THREE.Group sized in world units, lying on y = 0.

export const BRASS = new THREE.MeshStandardMaterial({ color: 0xb08948, metalness: 0.85, roughness: 0.38 });
export const DARK_BRONZE = new THREE.MeshStandardMaterial({ color: 0x5a4424, metalness: 0.8, roughness: 0.5 });
export const IRON = new THREE.MeshStandardMaterial({ color: 0x2c2f33, metalness: 0.7, roughness: 0.55 });
export const WINDOW_GLOW = new THREE.MeshBasicMaterial({ color: 0xffc46b });

function circlePath(radius, cx = 0, cy = 0) {
  const p = new THREE.Path();
  p.absarc(cx, cy, radius, 0, Math.PI * 2, true);
  return p;
}

// Flat toothed gear with a hub hole and round lightening holes.
export function makeGear({ radius = 1, teeth = 16, toothDepth = 0.12, thickness = 0.05, holes = 5, material = BRASS } = {}) {
  const shape = new THREE.Shape();
  const inner = radius - toothDepth;
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts = [
      [inner, a], [radius, a + step * 0.15], [radius, a + step * 0.45], [inner, a + step * 0.6],
    ];
    for (const [r, ang] of pts) {
      const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
      if (i === 0 && r === inner && ang === a) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
  }
  shape.closePath();
  shape.holes.push(circlePath(radius * 0.14));
  const holeR = radius * 0.17, holeRing = radius * 0.5;
  for (let i = 0; i < holes; i++) {
    const a = (i / holes) * Math.PI * 2;
    shape.holes.push(circlePath(holeR, Math.cos(a) * holeRing, Math.sin(a) * holeRing));
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: true, bevelSize: thickness * 0.3, bevelThickness: thickness * 0.3, bevelSegments: 1, curveSegments: 12,
  });
  geo.rotateX(-Math.PI / 2);
  const gear = new THREE.Mesh(geo, material);
  gear.castShadow = true;
  gear.receiveShadow = true;

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.22, thickness * 3, 16), DARK_BRONZE);
  hub.position.y = thickness;
  hub.castShadow = true;

  const group = new THREE.Group();
  group.add(gear, hub);
  group.userData.spin = gear;
  return group;
}

// Eight-pointed compass rose with nested rings, like the painted one.
export function makeCompass(radius = 1) {
  const group = new THREE.Group();

  const star = (len, width, count, offset, height, material) => {
    for (let i = 0; i < count; i++) {
      const a = offset + (i / count) * Math.PI * 2;
      const geo = new THREE.BufferGeometry();
      // Two-faced blade: ridge from centre to tip, raised along its spine.
      const tip = [Math.cos(a) * len, 0, Math.sin(a) * len];
      const l = [Math.cos(a + Math.PI / 2) * width, 0, Math.sin(a + Math.PI / 2) * width];
      const r = [-l[0], 0, -l[2]];
      const top = [0, height, 0];
      geo.setAttribute('position', new THREE.Float32BufferAttribute([
        ...top, ...tip, ...l,
        ...top, ...r, ...tip,
      ], 3));
      geo.computeVertexNormals();
      const blade = new THREE.Mesh(geo, material);
      blade.castShadow = true;
      group.add(blade);
    }
  };
  star(radius, radius * 0.12, 4, 0, radius * 0.12, BRASS);
  star(radius * 0.62, radius * 0.08, 4, Math.PI / 4, radius * 0.08, DARK_BRONZE);
  star(radius * 0.4, radius * 0.05, 8, Math.PI / 8, radius * 0.05, DARK_BRONZE);

  for (const [r, t] of [[radius * 0.55, 0.012], [radius * 0.6, 0.006], [radius * 0.82, 0.01]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, radius * t, 6, 96), BRASS);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = radius * 0.02;
    group.add(ring);
  }
  const boss = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.07, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), BRASS);
  group.add(boss);
  return group;
}

// Tall spired citadel ringed by walls — the Kassendyr capital.
export function makeCitadel(scale = 1) {
  const g = new THREE.Group();
  const add = (geo, mat, y, x = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  // Concentric walls
  for (const [r, h] of [[0.34, 0.05], [0.24, 0.08]]) {
    add(new THREE.CylinderGeometry(r, r * 1.03, h, 40, 1, true), DARK_BRONZE, h / 2).material.side = THREE.DoubleSide;
    const towers = Math.round(r * 40);
    for (let i = 0; i < towers; i++) {
      const a = (i / towers) * Math.PI * 2;
      add(new THREE.CylinderGeometry(0.018, 0.02, h * 1.6, 8), BRASS, h * 0.8, Math.cos(a) * r, Math.sin(a) * r);
      add(new THREE.ConeGeometry(0.024, 0.04, 8), BRASS, h * 1.6 + 0.02, Math.cos(a) * r, Math.sin(a) * r);
    }
  }
  // Tiered keep
  const tiers = [[0.16, 0.08], [0.12, 0.1], [0.085, 0.14], [0.06, 0.16], [0.04, 0.18]];
  let y = 0;
  tiers.forEach(([r, h], i) => {
    add(new THREE.CylinderGeometry(r * 0.92, r, h, 16), i % 2 ? BRASS : DARK_BRONZE, y + h / 2);
    add(new THREE.TorusGeometry(r * 0.95, 0.006, 4, 24), BRASS, y + h).rotation.x = Math.PI / 2;
    y += h;
  });
  add(new THREE.ConeGeometry(0.03, 0.34, 12), BRASS, y + 0.17);
  // Satellite spires
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = Math.cos(a) * 0.13, z = Math.sin(a) * 0.13;
    add(new THREE.CylinderGeometry(0.022, 0.026, 0.3, 8), DARK_BRONZE, 0.15, x, z);
    add(new THREE.ConeGeometry(0.03, 0.14, 8), BRASS, 0.37, x, z);
  }
  // Lit windows
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2, t = Math.floor(Math.random() * 4);
    const r = tiers[t][0] * 0.93;
    const wy = tiers.slice(0, t).reduce((s, [, h]) => s + h, 0) + tiers[t][1] * 0.5;
    add(new THREE.BoxGeometry(0.008, 0.014, 0.008), WINDOW_GLOW, wy, Math.cos(a) * r, Math.sin(a) * r);
  }
  g.scale.setScalar(scale);
  return g;
}

// Smaller capital: a cluster of domed towers around a central spire.
export function makeTowerTown(scale = 1, { domes = true } = {}) {
  const g = new THREE.Group();
  const add = (geo, mat, y, x = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
    return m;
  };
  add(new THREE.CylinderGeometry(0.05, 0.06, 0.22, 12), DARK_BRONZE, 0.11);
  if (domes) add(new THREE.SphereGeometry(0.055, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), BRASS, 0.22);
  add(new THREE.ConeGeometry(0.012, 0.12, 6), BRASS, 0.32);
  add(new THREE.TorusGeometry(0.1, 0.008, 4, 32), BRASS, 0.01).rotation.x = Math.PI / 2;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const x = Math.cos(a) * 0.1, z = Math.sin(a) * 0.1;
    const h = 0.06 + Math.random() * 0.06;
    add(new THREE.CylinderGeometry(0.02, 0.024, h, 8), DARK_BRONZE, h / 2, x, z);
    add(new THREE.ConeGeometry(0.028, 0.05, 8), BRASS, h + 0.025, x, z);
    add(new THREE.BoxGeometry(0.008, 0.012, 0.008), WINDOW_GLOW, h * 0.6, x * 1.2, z * 1.2);
  }
  g.scale.setScalar(scale);
  return g;
}
