'use client'

import { allPages } from '.contentlayer/generated'
import { useRef } from 'react'
import BackgroundVideo from '@/components/home/BackgroundVideo'
import Hero from '@/components/home/Hero'
import HomeCards from '@/components/home/HomeCards'
import BioSection from '@/components/home/BioSection'

export default function HomePage() {
  const homePage = allPages.find((p) => p._raw.flattenedPath === 'pages/home')
  const sectionsRef = useRef<HTMLElement>(null)
  
  const scrollToSections = () => {
    if (sectionsRef.current) {
      const elementPosition = sectionsRef.current.offsetTop
      // En mobile, on scroll directement vers la section sans ajouter 88px
      // En desktop, on ajoute 88px pour masquer complètement la section hero
      const isMobile = window.innerWidth < 768
      const offsetPosition = isMobile ? elementPosition : elementPosition + 88

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  
  return (
    <div className="relative bg-orange-100">
      <BackgroundVideo 
        src="/videos/example.mp4"
        alt="Vidéo de fond artistique"
      />

      <Hero 
        onScrollClick={scrollToSections}
      />

      <HomeCards innerRef={sectionsRef} />
      
      <BioSection />
    </div>
  )
}


