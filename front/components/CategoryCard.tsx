'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import CtaLink from '@/components/CtaLink'

interface CategoryCardProps {
  href: string
  title: string
  description: string
  linkText: string
  imageSrc: string
  imageAlt: string
  theme?: 'films' | 'mediations' | 'actus' | 'videos-art'
  bgColor: string
  hoverBgColor: string
  textColor: string
  linkColor: string
  hoverLinkColor: string
  underlineClass: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

export default function CategoryCard({
  href,
  title,
  description,
  linkText,
  imageSrc,
  imageAlt,
  style,
  priority = false
}: CategoryCardProps) {
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [activeImage, setActiveImage] = useState<'image1' | 'image2'>('image1')
  const [image1Loaded, setImage1Loaded] = useState(false)
  const [image2Loaded, setImage2Loaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const previousImageSrc = useRef('')
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Gérer les changements d'image avec transition crossfade
  useEffect(() => {
    if (!imageSrc || imageSrc === '') {
      return
    }
    
    if (imageSrc === previousImageSrc.current) {
      return
    }

    // Nettoyer les timeouts précédents
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }

    if (!image1 || image1 === '') {
      // Première image : l'afficher directement
      setImage1(imageSrc)
      setActiveImage('image1')
      setImage1Loaded(false)
      previousImageSrc.current = imageSrc
    } else {
      // Nouvelle image : préparer le crossfade
      const nextSlot = activeImage === 'image1' ? 'image2' : 'image1'
      
      if (nextSlot === 'image1') {
        setImage1(imageSrc)
        setImage1Loaded(false)
      } else {
        setImage2(imageSrc)
        setImage2Loaded(false)
      }
    }
  }, [imageSrc, image1, activeImage])

  // Gérer le crossfade une fois que la nouvelle image est chargée
  useEffect(() => {
    const nextSlot = activeImage === 'image1' ? 'image2' : 'image1'
    const nextImage = nextSlot === 'image1' ? image1 : image2
    const nextImageLoaded = nextSlot === 'image1' ? image1Loaded : image2Loaded

    if (nextImage && nextImage !== previousImageSrc.current && nextImageLoaded && !isTransitioning) {
      // Démarrer le crossfade après un court délai pour s'assurer que l'image est prête
      setIsTransitioning(true)
      
      // Petit délai avant de commencer la transition pour éviter les flashs
      const startTimer = setTimeout(() => {
        setActiveImage(nextSlot)
      }, 50)

      // Après la transition, nettoyer l'ancienne image
      transitionTimeoutRef.current = setTimeout(() => {
        if (activeImage === 'image1') {
          setImage1('')
          setImage1Loaded(false)
        } else {
          setImage2('')
          setImage2Loaded(false)
        }
        previousImageSrc.current = nextImage
        setIsTransitioning(false)
        transitionTimeoutRef.current = null
      }, 2100) // Légèrement plus long que la durée de transition
      
      return () => {
        clearTimeout(startTimer)
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current)
        }
      }
    }
  }, [image1Loaded, image2Loaded, image1, image2, activeImage, isTransitioning])

  return (
    <div 
      className="group relative w-full h-full overflow-hidden bg-gray-200"
      style={style}
    >
      {/* Image 1 */}
      {image1 && (
        <div 
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ 
            opacity: activeImage === 'image1' ? 1 : 0,
            zIndex: activeImage === 'image1' ? 2 : 1,
            willChange: 'opacity',
            pointerEvents: 'none'
          }}
        >
          <Image 
            src={image1} 
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            style={{ filter: 'grayscale(100%) brightness(0.95)' }}
            priority={priority && activeImage === 'image1'}
            unoptimized={image1.startsWith('http://') || image1.startsWith('https://')}
            onLoad={() => setImage1Loaded(true)}
          />
        </div>
      )}
      
      {/* Image 2 */}
      {image2 && (
        <div 
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ 
            opacity: activeImage === 'image2' ? 1 : 0,
            zIndex: activeImage === 'image2' ? 2 : 1,
            willChange: 'opacity',
            pointerEvents: 'none'
          }}
        >
          <Image 
            src={image2} 
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            style={{ filter: 'grayscale(100%) brightness(0.95)' }}
            priority={priority && activeImage === 'image2'}
            unoptimized={image2.startsWith('http://') || image2.startsWith('https://')}
            onLoad={() => setImage2Loaded(true)}
          />
        </div>
      )}
      
      {/* Overlay sombre au survol - Desktop */}
      <div className="absolute inset-0 bg-black/10 z-10 hidden md:block" />
      <div className="absolute inset-0 bg-black z-10 hidden md:block opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Overlay mobile */}
      <div className="absolute inset-0 bg-black/15 z-20 pointer-events-none md:hidden" />
      
      {/* Gradient pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none hidden md:block" />

      {/* Contenu mobile */}
      <div className="absolute inset-0 z-30 p-5 md:hidden flex flex-col">
        <h3 className="font-display text-white font-bold tracking-tight leading-[1.1] text-lg">
          {title}
        </h3>
      </div>

      {/* Contenu desktop */}
      <div className="absolute inset-0 z-30 p-10 hidden md:flex flex-col justify-between">
        <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 mb-4 transition-all duration-500">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-white mb-3">
            {title}
          </h3>
          <div className="h-[3px] bg-white w-16 group-hover:w-full opacity-90 transition-all duration-500 ease-out rounded-full" />
        </div>

        <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100">
          <p className="text-white/90 text-xs font-sans leading-relaxed mb-4 pt-4 line-clamp-2 min-h-[4rem]">
            {description}
          </p>
        </div>

        <div className="mt-2">
          <CtaLink
            href={href}
            label={linkText}
            tone="light"
            isActive={false}
          />
        </div>
      </div>

      {/* Lien */}
      <a href={href} className="absolute inset-0 z-40" aria-label={title} />
    </div>
  )
}
