import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup, makePartial } from "@/lib/utils";
import { gallerySchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import GalleryItem from "@/lib/models/GalleryItem";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const existing = await GalleryItem.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Handle Hero assignment specially — only one hero allowed at a time
    if (body.isHero === true) {
      // Remove hero status from all others
      await GalleryItem.updateMany({ _id: { $ne: id } }, { $set: { isHero: false } });
      await GalleryItem.findByIdAndUpdate(id, { $set: { isHero: true } }, { new: true });
      return NextResponse.json({ ok: true, isHero: true });
    }
    if (body.isHero === false) {
      await GalleryItem.findByIdAndUpdate(id, { $set: { isHero: false } }, { new: true });
      return NextResponse.json({ ok: true, isHero: false });
    }

    // Regular update (alt text / src)
    const { success, data: parsed, error: validationError } = await validateWithYup(makePartial(gallerySchema), body);
    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    if (parsed.src) {
      const duplicate = await GalleryItem.findOne({ src: parsed.src, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json({ error: "This image is already in the gallery." }, { status: 409 });
      }
    }

    const updated = await GalleryItem.findByIdAndUpdate(
      id,
      {
        ...(parsed.src && { src: parsed.src }),
        ...(parsed.alt !== undefined && { alt: sanitizeInput(parsed.alt) }),
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json({ error: "Invalid gallery update data." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await dbConnect();
  await GalleryItem.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ ok: true });
}
