import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
};

export default nextConfig;
