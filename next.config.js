/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Explicit host allowlist (simplest and most compatible)
    domains: ["res.cloudinary.com"],
    // Additionally allow any path under res.cloudinary.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
