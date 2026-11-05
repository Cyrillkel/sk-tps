import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: isStaticExport,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
