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
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
      isScrolled ? 'h-14' : 'h-20'
    } ${
      isHomePage ? 'bg-black' : 'bg-white border-b border-gray-200'
    } ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <a 
        href="/" 
        className={`font-bold font-display transition-all duration-300 ${
          isScrolled ? 'text-lg' : 'text-xl'
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
    </header>
  )
}
