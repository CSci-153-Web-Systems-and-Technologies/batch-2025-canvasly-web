import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // ✅ ADD THIS ENTIRE 'images' BLOCK
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // For Cloudinary
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oejbpvgrnfcdsqyiuuyn.supabase.co", // Replace with your Supabase hostname
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // You can add more trusted domains here in the future
    ],
  },
};

export default nextConfig;
