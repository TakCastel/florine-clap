'use client'

export default function BioSection() {
  return (
    <section id="bio-section" className="w-full py-16 md:py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Image - 1/3 de la page - cachée en mobile */}
          <div className="hidden lg:block w-full lg:w-1/3 relative overflow-hidden group">
            <img 
              src="https://picsum.photos/800/1200?random=5" 
              alt="Florine Clap - Portrait"
              className="w-full h-96 lg:h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-lg"
            />
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-all duration-700 rounded-lg"></div>
          </div>
          
          {/* Texte - 2/3 de la page en desktop, pleine largeur en mobile */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-display">
              Bio
            </h2>
            
            <div className="space-y-6 text-white/90 text-base md:text-lg lg:text-xl leading-relaxed font-sans">
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
                className="inline-flex items-center text-white text-lg md:text-xl font-medium hover:text-white/80 transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full font-sans"
              >
                Découvrir ma bio complète →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}