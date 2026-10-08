import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateBlogSchema } from "@/server/blog/blog.schema";
import {
  getBlogById,
  updateBlog,
  deleteBlog,
} from "@/server/blog/blog.service";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/blogs/[id]
 * Fetch a single blog by ID
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await getBlogById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/blogs/[id]
 * Update a blog post by ID (admin)
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateBlogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const updated = await updateBlog(blogId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/blogs/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to update blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/blogs/[id]
 * Alias to PATCH for updating blog post by ID (admin)
 */
export async function PUT(request: Request, context: RouteContext) {
  return PATCH(request, context);
}

/**
 * DELETE /api/blogs/[id]
 * Delete a blog post by ID (admin)
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const result = await deleteBlog(blogId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to delete blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
