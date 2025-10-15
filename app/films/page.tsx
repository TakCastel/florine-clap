'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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
    console.log('allFilms.length:', allFilms.length)
    console.log('allFilms:', allFilms)
    if (allFilms && allFilms.length > 0) {
      const initialFilms = allFilms.slice(0, filmsPerLoad)
      console.log('initialFilms:', initialFilms)
      setDisplayedFilms(initialFilms)
      setCurrentIndex(filmsPerLoad)
      setHasMore(filmsPerLoad < allFilms.length)
    } else {
      console.log('Aucun film trouvé ou allFilms non défini')
    }
  }, [filmsPerLoad])

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

  // Debug: afficher les valeurs importantes
  console.log('Debug - hasMore:', hasMore, 'displayedFilms.length:', displayedFilms.length, 'allFilms.length:', allFilms.length)

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films' }
        ]}
        variant="default"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-andale-mono font-bold tracking-wide mb-12 text-theme-blue">Films</h1>
        
        {/* Layout alterné avec images et textes */}
        <div className="space-y-32">
          {displayedFilms.length > 0 ? (
            displayedFilms.map((film, index) => {
              const isEven = index % 2 === 0
              
              return (
                <article key={film._id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-20 items-center min-h-[500px]`} itemScope itemType="https://schema.org/Movie">
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden shadow-2xl">
                      <Image 
                        src={film.image || `/images/CHAVE_1.avif`}
                        alt={`Affiche du film ${film.title} - ${film.shortSynopsis || 'Documentaire de Florine Clap'}`}
                        width={600}
                        height={400}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        className="w-full h-auto object-contain"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        itemProp="image"
                      />
                    </div>
                  </div>
                  
                  {/* Texte */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-8">
                      <h2 className="text-2xl lg:text-3xl font-andale-mono font-bold text-theme-blue leading-tight" itemProp="name">
                        {film.title}
                      </h2>
                      
                      <div className="text-gray-600 text-xl space-y-2">
                        <p itemProp="genre">Documentaire - <span itemProp="duration">{film.duree || '26 min'}</span></p>
                        <p itemProp="dateCreated">{film.annee || '2022'}</p>
                        <meta itemProp="director" content="Florine Clap" />
                        <meta itemProp="creator" content="Florine Clap" />
                        <meta itemProp="inLanguage" content="fr" />
                        <meta itemProp="countryOfOrigin" content="France" />
                      </div>
                      
                      <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                        <p itemProp="description">
                          {film.shortSynopsis || 
                            "C'est l'histoire d'un fils de cheminot au destin tout tracé qui, devenu prêtre dans le contexte de l'après-guerre, va découvrir le théâtre et son mystère à travers le Festival d'Avignon et le théâtre populaire de Jean Vilar."}
                        </p>
                      </div>
                      
                      <div className="pt-6">
                        <a 
                          href={`/films/${film.slug}`}
                          className="inline-flex items-center text-theme-blue text-xl font-medium hover:text-black transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-blue after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Découvrir le film →
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun film trouvé.</p>
            </div>
          )}
        </div>

        {/* Trigger pour le chargement infini */}
        {hasMore && displayedFilms.length > 0 && allFilms.length > displayedFilms.length && (
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