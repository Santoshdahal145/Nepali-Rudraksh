import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.utils";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateOrderStatusSchema } from "@/server/order/order.schema";
import {
  getOrderById,
  updateOrderStatusAdmin,
} from "@/server/order/order.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/orders/[id]
 * View single order. Allowed if:
 * 1) Admin user
 * 2) The logged-in customer who owns the order
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await getOrderById(numericId);
    const currentUser = await getCurrentUser();

    const isAdmin = currentUser?.role === "ADMIN";
    const isOwner = currentUser?.userId && order.userId === currentUser.userId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You are not authorized to view this order" },
        { status: 403 },
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[id]
 * Admin: Update order status, payment status, payment ref, or notes
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateOrderStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid update payload",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const updated = await updateOrderStatusAdmin(numericId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to update order status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
