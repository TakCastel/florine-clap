'use client'

import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import { HoverProvider } from '@/contexts/HoverContext'

export default function HomePage() {
  return (
    <HoverProvider>
      <div className="relative">
        <HeroSection />
        <CategoriesSection />
        <BioSection />
      </div>
    </HoverProvider>
  )
}