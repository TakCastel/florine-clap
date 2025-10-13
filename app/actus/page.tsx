import ProjectCard from '@/components/ProjectCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type ActusPageProps = {
  searchParams: { page?: string }
}

export default function ActusPage({ searchParams }: ActusPageProps) {
  const items = [...allActus].sort((a, b) => (a.date < b.date ? 1 : -1))
  
  // Configuration de la pagination
  const itemsPerPage = 12
  const currentPage = parseInt(searchParams.page || '1')
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualites' }
          ]}
          variant="default"
        />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-theme-orange">Actualites</h1>
        
        {/* Informations de pagination */}
        <div className="mb-8 text-sm text-gray-600">
          Page {currentPage} sur {totalPages} • {items.length} actualités au total
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {paginatedItems.map((actu, index) => (
            <ProjectCard 
              key={actu._id} 
              href={`/actus/${actu.slug}`} 
              title={actu.title} 
              subtitle={new Date(actu.date).toLocaleDateString('fr-FR')} 
              cover={actu.cover} 
              excerpt={actu.excerpt}
              placeholderImage={actu.cover}
              variant="actus" 
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Page précédente */}
              {currentPage > 1 ? (
                <Link 
                  href={`/actus?page=${currentPage - 1}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  Précédent
                </Link>
              ) : (
                <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                  Précédent
                </span>
              )}

              {/* Numéros de pages */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Afficher seulement quelques pages autour de la page courante
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <Link
                        key={page}
                        href={`/actus?page=${page}`}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          page === currentPage
                            ? 'bg-theme-orange text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  } else if (
                    page === currentPage - 3 || 
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              {/* Page suivante */}
              {currentPage < totalPages ? (
                <Link 
                  href={`/actus?page=${currentPage + 1}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  Suivant
                </Link>
              ) : (
                <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                  Suivant
                </span>
              )}
            </nav>
          </div>
        )}

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes dernieres actualites</h2>
            <p className="text-gray-600 leading-relaxed">
              Suivez mes dernieres actualites, selections en festival, nouvelles creations et projets en cours. 
              Restez informe de mon actualite cinematographique et de mes prochains mediations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}