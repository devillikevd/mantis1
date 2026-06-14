"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ImageScanner({ image, onComplete, onCancel }: { image: string | null; onComplete: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!image) return;
    
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 4500),
      setTimeout(() => onComplete(), 5500)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [image, onComplete]);

  const steps = [
    "INITIALIZING CV CORE...",
    "EXTRACTING FEATURES...",
    "ANALYZING FAULT VECTORS...",
    "MATCHING SCHEMATICS..."
  ];

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <button onClick={onCancel} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="w-full max-w-3xl aspect-video relative overflow-hidden rounded-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] bg-black">
          {/* Background Image */}
          <img src={image} alt="Scanning target" className="w-full h-full object-contain opacity-60" />
          
          {/* Scanning Laser */}
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatType: "reverse" }}
            className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.8)] z-20"
          />
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay z-10"></div>
          
          {/* HUD Elements */}
          <div className="absolute inset-0 border-2 border-cyan-500/20 m-8 rounded-lg pointer-events-none z-30 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
            </div>
            
            <div className="text-center font-mono text-cyan-400 text-sm md:text-xl font-bold tracking-widest drop-shadow-md">
              {steps[step]}
            </div>
            
            <div className="flex justify-between items-end">
              <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="flex items-center gap-2">
                <ScanSearch className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-xs text-cyan-400">TARGET ACQUIRED</span>
              </div>
              <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
