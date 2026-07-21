"use client";

import { motion } from "framer-motion";

export function SiteHeader({ lit }: { lit: boolean }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8"
    >
      <div className="pointer-events-auto flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span
            className="solis-pulse absolute inline-flex h-full w-full rounded-full transition-colors duration-700"
            style={{ background: lit ? "var(--color-amber)" : "var(--color-cyan)" }}
          />
        </span>
        <span className="font-display text-base font-semibold tracking-[0.3em] text-paper">
          SOLIS
        </span>
      </div>

      <a
        href="#"
        className="pointer-events-auto rounded-full border border-white/15 px-4 py-3 text-sm text-paper transition-colors duration-300 hover:border-white/40 sm:py-2"
      >
        Contact
      </a>
    </motion.header>
  );
}
