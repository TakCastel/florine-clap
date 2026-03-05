'use client'

import { useState, useEffect, useRef } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isOnFooter, setIsOnFooter] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rafId = useRef<number | null>(null)
  const lastVisibility = useRef(false)
  const lastOnFooter = useRef(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const isMobile = window.innerWidth < 768
      const threshold = isMobile ? 800 : 300
      return window.scrollY > threshold
    }

    const checkIfOnFooter = () => {
      const footer = document.querySelector('footer')
      if (!footer) return false
      const buttonBottom = window.innerHeight - 32
      const footerRect = footer.getBoundingClientRect()
      return buttonBottom > footerRect.top
    }

    const update = () => {
      const nextVisible = toggleVisibility()
      const nextOnFooter = checkIfOnFooter()
      if (nextVisible !== lastVisibility.current) {
        lastVisibility.current = nextVisible
        setIsVisible(nextVisible)
      }
      if (nextOnFooter !== lastOnFooter.current) {
        lastOnFooter.current = nextOnFooter
        setIsOnFooter(nextOnFooter)
      }
      rafId.current = null
    }

    const handleScroll = () => {
      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(update)
    }

    const handleResize = () => {
      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    update()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

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

