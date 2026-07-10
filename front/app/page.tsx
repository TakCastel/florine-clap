import { Suspense } from 'react'
import HomePageClient from '@/components/home/HomePageClient'
import HomeSkeleton from '@/components/home/HomeSkeleton'
import { getHomeSettings, getImageUrl, getVideoUrl, HomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/seo'
import type { Metadata } from 'next'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  canonical: canonical('/'),
})

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
    const heroVideoUrl = settings.hero_video ? getVideoUrl(settings.hero_video) : null
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

async function HomeContent() {
  const homeSettings = await getHomeSettingsWithImageUrls()
  const heroVideoUrl = homeSettings?.hero_video
    ? (typeof homeSettings.hero_video === 'string'
      ? homeSettings.hero_video
      : getVideoUrl(homeSettings.hero_video))
    : null
  const websiteJsonLd = generateJsonLd({
    type: 'WebSite',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: canonical('/'),
  })
  const personJsonLd = generateJsonLd({
    type: 'Person',
    description: SITE_DESCRIPTION,
    url: canonical('/bio'),
    image: homeSettings?.bio_image
      ? (typeof homeSettings.bio_image === 'string'
        ? homeSettings.bio_image
        : undefined)
      : undefined,
  })
  return (
    <>
      {heroVideoUrl && (
        <link rel="preload" href={heroVideoUrl} as="video" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* H1 caché pour le SEO : le contenu visuel utilise des h3 pour des raisons de design */}
      <h1 className="sr-only">{SITE_TITLE}</h1>
      <HomePageClient homeSettings={homeSettings} />
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}