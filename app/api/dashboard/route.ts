import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const [
            packageCount,
            galleryCount,
            destinationCount,
            reviewCount,
            totalEnquiriesCount,
            newEnquiriesCount,
            confirmedEnquiriesCount,
            repliedEnquiriesCount,
            recentEnquiries,
        ] = await Promise.all([
            prisma.package.count({ where: { isActive: true } }),
            prisma.galleryItem.count({ where: { isActive: true } }),
            prisma.destination.count({ where: { isActive: true } }),
            prisma.review.count({ where: { isApproved: true, isActive: true } }),
            prisma.enquiry.count({ where: { isActive: true } }),
            prisma.enquiry.count({ where: { status: "new", isActive: true } }),
            prisma.enquiry.count({ where: { status: "confirmed", isActive: true } }),
            prisma.enquiry.count({ where: { status: "replied", isActive: true } }),
            prisma.enquiry.findMany({
                where: { isActive: true },
                include: { tourPackage: { select: { name: true } } },
                orderBy: { createdAt: "desc" },
                take: 5
            }),
        ]);

        const mappedRecent = recentEnquiries.map(e => ({
            ...e,
            package: e.tourPackage?.name || "N/A"
        }));

        return NextResponse.json({
            packages: packageCount,
            enquiries: totalEnquiriesCount,
            newEnquiries: newEnquiriesCount,
            gallery: galleryCount,
            destinations: destinationCount,
            testimonials: reviewCount,
            confirmed: confirmedEnquiriesCount,
            replied: repliedEnquiriesCount,
            recent: mappedRecent,
        });
    } catch (err) {
        console.error("Dashboard API error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
