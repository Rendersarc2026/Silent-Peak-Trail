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

        const { to, subject, message } = await req.json();

        if (!to || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sent = await sendCustomEmail({ to, subject, message });

        if (!sent) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API error sending custom email:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
