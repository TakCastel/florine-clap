'use client'

import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import QuoteSection from '@/components/home/QuoteSection'
import PartnersSection from '@/components/home/PartnersSection'
import { HoverProvider } from '@/contexts/HoverContext'
import { HomeSettings } from '@/lib/directus'

interface HomePageClientProps {
  homeSettings: HomeSettings | null
}

export default function HomePageClient({ homeSettings }: HomePageClientProps) {
  return (
    <HoverProvider>
      <div className="relative bg-theme-white min-h-screen">
        <HeroSection homeSettings={homeSettings} />
        <CategoriesSection homeSettings={homeSettings} />
        <BioSection homeSettings={homeSettings} />
        <QuoteSection />
        <PartnersSection />
      </div>
    </HoverProvider>
  )
}



