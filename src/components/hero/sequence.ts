import { assetUrl } from "@/lib/assets";

// The clips, addressed by index. `loop` clips hold until the next trigger;
// `once` clips play through and hand off to another clip near their end.
export type ClipKind = "once" | "loop";

export interface Clip {
  key: "intro" | "nightOff" | "turnOn" | "nightOn" | "turnOff";
  src: string;
  kind: ClipKind;
}

// Index constants keep the state machine readable.
export const INTRO = 0;
export const NIGHT_OFF = 1;
export const TURN_ON = 2;
export const NIGHT_ON = 3;
export const TURN_OFF = 4;

export const CLIPS: Clip[] = [
  { key: "intro", src: assetUrl("/hero/01-intro.mp4"), kind: "once" }, // day -> night timelapse
  { key: "nightOff", src: assetUrl("/hero/02-night-off.mp4"), kind: "loop" }, // dark street, waiting
  { key: "turnOn", src: assetUrl("/hero/03-lights-on.mp4"), kind: "once" }, // lights ignite
  { key: "nightOn", src: assetUrl("/hero/04-night-on.mp4"), kind: "loop" }, // lit street
  { key: "turnOff", src: assetUrl("/hero/05-lights-off.mp4"), kind: "once" }, // lights fade back out (reversed)
];

export const POSTER = assetUrl("/hero/poster-intro.jpg");

// Seconds of overlap when handing one clip to the next. Both clips play at once
// during this window and we crossfade opacity, so the seam is never visible.
export const CROSSFADE_SEC = 0.6;
