import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { destinationSchema } from "@/lib/validation";
import { z } from "zod";

import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = destinationSchema.parse(body);

    const nameNormal = sanitizeInput(parsed.name).trim();
    const existing = await prisma.destination.findFirst({
      where: { name: { equals: nameNormal } },
    });

    if (existing) {
      return NextResponse.json({ error: `A destination named "${nameNormal}" already exists.` }, { status: 409 });
    }

    const item = await prisma.destination.create({
      data: {
        name: nameNormal,
        type: sanitizeInput(parsed.type),
        altitude: sanitizeInput(parsed.altitude),
        img: parsed.img,
        big: parsed.big,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Error creating destination:", error);
    return NextResponse.json({ error: "Invalid destination data." }, { status: 400 });
  }
}
