import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const transaction_id = resolvedParams.id;

    const abstract = await prisma.abstract_submission.findUnique({
      where: { registration_id: transaction_id },
      select: {
        upload_abstract_name: true,
        upload_abstract_type: true,
        upload_abstract: true,
      },
    });

    if (!abstract || !abstract.upload_abstract) {
      return NextResponse.json(
        { error: "Abstract file not found in database" },
        { status: 404 }
      );
    }

    const data = abstract.upload_abstract;

    const decoded = Buffer.from(data).toString("utf-8").trim();

    if (decoded.startsWith("http")) {
      return NextResponse.redirect(decoded);
    }

    const mimeMap: Record<string, string> = {
      PDF: "application/pdf",
      DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      DOC: "application/msword",
    };

    const contentType =
      mimeMap[abstract.upload_abstract_type.toUpperCase()] ||
      "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          abstract.upload_abstract_name
        )}"`,
      },
    });

  } catch (error) {
    console.error("Download API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}