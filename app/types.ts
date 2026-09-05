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
  productVariants?: ProductVariantType[];
  productImages?: ProductImageType[];
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


export type AllProductsResponseType = PaginatedResponse<'products', ProductType[]>
export type AllRudrakshOriginResponseType = PaginatedResponse<'origins', RudrakshOriginType[]>

// USER TYPES
export type AccountType = FieldOutputTypes["public"]["Account"];
export type OtpType = Omit<FieldOutputTypes["public"]["Otp"], "codeHash">;

export type SingleUserResponseType = UserType & {
  accounts?: AccountType[];
  otps?: OtpType[];
};

export type AllUsersResponseType = PaginatedResponse<"users", UserType[]>;

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: "ADMIN" | "USER";
  isEmailVerified?: boolean;
  sortBy?: "createdAt" | "firstName" | "lastName" | "email";
  sortOrder?: "asc" | "desc";
};