'use client'

import Image from 'next/image'
import { useState } from 'react'
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

  // Extraction de la couleur de base pour l'overlay (simplification des classes Tailwind)
  const getOverlayColor = () => {
    switch (theme) {
      case 'films': return 'bg-theme-films'
      case 'mediations': return 'bg-theme-mediations'
      case 'actus': return 'bg-theme-actus'
      case 'videos-art': return 'bg-black'
      default: return 'bg-black'
    }
  }

  return (
    <div 
      className="group relative w-full h-full overflow-hidden bg-gray-900 cursor-pointer rounded-3xl md:rounded-[2rem] transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-black/40 flex"
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
            className={`object-cover transition-opacity duration-500 ease-out ${isHovered ? 'opacity-20' : 'opacity-100'}`}
            priority={false}
          />
        )}
      </div>

      {/* 2. OVERLAY COULEUR THEME - Légèrement transparent pour voir l'image */}
      <div 
        className={`absolute inset-0 ${getOverlayColor()} z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-85' : 'opacity-0'}`} 
      />
      
      {/* 3. Overlay sombre par défaut (Repos) */}
      <div 
        className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
      />

      {/* 4. OVERLAY DE BASE - Gradient très atténué pour lisibilité du texte en bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />

      {/* 5. CONTENU */}
      <div className="absolute inset-0 z-30 p-8 md:p-10 flex flex-col justify-between">
        
        {/* En-tête: Flèche harmonisée (Style Hero/BackToTop) */}
        <div className="flex justify-end items-start">
           <div className="relative w-14 h-14 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-xl flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:scale-110 group-hover:bg-white/20 shadow-lg">
              <svg 
                className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
           </div>
        </div>

        {/* Centre: Titre Principal */}
        <div className="mt-auto mb-4 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <h3 className="text-[clamp(2rem,4vw,3.5rem)] font-display text-white font-bold tracking-tight leading-[1.1] mb-3 drop-shadow-lg">
            {title}
          </h3>
          
          {/* Ligne animée */}
          <div className="h-[3px] bg-white w-16 transition-all duration-500 ease-out group-hover:w-full opacity-90 rounded-full shadow-lg" />
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
      
      {/* Bordure fine au survol */}
      <div className="absolute inset-0 border-[2px] border-white/0 transition-all duration-500 z-30 pointer-events-none group-hover:border-white/30 group-hover:inset-2 rounded-3xl md:rounded-[2rem]" />
    </div>
  )
}
