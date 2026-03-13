import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!(await checkCredentials(username, password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ user: username, role: "admin" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12h
    path: "/",
  });
  return res;
}
