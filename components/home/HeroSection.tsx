'use client'

import { useState, useEffect } from 'react'
import { useHover } from '@/contexts/HoverContext'

export default function HeroSection() {
  const { setForceHoverIndex } = useHover()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section')
    const container = document.querySelector('.scroll-container') as HTMLElement
    
    if (categoriesSection && container) {
      const elementTop = categoriesSection.offsetTop
      const headerHeight = 80 // Hauteur du header fixe
      const offsetPosition = elementTop - headerHeight
      
      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Détecter quelle carte a le curseur dessus
      setTimeout(() => {
        const rect = categoriesSection.getBoundingClientRect()
        const mouseX = mousePosition.x
        
        // Calculer quelle carte est sous le curseur
        const cardWidth = rect.width / 3
        let hoverIndex = -1
        
        if (mouseX < rect.left + cardWidth) {
          hoverIndex = 0 // Films
        } else if (mouseX < rect.left + cardWidth * 2) {
          hoverIndex = 1 // Médiations
        } else {
          hoverIndex = 2 // Actualités
        }
        
        setForceHoverIndex(hoverIndex)
      }, 1000)
    }
  }

  return (
    <div id="hero-section" className="scroll-section w-full z-10 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Vidéo */}
      <div className="flex-1 relative min-h-0">
        <video
          src="/videos/example.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        
      </div>
      
      {/* Bande noire avec flèche - par-dessus la vidéo */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-black flex items-center justify-center z-30">
        <button
          onClick={scrollToCategories}
          className="group text-white/60 hover:text-white/90 transition-all duration-1000 ease-out"
          aria-label="Aller à la section des catégories"
        >
          <svg 
            className="w-6 h-6 transition-all duration-1000 group-hover:translate-y-0.5" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
