import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup, makePartial } from "@/lib/utils";
import { lehTipSchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import LehTip from "@/lib/models/LehTip";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        await dbConnect();
        const body = await req.json();
        const { success, data: parsed, error: validationError } = await validateWithYup(makePartial(lehTipSchema), body);

        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

        const existing = await LehTip.findById(id);
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // If order is being updated, check if it already exists in another tip
        if (parsed.order !== undefined && parsed.order !== existing.order) {
            const duplicateOrder = await LehTip.findOne({
                order: parsed.order,
                isActive: true,
                _id: { $ne: id }
            });

            if (duplicateOrder) {
                return NextResponse.json({
                    error: "Validation failed",
                    details: { order: ["This order number is already taken by another tip."] }
                }, { status: 400 });
            }
        }

        const updated = await LehTip.findByIdAndUpdate(
            id,
            {
                ...(parsed.icon && { icon: sanitizeInput(parsed.icon) }),
                ...(parsed.title && { title: sanitizeInput(parsed.title) }),
                ...(parsed.desc && { desc: sanitizeInput(parsed.desc) }),
                ...(parsed.color && { color: parsed.color }),
                ...(parsed.border && { border: parsed.border }),
                ...(parsed.order !== undefined && { order: parsed.order }),
            },
            { new: true }
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating leh tip:", error);
        return NextResponse.json({ error: "Invalid tip data." }, { status: 400 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    await LehTip.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ ok: true });
}
