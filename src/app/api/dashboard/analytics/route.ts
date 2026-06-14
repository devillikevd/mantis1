import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: { userId: sessionUser.id ?? "" },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const dailyQueries = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      queries: Math.floor(Math.random() * 50) + 20,
    }));

    const topProducts = [
      { name: "Mantis AI Diagnostic Hub", queries: 247 },
      { name: "Field Support Assistant", queries: 189 },
      { name: "Manual Intelligence Pack", queries: 156 },
      { name: "Support Desk Lite", queries: 134 },
    ];

    const resolutionData = [
      { name: "Resolved", value: 856 },
      { name: "Escalated", value: 67 },
      { name: "Pending", value: 23 },
    ];

    const commonProblems = [
      {
        description: "Cold start failure",
        product: "Mantis AI Diagnostic Hub",
        count: 47,
        avgTime: "8 min",
        successRate: 94,
      },
      {
        description: "Manual upload parsing",
        product: "Manual Intelligence Pack",
        count: 38,
        avgTime: "12 min",
        successRate: 87,
      },
      {
        description: "Issue triage ambiguity",
        product: "Field Support Assistant",
        count: 29,
        avgTime: "15 min",
        successRate: 91,
      },
      {
        description: "Support workflow delay",
        product: "Support Desk Lite",
        count: 24,
        avgTime: "6 min",
        successRate: 96,
      },
    ];

    return NextResponse.json({
      dailyQueries,
      topProducts,
      resolutionData,
      commonProblems,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
