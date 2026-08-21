import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// === Tunables ===
const GALAXY_SPIN = 0.015;
const ARM_COUNT = 3;
const DISC_RADIUS = 60;
const DISC_PARTICLE_COUNT = 5000;
const NEBULA_PARTICLE_COUNT = 1200;
const STARFIELD_COUNT = 2000;

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 45, 95);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 20;
controls.maxDistance = 220;

// === Starfield ===
function buildStarfield() {
  const count = STARFIELD_COUNT;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 150 + Math.random() * 200;
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

// === Disc ===
function buildSpiralDisc() {
  const count = DISC_PARTICLE_COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const coreColor = new THREE.Color(0x9df0fa);
  const armColor = new THREE.Color(0x4fd8e8);
  const armTightness = 0.55;

  for (let i = 0; i < count; i++) {
    const arm = i % ARM_COUNT;
    const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
    const t = Math.random();
    const radius = t * DISC_RADIUS;
    const spiralAngle = armAngleOffset + radius * armTightness + (Math.random() - 0.5) * 0.5;
    const height = (Math.random() - 0.5) * 2 * (1 - t) * 3;

    positions[i * 3] = Math.cos(spiralAngle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(spiralAngle) * radius;

    const color = coreColor.clone().lerp(armColor, t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
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

  const disc = new THREE.Points(geometry, material);
  scene.add(disc);
  return disc;
}
const galaxyDisc = buildSpiralDisc();

// === Glow texture helper ===
function makeGlowTexture(innerColor, outerColor, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// === Core glow ===
const coreGlowTexture = makeGlowTexture('rgba(157,240,250,0.9)', 'rgba(157,240,250,0)');
const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: coreGlowTexture,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
coreGlow.scale.set(18, 18, 1);
scene.add(coreGlow);

// === Nebula wisps ===
const nebulaTexture = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');

function buildNebulaWisps() {
  const count = NEBULA_PARTICLE_COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const nebulaColor = new THREE.Color(0x8a6ae8);
  const armTightness = 0.55;

  for (let i = 0; i < count; i++) {
    const arm = i % ARM_COUNT;
    const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
    const t = Math.random();
    const radius = t * DISC_RADIUS * 0.9;
    const spiralAngle = armAngleOffset + radius * armTightness + (Math.random() - 0.5) * 0.9;
    const height = (Math.random() - 0.5) * 4;

    positions[i * 3] = Math.cos(spiralAngle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(spiralAngle) * radius;

    colors[i * 3] = nebulaColor.r;
    colors[i * 3 + 1] = nebulaColor.g;
    colors[i * 3 + 2] = nebulaColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    map: nebulaTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const wisps = new THREE.Points(geometry, material);
  scene.add(wisps);
  return wisps;
}
const nebulaWisps = buildNebulaWisps();

// === Beacons (Task 5) ===

// === Animation loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  galaxyDisc.rotation.y += delta * GALAXY_SPIN;
  const corePulse = 18 + Math.sin(elapsed * 0.5) * 2;
  coreGlow.scale.set(corePulse, corePulse, 1);

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
