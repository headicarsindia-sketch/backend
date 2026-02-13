import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { serializeBigInt } from "@/app/api/_utils/serializeBigInt";
import { corsHeaders } from "@/app/api/_utils/cors";

export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  try {
    const users = await prisma.registered_master.findMany({
      orderBy: { created_at: "desc" },
      include: {
        abstract_submission: true,
        awardNominations: {
          include: { proof_links: true }
        }
      }
    });

    const formatted = users.map((user: any) => serializeBigInt(user));

    return NextResponse.json(formatted, { headers });
  } catch (error: any) {
    console.error("Error fetching registered users:", error);

    return NextResponse.json(
      {
        message: "Server error while fetching registered users.",
        error: error.message
      },
      { status: 500, headers }
    );
  }
}