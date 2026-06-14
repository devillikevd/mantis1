import { prisma } from "@/lib/prisma";

export type MarketplaceProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: string;
    name: string;
    slug: string;
    website?: string | null;
    gstNumber?: string | null;
  };
};

export const fallbackProducts: MarketplaceProduct[] = [
  {
    id: "fallback-1",
    name: "Mantis Diagnostics Hub",
    slug: "mantis-diagnostics-hub",
    description: "AI-guided diagnostics for product service teams with manual ingestion and support ticket triage.",
    image: null,
    price: 2999.99,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    company: {
      id: "company-honda",
      name: "Honda Electronics",
      slug: "honda-electronics",
      website: "https://honda.com",
      gstNumber: "22AAAAA0000A1Z5",
    },
  },
  {
    id: "fallback-2",
    name: "Field Support Assistant",
    slug: "field-support-assistant",
    description: "A mobile-first diagnostic assistant that helps technicians resolve common faults faster with context-aware repair steps.",
    image: null,
    price: 1999.99,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    company: {
      id: "company-honda",
      name: "Honda Electronics",
      slug: "honda-electronics",
      website: "https://honda.com",
      gstNumber: "22AAAAA0000A1Z5",
    },
  },
];

export async function getMarketplaceProducts() {
  if (!process.env.DATABASE_URL) {
    return fallbackProducts;
  }

  try {
    return await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Marketplace DB unavailable, using fallback products:", error);
    return fallbackProducts;
  }
}

export async function getMarketplaceProduct(slug: string) {
  if (!process.env.DATABASE_URL) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { company: true },
    });
  } catch (error) {
    console.warn("Marketplace DB unavailable, using fallback product:", error);
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getMarketplaceCompany(slug: string) {
  if (!process.env.DATABASE_URL) {
    const company = fallbackProducts.find((product) => product.company.slug === slug)?.company;

    if (!company) return null;

    return {
      ...company,
      products: fallbackProducts.filter((product) => product.company.slug === slug),
    };
  }

  try {
    return await prisma.company.findUnique({
      where: { slug },
      include: { products: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } } },
    });
  } catch (error) {
    console.warn("Marketplace DB unavailable, using fallback company:", error);
    const company = fallbackProducts.find((product) => product.company.slug === slug)?.company;

    if (!company) return null;

    return {
      ...company,
      products: fallbackProducts.filter((product) => product.company.slug === slug),
    };
  }
}
