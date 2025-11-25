'use client'

import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import StackScroll from '@/components/StackScroll'
import { allFilms } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function FilmsPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  // Trier tous les films par ordre personnalisé, puis par date si pas d'ordre
  const sortedFilms = [...allFilms].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime()
  })

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark relative">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films' }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-0">
        {/* Titre de la page avec animation */}
        <div className="mb-8 md:mb-12">
          <div 
            className="overflow-hidden mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <h1 
              className="heading-display text-theme-film"
            >
              Films
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-theme-dark/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-theme-films transition-all duration-500 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.1s',
              }}
            ></div>
          </div>

          <p 
            className="body-text text-theme-films/80 mt-6 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
            }}
          >
            Découvrez mes créations cinématographiques, documentaires et ateliers créatifs
          </p>
        </div>
      </div>
      
      {/* Section avec effet de pile progressive */}
      <StackScroll films={sortedFilms} />
      
      {/* Contenu SEO */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="pt-12 border-t border-theme-dark/10">
          <div className="max-w-4xl">
            <h2 className="heading-section text-theme-film mb-6">
              Mes créations cinématographiques
            </h2>
            <p className="body-text text-theme-films/80">
              Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. 
              Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
