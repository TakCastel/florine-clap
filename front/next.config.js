/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Utiliser 'standalone' pour Docker/VPS
  output: 'standalone',
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Utiliser le loader personnalisé pour gérer les URLs Directus dans Docker
  },
  // Configuration webpack pour le hot reload dans Docker (polling nécessaire)
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Polling toutes les secondes (nécessaire dans Docker)
        aggregateTimeout: 300, // Délai avant de recompiler après un changement
        ignored: /node_modules/, // Ignorer node_modules pour de meilleures performances
      }
    }
    return config
  },
}

module.exports = nextConfig


