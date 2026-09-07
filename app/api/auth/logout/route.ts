import { getCurrentRefreshToken } from "@/lib/auth.utils";
import { revokeRefreshToken } from "@/server/auth/token.service";
import { NextResponse } from "next/server";

export async function POST() {
     const refreshToken = await getCurrentRefreshToken();
     refreshToken &&  await revokeRefreshToken(refreshToken);
    
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
  
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return response;
}