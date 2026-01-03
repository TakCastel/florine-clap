'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import BioSection from '@/components/home/BioSection'
import QuoteSection from '@/components/home/QuoteSection'
import PartnersSection from '@/components/home/PartnersSection'
import { HoverProvider } from '@/contexts/HoverContext'
import { getHomeSettings, HomeSettings } from '@/lib/directus'

export default function HomePage() {
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getHomeSettings()
        setHomeSettings(settings)
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-white flex items-center justify-center">
        <p className="text-black/60">Chargement...</p>
      </div>
    )
  }

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