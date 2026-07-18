import { Hero } from "@/components/hero/Hero";
import ScatterManifesto from "@/components/sections/ScatterManifesto";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { AfterHero } from "@/components/hero/AfterHero";

export default function Home() {
  return (
    <main className="relative">
      {/* The hero stays pinned while the manifesto panel rises over it. */}
      <div className="sticky top-0 z-0 h-screen">
        <Hero />
      </div>

      <ScatterManifesto text="Light should ask nothing of the city it serves. No trenching, no grid, no waste — only sunlight, gathered through the day and given back the moment the world turns dark." />

      <ProductCarousel />

      <AfterHero />
    </main>
  );
}
