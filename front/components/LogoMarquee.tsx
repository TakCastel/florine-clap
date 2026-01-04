'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface LogoMarqueeProps {
  title?: string
  className?: string
  invertColors?: boolean
  pauseOnHover?: boolean
}

function LogoMarquee({ title, className = '', invertColors = false, pauseOnHover = true }: LogoMarqueeProps) {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const logos = [
    { src: '/images/logos/CNC-Logo.svg', alt: 'CNC' },
    { src: '/images/logos/france-tv.png', alt: 'France TV' },
    { src: '/images/logos/la-scam.svg', alt: 'La SCAM' },
    { src: '/images/logos/fondation-louis-vuitton.png', alt: 'Fondation Louis Vuitton' },
    { src: '/images/logos/logo-partenaire.png', alt: 'Partenaire', invert: true, isLarge: true, isFLC: true },
    { src: '/images/logos/Utopia_logo.png', alt: 'Utopia', isMedium: true, noInvertOnDark: true, isUtopia: true },
  ]

  // Empêcher le drag and drop des images en desktop
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
          {title}
        </h3>
      )}
      
      <div 
        ref={containerRef}
        className="relative overflow-hidden w-full"
        style={{ 
          touchAction: isMobile ? 'pan-x' : 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Marquee container */}
        <div 
          className={`flex animate-marquee w-max ${pauseOnHover ? 'hover:pause' : ''}`}
          style={{ 
            touchAction: isMobile ? 'pan-x' : 'none'
          }}
        >
          {/* Premier set de logos */}
          <div className="flex items-center flex-shrink-0 whitespace-nowrap">
            {logos.map((logo, index) => {
              // Logique des filtres :
              // - Page d'accueil (invertColors=true) : tous les logos en blanc SAUF Utopia
              // - Page bio (invertColors=false) : 
              //   * Seulement logo-partenaire inversé
              //   * Utopia et autres en grayscale
              let filterClass = 'grayscale'
              
              if (invertColors && !logo.noInvertOnDark) {
                // Page d'accueil : tous les logos inversés SAUF ceux avec noInvertOnDark (Utopia)
                filterClass = 'invert brightness-0'
              } else if (logo.invert) {
                // Page bio : seulement logo-partenaire inversé
                filterClass = 'invert'
              }
              
              const heightClass = logo.isLarge ? 'h-20' : logo.isMedium ? 'h-14' : 'h-12'
              const widthClass = logo.isLarge ? 'w-44' : logo.isMedium ? 'w-36' : 'w-28'
              
              // Espacement réduit entre FLC (index 4) et Utopia (index 5)
              const prevLogo = index > 0 ? logos[index - 1] : null
              const isAfterFLC = prevLogo?.isFLC
              const gapClass = isAfterFLC ? 'ml-2 md:ml-4' : index > 0 ? 'ml-8 md:ml-16' : ''

              return (
                <div
                  key={`first-${index}`}
                  className={`relative ${heightClass} ${widthClass} flex-shrink-0 ${gapClass}`}
                  onDragStart={handleDragStart}
                  draggable={false}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="140px"
                    unoptimized
                    className={`object-contain filter ${filterClass} opacity-90 transition-all duration-300 pointer-events-none`}
                    draggable={false}
                  />
                </div>
              )
            })}
            {/* Espace pour simuler le défilement */}
            <div className="w-8 flex-shrink-0"></div>
          </div>
          
          {/* Deuxième set de logos (pour la continuité) */}
          <div className="flex items-center flex-shrink-0 whitespace-nowrap">
            {logos.map((logo, index) => {
              // Logique des filtres :
              // - Page d'accueil (invertColors=true) : tous les logos en blanc SAUF Utopia
              // - Page bio (invertColors=false) : 
              //   * Seulement logo-partenaire inversé
              //   * Utopia et autres en grayscale
              let filterClass = 'grayscale'
              
              if (invertColors && !logo.noInvertOnDark) {
                // Page d'accueil : tous les logos inversés SAUF ceux avec noInvertOnDark (Utopia)
                filterClass = 'invert brightness-0'
              } else if (logo.invert) {
                // Page bio : seulement logo-partenaire inversé
                filterClass = 'invert'
              }
              
              const heightClass = logo.isLarge ? 'h-20' : logo.isMedium ? 'h-14' : 'h-12'
              const widthClass = logo.isLarge ? 'w-44' : logo.isMedium ? 'w-36' : 'w-28'
              
              // Espacement réduit entre FLC (index 4) et Utopia (index 5)
              const prevLogo = index > 0 ? logos[index - 1] : null
              const isAfterFLC = prevLogo?.isFLC
              const gapClass = isAfterFLC ? 'ml-2 md:ml-4' : index > 0 ? 'ml-8 md:ml-16' : ''

              return (
                <div
                  key={`second-${index}`}
                  className={`relative ${heightClass} ${widthClass} flex-shrink-0 ${gapClass}`}
                  onDragStart={handleDragStart}
                  draggable={false}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="140px"
                    unoptimized
                    className={`object-contain filter ${filterClass} opacity-90 transition-all duration-300 pointer-events-none`}
                    draggable={false}
                  />
                </div>
              )
            })}
            {/* Espace pour simuler le défilement */}
            <div className="w-8 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoMarquee
