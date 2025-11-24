'use client'

import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import QuoteSection from '@/components/home/QuoteSection'
import PartnersSection from '@/components/home/PartnersSection'
import { HoverProvider } from '@/contexts/HoverContext'

export default function HomePage() {
  return (
    <HoverProvider>
      <div className="relative bg-theme-cream min-h-screen">
        <HeroSection />
        <CategoriesSection />
        <BioSection />
        <QuoteSection />
        <PartnersSection />
      </div>
    </HoverProvider>
  )
}