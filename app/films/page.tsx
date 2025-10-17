'use client'

import { useState, useRef, useEffect } from 'react'
import FilmCard from '@/components/FilmCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollPositionDoc, setScrollPositionDoc] = useState(0)
  const [scrollPositionAteliers, setScrollPositionAteliers] = useState(0)
  const [scrollPositionMontage, setScrollPositionMontage] = useState(0)
  const [scrollPositionPetitesFormes, setScrollPositionPetitesFormes] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRefDoc = useRef<HTMLDivElement>(null)
  const scrollRefAteliers = useRef<HTMLDivElement>(null)
  const scrollRefMontage = useRef<HTMLDivElement>(null)
  const scrollRefPetitesFormes = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  // Organiser les films par catégories
  const recentFilms = [...allFilms].sort((a, b) => new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime())
  
  // Catégoriser les films selon la vraie structure
  const filmsDocumentaires = allFilms.filter(film => 
    film.title === "Père Chave, ma vie au Festival d'Avignon" ||
    film.title === "Quand je vous caresse - Final cut" ||
    film.title === "PLAY" ||
    film.title === "Violoncelles, vibrez !" ||
    film.title === "Sous le pont d'Avignon"
  )
  
  const filmsAteliers = allFilms.filter(film => 
    film.title === "1,2,3 Soleil !" ||
    film.title === "Le Bus, le tram, la Baladine et moi"
  )
  
  // Films de montage et petites formes
  const filmsMontage = allFilms.filter(film => 
    film.title === "Et après ?"
  )
  
  const petitesFormes = allFilms.filter(film => 
    film.title === "La première" ||
    film.title === "I T"
  )

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>, setPosition: (pos: number) => void) => {
    if (ref.current) {
      // Calculer la largeur d'une card + gap (320px + 24px = 344px)
      const cardWidth = 344
      const containerWidth = ref.current.clientWidth
      const scrollAmount = Math.min(cardWidth, containerWidth * 0.8)
      
      const currentScroll = ref.current.scrollLeft
      const newPosition = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : Math.min(ref.current.scrollWidth - containerWidth, currentScroll + scrollAmount)
      
      ref.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-white text-theme-dark relative overflow-hidden">
      {/* Éléments décoratifs subtils */}
      <div className="absolute top-40 right-10 w-32 h-32 border border-theme-dark/5 rounded-full"></div>
      <div className="absolute bottom-40 left-16 w-48 h-48 border border-theme-dark/5 rotate-45"></div>

      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films' }
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
              Films
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
            Découvrez mes créations cinématographiques, documentaires et ateliers créatifs
          </p>
        </div>
        
        {/* Film Hero - Premier film en grand */}
        <div className="mb-16">
          <FilmCard
            href={`/films/${recentFilms[0].slug}`}
            title={recentFilms[0].title}
            cover={recentFilms[0].image}
            synopsis={recentFilms[0].shortSynopsis}
            duree={recentFilms[0].duree}
            annee={recentFilms[0].annee}
            vimeoId={recentFilms[0].vimeoId}
            isHero={true}
          />
        </div>

        {/* Section "Films documentaires" */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">Catégorie 01</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Films documentaires
              </h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left', scrollRefDoc, setScrollPositionDoc)}
                className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
              </button>
              <button 
                onClick={() => scroll('right', scrollRefDoc, setScrollPositionDoc)}
                className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefDoc}
            className="flex gap-6 overflow-x-auto scrollbar-hide pt-4 pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filmsDocumentaires.map((film) => (
              <div key={film._id} className="flex-shrink-0 w-80">
                <FilmCard
                  href={`/films/${film.slug}`}
                  title={film.title}
                  cover={film.image}
                  synopsis={film.shortSynopsis}
                  duree={film.duree}
                  annee={film.annee}
                  vimeoId={film.vimeoId}
                  isHero={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section "Films d'ateliers" */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">Catégorie 02</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Films d'ateliers
              </h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => scroll('left', scrollRefAteliers, setScrollPositionAteliers)}
                className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
              </button>
              <button 
                onClick={() => scroll('right', scrollRefAteliers, setScrollPositionAteliers)}
                className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefAteliers}
            className="flex gap-6 overflow-x-auto scrollbar-hide pt-4 pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filmsAteliers.map((film) => (
              <div key={film._id} className="flex-shrink-0 w-80">
                <FilmCard
                  href={`/films/${film.slug}`}
                  title={film.title}
                  cover={film.image}
                  synopsis={film.shortSynopsis}
                  duree={film.duree}
                  annee={film.annee}
                  vimeoId={film.vimeoId}
                  isHero={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section "En tant que monteuse" */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">Catégorie 03</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                En tant que monteuse
              </h2>
            </div>
            {filmsMontage.length > 0 && (
              <div className="flex gap-3">
                <button 
                  onClick={() => scroll('left', scrollRefMontage, setScrollPositionMontage)}
                  className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
                </button>
                <button 
                  onClick={() => scroll('right', scrollRefMontage, setScrollPositionMontage)}
                  className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
                </button>
              </div>
            )}
          </div>
          
          {filmsMontage.length > 0 ? (
            <div 
              ref={scrollRefMontage}
              className="flex gap-6 overflow-x-auto scrollbar-hide pt-4 pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filmsMontage.map((film) => (
                <div key={film._id} className="flex-shrink-0 w-80">
                  <FilmCard
                    href={`/films/${film.slug}`}
                    title={film.title}
                    cover={film.image}
                    synopsis={film.shortSynopsis}
                    duree={film.duree}
                    annee={film.annee}
                    vimeoId={film.vimeoId}
                    isHero={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-theme-dark/70 text-center py-8">
              <p>Section en cours de développement...</p>
              <p className="text-sm mt-2">Films à ajouter : "Et après ?" (2023)</p>
            </div>
          )}
        </div>

        {/* Section "Petites formes expérimentales" */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-3 font-medium">Catégorie 04</div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-dark leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Petites formes expérimentales
              </h2>
            </div>
            {petitesFormes.length > 0 && (
              <div className="flex gap-3">
                <button 
                  onClick={() => scroll('left', scrollRefPetitesFormes, setScrollPositionPetitesFormes)}
                  className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
                </button>
                <button 
                  onClick={() => scroll('right', scrollRefPetitesFormes, setScrollPositionPetitesFormes)}
                  className="group w-12 h-12 border-2 border-theme-dark/20 hover:border-theme-dark hover:bg-theme-dark/5 rounded-full transition-all duration-500 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-theme-dark/60 group-hover:text-theme-dark transition-colors duration-300" />
                </button>
              </div>
            )}
          </div>
          
          {petitesFormes.length > 0 ? (
            <div 
              ref={scrollRefPetitesFormes}
              className="flex gap-6 overflow-x-auto scrollbar-hide pt-4 pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {petitesFormes.map((film) => (
                <div key={film._id} className="flex-shrink-0 w-80">
                  <FilmCard
                    href={`/films/${film.slug}`}
                    title={film.title}
                    cover={film.image}
                    synopsis={film.shortSynopsis}
                    duree={film.duree}
                    annee={film.annee}
                    vimeoId={film.vimeoId}
                    isHero={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-theme-dark/70 text-center py-8">
              <p>Section en cours de développement...</p>
              <p className="text-sm mt-2">Films à ajouter : "La première" (2014), "I T" (Docu-fiction)</p>
            </div>
          )}
        </div>

        {/* Contenu SEO */}
        <div className="mt-24 pt-12 border-t border-theme-dark/10">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-theme-dark mb-6" style={{
              fontFamily: 'var(--font-andalemo), sans-serif',
              letterSpacing: '-0.02em',
            }}>
              Mes créations cinématographiques
            </h2>
            <p className="text-theme-dark/70 text-lg leading-relaxed">
              Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. 
              Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}