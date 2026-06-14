"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Activity, Database, Server, Zap } from "lucide-react";

export default function SystemMetrics({ isProcessing = false }: { isProcessing?: boolean }) {
  const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 20 + Math.random() * 10 })));
  const [vectors, setVectors] = useState(14502);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: isProcessing ? 60 + Math.random() * 40 : 20 + Math.random() * 10 }];
        return newData;
      });
      
      if (isProcessing) {
        setVectors((prev) => prev + Math.floor(Math.random() * 5));
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="glass rounded-3xl p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          System Metrics
        </h4>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isProcessing ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{isProcessing ? "PROCESSING" : "ONLINE"}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> RAG Latency</div>
            <div className="text-xs font-mono text-cyan-300">{Math.round(data[data.length - 1].value)}ms</div>
          </div>
          <div className="h-[40px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <YAxis domain={[0, 100]} hide />
                <Line type="monotone" dataKey="value" stroke={isProcessing ? "#6366f1" : "#22d3ee"} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1"><Database className="h-3 w-3" /> Vectors</div>
             <div className="text-lg font-mono text-white">{vectors.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1"><Server className="h-3 w-3" /> Nodes</div>
             <div className="text-lg font-mono text-white">4 / 4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
