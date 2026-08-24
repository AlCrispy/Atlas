import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeGlowTexture, makeDotTexture } from './glow-texture.js';
import { STAR_TYPES } from './star-types.js';
import { PLANET_TYPES } from './planet-types.js';
import { makePlanetTexture } from './planet-texture.js';
import { buildOrbitRing, buildPlanetRing, buildDysonSphere } from './solar-system-shapes.js';
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

// Real photo textures for the Sol-system bodies that have one available —
// same CDN sources as the "Visione Dettagliata" close-up globe (see
// planet-globe.js and each real planet's detail page). Every other slug
// (moons, every fictional-system planet) keeps the procedural
// makePlanetTexture look below, since there's no real photo for a made-up
// world.
const REAL_PLANET_TEXTURES = {
  mercurio: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/mercurymap.jpg',
  venere: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusmap.jpg',
  terra: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg',
  marte: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsmap1k.jpg',
  giove: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/jupitermap.jpg',
  saturno: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnmap.jpg',
  urano: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/uranusmap.jpg',
  nettuno: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/neptunemap.jpg',
};
const REAL_RING_TEXTURES = {
  saturno: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnringcolor.jpg',
  urano: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/uranusringcolour.jpg',
};

// A textured body reads as a physical object instead of a flat-shaded
// ball; the procedural map also gives each body its own surface identity
// beyond a single hex color. `spinSpeed` drives axial rotation in the
// animate loop below — real bodies turn, a static sphere doesn't sell scale.
function makeBodyMesh(color, slug, size, type) {
  const realTextureUrl = REAL_PLANET_TEXTURES[slug];
  let texture;
  if (realTextureUrl) {
    texture = new THREE.TextureLoader().load(realTextureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture = makePlanetTexture(color, slug, size, type);
  }
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.05 });
  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.userData.spinSpeed = (Math.random() - 0.5) * 0.3;
  return mesh;
}

// Same "remap ring UV to radial distance" trick as planet-globe.js's ring
// support, for the two real ringed planets with a real ring photo.
function buildTexturedRing({ innerRadius, outerRadius, textureUrl, tiltX = 0, tiltZ = 0 }) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 96, 1);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    uv.setXY(i, (v3.length() - innerRadius) / (outerRadius - innerRadius), 1);
  }
  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, roughness: 0.9, metalness: 0 }),
  );
  mesh.rotation.x = -Math.PI / 2 + tiltX;
  mesh.rotation.z = tiltZ;
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

// How far a ring's inner edge sits from the planet's visual surface, and
// (when there's no moon to stop at) how far the outer edge reaches — both
// as multiples of the planet's rendered radius.
const RING_INNER_GAP = 1.4;
const RING_OUTER_REACH = 2.6;
// Fraction of the nearest moon's orbit radius kept clear when a ring's
// outer edge would otherwise run into it.
const RING_MOON_CLEARANCE = 0.82;

// Deterministic pseudo-random float in [0, 1) seeded by a string, so a
// planet's ring tilt is stable across reloads instead of reshuffling.
function seededRandom(seed, salt) {
  let hash = 0;
  const str = `${seed}:${salt}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return ((hash >>> 0) % 10000) / 10000;
}

// Real rings sit on a planet's equator, not its orbital plane — Uranus's
// are tilted ~98°. Each ringed planet gets its own fixed-but-varied skew
// instead of every ring reading as the same flat disc.
function ringTiltFor(slug) {
  return {
    tiltX: (seededRandom(slug, 'x') - 0.5) * 1.1,
    tiltZ: (seededRandom(slug, 'z') - 0.5) * 0.9,
  };
}

// Returns null (no ring drawn) if a planet's nearest moon orbits too close
// to leave any room — collision avoidance by simply not rendering rather
// than overlapping.
function computeRingBounds(planet, visualRadius) {
  const innerRadius = visualRadius * RING_INNER_GAP;
  const nearestMoonRadius = planet.moons.length
    ? Math.min(...planet.moons.map((moon) => moon.orbitRadius))
    : null;
  const outerRadius = nearestMoonRadius !== null
    ? nearestMoonRadius * RING_MOON_CLEARANCE
    : visualRadius * RING_OUTER_REACH;
  if (outerRadius <= innerRadius * 1.15) return null;
  return { innerRadius, outerRadius };
}

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
    note: data.note,
    zoomTarget: new THREE.Vector3(0, 0, 0),
    zoomDistance: data.zoomDistance,
  };
  bodies.push(object);
}

// === Stars ===
// A single star stays fixed at the origin; a binary pair orbits their
// common center (see the animation loop below). Computed ahead of the
// star loop (rather than alongside the Dyson sphere mesh below) so the
// affected star's info card can mention the megastructure too.
const dysonStarSlug = system.slug === 'sistema-solare' ? 'sole' : null;
const starObjs = system.stars.map((star) => {
  const sprite = makeStarSprite(star.color);
  const typeInfo = STAR_TYPES[star.type];
  registerBody(sprite, star.size * STAR_RENDER_SCALE, {
    ...star,
    eyebrow: typeInfo ? `${star.eyebrow} · ${typeInfo.label}` : star.eyebrow,
    note: star.slug === dysonStarSlug ? 'Sfera di Dyson' : undefined,
  });
  scene.add(sprite);
  return { sprite, data: star };
});

// === Dyson sphere ===
// A single fictional megastructure, only around Sole in the real solar
// system — kept well inside Mercurio's orbit (5.2) so it doesn't engulf
// any planet. Sole is a lone (non-binary) star fixed at the origin, so a
// static position is safe here.
const DYSON_SPIN = 0.03;
let dysonSphere = null;
if (dysonStarSlug) {
  const sole = system.stars.find((star) => star.slug === dysonStarSlug);
  if (sole) {
    dysonSphere = buildDysonSphere({ radius: 4.2, color: sole.color });
    scene.add(dysonSphere);
  }
}

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

  const sprite = makeBodyMesh(planet.color, planet.slug, planet.size, planet.type);
  maybeAddAtmosphere(sprite, planet.color, planet.size);
  const planetTypeInfo = PLANET_TYPES[planet.type];
  registerBody(sprite, planet.size * PLANET_RENDER_SCALE, {
    ...planet,
    eyebrow: planetTypeInfo ? `${planet.eyebrow} · ${planetTypeInfo.label}` : planet.eyebrow,
    exploreHref: `planets/${planet.slug}.html`,
  });
  pivot.add(sprite);

  const moonAnchor = new THREE.Group();
  pivot.add(moonAnchor);

  if (planet.rings) {
    const bounds = computeRingBounds(planet, planet.size * PLANET_RENDER_SCALE);
    if (bounds) {
      const realRingUrl = REAL_RING_TEXTURES[planet.slug];
      const ringMesh = realRingUrl
        ? buildTexturedRing({ ...bounds, textureUrl: realRingUrl, ...ringTiltFor(planet.slug) })
        : buildPlanetRing({ ...bounds, ...ringTiltFor(planet.slug), color: planet.ringColor || planet.color });
      moonAnchor.add(ringMesh);
    }
  }

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

  if (dysonSphere) {
    dysonSphere.rotation.y = elapsed * DYSON_SPIN;
  }

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
