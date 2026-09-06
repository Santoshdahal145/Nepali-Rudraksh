import { GetProductsQueryInput } from "./product.schema";
import { getAllProductsPublic, getSingleProductBySlug } from "./product.service";
import { ProductType } from "@/app/types";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

/**
 * Fetch public products list for SSR/SSG Server Components with Next.js revalidation cache
 */
export async function getPublicProductsData(params: GetProductsQueryInput = {limit}) {
  const baseUrl = getBaseUrl();

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.search) queryParams.set("search", params.search);
  if (params.type) queryParams.set("type", params.type);
  if (params.mukhi) queryParams.set("mukhi", String(params.mukhi));
  if (params.originId) queryParams.set("originId", String(params.originId));
  if (params.minPrice !== undefined) queryParams.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) queryParams.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  const endpoint = `${baseUrl}/api/products/public?${queryParams.toString()}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["products"] },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data as {
        products: ProductType[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      };
    }
  } catch (err) {
    // Graceful fallback for build-time static generation or unreachable loopback
    console.warn("Direct service fallback for public products:", err);
  }

  return await getAllProductsPublic(params);
}

/**
 * Fetch single public product by slug for SSR/SSG Server Components with Next.js revalidation cache
 */
export async function getPublicProductBySlugData(slug: string) {
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/products/public/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60, tags: [`product-${slug}`] },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data as ProductType;
    }
  } catch (err) {
    // Graceful fallback for build-time static generation or unreachable loopback
    console.warn(`Direct service fallback for product slug "${slug}":`, err);
  }

  return await getSingleProductBySlug(slug);
}

/**
 * Fetch all available product slugs for SSG generateStaticParams
 */
export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  try {
    const result = await getAllProductsPublic({ limit: 100 });
    return result.products.map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.error("Failed to load product slugs for static generation:", err);
    return [];
  }
}
