import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { getOrderByGuestToken } from "@/server/order/order.service";

interface RouteContext {
  params: Promise<{
    guestToken: string;
    id: string;
  }>;
}

/**
 * GET /api/orders/guest/[guestToken]/[id]
 * Public: Secure guest order tracking using unique guestToken
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { guestToken, id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || !guestToken) {
      return NextResponse.json(
        { error: "Invalid order tracking credentials" },
        { status: 400 },
      );
    }

    const order = await getOrderByGuestToken(guestToken, numericId);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/guest/[guestToken]/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to retrieve order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
