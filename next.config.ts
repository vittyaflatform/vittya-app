import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 1. IZIN AKSES GAMBAR (Whitelist)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "hvxmxcvoozefolmnwned.supabase.co",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], // Optimasi ukuran gambar sesuai gadget user
    imageSizes: [16, 32, 48, 64, 96],
  },

  // ✅ 2. KEAMANAN & PERFORMA
  reactStrictMode: true,
  poweredByHeader: false, // Sembunyikan info server (Keamanan)

  // ✅ 3. OPTIMASI BUILD (Khusus Mac M1)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Hapus console.log di production biar rapi
  },

  // ✅ 4. CUSTOM HEADERS (Enterprise Standard)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
