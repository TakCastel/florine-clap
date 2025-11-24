'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'
import MobileMenu from './MobileMenu'
import { UnderlineLink } from '@/components/ui/UnderlineLink'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { showAnimations } = useAnimation()
  const [isLogoVisible, setIsLogoVisible] = useState(false)

  // Animation d'apparition du logo comme les liens de navigation
  useEffect(() => {
    if (!showAnimations) {
      setIsLogoVisible(true)
      return
    }

    // Animation avec le même délai que le premier lien (0ms)
    setTimeout(() => {
      setIsLogoVisible(true)
    }, 0)
  }, [showAnimations])

  return (
    <header className={`w-full z-[60] top-0 left-0 right-0 ${
      isHomePage 
        ? 'absolute' 
        : 'fixed md:relative'
    }`}>
      <div className={`flex justify-between items-center px-6 md:px-10 lg:px-16 py-4 ${
        isHomePage 
          ? 'bg-theme-cream/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none' 
          : 'backdrop-blur-xl bg-theme-cream/85 border-b border-gray-200'
      }`}>
        {/* Logo - style simple comme les liens de navigation */}
        <div
          style={{
            opacity: isLogoVisible ? 1 : 0,
            transform: isLogoVisible ? 'translateY(0)' : 'translateY(-30px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          <UnderlineLink href="/" variant={isHomePage ? 'light' : 'dark'}>
            FLORINE CLAP
          </UnderlineLink>
        </div>

        {/* Navigation desktop à droite */}
        <div className={showAnimations ? 'header-nav-animation' : ''}>
          <Navigation isHomePage={isHomePage} />
        </div>

        {/* Menu burger mobile */}
        <div className="md:hidden">
          <MobileMenu isHomePage={isHomePage} />
        </div>

      </div>
    </header>
  )
}
