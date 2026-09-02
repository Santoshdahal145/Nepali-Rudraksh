import { z } from "zod";

export const storeSettingSchema = z.object({
   storeName:z.string(),
   customerSupportEmail:z.string(),
   standardConsecrationFee:z.number(),
   freeShippingThreshold:z.number(),
   primaryTempleConsecrationOrigin:z.string(),
});

export type UpdateStoreSettingInput = z.infer<typeof storeSettingSchema>;


