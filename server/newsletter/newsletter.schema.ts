import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" }),
});

export type SubscribeNewsletterInput = z.infer<
  typeof subscribeNewsletterSchema
>;
