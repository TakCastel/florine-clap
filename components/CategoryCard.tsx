'use client'

import { useState } from 'react'

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
  bgColor,
  hoverBgColor,
  textColor,
  linkColor,
  hoverLinkColor,
  underlineClass,
  className,
  style
}: CategoryCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }

  return (
    <div 
      className="group relative overflow-hidden w-full h-full flex flex-col cursor-pointer"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container principal avec clip-path animé */}
      <div 
        className="absolute inset-0 transition-all duration-[800ms] ease-out"
        style={{
          clipPath: isHovered 
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
            : 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
        }}
      >
        {/* Image de fond avec parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-[600ms] ease-out scale-110"
          style={{
            transform: isHovered 
              ? `scale(1.15) translate(${mousePosition.x}px, ${mousePosition.y}px)` 
              : 'scale(1.1)',
          }}
        >
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className={`w-full h-full object-cover ${
              theme === 'films' ? 'filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]' :
              theme === 'mediations' ? 'filter-[sepia(10%)_saturate(120%)_hue-rotate(200deg)_brightness(0.7)]' :
              theme === 'actus' ? 'filter-[sepia(30%)_saturate(180%)_hue-rotate(15deg)_brightness(0.95)]' :
              theme === 'videos-art' ? 'filter-[sepia(0%)_saturate(100%)_brightness(0.8)]' :
              ''
            }`}
          />
          {/* Overlay coloré avec teinte forte - plus visible pour Films comme Actualités */}
          <div 
            className={`absolute inset-0 ${bgColor.replace('/85', '')} transition-all duration-700`}
            style={{
              opacity: theme === 'films' ? (isHovered ? 0.75 : 0.80) : theme === 'actus' ? (isHovered ? 0.70 : 0.75) : theme === 'videos-art' ? (isHovered ? 0.75 : 0.80) : (isHovered ? 0.65 : 0.75)
            }}
          ></div>
          {/* Overlay avec gradient créatif - très réduit pour Films et Actualités pour laisser voir la couleur */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent transition-opacity duration-700"
            style={{
              opacity: theme === 'films' || theme === 'actus' || theme === 'videos-art' ? 0.1 : 1
            }}
          ></div>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            style={{
              opacity: theme === 'films' || theme === 'actus' || theme === 'videos-art' ? 0.2 : 1
            }}
          ></div>
        </div>
      </div>

      {/* Ligne décorative animée */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out"></div>
      
      {/* Contenu */}
      <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
        {/* Cercle interactif en haut */}
        <div className="flex justify-end items-start">
          {/* Cercle interactif */}
          <div 
            className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:rotate-90"
            style={{
              transform: `rotate(${mousePosition.x * 2}deg)`,
            }}
          >
            <svg 
              className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </div>
        </div>

        {/* Titre principal avec effet split */}
        <div className="mt-auto">
          <div className="overflow-hidden mb-4 pb-2">
            <h3 
              className="text-white font-bold text-6xl leading-tight tracking-tighter transition-transform duration-700 ease-out"
              style={{
                fontFamily: 'var(--font-andalemo), sans-serif',
                transform: isHovered ? 'translateY(0)' : 'translateY(10%)',
                letterSpacing: '-0.05em',
              }}
            >
              {title}
            </h3>
          </div>
          
          {/* Ligne de séparation animée */}
          <div className="h-[2px] bg-white/20 mb-6 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-700 ease-out"
              style={{
                width: isHovered ? '100%' : '0%',
              }}
            ></div>
          </div>

          {/* Description avec animation */}
          <div 
            className="overflow-hidden transition-all duration-500"
            style={{
              maxHeight: isHovered ? '200px' : '0px',
              opacity: isHovered ? 1 : 0,
            }}
          >
            <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6" style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'transform 0.6s ease-out 0.1s',
            }}>
              {description}
            </p>
          </div>

          {/* Call to action */}
          <div className="flex items-center gap-3 text-white font-medium text-sm md:text-base tracking-wide">
            <span className="uppercase transition-all duration-300 group-hover:tracking-wider">
              {linkText}
            </span>
            <div className="flex items-center gap-1">
              <div 
                className="w-12 h-[2px] bg-white transition-all duration-500"
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

      {/* Effet de brillance au hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Lien cliquable */}
      <a 
        href={href} 
        className="absolute inset-0 z-20"
        aria-label={`Aller à ${title}`}
      />
    </div>
  )
}
