import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.9.230",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.9.230",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.9.230",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
