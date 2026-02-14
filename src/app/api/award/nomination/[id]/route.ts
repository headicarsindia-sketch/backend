import { NextRequest, NextResponse } from "next/server";

import { serializeBigInt } from "../../../_utils/serializeBigInt";
import { prisma } from "../../../../../../prisma/client";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ must match Next.js type
) {
  const { id } = await context.params; // ✅ await the promise

  const nomination = await prisma.award_nomination.findUnique({
    where: { id: BigInt(id) },
    include: { proof_links: true }
  });

  if (!nomination) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (req.nextUrl.searchParams.get("download") === "true") {
    return new NextResponse(Buffer.from(nomination.dossier_file!), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${nomination.dossier_filename}"`
      }
    });
  }

  const { dossier_file, ...rest } = nomination;

  return NextResponse.json({
    ...serializeBigInt(rest),
    dossier_download_url: `/api/award/nomination/${id}?download=true`
  });
}