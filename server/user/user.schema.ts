import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),

});

export type CreateUserInput = z.infer<typeof createUserSchema>;