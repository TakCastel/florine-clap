'use client'

import { useState, useEffect } from 'react'
import ActuCard from '@/components/ActuCard'
import Breadcrumb from '@/components/Breadcrumb'
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
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-theme-yellow relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-40 right-10 w-32 h-32 border border-theme-dark/5 rounded-full"></div>
      <div className="absolute bottom-40 left-16 w-48 h-48 border border-theme-dark/5 rotate-45"></div>

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
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <h1 
              className="text-6xl md:text-7xl lg:text-9xl font-bold leading-none tracking-tighter text-theme-dark"
              style={{
                fontFamily: 'var(--font-andalemo), sans-serif',
                letterSpacing: '-0.05em',
              }}
            >
              Actualités
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-theme-dark/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-theme-dark transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.4s',
              }}
            ></div>
          </div>

          <p 
            className="mt-6 text-lg md:text-xl text-theme-dark/70 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
            }}
          >
            Découvrez mes dernières actualités, sélections en festival et projets en cours
          </p>
        </div>
        
        {/* Mur des 3 dernières actualités - Affiché seulement sur la première page */}
        {currentPage === 1 && (
          <div className="mb-20 md:mb-28">
            <div className="mb-10">
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">À la une</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Dernières actualités
              </h2>
            </div>
            
            {/* Layout: 1 carte principale à gauche, 2 petites à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actualité principale - Format hero (2/3 de la largeur) */}
              <div className="lg:col-span-2">
                <a href={`/actus/${items[0].slug}`} className="group block">
                  <article className="relative overflow-hidden bg-theme-dark rounded-2xl shadow-2xl transition-all duration-700 ease-out group-hover:shadow-3xl">
                    <div className="aspect-video relative overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" 
                        style={{ backgroundImage: `url(${items[0].cover})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-theme-dark/80 via-theme-dark/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/90 via-theme-dark/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-theme-dark/0 group-hover:bg-theme-dark/20 transition-all duration-700"></div>
                      
                      {/* Ligne décorative */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-theme-yellow/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]"></div>
                      
                      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2 text-theme-yellow text-sm mb-4 bg-theme-yellow/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit border border-theme-yellow/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            {new Date(items[0].date).toLocaleDateString('fr-FR')}
                          </div>
                          <h3 
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight"
                            style={{
                              fontFamily: 'var(--font-andalemo), sans-serif',
                              letterSpacing: '-0.03em',
                            }}
                          >
                            {items[0].title}
                          </h3>
                          <div className="inline-flex items-center gap-3 text-theme-yellow font-medium text-base uppercase tracking-wider transition-all duration-500">
                            <span className="transition-all duration-300 group-hover:tracking-widest">Lire</span>
                            <div className="flex items-center gap-2">
                              <div className="h-[2px] bg-theme-yellow w-8 group-hover:w-12 transition-all duration-500"></div>
                              <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-0 -translate-x-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </a>
              </div>

              {/* Les 2 actualités suivantes - Format compact (1/3 de la largeur) */}
              <div className="lg:col-span-1 space-y-6">
                {items.slice(1, 3).map((actu, index) => (
                  <a key={actu._id} href={`/actus/${actu.slug}`} className="group block">
                    <article className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl">
                      <div className="aspect-video relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110" 
                          style={{ backgroundImage: `url(${actu.cover})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/80 via-theme-dark/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-theme-dark/0 group-hover:bg-theme-dark/30 transition-all duration-500"></div>
                        
                        <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                          <div className="text-theme-yellow text-xs mb-2 font-medium">
                            {new Date(actu.date).toLocaleDateString('fr-FR')}
                          </div>
                          <h4 
                            className="text-base md:text-lg font-bold text-white leading-tight line-clamp-2"
                            style={{
                              fontFamily: 'var(--font-andalemo), sans-serif',
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {actu.title}
                          </h4>
                          <div className="mt-2 h-[2px] bg-white/20 overflow-hidden">
                            <div className="h-full bg-theme-yellow w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Toutes les actualités */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">Archives</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
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
        
        {/* Liste en 3 colonnes des actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
            <h2 className="text-2xl md:text-3xl font-bold text-theme-dark mb-6" style={{
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