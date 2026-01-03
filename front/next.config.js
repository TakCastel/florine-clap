/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Désactiver l'optimisation pour les images Directus (elles sont déjà optimisées)
    // Utiliser un loader personnalisé qui retourne l'URL telle quelle
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
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


