import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Package from "@/lib/models/Package";
import GalleryItem from "@/lib/models/GalleryItem";
import Destination from "@/lib/models/Destination";
import Review from "@/lib/models/Review";
import Enquiry from "@/lib/models/Enquiry";

export async function GET() {
    if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        
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
            Package.countDocuments({ isActive: true }),
            GalleryItem.countDocuments({ isActive: true }),
            Destination.countDocuments({ isActive: true }),
            Review.countDocuments({ isApproved: true, isActive: true }),
            Enquiry.countDocuments({ isActive: true }),
            Enquiry.countDocuments({ status: "new", isActive: true }),
            Enquiry.countDocuments({ status: "confirmed", isActive: true }),
            Enquiry.countDocuments({ status: "replied", isActive: true }),
            Enquiry.find({ isActive: true })
                .populate({ path: 'packageId', select: 'name', model: Package })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

        const mappedRecent = recentEnquiries.map(e => ({
            ...e,
            package: e.packageId ? (e.packageId as any).name : "N/A"
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
