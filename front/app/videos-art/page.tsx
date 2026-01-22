import ContentListPage from '@/components/ContentListPage'
import { getAllVideoArts, VideoArt, getImageUrl, getHomeSettings } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

export async function generateMetadata() {
  const canonicalUrl = canonical('/videos-art')
  return buildMetadata({
    title: 'Vidéos/art - VIDEO/ART',
    description: 'Enfant d\'Avignon, j\'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd\'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l\'ensemble de mon travail vidéo.',
    canonical: canonicalUrl,
  })
}

async function getVideoArts() {
  try {
    const videoArts = await getAllVideoArts()
    // Pré-construire les URLs d'images côté serveur
    // Note: Directus retourne image comme UUID string, getImageUrl le gère correctement
    return videoArts.map(item => {
      const imageUrl = item.image ? getImageUrl(item.image) : null
      return {
        ...item,
        // Construire l'URL de l'image
        image: imageUrl || undefined,
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos-art:', error)
    return []
  }
}

export default async function VideosArtPage() {
  const videoArts = await getVideoArts()
  const homeSettings = await getHomeSettings()
  
  // Récupérer l'image hero depuis homeSettings (passer l'objet directement, conversion côté client)
  const heroImageUrl = homeSettings?.category_videos_art_image || null
  
  // Trier les vidéos : du plus récent au plus ancien (par annee)
  const sortedVideoArts = [...videoArts].sort((a, b) => {
    // Utiliser annee en priorité (année renseignée dans l'article)
    const getYear = (item: typeof a) => {
      if (item.annee) {
        const year = parseInt(item.annee, 10)
        return isNaN(year) ? 0 : year
      }
      return 0 // Items sans année à la fin
    }
    
    const yearA = getYear(a)
    const yearB = getYear(b)
    
    // Si les deux ont une année valide, trier décroissant
    if (yearA > 0 && yearB > 0) {
      return yearB - yearA // Décroissant : plus récent en premier
    }
    // Si un seul a une année, celui avec année passe en premier
    if (yearA > 0 && yearB === 0) return -1
    if (yearB > 0 && yearA === 0) return 1
    // Si aucun n'a d'année, garder l'ordre original
    return 0
  })

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
      <main id="main-content">
        <ContentListPage
          items={sortedVideoArts}
          basePath="/videos-art"
          title="Vidéos/art"
          description="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo. Cette influence m'amène naturellement à me mettre au service d'artistes, afin de traduire leur démarche en images, au sein de collaborations artistiques partagées, ou dans le cadre de dispositifs de communication sensibles et créatifs."
          breadcrumbLabel="Vidéos/art"
          seoTitle="VIDEO/ART"
          seoDescription="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo."
          heroImageUrl={heroImageUrl}
        />
      </main>
    </>
  )
}
