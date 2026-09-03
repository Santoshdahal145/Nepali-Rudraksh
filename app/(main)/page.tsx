import {
  CollectionSection,
  DevoteeStorySection,
  FeatureSection,
  HeroSection,
  OfferSection,
  OurStorySection,
} from "@/components/section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <CollectionSection />
      <OfferSection />
      <OurStorySection />
      <DevoteeStorySection />
    </>
  );
}
