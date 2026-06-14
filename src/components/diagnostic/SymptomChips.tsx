"use client";

import { motion } from "framer-motion";

interface SymptomChipsProps {
  category?: string;
  onSelect?: (symptom: string) => void;
}

const symptomsByCategory: Record<string, string[]> = {
  Automotive: ["Won't start", "Strange noise", "Poor mileage", "Overheating", "Brake issue", "Electrical problem"],
  Appliances: ["Not cooling", "Making noise", "Not turning on", "Leaking water", "Error code", "Poor performance"],
  "Power Tools": ["Won't start", "Overheating", "Weak power", "Vibration issue", "Battery problem", "Sparking"],
  Default: ["Not working", "Strange behavior", "Error message", "Performance issue", "Physical damage", "Other"],
};

export default function SymptomChips({ category = "Default", onSelect }: SymptomChipsProps) {
  const symptoms = symptomsByCategory[category] || symptomsByCategory.Default;

  return (
    <section className="glass rounded-2xl p-5">
      <h4 className="mb-3 text-sm font-semibold text-white">Quick Symptoms</h4>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom, index) => (
          <motion.button
            key={symptom}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            type="button"
            onClick={() => onSelect?.(symptom)}
            className="rounded-full border border-border bg-muted/70 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-100"
          >
            {symptom}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
