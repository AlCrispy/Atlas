import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, makeDotTexture, makeNebulaBlobTexture, makeRingTexture, buildSpiralGalaxy, buildEllipticalGalaxy, buildIrregularGalaxy, buildLenticularGalaxy, buildDwarfGalaxy, buildRingGalaxy, buildPeculiarGalaxy } from './galaxy-shapes.js';
import { makeLabelTexture } from './label-texture.js';
import { createLensSystem } from './gravitational-lens.js';
import { createSceneInteraction } from './scene-interaction.js';

// === Tunables ===
const STARFIELD_COUNT = 1500;
const TRIANGLE_SIDE = 200;
const TRIANGLE_RADIUS = TRIANGLE_SIDE / Math.sqrt(3);
const SPIRAL_SPIN = 0.015;
const ELLIPTICAL_SPIN = 0.006;
const IRREGULAR_SPIN = 0.01;
const LENTICULAR_SPIN = 0.008;
const DWARF_SPIN = 0.02;
const RING_SPIN = 0.012;
const PECULIAR_SPIN = 0.02;
const MILKYWAY_SPIN = 0.014;

const BEACON_SCALE = 2.5;

// Linear scene-unit -> light-year conversion for the distance-compare panel.
// Calibrated so the closest same-galaxy star pair in the scene (~6.78
// scene units, two Dwarf-galaxy systems) reads as ~10 light-years.
const DISTANCE_SCALE_LY_PER_UNIT = 1.474;

// IAU-defined light-year -> parsec conversion, for the compare panel's secondary reading.
const LY_PER_PARSEC = 3.26156;

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
const HOME_OFFSET = new THREE.Vector3(0, 160, 300);
camera.position.copy(HOME_OFFSET);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 20;
controls.maxDistance = 620;

// === Starfield ===
// Per-point randomized size (0.5x-1.5x of the base size) — PointsMaterial
// only supports one uniform size for the whole geometry, so a small custom
// ShaderMaterial with a per-vertex size attribute is used instead.
const STARFIELD_BASE_SIZE = 2.0;

function buildStarfield() {
  const count = STARFIELD_COUNT;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 350 + Math.random() * 250;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = STARFIELD_BASE_SIZE * (0.5 + Math.random());
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: makeDotTexture() },
      uScale: { value: 560.0 },
    },
    vertexShader: `
      attribute float aSize;
      uniform float uScale;
      varying float vDist;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDist = -mvPosition.z;
        gl_PointSize = aSize * (uScale / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying float vDist;
      void main() {
        vec4 texColor = texture2D(map, gl_PointCoord);
        // Fade out any point the camera has drifted close to, instead of
        // letting it loom large in the foreground — fully gone by 90
        // units, back to normal past 170.
        float nearFade = smoothstep(90.0, 170.0, vDist);
        gl_FragColor = vec4(vec3(1.0), texColor.a * 0.7 * nearFade);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  scene.add(new THREE.Points(geometry, material));
}
buildStarfield();

// === Deep background decoration ===
// The plain dot starfield alone reads as too uniform for how varied real
// space looks — scatter a handful of small, non-interactive nebula haze
// sprites and miniature spiral clusters further out (no beacons, not part
// of `bodies`/raycasting, purely decorative) so the deep background has
// texture beyond points.
function randomSpherePoint(minRadius, maxRadius) {
  const r = minRadius + Math.random() * (maxRadius - minRadius);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

const NEBULA_HAZE_COLORS = ['#8a6ae8', '#4fd8e8', '#e86ab0', '#e8a04f', '#6ae88a'];

const nebulaSprites = [];
function buildNebulaHaze(count) {
  for (let i = 0; i < count; i++) {
    const color = NEBULA_HAZE_COLORS[Math.floor(Math.random() * NEBULA_HAZE_COLORS.length)];
    // makeNebulaBlobTexture generates a fresh, irregular blob layout on
    // every call, so each sprite gets its own amorphous cloud shape
    // instead of a uniform circle.
    const texture = makeNebulaBlobTexture(color);
    const baseOpacity = 0.16 + Math.random() * 0.12;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: baseOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    sprite.userData.baseOpacity = baseOpacity;
    const size = 28 * (0.5 + Math.random());
    sprite.scale.set(size, size, 1);
    sprite.position.set(...randomSpherePoint(400, 650));
    scene.add(sprite);
    nebulaSprites.push(sprite);
  }
}
buildNebulaHaze(9);

// Varied core/arm/nebula color triples so the mini spirals don't all read
// as the same galaxy recolored — picked randomly per instance.
const MINI_SPIRAL_PALETTES = [
  { coreColor: 0x9df0fa, armColor: 0x4fd8e8, nebulaColor: 0x8a6ae8 },
  { coreColor: 0xffe8c8, armColor: 0xff9a4f, nebulaColor: 0xe85050 },
  { coreColor: 0xffb8e8, armColor: 0xb46ae8, nebulaColor: 0x6a4ae8 },
  { coreColor: 0xc8ffb8, armColor: 0x4fe8a0, nebulaColor: 0x2f9c78 },
  { coreColor: 0xffe0a0, armColor: 0xe8c84f, nebulaColor: 0xb47a2a },
  { coreColor: 0xa0c8ff, armColor: 0x5070e8, nebulaColor: 0x8a6ae8 },
];

const backgroundGalaxies = [];
function buildMiniSpirals(count) {
  for (let i = 0; i < count; i++) {
    const palette = MINI_SPIRAL_PALETTES[Math.floor(Math.random() * MINI_SPIRAL_PALETTES.length)];
    const mini = buildSpiralGalaxy({
      position: randomSpherePoint(420, 720),
      discParticleCount: 180,
      nebulaParticleCount: 40,
      radius: 5 + Math.random() * 3,
      armCount: 2 + Math.floor(Math.random() * 3),
      ...palette,
    });
    mini.rotation.set(Math.random() * Math.PI, 0, Math.random() * Math.PI);
    mini.scale.setScalar(0.5 + Math.random());
    scene.add(mini);
    backgroundGalaxies.push(mini);
  }
}
buildMiniSpirals(9);

// === Triangle layout ===
function triangleVertex(index) {
  const angle = Math.PI / 2 + (index * 2 * Math.PI) / 3;
  return [Math.cos(angle) * TRIANGLE_RADIUS, 0, Math.sin(angle) * TRIANGLE_RADIUS];
}

// === Galaxies ===
// Each disc gets a fixed x/z tilt (on top of the continuous y-axis spin
// applied in animate()) so they read as discs viewed from different
// angles in space, rather than every galaxy lying flat on the same plane.
const spiralGalaxy = buildSpiralGalaxy({
  position: triangleVertex(0),
  discParticleCount: 3000,
  nebulaParticleCount: 800,
  radius: 40,
});
spiralGalaxy.rotation.set(0.35, 0, 0.15);
scene.add(spiralGalaxy);

const ellipticalGalaxy = buildEllipticalGalaxy({
  position: triangleVertex(1),
  particleCount: 2500,
  radius: 35,
});
ellipticalGalaxy.rotation.set(-0.4, 0, 0.3);
scene.add(ellipticalGalaxy);

const irregularGalaxy = buildIrregularGalaxy({
  position: triangleVertex(2),
  particleCount: 2000,
  radius: 30,
});
irregularGalaxy.rotation.set(0.5, 0, -0.25);
scene.add(irregularGalaxy);

// Above/below the black hole, off the triangle's plane, with asymmetric
// jitter so the pair doesn't read as a mirrored, mechanically-placed set.
const lenticularGalaxy = buildLenticularGalaxy({
  position: [18, 95, -12],
  particleCount: 1800,
  radius: 25,
});
lenticularGalaxy.rotation.set(-0.3, 0, 0.4);
scene.add(lenticularGalaxy);

const dwarfGalaxy = buildDwarfGalaxy({
  position: [-14, -90, 20],
  particleCount: 1200,
  radius: 14,
});
dwarfGalaxy.rotation.set(0.55, 0, 0.2);
scene.add(dwarfGalaxy);

// The triangle trio sits in-plane (y=0) far out, and the lenticular/dwarf
// pair sits far above/below near the y-axis — leaving the mid-range shell
// immediately around the black hole empty. These two fill that gap.
const ringGalaxy = buildRingGalaxy({
  position: [40, 30, -35],
  ringParticleCount: 2200,
  nucleusParticleCount: 300,
  radius: 20,
});
ringGalaxy.rotation.set(-0.45, 0, -0.3);
scene.add(ringGalaxy);

const peculiarGalaxy = buildPeculiarGalaxy({
  position: [-35, -28, 32],
  coreParticleCount: 1400,
  tailParticleCount: 900,
  radius: 22,
});
peculiarGalaxy.rotation.set(0.25, 0, 0.45);
scene.add(peculiarGalaxy);

// Our own galaxy — a real barred spiral (Hubble type ~SBbc). Placed on the
// far side of the whole cluster, well clear of Aurvex in particular (also
// a plain spiral — distance to it is ~296 units here, vs. ~155+ to every
// other galaxy/black-hole anchor) so the two don't read as a matched pair.
// Reuses buildSpiralGalaxy's arm/nebula/core technique; distinguished by
// name/position/size rather than a bespoke bar shape, to keep this a
// straightforward addition rather than new rendering machinery.
const milkyWayGalaxy = buildSpiralGalaxy({
  position: [0, -10, -180],
  discParticleCount: 3400,
  nebulaParticleCount: 900,
  radius: 45,
  // Real Milky Way photos: a warm dust-reddened core, blue hot-star arms,
  // and gas clouds spanning orange/purple/blue/green/teal — distinct from
  // every other (single-tint) galaxy in the scene.
  coreColor: 0xffcf99,
  armColor: 0x6fa8ff,
  nebulaColors: [0xff8a4f, 0xa855f7, 0x4a7fff, 0x5ee87a, 0x2dd4bf],
});
milkyWayGalaxy.rotation.set(-0.35, 0, 0.25);
scene.add(milkyWayGalaxy);

// === Beacons ===
// Each beacon links to a placeholder page at unknown-frontier/systems/{slug}.html
const SPIRAL_BEACONS = [
  { name: 'Vessek', slug: 'vessek', position: [12, 1, -7] },
  { name: 'Thalir-9', slug: 'thalir-9', position: [-17, -1, 9] },
  { name: 'Kaion Rift', slug: 'kaion-rift', position: [21, 2, 13] },
  { name: 'Drevane', slug: 'drevane', position: [-9, -1, -20] },
  { name: 'Solmira', slug: 'solmira', position: [27, 1, -3] },
];

const ELLIPTICAL_BEACONS = [
  { name: 'Ozmun Prime', slug: 'ozmun-prime', position: [15, 3, 10] },
  { name: 'Haldrin', slug: 'haldrin', position: [-20, -2, 8] },
  { name: 'Cerevane', slug: 'cerevane', position: [8, 4, -22] },
  { name: 'Tessaly', slug: 'tessaly', position: [-12, -3, -15] },
  { name: 'Norvun', slug: 'norvun', position: [22, 1, -5] },
];

const IRREGULAR_BEACONS = [
  { name: 'Rakthos', slug: 'rakthos', position: [10, 2, 8] },
  { name: 'Ybrenn', slug: 'ybrenn', position: [-15, -1, -10] },
  { name: 'Quovar', slug: 'quovar', position: [18, -2, -5] },
  { name: 'Skellith', slug: 'skellith', position: [-8, 3, 15] },
  { name: 'Manoth', slug: 'manoth', position: [5, -3, -18] },
];

const LENTICULAR_BEACONS = [
  { name: 'Aldevik', slug: 'aldevik', position: [10, 1, -5] },
  { name: 'Cormanth', slug: 'cormanth', position: [-14, 0, 7] },
  { name: 'Estryn', slug: 'estryn', position: [16, 1, 10] },
  { name: 'Vallor Deep', slug: 'vallor-deep', position: [-7, 0, -15] },
  { name: 'Ninhara', slug: 'ninhara', position: [20, 1, -2] },
];

const DWARF_BEACONS = [
  { name: 'Yssel', slug: 'yssel', position: [6, 1, 4] },
  { name: 'Braxton', slug: 'braxton', position: [-8, 0, -5] },
  { name: 'Corvai', slug: 'corvai', position: [4, -1, -9] },
  { name: 'Ithera', slug: 'ithera', position: [-5, 1, 7] },
  { name: 'Zennor', slug: 'zennor', position: [9, 0, -2] },
];

const RING_BEACONS = [
  { name: 'Kessaria', slug: 'kessaria', position: [14, 1, 10] },
  { name: 'Novandra', slug: 'novandra', position: [-16, 2, 8] },
  { name: 'Brythe', slug: 'brythe', position: [10, -1, -17] },
  { name: 'Selkirion', slug: 'selkirion', position: [-9, 1, 16] },
  { name: 'Talvenor', slug: 'talvenor', position: [18, -2, -6] },
];

const PECULIAR_BEACONS = [
  { name: 'Ashkar', slug: 'ashkar', position: [8, 3, 6] },
  { name: 'Ruinvale', slug: 'ruinvale', position: [-14, -4, -9] },
  { name: 'Kethra', slug: 'kethra', position: [18, 5, -12] },
  { name: 'Ombrix', slug: 'ombrix', position: [-6, -6, 14] },
  { name: 'Faelund', slug: 'faelund', position: [22, 2, 5] },
];

const MILKYWAY_BEACONS = [
  { name: 'Sistema Solare', slug: 'sistema-solare', position: [14, 1, 9] },
  { name: 'Ferrandis', slug: 'ferrandis', position: [-18, -1, 11] },
  { name: 'Kylenne', slug: 'kylenne', position: [10, 2, -19] },
];

const beaconTexture = makeGlowTexture('rgba(138,106,232,1)', 'rgba(138,106,232,0)');

function addBeaconSprites(beaconList, parentGroup, targetArray, galaxyName, zoomDistance) {
  beaconList.forEach((beacon) => {
    beacon.galaxy = galaxyName;
    beacon.eyebrow = 'Sistema Solare';
    beacon.color = '#8a6ae8';
    beacon.exploreHref = `systems/${beacon.slug}.html`;
    beacon.zoomTarget = parentGroup.position.clone();
    beacon.zoomDistance = zoomDistance;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: beaconTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    sprite.scale.set(BEACON_SCALE, BEACON_SCALE, 1);
    sprite.position.set(...beacon.position);
    sprite.userData.beacon = beacon;
    sprite.userData.baseScale = BEACON_SCALE;
    parentGroup.add(sprite);
    targetArray.push(sprite);
  });
}

const beaconMeshes = [];
addBeaconSprites(SPIRAL_BEACONS, spiralGalaxy, beaconMeshes, 'Aurvex', 70);
addBeaconSprites(ELLIPTICAL_BEACONS, ellipticalGalaxy, beaconMeshes, 'Meridian', 65);
addBeaconSprites(IRREGULAR_BEACONS, irregularGalaxy, beaconMeshes, 'Zhorn', 60);
addBeaconSprites(LENTICULAR_BEACONS, lenticularGalaxy, beaconMeshes, 'Corvantis', 55);
addBeaconSprites(DWARF_BEACONS, dwarfGalaxy, beaconMeshes, 'Pyxis', 40);
addBeaconSprites(RING_BEACONS, ringGalaxy, beaconMeshes, 'Cygnix', 50);
addBeaconSprites(PECULIAR_BEACONS, peculiarGalaxy, beaconMeshes, 'Vandrel', 52);
addBeaconSprites(MILKYWAY_BEACONS, milkyWayGalaxy, beaconMeshes, 'Via Lattea', 75);

// === Black hole ===
function buildBlackHole() {
  const group = new THREE.Group();

  const eventHorizon = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  group.add(eventHorizon);

  // Two-layer halo: a wide, soft outer glow plus a tighter inner one, kept
  // dim and pale blue-white so light stays concentrated near the horizon
  // (like a real accretion disk) instead of a diffuse colored bloom.
  const outerGlowTexture = makeGlowTexture('rgba(220,235,255,0.15)', 'rgba(220,235,255,0)');
  const outerGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: outerGlowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  outerGlow.scale.set(22, 22, 1);
  group.add(outerGlow);

  const glowTexture = makeGlowTexture('rgba(220,235,255,0.35)', 'rgba(220,235,255,0)');
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  glow.scale.set(14, 14, 1);
  group.add(glow);

  const diskTexture = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
  const diskParticleCount = 500;
  const diskInnerRadius = 4;
  const diskOuterRadius = 14;
  // Inverse-radius angular speed/infall so particles whirl and fall inward
  // faster the closer they get, reading as a vortex rather than a rigid
  // spinning disk. Recycled back to the outer edge once they cross the
  // event horizon, so the disk never thins out.
  const DISK_ANGULAR_CONSTANT = 0.9;
  const DISK_INFALL_SPEED = 0.6;

  const diskPositions = new Float32Array(diskParticleCount * 3);
  const diskColors = new Float32Array(diskParticleCount * 3);
  const diskRadii = new Float32Array(diskParticleCount);
  const diskAngles = new Float32Array(diskParticleCount);
  const diskYOffsets = new Float32Array(diskParticleCount);
  // Hot white-blue near the horizon fading to a warm dust brown further
  // out, matching a Gargantua-style accretion disk rather than a fiery
  // orange ring.
  const innerColor = new THREE.Color(0xf3f8ff);
  const outerColor = new THREE.Color(0x8f6f52);
  const scratchColor = new THREE.Color();

  function writeDiskParticle(i) {
    const r = diskRadii[i];
    const angle = diskAngles[i];

    diskPositions[i * 3] = Math.cos(angle) * r;
    diskPositions[i * 3 + 1] = diskYOffsets[i];
    diskPositions[i * 3 + 2] = Math.sin(angle) * r;

    const t = (r - diskInnerRadius) / (diskOuterRadius - diskInnerRadius);
    scratchColor.copy(innerColor).lerp(outerColor, t);
    diskColors[i * 3] = scratchColor.r;
    diskColors[i * 3 + 1] = scratchColor.g;
    diskColors[i * 3 + 2] = scratchColor.b;
  }

  for (let i = 0; i < diskParticleCount; i++) {
    // Spread initial radii across the full band so the disk looks whole
    // right away instead of taking one infall cycle to fill in.
    diskRadii[i] = diskInnerRadius + Math.random() * (diskOuterRadius - diskInnerRadius);
    diskAngles[i] = Math.random() * Math.PI * 2;
    diskYOffsets[i] = (Math.random() - 0.5) * 0.6;
    writeDiskParticle(i);
  }

  const diskGeometry = new THREE.BufferGeometry();
  diskGeometry.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
  diskGeometry.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));
  const diskMaterial = new THREE.PointsMaterial({
    size: 1.2,
    map: diskTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const disk = new THREE.Points(diskGeometry, diskMaterial);
  disk.rotation.x = 0.3;
  group.add(disk);

  function updateDisk(delta) {
    for (let i = 0; i < diskParticleCount; i++) {
      const r = diskRadii[i];
      diskAngles[i] += (DISK_ANGULAR_CONSTANT / r) * delta;
      diskRadii[i] = r - (DISK_INFALL_SPEED * (diskOuterRadius / r)) * delta;

      if (diskRadii[i] <= diskInnerRadius) {
        diskRadii[i] = diskOuterRadius;
        diskAngles[i] = Math.random() * Math.PI * 2;
        diskYOffsets[i] = (Math.random() - 0.5) * 0.6;
      }

      writeDiskParticle(i);
    }

    diskGeometry.attributes.position.needsUpdate = true;
    diskGeometry.attributes.color.needsUpdate = true;
  }

  const hitSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  }));
  hitSprite.scale.set(10, 10, 1);
  hitSprite.userData.baseScale = 10;
  group.add(hitSprite);

  scene.add(group);

  return { disk, hitSprite, updateDisk };
}

const { hitSprite: blackHoleHitSprite, updateDisk: updateBlackHoleDisk } = buildBlackHole();
blackHoleHitSprite.userData.beacon = {
  name: 'Voro Nexus',
  slug: 'voro-nexus',
  eyebrow: 'Fenomeno Cosmico',
  galaxy: 'Fenomeno Cosmico',
  color: '#b496ff',
  exploreHref: 'systems/voro-nexus.html',
  position: [0, 0, 0],
  zoomTarget: new THREE.Vector3(0, 0, 0),
  zoomDistance: 32,
};
beaconMeshes.push(blackHoleHitSprite);

// === Gravitational lens ===
// Real lensing belongs to the black hole itself, not a separate floating
// object: a shell sitting just outside the event horizon (radius 4) and
// inside the accretion disk's inner edge (radius 6), bending the disk and
// starfield behind it. Purely visual — not pushed to beaconMeshes, since
// clicking the black hole is already handled by blackHoleHitSprite above;
// createLensSystem stays a reusable factory for future standalone lenses
// elsewhere (one shared offscreen render target, cost fixed per-instance).
const lensSystem = createLensSystem({ scene, camera, renderer });

lensSystem.buildLens({
  position: [0, 0, 0],
  radius: 5,
  distortionStrength: 0.5,
  // Pulls the disk/starfield in harder along x than y, so the sides read as
  // squeezed toward the center like a candy wrapper twisted at both ends.
  squeezeX: 2.0,
  // Pale blue-white to match the Gargantua-style disk light bent around
  // the horizon, rather than a tinted rim.
  color: '#eaf4ff',
});

// === Galaxy labels ===
// World-space name tags floating above each galaxy — added directly to
// `scene`, not as a child of the rotating galaxy group, so they stay put
// instead of orbiting as the galaxy spins. Built after document.fonts is
// ready so the canvas text bakes in Orbitron rather than a fallback font.
const GALAXY_LABEL_COLOR = '#8a6ae8';
const GALAXY_LABEL_HEIGHT = 7;

const GALAXY_LABELS = [
  { name: 'Aurvex', position: spiralGalaxy.position, radius: 40 },
  { name: 'Meridian', position: ellipticalGalaxy.position, radius: 35 },
  { name: 'Zhorn', position: irregularGalaxy.position, radius: 30 },
  { name: 'Corvantis', position: lenticularGalaxy.position, radius: 25 },
  { name: 'Pyxis', position: dwarfGalaxy.position, radius: 14 },
  { name: 'Cygnix', position: ringGalaxy.position, radius: 20 },
  { name: 'Vandrel', position: peculiarGalaxy.position, radius: 22 },
  { name: 'Via Lattea', position: milkyWayGalaxy.position, radius: 45 },
];

document.fonts.ready.then(() => {
  GALAXY_LABELS.forEach(({ name, position, radius }) => {
    const { texture, aspect } = makeLabelTexture(name, GALAXY_LABEL_COLOR);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }));
    sprite.scale.set(GALAXY_LABEL_HEIGHT * aspect, GALAXY_LABEL_HEIGHT, 1);
    sprite.position.set(position.x, position.y + radius * 0.75, position.z);
    scene.add(sprite);
  });
});

// === System labels ===
// Much smaller name tags for individual beacons, so each star can be told
// apart when comparing distances. Added as a sibling of the beacon sprite
// inside the same rotating galaxy group (tracks the spin the same way),
// but hidden until the camera is close to that galaxy — the overview stays
// clean and only zoomed-in views need the stars identified.
const SYSTEM_LABEL_COLOR = '#c9c2f5';
const SYSTEM_LABEL_HEIGHT = 1.6;
const SYSTEM_LABEL_OFFSET = 1.4;
const SYSTEM_LABEL_REVEAL_FACTOR = 1.2;

const systemLabelSprites = [];

document.fonts.ready.then(() => {
  beaconMeshes.forEach((mesh) => {
    const beacon = mesh.userData.beacon;
    // The black hole isn't part of a galaxy group and is already uniquely
    // labeled via its card — skip it here.
    if (beacon.galaxy === 'Fenomeno Cosmico') return;
    const { texture, aspect } = makeLabelTexture(beacon.name, SYSTEM_LABEL_COLOR, { fontSize: 26 });
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }));
    sprite.scale.set(SYSTEM_LABEL_HEIGHT * aspect, SYSTEM_LABEL_HEIGHT, 1);
    sprite.position.set(beacon.position[0], beacon.position[1] + SYSTEM_LABEL_OFFSET, beacon.position[2]);
    sprite.visible = false;
    mesh.parent.add(sprite);
    systemLabelSprites.push({ sprite, group: mesh.parent, revealDistance: beacon.zoomDistance * SYSTEM_LABEL_REVEAL_FACTOR });
  });
});

// === System list panel ===
// Built from the same beaconMeshes used for raycasting, grouped by galaxy
// in scene order, so names/slugs/grouping never drift out of sync with
// the 3D scene.
const systemListItems = document.querySelector('.system-list-items');
const listItemsBySlug = new Map();
const slugToMesh = new Map();
const compareSelectA = document.querySelector('.compare-select[data-slot="a"]');
const compareSelectB = document.querySelector('.compare-select[data-slot="b"]');

const galaxyGroups = new Map();
beaconMeshes.forEach((mesh) => {
  const galaxyName = mesh.userData.beacon.galaxy;
  if (!galaxyGroups.has(galaxyName)) galaxyGroups.set(galaxyName, []);
  galaxyGroups.get(galaxyName).push(mesh);
});

// Each galaxy is its own collapsible group — a header button toggling a
// nested <ul> — so the full ~40-system list stays navigable instead of one
// long scroll.
galaxyGroups.forEach((meshes, galaxyName) => {
  const groupItem = document.createElement('li');
  groupItem.className = 'system-list-group-item is-collapsed';

  const heading = document.createElement('button');
  heading.type = 'button';
  heading.className = 'system-list-group system-list-group-toggle';
  heading.setAttribute('aria-expanded', 'false');
  heading.innerHTML = `<span class="system-list-group-label">${galaxyName}</span><span class="system-list-group-caret">▾</span>`;
  groupItem.appendChild(heading);

  const subitems = document.createElement('ul');
  subitems.className = 'system-list-subitems';
  groupItem.appendChild(subitems);

  heading.addEventListener('click', () => {
    const collapsed = groupItem.classList.toggle('is-collapsed');
    heading.setAttribute('aria-expanded', String(!collapsed));
  });

  systemListItems.appendChild(groupItem);

  const optgroupA = document.createElement('optgroup');
  optgroupA.label = galaxyName;
  const optgroupB = document.createElement('optgroup');
  optgroupB.label = galaxyName;

  meshes.forEach((mesh) => {
    const { beacon } = mesh.userData;
    slugToMesh.set(beacon.slug, mesh);

    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'system-list-item';
    button.textContent = beacon.name;
    button.addEventListener('click', () => interaction.selectBody(mesh));
    li.appendChild(button);
    subitems.appendChild(li);
    listItemsBySlug.set(beacon.slug, button);

    optgroupA.appendChild(new Option(beacon.name, beacon.slug));
    optgroupB.appendChild(new Option(beacon.name, beacon.slug));
  });

  compareSelectA.appendChild(optgroupA);
  compareSelectB.appendChild(optgroupB);
});

// === System list collapse toggle ===
const systemListPanel = document.getElementById('system-list');
const systemListTitle = document.querySelector('.system-list-title');
systemListTitle.addEventListener('click', () => {
  const collapsed = systemListPanel.classList.toggle('is-collapsed');
  systemListTitle.setAttribute('aria-expanded', String(!collapsed));
});

// === Distance-compare panel ===
// Tracks the last two systems selected (3D click or list click) as a
// rolling pair — each new selection becomes Star A and bumps the previous
// Star A down to Star B — plus lets the dropdowns override either slot
// directly. Distance is world-space (accounts for each system's galaxy
// offset) run through DISTANCE_SCALE_LY_PER_UNIT.
const comparePanel = document.getElementById('compare-panel');
const comparePanelTitle = document.querySelector('.compare-panel-title');
const compareDistanceEl = document.querySelector('.compare-distance');
const compareClearBtn = document.querySelector('.compare-clear');

const compareSlots = { a: null, b: null };
const compareWorldPosA = new THREE.Vector3();
const compareWorldPosB = new THREE.Vector3();

// Glowing beam drawn between the two selected stars, world-space so it
// tracks each galaxy's own rotation/offset. Opacity is pulsed per-frame
// in animate() rather than via a shader, matching the pulse already used
// for the spiral galaxy's core glow.
const compareLineGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(), new THREE.Vector3(),
]);
const compareLineMaterial = new THREE.LineBasicMaterial({
  color: 0x4fd8e8,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  depthTest: false,
});
const compareLine = new THREE.Line(compareLineGeometry, compareLineMaterial);
compareLine.visible = false;
// Always drawn on top, after everything else — it's a measurement
// overlay, not a physical object galaxies should occlude.
compareLine.renderOrder = 999;
scene.add(compareLine);

// Ring markers around each selected star, connected by the beam above.
// Sprites rather than in-scene torus geometry so they billboard to the
// camera for free and stay a clean circle from every angle.
const compareRingTexture = makeRingTexture('#4fd8e8');
function makeCompareRing() {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: compareRingTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  }));
  sprite.scale.set(5, 5, 1);
  sprite.visible = false;
  sprite.renderOrder = 999;
  scene.add(sprite);
  return sprite;
}
const compareRingA = makeCompareRing();
const compareRingB = makeCompareRing();

// Distance readout floating above the beam's midpoint — same visibility/
// pulse gate as the line and rings. Text is regenerated only on selection
// change (canvas texture bake isn't cheap); position/opacity track every
// frame alongside the beam since it drifts as galaxies rotate.
const COMPARE_LABEL_HEIGHT = 3.2;
const COMPARE_LABEL_LIFT = 2.4;
const compareDistanceSprite = new THREE.Sprite(new THREE.SpriteMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
}));
compareDistanceSprite.visible = false;
compareDistanceSprite.renderOrder = 999;
scene.add(compareDistanceSprite);

function setCompareDistanceLabel(text) {
  const oldTexture = compareDistanceSprite.material.map;
  const { texture, aspect } = makeLabelTexture(text, '#4fd8e8', { fontSize: 26 });
  compareDistanceSprite.material.map = texture;
  compareDistanceSprite.material.needsUpdate = true;
  compareDistanceSprite.scale.set(COMPARE_LABEL_HEIGHT * aspect, COMPARE_LABEL_HEIGHT, 1);
  if (oldTexture) oldTexture.dispose();
}

// Name tag hovering above each selected star, so both are identifiable on
// the map regardless of the (zoom-gated) system labels above — same
// visibility gate as the rings/beam.
const COMPARE_NAME_HEIGHT = 2;
const COMPARE_NAME_LIFT = 4.2;
function makeCompareNameLabel() {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  }));
  sprite.visible = false;
  sprite.renderOrder = 999;
  scene.add(sprite);
  return sprite;
}
function setCompareNameLabel(sprite, name) {
  const oldTexture = sprite.material.map;
  const { texture, aspect } = makeLabelTexture(name, '#4fd8e8', { fontSize: 26 });
  sprite.material.map = texture;
  sprite.material.needsUpdate = true;
  sprite.scale.set(COMPARE_NAME_HEIGHT * aspect, COMPARE_NAME_HEIGHT, 1);
  if (oldTexture) oldTexture.dispose();
}
const compareNameLabelA = makeCompareNameLabel();
const compareNameLabelB = makeCompareNameLabel();

function updateCompareDistance() {
  if (!compareSlots.a || !compareSlots.b) {
    compareDistanceEl.textContent = 'Seleziona due stelle per calcolare la distanza.';
    compareLine.visible = false;
    compareRingA.visible = false;
    compareRingB.visible = false;
    compareDistanceSprite.visible = false;
    compareNameLabelA.visible = false;
    compareNameLabelB.visible = false;
    return;
  }
  if (compareSlots.a === compareSlots.b) {
    compareDistanceEl.textContent = 'Stessa stella selezionata.';
    compareLine.visible = false;
    compareRingA.visible = false;
    compareRingB.visible = false;
    compareDistanceSprite.visible = false;
    compareNameLabelA.visible = false;
    compareNameLabelB.visible = false;
    return;
  }
  compareSlots.a.getWorldPosition(compareWorldPosA);
  compareSlots.b.getWorldPosition(compareWorldPosB);
  const sceneDistance = compareWorldPosA.distanceTo(compareWorldPosB);
  const lightYears = Math.round(sceneDistance * DISTANCE_SCALE_LY_PER_UNIT);
  const parsecs = Math.round((lightYears / LY_PER_PARSEC) * 10) / 10;
  compareDistanceEl.innerHTML = `
    <span class="compare-distance-ly">≈ ${lightYears.toLocaleString('it-IT')} anni luce</span>
    <span class="compare-distance-pc">≈ ${parsecs.toLocaleString('it-IT')} parsec</span>
  `;
  compareLineGeometry.setFromPoints([compareWorldPosA, compareWorldPosB]);
  compareLine.visible = true;
  compareRingA.position.copy(compareWorldPosA);
  compareRingB.position.copy(compareWorldPosB);
  compareRingA.visible = true;
  compareRingB.visible = true;
  setCompareDistanceLabel(`≈ ${lightYears.toLocaleString('it-IT')} anni luce`);
  compareDistanceSprite.visible = true;
  setCompareNameLabel(compareNameLabelA, compareSlots.a.userData.beacon.name);
  setCompareNameLabel(compareNameLabelB, compareSlots.b.userData.beacon.name);
  compareNameLabelA.visible = true;
  compareNameLabelB.visible = true;
}

function syncCompareSelects() {
  compareSelectA.value = compareSlots.a ? compareSlots.a.userData.beacon.slug : '';
  compareSelectB.value = compareSlots.b ? compareSlots.b.userData.beacon.slug : '';
}

function handleSceneSelect(mesh) {
  if (compareSlots.a === mesh) {
    // Re-clicking the last-selected star clears the comparison — a way to
    // reset it from the map itself, without reaching for the panel button.
    compareSlots.a = null;
    compareSlots.b = null;
  } else {
    compareSlots.b = compareSlots.a;
    compareSlots.a = mesh;
  }
  syncCompareSelects();
  updateCompareDistance();
}

compareSelectA.addEventListener('change', () => {
  compareSlots.a = compareSelectA.value ? slugToMesh.get(compareSelectA.value) : null;
  updateCompareDistance();
});
compareSelectB.addEventListener('change', () => {
  compareSlots.b = compareSelectB.value ? slugToMesh.get(compareSelectB.value) : null;
  updateCompareDistance();
});

compareClearBtn.addEventListener('click', () => {
  compareSlots.a = null;
  compareSlots.b = null;
  syncCompareSelects();
  updateCompareDistance();
});

comparePanelTitle.addEventListener('click', () => {
  const collapsed = comparePanel.classList.toggle('is-collapsed');
  comparePanelTitle.setAttribute('aria-expanded', String(!collapsed));
});

// === Interaction ===
const interaction = createSceneInteraction({
  scene,
  camera,
  controls,
  renderer,
  bodies: beaconMeshes,
  cardEl: document.getElementById('beacon-card'),
  getListItem: (slug) => listItemsBySlug.get(slug),
  homeOffset: HOME_OFFSET,
  onSelect: handleSceneSelect,
});

// === Animation loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  spiralGalaxy.rotation.y += delta * SPIRAL_SPIN;
  ellipticalGalaxy.rotation.y += delta * ELLIPTICAL_SPIN;
  irregularGalaxy.rotation.y += delta * IRREGULAR_SPIN;
  irregularGalaxy.rotation.z = Math.sin(elapsed * 0.15) * 0.05;
  lenticularGalaxy.rotation.y += delta * LENTICULAR_SPIN;
  dwarfGalaxy.rotation.y += delta * DWARF_SPIN;
  ringGalaxy.rotation.y += delta * RING_SPIN;
  peculiarGalaxy.rotation.y += delta * PECULIAR_SPIN;
  milkyWayGalaxy.rotation.y += delta * MILKYWAY_SPIN;
  // Fade/hide decorative background objects the camera has wandered close
  // to, so they never loom in the foreground — same idea as the
  // starfield's per-pixel near-fade, done per-object here since these
  // aren't part of that single Points geometry.
  nebulaSprites.forEach((sprite) => {
    const dist = sprite.position.distanceTo(camera.position);
    sprite.material.opacity = sprite.userData.baseOpacity * THREE.MathUtils.smoothstep(dist, 100, 220);
  });
  backgroundGalaxies.forEach((mini) => {
    mini.rotation.y += delta * 0.01;
    mini.visible = mini.position.distanceTo(camera.position) > 120;
  });
  systemLabelSprites.forEach(({ sprite, group, revealDistance }) => {
    sprite.visible = camera.position.distanceTo(group.position) < revealDistance;
  });
  peculiarGalaxy.rotation.z = Math.sin(elapsed * 0.12) * 0.06;

  const spiralCoreGlow = spiralGalaxy.userData.coreGlow;
  if (spiralCoreGlow) {
    const corePulse = 18 + Math.sin(elapsed * 0.5) * 2;
    spiralCoreGlow.scale.set(corePulse, corePulse, 1);
  }

  updateBlackHoleDisk(delta);

  if (compareLine.visible) {
    // Re-read endpoints each frame — the parent galaxies keep spinning,
    // so a beam set once at selection time would drift off its stars.
    compareSlots.a.getWorldPosition(compareWorldPosA);
    compareSlots.b.getWorldPosition(compareWorldPosB);
    compareLineGeometry.setFromPoints([compareWorldPosA, compareWorldPosB]);
    const pulse = 0.45 + Math.sin(elapsed * 2.2) * 0.35;
    compareLineMaterial.opacity = pulse;
    compareRingA.position.copy(compareWorldPosA);
    compareRingB.position.copy(compareWorldPosB);
    compareRingA.material.opacity = pulse;
    compareRingB.material.opacity = pulse;
    const ringScale = 5 + Math.sin(elapsed * 2.2) * 0.6;
    compareRingA.scale.set(ringScale, ringScale, 1);
    compareRingB.scale.set(ringScale, ringScale, 1);
    compareDistanceSprite.position.lerpVectors(compareWorldPosA, compareWorldPosB, 0.5);
    compareDistanceSprite.position.y += COMPARE_LABEL_LIFT;
    compareDistanceSprite.material.opacity = pulse;
    compareNameLabelA.position.set(compareWorldPosA.x, compareWorldPosA.y + COMPARE_NAME_LIFT, compareWorldPosA.z);
    compareNameLabelB.position.set(compareWorldPosB.x, compareWorldPosB.y + COMPARE_NAME_LIFT, compareWorldPosB.z);
    compareNameLabelA.material.opacity = pulse;
    compareNameLabelB.material.opacity = pulse;
  }

  interaction.update(elapsed);

  controls.update();
  lensSystem.update();
  lensSystem.renderPass();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  const bufferSize = new THREE.Vector2();
  renderer.getDrawingBufferSize(bufferSize);
  lensSystem.setSize(bufferSize.x, bufferSize.y);
});
