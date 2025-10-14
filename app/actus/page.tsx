import ProjectCard from '@/components/ProjectCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type ActusPageProps = {
  searchParams: { page?: string }
}

export default function ActusPage({ searchParams }: ActusPageProps) {
  const items = [...allActus].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Configuration de la pagination
  const itemsPerPage = 12
  const currentPage = parseInt(searchParams.page || '1')
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualites' }
        ]}
        variant="default"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-theme-orange">Actualités</h1>
        
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
            <nav className="flex items-center space-x-8 font-andale-mono text-lg" aria-label="Pagination">
              {/* Page précédente */}
              {currentPage > 1 ? (
                <Link 
                  href={`/actus?page=${currentPage - 1}`}
                  className="px-4 py-2 text-theme-dark hover:text-theme-orange transition-colors duration-300"
                >
                  ← Précédent
                </Link>
              ) : (
                <span className="px-4 py-2 text-theme-dark/30 cursor-not-allowed">
                  ← Précédent
                </span>
              )}

              {/* Numéros de pages */}
              <div className="flex space-x-4">
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
                        className={`px-4 py-2 transition-colors duration-300 ${
                          page === currentPage
                            ? 'text-theme-orange font-bold'
                            : 'text-theme-dark hover:text-theme-orange'
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
                      <span key={page} className="px-4 py-2 text-theme-dark/50">
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
                  className="px-4 py-2 text-theme-dark hover:text-theme-orange transition-colors duration-300"
                >
                  Suivant →
                </Link>
              ) : (
                <span className="px-4 py-2 text-theme-dark/30 cursor-not-allowed">
                  Suivant →
                </span>
              )}
            </nav>
          </div>
        )}

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes dernières actualités</h2>
            <p className="text-gray-600 leading-relaxed">
              Suivez mes dernières actualités, sélections en festival, nouvelles créations et projets en cours. 
              Restez informé de mon actualité cinématographique et de mes prochaines médiations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}