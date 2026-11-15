import type { NextConfig } from "next";

const isCapacitor = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  output: isCapacitor ? "export" : undefined,
  images: {
    unoptimized: isCapacitor,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Tree-shake icon & geo libraries so only used modules ship to the browser
    optimizePackageImports: ["lucide-react", "@turf/area", "@turf/length", "@turf/centroid", "@turf/helpers"],
  },
  ...(isCapacitor
    ? {}
    : {
        async rewrites() {
          const backendTarget = process.env.BACKEND_URL || "http://localhost:5000";
          return [
            {
              source: "/api/:path*",
              destination: `${backendTarget.replace(/\/+$/, "")}/api/:path*`,
            },
          ];
        },
      }),
};

export default nextConfig;
