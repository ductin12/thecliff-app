import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from The Cliff Resort
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thecliffresort.com.vn',
        pathname: '/**',
      },
    ],
  },

  // Output standalone for Docker
  output: 'standalone',
};

export default nextConfig;
