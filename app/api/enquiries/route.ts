import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeInput } from "@/lib/utils";
import { enquirySchema } from "@/lib/validation";
import { z } from "zod";

export async function GET() {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(enquiries);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate
    const parsed = enquirySchema.parse(body);

    // 2. Sanitize & Save
    const enquiry = await prisma.enquiry.create({
      data: {
        firstName: sanitizeInput(parsed.firstName),
        lastName: sanitizeInput(parsed.lastName),
        email: sanitizeInput(parsed.email),
        phone: sanitizeInput(parsed.phone),
        packageId: parsed.packageId,
        travellers: sanitizeInput(parsed.travellers),
        month: sanitizeInput(parsed.month),
        budget: sanitizeInput(parsed.budget),
        message: sanitizeInput(parsed.message),
        status: "new"
      }
    });

    // 3. Send automated confirmation email asynchronously
    import("@/lib/mailer").then(async ({ sendEnquiryConfirmationMail }) => {
      try {
        const settingsRecords = await prisma.homepage.findMany({
          where: { key: { in: ['phone', 'address'] } }
        });

        let agencyPhone = "our office";
        let agencyWebsite = "our website"; // fallback if domain isn't in DB

        settingsRecords.forEach(record => {
          if (record.key === 'phone') agencyPhone = record.value;
          // You might not have the pure domain in the DB, but we get what we can
          // if we add a website field later, we can map it here.
        });

        // Use the origin from the request to build the website URL if possible
        const origin = req.headers.get("origin") || req.nextUrl.origin;
        if (origin && origin !== "null") {
          agencyWebsite = origin;
        }

        await sendEnquiryConfirmationMail({
          toEmail: enquiry.email,
          firstName: enquiry.firstName,
          agencyPhone: agencyPhone,
          agencyWebsite: agencyWebsite,
        });
      } catch (mailError) {
        console.error("Failed to send async confirmation email:", mailError);
      }
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Enquiry validation error:", err);
    return NextResponse.json({ error: "Invalid input provided." }, { status: 400 });
  }
}
