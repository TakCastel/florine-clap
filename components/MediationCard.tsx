'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

type MediationCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  date?: string | Date
  lieu?: string
}

export default function MediationCard({ 
  href, 
  title, 
  cover, 
  excerpt,
  date,
  lieu
}: MediationCardProps) {
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
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Partie image à gauche */}
            <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105 filter-[sepia(20%)_saturate(150%)_hue-rotate(200deg)_brightness(0.9)]" 
                style={{ 
                  backgroundImage: cover ? `url(${cover})` : 'linear-gradient(135deg, #26436C 0%, #1e3a5f 100%)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-theme-blue/30 to-transparent"></div>
            </div>

            {/* Partie texte avec fond couleur à droite */}
            <div className="relative w-full md:w-1/2 bg-theme-blue p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              {/* Ligne décorative supérieure */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              {/* Ligne décorative animée */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]"></div>

              <div className="max-w-2xl">
                {/* Métadonnées */}
                <div className="flex items-center gap-4 text-white/80 text-sm mb-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  {date && (
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <Calendar className="w-4 h-4" />
                      {new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  {lieu && (
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      {lieu}
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

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-white/85 text-lg md:text-xl lg:text-2xl mb-8 line-clamp-2 leading-relaxed">
                    {excerpt}
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
        </div>
      </article>
    </Link>
  )
}

