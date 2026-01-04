import HomePageClient from '@/components/home/HomePageClient'
import { getHomeSettings, getImageUrl, HomeSettings } from '@/lib/directus'

export const dynamic = 'force-dynamic'
export const revalidate = 60

async function getHomeSettingsWithImageUrls(): Promise<HomeSettings | null> {
  try {
    const settings = await getHomeSettings()
    if (!settings) return null
    
    // Pré-construire les URLs d'images côté serveur, comme pour les autres pages
    // Cela garantit que les URLs sont construites avec process.env.NEXT_PUBLIC_DIRECTUS_URL
    // (côté serveur) au lieu de getDirectusUrlForClient() (côté client)
    const settingsWithUrls: HomeSettings = {
      ...settings,
      // Pré-construire l'URL de l'image bio si elle existe
      bio_image: settings.bio_image ? (getImageUrl(settings.bio_image) || settings.bio_image) : settings.bio_image,
      // Pré-construire l'URL de la vidéo hero si elle existe
      hero_video: settings.hero_video ? (getImageUrl(settings.hero_video) || settings.hero_video) : settings.hero_video,
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