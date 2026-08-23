import * as THREE from 'three';
import {
  Fn, uniform, screenUV,
  vec2, vec3, vec4, float,
  length, normalize, sin, cos, atan, asin, sqrt, pow,
  fract, clamp, smoothstep, mix, floor, sign, step,
  Loop, Break, If,
} from 'three/tsl';

// Raymarched black hole (gravitational lensing + accretion disk), ported
// from threejsroadmap.com/blog/raytracing-a-black-hole-with-webgpu to this
// scene's real orbiting camera. Escaped rays render a small procedural
// starfield (like the reference) rather than trying to show the real
// scene bent behind it — an earlier version captured the scene to a
// render target every frame and reprojected it, which reliably blanked
// the whole page on at least one real WebGPU setup (Brave/Windows,
// NVIDIA D3D12/Dawn) despite that GPU otherwise fully supporting WebGPU;
// this drops that unproven technique in favor of what the proven demo
// itself does. Runs on a finite "portal" sphere around the black hole
// rather than a screen-filling shell, so the rest of the scene (other
// galaxies, the real starfield) stays visible around it.

const hash21 = Fn(([p]) => {
  const n = sin(p.dot(vec2(127.1, 311.7))).mul(43758.5453);
  return fract(n);
});

const hash31 = Fn(([p]) => {
  const n = sin(p.dot(vec3(127.1, 311.7, 74.7))).mul(43758.5453);
  return fract(n);
});

const noise3D = Fn(([p]) => {
  const i = floor(p);
  const f = fract(p);
  const u = f.mul(f).mul(float(3.0).sub(f.mul(2.0)));
  const a = hash31(i);
  const b = hash31(i.add(vec3(1, 0, 0)));
  const c = hash31(i.add(vec3(0, 1, 0)));
  const d = hash31(i.add(vec3(1, 1, 0)));
  const e = hash31(i.add(vec3(0, 0, 1)));
  const f2 = hash31(i.add(vec3(1, 0, 1)));
  const g = hash31(i.add(vec3(0, 1, 1)));
  const h = hash31(i.add(vec3(1, 1, 1)));
  return mix(
    mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
    mix(mix(e, f2, u.x), mix(g, h, u.x), u.y),
    u.z
  );
});

const fbm = Fn(([p, lacunarity, persistence]) => {
  const value = float(0.0).toVar();
  const amplitude = float(0.5).toVar();
  const pos = p.toVar();
  value.addAssign(noise3D(pos).mul(amplitude));
  pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
  value.addAssign(noise3D(pos).mul(amplitude));
  pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
  value.addAssign(noise3D(pos).mul(amplitude));
  pos.mulAssign(lacunarity); amplitude.mulAssign(persistence);
  value.addAssign(noise3D(pos).mul(amplitude));
  return value;
});

const blackbodyColor = Fn(([tempK]) => {
  const t = clamp(tempK.sub(1000.0).div(9000.0), float(0.0), float(1.0));
  const red = clamp(float(1.0).sub(t.sub(0.8).mul(2.0)), float(0.5), float(1.0));
  const green = smoothstep(float(0.0), float(0.5), t)
    .mul(float(1.0).sub(t.sub(0.7).mul(0.3).max(0.0)));
  const blue = smoothstep(float(0.3), float(1.0), t).mul(t);
  return vec3(red, green, blue);
});

// Sparse procedural stars for escaped rays — a spherical-direction grid
// so it has no seams, hashed per cell for placement/existence.
const proceduralStars = Fn(([rayDir]) => {
  const theta = atan(rayDir.z, rayDir.x);
  const phi = asin(clamp(rayDir.y, float(-1.0), float(1.0)));
  const scaledCoord = vec2(theta, phi).mul(35.0);
  const cell = floor(scaledCoord);
  const cellUv = fract(scaledCoord);
  const cellHash = hash21(cell);
  const starProb = step(0.94, cellHash);
  const starPos = hash21(cell.add(17.0)).mul(0.6).add(0.2);
  const distToStar = length(cellUv.sub(vec2(starPos, starPos)));
  const intensity = smoothstep(0.1, 0.0, distToStar).mul(starProb);
  return vec3(0.85, 0.9, 1.0).mul(intensity);
});

export function createBlackHole({ scene, camera, position = [0, 0, 0] }) {
  // Mass/disk ratio matched to the verified-working standalone reference
  // (event horizon at roughly 1/5 the disk's inner radius) rather than the
  // ~1:1.5 ratio tried earlier — too-similar a horizon and disk radius
  // never let a ray plunge close enough to the singularity for the bend to
  // get strong, which is what produced a thin sliver instead of a ring.
  const config = {
    blackHoleMass: 0.5,
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
    // 2.4 matches the verified-working reference's own value.
    gravitationalLensing: 2.4,
    dopplerStrength: 1.0,
    // stepSize/stepCount mirror the standalone reference test exactly
    // (proven stable across its whole camera range at this object scale)
    // rather than re-deriving new values — the ray-sphere entry jump below
    // already skips the empty gap between a distant camera and the
    // portal, so this budget is pure margin on top of what was proven.
    stepSize: 1.0,
    portalRadius: 24,
    stepCount: 80,
  };

  const uniforms = {
    blackHoleMass: uniform(config.blackHoleMass),
    diskInnerRadius: uniform(config.diskInnerRadius),
    diskOuterRadius: uniform(config.diskOuterRadius),
    diskTemperature: uniform(config.diskTemperature),
    temperatureFalloff: uniform(config.temperatureFalloff),
    diskBrightness: uniform(config.diskBrightness),
    diskRotationSpeed: uniform(config.diskRotationSpeed),
    turbulenceScale: uniform(config.turbulenceScale),
    turbulenceStretch: uniform(config.turbulenceStretch),
    turbulenceSharpness: uniform(config.turbulenceSharpness),
    turbulenceCycleTime: uniform(config.turbulenceCycleTime),
    turbulenceLacunarity: uniform(config.turbulenceLacunarity),
    turbulencePersistence: uniform(config.turbulencePersistence),
    diskEdgeSoftnessInner: uniform(config.diskEdgeSoftnessInner),
    diskEdgeSoftnessOuter: uniform(config.diskEdgeSoftnessOuter),
    gravitationalLensing: uniform(config.gravitationalLensing),
    dopplerStrength: uniform(config.dopplerStrength),
    stepSize: uniform(config.stepSize),
    time: uniform(0),
    holeCenter: uniform(new THREE.Vector3(...position)),
    projMatrixInverse: uniform(new THREE.Matrix4()),
    viewMatrixInverse: uniform(new THREE.Matrix4()),
  };

  const accretionDiskColor = Fn(([hitR, hitAngle, rayDir]) => {
    const innerR = uniforms.diskInnerRadius;
    const outerR = uniforms.diskOuterRadius;
    const normR = clamp(hitR.sub(innerR).div(outerR.sub(innerR)), float(0.0), float(1.0));

    const peakTempK = uniforms.diskTemperature.mul(1000.0);
    const outerTempK = float(1500.0);
    const tempFalloff = pow(innerR.div(hitR), uniforms.temperatureFalloff);
    const tempK = mix(outerTempK, peakTempK, tempFalloff);
    const diskColor = blackbodyColor(tempK).toVar('diskColor');

    const rotationSign = sign(uniforms.diskRotationSpeed);
    const velocityDir = vec3(
      sin(hitAngle).negate().mul(rotationSign),
      float(0.0),
      cos(hitAngle).mul(rotationSign)
    );
    const velocityMagnitude = float(1.0).div(sqrt(hitR.div(innerR)));
    const beta = velocityMagnitude.mul(0.3);
    const cosTheta = velocityDir.dot(rayDir);
    const dopplerFactor = float(1.0).div(float(1.0).sub(beta.mul(cosTheta)));
    const dopplerBoost = pow(dopplerFactor, float(3.0).mul(uniforms.dopplerStrength));
    diskColor.mulAssign(clamp(dopplerBoost, float(0.1), float(5.0)));

    const edgeFalloff = smoothstep(float(0.0), uniforms.diskEdgeSoftnessInner, normR)
      .mul(smoothstep(float(1.0), float(1.0).sub(uniforms.diskEdgeSoftnessOuter), normR));

    const cycleLength = uniforms.turbulenceCycleTime;
    const cyclicTime = uniforms.time.mod(cycleLength);
    const blendFactor = cyclicTime.div(cycleLength);
    const keplerianPhase1 = cyclicTime.mul(uniforms.diskRotationSpeed).div(pow(hitR, float(1.5)));
    const keplerianPhase2 = cyclicTime.add(cycleLength).mul(uniforms.diskRotationSpeed).div(pow(hitR, float(1.5)));
    const rotatedAngle1 = hitAngle.add(keplerianPhase1);
    const rotatedAngle2 = hitAngle.add(keplerianPhase2);
    const noiseCoord1 = vec3(
      hitR.mul(uniforms.turbulenceScale),
      cos(rotatedAngle1).div(uniforms.turbulenceStretch.max(0.1)),
      sin(rotatedAngle1).div(uniforms.turbulenceStretch.max(0.1))
    );
    const noiseCoord2 = vec3(
      hitR.mul(uniforms.turbulenceScale),
      cos(rotatedAngle2).div(uniforms.turbulenceStretch.max(0.1)),
      sin(rotatedAngle2).div(uniforms.turbulenceStretch.max(0.1))
    );
    const turbulence1 = fbm(noiseCoord1, uniforms.turbulenceLacunarity, uniforms.turbulencePersistence);
    const turbulence2 = fbm(noiseCoord2, uniforms.turbulenceLacunarity, uniforms.turbulencePersistence);
    const turbulence = mix(turbulence2, turbulence1, blendFactor);
    const ringOpacity = pow(clamp(turbulence, float(0.0), float(1.0)), uniforms.turbulenceSharpness);

    const finalOpacity = ringOpacity.mul(edgeFalloff);
    const finalColor = diskColor.mul(uniforms.diskBrightness);
    return vec4(finalColor, finalOpacity);
  });

  const blackHoleShader = Fn(() => {
    const rs = uniforms.blackHoleMass.mul(2.0);

    // Reconstruct this fragment's real camera ray via standard unprojection
    // (near/far NDC points through the inverse projection/view matrices),
    // since this shader sits on a real mesh seen by the scene's actual
    // orbiting camera rather than a fixed synthetic one.
    const ndcXY = screenUV.mul(2.0).sub(1.0);
    const ndcNear = vec4(ndcXY, float(-1.0), float(1.0));
    const ndcFar = vec4(ndcXY, float(1.0), float(1.0));

    const viewNear = uniforms.projMatrixInverse.mul(ndcNear);
    const worldNear4 = uniforms.viewMatrixInverse.mul(viewNear.div(viewNear.w));
    const viewFar = uniforms.projMatrixInverse.mul(ndcFar);
    const worldFar4 = uniforms.viewMatrixInverse.mul(viewFar.div(viewFar.w));

    const rayDir = normalize(worldFar4.xyz.sub(worldNear4.xyz)).toVar('rayDir');
    const cameraLocalPos = worldNear4.xyz.sub(uniforms.holeCenter);

    // The camera can sit far outside the portal (up to ~600 units in this
    // scene), so starting the march from the camera's own position would
    // burn the whole step budget crossing empty space — or trip the
    // escape-radius check below before a single step runs. Jump straight
    // to where this view ray enters the portal sphere instead (analytic
    // ray-sphere intersection, sphere centered at the local origin).
    const portalRadiusF = float(config.portalRadius);
    const bCoef = cameraLocalPos.dot(rayDir).mul(2.0);
    const cCoef = cameraLocalPos.dot(cameraLocalPos).sub(portalRadiusF.mul(portalRadiusF));
    const discriminant = bCoef.mul(bCoef).sub(cCoef.mul(4.0)).max(0.0);
    const entryT = bCoef.negate().sub(sqrt(discriminant)).div(2.0).max(0.0);

    const rayPos = cameraLocalPos.add(rayDir.mul(entryT)).toVar('rayPos');
    const prevPos = rayPos.toVar('prevPos');

    const color = vec3(0.0, 0.0, 0.0).toVar('color');
    const alpha = float(0.0).toVar('alpha');
    const escaped = float(0.0).toVar('escaped');
    const captured = float(0.0).toVar('captured');
    const innerR = uniforms.diskInnerRadius;
    const outerR = uniforms.diskOuterRadius;
    const escapeRadius = float(config.portalRadius).mul(3.0);

    Loop(config.stepCount, () => {
      If(escaped.greaterThan(0.5).or(captured.greaterThan(0.5)).or(alpha.greaterThan(0.99)), () => {
        Break();
      });

      const r = length(rayPos);

      If(r.lessThan(rs.mul(1.01)), () => {
        captured.assign(1.0);
        Break();
      });

      If(r.greaterThan(escapeRadius), () => {
        escaped.assign(1.0);
        Break();
      });

      const toCenter = rayPos.negate().div(r);
      // Clamped — close to the horizon, rs/r^2 grows sharply, and an
      // unbounded per-step bend occasionally degenerates rayDir toward a
      // near-zero vector right before normalize(), which produces NaN on
      // some GPU/driver combos and appears to be able to take down the
      // whole WebGPU context (not just this mesh) rather than just glitch
      // this one pixel.
      const bendStrength = rs.div(r.mul(r)).mul(uniforms.stepSize).mul(uniforms.gravitationalLensing).min(1.2);
      rayDir.addAssign(toCenter.mul(bendStrength));
      rayDir.assign(normalize(rayDir));

      prevPos.assign(rayPos);
      rayPos.addAssign(rayDir.mul(uniforms.stepSize));

      const crossedPlane = prevPos.y.mul(rayPos.y).lessThan(0.0);
      If(crossedPlane.and(alpha.lessThan(0.99)), () => {
        const t = prevPos.y.negate().div(rayPos.y.sub(prevPos.y));
        const hitPos = mix(prevPos, rayPos, t);
        const hitR = sqrt(hitPos.x.mul(hitPos.x).add(hitPos.z.mul(hitPos.z)));
        const inDisk = hitR.greaterThan(innerR).and(hitR.lessThan(outerR));
        If(inDisk, () => {
          const hitAngle = atan(hitPos.z, hitPos.x);
          const diskResult = accretionDiskColor(hitR, hitAngle, rayDir);
          const remainingAlpha = float(1.0).sub(alpha);
          color.addAssign(diskResult.xyz.mul(diskResult.w).mul(remainingAlpha));
          alpha.addAssign(remainingAlpha.mul(diskResult.w));
        });
      });
    });

    If(captured.lessThan(0.5), () => {
      escaped.assign(1.0);
    });

    If(escaped.greaterThan(0.5).and(alpha.lessThan(0.99)), () => {
      const bg = proceduralStars(rayDir);
      color.addAssign(bg.mul(float(1.0).sub(alpha)));
    });

    return vec4(color, 1.0);
  })();

  const geometry = new THREE.SphereGeometry(config.portalRadius, 48, 48);
  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = blackHoleShader;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.frustumCulled = false;
  mesh.userData.baseScale = 1;
  scene.add(mesh);

  function update() {
    uniforms.time.value = performance.now() / 1000;
    uniforms.projMatrixInverse.value.copy(camera.projectionMatrix).invert();
    uniforms.viewMatrixInverse.value.copy(camera.matrixWorld);
  }

  return { mesh, update };
}
