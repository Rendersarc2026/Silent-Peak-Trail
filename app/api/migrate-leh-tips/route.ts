import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LehTip from "@/lib/models/LehTip";

export async function GET() {
    try {
        await dbConnect();
        const result = await LehTip.updateMany(
            { order: 0 },
            { $set: { order: 1 } }
        );
        return NextResponse.json({
            success: true,
            message: `Migration complete. Updated ${result.modifiedCount} documents.`
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Migration failed"
        }, { status: 500 });
    }
}
