import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Tree-shake icon & geo libraries so only used modules ship to the browser
    optimizePackageImports: ["lucide-react", "@turf/area", "@turf/length", "@turf/centroid", "@turf/helpers"],
  },
  async rewrites() {
    const backendTarget = process.env.BACKEND_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendTarget.replace(/\/+$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
