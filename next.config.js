/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVE this line: output: 'export',

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
