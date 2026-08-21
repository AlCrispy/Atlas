import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture } from './glow-texture.js';
import { buildOrbitRing } from './solar-system-shapes.js';
import { createSceneInteraction } from './scene-interaction.js';
import { SOLAR_SYSTEMS } from './solar-system-data.js';

const HOME_OFFSET = new THREE.Vector3(0, 35, 70);
const STARFIELD_COUNT = 600;

const container = document.getElementById('solar-system');
const system = SOLAR_SYSTEMS[document.body.dataset.systemSlug];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.copy(HOME_OFFSET);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 5;
controls.maxDistance = 220;

// === Starfield ===
function buildStarfield() {
  const positions = new Float32Array(STARFIELD_COUNT * 3);
  for (let i = 0; i < STARFIELD_COUNT; i++) {
    const r = 150 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(geometry, material));
}
buildStarfield();

function colorToRgba(hex, alpha) {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${alpha})`;
}

function makeBodySprite(color) {
  const texture = makeGlowTexture(colorToRgba(color, 1), colorToRgba(color, 0));
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
}

const bodies = [];
const listItemsBySlug = new Map();

function registerBody(sprite, size, data) {
  sprite.scale.set(size, size, 1);
  sprite.userData.baseScale = size;
  sprite.userData.beacon = {
    name: data.name,
    slug: data.slug,
    eyebrow: data.eyebrow,
    exploreHref: data.exploreHref,
    zoomTarget: new THREE.Vector3(0, 0, 0),
    zoomDistance: data.zoomDistance,
  };
  bodies.push(sprite);
}

// === Stars ===
// A single star stays fixed at the origin; a binary pair orbits their
// common center (see the animation loop below).
const starObjs = system.stars.map((star) => {
  const sprite = makeBodySprite(star.color);
  registerBody(sprite, star.size, star);
  scene.add(sprite);
  return { sprite, data: star };
});

// === Planets & moons ===
// Each planet gets its own pivot group tilted by its inclination, holding
// both the orbit ring and the planet sprite so they always stay in sync.
// Moons orbit a "moon anchor" that tracks the planet's position each frame
// (not the planet sprite itself, whose scale animates on hover/select and
// would otherwise drag the moons' orbit radius along with it).
const planetOrbits = system.planets.map((planet) => {
  const semiMinor = planet.orbitRadius * Math.sqrt(1 - planet.eccentricity * planet.eccentricity);

  const pivot = new THREE.Group();
  pivot.rotation.x = planet.inclination;
  scene.add(pivot);

  const ring = buildOrbitRing({ radiusX: planet.orbitRadius, radiusZ: semiMinor, color: planet.color });
  pivot.add(ring);

  const sprite = makeBodySprite(planet.color);
  registerBody(sprite, planet.size, {
    ...planet,
    exploreHref: `planets/${planet.slug}.html`,
  });
  pivot.add(sprite);

  const moonAnchor = new THREE.Group();
  pivot.add(moonAnchor);

  const moonOrbits = planet.moons.map((moon) => {
    const moonSprite = makeBodySprite(moon.color);
    registerBody(moonSprite, moon.size, moon);
    moonAnchor.add(moonSprite);
    return { sprite: moonSprite, data: moon };
  });

  return { pivot, sprite, moonAnchor, data: planet, semiMinor, moonOrbits };
});

// === System list panel ===
const systemListItems = document.querySelector('.system-list-items');

function addListHeading(text) {
  const heading = document.createElement('li');
  heading.className = 'system-list-group';
  heading.textContent = text;
  systemListItems.appendChild(heading);
}

function addListItem(data, mesh, isMoon) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = isMoon ? 'system-list-item system-list-item--moon' : 'system-list-item';
  button.textContent = data.name;
  button.addEventListener('click', () => interaction.selectBody(mesh));
  li.appendChild(button);
  systemListItems.appendChild(li);
  listItemsBySlug.set(data.slug, button);
}

addListHeading(starObjs.length > 1 ? 'Stelle' : 'Stella');
starObjs.forEach(({ sprite, data }) => addListItem(data, sprite, false));

addListHeading('Pianeti');
planetOrbits.forEach(({ sprite, data, moonOrbits }) => {
  addListItem(data, sprite, false);
  moonOrbits.forEach(({ sprite: moonSprite, data: moonData }) => addListItem(moonData, moonSprite, true));
});

// === Interaction ===
const interaction = createSceneInteraction({
  scene,
  camera,
  controls,
  renderer,
  bodies,
  cardEl: document.getElementById('beacon-card'),
  getListItem: (slug) => listItemsBySlug.get(slug),
  homeOffset: HOME_OFFSET,
  ringScale: 2.2,
});

// === Animation loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  if (starObjs.length > 1) {
    starObjs.forEach(({ sprite, data }) => {
      const angle = elapsed * data.speed + (data.phaseOffset || 0);
      sprite.position.set(Math.cos(angle) * data.orbitRadius, 0, Math.sin(angle) * data.orbitRadius);
    });
  }

  planetOrbits.forEach(({ sprite, moonAnchor, data, semiMinor, moonOrbits }) => {
    const angle = elapsed * data.speed + data.phase;
    sprite.position.set(Math.cos(angle) * data.orbitRadius, 0, Math.sin(angle) * semiMinor);
    moonAnchor.position.copy(sprite.position);

    moonOrbits.forEach(({ sprite: moonSprite, data: moonData }) => {
      const moonAngle = elapsed * moonData.speed + moonData.phase;
      moonSprite.position.set(Math.cos(moonAngle) * moonData.orbitRadius, 0, Math.sin(moonAngle) * moonData.orbitRadius);
    });
  });

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
