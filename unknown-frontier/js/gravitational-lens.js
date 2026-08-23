import * as THREE from 'three';

// Real shader-based gravitational lensing (not general-relativity-accurate
// light bending — a stylized radial pinch distortion + Einstein-ring rim).
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
  uniform float uSqueezeX;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 delta = uv - uLensScreenPos;
    float dist = length(delta);
    float t = clamp(dist / uLensScreenRadius, 0.0, 1.0);

    float pull = uStrength * (1.0 - t) * (1.0 - t);
    vec2 dir = dist > 0.00001 ? delta / dist : vec2(0.0);
    dir.x *= uSqueezeX;
    vec2 distortedUv = uv - dir * pull * uLensScreenRadius;
    vec3 color = texture2D(tDiffuse, clamp(distortedUv, vec2(0.0), vec2(1.0))).rgb;

    // Two concentric bands with a dark gap between them, echoing the
    // doubled photon-ring look of a real lensed accretion disk rather
    // than a single soft rim.
    float outerRim = smoothstep(0.55, 0.9, t) * (1.0 - smoothstep(0.9, 1.05, t));
    float innerRim = smoothstep(0.25, 0.4, t) * (1.0 - smoothstep(0.4, 0.5, t));
    float rim = outerRim + innerRim * 0.6;
    color += uRimColor * rim * 2.4;

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
    distortionStrength = 0.35,
    squeezeX = 1.0,
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
        uSqueezeX: { value: squeezeX },
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
