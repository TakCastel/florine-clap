'use client'

import ContentListPage from '@/components/ContentListPage'
import { allFilms } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
  // Fonction de tri pour les films : par ordre personnalisé, puis par date si pas d'ordre
  const sortFilms = (a: typeof allFilms[0], b: typeof allFilms[0]) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime()
  }

  return (
    <ContentListPage
      items={allFilms}
      basePath="/films"
      title="Films"
      description="Découvrez mes créations cinématographiques, documentaires et ateliers créatifs"
      breadcrumbLabel="Films"
      seoTitle="Mes créations cinématographiques"
      seoDescription="Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste."
      sortFunction={sortFilms}
    />
  )
}
