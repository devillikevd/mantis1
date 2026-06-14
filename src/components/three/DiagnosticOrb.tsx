"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Orb({ isProcessing }: { isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const speedMultiplier = isProcessing ? 4.0 : 1.0;
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speedMultiplier;
      meshRef.current.rotation.y += 0.015 * speedMultiplier;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x += 0.005 * speedMultiplier;
      wireRef.current.rotation.y += 0.01 * speedMultiplier;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.35, 64, 64]}>
        <MeshDistortMaterial
          color={isProcessing ? "#22d3ee" : "#6366f1"}
          emissive={isProcessing ? "#22d3ee" : "#000000"}
          emissiveIntensity={isProcessing ? 0.8 : 0}
          attach="material"
          distort={isProcessing ? 0.6 : 0.35}
          speed={isProcessing ? 3.0 : 1.4}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>
      <Sphere ref={wireRef} args={[1.95, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={isProcessing ? 0.6 : 0.25} wireframe />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={isProcessing ? 5.0 : 2.5} color="#22d3ee" />
      <ambientLight intensity={0.8} />
      <Particles isProcessing={isProcessing} />
    </group>
  );
}

function Particles({ isProcessing }: { isProcessing: boolean }) {
  const points = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      return {
        angle,
        x: Math.cos(angle) * 2.8,
        y: Math.sin(angle * 2) * 0.7,
        z: Math.sin(angle) * 2.8,
      };
    });
  }, []);

  return (
    <>
      {points.map((p, i) => <Particle key={i} x={p.x} y={p.y} z={p.z} angle={p.angle} isProcessing={isProcessing} />)}
    </>
  );
}

function Particle({ x, y, z, angle, isProcessing }: { x: number; y: number; z: number; angle: number; isProcessing: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const speedMultiplier = isProcessing ? 3.0 : 1.0;
    ref.current.position.set(
      Math.cos(angle + t * 0.4 * speedMultiplier) * (isProcessing ? 3.2 : 2.8),
      Math.sin(angle * 2 + t * 0.35 * speedMultiplier) * (isProcessing ? 1.2 : 0.8),
      Math.sin(angle + t * 0.4 * speedMultiplier) * (isProcessing ? 3.2 : 2.8)
    );
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[isProcessing ? 0.08 : 0.04, 10, 10]} />
      <meshBasicMaterial color={isProcessing ? "#ffffff" : "#67e8f9"} />
    </mesh>
  );
}

export default function DiagnosticOrb({ isProcessing = false }: { isProcessing?: boolean }) {
  return (
    <div className="h-[280px] w-full max-w-[340px] rounded-full">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <Orb isProcessing={isProcessing} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
