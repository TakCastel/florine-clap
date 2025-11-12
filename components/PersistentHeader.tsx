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
      isHomePage ? 'bg-black' : 'bg-theme-cream border-b border-gray-200'
    } ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <a 
        href="/" 
        className={`font-display font-normal uppercase cursor-pointer relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:transition-all after:duration-500 after:ease-out hover:after:w-full tracking-wide ${
          isScrolled ? 'text-sm' : 'text-base'
        } ${
          isHomePage 
            ? 'text-white/75 after:bg-white' 
            : 'text-theme-dark/80 after:bg-theme-dark'
        }`}
      >
        FLORINE CLAP
      </a>
      <div className={showAnimations ? 'header-nav-animation' : ''}>
        <Navigation isHomePage={isHomePage} />
      </div>
    </header>
  )
}
