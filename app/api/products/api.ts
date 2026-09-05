import { ApiRequestType } from "@/lib/requestAPI";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ProductType = "INDIVIDUAL_RUDRAKSHA" | "RUDRAKSHA_MALA";

type ProductImagePayload = {
  url: string;
  altText?: string | null;
  position?: number;
};

type VariantImagePayload = {
  url: string;
  altText?: string | null;
  position?: number;
};

export type CreateProductPayload = {
  name: string;
  slug?: string;
  description: string;
  type: ProductType;
  individualDetail?: { mukhi: number } | null;
  malaDetail?: { mukhi?: number | null } | null;
  images?: ProductImagePayload[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: ProductType;
  mukhi?: number;
  originId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "name" | "price";
  sortOrder?: "asc" | "desc";
};

export type CreateVariantPayload = {
  productId: number;
  sku: string;
  price: number;
  stock?: number;
  color?: string | null;
  originId?: number | null;
  weightGrams?: number | null;
  individualAttrs?: { size: number } | null;
  malaAttrs?: { beadCount?: number | null; material?: string | null } | null;
  images?: VariantImagePayload[];
};

export type UpdateVariantPayload = Partial<Omit<CreateVariantPayload, "productId">>;

export type CreateOriginPayload = {
  name: string;
  country: string;
};

export type UpdateOriginPayload = Partial<CreateOriginPayload>;

// ─────────────────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/products — List all products with optional filters */
const getProducts = (params?: GetProductsParams): ApiRequestType => ({
  method: "get",
  route: "/products",
  params,
  showToast: false,
});

/** GET /api/products/[id] — Fetch a single product by ID */
const getProductById = (id: number): ApiRequestType => ({
  method: "get",
  route: `/products/${id}`,
  showToast: false,
});

/** POST /api/products — Create a new product (Step 1, no variants yet) */
const createProduct = (data: CreateProductPayload): ApiRequestType => ({
  method: "post",
  route: "/products",
  payload: data,
  showToast: true,
  successMessage: "Product created successfully",
});

/** PATCH /api/products/[id] — Update an existing product */
const updateProduct = (id: number, data: UpdateProductPayload): ApiRequestType => ({
  method: "patch",
  route: `/products/${id}`,
  payload: data,
  showToast: true,
  successMessage: "Product updated successfully",
});

/**
 * DELETE /api/products/[id] — Delete a product.
 * Will fail if the product still has variants.
 */
const deleteProduct = (id: number): ApiRequestType => ({
  method: "delete",
  route: `/products/${id}`,
  showToast: true,
  successMessage: "Product deleted successfully",
});

// ─────────────────────────────────────────────────────────────────────────────
// Product Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/products/product-variants — Create a variant for an existing product (Step 2).
 * `productId` must be included in the payload.
 */
const createProductVariant = (data: CreateVariantPayload): ApiRequestType => ({
  method: "post",
  route: "/products/product-variants",
  payload: data,
  showToast: true,
  successMessage: "Variant created successfully",
});

/** GET /api/products/product-variants/[id] — Fetch a single variant by ID */
const getProductVariantById = (id: number): ApiRequestType => ({
  method: "get",
  route: `/products/product-variants/${id}`,
  showToast: false,
});

/** PATCH /api/products/product-variants/[id] — Update a variant */
const updateProductVariant = (id: number, data: UpdateVariantPayload): ApiRequestType => ({
  method: "patch",
  route: `/products/product-variants/${id}`,
  payload: data,
  showToast: true,
  successMessage: "Variant updated successfully",
});

/** DELETE /api/products/product-variants/[id] — Delete a variant */
const deleteProductVariant = (id: number): ApiRequestType => ({
  method: "delete",
  route: `/products/product-variants/${id}`,
  showToast: true,
  successMessage: "Variant deleted successfully",
});

// ─────────────────────────────────────────────────────────────────────────────
// Rudraksha Origins
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/products/rudraksh-origin — List all Rudraksha origins */
const getRudrakshOrigins = (): ApiRequestType => ({
  method: "get",
  route: "/products/rudraksh-origin",
  showToast: false,
});

/** GET /api/products/rudraksh-origin/[id] — Fetch a single origin by ID */
const getRudrakshOriginById = (id: number): ApiRequestType => ({
  method: "get",
  route: `/products/rudraksh-origin/${id}`,
  showToast: false,
});

/** POST /api/products/rudraksh-origin — Create a new Rudraksha origin */
const createRudrakshOrigin = (data: CreateOriginPayload): ApiRequestType => ({
  method: "post",
  route: "/products/rudraksh-origin",
  payload: data,
  showToast: true,
  successMessage: "Rudraksha origin created successfully",
});

/** PATCH /api/products/rudraksh-origin/[id] — Update a Rudraksha origin */
const updateRudrakshOrigin = (id: number, data: UpdateOriginPayload): ApiRequestType => ({
  method: "patch",
  route: `/products/rudraksh-origin/${id}`,
  payload: data,
  showToast: true,
  successMessage: "Rudraksha origin updated successfully",
});

/**
 * DELETE /api/products/rudraksh-origin/[id] — Delete a Rudraksha origin.
 * Will fail if any product variant references this origin.
 */
const deleteRudrakshOrigin = (id: number): ApiRequestType => ({
  method: "delete",
  route: `/products/rudraksh-origin/${id}`,
  showToast: true,
  successMessage: "Rudraksha origin deleted successfully",
});

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export const productApi = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export const productVariantApi = {
  createProductVariant,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant,
};

export const rudrakshOriginApi = {
  getRudrakshOrigins,
  getRudrakshOriginById,
  createRudrakshOrigin,
  updateRudrakshOrigin,
  deleteRudrakshOrigin,
};