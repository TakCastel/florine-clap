import Breadcrumb from '@/components/Breadcrumb'

type ContentListSkeletonProps = {
  title: string
  breadcrumbLabel: string
}

/**
 * Skeleton calqué sur ContentListPage + VerticalCarousel :
 * hero 66vh, breadcrumb, PageHeader (titre + ligne + description), carousel (nav gauche + items image 4/3 + texte).
 */
export default function ContentListSkeleton({ title, breadcrumbLabel }: ContentListSkeletonProps) {
  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-black relative">
      {/* Pas d’image hero dans le skeleton : breadcrumb puis contenu */}
      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            { label: breadcrumbLabel },
          ]}
          variant="default"
        />
      </div>

      <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16">
        <section className="pt-12 md:pt-20 pb-8 md:pb-12">
          <div className="mb-4 md:mb-6">
            <div className="h-8 md:h-9 w-48 bg-black/10 rounded animate-pulse mb-6" aria-hidden />
            <div className="h-[2px] w-full max-w-md bg-black/10 rounded animate-pulse mb-6" aria-hidden />
            <div className="space-y-3 mt-6">
              <div className="h-4 w-full max-w-2xl bg-black/10 rounded animate-pulse" aria-hidden />
              <div className="h-4 w-full max-w-xl bg-black/10 rounded animate-pulse" aria-hidden />
              <div className="h-4 w-full max-w-lg bg-black/10 rounded animate-pulse" aria-hidden />
            </div>
          </div>
        </section>

        {/* Carousel vertical : nav fixe à gauche (desktop) + liste d’items (titre à gauche, image 4/3 à droite) */}
        <section className="pt-4 md:pt-8 min-h-[100vh]">
          <div className="w-screen relative left-1/2 -translate-x-1/2 max-w-[100vw] overflow-x-hidden">
            <div className="px-4 md:px-6 lg:px-10 xl:px-16 relative lg:pl-52">
              <div className="flex flex-col gap-1 pb-16 md:pb-24 lg:pb-32">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center py-1 md:py-2 lg:py-3"
                    aria-hidden
                  >
                    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start gap-8">
                      {/* Bloc texte (gauche desktop, comme VerticalCarousel lg:w-2/5) */}
                      <div className="flex-shrink-0 w-full lg:w-2/5 min-h-[8rem] lg:min-h-0 text-left lg:text-right order-2 lg:order-1">
                        <div className="h-3 w-16 bg-black/10 rounded animate-pulse mb-2" />
                        <div className="h-7 md:h-8 w-full max-w-sm bg-black/10 rounded animate-pulse" />
                        <div className="h-4 w-24 mt-2 bg-black/10 rounded animate-pulse" />
                        <div className="h-4 w-20 mt-4 bg-black/10 rounded animate-pulse" />
                      </div>
                      {/* Image 4/3 (droite desktop, comme VerticalCarousel lg:w-3/5) */}
                      <div className="flex-1 lg:ml-auto lg:w-3/5 order-1 lg:order-2">
                        <div className="w-full aspect-[4/3] bg-black/10 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
