/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Use memory-based caching in development
      config.cache = {
        type: 'memory'
      };
    }
    return config;
  }
};

module.exports = nextConfig;