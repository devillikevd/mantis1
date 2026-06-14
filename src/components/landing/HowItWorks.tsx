const steps = [
  { title: "Capture the issue", text: "Upload manuals, photos, and field notes in seconds." },
  { title: "Reason through the symptom", text: "Mantis creates a diagnostic trail with evidence and confidence." },
  { title: "Deliver the fix", text: "Share resolution steps, parts, and next actions in one workflow." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">How it works</p>
        <h2 className="text-3xl font-black text-white md:text-4xl">Built for support teams, product teams, and field services.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-500/5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-sm font-black text-white">0{index + 1}</div>
            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
