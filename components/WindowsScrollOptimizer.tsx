'use client'

import { useEffect } from 'react'

export default function WindowsScrollOptimizer() {
  useEffect(() => {
    // Détection de Windows
    const isWindows = navigator.platform.toLowerCase().includes('win')
    if (!isWindows) return

    const container = document.querySelector('.scroll-container') as HTMLElement
    if (!container) return

    // S'assurer que le scroll commence en haut
    container.scrollTop = 0
    container.style.scrollBehavior = 'auto'

    // Optimisation du scroll pour Windows
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const optimizeScroll = () => {
      if (isScrolling) return
      
      isScrolling = true
      container.style.scrollBehavior = 'smooth'
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
    }

    // Écouteur de scroll optimisé pour Windows
    container.addEventListener('scroll', optimizeScroll, { passive: true })
    
    // Optimisation du wheel pour Windows
    const handleWheel = (e: WheelEvent) => {
      // Prévenir le scroll natif saccadé sur Windows
      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault()
        
        const currentScroll = container.scrollTop
        const sectionHeight = window.innerHeight
        const headerHeight = 80 // Hauteur du header
        const direction = e.deltaY > 0 ? 1 : -1
        
        // Calculer la position cible en tenant compte de la distance du header
        const targetScroll = Math.round((currentScroll + headerHeight) / sectionHeight) * sectionHeight + (direction * sectionHeight) - headerHeight
        
        container.scrollTo({
          top: Math.max(0, Math.min(targetScroll, container.scrollHeight - window.innerHeight)),
          behavior: 'smooth'
        })
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('scroll', optimizeScroll)
      container.removeEventListener('wheel', handleWheel)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return null
}
