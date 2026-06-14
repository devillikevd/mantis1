"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Orb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      wireRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.35, 64, 64]}>
        <MeshDistortMaterial color="#6366f1" attach="material" distort={0.35} speed={1.4} roughness={0.2} metalness={0.6} />
      </Sphere>
      <Sphere ref={wireRef} args={[1.95, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} wireframe />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#22d3ee" />
      <ambientLight intensity={0.8} />
      <Particles />
    </group>
  );
}

function Particles() {
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
      {points.map((p, i) => <Particle key={i} x={p.x} y={p.y} z={p.z} angle={p.angle} />)}
    </>
  );
}

function Particle({ x, y, z, angle }: { x: number; y: number; z: number; angle: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.set(Math.cos(angle + t * 0.4) * 2.8, Math.sin(angle * 2 + t * 0.35) * 0.8, Math.sin(angle + t * 0.4) * 2.8);
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[0.04, 10, 10]} />
      <meshBasicMaterial color="#67e8f9" />
    </mesh>
  );
}

export default function DiagnosticOrb() {
  return (
    <div className="h-[280px] w-full max-w-[340px] rounded-full">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <Orb />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
