'use client'

import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  isTransitioning?: boolean
}

export default function PageTransition({ children, isTransitioning = false }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(false)
    } else {
      // Délai minimal pour permettre à la nouvelle page de se charger
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  return (
    <div className="relative">
      {/* Contenu avec transition fluide */}
      <div 
        className={`transition-all duration-150 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1'
        }`}
      >
        {children}
      </div>

      {/* Overlay de transition subtil */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-orange-100/80 backdrop-blur-sm transition-opacity duration-300" />
      )}
    </div>
  )
}
