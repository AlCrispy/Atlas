import * as THREE from 'three';

// A thin, semi-transparent ellipse in the XZ plane showing a body's orbit
// path. Flat by design — the caller applies inclination by tilting a
// parent group that holds both this ring and the orbiting body, so the
// two never drift out of sync.
export function buildOrbitRing({ radiusX, radiusZ, color = 0x4fd8e8, segments = 96 }) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radiusX, 0, Math.sin(angle) * radiusZ));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 });
  return new THREE.LineLoop(geometry, material);
}

// A flat debris ring around a planet — two concentric bands with a thin
// gap between them (a nod to Saturn's Cassini Division) rather than one
// solid annulus, so it reads as particulate rather than a disc. Lies flat
// in the XZ plane like buildOrbitRing above; the caller is responsible for
// keeping innerRadius/outerRadius clear of the planet body and its moons.
export function buildPlanetRing({ innerRadius, outerRadius, color = 0xe0c896, segments = 96 }) {
  const group = new THREE.Group();
  const span = outerRadius - innerRadius;
  const gap = span * 0.08;
  const bands = [
    { from: innerRadius, to: innerRadius + span * 0.46, opacity: 0.55 },
    { from: innerRadius + span * 0.46 + gap, to: outerRadius, opacity: 0.4 },
  ];
  bands.forEach(({ from, to, opacity }) => {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(from, to, segments),
      new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity, roughness: 0.9, metalness: 0 }),
    );
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
  });
  return group;
}
