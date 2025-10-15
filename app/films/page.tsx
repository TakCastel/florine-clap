'use client'

import { useState, useRef } from 'react'
import FilmCard from '@/components/FilmCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
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

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>, setPosition: (pos: number) => void) => {
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
    <div className="min-h-screen bg-black text-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films' }
        ]}
        variant="default"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold tracking-wide mb-12 text-white">Films</h1>
        
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">Films documentaires</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left', scrollRefDoc, setScrollPositionDoc)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right', scrollRefDoc, setScrollPositionDoc)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefDoc}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">Films d'ateliers</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left', scrollRefAteliers, setScrollPositionAteliers)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right', scrollRefAteliers, setScrollPositionAteliers)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefAteliers}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">En tant que monteuse</h2>
            {filmsMontage.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => scroll('left', scrollRefMontage, setScrollPositionMontage)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right', scrollRefMontage, setScrollPositionMontage)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {filmsMontage.length > 0 ? (
            <div 
              ref={scrollRefMontage}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
            <div className="text-white/70 text-center py-8">
              <p>Section en cours de développement...</p>
              <p className="text-sm mt-2">Films à ajouter : "Et après ?" (2023)</p>
            </div>
          )}
        </div>

        {/* Section "Petites formes expérimentales" */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">Petites formes expérimentales</h2>
            {petitesFormes.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => scroll('left', scrollRefPetitesFormes, setScrollPositionPetitesFormes)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right', scrollRefPetitesFormes, setScrollPositionPetitesFormes)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {petitesFormes.length > 0 ? (
            <div 
              ref={scrollRefPetitesFormes}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
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
            <div className="text-white/70 text-center py-8">
              <p>Section en cours de développement...</p>
              <p className="text-sm mt-2">Films à ajouter : "La première" (2014), "I T" (Docu-fiction)</p>
            </div>
          )}
        </div>

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="prose prose-lg max-w-none text-white">
            <h2 className="text-2xl font-bold text-white mb-4">Mes créations cinématographiques</h2>
            <p className="text-white/70 leading-relaxed">
              Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. 
              Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}