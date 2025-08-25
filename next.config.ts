import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  images: {
    domains: ['raw.githubusercontent.com', 'assets.pokemon.com'],
  },
};

export default nextConfig;
