import HomePageClient from '@/components/home/HomePageClient'
import { getHomeSettings, getImageUrl, getVideoUrl, HomeSettings } from '@/lib/directus'
import type { Metadata } from 'next'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

/** Preload + preconnect de la vidéo hero pour qu’elle démarre au plus tôt */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getHomeSettings()
    const heroVideoFromDirectus = settings?.hero_video ? getVideoUrl(settings.hero_video) : null
    let heroVideoUrl = heroVideoFromDirectus || settings?.hero_video_url || null
    if (heroVideoUrl && heroVideoUrl.startsWith('http://')) {
      heroVideoUrl = heroVideoUrl.replace(/^http:/, 'https:')
    }
    if (!heroVideoUrl || typeof heroVideoUrl !== 'string') return {}

    const origin = new URL(heroVideoUrl).origin
    const links: Array<{ rel: string; href: string; as?: string }> = [
      { rel: 'preconnect', href: origin },
      { rel: 'preload', as: 'video', href: heroVideoUrl },
    ]
    return { links }
  } catch {
    return {}
  }
}

async function getHomeSettingsWithImageUrls(): Promise<HomeSettings | null> {
  try {
    const settings = await getHomeSettings()
    if (!settings) {
      return null
    }
    
    // Pré-construire les URLs d'images côté serveur, comme pour les autres pages
    // Cela garantit que les URLs sont construites avec process.env.NEXT_PUBLIC_DIRECTUS_URL
    // (côté serveur) au lieu de getDirectusUrlForClient() (côté client)
    const bioImageUrl = settings.bio_image ? getImageUrl(settings.bio_image) : null
    const heroVideoUrl = settings.hero_video ? getImageUrl(settings.hero_video) : null
    const categoryFilmsImageUrl = settings.category_films_image ? getImageUrl(settings.category_films_image) : null
    const categoryMediationsImageUrl = settings.category_mediations_image ? getImageUrl(settings.category_mediations_image) : null
    const categoryVideosArtImageUrl = settings.category_videos_art_image ? getImageUrl(settings.category_videos_art_image) : null
    const categoryActusImageUrl = settings.category_actus_image ? getImageUrl(settings.category_actus_image) : null
    
    const settingsWithUrls: HomeSettings = {
      ...settings,
      // Pré-construire l'URL de l'image bio si elle existe
      // Si getImageUrl retourne null (NEXT_PUBLIC_DIRECTUS_URL non défini), garder l'objet original
      // BioSection appellera getImageUrl côté client qui utilisera getDirectusUrlForClient()
      bio_image: bioImageUrl ? bioImageUrl : settings.bio_image,
      // Pré-construire l'URL de la vidéo hero si elle existe
      hero_video: heroVideoUrl ? heroVideoUrl : settings.hero_video,
      // Pré-construire les URLs des images de catégories
      category_films_image: categoryFilmsImageUrl ? categoryFilmsImageUrl : settings.category_films_image,
      category_mediations_image: categoryMediationsImageUrl ? categoryMediationsImageUrl : settings.category_mediations_image,
      category_videos_art_image: categoryVideosArtImageUrl ? categoryVideosArtImageUrl : settings.category_videos_art_image,
      category_actus_image: categoryActusImageUrl ? categoryActusImageUrl : settings.category_actus_image,
    }
    
    return settingsWithUrls
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return null
  }
}

export default async function HomePage() {
  const homeSettings = await getHomeSettingsWithImageUrls()

  return <HomePageClient homeSettings={homeSettings} />
}