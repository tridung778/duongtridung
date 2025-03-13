import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi TypeScript trong quá trình build
  },
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint trong quá trình build
  },
  images: {
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
  },
  reactStrictMode: true,
  fastRefresh: false,
  webpack: (config) => {
    config.resolve.fallback = {
      child_process: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
