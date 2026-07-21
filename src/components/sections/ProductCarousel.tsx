"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetUrl } from "@/lib/assets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Product = { src: string; name: string; spec: string };

const PRODUCTS: Product[] = [
  { src: assetUrl("/lights/lightm1.png"), name: "Meridian", spec: "6,400 lm · 72 h autonomy" },
  { src: assetUrl("/lights/lightm2.png"), name: "Halo", spec: "Zero-grid · IP66" },
  { src: assetUrl("/lights/lightm3.png"), name: "Arc", spec: "Adaptive optics · 15-yr cell" },
  { src: assetUrl("/lights/lightm4-cut.png"), name: "Lumen", spec: "Motion-aware · 4000 K" },
  { src: assetUrl("/lights/lightm5-cut.png"), name: "Orbit", spec: "Dusk-to-dawn · Off-grid" },
];

export function ProductCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>(".pc-card");
    // Travel far enough that the LAST card lands dead-centre. We can't use
    // track.scrollWidth — flex containers drop the trailing padding-right from
    // it, so the run would stop one card short (Orbit never reaching centre).
    // Measuring the last card's own position centres it exactly regardless.
    const distance = () => {
      const last = cards[cards.length - 1];
      if (!last) return 0;
      return Math.max(
        0,
        last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2,
      );
    };

    // Each light grows toward full size as it nears the viewport's centre, so
    // whatever sits in the middle is always the largest — a smooth focal drift.
    const focus = () => {
      const mid = window.innerWidth / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardMid = rect.left + rect.width / 2;
        const d = Math.abs(mid - cardMid);
        const norm = Math.min(d / (window.innerWidth * 0.42), 1);
        const eased = 1 - Math.pow(norm, 1.35); // 1 centred → 0 at the edges
        const scaleEl = card.querySelector<HTMLElement>(".pc-scale");
        const vis = card.querySelector<HTMLElement>(".pc-vis");
        const label = card.querySelector<HTMLElement>(".pc-label");
        if (scaleEl) gsap.set(scaleEl, { scale: 0.62 + eased * 0.38 });
        if (vis)
          gsap.set(vis, {
            filter: `drop-shadow(0 ${18 + eased * 34}px ${26 + eased * 40}px rgba(20,22,28,${0.1 + eased * 0.26}))`,
          });
        gsap.set(card, { opacity: 0.45 + eased * 0.55 });
        if (label) gsap.set(label, { opacity: eased, y: (1 - eased) * 12 });
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });
      setActive(nearest);
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: focus,
          onRefresh: focus,
        },
      });
    }, section);

    focus();
    const onResize = () => focus();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col overflow-hidden"
      style={
        {
          // Card width is shared with the track padding so the first and last
          // lights can each rest dead-centre.
          "--card-w": "clamp(340px, 42vw, 640px)",
          background:
            "linear-gradient(180deg, #f6f6f8 0%, #eeeef0 55%, #e7e7ea 100%)",
        } as React.CSSProperties
      }
    >
      {/* Heading */}
      <div className="shrink-0 pt-[5.5vh] pb-1 text-center">
        <span
          className="text-[0.6875rem] font-medium uppercase tracking-[0.28em]"
          style={{ color: "#8a8a8f" }}
        >
          The range
        </span>
        <h2
          className="mt-3 font-display text-3xl font-light tracking-[-0.02em] sm:text-4xl"
          style={{ color: "#111114" }}
        >
          Five lights. One idea.
        </h2>
      </div>

      {/* Horizontal track fills the space between heading and dots */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={trackRef}
          className="absolute inset-0 flex items-center will-change-transform"
          style={{
            paddingLeft: "calc(50vw - var(--card-w) / 2)",
            paddingRight: "calc(50vw - var(--card-w) / 2)",
            gap: "clamp(16px, 2vw, 40px)",
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="pc-card flex-shrink-0"
              style={{ width: "var(--card-w)" }}
            >
              <div className="pc-scale flex flex-col items-center">
                {/* group enables the gentle hover expand, layered on top of the
                    focal scale so hovering lifts a light a touch more. */}
                <div className="group w-full">
                  <div
                    className="pc-vis relative w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    style={{ height: "clamp(360px, 64vh, 660px)" }}
                  >
                    <Image
                      src={p.src}
                      alt={`SOLIS ${p.name} solar street light`}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-contain"
                      priority={p.name === "Meridian"}
                    />
                  </div>
                </div>

                {/* Name + spec: only the centred light reads at full strength. */}
                <div className="pc-label mt-6 text-center">
                  <h3
                    className="font-display text-2xl font-medium tracking-[-0.01em]"
                    style={{ color: "#111114" }}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-sm" style={{ color: "#7c7c82" }}>
                    {p.spec}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex shrink-0 items-center justify-center gap-2.5 pb-[5vh] pt-2">
        {PRODUCTS.map((p, i) => (
          <span
            key={p.name}
            className="h-1.5 rounded-full transition-all duration-[400ms] ease-out"
            style={{
              width: i === active ? 26 : 6,
              background: i === active ? "#111114" : "#c4c4c9",
            }}
          />
        ))}
      </div>
    </section>
  );
}
