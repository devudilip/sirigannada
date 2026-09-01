import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export: the whole app is pre-rendered HTML + JSON. No server. Deploys anywhere.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
