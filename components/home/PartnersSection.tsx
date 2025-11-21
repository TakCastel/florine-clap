'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/20 animate-pulse rounded"></div>
})

export default function PartnersSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="partners-section" 
      className="w-full bg-theme-cream py-24 md:py-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Titre léger */}
        <div 
          className="text-center mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <div className="text-black/30 text-xs uppercase tracking-[0.2em] font-light">
            Partenaires
          </div>
        </div>

        {/* Marquee des logos */}
        <div 
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
          }}
        >
          <LogoMarquee 
            invertColors={false}
            pauseOnHover={false}
          />
        </div>
      </div>

      {/* Ligne décorative horizontale */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  )
}

