import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import {
  createBlogSchema,
  getBlogsQuerySchema,
} from "@/server/blog/blog.schema";
import {
  getAllBlogsAdmin,
  createBlog,
} from "@/server/blog/blog.service";

/**
 * GET /api/blogs
 * List all blogs for admin with pagination, filtering, and search
 */
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getBlogsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getAllBlogsAdmin(result.data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch blogs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/blogs
 * Create a new blog post with sections (admin)
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const result = createBlogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const blog = await createBlog(result.data);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
