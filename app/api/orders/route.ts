import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.utils";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import {
  createOrderSchema,
  getOrdersQuerySchema,
} from "@/server/order/order.schema";
import {
  createOrder,
  getAllOrdersAdmin,
} from "@/server/order/order.service";

/**
 * POST /api/orders
 * Public or Logged-in: Create a new order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid order data",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Check if the placing user is authenticated
    const currentUser = await getCurrentUser();
    const userId = currentUser ? currentUser.userId : null;

    const createdOrder = await createOrder(result.data, userId);
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/orders
 * Admin: List all orders with filters, search, and pagination
 */
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getOrdersQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getAllOrdersAdmin(result.data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/orders error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
