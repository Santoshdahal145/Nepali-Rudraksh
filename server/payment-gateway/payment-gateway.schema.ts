import { z } from "zod";

export const paymentGatewaySchema = z.object({
    esewaEnabled: z.boolean(),
    khaltiEnabled: z.boolean(),
    stripeEnabled: z.boolean(),
    codEnabled: z.boolean(),
});

export type UpdatePaymentGatewayInput = z.infer<typeof paymentGatewaySchema>;


