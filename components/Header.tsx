'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { showAnimations } = useAnimation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Le header se rétrécit après 50px de scroll
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'top-4 w-auto max-w-4xl' 
        : 'top-0 w-full'
    }`}>
      <div className={`flex items-center justify-between transition-all duration-500 ${
        isScrolled ? 'px-6 py-3' : 'px-6 py-0 h-20'
      } ${
        isHomePage ? 'bg-black' : 'bg-white'
      } ${
        isScrolled 
          ? isHomePage 
            ? 'rounded-full border border-white/10 shadow-2xl' 
            : 'rounded-full border border-gray-300/20 shadow-2xl'
          : isHomePage 
            ? '' 
            : 'border-b border-gray-200'
      }`}>
        <a 
          href="/" 
          className={`font-bold font-display transition-all duration-300 ${
            isScrolled ? 'text-base' : 'text-xl'
          } ${
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
          <Navigation isHomePage={isHomePage} isScrolled={isScrolled} />
        </div>
      </div>
    </header>
  )
}
