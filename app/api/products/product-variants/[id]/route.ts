import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateProductVariantSchema } from "@/server/product/product.schema";
import {
  getSingleProductVariantById,
  updateProductVariant,
  deleteProductVariant,
} from "@/server/product/product.service";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/product-variants/[id]
 * Fetch a single product variant by ID (admin).
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const variantId = parseInt(id, 10);
    if (isNaN(variantId)) {
      return NextResponse.json({ error: "Invalid variant ID" }, { status: 400 });
    }

    const variant = await getSingleProductVariantById(variantId);
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    return NextResponse.json(variant, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/product-variants/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch product variant" }, { status: 500 });
  }
}

/**
 * PATCH /api/products/product-variants/[id]
 * Update a product variant by ID (admin).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const variantId = parseInt(id, 10);
    if (isNaN(variantId)) {
      return NextResponse.json({ error: "Invalid variant ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateProductVariantSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateProductVariant(variantId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/products/product-variants/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to update product variant";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/products/product-variants/[id]
 * Delete a product variant by ID (admin).
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const variantId = parseInt(id, 10);
    if (isNaN(variantId)) {
      return NextResponse.json({ error: "Invalid variant ID" }, { status: 400 });
    }

    const result = await deleteProductVariant(variantId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products/product-variants/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to delete product variant";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
