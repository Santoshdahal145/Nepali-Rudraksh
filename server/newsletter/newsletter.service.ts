import { db } from "../../src/prisma/db";
import { AppError } from "../../lib/error";
import { SubscribeNewsletterInput } from "./newsletter.schema";

/**
 * Subscribe a new email to the newsletter without duplicates
 */
export async function subscribeNewsletter(input: SubscribeNewsletterInput) {
  const email = input.email.trim().toLowerCase();

  const existing = await db.orm.public.NewsLetterSubscriber.where({
    email,
  }).first();

  if (existing) {
    if (existing.isActive) {
      throw new AppError(
        "This email is already subscribed to our newsletter",
        409,
      );
    }

    // Re-activate if was previously inactive
    const updated = await db.orm.public.NewsLetterSubscriber.where({
      id: existing.id,
    }).update({
      isActive: true,
      updatedAt: new Date(),
    });

    return {
      message:
        "Welcome back! Your newsletter subscription has been reactivated.",
      subscriber: updated,
    };
  }

  const subscriber = await db.orm.public.NewsLetterSubscriber.create({
    email,
    isActive: true,
  });

  return {
    message: "Thank you for subscribing to our sacred Vedic newsletter!",
    subscriber,
  };
}

/**
 * Fetch all newsletter subscribers (admin listing)
 */
export async function getAllNewsletterSubscribers() {
  const subscribers = await db.orm.public.NewsLetterSubscriber
    .orderBy((s) => s.createdAt.desc())
    .all();

  return subscribers;
}
