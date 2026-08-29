import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../../src/prisma/db";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type TokenPayload = { userId: number; role: string };

export function signAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: TokenPayload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}


export async function issueTokens(userId: number, role: string) {
    const accessToken = signAccessToken({ userId, role });
    const refreshToken = signRefreshToken({ userId, role });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await db.orm.public.User
        .where({ id: userId })
        .update({ hashedRefreshToken });

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await db.orm.public.User
        .select("id", "role", "hashedRefreshToken")
        .where({ id: payload.userId })
        .first();

    if (!user || !user.hashedRefreshToken) {
        throw new Error("Invalid refresh token");
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) {
        throw new Error("Invalid refresh token");
    }
    return issueTokens(user.id, user.role ?? "USER");
}

export async function revokeRefreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    await db.orm.public.User
        .where({ id: payload.userId })
        .update({ hashedRefreshToken: null });
}