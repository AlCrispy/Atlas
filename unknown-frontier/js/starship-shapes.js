import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeGlowTexture } from './glow-texture.js';

// Procedural starship hulls — three factions, each a THREE.Group built
// from primitives (no external model files, matching the rest of the
// site's procedural-geometry approach). Every hull faces local -Z ("nose
// forward"), matching THREE.Object3D.lookAt's default forward axis, so a
// future route/travel system can orient a ship with group.lookAt(nextPoint)
// without any extra correction rotation.
//
// Each group carries userData.glowMaterials / userData.glowSprites — lists
// of { material|sprite, base, phase, speed } — so a caller can animate
// engine/vent pulsing via pulseShipGlow(group, elapsed) without knowing the
// ship's internal part layout.

function trackGlowMaterial(group, material, base, phase = 0, speed = 2) {
  group.userData.glowMaterials.push({ material, base, phase, speed });
}

function trackGlowSprite(group, sprite, base, phase = 0, speed = 2) {
  group.userData.glowSprites.push({ sprite, base, phase, speed });
}

// Rounded-edge box for the Terran hull — a plain BoxGeometry read as too
// hard-edged/blocky; radius is derived from the smallest dimension so it
// never exceeds what RoundedBoxGeometry allows.
function roundedBox(w, h, d, material, segments = 2) {
  const radius = Math.min(w, h, d) * 0.22;
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, segments, radius), material);
}

// A box stretched and oriented to exactly connect two points — used for
// structural connectors (engine struts/pylons) instead of guessing a
// position/rotation by eye, which twice left a visible gap where the
// connector's end didn't actually reach the part it was meant to join.
// Pass endpoints already sunk slightly *inside* each body it connects
// (not just touching the surface) for a guaranteed-solid join.
function makeStrut(a, b, width, depth, material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = dir.length();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, depth, length), material);
  mesh.position.copy(a).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
  return mesh;
}

function addEngineGlowSprite(group, position, innerColor, scale) {
  const outerColor = innerColor.replace(/,\s*1\)$/, ',0)');
  const texture = makeGlowTexture(innerColor, outerColor, 64);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  sprite.position.copy(position);
  sprite.scale.set(scale, scale, 1);
  group.add(sprite);
  trackGlowSprite(group, sprite, 0.85, Math.random() * Math.PI * 2);
}

// === Terran cruiser ===
// Tapered stepped hull (nose-to-stern boxes shrinking toward the bow),
// twin outboard engine nacelles on struts, dark canopy strip — the
// reference silhouette is a lean military cruiser with glowing blue
// drives, not an organic or crystalline shape.
export function buildTerranShip() {
  const group = new THREE.Group();
  group.userData = { glowMaterials: [], glowSprites: [], faction: 'terran' };

  const hullMat = new THREE.MeshStandardMaterial({ color: 0xaab2ba, metalness: 0.55, roughness: 0.45 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x484f57, metalness: 0.5, roughness: 0.55 });
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0a0f14, metalness: 0.2, roughness: 0.15 });
  const engineColor = 0x4fd8e8;
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x123a44, emissive: engineColor, emissiveIntensity: 1.6, metalness: 0.2, roughness: 0.3,
  });
  trackGlowMaterial(group, engineMat, 1.6, 0);

  // Stepped taper: each segment a bit narrower/shorter toward the nose (-Z).
  // d/z are sized from shared boundaries (-1.35, -0.85, -0.3, 0.35, 0.85,
  // 1.225) with a small overlap pad baked in, rather than picked
  // independently per segment — the original independent values left
  // 0.025-0.05 unit gaps at three of the four joins (segments were each
  // "roughly" adjacent but never actually computed to meet).
  const segments = [
    { w: 0.44, h: 0.3, d: 0.43, z: 1.04 },    // stern
    { w: 0.56, h: 0.36, d: 0.55, z: 0.6 },
    { w: 0.5, h: 0.34, d: 0.7, z: 0.03 },
    { w: 0.34, h: 0.26, d: 0.6, z: -0.58 },
    { w: 0.16, h: 0.14, d: 0.55, z: -1.1 },   // bow taper
  ];
  segments.forEach(({ w, h, d, z }) => {
    const mesh = roundedBox(w, h, d, hullMat);
    mesh.position.z = z;
    group.add(mesh);
  });

  // Dark canopy strip along the forward hull, evoking the reference image's
  // reflective black bow window.
  const canopy = roundedBox(0.1, 0.06, 0.7, canopyMat);
  canopy.position.set(0, 0.09, -0.75);
  group.add(canopy);

  // Greeble detail on the mid hull — small offset panels, not meant to
  // read as anything specific, just surface break-up at a glance.
  const greebleSeed = [
    [0.12, 0.14, -0.15], [-0.14, 0.15, 0.1], [0.1, -0.15, 0.3],
    [-0.12, -0.16, -0.05], [0.16, 0.03, 0.55], [-0.16, -0.02, 0.65],
  ];
  greebleSeed.forEach(([x, y, z]) => {
    const size = 0.06 + Math.random() * 0.05;
    const mesh = roundedBox(size, size * 0.6, size, panelMat, 1);
    mesh.position.set(x, y, z);
    group.add(mesh);
  });

  // Twin outboard nacelles on struts, each with a glowing rear disc + soft
  // additive sprite behind it for bloom-like presence.
  [-1, 1].forEach((side) => {
    // The strut previously sat at a fixed x that never actually reached the
    // nacelle's own x — a real gap, not just a rendering illusion. Endpoints
    // here are chosen slightly *inside* the hull and the nacelle body so the
    // connector provably touches both regardless of exact surface math.
    const strut = makeStrut(
      new THREE.Vector3(side * 0.22, -0.05, 0.55),
      new THREE.Vector3(side * 0.5, -0.02, 0.65),
      0.09, 0.14, panelMat,
    );
    group.add(strut);

    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 1.0, 12), hullMat);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(side * 0.55, -0.02, 0.85);
    group.add(nacelle);

    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.085, 16), engineMat);
    disc.position.set(side * 0.55, -0.02, 1.36);
    group.add(disc);

    addEngineGlowSprite(group, new THREE.Vector3(side * 0.55, -0.02, 1.4), 'rgba(79,216,232,1)', 0.32);
  });

  // Small dorsal/ventral fins at the stern for silhouette break — positioned
  // with a deliberately generous overlap into the hull segment behind them
  // (not just edge-to-edge) so they read as welded on rather than floating
  // panels with a visible gap underneath.
  const dorsalFin = roundedBox(0.04, 0.22, 0.3, panelMat, 1);
  dorsalFin.position.set(0, 0.19, 0.85);
  group.add(dorsalFin);
  const ventralFin = roundedBox(0.04, 0.18, 0.26, panelMat, 1);
  ventralFin.position.set(0, -0.19, 0.85);
  group.add(ventralFin);

  return group;
}

// === Velmyr explorer ===
// A humanoid species distinct from (but convergent with) the Terrans —
// not a Terran hull. Classic saucer + engineering-hull + twin-nacelle
// silhouette (saucer leads at the bow, engineering hull and nacelles trail
// aft). Cream/white hull instead of the Terrestre cruiser's gunmetal so the
// two read apart at a glance despite both being human-shaped builders.
export function buildExplorerShip() {
  const group = new THREE.Group();
  group.userData = { glowMaterials: [], glowSprites: [], faction: 'velmyr' };

  const hullMat = new THREE.MeshStandardMaterial({ color: 0xe8e6e0, metalness: 0.3, roughness: 0.5 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xb03a2e, metalness: 0.2, roughness: 0.5 });
  const bussardMat = new THREE.MeshStandardMaterial({
    color: 0x4a1c10, emissive: 0xff6a3a, emissiveIntensity: 1.6, roughness: 0.3, metalness: 0.1,
  });
  const warpGlowMat = new THREE.MeshStandardMaterial({
    color: 0x0e2a38, emissive: 0x9fd8ff, emissiveIntensity: 1.5, roughness: 0.3, metalness: 0.1,
  });
  trackGlowMaterial(group, bussardMat, 1.6, 0, 1.4);
  trackGlowMaterial(group, warpGlowMat, 1.5, Math.PI / 2, 1.8);

  // Saucer primary hull, leading at the bow (-Z) — a flat cylinder plus a
  // raised rim ring and a small bridge dome on top.
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 32), hullMat);
  saucer.position.set(0, 0, -0.5);
  group.add(saucer);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 8, 32), trimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 0, -0.5);
  group.add(rim);

  const bridge = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), hullMat);
  bridge.scale.set(1, 0.6, 1);
  bridge.position.set(0, 0.13, -0.5);
  group.add(bridge);

  // Neck connecting the saucer's underside to the engineering hull —
  // slanted forward/up, classic silhouette.
  const neck = roundedBox(0.16, 0.28, 0.22, hullMat, 1);
  neck.position.set(0, -0.18, -0.25);
  neck.rotation.x = -0.35;
  group.add(neck);

  // Engineering hull — an elongated capsule running aft, with a small
  // glowing deflector dish at its forward tip.
  const engineeringHull = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.7, 4, 12), hullMat);
  engineeringHull.rotation.x = Math.PI / 2;
  engineeringHull.position.set(0, -0.32, 0.35);
  group.add(engineeringHull);

  const deflector = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), warpGlowMat);
  deflector.position.set(0, -0.32, -0.02);
  deflector.rotation.y = Math.PI;
  group.add(deflector);

  // Twin nacelles on outboard pylons, each with a glowing front bussard
  // collector and a warp-glow stripe along its outer face.
  [-1, 1].forEach((side) => {
    // Same fix as the Terrestre strut: the pylon's x never matched the
    // nacelle's x, so it fell short of ever touching it. Endpoints sunk
    // slightly inside the engineering hull and the nacelle body.
    const pylon = makeStrut(
      new THREE.Vector3(side * 0.15, -0.2, 0.5),
      new THREE.Vector3(side * 0.42, 0.19, 0.5),
      0.09, 0.15, hullMat,
    );
    group.add(pylon);

    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 1.05, 16), hullMat);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(side * 0.5, 0.22, 0.5);
    group.add(nacelle);

    // A shallow lens flush against the nacelle's front cap rather than a
    // full sphere glued on — a round protruding ball read as a separate
    // "floating dot" bolted to the tube instead of part of its form.
    const bussard = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), bussardMat);
    bussard.scale.set(1, 1, 0.4);
    bussard.position.set(side * 0.5, 0.22, -0.015);
    group.add(bussard);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.75), warpGlowMat);
    stripe.position.set(side * 0.5, 0.29, 0.55);
    group.add(stripe);
  });

  return group;
}

// === Ythar bio-ship ===
// Grown, not built: asymmetric capsule torso, partial rib arcs, a bent
// dorsal fin, no visible engines — only pulsing bioluminescent vents.
export function buildYtharShip() {
  const group = new THREE.Group();
  group.userData = { glowMaterials: [], glowSprites: [], faction: 'ythar' };

  const shellMat = new THREE.MeshStandardMaterial({ color: 0x2a2038, metalness: 0.15, roughness: 0.55 });
  const ribMat = new THREE.MeshStandardMaterial({ color: 0x3a2d4d, metalness: 0.1, roughness: 0.6 });
  const tealMat = new THREE.MeshStandardMaterial({
    color: 0x123330, emissive: 0x6ae8d0, emissiveIntensity: 1.8, roughness: 0.3, metalness: 0.1,
  });
  const violetMat = new THREE.MeshStandardMaterial({
    color: 0x241833, emissive: 0xb46ae8, emissiveIntensity: 1.8, roughness: 0.3, metalness: 0.1,
  });
  trackGlowMaterial(group, tealMat, 1.8, 0, 2.4);
  trackGlowMaterial(group, violetMat, 1.8, Math.PI, 2.0);

  // Main torso — a capsule lying along Z (rotate its default Y-axis).
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.9, 4, 12), shellMat);
  torso.rotation.x = Math.PI / 2;
  group.add(torso);

  // Asymmetric head bulb (bow) — squashed sphere, slightly off-axis.
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), shellMat);
  head.scale.set(1, 0.85, 1.3);
  head.position.set(-0.05, 0.02, -0.75);
  group.add(head);

  // Tapered tail extension, bent for an organic, non-mechanical line.
  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.6, 4, 10), shellMat);
  tail.rotation.x = Math.PI / 2;
  tail.rotation.y = 0.15;
  tail.position.set(0.08, -0.05, 0.85);
  group.add(tail);

  // Partial rib arcs wrapped around the torso — a torus's default plane
  // already wraps around Z (the body's long axis), so no reorientation is
  // needed; thetaLength < 2*PI plus a small tilt keeps them irregular.
  const ribSpecs = [
    { z: -0.35, radius: 0.36, arc: Math.PI * 1.15, tiltX: 0.25, rot: 0.4 },
    { z: 0.05, radius: 0.4, arc: Math.PI * 1.3, tiltX: -0.2, rot: 2.1 },
    { z: 0.45, radius: 0.34, arc: Math.PI * 1.05, tiltX: 0.35, rot: 4.0 },
  ];
  ribSpecs.forEach(({ z, radius, arc, tiltX, rot }) => {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.03, 8, 24, arc),
      ribMat,
    );
    rib.position.z = z;
    rib.rotation.x = tiltX;
    rib.rotation.z = rot;
    group.add(rib);
  });

  // Dorsal fin, swept aft — a single angled slab rather than a two-piece
  // curve (two independently-rotated boxes kept leaving a visible seam/gap
  // at their join). Its base sinks well into the torso radius (0.32) so it
  // reads as attached instead of floating above the hull.
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.3), ribMat);
  fin.position.set(0, 0.4, 0.15);
  fin.rotation.x = 0.3;
  group.add(fin);

  // Rear bioluminescent vents — small emissive spheres at asymmetric
  // angles, alternating teal/violet.
  const ventSpecs = [
    { pos: [0.12, 0.1, 1.15], mat: tealMat },
    { pos: [-0.1, -0.14, 1.2], mat: violetMat },
    { pos: [0.02, 0.18, 1.3], mat: tealMat },
  ];
  ventSpecs.forEach(({ pos, mat }) => {
    const vent = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), mat);
    vent.position.set(...pos);
    group.add(vent);
  });

  return group;
}

// === Coralith crystalline ship ===
// Precise and symmetric where Ythar is asymmetric and organic: a faceted
// spine through a core of concentric rings (an armillary/gyroscope motif —
// three rings sharing one center, each in a different plane) rather than
// separate floating beads, plus radial blade-wings with glowing edge lines.
export function buildCoralithShip() {
  const group = new THREE.Group();
  group.userData = { glowMaterials: [], glowSprites: [], faction: 'coralith' };

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe4e8ee, metalness: 0.75, roughness: 0.15 });
  const lineColor = 0x9df0fa;
  const lineMat = new THREE.LineBasicMaterial({ color: lineColor });
  const glowRingMat = new THREE.MeshStandardMaterial({
    color: 0x14262e, emissive: lineColor, emissiveIntensity: 1.4, roughness: 0.2, metalness: 0.3,
  });
  trackGlowMaterial(group, glowRingMat, 1.4, 0, 1.6);

  // Central spine — an elongated octahedron running the ship's length,
  // passing through the ring core below.
  const spine = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), bodyMat);
  spine.scale.set(1, 1, 6);
  group.add(spine);

  // Ring core, at the ship's midpoint: three rings of the same radius, each
  // tilted into a different plane (gimbal-style) but sharing one center —
  // reads as a single concentric/armillary assembly rather than the
  // separate "beads" this replaced. Every ring gets a slim glowing inner
  // companion ring alongside its solid pearlescent body.
  const RING_CORE_Z = 0.15;
  const ringPlanes = [
    { x: 0, y: 0 },
    { x: Math.PI / 2.6, y: 0.5 },
    { x: 0.4, y: Math.PI / 2.4 },
  ];
  ringPlanes.forEach(({ x, y }) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 10, 40), bodyMat);
    ring.rotation.set(x, y, 0);
    ring.position.z = RING_CORE_Z;
    group.add(ring);

    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.012, 8, 40), glowRingMat);
    glowRing.rotation.set(x, y, 0);
    glowRing.position.z = RING_CORE_Z;
    group.add(glowRing);
  });

  // Four radial blade-wings at the ring core, spaced 90 degrees apart —
  // position via cos/sin so each blade's radial offset and its rotation
  // (which points its local +X axis outward) stay in agreement.
  const bladeMat = bodyMat;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.14), bladeMat);
    blade.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, RING_CORE_Z);
    blade.rotation.z = angle;
    group.add(blade);

    const bladeEdges = new THREE.LineSegments(new THREE.EdgesGeometry(blade.geometry), lineMat);
    bladeEdges.position.copy(blade.position);
    bladeEdges.rotation.copy(blade.rotation);
    group.add(bladeEdges);
  }

  return group;
}

export function buildStarship(type) {
  if (type === 'terran') return buildTerranShip();
  if (type === 'explorer') return buildExplorerShip();
  if (type === 'ythar') return buildYtharShip();
  if (type === 'coralith') return buildCoralithShip();
  throw new Error(`Unknown starship type: ${type}`);
}

// Animates every tracked glow material/sprite on a ship group — call once
// per frame per ship with the scene's elapsed clock time.
export function pulseShipGlow(group, elapsed) {
  const { glowMaterials = [], glowSprites = [] } = group.userData;
  glowMaterials.forEach(({ material, base, phase, speed }) => {
    material.emissiveIntensity = base * (0.82 + 0.18 * Math.sin(elapsed * speed + phase));
  });
  glowSprites.forEach(({ sprite, base, phase, speed }) => {
    sprite.material.opacity = base * (0.75 + 0.25 * Math.sin(elapsed * speed + phase));
  });
}
