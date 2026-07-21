"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  CLIPS,
  CROSSFADE_SEC,
  INTRO,
  NIGHT_OFF,
  NIGHT_ON,
  POSTER,
  TURN_OFF,
  TURN_ON,
} from "./sequence";
import { useAssetPreloader } from "./useAssetPreloader";
import { LoadingScreen } from "./LoadingScreen";
import { SiteHeader } from "./SiteHeader";
import { HeroCopy } from "./HeroCopy";

type Stage =
  | "loading"
  | "intro"
  | "nightOff"
  | "turningOn"
  | "nightOn"
  | "turningOff";

const CROSSFADE_MS = CROSSFADE_SEC * 1000;

export function Hero() {
  const srcs = useMemo(() => CLIPS.map((c) => c.src), []);
  const preload = useAssetPreloader(srcs);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeIndex = useRef(INTRO);
  const handedOff = useRef<Record<number, boolean>>({});

  const [stage, setStage] = useState<Stage>("loading");
  const [opacity, setOpacity] = useState<number[]>([1, 0, 0, 0, 0]);

  // Elegant cursor parallax: the overscaled video stack drifts a few pixels
  // opposite the cursor, eased through a soft spring. Copy and wash stay put.
  const sectionRef = useRef<HTMLElement | null>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 60, damping: 20, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const DRIFT = 18; // max px of travel — deliberately small
  const tx = useTransform(sx, (v) => v * -DRIFT);
  const ty = useTransform(sy, (v) => v * -DRIFT);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const onMove = (e: PointerEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Normalize to -0.5..0.5 around the centre.
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [px, py]);

  // The switch shows intent the instant it's pressed; the video catches up.
  const switchOn = stage === "turningOn" || stage === "nightOn";
  const busy = stage === "intro" || stage === "turningOn" || stage === "turningOff";

  // Crossfade the current clip into `next`: start the next playing underneath,
  // flip opacities (CSS handles the fade), then pause whatever we left behind.
  const crossfadeTo = useCallback((nextIndex: number) => {
    const prevIndex = activeIndex.current;
    if (nextIndex === prevIndex) return;
    const nextVideo = videoRefs.current[nextIndex];
    if (!nextVideo) return;

    handedOff.current[nextIndex] = false;
    nextVideo.currentTime = 0;
    void nextVideo.play().catch(() => {});

    setOpacity((prev) => {
      const draft = [...prev];
      draft[nextIndex] = 1;
      draft[prevIndex] = 0;
      return draft;
    });
    activeIndex.current = nextIndex;

    window.setTimeout(() => {
      const prevVideo = videoRefs.current[prevIndex];
      if (prevVideo) prevVideo.pause();
    }, CROSSFADE_MS + 60);
  }, []);

  // Kick off the intro the moment every asset is fully buffered.
  useEffect(() => {
    if (!preload.done) return;
    const intro = videoRefs.current[INTRO];
    if (!intro) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      intro.currentTime = 0;
      void intro.play().catch(() => {});
      setStage("intro");
    };

    if (intro.readyState >= 3) start();
    else intro.addEventListener("canplaythrough", start, { once: true });
    const fallback = window.setTimeout(start, 1500);
    return () => {
      intro.removeEventListener("canplaythrough", start);
      window.clearTimeout(fallback);
    };
  }, [preload.done]);

  // Auto-handoff for the "once" clips, fired shortly before each one ends.
  const handleTimeUpdate = useCallback(
    (index: number) => {
      const v = videoRefs.current[index];
      if (!v || !v.duration) return;
      if (v.currentTime < v.duration - CROSSFADE_SEC) return;
      if (handedOff.current[index]) return;
      handedOff.current[index] = true;

      if (index === INTRO) {
        crossfadeTo(NIGHT_OFF);
        setStage("nightOff");
      } else if (index === TURN_ON) {
        crossfadeTo(NIGHT_ON);
        setStage("nightOn");
      } else if (index === TURN_OFF) {
        crossfadeTo(NIGHT_OFF);
        setStage("nightOff");
      }
    },
    [crossfadeTo],
  );

  // The switch: toggle the street both ways. Ignored while a clip is mid-play.
  const handleToggle = useCallback(() => {
    if (stage === "nightOff") {
      setStage("turningOn");
      crossfadeTo(TURN_ON);
    } else if (stage === "nightOn") {
      setStage("turningOff");
      crossfadeTo(TURN_OFF);
    }
  }, [stage, crossfadeTo]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Stacked video layers — only opacity ever changes between them. The
          wrapper is slightly overscaled so the cursor drift never bares an
          edge, and it carries the parallax transform for the whole stack. */}
      <motion.div
        className="absolute inset-0"
        style={{ x: tx, y: ty, scale: 1.08, willChange: "transform" }}
      >
        {CLIPS.map((clip, i) => (
          <video
            key={clip.key}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={preload.blobs[clip.src]}
            poster={i === INTRO ? POSTER : undefined}
            muted
            playsInline
            preload="auto"
            loop={clip.kind === "loop"}
            onTimeUpdate={clip.kind === "once" ? () => handleTimeUpdate(i) : undefined}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: opacity[i],
              transition: `opacity ${CROSSFADE_MS}ms linear`,
              willChange: "opacity",
            }}
          />
        ))}
      </motion.div>

      {/* Legibility wash: a soft pool of shade centred on the copy, plus quiet
          darkening at the very top and bottom for the nav and section seam. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(48% 42% at 50% 62%, rgba(5,7,11,0.62) 0%, rgba(5,7,11,0.34) 45%, rgba(5,7,11,0) 78%), linear-gradient(to bottom, rgba(5,7,11,0.5) 0%, rgba(5,7,11,0) 18%), linear-gradient(to top, rgba(5,7,11,0.5) 0%, rgba(5,7,11,0) 26%)",
        }}
      />

      {stage !== "loading" && (
        <>
          <SiteHeader lit={switchOn} />
          <HeroCopy lit={switchOn} busy={busy} onToggle={handleToggle} />
        </>
      )}

      <AnimatePresence>
        {stage === "loading" && (
          <LoadingScreen
            progress={preload.progress}
            loadedBytes={preload.loadedBytes}
            totalBytes={preload.totalBytes}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
