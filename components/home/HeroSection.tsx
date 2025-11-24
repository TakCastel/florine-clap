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
            src="http://51.77.245.224/videos/INTRO_VIDEO_FLORINE_CLAP.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>

        {/* Contenu principal */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-10">
          
          {/* Ligne décorative supérieure - 57px du bord */}
          <div className="absolute top-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Bouton de navigation en bas avec effet parallax */}
          <div 
            className="absolute bottom-[121px] left-1/2 transform -translate-x-1/2"
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

          {/* Ligne décorative inférieure - 57px du bord */}
          <div className="absolute bottom-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
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
