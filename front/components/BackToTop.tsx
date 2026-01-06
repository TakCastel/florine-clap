'use client'

import { useState, useEffect, useRef } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isOnFooter, setIsOnFooter] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton après 300px de scroll sur desktop, 800px sur mobile
      const isMobile = window.innerWidth < 768
      const threshold = isMobile ? 800 : 300
      if (window.scrollY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const checkIfOnFooter = () => {
      if (!isVisible) return
      
      // Trouver le footer
      const footer = document.querySelector('footer')
      if (!footer) {
        setIsOnFooter(false)
        return
      }
      
      // Position du bouton (fixe en bas à droite, bottom-8 = 32px)
      const buttonBottom = window.innerHeight - 32
      const buttonTop = buttonBottom - 56 // h-14 = 56px
      
      // Position du footer par rapport à la fenêtre
      const footerRect = footer.getBoundingClientRect()
      const footerTop = footerRect.top
      
      // Le bouton est au-dessus du footer si son bas est au-dessus du haut du footer
      // On considère qu'on est "dans le footer" si le bas du bouton est au-dessus du haut du footer
      const isOverlapping = buttonBottom > footerTop
      
      setIsOnFooter(isOverlapping)
    }

    const handleScroll = () => {
      toggleVisibility()
      checkIfOnFooter()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkIfOnFooter)

    // Vérifier au montage
    toggleVisibility()
    checkIfOnFooter()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkIfOnFooter)
    }
  }, [isVisible])

  const scrollToTop = () => {
    // Utiliser le scroll natif du navigateur
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="back-to-top-button group fixed bottom-8 right-8 z-50 inline-flex items-center justify-center transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        backgroundColor: 'transparent',
        background: 'none',
      }}
      aria-label="Remonter en haut de la page"
    >
      {/* Cercle avec flèche animée */}
      <div 
        className={`back-to-top-circle relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
          isOnFooter 
            ? 'border-white/30 group-hover:border-white' 
            : 'border-black/30 group-hover:border-black'
        }`}
        style={{ backgroundColor: 'transparent', background: 'none' }}
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1 ${
            isOnFooter ? 'text-white' : 'text-black'
          }`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
        
        {/* Cercle animé qui pulse */}
        <div 
          className={`absolute inset-0 rounded-full border-2 animate-ping opacity-0 group-hover:opacity-100 ${
            isOnFooter ? 'border-white/50' : 'border-black/50'
          }`}
        ></div>
      </div>
    </button>
  )
}

