import { cookies } from "next/headers";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { verifyToken, signToken, type AdminPayload } from "./jwt";

export { type AdminPayload, signToken, verifyToken };

export async function getSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function checkCredentials(user: string, pass: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { username: user }
  });

  if (!admin) return false;
  return bcrypt.compare(pass, admin.password);
}
