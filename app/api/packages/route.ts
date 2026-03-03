import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, slugify, validateWithYup } from "@/lib/utils";
import { packageSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const session = await getSession();
  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { tagline: { contains: search } },
    ];
  }

  const [pkgs, total] = await Promise.all([
    prisma.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.package.count({ where })
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
    const existing = await prisma.package.findFirst({
      where: { name: { equals: nameNormal } },
    });

    if (existing) {
      return NextResponse.json({ error: `A package named "${nameNormal}" already exists.` }, { status: 409 });
    }

    const newPkg = await prisma.package.create({
      data: {
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
      },
    });

    return NextResponse.json(newPkg, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Invalid package data provided." }, { status: 400 });
  }
}
