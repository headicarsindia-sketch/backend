import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/app/api/_utils/cors";
import { prisma } from "@/prisma/client";
import { award_category } from "@prisma/client/edge";

type CategoryResponse = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
};

export async function GET(req: NextRequest, context: { params: Record<string, string | string[]> }) {
  const pillarId = context.params.pillarId as string;

  const headers = corsHeaders(req.headers.get("origin"));

  try {
    const categories = await prisma.award_category.findMany({
      where: { pillar_id: BigInt(pillarId) },
    });

    const safe: CategoryResponse[] = categories.map((cat: award_category) => ({
      id: cat.id.toString(),
      pillar_id: cat.pillar_id.toString(),
      name: cat.name,
      description: cat.description,
    }));

    return NextResponse.json(safe, { headers });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500, headers }
    );
  }
}