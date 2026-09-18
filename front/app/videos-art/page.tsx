import { Suspense } from 'react'
import ContentListPage from '@/components/ContentListPage'
import ContentListSkeleton from '@/components/ContentListSkeleton'
import { getAllVideoArts, VideoArt, getImageUrl, getHomeSettings, getPageBySlug } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

const DEFAULT_SEO_TITLE = 'VIDEO/ART'
const DEFAULT_SEO_DESCRIPTION = 'Enfant d\'Avignon, j\'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd\'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l\'ensemble de mon travail vidéo.'

export async function generateMetadata() {
  const page = await getPageBySlug('videos-art').catch(() => null)
  return buildMetadata({
    title: `Vidéos/art - ${page?.seo_title || DEFAULT_SEO_TITLE}`,
    description: page?.seo_description || DEFAULT_SEO_DESCRIPTION,
    canonical: canonical('/videos-art'),
  })
}

async function getVideoArts() {
  try {
    const videoArts = await getAllVideoArts()
    return videoArts.map(item => {
      const imageUrl = item.image ? getImageUrl(item.image) : null
      return { ...item, image: imageUrl || undefined }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos-art:', error)
    return []
  }
}

async function VideosArtContent() {
  const [videoArts, homeSettings, page] = await Promise.all([getVideoArts(), getHomeSettings(), getPageBySlug('videos-art').catch(() => null)])
  const heroImageUrl = page?.hero_image || homeSettings?.category_videos_art_image || null
  const getYear = (item: VideoArt) => {
    if (item.annee) {
      const year = parseInt(item.annee, 10)
      return isNaN(year) ? 0 : year
    }
    return 0
  }
  const sortedVideoArts = [...videoArts].sort((a, b) => {
    const yearA = getYear(a)
    const yearB = getYear(b)
    if (yearA > 0 && yearB > 0) return yearB - yearA
    if (yearA > 0 && yearB === 0) return -1
    if (yearB > 0 && yearA === 0) return 1
    return 0
  })
  return (
    <ContentListPage
      items={sortedVideoArts}
      basePath="/videos-art"
      title={page?.title || 'Vidéos/art'}
      description="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo. Cette influence m'amène naturellement à me mettre au service d'artistes, afin de traduire leur démarche en images, au sein de collaborations artistiques partagées, ou dans le cadre de dispositifs de communication sensibles et créatifs."
      breadcrumbLabel="Vidéos/art"
      seoTitle="VIDEO/ART"
      seoDescription="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo."
      heroImageUrl={heroImageUrl}
    />
  )
}

export default function VideosArtPage() {
  const jsonLd = generateJsonLd({
    type: 'WebSite',
    title: 'Vidéos/art - Florine Clap',
    description: 'Créations vidéo artistiques de Florine Clap, influencées par la danse, le théâtre et les arts de la rue.',
    url: '/videos-art',
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Suspense fallback={<ContentListSkeleton title="Vidéos/art" breadcrumbLabel="Vidéos/art" />}>
          <VideosArtContent />
        </Suspense>
      </div>
    </>
  )
}
