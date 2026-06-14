import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image?: string | null;
    status: string;
    company: {
      name: string;
      slug: string;
    };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/95"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400/80">{product.company.name}</p>
          <h3 className="text-2xl font-semibold tracking-tight text-white">{product.name}</h3>
        </div>
        <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">{product.status}</div>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-300">{product.description}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">View details →</span>
      </div>
    </Link>
  );
}
