import { loginSchema } from "@/server/auth/auth.schema";
import { login } from "@/server/auth/auth.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.message,
        },
        { status: 400 }
      );
    }

    const { tokens, user } = await login(result.data);

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
    console.error(error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}