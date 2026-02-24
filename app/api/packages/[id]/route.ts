import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { packageSchema } from "@/lib/validation";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id: parseInt(id) } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const numId = parseInt(id);
    const body = await req.json();
    const parsed = packageSchema.partial().parse(body);

    const existing = await prisma.package.findUnique({ where: { id: numId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (parsed.name) {
      const nameNormal = sanitizeInput(parsed.name).trim();
      const duplicate = await prisma.package.findFirst({
        where: { name: { equals: nameNormal }, NOT: { id: numId } },
      });
      if (duplicate) {
        return NextResponse.json({ error: `A package named "${nameNormal}" already exists.` }, { status: 409 });
      }
    }

    const updated = await prisma.package.update({
      where: { id: numId },
      data: {
        ...(parsed.name && { name: sanitizeInput(parsed.name) }),
        ...(parsed.tagline && { tagline: sanitizeInput(parsed.tagline) }),
        ...(parsed.duration && { duration: sanitizeInput(parsed.duration) }),
        ...(parsed.price !== undefined && { price: parsed.price }),
        ...(parsed.badge !== undefined && { badge: sanitizeInput(parsed.badge) }),
        ...(parsed.badgeGold !== undefined && { badgeGold: parsed.badgeGold }),
        ...(parsed.featured !== undefined && { featured: parsed.featured }),
        ...(parsed.img && { img: parsed.img }),
        ...(parsed.features && { features: parsed.features.map((f: string) => sanitizeInput(f)) }),
        ...(parsed.itinerary && { itinerary: parsed.itinerary }),
        ...(parsed.inclusions && { inclusions: parsed.inclusions }),
        ...(parsed.exclusions && { exclusions: parsed.exclusions }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Invalid package update data." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.package.update({
    where: { id: parseInt(id) },
    data: { isActive: false }
  });
  return NextResponse.json({ ok: true });
}
