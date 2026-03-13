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
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = parseInt(searchParams.get("sortOrder") || "-1");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Advanced filter params from drawer
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const packageFilter = searchParams.get("packageFilter") || "";
  const statusesParam = searchParams.get("statuses") || "";
  const statuses = statusesParam ? statusesParam.split(",").map(s => s.trim()).filter(Boolean) : [];

  await dbConnect();

  const where: any = { isActive: true };

  // Status tab filter (takes precedence over multi-status from drawer)
  if (status !== "all") {
    where.status = status;
  } else if (statuses.length > 0) {
    where.status = { $in: statuses };
  }

  // Full-text search
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s)${escapedSearch}`, 'i');
    where.$or = [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
      { email: { $regex: regex } },
      { phone: { $regex: regex } },
      { message: { $regex: regex } },
    ];
  }

  // Date range filter
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.$gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.$lte = end;
    }
  }

  // Package name filter — look up matching package IDs first
  if (packageFilter) {
    const pkgRegex = new RegExp(packageFilter, 'i');
    const matchedPackages = await Package.find({ name: pkgRegex }).select('_id').lean();
    where.packageId = { $in: matchedPackages.map((p: any) => p._id) };
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(where)
      .populate({ path: 'packageId', select: 'name', model: Package })
      .sort({ [sortBy]: sortOrder as any })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(where)
  ]);

  // Transform to include package name
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

    // Honeypot check
    if (body.website_url) {
      console.warn("Honeypot triggered, possible bot submission.");
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }


    // 2. Sanitize & Save
    await dbConnect();

    let validPackageId = undefined;
    if (parsed.packageId && /^[0-9a-fA-F]{24}$/.test(String(parsed.packageId))) {
      validPackageId = String(parsed.packageId);
    }

    const enquiry = await Enquiry.create({
      firstName: sanitizeInput(parsed.firstName),
      lastName: sanitizeInput(parsed.lastName),
      email: sanitizeInput(parsed.email),
      phone: sanitizeInput(parsed.phone),
      packageId: validPackageId,
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
        let agencyWebsite = "our website";

        settingsRecords.forEach(record => {
          if (record.key === 'phone') agencyPhone = record.value;
        });

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
