'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { HomeSettings, getVideoUrl } from '@/lib/directus'

interface HeroSectionProps {
  homeSettings?: HomeSettings | null
}

export default function HeroSection({ homeSettings }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasTriedUnlock = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const heroVideoFromDirectus = homeSettings?.hero_video ? getVideoUrl(homeSettings.hero_video) : null
  let heroVideoUrlExternal = homeSettings?.hero_video_url || null
  if (heroVideoUrlExternal && typeof window !== 'undefined') {
    const isHttps = window.location.protocol === 'https:'
    if (isHttps && heroVideoUrlExternal.startsWith('http://')) {
      if (heroVideoUrlExternal.match(/^http:\/\/\d+\.\d+\.\d+\.\d+/)) heroVideoUrlExternal = null
      else heroVideoUrlExternal = heroVideoUrlExternal.replace(/^http:/, 'https:')
    }
  }
  const heroVideoUrl = heroVideoFromDirectus || heroVideoUrlExternal || null

  const playVideo = () => {
    const video = videoRef.current
    if (!video || !heroVideoUrl || hasTriedUnlock.current) return
    hasTriedUnlock.current = true
    video.muted = true
    video.play().catch(() => {
      hasTriedUnlock.current = false
    })
  }

  useEffect(() => {
    if (!heroVideoUrl) return
    playVideo()
    const video = videoRef.current
    if (!video) return
    video.addEventListener('loadeddata', playVideo)
    video.addEventListener('canplay', playVideo)
    return () => {
      video.removeEventListener('loadeddata', playVideo)
      video.removeEventListener('canplay', playVideo)
    }
  }, [heroVideoUrl])

  // Déblocage autoplay : au premier clic/touch/keydown n'importe où sur la page, on lance la vidéo
  useEffect(() => {
    const handleFirstInteraction = () => {
      playVideo()
      document.removeEventListener('click', handleFirstInteraction, { capture: true })
      document.removeEventListener('touchstart', handleFirstInteraction, { capture: true })
      document.removeEventListener('keydown', handleFirstInteraction, { capture: true })
    }
    document.addEventListener('click', handleFirstInteraction, { capture: true })
    document.addEventListener('touchstart', handleFirstInteraction, { capture: true })
    document.addEventListener('keydown', handleFirstInteraction, { capture: true })
    return () => {
      document.removeEventListener('click', handleFirstInteraction, { capture: true })
      document.removeEventListener('touchstart', handleFirstInteraction, { capture: true })
      document.removeEventListener('keydown', handleFirstInteraction, { capture: true })
    }
  }, [heroVideoUrl])

  useEffect(() => {
    hasTriedUnlock.current = false
  }, [heroVideoUrl])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30
    const y = (e.clientY / window.innerHeight - 0.5) * 30
    setMousePosition({ x, y })
  }

  return (
    <section
      id="hero-section"
      className="w-full h-screen relative overflow-hidden bg-black"
      style={{ position: 'relative' }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
    >
      <div className="relative h-full overflow-hidden">
        {/* Vidéo uniquement — visible dès le départ */}
        {heroVideoUrl && (
          <video
            ref={videoRef}
            key={heroVideoUrl}
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover scale-110"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        )}

        {/* Contenu principal */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-10">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            className="absolute top-16 md:top-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2">
            <Reveal delay={1.2} direction="up">
              <button
                onClick={() => {
                  playVideo()
                  const categoriesSection = document.getElementById('categories-section')
                  if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="group relative inline-flex flex-col items-center gap-3"
              >
                <span className="text-white/70 text-xs uppercase tracking-widest font-medium group-hover:text-white transition-colors duration-300">
                  Découvrir
                </span>
                <div className="relative w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:scale-110">
                  <svg
                    className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            </Reveal>
          </div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            className="absolute bottom-16 md:bottom-[57px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>

        {!isMobile && (
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            animate={{
              background: `radial-gradient(circle 600px at ${50 + (mousePosition.x / 30) * 100}% ${50 + (mousePosition.y / 30) * 100}%, rgba(255,255,255,0.1) 0%, transparent 100%)`,
            }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
          />
        )}
      </div>
    </section>
  )
}
