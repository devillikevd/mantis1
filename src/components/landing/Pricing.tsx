const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For small teams validating diagnostics workflows.",
    features: ["10 products", "AI triage", "PDF exports"],
  },
  {
    name: "Growth",
    price: "$99",
    description: "For companies scaling support coverage across product lines.",
    features: ["Unlimited products", "Media analysis", "Team analytics"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Advanced deployment, security, and integration controls.",
    features: ["SSO", "API access", "Dedicated support"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Pricing</p>
        <h2 className="text-3xl font-black text-white md:text-4xl">Start small. Scale with your support operations.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={['rounded-3xl border p-6 shadow-xl shadow-indigo-500/5', plan.featured ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-white/5'].join(' ')}>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">{plan.name}</p>
            <h3 className="mt-4 text-4xl font-black text-white">{plan.price}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/90">
              {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
