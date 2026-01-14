import ContentListPage from '@/components/ContentListPage'
import { getAllFilms, Film } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

export async function generateMetadata() {
  const canonicalUrl = canonical('/films')
  return buildMetadata({
    title: 'Films - Mes créations cinématographiques',
    description: 'Découvrez mes courts métrages documentaires qui explorent la relation entre l\'homme et son environnement. Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.',
    canonical: canonicalUrl,
  })
}

async function getFilms() {
  try {
    return await getAllFilms()
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error)
    return []
  }
}

export default async function FilmsPage() {
  const films = await getFilms()
  
  // Trier les films : du plus récent au plus ancien (par date_created)
  const sortedFilms = [...films].sort((a: Film, b: Film) => {
    const dateA = a.date_created ? new Date(a.date_created).getTime() : 0
    const dateB = b.date_created ? new Date(b.date_created).getTime() : 0
    return dateB - dateA // Décroissant : plus récent en premier
  })

  const jsonLd = generateJsonLd({
    type: 'WebSite',
    title: 'Films - Florine Clap',
    description: 'Découvrez mes courts métrages documentaires qui explorent la relation entre l\'homme et son environnement.',
    url: '/films',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <ContentListPage
          items={sortedFilms}
          basePath="/films"
          title="Films"
          description="Découvrez mes créations cinématographiques, documentaires et ateliers créatifs"
          breadcrumbLabel="Films"
          seoTitle="Mes créations cinématographiques"
          seoDescription="Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste."
        />
      </main>
    </>
  )
}
