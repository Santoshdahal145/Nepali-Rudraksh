import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getFeaturedProductsQuerySchema } from "@/server/product/product.schema";
import { getFeaturedProducts } from "@/server/product/product.service";

/**
 * GET /api/products/featured
 * Fetch featured products for display with optional limit and category filtering.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getFeaturedProductsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getFeaturedProducts(result.data);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/products/featured error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch featured products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
