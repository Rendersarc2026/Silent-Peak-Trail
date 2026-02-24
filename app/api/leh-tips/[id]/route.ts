import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { lehTipSchema } from "@/lib/validation";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const numId = parseInt(id);
        const body = await req.json();
        const parsed = lehTipSchema.partial().parse(body);

        const existing = await prisma.lehTip.findUnique({ where: { id: numId } });
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const updated = await prisma.lehTip.update({
            where: { id: numId },
            data: {
                ...(parsed.icon && { icon: sanitizeInput(parsed.icon) }),
                ...(parsed.title && { title: sanitizeInput(parsed.title) }),
                ...(parsed.desc && { desc: sanitizeInput(parsed.desc) }),
                ...(parsed.color && { color: parsed.color }),
                ...(parsed.border && { border: parsed.border }),
                ...(parsed.order !== undefined && { order: parsed.order }),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("Error updating leh tip:", error);
        return NextResponse.json({ error: "Invalid tip data." }, { status: 400 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await prisma.lehTip.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
}
