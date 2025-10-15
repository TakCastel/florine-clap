'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { showAnimations } = useAnimation()

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 ${
      isHomePage ? 'bg-black' : 'bg-white border-b border-gray-200'
    }`}>
      <a 
        href="/" 
        className={`font-bold text-xl font-andale-mono transition-colors duration-200 ${
          showAnimations ? 'header-logo-animation' : ''
        } ${
          isHomePage 
            ? 'text-white/70 hover:text-white' 
            : 'text-theme-dark hover:text-black'
        }`}
      >
        Florine Clap
      </a>
      <div className={showAnimations ? 'header-nav-animation' : ''}>
        <Navigation isHomePage={isHomePage} />
      </div>
    </header>
  )
}
