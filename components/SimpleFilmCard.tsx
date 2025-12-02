'use client'

import Link from 'next/link'
import Image from 'next/image'

type SimpleFilmCardProps = {
  href: string
  title: string
  cover?: string
  synopsis?: string
  imagePosition?: 'left' | 'right'
  className?: string
}

export default function SimpleFilmCard({
  href,
  title,
  cover,
  synopsis,
  imagePosition = 'left',
  className = ''
}: SimpleFilmCardProps) {
  const isImageLeft = imagePosition === 'left'

  return (
    <Link href={href} className={`group block w-full ${className}`}>
      <article className="relative w-full max-w-6xl mx-auto">
        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-start`}>
          {/* Image */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            {cover ? (
              <div 
                className="relative aspect-[4/3] overflow-hidden"
                style={{ transform: 'skewX(-3deg)' }}
              >
                <div className="relative w-full h-full" style={{ transform: 'skewX(3deg)' }}>
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div 
                className="relative aspect-[4/3] bg-gray-200"
                style={{ transform: 'skewX(-3deg)' }}
              >
                <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'skewX(3deg)' }}>
                  <span className="text-gray-400 font-mono text-sm uppercase">
                    Image non disponible
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            {/* Titre */}
            <h3 className="heading-main text-black mb-6 group-hover:text-black/80 transition-colors">
              {title}
            </h3>

            {/* Synopsis */}
            {synopsis && (
              <p className="body-text text-black/70 mb-8 line-clamp-3 md:line-clamp-4">
                {synopsis}
              </p>
            )}

            {/* En savoir plus */}
            <div className="inline-flex items-center gap-3 text-sm md:text-base font-medium uppercase tracking-wide text-black group-hover:text-black/80 transition-colors">
              <span>En savoir plus</span>
              <div className="flex items-center gap-1">
                <div className="h-[2px] bg-black w-6 group-hover:w-12 transition-all duration-500"></div>
                <svg
                  className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-0 -translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

