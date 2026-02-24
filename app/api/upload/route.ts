import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export async function POST(req: NextRequest) {
    if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename: lowercase, replace spaces/special chars with hyphens
        const ext = extname(file.name).toLowerCase();
        let baseName = file.name
            .replace(/\.[^/.]+$/, "")         // strip extension
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")      // replace non-alphanumeric with hyphen
            .replace(/^-+|-+$/g, "");          // trim leading/trailing hyphens

        if (!baseName) baseName = "image";
        const filename = `${baseName.slice(0, 60)}${ext}`;

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);
        const publicPath = `/uploads/${filename}`;

        // Check if file already exists
        let fileExists = false;
        try {
            const { access } = await import("fs/promises");
            await access(path);
            fileExists = true;
        } catch {
            fileExists = false;
        }

        if (fileExists) {
            console.log(`Reusing existing file: ${filename}`);
            return NextResponse.json({ url: publicPath });
        }

        await writeFile(path, buffer);
        console.log(`Saved new file: ${filename}`);

        return NextResponse.json({ url: publicPath });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
