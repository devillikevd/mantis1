"use client";

import type { MindMapLink, MindMapNode } from "@/types";

interface MindMapProps {
  nodes: MindMapNode[];
  links: MindMapLink[];
}

const colorFor = (type: MindMapNode["type"]) => {
  switch (type) {
    case "product":
      return "from-indigo-500 to-cyan-500";
    case "symptom":
      return "from-cyan-400 to-sky-400";
    case "cause":
      return "from-amber-400 to-orange-400";
    case "confirmed":
      return "from-emerald-400 to-green-400";
    default:
      return "from-slate-500 to-slate-400";
  }
};

export default function MindMap({ nodes, links }: MindMapProps) {
  if (nodes.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">Mind map will appear as the session progresses.</div>;
  }

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-muted-foreground">
        <span>Mind map</span>
        <span>{nodes.length} nodes</span>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => (
          <div key={node.id} className="rounded-2xl border border-border bg-muted/70 p-3">
            <div className={`mb-2 h-2 w-full rounded-full bg-linear-to-r ${colorFor(node.type)}`} />
            <div className="text-sm font-semibold text-white">{node.label}</div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{node.type}</div>
          </div>
        ))}

        {links.length > 0 && (
          <div className="rounded-2xl border border-border bg-background/70 p-3 text-xs text-muted-foreground">
            {links.length} relationship link(s) captured in this session.
          </div>
        )}
      </div>
    </div>
  );
}
