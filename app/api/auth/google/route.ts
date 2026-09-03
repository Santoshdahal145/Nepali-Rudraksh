import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { googleLogin } from "@/server/auth/auth.service";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
    }

    const { sub: providerAccountId, email, given_name, family_name, email_verified } = payload
    console.log(payload,"------>>>>>>")
    const {tokens,user} = await googleLogin({
      providerAccountId,
      email,
      firstName:given_name,
      lastName:family_name,
      emailVerified:!!email_verified
    });
        const response = NextResponse.json(user, {
          status: 200,
        });
    
        // Access token
        response.cookies.set("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 15, 
        });
    
    
        response.cookies.set("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, 
        });
    
        return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}