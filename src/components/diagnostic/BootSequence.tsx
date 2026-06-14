"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "[0.000] INITIALIZING MANTIS OS v4.2.0...",
  "[0.124] ESTABLISHING SECURE CONNECTION...",
  "[0.248] LOADING NEURAL WEIGHTS [██████████] 100%",
  "[0.372] CONNECTING TO MOSS VECTOR DATABASE...",
  "[0.496] RETRIEVING PRODUCT SCHEMATICS...",
  "[0.620] CALIBRATING SENSORS...",
  "[0.744] BYPASSING FIREWALL... SUCCESS",
  "[0.868] AI CORE ONLINE.",
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let delay = 0;
    
    BOOT_LOGS.forEach((log, index) => {
      delay += 150 + Math.random() * 200;
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, delay);
    });

    setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 800); // Wait for fade out
    }, delay + 600);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] font-mono text-sm text-cyan-400 p-8"
        >
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.5)]">
                <span className="text-3xl font-black text-white">M</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === BOOT_LOGS.length - 1 ? "text-indigo-400 font-bold" : ""}
                >
                  {log}
                </motion.div>
              ))}
              {logs.length < BOOT_LOGS.length && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block h-4 w-2 bg-cyan-400"
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
