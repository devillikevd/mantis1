const companies = ["Bosch", "Samsung", "Honda", "LG", "Tata", "Siemens", "Acer", "Philips"];

export default function CompanyMarquee() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-500/5">
        <p className="text-center text-sm uppercase tracking-[0.35em] text-cyan-200/80">Trusted by product and support teams</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
          {companies.map((company) => (
            <span key={company} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80">{company}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
