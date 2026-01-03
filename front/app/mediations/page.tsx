import ContentListPage from '@/components/ContentListPage'
import { getAllMediations, Mediation } from '@/lib/directus'

export const dynamic = 'force-dynamic'
export const revalidate = 60

async function getMediations() {
  try {
    return await getAllMediations()
  } catch (error) {
    console.error('Erreur lors de la récupération des médiations:', error)
    return []
  }
}

export default async function MediationsPage() {
  const mediations = await getMediations()
  
  // Trier les médiations : par date (plus récent en premier)
  const sortedMediations = [...mediations].sort((a: Mediation, b: Mediation) => {
    return new Date(b.date || '2020').getTime() - new Date(a.date || '2020').getTime()
  })

  return (
    <ContentListPage
      items={sortedMediations}
      basePath="/mediations"
      title="Médiations"
      description="Depuis une dizaine d'années, en parallèle de mes projets artistiques, je propose des actions de médiation et des ateliers vidéo de réalisation, destinés principalement aux adolescent·es, étudiant·es et jeunes adultes, dans le cadre de dispositifs tels que Collège au cinéma, ou pour des écoles et des conservatoires. Je m'investis également au sein de l'association 1,2,3 Soleil, on fait de l'image, ça se partage !, qui vise à réaliser des films avec des publics empêchés ou fragilisés, tels que des mineur·es isolé·es sans papiers, ou des résident·es en EHPAD, en IME ou en EEAP."
      breadcrumbLabel="Médiations"
      seoTitle="Formation et médiation"
      seoDescription="Depuis une dizaine d'années, en parallèle de mes projets artistiques, je propose des actions de médiation et des ateliers vidéo de réalisation, destinés principalement aux adolescent·es, étudiant·es et jeunes adultes, dans le cadre de dispositifs tels que Collège au cinéma, ou pour des écoles et des conservatoires."
    />
  )
}
