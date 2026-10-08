import { z } from "zod";

export const BlogVariantEnum = z.enum(["STANDARD", "EXTENDED"]);
export type BlogVariant = z.infer<typeof BlogVariantEnum>;

export const SectionTypeEnum = z.enum([
  "INFO_BLOCK",
  "IMAGE_BLOCK",
  "LINK_BLOCK",
  "HTML_BLOCK",
]);
export type SectionType = z.infer<typeof SectionTypeEnum>;

export const sectionInputSchema = z.object({
  type: SectionTypeEnum,
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  html: z.string().optional().nullable(),
  position: z.number().int().default(0),
});
export type SectionInput = z.infer<typeof sectionInputSchema>;

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  shortDescription: z.string().min(1, { message: "Short description is required" }),
  thumbnailImage: z.string().min(1, { message: "Thumbnail image URL is required" }),
  mainDescription: z.string().min(1, { message: "Main description is required" }),
  variant: BlogVariantEnum.default("STANDARD"),
  customTags: z.array(z.string()).default([]),
  sections: z.array(sectionInputSchema).optional().default([]),
});
export type CreateBlogInput = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).optional(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  shortDescription: z.string().optional(),
  thumbnailImage: z.string().optional(),
  mainDescription: z.string().optional(),
  variant: BlogVariantEnum.optional(),
  customTags: z.array(z.string()).optional(),
  sections: z.array(sectionInputSchema).optional(),
});
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

export const getBlogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  isActive: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  isFeatured: z
    .preprocess((val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  variant: BlogVariantEnum.optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type GetBlogsQueryInput = z.infer<typeof getBlogsQuerySchema>;
