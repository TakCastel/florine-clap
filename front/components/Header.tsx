'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'
import MobileMenu from './MobileMenu'
import { UnderlineLink } from '@/components/ui/UnderlineLink'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'
  const isBioPage = pathname === '/bio'
  
  // Détecter les pages articles (avec slug)
  const isArticlePage = /^\/(films|mediations|videos-art|actus)\/[^/]+$/.test(pathname)
  
  // Détecter les pages de liste
  const isListPage = ['/films', '/mediations', '/videos-art', '/actus'].includes(pathname)
  
  // Texte blanc pour accueil et articles, noir pour bio et listes
  const isLightText = isHomePage || isArticlePage
  
  const { showAnimations } = useAnimation()
  const [isLogoVisible, setIsLogoVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    <header className={`w-full z-[130] top-0 left-0 right-0 ${
      isHomePage || isArticlePage
        ? 'absolute' 
        : isBioPage
        ? 'relative'
        : 'fixed md:relative'
    }`}>
      <div className={`flex justify-between items-center px-6 md:px-10 lg:px-16 py-4 relative ${
        isHomePage || isArticlePage || isBioPage
          ? 'bg-transparent backdrop-blur-none'
          : 'backdrop-blur-xl bg-theme-white/85 border-b border-gray-200'
      }`}>
        {/* Logo - style simple comme les liens de navigation */}
        <div
          style={{
            opacity: isLogoVisible ? 1 : 0,
            transform: isLogoVisible ? 'translateY(0)' : 'translateY(-30px)',
            transition: 'all 0.6s ease-out',
            position: 'relative',
            zIndex: 10
          }}
        >
          <UnderlineLink 
            href="/" 
            variant={isLightText ? 'light' : 'dark'}
            onClick={() => {
              // Si on n'est pas déjà sur l'accueil, naviguer puis fermer le menu
              if (!isHomePage) {
                router.push('/')
              }
              // Fermer le menu mobile si ouvert
              if (typeof window !== 'undefined' && (window as any).__closeMobileMenu) {
                setTimeout(() => {
                  (window as any).__closeMobileMenu()
                }, 50)
              }
            }}
          >
            FLORINE CLAP
          </UnderlineLink>
        </div>

        {/* Navigation desktop à droite */}
        <div className={showAnimations ? 'header-nav-animation' : ''}>
          <Navigation isHomePage={isHomePage} isLightText={isLightText} />
        </div>

        {/* Menu burger mobile */}
        <div className="md:hidden">
          <MobileMenu isHomePage={isHomePage} isMobile={isMobile} isLightText={isLightText} />
        </div>

      </div>
    </header>
  )
}
