import ContentListPage from '@/components/ContentListPage'
import { getAllVideoArts, VideoArt, getImageUrl } from '@/lib/directus'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalider toutes les 60 secondes

async function getVideoArts() {
  try {
    const videoArts = await getAllVideoArts()
    // Pré-construire les URLs d'images côté serveur avec le token
    return videoArts.map(item => {
      const imageUrl = item.image ? getImageUrl(item.image) : null
      return {
        ...item,
        // Construire l'URL de l'image avec le token si disponible
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

  return (
    <ContentListPage
      items={sortedVideoArts}
      basePath="/videos-art"
      title="Vidéos/art"
      description="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo. Cette influence m'amène naturellement à me mettre au service d'artistes, afin de traduire leur démarche en images, au sein de collaborations artistiques partagées, ou dans le cadre de dispositifs de communication sensibles et créatifs."
      breadcrumbLabel="Vidéos/art"
      seoTitle="Mes créations vidéo artistiques"
      seoDescription="Enfant d'Avignon, j'ai grandi au contact des arts de la scène. La danse, le théâtre et les arts de la rue ont nourri très tôt une passion qui traverse aujourd'hui mon cinéma, autant dans ses formes que dans ses thématiques, et irrigue l'ensemble de mon travail vidéo."
    />
  )
}
