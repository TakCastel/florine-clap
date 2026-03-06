import Breadcrumb from '@/components/Breadcrumb'

/**
 * Skeleton affiché pendant le chargement d'une page film (navigation client-side).
 * Réduit la perception de lenteur en affichant immédiatement une structure.
 */
export default function FilmLoading() {
  return (
    <div className="min-h-screen bg-theme-white">
      <div className="relative">
        <div className="h-[66vh] min-h-[400px] bg-gray-100 animate-pulse" />
        <div className="relative z-10">
          <div className="max-w-container-large mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-28">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Films', href: '/films' },
                { label: '…' },
              ]}
              variant="default"
            />
          </div>
        </div>
      </div>
      <div className="max-w-container-large mx-auto px-6 md:px-10 lg:px-16 pb-32 relative z-10" style={{ marginTop: '-66vh' }}>
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-8 pt-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-8">
            <div className="w-full aspect-video bg-gray-200 animate-pulse rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-[90%] bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-[75%] bg-gray-100 animate-pulse rounded" />
            </div>
          </article>
          <aside className="lg:col-span-1 space-y-6">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
