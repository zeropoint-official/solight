import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/hero images are served from the "solis-assets" Cloudflare R2
    // bucket instead of /public — see src/lib/assets.ts. Add the bucket's
    // custom domain here too if one gets attached later.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-471c128943474ff0a49ebadc867b4477.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
