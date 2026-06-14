const features = [
  {
    title: "Intelligent triage",
    text: "Classify symptoms, isolate root causes, and prioritize troubleshooting steps using contextual reasoning.",
  },
  {
    title: "Manual + media intelligence",
    text: "Analyze PDFs, images, videos, and field notes in one place for rapid issue understanding.",
  },
  {
    title: "Action-ready support",
    text: "Generate maintenance plans, parts lists, and escalation notes the team can act on immediately.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Features</p>
        <h2 className="text-3xl font-black text-white md:text-4xl">Everything needed to move from symptom to resolution.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-500/5 hover:border-cyan-400/30 hover:bg-white/8 transition-all">
            <div className="mb-4 h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500" />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
