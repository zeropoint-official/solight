"use client";

import { motion } from "framer-motion";

const SPECS = [
  { value: "0", unit: "kWh", label: "Grid energy per year" },
  { value: "15", unit: "yr", label: "Battery service life" },
  { value: "72", unit: "hr", label: "Autonomy without sun" },
  { value: "1", unit: "day", label: "Install time per pole" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function AfterHero() {
  return (
    <section className="relative bg-ink px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease }}
          className="hud-label"
        >
          The system, in numbers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="mt-5 max-w-3xl font-display text-3xl font-light leading-[1.12] tracking-[-0.02em] text-paper sm:text-5xl"
        >
          A streetlight that owes nothing to the grid.
        </motion.h2>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden border-y border-white/10 bg-white/10 lg:grid-cols-4">
          {SPECS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="bg-ink px-6 py-10"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-light text-paper tabular-nums sm:text-6xl">
                  {s.value}
                </span>
                <span className="font-mono text-sm text-amber">{s.unit}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          className="mt-16 max-w-xl text-base leading-relaxed text-muted"
        >
          Each pole is a self-contained power plant: a high-efficiency panel, a
          LiFePO&#8324; cell sized for the darkest week of the year, and adaptive
          optics that dim between passers-by. Set it once, and it lights the
          street for a decade and a half.
        </motion.p>
      </div>
    </section>
  );
}
