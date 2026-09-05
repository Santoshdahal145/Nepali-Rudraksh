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

//PRODUCT TYPE
export type RudrakshOriginType = FieldOutputTypes["public"]["RudrakshaOrigin"]

export type IndividualRudrakshaDetailType = FieldOutputTypes["public"]["IndividualRudrakshaDetail"]

export type RudrakshaMalaDetailType = FieldOutputTypes["public"]["RudrakshaMalaDetail"]

export type ProductImageType = FieldOutputTypes["public"]["ProductImage"]

export type IndividualVariantAttrsType = FieldOutputTypes["public"]["IndividualVariantAttrs"]

export type MalaVariantAttrsType = FieldOutputTypes["public"]["MalaVariantAttrs"]

export type ProductVariantType = FieldOutputTypes["public"]["ProductVariant"] & {
  individualVariantAttrs?: IndividualVariantAttrsType;
  malaVariantAttrs?: MalaVariantAttrsType;
  origin?: RudrakshOriginType;
  variantImages?: ProductImageType[];
}

export type ProductType = FieldOutputTypes["public"]["Product"] & {
  variants: ProductVariantType[];
  images: ProductImageType[];
  individualRudrakshaDetail?: IndividualRudrakshaDetailType;
  rudrakshaMalaDetail?: RudrakshaMalaDetailType;
  
}

export  type PaginationType={
     page: number,
     limit: number,
     total: number,
     totalPages: number,
     hasNextPage: boolean,
     hasPrevPage: boolean
}

export type PaginatedResponse<K extends string, T> = {
  [P in K]: T;
} & {
  pagination: PaginationType;
};


export type   AllProductsResponseType = PaginatedResponse<'products', ProductType[]>
export type   AllRudrakshOriginResponseType = PaginatedResponse<'origins', RudrakshOriginType[]>