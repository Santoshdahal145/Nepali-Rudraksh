import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getSingleProductBySlug } from "@/server/product/product.service";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/products/public/[slug]
 * Public endpoint to fetch a single product by unique slug with all its variants and attributes.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    const product = await getSingleProductBySlug(slug.trim());
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/products/public/[slug] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
