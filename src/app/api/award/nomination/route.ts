import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../_utils/cors";

import { serializeBigInt } from "../../_utils/serializeBigInt";
import { prisma } from "../../../../../prisma/client";

/* ✅ REQUIRED: preflight */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  try {
    const form = await req.formData();

    const file = form.get("dossier_file") as File;
    if (!file) {
      return new NextResponse(
        JSON.stringify({ message: "Dossier file required" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return new NextResponse(
        JSON.stringify({ message: "Max file size 2MB" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const transaction_id = form.get("transaction_id") as string;
    const award_pillarId = BigInt(form.get("award_pillarId") as string);
    const category_id = BigInt(form.get("category_id") as string);

    const focus_area_id = form.get("focus_area_id")
      ? BigInt(form.get("focus_area_id") as string)
      : undefined;

    const proof_links = form.getAll("proof_links").filter(Boolean) as string[];

    const registration = await prisma.registered_master.findUnique({
      where: { transaction_id }
    });

    if (!registration) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid transaction ID" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const nomination = await prisma.award_nomination.create({
      data: {
        transaction_id,
        award_pillarId,
        category_id,
        focus_area_id,
        nominee_name: form.get("nominee_name") as string,
        designation: form.get("designation") as string,
        organisation: form.get("organisation") as string,
        aadhaar: form.get("aadhaar") as string,
        pan: form.get("pan") as string,
        achievement_writeup: form.get("achievement_writeup") as string,
        dossier_file: buffer,
        dossier_filename: file.name,
        proof_links: proof_links.length
          ? { create: proof_links.map(url => ({ url })) }
          : undefined
      },
      include: { proof_links: true }
    });

    return new NextResponse(
      JSON.stringify(serializeBigInt(nomination)),
      { status: 201, headers: { ...headers, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
}