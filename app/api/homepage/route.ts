import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { homepageContentSchema } from "@/lib/validation";
import dbConnect from "@/lib/db";
import Homepage from "@/lib/models/Homepage";

export async function GET() {
    await dbConnect();
    const settingsRecords = await Homepage.find().lean();
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
        const { success, data: parsed, error: validationError } = await validateWithYup(homepageContentSchema, body);

        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

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
            "whyUsTitle",
            "whyUsSubtitle",
            "stargazingTitle",
            "stargazingTagline",
            "footerDescription",
            "amsWarningTitle",
            "amsWarningDesc",
            "bookButtonText",
        ];

        const updates = [];
        for (const [key, val] of Object.entries(parsed)) {
            let finalVal = String(val);
            if (textFields.includes(key)) {
                finalVal = sanitizeInput(finalVal);
            }

            updates.push(
                Homepage.findOneAndUpdate(
                    { key },
                    { value: finalVal },
                    { new: true, upsert: true }
                )
            );
        }

        await Promise.all(updates);

        const all = await Homepage.find().lean();
        const result: Record<string, string> = {};
        all.forEach((r) => (result[r.key] = r.value));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating homepage content:", error);
        return NextResponse.json({ error: "Invalid homepage data provided." }, { status: 400 });
    }
}
