import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLANETS = [
  { name: 'Mercurio', color: 0x9c9c9c, size: 0.28, distance: 6,    speed: 1.60 },
  { name: 'Venere',   color: 0xe8c07d, size: 0.45, distance: 8,    speed: 1.20 },
  { name: 'Terra',    color: 0x4f8ee8, size: 0.48, distance: 10.5, speed: 1.00 },
  { name: 'Marte',    color: 0xd1603d, size: 0.35, distance: 13,   speed: 0.80 },
  { name: 'Giove',    color: 0xd8a878, size: 1.30, distance: 17,   speed: 0.45 },
  { name: 'Saturno',  color: 0xe8d19a, size: 1.10, distance: 21,   speed: 0.32, ring: true },
  { name: 'Urano',    color: 0x9fe0e8, size: 0.75, distance: 25,   speed: 0.22 },
  { name: 'Nettuno',  color: 0x5f7ce8, size: 0.72, distance: 28,   speed: 0.16 },
];

const container = document.getElementById('solar-system');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
camera.position.set(0, 20, 36);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 10;
controls.maxDistance = 90;

scene.add(new THREE.AmbientLight(0x445577, 0.5));
const sunLight = new THREE.PointLight(0xfff2cc, 3.5, 300);
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc55 })
);
scene.add(sun);

const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4fd8e8, transparent: true, opacity: 0.18 });
function addOrbitLine(distance) {
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * distance, 0, Math.sin(a) * distance));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  scene.add(new THREE.Line(geometry, orbitMaterial));
}

const planetMeshes = PLANETS.map((planet) => {
  addOrbitLine(planet.distance);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(planet.size, 24, 24),
    new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.8, metalness: 0.1 })
  );
  mesh.position.x = planet.distance;
  scene.add(mesh);

  if (planet.ring) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.2, 48),
      new THREE.MeshBasicMaterial({ color: 0xe8d19a, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2.4;
    mesh.add(ring);
  }

  return { mesh, angle: Math.random() * Math.PI * 2, ...planet };
});

function starField() {
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 80 + Math.random() * 120;
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
starField();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  sun.rotation.y += delta * 0.1;

  for (const planet of planetMeshes) {
    planet.angle += delta * planet.speed * 0.3;
    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    planet.mesh.rotation.y += delta * 0.6;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
