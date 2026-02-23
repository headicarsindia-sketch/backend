import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../_utils/cors";

import { serializeBigInt } from "../_utils/serializeBigInt";
import { prisma } from "../../../../prisma/client";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  const errarr = [];

  try {
    const formData = await req.formData();
    const file = formData.get("abstract_file") as File | null;
    const registration_id = formData.get("registration_id")?.toString().trim();

    if (!file || !registration_id) {
      return NextResponse.json(
        { error: "Missing required fields: registration_id or abstract_file" },
        { status: 400, headers }
        
      );
    }

    // File validation
    const fileName = file.name.toUpperCase();
    let fileTypeEnum: "PDF" | "DOC" | "DOCX";
    if (fileName.endsWith(".PDF") || file.type === "application/pdf") {
      fileTypeEnum = "PDF";
    } else if (fileName.endsWith(".DOCX")) {
      fileTypeEnum = "DOCX";
    } else if (fileName.endsWith(".DOC") || file.type === "application/msword") {
      fileTypeEnum = "DOC";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, DOC, DOCX allowed." },
        { status: 400, headers }
      );
    }

    // Optional: file size limit 
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File too large. Maximum 2MB allowed." },
        { status: 400, headers }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Collect all fields strictly
    const full_name = formData.get("full_name_with_salutation")?.toString().trim();
    
    if (!full_name) {
      return NextResponse.json(
        { error: "Missing required field: full_name_with_salutation" },
        { status: 400, headers }
      );
    }

    const submissionData = {
      registration_id,
      delegate_category: formData.get("delegate_category")?.toString() || null,
      sub_category: formData.get("sub_category")?.toString() || null,
      full_name_with_salutation: full_name,
      gender: formData.get("gender")?.toString() || null,
      affiliation_organization: formData.get("affiliation_organization")?.toString() || null,
      designation_role: formData.get("designation_role")?.toString() || null,
      mobile_number: formData.get("mobile_number")?.toString() || null,
      city_country: formData.get("city_country")?.toString() || null,
      abstract_type: formData.get("abstract_type")?.toString() || null,
      keywords: formData.get("keywords")?.toString() || null,
      preferred_presentation: formData.get("preferred_presentation")?.toString() || null,
      corresponding_author: formData.get("corresponding_author")?.toString() || null,

      upload_abstract_name: file.name,
      upload_abstract_type: fileTypeEnum,
      upload_abstract_size_kb: Math.round(file.size / 1024),
      upload_abstract: Buffer.from(arrayBuffer),
    };
    console.log(submissionData);

    // Insert into database using Prisma
    const saved = await prisma.abstract_submission.create({
      data: submissionData,
    });
    console.log(saved)
    return NextResponse.json(
      { message: "Abstract submitted successfully!", data: serializeBigInt(saved) },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500, headers }
    );
  }
}