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
    return [
      {
        // Locale is decided per-request from cookie + Accept-Language, so any
        // edge / CDN caching must key on Accept-Language to avoid serving the
        // wrong language to a different visitor.
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept-Language, Cookie" }],
      },
    ];
  },
};

export default nextConfig;
