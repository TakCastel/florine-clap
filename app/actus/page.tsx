import ActuCard from '@/components/ActuCard'
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
    <div className="min-h-screen bg-theme-yellow">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualites' }
        ]}
        variant="default"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold tracking-wide mb-12 text-theme-dark">Actualités</h1>
        
        {/* Mur des 3 dernières actualités - Affiché seulement sur la première page */}
        {currentPage === 1 && (
          <div className="mb-16">
            <h2 className="text-2xl font-display font-bold text-theme-dark mb-8">Dernières actualités</h2>
            
            {/* Layout: 1 carte principale à gauche, 2 petites à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actualité principale - Format hero (2/3 de la largeur) */}
              <div className="lg:col-span-2">
                <a href={`/actus/${items[0].slug}`} className="group block">
                  <div className="relative overflow-hidden bg-theme-dark rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform">
                    <div className="aspect-video bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${items[0].cover})` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-theme-dark/80 via-theme-dark/40 to-transparent"></div>
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-theme-dark/0 via-theme-dark/0 to-theme-dark/0 group-hover:from-theme-dark/90 group-hover:via-theme-dark/60 group-hover:to-theme-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
                      ></div>
                      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
                        <div className="max-w-2xl">
                          <div className="text-theme-yellow text-sm font-display mb-2">
                            {new Date(items[0].date).toLocaleDateString('fr-FR')}
                          </div>
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                            {items[0].title}
                          </h3>
                          <div className="inline-flex items-center text-theme-yellow font-display font-medium group-hover:text-white transition-colors">
                            Lire l'article
                            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Les 2 actualités suivantes - Format compact (1/3 de la largeur) */}
              <div className="lg:col-span-1 space-y-4">
                {items.slice(1, 3).map((actu, index) => (
                  <a key={actu._id} href={`/actus/${actu.slug}`} className="group block">
                    <div className="bg-white/95 hover:bg-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] overflow-hidden transform">
                      <div className="aspect-video bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${actu.cover})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/60 to-transparent"></div>
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-theme-dark/0 via-theme-dark/0 to-theme-dark/0 group-hover:from-theme-dark/80 group-hover:via-theme-dark/40 group-hover:to-theme-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
                        ></div>
                        <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                          <div className="text-theme-yellow text-xs font-display mb-1">
                            {new Date(actu.date).toLocaleDateString('fr-FR')}
                          </div>
                          <h4 className="text-sm md:text-base font-display font-bold text-white mb-2 leading-tight line-clamp-2">
                            {actu.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Toutes les actualités */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-theme-dark mb-8">Toutes les actualités</h2>
          {/* Informations de pagination */}
          <div className="mb-8 text-sm text-theme-dark/70">
            Page {currentPage} sur {totalPages} • {items.length} actualités au total
          </div>
        </div>
        
        {/* Liste en 3 colonnes des actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPage === 1 
            ? paginatedItems.slice(3).map((actu, index) => (
                <ActuCard
                  key={actu._id}
                  href={`/actus/${actu.slug}`}
                  title={actu.title}
                  cover={actu.cover}
                  excerpt={actu.excerpt}
                  date={actu.date}
                />
              ))
            : paginatedItems.map((actu, index) => (
                <ActuCard
                  key={actu._id}
                  href={`/actus/${actu.slug}`}
                  title={actu.title}
                  cover={actu.cover}
                  excerpt={actu.excerpt}
                  date={actu.date}
                />
              ))
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 font-display text-sm sm:text-lg" aria-label="Pagination">
              {/* Page précédente */}
              {currentPage > 1 ? (
                <Link 
                  href={`/actus?page=${currentPage - 1}`}
                  className="text-theme-dark hover:text-theme-dark/70 transition-colors duration-300"
                >
                  ← Précédent
                </Link>
              ) : (
                <span className="text-theme-dark/30 cursor-not-allowed">
                  ← Précédent
                </span>
              )}

              {/* Numéros de pages */}
              <div className="flex items-center gap-4">
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
                        className={`transition-colors duration-300 ${
                          page === currentPage
                            ? 'text-theme-dark font-bold'
                            : 'text-theme-dark/60 hover:text-theme-dark'
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
                      <span key={page} className="text-theme-dark/30">
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
                  className="text-theme-dark hover:text-theme-dark/70 transition-colors duration-300"
                >
                  Suivant →
                </Link>
              ) : (
                <span className="text-theme-dark/30 cursor-not-allowed">
                  Suivant →
                </span>
              )}
            </nav>
          </div>
        )}

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-theme-dark/20">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes dernières actualités</h2>
            <p className="text-theme-dark/70 leading-relaxed">
              Suivez mes dernières actualités, sélections en festival, nouvelles créations et projets en cours. 
              Restez informé de mon actualité cinématographique et de mes prochaines médiations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}