/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer2')

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  experimental: {
    mdxRs: true,
  },
}

module.exports = withContentlayer(nextConfig)


