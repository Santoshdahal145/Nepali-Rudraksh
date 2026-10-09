import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getSimilarProductsAccordingToCurrentSlug } from "@/server/product/product.service";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/products/public/[slug]/similar
 * Public endpoint to fetch similar products for a given product slug.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 4;

    const similarProducts = await getSimilarProductsAccordingToCurrentSlug(
      slug.trim(),
      isNaN(limit) || limit <= 0 ? 4 : limit
    );

    return NextResponse.json(similarProducts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/products/public/[slug]/similar error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch similar products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
