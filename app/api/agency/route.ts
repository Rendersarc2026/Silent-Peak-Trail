import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { agencyProfileSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function GET() {
    const settingsRecords = await prisma.homepage.findMany();
    const settings: Record<string, string> = {};
    settingsRecords.forEach((record) => {
        settings[record.key] = record.value;
    });
    return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { success, data: parsed, error: validationError } = await validateWithYup(agencyProfileSchema, body);

        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

        const textFields = [
            "address",
            "season"
        ];

        const updates = [];
        for (const [key, val] of Object.entries(parsed)) {
            let finalVal = String(val);
            if (textFields.includes(key)) {
                finalVal = sanitizeInput(finalVal);
            }

            updates.push(
                prisma.homepage.upsert({
                    where: { key },
                    update: { value: finalVal },
                    create: { key, value: finalVal },
                })
            );
        }

        await Promise.all(updates);

        const all = await prisma.homepage.findMany();
        const result: Record<string, string> = {};
        all.forEach((r) => (result[r.key] = r.value));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating agency profile:", error);
        return NextResponse.json({ error: "Invalid agency data provided." }, { status: 400 });
    }
}
