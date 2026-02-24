import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Only protect /admin routes
    if (path.startsWith("/admin")) {
        // Skip protection for /admin/login
        if (path === "/admin/login") {
            return NextResponse.next();
        }

        const token = req.cookies.get("admin_token")?.value;

        if (!token || !(await verifyToken(token))) {
            const loginUrl = new URL("/admin/login", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
