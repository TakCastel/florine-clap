/**
 * Skeleton dédié à la page d'une actualité (pas la liste).
 * Reprend la mise en page par défaut (type "extrait") : container resserré,
 * texte puis image en bas, pour éviter le décalage de mise en page (CLS).
 *
 * Pas de <Breadcrumb> ici volontairement : le composant est sr-only (invisible)
 * et injecte un JSON-LD BreadcrumbList. Comme /actus/loading.tsx et ce skeleton
 * s'imbriquent tous les deux autour de /actus/[slug]/page.tsx, les inclure ferait
 * apparaître plusieurs BreadcrumbList dupliqués dans le HTML brut streamé (mauvais
 * pour les outils/robots qui ne font pas tourner le JS).
 */
export default function ActuSkeleton() {
  return (
    <div className="min-h-screen bg-theme-white">
      <div className="relative">
        <div className="relative w-full h-[66vh] overflow-hidden skeleton-shimmer" aria-hidden />

        {/* Réserve le même espace que le breadcrumb (sr-only) de la vraie page, pour éviter un saut de mise en page */}
        <div className="relative z-10">
          <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-28" aria-hidden />
        </div>
      </div>

      <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pb-32 md:pb-48 relative z-10" style={{ marginTop: '-66vh' }}>
        <div className="max-w-2xl mx-auto">
          <header className="mb-8 pt-6">
            <div className="h-3 w-32 skeleton-shimmer rounded-sm mb-4" aria-hidden />
            <div className="h-7 md:h-8 w-full max-w-md skeleton-shimmer rounded-sm mb-2" aria-hidden />
            <div className="h-7 md:h-8 w-2/3 max-w-xs skeleton-shimmer rounded-sm" aria-hidden />
          </header>

          <div className="space-y-3 mb-8" aria-hidden>
            <div className="h-4 w-full skeleton-shimmer rounded-sm" />
            <div className="h-4 w-full skeleton-shimmer rounded-sm" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded-sm" />
            <div className="h-4 w-full skeleton-shimmer rounded-sm" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded-sm" />
          </div>

          <div className="w-full aspect-[4/3] skeleton-shimmer rounded-sm border border-black/5 mb-12" aria-hidden />
        </div>
      </div>
    </div>
  )
}
