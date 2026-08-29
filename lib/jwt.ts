import jwt from 'jsonwebtoken';
import type { NextRequest } from "next/server";

export type JwtPayload = {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
};

export function parseAccessTokenFromCookie(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  if (!token) return null;
  return token.value;
}

export function parseRefreshTokenFromCookie(request: NextRequest) {
  const token = request.cookies.get("refreshToken");
  if (!token) return null;
  return token.value;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}