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
      try {
        let url = new URL(src)
        // En prod / HTTPS : réécrire les URLs localhost pour éviter Mixed Content (ex. image hero Actus)
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
        if (isLocalhost && typeof window !== 'undefined' && window.location.protocol === 'https:') {
          const base = (process.env.NEXT_PUBLIC_DIRECTUS_URL || '').trim().replace(/\/+$/, '')
          if (base && !base.includes('localhost')) {
            url = new URL(url.pathname + url.search, base.startsWith('http') ? base : 'https://' + base)
          }
        }
        if (width) {
          url.searchParams.set('width', width.toString())
        }
        const finalQuality = quality || 85
        url.searchParams.set('quality', finalQuality.toString())
        url.searchParams.set('format', 'webp')
        return url.toString()
      } catch (error) {
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
    let directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || ''
    // En production : ne jamais utiliser localhost (Mixed Content sur HTTPS)
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction && (directusUrl.includes('localhost') || directusUrl.includes('127.0.0.1'))) {
      directusUrl = ''
    }
    // En développement local uniquement, fallback localhost
    if (!directusUrl && process.env.NODE_ENV === 'development') {
      directusUrl = 'http://localhost:8055'
    }
    if (!directusUrl) {
      return src
    }
    const normalizedUrl = directusUrl.replace(/\/+$/, '')
    const baseUrl = `${normalizedUrl}/assets/${src}`
    
    // Ajouter les paramètres de transformation Directus si nécessaire
    const url = new URL(baseUrl)
    if (width) {
      url.searchParams.set('width', width.toString())
    }
    // Qualité par défaut à 85 si non spécifiée
    const finalQuality = quality || 85
    url.searchParams.set('quality', finalQuality.toString())
    // Ajouter le format webp pour une meilleure compression
    url.searchParams.set('format', 'webp')
    return url.toString()
  }
  
  // Sinon, retourner tel quel
  return src
}

