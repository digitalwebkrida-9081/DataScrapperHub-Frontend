import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // 🔴 REQUIRED
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
