import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import {
  CORE_FRAG,
  CORE_VERT,
  GRID_FRAG,
  GRID_VERT,
  PARTICLE_FRAG,
  PARTICLE_VERT,
  WIRE_FRAG,
} from "./orbShaders";

/** Matches --primary (#7C3AED) and its neighbours. */
const RIM = new THREE.Color("#8b5cf6");
const EDGE = new THREE.Color("#a78bfa");
const DEEP = new THREE.Color("#12071f");
const DUST = new THREE.Color("#a684ff");
const GRID = new THREE.Color("#7c3aed");

// Scene tuning — the knobs worth reaching for first.
const PARTICLE_COUNT = 2600;
const FIELD_INNER = 2.4;
const FIELD_OUTER = 11;

/** Deterministic PRNG, so the layout is identical on every load. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * The focal object: a faceted body that is almost black across its faces, with
 * a glowing wireframe welded to the same displaced vertices. Structure is what
 * makes this read as an object rather than a ball of gas.
 */
function Core() {
  const spin = useRef<THREE.Group>(null);
  const uTime = useMemo(() => ({ value: 0 }), []);
  const uAmp = useMemo(() => ({ value: 0.11 }), []);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);

  const [bodyMat, wireMat] = useMemo(() => {
    const body = new THREE.ShaderMaterial({
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      uniforms: { uTime, uAmp, uRim: { value: RIM }, uDeep: { value: DEEP } },
    });
    const wire = new THREE.ShaderMaterial({
      vertexShader: CORE_VERT,
      fragmentShader: WIRE_FRAG,
      uniforms: { uTime, uAmp, uColor: { value: EDGE }, uStrength: { value: 0.9 } },
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return [body, wire] as const;
  }, [uTime, uAmp]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      bodyMat.dispose();
      wireMat.dispose();
    };
  }, [geometry, bodyMat, wireMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    uTime.value = t;
    const sp = spin.current;
    if (sp) {
      sp.rotation.y = t * 0.1;
      sp.rotation.x = Math.sin(t * 0.21) * 0.16;
    }
  });

  return (
    <group ref={spin}>
      <mesh geometry={geometry} material={bodyMat} />
      <mesh geometry={geometry} material={wireMat} scale={1.004} />
    </group>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uColor: { value: DUST } }),
    [],
  );

  const geometry = useMemo(() => {
    const rand = makeRandom(20260826);
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const scale = new Float32Array(PARTICLE_COUNT);
    const phase = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform over a spherical shell. The cube root undoes the radial
      // bunching you get from a flat random radius.
      const u = rand() * 2 - 1;
      const theta = rand() * Math.PI * 2;
      const r = FIELD_INNER + (FIELD_OUTER - FIELD_INNER) * Math.cbrt(rand());
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = r * s * Math.cos(theta);
      pos[i * 3 + 1] = r * s * Math.sin(theta) * 0.66;
      pos[i * 3 + 2] = r * u;
      scale[i] = 0.7 + rand() * 2.8;
      phase[i] = rand() * Math.PI * 2;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock, gl }) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uPixelRatio.value = gl.getPixelRatio();
    const p = points.current;
    if (p) p.rotation.y = t * 0.014;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

/** Perspective floor grid, well below the core, for depth and a sense of place. */
function FloorGrid() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: GRID },
      uSpacing: { value: 1.1 },
      uStrength: { value: 0.09 },
    }),
    [],
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GRID_VERT,
        fragmentShader: GRID_FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3.4, 0]}
    />
  );
}

/**
 * Pointer position in -1..1, tracked off the window rather than off R3F state.
 * The canvas sits under `pointer-events: none` so it never receives pointer
 * events of its own, which would leave R3F's own `pointer` pinned at origin.
 */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

/** The whole scene breathes, drifts, and leans a few degrees toward the pointer. */
function Scene() {
  const root = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();

  useFrame(({ clock }, delta) => {
    const g = root.current;
    if (!g) return;
    const t = clock.getElapsedTime();

    // The one looping animation on the page: ~5s breathe + slight y-drift.
    // sin() is its own ease-in-out, so this reads as a soft inhale/exhale.
    const breathe = Math.sin((t / 5) * Math.PI * 2);
    g.scale.setScalar(1 + breathe * 0.015);
    g.position.y = breathe * 0.07;

    // Frame-rate independent easing toward the pointer.
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.1));
    g.rotation.y += (pointer.current.x * 0.18 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.13 - g.rotation.x) * k;
  });

  return (
    <group ref={root}>
      <FloorGrid />
      <ParticleField />
      <Core />
    </group>
  );
}

export default function OrbCanvas({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <Scene />
      {/* Bloom is what turns the violet edges into light rather than lines. */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.5}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0006, 0.0009)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette offset={0.26} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
