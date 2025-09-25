import Link from 'next/link'
import Image from 'next/image'
import { IoMdFilm, IoMdSchool, IoMdPaper } from 'react-icons/io'
import type { RefObject } from 'react'

interface HomeCardsProps {
  innerRef?: RefObject<HTMLElement | null>
}

export default function HomeCards({ innerRef }: HomeCardsProps) {
  return (
    <section ref={innerRef} className="relative bg-white z-30 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/films"
            className="group bg-white border border-neutral-200 hover:border-primary-400 transition-colors duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://picsum.photos/400/400?random=2"
                alt="Films - Mes réalisations"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="p-6">
              <div className="mb-3">
                <IoMdFilm size={24} className="text-primary-400" />
              </div>
              <h3 className="text-xl font-oswald font-medium tracking-wide uppercase mb-2 text-neutral-800">
                Films
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Mes réalisations cinématographiques et projets vidéo personnels.
              </p>
            </div>
          </Link>

          <Link 
            href="/ateliers"
            className="group bg-white border border-neutral-200 hover:border-cyan-400 transition-colors duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://picsum.photos/400/400?random=3"
                alt="Médiations - Formations"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="p-6">
              <div className="mb-3">
                <IoMdSchool size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-oswald font-medium tracking-wide uppercase mb-2 text-neutral-800">
                Médiations
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Ateliers et formations en création vidéo pour tous les niveaux.
              </p>
            </div>
          </Link>

          <Link 
            href="/actus"
            className="group bg-white border border-neutral-200 hover:border-orange-400 transition-colors duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://picsum.photos/400/400?random=4"
                alt="Actualités - Dernières nouvelles"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="p-6">
              <div className="mb-3">
                <IoMdPaper size={24} className="text-orange-400" />
              </div>
              <h3 className="text-xl font-oswald font-medium tracking-wide uppercase mb-2 text-neutral-800">
                Actualités
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Dernières nouvelles, festivals et événements récents.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}


