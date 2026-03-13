import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, slugify, validateWithYup } from "@/lib/utils";
import { packageSchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import Package from "@/lib/models/Package";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const session = await getSession();
  const where: any = { isActive: true };
  if (search) {
    // Escape regex characters just to be safe
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the beginning of the string OR a whitespace followed by the search term
    where.name = { $regex: new RegExp(`(^|\\s)${escapedSearch}`, 'i') };
  }

  await dbConnect();

  const [pkgs, total] = await Promise.all([
    Package.find(where)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Package.countDocuments(where)
  ]);

  return NextResponse.json({
    data: pkgs,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  });
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // 1. Validate using Yup
    const { success, data: parsed, error: validationError } = await validateWithYup(packageSchema, body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    const nameNormal = sanitizeInput(parsed.name).trim();
    await dbConnect();
    const existing = await Package.findOne({ name: nameNormal });

    if (existing) {
      return NextResponse.json({ error: `A package named "${nameNormal}" already exists.` }, { status: 409 });
    }

    const newPkg = await Package.create({
      name: nameNormal,
      slug: slugify(nameNormal),
      tagline: sanitizeInput(parsed.tagline),
      duration: sanitizeInput(parsed.duration),
      price: parsed.price,
      badge: sanitizeInput(parsed.badge),
      badgeGold: parsed.badgeGold,
      featured: parsed.featured,
      img: parsed.img,
      features: (parsed.features || []).map((f: string) => sanitizeInput(f)),
      itinerary: (parsed.itinerary || []).map((item: any) => ({
        ...item,
        day: sanitizeInput(item.day),
        title: sanitizeInput(item.title),
        activities: item.activities ? sanitizeInput(item.activities) : undefined
      })),
      inclusions: (parsed.inclusions || []).map((i: string) => sanitizeInput(i)),
      exclusions: (parsed.exclusions || []).map((e: string) => sanitizeInput(e)),
      photos: Array.isArray(parsed.photos) ? parsed.photos : [],
      videos: Array.isArray(parsed.videos) ? parsed.videos : [],
    });

    return NextResponse.json(newPkg, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Invalid package data provided." }, { status: 400 });
  }
}
