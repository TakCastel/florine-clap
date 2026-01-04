/**
 * Loader personnalisé pour Next.js Image qui gère les images Directus
 * 
 * Note: Next.js exige que le loader accepte le paramètre width, même si on ne l'utilise pas
 * 
 * Pour les images Directus dans Docker, on retourne l'URL directement (sans optimisation)
 * car Next.js ne peut pas accéder à localhost:8055 depuis le conteneur.
 * L'optimisation peut être gérée par Directus ou désactivée pour ces images.
 */

export default function directusImageLoader({ src, width, quality }) {
  // Gérer les cas null/undefined
  if (!src || typeof src !== 'string') {
    console.warn('Image loader received invalid src:', src)
    return src || ''
  }
  
  // Si c'est un chemin statique (commence par /), utiliser l'optimisation Next.js
  if (src.startsWith('/')) {
    // Utiliser l'API d'optimisation Next.js pour les images statiques
    const params = new URLSearchParams()
    params.set('url', src)
    if (width) params.set('w', width.toString())
    if (quality) params.set('q', quality.toString())
    return `/_next/image?${params.toString()}`
  }
  
  // Pour les URLs Directus (détectées par le pattern /assets/), retourner l'URL directement
  // sans passer par l'optimisation Next.js car elle ne peut pas accéder à Directus dans Docker
  // et pour éviter les problèmes de CORS/réseau en production
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Détecter si c'est une URL Directus (contient /assets/)
    const isDirectusUrl = src.includes('/assets/')
    
    if (isDirectusUrl) {
      // Pour les URLs Directus, retourner directement avec les paramètres de transformation
      try {
        const url = new URL(src)
        if (width) {
          url.searchParams.set('width', width.toString())
        }
        if (quality) {
          url.searchParams.set('quality', quality.toString())
        }
        return url.toString()
      } catch (error) {
        console.error('Error parsing Directus URL:', src, error)
        // Si l'URL n'est pas valide, retourner quand même l'URL originale
        return src
      }
    }
    
    // Pour les autres URLs externes (non-Directus), utiliser l'optimisation Next.js
    const params = new URLSearchParams()
    params.set('url', src)
    if (width) params.set('w', width.toString())
    if (quality) params.set('q', quality.toString())
    return `/_next/image?${params.toString()}`
  }
  
  // Si c'est un UUID, construire l'URL Directus
  if (src.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // Utiliser NEXT_PUBLIC_DIRECTUS_URL si défini, sinon utiliser localhost uniquement en développement local
    let directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL
    
    // En développement local uniquement, utiliser localhost si NEXT_PUBLIC_DIRECTUS_URL n'est pas défini
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && (!directusUrl || (!directusUrl.includes('localhost') && !directusUrl.includes('127.0.0.1')))) {
      directusUrl = 'http://localhost:8055'
    }
    
    if (!directusUrl) {
      console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined for Directus image')
      return src
    }
    const normalizedUrl = directusUrl.replace(/\/+$/, '')
    const baseUrl = `${normalizedUrl}/assets/${src}`
    
    // Ajouter les paramètres de transformation Directus si nécessaire
    const url = new URL(baseUrl)
    if (width) {
      url.searchParams.set('width', width.toString())
    }
    if (quality) {
      url.searchParams.set('quality', quality.toString())
    }
    return url.toString()
  }
  
  // Sinon, retourner tel quel
  return src
}

