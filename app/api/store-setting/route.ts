import { requireAdmin } from "@/lib/middleware";
import { storeSettingSchema } from "@/server/store-setting/store-setting.schema";
import { updateStoreSetting,getStoreSetting } from "@/server/store-setting/store-setting.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Secure the endpoint
    await requireAdmin()

    const body = await request.json();

    // 2. Validate input
    const result = storeSettingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.message,
        },
        { status: 400 }
      );
    }

    const storeSetting=await updateStoreSetting(result.data);

    const response = NextResponse.json(storeSetting, {
      status: 200,
    });



    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Store setting update failed" },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
   const storeSetting=await getStoreSetting();
    const response = NextResponse.json(storeSetting, {
      status: 200,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to get store setting" },
      { status: 500 }
    );
  }
}