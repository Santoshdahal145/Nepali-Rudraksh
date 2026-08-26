import { Footer, NavBar, TopMostHeader } from "@/layout";
import { CollectionSection, DevoteeStorySection, FeatureSection, HeroSection, OfferSection, OurStorySection } from "@/components/section";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header >
      <HeroSection />
      <FeatureSection />
      <CollectionSection />
      <OfferSection />
      <OurStorySection />
      <DevoteeStorySection />
      <Footer />
    </>
  );
}
