"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navigation2, MapPin, CheckCircle2, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function DispatchRadar({ onComplete }: { onComplete: () => void }) {
  const [eta, setEta] = useState(14);
  const [phase, setPhase] = useState<"SEARCHING" | "DISPATCHED">("SEARCHING");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("DISPATCHED"), 4000);
    const t2 = setInterval(() => {
      setEta((prev) => (prev > 2 ? prev - 1 : prev));
    }, 60000); // decrement eta every minute

    return () => {
      clearTimeout(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617] overflow-hidden"
      >
        {/* Radar Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[800px] h-[800px] rounded-full border border-emerald-500/30"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full border border-emerald-500/40"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/50"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full border border-emerald-500/80"></div>
          <div className="absolute w-full h-[1px] bg-emerald-500/30"></div>
          <div className="absolute h-full w-[1px] bg-emerald-500/30"></div>
          
          {/* Radar Sweep */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute w-[400px] h-[400px] origin-bottom-right bottom-1/2 right-1/2"
            style={{
              background: "conic-gradient(from 90deg at 100% 100%, transparent 0deg, rgba(16, 185, 129, 0.4) 90deg)",
              borderRight: "2px solid #10b981"
            }}
          />

          {/* Targets */}
          {phase === "SEARCHING" && (
            <>
              <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute top-[70%] left-[30%] w-3 h-3 bg-emerald-400 rounded-full animate-ping delay-700"></div>
            </>
          )}
        </div>

        {/* Dispatch Panel */}
        <div className="relative z-10 w-full max-w-md p-6 rounded-2xl border border-emerald-500/30 bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-emerald-400 font-mono text-sm tracking-widest mb-1">
                {phase === "SEARCHING" ? "LOCATING TECHNICIAN..." : "TECHNICIAN DISPATCHED"}
              </p>
              <h2 className="text-3xl font-black text-white">
                {phase === "SEARCHING" ? "Standby" : `ETA: ${eta} mins`}
              </h2>
            </div>
            {phase === "SEARCHING" ? (
              <Navigation2 className="w-8 h-8 text-emerald-500 animate-spin" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <UserCircle2 className="w-10 h-10 text-emerald-400" />
              <div>
                <p className="text-white font-semibold">{phase === "SEARCHING" ? "Searching..." : "Vikram S."}</p>
                <p className="text-emerald-400/80 text-sm">{phase === "SEARCHING" ? "Nearest hub" : "Senior Field Engineer"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <MapPin className="w-10 h-10 text-emerald-400" />
              <div>
                <p className="text-white font-semibold">Location</p>
                <p className="text-emerald-400/80 text-sm">Sector 62, Noida Hub</p>
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            disabled={phase === "SEARCHING"}
            className="w-full mt-8 py-3 rounded-lg font-bold tracking-widest uppercase transition-all
              disabled:bg-slate-800 disabled:text-slate-500
              bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            {phase === "SEARCHING" ? "SEARCHING..." : "RETURN TO DASHBOARD"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
