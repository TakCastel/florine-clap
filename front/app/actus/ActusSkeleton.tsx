/**
 * Skeleton Actualités — style arti : shimmer, cartes image + texte, recherche, pagination.
 *
 * Pas de <Breadcrumb> ici volontairement : le composant est sr-only (invisible)
 * et injecte un JSON-LD BreadcrumbList. Comme ce skeleton s'affiche en fallback
 * de Suspense au-dessus de la vraie page (qui a déjà son propre Breadcrumb),
 * le garder ferait apparaître deux BreadcrumbList dupliqués dans le HTML brut
 * streamé (mauvais pour les outils/robots qui ne font pas tourner le JS).
 */
export default function ActusSkeleton() {
  return (
    <div className="min-h-screen bg-theme-white relative overflow-hidden">
      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28" aria-hidden />

      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16">
        <div className="pt-12 md:pt-20 mb-8 md:mb-12">
          <div className="h-8 md:h-9 w-40 skeleton-shimmer rounded-sm mb-6" aria-hidden />
          <div className="h-[2px] w-full max-w-md skeleton-shimmer rounded-full mb-6" aria-hidden />
          <div className="space-y-3 mt-6">
            <div className="h-4 max-w-xl skeleton-shimmer rounded-sm" aria-hidden />
            <div className="h-4 max-w-md skeleton-shimmer rounded-sm" aria-hidden />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col" aria-hidden>
              <div className="w-full aspect-[4/3] flex-shrink-0 skeleton-shimmer rounded-sm border border-black/5" />
              <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3 pt-4">
                <div className="h-6 w-3/4 max-w-xs skeleton-shimmer rounded-sm" />
                <div className="h-4 w-28 skeleton-shimmer rounded-sm" />
                <div className="h-4 w-full skeleton-shimmer rounded-sm" />
                <div className="h-4 w-2/3 skeleton-shimmer rounded-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="max-w-md h-12 skeleton-shimmer rounded-sm border border-black/5" aria-hidden />
        </div>

        <div className="mb-8">
          <div className="h-4 w-48 skeleton-shimmer rounded-sm" aria-hidden />
        </div>

        <div className="mt-8 mb-20 flex justify-center gap-6">
          <div className="h-10 w-24 skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-10 w-32 skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-10 w-20 skeleton-shimmer rounded-sm" aria-hidden />
        </div>

        <div className="mt-24 pt-12 pb-24 md:pb-32 border-t border-black/10">
          <div className="h-7 w-64 skeleton-shimmer rounded-sm mb-6" aria-hidden />
          <div className="space-y-3">
            <div className="h-4 w-full max-w-2xl skeleton-shimmer rounded-sm" aria-hidden />
            <div className="h-4 w-full max-w-xl skeleton-shimmer rounded-sm" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
