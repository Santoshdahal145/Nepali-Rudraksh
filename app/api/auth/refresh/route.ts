import { getCurrentRefreshToken } from "@/lib/auth.utils";
import { refreshAccessToken } from "@/server/auth/token.service";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = await getCurrentRefreshToken();
  const { accessToken } = await refreshAccessToken(refreshToken!);
  console.log("🚀 ~ POST ~ accessToken:", accessToken);

  const response = NextResponse.json({});

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // e.g. 15 minutes — match your access token's real TTL
    path: "/",
  });

  return response;
}
