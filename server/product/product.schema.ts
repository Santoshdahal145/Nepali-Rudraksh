import { z } from "zod";

export const ProductTypeEnum = z.enum([
  "INDIVIDUAL_RUDRAKSHA",
  "RUDRAKSHA_MALA",
]);
export type ProductType = z.infer<typeof ProductTypeEnum>;

// Image schemas
export const productImageSchema = z.object({
  url: z.string().min(1, { message: "Image URL is required" }),
  altText: z.string().optional().nullable(),
  position: z.number().int().default(0),
});
export type ProductImageInput = z.infer<typeof productImageSchema>;

export const variantImageSchema = z.object({
  url: z.string().min(1, { message: "Variant image URL is required" }),
  altText: z.string().optional().nullable(),
  position: z.number().int().default(0),
});
export type VariantImageInput = z.infer<typeof variantImageSchema>;

// Detail schemas
export const individualRudrakshaDetailSchema = z.object({
  mukhi: z.number().int().positive({ message: "Mukhi must be a positive integer" }),
});
export type IndividualRudrakshaDetailInput = z.infer<typeof individualRudrakshaDetailSchema>;

export const rudrakshaMalaDetailSchema = z.object({
  mukhi: z.number().int().positive({ message: "Mukhi must be a positive integer" }).optional().nullable(),
});
export type RudrakshaMalaDetailInput = z.infer<typeof rudrakshaMalaDetailSchema>;

// Variant attribute schemas
export const individualVariantAttrsSchema = z.object({
  size: z.number().int().positive({ message: "Size (in mm) must be a positive integer" }),
});
export type IndividualVariantAttrsInput = z.infer<typeof individualVariantAttrsSchema>;

export const malaVariantAttrsSchema = z.object({
  beadCount: z.number().int().positive().optional().nullable(),
  material: z.string().optional().nullable(),
});
export type MalaVariantAttrsInput = z.infer<typeof malaVariantAttrsSchema>;

// ── Variant Schemas (handled separately) ──────────────────────────────────────

export const createProductVariantSchema = z.object({
  productId: z.number().int().positive().optional(),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().int().nonnegative({ message: "Price must be non-negative" }),
  stock: z.number().int().nonnegative({ message: "Stock cannot be negative" }).default(0),
  color: z.string().optional().nullable(),
  originId: z.number().int().positive().optional().nullable(),
  weightGrams: z.number().positive().optional().nullable(),
  individualAttrs: individualVariantAttrsSchema.optional().nullable(),
  malaAttrs: malaVariantAttrsSchema.optional().nullable(),
  images: z.array(variantImageSchema).optional(),
});
export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>;

export const updateProductVariantSchema = z.object({
  sku: z.string().min(1).optional(),
  price: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  color: z.string().optional().nullable(),
  originId: z.number().int().positive().optional().nullable(),
  weightGrams: z.number().positive().optional().nullable(),
  individualAttrs: individualVariantAttrsSchema.optional().nullable(),
  malaAttrs: malaVariantAttrsSchema.optional().nullable(),
  images: z.array(variantImageSchema).optional(),
});
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>;

// ── Product Schemas ───────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug cannot be empty" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
    .optional(),
  description: z.string().min(1, { message: "Description is required" }),
  type: ProductTypeEnum,
  individualDetail: individualRudrakshaDetailSchema.optional().nullable(),
  malaDetail: rudrakshaMalaDetailSchema.optional().nullable(),
  images: z.array(productImageSchema).optional(),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().min(1).optional(),
  type: ProductTypeEnum.optional(),
  individualDetail: individualRudrakshaDetailSchema.optional().nullable(),
  malaDetail: rudrakshaMalaDetailSchema.optional().nullable(),
  images: z.array(productImageSchema).optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ── Query Schemas ─────────────────────────────────────────────────────────────

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  type: ProductTypeEnum.optional(),
  mukhi: z.coerce.number().int().positive().optional(),
  originId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sortBy: z.enum(["createdAt", "name", "price"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type GetProductsQueryInput = z.infer<typeof getProductsQuerySchema>;
