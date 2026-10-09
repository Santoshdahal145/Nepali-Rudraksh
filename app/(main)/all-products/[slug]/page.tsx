import { Metadata } from "next";
import { ProductType } from "@/app/types";
import ProductDetailPageError from "./ProductDetailPageError";
import ProductDetailContent from "./ProductDetailContent";
import { ProductDetailPageProps } from "./types";

/** Fetch primary product by slug with resilient fallback */
async function getProduct(
  slug: string,
  baseUrl: string,
): Promise<ProductType | undefined> {
  try {
    const res = await fetch(`${baseUrl}/api/products/public/${slug}`, {
      next: { revalidate: 60, tags: ["products", `product-${slug}`] },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error(`Error fetching product for slug "${slug}":`, error);
  }

  // Database fallback if internal HTTP fetch fails
  try {
    const { getSingleProductBySlug } = await import(
      "@/server/product/product.service"
    );
    const fallback = await getSingleProductBySlug(slug);
    if (fallback) {
      return JSON.parse(JSON.stringify(fallback)) as ProductType;
    }
  } catch (err) {
    console.error(`Fallback error fetching product "${slug}":`, err);
  }

  return undefined;
}

/** Fetch similar products based on the current product's slug */
async function getSimilarProducts(
  slug: string,
  baseUrl: string,
): Promise<ProductType[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/products/public/${slug}/similar?limit=4`,
      {
        next: { revalidate: 60, tags: ["products", `product-similar-${slug}`] },
        headers: { Accept: "application/json" },
      },
    );

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error(`Error fetching similar products for slug "${slug}":`, error);
  }

  // Database fallback if internal HTTP fetch fails
  try {
    const { getSimilarProductsAccordingToCurrentSlug } = await import(
      "@/server/product/product.service"
    );
    const fallback = await getSimilarProductsAccordingToCurrentSlug(slug, 4);
    if (fallback) {
      return JSON.parse(JSON.stringify(fallback)) as ProductType[];
    }
  } catch (err) {
    console.error(
      `Fallback error fetching similar products for "${slug}":`,
      err,
    );
  }

  return [];
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const product = await getProduct(slug, baseUrl);

    if (product) {
      const primaryImage = product.productImages?.[0]?.url;
      const mukhi =
        product.individualRudrakshaDetail?.mukhi ??
        product.rudrakshaMalaDetail?.mukhi;

      const title = mukhi
        ? `${mukhi} Mukhi Nepali Rudraksha Bead | Certified Authentic | Nepali Rudraksh`
        : `${product.name} | Blessed at Pashupatinath | Nepali Rudraksh`;

      const description =
        product.description ||
        `Authentic consecrated Himalayan Rudraksha blessed at Pashupatinath Temple, Nepal. Includes 100% lab certificate.`;

      return {
        title,
        description,
        keywords: [
          product.name,
          mukhi ? `${mukhi} Mukhi Rudraksha` : "Sacred Rudraksha Mala",
          "Nepali Rudraksha",
          "Pashupatinath Consecrated",
          "Certified Authentic Bead",
          "Himalayan Rudraksha Nepal",
        ],
        openGraph: {
          title,
          description,
          type: "website",
          siteName: "Nepali Rudraksh",
          images: primaryImage
            ? [{ url: primaryImage, alt: product.name }]
            : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: primaryImage ? [primaryImage] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for slug:", slug, error);
  }

  return {
    title: "Sacred Himalayan Rudraksha | Nepali Rudraksh",
    description:
      "Explore lab-certified authentic Nepali Rudraksha beads blessed at Pashupatinath Temple.",
  };
}

export default async function SingleProductPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [product, similarProducts] = await Promise.all([
    getProduct(slug, baseUrl),
    getSimilarProducts(slug, baseUrl),
  ]);

  if (!product) {
    return <ProductDetailPageError slug={slug} />;
  }

  return (
    <ProductDetailContent
      product={product}
      similarProducts={similarProducts}
    />
  );
}
