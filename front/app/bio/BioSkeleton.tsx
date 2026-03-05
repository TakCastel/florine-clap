import Breadcrumb from '@/components/Breadcrumb'

/**
 * Skeleton Bio — breadcrumb, image, lignes de texte, bloc bas.
 */
export default function BioSkeleton() {
  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-theme-dark relative">
      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Bio' },
          ]}
          variant="default"
        />
      </div>
      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16">
        <div className="pt-12 md:pt-20 pb-8">
          <div className="w-full aspect-[4/3] max-h-[60vh] skeleton-shimmer rounded-sm border border-black/5" aria-hidden />
        </div>
        <section className="py-16 md:py-24 space-y-4">
          <div className="h-4 w-full skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-4 w-full skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-4 w-full max-w-3xl skeleton-shimmer rounded-sm" aria-hidden />
          <div className="h-4 w-full max-w-2xl skeleton-shimmer rounded-sm" aria-hidden />
        </section>
      </div>
    </main>
  )
}
