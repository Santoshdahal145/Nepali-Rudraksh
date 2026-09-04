import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import {
  createProductSchema,
  getProductsQuerySchema,
} from "@/server/product/product.schema";
import {
  getAllProductsAdmin,
  createProduct,
} from "@/server/product/product.service";

/**
 * GET /api/products
 * List all products (admin). Supports pagination, search, filtering, sorting.
 */
export async function GET(request: Request) {
  try {
    // await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getProductsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = await getAllProductsAdmin(result.data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product (admin).
 * Step 1 of 2: create the product first, then add variants separately.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const product = await createProduct(result.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
