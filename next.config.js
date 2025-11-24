/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer2')

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    mdxRs: true,
  },
  webpack: (config, { isServer }) => {
    // Exclure ssh2-sftp-client et ssh2 du bundling client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
      config.externals = config.externals || []
      config.externals.push({
        'ssh2-sftp-client': 'commonjs ssh2-sftp-client',
        'ssh2': 'commonjs ssh2',
      })
    }
    return config
  },
}

module.exports = withContentlayer(nextConfig)


