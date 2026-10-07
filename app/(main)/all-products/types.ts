import { PaginationType, ProductType } from "@/app/types";

export type AllProductsSearchParamsPublic = Promise<{
  page?: string;
  limit?: string;
  search?: string;
  type?: string;
  mukhi?: string;
  originId?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export interface AllProductsPublicResponseType {
  products: ProductType[];
  pagination: PaginationType;
}
