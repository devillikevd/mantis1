import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let session;

  try {
    session = await auth();
  } catch (error) {
    console.error("Dashboard auth error:", error);
    session = null;
  }

  if (!session?.user?.email) {
    redirect("/login");
  }

  let user = null;
  let dbError = false;

  try {
    user = await prisma.user.findUnique({
      where: { id: (session.user as { id?: string }).id ?? "" },
      include: {
        companies: {
          include: {
            products: {
              where: { status: "ACTIVE" },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Dashboard DB error:", error);
    dbError = true;
  }

  const totalProducts = user?.companies.reduce((sum, company) => sum + company.products.length, 0) ?? 0;
  const totalCompanies = user?.companies.length ?? 0;

  if (!user && dbError) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_30%),linear-gradient(180deg,#04070f_0%,#070b14_45%,#04070f_100%)] text-foreground py-24">
        <div className="container mx-auto px-4">
          <section className="rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-8 text-amber-50 shadow-2xl shadow-amber-500/10">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-100/80">Live status</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">Dashboard is running in safe fallback mode</h1>
            <p className="mt-3 max-w-2xl text-sm text-amber-50/90 md:text-base">
              The database connection is currently unavailable, so the dashboard is showing a stable fallback view instead of crashing. This keeps the app usable while the database env is fixed.
            </p>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Companies</p>
              <p className="mt-4 text-4xl font-black text-white">{totalCompanies}</p>
              <p className="mt-2 text-sm text-slate-300">Live company profiles are unavailable right now.</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Products</p>
              <p className="mt-4 text-4xl font-black text-white">{totalProducts}</p>
              <p className="mt-2 text-sm text-slate-300">The product catalog is currently being restored.</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Status</p>
              <p className="mt-4 text-2xl font-black text-emerald-300">Fallback</p>
              <p className="mt-2 text-sm text-slate-300">You can continue using the landing and auth pages while the database is repaired.</p>
            </article>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_30%),linear-gradient(180deg,#04070f_0%,#070b14_45%,#04070f_100%)] text-foreground py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Company dashboard</p>
            <h1 className="text-3xl font-black text-white md:text-4xl">Welcome back, {user.name ?? session.user.email}</h1>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Manage your product listings, monitor diagnostic-ready assets, and keep your support workflows close at hand.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-600 hover:to-cyan-600"
            >
              Explore marketplace
            </Link>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              Open analytics
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Companies</p>
            <p className="mt-4 text-4xl font-black text-white">{totalCompanies}</p>
            <p className="mt-2 text-sm text-slate-300">Active business profiles linked to your account.</p>
          </article>
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Products</p>
            <p className="mt-4 text-4xl font-black text-white">{totalProducts}</p>
            <p className="mt-2 text-sm text-slate-300">AI-ready products available in the marketplace.</p>
          </article>
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Status</p>
            <p className="mt-4 text-2xl font-black text-emerald-300">Live</p>
            <p className="mt-2 text-sm text-slate-300">Diagnostics, documents, and support pages are connected for each listing.</p>
          </article>
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Your teams</p>
              <h2 className="text-2xl font-semibold text-white">Company overview</h2>
            </div>
          </div>

          {user.companies.length === 0 ? (
            <article className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/80 p-10 text-center shadow-xl shadow-slate-900/20">
              <h3 className="text-xl font-semibold text-white">No companies linked yet</h3>
              <p className="mt-3 text-sm text-slate-300">Create or connect a company profile to start publishing products and diagnostic assets.</p>
            </article>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {user.companies.map((company) => (
                <article key={company.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Company</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{company.name}</h3>
                      <p className="mt-2 text-sm text-slate-300">{company.website ?? "No website linked yet"}</p>
                    </div>
                    <Link
                      href={`/companies/${company.slug}`}
                      className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100 hover:bg-cyan-400/20"
                    >
                      View
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">GST</p>
                      <p className="mt-2 text-sm text-slate-200">{company.gstNumber ?? "Not provided"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Products</p>
                      <p className="mt-2 text-sm text-slate-200">{company.products.length} active listing(s)</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Product listings</p>
                    {company.products.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">No products published yet.</p>
                    ) : (
                      company.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30 hover:bg-white/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-white">{product.name}</p>
                              <p className="mt-1 text-sm text-slate-300 line-clamp-2">{product.description}</p>
                            </div>
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-200">Live</span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
