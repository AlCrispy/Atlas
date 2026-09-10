import * as THREE from 'three';
import { makeGlowTexture, makeDotTexture } from './glow-texture.js';
import {
  mulberry32,
  NEBULA_PALETTES,
  makeNebulaCloudTexture,
  makePlanetaryNebulaTexture,
  makeSupernovaRemnantTexture,
} from './nebula-texture.js';

// Decorative deep-space phenomena for the galaxy overview: large nebula
// complexes as a backdrop, plus smaller objects (planetary nebulae, a
// supernova remnant, star clusters, a pulsar, a distant quasar) scattered in
// the space between galaxies. None are clickable — they're scenery, not
// part of `bodies`/the system list.
//
// Galaxy readability is the priority, enforced two ways:
// - Placement: mid-range objects sit off the galactic band (|y| >= 60 and
//   well outside the lenticular/dwarf column on the y-axis), so orbiting
//   galaxies never pass through them; big nebulae live out at r >= 380 as a
//   backdrop.
// - Per-frame dimming: whenever a phenomenon overlaps a galaxy on screen
//   (angular separation vs. both angular radii), its opacity drops, so gas
//   never washes out the galaxy particles in front of/behind it. Also faded
//   out when the camera gets close, same as the older background haze.

const RNG_SEED = 424242;

// Shared vertex/fragment for beams and jets: bright at the apex (uv.y = 1
// on a CylinderGeometry's top), fading toward the open end, and softened at
// the silhouette edges via a view-facing term so the cone reads as light,
// not a solid mesh.
function makeBeamMaterial(color, opacity) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormalView = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main() {
        float along = pow(vUv.y, 2.2);
        float facing = abs(dot(normalize(vNormalView), normalize(vViewDir)));
        float alpha = along * facing * facing * uOpacity;
        gl_FragColor = vec4(uColor * alpha, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

// Cone with its apex at the local origin, opening toward -Y.
function makeBeam({ length, width, color, opacity }) {
  const geometry = new THREE.CylinderGeometry(0, width, length, 24, 1, true);
  geometry.translate(0, -length / 2, 0);
  return new THREE.Mesh(geometry, makeBeamMaterial(color, opacity));
}

function makeGlowSprite(color, size, opacity) {
  const texture = makeGlowTexture(color, 'rgba(0,0,0,0)');
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  sprite.scale.set(size, size, 1);
  return sprite;
}

// For the opaque-on-black nebula textures (see bakeTexture): additive on
// color, but framebuffer alpha left untouched. Plain AdditiveBlending would
// write alpha = 1 across the whole quad, and since the renderer canvas is
// transparent over the page's CSS background, every sprite would punch a
// visible dark square into it.
function makeTexturedSprite(texture, size, opacity, rotation = 0) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity,
    rotation,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.ZeroFactor,
    blendDstAlpha: THREE.OneFactor,
    depthWrite: false,
  }));
  sprite.scale.set(size, size, 1);
  return sprite;
}

export function createSpacePhenomena({ scene, camera, galaxies }) {
  const rand = mulberry32(RNG_SEED);
  const dotTexture = makeDotTexture();
  const root = new THREE.Group();
  scene.add(root);

  // Every phenomenon registers here: `radius` is its visual world-space
  // half-size (for the on-screen overlap test), `fades` the materials whose
  // opacity it drives, `minDim` how far galaxy overlap may dim it.
  const entries = [];
  function register(object, { radius, overlapRadius = radius, minDim = 0.25, nearFade = [radius * 0.8, radius * 2.2] }) {
    const fades = [];
    object.traverse((child) => {
      const material = child.material;
      if (!material) return;
      const base = material.uniforms?.uOpacity ? material.uniforms.uOpacity.value : material.opacity;
      fades.push({ material, base });
    });
    entries.push({ object, overlapRadius, minDim, nearFade, fades, dim: 1 });
    root.add(object);
  }

  // A small scatter of bright, young stars inside a region — sells nebulae
  // and open clusters as stellar nurseries rather than flat color blobs.
  function makeStarScatter({ count, spread, colors, size }) {
    const positions = new Float32Array(count * 3);
    const vertexColors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = spread * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
      color.set(colors[Math.floor(rand() * colors.length)]);
      vertexColors.set([color.r, color.g, color.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({
      size,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
  }

  // === Nebula complexes (far backdrop) ===
  // Each complex layers 2-3 noise-cloud sprites of different palettes at
  // small offsets, so overlapping gases mix (e.g. oxygen teal bleeding into
  // hydrogen red) instead of reading as a single tinted disc.
  // The last two sit roughly behind the black hole as seen from the home
  // camera, so the landing view gets a backdrop without any rotation.
  const NEBULA_COMPLEXES = [
    { position: [-420, -60, -320], size: 320, layers: ['emission', 'oxygen'], opacity: 0.8 },
    { position: [460, 120, -260], size: 280, layers: ['violet', 'reflection'], opacity: 0.75 },
    { position: [140, -200, 470], size: 300, layers: ['sulfur', 'emission'], opacity: 0.75 },
    { position: [-330, 240, 300], size: 260, layers: ['reflection', 'oxygen'], opacity: 0.75 },
    { position: [80, 380, -340], size: 260, layers: ['emission', 'violet', 'sulfur'], opacity: 0.7 },
    { position: [-60, -360, -400], size: 280, layers: ['oxygen', 'violet'], opacity: 0.7 },
    { position: [330, -150, -420], size: 240, layers: ['sulfur', 'emission'], opacity: 0.7 },
  ];

  let seed = 1000;
  NEBULA_COMPLEXES.forEach((complex) => {
    const group = new THREE.Group();
    group.position.set(...complex.position);
    complex.layers.forEach((paletteName, layerIndex) => {
      const texture = makeNebulaCloudTexture({
        seed: seed++,
        palette: NEBULA_PALETTES[paletteName],
        dust: layerIndex === 0 ? 0.7 : 0.35,
        stretch: 1 + rand() * 0.6,
      });
      const layerSize = complex.size * (layerIndex === 0 ? 1 : 0.6 + rand() * 0.3);
      const sprite = makeTexturedSprite(texture, layerSize, complex.opacity, rand() * Math.PI * 2);
      sprite.position.set((rand() - 0.5) * complex.size * 0.35, (rand() - 0.5) * complex.size * 0.25, (rand() - 0.5) * 20);
      group.add(sprite);
    });
    group.add(makeStarScatter({
      count: 24,
      spread: complex.size * 0.3,
      colors: ['#ffffff', '#cfe4ff', '#9fc8ff', '#ffe6c8'],
      size: 2.2,
    }));
    // Only the bright core counts for the overlap test — a galaxy crossing
    // a cloud's faint outskirts shouldn't dim the whole complex, or these
    // backdrops would sit permanently dimmed behind the cluster.
    // Near fade scaled to the full sprite size: a zoomed-out camera can end
    // up only ~100 units from a complex, where a 300-unit sprite would
    // otherwise wash the entire screen in haze.
    register(group, {
      radius: complex.size * 0.45,
      overlapRadius: complex.size * 0.18,
      minDim: 0.45,
      nearFade: [complex.size * 0.9, complex.size * 2],
    });
  });

  // === Planetary nebulae ===
  const PLANETARY_NEBULAE = [
    { position: [160, 95, 90], size: 16 },
    { position: [-200, -85, -150], size: 13 },
  ];
  PLANETARY_NEBULAE.forEach(({ position, size }) => {
    const group = new THREE.Group();
    group.position.set(...position);
    group.add(makeTexturedSprite(makePlanetaryNebulaTexture({ seed: seed++ }), size, 0.9, rand() * Math.PI));
    register(group, { radius: size * 0.5, minDim: 0.35 });
  });

  // === Supernova remnant ===
  {
    const group = new THREE.Group();
    group.position.set(-190, 110, -40);
    const size = 60;
    group.add(makeTexturedSprite(makeSupernovaRemnantTexture({ seed: seed++ }), size, 0.75));
    // Faint inner glow where the stellar remnant sits.
    group.add(makeGlowSprite('rgba(140,190,255,0.5)', size * 0.3, 0.35));
    register(group, { radius: size * 0.45, minDim: 0.3 });
  }

  // === Globular clusters ===
  // Dense, old, warm-yellow spheres of stars — Gaussian-ish concentration
  // toward the core via the squared random radius.
  const GLOBULAR_CLUSTERS = [
    { position: [95, -120, -150], radius: 5 },
    { position: [-140, 90, 170], radius: 4 },
    { position: [230, -75, 40], radius: 4.5 },
    { position: [-60, 140, -160], radius: 3.5 },
  ];
  GLOBULAR_CLUSTERS.forEach(({ position, radius }) => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * rand() * rand() * 1.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const group = new THREE.Group();
    group.position.set(...position);
    group.add(new THREE.Points(geometry, new THREE.PointsMaterial({
      size: 0.7,
      map: dotTexture,
      color: 0xffe2a8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })));
    group.add(makeGlowSprite('rgba(255,214,150,0.9)', radius * 2.2, 0.45));
    register(group, { radius: radius * 1.2, minDim: 0.4 });
  });

  // === Open cluster (Pleiades-like) ===
  {
    const group = new THREE.Group();
    group.position.set(-230, -95, 120);
    group.add(makeStarScatter({ count: 28, spread: 9, colors: ['#ffffff', '#cfe4ff', '#9fc8ff'], size: 1.8 }));
    const haze = makeNebulaCloudTexture({ seed: seed++, palette: NEBULA_PALETTES.reflection, dust: 0.2 });
    group.add(makeTexturedSprite(haze, 26, 0.4, rand() * Math.PI));
    register(group, { radius: 12, minDim: 0.35 });
  }

  // === Pulsar ===
  // Lighthouse: two opposite beams on an axis tilted off the spin axis, so
  // they sweep a cone as the group spins.
  const pulsar = new THREE.Group();
  pulsar.position.set(135, -100, -40);
  const pulsarBeams = new THREE.Group();
  pulsarBeams.rotation.z = 0.55;
  const beamUp = makeBeam({ length: 26, width: 2.6, color: 0x9fdcff, opacity: 0.85 });
  beamUp.rotation.x = Math.PI;
  pulsarBeams.add(beamUp);
  pulsarBeams.add(makeBeam({ length: 26, width: 2.6, color: 0x9fdcff, opacity: 0.85 }));
  pulsar.add(pulsarBeams);
  const pulsarCore = makeGlowSprite('rgba(220,240,255,1)', 5, 1);
  pulsar.add(pulsarCore);
  register(pulsar, { radius: 14, minDim: 0.35 });

  // === Quasar ===
  // Distant, very bright core with twin relativistic jets and a faint host
  // galaxy haze — far out so it reads as small but intense.
  const quasar = new THREE.Group();
  quasar.position.set(-470, 60, 180);
  quasar.rotation.set(0.4, 0, 0.9);
  const jetUp = makeBeam({ length: 70, width: 2.2, color: 0xb79bff, opacity: 0.8 });
  jetUp.rotation.x = Math.PI;
  quasar.add(jetUp);
  quasar.add(makeBeam({ length: 70, width: 2.2, color: 0xb79bff, opacity: 0.8 }));
  quasar.add(makeGlowSprite('rgba(255,245,230,1)', 9, 1));
  quasar.add(makeGlowSprite('rgba(150,120,255,0.6)', 34, 0.35));
  register(quasar, { radius: 30, minDim: 0.35 });

  // === Per-frame update ===
  const toObject = new THREE.Vector3();
  const toGalaxy = new THREE.Vector3();
  const worldPos = new THREE.Vector3();

  function galaxyOverlapDim(entry, distance) {
    let dim = 1;
    const objectAngle = Math.atan(entry.overlapRadius / distance);
    galaxies.forEach(({ position, radius }) => {
      toGalaxy.subVectors(position, camera.position);
      const galaxyDistance = toGalaxy.length();
      if (galaxyDistance < 1e-3) return;
      const galaxyAngle = Math.atan((radius * 0.9) / galaxyDistance);
      const separation = toObject.angleTo(toGalaxy);
      const overlap = separation / (objectAngle + galaxyAngle);
      const d = THREE.MathUtils.lerp(entry.minDim, 1, THREE.MathUtils.smoothstep(overlap, 0.45, 1.05));
      if (d < dim) dim = d;
    });
    return dim;
  }

  function update(delta, elapsed) {
    pulsar.rotation.y += delta * 2.4;
    const flicker = 0.85 + Math.sin(elapsed * 15) * 0.15;
    pulsarCore.scale.set(5 * flicker, 5 * flicker, 1);

    entries.forEach((entry) => {
      entry.object.getWorldPosition(worldPos);
      toObject.subVectors(worldPos, camera.position);
      const distance = toObject.length();
      const near = THREE.MathUtils.smoothstep(distance, entry.nearFade[0], entry.nearFade[1]);
      // Ease the dim instead of snapping, so a galaxy sliding across a
      // nebula dims it smoothly rather than popping.
      const targetDim = galaxyOverlapDim(entry, distance);
      entry.dim += (targetDim - entry.dim) * Math.min(1, delta * 4);
      const factor = near * entry.dim;
      entry.object.visible = factor > 0.01;
      entry.fades.forEach(({ material, base }) => {
        if (material.uniforms?.uOpacity) material.uniforms.uOpacity.value = base * factor;
        else material.opacity = base * factor;
      });
    });
  }

  return { update };
}
