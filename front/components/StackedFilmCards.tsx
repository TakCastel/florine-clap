'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion'
import FilmCard from './FilmCard'

type Film = {
  _id: string
  slug: string
  title: string
  image?: string
  body?: string
  duree?: string
  annee?: string
  vimeoId?: string
}

type StackedFilmCardProps = {
  film: Film
  index: number
  totalFilms: number
  scrollYProgress: MotionValue<number>
  activeIndex: number
}

function StackedFilmCard({ 
  film, 
  index, 
  totalFilms, 
  scrollYProgress, 
  activeIndex
}: StackedFilmCardProps) {
  // Calculer la position de chaque card basée sur le scroll
  const startProgress = index / totalFilms
  const endProgress = (index + 1) / totalFilms
  const centerProgress = (startProgress + endProgress) / 2
  
  // Progress de cette card (0 à 1) - quand elle est au centre
  const cardProgress = useTransform(
    scrollYProgress,
    [
      Math.max(0, startProgress - 0.15),
      centerProgress,
      Math.min(1, endProgress + 0.15)
    ],
    [0, 1, 0]
  )
  
  // Scale : les cards derrière sont plus petites
  const scale = useTransform(cardProgress, [0, 1], [0.85, 1])
  
  // TranslateY pour l'effet d'empilement
  const translateY = useTransform(
    cardProgress,
    [0, 1],
    [50, 0]
  )

  // Z-index basé sur la distance à l'index actif
  const distanceFromActive = Math.abs(index - activeIndex)
  const zIndex = 100 - distanceFromActive * 10

  return (
    <div 
      className="sticky"
      style={{
        top: '50%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Math.max(0, zIndex),
        transform: 'translateY(-50%)',
      }}
    >
      <motion.div
        className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-16"
        style={{
          y: translateY,
          scale: scale,
          opacity: 1,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <FilmCard
            href={`/films/${film.slug}`}
            title={film.title}
            cover={film.image}
            body={film.body}
            duree={film.duree}
            annee={film.annee}
            vimeoId={film.vimeoId}
            isHero={true}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

type StackedFilmCardsProps = {
  films: Film[]
}

export default function StackedFilmCards({ films }: StackedFilmCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Calculer la hauteur du conteneur
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        // Chaque film prend 100vh pour créer l'effet de scroll
        const height = films.length * window.innerHeight
        setContainerHeight(height)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [films.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Suivre l'index actif
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newIndex = Math.round(latest * (films.length - 1))
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < films.length) {
      setActiveIndex(newIndex)
    }
  })

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ 
        position: 'relative',
        height: `${containerHeight}px`,
        minHeight: '100vh'
      }}
    >
      {films.map((film, index) => (
        <div 
          key={film._id} 
          style={{ 
            height: `${containerHeight / films.length}px`
          }}
        >
          <StackedFilmCard
            film={film}
            index={index}
            totalFilms={films.length}
            scrollYProgress={scrollYProgress}
            activeIndex={activeIndex}
          />
        </div>
      ))}
    </div>
  )
}
