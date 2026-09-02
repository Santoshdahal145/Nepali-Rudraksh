import { getCurrentUser } from "@/lib/auth.utils";
import { updateUserSchema } from "@/server/user/user.schema";
import { updateUser } from "@/server/user/user.service";
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
    const result = updateUserSchema.safeParse(body);

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
    await updateUser(userId, result.data);

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User update error:", error);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}