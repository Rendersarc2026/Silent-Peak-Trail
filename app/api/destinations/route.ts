import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { destinationSchema } from "@/lib/validation";

import dbConnect from "@/lib/db";
import Destination from "@/lib/models/Destination";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const session = await getSession();
  const where: any = { isActive: true };
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    where.name = { $regex: new RegExp(`(^|\\s)${escapedSearch}`, 'i') };
  }

  await dbConnect();

  const [items, total] = await Promise.all([
    Destination.find(where)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Destination.countDocuments(where),
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
    const { success, data: parsed, error: validationError } = await validateWithYup(destinationSchema, body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    const nameNormal = sanitizeInput(parsed.name).trim();
    await dbConnect();
    const existing = await Destination.findOne({ name: nameNormal });

    if (existing) {
      return NextResponse.json({ error: `A destination named "${nameNormal}" already exists.` }, { status: 409 });
    }

    const item = await Destination.create({
      name: nameNormal,
      type: sanitizeInput(parsed.type),
      altitude: sanitizeInput(parsed.altitude),
      img: parsed.img,
      big: parsed.big,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json({ error: "Invalid destination data." }, { status: 400 });
  }
}
