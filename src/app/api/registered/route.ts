import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../_utils/cors";
import { prisma } from "../../../prisma/client";
import { serializeBigInt } from "../_utils/serializeBigInt";


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