'use client'

import dynamic from 'next/dynamic'
import { Reveal } from '@/components/ui/Reveal'

const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/20 animate-pulse rounded"></div>
})

export default function PartnersSection() {
  return (
    <section 
      id="partners-section" 
      className="w-full bg-theme-cream py-24 md:py-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Titre léger */}
        <Reveal width="100%" className="text-center mb-8">
          <div className="text-black/30 text-xs uppercase tracking-[0.2em] font-light">
            Partenaires
          </div>
        </Reveal>

        {/* Marquee des logos */}
        <Reveal width="100%" delay={0.2}>
          <LogoMarquee 
            invertColors={false}
            pauseOnHover={false}
          />
        </Reveal>
      </div>

      {/* Ligne décorative horizontale */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  )
}
