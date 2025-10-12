'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Header/Navigation'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 ${
      isHomePage ? 'bg-theme-dark' : 'bg-white'
    }`}>
      <a 
        href="/" 
        className={`font-bold text-xl transition-colors duration-200 header-logo-animation ${
          isHomePage 
            ? 'text-white hover:text-theme-yellow' 
            : 'text-theme-dark hover:text-black'
        }`}
      >
        Florine Clap
      </a>
      <div className="header-nav-animation">
        <Navigation isHomePage={isHomePage} />
      </div>
    </header>
  )
}