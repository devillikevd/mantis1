"use client";

import { motion } from "framer-motion";
import type { DiagPhase } from "@/types";

interface ConfidenceGaugeProps {
  confidence: number;
  phase: DiagPhase;
}

export default function ConfidenceGauge({ confidence, phase }: ConfidenceGaugeProps) {
  const getPhaseLabel = () => {
    switch (phase) {
      case "SYMPTOMS":
        return "Gathering symptoms";
      case "INVESTIGATION":
        return "Investigating causes";
      case "DIAGNOSIS":
        return "Identifying root cause";
      case "RESOLUTION":
        return "Solution confirmed";
      default:
        return "Analyzing";
    }
  };

  const getColor = () => {
    if (confidence < 30) return "#ef4444";
    if (confidence < 60) return "#f59e0b";
    if (confidence < 80) return "#eab308";
    return "#10b981";
  };

  return (
    <section className="glass rounded-2xl p-5">
      <h4 className="mb-4 text-sm font-semibold text-white">Diagnosis Confidence</h4>
      <div className="mx-auto flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 352" }}
            animate={{ strokeDasharray: `${(confidence / 100) * 352} 352` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center">
          <motion.div key={confidence} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ color: getColor() }} className="text-3xl font-black">
            {confidence}%
          </motion.div>
          <div className="mt-1 text-xs text-muted-foreground">{getPhaseLabel()}</div>
        </div>
      </div>
    </section>
  );
}
