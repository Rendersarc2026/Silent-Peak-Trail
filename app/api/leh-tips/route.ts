import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { lehTipSchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import LehTip from "@/lib/models/LehTip";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const session = await getSession();
    const where: any = { isActive: true };
    if (search) {
        where.$or = [
            { title: { $regex: search, $options: 'i' } },
            { desc: { $regex: search, $options: 'i' } },
        ];
    }

    await dbConnect();

    const [items, total] = await Promise.all([
        LehTip.find(where)
            .sort({ order: 1 })
            .skip(skip)
            .limit(limit),
        LehTip.countDocuments(where),
    ]);

    return NextResponse.json({
        data: items,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    });
}

export async function POST(req: NextRequest) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { success, data: parsed, error: validationError } = await validateWithYup(lehTipSchema, body);

        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

        await dbConnect();
        const item = await LehTip.create({
                icon: sanitizeInput(parsed.icon),
                title: sanitizeInput(parsed.title),
                desc: sanitizeInput(parsed.desc),
                color: parsed.color,
                border: parsed.border,
                order: parsed.order ?? 0,
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating leh tip:", error);
        return NextResponse.json({ error: "Invalid tip data." }, { status: 400 });
    }
}
