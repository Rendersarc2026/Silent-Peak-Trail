import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/lib/models/Review";

// Note: testimonials are stored in the `Review` model
export async function GET() {
  await dbConnect();
  const reviews = await Review.find().sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const { reviewSchema } = await import("@/lib/validation");
    const { sanitizeInput, validateWithYup } = await import("@/lib/utils");

    const { success, data: parsed, error: validationError } = await validateWithYup(reviewSchema, {
      ...body,
      message: body.message || body.text || ""
    });

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    // 2. Sanitize & Save
    await dbConnect();
    const review = await Review.create({
      name: sanitizeInput(parsed.name),
      place: sanitizeInput(parsed.place),
      packageId: parsed.packageId,
      initial: parsed.name?.[0]?.toUpperCase() ?? "?",
      rating: parsed.rating,
      message: sanitizeInput(parsed.message),
      isApproved: body.isApproved ?? false,
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Testimonial creation error:", error);
    return NextResponse.json({ error: "Invalid input provided." }, { status: 400 });
  }
}
