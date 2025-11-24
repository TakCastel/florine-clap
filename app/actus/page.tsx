'use client'

import { useState, useEffect } from 'react'
import ActuCard from '@/components/ActuCard'
import Breadcrumb from '@/components/Breadcrumb'
import ScrollRevealCard from '@/components/ScrollRevealCard'
import { allActus } from '.contentlayer/generated'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type ActusPageProps = {
  searchParams: { page?: string }
}

export default function ActusPage({ searchParams }: ActusPageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const items = [...allActus].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Configuration de la pagination
  const itemsPerPage = 12
  const currentPage = parseInt(searchParams.page || '1')
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  return (
    <div className="min-h-screen bg-theme-cream relative overflow-hidden">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualites' }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* Titre de la page avec animation */}
        <div className="mb-16 md:mb-24">
          <div 
            className="overflow-hidden mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <h1 
              className="heading-display text-theme-actus"
            >
              Actualités
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-theme-dark/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-theme-actus transition-all duration-500 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.1s',
              }}
            ></div>
          </div>

          <p 
            className="body-text text-theme-actus/80 mt-6 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
            }}
          >
            Découvrez mes dernières actualités, sélections en festival et projets en cours
          </p>
        </div>
        
        {/* Dernière actualité - Affiché seulement sur la première page */}
        {currentPage === 1 && (
          <div className="mb-20 md:mb-28">
            <div className="mb-10">
              <h2 
              className="heading-section text-theme-actus mb-2 leading-none"
              >
                Dernière actualité
              </h2>
            </div>
            
            {/* Première actualité - Grande card */}
            <ScrollRevealCard key={items[0]._id} delay={0}>
              <ActuCard
                href={`/actus/${items[0].slug}`}
                title={items[0].title}
                cover={items[0].cover}
                excerpt={items[0].excerpt}
                date={items[0].date}
              />
            </ScrollRevealCard>
          </div>
        )}
        
        {/* Toutes les actualités */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 
              className="heading-section text-theme-actus leading-none"
              >
                Toutes les actualités
              </h2>
            </div>
            {/* Informations de pagination */}
            <div className="text-sm text-theme-dark/60 font-medium">
              Page {currentPage} / {totalPages}
            </div>
          </div>
        </div>
        
        {/* Liste en 2 colonnes des actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {(() => {
            // Pour la première page, on exclut la première card déjà affichée
            const itemsToShow = currentPage === 1 ? paginatedItems.slice(1) : paginatedItems
            // S'assurer qu'on a un nombre pair de cards pour la grille de 2 colonnes
            const evenItems = itemsToShow.length % 2 === 0 
              ? itemsToShow 
              : itemsToShow.slice(0, -1)
            
            return evenItems.map((actu, index) => (
              <ScrollRevealCard key={actu._id} delay={index * 0.05}>
                <ActuCard
                  href={`/actus/${actu.slug}`}
                  title={actu.title}
                  cover={actu.cover}
                  excerpt={actu.excerpt}
                  date={actu.date}
                />
              </ScrollRevealCard>
            ))
          })()}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <nav className="flex items-center gap-6" aria-label="Pagination">
              {/* Page précédente */}
              {currentPage > 1 ? (
                <Link 
                  href={`/actus?page=${currentPage - 1}`}
                  className="group flex items-center gap-2 text-theme-dark/70 hover:text-theme-dark font-medium transition-all duration-300"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                  <span>Précédent</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-theme-dark/30 cursor-not-allowed">
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
                            ? 'text-theme-dark scale-125'
                            : 'text-theme-dark/50 hover:text-theme-dark hover:scale-110'
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
                      <span key={page} className="text-theme-dark/30 px-2">
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
                  className="group flex items-center gap-2 text-theme-dark/70 hover:text-theme-dark font-medium transition-all duration-300"
                >
                  <span>Suivant</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-theme-dark/30 cursor-not-allowed">
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
        <div className="mt-24 pt-12 border-t border-theme-dark/10">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-theme-actus mb-6" style={{
              fontFamily: 'var(--font-andalemo), sans-serif',
              letterSpacing: '-0.02em',
            }}>
              Mes dernières actualités
            </h2>
            <p className="text-theme-dark/70 text-lg leading-relaxed">
              Suivez mes dernières actualités, sélections en festival, nouvelles créations et projets en cours. 
              Restez informé de mon actualité cinématographique et de mes prochaines médiations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}