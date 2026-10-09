import CustomerReviewSection from "./CustomerReviewSection";
import FeatureItemSection from "./FeatureItemSection";
import HeroSection from "./HeroSection";
import OurFeatureSection from "./OurFeatureSection";
import SpecialBlessingOffers from "./SpecialBlessingOffers";
import TopSellingSection from "./TopSellingSection";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <FeatureItemSection />
      <TopSellingSection />
      <OurFeatureSection />
      <SpecialBlessingOffers />
      <CustomerReviewSection />
    </div>
  );
}
