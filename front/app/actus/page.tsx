import { Suspense } from 'react'
import { getAllActus, Actu, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import ActusPageClient from './ActusPageClient'
import ActusSkeleton from './ActusSkeleton'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

type ActusPageMetadataProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: ActusPageMetadataProps) {
  const params = await searchParams
  const pageParam = params?.page
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam
  const pageNumber = pageValue ? Number.parseInt(pageValue, 10) : 1
  const isPaginated = Number.isFinite(pageNumber) && pageNumber > 1
  return buildMetadata({
    title: isPaginated ? `Actualités - Page ${pageNumber} | Florine Clap` : 'Actualités - Florine Clap',
    description: 'Découvrez mes dernières actualités, sélections en festival et projets en cours',
    canonical: canonical('/actus'),
    noindex: isPaginated,
  })
}

async function getActus() {
  try {
    return await getAllActus()
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error)
    return []
  }
}

async function ActusContent() {
  const [actus, homeSettings] = await Promise.all([getActus(), getHomeSettings()])
  const sortedActus = [...actus].sort((a: Actu, b: Actu) => {
    return new Date(b.date || '2020').getTime() - new Date(a.date || '2020').getTime()
  })
  const heroImageUrl = homeSettings?.category_actus_image || null
  return <ActusPageClient initialActus={sortedActus} heroImageUrl={heroImageUrl} />
}

export default function ActusPage() {
  const jsonLd = generateJsonLd({
    type: 'WebSite',
    title: 'Actualités - Florine Clap',
    description: 'Découvrez mes dernières actualités, sélections en festival et projets en cours.',
    url: '/actus',
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ActusSkeleton />}>
        <ActusContent />
      </Suspense>
    </>
  )
}
