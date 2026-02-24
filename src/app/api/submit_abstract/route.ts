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

  try {
    const formData = await req.formData();

    /* ---------------- STRICT REQUIRED FIELDS ---------------- */

    const requiredFields = [
      "registration_id",
      "email", // ✅ ADDED
      "delegate_category",
      "sub_category",
      "full_name_with_salutation",
      "gender",
      "affiliation_organization",
      "designation_role",
      "mobile_number",
      "city_country",
      "abstract_type",
      "keywords",
      "preferred_presentation",
      "corresponding_author",
    ];

    for (const field of requiredFields) {
      const value = formData.get(field)?.toString().trim();
      if (!value) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400, headers }
        );
      }
    }

    const registration_id = formData.get("registration_id")!.toString().trim();
    const email = formData.get("email")!.toString().trim().toLowerCase();

    /* ---------------- VALIDATE REGISTRATION + EMAIL ---------------- */

    const registration = await prisma.registered_master.findUnique({
      where: { transaction_id: registration_id },
      select: { email: true, abstract_submitted: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Invalid Registration ID." },
        { status: 400, headers }
      );
    }

    if (registration.email.toLowerCase() !== email) {
      return NextResponse.json(
        { error: "Email does not match registered email." },
        { status: 400, headers }
      );
    }

    if (registration.abstract_submitted) {
      return NextResponse.json(
        { error: "Abstract already submitted for this Registration ID." },
        { status: 409, headers }
      );
    }

    /* ---------------- FILE VALIDATION ---------------- */

    const file = formData.get("abstract_file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Missing required field: abstract_file" },
        { status: 400, headers }
      );
    }

    const fileName = file.name.toUpperCase();
    let fileTypeEnum: "PDF" | "DOC" | "DOCX";

    if (fileName.endsWith(".PDF") || file.type === "application/pdf") {
      fileTypeEnum = "PDF";
    } else if (fileName.endsWith(".DOCX")) {
      fileTypeEnum = "DOCX";
    } else if (
      fileName.endsWith(".DOC") ||
      file.type === "application/msword"
    ) {
      fileTypeEnum = "DOC";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, DOC, DOCX allowed." },
        { status: 400, headers }
      );
    }

    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File too large. Maximum 2MB allowed." },
        { status: 400, headers }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    /* ---------------- SAFE TRANSACTION ---------------- */

    const saved = await prisma.$transaction(async (tx) => {
      const created = await tx.abstract_submission.create({
        data: {
          registration_id,
          email, // ✅ SAVE USER EMAIL (validated)

          delegate_category: formData.get("delegate_category")!.toString(),
          sub_category: formData.get("sub_category")!.toString(),
          full_name_with_salutation:
            formData.get("full_name_with_salutation")!.toString(),
          gender: formData.get("gender")!.toString(),
          affiliation_organization:
            formData.get("affiliation_organization")!.toString(),
          designation_role:
            formData.get("designation_role")!.toString(),
          mobile_number: formData.get("mobile_number")!.toString(),
          city_country: formData.get("city_country")!.toString(),
          abstract_type: formData.get("abstract_type")!.toString(),
          keywords: formData.get("keywords")!.toString(),
          preferred_presentation:
            formData.get("preferred_presentation")!.toString(),
          corresponding_author:
            formData.get("corresponding_author")!.toString(),

          upload_abstract_name: file.name,
          upload_abstract_type: fileTypeEnum,
          upload_abstract_size_kb: Math.round(file.size / 1024),
          upload_abstract: Buffer.from(arrayBuffer),
        },
      });

      // ✅ Mark abstract_submitted = true
      await tx.registered_master.update({
        where: { transaction_id: registration_id },
        data: { abstract_submitted: true },
      });

      return created;
    });

    return NextResponse.json(
      {
        message: "Abstract submitted successfully!",
        data: serializeBigInt(saved),
      },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("Submission error:", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate entry. Registration ID already exists." },
        { status: 409 }
      );
    }

    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "Foreign key constraint failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}