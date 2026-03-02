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

  try {
    const body = await req.json();

    // 1. Validate
    const { reviewSchema } = await import("@/lib/validation");
    const { sanitizeInput } = await import("@/lib/utils");

    const parsed = reviewSchema.parse({
      ...body,
      message: body.message || body.text || ""
    });

    // 2. Sanitize & Save
    const review = await prisma.review.create({
      data: {
        name: sanitizeInput(parsed.name),
        place: sanitizeInput(parsed.place),
        packageId: parsed.packageId,
        initial: parsed.name?.[0]?.toUpperCase() ?? "?",
        rating: parsed.rating,
        message: sanitizeInput(parsed.message),
        isApproved: body.isApproved ?? false,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    const { z } = await import("zod");
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Testimonial creation error:", error);
    return NextResponse.json({ error: "Invalid input provided." }, { status: 400 });
  }
}
