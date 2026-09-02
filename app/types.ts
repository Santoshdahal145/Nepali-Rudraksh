import type { FieldOutputTypes } from "@/src/prisma/contract";

export type UserType = Omit<
  FieldOutputTypes["public"]["User"],
  "password" | "hashedRefreshToken"
>;

export type StoreSettingType = Omit<
  FieldOutputTypes["public"]["StoreSettings"], "id" | "updatedAt"
>;

export type PaymentSettingType = Omit<
  FieldOutputTypes["public"]["PaymentSettings"], "id" | "updatedAt"
>;
