'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Play, Calendar } from 'lucide-react'
import { useState } from 'react'

type FilmCardProps = {
  href: string
  title: string
  cover?: string
  synopsis?: string
  duree?: string
  annee?: string
  vimeoId?: string
  isHero?: boolean
}

export default function FilmCard({ 
  href, 
  title, 
  cover, 
  synopsis, 
  duree,
  annee,
  vimeoId,
  isHero = false
}: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (isHero) {
    return (
      <Link href={href} className="group block">
        <article 
          className="relative overflow-hidden bg-black rounded-2xl shadow-2xl transition-all duration-700 ease-out group-hover:shadow-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-[16/9] relative overflow-hidden">
            {/* Image de fond */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105" 
              style={{ 
                backgroundImage: cover ? `url(${cover})` : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
              }}
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700"></div>
            
            {/* Ligne décorative supérieure */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            {/* Ligne décorative animée */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]"></div>

            {/* Contenu */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col justify-end">
              <div className="max-w-3xl">
                {/* Métadonnées */}
                <div className="flex items-center gap-4 text-white/80 text-sm mb-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  {duree && (
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <Clock className="w-4 h-4" />
                      {duree}
                    </span>
                  )}
                  {annee && (
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <Calendar className="w-4 h-4" />
                      {annee}
                    </span>
                  )}
                  {vimeoId && (
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Play className="w-4 h-4" />
                      Voir le film
                    </span>
                  )}
                </div>

                {/* Titre */}
                <h3 
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-5 leading-none tracking-tight"
                  style={{
                    fontFamily: 'var(--font-andalemo), sans-serif',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {title}
                </h3>

                {/* Ligne séparatrice */}
                <div className="h-[2px] bg-white/20 mb-5 overflow-hidden rounded-full max-w-md">
                  <div 
                    className="h-full bg-white transition-all duration-700 ease-out"
                    style={{
                      width: isHovered ? '100%' : '60%',
                    }}
                  ></div>
                </div>

                {/* Synopsis */}
                {synopsis && (
                  <p className="text-white/85 text-lg md:text-xl lg:text-2xl mb-8 line-clamp-2 leading-relaxed max-w-2xl">
                    {synopsis}
                  </p>
                )}

                {/* CTA */}
                <div className="inline-flex items-center gap-3 text-white font-medium text-base md:text-lg uppercase tracking-wider transition-all duration-500">
                  <span className="transition-all duration-300 group-hover:tracking-widest">Découvrir</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-[2px] bg-white transition-all duration-500"
                      style={{
                        width: isHovered ? '56px' : '32px',
                      }}
                    ></div>
                    <svg 
                      className="w-6 h-6 transition-transform duration-500" 
                      style={{
                        transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                      }}
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden bg-black rounded-xl shadow-lg transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl">
        <div className="aspect-video relative overflow-hidden">
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110" 
            style={{ 
              backgroundImage: cover ? `url(${cover})` : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
          
          {/* Ligne décorative en haut */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badge de lecture si Vimeo disponible */}
          {vimeoId && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <Play className="w-3 h-3" />
              Voir
            </div>
          )}
          
          {/* Contenu */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-end">
            {/* Métadonnées */}
            <div className="flex items-center gap-3 text-white/80 text-xs mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {duree && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Clock className="w-3 h-3" />
                  {duree}
                </span>
              )}
              {annee && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Calendar className="w-3 h-3" />
                  {annee}
                </span>
              )}
            </div>

            {/* Titre */}
            <h3 
              className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2 mb-3 transition-colors duration-300" 
              style={{
                fontFamily: 'var(--font-andalemo), sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h3>

            {/* Ligne décorative qui s'étend au hover */}
            <div className="h-[2px] bg-white/20 overflow-hidden rounded-full">
              <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
