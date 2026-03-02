import { Suspense } from 'react'
import { getAllActus, Actu, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import ActusPageClient from './ActusPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

type ActusPageMetadataProps = {
  // Next 15 : searchParams est une Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: ActusPageMetadataProps) {
  const params = await searchParams
  const pageParam = params?.page
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam
  const pageNumber = pageValue ? Number.parseInt(pageValue, 10) : 1
  const isPaginated = Number.isFinite(pageNumber) && pageNumber > 1

  const canonicalUrl = canonical('/actus')
  return buildMetadata({
    // Important pour les sitelinks Google: éviter que /actus?page=2+ soit considéré comme page "principale".
    // On canonicalise vers /actus et on noindex les pages paginées.
    title: isPaginated ? `Actualités - Page ${pageNumber} | Florine Clap` : 'Actualités - Florine Clap',
    description: 'Découvrez mes dernières actualités, sélections en festival et projets en cours',
    canonical: canonicalUrl,
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

export default async function ActusPage() {
  const actus = await getActus()
  const homeSettings = await getHomeSettings()
  
  // Trier les actualités : du plus récent au plus ancien (par date)
  const sortedActus = [...actus].sort((a: Actu, b: Actu) => {
    return new Date(b.date || '2020').getTime() - new Date(a.date || '2020').getTime()
  })
  
  // Récupérer l'image hero depuis homeSettings
  const heroImageUrl = homeSettings?.category_actus_image || null

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
      <Suspense fallback={
        <div className="min-h-screen bg-theme-white flex items-center justify-center">
          <p className="text-black/60">Chargement...</p>
        </div>
      }>
        <ActusPageClient initialActus={sortedActus} heroImageUrl={heroImageUrl} />
      </Suspense>
    </>
  )
}
