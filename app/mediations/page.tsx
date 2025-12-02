'use client'

import ContentListPage from '@/components/ContentListPage'
import { allMediations } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function MediationsPage() {
  // Fonction de tri pour les médiations : par date (plus récent en premier)
  const sortMediations = (a: typeof allMediations[0], b: typeof allMediations[0]) => {
    return new Date(b.date || '2020').getTime() - new Date(a.date || '2020').getTime()
  }

  return (
    <ContentListPage
      items={allMediations}
      basePath="/mediations"
      title="Médiations"
      description="Découvrez mes ateliers de formation et de médiation autour du cinéma documentaire"
      breadcrumbLabel="Médiations"
      seoTitle="Formation et médiation"
      seoDescription="Découvrez mes médiations de formation et de médiation autour du cinéma documentaire. Des sessions adaptées à tous les niveaux pour apprendre les techniques de réalisation et développer votre regard critique."
      sortFunction={sortMediations}
    />
  )
}
