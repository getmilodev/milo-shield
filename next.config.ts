import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Workaround for Next.js 16 prerender bug with global-error
  },
  // Skip static generation for problematic pages
  output: "standalone",
};

export default nextConfig;
