'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[88px]">
      <div className="flex items-center justify-between px-6 py-6 h-full">
        {/* Logo Florine Clap avec fond blanc */}
        <Link href="/" className="bg-white text-black px-4 py-2 text-lg font-oswald font-medium tracking-wide uppercase hover:text-gray-700 transition-colors duration-300">
          Florine Clap
        </Link>
        
        {/* Menu hamburger avec fond blanc */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white text-black px-4 py-2 z-50 relative hover:text-gray-700 transition-all duration-300"
          aria-label="Menu"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="relative w-6 h-6">
              <span className={`absolute top-1/2 left-0 w-full h-px bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1'}`}></span>
              <span className={`absolute top-1/2 left-0 w-full h-px bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute top-1/2 left-0 w-full h-px bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1'}`}></span>
            </div>
          </div>
        </button>
      </div>

      {/* Menu overlay avec fond noir seulement quand ouvert */}
      <div className={`fixed inset-0 z-40 transition-all duration-700 ease-out ${
        isMenuOpen 
          ? 'opacity-100 visible bg-black' 
          : 'opacity-0 invisible'
      }`}>
        <div className="flex items-center justify-center h-full">
          <nav className="text-center space-y-8">
            <div className={`transition-all duration-500 ease-out transform ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: isMenuOpen ? '200ms' : '0ms' }}>
              <Link 
                href="/films" 
                className="inline-block text-2xl font-light text-white transition-colors duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Films
              </Link>
            </div>
            <div className={`transition-all duration-500 ease-out transform ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: isMenuOpen ? '300ms' : '0ms' }}>
              <Link 
                href="/ateliers" 
                className="inline-block text-2xl font-light text-white transition-colors duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Médiations
              </Link>
            </div>
            <div className={`transition-all duration-500 ease-out transform ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: isMenuOpen ? '400ms' : '0ms' }}>
              <Link 
                href="/actus" 
                className="inline-block text-2xl font-light text-white transition-colors duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Actualités
              </Link>
            </div>
            <div className={`transition-all duration-500 ease-out transform ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: isMenuOpen ? '500ms' : '0ms' }}>
              <Link 
                href="/bio" 
                className="inline-block text-2xl font-light text-white transition-colors duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Bio
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}


