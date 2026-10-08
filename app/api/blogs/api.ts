import { ApiRequestType } from "@/lib/requestAPI";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlogVariant = "STANDARD" | "EXTENDED";

export type SectionType =
  | "INFO_BLOCK"
  | "IMAGE_BLOCK"
  | "LINK_BLOCK"
  | "HTML_BLOCK";

export type SectionPayload = {
  type: SectionType;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  html?: string | null;
  position?: number;
};

export type CreateBlogPayload = {
  title: string;
  slug?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  shortDescription: string;
  thumbnailImage: string;
  mainDescription: string;
  variant?: BlogVariant;
  customTags?: string[];
  sections?: SectionPayload[];
};

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export type GetBlogsParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  variant?: BlogVariant;
  tag?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
};

// ── Route Endpoints Registry ─────────────────────────────────────────────────

export const BLOG_API_ROUTES = {
  LIST_ADMIN: "/blogs",
  CREATE: "/blogs",
  GET_BY_ID: (id: number | string) => `/blogs/${id}`,
  UPDATE_BY_ID: (id: number | string) => `/blogs/${id}`,
  DELETE_BY_ID: (id: number | string) => `/blogs/${id}`,
  LIST_PUBLIC: "/blogs/public",
  GET_BY_SLUG_PUBLIC: (slug: string) => `/blogs/public/${slug}`,
} as const;

// ── Admin API Request Builders ───────────────────────────────────────────────

/** GET /api/blogs — Fetch all blogs for admin with filters and pagination */
const getAllBlogs = (params?: GetBlogsParams): ApiRequestType => ({
  method: "get",
  route: BLOG_API_ROUTES.LIST_ADMIN,
  params,
  showToast: false,
});

/** GET /api/blogs/[id] — Fetch single blog by ID */
const getBlogById = (id: number): ApiRequestType => ({
  method: "get",
  route: BLOG_API_ROUTES.GET_BY_ID(id),
  showToast: false,
});

/** POST /api/blogs — Create a new blog post */
const createBlog = (data: CreateBlogPayload): ApiRequestType => ({
  method: "post",
  route: BLOG_API_ROUTES.CREATE,
  payload: data,
  showToast: true,
  successMessage: "Blog created successfully",
});

/** PATCH /api/blogs/[id] — Update blog post by ID */
const updateBlog = (
  id: number,
  data: UpdateBlogPayload,
): ApiRequestType => ({
  method: "patch",
  route: BLOG_API_ROUTES.UPDATE_BY_ID(id),
  payload: data,
  showToast: true,
  successMessage: "Blog updated successfully",
});

/** DELETE /api/blogs/[id] — Delete blog post by ID */
const deleteBlog = (id: number): ApiRequestType => ({
  method: "delete",
  route: BLOG_API_ROUTES.DELETE_BY_ID(id),
  showToast: true,
  successMessage: "Blog deleted successfully",
});

// ── Public API Request Builders ──────────────────────────────────────────────

/** GET /api/blogs/public — Fetch public active blogs with pagination & filters */
const getPublicBlogs = (params?: GetBlogsParams): ApiRequestType => ({
  method: "get",
  route: BLOG_API_ROUTES.LIST_PUBLIC,
  params,
  showToast: false,
});

/** GET /api/blogs/public/[slug] — Fetch single active blog by slug */
const getPublicBlogBySlug = (slug: string): ApiRequestType => ({
  method: "get",
  route: BLOG_API_ROUTES.GET_BY_SLUG_PUBLIC(slug),
  showToast: false,
});

// ── Exports ──────────────────────────────────────────────────────────────────

export const blogApi = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getPublicBlogs,
  getPublicBlogBySlug,
};
