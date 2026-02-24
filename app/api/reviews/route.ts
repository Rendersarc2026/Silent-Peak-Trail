import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";
import { z } from "zod";

// Fetch reviews (only approved for public, all for admin)
export async function GET() {
    try {
        const session = await getSession();

        const reviews = await prisma.review.findMany({
            where: session ? { isActive: true } : { isApproved: true, isActive: true },
            include: {
                tourPackage: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// Submit a new review (pending approval)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Validate using Zod
        const parsed = reviewSchema.parse(body);

        // 2. Sanitize using DOMPurify
        const cleanName = sanitizeInput(parsed.name);
        const cleanPlace = sanitizeInput(parsed.place);
        const cleanMessage = sanitizeInput(parsed.message);

        const initial = cleanName[0]?.toUpperCase() || "?";

        const session = await getSession();

        // 3. Save to database
        const review = await prisma.review.create({
            data: {
                name: cleanName,
                place: cleanPlace,
                packageId: parsed.packageId,
                rating: parsed.rating,
                message: cleanMessage,
                initial,
                isApproved: session ? (body.isApproved ?? true) : false
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Invalid review input." }, { status: 400 });
    }
}
