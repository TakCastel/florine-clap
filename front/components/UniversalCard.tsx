'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import CtaLink from '@/components/CtaLink'
import { LucideIcon } from 'lucide-react'

export type CardMetaItem = {
  icon?: LucideIcon
  label: string
}

export type UniversalCardProps = {
  href: string
  title: string
  imageSrc?: string
  description?: string
  theme?: 'films' | 'mediations' | 'actus' | 'videos-art'
  meta?: CardMetaItem[]
  ctaLabel?: string
  badge?: { icon?: LucideIcon, label: string }
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto'
  className?: string
  isHero?: boolean
}

export default function UniversalCard({
  href,
  title,
  imageSrc,
  description,
  theme = 'films',
  meta = [],
  ctaLabel = 'Découvrir',
  badge,
  aspectRatio = 'video',
  className = '',
  isHero = false
}: UniversalCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Déterminer la classe de couleur en fonction du thème
  const getThemeColorClass = () => {
    switch (theme) {
      case 'films': return 'bg-theme-films'
      case 'mediations': return 'bg-theme-mediations'
      case 'actus': return 'bg-theme-actus'
      case 'videos-art': return 'bg-black'
      default: return 'bg-theme-films'
    }
  }

  // Déterminer le ratio d'aspect
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'video': return 'aspect-video'
      case 'square': return 'aspect-square'
      case 'portrait': return 'aspect-[3/4]'
      case 'auto': return ''
      default: return 'aspect-video'
    }
  }

  // Version Hero (split screen)
  if (isHero) {
    return (
      <Link href={href} className="group block">
        <article 
          className="relative overflow-hidden transition-all duration-700 ease-out bg-black rounded-3xl md:rounded-[2rem] group-hover:shadow-2xl group-hover:shadow-black/40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full min-h-[500px] flex flex-col md:flex-row">
            {/* Partie image à gauche */}
            <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
              <div className="absolute inset-0 z-0">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className={`object-cover transition-opacity duration-500 ease-out ${isHovered ? 'opacity-20 grayscale' : 'opacity-100 grayscale'}`}
                  />
                ) : (
                  <div className={`absolute inset-0 ${getThemeColorClass()} opacity-20`} />
                )}
              </div>
              
              {/* Overlay couleur thème */}
              <div 
                className={`absolute inset-0 ${getThemeColorClass()} z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-85' : 'opacity-0'}`} 
              />
              <div 
                className={`absolute inset-0 ${getThemeColorClass()} mix-blend-screen z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-50' : 'opacity-0'}`} 
              />
              
              {/* Overlay noir par défaut */}
              <div 
                className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
              />
            </div>

            {/* Partie texte avec fond couleur à droite */}
            <div className={`relative w-full md:w-1/2 ${getThemeColorClass()} p-8 md:p-12 lg:p-16 flex flex-col justify-center`}>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              <div className="max-w-2xl">
                {/* Métadonnées */}
                {meta.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/80 text-sm mb-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {meta.map((item, index) => (
                      <span key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 md:px-5 py-2.5 rounded-full border border-white/20 whitespace-nowrap shadow-lg">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Titre */}
                <h3 className="heading-light mb-5">
                  {title}
                </h3>

                {/* Ligne séparatrice */}
                <div className="h-[3px] bg-white/30 mb-5 overflow-hidden rounded-full max-w-md shadow-lg">
                  <div 
                    className="h-full bg-white transition-all duration-700 ease-out rounded-full"
                    style={{
                      width: isHovered ? '100%' : '60%',
                    }}
                  ></div>
                </div>

                {/* Description */}
                {description && (
                  <p className="body-text-light mb-8 line-clamp-2">
                    {description}
                  </p>
                )}

                <CtaLink
                  label={ctaLabel}
                  tone="light"
                  isActive={isHovered}
                  as="span"
                />
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // Version Card normale (style moderne)
  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <article 
        className={`relative w-full h-full overflow-hidden bg-gray-900 cursor-pointer ${getAspectRatioClass()} rounded-3xl md:rounded-[2rem] transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-black/40`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. IMAGE DE FOND */}
        <div className="absolute inset-0 z-0">
          {imageSrc ? (
            <Image 
              src={imageSrc} 
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 ease-out ${isHovered ? 'opacity-20' : 'opacity-100'}`}
              priority={false}
            />
          ) : (
            <div className={`absolute inset-0 ${getThemeColorClass()} opacity-20`} />
          )}
        </div>
        
        {/* 2. OVERLAY COULEUR THEME */}
        <div 
          className={`absolute inset-0 ${getThemeColorClass()} z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-85' : 'opacity-0'}`} 
        />
        <div 
          className={`absolute inset-0 ${getThemeColorClass()} mix-blend-screen z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-50' : 'opacity-0'}`} 
        />
        
        {/* 3. Overlay sombre par défaut */}
        <div 
          className={`absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
        />
        
        {/* 4. Gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />
        
        {/* Badge (ex: Voir Vimeo) - Toujours visible */}
        {badge && (
          <div className="absolute top-4 right-4 z-30 bg-white/10 backdrop-blur-xl text-white border border-white/20 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110 shadow-lg">
            {badge.icon && <badge.icon className="w-3.5 h-3.5" />}
            {badge.label}
          </div>
        )}
        
        {/* 5. CONTENU */}
        <div className="absolute inset-0 z-30 p-6 flex flex-col justify-end">
          {/* Métadonnées */}
          {meta.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs mb-3 transition-opacity duration-300">
              {meta.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  {item.label}
                </span>
              ))}
            </div>
          )}

          {/* Titre */}
          <h3 
            className="heading-subtitle text-white leading-tight line-clamp-2 mb-2 transition-colors duration-300 group-hover:scale-[1.02] origin-left"
          >
            {title}
          </h3>

          {/* Ligne décorative */}
          <div className="h-[3px] bg-white/40 overflow-hidden rounded-full w-16 group-hover:w-full transition-all duration-500 ease-out mb-4 shadow-lg"></div>
          
          {/* Description (si présente) */}
          {description && (
            <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 mb-2">
              <p className="text-white/90 text-sm line-clamp-2">
                {description}
              </p>
            </div>
          )}
          
          {/* CTA toujours visible */}
          <div className="mt-1">
            <CtaLink
              label={ctaLabel}
              tone="light"
              isActive={isHovered}
              as="span"
            />
          </div>
        </div>
        
        {/* Bordure fine au survol */}
        <div className="absolute inset-0 border-[2px] border-white/0 transition-all duration-500 z-30 pointer-events-none group-hover:border-white/30 group-hover:inset-2 rounded-2xl md:rounded-[1.5rem]" />
      </article>
    </Link>
  )
}
