/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      // Add other patterns if needed
    ],
  },
  typescript: {
    // Set to false to ignore type errors
    ignoreBuildErrors: true,
  }

  // Other Next.js config options
};

module.exports = nextConfig;