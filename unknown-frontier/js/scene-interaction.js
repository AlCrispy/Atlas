import * as THREE from 'three';
import { makeGlowTexture } from './glow-texture.js';

// Shared 3D-scene interaction: hover grow, click-to-select (persistent
// enlarge + pulsing ring + camera fly-in), the info card, and wiring to an
// externally-built list panel. Used by both the galaxy overview and each
// solar system view so hover/select/card/camera behavior never drifts
// between the two scenes.
//
// Every raycastable body must carry `mesh.userData.baseScale` (its
// at-rest sprite scale — bodies of very different sizes, like a star vs a
// moon, each keep their own proportions) and `mesh.userData.beacon` with
// at least `{ name, slug, eyebrow, zoomTarget: THREE.Vector3, zoomDistance }`.
// `beacon.exploreHref`, if present, shows the card's "Esplora" link;
// otherwise the link is hidden (used for bodies with no detail page yet).
export function createSceneInteraction(opts) {
  const {
    scene,
    camera,
    controls,
    renderer,
    bodies,
    cardEl,
    getListItem,
    homeOffset,
    hoverMultiplier = 1.28,
    selectMultiplier = 1.52,
    ringSizeMultiplier = 2.8,
    defaultRingColor = '#9df0fa',
    // Moons use pale bone/grey tones for their own color, which makes a
    // same-color (or even a tinted) selection ring hard to pick out against
    // the scene — force plain white and a bigger ring than other bodies get.
    moonRingColor = '#ffffff',
    moonRingSizeMultiplier = 4.5,
    clickDragThreshold = 5,
    // The galaxy overview flies the camera in on the selected system's own
    // zoomTarget/zoomDistance. A solar system view sets this false so
    // selecting a body highlights it in place instead of reframing the
    // camera around it — the whole system stays in view.
    zoomOnSelect = true,
    // Fired with the selected mesh whenever selectBody runs, regardless of
    // whether the click came from the 3D scene or the list panel — lets a
    // caller (e.g. the distance-compare panel) observe every selection
    // without duplicating click-routing logic.
    onSelect = null,
  } = opts;

  const cardEyebrowEl = cardEl.querySelector('.beacon-card-eyebrow');
  const cardTitleEl = cardEl.querySelector('.beacon-card-title');
  const cardNoteEl = cardEl.querySelector('.beacon-card-note');
  const cardLinkEl = cardEl.querySelector('.beacon-card-link');
  const cardCloseEl = cardEl.querySelector('.beacon-card-close');

  const homeDirection = homeOffset.clone().normalize();
  const homeDistance = homeOffset.length();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Size and color are set per selection (see selectBody) so the ring
  // always matches the selected body — proportional to its own base scale
  // and tinted with its own color, rather than one fixed halo for everyone.
  const selectionRing = new THREE.Sprite(new THREE.SpriteMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  }));
  scene.add(selectionRing);
  const ringWorldPos = new THREE.Vector3();
  let ringBaseSize = 1;

  let hoveredBody = null;
  let selectedBody = null;
  let selectedListItem = null;
  let cameraAnim = null;

  // Keeps the camera locked onto the selected body after the fly-in
  // animation ends, so a system doesn't drift out of view as its galaxy
  // slowly orbits the black hole. followTargetActive is false for the
  // first frame after any new fly-in (see flyTo) so that frame only
  // records a baseline instead of applying a delta against a stale
  // (possibly unrelated) previous body's position.
  const followWorldPos = new THREE.Vector3();
  const followDelta = new THREE.Vector3();
  let followTargetActive = false;

  function showCard(beacon) {
    cardEyebrowEl.textContent = beacon.eyebrow;
    cardTitleEl.textContent = beacon.name;
    if (cardNoteEl) {
      cardNoteEl.textContent = beacon.note || '';
      cardNoteEl.style.display = beacon.note ? '' : 'none';
    }
    if (beacon.exploreHref) {
      cardLinkEl.href = beacon.exploreHref;
      cardLinkEl.style.display = '';
    } else {
      cardLinkEl.style.display = 'none';
    }
    cardEl.classList.add('is-visible');
  }

  function flyTo(targetPosition, distance, duration = 900) {
    const toPosition = targetPosition.clone().add(homeDirection.clone().multiplyScalar(distance));
    cameraAnim = {
      fromPosition: camera.position.clone(),
      toPosition,
      fromTarget: controls.target.clone(),
      toTarget: targetPosition.clone(),
      start: performance.now(),
      duration,
    };
    // Invalidates any in-progress follow tracking from a previous
    // selection — the next post-animation frame should record a fresh
    // baseline rather than diff against a stale/unrelated position.
    followTargetActive = false;
    controls.enabled = false;
  }

  function selectBody(mesh) {
    if (selectedBody && selectedBody !== mesh) {
      const prevBase = selectedBody.userData.baseScale;
      const prevScale = selectedBody === hoveredBody ? prevBase * hoverMultiplier : prevBase;
      selectedBody.scale.set(prevScale, prevScale, prevScale);
    }
    selectedBody = mesh;
    const selectScale = mesh.userData.baseScale * selectMultiplier;
    mesh.scale.set(selectScale, selectScale, selectScale);

    if (selectedListItem) selectedListItem.classList.remove('is-active');
    const item = getListItem(mesh.userData.beacon.slug) || null;
    if (item) {
      item.classList.add('is-active');
      item.scrollIntoView({ block: 'nearest' });
    }
    selectedListItem = item;
    const isMoon = mesh.userData.beacon.eyebrow === 'Satellite';
    const ringColor = isMoon ? moonRingColor : (mesh.userData.beacon.color || defaultRingColor);
    // Body colors in the data aren't always hex (a few are `hsl(...)`) — go
    // through THREE.Color instead of string-concatenating an alpha suffix,
    // which only produces a valid CSS color for hex input and silently
    // throws (aborting the rest of this function, including showCard) for
    // anything else.
    const transparentRingColor = new THREE.Color(ringColor);
    const transparentRingColorCss = `rgba(${Math.round(transparentRingColor.r * 255)}, ${Math.round(transparentRingColor.g * 255)}, ${Math.round(transparentRingColor.b * 255)}, 0)`;
    selectionRing.material.map = makeGlowTexture(ringColor, transparentRingColorCss);
    selectionRing.material.needsUpdate = true;
    ringBaseSize = mesh.userData.baseScale * (isMoon ? moonRingSizeMultiplier : ringSizeMultiplier);
    selectionRing.scale.set(ringBaseSize, ringBaseSize, 1);
    selectionRing.material.opacity = 1;

    showCard(mesh.userData.beacon);
    if (zoomOnSelect) {
      flyTo(mesh.userData.beacon.zoomTarget, mesh.userData.beacon.zoomDistance);
    } else {
      flyTo(new THREE.Vector3(0, 0, 0), homeDistance);
    }

    if (onSelect) onSelect(mesh);
  }

  function deselect() {
    if (selectedBody) {
      const base = selectedBody.userData.baseScale;
      const restScale = selectedBody === hoveredBody ? base * hoverMultiplier : base;
      selectedBody.scale.set(restScale, restScale, restScale);
      selectedBody = null;
    }
    if (selectedListItem) {
      selectedListItem.classList.remove('is-active');
      selectedListItem = null;
    }
    selectionRing.material.opacity = 0;
    flyTo(new THREE.Vector3(0, 0, 0), homeDistance);
  }

  function hideCard() {
    cardEl.classList.remove('is-visible');
    deselect();
  }

  cardCloseEl.addEventListener('click', hideCard);

  // A click that follows a camera drag (OrbitControls) should not select a
  // body: track the pointer-down position and only treat the click as real
  // if the pointer barely moved before release.
  let pointerDownPosition = null;

  renderer.domElement.addEventListener('pointerdown', (event) => {
    pointerDownPosition = { x: event.clientX, y: event.clientY };
  });

  renderer.domElement.addEventListener('pointermove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(bodies);
    const hit = hits.length > 0 ? hits[0].object : null;

    if (hit !== hoveredBody) {
      if (hoveredBody && hoveredBody !== selectedBody) {
        const base = hoveredBody.userData.baseScale;
        hoveredBody.scale.set(base, base, base);
      }
      if (hit && hit !== selectedBody) {
        const hoverScale = hit.userData.baseScale * hoverMultiplier;
        hit.scale.set(hoverScale, hoverScale, hoverScale);
      }
      hoveredBody = hit;
      renderer.domElement.style.cursor = hit ? 'pointer' : '';
    }
  });

  renderer.domElement.addEventListener('click', (event) => {
    if (pointerDownPosition) {
      const dx = event.clientX - pointerDownPosition.x;
      const dy = event.clientY - pointerDownPosition.y;
      if (Math.hypot(dx, dy) >= clickDragThreshold) return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(bodies);
    if (hits.length > 0) {
      selectBody(hits[0].object);
    }
  });

  function selectBySlug(slug) {
    const mesh = bodies.find((body) => body.userData.beacon.slug === slug);
    if (mesh) selectBody(mesh);
  }

  function update(elapsed) {
    if (selectedBody) {
      selectedBody.getWorldPosition(ringWorldPos);
      selectionRing.position.copy(ringWorldPos);
      const pulse = ringBaseSize + Math.sin(elapsed * 3) * (ringBaseSize * 0.15);
      selectionRing.scale.set(pulse, pulse, 1);

      if (zoomOnSelect && !cameraAnim) {
        if (followTargetActive) {
          followDelta.copy(ringWorldPos).sub(followWorldPos);
          camera.position.add(followDelta);
          controls.target.add(followDelta);
        }
        followWorldPos.copy(ringWorldPos);
        followTargetActive = true;
      }
    } else {
      followTargetActive = false;
    }

    if (cameraAnim) {
      const t = Math.min((performance.now() - cameraAnim.start) / cameraAnim.duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(cameraAnim.fromPosition, cameraAnim.toPosition, eased);
      controls.target.lerpVectors(cameraAnim.fromTarget, cameraAnim.toTarget, eased);
      if (t >= 1) {
        cameraAnim = null;
        controls.enabled = true;
      }
    }
  }

  return { selectBody, selectBySlug, update };
}
