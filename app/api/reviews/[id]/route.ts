import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/lib/models/Review";
import { reviewSchema } from "@/lib/validation";
import { sanitizeInput, validateWithYup } from "@/lib/utils";

// PATCH: Approve a pending review (isApproved: true) OR archive a live review (isActive: false)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();

        // "approve" action: set isApproved:true, isActive:true
        // "archive" action: set isActive:false (keeps isApproved:true — distinguishes from pending)
        const data: any = {};
        if (body.action === "approve") {
            data.isApproved = true;
            data.isActive = true;
        } else if (body.action === "archive") {
            data.isActive = false;
        } else if (body.action === "restore") {
            data.isApproved = true;
            data.isActive = true;
        } else {
            // Legacy fallback: direct isApproved toggle
            if (typeof body.isApproved === "boolean") data.isApproved = body.isApproved;
            if (typeof body.isActive === "boolean") data.isActive = body.isActive;
        }

        await dbConnect();
        const review = await Review.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}

// PUT: Update full review content
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();

        // Reject blank/whitespace-only/junk message
        const alphanumericCount = (String(body.message || "").match(/[a-zA-Z0-9]/g) || []).length;
        if (alphanumericCount < 3) {
            return NextResponse.json(
                { error: "Validation failed", details: { message: ["Review message must contain at least 3 letters or numbers."] } },
                { status: 400 }
            );
        }

        const { success, data: parsed, error: validationError } = await validateWithYup(reviewSchema, body);
        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

        const cleanName = sanitizeInput(parsed.name);
        const cleanPlace = sanitizeInput(parsed.place);
        const cleanMessage = sanitizeInput(parsed.message);
        const initial = cleanName[0]?.toUpperCase() || "?";

        await dbConnect();
        const review = await Review.findByIdAndUpdate(
            id,
            {
                name: cleanName,
                place: cleanPlace,
                packageId: parsed.packageId,
                rating: parsed.rating,
                message: cleanMessage,
                initial,
                isApproved: true, // Admin edits auto-approve
            },
            { new: true }
        );

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error updating review content:", error);
        return NextResponse.json({ error: "Failed to update review content" }, { status: 500 });
    }
}

// DELETE: Soft-delete (isApproved: false + isActive: false — distinct from Archive which is isApproved: true + isActive: false)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        await dbConnect();
        await Review.findByIdAndUpdate(id, { isApproved: false, isActive: false });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
