import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Proxy: forwards /api/* → https://loan-backend-production-558e.up.railway.app/api/*
  // Fixes "Failed to fetch" on PATCH /loans/:id/status
  // The browser never touches port 5000 directly → no CORS issue
  // ─────────────────────────────────────────────────────────────
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://loan-backend-production-558e.up.railway.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;