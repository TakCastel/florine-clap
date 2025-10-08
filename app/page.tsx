'use client'

import WindowsScrollOptimizer from '@/components/WindowsScrollOptimizer'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import Footer from '@/components/Footer'
import { HoverProvider } from '@/contexts/HoverContext'

export default function HomePage() {
  return (
    <HoverProvider>
      <div className="relative scroll-container scrollbar-hide">
        <WindowsScrollOptimizer />
        <HeroSection />
        <CategoriesSection />
        <BioSection />
        <Footer />
      </div>
    </HoverProvider>
  )
}