'use client'

import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import PartnersSection from '@/components/home/PartnersSection'
import { HoverProvider } from '@/contexts/HoverContext'

export default function HomePage() {
  return (
    <HoverProvider>
      <div className="relative bg-theme-cream min-h-screen">
        <HeroSection />
        <CategoriesSection />
        <BioSection />
        <PartnersSection />
      </div>
    </HoverProvider>
  )
}