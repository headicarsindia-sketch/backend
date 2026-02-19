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

    // Fetch the metadata and the binary content (abstract_file)
    const abstract = await prisma.abstract_submission.findUnique({
      where: { transaction_id },
      select: { 
        file_name: true, 
        file_type: true,
        abstract_file: true 
      },
    });

    if (!abstract || !abstract.abstract_file) {
      return NextResponse.json(
        { error: "Abstract file not found in database" }, 
        { status: 404 }
      );
    }

    // Map your file_type to a standard MIME type
    const mimeMap: Record<string, string> = {
      PDF: "application/pdf",
      DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      DOC: "application/msword",
    };

    const contentType = mimeMap[abstract.file_type.toUpperCase()] || "application/octet-stream";

    // Create the response using the Uint8Array directly
    return new NextResponse(abstract.abstract_file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(abstract.file_name)}"`,
        "Content-Length": abstract.abstract_file.length.toString(),
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