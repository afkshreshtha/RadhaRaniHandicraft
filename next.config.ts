/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },                          // ← comma was missing here

};

module.exports = nextConfig;