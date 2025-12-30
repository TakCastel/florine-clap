'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, Play } from 'lucide-react'
import { useState } from 'react'
import CtaLink from '@/components/CtaLink'

export type ContentCardProps = {
  href: string
  title: string
  imageSrc?: string
  description?: string
  date?: string
  duration?: string
  category?: string
  theme: 'films' | 'mediations' | 'actus' | 'videos-art'
  ctaLabel?: string
  showPlayBadge?: boolean
  className?: string
}

export default function ContentCard({
  href,
  title,
  imageSrc,
  description,
  date,
  duration,
  category,
  theme,
  ctaLabel = 'Découvrir',
  showPlayBadge = false,
  className = ''
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Détermination des couleurs selon le thème - tout en noir et blanc
  const getThemeColorClass = () => {
    // Tous les thèmes utilisent maintenant du noir
    return 'bg-black'
  }

  // Style pour l'overlay couleur
  const overlayColorClass = getThemeColorClass()

  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <article 
        className="relative w-full h-full overflow-hidden bg-gray-900 cursor-pointer min-h-[350px] md:min-h-[400px] transition-all duration-500 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. IMAGE DE FOND */}
        <div className="absolute inset-0 z-0">
          {imageSrc ? (
            <div className="relative w-full h-full">
               <Image 
                src={imageSrc} 
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-500 ease-out ${isHovered ? 'opacity-20' : 'opacity-100'}`}
                priority={false}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-white/20">Sans image</span>
            </div>
          )}
        </div>
        
        {/* 2. OVERLAY COULEUR THEME */}
        <div 
          className={`absolute inset-0 ${overlayColorClass} z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-85' : 'opacity-0'}`} 
        />
        <div 
          className={`absolute inset-0 ${overlayColorClass} mix-blend-screen z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-50' : 'opacity-0'}`} 
        />
        
        {/* 3. Overlay sombre par défaut */}
        <div 
          className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
        />
        
        {/* 4. Gradient bas pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />
        
        {/* Badge de catégorie ou Play */}
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          {showPlayBadge && (
            <div className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Voir</span>
            </div>
          )}
          {category && (
            <div className="bg-black/50 backdrop-blur-xl text-white/90 border border-white/20 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider">
              {category}
            </div>
          )}
        </div>
        
        {/* 5. CONTENU */}
        <div className="absolute inset-0 z-30 p-8 flex flex-col justify-end">
          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs mb-4 transition-opacity duration-300">
            {duration && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
            )}
          </div>

          {/* Titre */}
          <h3 
            className="heading-subtitle text-white leading-tight line-clamp-2 mb-2 transition-colors duration-300 group-hover:scale-[1.02] origin-left"
          >
            {title}
          </h3>

          {/* Ligne décorative */}
          <div className="h-[3px] bg-white/40 overflow-hidden rounded-full w-16 group-hover:w-full transition-all duration-500 ease-out mb-4"></div>
          
          {/* Description (optionnelle) */}
          {description && (
            <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 mb-2">
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          )}
          
          {/* CTA toujours visible */}
          <div className="mt-2">
            <CtaLink
              label={ctaLabel}
              tone="light"
              isActive={isHovered}
              as="span"
            />
          </div>
        </div>
        
        {/* Bordure fine au survol */}
        <div className="absolute inset-0 border-[2px] border-white/0 transition-all duration-500 z-30 pointer-events-none group-hover:border-white/30 group-hover:inset-2" />
      </article>
    </Link>
  )
}
