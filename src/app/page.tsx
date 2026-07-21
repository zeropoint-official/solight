import { Hero } from "@/components/hero/Hero";
import ScatterManifesto from "@/components/sections/ScatterManifesto";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { AfterHero } from "@/components/hero/AfterHero";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <main className="relative">
      {/* Everything above the footer lives in one opaque, higher block: it
          scrolls over the sticky footer pinned underneath it, producing the
          reveal. The opaque background is what keeps the footer hidden until
          the very end. */}
      <div className="relative z-10 bg-ink">
        {/* The hero stays pinned while the manifesto panel rises over it. */}
        <div className="sticky top-0 z-0 h-svh">
          <Hero />
        </div>

        <ScatterManifesto text="Light should ask nothing of the city it serves. No trenching, no grid, no waste — only sunlight, gathered through the day and given back the moment the world turns dark." />

        <ProductCarousel />

        {/* Opaque cap: the last section that slides up to reveal the footer.
            min-h-screen guarantees it fully covers the pinned hero right up to
            the hand-off, so no hero peeks through as the footer appears. */}
        <div className="relative z-10 flex min-h-svh flex-col justify-center bg-ink">
          <AfterHero />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
