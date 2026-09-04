import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { rudrakshOriginSchema } from "@/server/rudraksh-origin/rudraksh-origin.schema";
import {
  getAllRudrakshOrigin,
  createRudrakshOrigin,
} from "@/server/rudraksh-origin/rudraksh-origin.service";

export async function GET() {
  try {
    const origins = await getAllRudrakshOrigin();
    return NextResponse.json(origins, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch rudraksh origins:", error);
    return NextResponse.json(
      { error: "Failed to fetch rudraksh origins" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const result = rudrakshOriginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    const createdOrigin = await createRudrakshOrigin(result.data);
    return NextResponse.json(createdOrigin, { status: 201 });
  } catch (error) {
    console.error("Failed to create rudraksh origin:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create rudraksh origin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}