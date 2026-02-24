import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { sanitizeInput } from "@/lib/utils";
import { packageSchema } from "@/lib/validation";
import { z } from "zod";

function auth() { return getSession(); }

import prisma from "@/lib/prisma";

export async function GET() {
  const pkgs = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pkgs);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = packageSchema.parse(body);

    const nameNormal = sanitizeInput(parsed.name).trim();
    const existing = await prisma.package.findFirst({
      where: { name: { equals: nameNormal } },
    });

    if (existing) {
      return NextResponse.json({ error: `A package named "${nameNormal}" already exists.` }, { status: 409 });
    }

    const newPkg = await prisma.package.create({
      data: {
        name: nameNormal,
        tagline: sanitizeInput(parsed.tagline),
        duration: sanitizeInput(parsed.duration),
        price: parsed.price,
        badge: sanitizeInput(parsed.badge),
        badgeGold: parsed.badgeGold,
        featured: parsed.featured,
        img: parsed.img,
        features: parsed.features.map((f: string) => sanitizeInput(f)),
        itinerary: parsed.itinerary || [],
        inclusions: parsed.inclusions || [],
        exclusions: parsed.exclusions || [],
      },
    });

    return NextResponse.json(newPkg, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Invalid package data provided." }, { status: 400 });
  }
}
