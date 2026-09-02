import { requireAdmin } from "@/lib/middleware";
import { paymentGatewaySchema } from "@/server/payment-gateway/payment-gateway.schema";
import { updatePaymentGateway,getPaymentGateway } from "@/server/payment-gateway/payment-gateway.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json();
    const result = paymentGatewaySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.message,
        },
        { status: 400 }
      );
    }
    const paymentGateway=await updatePaymentGateway(result.data);
    const response = NextResponse.json(paymentGateway, {
      status: 200,
    });



    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Payment gateway update failed" },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
   const paymentGateway=await getPaymentGateway();
    const response = NextResponse.json(paymentGateway, {
      status: 200,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to get payment gateway" },
      { status: 500 }
    );
  }
}