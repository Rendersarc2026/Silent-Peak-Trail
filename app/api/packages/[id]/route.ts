import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, slugify, validateWithYup, makePartial } from "@/lib/utils";
import { packageSchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import Package from "@/lib/models/Package";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const pkg = await Package.findById(id);
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const { success, data: parsed, error: validationError } = await validateWithYup(makePartial(packageSchema), body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    const existing = await Package.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (parsed.name) {
      const nameNormal = sanitizeInput(parsed.name).trim();
      const duplicate = await Package.findOne({
        name: nameNormal,
        _id: { $ne: id },
      });
      if (duplicate) {
        return NextResponse.json({ error: `A package named "${nameNormal}" already exists.` }, { status: 409 });
      }
    }

    const updated = await Package.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(parsed.name && { name: sanitizeInput(parsed.name).trim(), slug: slugify(sanitizeInput(parsed.name).trim()) }),
          ...(parsed.tagline !== undefined && { tagline: sanitizeInput(parsed.tagline) }),
          ...(parsed.duration !== undefined && { duration: sanitizeInput(parsed.duration) }),
          ...(parsed.price !== undefined && { price: parsed.price }),
          ...(parsed.badge !== undefined && { badge: sanitizeInput(parsed.badge) }),
          ...(parsed.badgeGold !== undefined && { badgeGold: parsed.badgeGold }),
          ...(parsed.featured !== undefined && { featured: parsed.featured }),
          ...(parsed.img !== undefined && { img: parsed.img }),
          ...(parsed.features !== undefined && { features: (parsed.features || []).map((f: string) => sanitizeInput(f)) }),
          ...(parsed.itinerary !== undefined && {
            itinerary: (parsed.itinerary || []).map((item: any) => ({
              ...item,
              ...(item.day !== undefined && { day: sanitizeInput(item.day) }),
              ...(item.title !== undefined && { title: sanitizeInput(item.title) }),
              ...(item.activities !== undefined && { activities: sanitizeInput(item.activities) })
            }))
          }),
          ...(parsed.inclusions !== undefined && { inclusions: (parsed.inclusions || []).map((i: string) => sanitizeInput(i)) }),
          ...(parsed.exclusions !== undefined && { exclusions: (parsed.exclusions || []).map((e: string) => sanitizeInput(e)) }),
          ...(parsed.photos !== undefined && { photos: Array.isArray(parsed.photos) ? parsed.photos : undefined }),
          ...(parsed.videos !== undefined && { videos: Array.isArray(parsed.videos) ? parsed.videos : undefined }),
        }
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Invalid package update data." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await dbConnect();
  await Package.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ ok: true });
}
