'use client'

import { useState, useEffect, useLayoutEffect, Suspense } from 'react'
import ActuCard from '@/components/ActuCard'
import Breadcrumb from '@/components/Breadcrumb'
import ScrollRevealCard from '@/components/ScrollRevealCard'
import PageHeader from '@/components/PageHeader'
import { getAllActus, Actu, getImageUrl } from '@/lib/directus'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function ActusPageContent() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get('page') || '1'
  const [items, setItems] = useState<Actu[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    async function fetchActus() {
      try {
        const allActus = await getAllActus()
        const sorted = [...allActus].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setItems(sorted)
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchActus()
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
  }, [pageParam])
  
  // Filtrage par recherche
  const filteredItems = items.filter(actu => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      actu.title.toLowerCase().includes(query) ||
      actu.excerpt?.toLowerCase().includes(query) ||
      actu.body?.toLowerCase().includes(query)
    )
  })

  // Configuration de la pagination
  const itemsPerPage = 12
  const currentPage = parseInt(pageParam)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)
  
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-white flex items-center justify-center">
        <p className="text-black/60">Chargement...</p>
      </div>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-theme-white relative overflow-hidden">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualites' }
        ]}
        variant="default"
      />
      
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* En-tête de page avec animation */}
        <PageHeader 
          title="Actualités"
          description="Découvrez mes dernières actualités, sélections en festival et projets en cours"
        />
        
        {/* Champ de recherche */}
        <div className="mb-8">
          <div className="max-w-md">
            <label htmlFor="search-actus" className="sr-only">
              Rechercher dans les actualités
            </label>
            <input
              id="search-actus"
              type="text"
              placeholder="Rechercher dans les actualités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher dans les actualités"
              className="w-full px-4 py-3 border border-black/20 focus:outline-none focus:border-black/40 transition-colors text-black placeholder:text-black/40"
            />
          </div>
        </div>

        {/* Informations de pagination */}
        <div className="mb-8">
          <div className="text-xs text-black/60 font-medium">
            {filteredItems.length > 0 ? (
              <>Page {currentPage} / {totalPages} ({filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''})</>
            ) : (
              <>Aucun résultat</>
            )}
          </div>
        </div>
        
        {/* Grille des actualités - 1 colonne mobile, 2 colonnes desktop */}
        <div className="space-y-8 md:space-y-12 mb-16">
          {paginatedItems.map((actu, index) => (
            <div key={actu.id}>
              <ScrollRevealCard delay={index * 0.05}>
                <ActuCard
                  href={`/actus/${actu.slug}`}
                  title={actu.title}
                  cover={getImageUrl(actu.cover) || undefined}
                  excerpt={actu.excerpt}
                  body={actu.body}
                  date={actu.date}
                />
              </ScrollRevealCard>
              {/* Trait fin entre les articles (sauf le dernier) */}
              {index < paginatedItems.length - 1 && (
                <div className="mt-8 md:mt-12 border-t border-black/5"></div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <nav className="flex items-center gap-6" aria-label="Pagination">
              {/* Page précédente */}
              {currentPage > 1 ? (
                <Link 
                  href={`/actus?page=${currentPage - 1}`}
                  className="group flex items-center gap-2 text-black/70 hover:text-black font-medium transition-all duration-300"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                  <span>Précédent</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-black/30 cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                  <span>Précédent</span>
                </div>
              )}

              {/* Numéros de pages */}
              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Afficher seulement quelques pages autour de la page courante
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Link
                        key={page}
                        href={`/actus?page=${page}`}
                        className={`w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 ${
                          page === currentPage
                            ? 'text-black scale-125'
                            : 'text-black/50 hover:text-black hover:scale-110'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  } else if (
                    page === currentPage - 2 || 
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-black/30 px-2">
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
                  className="group flex items-center gap-2 text-black/70 hover:text-black font-medium transition-all duration-300"
                >
                  <span>Suivant</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-black/30 cursor-not-allowed">
                  <span>Suivant</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </nav>
          </div>
        )}

        {/* Contenu SEO */}
        <div className="mt-24 pt-12 border-t border-black/10">
          <div className="max-w-4xl">
            <h2 className="text-xl md:text-xl font-bold text-black mb-6" style={{
              fontFamily: 'var(--font-andalemo), sans-serif',
              letterSpacing: '-0.02em',
            }}>
              Mes dernières actualités
            </h2>
            <p className="text-black/70 text-base leading-relaxed">
              Suivez mes dernières actualités, sélections en festival, nouvelles créations et projets en cours. 
              Restez informé de mon actualité cinématographique et de mes prochaines médiations.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ActusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-white flex items-center justify-center">
        <p className="text-black/60">Chargement...</p>
      </div>
    }>
      <ActusPageContent />
    </Suspense>
  )
}
