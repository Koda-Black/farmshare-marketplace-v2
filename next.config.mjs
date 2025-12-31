/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for @radix-ui vendor chunk issues - simplified approach
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Simplified chunk optimization
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          radix: {
            name: 'radix',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            priority: 20,
          },
        },
      }
    }

    return config
  },
}

export default nextConfig
