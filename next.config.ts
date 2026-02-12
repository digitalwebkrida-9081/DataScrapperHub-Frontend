import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized server build supporting dynamic SEO
  // distDir: 'dist',  // Reverted to default .next
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
