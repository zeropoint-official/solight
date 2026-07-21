"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { assetUrl } from "@/lib/assets";

const NAV = [
  { label: "Overview", href: "#" },
  { label: "The range", href: "#" },
  { label: "The system", href: "#" },
  { label: "Contact", href: "#" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const SOCIAL = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.41-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.17.42-.36 1.04-.41 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.41 2.19.21.55.47.94.88 1.35.41.41.8.67 1.35.88.42.17 1.04.36 2.19.41 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.41.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.17-.42.36-1.04.41-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.41-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.17-1.04-.36-2.19-.41-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.42 5.42 0 1 1 0 10.84 5.42 5.42 0 0 1 0-10.84Zm0 1.62a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5.6-2.9a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.4h3.3V21H3.3V8.4Zm5.42 0h3.16v1.72h.05c.44-.83 1.52-1.72 3.12-1.72 3.34 0 3.96 2.2 3.96 5.06V21h-3.3v-5.78c0-1.38-.02-3.16-1.92-3.16-1.92 0-2.22 1.5-2.22 3.06V21h-3.3V8.4Z",
  },
  {
    label: "X",
    href: "#",
    path: "M17.53 3h2.9l-6.34 7.24L21.5 21h-5.84l-4.58-5.98L5.85 21H2.94l6.78-7.75L2.5 3h6l4.14 5.47L17.53 3Zm-1.02 16.2h1.61L7.56 4.7H5.83l10.68 14.5Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.9a3 3 0 0 0-2.12-2.12C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.53A3 3 0 0 0 .5 6.9C0 8.78 0 12 0 12s0 3.22.5 5.1a3 3 0 0 0 2.12 2.12C4.5 19.75 12 19.75 12 19.75s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12C24 15.22 24 12 24 12s0-3.22-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z",
  },
];

/**
 * Reveal footer: a full-viewport `sticky bottom-0` panel at the end of the
 * page. It pins to the viewport bottom while the (opaque, higher z-index)
 * content scrolls over it, so the last section slides up and uncovers it.
 * The sentinel marks the footer's natural flow position — the reveal happens
 * exactly while it travels from the bottom to the top of the viewport, which
 * drives the parallax on the background and the content.
 */
export function SiteFooter() {
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start end", "start start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-56, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.12, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <footer className="sticky bottom-0 h-[100svh] overflow-hidden bg-ink">
        {/* Night scene, drifting up as it reveals. */}
        <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
          <Image
            src={assetUrl("/hero/poster-intro.jpg")}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Legibility wash — darker at the very bottom for the footer bar. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,7,11,0.55) 0%, rgba(5,7,11,0.32) 34%, rgba(5,7,11,0.72) 78%, rgba(5,7,11,0.92) 100%)",
          }}
        />

        {/* Foreground: CTA up top, footer bar pinned to the bottom. */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative flex h-full flex-col justify-between px-6 pt-[13vh] pb-8 sm:px-10 sm:pb-10"
        >
          {/* — Call to action — */}
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span
              className="hud-label mb-6"
              style={{ color: "rgba(234,240,247,0.72)" }}
            >
              Let&apos;s talk
            </span>
            <h2
              className="font-display leading-[0.98] tracking-[-0.03em] text-paper"
              style={{ textShadow: "0 2px 40px rgba(5,7,11,0.6)" }}
            >
              <span className="block text-4xl font-light sm:text-6xl lg:text-7xl">
                Got a street
              </span>
              <span className="block text-4xl font-bold sm:text-6xl lg:text-7xl">
                to light?
              </span>
            </h2>
            <p
              className="mt-6 max-w-md text-base leading-relaxed sm:text-lg"
              style={{ color: "rgba(234,240,247,0.82)" }}
            >
              Tell us about the road, the plaza, or the park — and we&apos;ll
              light it with nothing but the sun.
            </p>
            <a
              href="#"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a project
              <span className="text-amber-deep transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          {/* — Footer bar — */}
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex items-center justify-between border-t border-white/12 pt-6">
              <span className="text-sm text-muted">© 2026 SOLIS</span>
              <span className="hidden text-sm text-muted sm:inline">
                Autonomous solar lighting
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <nav className="flex flex-wrap gap-x-8 gap-y-3">
                {NAV.map((n) => (
                  <a
                    key={n.label}
                    href={n.href}
                    className="text-sm text-paper/85 transition-colors duration-300 hover:text-paper"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-paper/70 transition-colors duration-300 hover:border-white/40 hover:text-paper sm:h-9 sm:w-9"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/12 pt-5">
              {LEGAL.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-xs text-muted transition-colors duration-300 hover:text-paper/80"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}
