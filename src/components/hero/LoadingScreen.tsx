"use client";

import { motion } from "framer-motion";

function mb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function LoadingScreen({
  progress,
  loadedBytes,
  totalBytes,
}: {
  progress: number;
  loadedBytes: number;
  totalBytes: number;
}) {
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-10 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="solis-pulse absolute inline-flex h-full w-full rounded-full bg-amber" />
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.3em] text-paper">
            SOLIS
          </span>
        </div>

        {/* Progress line */}
        <div className="relative h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-paper"
            animate={{ width: `${pct}%` }}
            transition={{ ease: "easeOut", duration: 0.25 }}
          />
        </div>

        {/* Readout */}
        <div className="mt-4 flex items-center justify-between">
          <span className="hud-label">Preloading environment</span>
          <span className="font-mono text-xs tabular-nums text-paper">
            {String(pct).padStart(3, "0")}%
          </span>
        </div>
        <div className="mt-1.5 font-mono text-[0.6875rem] tabular-nums text-muted">
          {mb(loadedBytes)} / {totalBytes ? mb(totalBytes) : "—"} MB
        </div>
      </div>
    </motion.div>
  );
}
