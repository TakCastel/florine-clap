import Image from 'next/image'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'

export default function BioSection() {
  const { ref, isVisible } = useAnimationOnScroll()

  return (
    <section ref={ref} className="relative bg-orange-100 py-24 pb-48 overflow-hidden z-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Bloc de texte avec fond coloré */}
          <div className={`relative transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            {/* Bloc carré de couleur en arrière-plan */}
            <div className="relative bg-cyan-400 p-8 lg:p-12 min-h-[400px] flex items-center">
              {/* Bordure intérieure blanche */}
              <div className={`absolute inset-4 border-2 border-orange-100 transition-all duration-1000 ease-out delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              {/* Contenu du texte */}
              <div className="relative z-10 text-orange-100">
                <h2 className={`text-3xl lg:text-4xl font-montserrat font-bold mb-6 tracking-wide transition-all duration-1000 ease-out delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  Mon parcours artistique
                </h2>
                
                <div className={`space-y-4 text-lg leading-relaxed transition-all duration-1000 ease-out delay-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <p>
                    Née à Avignon en 1988, je me passionne très tôt pour le théâtre et le cinéma. 
                    Diplômée en esthétique et pratique du cinéma à l'université Paris I Panthéon-Sorbonne, 
                    j'ai développé une approche artistique singulière.
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
                
                {/* Mots-clés pour le SEO */}
                <div className={`mt-6 flex flex-wrap gap-2 transition-all duration-1000 ease-out delay-900 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="px-3 py-1 bg-orange-100 text-cyan-600 text-sm font-medium">
                    Réalisatrice documentaire
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-cyan-600 text-sm font-medium">
                    Festival d'Avignon
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-cyan-600 text-sm font-medium">
                    Médiation artistique
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-cyan-600 text-sm font-medium">
                    Cinéma d'auteur
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image simplifiée - Design épuré */}
          <div className={`relative transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="relative w-full h-[500px] lg:h-[600px]">
              
              {/* Image principale avec effet subtil */}
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/600/800?random=6"
                  alt="Florine Clap - Réalisatrice et autrice"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                />
                {/* Overlay simple */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Bordure simple */}
              <div className={`absolute inset-0 border-2 border-orange-100 transition-all duration-1000 ease-out delay-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
