'use client'

import { useState } from 'react'

interface MobileMenuProps {
  isHomePage?: boolean
}

export default function MobileMenu({ isHomePage = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/films', label: 'FILMS' },
    { href: '/mediations', label: 'MÉDIATIONS' },
    { href: '/actus', label: 'ACTUALITÉS' },
    { href: '/bio', label: 'BIO' }
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${
          isHomePage ? 'text-theme-beige' : 'text-theme-dark'
        }`}
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-theme-light border-b border-theme-navy/20 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <a 
                  href={item.href} 
                  className="text-theme-dark hover:text-theme-orange transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
                {index < navItems.length - 1 && (
                  <span className="mx-2 text-theme-navy/60">/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}