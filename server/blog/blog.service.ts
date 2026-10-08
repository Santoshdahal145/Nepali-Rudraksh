import { db } from "../../src/prisma/db";
import {
  CreateBlogInput,
  UpdateBlogInput,
  GetBlogsQueryInput,
} from "./blog.schema";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetch a single blog by ID with its sections ordered by position
 */
export async function getBlogById(id: number) {
  return await db.orm.public.Blog.where({ id })
    .include("sections", (s) => s.orderBy((sec) => sec.position.asc()))
    .first();
}

/**
 * Fetch a single active blog by slug for public view
 */
export async function getBlogBySlug(slug: string) {
  return await db.orm.public.Blog.where({ slug, isActive: true })
    .include("sections", (s) => s.orderBy((sec) => sec.position.asc()))
    .first();
}

/**
 * Fetch all blogs for admin with optional filters, search, and pagination
 */
export async function getAllBlogsAdmin(
  params: GetBlogsQueryInput = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  const {
    page = 1,
    limit = 10,
    search,
    isActive,
    isFeatured,
    variant,
    tag,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  let collection = db.orm.public.Blog.include("sections", (s) =>
    s.orderBy((sec) => sec.position.asc()),
  );

  if (isActive !== undefined) {
    collection = collection.where({ isActive });
  }

  if (isFeatured !== undefined) {
    collection = collection.where({ isFeatured });
  }

  if (variant) {
    collection = collection.where({ variant });
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    collection = collection.where((b) => b.title.ilike(term));
  }

  if (sortBy === "title") {
    collection = collection.orderBy((b) =>
      sortOrder === "asc" ? b.title.asc() : b.title.desc(),
    );
  } else if (sortBy === "updatedAt") {
    collection = collection.orderBy((b) =>
      sortOrder === "asc" ? b.updatedAt.asc() : b.updatedAt.desc(),
    );
  } else {
    collection = collection.orderBy((b) =>
      sortOrder === "asc" ? b.createdAt.asc() : b.createdAt.desc(),
    );
  }

  let blogs = await collection.all();

  // Filter by tag in memory if specified
  if (tag && tag.trim()) {
    const targetTag = tag.trim().toLowerCase();
    blogs = blogs.filter((b) =>
      b.customTags?.some((t) => t.toLowerCase() === targetTag),
    );
  }

  const total = blogs.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedBlogs = blogs.slice(offset, offset + limit);

  return {
    blogs: paginatedBlogs,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Fetch active blogs for public view with pagination and filters
 */
export async function getAllBlogsPublic(
  params: GetBlogsQueryInput = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
) {
  // Enforce isActive: true for public view
  return await getAllBlogsAdmin({
    ...params,
    isActive: true,
  });
}

/**
 * Create a new blog post with sections in a transaction
 */
export async function createBlog(input: CreateBlogInput) {
  let slug = input.slug ? slugify(input.slug) : slugify(input.title);

  const existingBlog = await db.orm.public.Blog.where({ slug }).first();
  if (existingBlog) {
    if (input.slug) {
      throw new Error(`Blog with slug "${slug}" already exists`);
    }
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const createdId = await db.transaction(async (tx) => {
    // 1. Create main blog
    const blog = await tx.orm.public.Blog.create({
      title: input.title,
      slug,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      shortDescription: input.shortDescription,
      thumbnailImage: input.thumbnailImage,
      mainDescription: input.mainDescription,
      variant: input.variant ?? "STANDARD",
      customTags: input.customTags ?? [],
    });

    // 2. Create sections if provided
    if (input.sections && input.sections.length > 0) {
      for (let i = 0; i < input.sections.length; i++) {
        const sec = input.sections[i];
        await tx.orm.public.Section.create({
          blogId: blog.id,
          type: sec.type,
          title: sec.title ?? null,
          description: sec.description ?? null,
          image: sec.image ?? null,
          link: sec.link ?? null,
          html: sec.html ?? null,
          position: sec.position ?? i,
        });
      }
    }

    return blog.id;
  });

  return await getBlogById(createdId);
}

/**
 * Update an existing blog post and optionally replace sections
 */
export async function updateBlog(id: number, input: UpdateBlogInput) {
  const existing = await db.orm.public.Blog.where({ id }).first();
  if (!existing) {
    throw new Error("Blog not found");
  }

  let slug = input.slug ? slugify(input.slug) : undefined;
  if (slug && slug !== existing.slug) {
    const slugInUse = await db.orm.public.Blog.where({ slug }).first();
    if (slugInUse && slugInUse.id !== id) {
      throw new Error(`Blog with slug "${slug}" already exists`);
    }
  }

  await db.transaction(async (tx) => {
    const blogUpdates: {
      title?: string;
      slug?: string;
      isActive?: boolean;
      isFeatured?: boolean;
      shortDescription?: string;
      thumbnailImage?: string;
      mainDescription?: string;
      variant?: "STANDARD" | "EXTENDED";
      customTags?: string[];
      updatedAt?: Date;
    } = {};

    if (input.title !== undefined) blogUpdates.title = input.title;
    if (slug !== undefined) blogUpdates.slug = slug;
    if (input.isActive !== undefined) blogUpdates.isActive = input.isActive;
    if (input.isFeatured !== undefined)
      blogUpdates.isFeatured = input.isFeatured;
    if (input.shortDescription !== undefined)
      blogUpdates.shortDescription = input.shortDescription;
    if (input.thumbnailImage !== undefined)
      blogUpdates.thumbnailImage = input.thumbnailImage;
    if (input.mainDescription !== undefined)
      blogUpdates.mainDescription = input.mainDescription;
    if (input.variant !== undefined) blogUpdates.variant = input.variant;
    if (input.customTags !== undefined)
      blogUpdates.customTags = input.customTags;

    blogUpdates.updatedAt = new Date();

    if (Object.keys(blogUpdates).length > 0) {
      await tx.orm.public.Blog.where({ id }).update(blogUpdates);
    }

    // Replace sections if provided
    if (input.sections !== undefined) {
      await tx.orm.public.Section.where({ blogId: id }).delete();

      for (let i = 0; i < input.sections.length; i++) {
        const sec = input.sections[i];
        await tx.orm.public.Section.create({
          blogId: id,
          type: sec.type,
          title: sec.title ?? null,
          description: sec.description ?? null,
          image: sec.image ?? null,
          link: sec.link ?? null,
          html: sec.html ?? null,
          position: sec.position ?? i,
        });
      }
    }
  });

  return await getBlogById(id);
}

/**
 * Delete a blog post and its associated sections
 */
export async function deleteBlog(id: number) {
  const existing = await db.orm.public.Blog.where({ id }).first();
  if (!existing) {
    throw new Error("Blog not found");
  }

  await db.transaction(async (tx) => {
    await tx.orm.public.Section.where({ blogId: id }).delete();
    await tx.orm.public.Blog.where({ id }).delete();
  });

  return { success: true, id, message: "Blog deleted successfully" };
}
