"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

type Vec2 = { x: number; y: number };

function useMouseParallax() {
  const [target, setTarget] = React.useState<Vec2>({ x: 0, y: 0 });
  const [current, setCurrent] = React.useState<Vec2>({ x: 0, y: 0 });

  React.useEffect(() => {
    const handle = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setTarget({ x, y });
    };
    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  useFrame(() => {
    setCurrent((prev) => ({
      x: prev.x + (target.x - prev.x) * 0.04,
      y: prev.y + (target.y - prev.y) * 0.04,
    }));
  });

  return current;
}

function CitySilhouette() {
  const mouse = useMouseParallax();

  const blocks = React.useMemo(
    () =>
      [
        { w: 0.22, h: 0.6, x: -1.7, depth: 0.18 },
        { w: 0.26, h: 0.85, x: -1.45, depth: 0.2 },
        { w: 0.18, h: 1.3, x: -1.2, depth: 0.16 },
        { w: 0.32, h: 1.6, x: -0.9, depth: 0.22 },
        { w: 0.2, h: 1.1, x: -0.55, depth: 0.18 },
        { w: 0.24, h: 1.9, x: -0.25, depth: 0.22 },
        { w: 0.18, h: 1.4, x: 0.05, depth: 0.16 },
        { w: 0.3, h: 1.8, x: 0.38, depth: 0.2 },
        { w: 0.2, h: 1.2, x: 0.75, depth: 0.18 },
        { w: 0.24, h: 1.55, x: 1.05, depth: 0.2 },
        { w: 0.18, h: 0.95, x: 1.35, depth: 0.16 },
        { w: 0.22, h: 1.25, x: 1.6, depth: 0.18 },
        { w: 0.18, h: 0.7, x: -1.0, depth: 0.16 },
        { w: 0.18, h: 0.8, x: 1.0, depth: 0.16 },
      ] as Array<{ w: number; h: number; x: number; depth: number }>,
    []
  );

  useFrame((state) => {
    state.scene.traverse((obj) => {
      if (obj.name === "city-pulse") {
        const t = state.clock.getElapsedTime();
        obj.position.y = -0.8 + Math.sin(t * 0.4) * 0.03;
      }
    });
  });

  const windTiltX = mouse.y * 0.05;
  const parallaxX = mouse.x * 0.2;

  return (
    <group
      name="city-pulse"
      position={[0.3 + parallaxX, -0.2, 0]}
      rotation={[windTiltX, -0.15, 0.05]}
    >
      {blocks.map((b, index) => (
        <mesh key={index} position={[b.x, -0.3 + b.h / 2, -index * 0.02]}>
          <boxGeometry args={[b.w, b.h, b.depth]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#0f172a" : "#020617"}
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>
      ))}

      {blocks.map((b, index) => (
        <mesh
          key={`glow-${index}`}
          position={[b.x, -0.1 + b.h, -index * 0.025 - 0.12]}
        >
          <boxGeometry args={[b.w * 0.9, 0.02, 0.02]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#fb923c" : "#facc15"}
            emissive={index % 2 === 0 ? "#fdba74" : "#facc15"}
            emissiveIntensity={1.2}
            roughness={0.4}
          />
        </mesh>
      ))}

      <mesh position={[0.9, 0.3, -0.5]}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#38bdf8"
          emissiveIntensity={0.7}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      <mesh position={[-0.8, 0.15, -0.4]}>
        <sphereGeometry args={[0.24, 40, 40]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#fdba74"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      <mesh position={[0, -0.85, -0.3]}>
        <planeGeometry args={[5, 0.9]} />
        <meshStandardMaterial
          color="#020617"
          transparent
          opacity={0.75}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

export function SoothingAuthScene() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    const connection = (
      navigator as unknown as { connection?: { saveData?: boolean } }
    ).connection;
    const slow = connection?.saveData === true;
    setEnabled(!reduced && !slow);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_10%_0%,rgba(251,146,60,0.25),transparent_60%),radial-gradient(80%_80%_at_90%_20%,rgba(56,189,248,0.3),transparent_60%),radial-gradient(80%_80%_at_50%_90%,rgba(15,23,42,0.9),transparent_70%)] dark:bg-[radial-gradient(80%_80%_at_10%_0%,rgba(251,146,60,0.18),transparent_60%),radial-gradient(80%_80%_at_90%_20%,rgba(56,189,248,0.26),transparent_60%),radial-gradient(80%_80%_at_50%_90%,rgba(15,23,42,1),transparent_70%)]" />
      <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[rgb(var(--accent))] opacity-[0.08] blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-[640px] w-[640px] rounded-full bg-sky-500 opacity-[0.08] blur-3xl" />

      <div className="absolute right-0 top-0 hidden h-full w-[46%] min-w-[420px] md:block">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], zoom: 180 }}
          gl={{ antialias: true, alpha: true }}
        >
          <OrthographicCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 10]} intensity={1.3} />
          <directionalLight position={[-6, 4, 6]} intensity={0.8} />
          <CitySilhouette />
        </Canvas>
      </div>
    </div>
  );
}

