import { notFound } from "next/navigation";
import Link from "next/link";

import { getMarketplaceCompany } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
};

export default async function CompanyPage({ params }: Props) {
  const company = await getMarketplaceCompany(params.slug);

  if (!company) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-xl shadow-slate-900/20">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Company profile</p>
              <h1 className="text-4xl font-black text-white">{company.name}</h1>
              {company.website && (
                <Link href={company.website} className="text-cyan-300 hover:text-cyan-200" target="_blank" rel="noreferrer">
                  {company.website}
                </Link>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">GST Number</p>
                <p className="mt-3 text-sm text-slate-300">{company.gstNumber ?? "Not provided"}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Products</p>
                <p className="mt-3 text-sm text-slate-300">{company.products.length} active listing(s)</p>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-xl shadow-slate-900/20">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">About this company</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {company.name} is an AI-enabled product partner offering diagnostic-ready listings for support teams.
            </p>
          </aside>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Active product listings</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {company.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/95"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">{product.name}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300 line-clamp-3">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
