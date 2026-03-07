import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Enquiry from "@/lib/models/Enquiry";
import Package from "@/lib/models/Package";
import Homepage from "@/lib/models/Homepage";
import { sanitizeInput, validateWithYup } from "@/lib/utils";
import { enquirySchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const session = await getSession();
  const where: any = { isActive: true };
  if (status !== "all") {
    where.status = status;
  }
  if (search) {
    where.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  await dbConnect();

  const [enquiries, total] = await Promise.all([
    Enquiry.find(where)
      .populate({ path: 'packageId', select: 'name', model: Package })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(where)
  ]);

  // Transform to include package name if needed by frontend
  const data = enquiries.map(e => ({
    ...e,
    package: e.packageId ? (e.packageId as any).name : "N/A"
  }));

  const [allCount, statusCounts] = await Promise.all([
    Enquiry.countDocuments({ isActive: true }),
    Enquiry.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", _count: { $sum: 1 } } }
    ])
  ]);

  const counts: Record<string, number> = { all: allCount };
  statusCounts.forEach(sc => {
    counts[sc._id] = sc._count;
  });

  return NextResponse.json({
    data,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    counts
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate
    const { success, data: parsed, error: validationError } = await validateWithYup(enquirySchema, body);

    if (!success) {
      return NextResponse.json({ error: "Validation failed", details: validationError?.fieldErrors }, { status: 400 });
    }

    // 2. Sanitize & Save
    await dbConnect();
    const enquiry = await Enquiry.create({
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
    });

    // 3. Send automated confirmation email asynchronously
    import("@/lib/mailer").then(async ({ sendEnquiryConfirmationMail }) => {
      try {
        const settingsRecords = await Homepage.find({
          key: { $in: ['phone', 'address'] }
        }).lean();

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
    console.error("Enquiry validation error:", err);
    return NextResponse.json({ error: "Invalid input provided." }, { status: 400 });
  }
}
