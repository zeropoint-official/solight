"use client";

import { useEffect, useRef, useState } from "react";

interface PreloadState {
  progress: number; // 0..1, byte-accurate across all files
  loadedBytes: number;
  totalBytes: number;
  blobs: Record<string, string>; // original src -> object URL
  done: boolean;
}

/**
 * Streams every video fully into memory before the hero plays, so nothing ever
 * stalls mid-transition. Progress is measured in real bytes: we HEAD each file
 * for its size, then read the GET body chunk-by-chunk.
 */
export function useAssetPreloader(srcs: string[]): PreloadState {
  const [state, setState] = useState<PreloadState>({
    progress: 0,
    loadedBytes: 0,
    totalBytes: 0,
    blobs: {},
    done: false,
  });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    const blobs: Record<string, string> = {};

    (async () => {
      // 1. Learn every file's size up front for a smooth, non-jumpy bar.
      const sizes = await Promise.all(
        srcs.map(async (src) => {
          try {
            const head = await fetch(src, { method: "HEAD", cache: "force-cache" });
            return Number(head.headers.get("Content-Length")) || 0;
          } catch {
            return 0;
          }
        }),
      );
      const totalBytes = sizes.reduce((a, b) => a + b, 0);
      if (!cancelled) setState((s) => ({ ...s, totalBytes }));

      // 2. Stream each body, accumulating loaded bytes as we go.
      let loadedBytes = 0;
      for (const src of srcs) {
        const res = await fetch(src, { cache: "force-cache" });
        if (!res.body) {
          const blob = await res.blob();
          loadedBytes += blob.size;
          blobs[src] = URL.createObjectURL(blob);
          if (!cancelled)
            setState((s) => ({
              ...s,
              loadedBytes,
              progress: totalBytes ? loadedBytes / totalBytes : 0,
              blobs: { ...blobs },
            }));
          continue;
        }

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loadedBytes += value.length;
            if (!cancelled)
              setState((s) => ({
                ...s,
                loadedBytes,
                progress: totalBytes ? loadedBytes / totalBytes : 0,
              }));
          }
        }
        const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
        blobs[src] = URL.createObjectURL(blob);
        if (!cancelled) setState((s) => ({ ...s, blobs: { ...blobs } }));
      }

      if (!cancelled)
        setState((s) => ({ ...s, progress: 1, done: true, blobs: { ...blobs } }));
    })();

    return () => {
      cancelled = true;
      Object.values(blobs).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
