import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { AppError } from "@/lib/error";
import { updateRudrakshOriginSchema } from "@/server/rudraksh-origin/rudraksh-origin.schema";
import {
  getRudrakshOriginById,
  updateRudrakshOrigin,
  deleteRudrakshOrigin,
} from "@/server/rudraksh-origin/rudraksh-origin.service";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/rudraksh-origin/[id]
 * Fetch a single Rudraksha origin by ID.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const originId = parseInt(id, 10);
    if (isNaN(originId)) {
      return NextResponse.json({ error: "Invalid origin ID" }, { status: 400 });
    }

    const origin = await getRudrakshOriginById(originId);
    if (!origin) {
      return NextResponse.json({ error: "Rudraksha origin not found" }, { status: 404 });
    }

    return NextResponse.json(origin, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/rudraksh-origin/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch rudraksha origin" }, { status: 500 });
  }
}

/**
 * PATCH /api/products/rudraksh-origin/[id]
 * Update a Rudraksha origin by ID (admin).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const originId = parseInt(id, 10);
    if (isNaN(originId)) {
      return NextResponse.json({ error: "Invalid origin ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateRudrakshOriginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateRudrakshOrigin(originId, result.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/products/rudraksh-origin/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to update rudraksha origin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * DELETE /api/products/rudraksh-origin/[id]
 * Delete a Rudraksha origin by ID (admin).
 * Will fail if any product variant is using this origin.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const originId = parseInt(id, 10);
    if (isNaN(originId)) {
      return NextResponse.json({ error: "Invalid origin ID" }, { status: 400 });
    }

    await deleteRudrakshOrigin(originId);
    return NextResponse.json(
      { success: true, id: originId, message: "Rudraksha origin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/products/rudraksh-origin/[id] error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Failed to delete rudraksha origin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
