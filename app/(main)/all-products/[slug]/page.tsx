import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  getPublicProductBySlugData,
  getAllProductSlugs,
} from "@/server/product/public.data";
import { ProductInteractiveView } from "./ProductInteractiveView";

export const revalidate = 60; // ISR revalidation every 60 seconds

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * SSG: Generate static params for all existing product slugs
 */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/**
 * SEO: Dynamic metadata generation matching the product details
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlugData(slug);

  if (!product) {
    return {
      title: "Sacred Product Not Found | Nepali Rudraksh",
      description:
        "The requested sacred Rudraksha bead or mala could not be located in our catalog.",
    };
  }

  const primaryImage =
    product.productImages?.[0]?.url ||
    product.productVariants?.[0]?.variantImages?.[0]?.url ||
    "https://www.shutterstock.com/image-photo/closeup-image-rudraksha-bead-elaeocarpus-260nw-2699062667.jpg";

  const mukhiCount =
    product.type === "INDIVIDUAL_RUDRAKSHA"
      ? product.individualRudrakshaDetail?.mukhi
      : product.rudrakshaMalaDetail?.mukhi;

  const title = `${product.name} | Certified Himalayan Rudraksha | Nepali Rudraksh`;
  const description = `${product.name} - ${
    mukhiCount ? `${mukhiCount} Mukhi authentic Nepali Rudraksha.` : ""
  } 100% natural, lab-certified, and consecrated at Pashupatinath Temple in Kathmandu. ${product.description.slice(
    0,
    140
  )}...`;

  const prices = (product.productVariants || []).map(
    (v) => Number(v.price) || 0
  );
  const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;

  return {
    title,
    description,
    keywords: [
      product.name,
      mukhiCount ? `${mukhiCount} Mukhi Rudraksha` : "Nepali Rudraksha",
      "Pashupatinath Consecrated",
      "Authentic Himalayan Rudraksha",
      "Certified Rudraksha Nepal",
      "Natural Shiva Beads",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Nepali Rudraksh",
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
    other: minPrice
      ? {
          "product:price:amount": String(minPrice),
          "product:price:currency": "NPR",
        }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlugData(slug);

  if (!product) {
    notFound();
  }

  // Generate Schema.org JSON-LD Structured Data for rich SEO results
  const primaryImage =
    product.productImages?.[0]?.url ||
    product.productVariants?.[0]?.variantImages?.[0]?.url;

  const prices = (product.productVariants || []).map(
    (v) => Number(v.price) || 0
  );
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : minPrice;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: primaryImage ? [primaryImage] : [],
    brand: {
      "@type": "Brand",
      name: "Nepali Rudraksh",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NPR",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.productVariants?.length || 1,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Nepali Rudraksh",
      },
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#faf7f2] pb-20 pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70"
          >
            <Link href="/" className="hover:text-[#713f12] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/all-products"
              className="hover:text-[#713f12] transition-colors"
            >
              Sacred Collection
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#422006] truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>

          {/* Interactive Customer-Facing View */}
          <ProductInteractiveView product={product} />
        </div>
      </main>
    </>
  );
}
