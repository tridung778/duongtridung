import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi TypeScript trong quá trình build
  },
  eslint:{
    ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint trong quá trình build
  }
};

export default nextConfig;
