import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateConsultationRequestSchema } from "@/server/consultation-request/consultation-request.schema";
import {
  getConsultationRequestById,
  updateConsultationRequest,
  deleteConsultationRequest,
} from "@/server/consultation-request/consultation-request.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/consultation-requests/[id]
 * Admin: Get single consultation request by ID
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const item = await getConsultationRequestById(numericId);
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("GET /api/consultation-requests/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch consultation request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/consultation-requests/[id]
 * Admin: Update consultation request (status, adminNotes)
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateConsultationRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const updated = await updateConsultationRequest(numericId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/consultation-requests/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update consultation request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/consultation-requests/[id]
 * Admin: Delete consultation request by ID
 */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await deleteConsultationRequest(numericId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/consultation-requests/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete consultation request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
