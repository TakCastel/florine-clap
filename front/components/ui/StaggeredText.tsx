'use client'

import { motion, useInView, UseInViewOptions, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion'
import { useRef, ReactNode, useEffect, useState } from 'react'

interface StaggeredTextProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
  threshold?: number
}

/**
 * Composant qui anime le texte ligne par ligne avec un effet d'opacité fluide
 * Utilise un masque progressif pour une révélation douce de haut en bas
 * L'animation suit maintenant le scroll de manière fluide
 */
export const StaggeredText = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  once = true,
  threshold = 0.2,
}: StaggeredTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0 } as UseInViewOptions)
  const [totalHeight, setTotalHeight] = useState(0)
  const rawProgress = useMotionValue(0)
  const maxProgressRef = useRef(0) // Garder trace du progrès maximum atteint
  
  // Utiliser un spring pour une animation plus fluide et naturelle
  const revealProgress = useSpring(rawProgress, {
    stiffness: 50,
    damping: 30,
    mass: 0.5,
  })

  // Utiliser le scroll pour animer la révélation
  const { scrollY } = useScroll()
  
  useEffect(() => {
    if (!containerRef.current) return

    const measure = () => {
      const measureContainer = measureRef.current || containerRef.current
      if (!measureContainer) return

      const containerHeight = measureContainer.scrollHeight
      if (containerHeight === 0) {
        setTimeout(measure, 50)
        return
      }

      setTotalHeight(containerHeight)
    }

    const timeoutId = setTimeout(measure, 100)
    
    // Remesurer lors du redimensionnement
    const handleResize = () => {
      measure()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Calculer le progrès basé sur le scroll
  useEffect(() => {
    if (totalHeight === 0) return

    const updateProgress = () => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollPosition = window.scrollY || document.documentElement.scrollTop
      
      // Recalculer la position du conteneur dynamiquement
      const elementTop = rect.top + scrollPosition
      const elementBottom = elementTop + totalHeight
      
      // Zone de révélation : commence quand le haut du conteneur entre dans le viewport
      // et se termine quand le bas du conteneur sort du viewport
      // Utiliser des valeurs plus larges pour une révélation plus progressive
      const startOffset = viewportHeight * 0.15 // Commence à 15% du viewport
      const endOffset = viewportHeight * 0.85 // Se termine à 85% du viewport
      
      // Zone de révélation : de startOffset avant le haut à endOffset après le bas
      const revealStart = elementTop - startOffset
      const revealEnd = elementBottom - endOffset
      const revealRange = revealEnd - revealStart
      
      if (revealRange <= 0) {
        // Si le conteneur n'est pas encore dans la zone de révélation
        if (scrollPosition < revealStart) {
          // Ne pas réinitialiser si on a déjà commencé à révéler
          if (maxProgressRef.current === 0) {
            rawProgress.set(0)
          }
        } else {
          // Si on a dépassé la zone, tout révéler et le garder
          maxProgressRef.current = totalHeight
          rawProgress.set(totalHeight)
        }
        return
      }
      
      // Calculer le progrès (0 à 1)
      let progress = (scrollPosition - revealStart) / revealRange
      progress = Math.max(0, Math.min(1, progress))
      
      // Appliquer un easing doux pour une transition plus fluide
      // Utiliser une courbe ease-in-out plus douce
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      // Convertir en hauteur révélée
      const revealedHeight = easedProgress * totalHeight
      
      // Ne jamais diminuer le progrès - une fois révélé, rester révélé
      if (revealedHeight > maxProgressRef.current) {
        maxProgressRef.current = revealedHeight
        rawProgress.set(revealedHeight)
      } else if (maxProgressRef.current > 0) {
        // Si on a déjà révélé quelque chose, maintenir au moins ce niveau
        rawProgress.set(maxProgressRef.current)
      }
    }

    // Mettre à jour au scroll
    const handleScroll = () => {
      updateProgress()
    }
    
    // Mettre à jour initialement
    updateProgress()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateProgress)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [totalHeight, rawProgress])

  // Créer un masque avec gradient pour une révélation fluide ligne par ligne
  const maskImage = useTransform(revealProgress, (progress) => {
    if (totalHeight === 0) return 'linear-gradient(to bottom, black 0%, transparent 0%)'
    const percentage = (progress / totalHeight) * 100
    
    // Créer un gradient qui révèle progressivement de haut en bas
    // Avec une transition douce sur ~5% de la hauteur pour un fade plus fluide
    const fadeZone = 5
    const revealPoint = Math.max(0, percentage - fadeZone)
    const fadeStart = Math.max(0, percentage - fadeZone * 2)
    
    return `linear-gradient(to bottom, 
      black 0%, 
      black ${fadeStart}%, 
      rgba(0,0,0,0.9) ${revealPoint}%, 
      rgba(0,0,0,0.5) ${percentage}%, 
      transparent ${Math.min(100, percentage + fadeZone)}%, 
      transparent 100%)`
  })

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Conteneur de mesure invisible */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: '100%',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      
      {/* Contenu visible avec animation */}
      <div ref={containerRef} style={{ position: 'relative' }}>
        <motion.div
          style={{
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Alias pour compatibilité
export const StaggeredLines = StaggeredText
export const StaggeredWords = StaggeredText
export const StaggeredContent = StaggeredText
