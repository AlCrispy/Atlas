import * as THREE from 'three';

// Real shader-based gravitational lensing (not general-relativity-accurate
// light bending — a stylized radial pinch distortion + a pinched, angle-
// squashed photon-ring halo).
// One shared offscreen render target captures the scene with every
// registered lens hidden; each lens is a unit sphere whose fragment shader
// samples that shared texture in screen space, so the render-target cost
// is fixed regardless of how many lenses exist.

const VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform vec2 uLensScreenPos;
  uniform float uLensScreenRadius;
  uniform float uStrength;
  uniform vec3 uRimColor;
  uniform vec3 uHotColor;
  uniform float uSquash;

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 delta = uv - uLensScreenPos;
    delta.x *= aspect;

    // Space is bent isotropically, so the background-warping pull stays a
    // plain radial falloff — physically the "correct" part of the effect.
    float dist = length(delta);
    float t = clamp(dist / uLensScreenRadius, 0.0, 1.0);
    float pull = uStrength * (1.0 - t) * (1.0 - t);
    vec2 dir = dist > 0.00001 ? delta / dist : vec2(0.0);
    vec2 dirUv = vec2(dir.x / aspect, dir.y);
    vec2 distortedUv = uv - dirUv * pull * uLensScreenRadius;
    vec3 color = texture2D(tDiffuse, clamp(distortedUv, vec2(0.0), vec2(1.0))).rgb;

    // The photon ring itself isn't circular: it's the far side of the
    // accretion disk dragged around the horizon, so it bulges above/below
    // and pinches in at the sides — an Interstellar-style "eye" shape
    // rather than a plain Einstein ring. Squash the ring's own radius by
    // angle (not the pull above) to get that silhouette while keeping the
    // lensing warp itself physically radial.
    float angle = atan(delta.y, delta.x);
    float pinch = mix(1.0, uSquash, pow(abs(cos(angle)), 2.0));
    float tRing = clamp((dist * pinch) / uLensScreenRadius, 0.0, 1.4);

    float halo = smoothstep(0.5, 0.82, tRing) * (1.0 - smoothstep(0.95, 1.3, tRing));
    float hotCore = smoothstep(0.68, 0.8, tRing) * (1.0 - smoothstep(0.8, 0.95, tRing));
    vec3 glow = uRimColor * halo * 1.4 + uHotColor * hotCore * 1.8;
    color += glow;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createLensSystem({ scene, camera, renderer }) {
  const drawingBufferSize = new THREE.Vector2();
  renderer.getDrawingBufferSize(drawingBufferSize);

  const renderTarget = new THREE.WebGLRenderTarget(
    Math.max(1, Math.round(drawingBufferSize.x * 0.5)),
    Math.max(1, Math.round(drawingBufferSize.y * 0.5))
  );

  const lenses = [];
  const projectedCenter = new THREE.Vector3();
  const projectedEdge = new THREE.Vector3();

  function buildLens({
    position,
    radius = 6,
    name,
    slug,
    color = '#8a6ae8',
    hotColor = '#fff2e0',
    distortionStrength = 0.35,
    squash = 1.8,
    eyebrow = 'Fenomeno Cosmico',
    galaxy = 'Fenomeno Cosmico',
    exploreHref,
  }) {
    // Unit-radius geometry + scale carrying the real size (rather than
    // baking radius into the geometry) so hover/select scale multipliers
    // in scene-interaction.js apply the same way they do to beacon
    // sprites: baseScale IS the rest-state scale, not a geometry size.
    const geometry = new THREE.SphereGeometry(1, 48, 48);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uResolution: { value: drawingBufferSize.clone() },
        uLensScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
        uLensScreenRadius: { value: 0.1 },
        uStrength: { value: distortionStrength },
        uRimColor: { value: new THREE.Color(color) },
        uHotColor: { value: new THREE.Color(hotColor) },
        uSquash: { value: squash },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.setScalar(radius);
    mesh.userData.baseScale = radius;
    mesh.userData.lensRadius = radius;
    mesh.userData.beacon = {
      name,
      slug,
      eyebrow,
      galaxy,
      color,
      exploreHref,
      zoomTarget: mesh.position.clone(),
      zoomDistance: radius * 6,
    };

    scene.add(mesh);
    lenses.push(mesh);
    return mesh;
  }

  function update() {
    renderer.getDrawingBufferSize(drawingBufferSize);
    lenses.forEach((lens) => {
      const { uniforms } = lens.material;
      uniforms.uResolution.value.copy(drawingBufferSize);

      projectedCenter.copy(lens.position).project(camera);
      projectedEdge.copy(lens.position)
        .addScaledVector(camera.up, lens.userData.lensRadius)
        .project(camera);

      const centerUv = uniforms.uLensScreenPos.value;
      centerUv.set((projectedCenter.x + 1) / 2, (projectedCenter.y + 1) / 2);
      const edgeUvY = (projectedEdge.y + 1) / 2;
      uniforms.uLensScreenRadius.value = Math.max(Math.abs(edgeUvY - centerUv.y), 0.01);
    });
  }

  function renderPass() {
    if (lenses.length === 0) return;
    lenses.forEach((lens) => { lens.visible = false; });
    const previousTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(previousTarget);
    lenses.forEach((lens) => { lens.visible = true; });
  }

  function setSize(drawingBufferWidth, drawingBufferHeight) {
    renderTarget.setSize(
      Math.max(1, Math.round(drawingBufferWidth * 0.5)),
      Math.max(1, Math.round(drawingBufferHeight * 0.5))
    );
  }

  return { buildLens, update, renderPass, setSize };
}
