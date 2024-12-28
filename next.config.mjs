/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0, // default is 30
      static: 180,
    },
  },
  env: {
    SECRET_KEY: process.env.SECRET_KEY, // Include your secret key for access in the app
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Proxy requests to the backend API
        destination: "https://backend.qistbazaar.pk/:path*",
      },
    ];
  },
};

export default nextConfig;
