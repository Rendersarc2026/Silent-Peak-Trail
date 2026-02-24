import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { sanitizeInput } from "@/lib/utils";
import { gallerySchema } from "@/lib/validation";
import { z } from "zod";

import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = gallerySchema.parse(body);

    const existing = await prisma.galleryItem.findUnique({
      where: { src: parsed.src },
    });

    if (existing) {
      return NextResponse.json({ error: "This image is already in the gallery." }, { status: 409 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        src: parsed.src,
        alt: parsed.alt ? sanitizeInput(parsed.alt) : "",
        wide: parsed.wide,
        tall: parsed.tall,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Error adding gallery image:", error);
    return NextResponse.json({ error: "Invalid gallery image data." }, { status: 400 });
  }
}
