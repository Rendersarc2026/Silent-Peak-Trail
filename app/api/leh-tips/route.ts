import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { lehTipSchema } from "@/lib/validation";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET() {
    const items = await prisma.lehTip.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const parsed = lehTipSchema.parse(body);

        const item = await prisma.lehTip.create({
            data: {
                icon: sanitizeInput(parsed.icon),
                title: sanitizeInput(parsed.title),
                desc: sanitizeInput(parsed.desc),
                color: parsed.color,
                border: parsed.border,
                order: parsed.order ?? 0,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("Error creating leh tip:", error);
        return NextResponse.json({ error: "Invalid tip data." }, { status: 400 });
    }
}
