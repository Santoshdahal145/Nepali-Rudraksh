import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { createProductVariantSchema } from "@/server/product/product.schema";
import { createProductVariant } from "@/server/product/product.service";

/**
 * POST /api/products/product-variants
 * Step 2: Create a new variant for an existing product (admin).
 * Body must include productId along with variant fields.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    // Validate that productId is present in the body
    const productId = parseInt(body?.productId, 10);
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "A valid productId is required in the request body" },
        { status: 400 }
      );
    }

    const result = createProductVariantSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const variant = await createProductVariant(productId, result.data);
    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error("POST /api/products/product-variants error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to create product variant";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
