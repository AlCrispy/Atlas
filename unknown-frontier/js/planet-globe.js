import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Reusable close-up planet viewer for the "Visione Dettagliata" tab on
// inhabited-planet pages. Texture URL and points of interest come from
// data attributes on the `.globe-viewport` container (`data-texture`,
// `data-pois` as JSON) so a new planet page needs zero JS changes here —
// copy the markup, edit the data attributes.

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Small cyan ring-dot billboard, drawn on a canvas rather than shipped as an
// image asset — consistent with the rest of the site's procedural-texture approach.
function makeMarkerTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = '#4fd8e8';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(79,216,232,0.55)';
  ctx.lineWidth = 3;
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

function initGlobe(container) {
  const pois = JSON.parse(container.dataset.pois || '[]');
  const textureUrl = container.dataset.texture;
  const card = container.querySelector('.poi-card');
  const cardTitle = card.querySelector('.poi-card-title');
  const cardDesc = card.querySelector('.poi-card-desc');
  const cardClose = card.querySelector('.poi-card-close');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.insertBefore(renderer.domElement, card);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.8;
  controls.maxDistance = 8;
  controls.rotateSpeed = 0.5;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0e18, 0.9));
  const sunLight = new THREE.DirectionalLight(0xfff2d6, 1.4);
  sunLight.position.set(4, 3, 5);
  scene.add(sunLight);

  const globe = new THREE.Group();
  scene.add(globe);

  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, metalness: 0.05 }),
  );
  globe.add(sphere);

  // Thin tinted shell for an atmospheric limb, same trick as the system-wide
  // mini spheres in solar-system.js.
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x4fd8e8, transparent: true, opacity: 0.12, side: THREE.BackSide }),
  );
  atmosphere.scale.setScalar(1.03);
  globe.add(atmosphere);

  const markerTexture = makeMarkerTexture();
  const markers = pois.map((poi) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTexture, transparent: true, depthTest: false }));
    sprite.scale.setScalar(0.16);
    sprite.position.copy(latLonToVector3(poi.lat, poi.lon, 1.05));
    sprite.userData.poi = poi;
    globe.add(sprite);
    return sprite;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(markers);
    if (hits.length) {
      const poi = hits[0].object.userData.poi;
      cardTitle.textContent = poi.name;
      cardDesc.textContent = poi.desc;
      card.classList.add('is-visible');
    }
  });

  cardClose.addEventListener('click', () => card.classList.remove('is-visible'));

  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += clock.getDelta() * 0.03;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Lazy-init: a WebGL context is only spun up once its tab is actually
// opened, not on page load (the globe sits behind five other tabs).
document.querySelectorAll('.globe-viewport').forEach((container) => {
  let started = false;
  function tryInit() {
    if (started) return;
    if (container.closest('.tab-panel')?.classList.contains('active')) {
      started = true;
      initGlobe(container);
    }
  }
  tryInit();
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => setTimeout(tryInit, 0));
  });
});
