import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
const isDevelopment = process.env.NODE_ENV === "development";
// On the VPS Nginx proxies this path to backend/feedback; locally `pnpm dev` does the same.
const feedbackServiceUrl = process.env.FEEDBACK_SERVICE_URL ?? "http://127.0.0.1:8081";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  ...(isDevelopment
    ? { rewrites: async () => [{ source: "/api/feedback", destination: `${feedbackServiceUrl}/api/feedback` }] }
    : {}),
  images: {
    unoptimized: isStaticExport,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
