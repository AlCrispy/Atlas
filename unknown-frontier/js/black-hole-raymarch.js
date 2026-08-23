import * as THREE from 'three';

// Raymarched black hole (gravitational lensing + accretion disk), classic
// GLSL ShaderMaterial under the standard WebGLRenderer — a port of the
// same algorithm/config proven out in a WebGPU/TSL prototype (see the
// glsl-blackhole branch history), moved to plain WebGL for universal
// compatibility instead of chasing per-GPU/driver WebGPU quirks.
//
// Escaped rays sample a captured render of the real scene (reprojected via
// camera matrices), reusing the render-target-capture technique already
// proven in gravitational-lens.js, so the lensing bends the actual
// galaxies/starfield behind the hole rather than a fake sky.

const VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform vec3 uHoleCenter;
  uniform float uTime;

  uniform float uMass;
  uniform float uDiskInnerRadius;
  uniform float uDiskOuterRadius;
  uniform float uDiskTemperature;
  uniform float uTemperatureFalloff;
  uniform float uDiskBrightness;
  uniform float uDiskRotationSpeed;
  uniform float uTurbulenceScale;
  uniform float uTurbulenceStretch;
  uniform float uTurbulenceSharpness;
  uniform float uTurbulenceCycleTime;
  uniform float uTurbulenceLacunarity;
  uniform float uTurbulencePersistence;
  uniform float uDiskEdgeSoftnessInner;
  uniform float uDiskEdgeSoftnessOuter;
  uniform float uGravitationalLensing;
  uniform float uDopplerStrength;
  uniform float uStepSize;
  uniform float uPortalRadius;

  uniform mat4 uProjMatrixInverse;
  uniform mat4 uViewMatrixInverse;
  uniform mat4 uProjMatrix;
  uniform mat4 uViewMatrix;

  float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float a = hash31(i);
    float b = hash31(i + vec3(1.0, 0.0, 0.0));
    float c = hash31(i + vec3(0.0, 1.0, 0.0));
    float d = hash31(i + vec3(1.0, 1.0, 0.0));
    float e = hash31(i + vec3(0.0, 0.0, 1.0));
    float f2 = hash31(i + vec3(1.0, 0.0, 1.0));
    float g = hash31(i + vec3(0.0, 1.0, 1.0));
    float h = hash31(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
      mix(mix(e, f2, u.x), mix(g, h, u.x), u.y),
      u.z
    );
  }

  float fbm(vec3 p, float lacunarity, float persistence) {
    float value = 0.0;
    float amplitude = 0.5;
    vec3 pos = p;
    for (int i = 0; i < 4; i++) {
      value += noise3D(pos) * amplitude;
      pos *= lacunarity;
      amplitude *= persistence;
    }
    return value;
  }

  vec3 blackbodyColor(float tempK) {
    float t = clamp((tempK - 1000.0) / 9000.0, 0.0, 1.0);
    float red = clamp(1.0 - (t - 0.8) * 2.0, 0.5, 1.0);
    float green = smoothstep(0.0, 0.5, t) * (1.0 - max((t - 0.7) * 0.3, 0.0));
    float blue = smoothstep(0.3, 1.0, t) * t;
    return vec3(red, green, blue);
  }

  vec4 accretionDiskColor(float hitR, float hitAngle, vec3 rayDir) {
    float innerR = uDiskInnerRadius;
    float outerR = uDiskOuterRadius;
    float normR = clamp((hitR - innerR) / (outerR - innerR), 0.0, 1.0);

    float peakTempK = uDiskTemperature * 1000.0;
    float outerTempK = 1500.0;
    float tempFalloff = pow(innerR / hitR, uTemperatureFalloff);
    float tempK = mix(outerTempK, peakTempK, tempFalloff);
    vec3 diskColor = blackbodyColor(tempK);

    float rotationSign = sign(uDiskRotationSpeed);
    vec3 velocityDir = vec3(-sin(hitAngle) * rotationSign, 0.0, cos(hitAngle) * rotationSign);
    float velocityMagnitude = 1.0 / sqrt(hitR / innerR);
    float beta = velocityMagnitude * 0.3;
    float cosTheta = dot(velocityDir, rayDir);
    float dopplerFactor = 1.0 / (1.0 - beta * cosTheta);
    float dopplerBoost = pow(dopplerFactor, 3.0 * uDopplerStrength);
    diskColor *= clamp(dopplerBoost, 0.1, 5.0);

    float edgeFalloff = smoothstep(0.0, uDiskEdgeSoftnessInner, normR)
      * (1.0 - smoothstep(1.0 - uDiskEdgeSoftnessOuter, 1.0, normR));

    float cycleLength = uTurbulenceCycleTime;
    float cyclicTime = mod(uTime, cycleLength);
    float blendFactor = cyclicTime / cycleLength;
    float keplerianPhase1 = cyclicTime * uDiskRotationSpeed / pow(hitR, 1.5);
    float keplerianPhase2 = (cyclicTime + cycleLength) * uDiskRotationSpeed / pow(hitR, 1.5);
    float rotatedAngle1 = hitAngle + keplerianPhase1;
    float rotatedAngle2 = hitAngle + keplerianPhase2;
    float stretch = max(uTurbulenceStretch, 0.1);
    vec3 noiseCoord1 = vec3(hitR * uTurbulenceScale, cos(rotatedAngle1) / stretch, sin(rotatedAngle1) / stretch);
    vec3 noiseCoord2 = vec3(hitR * uTurbulenceScale, cos(rotatedAngle2) / stretch, sin(rotatedAngle2) / stretch);
    float turbulence1 = fbm(noiseCoord1, uTurbulenceLacunarity, uTurbulencePersistence);
    float turbulence2 = fbm(noiseCoord2, uTurbulenceLacunarity, uTurbulencePersistence);
    float turbulence = mix(turbulence2, turbulence1, blendFactor);
    float ringOpacity = pow(clamp(turbulence, 0.0, 1.0), uTurbulenceSharpness);

    float finalOpacity = ringOpacity * edgeFalloff;
    vec3 finalColor = diskColor * uDiskBrightness;
    return vec4(finalColor, finalOpacity);
  }

  void main() {
    float rs = uMass * 2.0;

    vec2 screenUv = gl_FragCoord.xy / uResolution;
    vec2 ndcXY = screenUv * 2.0 - 1.0;
    vec4 ndcNear = vec4(ndcXY, -1.0, 1.0);
    vec4 ndcFar = vec4(ndcXY, 1.0, 1.0);

    vec4 viewNear = uProjMatrixInverse * ndcNear;
    vec4 worldNear4 = uViewMatrixInverse * (viewNear / viewNear.w);
    vec4 viewFar = uProjMatrixInverse * ndcFar;
    vec4 worldFar4 = uViewMatrixInverse * (viewFar / viewFar.w);

    vec3 rayDir = normalize(worldFar4.xyz - worldNear4.xyz);
    vec3 cameraLocalPos = worldNear4.xyz - uHoleCenter;

    // Jump straight to where this view ray enters the portal sphere,
    // instead of marching from the camera's own (possibly very distant)
    // position — analytic ray-sphere intersection, sphere at local origin.
    float bCoef = 2.0 * dot(cameraLocalPos, rayDir);
    float cCoef = dot(cameraLocalPos, cameraLocalPos) - uPortalRadius * uPortalRadius;
    float discriminant = max(bCoef * bCoef - 4.0 * cCoef, 0.0);
    float entryT = max((-bCoef - sqrt(discriminant)) / 2.0, 0.0);

    vec3 rayPos = cameraLocalPos + rayDir * entryT;
    vec3 prevPos = rayPos;

    vec3 color = vec3(0.0);
    float alpha = 0.0;
    bool escaped = false;
    bool captured = false;
    float innerR = uDiskInnerRadius;
    float outerR = uDiskOuterRadius;
    float escapeRadius = uPortalRadius * 3.0;

    for (int i = 0; i < 80; i++) {
      if (escaped || captured || alpha > 0.99) break;

      float r = length(rayPos);

      if (r < rs * 1.01) { captured = true; break; }
      if (r > escapeRadius) { escaped = true; break; }

      vec3 toCenter = -rayPos / r;
      float bendStrength = min((rs / (r * r)) * uStepSize * uGravitationalLensing, 1.2);
      rayDir = normalize(rayDir + toCenter * bendStrength);

      prevPos = rayPos;
      rayPos += rayDir * uStepSize;

      if (prevPos.y * rayPos.y < 0.0 && alpha < 0.99) {
        float t = -prevPos.y / (rayPos.y - prevPos.y);
        vec3 hitPos = mix(prevPos, rayPos, t);
        float hitR = sqrt(hitPos.x * hitPos.x + hitPos.z * hitPos.z);
        if (hitR > innerR && hitR < outerR) {
          float hitAngle = atan(hitPos.z, hitPos.x);
          vec4 diskResult = accretionDiskColor(hitR, hitAngle, rayDir);
          float remainingAlpha = 1.0 - alpha;
          color += diskResult.rgb * diskResult.a * remainingAlpha;
          alpha += remainingAlpha * diskResult.a;
        }
      }
    }

    if (!captured) escaped = true;

    if (escaped && alpha < 0.99) {
      vec3 worldHit = rayPos + uHoleCenter + rayDir * 500.0;
      vec4 clip = uProjMatrix * (uViewMatrix * vec4(worldHit, 1.0));
      vec2 sampleUv = (clip.xy / clip.w) * 0.5 + 0.5;
      vec3 bg = texture2D(tDiffuse, clamp(sampleUv, 0.0, 1.0)).rgb;
      color += bg * (1.0 - alpha);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createBlackHole({ scene, camera, renderer, position = [0, 0, 0] }) {
  // Mass/disk ratio and step budget match the values verified working in
  // the standalone WebGPU/TSL prototype (event horizon at ~1/5 the disk's
  // inner radius; step size/count mirror the proven reference exactly).
  const config = {
    mass: 0.5,
    diskInnerRadius: 5,
    diskOuterRadius: 18,
    diskTemperature: 42,
    temperatureFalloff: 5.2,
    diskBrightness: 4.5,
    diskRotationSpeed: -6,
    turbulenceScale: 1.8,
    turbulenceStretch: 0.75,
    turbulenceSharpness: 6.5,
    turbulenceCycleTime: 5,
    turbulenceLacunarity: 2.5,
    turbulencePersistence: 0.8,
    diskEdgeSoftnessInner: 0.18,
    diskEdgeSoftnessOuter: 0.5,
    gravitationalLensing: 2.4,
    dopplerStrength: 1.0,
    stepSize: 1.0,
    portalRadius: 24,
  };

  const drawingBufferSize = new THREE.Vector2();
  renderer.getDrawingBufferSize(drawingBufferSize);
  const renderTarget = new THREE.WebGLRenderTarget(
    Math.max(1, drawingBufferSize.x),
    Math.max(1, drawingBufferSize.y)
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: renderTarget.texture },
      uResolution: { value: drawingBufferSize.clone() },
      uHoleCenter: { value: new THREE.Vector3(...position) },
      uTime: { value: 0 },
      uMass: { value: config.mass },
      uDiskInnerRadius: { value: config.diskInnerRadius },
      uDiskOuterRadius: { value: config.diskOuterRadius },
      uDiskTemperature: { value: config.diskTemperature },
      uTemperatureFalloff: { value: config.temperatureFalloff },
      uDiskBrightness: { value: config.diskBrightness },
      uDiskRotationSpeed: { value: config.diskRotationSpeed },
      uTurbulenceScale: { value: config.turbulenceScale },
      uTurbulenceStretch: { value: config.turbulenceStretch },
      uTurbulenceSharpness: { value: config.turbulenceSharpness },
      uTurbulenceCycleTime: { value: config.turbulenceCycleTime },
      uTurbulenceLacunarity: { value: config.turbulenceLacunarity },
      uTurbulencePersistence: { value: config.turbulencePersistence },
      uDiskEdgeSoftnessInner: { value: config.diskEdgeSoftnessInner },
      uDiskEdgeSoftnessOuter: { value: config.diskEdgeSoftnessOuter },
      uGravitationalLensing: { value: config.gravitationalLensing },
      uDopplerStrength: { value: config.dopplerStrength },
      uStepSize: { value: config.stepSize },
      uPortalRadius: { value: config.portalRadius },
      uProjMatrixInverse: { value: new THREE.Matrix4() },
      uViewMatrixInverse: { value: new THREE.Matrix4() },
      uProjMatrix: { value: new THREE.Matrix4() },
      uViewMatrix: { value: new THREE.Matrix4() },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });

  const geometry = new THREE.SphereGeometry(config.portalRadius, 48, 48);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.frustumCulled = false;
  mesh.userData.baseScale = 1;
  scene.add(mesh);

  const clock = new THREE.Clock();

  function update() {
    const { uniforms } = material;
    uniforms.uTime.value += clock.getDelta();
    uniforms.uProjMatrixInverse.value.copy(camera.projectionMatrixInverse);
    uniforms.uViewMatrixInverse.value.copy(camera.matrixWorld);
    uniforms.uProjMatrix.value.copy(camera.projectionMatrix);
    uniforms.uViewMatrix.value.copy(camera.matrixWorldInverse);
  }

  function renderPass() {
    renderer.getDrawingBufferSize(drawingBufferSize);
    if (renderTarget.width !== drawingBufferSize.x || renderTarget.height !== drawingBufferSize.y) {
      renderTarget.setSize(Math.max(1, drawingBufferSize.x), Math.max(1, drawingBufferSize.y));
      material.uniforms.uResolution.value.copy(drawingBufferSize);
    }
    mesh.visible = false;
    const previousTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(previousTarget);
    mesh.visible = true;
  }

  return { mesh, update, renderPass };
}
