import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import {
  createConsultationRequestSchema,
  getConsultationRequestsQuerySchema,
} from "@/server/consultation-request/consultation-request.schema";
import {
  createConsultationRequest,
  getAllConsultationRequestsAdmin,
} from "@/server/consultation-request/consultation-request.service";

/**
 * POST /api/consultation-requests
 * Public: Any user can submit a consultation request
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createConsultationRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid consultation request data",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const created = await createConsultationRequest(result.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/consultation-requests error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to submit consultation request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/consultation-requests
 * Admin: List consultation requests with pagination, filters, and search
 */
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const result = getConsultationRequestsQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = await getAllConsultationRequestsAdmin(result.data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/consultation-requests error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch consultation requests";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
