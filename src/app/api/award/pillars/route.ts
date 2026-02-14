import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../_utils/cors";

import { serializeBigInt } from "../../_utils/serializeBigInt";
import { prisma } from "../../../../../prisma/client";


export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  const pillars = await prisma.award_pillar.findMany({
    include: { categories: true }
  });

  return NextResponse.json(serializeBigInt(pillars), { headers });
}