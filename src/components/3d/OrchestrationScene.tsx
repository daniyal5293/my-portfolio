/**
 * The hero centerpiece — an "orchestration core".
 *
 *  • A faceted chrome kernel (the control plane) wrapped in a wireframe shell.
 *  • Container "pods" orbiting on tilted rings.
 *  • Data packets streaming from the core out to each pod.
 *  • Click the core (or the Deploy button) and the pods are "scheduled":
 *    they leave their chaotic orbits and lock into one ordered ring.
 *
 * This module is lazy-loaded, so three.js only downloads when WebGL is
 * available and the browser is idle.
 */
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { SceneQuality } from './quality';

const COLORS = {
  ink: '#11141c',
  accent: '#2b3dff',
  signal: '#ff5a1f',
  frost: '#f6f5f1',
  line: '#0c0e13',
};

/** Orbital rings: radius, orientation and angular speed (rad/s). */
const RINGS = [
  { radius: 2.15, tilt: new THREE.Euler(1.18, 0.0, 0.38), speed: 0.34 },
  { radius: 2.75, tilt: new THREE.Euler(1.42, 0.22, -0.52), speed: 0.23 },
  { radius: 3.35, tilt: new THREE.Euler(1.02, -0.34, 0.92), speed: 0.15 },
].map((ring) => ({ ...ring, quaternion: new THREE.Quaternion().setFromEuler(ring.tilt) }));

const FORMATION_RADIUS = 2.6;
const FORMATION_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, 0.08));
const POD_MATERIALS = ['frost', 'accent', 'frost', 'ink', 'frost', 'signal', 'accent', 'frost'] as const;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* ───────────────────────────── Environment ───────────────────────────── */

/** Procedural studio reflections — no HDR file or network request needed. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
      room.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    };
  }, [gl, scene]);
  return null;
}

/* ───────────────────────────── Shared clock ───────────────────────────── */

interface Timeline {
  /** Scene time — frozen when motion is reduced. */
  t: number;
  /** 0 → orbiting, 1 → deployed formation (eased). */
  deploy: number;
  /** Hover energy on the core (eased). */
  hover: number;
}

/* ───────────────────────────── Scene graph ───────────────────────────── */

interface WorldProps {
  quality: SceneQuality;
  reducedMotion: boolean;
  deploying: boolean;
  onDeploy: () => void;
  onFirstFrame: () => void;
}

function World({ quality, reducedMotion, deploying, onDeploy, onFirstFrame }: WorldProps) {
  const { size, invalidate } = useThree();
  const timeline = useRef<Timeline>({ t: 4, deploy: 0, hover: 0 });
  const [hovered, setHovered] = useState(false);
  const firstFrame = useRef(false);

  const rig = useRef<THREE.Group>(null);
  const kernel = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const halo = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const pods = useRef<(THREE.Mesh | null)[]>([]);
  const links = useRef<THREE.LineSegments>(null);
  const packets = useRef<THREE.Points>(null);

  const podCount = quality.pods;

  /* ── Geometry & materials (created once) ── */
  const assets = useMemo(() => {
    const kernelGeo = new THREE.IcosahedronGeometry(0.98, 1);
    const shellGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.42, 0));
    const podGeo = new RoundedBoxGeometry(0.46, 0.3, 0.3, 3, 0.07);

    const materials = {
      // Polished gunmetal: a mid-grey base so the studio reflections read on each facet.
      kernel: new THREE.MeshStandardMaterial({
        color: '#7d8496',
        metalness: 1,
        roughness: 0.16,
        flatShading: true,
        envMapIntensity: 1.6,
      }),
      shell: new THREE.LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.5 }),
      frost: new THREE.MeshPhysicalMaterial({
        color: COLORS.frost,
        roughness: 0.32,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
      accent: new THREE.MeshStandardMaterial({ color: COLORS.accent, roughness: 0.28, metalness: 0.35 }),
      ink: new THREE.MeshStandardMaterial({ color: COLORS.ink, roughness: 0.25, metalness: 0.85 }),
      signal: new THREE.MeshStandardMaterial({
        color: COLORS.signal,
        roughness: 0.35,
        metalness: 0.1,
        emissive: COLORS.signal,
        emissiveIntensity: 0.25,
      }),
      ring: new THREE.LineBasicMaterial({ color: COLORS.line, transparent: true, opacity: 0.14 }),
      links: new THREE.LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.14 }),
      haloMain: new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.85 }),
      haloArc: new THREE.MeshBasicMaterial({ color: COLORS.signal }),
    };

    // Ring outlines
    const ringGeos = RINGS.map((ring) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        points.push(
          new THREE.Vector3(Math.cos(a) * ring.radius, 0, Math.sin(a) * ring.radius).applyQuaternion(ring.quaternion),
        );
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });

    // Soft round sprite for particles (generated, no image request)
    const sprite = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.85)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    })();

    const packetMat = new THREE.PointsMaterial({
      color: COLORS.accent,
      size: 0.075,
      map: sprite,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dustMat = new THREE.PointsMaterial({
      color: COLORS.line,
      size: 0.035,
      map: sprite,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    return { kernelGeo, shellGeo, podGeo, materials, ringGeos, sprite, packetMat, dustMat };
  }, []);

  /* ── Per-pod and per-packet parameters ── */
  const podSpecs = useMemo(
    () =>
      Array.from({ length: podCount }, (_, i) => ({
        ring: RINGS[i % RINGS.length],
        phase: i * GOLDEN * 2.1,
        spin: 0.3 + ((i * 37) % 10) / 20,
        material: POD_MATERIALS[i % POD_MATERIALS.length],
      })),
    [podCount],
  );

  const packetSpecs = useMemo(
    () =>
      Array.from({ length: quality.packets }, (_, i) => ({
        pod: i % podCount,
        phase: (i * 0.618) % 1,
        speed: 0.18 + ((i * 53) % 100) / 260,
      })),
    [quality.packets, podCount],
  );

  const linkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(podCount * 6), 3));
    return geo;
  }, [podCount]);

  const packetGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(quality.packets * 3), 3));
    return geo;
  }, [quality.packets]);

  const dustGeo = useMemo(() => {
    const positions = new Float32Array(quality.dust * 3);
    for (let i = 0; i < quality.dust; i++) {
      // Deterministic pseudo-random points in a spherical shell.
      const u = ((i * 0.754877666) % 1) * 2 - 1;
      const theta = i * GOLDEN;
      const r = 3.9 + ((i * 0.5698403) % 1) * 2.4;
      const s = Math.sqrt(1 - u * u);
      positions.set([Math.cos(theta) * s * r, u * r * 0.7, Math.sin(theta) * s * r], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [quality.dust]);

  useEffect(
    () => () => {
      assets.kernelGeo.dispose();
      assets.shellGeo.dispose();
      assets.podGeo.dispose();
      assets.ringGeos.forEach((g) => g.dispose());
      Object.values(assets.materials).forEach((m) => m.dispose());
      assets.packetMat.dispose();
      assets.dustMat.dispose();
      assets.sprite.dispose();
      linkGeo.dispose();
      packetGeo.dispose();
      dustGeo.dispose();
    },
    [assets, linkGeo, packetGeo, dustGeo],
  );

  // Re-render a still frame when state changes while motion is reduced.
  useEffect(() => {
    invalidate();
  }, [deploying, hovered, invalidate]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);

  /* ── Scratch objects reused every frame (no per-frame allocation) ── */
  const scratch = useMemo(
    () => ({
      orbit: new THREE.Vector3(),
      form: new THREE.Vector3(),
      qOrbit: new THREE.Quaternion(),
      qForm: new THREE.Quaternion(),
      euler: new THREE.Euler(),
      podPositions: Array.from({ length: podCount }, () => new THREE.Vector3()),
    }),
    [podCount],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const tl = timeline.current;

    if (!reducedMotion) tl.t += delta;
    const target = deploying ? 1 : 0;
    tl.deploy = reducedMotion ? target : THREE.MathUtils.damp(tl.deploy, target, 2.6, delta);
    tl.hover = reducedMotion ? (hovered ? 1 : 0) : THREE.MathUtils.damp(tl.hover, hovered ? 1 : 0, 6, delta);

    const t = tl.t;
    // Smoothstep for a more deliberate "snap" into formation.
    const k = tl.deploy * tl.deploy * (3 - 2 * tl.deploy);

    /* Rig: pointer parallax + gentle float */
    if (rig.current) {
      const portrait = size.width < size.height;
      const scale = portrait ? 0.74 : 1;
      rig.current.scale.setScalar(scale);
      if (!reducedMotion) {
        const px = state.pointer.x;
        const py = state.pointer.y;
        rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, px * 0.38, 3, delta);
        rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -py * 0.22, 3, delta);
        rig.current.position.y = Math.sin(t * 0.6) * 0.08;
      }
    }

    /* Core */
    if (kernel.current) {
      kernel.current.rotation.set(t * 0.12, t * 0.24, 0);
      const pulse = 1 + tl.hover * 0.08 + Math.sin(k * Math.PI) * 0.06;
      kernel.current.scale.setScalar(pulse);
    }
    if (shell.current) {
      shell.current.rotation.set(-t * 0.08, -t * 0.16, t * 0.05);
      shell.current.scale.setScalar(1 + tl.hover * 0.05 - k * 0.08);
      assets.materials.shell.opacity = 0.45 + tl.hover * 0.4 + k * 0.25;
    }
    if (halo.current) {
      halo.current.rotation.set(1.2 + Math.sin(t * 0.3) * 0.1, 0, t * 0.5);
    }
    if (dust.current) dust.current.rotation.y = t * 0.02;

    /* Pods: orbit ↔ formation */
    for (let i = 0; i < podCount; i++) {
      const pod = pods.current[i];
      const spec = podSpecs[i];
      const angle = spec.phase + t * spec.ring.speed;
      scratch.orbit
        .set(Math.cos(angle) * spec.ring.radius, 0, Math.sin(angle) * spec.ring.radius)
        .applyQuaternion(spec.ring.quaternion);

      const fa = (i / podCount) * Math.PI * 2 + t * 0.2;
      scratch.form.set(Math.cos(fa) * FORMATION_RADIUS, 0, Math.sin(fa) * FORMATION_RADIUS).applyQuaternion(FORMATION_Q);

      const p = scratch.podPositions[i].copy(scratch.orbit).lerp(scratch.form, k);
      if (!pod) continue;
      pod.position.copy(p);

      scratch.qOrbit.setFromEuler(scratch.euler.set(t * spec.spin + spec.phase, t * spec.spin * 0.7, spec.phase));
      scratch.qForm
        .setFromEuler(scratch.euler.set(0, -fa + Math.PI / 2, 0))
        .premultiply(FORMATION_Q);
      pod.quaternion.copy(scratch.qOrbit).slerp(scratch.qForm, k);
    }

    /* Links: core → pod */
    const linkPos = linkGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < podCount; i++) {
      const p = scratch.podPositions[i];
      linkPos.setXYZ(i * 2, 0, 0, 0);
      linkPos.setXYZ(i * 2 + 1, p.x, p.y, p.z);
    }
    linkPos.needsUpdate = true;
    assets.materials.links.opacity = 0.12 + k * 0.38 + tl.hover * 0.12;

    /* Packets travel outward along links — faster while deploying */
    const packetPos = packetGeo.attributes.position as THREE.BufferAttribute;
    const flow = 1 + k * 1.8;
    for (let i = 0; i < packetSpecs.length; i++) {
      const spec = packetSpecs[i];
      const u = (spec.phase + t * spec.speed * flow) % 1;
      const p = scratch.podPositions[spec.pod];
      // Start just outside the kernel so packets appear to leave it.
      const s = 0.32 + u * 0.68;
      packetPos.setXYZ(i, p.x * s, p.y * s, p.z * s);
    }
    packetPos.needsUpdate = true;

    if (!firstFrame.current) {
      firstFrame.current = true;
      onFirstFrame();
    }
  });

  const handleCoreClick = (event: ThreeEvent<MouseEvent>) => {
    // Ignore clicks that land on HTML controls layered above the canvas.
    const target = event.nativeEvent.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    event.stopPropagation();
    onDeploy();
  };

  return (
    <group ref={rig}>
      {/* Core */}
      <mesh
        ref={kernel}
        geometry={assets.kernelGeo}
        material={assets.materials.kernel}
        onClick={handleCoreClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      />
      <lineSegments ref={shell} geometry={assets.shellGeo} material={assets.materials.shell} />
      <group ref={halo}>
        <mesh material={assets.materials.haloMain}>
          <torusGeometry args={[1.78, 0.007, 6, 180]} />
        </mesh>
        <mesh material={assets.materials.haloArc} rotation={[0, 0, 0.6]}>
          <torusGeometry args={[1.9, 0.016, 6, 48, Math.PI * 0.32]} />
        </mesh>
      </group>

      {/* Orbits */}
      {assets.ringGeos.map((geo, i) => (
        <lineLoop key={i} geometry={geo} material={assets.materials.ring} />
      ))}

      {/* Pods */}
      {podSpecs.map((spec, i) => (
        <mesh
          key={i}
          ref={(el) => {
            pods.current[i] = el;
          }}
          geometry={assets.podGeo}
          material={assets.materials[spec.material]}
        />
      ))}

      <lineSegments ref={links} geometry={linkGeo} material={assets.materials.links} frustumCulled={false} />
      <points ref={packets} geometry={packetGeo} material={assets.packetMat} frustumCulled={false} />
      <points ref={dust} geometry={dustGeo} material={assets.dustMat} />
    </group>
  );
}

/* ───────────────────────────── Canvas ───────────────────────────── */

export interface OrchestrationSceneProps {
  quality: SceneQuality;
  reducedMotion: boolean;
  /** False while the hero is off-screen — rendering pauses completely. */
  active: boolean;
  deploying: boolean;
  eventSource?: HTMLElement;
  onDeploy: () => void;
  onReady: () => void;
  onContextLost: () => void;
}

export default function OrchestrationScene({
  quality,
  reducedMotion,
  active,
  deploying,
  eventSource,
  onDeploy,
  onReady,
  onContextLost,
}: OrchestrationSceneProps) {
  // Continuous rendering only while visible and animated; otherwise render on demand.
  const frameloop = !active ? 'never' : reducedMotion ? 'demand' : 'always';

  return (
    <Canvas
      frameloop={frameloop}
      dpr={quality.dpr}
      camera={{ position: [0, 0.35, 9.2], fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: quality.antialias, alpha: true, powerPreference: 'high-performance' }}
      eventSource={eventSource}
      aria-hidden="true"
      tabIndex={-1}
      onCreated={({ gl, setEvents }) => {
        // Events come from the whole hero section, but the canvas is offset
        // inside it — map the pointer into canvas space before raycasting.
        setEvents({
          compute: (event, state) => {
            const rect = gl.domElement.getBoundingClientRect();
            state.pointer.set(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            state.raycaster.setFromCamera(state.pointer, state.camera);
          },
        });
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onContextLost();
        });
      }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} />
      <directionalLight position={[-5, 1.5, -4]} intensity={2.4} color={COLORS.accent} />
      <World
        quality={quality}
        reducedMotion={reducedMotion}
        deploying={deploying}
        onDeploy={onDeploy}
        onFirstFrame={onReady}
      />
    </Canvas>
  );
}
