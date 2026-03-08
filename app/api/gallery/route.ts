import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { gallerySchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import GalleryItem from "@/lib/models/GalleryItem";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const session = await getSession();
  const where: any = { isActive: true };
  if (search) {
    where.alt = { $regex: search, $options: 'i' };
  }

  await dbConnect();

  const [items, total] = await Promise.all([
    GalleryItem.find(where)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    GalleryItem.countDocuments(where),
  ]);

  return NextResponse.json({
    data: items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { success, data: parsed, error: validationError } = await validateWithYup(gallerySchema, body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    await dbConnect();
    const existing = await GalleryItem.findOne({ src: parsed.src });

    if (existing) {
      return NextResponse.json({ error: "This image is already in the gallery." }, { status: 409 });
    }

    const item = await GalleryItem.create({
        src: parsed.src,
        alt: parsed.alt ? sanitizeInput(parsed.alt) : "",
        wide: parsed.wide,
        tall: parsed.tall,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json({ error: "Invalid gallery image data." }, { status: 400 });
  }
}
