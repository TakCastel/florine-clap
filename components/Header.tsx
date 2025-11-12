'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'
import MobileMenu from './MobileMenu'

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
          <a 
            href="/" 
            className={`font-display font-normal uppercase cursor-pointer relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:transition-all after:duration-500 after:ease-out hover:after:w-full tracking-wide transition-colors duration-300 text-base ${
              isHomePage 
                ? 'text-white/75 hover:text-white after:bg-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]' 
                : 'text-theme-dark/80 hover:text-black after:bg-theme-dark'
            }`}
          >
            FLORINE CLAP
          </a>
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
