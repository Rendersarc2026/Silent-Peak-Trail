import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Note: testimonials are stored in the `Review` model in Prisma
export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const review = await prisma.review.create({
    data: {
      name: body.name,
      place: body.place || "",
      packageId: body.packageId,
      initial: body.name?.[0]?.toUpperCase() ?? "?",
      rating: body.rating || 5,
      message: body.message || body.text || "",
      isApproved: body.isApproved ?? false,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
