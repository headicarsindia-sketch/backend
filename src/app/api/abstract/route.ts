// src/app/api/abstract/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const abstracts = await prisma.abstract_submission.findMany({
      orderBy: { submission_date: "desc" },
      select: {
        registration_id: true,
        full_name_with_salutation: true,
        delegate_category: true,
        abstract_type: true,
        keywords: true,
        upload_abstract_name: true,
        upload_abstract_type: true,
        upload_abstract_size_kb: true,
        submission_date: true,
      },
    });

    return NextResponse.json({ abstracts }, { status: 200 });
  } catch (err) {
    console.error("Fetch abstracts error:", err);
    return NextResponse.json(
      { error: "Failed to fetch abstracts" },
      { status: 500 }
    );
  }
}