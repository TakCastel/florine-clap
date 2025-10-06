'use client'

import Link from 'next/link'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'
import MobileMenu from './MobileMenu'

const MENU_ITEMS = [
  { href: '/films', label: 'Films' },
  { href: '/ateliers', label: 'Médiations' },
  { href: '/actus', label: 'Actualités' },
  { href: '/bio', label: 'Bio' }
]

// Composant pour la navbar desktop
const DesktopNavbar = ({ isVisible }: { isVisible: boolean }) => {
  const MenuLink = ({ href, label, className = '' }: { href: string; label: string; className?: string }) => (
    <Link 
      href={href} 
      className={`text-orange-100 hover:text-orange-200 transition-colors duration-300 text-sm font-medium tracking-wider ${className}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="hidden md:flex items-center">
      {MENU_ITEMS.map((item, index) => (
        <div 
          key={item.href} 
          className={`flex items-center transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ transitionDelay: isVisible ? `${300 + index * 100}ms` : '0ms' }}
        >
          <MenuLink href={item.href} label={item.label} />
          {index < MENU_ITEMS.length - 1 && (
            <span className={`text-orange-100 text-sm mx-6 font-light transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`} style={{ transitionDelay: isVisible ? `${350 + index * 100}ms` : '0ms' }}>
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Composant burger mobile
const MobileBurger = () => (
  <div>
    <MobileMenu />
  </div>
)


export default function Header() {
  const { ref, isVisible } = useAnimationOnScroll({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      {/* Header mobile - toujours fixed */}
      <header 
        className="h-[88px] bg-black md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 h-full">
          {/* Logo */}
          <Link 
            href="/" 
            className="logo-montserrat bg-black text-orange-100 px-3 py-2 text-lg font-montserrat font-normal tracking-wide hover:text-orange-200 rounded-none"
          >
            Florine Clap
          </Link>
          
          {/* Container noir avec contenu adaptatif */}
          <div className="bg-black py-3 h-[44px] flex items-center px-4">
            {/* Burger mobile - toujours visible */}
            <MobileBurger />
          </div>
        </div>
      </header>

      {/* Header desktop - avec animations */}
      <header ref={ref} className="hidden md:block md:relative bg-transparent">
        <div className="flex items-center justify-between px-6 py-6 h-[88px]">
          {/* Logo */}
          <Link 
            href="/" 
            className={`logo-montserrat bg-black text-orange-100 px-4 py-2 text-lg font-montserrat font-normal tracking-wide hover:text-orange-200 transition-all duration-700 ease-out rounded-none relative z-50 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
          >
            Florine Clap
          </Link>
          
          {/* Container noir avec contenu adaptatif */}
          <div className={`bg-black py-3 h-[44px] flex items-center px-6 transition-all duration-1000 ease-out relative z-50 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            {/* Navbar desktop avec animation */}
            <DesktopNavbar isVisible={isVisible} />
          </div>
        </div>
      </header>
    </>
  )
}