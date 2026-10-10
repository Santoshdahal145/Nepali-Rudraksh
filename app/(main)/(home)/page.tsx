import CustomerReviewSection from "./CustomerReviewSection";
import FeatureItemSection from "./FeatureItemSection";
import HeroSection from "./HeroSection";
import OurFeatureSection from "./OurFeatureSection";
import TopSellingSection from "./TopSellingSection";
import { ProductType } from "@/app/types";

async function getFeaturedProducts(): Promise<ProductType[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/products/featured?limit=12`, {
      next: { revalidate: 60, tags: ["products"] },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }
  return [];
}

async function getTopSellingProducts(): Promise<ProductType[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/products/top-selling?limit=4`, {
      next: { revalidate: 60, tags: ["products"] },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching top selling products:", error);
  }
  return [];
}

export default async function Home() {
  const [featuredProducts, topSellingProducts] = await Promise.all([
    getFeaturedProducts(),
    getTopSellingProducts(),
  ]);

  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <FeatureItemSection products={featuredProducts} />
      <TopSellingSection products={topSellingProducts} />
      <OurFeatureSection />
      <CustomerReviewSection />
    </div>
  );
}
