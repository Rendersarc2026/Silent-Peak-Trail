import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";
import { z } from "zod";

// Update review status (Approve/Reject)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { isApproved } = body;

        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: { isApproved }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}

// Update full review content
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();

        // 1. Validate
        const parsed = reviewSchema.parse(body);

        // 2. Sanitize
        const { sanitizeInput } = await import("@/lib/utils");
        const cleanName = sanitizeInput(parsed.name);
        const cleanPlace = sanitizeInput(parsed.place);
        const cleanMessage = sanitizeInput(parsed.message);
        const initial = cleanName[0]?.toUpperCase() || "?";

        // 3. Update
        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: {
                name: cleanName,
                place: cleanPlace,
                packageId: parsed.packageId,
                rating: parsed.rating,
                message: cleanMessage,
                initial,
                isApproved: true // Admin edits auto-approve
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("Error updating review content:", error);
        return NextResponse.json({ error: "Failed to update review content" }, { status: 500 });
    }
}

// Delete a review
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;

        await prisma.review.update({
            where: { id: parseInt(id) },
            data: { isActive: false }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
