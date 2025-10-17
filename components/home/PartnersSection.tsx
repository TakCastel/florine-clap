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
      className="w-full bg-black py-24 md:py-32 relative overflow-hidden"
    >
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-full"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 border border-white/5 rotate-45"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Titre avec animation */}
        <div 
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <div className="text-white/40 text-sm uppercase tracking-[0.3em] mb-4 font-medium">
            Partenaires
          </div>
          <h2 
            className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-andalemo), sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            Ils me font confiance
          </h2>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-white/20 w-32 mx-auto mt-6 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.4s',
              }}
            ></div>
          </div>
        </div>

        {/* Marquee des logos */}
        <div 
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
          }}
        >
          <LogoMarquee 
            invertColors={true}
            pauseOnHover={false}
          />
        </div>
      </div>

      {/* Ligne décorative horizontale */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  )
}

