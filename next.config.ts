import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Allow Google profile pictures
  },
  matcher: ['/orders/:path*'],
};

export default nextConfig;
