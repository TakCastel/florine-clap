/**
 * Loader personnalisé pour Next.js Image qui gère les images Directus
 * Retourne l'URL Directus telle quelle (sans optimisation Next.js)
 * car Directus gère déjà l'optimisation des images
 * 
 * Note: Next.js exige que le loader accepte le paramètre width, même si on ne l'utilise pas
 */

export default function directusImageLoader({ src, width, quality }) {
  // Si c'est déjà une URL complète, la retourner telle quelle
  // Pour les URLs Directus complètes, on peut ajouter le paramètre width si Directus le supporte
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Si c'est une URL Directus assets, on peut ajouter le paramètre width
    // Directus supporte les transformations d'image via query params
    if (src.includes('/assets/') && width) {
      const separator = src.includes('?') ? '&' : '?'
      return `${src}${separator}width=${width}`
    }
    return src
  }
  
  // Si c'est un chemin statique (commence par /), le retourner tel quel
  // Les images du dossier public sont servies directement par Next.js
  if (src.startsWith('/')) {
    return src
  }
  
  // Si c'est un UUID, construire l'URL Directus
  if (src.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // Utiliser NEXT_PUBLIC_DIRECTUS_URL si défini, sinon utiliser localhost uniquement en développement local
    let directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL
    
    // En développement local uniquement, utiliser localhost si NEXT_PUBLIC_DIRECTUS_URL n'est pas défini ou pointe vers une adresse distante
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && (!directusUrl || (!directusUrl.includes('localhost') && !directusUrl.includes('127.0.0.1')))) {
      directusUrl = 'http://localhost:8055'
    }
    
    if (!directusUrl) {
      console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined for Directus image')
      return src
    }
    const normalizedUrl = directusUrl.replace(/\/+$/, '')
    // Ajouter le paramètre width si fourni (Directus supporte les transformations)
    const baseUrl = `${normalizedUrl}/assets/${src}`
    if (width) {
      return `${baseUrl}?width=${width}`
    }
    return baseUrl
  }
  
  // Sinon, retourner tel quel
  return src
}

