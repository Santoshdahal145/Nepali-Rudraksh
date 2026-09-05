import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { getUserById, updateUser } from "@/server/user/user.service";
import { updateUserSchema } from "@/server/user/user.schema";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/users/[id]
 * Fetch a single user by ID with full detailed information (admin only).
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Update user details, role, or status (admin only).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateUser(userId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

