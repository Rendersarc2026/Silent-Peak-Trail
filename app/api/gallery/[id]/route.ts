import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup, makePartial } from "@/lib/utils";
import { gallerySchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const numId = parseInt(id);
    const body = await req.json();
    const { success, data: parsed, error: validationError } = await validateWithYup(makePartial(gallerySchema), body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    const existing = await prisma.galleryItem.findUnique({ where: { id: numId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (parsed.src) {
      const duplicate = await prisma.galleryItem.findFirst({
        where: { src: parsed.src, NOT: { id: numId } },
      });
      if (duplicate) {
        return NextResponse.json({ error: "This image is already in the gallery." }, { status: 409 });
      }
    }

    const updated = await prisma.galleryItem.update({
      where: { id: numId },
      data: {
        ...(parsed.src && { src: parsed.src }),
        ...(parsed.alt !== undefined && { alt: sanitizeInput(parsed.alt) }),
        ...(parsed.wide !== undefined && { wide: parsed.wide }),
        ...(parsed.tall !== undefined && { tall: parsed.tall }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json({ error: "Invalid gallery update data." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.galleryItem.update({
    where: { id: parseInt(id) },
    data: { isActive: false }
  });
  return NextResponse.json({ ok: true });
}
