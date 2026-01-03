'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import Image from 'next/image'
import { HomeSettings, getImageUrl } from '@/lib/directus'

const HERO_VIDEO_URL_DEFAULT =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
  'http://51.77.245.224/videos/INTRO_VIDEO_FLORINE_CLAP.mp4'

interface HeroSectionProps {
  homeSettings?: HomeSettings | null
}

export default function HeroSection({ homeSettings }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)

  // Utiliser la vidéo ou l'image depuis Directus, sinon la valeur par défaut
  const heroVideoUrl = homeSettings?.hero_video_url || HERO_VIDEO_URL_DEFAULT
  const heroImageUrl = homeSettings?.hero_image ? getImageUrl(homeSettings.hero_image) : null

  const videoHost = useMemo(() => {
    if (!heroVideoUrl) return null
    try {
      return new URL(heroVideoUrl).origin
    } catch {
      return null
    }
  }, [heroVideoUrl])

  useEffect(() => {
    // Si on a une image, ne pas charger la vidéo
    if (heroImageUrl) return
    
    if (!heroVideoUrl) return

    // Small delay to let the hero paint before the heavy video kicks in
    const timeout = window.setTimeout(() => {
      setVideoSrc(heroVideoUrl)
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [heroVideoUrl, heroImageUrl])

  useEffect(() => {
    if (!videoHost) return

    const existingPreconnect = document.querySelector<HTMLLinkElement>(
      'link[data-hero-preconnect="true"]'
    )
    if (!existingPreconnect) {
      const preconnectLink = document.createElement('link')
      preconnectLink.rel = 'preconnect'
      preconnectLink.href = videoHost
      preconnectLink.crossOrigin = 'anonymous'
      preconnectLink.dataset.heroPreconnect = 'true'
      document.head.appendChild(preconnectLink)
    }

    if (!document.querySelector<HTMLLinkElement>('link[data-hero-preload="true"]') && heroVideoUrl && !heroImageUrl) {
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'video'
      preloadLink.href = heroVideoUrl
      preloadLink.crossOrigin = 'anonymous'
      preloadLink.dataset.heroPreload = 'true'
      document.head.appendChild(preloadLink)
    }
  }, [videoHost, heroVideoUrl, heroImageUrl])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30
    const y = (e.clientY / window.innerHeight - 0.5) * 30
    setMousePosition({ x, y })
  }

  return (
    <section 
      id="hero-section" 
      className="w-full h-screen relative overflow-hidden section-gradient"
      onMouseMove={handleMouseMove}
    >
      <div className="relative h-full overflow-hidden">
        {/* Vidéo ou Image de fond */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* Uniform dark fallback before the video becomes available */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: (heroImageUrl || isVideoReady) ? 0 : 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-black"
          ></motion.div>

          {/* Image si disponible */}
          {heroImageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={heroImageUrl}
                alt="Hero"
                fill
                className="object-cover scale-110"
                priority
                sizes="100vw"
              />
            </motion.div>
          )}

          {/* Vidéo si pas d'image */}
          {!heroImageUrl && videoSrc && !hasVideoError && (
            <motion.video
              key={videoSrc}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVideoReady ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover scale-110 bg-black"
              onLoadedData={() => setIsVideoReady(true)}
              onError={() => {
                setHasVideoError(true)
                setIsVideoReady(false)
              }}
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </motion.video>
          )}

          {!heroImageUrl && hasVideoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm tracking-widest uppercase">
              Vidéo indisponible pour le moment
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-10">
          
          {/* Ligne décorative supérieure - 64px (h-16) sur mobile pour correspondre au menu, 57px sur desktop */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="absolute top-16 md:top-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {/* Bouton de navigation en bas avec effet parallax */}
          <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2">
            <Reveal delay={1.2} direction="up">
              <button 
                onClick={() => {
                  const categoriesSection = document.getElementById('categories-section')
                  if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="group relative inline-flex flex-col items-center gap-3"
              >
                {/* Texte */}
                <span className="text-white/70 text-sm uppercase tracking-widest font-medium group-hover:text-white transition-colors duration-300">
                  Découvrir
                </span>
                
                {/* Cercle avec flèche animée */}
                <div className="relative w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:scale-110">
                  <svg 
                    className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-y-1" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                  
                  {/* Cercle animé qui pulse */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
              </button>
            </Reveal>
          </div>

          {/* Ligne décorative inférieure - 64px (h-16) sur mobile pour correspondre au menu, 57px sur desktop */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="absolute bottom-16 md:bottom-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>

        {/* Effet de brillance qui suit la souris */}
        <motion.div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={{
            background: `radial-gradient(circle 600px at ${50 + (mousePosition.x / 30) * 100}% ${50 + (mousePosition.y / 30) * 100}%, rgba(255,255,255,0.1) 0%, transparent 100%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />
      </div>
    </section>
  )
}
