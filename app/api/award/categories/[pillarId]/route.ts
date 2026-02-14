import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/app/api/_utils/cors";
import { prisma } from "@/prisma/client";
import { award_category } from "@prisma/client/edge";

/* ✅ REQUIRED: preflight */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

type CategoryResponse = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ pillarId: string }> }
) {
  const { pillarId } = await context.params;
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

    return new NextResponse(JSON.stringify(safe), {
      headers: {
        ...headers,
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Error fetching categories:", error);

    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch categories" }),
      {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "application/json"
        }
      }
    );
  }
}