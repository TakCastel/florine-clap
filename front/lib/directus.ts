/**
 * Client Directus pour le frontend Next.js
 * Version simplifiée - appels API publics sans authentification
 */

// URL pour les appels API
// Côté serveur : utiliser l'URL interne Docker si disponible
// Côté client : utiliser l'URL publique
function getDirectusUrl(): string {
  if (typeof window === 'undefined') {
    // Côté serveur : utiliser l'URL interne Docker
    return process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://directus:8055'
  }
  // Côté client : utiliser l'URL publique
  return process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
}

// Fonction helper pour faire des appels API publics
async function fetchDirectus<T>(endpoint: string): Promise<T> {
  const directusUrl = getDirectusUrl()
  const url = `${directusUrl}${endpoint}`
  
  try {
    const response = await fetch(url, {
      cache: 'no-store', // Force dynamic pour Next.js
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
  hero_text?: string
  hero_image?: string | { id: string; filename_download: string }
  hero_video_url?: string
  bio_text?: string
  bio_image?: string | { id: string; filename_download: string }
  category_films_image?: string | { id: string; filename_download: string }
  category_mediations_image?: string | { id: string; filename_download: string }
  category_video_art_image?: string | { id: string; filename_download: string }
  category_actus_image?: string | { id: string; filename_download: string }
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
    return await fetchDirectus<VideoArt[]>(
      `/items/videos_art?fields=*,image.id,image.filename_download&sort[]=-annee&sort[]=-date_created`
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des videos_art:', error)
    return []
  }
}

export async function getVideoArtBySlug(slug: string): Promise<VideoArt | null> {
  try {
    const encodedSlug = encodeURIComponent(slug)
    const endpoint = `/items/videos_art?fields=*,image.id,image.filename_download&filter[slug][_eq]=${encodedSlug}&limit=1`
    const directusUrl = getDirectusUrl()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Fetching video art with slug: ${slug} from: ${directusUrl}${endpoint}`)
    }
    
    const videoArts = await fetchDirectus<VideoArt[]>(endpoint)
    
    if (!videoArts || videoArts.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No video art found for slug: ${slug}`)
      }
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
    const settings = await fetchDirectus<HomeSettings[]>(
      `/items/home_settings?fields=*,hero_image.id,hero_image.filename_download,bio_image.id,bio_image.filename_download,category_films_image.id,category_films_image.filename_download,category_mediations_image.id,category_mediations_image.filename_download,category_video_art_image.id,category_video_art_image.filename_download,category_actus_image.id,category_actus_image.filename_download&limit=1`
    )
    return settings[0] || null
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return null
  }
}

/**
 * Helper pour obtenir l'URL d'une image Directus
 */
export function getImageUrl(
  image: string | { id: string; filename_download: string } | undefined
): string | null {
  if (!image) return null
  if (typeof image === 'string') {
    // Si c'est déjà une URL complète, on la retourne
    if (image.startsWith('http')) return image
    // Si c'est un UUID (36 caractères avec tirets), construire l'URL Directus
    if (image.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
      const imageUrl = publicUrl.replace('http://directus:8055', 'http://localhost:8055')
      return `${imageUrl}/assets/${image}`
    }
    // Sinon, on suppose que c'est un chemin relatif
    return image
  }
  // Si c'est un objet Directus file
  const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
  const imageUrl = publicUrl.replace('http://directus:8055', 'http://localhost:8055')
  return `${imageUrl}/assets/${image.id}`
}
