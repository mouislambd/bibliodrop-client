/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://bibliodrop-server.onrender.com/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;