'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, Play } from 'lucide-react'
import { useState } from 'react'
import CtaLink from '@/components/CtaLink'

type ImmersiveFilmCardProps = {
  href: string
  title: string
  cover?: string
  synopsis?: string
  duree?: string
  annee?: string
  vimeoId?: string
  className?: string
}

export default function ImmersiveFilmCard({
  href,
  title,
  cover,
  synopsis,
  duree,
  annee,
  vimeoId,
  className = ''
}: ImmersiveFilmCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Thème Film forcé
  const overlayColorClass = 'bg-theme-films'

  return (
    <Link href={href} className={`group block w-full ${className}`}>
      <article 
        // Ajout de transform-gpu et isolation-isolate pour forcer le compositing layer
        className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-theme-cream cursor-pointer rounded-3xl md:rounded-[2rem] transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-black/40 transform-gpu isolation-isolate"
        style={{
          WebkitMaskImage: '-webkit-radial-gradient(white, black)', // Fix Safari border-radius clipping
          maskImage: 'radial-gradient(white, black)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Bordure fusionnée directement ici pour éviter le décalage */}
        <div className="absolute inset-0 border-[2px] border-white/0 transition-colors duration-500 z-40 pointer-events-none group-hover:border-white/30 rounded-3xl md:rounded-[2rem]" />

        {/* 1. IMAGE DE FOND */}
        <div className="absolute inset-0 z-0">
          {cover ? (
            <div className="relative w-full h-full">
               <Image 
                src={cover} 
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className={`object-cover transition-opacity duration-500 ease-out ${isHovered ? 'opacity-60' : 'opacity-100'}`}
                priority
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-white/10 font-mono text-6xl uppercase tracking-tighter">
                Film
              </div>
            </div>
          )}
        </div>
        
        {/* 2. OVERLAY COULEUR THEME (Gradient Rouge Film étendu) */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-theme-films from-10% via-theme-films/40 to-transparent z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-90' : 'opacity-0'}`} 
        />
        
        {/* 3. Overlay sombre par défaut */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
        />
        
        {/* Badge Play en haut à droite (spécifique Film) */}
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          {vimeoId && (
            <div className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-500 ease-in-out group-hover:bg-white group-hover:text-theme-films group-hover:scale-110 shadow-lg">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Bande-annonce</span>
            </div>
          )}
        </div>
        
        {/* 5. CONTENU */}
        <div className="absolute inset-0 z-30 p-8 md:p-12 flex flex-col justify-end">
          {/* Métadonnées sans animation de mouvement */}
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs mb-6 transition-opacity duration-500 ease-in-out">
            {annee && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <Calendar className="w-3.5 h-3.5" />
                {annee}
              </span>
            )}
            {duree && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <Clock className="w-3.5 h-3.5" />
                {duree}
              </span>
            )}
          </div>

          {/* Titre */}
          <h3 
            className="heading-display text-3xl md:text-5xl text-white leading-tight mb-4 transition-transform duration-500 ease-in-out group-hover:translate-x-2 origin-left"
          >
            {title}
          </h3>

          {/* Ligne décorative */}
          <div className="h-[3px] bg-theme-film overflow-hidden rounded-full w-16 group-hover:w-32 group-hover:bg-white transition-all duration-500 ease-in-out mb-6 shadow-lg"></div>
          
          {/* Description (optionnelle) */}
          {synopsis && (
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? 'max-h-[200px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <p className="text-white/90 text-base md:text-lg leading-relaxed line-clamp-3 font-light max-w-2xl">
                {synopsis}
              </p>
            </div>
          )}
          
          {/* CTA toujours visible */}
          <div className="mt-2">
            <CtaLink
              label={vimeoId ? "Regarder le film" : "En savoir plus"}
              tone="light"
              isActive={isHovered}
              as="span"
              className="text-lg"
            />
          </div>
        </div>
        
        {/* Bordure fine fixe - Pas de inset dynamique - Supprimée car intégrée en haut */}
      </article>
    </Link>
  )
}
