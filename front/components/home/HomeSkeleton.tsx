'use client'

/**
 * Skeleton accueil : hero, 4 cartes catégories, zone bio/quote.
 * Style arti — shimmer + formes épurées.
 */
export default function HomeSkeleton() {
  return (
    <div className="relative bg-theme-white min-h-screen overflow-hidden">
      {/* Hero : plein écran, forme organique */}
      <div className="relative w-full h-[85vh] min-h-[500px] skeleton-shimmer" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-black/10 skeleton-breathe" />
        </div>
      </div>

      {/* 4 cartes catégories — grille */}
      <section className="relative max-w-container-large mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-16 md:py-24 -mt-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] md:aspect-[3/4] rounded-sm overflow-hidden skeleton-shimmer border border-black/5"
              aria-hidden
            />
          ))}
        </div>
      </section>

      {/* Zone bio / citation — lignes typo */}
      <section className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-16 md:py-24">
        <div className="space-y-6">
          <div className="h-6 w-48 skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-[1px] w-full max-w-md bg-black/5" />
          <div className="space-y-4 max-w-2xl">
            <div className="h-4 w-full skeleton-shimmer rounded-sm" aria-hidden />
            <div className="h-4 w-full skeleton-shimmer rounded-sm" aria-hidden />
            <div className="h-4 w-full max-w-lg skeleton-shimmer rounded-sm" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  )
}
