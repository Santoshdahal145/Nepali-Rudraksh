import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateProductSchema } from "@/server/product/product.schema";
import {
  getSingleProductById,
  updateProduct,
  deleteProduct,
} from "@/server/product/product.service";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id]
 * Fetch a single product by ID (admin).
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await getSingleProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[id]
 * Update a product by ID (admin).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateProduct(productId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product by ID (admin).
 * Will fail if the product has existing variants (must delete variants first).
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const result = await deleteProduct(productId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
