import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "ladakh-admin-secret-key-change-in-production"
);

export interface AdminPayload {
    user: string;
    role: "admin";
}

export async function signToken(payload: AdminPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .setIssuedAt()
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as AdminPayload;
    } catch {
        return null;
    }
}
