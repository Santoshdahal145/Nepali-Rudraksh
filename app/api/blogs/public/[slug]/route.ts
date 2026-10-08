import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getBlogBySlug } from "@/server/blog/blog.service";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/blogs/public/[slug]
 * Public endpoint to fetch a single active blog post by its unique slug
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid blog slug" },
        { status: 400 },
      );
    }

    const blog = await getBlogBySlug(slug.trim());
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(blog, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/blogs/public/[slug] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
