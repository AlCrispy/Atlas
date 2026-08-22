import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, makeDotTexture } from './glow-texture.js';
import { makePlanetTexture } from './planet-texture.js';
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
  const material = new THREE.PointsMaterial({ color: 0xffffff, map: makeDotTexture(), size: 0.5, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(geometry, material));
}
buildStarfield();

function colorToRgba(hex, alpha) {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${alpha})`;
}

// Stars glow (they emit light — a sprite reads correctly); planets and
// moons are solid lit spheres so they read as physical bodies rather than
// balls of light, shaded by the light rig below.
function makeStarSprite(color) {
  const texture = makeGlowTexture(colorToRgba(color, 1), colorToRgba(color, 0));
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
}

const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

// A textured body reads as a physical object instead of a flat-shaded
// ball; the procedural map also gives each body its own surface identity
// beyond a single hex color. `spinSpeed` drives axial rotation in the
// animate loop below — real bodies turn, a static sphere doesn't sell scale.
function makeBodyMesh(color, slug, size) {
  const texture = makePlanetTexture(color, slug, size);
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.05 });
  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.userData.spinSpeed = (Math.random() - 0.5) * 0.3;
  return mesh;
}

// A faint outer shell, larger than the body itself, gives bigger planets a
// soft atmospheric fringe (à la Earth's blue limb from orbit) without a
// custom fresnel shader — just a low-opacity tinted sphere.
function maybeAddAtmosphere(mesh, color, size) {
  if (size < 2) return;
  const atmosphere = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, side: THREE.BackSide }),
  );
  atmosphere.scale.setScalar(1.2);
  mesh.add(atmosphere);
}

// Soft fill so the unlit side of a planet isn't pure black, plus one
// directional "sunlight" for a visible lit/shadow terminator. Directional
// and hemisphere lights have no distance falloff, so intensity stays
// consistent for every planet regardless of orbit radius.
scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0e18, 0.9));
const sunLight = new THREE.DirectionalLight(0xfff2d6, 1.3);
sunLight.position.set(40, 60, 30);
scene.add(sunLight);

// A glow sprite's bright core reads much smaller than its nominal scale
// (the texture fades out toward the edge), while a solid mesh sphere fills
// its scale edge-to-edge — these compensate so stars still read as the
// biggest body in the system despite planets switching to solid meshes.
const STAR_RENDER_SCALE = 1.8;
const PLANET_RENDER_SCALE = 0.55;

const bodies = [];
const listItemsBySlug = new Map();

function registerBody(object, size, data) {
  object.scale.set(size, size, size);
  object.userData.baseScale = size;
  object.userData.beacon = {
    name: data.name,
    slug: data.slug,
    eyebrow: data.eyebrow,
    color: data.color,
    exploreHref: data.exploreHref,
    zoomTarget: new THREE.Vector3(0, 0, 0),
    zoomDistance: data.zoomDistance,
  };
  bodies.push(object);
}

// === Stars ===
// A single star stays fixed at the origin; a binary pair orbits their
// common center (see the animation loop below).
const starObjs = system.stars.map((star) => {
  const sprite = makeStarSprite(star.color);
  registerBody(sprite, star.size * STAR_RENDER_SCALE, star);
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

  const sprite = makeBodyMesh(planet.color, planet.slug, planet.size);
  maybeAddAtmosphere(sprite, planet.color, planet.size);
  registerBody(sprite, planet.size * PLANET_RENDER_SCALE, {
    ...planet,
    exploreHref: `planets/${planet.slug}.html`,
  });
  pivot.add(sprite);

  const moonAnchor = new THREE.Group();
  pivot.add(moonAnchor);

  const moonOrbits = planet.moons.map((moon) => {
    const moonSprite = makeBodyMesh(moon.color, moon.slug, moon.size);
    registerBody(moonSprite, moon.size * PLANET_RENDER_SCALE, moon);
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

// === System list collapse toggle ===
const systemListPanel = document.getElementById('system-list');
const systemListTitle = document.querySelector('.system-list-title');
systemListTitle.addEventListener('click', () => {
  const collapsed = systemListPanel.classList.toggle('is-collapsed');
  systemListTitle.setAttribute('aria-expanded', String(!collapsed));
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
  // Planets/moons are solid meshes now, not glow sprites — growing them on
  // hover/select reads as the body itself changing size rather than a UI
  // highlight, so leave scale untouched and rely on the pulsing ring alone.
  hoverMultiplier: 1,
  selectMultiplier: 1,
  // Selecting a body highlights it in place; the camera stays on the
  // whole-system home framing instead of flying in to focus on it.
  zoomOnSelect: false,
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
    sprite.rotation.y = elapsed * sprite.userData.spinSpeed;
    moonAnchor.position.copy(sprite.position);

    moonOrbits.forEach(({ sprite: moonSprite, data: moonData }) => {
      const moonAngle = elapsed * moonData.speed + moonData.phase;
      moonSprite.position.set(Math.cos(moonAngle) * moonData.orbitRadius, 0, Math.sin(moonAngle) * moonData.orbitRadius);
      moonSprite.rotation.y = elapsed * moonSprite.userData.spinSpeed;
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
