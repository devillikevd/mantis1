const stats = [
  { value: "95%", label: "diagnostic accuracy" },
  { value: "2.3x", label: "faster issue resolution" },
  { value: "24/7", label: "AI coverage" },
  { value: "99.2%", label: "confidence in findings" },
];

export default function Stats() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl shadow-indigo-500/5">
            <p className="text-4xl font-black text-white">{stat.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-cyan-200/80">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
