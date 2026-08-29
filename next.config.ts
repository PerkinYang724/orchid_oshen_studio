import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    const rules = [
      {
        // Locale is decided per-request from cookie + Accept-Language, so any
        // edge / CDN caching must key on Accept-Language to avoid serving the
        // wrong language to a different visitor.
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept-Language, Cookie" }],
      },
    ];

    // Preview and development deployments serve the whole site on a *.vercel.app
    // host that robots.ts happily allows, so without this they are crawlable and
    // compete with production. VERCEL_ENV is unset locally and "production" on
    // the live deployment, so neither gets the header.
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
      rules.push({
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      });
    }

    return rules;
  },
};

export default nextConfig;
