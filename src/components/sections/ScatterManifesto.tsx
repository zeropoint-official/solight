"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ScatterManifestoProps = {
  /** The statement that scatters into place — keep it to ~20–40 words */
  text: string;
  /** Panel background colour */
  background?: string;
  /** Text colour */
  color?: string;
  /**
   * Total section height. Taller = a longer scroll-scrub window for the
   * scatter to resolve across. 300vh is a comfortable default.
   */
  height?: string;
};

export default function ScatterManifesto({
  text,
  background = "#f5f5f7",
  color = "#111111",
  height = "300vh",
}: ScatterManifestoProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // The panel tilts back on entry and straightens as it locks over the section
  // below it — a "card closing into place" feel. Driven by native scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [12, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [0.96, 1],
  );

  // Word-by-word 3D scatter, scrubbed across the pinned panel. Each word flies
  // in from a random Z-depth and scatters across X/Y, resolving to its resting
  // place as you scroll. Stagger is `from: "random"` so words settle shuffled.
  useEffect(() => {
    const el = textRef.current;
    const trigger = sectionRef.current;
    if (!el || !trigger) return;

    let split: SplitType | null = null;
    const ctx = gsap.context(() => {});

    // Slight delay ensures fonts and layout are ready before we measure words.
    const timer = setTimeout(() => {
      ctx.add(() => {
        split = new SplitType(el, { types: "words" });
        if (!split.words || split.words.length === 0) return;

        gsap.set(split.words, { opacity: 0 });
        gsap.fromTo(
          split.words,
          {
            willChange: "opacity, transform",
            opacity: 0,
            z: () => gsap.utils.random(500, 950),
            xPercent: () => gsap.utils.random(-100, 100),
            yPercent: () => gsap.utils.random(-10, 10),
            rotationX: () => gsap.utils.random(-90, 90),
          },
          {
            ease: "expo",
            opacity: 1,
            z: 0,
            xPercent: 0,
            yPercent: 0,
            rotationX: 0,
            stagger: { each: 0.006, from: "random" },
            scrollTrigger: {
              trigger,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      split?.revert();
    };
  }, [text]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height, zIndex: 30 }}
    >
      <motion.div
        className="sticky top-0 flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-6 text-center md:px-12"
        style={{
          rotateX,
          scale,
          transformPerspective: 1400,
          transformOrigin: "50% 0%",
          willChange: "transform",
          background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-sans), sans-serif",
        }}
      >
        <p
          ref={textRef}
          className="w-full font-light leading-tight tracking-[-0.02em] md:w-[63%]"
          style={{
            color,
            fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
            perspective: "1000px",
          }}
        >
          {text}
        </p>
      </motion.div>
    </section>
  );
}
