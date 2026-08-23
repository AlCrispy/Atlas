import * as THREE from 'three';
import { makeDotTexture } from './glow-texture.js';

const dysonDotTexture = makeDotTexture();

// A megastructure shell around a star — a faint solid sphere, a glowing
// wireframe geodesic over it (so it still reads as star-bright through the
// gaps rather than opaque), and a scatter of "panel" points on its surface
// for tech detail. Static geometry; the caller animates a slow rotation.
export function buildDysonSphere({ radius, color = 0xffd23f, panelCount = 500 }) {
  const group = new THREE.Group();

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false }),
  );
  group.add(shell);

  const wireframe = new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius, 1),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35, depthWrite: false }),
  );
  group.add(wireframe);

  const panelPositions = new Float32Array(panelCount * 3);
  for (let i = 0; i < panelCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    panelPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    panelPositions[i * 3 + 1] = radius * Math.cos(phi);
    panelPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const panelGeometry = new THREE.BufferGeometry();
  panelGeometry.setAttribute('position', new THREE.BufferAttribute(panelPositions, 3));
  const panelMaterial = new THREE.PointsMaterial({
    color, size: radius * 0.045, map: dysonDotTexture, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.Points(panelGeometry, panelMaterial));

  return group;
}

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

// A debris ring around a planet — two concentric bands with a thin gap
// between them (a nod to Saturn's Cassini Division) rather than one solid
// annulus, so it reads as particulate rather than a disc. Base orientation
// lies flat in the XZ plane like buildOrbitRing above; tiltX/tiltZ add an
// axial-tilt-style skew on top (real planets' rings sit on the equator,
// not the orbital plane — Uranus's are tilted ~98°) so rings don't all
// read as the same flat disc. The caller is responsible for keeping
// innerRadius/outerRadius clear of the planet body and its moons.
export function buildPlanetRing({ innerRadius, outerRadius, color = 0xe0c896, segments = 96, tiltX = 0, tiltZ = 0 }) {
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
    mesh.rotation.x = -Math.PI / 2 + tiltX;
    mesh.rotation.z = tiltZ;
    group.add(mesh);
  });
  return group;
}
