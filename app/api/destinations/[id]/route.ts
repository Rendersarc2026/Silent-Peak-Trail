import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup, makePartial } from "@/lib/utils";
import { destinationSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const numId = parseInt(id);
    const body = await req.json();
    const { success, data: parsed, error: validationError } = await validateWithYup(makePartial(destinationSchema), body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    const existing = await prisma.destination.findUnique({ where: { id: numId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (parsed.name) {
      const nameNormal = sanitizeInput(parsed.name).trim();
      const duplicate = await prisma.destination.findFirst({
        where: { name: { equals: nameNormal }, NOT: { id: numId } },
      });
      if (duplicate) {
        return NextResponse.json({ error: `A destination named "${nameNormal}" already exists.` }, { status: 409 });
      }
    }

    const updated = await prisma.destination.update({
      where: { id: numId },
      data: {
        ...(parsed.name && { name: sanitizeInput(parsed.name) }),
        ...(parsed.type && { type: sanitizeInput(parsed.type) }),
        ...(parsed.altitude && { altitude: sanitizeInput(parsed.altitude) }),
        ...(parsed.img && { img: parsed.img }),
        ...(parsed.big !== undefined && { big: parsed.big }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ error: "Invalid destination update data." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.destination.update({
    where: { id: parseInt(id) },
    data: { isActive: false }
  });
  return NextResponse.json({ ok: true });
}
