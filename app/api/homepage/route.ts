import { getHomePageData } from "@/server/homepage/homepage.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const homepageData = await getHomePageData();
    const response = NextResponse.json(homepageData, {
      status: 200,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to get Homepage Data !" },
      { status: 500 },
    );
  }
}
