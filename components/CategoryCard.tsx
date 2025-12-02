'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import CtaLink from '@/components/CtaLink'

interface CategoryCardProps {
  href: string
  title: string
  description: string
  linkText: string
  imageSrc: string
  imageAlt: string
  theme?: 'films' | 'mediations' | 'actus' | 'videos-art'
  bgColor: string
  hoverBgColor: string
  textColor: string
  linkColor: string
  hoverLinkColor: string
  underlineClass: string
  className?: string
  style?: React.CSSProperties
}

export default function CategoryCard({
  href,
  title,
  description,
  linkText,
  imageSrc,
  imageAlt,
  theme,
  bgColor, // On utilisera les couleurs du thème pour l'overlay
  style
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div 
      className="group relative w-full h-full overflow-hidden bg-gray-900 cursor-pointer transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-black/40 flex"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. IMAGE DE FOND - Optimisée pour performance */}
      <div className="absolute inset-0 z-0">
        {imageSrc && (
          <Image 
            src={imageSrc} 
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-opacity duration-500 ease-out"
            style={{ filter: 'grayscale(100%) brightness(0.75)' }}
            priority={false}
          />
        )}
      </div>
      
      {/* 2. Overlay sombre léger - Desktop seulement */}
      <div 
        className="absolute inset-0 bg-black/15 z-10 transition-opacity duration-500 ease-out hidden md:block" 
      />

      {/* 3. Aplat noir au survol - Desktop seulement */}
      <div 
        className="absolute inset-0 bg-black z-10 transition-opacity duration-500 ease-out hidden md:block opacity-0 group-hover:opacity-60" 
      />

      {/* 4. OVERLAY MOBILE - Overlay sombre uniforme pour lisibilité */}
      <div className={`absolute inset-0 bg-black/20 z-20 pointer-events-none md:hidden`} />

      {/* 5. OVERLAY DE BASE DESKTOP - Gradient très atténué pour lisibilité du texte en bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none hidden md:block" />

      {/* CONTENU MOBILE - Design normal : titre en haut */}
      <div className="absolute inset-0 z-30 p-5 md:hidden flex flex-col">
        {/* En-tête avec titre */}
        <div className="flex items-start justify-between gap-3">
          {/* Titre en haut à gauche */}
          <h3 className="font-display text-white font-bold tracking-tight leading-[1.1] text-xl flex-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
        </div>
      </div>

      {/* CONTENU DESKTOP - Design complet */}
      <div className="absolute inset-0 z-30 p-10 hidden md:flex flex-col justify-between">
        
        {/* Centre: Titre Principal */}
        <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 mb-4 transition-all duration-500">
          <h3 className="heading-main text-white tracking-tight mb-3 drop-shadow-lg">
            {title}
          </h3>
          
          {/* Ligne animée */}
          <div className="h-[3px] bg-white w-16 group-hover:w-full opacity-90 transition-all duration-500 ease-out rounded-full shadow-lg" />
        </div>

        {/* Bas: Description (Apparaît au survol) */}
        <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100">
          <p className="text-white/90 text-sm md:text-base font-sans leading-relaxed mb-4 pt-4 line-clamp-2 min-h-[4rem]">
            {description}
          </p>
        </div>

        {/* CTA toujours visible */}
        <div className="mt-2">
          <CtaLink
            href={href}
            label={linkText}
            tone="light"
            isActive={isHovered}
          />
        </div>
      </div>

      {/* Lien global */}
      <a href={href} className="absolute inset-0 z-40" aria-label={title} />
    </div>
  )
}
