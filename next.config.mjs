/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/login?mode=register",
        permanent: true,
      },
      {
        source: "/forgot-password",
        destination: "/login?mode=forgot-password",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
