'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Blur placeholder générique (10x10px base64)
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

// Fonction pour extraire le texte du markdown/HTML et le limiter
const truncateText = (text: string | undefined, maxLength: number = 200): string | undefined => {
  if (!text) return undefined
  
  // Enlever le markdown et les balises HTML
  const cleanText = text
    .replace(/^#+\s+/gm, '') // Enlever les titres markdown
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Enlever les liens markdown
    .replace(/[#*_`\[\]()]/g, '') // Enlever les caractères markdown
    .replace(/<[^>]*>/g, '') // Enlever les balises HTML
    .replace(/\n+/g, ' ') // Remplacer les sauts de ligne par des espaces
    .trim()
  
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  // Tronquer à la dernière espace avant maxLength pour éviter de couper un mot
  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const finalText = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated
  
  return finalText + '...'
}

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
  // Sur mobile, on enlève complètement le skew pour garder les images droites
  const imageTransform = isMobile
    ? 'none'
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
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div 
                className={`relative aspect-[4/3] bg-gray-200 ${isMobile ? 'overflow-visible px-3' : 'overflow-hidden'}`}
                style={{ 
                  transform: imageTransform,
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 font-mono text-xs uppercase">
                    Image non disponible
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            {/* Titre */}
            <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-4 md:mb-6 group-hover:text-black/80 transition-colors">
              {title}
            </h3>

            {/* Synopsis */}
            {synopsis && (
              <p className="text-base leading-relaxed font-normal text-black/70 mb-6 md:mb-8 line-clamp-3 md:line-clamp-4">
                {truncateText(synopsis, 200)}
              </p>
            )}

            {/* En savoir plus */}
            <div className="inline-flex items-center gap-2 md:gap-3 text-xs font-medium uppercase tracking-wide text-black group-hover:text-black/80 transition-colors">
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

