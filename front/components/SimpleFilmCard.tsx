'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type SimpleFilmCardProps = {
  href: string
  title: string
  cover?: string
  synopsis?: string
  imagePosition?: 'left' | 'right'
  className?: string
}

export default function SimpleFilmCard({
  href,
  title,
  cover,
  synopsis,
  imagePosition = 'left',
  className = ''
}: SimpleFilmCardProps) {
  const isImageLeft = imagePosition === 'left'
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Transformations adaptées au mobile
  // Sur mobile, on réduit le skew et on supprime le translateX pour éviter que l'image soit collée
  const imageTransform = isMobile
    ? (isImageLeft ? 'skewX(-1deg)' : 'skewX(1deg)')
    : (isImageLeft ? 'skewX(-3deg) translateX(-12px)' : 'skewX(3deg) translateX(12px)')

  return (
    <Link href={href} className={`group block w-full ${className}`}>
      <article className="relative w-full max-w-6xl mx-auto">
        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-8 lg:gap-12 items-start`}>
          {/* Image */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            {cover ? (
              <div 
                className={`relative ${isMobile ? 'overflow-visible px-3' : 'overflow-hidden'}`}
                style={{ 
                  transform: imageTransform,
                }}
              >
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div 
                className={`relative aspect-[4/3] bg-gray-200 ${isMobile ? 'overflow-visible px-3' : 'overflow-hidden'}`}
                style={{ 
                  transform: imageTransform,
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 font-mono text-sm uppercase">
                    Image non disponible
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            {/* Titre */}
            <h3 className="heading-main text-black mb-4 md:mb-6 group-hover:text-black/80 transition-colors">
              {title}
            </h3>

            {/* Synopsis */}
            {synopsis && (
              <p className="body-text text-black/70 mb-6 md:mb-8 line-clamp-3 md:line-clamp-4">
                {synopsis}
              </p>
            )}

            {/* En savoir plus */}
            <div className="inline-flex items-center gap-2 md:gap-3 text-sm md:text-base font-medium uppercase tracking-wide text-black group-hover:text-black/80 transition-colors">
              <span>En savoir plus</span>
              <div className="flex items-center gap-1">
                <div className="h-[2px] bg-black w-6 group-hover:w-12 transition-all duration-500"></div>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover:translate-x-0 -translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

