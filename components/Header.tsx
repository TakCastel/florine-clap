'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from './Header/Navigation'
import { useAnimation } from '@/contexts/AnimationContext'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { showAnimations } = useAnimation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'clapping' | 'reverse'>('idle')

  useEffect(() => {
    const handleScroll = () => {
      // Le header se rétrécit après 50px de scroll
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out ${
      isScrolled 
        ? 'top-6 w-[92%] max-w-7xl' 
        : 'top-0 w-full'
    }`}>
      <div className={`flex justify-between items-center transition-all duration-700 ${
        isScrolled ? 'px-8 py-3' : 'px-8 py-4'
      } ${
        isHomePage 
          ? isScrolled 
            ? 'backdrop-blur-xl bg-black/70' 
            : '' 
          : 'backdrop-blur-xl bg-white/85 border-b border-gray-200'
      } ${
        isScrolled 
          ? 'rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          : isHomePage 
            ? '' 
            : ''
      }`}>
        {/* Logo à gauche - avec image et texte en V comme un faisceau lumineux */}
        <a 
          href="/" 
          className={`flex items-center gap-3 font-bold font-display leading-tight transition-all duration-500 tracking-tight group ${
            isScrolled ? 'text-sm' : 'text-lg'
          } ${
            showAnimations ? 'header-logo-animation' : ''
          } ${
            isHomePage 
              ? 'text-white/80 hover:text-white' 
              : 'text-theme-dark hover:text-black'
          } ${
            isHomePage && !isScrolled ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : ''
          }`}
          onMouseEnter={() => {
            setIsHovered(true)
            setAnimationState('clapping')
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setAnimationState('reverse')
          }}
        >
          <div className={`relative transition-all duration-500 ${
            isScrolled ? 'w-10 h-10' : 'w-12 h-12'
          }`}>
            <Image
              src={isHomePage ? "/images/logos/logo-white.png" : "/images/logos/logo-black.png"}
              alt="Logo Florine Clap"
              fill
              className="object-contain transition-transform duration-300 scale-110 group-hover:scale-125"
            />
          </div>
          <div className="relative flex flex-col items-start">
            <span 
              className={`block origin-left ${
                isScrolled ? '' : 'tracking-wide'
              } ${
                animationState === 'clapping' ? 'clap-animation-top' : 
                animationState === 'reverse' ? 'clap-animation-top-reverse' : ''
              }`} 
              style={animationState === 'idle' ? { 
                transform: isHovered ? 'rotate(-1.5deg) translateY(-0.5px)' : 'rotate(-3deg) translateY(-1px)' 
              } : undefined}
              onAnimationEnd={() => {
                if (animationState === 'clapping' || animationState === 'reverse') {
                  setAnimationState('idle')
                }
              }}
            >
              Florine
            </span>
            <span 
              className={`block origin-left ${
                isScrolled ? '' : 'tracking-wide'
              } ${
                animationState === 'clapping' ? 'clap-animation-bottom' : 
                animationState === 'reverse' ? 'clap-animation-bottom-reverse' : ''
              }`}
              style={animationState === 'idle' ? { 
                transform: isHovered ? 'rotate(1.5deg) translateY(0.5px)' : 'rotate(3deg) translateY(1px)' 
              } : undefined}
            >
              Clap
            </span>
          </div>
        </a>

        {/* Navigation à droite */}
        <div className={showAnimations ? 'header-nav-animation' : ''}>
          <Navigation isHomePage={isHomePage} isScrolled={isScrolled} />
        </div>

      </div>
    </header>
  )
}
