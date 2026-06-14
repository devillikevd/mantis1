import ProductCard from "@/components/products/ProductCard";
import { getMarketplaceProducts } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getMarketplaceProducts();

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Marketplace</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Browse AI-ready products and support packages
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-slate-300">
            Explore product listings, compare pricing, and find the right products for your team.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
