import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { getUserById } from "@/server/user/user.service";

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
