import * as THREE from 'three';
import { makeGlowTexture } from './glow-texture.js';

// Locked-in look from unknown-frontier/systems/_star-lab.html (the scratch
// tuning page — kept in the repo for any future revisit) after two earlier
// canvas/photo-texture attempts were rejected. Real-time GLSL instead of a
// static canvas texture: 3D fbm noise sampled directly on the sphere (no
// equirectangular pole-pinch), continuously reshaping rather than a fixed
// painted pattern. No corona shell — that lab experiment didn't make the
// cut either; just the sphere plus the original soft sprite halo.
const LOOK = {
  scale: 4,
  speed: 0.5,
  warp: 1,
  darkCut: 0.43,
  brightCut: 0.69,
  satBoost: 0.52,
  fresnel: 0,
};

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjectPos;
  void main() {
    // Rotation (not translation) part of modelMatrix, so the noise field
    // below sweeps around as the star's own mesh.rotation spins — sampling
    // plain local position here would look identical before and after any
    // rotation, since a unit sphere's vertices don't move relative to its
    // own local axes no matter how it's spun.
    vObjectPos = mat3(modelMatrix) * position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uWarp;
  uniform float uDarkCut;
  uniform float uBrightCut;
  uniform float uSatBoost;
  uniform float uFresnel;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjectPos;

  float hash3(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash3(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash3(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm3(vec3 p) {
    float amp = 0.5;
    float sum = 0.0;
    float norm = 0.0;
    for (int i = 0; i < 5; i++) {
      sum += noise3(p) * amp;
      norm += amp;
      p *= 2.02;
      amp *= 0.5;
    }
    return sum / norm;
  }

  void main() {
    vec3 p = normalize(vObjectPos) * uScale;
    vec3 flow = vec3(0.0, uTime * uSpeed, uTime * uSpeed * 0.6);
    vec3 warpVec = vec3(
      fbm3(p + flow + 17.0),
      fbm3(p + flow + 41.0),
      fbm3(p + flow + 83.0)
    ) - 0.5;
    float n = fbm3(p + flow + warpVec * uWarp);

    vec3 dark = uBaseColor * 0.18;
    vec3 mid = mix(uBaseColor, vec3(dot(uBaseColor, vec3(0.299, 0.587, 0.114))), 1.0 - uSatBoost);
    vec3 bright = mix(uBaseColor, vec3(1.0), 0.88);

    vec3 col = mix(dark, mid, smoothstep(uDarkCut - 0.18, uDarkCut + 0.18, n));
    col = mix(col, bright, smoothstep(uBrightCut - 0.12, uBrightCut + 0.12, n));

    float fres = pow(1.0 - max(dot(normalize(vNormal), vViewDir), 0.0), 2.2);
    col += fres * uFresnel * bright;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function colorToRgba(hex, alpha) {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${alpha})`;
}

// Returns the star's sphere Mesh (the raycastable body registered in
// solar-system.js's `bodies` list) with the soft glow halo as a child
// sprite — riding along on the mesh's transform without being individually
// hit-testable, same trick maybeAddAtmosphere uses for planets. Caller
// must copy `elapsed` into `mesh.material.uniforms.uTime.value` every
// frame for the surface to keep shifting.
export function createStarMesh(color) {
  const uniforms = {
    uTime: { value: 0 },
    uBaseColor: { value: new THREE.Color(color) },
    uScale: { value: LOOK.scale },
    uSpeed: { value: LOOK.speed },
    uWarp: { value: LOOK.warp },
    uDarkCut: { value: LOOK.darkCut },
    uBrightCut: { value: LOOK.brightCut },
    uSatBoost: { value: LOOK.satBoost },
    uFresnel: { value: LOOK.fresnel },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), material);
  mesh.userData.spinSpeed = 0.06 + Math.random() * 0.05;

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(colorToRgba(color, 1), colorToRgba(color, 0)),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  halo.scale.setScalar(2.1);
  mesh.add(halo);

  return mesh;
}
