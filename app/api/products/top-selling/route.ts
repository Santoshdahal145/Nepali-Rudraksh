import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getTopSellingProductsQuerySchema } from "@/server/product/product.schema";
import { getTopSellingProducts } from "@/server/product/product.service";

/**
 * GET /api/products/top-selling
 * Fetch top selling products based on verified sales and devotees' choice.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getTopSellingProductsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getTopSellingProducts(result.data);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/products/top-selling error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch top selling products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
