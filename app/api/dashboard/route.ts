import { requireAdmin } from "@/lib/middleware";
import { getDashboardData } from "@/server/dashboard/dashboard.service";
import { NextResponse } from "next/server";

export async function GET() {
  await requireAdmin();
  try {
    const dashboardData = await getDashboardData();
    const response = NextResponse.json(dashboardData, {
      status: 200,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to get Dashboard Data !" },
      { status: 500 },
    );
  }
}
