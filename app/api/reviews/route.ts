import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";

// Field convention (no schema change needed):
// Pending  → isApproved: false, isActive: true  (external submissions awaiting approval)
// Live     → isApproved: true,  isActive: true  (visible on website)
// Archived → isApproved: true,  isActive: false (admin hid it)
// Deleted  → hard-deleted from DB

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "approved";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let where: any = {};
        if (!session) {
            where = { isApproved: true, isActive: true };
        } else if (status === "pending") {
            where = { isApproved: false, isActive: true };
        } else if (status === "archived") {
            where = { isApproved: true, isActive: false };
        } else {
            where = { isApproved: true, isActive: true };
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { message: { contains: search } },
                { place: { contains: search } },
            ];
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: { tourPackage: { select: { name: true } } },
                orderBy: { createdAt: "desc" },
                skip: session ? skip : undefined,
                take: session ? limit : undefined,
            }),
            prisma.review.count({ where })
        ]);

        if (session) {
            return NextResponse.json({
                data: reviews,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            });
        }

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
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

        // Admin-added reviews (send isApproved:true explicitly) are auto-approved.
        // Public submissions never send isApproved, so they land as pending.
        const review = await prisma.review.create({
            data: {
                name: cleanName,
                place: cleanPlace,
                packageId: parsed.packageId,
                rating: parsed.rating,
                message: cleanMessage,
                initial,
                isApproved: body.isApproved === true,
                isActive: true,
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Invalid review input." }, { status: 400 });
    }
}
