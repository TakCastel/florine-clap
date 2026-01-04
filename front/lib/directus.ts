/**
 * Client Directus pour le frontend Next.js
 * Version simplifiée - appels API publics sans authentification
 */

// URL pour les appels API
// Côté serveur : utiliser l'URL interne Docker si disponible
// Côté client : utiliser l'URL publique
// Helper pour obtenir l'URL Directus en forçant localhost en développement
function getDirectusUrlForClient(): string {
  // Toujours essayer d'utiliser NEXT_PUBLIC_DIRECTUS_URL en premier
  const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL
  
  // Si NEXT_PUBLIC_DIRECTUS_URL est défini et valide, l'utiliser
  if (publicUrl && publicUrl.trim() !== '') {
    // En production, avertir si l'URL pointe vers localhost (mais ne pas bloquer)
    if (process.env.NODE_ENV === 'production' && (publicUrl.includes('localhost') || publicUrl.includes('127.0.0.1'))) {
      console.warn('NEXT_PUBLIC_DIRECTUS_URL points to localhost in production. This may cause issues.')
    }
    return publicUrl
  }
  
  // En développement : utiliser localhost si on est sur localhost
  if (process.env.NODE_ENV === 'development') {
    const isLocalDevelopment = 
      typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    
    if (isLocalDevelopment) {
      return 'http://localhost:8055'
    }
  }
  
  // Dernier recours : erreur seulement si vraiment nécessaire
  console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined. Please set it in your environment variables.')
  // Retourner une URL par défaut plutôt que de lancer une erreur qui casserait l'app
  return 'http://localhost:8055'
}

function getDirectusUrl(): string {
  if (typeof window === 'undefined') {
    // Côté serveur : utiliser l'URL interne Docker
    return process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://directus:8055'
  }
  // Côté client : utiliser l'URL publique
  return getDirectusUrlForClient()
}

// Fonction helper pour faire des appels API publics
async function fetchDirectus<T>(endpoint: string): Promise<T> {
  const directusUrl = getDirectusUrl()
  // Normaliser l'URL : enlever TOUS les slashes finaux de directusUrl
  const normalizedUrl = directusUrl.replace(/\/+$/, '')
  // Normaliser l'endpoint : s'assurer qu'il commence par exactement un slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  // Éviter le double slash : si normalizedUrl se termine par / et normalizedEndpoint commence par /
  // (normalement ça ne devrait pas arriver après la normalisation, mais on double-vérifie)
  const cleanUrl = normalizedUrl.endsWith('/') && normalizedEndpoint.startsWith('/')
    ? `${normalizedUrl}${normalizedEndpoint.slice(1)}`
    : `${normalizedUrl}${normalizedEndpoint}`
  // Ajouter un timestamp pour éviter le cache
  // Utiliser & si l'endpoint contient déjà des paramètres, sinon ?
  const separator = cleanUrl.includes('?') ? '&' : '?'
  const cacheBuster = typeof window !== 'undefined' ? `${separator}_t=${Date.now()}` : ''
  const url = `${cleanUrl}${cacheBuster}`
  
  try {
    const response = await fetch(url, {
      cache: 'no-store', // Force dynamic pour Next.js - ne déclenche pas de preflight CORS
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Directus API error (${response.status}):`, {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Directus API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.data as T
  } catch (error) {
    console.error(`Erreur lors de l'appel à Directus (${url}):`, error)
    throw error
  }
}

// Types pour les collections
export interface Film {
  id: string
  slug: string
  title: string
  image?: string | { id: string; filename_download: string }
  content?: string | { id: string; filename_download: string }
  heading?: string | { id: string; filename_download: string }
  type?: string
  duree?: string
  annee?: string
  langue?: string
  pays_production?: string
  short_synopsis?: string
  realisation?: string
  mixage?: string
  son?: string
  musique?: string
  montage?: string
  avec?: string
  production?: string
  scenario?: string
  assistants_mise_en_scene?: string
  assistante_mise_en_scene?: string
  assistants_images?: string
  steadycamer?: string
  etalonnage?: string
  montage_son?: string
  producteurs?: string
  realisateur_captation?: string
  image_captation?: string
  diffusion?: string[]
  selection?: string[]
  lien_film?: string
  vimeo_id?: string
  video_url?: string
  texte?: string
  remerciements?: string
  order?: number
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Mediation {
  id: string
  slug: string
  title: string
  date: string
  lieu: string
  duree?: string
  modalites?: string
  lien_inscription?: string
  gallery?: string[] | { id: string; filename_download: string }[]
  excerpt?: string
  tags?: string[]
  cover?: string | { id: string; filename_download: string }
  vimeoId?: string
  vimeo_id?: string
  videoUrl?: string
  video_url?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Actu {
  id: string
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt?: string
  tags?: string[]
  cover?: string | { id: string; filename_download: string }
  location?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Page {
  id: string
  slug: string
  title: string
  portrait?: string | { id: string; filename_download: string }
  hero_video?: string
  hero_image?: string | { id: string; filename_download: string }
  cta_text?: string
  cta_link?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface VideoArt {
  id: string
  slug: string
  title: string
  image?: string | { id: string; filename_download: string }
  type?: string
  duree?: string
  annee?: string
  vimeo_id?: string
  video_url?: string
  short_synopsis?: string
  realisation?: string
  mixage?: string
  texte?: string
  production?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface HomeSettings {
  id: string
  hero_video?: string | { id: string; filename_download: string }
  hero_video_url?: string
  bio_text?: string
  bio_image?: string | { id: string; filename_download: string }
  date_created?: string
  date_updated?: string
}

/**
 * Fonctions utilitaires pour récupérer les données
 */
export async function getAllFilms(): Promise<Film[]> {
  try {
    return await fetchDirectus<Film[]>(
      `/items/films?fields=*,image.id,image.filename_download,content.id,content.filename_download,heading.id,heading.filename_download&sort[]=order&sort[]=-date_created`
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error)
    return []
  }
}

export async function getFilmBySlug(slug: string): Promise<Film | null> {
  try {
    const films = await fetchDirectus<Film[]>(
      `/items/films?fields=*,image.id,image.filename_download,content.id,content.filename_download,heading.id,heading.filename_download&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`
    )
    return films[0] || null
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error)
    return null
  }
}

export async function getAllMediations(): Promise<Mediation[]> {
  try {
    return await fetchDirectus<Mediation[]>(
      `/items/mediations?fields=*,cover.id,cover.filename_download,gallery.id,gallery.filename_download&sort[]=-date`
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des médiations:', error)
    return []
  }
}

export async function getMediationBySlug(slug: string): Promise<Mediation | null> {
  try {
    const mediations = await fetchDirectus<Mediation[]>(
      `/items/mediations?fields=*,cover.id,cover.filename_download,gallery.id,gallery.filename_download&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`
    )
    return mediations[0] || null
  } catch (error) {
    console.error('Erreur lors de la récupération de la médiation:', error)
    return null
  }
}

export async function getAllActus(): Promise<Actu[]> {
  try {
    return await fetchDirectus<Actu[]>(
      `/items/actus?fields=*,cover.id,cover.filename_download&sort[]=-date`
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error)
    return []
  }
}

export async function getActuBySlug(slug: string): Promise<Actu | null> {
  try {
    const actus = await fetchDirectus<Actu[]>(
      `/items/actus?fields=*,cover.id,cover.filename_download&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`
    )
    return actus[0] || null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'actualité:', error)
    return null
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    return await fetchDirectus<Page[]>(
      `/items/pages?fields=*,portrait.id,portrait.filename_download,hero_image.id,hero_image.filename_download`
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des pages:', error)
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await fetchDirectus<Page[]>(
      `/items/pages?fields=*,portrait.id,portrait.filename_download,hero_image.id,hero_image.filename_download&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`
    )
    return pages[0] || null
  } catch (error) {
    console.error('Erreur lors de la récupération de la page:', error)
    return null
  }
}

export async function getAllVideoArts(): Promise<VideoArt[]> {
  try {
    // Note: Directus retourne parfois image comme UUID string au lieu d'un objet
    // même avec fields=*,image.id,image.filename_download
    // On récupère donc avec * pour avoir tous les champs, et on gérera l'image dans getImageUrl
    const videoArts = await fetchDirectus<VideoArt[]>(
      `/items/videos_art?fields=*&sort[]=-annee&sort[]=-date_created`
    )
    
    return videoArts
  } catch (error) {
    console.error('Erreur lors de la récupération des videos_art:', error)
    return []
  }
}

export async function getVideoArtBySlug(slug: string): Promise<VideoArt | null> {
  try {
    const encodedSlug = encodeURIComponent(slug)
    // Note: On utilise fields=* car Directus retourne parfois image comme UUID string
    const endpoint = `/items/videos_art?fields=*&filter[slug][_eq]=${encodedSlug}&limit=1`
    
    const videoArts = await fetchDirectus<VideoArt[]>(endpoint)
    
    if (!videoArts || videoArts.length === 0) {
      return null
    }
    
    return videoArts[0]
  } catch (error) {
    console.error(`Erreur lors de la récupération de la vidéo (slug: ${slug}):`, error)
    return null
  }
}

export async function getHomeSettings(): Promise<HomeSettings | null> {
  try {
    const endpoint = `/items/home_settings?fields=*,hero_video.id,hero_video.filename_download,hero_video.type,hero_video.filesize,bio_image.id,bio_image.filename_download&limit=1`
    
    // home_settings est une collection singleton, donc Directus retourne directement l'objet, pas un tableau
    const settings = await fetchDirectus<HomeSettings | HomeSettings[]>(endpoint)
    
    // Gérer le cas singleton : Directus retourne directement l'objet, pas un tableau
    const result = Array.isArray(settings) 
      ? (settings.length > 0 ? settings[0] : null)
      : (settings || null)
    
    return result
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return null
  }
}

/**
 * Helper pour obtenir l'URL d'un fichier Directus (image, vidéo, etc.)
 */
export function getImageUrl(
  file: string | { id: string; filename_download: string } | null | undefined
): string | null {
  if (!file) return null
  
  // Si c'est null, retourner null
  if (file === null) return null
  
  if (typeof file === 'string') {
    // Si c'est déjà une URL complète, on la retourne
    if (file.startsWith('http')) return file
    // Si c'est un UUID (36 caractères avec tirets), construire l'URL Directus
    if (file.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // Toujours utiliser l'URL publique pour les assets, même côté serveur
      // car les URLs seront utilisées côté client dans le HTML
      const publicUrl = typeof window !== 'undefined' 
        ? getDirectusUrlForClient()
        : process.env.NEXT_PUBLIC_DIRECTUS_URL || null
      if (!publicUrl) {
        console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined for file URL')
        return null
      }
      const normalizedUrl = publicUrl.replace(/\/+$/, '')
      return `${normalizedUrl}/assets/${file}`
    }
    // Sinon, on suppose que c'est un chemin relatif
    return file
  }
  
  // Si c'est un objet Directus file
  if (typeof file === 'object' && file !== null) {
    // Vérifier si l'objet a un id
    if (file.id) {
      // Toujours utiliser l'URL publique pour les assets, même côté serveur
      // car les URLs seront utilisées côté client dans le HTML
      const publicUrl = typeof window !== 'undefined' 
        ? getDirectusUrlForClient()
        : process.env.NEXT_PUBLIC_DIRECTUS_URL || null
      if (!publicUrl) {
        console.error('NEXT_PUBLIC_DIRECTUS_URL is not defined for file URL')
        return null
      }
      const normalizedUrl = publicUrl.replace(/\/+$/, '')
      return `${normalizedUrl}/assets/${file.id}`
    }
  }
  
  return null
}

/**
 * Helper spécifique pour obtenir l'URL d'une vidéo Directus
 */
export function getVideoUrl(
  video: string | { id: string; filename_download: string } | undefined
): string | null {
  return getImageUrl(video) // Utilise la même logique que getImageUrl
}
