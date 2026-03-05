import { Suspense } from 'react'
import ContentListPage from '@/components/ContentListPage'
import ContentListSkeleton from '@/components/ContentListSkeleton'
import { getAllFilms, Film, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

export function generateMetadata() {
  return buildMetadata({
    title: 'Films - Les films',
    description: 'Depuis 2013, je réalise essentiellement des films documentaires explorant des enjeux artistiques et sociaux. Ma démarche s\'est construite dans une approche transversale des arts, au fil de collaborations avec des artistes plasticiens, chorégraphes, auteur·ices, architectes et institutions culturelles, qui nourrissent et façonnent ma pratique du cinéma.',
    canonical: canonical('/films'),
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

async function FilmsContent() {
  const [films, homeSettings] = await Promise.all([getFilms(), getHomeSettings()])
  const heroImageUrl = homeSettings?.category_films_image || null
  const sortedFilms = [...films].sort((a: Film, b: Film) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    const anneeA = a.annee ? parseInt(a.annee, 10) : 0
    const anneeB = b.annee ? parseInt(b.annee, 10) : 0
    return anneeB - anneeA
  })
  return (
    <ContentListPage
      items={sortedFilms}
      basePath="/films"
      title="Films"
      description="Tout commence après le visionnage du film Les Glaneurs et la Glaneuse d'Agnès Varda. J'y découvre un cinéma documentaire qui me parle et m'inspire profondément. Je prends alors ma caméra et, à mon tour, me mets à glaner des images dans ma ville natale, Avignon, puis partout où je suis inspirée et touchée par les gens, leurs aspirations et par leur présence au monde."
      breadcrumbLabel="Films"
      seoTitle="Les films"
      seoDescription="Depuis 2013, je réalise essentiellement des films documentaires explorant des enjeux artistiques et sociaux. Ma démarche s'est construite dans une approche transversale des arts, au fil de collaborations avec des artistes plasticiens, chorégraphes, auteur·ices, architectes et institutions culturelles, qui nourrissent et façonnent ma pratique du cinéma."
      heroImageUrl={heroImageUrl}
    />
  )
}

export default function FilmsPage() {
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
        <Suspense fallback={<ContentListSkeleton title="Films" breadcrumbLabel="Films" />}>
          <FilmsContent />
        </Suspense>
      </main>
    </>
  )
}
