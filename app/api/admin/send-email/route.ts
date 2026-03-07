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
        const { sanitizeInput, validateWithYup } = await import("@/lib/utils");
        const { success, data: parsed, error: validationError } = await validateWithYup(sendEmailSchema, body);
        
        if (!success) {
            return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
        }

        // 2. Sanitize & Send
        const cleanSubject = sanitizeInput(parsed.subject);
        const cleanMessage = sanitizeInput(parsed.message);

        const sent = await sendCustomEmail({ to: parsed.to, subject: cleanSubject, message: cleanMessage });

        if (!sent) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API error sending custom email:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
