import { getCurrentUser } from "@/lib/auth.utils";
import { changePasswordSchema } from "@/server/auth/auth.schema";
import { changeUserPassword } from "@/server/auth/auth.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Get authenticated user from HttpOnly cookie
    const payload = await getCurrentUser();

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Validate request
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 4. Get user ID from authenticated JWT
    const userId = Number(payload.userId);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: "Invalid authentication data" },
        { status: 401 }
      );
    }

    // 5. Change password
    await changeUserPassword(userId, result.data);

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}