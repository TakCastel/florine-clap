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
    <section id="categories-section" className="categories-section scroll-section w-full z-20 border-t-4 border-black" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Films - 1/3 de la page */}
        <a href="/films" className={`w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden group cursor-pointer transition-all duration-500 hover:w-full md:hover:w-1/2 ${forceHoverIndex === 0 ? 'w-full md:w-1/2' : ''}`}>
          <img 
            src="https://picsum.photos/800/1200?random=2" 
            alt="Decouvrir mes films"
            className="w-full h-full object-cover grayscale transition-none"
          />
          <div className={`absolute inset-0 bg-theme-blue/90 flex items-center justify-center group-hover:bg-theme-blue/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 0 ? 'bg-theme-blue/95' : ''}`}>
            <div className="text-center flex flex-col items-center justify-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-white mb-6 text-2xl md:text-4xl lg:text-6xl">
                  Films
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-all duration-700 text-center flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 touch:opacity-100 ${forceHoverIndex === 0 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-white mb-8 text-xs md:text-xs lg:text-base leading-relaxed text-center">
                  Découvrez mes créations cinématographiques, mes courts-métrages et mes projets artistiques
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-white/80 font-medium hover:text-white transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-xs lg:text-base">
                  Découvrir →
                </span>
              </div>
            </div>
          </div>
        </a>
        
        {/* Médiations - 1/3 de la page */}
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
            className="w-full h-full object-cover grayscale transition-none"
          />
          <div className={`absolute inset-0 bg-theme-beige/90 flex items-center justify-center group-hover:bg-theme-beige/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 1 ? 'bg-theme-beige/95' : ''}`}>
            <div className="text-center flex flex-col items-center justify-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-theme-blue mb-6 text-2xl md:text-4xl lg:text-6xl">
                  Médiations
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-all duration-700 text-center flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 touch:opacity-100 ${forceHoverIndex === 1 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-theme-blue mb-8 text-xs md:text-xs lg:text-base leading-relaxed text-center">
                  Explorez mes médiations de médiation culturelle et mes formations pour tous publics
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-theme-blue/80 font-medium hover:text-theme-blue transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-blue after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-xs lg:text-base">
                  Explorer →
                </span>
              </div>
            </div>
          </div>
        </a>
        
        {/* Actualités - 1/3 de la page */}
        <a href="/actus" className={`w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden group cursor-pointer transition-all duration-500 hover:w-full md:hover:w-1/2 ${forceHoverIndex === 2 ? 'w-full md:w-1/2' : ''}`}>
          <img 
            src="https://picsum.photos/800/1200?random=4" 
            alt="Decouvrir mes actualites"
            className="w-full h-full object-cover grayscale transition-none"
          />
          <div className={`absolute inset-0 bg-theme-yellow/90 flex items-center justify-center group-hover:bg-theme-yellow/95 transition-all duration-700 ease-in-out ${forceHoverIndex === 2 ? 'bg-theme-yellow/95' : ''}`}>
            <div className="text-center flex flex-col items-center justify-center w-full h-full relative">
              {/* Titre horizontal - position fixe */}
              <div className="card-content-position">
                <h3 className="font-bold text-theme-dark mb-6 text-2xl md:text-4xl lg:text-6xl">
                  Actualités
                </h3>
              </div>
              
              {/* Contenu qui apparaît au hover - positionné en dessous du titre */}
              <div className={`card-hover-content transition-all duration-700 text-center flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 touch:opacity-100 ${forceHoverIndex === 2 ? 'md:opacity-100' : ''}`}>
                {/* Texte explicatif */}
                <p className="text-theme-dark mb-8 text-xs md:text-xs lg:text-base leading-relaxed text-center">
                  Suivez mes dernières actualités, événements et projets en cours
                </p>
                {/* Bouton d'incitation au clic */}
                <span className="text-theme-dark/80 font-medium hover:text-theme-dark transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-dark after:transition-all after:duration-300 hover:after:w-full after:opacity-0 hover:after:opacity-100 text-xs md:text-xs lg:text-base">
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