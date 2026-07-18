"use client";

import { motion } from "framer-motion";

/**
 * The hero's one control: a light switch that toggles the street both ways.
 * Knob position reflects the current state; the whole thing is the affordance.
 */
export function LightSwitch({
  on,
  busy,
  onToggle,
}: {
  on: boolean;
  busy: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      role="switch"
      aria-checked={on}
      aria-label="Toggle the street lights"
      className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.04] py-2.5 pl-2.5 pr-6 backdrop-blur-md transition-colors duration-500 hover:border-white/35 disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:ring-white/60"
    >
      <span
        className="relative flex h-8 w-14 items-center rounded-full border transition-colors duration-500"
        style={{
          borderColor: on ? "var(--color-amber)" : "rgba(255,255,255,0.2)",
          background: on ? "rgba(255,184,77,0.16)" : "rgba(255,255,255,0.04)",
        }}
      >
        <motion.span
          className="absolute h-6 w-6 rounded-full"
          animate={{
            x: on ? 24 : 4,
            backgroundColor: on ? "#FFB84D" : "#EAF0F7",
            boxShadow: on
              ? "0 0 20px 5px rgba(255,184,77,0.7)"
              : "0 0 0 0 rgba(255,184,77,0)",
          }}
          transition={{ type: "spring", stiffness: 480, damping: 30 }}
        />
      </span>

      <span className="font-display text-[0.95rem] font-medium tracking-wide text-paper tabular-nums">
        {on ? "Lights on" : "Lights off"}
      </span>
    </button>
  );
}
