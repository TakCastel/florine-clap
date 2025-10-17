'use client'

import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30
    const y = (e.clientY / window.innerHeight - 0.5) * 30
    setMousePosition({ x, y })
  }

  return (
    <section 
      id="hero-section" 
      className="w-full h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="relative h-full overflow-hidden">
        {/* Vidéo de fond */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/videos/example.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          {/* Overlay sombre avec gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-10">
          
          {/* Ligne décorative supérieure */}
          <div className="absolute top-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          {/* Éléments décoratifs animés - très subtils */}
          <div 
            className="absolute top-24 left-12 w-16 h-16 border border-white/10 rounded-full transition-transform duration-1000 ease-out opacity-30"
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-32 right-16 w-24 h-24 border border-white/10 transition-transform duration-1000 ease-out opacity-30"
            style={{
              transform: `rotate(45deg) translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px)`,
            }}
          ></div>

          {/* Contenu central */}
          <div className="text-center max-w-6xl mx-auto">
            
            {/* Citation */}
            <div 
              className="overflow-hidden max-w-4xl mx-auto"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1.2s ease-out 0.4s, transform 1.2s ease-out 0.4s',
              }}
            >
              <blockquote className="relative">
                {/* Guillemet d'ouverture décoratif */}
                <span className="absolute -top-4 -left-4 md:-left-8 text-6xl md:text-8xl text-white/10 font-serif leading-none">"</span>
                
                <p className="text-white/85 text-xl md:text-2xl lg:text-3xl mx-auto leading-relaxed font-light italic px-8 md:px-12">
                  Si on ouvre les yeux, on voit ce qu'on regarde. Si on ouvre le cœur, on voit ce qui nous regarde
                </p>
                
                {/* Guillemet de fermeture décoratif */}
                <span className="absolute -bottom-8 -right-4 md:-right-8 text-6xl md:text-8xl text-white/10 font-serif leading-none">"</span>
              </blockquote>
              
              {/* Auteur de la citation */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-white/30"></div>
                <p className="text-white/60 text-sm md:text-base uppercase tracking-[0.3em] font-medium">
                  Agnès Varda
                </p>
                <div className="h-[1px] w-12 bg-white/30"></div>
              </div>
            </div>
          </div>

          {/* Bouton de navigation en bas avec effet parallax */}
          <div 
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: `translateX(-50%) translateY(${isLoaded ? 0 : 20}px)`,
              transition: 'opacity 1s ease-out 1s, transform 1s ease-out 1s',
            }}
          >
            <button 
              onClick={() => {
                const categoriesSection = document.getElementById('categories-section')
                if (categoriesSection) {
                  categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="group relative inline-flex flex-col items-center gap-3"
            >
              {/* Texte */}
              <span className="text-white/70 text-sm uppercase tracking-widest font-medium group-hover:text-white transition-colors duration-300">
                Découvrir
              </span>
              
              {/* Cercle avec flèche animée */}
              <div className="relative w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:scale-110">
                <svg 
                  className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-y-1" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                
                {/* Cercle animé qui pulse */}
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-0 group-hover:opacity-100"></div>
              </div>
            </button>
          </div>

          {/* Ligne décorative inférieure */}
          <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Effet de brillance qui suit la souris */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${50 + (mousePosition.x / 30) * 100}% ${50 + (mousePosition.y / 30) * 100}%, rgba(255,255,255,0.1) 0%, transparent 100%)`,
          }}
        ></div>
      </div>
    </section>
  )
}
