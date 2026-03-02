import { NextResponse } from "next/server";
import { serializeBigInt } from "../../_utils/serializeBigInt";
import { prisma } from "../../../../../prisma/client";

export async function GET() {
  try {
    const rows = await prisma.award_nomination.findMany({
      orderBy: { id: "desc" },
      include: {
        proof_links: true,

        // ✅ include full relational data
        awardPillar: true,
        category: true,
        focus_area: true,
        registered_master: true,
      },
    });

    const formatted = rows.map((n: any) => {
      const { dossier_file, ...rest } = n;

      return serializeBigInt({
        ...rest,

        // ✅ Proper download link
        dossier_download_url: `/api/award/nomination/${n.id}?download=true`,

        // Optional: add proof URLs clean array only
        proof_urls: n.proof_links?.map((p: any) => p.url) || [],
      });
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching nominations:", error);
    return NextResponse.json(
      { error: "Failed to fetch nominations" },
      { status: 500 }
    );
  }
}