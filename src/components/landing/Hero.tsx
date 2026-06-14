"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiagnosticOrb = dynamic(() => import("@/components/three/DiagnosticOrb"), {
  ssr: false,
  loading: () => <div className="h-[280px] w-full max-w-[340px] rounded-full border border-border bg-background/70 animate-pulse" />,
});
import ParticleBackground from "@/components/effects/ParticleBackground";
import TypewriterText from "@/components/effects/TypewriterText";

const products = [
  "Honda Activa 6G • vibration + battery",
  "Samsung RF28 Fridge • cooling anomaly",
  "Bosch GSB 500W Drill • motor overload",
  "Honda CB Shine SP • ignition fault",
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <ParticleBackground />
      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 shadow-lg shadow-cyan-500/10">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              AI-Powered Diagnostics
            </div>

            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                Your products.<br />
                <span className="gradient-text">Diagnosed.</span><br />
                Instantly.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                Mantis reads manuals, maintenance history, and symptom data to generate expert-grade diagnostic pathways for support teams and product companies.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="#live-demo">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">Try Live Demo <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
              <Link href="/signup?role=company">
                <Button size="lg" variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">List Your Products</Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/20">
              <div className="flex -space-x-2">{[1,2,3,4].map((i)=><span key={i} className="h-9 w-9 rounded-full border border-background bg-gradient-to-br from-indigo-500 to-cyan-500" />)}</div>
              <div>
                <p className="text-sm text-white">Trusted by 50+ companies</p>
                <p className="text-xs text-muted-foreground">1,200+ products • 99.2% resolution confidence</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative mx-auto flex h-[420px] w-full max-w-[520px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-indigo-500/10">
            <DiagnosticOrb />
            <div className="mt-6 w-full text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Current diagnosis</p>
              <TypewriterText texts={products} className="mt-2 text-lg font-semibold text-cyan-100" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
