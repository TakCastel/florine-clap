'use client'

import { useState, useEffect, useRef } from 'react'
import { bioPhoto } from '@/lib/images'

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
        <div className="relative">
          
          {/* Image avec effet sophistiqué - positionnée en haut à gauche */}
          <div 
            className="w-full md:w-2/5 lg:w-2/5 xl:w-2/5 relative group float-left mr-8 md:mr-12 mb-6 md:mb-8"
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
                  src={bioPhoto} 
                  alt="Florine Clap - Portrait"
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                    filter: 'contrast(1.05) brightness(1.02)',
                    imageRendering: 'auto',
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
          
          {/* Contenu texte avec titre intégré - le texte coule autour de l'image */}
          <div className="relative">
            {/* Titre avec animation - à côté de l'image */}
            <div 
              className="overflow-hidden mb-8"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
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
              <div className="h-[1px] bg-black/20 w-full max-w-[200px] overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? '100%' : '0%',
                    transitionDelay: '0.5s',
                  }}
                ></div>
              </div>
            </div>
            
            {/* Premiers paragraphes à côté de l'image */}
            <div className="space-y-5 text-black/85 text-sm md:text-base leading-relaxed">
              {/* Membres d'associations */}
              <div
                className="mb-5 pb-5 border-b border-black/10"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s',
                }}
              >
                <p className="text-xs md:text-sm text-black/70 uppercase tracking-wider font-medium">
                  Membre de l'AARSE - Membre d'Addoc
                </p>
              </div>

              {/* Introduction */}
              <p
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
                }}
              >
                Née à <span className="text-black font-medium">Avignon en 1988</span>, Florine Clap se passionne dès son enfance pour le théâtre et le cinéma. Se construisant depuis toujours dans une approche transversale des arts, elle accompagne de nombreux artistes plasticiens, chorégraphes, auteur·ices, architectes ou institutions culturelles avec son regard et sa caméra.
              </p>
              
              {/* Parcours cinématographique - premier paragraphe */}
              <p
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out 0.7s, transform 0.8s ease-out 0.7s',
                }}
              >
                Depuis 2013, elle réalise des films documentaires abordant des thématiques artistiques et sociales. Son premier long métrage documentaire, <span className="text-black font-medium italic">Sous le pont d'Avignon</span>, produit par les productions Image Mouvement & Avril Films, a été diffusé par le cinéma d'art et d'essai avignonnais Utopia en 2014. En parallèle, elle travaille deux ans, entre 2012 et 2014, comme assistante de la coach d'acteurs Tiffany Stern au studio l'Actors Factory. Elle tourne son deuxième film documentaire sur le studio et la direction d'acteurs de Tiffany Stern intitulé <span className="text-black font-medium italic">PLAY</span>, produit par Avril Films.
              </p>
            </div>
          </div>
          
          {/* Paragraphes suivants qui passent en dessous de l'image */}
          <div className="clear-both space-y-5 text-black/85 text-sm md:text-base leading-relaxed mt-8">
            <p
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s',
              }}
            >
              En 2015, elle réalise <span className="text-black font-medium italic">Violoncelles, vibrez !</span> produit par la Fondation Louis Vuitton & Caméra Lucida, diffusé en février 2016 par France 2 & Culture Box. En 2022, elle tourne un documentaire-fiction sur le Festival d'Avignon, <span className="text-black font-medium italic">Père Chave, ma vie au Festival d'Avignon</span>, produit par le CFRT, Jour du Seigneur et diffusé sur France 2 ainsi qu'aux territoires cinématographiques du Festival d'Avignon (en juillet 2022).
            </p>
            
            <p
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 0.9s, transform 0.8s ease-out 0.9s',
              }}
            >
              Parallèlement, la réalisatrice signe des formes documentaires courtes destinées à une diffusion en festivals, comme <span className="text-black font-medium italic">Quand je vous caresse</span> (2021), le portrait d'une aide-soignante, <span className="text-black font-medium italic">Objets Trouvés</span> (2024), le portrait cinématographique d'une tapissière en siège, tous deux produits par Vert de Nuit et diffusés en festivals. Actuellement, Florine Clap est en cours d'écriture d'un film documentaire réalisant le portrait de trois enfants polyhandicapés de l'EEAP Petit Jardin, portant sur leur rapport à leur corps et à la danse ainsi qu'un documentaire sur le procès des viols de Mazan, raconté depuis la rue, depuis son quartier.
            </p>
            
            {/* Médiations */}
            <p
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 1s, transform 0.8s ease-out 1s',
              }}
            >
              Par ailleurs, la réalisatrice anime des médiations cinématographiques pour le cinéma d'art et d'essai, Utopia d'Avignon, le Conservatoire à rayonnement régional du grand Avignon (2014 et 2020), CANOPÉ (réseau d'éducation à l'image), l'Institut de l'image d'Aix en Provence (pôle régional artistique et de formation au cinéma et à l'audiovisuel), l'Institut des métiers et de la communication audiovisuelle de Provence. La réalisatrice s'investit également dans des projets de médiations vidéo militantes et sociales avec l'association <span className="text-black font-medium">1,2,3 Soleil</span>, « pour un cinéma solidaire et inclusif » qui organise des tournages avec des publics fragilisés tels que des mineurs isolés sans papiers ou des résidents en EHPAD ou en IME.
            </p>
            
            {/* Bouton CTA sophistiqué */}
            <div 
              className="mt-8"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 1.1s, transform 0.8s ease-out 1.1s',
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
            
            {/* Citation Agnès Varda - au milieu */}
            <div
              className="mt-12 pt-8 mx-auto text-center max-w-2xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out 1.2s, transform 0.8s ease-out 1.2s',
              }}
            >
              <div className="relative">
                {/* Guillemets décoratifs */}
                <div className="absolute -top-4 -left-4 text-black/10 text-6xl md:text-7xl font-serif leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                  "
                </div>
                <blockquote className="text-black/80 italic text-lg md:text-xl leading-relaxed font-light relative z-10 pl-8">
                  Je suis curieuse.<br />
                  Je trouve tout intéressant.<br />
                  La vraie vie, la fausse vie.<br />
                  Les objets, les fleurs, les chats.<br />
                  Mais surtout les gens.
                </blockquote>
                <div className="mt-4 pt-4 border-t border-black/20">
                  <p className="text-black/60 text-sm md:text-base font-medium tracking-wide">
                    Agnès Varda
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clear float pour forcer le contenu suivant à passer en dessous */}
          <div className="clear-both"></div>
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