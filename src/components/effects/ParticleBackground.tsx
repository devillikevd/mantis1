"use client";

import { useEffect, useMemo, useState } from "react";

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(() => Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 4,
    delay: `${Math.random() * 2}s`,
  })), []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.06),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.04),_transparent_25%)]" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400/30"
          style={{ left: particle.left, top: particle.top, animation: `float ${particle.duration}s ease-in-out infinite`, animationDelay: particle.delay }}
        />
      ))}
    </div>
  );
}
