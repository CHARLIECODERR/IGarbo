import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex flex-col bg-slate-950">
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <Footer />
    </main>
  );
}
