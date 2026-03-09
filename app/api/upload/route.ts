import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const minSize = 1024 * 1024; // 1MB
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size < minSize || file.size > maxSize) {
            return NextResponse.json(
                { error: `Image size must be between 1MB and 10MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "silent-peak-trail",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error || new Error("Upload failed"));
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
