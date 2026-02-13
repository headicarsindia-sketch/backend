import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { serializeBigInt } from "@/app/api/_utils/serializeBigInt";


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const nomination = await prisma.award_nomination.findUnique({
    where: { id: BigInt(params.id) },
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
    dossier_download_url: `/api/award/nomination/${params.id}?download=true`
  });
}
