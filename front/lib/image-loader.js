/**
 * Loader personnalisé pour Next.js Image qui gère les images Directus
 * Retourne l'URL Directus telle quelle (sans optimisation Next.js)
 * car Directus gère déjà l'optimisation des images
 */

export default function directusImageLoader({ src, width, quality }) {
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // Si c'est un UUID, construire l'URL Directus
  if (src.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8055' : '')
    return `${directusUrl}/assets/${src}`
  }
  
  // Sinon, retourner tel quel
  return src
}

