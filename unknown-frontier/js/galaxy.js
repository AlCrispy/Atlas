import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, buildSpiralGalaxy, buildEllipticalGalaxy, buildIrregularGalaxy, buildLenticularGalaxy, buildDwarfGalaxy } from './galaxy-shapes.js';

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
const BEACON_HOVER_SCALE = 3.2;

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 160, 300);

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
const SPIRAL_BEACONS = [
  { name: 'Punto sconosciuto', position: [12, 1, -7] },
  { name: 'Punto sconosciuto', position: [-17, -1, 9] },
  { name: 'Punto sconosciuto', position: [21, 2, 13] },
  { name: 'Punto sconosciuto', position: [-9, -1, -20] },
  { name: 'Punto sconosciuto', position: [27, 1, -3] },
];

const ELLIPTICAL_BEACONS = [
  { name: 'Punto sconosciuto', position: [15, 3, 10] },
  { name: 'Punto sconosciuto', position: [-20, -2, 8] },
  { name: 'Punto sconosciuto', position: [8, 4, -22] },
  { name: 'Punto sconosciuto', position: [-12, -3, -15] },
  { name: 'Punto sconosciuto', position: [22, 1, -5] },
];

const IRREGULAR_BEACONS = [
  { name: 'Punto sconosciuto', position: [10, 2, 8] },
  { name: 'Punto sconosciuto', position: [-15, -1, -10] },
  { name: 'Punto sconosciuto', position: [18, -2, -5] },
  { name: 'Punto sconosciuto', position: [-8, 3, 15] },
  { name: 'Punto sconosciuto', position: [5, -3, -18] },
];

const LENTICULAR_BEACONS = [
  { name: 'Punto sconosciuto', position: [10, 1, -5] },
  { name: 'Punto sconosciuto', position: [-14, 0, 7] },
  { name: 'Punto sconosciuto', position: [16, 1, 10] },
  { name: 'Punto sconosciuto', position: [-7, 0, -15] },
  { name: 'Punto sconosciuto', position: [20, 1, -2] },
];

const DWARF_BEACONS = [
  { name: 'Punto sconosciuto', position: [6, 1, 4] },
  { name: 'Punto sconosciuto', position: [-8, 0, -5] },
  { name: 'Punto sconosciuto', position: [4, -1, -9] },
  { name: 'Punto sconosciuto', position: [-5, 1, 7] },
  { name: 'Punto sconosciuto', position: [9, 0, -2] },
];

const beaconTexture = makeGlowTexture('rgba(138,106,232,1)', 'rgba(138,106,232,0)');

function addBeaconSprites(beaconList, parentGroup, targetArray) {
  beaconList.forEach((beacon) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: beaconTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    sprite.scale.set(BEACON_SCALE, BEACON_SCALE, 1);
    sprite.position.set(...beacon.position);
    sprite.userData.beacon = beacon;
    parentGroup.add(sprite);
    targetArray.push(sprite);
  });
}

const beaconMeshes = [];
addBeaconSprites(SPIRAL_BEACONS, spiralGalaxy, beaconMeshes);
addBeaconSprites(ELLIPTICAL_BEACONS, ellipticalGalaxy, beaconMeshes);
addBeaconSprites(IRREGULAR_BEACONS, irregularGalaxy, beaconMeshes);
addBeaconSprites(LENTICULAR_BEACONS, lenticularGalaxy, beaconMeshes);
addBeaconSprites(DWARF_BEACONS, dwarfGalaxy, beaconMeshes);

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
  group.add(hitSprite);

  scene.add(group);

  return { disk, hitSprite };
}

const { disk: blackHoleDisk, hitSprite: blackHoleHitSprite } = buildBlackHole();
blackHoleHitSprite.userData.beacon = { name: 'Buco Nero', position: [0, 0, 0] };
beaconMeshes.push(blackHoleHitSprite);

// === Interaction ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const beaconCard = document.getElementById('beacon-card');
const beaconCardTitle = beaconCard.querySelector('.beacon-card-title');
const beaconCardClose = beaconCard.querySelector('.beacon-card-close');

function showBeaconCard(beacon) {
  beaconCardTitle.textContent = beacon.name;
  beaconCard.classList.add('is-visible');
}

function hideBeaconCard() {
  beaconCard.classList.remove('is-visible');
}

beaconCardClose.addEventListener('click', hideBeaconCard);

// A click that follows a camera drag (OrbitControls) should not open the
// beacon card: track the pointer-down position and only treat the click
// as a real beacon click if the pointer barely moved before release.
const CLICK_DRAG_THRESHOLD = 5;
let pointerDownPosition = null;

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerDownPosition = { x: event.clientX, y: event.clientY };
});

// Hover feedback: swap the cursor to pointer and grow the beacon's glow
// when a beacon sprite sits under the pointer, so beacons read as clickable.
let hoveredBeacon = null;

renderer.domElement.addEventListener('pointermove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(beaconMeshes);
  const hit = hits.length > 0 ? hits[0].object : null;

  if (hit !== hoveredBeacon) {
    if (hoveredBeacon) {
      hoveredBeacon.scale.set(BEACON_SCALE, BEACON_SCALE, 1);
    }
    if (hit) {
      hit.scale.set(BEACON_HOVER_SCALE, BEACON_HOVER_SCALE, 1);
    }
    hoveredBeacon = hit;
    renderer.domElement.style.cursor = hit ? 'pointer' : '';
  }
});

renderer.domElement.addEventListener('click', (event) => {
  if (pointerDownPosition) {
    const dx = event.clientX - pointerDownPosition.x;
    const dy = event.clientY - pointerDownPosition.y;
    const dragDistance = Math.hypot(dx, dy);
    if (dragDistance >= CLICK_DRAG_THRESHOLD) {
      return;
    }
  }

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(beaconMeshes);
  if (hits.length > 0) {
    showBeaconCard(hits[0].object.userData.beacon);
  }
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

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
