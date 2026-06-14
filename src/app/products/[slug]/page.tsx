import { notFound } from "next/navigation";
import { Bot } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHero from "@/components/product-detail/ProductHero";
import OverviewTab from "@/components/product-detail/OverviewTab";
import DocumentationTab from "@/components/product-detail/DocumentationTab";
import MaintenanceTab from "@/components/product-detail/MaintenanceTab";
import PartsTab from "@/components/product-detail/PartsTab";
import { getMarketplaceProduct } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getMarketplaceProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <ProductHero product={product} />

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview">
            <TabsList className="h-14 w-full justify-start border-none bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Overview</TabsTrigger>
              <TabsTrigger value="documentation" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Documentation</TabsTrigger>
              <TabsTrigger value="diagnostic" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">AI Diagnostic</TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Maintenance</TabsTrigger>
              <TabsTrigger value="parts" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Parts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsContent value="overview"><OverviewTab product={product} /></TabsContent>
              <TabsContent value="documentation"><DocumentationTab product={{ ...product, canEdit: false, documents: [] }} /></TabsContent>
              <TabsContent value="diagnostic">
                <div className="glass rounded-2xl p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">AI Diagnostic Assistant</h3>
                  <p className="mb-6 text-muted-foreground">Get expert help with your {product.name} issues</p>
                  <a href={`/products/${product.slug}/diagnose`} className="inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:from-indigo-600 hover:to-cyan-600">Start Diagnosis →</a>
                </div>
              </TabsContent>
              <TabsContent value="maintenance"><MaintenanceTab product={{ ...product, maintenanceTasks: [] }} /></TabsContent>
              <TabsContent value="parts"><PartsTab product={{ ...product, parts: [] }} /></TabsContent>
            </Tabs>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <section className="glass rounded-2xl p-6">
                <h3 className="mb-4 text-lg font-semibold">Product details</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between"><span>Company</span><span className="font-medium text-foreground">{product.company.name}</span></div>
                  <div className="flex items-center justify-between"><span>Status</span><span className="font-medium text-foreground">{product.status}</span></div>
                  <div className="flex items-center justify-between"><span>Price</span><span className="font-medium text-foreground">${product.price.toFixed(2)}</span></div>
                </div>
              </section>

              <section className="glass rounded-2xl p-6">
                <h3 className="mb-4 text-lg font-semibold">Why it matters</h3>
                <p className="text-sm leading-6 text-muted-foreground">This product listing is ready for diagnostics, support handoff, and maintenance workflows across the marketplace.</p>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
