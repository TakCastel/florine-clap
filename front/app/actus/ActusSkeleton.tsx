import Breadcrumb from '@/components/Breadcrumb'

/**
 * Skeleton calqué sur ActusPageClient :
 * hero 66vh, breadcrumb, PageHeader, grille d’ActuCards (image gauche + contenu droite), champ recherche, pagination, bloc SEO.
 */
export default function ActusSkeleton() {
  return (
    <main id="main-content" className="min-h-screen bg-theme-white relative overflow-hidden">
      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualités' },
          ]}
          variant="default"
        />
      </div>

      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16">
        <div className="pt-12 md:pt-20 mb-8 md:mb-12">
          <div className="mb-4 md:mb-6">
            <div className="h-8 md:h-9 w-40 bg-black/10 rounded animate-pulse mb-6" aria-hidden />
            <div className="h-[2px] w-full max-w-md bg-black/10 rounded animate-pulse mb-6" aria-hidden />
            <div className="space-y-3 mt-6">
              <div className="h-4 max-w-xl bg-black/10 rounded animate-pulse" aria-hidden />
              <div className="h-4 max-w-md bg-black/10 rounded animate-pulse" aria-hidden />
            </div>
          </div>
        </div>

        {/* Grille d’actualités : chaque carte = image (gauche md) + contenu (titre, date, extrait) */}
        <div className="space-y-8 md:space-y-12 mb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-stretch" aria-hidden>
              {/* Image : ActuCard utilise md:w-48 lg:w-56 h-48 md:h-auto */}
              <div className="w-full md:w-48 lg:w-56 h-48 md:min-h-[192px] flex-shrink-0 bg-black/10 rounded animate-pulse" />
              <div className="flex-1 flex flex-col justify-between min-w-0 md:min-h-[192px] space-y-3 pt-1">
                <div className="h-6 w-3/4 max-w-xs bg-black/10 rounded animate-pulse" />
                <div className="h-4 w-28 bg-black/10 rounded animate-pulse" />
                <div className="h-4 w-full max-w-md bg-black/10 rounded animate-pulse" />
                <div className="h-4 w-full max-w-sm bg-black/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Champ de recherche */}
        <div className="mb-8">
          <div className="max-w-md h-12 bg-black/10 rounded animate-pulse" aria-hidden />
        </div>

        {/* Ligne pagination / infos */}
        <div className="mb-8">
          <div className="h-4 w-48 bg-black/10 rounded animate-pulse" aria-hidden />
        </div>

        {/* Pagination (Précédent / numéros / Suivant) */}
        <div className="mt-8 mb-20 flex justify-center gap-6">
          <div className="h-10 w-24 bg-black/10 rounded animate-pulse" aria-hidden />
          <div className="h-10 w-32 bg-black/10 rounded animate-pulse" aria-hidden />
          <div className="h-10 w-20 bg-black/10 rounded animate-pulse" aria-hidden />
        </div>

        {/* Bloc SEO "Mes dernières actualités" */}
        <div className="mt-24 pt-12 pb-24 md:pb-32 border-t border-black/10">
          <div className="h-7 w-64 bg-black/10 rounded animate-pulse mb-6" aria-hidden />
          <div className="space-y-3">
            <div className="h-4 w-full max-w-2xl bg-black/10 rounded animate-pulse" aria-hidden />
            <div className="h-4 w-full max-w-xl bg-black/10 rounded animate-pulse" aria-hidden />
          </div>
        </div>
      </div>
    </main>
  )
}
