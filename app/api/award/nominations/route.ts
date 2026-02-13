import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../../prisma/client";
import { serializeBigInt } from "../../_utils/serializeBigInt";


export async function GET() {
  const rows = await prisma.award_nomination.findMany({
    orderBy: { id: "desc" },
    include: { proof_links: true }
  });

  const formatted = rows.map((n: { [x: string]: any; id?: any; dossier_file?: any; }) => {
    const { dossier_file, ...rest } = n;
    return serializeBigInt({
      ...rest,
      dossier_download_url: `/api/award/nomination/${n.id}?download=true`
    });
  });

  return NextResponse.json(formatted);
}