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
