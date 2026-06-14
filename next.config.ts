import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
