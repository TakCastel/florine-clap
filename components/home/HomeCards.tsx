import Link from 'next/link'
import Image from 'next/image'
import type { RefObject } from 'react'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'

interface HomeCardsProps {
  innerRef?: RefObject<HTMLElement | null>
}

export default function HomeCards({ innerRef }: HomeCardsProps) {
  const { ref: sectionRef, isVisible: isSectionVisible } = useAnimationOnScroll()

  return (
    <section ref={(el) => {
      if (innerRef) innerRef.current = el
      sectionRef.current = el
    }} className="relative bg-orange-100 z-30 min-h-screen flex items-center">
      {/* Carré jaune collé en haut pour la continuité avec le hero */}
      <div className="absolute -top-0 left-0 right-0 flex justify-center">
        <div className="w-full mx-auto h-[50vh] relative bg-black overflow-hidden" style={{ maxWidth: 'calc(72rem - 3rem)' }}>
          {/* Bordure intérieure blanche - sans bordure en haut */}
          <div className={`absolute left-2 right-2 bottom-2 top-0 border-l-2 border-r-2 border-b-2 border-orange-100 transition-all duration-1000 ease-out ${
            isSectionVisible ? 'opacity-100' : 'opacity-0'
          }`}></div>
          
            {/* Contenu dans le carré jaune */}
            <div className="relative z-10 h-full py-6">
              {/* Titre en haut à gauche */}
              <h1 className={`absolute top-6 md:top-12 left-6 md:left-12 text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide text-orange-100 transition-all duration-1000 ease-out delay-300 ${
                isSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}>
                Florine Clap
              </h1>
              {/* Sous-titre en bas à droite */}
              <p className={`absolute bottom-6 md:bottom-12 right-8 md:right-12 text-sm md:text-lg text-orange-100 leading-relaxed text-right max-w-xs md:max-w-md transition-all duration-1000 ease-out delay-500 ${
                isSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}>
                Autrice et réalisatrice de films<br />
                Direction d'ateliers pédagogiques et artistiques
              </p>
            </div>
        </div>
      </div>
      
      {/* Section des cartes */}
      <div className="w-full bg-orange-100 pt-[50vh] pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Carte Films */}
            <Link href="/films" className={`group transition-all duration-1000 ease-out ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: isSectionVisible ? '700ms' : '0ms' }}>
              <div className="relative w-full h-80 overflow-hidden bg-orange-500 transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                <Image
                  src="https://picsum.photos/600/600?random=2"
                  alt=""
                  fill
                  className="object-cover opacity-10 grayscale"
                />
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-montserrat font-bold tracking-wider text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Films
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Carte Médiations */}
            <Link href="/ateliers" className={`group transition-all duration-1000 ease-out ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: isSectionVisible ? '900ms' : '0ms' }}>
              <div className="relative w-full h-80 overflow-hidden bg-black transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                <Image
                  src="https://picsum.photos/600/600?random=3"
                  alt=""
                  fill
                  className="object-cover opacity-10 grayscale"
                />
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-montserrat font-bold tracking-wider text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Médiations
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Carte Actualités */}
            <Link href="/actus" className={`group transition-all duration-1000 ease-out ${
              isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: isSectionVisible ? '1100ms' : '0ms' }}>
              <div className="relative w-full h-80 overflow-hidden bg-cyan-600 transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                <Image
                  src="https://picsum.photos/600/600?random=4"
                  alt=""
                  fill
                  className="object-cover opacity-10 grayscale"
                />
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-montserrat font-bold tracking-wider text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Actualités
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


