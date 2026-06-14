"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, Sparkles, Wrench } from "lucide-react";

interface DiagnosticPanelProps {
  product: any;
}

const symptomPresets = [
  "Startup noise",
  "Overheating",
  "Intermittent alert",
  "Low power output",
];

export default function DiagnosticPanel({ product }: DiagnosticPanelProps) {
  const [selectedSymptom, setSelectedSymptom] = useState("Startup noise");

  const diagnosis = useMemo(() => {
    const map: Record<string, { confidence: string; summary: string; rootCause: string[]; steps: string[]; nextAction: string; }> = {
      "Startup noise": {
        confidence: "91%",
        summary: "Likely a lubrication or bearing issue during cold start, consistent with a high-load startup sequence.",
        rootCause: ["Wear in the drive assembly", "Reduced lubrication at startup", "Loose mounting bracket"],
        steps: ["Inspect the drive train and seal condition", "Verify lubrication history and replacement interval", "Run a short vibration check under load"],
        nextAction: "Schedule a technician inspection and compare with the latest maintenance log.",
      },
      Overheating: {
        confidence: "87%",
        summary: "Thermal load is likely elevated because airflow or cooling performance is under-performing.",
        rootCause: ["Blocked cooling path", "High ambient operating load", "Sensor drift in thermal feedback"],
        steps: ["Clean vents and cooling surfaces", "Confirm fan or pump performance", "Validate temperature thresholds in the current operating mode"],
        nextAction: "Use the diagnostic board to capture live temperature data before dispatching parts.",
      },
      "Intermittent alert": {
        confidence: "83%",
        summary: "The alert pattern suggests an unstable connection or sensor reading rather than a permanent fault.",
        rootCause: ["Loose sensor harness", "Transient power drop", "Firmware threshold mismatch"],
        steps: ["Inspect connector seating and cable strain", "Review recent firmware and calibration changes", "Re-run the alert sequence under normal load"],
        nextAction: "Collect a short incident log and compare it with previous service notes.",
      },
      "Low power output": {
        confidence: "89%",
        summary: "The system is likely under-delivering because of energy conversion or efficiency losses in the core module.",
        rootCause: ["Reduced input efficiency", "Airflow or filter restriction", "Aging component under load"],
        steps: ["Measure input and output power at baseline load", "Inspect filters and intake restrictions", "Verify component wear against the maintenance calendar"],
        nextAction: "Prepare a parts and service checklist for the next field intervention.",
      },
    };

    return map[selectedSymptom] ?? map["Startup noise"];
  }, [selectedSymptom]);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-cyan-200/80">
              <Bot className="h-4 w-4" /> AI Diagnostic Assistant
            </p>
            <h2 className="text-3xl font-black text-white">Triage {product.name} with guided recommendations</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              This workflow blends the product profile, service history, and symptom signals into a practical next-step plan for support teams.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Live confidence</div>
            <div className="mt-1 text-2xl font-bold">{diagnosis.confidence}</div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-3xl p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-3 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Describe the symptom</h3>
              <p className="text-sm text-muted-foreground">Choose a scenario to preview a diagnostic path.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {symptomPresets.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => setSelectedSymptom(symptom)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedSymptom === symptom
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                    : "border-border bg-muted/70 text-muted-foreground hover:border-cyan-500/60 hover:text-white"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/70 p-5">
            <label className="mb-2 block text-sm font-medium text-white">Symptom notes</label>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-border bg-muted/70 px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              defaultValue={`The ${product.name.toLowerCase()} issue appears during startup and the support team reports a recurring noise pattern.`}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" /> Recommended AI response
            </div>
            <p>{diagnosis.summary}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <article className="glass rounded-3xl p-8">
            <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-cyan-200/80">
              <Wrench className="h-4 w-4" /> Root-cause signals
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {diagnosis.rootCause.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass rounded-3xl p-8">
            <h3 className="text-xl font-semibold">Suggested next steps</h3>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {diagnosis.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-100">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="glass rounded-3xl p-8">
            <h3 className="text-xl font-semibold">Recommended action</h3>
            <p className="mt-3 text-sm text-muted-foreground">{diagnosis.nextAction}</p>
            <button className="mt-5 inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:from-indigo-600 hover:to-cyan-600">
              Save diagnostic summary
            </button>
          </article>
        </motion.section>
      </div>
    </div>
  );
}
