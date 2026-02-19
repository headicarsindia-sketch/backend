// src/app/api/abstract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const abstracts = await prisma.abstract_submission.findMany({
      orderBy: { created_at: "desc" },
      select: {
        transaction_id: true,
        first_name: true,
        last_name: true,
        abstract_title: true,
        abstract_category: true,
        keywords: true,
        file_name: true,
        file_type: true,
        file_size_kb: true,
        created_at: true,
       
      },
    });

    return NextResponse.json({ abstracts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch list" }, { status: 500 });
  }
}