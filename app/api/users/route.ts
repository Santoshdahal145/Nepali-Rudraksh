import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { getUsersQuerySchema } from "@/server/user/user.schema";
import { getAllUsers } from "@/server/user/user.service";

/**
 * GET /api/users
 * List all users with pagination, search, role filtering, and sorting (admin only).
 */
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getUsersQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = await getAllUsers(result.data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
