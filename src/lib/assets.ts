// Heavy media (hero videos, product PNGs) is served from the Cloudflare R2
// bucket "solis-assets" rather than bundled under /public, so it doesn't ride
// along in the git repo or the Vercel/Node deploy bundle. The default below
// is the bucket's public r2.dev URL (not a secret — the bucket is public
// read-only). Override with NEXT_PUBLIC_ASSET_BASE_URL (see .env.example) if
// a custom CDN domain gets attached later.
const DEFAULT_ASSET_BASE_URL = "https://pub-471c128943474ff0a49ebadc867b4477.r2.dev";
const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? DEFAULT_ASSET_BASE_URL;

export function assetUrl(path: string): string {
  return `${ASSET_BASE_URL}${path}`;
}
