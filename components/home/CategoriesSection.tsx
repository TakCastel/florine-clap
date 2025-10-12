'use client'

import { useHover } from '@/contexts/HoverContext'
import ScrollIndicator from '@/components/ScrollIndicator'

export default function CategoriesSection() {
  const { forceHoverIndex, setForceHoverIndex } = useHover()
  
  const scrollToBio = () => {
    const bioSection = document.getElementById('bio-section')
    const container = document.querySelector('.scroll-container') as HTMLElement
    
    if (bioSection && container) {
      const elementTop = bioSection.offsetTop
      const headerHeight = 80 // Hauteur du header fixe
      const offsetPosition = elementTop - headerHeight
      
      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  return (
    <section id="categories-section" className="scroll-section w-full z-20" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Films - 1/3 de la page */}
        <a href="/films" className={`w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden group cursor-pointer transition-all duration-500 hover:w-full md:hover:w-1/2 ${forceHoverIndex === 0 ? 'w-full md:w-1/2' : ''}`}>
          <img 
            src="https://picsum.photos/800/1200?random=2" 
            alt="Decouvrir mes films"
            className="w-full h-full object-cover grayscale"
          />
          <div className={`absolute inset-0 bg-theme-blue/90 flex items-center justify-center group-hover:bg-theme-blue/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 0 ? 'bg-theme-blue/95' : ''}`}>
            <div className="text-center flex flex-col items-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-white mb-6 text-3xl md:text-6xl lg:text-8xl">
                  Films
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-opacity duration-500 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 ${forceHoverIndex === 0 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-white mb-8 text-xs md:text-lg lg:text-xl leading-relaxed">
                  Decouvrez mes creations cinematographiques, mes courts-metrages et mes projets artistiques
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-white/80 font-medium hover:text-white transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-base lg:text-lg">
                  Decouvrir →
                </span>
              </div>
            </div>
          </div>
        </a>
        
        {/* Mediations - 1/3 de la page */}
        <a 
          href="/mediations" 
          className={`w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden group cursor-pointer transition-all duration-500 hover:w-full md:hover:w-1/2 ${forceHoverIndex === 1 ? 'w-full md:w-1/2' : ''}`}
          onMouseLeave={() => {
            // Reinitialiser le hover force quand on quitte la carte
            if (forceHoverIndex === 1) {
              setForceHoverIndex(-1)
            }
          }}
        >
          <img 
            src="https://picsum.photos/800/1200?random=3" 
            alt="Decouvrir mes mediations"
            className="w-full h-full object-cover grayscale"
          />
          <div className={`absolute inset-0 bg-theme-grey/90 flex items-center justify-center group-hover:bg-theme-grey/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 1 ? 'bg-theme-grey/95' : ''}`}>
            <div className="text-center flex flex-col items-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-theme-blue mb-6 text-3xl md:text-6xl lg:text-8xl">
                  Mediations
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-opacity duration-500 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 ${forceHoverIndex === 1 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-theme-blue mb-8 text-xs md:text-lg lg:text-xl leading-relaxed">
                  Explorez mes mediations de mediation culturelle et mes formations pour tous publics
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-theme-blue/80 font-medium hover:text-theme-blue transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-blue after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-base lg:text-lg">
                  Explorer →
                </span>
              </div>
            </div>
          </div>
        </a>
        
        {/* Actualites - 1/3 de la page */}
        <a href="/actus" className={`w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden group cursor-pointer transition-all duration-500 hover:w-full md:hover:w-1/2 ${forceHoverIndex === 2 ? 'w-full md:w-1/2' : ''}`}>
          <img 
            src="https://picsum.photos/800/1200?random=4" 
            alt="Decouvrir mes actualites"
            className="w-full h-full object-cover grayscale"
          />
          <div className={`absolute inset-0 bg-theme-yellow/90 flex items-center justify-center group-hover:bg-theme-yellow/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 2 ? 'bg-theme-yellow/95' : ''}`}>
            <div className="text-center flex flex-col items-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-theme-dark mb-6 text-3xl md:text-6xl lg:text-8xl">
                  Actualites
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-opacity duration-500 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 ${forceHoverIndex === 2 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-theme-dark mb-8 text-xs md:text-lg lg:text-xl leading-relaxed">
                  Suivez mes dernieres actualites, evenements et projets en cours
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-theme-dark/80 font-medium hover:text-theme-dark transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-dark after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-base lg:text-lg">
                  Lire →
                </span>
              </div>
            </div>
          </div>
        </a>
        
        {/* Indicateur de scroll vers la bio */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <ScrollIndicator
            onClick={scrollToBio}
            ariaLabel="Aller a la section bio"
          />
        </div>
      </div>
    </section>
  )
}