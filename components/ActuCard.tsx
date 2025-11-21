'use client'

import Link from 'next/link'
import { useState } from 'react'

type ActuCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  date 
}: ActuCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={href} className="group block">
      <article 
        className="relative overflow-visible transition-all duration-700 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Container avec clip-path en biais */}
        <div 
          className="relative transition-all duration-[800ms] ease-out"
          style={{
            clipPath: isHovered 
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
              : 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
          }}
        >
          <div className="flex flex-col md:flex-row min-h-[300px]">
            {/* Partie image à gauche */}
            <div className="relative w-full md:w-1/2 h-[200px] md:h-auto overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110 filter-[sepia(30%)_saturate(180%)_hue-rotate(15deg)_brightness(0.95)]" 
                style={{ 
                  backgroundImage: cover ? `url(${cover})` : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-theme-actus/30 to-transparent"></div>
            </div>

            {/* Partie texte avec fond couleur à droite */}
            <div className="relative w-full md:w-1/2 bg-theme-actus p-5 md:p-6 flex flex-col justify-center">
              {/* Ligne décorative supérieure */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              {/* Ligne décorative animée */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]"></div>
              
              {/* Date */}
              <div className="flex items-center gap-2 text-white text-xs mb-2.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {new Date(date).toLocaleDateString('fr-FR')}
              </div>

              {/* Titre */}
              <h3 
                className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 mb-3 transition-colors duration-300" 
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h3>

              {/* Ligne décorative qui s'étend au hover */}
              <div className="h-[2px] bg-white/20 overflow-hidden rounded-full">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{
                    width: isHovered ? '100%' : '60%',
                  }}
                ></div>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-3 text-white font-medium text-sm md:text-base uppercase tracking-wider transition-all duration-500 mt-4">
                <span className="transition-all duration-300 group-hover:tracking-widest">Lire</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-[2px] bg-white transition-all duration-500"
                    style={{
                      width: isHovered ? '48px' : '24px',
                    }}
                  ></div>
                  <svg 
                    className="w-5 h-5 transition-transform duration-500" 
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
