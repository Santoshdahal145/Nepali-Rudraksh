import { z } from "zod";

export const rudrakshOriginSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    country: z.string().min(1, { message: "Country is required" }),
});

export type CreateRudrakshOriginInput = z.infer<typeof rudrakshOriginSchema>;

export const updateRudrakshOriginSchema = rudrakshOriginSchema.partial();

export type UpdateRudrakshOriginInput = z.infer<typeof updateRudrakshOriginSchema>;