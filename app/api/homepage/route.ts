import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { homepageContentSchema } from "@/lib/validation";
import { z } from "zod";

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
        const parsed = homepageContentSchema.parse(body);

        const textFields = [
            "heroBgImage",
            "heroTitle",
            "heroSubtitle",
            "heroBadge",
            "statsAltitude",
            "statsPackages",
            "statsTravellers",
            "statsExperience",
            "statsSatisfaction",
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
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("Error updating homepage content:", error);
        return NextResponse.json({ error: "Invalid homepage data provided." }, { status: 400 });
    }
}
