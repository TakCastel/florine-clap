'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, motion } from 'framer-motion'
import SimpleFilmCard from './SimpleFilmCard'

type ContentItem = {
  _id: string
  slug: string
  title: string
  image?: string
  cover?: string
  shortSynopsis?: string
  excerpt?: string
  duree?: string
  annee?: string
  vimeoId?: string
  [key: string]: any // Permet d'accepter d'autres propriétés
}

type StackScrollProps = {
  items: ContentItem[]
  basePath: string // '/films' ou '/mediations'
  className?: string
}

/**
 * Composant StackScroll - Scroll normal avec cards qui apparaissent alternativement de gauche/droite
 * Structure : Card > Trait vertical > Card > Trait vertical
 */
export default function StackScroll({ items, basePath, className = '' }: StackScrollProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="relative">
          {items.map((item, index) => {
            const isEven = index % 2 === 0
            const direction = isEven ? 'right' : 'left'
            const isLast = index === items.length - 1
            
            return (
              <div key={item._id}>
                {/* Card */}
                <ContentCardWithAnimation
                  item={item}
                  basePath={basePath}
                  direction={direction}
                  index={index}
                />
                
                {/* Trait vertical entre les cards (sauf après la dernière) */}
                {!isLast && (
                  <ProgressBar
                    index={index}
                    nextCardIndex={index + 1}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

type ContentCardWithAnimationProps = {
  item: ContentItem
  basePath: string
  direction: 'left' | 'right'
  index: number
}

function ContentCardWithAnimation({ item, basePath, direction, index }: ContentCardWithAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(index === 0 ? 1 : 0)
  const [x, setX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    const updateAnimation = () => {
      if (!ref.current) return
      
      // La première card est toujours visible
      if (index === 0) {
        setOpacity(1)
        setX(0)
        return
      }
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowCenter = windowHeight / 2
      
      // Position de la card
      const cardTop = rect.top
      const cardBottom = rect.bottom
      const cardCenter = cardTop + (rect.height / 2)
      
      // Calculer l'opacité et la position x en fonction du scroll
      // La card apparaît progressivement quand elle entre dans le viewport
      // et disparaît quand elle sort
      
      let calculatedOpacity = 0
      // Alternance d'apparition : cards paires depuis la droite, impaires depuis la gauche
      const isEven = index % 2 === 0
      const startX = isEven ? -100 : 100 // Droite pour paires, gauche pour impaires
      let calculatedX = startX
      
      // Zone d'apparition : commence avant que la card entre dans le viewport
      // L'animation commence dès que la card approche du bas de l'écran
      const appearStart = windowHeight * 1.5 // Entre-deux : commence à 1.5x la hauteur du viewport
      const appearEnd = windowHeight * 0.9 // Apparition complète quand la card arrive près du bas de l'écran
      
      // Zone de disparition : quand la card sort par le haut
      const disappearStart = windowCenter * 1.3 // 130% du centre
      const disappearEnd = -rect.height // Complètement sortie
      
      if (cardCenter >= appearStart) {
        // La card est encore très loin en dessous
        calculatedOpacity = 0
        calculatedX = startX
      } else if (cardCenter <= appearEnd) {
        // La card est dans la zone d'apparition complète (près du bas de l'écran)
        calculatedOpacity = 1
        calculatedX = 0
      } else if (cardCenter > appearEnd && cardCenter < disappearStart) {
        // La card est en train d'apparaître progressivement
        const progress = (appearStart - cardCenter) / (appearStart - appearEnd)
        calculatedOpacity = Math.min(1, Math.max(0, progress))
        calculatedX = startX * (1 - calculatedOpacity) // Depuis la position de départ vers 0
      } else if (cardCenter <= disappearEnd) {
        // La card est complètement sortie
        calculatedOpacity = 0
        calculatedX = startX
      } else {
        // Zone de disparition progressive
        const progress = (disappearStart - cardCenter) / (disappearStart - disappearEnd)
        calculatedOpacity = Math.min(1, Math.max(0, progress))
        calculatedX = startX * (1 - calculatedOpacity) // Depuis la position de départ vers 0
      }
      
      // Appliquer l'opacité et la transition en même temps
      setOpacity(calculatedOpacity)
      setX(calculatedX)
    }
    
    const handleScroll = () => {
      requestAnimationFrame(updateAnimation)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    updateAnimation()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [direction])
  
  const imagePosition = direction === 'left' ? 'left' : 'right'
  
  // Mapper les propriétés : les films ont 'image' et 'shortSynopsis', les médiations ont 'cover' et 'excerpt'
  const cover = item.image || item.cover
  const synopsis = item.shortSynopsis || item.excerpt
  
  return (
    <motion.div
      ref={ref}
      data-card-index={index}
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
      }}
      className=""
    >
      <SimpleFilmCard
        href={`${basePath}/${item.slug}`}
        title={item.title}
        cover={cover}
        synopsis={synopsis}
        imagePosition={imagePosition}
      />
    </motion.div>
  )
}

type ProgressBarProps = {
  index: number
  nextCardIndex: number
}

function ProgressBar({ index, nextCardIndex }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [hasTriggered, setHasTriggered] = useState(false)
  
  useEffect(() => {
    const updateProgress = () => {
      if (!barRef.current) return
      
      // Trouver la card suivante dans le DOM
      const nextCard = document.querySelector(`[data-card-index="${nextCardIndex}"]`) as HTMLElement
      if (!nextCard) return
      
      const barRect = barRef.current.getBoundingClientRect()
      const nextCardRect = nextCard.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowCenter = windowHeight / 2
      
      // Position de la barre
      const barBottom = barRect.bottom
      
      // Position de la card suivante
      const nextCardTop = nextCardRect.top
      const nextCardCenter = nextCardTop + (nextCardRect.height / 2)
      
      // La barre démarre à 0% quand elle est tout en bas du viewport
      // Elle arrive à 100% quand la card suivante arrive au milieu de la page
      let calculatedProgress = 0
      
      // Si la card suivante est déjà au centre ou au-dessus, la barre est à 100%
      if (nextCardCenter <= windowCenter) {
        calculatedProgress = 1
      } else {
        // Point de départ : barre en bas du viewport (barBottom = windowHeight)
        // Point d'arrivée : card suivante au centre (nextCardCenter = windowCenter)
        const startPoint = windowHeight // Barre en bas
        const endPoint = windowCenter // Card au centre
        
        // Position actuelle : on utilise la position de la card suivante
        const currentPoint = nextCardCenter
        
        // Calculer la progression : 0% quand currentPoint = startPoint, 100% quand currentPoint = endPoint
        if (currentPoint >= startPoint) {
          // La card est encore en dessous du viewport
          calculatedProgress = 0
        } else if (currentPoint <= endPoint) {
          // La card est au centre ou au-dessus
          calculatedProgress = 1
        } else {
          // La card est entre le bas et le centre
          const totalDistance = startPoint - endPoint
          const traveledDistance = startPoint - currentPoint
          calculatedProgress = traveledDistance / totalDistance
        }
      }
      
      setProgress(calculatedProgress)
    }
    
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    updateProgress()
    
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [index, nextCardIndex, hasTriggered])
  
  return (
    <div 
      ref={barRef}
      className="flex justify-center my-24 md:my-32"
    >
      <div className="relative w-[2px] h-24 md:h-32 bg-black/10 overflow-hidden">
        <motion.div
          className="w-full bg-black origin-top"
          style={{
            height: `${progress * 100}%`
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}
