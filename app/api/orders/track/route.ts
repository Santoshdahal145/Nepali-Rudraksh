import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { trackOrderByNumberAndContact } from "@/server/order/order.service";

/**
 * POST /api/orders/track
 * Public: Lookup an order using orderNumber and customer email/phone
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, contact } = body;

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: "Both Order Number and Email/Phone are required" },
        { status: 400 },
      );
    }

    const order = await trackOrderByNumberAndContact(orderNumber, contact);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("POST /api/orders/track error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to track order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
