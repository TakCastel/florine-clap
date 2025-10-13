'use client'

import ScrollIndicator from '@/components/ScrollIndicator'

export default function BioSection() {
  const scrollToFooter = () => {
    const footer = document.querySelector('footer')
    const container = document.querySelector('.scroll-container') as HTMLElement
    
    if (footer && container) {
      const elementTop = footer.offsetTop
      const headerHeight = 80 // Hauteur du header fixe
      const offsetPosition = elementTop - headerHeight
      
      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="bio-section" className="scroll-section w-full z-30" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="w-full h-full bg-theme-grey flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 py-12 w-full h-full flex">
          {/* Image - 1/3 de la page - cachée en mobile */}
          <div className="hidden md:block w-1/3 h-full relative overflow-hidden group">
            <img 
              src="https://picsum.photos/800/1200?random=5" 
              alt="Florine Clap - Portrait"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-theme-dark/20 group-hover:bg-theme-dark/10 transition-all duration-700"></div>
          </div>
          
          {/* Texte - 2/3 de la page en desktop, pleine largeur en mobile */}
          <div className="w-full md:w-2/3 h-full flex items-center justify-center p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-5xl lg:text-7xl font-bold text-theme-blue mb-8 font-andale-mono">
                Mon parcours
              </h2>
              
              <div className="space-y-4 text-theme-blue text-sm md:text-base lg:text-2xl leading-relaxed font-sans">
                <p>
                  Née à Avignon en 1988, je me passionne très tôt pour le théâtre et le cinéma. 
                  Diplômée en esthétique et pratique du cinéma à l'université Paris I Panthéon-Sorbonne.
                </p>
                
                <p>
                  Ma filmographie révèle un intérêt renouvelé pour le cinéma, le théâtre et la danse, 
                  m'ayant menée de l'Académie du spectacle équestre de Bartabas à la réalisation de 
                  documentaires d'art et sur l'art.
                </p>
                
                <p>
                  Mes films explorent des figures atypiques et des structures associatives, 
                  témoignant d'une sensibilité sociale et artistique qui m'oriente aujourd'hui 
                  vers la fiction et le docu-fiction.
                </p>
              </div>
              
              {/* Bouton d'action */}
              <div className="mt-8">
                <a 
                  href="/bio" 
                  className="inline-flex items-center text-theme-blue text-sm md:text-lg lg:text-xl font-medium hover:text-theme-blue/80 transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-blue after:transition-all after:duration-300 hover:after:w-full font-sans"
                >
                  Découvrir mon parcours complet →
                </a>
              </div>
              
              {/* Indicateur de scroll vers le footer */}
              <div className="mt-12 text-center">
                <ScrollIndicator
                  onClick={scrollToFooter}
                  ariaLabel="Aller au footer"
                  className="text-theme-blue/60 hover:text-theme-blue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}