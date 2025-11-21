'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { RefObject } from 'react'
import { useState, useEffect } from 'react'
import { getRandomCardImage } from '@/lib/images'

interface HomeCardsProps {
  innerRef?: RefObject<HTMLElement | null>
}

export default function HomeCards({ innerRef }: HomeCardsProps) {
  const [filmImage, setFilmImage] = useState('')
  const [mediationImage, setMediationImage] = useState('')
  const [actuImage, setActuImage] = useState('')

  useEffect(() => {
    // Générer des images aléatoires à chaque montage du composant
    setFilmImage(getRandomCardImage('films'))
    setMediationImage(getRandomCardImage('mediations'))
    setActuImage(getRandomCardImage('actus'))
  }, [])

  return (
    <section ref={(el) => {
      if (innerRef) innerRef.current = el
    }} className="relative bg-orange-100 z-30 h-screen w-full flex items-center">
      {/* Debug: Titre visible */}
      <div className="absolute top-4 left-4 z-50 bg-red-500 text-white px-2 py-1 text-sm">
        Section Cartes - Visible
      </div>
      
      {/* Section des cartes */}
      <div className="w-full bg-orange-100 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Carte Films */}
            <Link href="/films" className="group transition-all duration-1000 ease-out opacity-100 translate-y-0">
              <div className="relative w-full h-80 overflow-hidden bg-theme-films transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                {filmImage && (
                  <Image
                    src={filmImage}
                    alt=""
                    fill
                    className="object-cover opacity-10 grayscale"
                  />
                )}
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-display font-bold tracking-wider text-theme-films-text relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Films
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-theme-films-border opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Carte Médiations */}
            <Link href="/m�diations" className="group transition-all duration-1000 ease-out opacity-100 translate-y-0">
              <div className="relative w-full h-80 overflow-hidden bg-theme-mediations transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                {mediationImage && (
                  <Image
                    src={mediationImage}
                    alt=""
                    fill
                    className="object-cover opacity-10 grayscale"
                  />
                )}
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-display font-bold tracking-wider text-theme-mediations-text relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Médiations
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-theme-mediations-border opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Carte Actualités */}
            <Link href="/actus" className="group transition-all duration-1000 ease-out opacity-100 translate-y-0">
              <div className="relative w-full h-80 overflow-hidden bg-theme-actus transition-all duration-500 group-hover:brightness-110 group-hover:scale-105 cursor-pointer">
                {/* Image en filigrane */}
                {actuImage && (
                  <Image
                    src={actuImage}
                    alt=""
                    fill
                    className="object-cover opacity-10 grayscale"
                  />
                )}
                {/* Icône de clic visible en mobile */}
                <div className="absolute top-4 right-4 md:hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-4xl font-display font-bold tracking-wider text-theme-actus-text relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-1 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                    Actualités
                  </h3>
                </div>
                {/* Bordure qui apparaît au hover */}
                <div className="absolute inset-0 border-2 border-theme-actus-border opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


