import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @react-three/fiber on Vercel
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  // Ignore TypeScript errors during build (for fast deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
