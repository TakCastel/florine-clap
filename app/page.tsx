'use client'

import { allPages } from '.contentlayer/generated'
import { useRef } from 'react'
import BackgroundImage from '@/components/home/BackgroundImage'
import Hero from '@/components/home/Hero'
import HomeCards from '@/components/home/HomeCards'

export default function HomePage() {
  const homePage = allPages.find((p) => p._raw.flattenedPath === 'pages/home')
  const sectionsRef = useRef<HTMLElement>(null)
  
  const scrollToSections = () => {
    if (sectionsRef.current) {
      sectionsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
  
  return (
    <div className="relative bg-white min-h-[calc(100vh-88px-80px)]">
      <BackgroundImage 
        src="https://picsum.photos/1920/1080?random=1&grayscale&blur=1"
        alt="Florine Clap - Background"
      />

      <Hero 
        title={homePage?.title || 'Florine'}
        description={homePage?.body?.raw ? homePage.body.raw.replace(/^# .*$/m, '').trim() : 'Réalisatrice et formatrice en ateliers vidéo'}
        onScrollClick={scrollToSections}
      />

      <HomeCards innerRef={sectionsRef} />
    </div>
  )
}


