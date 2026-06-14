export default function LiveDemo() {
  return (
    <section id="live-demo" className="container mx-auto px-4 py-16 md:py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/5 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Live diagnostic flow</p>
            <h2 className="max-w-xl text-3xl font-black text-white md:text-4xl">A guided diagnostic loop from symptom to resolution path.</h2>
            <p className="text-muted-foreground">Users upload manuals, photos, and history, then Mantis returns root-cause hypotheses, maintenance recommendations, and confidence scores.</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• AI reads product docs and service history in seconds.</li>
              <li>• Flag likely causes, skipped checks, and follow-up actions.</li>
              <li>• Export diagnostics to PDF or share a digital incident report.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-white shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Session</p>
                <h3 className="text-xl font-semibold">Motor noise diagnostic</h3>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">98% confidence</span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ['Symptoms', 'Grinding noise at startup'],
                ['Investigation', 'Bearing wear + loose mounting bracket'],
                ['Diagnosis', 'Replace bearing assembly, tighten mount'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
