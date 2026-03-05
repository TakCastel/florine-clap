import { Suspense } from 'react'
import ContentListPage from '@/components/ContentListPage'
import ContentListSkeleton from '@/components/ContentListSkeleton'
import { getAllMediations, Mediation, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

export function generateMetadata() {
  return buildMetadata({
    title: 'Médiations - Médiation et Formation artistique',
    description: 'Depuis une dizaine d\'années, en parallèle de mes projets artistiques, je propose des actions de médiation et des ateliers vidéo de réalisation, destinés principalement aux adolescent·es, étudiant·es et jeunes adultes, dans le cadre de dispositifs tels que Collège au cinéma, ou pour des écoles et des conservatoires.',
    canonical: canonical('/mediations'),
  })
}

async function getMediations() {
  try {
    return await getAllMediations()
  } catch (error) {
    console.error('Erreur lors de la récupération des médiations:', error)
    return []
  }
}

function toTimestamp(m: Mediation): number {
  const candidates = [m.date, m.date_created, m.date_updated].filter(Boolean) as string[]
  for (const value of candidates) {
    const t = new Date(value).getTime()
    if (!Number.isNaN(t)) return t
  }
  return 0
}

async function MediationsContent() {
  const [mediations, homeSettings] = await Promise.all([getMediations(), getHomeSettings()])
  const heroImageUrl = homeSettings?.category_mediations_image || null
  const sortedMediations = [...mediations].sort((a: Mediation, b: Mediation) => {
    const diff = toTimestamp(b) - toTimestamp(a)
    if (diff !== 0) return diff
    const aId = Number(a.id)
    const bId = Number(b.id)
    if (!Number.isNaN(aId) && !Number.isNaN(bId) && aId !== bId) return bId - aId
    return (b.slug || '').localeCompare(a.slug || '')
  })
  return (
    <ContentListPage
      items={sortedMediations}
      basePath="/mediations"
      title="Médiations"
      description="Depuis une dizaine d'années, en parallèle de mes projets artistiques, je propose des actions de médiation et des ateliers vidéo de réalisation, destinés principalement aux adolescent·es, étudiant·es et jeunes adultes, dans le cadre de dispositifs tels que Collège au cinéma, ou pour des écoles et des conservatoires. Je m'investis également au sein de l'association 1,2,3 Soleil, on fait de l'image, ça se partage !, qui vise à réaliser des films avec des publics empêchés ou fragilisés, tels que des mineur·es isolé·es sans papiers, ou des résident·es en EHPAD, en IME ou en EEAP."
      breadcrumbLabel="Médiations"
      seoTitle="Médiation et Formation"
      seoDescription="Depuis une dizaine d'années, en parallèle de mes projets artistiques, je propose des actions de médiation et des ateliers vidéo de réalisation, destinés principalement aux adolescent·es, étudiant·es et jeunes adultes, dans le cadre de dispositifs tels que Collège au cinéma, ou pour des écoles et des conservatoires."
      heroImageUrl={heroImageUrl}
    />
  )
}

export default function MediationsPage() {
  const jsonLd = generateJsonLd({
    type: 'WebSite',
    title: 'Médiations - Florine Clap',
    description: 'Actions de médiation et ateliers vidéo de réalisation proposés par Florine Clap.',
    url: '/mediations',
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <Suspense fallback={<ContentListSkeleton title="Médiations" breadcrumbLabel="Médiations" />}>
          <MediationsContent />
        </Suspense>
      </main>
    </>
  )
}
