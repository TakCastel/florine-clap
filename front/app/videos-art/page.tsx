import ContentListPage from '@/components/ContentListPage'
import { getAllVideoArts, VideoArt, getImageUrl } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

export async function generateMetadata() {
  const canonicalUrl = canonical('/videos-art')
  return buildMetadata({
    title: 'Vidéos/art - Mes créations vidéo artistiques',
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
  
  // Trier par année
  const sortedVideoArts = [...videoArts].sort((a, b) => 
    new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime()
  )

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
          seoTitle="Mes créations vidéo artistiques"
          seoDescription="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo."
        />
      </main>
    </>
  )
}
