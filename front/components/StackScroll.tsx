'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import SimpleFilmCard from './SimpleFilmCard'

type ContentItem = {
  id?: string
  _id?: string // Support pour l'ancien format
  slug: string
  title: string
  image?: string | { id: string; filename_download: string } // Support Directus file objects
  content?: string | { id: string; filename_download: string } // Image content (plus petite)
  cover?: string | { id: string; filename_download: string } // Support Directus file objects
  shortSynopsis?: string
  short_synopsis?: string
  excerpt?: string
  duree?: string
  annee?: string
  vimeoId?: string
  vimeo_id?: string
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-20">
        <div className="relative">
          {items.map((item, index) => {
            const isEven = index % 2 === 0
            const direction = isEven ? 'right' : 'left'
            const isLast = index === items.length - 1
            
            return (
              <div key={item.id || item._id || index}>
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
  const [isMobile, setIsMobile] = useState(false)
  
  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Animation scroll-driven avec framer motion
  // La première card est toujours visible, les autres s'animent au scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: index === 0 
      ? ["start start", "end start"] // Première card : reste visible
      : isMobile
      ? ["start 0.9", "center 0.6"] // Mobile : animation plus proche
      : ["start 0.85", "center 0.5"] // Desktop : animation plus large
  })
  
  // Alternance d'apparition : cards paires depuis la droite, impaires depuis la gauche
  const isEven = index % 2 === 0
  // Sur mobile, réduire les déplacements (40px au lieu de 120px)
  const startX = isMobile ? (isEven ? -40 : 40) : (isEven ? -120 : 120)
  
  // Opacité : apparaît progressivement
  const opacity = useTransform(
    scrollYProgress,
    index === 0 
      ? [0, 1] 
      : [0, 0.2, 0.8, 1],
    index === 0 
      ? [1, 1] 
      : [0, 0, 1, 1]
  )
  
  // Position X : slide depuis la gauche ou droite avec une courbe d'easing
  const x = useTransform(
    scrollYProgress,
    index === 0 
      ? [0, 1] 
      : [0, 0.2, 0.8, 1],
    index === 0 
      ? [0, 0] 
      : [startX, startX, 0, 0]
  )
  
  const imagePosition = direction === 'left' ? 'left' : 'right'
  
  // Mapper les propriétés : les films ont 'content' (prioritaire), 'image' et 'shortSynopsis', les médiations ont 'cover' et 'excerpt'
  // Gérer les objets Directus pour les images
  const getImageUrl = (img: string | { id: string; filename_download: string } | undefined): string | undefined => {
    if (!img) return undefined
    if (typeof img === 'string') {
      // Si c'est déjà une URL complète, on la retourne
      if (img.startsWith('http')) return img
      // Si c'est un UUID (36 caractères avec tirets), construire l'URL
      if (img.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8055' : '')
        // Note: Le token statique sera ajouté côté serveur via getImageUrl de directus.ts
        return `${directusUrl}/assets/${img}`
      }
      // Sinon, on suppose que c'est un chemin relatif
      return img
    }
    // Si c'est un objet Directus file
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
    // Note: Le token statique sera ajouté côté serveur via getImageUrl de directus.ts
    return `${directusUrl}/assets/${img.id}`
  }
  // Pour les films : utiliser 'content' en priorité (plus petite), sinon 'image', sinon 'cover'
  // Si l'image est déjà une URL (string), l'utiliser directement, sinon construire l'URL
  const cover = typeof item.content === 'string' && item.content.startsWith('http') 
    ? item.content 
    : typeof item.image === 'string' && item.image.startsWith('http')
    ? item.image
    : typeof item.cover === 'string' && item.cover.startsWith('http')
    ? item.cover
    : getImageUrl(item.content) || getImageUrl(item.image) || getImageUrl(item.cover)
  const synopsis = item.shortSynopsis || item.short_synopsis || item.excerpt
  
  return (
    <motion.div
      ref={ref}
      data-card-index={index}
      style={{
        opacity,
        x,
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
  const nextCardRef = useRef<HTMLElement | null>(null)
  
  // Trouver la card suivante dans le DOM
  useEffect(() => {
    nextCardRef.current = document.querySelector(`[data-card-index="${nextCardIndex}"]`) as HTMLElement
  }, [nextCardIndex])
  
  // Animation scroll-driven pour la barre de progression
  const { scrollYProgress } = useScroll({
    target: barRef,
    offset: ["start end", "end start"]
  })
  
  // La barre se remplit progressivement quand on scroll
  // On utilise un useEffect pour calculer la progression basée sur la position de la card suivante
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const updateProgress = () => {
      if (!barRef.current || !nextCardRef.current) return
      
      const nextCardRect = nextCardRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowCenter = windowHeight / 2
      
      // Position de la card suivante
      const nextCardCenter = nextCardRect.top + (nextCardRect.height / 2)
      
      // La barre démarre à 0% quand elle est en bas du viewport
      // Elle arrive à 100% quand la card suivante arrive au centre
      const startPoint = windowHeight
      const endPoint = windowCenter
      
      let calculatedProgress = 0
      if (nextCardCenter >= startPoint) {
        calculatedProgress = 0
      } else if (nextCardCenter <= endPoint) {
        calculatedProgress = 1
      } else {
        const totalDistance = startPoint - endPoint
        const traveledDistance = startPoint - nextCardCenter
        calculatedProgress = Math.max(0, Math.min(1, traveledDistance / totalDistance))
      }
      
      setProgress(calculatedProgress)
    }
    
    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    updateProgress()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [nextCardIndex])
  
  return (
    <div 
      ref={barRef}
      className="flex justify-center my-16 md:my-24 lg:my-32"
    >
      <div className="relative w-[2px] h-16 md:h-24 lg:h-32 bg-black/10 overflow-hidden">
        <motion.div
          className="w-full bg-black origin-top"
          style={{
            height: `${progress * 100}%`
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </div>
  )
}
