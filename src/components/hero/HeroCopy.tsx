"use client";

import { motion } from "framer-motion";
import { LightSwitch } from "./LightSwitch";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function HeroCopy({
  lit,
  busy,
  onToggle,
}: {
  lit: boolean;
  busy: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
      {/* Nudged below the optical centre so it sits lower in frame. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-3xl translate-y-[10vh] flex-col items-center sm:translate-y-[12vh]"
      >
        <motion.p
          variants={item}
          className="hud-label mb-6"
          style={{
            color: "rgba(234,240,247,0.75)",
            textShadow: "0 1px 12px rgba(5,7,11,0.7)",
          }}
        >
          Autonomous solar lighting
        </motion.p>

        {/* One slogan for every state — a mix of thin and bold weights. */}
        <motion.h1
          variants={item}
          className="font-display leading-[0.96] tracking-[-0.03em] text-paper"
          style={{ textShadow: "0 2px 40px rgba(5,7,11,0.55)" }}
        >
          <span className="block text-5xl font-light sm:text-7xl lg:text-[5.75rem]">
            Sunlight,
          </span>
          <span className="block text-5xl font-bold sm:text-7xl lg:text-[5.75rem]">
            after dark.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-sm text-base font-normal leading-relaxed sm:text-lg"
          style={{
            color: "rgba(234,240,247,0.86)",
            textShadow: "0 1px 16px rgba(5,7,11,0.7)",
          }}
        >
          No grid. No wiring. Only the sun, saved for nightfall.
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <LightSwitch on={lit} busy={busy} onToggle={onToggle} />
        </motion.div>
      </motion.div>
    </div>
  );
}
