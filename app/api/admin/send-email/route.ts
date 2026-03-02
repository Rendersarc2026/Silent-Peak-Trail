import { NextRequest, NextResponse } from "next/server";
import { sendCustomEmail } from "@/lib/mailer";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        // Basic auth check
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // 1. Validate
        const { sendEmailSchema } = await import("@/lib/validation");
        const { sanitizeInput } = await import("@/lib/utils");
        const parsed = sendEmailSchema.parse(body);

        // 2. Sanitize & Send
        const cleanSubject = sanitizeInput(parsed.subject);
        const cleanMessage = sanitizeInput(parsed.message);

        const sent = await sendCustomEmail({ to: parsed.to, subject: cleanSubject, message: cleanMessage });

        if (!sent) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const { z } = await import("zod");
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error("API error sending custom email:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
