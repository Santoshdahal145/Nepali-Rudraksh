import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.utils";
import { AppError } from "@/lib/error";
import { getUserOrders } from "@/server/order/order.service";

/**
 * GET /api/orders/my-orders
 * Customer: Retrieve all orders placed by the currently logged-in user
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Please log in to view your order history" },
        { status: 401 },
      );
    }

    const orders = await getUserOrders(currentUser.userId);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/my-orders error:", error);

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
