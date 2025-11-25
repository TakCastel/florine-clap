'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, MotionValue, useMotionValueEvent } from 'framer-motion'
import { useStackProgress } from '@/hooks/useStackProgress'
import ImmersiveFilmCard from './ImmersiveFilmCard'

type Film = {
  _id: string
  slug: string
  title: string
  image?: string
  shortSynopsis?: string
  duree?: string
  annee?: string
  vimeoId?: string
}

type StackCardProps = {
  film: Film
  index: number
  totalCards: number
  scrollYProgress: MotionValue<number>
}

/**
 * Composant individuel pour chaque card dans la pile
 */
function StackCard({ film, index, totalCards, scrollYProgress }: StackCardProps) {
  const { opacity, scale, y, rotate, zIndex } = useStackProgress(
    scrollYProgress,
    index,
    totalCards
  )
  
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6 md:px-10 lg:px-16"
      style={{
        opacity,
        scale,
        y,
        rotate,
        zIndex,
        willChange: 'transform, opacity'
      }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <ImmersiveFilmCard
          href={`/films/${film.slug}`}
          title={film.title}
          cover={film.image}
          synopsis={film.shortSynopsis}
          duree={film.duree}
          annee={film.annee}
          vimeoId={film.vimeoId}
        />
      </div>
    </motion.div>
  )
}

type StackScrollProps = {
  films: Film[]
  className?: string
}

/**
 * Composant StackScroll - Effet de pile progressive de cards basé sur le scroll
 * 
 * Les cards s'empilent progressivement au scroll et convergent vers une position finale identique.
 * La zone complète a une hauteur de cardsCount * viewportHeight.
 */
export default function StackScroll({ films, className = '' }: StackScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [viewportHeight, setViewportHeight] = useState(() => {
    // Initialiser avec la hauteur du viewport si disponible (côté client)
    if (typeof window !== 'undefined') {
      return window.innerHeight
    }
    return 0
  })
  
  // Calculer la hauteur de la zone de scroll
  // Hauteur totale = nombre de cards * hauteur du viewport * facteur (0.75 pour scroll plus rapide)
  // On ajoute un écran supplémentaire pour le confort
  const scrollHeight = (films.length * (viewportHeight || 800) * 0.75) + (viewportHeight || 800)
  
  // Mettre à jour la hauteur du viewport au montage et au resize
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight)
    }
  }, [])
  
  // Utiliser useScroll pour suivre la progression du scroll dans le container
  // DÉFINITION AVANT UTILISATION
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const [activeIndex, setActiveIndex] = useState(0)
  
  // Suivre l'index actif pour l'affichage
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newIndex = Math.min(Math.round(latest * (films.length - 1)), films.length - 1)
    setActiveIndex(newIndex)
  })
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ 
        height: `${scrollHeight}px`,
        minHeight: '100vh'
      }}
    >
      {/* Container sticky qui contient toutes les cards */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Indicateur de progression latéral */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-50 hidden md:flex">
          <span className="text-xs font-mono text-theme-dark/60 font-medium tracking-widest">
            {activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1}
          </span>
          <div className="w-[3px] h-48 bg-theme-dark/10 relative rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-theme-film rounded-full"
              style={{ 
                height: '100%', 
                scaleY: scrollYProgress,
                originY: 0
              }} 
            />
          </div>
          <span className="text-xs font-mono text-theme-dark/60 font-medium tracking-widest">
            {films.length < 10 ? `0${films.length}` : films.length}
          </span>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          {films.map((film, index) => (
            <StackCard
              key={film._id}
              film={film}
              index={index}
              totalCards={films.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
