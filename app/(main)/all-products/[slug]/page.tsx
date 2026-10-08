import { Metadata } from "next";
import { ProductType } from "@/app/types";
import ProductDetailPageError from "./ProductDetailPageError";
import ProductDetailContent from "./ProductDetailContent";
import { ProductDetailPageProps } from "./types";

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/products/public/${slug}`, {
      next: { revalidate: 60, tags: ["products", `product-${slug}`] },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const product: ProductType = await res.json();
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

  let product: ProductType | undefined;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/products/public/${slug}`;

  try {
    const fetchResponse = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["products", `product-${slug}`] },
      headers: {
        Accept: "application/json",
      },
    });

    if (fetchResponse.ok) {
      product = await fetchResponse.json();
    }
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}":`, error);
  }

  if (!product) {
    return <ProductDetailPageError slug={slug} />;
  }

  return <ProductDetailContent product={product} />;
}
