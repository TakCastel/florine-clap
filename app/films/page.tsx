'use client'

import { useState, useRef } from 'react'
import FilmCard from '@/components/FilmCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Organiser les films par catégories
  const recentFilms = [...allFilms].sort((a, b) => new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime())
  const allFilmsList = [...allFilms]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setScrollPosition(newPosition)
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
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-white">Films</h1>
        
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

        {/* Section "Derniers films" */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-andale-mono font-bold text-white">Derniers films</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentFilms.slice(1).map((film) => (
              <div key={film._id} className="flex-shrink-0 w-64">
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

        {/* Section "Tous les films" */}
        <div className="mb-16">
          <h2 className="text-2xl font-andale-mono font-bold text-white mb-6">Tous les films</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allFilmsList.map((film) => (
              <div key={film._id} className="w-full">
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