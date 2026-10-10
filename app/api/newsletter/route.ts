import { NextResponse } from "next/server";
import { AppError } from "@/lib/error";
import { subscribeNewsletterSchema } from "@/server/newsletter/newsletter.schema";
import {
  subscribeNewsletter,
  getAllNewsletterSubscribers,
} from "@/server/newsletter/newsletter.service";

/**
 * POST /api/newsletter
 * Subscribe an email to the newsletter.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = subscribeNewsletterSchema.safeParse(body);

    if (!result.success) {
      const errorMessage =
        result.error.issues?.[0]?.message || "Invalid email address";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const data = await subscribeNewsletter(result.data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to subscribe to newsletter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/newsletter
 * List all subscribers.
 */
export async function GET() {
  try {
    const data = await getAllNewsletterSubscribers();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/newsletter error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}
