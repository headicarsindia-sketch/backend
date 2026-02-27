import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../_utils/cors";

import { serializeBigInt } from "../_utils/serializeBigInt";
import { prisma } from "../../../../prisma/client";


export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  try {
    const users = await prisma.registered_master.findMany({
      orderBy: { created_at: "desc" },
      include: {
        abstract_submission: true,
        awardNominations: {
          include: { proof_links: true },
        },
      },
    });

    const formatted = users.map((user: any) => {
      const serialized = serializeBigInt(user);

      return {
        ...serialized,
        amount: serialized.amount?.toString(),

        transaction_date: user.transaction_date
          ? user.transaction_date.toISOString().split("T")[0]
          : null,

        created_at: user.created_at
          ? user.created_at.toISOString()
          : null,

        updated_at: user.updated_at
          ? user.updated_at.toISOString()
          : null,
      };
    });

    return NextResponse.json(formatted, { headers });
  } catch (error: any) {
    console.error("Error fetching registered users:", error);

    return NextResponse.json(
      {
        message: "Server error while fetching registered users.",
        error: error.message,
      },
      { status: 500, headers }
    );
  }
}