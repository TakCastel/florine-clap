import ContentListPage from '@/components/ContentListPage'
import { getAllFilms, Film, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

export async function generateMetadata() {
  const canonicalUrl = canonical('/films')
  return buildMetadata({
    title: 'Films - Les films',
    description: 'Depuis 2013, je réalise essentiellement des films documentaires explorant des enjeux artistiques et sociaux. Ma démarche s\'est construite dans une approche transversale des arts, au fil de collaborations avec des artistes plasticiens, chorégraphes, auteur·ices, architectes et institutions culturelles, qui nourrissent et façonnent ma pratique du cinéma.',
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
  const homeSettings = await getHomeSettings()
  
  // Récupérer l'image hero depuis homeSettings (passer l'objet directement, conversion côté client)
  const heroImageUrl = homeSettings?.category_films_image || null
  
  // Trier les films : d'abord par order, puis du plus récent au plus ancien (année)
  const sortedFilms = [...films].sort((a: Film, b: Film) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER

    // D'abord trier par order (croissant : order plus petit en premier)
    if (orderA !== orderB) {
      return orderA - orderB
    }

    // Si même order, trier par année (décroissant : plus récent en premier)
    const anneeA = a.annee ? parseInt(a.annee, 10) : 0
    const anneeB = b.annee ? parseInt(b.annee, 10) : 0
    return anneeB - anneeA
  })

  const jsonLd = generateJsonLd({
    type: 'WebSite',
    title: 'Films - Florine Clap',
    description: 'Depuis 2013, je réalise essentiellement des films documentaires explorant des enjeux artistiques et sociaux.',
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
          breadcrumbLabel="Films"
          seoTitle="Les films"
          seoDescription="Depuis 2013, je réalise essentiellement des films documentaires explorant des enjeux artistiques et sociaux. Ma démarche s'est construite dans une approche transversale des arts, au fil de collaborations avec des artistes plasticiens, chorégraphes, auteur·ices, architectes et institutions culturelles, qui nourrissent et façonnent ma pratique du cinéma."
          heroImageUrl={heroImageUrl}
        />
      </main>
    </>
  )
}
