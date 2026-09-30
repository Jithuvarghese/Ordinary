import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    qualities: [75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
