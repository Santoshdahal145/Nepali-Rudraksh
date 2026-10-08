import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getBlogsQuerySchema } from "@/server/blog/blog.schema";
import { getAllBlogsPublic } from "@/server/blog/blog.service";

/**
 * GET /api/blogs/public
 * Public listing of active blogs with pagination, search, tag, and sort filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getBlogsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getAllBlogsPublic(result.data);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/blogs/public error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch public blogs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
