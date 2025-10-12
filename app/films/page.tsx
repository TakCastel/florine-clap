'use client'

import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
  const [displayedFilms, setDisplayedFilms] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const filmsPerLoad = 3

  // Charger les premiers films au montage
  useEffect(() => {
    if (allFilms.length > 0) {
      const initialFilms = allFilms.slice(0, filmsPerLoad)
      setDisplayedFilms(initialFilms)
      setCurrentIndex(filmsPerLoad)
      setHasMore(filmsPerLoad < allFilms.length)
    }
  }, [])

  // Fonction pour charger plus de films
  const loadMoreFilms = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simuler un délai de chargement
    setTimeout(() => {
      const nextFilms = allFilms.slice(currentIndex, currentIndex + filmsPerLoad)
      setDisplayedFilms(prev => [...prev, ...nextFilms])
      setCurrentIndex(prev => prev + filmsPerLoad)
      setHasMore(currentIndex + filmsPerLoad < allFilms.length)
      setIsLoading(false)
    }, 1000)
  }, [currentIndex, isLoading, hasMore])

  // Observer pour détecter quand on arrive en bas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreFilms()
        }
      },
      { threshold: 0.1 }
    )

    const trigger = document.getElementById('load-more-trigger')
    if (trigger) {
      observer.observe(trigger)
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger)
      }
    }
  }, [loadMoreFilms, hasMore, isLoading])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Films' }
          ]}
          variant="blue"
        />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-theme-blue">Films</h1>
        
        {/* Layout alterné avec images et textes */}
        <div className="space-y-32">
          {displayedFilms.length > 0 ? (
            displayedFilms.map((film, index) => {
              const isEven = index % 2 === 0
              
              return (
                <div key={film._id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-20 items-center min-h-[500px]`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <a href={`/films/${film.slug}`} className="block group">
                      <div className="relative overflow-hidden shadow-2xl">
                        <img 
                          src={`https://picsum.photos/600/600?random=${index + 1}`}
                          alt={film.title}
                          className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <span className="text-white text-xl font-medium">Voir le film →</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  
                  {/* Texte */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-8">
                      <h2 className="text-4xl lg:text-5xl font-andale-mono font-bold text-theme-blue leading-tight">
                        <a href={`/films/${film.slug}`} className="hover:text-black transition-colors duration-300">
                          {film.title}
                        </a>
                      </h2>
                      
                      <div className="text-gray-600 text-xl space-y-2">
                        <p>Court métrage documentaire</p>
                        <p>Année de production : 2023</p>
                        <p>Durée : 15 minutes</p>
                      </div>
                      
                      <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="mt-4">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                        </p>
                      </div>
                      
                      <div className="pt-6">
                        <a 
                          href={`/films/${film.slug}`}
                          className="inline-flex items-center text-theme-blue text-xl font-medium hover:text-black transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-1 after:bg-theme-blue after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Découvrir le film →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun film trouvé.</p>
            </div>
          )}
        </div>

        {/* Trigger pour le chargement infini */}
        {hasMore && (
          <div id="load-more-trigger" className="flex justify-center py-16">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-theme-blue animate-bounce"></div>
                  <div className="w-3 h-3 bg-theme-blue animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-theme-blue animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-theme-blue text-lg font-andale-mono">Chargement des films...</span>
              </div>
            ) : (
              <div className="text-gray-400 text-lg font-andale-mono">Faites défiler pour charger plus de films</div>
            )}
          </div>
        )}

        {/* Message de fin */}
        {!hasMore && displayedFilms.length > 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Tous les films ont été chargés</p>
          </div>
        )}

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes créations cinématographiques</h2>
            <p className="text-gray-600 leading-relaxed">
              Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. 
              Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}