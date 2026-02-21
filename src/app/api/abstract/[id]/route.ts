import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Resolve the dynamic ID from the URL
    const resolvedParams = await params;
    const transaction_id = resolvedParams.id;

    // Fetch the metadata and the binary content (upload_abstract)
    const abstract = await prisma.abstract_submission.findUnique({
      where: { registration_id : transaction_id },
      select: { 
        upload_abstract_name: true, 
        upload_abstract_type: true,
        upload_abstract: true 
      },
    });

    if (!abstract || !abstract.upload_abstract) {
      return NextResponse.json(
        { error: "Abstract file not found in database" }, 
        { status: 404 }
      );
    }

    // Map your upload_abstract_type to a standard MIME type
    const mimeMap: Record<string, string> = {
      PDF: "application/pdf",
      DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      DOC: "application/msword",
    };

    const contentType = mimeMap[abstract.upload_abstract_type.toUpperCase()] || "application/octet-stream";

    // Create the response using the Uint8Array directly
    return new NextResponse(abstract.upload_abstract, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(abstract.upload_abstract_name)}"`,
        "Content-Length": abstract.upload_abstract.length.toString(),
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