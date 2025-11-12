'use client'

import { useState, useEffect, useRef } from 'react'

export default function BioSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
    setMousePosition({ x, y })
  }

  return (
    <section 
      ref={sectionRef}
      id="bio-section" 
      className="w-full min-h-screen bg-theme-cream flex items-center justify-center py-24 md:py-32 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Image avec effet sophistiqué */}
          <div 
            className="w-full lg:w-5/12 relative group"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            {/* Image principale */}
            <div className="relative overflow-hidden">
              <div 
                className="relative overflow-hidden transition-transform duration-700 ease-out"
                style={{
                  clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
                }}
              >
                <img 
                  src="https://picsum.photos/800/1200?random=5" 
                  alt="Florine Clap - Portrait"
                  className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                  }}
                />
                {/* Overlay coloré subtil */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
              </div>

              {/* Ligne décorative animée */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
          
          {/* Contenu texte */}
          <div className="w-full lg:w-7/12 relative">
            {/* Titre avec animation */}
            <div 
              className="overflow-hidden mb-12"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
              }}
            >
              <h3 
                className="text-black font-bold text-6xl leading-tight tracking-tighter mb-4"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.05em',
                }}
              >
                Qui suis-je ?
              </h3>
              
              {/* Ligne de séparation animée */}
              <div className="h-[2px] bg-black/20 w-full max-w-xs overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? '100%' : '0%',
                    transitionDelay: '0.6s',
                  }}
                ></div>
              </div>
            </div>
            
            {/* Texte bio avec animations séquentielles */}
            <div className="space-y-8 text-black/85 text-lg md:text-xl leading-relaxed">
              <p
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
                }}
              >
                Née à <span className="text-black font-medium">Avignon en 1988</span>, je me passionne très tôt pour le théâtre et le cinéma. 
                Diplômée en esthétique et pratique du cinéma à l'université Paris I Panthéon-Sorbonne.
              </p>
              
              <p
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s',
                }}
              >
                Ma filmographie révèle un intérêt renouvelé pour le <span className="text-black font-medium">cinéma, le théâtre et la danse</span>, 
                m'ayant menée de l'Académie du spectacle équestre de Bartabas à la réalisation de 
                documentaires d'art et sur l'art.
              </p>
              
              <p
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 1s, transform 0.8s ease-out 1s',
                }}
              >
                Mes films explorent des figures atypiques et des structures associatives, 
                témoignant d'une <span className="text-black font-medium">sensibilité sociale et artistique</span> qui m'oriente aujourd'hui 
                vers la fiction et le docu-fiction.
              </p>
            </div>
            
            {/* Bouton CTA sophistiqué */}
            <div 
              className="mt-12"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 1.2s, transform 0.8s ease-out 1.2s',
              }}
            >
              <a 
                href="/bio" 
                className="group inline-flex items-center gap-4 text-black font-medium text-lg md:text-xl uppercase tracking-wider transition-all duration-500"
              >
                <span className="transition-all duration-300 group-hover:tracking-widest">
                  En savoir plus
                </span>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="h-[2px] bg-black transition-all duration-500 group-hover:w-16"
                    style={{ width: '32px' }}
                  ></div>
                  <svg 
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de brillance qui suit la souris */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle 800px at ${50 + (mousePosition.x / 30) * 100}% ${50 + (mousePosition.y / 30) * 100}%, rgba(0,0,0,0.05) 0%, transparent 70%)`,
        }}
      ></div>
    </section>
  )
}