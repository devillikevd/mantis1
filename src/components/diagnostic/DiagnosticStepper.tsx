"use client";

import { motion } from "framer-motion";
import { AlertCircle, Search, Activity, CheckCircle } from "lucide-react";
import type { DiagPhase } from "@/types";

interface DiagnosticStepperProps {
  currentPhase: DiagPhase;
  confidence: number;
}

const steps = [
  { phase: "SYMPTOMS" as const, label: "Symptoms", icon: AlertCircle, color: "text-red-400" },
  { phase: "INVESTIGATION" as const, label: "Investigation", icon: Search, color: "text-yellow-400" },
  { phase: "DIAGNOSIS" as const, label: "Diagnosis", icon: Activity, color: "text-orange-400" },
  { phase: "RESOLUTION" as const, label: "Resolution", icon: CheckCircle, color: "text-green-400" },
];

export default function DiagnosticStepper({ currentPhase, confidence }: DiagnosticStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.phase === currentPhase);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background/80 p-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.phase} className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/20"
                      : isCompleted
                        ? "border-green-500 bg-green-500/10"
                        : "border-muted bg-muted/20"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isCompleted ? "text-green-400" : isActive ? step.color : "text-muted-foreground"}`} />
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{step.label}</div>
                {isActive && confidence > 0 && <div className="text-[10px] text-muted-foreground">{confidence}% confident</div>}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden flex-1 items-center md:flex">
                  <div className="h-0.5 w-full rounded-full bg-border">
                    {isCompleted && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full rounded-full bg-gradient-to-r from-green-500 to-indigo-500" />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
