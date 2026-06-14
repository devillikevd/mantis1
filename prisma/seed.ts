import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const demoPasswordHash = "$2a$10$7JK8ABVkG3ZfQZqnnP8oU.S9gJW67/L2Tkqg0MMTkq6aGfghr3UzK";

async function main() {
  await prisma.product.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const companyOwner = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "demo@company.com",
      passwordHash: demoPasswordHash,
      role: "COMPANY",
      avatar: "🏢",
    },
  });

  const demoCompany = await prisma.company.create({
    data: {
      name: "Mantis Diagnostics Co.",
      slug: slugify("Mantis Diagnostics Co."),
      gstNumber: "22AAAAA0000A1Z5",
      website: "https://mantis.example.com",
      userId: companyOwner.id,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Mantis AI Diagnostic Hub",
        slug: slugify("Mantis AI Diagnostic Hub"),
        description: "AI-guided product diagnostics with manual uploads, issue triage, and smart next-step recommendations.",
        price: 2999.99,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        status: "ACTIVE",
        companyId: demoCompany.id,
      },
      {
        name: "Field Support Assistant",
        slug: slugify("Field Support Assistant"),
        description: "A mobile-friendly support assistant that helps technicians isolate faults and confirm resolution steps quickly.",
        price: 1999.99,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        status: "ACTIVE",
        companyId: demoCompany.id,
      },
      {
        name: "Manual Intelligence Pack",
        slug: slugify("Manual Intelligence Pack"),
        description: "Turn PDFs and service manuals into searchable, diagnostic-ready knowledge for your support team.",
        price: 1299.5,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
        status: "ACTIVE",
        companyId: demoCompany.id,
      },
      {
        name: "Support Desk Lite",
        slug: slugify("Support Desk Lite"),
        description: "Track incidents, resolve common issues faster, and keep customer-facing guidance in one place.",
        price: 799,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        status: "INACTIVE",
        companyId: demoCompany.id,
      },
    ],
  });

  const secondCompanyOwner = await prisma.user.create({
    data: {
      name: "Asha Mehta",
      email: "demo@partner.com",
      passwordHash: demoPasswordHash,
      role: "COMPANY",
      avatar: "🛠️",
    },
  });

  const partnerCompany = await prisma.company.create({
    data: {
      name: "VoltForge Industries",
      slug: slugify("VoltForge Industries"),
      gstNumber: "27BBBBB0000B1Z7",
      website: "https://voltforge.example.com",
      userId: secondCompanyOwner.id,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "VoltForge Repair Guide",
        slug: slugify("VoltForge Repair Guide"),
        description: "A diagnostics toolkit for home appliances with guided step-by-step troubleshooting and service flows.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
        status: "ACTIVE",
        companyId: partnerCompany.id,
      },
      {
        name: "Warranty Insight Portal",
        slug: slugify("Warranty Insight Portal"),
        description: "Keep warranty claims, issue history, and support documents connected to each product listing.",
        price: 1599,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        status: "ACTIVE",
        companyId: partnerCompany.id,
      },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "demo@user.com",
      passwordHash: demoPasswordHash,
      role: "USER",
      avatar: "👤",
    },
  });

  console.log("Seed data created with demo company and product records.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
