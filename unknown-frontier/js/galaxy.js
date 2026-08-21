import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, buildSpiralGalaxy, buildEllipticalGalaxy, buildIrregularGalaxy, buildLenticularGalaxy, buildDwarfGalaxy } from './galaxy-shapes.js';
import { createSceneInteraction } from './scene-interaction.js';

// === Tunables ===
const STARFIELD_COUNT = 1500;
const TRIANGLE_SIDE = 200;
const TRIANGLE_RADIUS = TRIANGLE_SIDE / Math.sqrt(3);
const SPIRAL_SPIN = 0.015;
const ELLIPTICAL_SPIN = 0.006;
const IRREGULAR_SPIN = 0.01;
const BLACKHOLE_DISK_SPIN = 0.08;
const LENTICULAR_SPIN = 0.008;
const DWARF_SPIN = 0.02;

const BEACON_SCALE = 2.5;

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
function buildStarfield() {
  const count = STARFIELD_COUNT;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 250 + Math.random() * 250;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.7 });
  scene.add(new THREE.Points(geometry, material));
}
buildStarfield();

// === Triangle layout ===
function triangleVertex(index) {
  const angle = Math.PI / 2 + (index * 2 * Math.PI) / 3;
  return [Math.cos(angle) * TRIANGLE_RADIUS, 0, Math.sin(angle) * TRIANGLE_RADIUS];
}

// === Galaxies ===
const spiralGalaxy = buildSpiralGalaxy({
  position: triangleVertex(0),
  discParticleCount: 3000,
  nebulaParticleCount: 800,
  radius: 40,
});
scene.add(spiralGalaxy);

const ellipticalGalaxy = buildEllipticalGalaxy({
  position: triangleVertex(1),
  particleCount: 2500,
  radius: 35,
});
scene.add(ellipticalGalaxy);

const irregularGalaxy = buildIrregularGalaxy({
  position: triangleVertex(2),
  particleCount: 2000,
  radius: 30,
});
scene.add(irregularGalaxy);

// Above/below the black hole, off the triangle's plane, with asymmetric
// jitter so the pair doesn't read as a mirrored, mechanically-placed set.
const lenticularGalaxy = buildLenticularGalaxy({
  position: [18, 95, -12],
  particleCount: 1800,
  radius: 25,
});
scene.add(lenticularGalaxy);

const dwarfGalaxy = buildDwarfGalaxy({
  position: [-14, -90, 20],
  particleCount: 1200,
  radius: 14,
});
scene.add(dwarfGalaxy);

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

// === Black hole ===
function buildBlackHole() {
  const group = new THREE.Group();

  const eventHorizon = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  group.add(eventHorizon);

  const glowTexture = makeGlowTexture('rgba(180,150,255,0.5)', 'rgba(180,150,255,0)');
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  glow.scale.set(14, 14, 1);
  group.add(glow);

  const diskTexture = makeGlowTexture('rgba(255,200,140,1)', 'rgba(255,200,140,0)');
  const diskParticleCount = 500;
  const diskPositions = new Float32Array(diskParticleCount * 3);
  const diskColors = new Float32Array(diskParticleCount * 3);
  const innerColor = new THREE.Color(0xffe8c8);
  const outerColor = new THREE.Color(0xff9a4f);

  for (let i = 0; i < diskParticleCount; i++) {
    const t = Math.random();
    const r = 6 + t * 8;
    const angle = Math.random() * Math.PI * 2;

    diskPositions[i * 3] = Math.cos(angle) * r;
    diskPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    diskPositions[i * 3 + 2] = Math.sin(angle) * r;

    const color = innerColor.clone().lerp(outerColor, t);
    diskColors[i * 3] = color.r;
    diskColors[i * 3 + 1] = color.g;
    diskColors[i * 3 + 2] = color.b;
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

  return { disk, hitSprite };
}

const { disk: blackHoleDisk, hitSprite: blackHoleHitSprite } = buildBlackHole();
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

// === System list panel ===
// Built from the same beaconMeshes used for raycasting, grouped by galaxy
// in scene order, so names/slugs/grouping never drift out of sync with
// the 3D scene.
const systemListItems = document.querySelector('.system-list-items');
const listItemsBySlug = new Map();

const galaxyGroups = new Map();
beaconMeshes.forEach((mesh) => {
  const galaxyName = mesh.userData.beacon.galaxy;
  if (!galaxyGroups.has(galaxyName)) galaxyGroups.set(galaxyName, []);
  galaxyGroups.get(galaxyName).push(mesh);
});

galaxyGroups.forEach((meshes, galaxyName) => {
  const heading = document.createElement('li');
  heading.className = 'system-list-group';
  heading.textContent = galaxyName;
  systemListItems.appendChild(heading);

  meshes.forEach((mesh) => {
    const { beacon } = mesh.userData;
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'system-list-item';
    button.textContent = beacon.name;
    button.addEventListener('click', () => interaction.selectBody(mesh));
    li.appendChild(button);
    systemListItems.appendChild(li);
    listItemsBySlug.set(beacon.slug, button);
  });
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

  const spiralCoreGlow = spiralGalaxy.userData.coreGlow;
  if (spiralCoreGlow) {
    const corePulse = 18 + Math.sin(elapsed * 0.5) * 2;
    spiralCoreGlow.scale.set(corePulse, corePulse, 1);
  }

  blackHoleDisk.rotation.y += delta * BLACKHOLE_DISK_SPIN;

  interaction.update(elapsed);

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
