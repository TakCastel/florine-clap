// Charger .env du répertoire parent pour build local (sans Docker)
const path = require('path')
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
} catch (_) {}

// L'optimiseur d'images Next.js (/_next/image) fait un fetch serveur vers l'URL donnée :
// on limite remotePatterns au strict nécessaire (hôte Directus) pour éviter tout SSRF
// si une URL externe arbitraire venait à être passée en src d'image.
function directusHostname() {
  const raw = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_INTERNAL_URL || ''
  try {
    return new URL(raw).hostname
  } catch {
    return null
  }
}
const directusHost = directusHostname()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Utiliser 'standalone' pour Docker/VPS
  output: 'standalone',
  // Réduire le JS non utilisé (Lighthouse "Reduce unused JavaScript")
  // Metadata dans <head> pour Lighthouse et crawlers sans JS (Next.js 15 stream sinon dans le body)
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
    qualities: [70, 75, 85, 90],
    remotePatterns: [
      ...(directusHost
        ? [
            { protocol: 'https', hostname: directusHost },
            { protocol: 'http', hostname: directusHost },
          ]
        : []),
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384, 400, 480],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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


